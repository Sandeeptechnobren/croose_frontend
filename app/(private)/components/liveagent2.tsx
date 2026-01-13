'use client'
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Spacenav from './spacenav';
import { useParams, useSearchParams } from 'next/navigation';
import { spaceLiveChats } from '@/app/Apis/publicapi';

interface ChatUser {
  number: string;
  sms: string;
  button: string; 
  time: string;
  count?: string;
  img: string;
  customerName?: string | null;
  isTyping?: boolean;
}

const LiveAgent2 = () => {
  const [spaceLiveChatsData, setSpaceLiveChatsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { spaceId } = useParams();
  const searchParams: any = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const fetchSpaceLiveChats = async () => {
      try {
        setLoading(true);
        const res = await spaceLiveChats(Number(id));
        console.log("API Data:", res); 
        setSpaceLiveChatsData(res);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchSpaceLiveChats();
  }, [id]);

  const transformChatData = (data: any): ChatUser[] => {
    if (!data || typeof data !== 'object') return [];

    const rawData = data.data || data;
    
    // Handle if rawData is an array of chat objects
    if (Array.isArray(rawData)) {
      return rawData.map((chat, index) => ({
        number: chat.whatsapp_number || chat.number || `Unknown-${index}`,
        sms: chat.user_message || chat.message || 'No message',
        button: chat.category || 'General',
        time: chat.created_at ? new Date(chat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        count: chat.unread_count ? chat.unread_count.toString() : undefined,
        img: '/Profiledummy.png',
        customerName: chat.customer_name || null,
        isTyping: false,
      }));
    }
    
    // Handle if rawData is an object with phone numbers as keys
    return Object.entries(rawData).map(([phoneNumber, chatData]: [string, any]) => ({
      number: chatData.whatsapp_number || phoneNumber,
      sms: chatData.user_message || chatData.message || (typeof chatData === 'string' ? chatData : 'No message'),
      button: chatData.category || 'General',
      time: chatData.created_at ? new Date(chatData.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      count: chatData.unread_count ? chatData.unread_count.toString() : undefined,
      img: '/Profiledummy.png',
      customerName: chatData.customer_name || null,
      isTyping: false,
    }));
  };

  const transformedUsers = transformChatData(spaceLiveChatsData);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="w-full h-[900px] opacity-100 gap-[10px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center bg-blue-50 border border-blue-200 px-3 py-1 rounded-full gap-2">
          <span>😎</span>
          <span className="text-sm font-semibold text-gray-800">Main Account</span>
          <span className="ml-2 bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full leading-5 min-w-[20px] text-center">
            {transformedUsers.length > 99 ? '99+' : transformedUsers.length}
          </span>
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-4 w-full h-[calc(100vh-160px)]">
        {/* <div className="w-full lg:w-[30%] border border-gray-200 rounded-lg shadow-sm flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-50">
            <Icon icon="lucide:message-circle-more" className="text-gray-700" />
            <h2 className="text-sm font-semibold text-gray-700">Live Chats</h2>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {transformedUsers.length > 0 ? (
              transformedUsers.map((user, index) => (
                <div
                  key={user.number}
                  className="flex items-start px-4 py-3 gap-3 border-b cursor-pointer transition-all duration-150 hover:bg-gray-50"
                >
                  <div className="relative">
                    <img
                      src={user.img}
                      alt="User"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {user.customerName || user.number}
                      </div>
                      {user.customerName === 'Mom' && (
                        <span className="text-pink-500">💖</span>
                      )}
                    </div>
                    
                    {user.customerName && (
                      <div className="text-xs text-gray-500 truncate mb-1">
                        {user.number}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-600 truncate mb-2">
                      {user.isTyping ? (
                        <span className="text-gray-500 italic">typing...</span>
                      ) : (
                        user.sms
                      )}
                    </div>
                    
                    <div className="mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          user.button === 'General'
                            ? 'bg-gray-100 text-gray-700'
                            : user.button === 'Enquiry'
                            ? 'bg-yellow-100 text-yellow-800'
                            : user.button === 'Broken'
                            ? 'bg-red-100 text-red-800'
                            : user.button === 'Complete Sale'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.button}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-right text-gray-500 flex flex-col items-end gap-1">
                    <div className="text-green-600 font-medium">{user.time}</div>
                    {user.count && (
                      <div className="bg-green-600 text-white w-5 h-5 text-center rounded-full text-xs leading-5 font-medium">
                        {user.count}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-gray-500 py-10">
                No live chats available
              </div>
            )}
          </div>
        </div> */}
<div className="w-full lg:w-[30%] bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
  {/* Sidebar Header - WhatsApp Style */}
  <div className="flex items-center justify-between px-4 py-[10px] bg-[#f0f2f5] min-h-[59px]">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
         {/* Placeholder for Profile Pic */}
         <img src="https://via.placeholder.com/40" alt="me" />
      </div>
    </div>
    <div className="flex items-center gap-5 text-[#54656f]">
      <Icon icon="lucide:users-round" className="w-6 h-6 cursor-pointer" />
      <Icon icon="lucide:status-online" className="w-6 h-6 cursor-pointer" />
      <Icon icon="lucide:message-square-plus" className="w-6 h-6 cursor-pointer" />
      <Icon icon="lucide:more-vertical" className="w-6 h-6 cursor-pointer" />
    </div>
  </div>

  {/* Search Bar Container */}
  <div className="px-3 py-2 bg-white border-b border-gray-100">
    <div className="bg-[#f0f2f5] flex items-center px-3 py-1.5 rounded-lg">
      <Icon icon="lucide:search" className="w-4 h-4 text-gray-500 mr-4" />
      <input 
        type="text" 
        placeholder="Search or start new chat" 
        className="bg-transparent text-sm w-full focus:outline-none placeholder:text-gray-500"
      />
    </div>
  </div>

  {/* Chat List */}
  <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
    {transformedUsers.length > 0 ? (
      transformedUsers.map((user) => (
        <div
          key={user.number}
          className="group flex items-center px-3 py-0 h-[72px] cursor-pointer transition-colors duration-100 hover:bg-[#f5f6f6] active:bg-[#ebebeb]"
        >
          {/* Avatar Section */}
          <div className="pr-3 flex-shrink-0">
            <div className="relative">
              <img
                src={user.img}
                alt="User"
                className="w-12 h-12 rounded-full object-cover"
              />
              {/* Optional: Add online status if needed */}
            </div>
          </div>

          {/* Text Content Section */}
          <div className="flex-1 border-b border-gray-100 h-full flex flex-col justify-center min-w-0 pr-2">
            <div className="flex justify-between items-baseline mb-0.5">
              <div className="flex items-center gap-1 min-w-0">
                <h3 className="text-[17px] font-normal text-[#111b21] truncate leading-tight">
                  {user.customerName || user.number}
                </h3>
                {user.customerName === 'Mom' && <span className="text-xs">💖</span>}
              </div>
              <span className={`text-xs ${user.count ? 'text-[#00a884] font-medium' : 'text-[#667781]'}`}>
                {user.time}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 min-w-0">
                {/* Typing Indicator or SMS */}
                {user.isTyping ? (
                  <span className="text-[14px] text-[#00a884] leading-tight">typing...</span>
                ) : (
                  <div className="flex items-center text-[14px] text-[#667781] leading-tight truncate">
                    {/* Checkmark icon for read status - WhatsApp Signature */}
                    <Icon icon="lucide:check-check" className="w-4 h-4 mr-1 text-blue-400 shrink-0" />
                    <span className="truncate">{user.sms}</span>
                  </div>
                )}
              </div>

              {/* Count and Category Tags */}
              <div className="flex items-center gap-2">
                {user.button && (
                   <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-tight ${
                    user.button === 'Broken' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {user.button}
                  </span>
                )}
                {user.count && (
                  <div className="bg-[#25d366] text-white min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-[12px] font-bold">
                    {user.count}
                  </div>
                )}
                {/* Chevron appears on hover like WhatsApp */}
                <Icon icon="lucide:chevron-down" className="w-5 h-5 text-[#8696a0] hidden group-hover:block transition-all" />
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-[#667781] px-10 text-center">
        <p className="text-sm">No chats found. Your messages will appear here.</p>
      </div>
    )}
  </div>
</div>
        {/* Conversation Panel */}
        <div className="flex-1 border border-gray-200 rounded-lg shadow-sm flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center mx-auto shadow-sm">
              <Icon icon="lucide:message-circle-dashed" className="text-gray-400" width={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Conversation panel</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Select a conversation from the live chats to view full conversation details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAgent2;