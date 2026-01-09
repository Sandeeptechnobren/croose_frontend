"use client";
import React, { useState } from "react";
import Spacenav from "../../components/spacenav";
import Messging5 from "../../components/messging5";
import Navbar from "../../components/Navbar";

const Page = () => {
  const [showMessaging, setShowMessaging] = useState(false);

  return (
    <div className="flex flex-col ">
      <Navbar heading="Messaging" />

      <section
        className={`w-full h-[100vh] flex ${!showMessaging ? "justify-center items-center" : "justify-start items-start pt-4"
          }`}
      >
        {!showMessaging ? (
          <div className="w-[368px] h-[380px] rotate-0 opacity-100 gap-0 rounded-2xl border border-[#EAECF0] p-0 relative">
            <div className="w-full h-[220px] bg-[#F9FAFB] rounded-t-2xl flex justify-center items-center">
              <img
                src="/messaging1.png"
                className="w-[140px] h-[140px] rotate-0 opacity-100 rounded-full absolute"
              />
            </div>
            <div className="w-full h-[160px] flex flex-col gap-[24px] p-[24px]">
              <div className="w-[95%] h-[52px] flex flex-col gap-[4px]">
                <span className="w-full h-[28px] font-sans font-semibold text-lg leading-7 tracking-normal text-[#1D2939]">
                  You’ve not created a space yet
                </span>
                <span className="w-[95%] h-[20px] font-sans font-normal text-sm leading-5 tracking-normal text-[#475467]">
                  All spaces you have created will appear here
                </span>
              </div>
              <button
                onClick={() => setShowMessaging(true)}
                className="w-[162px] cursor-pointer bg-[#685BC7] h-[36px] rotate-0 opacity-100 gap-[10px] rounded-lg pt-2 pr-4 pb-2 pl-4 flex items-center"
              >
                <span className="w-[130px] h-[20px] font-sans font-semibold text-sm leading-5 tracking-normal text-center text-[#FFFFFF]">
                  Create a Broadcast
                </span>
              </button>
            </div>
          </div>
        ) : (
          <Messging5 />
        )}
      </section>
    </div>
  );
};

export default Page;
