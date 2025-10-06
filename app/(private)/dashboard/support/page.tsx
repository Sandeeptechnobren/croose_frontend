'use client'
import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useState } from 'react'
import Croosehq from '../../components/croosehq'
import { Righteous } from 'next/font/google'
import CroosehqRigtFull from '../../components/croosehqright'
import Navbar from '../../components/Navbar'

let Accordings = ({index,value,toggleaccordion,openindex}:any)=>{
    const [isopen, setIsopen] = useState(false)
   
    
    return(  <div key={index} className="w-[90%]  h-auto rounded-[8px] bg-[#F2F4F7] text-[#101828] font-semibold font-Inter text-[16px] p-[24px]">
                                    <ul onClick={()=>toggleaccordion(index)}
                                        className="flex justify-between items-center cursor-pointer"

                                    >
                                        <li>{value.title}</li>
                                        

                                        <li>
                                            {isopen ? (
                                                <Icon onClick={() => setIsopen((prev:any) => !prev)}
                                                    icon="majesticons:minus-line"
                                                    width="24"
                                                    height="24"
                                                    style={{ color: "#101828" }}
                                                />
                                            ) : (
                                                <Icon
                                                    onClick={() => setIsopen((prev:any) => !prev)}
                                                    icon="lucide:plus"
                                                    width="24"
                                                    height="24"
                                                    style={{ color: "#101828" }}
                                                />
                                            )}
                                        </li>
                                    </ul>

                                    {openindex == index && (
                                        <div className="  text-[#344054] font-normal">
                                            <p>
                                             
                                               {value.description}
                                            </p>
                                        </div>
                                    )}
                                </div>)
}
const Support = () => {
    const[crooseopen,setCrooseOpen]  = useState(false)
     const [open,setOpen] = useState(false)

    const [openindex,setOpenindex] =useState<number | null>(null) ;

    const toggleaccordion=(index:number)=>{
        setOpenindex(prev=>(prev === index ? null : index ))

    }


    let data = [
        {
            title: "What is CROOSE?",
          
            description: "Croose is a platform that helps you automate your small business using WhatsApp. You can manage bookings, payments, customer chats, and even run your inventory — all in one place. It’s like having your own 24/7 assistant on WhatsApp, giving your customers a smooth andmodern experience"
        },
        {
            title: "How do I set up the automated response?",
           
            description: 'Once you complete your onboarding on Croose, your WhatsApp assistant is ready to go. You can customize automated responses by adding details about your business in your "Space IQ" and uploading any documents or information you want your assistant to use when talking toyour customers.'
        },
        {
            title: "How do I cancel subscription?",
             
            description: "You can request cancellation anytime by contacting support through the Croose support bot orreaching us directly via WhatsApp. We’ll process your cancellation before your next billing cycle. Please note that cancellation stops your WhatsApp assistant from operating immediately after the current billing period ends."
        },
        {
            title: "What payment methods do you accept?",
             
            description: "We accept payments via Stripe for international customers and mobile money for customers in Ghana. If you pay by mobile money, we’ll show you how many days remain in your subscription and remind you 5 days before renewal so you can top up on time."
        },
         {
            title: "How do I set up the automated response?",
             
            description: "sdfwqdvadcsscdasdcascascds"
        }

    ]

    return (
        <div className='w-full' >

            <Navbar heading="Support" />

            <div className='w-full h-[808px] flex flex-col  gap-[24px] pr-[32px] pl-[32px] pt-[32px] ' >
                <div className='flex flex-col gap-[6px]' >
                    <p className='font-inter font-semibold text-[18px] text-[#101828] ' >The assistance you require</p>
                    <p className='text-[#475467] font-normal text-[14px] font-Inter ' >Explore the essential details that define your customer base.</p>

                </div>
                <div className='flex flex-wrap items-center  ' >
                    <button className='bg-[#F9F5FF] w-[52px] rounded-[6px] px-[12px] py-[8px] text-[14px] font-semibold font-Inter  text-[#685BC7]   ' >FAQ</button>
                    <button onClick={()=>setCrooseOpen(true)} className=' flex gap-[8px] w-[80px] font-Inter px-[12px] py-[8px] rounded-[6px] text-[#667085] font-semibold  text-[14px]  ' >Live Bot</button>
                </div>

                <div className='font-bold text-[30px] font-Inter text-[#101828]  ' >
                    Frequently Asked Questions
                </div>

                <section className="w-full flex flex-col flex-wrap gap-[16px] ">

                    {data.map((value,index) => {
                        return (
                           
                              
                            <Accordings value={value} index={index} openindex={openindex} toggleaccordion={toggleaccordion}/>
                            
                        )
                    })}

                </section>

            </div>
            

            {crooseopen? <Croosehq setCrooseOpen2={setCrooseOpen} setOpen={setOpen} />:""}
            {open? <CroosehqRigtFull open={open} setOpen = {setOpen} />:""}

        </div>
    )
}

export default Support
