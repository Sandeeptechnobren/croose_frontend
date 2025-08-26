// 'use client';
// import React, { useState } from 'react';
// import { Icon } from '@iconify/react/dist/iconify.js';
// import Messging6 from '../components/messaging6';

// const users = [
//   {
//     text: "Don't miss out on our exclusive discounts just for you!",
//     Dates: 'Wed 14 Nov, 1:00pm',
//     frequency: 'Daily',
//     status: 'Sent',
//     icon: <Icon icon="uil:arrow-up" width="20" height="20" />,
//     target: 'Everyone',
//   },
//   {
//     text: "Don't miss out on our exclusive discounts just for you!",
//     Dates: 'Wed 14 Nov, 1:00pm',
//     frequency: 'Once',
//     status: 'Sent',
//     icon: <Icon icon="uil:arrow-up" width="20" height="20" />,
//     target: 'Everyone',
//   },
//   {
//     text: 'Hey customer, we have new product availa...',
//     Dates: 'Wed 14 Nov, 1:00pm',
//     frequency: 'Weekly',
//     status: 'Sent',
//     icon: <Icon icon="uil:arrow-up" width="20" height="20" />,
//     target: 'Everyone',
//   },
//   {
//     text: 'Hey customer, we have new product availa...',
//     Dates: 'Wed 14 Nov, 1:00pm',
//     frequency: 'Monthly',
//     status: 'Sent',
//     icon: <Icon icon="uil:arrow-up" width="20" height="20" />,
//     target: 'Recent customers',
//   },
//   {
//     text: 'Check out our latest arrivals in the store today!',
//     Dates: 'Wed 14 Nov, 1:00pm',
//     frequency: 'Monthly',
//     status: 'Scheduled',
//     target: 'Recent customers',
//   },
//   {
//     text: 'Join us for a special event this weekend with giveaways!',
//     Dates: 'Wed 14 Nov, 1:00pm',
//     frequency: 'Monthly',
//     status: 'Scheduled',
//     target: 'Recent customers',
//   },
//   {
//     text: 'We appreciate your loyalty and have a surprise waiting for you!',
//     Dates: 'Wed 14 Nov, 2:00pm',
//     frequency: 'Monthly',
//     status: 'Scheduled',
//     target: 'Recent customers',
//   },
// ];

// const count = [
//   { num: '1' },
//   { num: '2' },
//   { num: '3' },
//   { num: '...' },
//   { num: '8' },
//   { num: '9' },
//   { num: '10' },
// ];

// const Page = () => {
//   const [messaging, setMessaging] = useState(false);

//   return (
//     <div className="flex flex-col w-full mt-[-100px] bg-white">
//       <section className="flex flex-col items-center gap-2 mt-4">
//         {/* Header Section */}
//         <section className="w-[95%] h-[52px] flex">
//           <div className="w-[75%] h-[52px] flex flex-col">
//             <span className="font-Inter font-semibold text-[18px] leading-[28px] text-[#101828]">
//               Broadcast Management
//             </span>
//             <span className="font-Inter font-normal text-[14px] leading-[20px] text-[#475467]">
//               View a history of all payments and associated details
//             </span>
//           </div>
//           <div className="w-[25%] flex flex-row h-[52px] justify-end gap-[8px]">
//             {/* New Broadcast Button */}
//             <div
//               onClick={() => setMessaging(true)}
//               className="w-[135px] h-[36px] flex items-center justify-center bg-[#685BC7] gap-[10px] px-[16px] py-[8px] rounded-lg cursor-pointer"
//             >
//               <span className="font-Inter font-semibold text-sm leading-5 text-[#FFFFFF] text-center">
//                 New Broadcast
//               </span>
//             </div>
//             <div className="w-[135px] h-[36px] flex items-center bg-[#F1F0FA] gap-[10px] px-[16px] py-[8px] rounded-lg">
//               <span className="font-Inter font-semibold text-sm leading-5 text-[#685BC7] text-center">
//                 Send Message
//               </span>
//             </div>
//           </div>
//         </section>

//         {/* Table Section */}
//         <div className="w-[95%] overflow-x-auto border-2 border-[#EAECF0] rounded-[10px]">
//           <table className="min-w-[700px] w-full text-sm text-left text-gray-500 bg-white rounded-[10px]">
//             <thead className="text-xs text-[#475467] font-Inter bg-gray-50 font-medium">
//               <tr>
//                 <th className="px-6 py-3">Content</th>
//                 <th className="px-6 py-3">Date Schedule</th>
//                 <th className="px-6 py-3">Frequency</th>
//                 <th className="px-6 py-3">Status</th>
//                 <th className="px-6 py-3">Target</th>
//                 <th className="px-6 py-3"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user, index) => (
//                 <tr key={index} className="border-b border-[#EAECF0]">
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="checkbox"
//                         className="appearance-none w-4 h-4 border-2 border-[#D0D5DD] rounded-[4px] checked:bg-[#D0D5DD] checked:border-[#D0D5DD]"
//                       />
//                       <div className="text-[#101828] font-Inter font-medium text-[14px] leading-[20px]">
//                         {user.text}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">{user.Dates}</td>
//                   <td className="px-6 py-4 text-[#475467]">{user.frequency}</td>
//                   <td className="px-6 py-4 text-[#475467]">
//                     <div
//                       className={`inline-flex w-fit items-center border rounded-full font-inter font-semibold text-[12px] leading-[18px]
//                         ${
//                           user.status === 'Scheduled'
//                             ? 'bg-[#F9FAFB] text-[#344054] border-[#EAECF0]'
//                             : user.status === 'Sent'
//                             ? 'bg-[#ECFDF3] text-[#067647] border-[#ABEFC6]'
//                             : 'bg-gray-100 text-gray-600 border-gray-300'
//                         }`}
//                     >
//                       <span className="flex items-center justify-center pl-1">
//                         {user.icon}
//                       </span>
//                       <span className="px-2 py-[2px]">{user.status}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-[#475467]">
//                     <div
//                       className={`inline-flex w-fit items-center border rounded-full font-inter font-semibold text-[12px] leading-[18px]
//                         ${
//                           user.target === 'Everyone'
//                             ? 'bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]'
//                             : 'bg-[#FEF6EE] text-[#B93815] border-[#F9DBAF]'
//                         }`}
//                     >
//                       <span className="px-2 py-[2px]">{user.target}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 text-[#475467]">
//                     <Icon icon="bi:three-dots-vertical" width="16" height="16" />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//             <tfoot>
//               <tr>
//                 <td colSpan={7} className="px-6 py-4">
//                   <div className="flex justify-between items-center w-full">
//                     {/* Left Button */}
//                     <button className="px-4 py-2 bg-[#F2F4F7] text-sm text-[#344054] rounded-md hover:bg-[#E4E7EC] flex gap-2">
//                       <Icon
//                         icon="meteor-icons:arrow-left"
//                         width="20"
//                         height="20"
//                       />
//                       Previous
//                     </button>

//                     {/* Center Count */}
//                     <span className="flex gap-[2px]">
//                       {count.map((counts, index) => (
//                         <div
//                           key={index}
//                           className={`h-[40px] w-[40px] flex justify-center items-center bg-[#F9FAFB] 
//                             ${
//                               index === 0 ? 'text-[#182230]' : 'text-[#475467]'
//                             }`}
//                         >
//                           {counts.num}
//                         </div>
//                       ))}
//                     </span>

//                     {/* Right Button */}
//                     <button className="px-4 py-2 bg-[#F2F4F7] text-sm text-[#344054] rounded-md hover:bg-[#E4E7EC] flex gap-2">
//                       Next
//                       <Icon
//                         icon="meteor-icons:arrow-right"
//                         width="20"
//                         height="20"
//                       />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </section>

//       {/* Modal for New Broadcast */}
//       {messaging && (
//         <div className="fixed inset-0 flex justify-center items-center bg-[#18181B1F] z-50">
          
            
           
//             <Messging6 />
        
//         </div>
//       )}
//     </div>
//   );
// };

// export default Page;









'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Messging6 from '../components/messaging6';

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
        <div className="fixed inset-0 flex justify-center items-center bg-[#18181B1F] z-50 p-4">
          <Messging6 />
        </div>
      )}
    </div>
  );
};

export default Page;