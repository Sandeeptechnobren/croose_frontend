"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: {
    message: string;
    dateScheduled: string;
    frequency: "Once" | "Daily" | "Weekly" | "Monthly";
    target: "Everyone" | "Recent customers";
  }) => void;
}

const frequencies = ["Once", "Daily", "Weekly", "Monthly"] as const;
const targets = ["Everyone", "Recent customers"] as const;

const SendMessageModal: React.FC<SendMessageModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [message, setMessage] = useState("");
  const [dateScheduled, setDateScheduled] = useState("");
  const [frequency, setFrequency] = useState<typeof frequencies[number]>("Once");
  const [target, setTarget] = useState<typeof targets[number]>("Everyone");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ message, dateScheduled, frequency, target });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#18181B1F] py-4 px-2 sm:py-8">
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
              <div className="flex flex-col sm:flex-row w-full gap-[12px]">
                <div className="flex-1">
                  <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">Target</label>
                  <div className="relative">
                    <select
                      value={target}
                      onChange={(e) => setTarget(e.target.value as typeof targets[number])}
                      className="w-full h-[44px] rounded-[12px] border border-[#D0D5DD] px-[16px] font-normal text-[14px] leading-[20px] font-sans focus:outline-none appearance-none pr-10"
                    >
                      {targets.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <Icon icon="ri:arrow-down-s-line" width="20" height="20" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#344054] pointer-events-none" />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">Frequency</label>
                  <div className="relative">
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as typeof frequencies[number])}
                      className="w-full h-[44px] rounded-[12px] border border-[#D0D5DD] px-[16px] font-normal text-[14px] leading-[20px] font-sans focus:outline-none appearance-none pr-10"
                    >
                      {frequencies.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <Icon icon="ri:arrow-down-s-line" width="20" height="20" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#344054] pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">Schedule date</label>
                <div className="flex items-center h-[44px] rounded-[12px] border border-[#D0D5DD] px-[16px]">
                  <input
                    type="date"
                    value={dateScheduled}
                    onChange={(e) => setDateScheduled(e.target.value)}
                    className="flex-1 bg-transparent outline-none border-none font-normal text-[14px] leading-[20px] font-sans"
                  />
                  <Icon icon="uil:calender" width="20" height="20" className="text-[#475467]" />
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
