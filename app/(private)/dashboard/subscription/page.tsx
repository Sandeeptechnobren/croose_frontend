'use client';
import { Icon } from "@iconify/react";
import React from 'react';
import Navbar from "../../components/Navbar";
import { useState } from 'react';

const Subscription = () => {
      const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState({
    name: '',
    type: 'General',
    description: '',
    variant: 'Monthly',
    currency: 'USD',
    price: '',
    accessSetting: 'free' // 'free' | 'pay' | 'discount'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSubscriptionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New subscription:', subscriptionData);
    setIsModalOpen(false);
    // Add your API call here
  };
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

        {/* Middle Section - Subscription Cards */}
        <div className='w-full'>
          <ul className='w-full flex flex-col lg:flex-row gap-4'>
            <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>Total Subscriptions</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>100</p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#067647] bg-[#ECFDF3] border-[#ABEFC6]'>
                  <Icon icon="jam:arrow-up" width="18" height="24" style={{ color: '#17B26A' }} />
                  50
                </div>
              </div>
            </li>

            <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>New Subscriptions</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>30</p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#067647] bg-[#ECFDF3] border-[#ABEFC6]'>
                  <Icon icon="jam:arrow-up" width="18" height="24" style={{ color: '#17B26A' }} />
                  7
                </div>
              </div>
            </li>

            <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>Expired Subscriptions</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>10</p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#B42318] bg-[#FEF3F2] border-[#FECDCA]'>
                  <Icon icon="charm:arrow-down" width="16" height="24" style={{ color: '#F04438' }} />
                  6
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Bottom Section */}
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
        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          {/* Modal Container */}
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">New Subscription</h2>
                 <div className="flex flex-col justify-center items-center w-full py-20 px-4 text-center">
     
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Icon icon="mdi:close" width={24} />
                </button>
                </div>
              </div>

              {/* Form Content - Same as before */}
              <div className="space-y-4">
                <div>
                  <label className="block font-medium">Subscription Name</label>
                  <input
                    type="text"
                    name="name"
                    value={subscriptionData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full p-2 border rounded mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium">Subscription Type</label>
                  <select
                    name="type"
                    value={subscriptionData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded mt-1"
                  >
                    <option value="General">General</option>
                    <option value="Premium">Premium</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              {/* ... (rest of your form fields from previous example) ... */}

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Access Settings</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="accessSetting"
                      value="free"
                      checked={subscriptionData.accessSetting === 'free'}
                      onChange={handleInputChange}
                      id="free"
                    />
                    <label htmlFor="free">Free access to all products/services</label>
                  </div>
                  {/* Other radio options... */}
                </div>
              </div>

              {/* Form Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Subscription;