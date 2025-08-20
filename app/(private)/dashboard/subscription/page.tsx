'use client';
import { Icon } from "@iconify/react";
import React from 'react';
import Navbar from "../../components/Navbar";
import { useState } from 'react';
import { X } from 'lucide-react';
import SubscriptionModal from "./SubscriptionModal";

const Subscription = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [subscriptions, setSubscriptions] = useState([]);
 
  const subscriptionData = [
    {
      subscriptionName: 'Pro Plan',
      subscriptionType: 'Monthly',
      description: 'Access to all features and content',
      variant: 'Standard',
      currency: 'USD',
      price: 29.99,
      accessSetting: 'Public'
    },
    {
      subscriptionName: 'Premium Plan',
      subscriptionType: 'Annual',
      description: 'Everything in Pro, plus priority support',
      variant: 'Plus',
      currency: 'USD',
      price: 299.99,
      accessSetting: 'Private'
    },
    {
      subscriptionName: 'Basic Plan',
      subscriptionType: 'Monthly',
      description: 'Limited access to core features',
      variant: 'Basic',
      currency: 'EUR',
      price: 9.99,
      accessSetting: 'Public'
    },
    {
      subscriptionName: 'Enterprise Plan',
      subscriptionType: 'Custom',
      description: 'Tailored for large organizations',
      variant: 'Custom',
      currency: 'USD',
      price: 'Contact Us',
      accessSetting: 'Private'
    },
  ];
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setSubscriptionData(prev => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('New subscription:', subscriptionData);
  //   setIsModalOpen(false);
  
  // };
  return (
    <div className='select-none relative'>
      <Navbar heading="Subscription" />
      
      <div className="p-6 space-y-6">
        {/* Top Section */}
        <div className="flex justify-between items-start px-8">
          <div>
            <h2 className="text-xl font-semibold">Subscription</h2>
            <p className="text-sm text-gray-500">
              Explore the essence of your audience
            </p>
          </div>
        </div>

       
        <div className='w-full'>
          <ul className='w-full flex flex-col lg:flex-row gap-4'>
            <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>Total Subscriptions</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>12</p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#067647] bg-[#ECFDF3] border-[#ABEFC6]'>
                  <Icon icon="jam:arrow-up" width="18" height="24" style={{ color: '#17B26A' }} />
                  50
                </div>
              </div>
            </li>

            <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>Active Subscriptions</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>8</p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#067647] bg-[#ECFDF3] border-[#ABEFC6]'>
                  <Icon icon="jam:arrow-up" width="18" height="24" style={{ color: '#17B26A' }} />
                  7
                </div>
              </div>
            </li>

            <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>Expired Subscriptions</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>2</p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#B42318] bg-[#FEF3F2] border-[#FECDCA]'>
                  <Icon icon="charm:arrow-down" width="16" height="24" style={{ color: '#F04438' }} />
                  6
                </div>
              </div>
            </li>

              <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>Total Subscribers</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>850</p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#067647] bg-[#ECFDF3] border-[#ABEFC6]'>
                  <Icon icon="jam:arrow-up" width="18" height="24" style={{ color: '#17B26A' }} />
                  50
                </div>
              </div>
            </li>
          </ul>
        </div>

      
        <div className="flex flex-col justify-center items-center w-full py-20 px-4 text-center">
          <h3 className="text-xl font-semibold mb-2  text-[#101828]">Earn recurring revenue</h3>
          <p className="text-[#475467] mb-6 max-w-md">
            Subscriptions allow you to grow recurring revenue by charging subscribers on a regular basis
          </p>
          <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-transparent text-[#344054] font-bold border border-[#EAECF0]  px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            New Subscription
          </button>
        </div>
        

             {subscriptions.length > 0 && (
  <div className="overflow-x-auto rounded-[10px] mt-8">
    <table className="min-w-[700px] w-full border border-[#EAECF0] text-sm text-left bg-white">
      <thead className="text-xs text-[#475467] bg-[#F9FAFB] font-medium">
        <tr>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Type</th>
          <th className="px-6 py-3">Description</th>
          <th className="px-6 py-3">Variant</th>
          <th className="px-6 py-3">Currency</th>
          <th className="px-6 py-3">Price</th>
          <th className="px-6 py-3">Access Setting</th>
        </tr>
      </thead>
      <tbody>
        {subscriptionData.map((s, i) => (
          <tr key={i} className="border-b border-[#EAECF0]">
            <td className="px-6 py-4">{s.subscriptionName}</td>
            <td className="px-6 py-4">{s.subscriptionType}</td>
            <td className="px-6 py-4">{s.description}</td>
            <td className="px-6 py-4">{s.variant}</td>
            <td className="px-6 py-4">{s.currency}</td>
            <td className="px-6 py-4">{s.price}</td>
            <td className="px-6 py-4">{s.accessSetting}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

       <SubscriptionModal
        isModalOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      </div>
    </div>
  );
};

export default Subscription;