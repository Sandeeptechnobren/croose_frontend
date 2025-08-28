
'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';


const users = [
  {
    text: "Don't miss out on our exclusive discounts just for you!",
    Dates: 'Wed 14 Nov, 1:00pm',
    frequency: 'Daily',
    status: 'Sent',
    icon: <Icon icon="uil:arrow-up" width="20" height="20" />,
    target: 'Everyone',
  },
  {
    text: "Don't miss out on our exclusive discounts just for you!",
    Dates: 'Wed 14 Nov, 1:00pm',
    frequency: 'Once',
    status: 'Sent',
    icon: <Icon icon="uil:arrow-up" width="20" height="20" />,
    target: 'Everyone',
  },
  {
    text: 'Hey customer, we have new product availa...',
    Dates: 'Wed 14 Nov, 1:00pm',
    frequency: 'Weekly',
    status: 'Sent',
    icon: <Icon icon="uil:arrow-up" width="20" height="20" />,
    target: 'Everyone',
  },
  {
    text: 'Hey customer, we have new product availa...',
    Dates: 'Wed 14 Nov, 1:00pm',
    frequency: 'Monthly',
    status: 'Sent',
    icon: <Icon icon="uil:arrow-up" width="20" height="20" />,
    target: 'Recent customers',
  },
  {
    text: 'Check out our latest arrivals in the store today!',
    Dates: 'Wed 14 Nov, 1:00pm',
    frequency: 'Monthly',
    status: 'Scheduled',
    target: 'Recent customers',
  },
  {
    text: 'Join us for a special event this weekend with giveaways!',
    Dates: 'Wed 14 Nov, 1:00pm',
    frequency: 'Monthly',
    status: 'Scheduled',
    target: 'Recent customers',
  },
  {
    text: 'We appreciate your loyalty and have a surprise waiting for you!',
    Dates: 'Wed 14 Nov, 2:00pm',
    frequency: 'Monthly',
    status: 'Scheduled',
    target: 'Recent customers',
  },
];

const count = [
  { num: '1' },
  { num: '2' },
  { num: '3' },
  { num: '...' },
  { num: '8' },
  { num: '9' },
  { num: '10' },
];

const Page = () => {
  const [messaging, setMessaging] = useState(false);

  return (
    <div className="flex flex-col w-full mt-[-100px] bg-white">
      <section className="flex flex-col items-center gap-2 mt-4">
        {/* Header Section */}
        <section className="w-[95%] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="w-full sm:w-[75%] flex flex-col">
            <span className="font-Inter font-semibold text-lg sm:text-[18px] leading-[28px] text-[#101828]">
              Broadcast Management
            </span>
            <span className="font-Inter font-normal text-sm leading-[20px] text-[#475467]">
              View a history of all payments and associated details
            </span>
          </div>
          <div className="w-full sm:w-[25%] flex flex-row justify-start sm:justify-end gap-2">
            {/* New Broadcast Button */}
            <div
              onClick={() => setMessaging(true)}
              className="w-full sm:w-[135px] h-[36px] flex items-center justify-center bg-[#685BC7] gap-[10px] px-[16px] py-[8px] rounded-lg cursor-pointer"
            >
              <span className="font-Inter font-semibold text-sm leading-5 text-[#FFFFFF] text-center">
                New Broadcast
              </span>
            </div>
            <div className="w-full sm:w-[135px] h-[36px] flex items-center justify-center bg-[#F1F0FA] gap-[10px] px-[16px] py-[8px] rounded-lg">
              <span className="font-Inter font-semibold text-sm leading-5 text-[#685BC7] text-center">
                Send Message
              </span>
            </div>
          </div>
        </section>

        {/* Table Section with Enhanced Mobile Scrolling */}
        <div className="w-[95%] border-2 border-[#EAECF0] rounded-[10px] bg-white">
          {/* Mobile scroll hint */}
          <div className="sm:hidden px-4 py-2 text-xs text-[#475467] bg-[#F9FAFB] border-b border-[#EAECF0] flex items-center gap-2">
            <Icon icon="material-symbols:swipe-left" width="16" height="16" />
            Swipe left to see more columns
          </div>
          
          {/* Scrollable container */}
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm text-left text-gray-500 bg-white">
              <thead className="text-xs text-[#475467] font-Inter bg-gray-50 font-medium sticky left-0">
                <tr>
                  <th className="px-3 sm:px-6 py-3 min-w-[250px] sticky left-0 bg-gray-50 z-10">Content</th>
                  <th className="px-3 sm:px-6 py-3 min-w-[140px]">Date Schedule</th>
                  <th className="px-3 sm:px-6 py-3 min-w-[100px]">Frequency</th>
                  <th className="px-3 sm:px-6 py-3 min-w-[100px]">Status</th>
                  <th className="px-3 sm:px-6 py-3 min-w-[120px]">Target</th>
                  <th className="px-3 sm:px-6 py-3 min-w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b border-[#EAECF0]">
                    <td className="px-3 sm:px-6 py-4 min-w-[250px] sticky left-0 bg-white z-10">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="appearance-none w-4 h-4 border-2 border-[#D0D5DD] rounded-[4px] checked:bg-[#D0D5DD] checked:border-[#D0D5DD] flex-shrink-0"
                        />
                        <div className="text-[#101828] font-Inter font-medium text-[14px] leading-[20px] line-clamp-2">
                          {user.text}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 min-w-[140px] whitespace-nowrap">{user.Dates}</td>
                    <td className="px-3 sm:px-6 py-4 text-[#475467] min-w-[100px]">{user.frequency}</td>
                    <td className="px-3 sm:px-6 py-4 text-[#475467] min-w-[100px]">
                      <div
                        className={`inline-flex w-fit items-center border rounded-full font-inter font-semibold text-[12px] leading-[18px]
                          ${
                            user.status === 'Scheduled'
                              ? 'bg-[#F9FAFB] text-[#344054] border-[#EAECF0]'
                              : user.status === 'Sent'
                              ? 'bg-[#ECFDF3] text-[#067647] border-[#ABEFC6]'
                              : 'bg-gray-100 text-gray-600 border-gray-300'
                          }`}
                      >
                        <span className="flex items-center justify-center pl-1">
                          {user.icon}
                        </span>
                        <span className="px-2 py-[2px]">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-[#475467] min-w-[120px]">
                      <div
                        className={`inline-flex w-fit items-center border rounded-full font-inter font-semibold text-[12px] leading-[18px]
                          ${
                            user.target === 'Everyone'
                              ? 'bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]'
                              : 'bg-[#FEF6EE] text-[#B93815] border-[#F9DBAF]'
                          }`}
                      >
                        <span className="px-2 py-[2px]">{user.target}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-[#475467] min-w-[50px]">
                      <Icon icon="bi:three-dots-vertical" width="16" height="16" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer - moved outside the scrollable area */}
          <div className="px-3 sm:px-6 py-4 border-t border-[#EAECF0] bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
              {/* Left Button */}
              <button className="px-4 py-2 bg-[#F2F4F7] text-sm text-[#344054] rounded-md hover:bg-[#E4E7EC] flex gap-2">
                <Icon
                  icon="meteor-icons:arrow-left"
                  width="20"
                  height="20"
                />
                Previous
              </button>

              {/* Center Count */}
              <span className="flex gap-[2px]">
                {count.map((counts, index) => (
                  <div
                    key={index}
                    className={`h-[40px] w-[40px] flex justify-center items-center bg-[#F9FAFB] 
                      ${
                        index === 0 ? 'text-[#182230]' : 'text-[#475467]'
                      }`}
                  >
                    {counts.num}
                  </div>
                ))}
              </span>

              {/* Right Button */}
              <button className="px-4 py-2 bg-[#F2F4F7] text-sm text-[#344054] rounded-md hover:bg-[#E4E7EC] flex gap-2">
                Next
                <Icon
                  icon="meteor-icons:arrow-right"
                  width="20"
                  height="20"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for New Broadcast */}
      {messaging && (
        <div className="absolute w-full h-screen z-50 top-0 flex justify-center items-center  bg-[#18181B1F]">
          <div className="absolute   inset-0 z-50" onClick={() => setMessaging(false)}></div>
  
   <section className="w-full h-screen flex justify-center items-center py-4 px-2 sm:py-8">
  <div className="relative z-0 w-full max-w-[717px] mx-4 rotate-0 opacity-100 rounded-[16px] border border-solid bg-[#ffffff] border-[#E2E4E84D] overflow-y-auto max-h-[90vh]">
    {/* Header */}
    <section className="w-full h-[60px] flex justify-between items-center rounded-t-[16px] border-b border-[#F6F6F6] px-[16px] sm:px-[20px] py-[12px] bg-[#fff]">
      <span className="font-semibold text-[18px] sm:text-[20px] leading-[150%] tracking-[-0.04em] font-sans text-[#1D2939]">
        New Broadcast
      </span>
      <button
        onClick={() => setMessaging(false)}
        className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] flex items-center justify-center rounded-full border bg-[#F6F8FA] border-[#F1F2F3]"
      >
        <Icon
          icon="charm:cross"
          width="20"
          height="20"
          className="text-[#1D2939]"
        />
      </button>
    </section>

    {/* Form Body */}
    <section className="w-full flex flex-col px-4 sm:px-[64px] py-[24px] sm:py-[32px] gap-[24px] sm:gap-[32px]">
      <div className="flex flex-col gap-[16px] w-full">
        <div className="flex flex-col sm:flex-row w-full gap-[12px]">
          {/* Target */}
          <div className="flex-1">
            <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">
              Target
            </label>
            <input
              placeholder="Select target"
              className="w-full h-[44px] rounded-[12px] border border-[#D0D5DD] px-[16px] font-normal text-[14px] leading-[20px] font-sans focus:outline-none"
            />
          </div>

          {/* Frequency */}
          <div className="flex-1">
            <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">
              Frequency
            </label>
            <div className="flex items-center h-[44px] rounded-[12px] border border-[#D0D5DD] px-3">
              <input
                type="text"
                name="Select"
                placeholder="Select account type"
                className="flex-1 bg-transparent outline-none border-none font-normal text-[14px] leading-[20px] font-sans"
              />
              <Icon
                icon="ri:arrow-down-s-line"
                width="24"
                height="24"
                className="text-[#344054]"
              />
            </div>
          </div>
        </div>

        {/* Schedule Date */}
        <div>
          <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">
            Schedule date
          </label>
          <div className="flex items-center h-[44px] rounded-[12px] border border-[#D0D5DD] px-[16px]">
            <input
              type="text"
              name="Select date"
              placeholder="Select date"
              className="flex-1 bg-transparent outline-none border-none font-normal text-[14px] leading-[20px] font-sans"
            />
            <Icon
              icon="uil:calender"
              width="20"
              height="20"
              className="text-[#475467]"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">
            Content
          </label>
          <textarea
            placeholder="Add notes"
            className="w-full h-[79px] resize-none rounded-[12px] border border-[#D0D5DD] px-[16px] py-2 font-normal text-[14px] leading-[20px] font-sans focus:outline-none"
          />
        </div>
      </div>

      {/* Button Row */}
      <div className="flex flex-col sm:flex-row w-full justify-end gap-[16px] sm:gap-[32px]">
        <button
          onClick={() => setMessaging(false)}
          className="w-full sm:w-[161px] h-[40px] rounded-lg bg-[#EAECF0] px-[16px] font-semibold text-sm leading-5 text-center font-sans text-[#1D2939]"
        >
          Cancel
        </button>
        <button className="w-full sm:w-[161px] h-[40px] rounded-lg bg-[#685BC7] px-[16px] font-semibold text-sm leading-5 text-center font-sans text-white">
          Schedule
        </button>
      </div>
    </section>
  </div>
</section>


        </div>
      )}
    </div>
  );
};

export default Page;
