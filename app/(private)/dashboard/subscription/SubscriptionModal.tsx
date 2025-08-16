import React, { useState } from 'react';

interface SubscriptionModalProps {
  isModalOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isModalOpen, onClose }) => {
  const [subscriptionName, setSubscriptionName] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('General');
  const [description, setDescription] = useState('');
  const [variant, setVariant] = useState('Monthly');
  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState('');
  const [accessSetting, setAccessSetting] = useState('');

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[420px] max-h-[706px] overflow-y-auto shadow-xl">
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-5">New Subscription</h2>
              
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-2">Subscription Name</h3>
                <input
                  type="text"
                  value={subscriptionName}
                  onChange={(e) => setSubscriptionName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-2">Subscription Type</h3>
                <select
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Premium">Premium</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-2">Description</h3>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the service or benefits the members get"
                  className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div className="border-t border-gray-200 my-5"></div>
              
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-3">Variant</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="monthly"
                      name="variant"
                      value="Monthly"
                      checked={variant === 'Monthly'}
                      onChange={() => setVariant('Monthly')}
                      className="mr-2"
                    />
                    <label htmlFor="monthly">Monthly</label>
                  </div>
                  
                  <div className="ml-6 space-y-3">
                    <div>
                      <h4 className="text-xs font-medium mb-1">Currency</h4>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium mb-1">Price per Month</h4>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="$ /mo"
                        className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 my-5"></div>
              
              <div className="mb-5">
                <h3 className="text-sm font-medium mb-3">Access Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="freeAccess"
                      name="accessSetting"
                      value="free"
                      checked={accessSetting === 'free'}
                      onChange={() => setAccessSetting('free')}
                      className="mr-2"
                    />
                    <label htmlFor="freeAccess">Free access to all products/services</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="payIndividually"
                      name="accessSetting"
                      value="individual"
                      checked={accessSetting === 'individual'}
                      onChange={() => setAccessSetting('individual')}
                      className="mr-2"
                    />
                    <label htmlFor="payIndividually">Subscribers still pay individually</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="getDiscount"
                      name="accessSetting"
                      value="discount"
                      checked={accessSetting === 'discount'}
                      onChange={() => setAccessSetting('discount')}
                      className="mr-2"
                    />
                    <label htmlFor="getDiscount">Subscribers get a discount</label>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionModal;