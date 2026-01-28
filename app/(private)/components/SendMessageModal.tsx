"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getTargetList, addNewMessage, GetSpaceId } from '@/app/Apis/publicapi';
import CustomDropdown from "./CustomDropdown";

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: {
    message: string;
    target: string;
    space: string;
  }) => void;
}



const SendMessageModal: React.FC<SendMessageModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("");
  const [targetList, setTargetList] = useState<any[]>([]);
  const [space, setSpace] = useState("");
  const [spaceList, setSpaceList] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const fetchTargets = async () => {
        try {
          const res = await getTargetList();
          setTargetList(res?.data || res || []);
        } catch (error) {
          console.error("Error fetching targets:", error);
          setTargetList([]);
        }
      };

      const fetchSpaces = async () => {
        try {
          const res = await GetSpaceId();

          let spaces: any[] = [];

          if (Array.isArray(res)) {
            spaces = res;
          } else if (res?.spaces && Array.isArray(res.spaces)) {
            spaces = res.spaces;
          } else if (res?.data && Array.isArray(res.data)) {
            spaces = res.data;
          } else if (res?.data?.data && Array.isArray(res.data.data)) {
            spaces = res.data.data;
          } else if (res?.data?.spaces && Array.isArray(res.data.spaces)) {
            spaces = res.data.spaces;
          }

          setSpaceList(spaces);
        } catch (error) {
          console.error("Error fetching spaces:", error);
          setSpaceList([]);
        }
      };

      fetchTargets();
      fetchSpaces();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        targetId: parseInt(target),
        spaceId: parseInt(space),
        message: message
      };

      await addNewMessage(payload);
      onSubmit?.({ message, target, space });
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#18181B1F] py-4 px-2 sm:py-8">
      <form onSubmit={handleSubmit} className="relative w-full max-w-[717px] mx-4 rotate-0 opacity-100 rounded-[16px] border border-solid bg-[#ffffff] border-[#E2E4E84D] overflow-y-auto max-h-[90vh]">
        <section className="w-full h-[60px] flex justify-between items-center rounded-t-[16px] border-b border-[#F6F6F6] px-[16px] sm:px-[20px] py-[12px] bg-[#fff]">
          <span className="font-semibold text-[18px] sm:text-[20px] leading-[150%] tracking-[-0.04em] font-sans text-[#1D2939]">
            Send Message
          </span>
          <button type="button" onClick={onClose} className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] flex items-center justify-center rounded-full border bg-[#F6F8FA] border-[#F1F2F3]">
            <Icon icon="charm:cross" width="20" height="20" className="text-[#1D2939]" />
          </button>
        </section>

        <section className="w-full flex flex-col px-4 sm:px-[64px] py-[24px] sm:py-[32px] gap-[24px] sm:gap-[32px]">
          <div className="flex flex-col gap-[16px] w-full">
            <div className="w-full">
              <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">Target</label>
              <div className="relative">
                <CustomDropdown
                  value={target}
                  onChange={(val: string) => setTarget(val)}
                  options={targetList.map((t: any) => ({ value: String(t.id || t.name), label: t.name || 'Unnamed Target' }))}
                  placeholder="Select target"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">Space</label>
              <div className="relative">
                <CustomDropdown
                  value={space}
                  onChange={(val: string) => setSpace(val)}
                  options={spaceList.map((s: any) => ({ value: String(s.id || s.spaceId || s.space_id), label: s.name || s.spaceName || s.space_name || 'Unnamed Space' }))}
                  placeholder="Select space"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add message"
                className="w-full h-[100px] resize-none rounded-[12px] border border-[#D0D5DD] px-[16px] py-2 font-normal text-[14px] leading-[20px] font-sans focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full justify-end gap-[16px] sm:gap-[32px]">
            <button type="button" onClick={onClose} className="w-full sm:w-[161px] h-[40px] rounded-lg bg-[#EAECF0] px-[16px] font-semibold text-sm leading-5 text-center font-sans text-[#1D2939]">
              Cancel
            </button>
            <button type="submit" className="w-full sm:w-[161px] h-[40px] rounded-lg bg-[#685BC7] px-[16px] font-semibold text-sm leading-5 text-center font-sans text-white">
              Send
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default SendMessageModal;
