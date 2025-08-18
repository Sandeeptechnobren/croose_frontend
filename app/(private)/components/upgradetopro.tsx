'use client'
import React, { use, useEffect } from 'react'
import { Icon } from "@iconify/react";
import { PayApi, RunAgent, spaceChats } from '@/app/Apis/publicapi';
import { useParams, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const Upgradetopro = (props: any) => {
  const { instanceData } = props;

  const searchParams = useSearchParams();
  const spaceId: any = searchParams.get('id');

  const [spaceUuid, setSpaceUuid] = useState(null);
  const [loading, setLoading] = useState(false);

  const id = searchParams.get('id');

  useEffect(() => {
    const fetchSpaceStats = async () => {
      try {
        const res = await spaceChats(spaceId);
        if (res?.space_uuid) {
          setSpaceUuid(res.space_uuid);
          console.log('Fetched UUID:', res.space_uuid);
        } else {
          console.error('No UUID found in response');
        }
      } catch (err) {
        console.error('Failed to fetch space stats:', err);
      }
    };

    if (spaceId) {
      fetchSpaceStats();
    }
  }, [spaceId]);

  const handlePayment = async () => {
    if (!spaceUuid) {
      console.error('spaceUuid not ready yet');
      return;
    }

    try {
      setLoading(true);
      const res = await PayApi(spaceUuid);
      console.log('Payment API response:', res?.data);
    } catch (err) {
      console.error('Payment failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQrPage = () => {
    if (!spaceUuid) {
      console.error('UUID not available yet');
      return;
    }

    const qrUrl = `https://api.joincroose.com/croose/api/paystack/whapi/${spaceUuid}`;
    window.open(qrUrl, '_blank');
  };

  // Safety check for instanceData
  if (!instanceData) {
    return null;
  }

  return (
    <>
      <div className='fixed top-0 left-0 z-[50] w-full h-full bg-[#18181B66] flex items-center justify-center'>
        <div className='w-[400px] h-auto rounded-[16px] bg-[#FFFFFF]'>
          <div className='w-[400px] rounded-t-[16px] h-[89px] relative bg-[#F3F0FA]'>
            <Icon 
              onClick={() => props.setProopen(false)} 
              icon="charm:cross" 
              width="16" 
              height="26" 
              style={{ color: "#000" }} 
              className='w-[30px] absolute top-[15px] left-[350px]' 
            />
          </div>
          <div className='flex flex-col items-center w-[400px] h-auto p-[40px] gap-[16px]'>
            <div className='w-[320px]'>
              <ul className='flex flex-col gap-[16px]'>
                <li key="upgrade-title" className='text-[#101828] font-semibold text-[18px] font-sans'>
                  Upgrade to Pro to Run your space
                </li>
                <li key="premium-feature" className='w-[320px] rounded-[8px] p-[12px] bg-[#685BC71F] text-[#685BC7] font-sans font-400 text-[14px]'>
                  This is a premium feature available exclusively on our Pro plan. Upgrade to Pro to unlock it.
                </li>
                <hr key="divider" className="w-[320px] border-dotted border-t-2 border-[#EAECF0]" />
                <li key="description" className='w-[320px] h-[40px] text-[#475467] font-400 text-[14px] font-sans'>
                  This is a premium feature available exclusively on our Pro plan. Upgrade to Pro to unlock it.
                </li>
              </ul>
            </div>
          </div>
          <div className='flex justify-center flex-col w-[400px] p-[20px] h-auto border-t-[1px] border-t-[#EAECF0] gap-[12px]'>
            <button 
              onClick={() => {
                handleOpenQrPage()
              }} 
              className='justify-center font-sans w-[360px] text-[white] rounded-[8px] bg-[#685BC7] flex pt-[8px] pr-[16px] pb-[8px] pl-[16px]'
            >
              PAY {instanceData?.data?.currency || '$'} {instanceData?.data?.activation_charge || '199'}
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </>
  )
}

export default Upgradetopro



// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Icon } from "@iconify/react";

// interface UpgradeProProps {
//   setProopen: (val: boolean) => void;
//   instanceData?: any;
//   space_uuid: string | null; // Updated to match the prop name
// }

// const Upgradetopro = ({ setProopen, instanceData, space_uuid }: UpgradeProProps) => {
//   const [loading, setLoading] = useState(false);

//   const handleOpenPaymentPage = () => {
//     if (!space_uuid) {
//       console.error('UUID not available');
//       alert('Space UUID not available. Please try again.');
//       return;
//     }

//     const paymentUrl = `https://api.joincroose.com/croose/api/paystack/whapi/${space_uuid}`;
//     console.log('Opening payment URL:', paymentUrl);
//     window.open(paymentUrl, '_blank');
//   };

//   const getCurrency = () => {
//     return instanceData?.currency || instanceData?.data?.currency || 'GH₵';
//   };

//   const getActivationCharge = () => {
//     return instanceData?.activation_charge || instanceData?.data?.activation_charge || '1';
//   };

//   return (
//     <>
//       <div className='fixed top-0 left-0 z-[50] w-full h-full bg-[#18181B66] flex items-center justify-center'>
//         <div className='w-[400px] h-auto rounded-[16px] bg-[#FFFFFF]'>
//           <div className='w-[400px] rounded-t-[16px] h-[89px] relative bg-[#F3F0FA]'>
//             <Icon 
//               onClick={() => setProopen(false)} 
//               icon="charm:cross" 
//               width="16" 
//               height="26" 
//               style={{ color: "#000" }} 
//               className='w-[30px] absolute top-[15px] left-[350px] cursor-pointer' 
//             />
//           </div>
//           <div className='flex flex-col items-center w-[400px] h-auto p-[40px] gap-[16px]'>
//             <div className='w-[320px]'>
//               <ul className='flex flex-col gap-[16px]'>
//                 <li key="upgrade-title" className='text-[#101828] font-semibold text-[18px] font-sans'>
//                   Upgrade to Pro to Run your space
//                 </li>
//                 <li key="premium-feature" className='w-[320px] rounded-[8px] p-[12px] bg-[#685BC71F] text-[#685BC7] font-sans font-400 text-[14px]'>
//                   This is a premium feature available exclusively on our Pro plan. Upgrade to Pro to unlock it.
//                 </li>
//                 <hr key="divider" className="w-[320px] border-dotted border-t-2 border-[#EAECF0]" />
//                 <li key="description" className='w-[320px] h-[40px] text-[#475467] font-400 text-[14px] font-sans'>
//                   Activate your AI assistant to start receiving and responding to messages automatically on WhatsApp.
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div className='flex justify-center flex-col w-[400px] p-[20px] h-auto border-t-[1px] border-t-[#EAECF0] gap-[12px]'>
//             <button 
//               onClick={handleOpenPaymentPage}
//               disabled={loading || !space_uuid}
//               className='justify-center font-sans w-[360px] text-[white] rounded-[8px] bg-[#685BC7] flex pt-[8px] pr-[16px] pb-[8px] pl-[16px] hover:bg-[#594ab0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
//             >
//               {loading ? 'Loading...' : `PAY ${getCurrency()} ${getActivationCharge()}`}
//             </button>
//             {!space_uuid && (
//               <p className="text-red-500 text-sm text-center">
//                 Space UUID not available. Please refresh and try again.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default Upgradetopro