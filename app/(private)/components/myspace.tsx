'use client'
import React, { useState, useEffect, useRef } from 'react'
import Spaceiq from './spaceiq'
import Documentpopup from './documentpopup'
import Spaceiqcolor from './spaceiqcolor'
import Upgradetopro from './upgradetopro'
import Scanqrpage from './scanqr'
import Spacenav from './spacenav'
import { RunAgent, spaceChats, spaceIqCheck, spaceLiveChats, PayApi, InstanceActivationStatus, sendWhatsapp, getUserStatus, GetSpaceId, markChatRead, getProfilePic } from "@/app/Apis/publicapi";
import { useParams, useSearchParams } from 'next/navigation';
import { useIq } from '../Iqcontext'
import LiveAgent2 from './liveagent2'
import Link from 'next/link'
import { MessageCircle, Search, MoreVertical, Send, Paperclip, Smile, CheckCheck } from 'lucide-react';


const getInitials = (name: string = '') =>
  name
    .split(/\s+/)
    .map(w => w.replace(/[^\p{L}\p{N}]/gu, '')) // drop emojis/symbols so avatars show letters, not boxes
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

// WhatsApp-style last-message preview: show a media label/icon for non-text messages.
const mediaLabel = (type: string = 'chat', body: string = ''): string => {
  const b = (body || '').trim();
  switch (type) {
    case 'image':    return b ? `📷 ${b}` : '📷 Photo';
    case 'video':    return b ? `🎥 ${b}` : '🎥 Video';
    case 'document': return `📄 ${b || 'Document'}`;
    case 'audio':
    case 'ptt':      return '🎤 Voice message';
    case 'sticker':  return 'Sticker';
    case 'location': return '📍 Location';
    case 'revoked':  return '🚫 This message was deleted';
    case 'chat':     return b;
    default:         return b; // group notifications / unknown -> show body if present
  }
};

const WhatsAppChat = ({ spaceLiveChatsData, spaceId }: { spaceLiveChatsData: any, spaceId: any }) => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [readChats, setReadChats] = useState<Record<string, boolean>>({});
  const [dps, setDps] = useState<Record<string, string>>({});   // number -> profile-pic URL
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const [userOnlineStatus, setUserOnlineStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (spaceId) {
        try {
          const res = await getUserStatus(spaceId);
          // console.log("User Status API response:", res);
          setUserOnlineStatus(res.online); // Corrected property
        } catch (err) {
          // console.error("Failed to fetch user status", err);
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [spaceId]);

  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // When fresh chat data arrives, drop the optimistic "read" flags so the unread badge
  // reflects Chatterly's real count again — i.e. a NEW message re-shows the green count,
  // while a chat we marked read stays at 0.
  useEffect(() => {
    setReadChats({});
  }, [spaceLiveChatsData])


  // Log the actual API data to see its structure
  useEffect(() => {
    // console.log("🔍 spaceLiveChatsData received:", spaceLiveChatsData);
    // console.log("🔍 Type:", typeof spaceLiveChatsData);
    // console.log("🔍 Is Array:", Array.isArray(spaceLiveChatsData));
    if (spaceLiveChatsData) {
      // console.log("🔍 Length:", spaceLiveChatsData.length);
      // console.log("🔍 First item:", spaceLiveChatsData[0]);
    }
  }, [spaceLiveChatsData]);

  // Use actual API data with mapping
  const chats = (spaceLiveChatsData || []).map((chat: any) => ({
    // stable key: prefer the raw chat_id (whatsapp_number can be empty for groups/unknown)
    id: chat.chat_id || chat.whatsapp_number || Math.random().toString(),
    name: chat.customer_name || chat.whatsapp_number || 'Unknown',
    message: mediaLabel(chat.last_type, chat.user_message),
    // WhatsApp-style time of the last message. Prefer the raw UNIX timestamp (UTC) so the
    // browser shows the correct LOCAL time; fall back to created_at parsed as UTC (append 'Z')
    // — never let JS parse the tz-less string as local time, which shifts the hour.
    time: chat.timestamp
      ? new Date((Number(chat.timestamp) > 10000000000 ? Number(chat.timestamp) : Number(chat.timestamp) * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : (chat.created_at
          ? new Date(String(chat.created_at).replace(' ', 'T') + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : ''),
    online: false,
    category: 'WhatsApp',
    phone: chat.whatsapp_number,   // real phone only (or '')
    ...chat, // keep original fields (chat_id, is_group, unread, etc.)
    // clear the unread badge once the chat has been opened
    unread: readChats[chat.chat_id || chat.whatsapp_number] ? 0 : (chat.unread || 0),
    // WhatsApp profile picture (loaded lazily; falls back to initials when absent)
    profilePic: dps[chat.whatsapp_number] || undefined,
  }));

  // Lazily fetch profile pictures for the chats, throttled (one at a time) so the
  // single-threaded backend isn't flooded; results are cached. Contacts with no DP
  // (privacy) just keep their initials.
  useEffect(() => {
    if (!spaceId) return;
    let cancelled = false;
    (async () => {
      const numbers = Array.from(new Set(
        (spaceLiveChatsData || [])
          .map((c: any) => c.whatsapp_number)
          .filter((n: any) => n && !(n in dps))
      )).slice(0, 60); // cap so we don't hammer the backend
      for (const num of numbers) {
        if (cancelled) break;
        const url = await getProfilePic(num as string, spaceId);
        if (cancelled) break;
        setDps(prev => ({ ...prev, [num as string]: url || '' }));
        await new Promise(r => setTimeout(r, 400)); // throttle between contacts
      }
    })();
    return () => { cancelled = true; };
  }, [spaceLiveChatsData, spaceId]);

  // Open a chat: clear its unread badge immediately and mark it read on WhatsApp.
  const openChat = (chat: any) => {
    setSelectedChat(chat);
    const cid = chat.chat_id || chat.whatsapp_number || chat.id;
    if (cid) {
      setReadChats((prev) => ({ ...prev, [cid]: true }));
      markChatRead(chat.chat_id || chat.phone || chat.whatsapp_number, spaceId);
    }
  };




  // Reliable mode: Chatterly's per-message threading is unreliable — it merges different
  // contacts under one WhatsApp privacy LID, so reconstructing a full in-chat history mixes
  // other people's messages into the wrong chat. Instead, seed the panel with THIS chat's
  // latest message (from the live chat list, which IS reliable) and append anything sent in
  // this session. No call to getMessage, so no contamination.
  useEffect(() => {
    if (!selectedChat) { setMessages([]); return; }
    const lastBody = selectedChat.user_message || selectedChat.message || '';
    setMessages(
      lastBody
        ? [{ from_me: !!selectedChat.last_from_me, body: lastBody, timestamp: selectedChat.timestamp || null }]
        : []
    );
  }, [selectedChat, spaceId]);

  const handleSendMessage = async () => {
    const text = messageInput.trim();
    if (!text || !selectedChat) return;

    // Deliver to the real phone when we know it; fall back to the chat id (groups / LID chats
    // that have no resolved number) so you can reply from any open chat, like WhatsApp.
    const sendTarget = (selectedChat.phone || String(selectedChat.chat_id || '').split('@')[0] || '').toString();
    // Thread key = how this chat's messages are stored/fetched (the chat id's digits).
    const chatKey = String(selectedChat.chat_id || selectedChat.phone || '').split('@')[0];
    if (!sendTarget) return;

    // Show it immediately on the right (green bubble) and clear the input — like WhatsApp.
    const optimistic = { from_me: true, body: text, timestamp: Date.now() / 1000 };
    setMessages(prev => [...prev, optimistic]);
    setMessageInput('');

    try {
      await sendWhatsapp({ message: text, phone: sendTarget, chat_id: chatKey }, spaceId);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const formatTime = (timestamp: number) => {
    if (!timestamp) return '';
    // Handle both seconds (Unix timestamp) and milliseconds
    const date = new Date(timestamp > 10000000000 ? timestamp : timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats based on search query
  const filteredChats = chats.filter((chat: any) =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.phone?.includes(searchQuery) ||
    chat.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-[600px] bg-white rounded-lg border border-gray-300 border-b-2 mb-8 overflow-hidden flex">
      {/* Left Sidebar - Chat List */}
      <div className="w-[400px] border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="h-[60px] bg-[#F0F2F5] px-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-[#54656F]" />
            <span className="font-semibold text-[#111B21]">Live Chats</span>
          </div>
          <MoreVertical className="w-5 h-5 text-[#54656F] cursor-pointer" />
        </div>

        {/* Search Bar */}
        <div className="p-2 bg-[#F0F2F5]">
          <div className="bg-white rounded-lg px-3 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#54656F]" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="flex-1 outline-none  text-sm text-[#111B21]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto bg-[#F0F2F5]">
          {filteredChats.length === 0 && (
            <div className="flex items-center justify-center h-full text-sm text-[#667781] px-4 text-center animate-pulse">
              {searchQuery ? 'No chats found' : 'Loading chats… (WhatsApp is syncing your conversations)'}
            </div>
          )}
          {filteredChats.map((chat: any) => (
            <div
              key={chat.id}
              onClick={() => openChat(chat)}
              className={`mx-2 my-1 px-3 py-2.5 flex items-center gap-3 cursor-pointer rounded-xl transition-colors ${selectedChat?.id === chat.id ? 'bg-[#E7F3EB]' : 'bg-white hover:bg-[#F5F6F6]'}`}
            >
              <div className="relative flex-shrink-0">
                {/* <div className="w-12 h-12 rounded-full bg-[#DFE5E7] flex items-center justify-center">
                  <span className="text-[#54656F] font-semibold text-lg">
                    {chat.name?.charAt(0).toUpperCase()}
                  </span>
                </div> */}
                {chat.profilePic ? (
                  <img
                    src={chat.profilePic}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#DFE5E7] flex items-center justify-center">
                    <span className="text-[#54656F] font-semibold text-sm">
                      {getInitials(chat.name)}
                    </span>
                  </div>
                )}
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-[#111B21] text-[15px] truncate">
                    {chat.name}{chat.is_self ? ' (You)' : ''}
                  </h3>
                  <span className={`text-xs ml-2 flex-shrink-0 ${chat.unread > 0 ? 'text-[#25D366] font-medium' : 'text-[#667781]'}`}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className="text-sm text-[#667781] truncate flex items-center gap-1 min-w-0">
                    {chat.last_from_me && (
                      <CheckCheck className="w-4 h-4 text-[#8696A0] flex-shrink-0" />
                    )}
                    <span className="truncate">{chat.message}</span>
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-[#25D366] text-white text-[11px] font-medium rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center flex-shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-col gap-1">
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Conversation Panel */}
      <div className="flex-1 flex flex-col bg-[#EFEAE2]">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-[60px] bg-[#F0F2F5] px-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* <div className="w-10 h-10 rounded-full bg-[#DFE5E7] flex items-center justify-center">
                    <span className="text-[#54656F] font-semibold">
                      {selectedChat.name?.charAt(0).toUpperCase()}
                    </span>
                  </div> */}
                  {selectedChat.profilePic ? (
                    <img
                      src={selectedChat.profilePic}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#DFE5E7] flex items-center justify-center">
                      <span className="text-[#54656F] font-semibold text-sm">
                        {getInitials(selectedChat.name)}
                      </span>
                    </div>
                  )}
                  {selectedChat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[#111B21] text-sm">
                    {selectedChat.name}{selectedChat.is_self ? ' (You)' : ''}
                  </h3>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-[#667781]">
                      {selectedChat.phone || selectedChat.name}
                    </p>
                    <span className="text-[10px] text-gray-300">•</span>
                    <p className="text-xs">
                      {userOnlineStatus === true ? (
                        <span className="text-[#25D366] font-medium">Online</span>
                      ) : (
                        <span className="text-gray-400">Offline</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Search className="w-5 h-5 text-[#54656F] cursor-pointer" />
                <MoreVertical className="w-5 h-5 text-[#54656F] cursor-pointer" />
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-[#EFEAE2]"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'260\' height=\'260\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 0h260v260H0z\'/%3E%3Cpath d=\'M130 0C58.203 0 0 58.203 0 130s58.203 130 130 130 130-58.203 130-130S201.797 0 130 0zm0 252C62.888 252 8 197.112 8 130S62.888 8 130 8s122 54.888 122 122-54.888 122-122 122z\' fill=\'%23000\' fill-opacity=\'.02\'/%3E%3C/g%3E%3C/svg%3E")',
                backgroundRepeat: 'repeat'
              }}
            >
              <div className="space-y-3">
                {messages && messages.length > 0 ? (
                  // oldest at top, latest at bottom (WhatsApp style); auto-scrolls to bottom
                  messages.map((msg: any, index: number) => (
                    <div key={msg.id || index} className={`flex ${msg.from_me ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`rounded-lg px-3 py-2 max-w-[65%] shadow-sm overflow-hidden ${msg.from_me ? 'bg-[#D9FDD3]' : 'bg-white'
                          }`}
                      >
                        <p className="text-sm text-[#111B21] whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{msg.text?.body || msg.body}</p>
                        <span className={`text-[10px] text-[#667781] float-right ml-2 mt-1`}>
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>

                  ))
                ) : selectedChat.message ? (
                  <div className={`flex ${selectedChat.last_from_me ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg px-3 py-2 max-w-[65%] shadow-sm overflow-hidden ${selectedChat.last_from_me ? 'bg-[#D9FDD3]' : 'bg-white'}`}>
                      <p className="text-sm text-[#111B21] whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{selectedChat.message}</p>
                      <span className="text-[10px] text-[#667781] float-right ml-2 mt-1">
                        {selectedChat.time}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-[#667781]">
                    No messages yet
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="bg-[#F0F2F5] px-4 py-2 flex items-center gap-2">
              <button className="p-2 hover:bg-[#E0E0E0] rounded-full transition-colors">
                <Smile className="w-6 h-6 text-[#54656F]" />
              </button>
              <button className="p-2 hover:bg-[#E0E0E0] rounded-full transition-colors">
                <Paperclip className="w-6 h-6 text-[#54656F]" />
              </button>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message"
                className="flex-1 bg-white rounded-lg px-4 py-2 outline-none text-sm text-[#111B21]"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 hover:bg-[#E0E0E0] rounded-full transition-colors"
              >
                <Send className="w-6 h-6 text-[#54656F]" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#F0F2F5] rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-[#54656F]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#111B21] mb-2">
              Conversation panel
            </h2>
            <p className="text-[#667781] text-center max-w-md">
              Select a conversation from the live chats to view full conversation details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Myspace = () => {
  const [spaceiqopen, setSpaceiqopen] = useState(false)
  const [docopen, setDocopen] = useState(false)
  const [spaceipcoloropen, setSpaceiqcoloropen] = useState(false)
  const [proopen, setProopen] = useState(false)
  const [scanopen, setScanopen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { iqIncreased, setIqIncreased } = useIq();
  const [spaceChatsData, setSpaceChatsData] = useState<any>()
  const [spaceLiveChatsData, setSpaceLiveChatsData] = useState<any>();
  const [paymentStatus, setPaymentStatus] = useState('');
  const [activationStatus, setActivationStatus] = useState<any>(null);
  const [underReviewPopupOpen, setUnderReviewPopupOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showLiveAgent, setShowLiveAgent] = useState(false);
  const [instanceData, setInstanceData] = useState<any>()
  const searchParams: any = useSearchParams();
  // Support both 'id' and 'space_id' from URL
  const paramId = searchParams.get('id');
  const paramSpaceId = searchParams.get('space_id');
  // Prefer the id from the URL; fall back to resolving the user's space (see effect below)
  const urlId = paramId || paramSpaceId;
  const [id, setId] = useState<any>(urlId);

  const uuid = searchParams.get('uuid');

  console.log("Myspace - Raw URL params:", Object.fromEntries(searchParams.entries()));
  console.log("Myspace - Derived ID:", id, "(from id:", paramId, "space_id:", paramSpaceId, ")");
  console.log("Myspace - UUID:", uuid);

  const handleCheck = async () => {
    setLoading(true)
    try {
      const res = await spaceIqCheck({})
      console.log("spaceIqData:", res)
      if (res?.data?.iq_increased === 1) {
        if (iqIncreased !== 1) {
          setIqIncreased(1);
          console.log("iqIncreased set to 1");
        }
      } else {
        if (iqIncreased !== 0) {
          setIqIncreased(0);
          console.log(" iqIncreased set to 0");
        }
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  };
  const spaceName = searchParams.get('name') || 'Space';
  const imageUrl = searchParams.get('image')

  // If the URL has no space id (e.g. page opened without ?id=), resolve it from the
  // user's spaces so Run Agent / QR / Live Chats still work instead of failing with
  // "The space id field is required."
  useEffect(() => {
    if (urlId) { setId(urlId); return; }
    (async () => {
      try {
        const res: any = await GetSpaceId();
        const spaces = res?.data?.spaces || res?.spaces || [];
        const match = spaces.find((s: any) => s?.name === spaceName) || spaces[0];
        if (match?.id) setId(match.id);
      } catch (e) {
        console.error('Failed to resolve space id', e);
      }
    })();
  }, [urlId]);

  const isInvalidImage = !imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageError;
  useEffect(() => {
    const fetchSpaceChats = async () => {
      try {
        const res = await spaceChats(Number(id));
        setSpaceChatsData(res);
      } catch (err) {
        console.log(err);
      }
    };
    if (id) fetchSpaceChats();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    let timer: any;

    const fetchLiveChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { if (!cancelled) setSpaceLiveChatsData([]); return; }
        const res = await spaceLiveChats(Number(id));
        // keep the previous list on an empty/failed transient response (avoids flashing
        // mystery/empty chats when Chatterly's chats endpoint briefly hiccups)
        if (!cancelled && Array.isArray(res) && res.length > 0) setSpaceLiveChatsData(res);
      } catch (err) {
        console.error("Error fetching live chats:", err);
      } finally {
        // Self-scheduling refresh (only while connected) so a slow chat-list call can't pile
        // up behind itself and starve the activation poll on the single-threaded backend.
        if (!cancelled && Number(activationStatus) === 1) timer = setTimeout(fetchLiveChats, 5000);
      }
    };
    fetchLiveChats();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [id, activationStatus]);




  useEffect(() => {
    if (spaceChatsData) {
      console.log("Space Chats Data:", spaceChatsData);
    }
  }, [spaceChatsData]);

  const handleRunAgent = async () => {
  try {

    // Make sure we have a space id even if the URL didn't carry one
    let activeId = id;
    if (!activeId) {
      const res: any = await GetSpaceId();
      const spaces = res?.data?.spaces || res?.spaces || [];
      const match = spaces.find((s: any) => s?.name === spaceName) || spaces[0];
      activeId = match?.id;
      if (activeId) setId(activeId);
    }
    if (!activeId) {
      console.error('No space id available to run the agent');
      return;
    }

    // The 2s activation poll keeps activationStatus fresh — if already linked, go to chats.
    if (Number(activationStatus) === 1) {
      setShowLiveAgent(true);
      return;
    }

    // Open the QR modal immediately (it shows a spinner) so the user isn't staring at a
    // frozen button while the Chatterly instance is created in the background.
    setScanopen(true);

    const response = await RunAgent(activeId);
    if (!response) {
      setScanopen(false);
      console.error('Run Agent: instance creation failed (no response)');
    }

  } catch (err) {
    console.error('Failed to run agent', err);
  }
};

  useEffect(() => {
    try {
      if (instanceData) {
        console.log("Instance Data:", instanceData);
      }

    } catch (err) {
      console.log(err)
    }
  }, [instanceData])

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    let timer: any;

    const tick = async () => {
      try {
        const res = await InstanceActivationStatus(id);
        const val = res?.data?.instance_activation_status;
        // Ignore transient/failed responses (undefined/null) so we never flip the UI on an error.
        if (!cancelled && val !== undefined && val !== null) {
          setActivationStatus(val);
          if (Number(val) === 1) {
            setShowLiveAgent(true);
            setScanopen(false);
          } else {
            // logged out / not linked -> hide live chats so QR / Run Agent shows again
            setShowLiveAgent(false);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        // Self-scheduling: only fire the next poll AFTER the previous one finishes, so polls
        // can never pile up and saturate the single-threaded backend (the pile-up was what
        // kept the QR open until a manual refresh). The backend flips the flag instantly via
        // the session.connected webhook, so this still reacts within ~1s of login.
        if (!cancelled) timer = setTimeout(tick, 1000);
      }
    };
    tick();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [id])



  return (
    <div className='select-none' >
      <Spacenav />
      <div className="h-auto w-full bg-[#FFFFFF] relative mt-[15px] flex flex-col gap-5  items-center">
        <div className="w-[100%]  items-center mt-[-17px]   flex flex-row h-[64px] " style={{ borderBottom: "1px solid #EAECF0" }}>
          <div className='hover: bg-grey'>
            <Link href={'/dashboard/overview'} >
              <img
                src="/arrow.png"
                alt="arrow"
                className="h-[20px] ml-[10px] m-[-1px] w-[20px]"
              />
            </Link>
          </div>
          <div className="w-[48px] ml-[10px] h-[48px] rounded-full overflow-hidden flex-shrink-0">
            {!isInvalidImage ? (
              <img
                src={imageUrl!}
                alt=""
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-[#EAECF0] flex items-center justify-center">
                <span className="text-[#685BC7] font-semibold text-sm">
                  {getInitials(spaceName)}
                </span>
              </div>
            )}
          </div>
          <div className="w-[50%] sm:w-[70%] text-[13px] sm:text-[1.125rem] text-[#101828] ml-[18px] font-sans font-semibold text-lg leading-7 tracking-normal align-middle h-[28px]">
            {spaceName}
          </div>
          <div className="w-[180px] sm:w-[211px] right-[0px] flex flex-row  gap-[8px] h-[36px]">
            <button className="w-[50%] sm:w-[103px] h-[50px] sm:h-[36px]  flex flex-row border-[white] pt-2 pr-4 pb-2 bg-[#EAECF0] pl-4 gap-[10px] rounded-[8px] ">
              <div onClick={() => {
                setSpaceiqopen(true)
                handleCheck()
              }
              } className="font-sans font-semibold text-[10px]  sm:text-[12px] w-[100%] leading-5 tracking-normal text-center  text-[#685BC7] h-[20px] hover:cursor-pointer">
                Spaces IQ
              </div>
            </button>
            <button
              onClick={handleRunAgent}
              disabled={Number(activationStatus) === 1}
              className={`w-[50%] sm:w-[103px] h-[50px] sm:h-[36px] flex flex-row pt-2 pr-4 pb-2 pl-4 gap-[10px] rounded-[8px] ${Number(activationStatus) === 1 ? 'bg-[#B0A9E0] opacity-60 cursor-not-allowed' : 'bg-[#685BC7]'}`}
            >
              <div className={`w-[100%] font-sans  text-[10px] sm:text-[12px] font-semibold text-sm leading-5 tracking-normal text-center text-[#FFFFFF] h-[50px] sm:h-[20px] ${Number(activationStatus) === 1 ? 'cursor-not-allowed' : 'hover:cursor-pointer'}`}>
                {Number(activationStatus) === 1 ? 'Active' : 'Run Agent'}
              </div>
            </button>

          </div>
        </div>


        <div className=" flex flex-row flex-wrap gap-[20px] justify-center w-[100%]   rounded-lg">

          <div className="w-[220px] rounded-[16px] border border-gray-300 h-[160px]">
            <div className="w-[100%] border-b border-gray-300 p-[12px] gap-[8px] flex text-[#EAECF0] h-[44px]">
              <img src="/chat.png" />
              <div className="w-[212px] h-[20px] font-sans font-medium text-xs leading-5 tracking-normal text-[#475467] ">
                Total Chats
              </div>
            </div>
            <div className=" text-center text-[#101828] flex items-center justify-center w-[100%] h-[70%]  font-sans font-semibold text-4xl leading-[100%] tracking-[-0.025em]">
              {spaceChatsData?.total_chats}
            </div>
          </div>


          <div className="w-[220px] rounded-[16px] border border-gray-300 h-[160px]">
            <div className="w-[100%] border-b border-gray-300 p-[12px] gap-[8px] flex text-[#EAECF0] h-[44px]">
              <img src="/message.png" />
              <div className="w-[212px] h-[20px] font-sans font-medium text-xs leading-5 tracking-normal text-[#475467] ">
                {" "}
                Live Chats
              </div>
            </div>
            <div className=" text-center text-[#101828] flex items-center justify-center w-[100%] h-[70%]  font-sans font-semibold text-4xl leading-[100%] tracking-[-0.025em]">
              {spaceChatsData?.total_live_chats}
            </div>
          </div>


          <div className="w-[220px] rounded-[16px] border border-gray-300 h-[160px]">
            <div className="w-[100%] border-b border-gray-300 p-[12px] gap-[8px] flex text-[#EAECF0] h-[44px]">
              <img src="/timer.png" />
              <div className="w-[212px] h-[20px] font-sans font-medium text-xs leading-5 tracking-normal text-[#475467] ">
                {" "}
                Avg. Response Time
              </div>
            </div>
            <div className=" text-center text-[#101828] flex items-center justify-center w-[100%] h-[70%]  font-sans font-semibold text-4xl leading-[100%] tracking-[-0.025em]">
              0
            </div>
          </div>


          <div className="w-[220px] rounded-[16px] border border-gray-300 h-[160px]">
            <div className="w-[100%] border-b border-gray-300 p-[12px] gap-[8px] flex text-[#EAECF0] h-[44px]">
              <img src="/party-popper.png" />
              <div className="w-[100%] h-[20px] font-sans font-medium text-xs leading-5 tracking-normal text-[#475467] ">
                {" "}
                Sales
              </div>
            </div>
            <div className=" text-center text-[#101828] flex items-center justify-center w-[100%] h-[70%]  font-sans font-semibold text-4xl leading-[100%] tracking-[-0.025em]">
              {spaceChatsData?.total_sales}
            </div>
          </div>
        </div>

        <section className="flex justify-center w-[95%] mt-4">
          {showLiveAgent ? (
            <WhatsAppChat spaceLiveChatsData={spaceLiveChatsData} spaceId={id} />
          ) : (
            <div className="w-[89%] h-[486px] bottom-0 rounded-lg border border-[#EAECF0]">
              <div
                className="w-[100%] flex flex-row items-center justify-center gap-[10px] rounded-t-[10px] h-[60px]"
                style={{ borderBottom: '1px solid #EAECF0' }}
              >
                <div className="h-[32px] bg-[#F2F4F7] ml-[5px] border border-[#F2F4F7] p-[8px] flex gap-[10px] rounded-[8px] w-[32px]">
                  <img
                    src="/message-circle.png"
                    alt="circle-sms"
                    className="bg-[#EAECF0] height-[16px] w-[16px] flex rounded-lg"
                  />
                </div>
                <p className="font-sans w-[100%] h-[24px] text-[#101828] font-semibold text-base leading-6 tracking-normal align-middle">
                  Live Chats
                </p>
                <div className="w-[79px] rounded-[8px] border pt-[2px] pr-[4px] pb-[2px] pl-[4px] border-gray-100 gap-[10px] h-[36px]"></div>
              </div>

              <div className="h-[307px] p-[24px] flex justify-center items-center gap-[24px]">
                <div className="w-[256px] h-[208px] flex items-center justify-center flex-wrap rounded-[8px] gap-[20px]">
                  <div className="h-[48px] w-[48px] flex gap-[10px] flex-row bg-[#F2F4F7] rounded-[12px] p-[12px]">
                    <img
                      src="/adda.png"
                      alt="circle-sms"
                      className="h-[24px] w-[24px]"
                    />
                  </div>

                  <div className="h-[84px] gap-[4px] flex flex-col w-[256px]">
                    <div className="w-[256px] h-[20px] text-[#101828] font-sans font-semibold text-sm leading-5 tracking-normal text-center">
                      No live chats yet
                    </div>
                    <div className="w-[256px] text-[#475467] font-sans font-normal text-sm leading-5 tracking-normal text-center align-bottom h-[60px]">
                      Connect your chat accounts, and customize them, to see live
                      chats and conversations
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowLiveAgent(true);
                    }}
                    className="w-[150px] flex flex-row rounded-[8px] pt-[8px] pr-[16px] border border-gray-200 pl-[16px] pb-[8px] gap-[10px] bg-[#F2F4F7] h-[36px]"
                  >
                    <div className="w-[116px] h-[20px] font-sans font-semibold text-sm leading-5 tracking-normal text-center text-[#101828] hover:cursor-pointer">
                      Connect account
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      {underReviewPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-all duration-300 ease-in-out px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 sm:p-10 text-center animate-slideUpFade">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
              Assistant activation in progress
            </h2>
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full mx-auto animate-spin mb-5"></div>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              We're currently reviewing and setting up your space to make sure everything works smoothly.
              This usually takes <span className="font-semibold text-gray-800">less than 24 hours</span>.<br />
              You’ll be notified automatically once it’s all done!
            </p>
            <div className="w-full h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{ width: '65%' }}></div>
            </div>

            <div className="text-sm text-gray-500 mb-8 text-left">

            </div>
            <button
              onClick={() => setUnderReviewPopupOpen(false)}
              className="bg-[#685BC7] text-white px-8 py-3 text-sm sm:text-base rounded-full shadow-md hover:bg-[#594ab0] hover:scale-105 transition-transform duration-300"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}



      {spaceiqopen ? <Spaceiq setSpaceiqopen={setSpaceiqopen} setSpaceiqcoloropen={setSpaceiqcoloropen} setDocopen={setDocopen} /> : ""}

      {spaceipcoloropen ? <Spaceiqcolor setSpaceiqcoloropen={setSpaceiqcoloropen} setDocopen={setDocopen} setSpaceiqopen={setSpaceiqopen} /> : ""}

      {docopen ? <Documentpopup setDocopen={setDocopen} /> : ""}

      {proopen ? <Upgradetopro setProopen={setProopen} instanceData={instanceData} /> : ""}

      {scanopen ? (
        <Scanqrpage
          setScanopen={setScanopen}
          space_id={id}
          onLinked={() => {
            // QR scanned & WhatsApp linked -> jump straight to chats
            setActivationStatus(1);
            setShowLiveAgent(true);
            setScanopen(false);
          }}
        />
      ) : ""}

    </div>

  )
}

export default Myspace
