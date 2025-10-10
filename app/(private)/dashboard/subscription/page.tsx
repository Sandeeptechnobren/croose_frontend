'use client';
import { Icon } from "@iconify/react";
import React from 'react';
import { HiDotsVertical } from "react-icons/hi";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import SubscriptionModal from "./SubscriptionModal";
import { DateSelectButton } from "../../components/DateSelectButton";
import PurpleButton from "../../components/PurpleButton";
import ManageSubModal from "./ManageSubModal";
import StatusBadge from "../../components/StatusBadge";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Subscription = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  //  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<SubscriptionStatistics | null>(null);
  const [date, setDate] = useState<{ appointmentTime: string }>({
    appointmentTime: "",
  });
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

  interface Subscriber {
    id: number;
    subscription_amount: string;
    subscription_name: string;
    status: string;
    start_date: string;
    end_date: string;
    customer_name: string;
  }

  interface ApiResponse {
    status: number;
    message: string;
    subscribers: Subscriber[];
  }
  interface SubscriptionStatistics {
    total_subscription: number;
    active_subscription: number;
    expired_subscription: number;
    total_subscribers: number;

  }
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchSubscriptionStatistics();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadStats();
  }, []);


  useEffect(() => {

    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiResponse>(
          `${BASE_URL}/api/subscribers_list`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubscribers(res.data.subscribers || []);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
        setSubscribers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);
  if (loading) return <p>Loading...</p>;
  // handle adding subscription
  const handleSaveSubscription = (newSub: any) => {
    setSubscribers((prev) => [...prev, newSub]);
  };

  const fetchSubscriptionStatistics = async (): Promise<SubscriptionStatistics> => {
    try {
      const res = await axios.get(`${BASE_URL}/api/subscriber_statistics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return res.data?.data || res.data || {};
    } catch (err) {
      console.error("Failed to fetch order stats:", err);
      throw err;
    }
  };
  return (
    <div className='select-none relative'>
      <Navbar heading="Subscription" />

      <div className="p-6 space-y-6">
        {/* Top Section */}
        <div className="flex justify-between items-start px-1 ">
          <div>
            <h2 className="text-xl font-semibold">Subscription</h2>
            <p className="text-sm text-gray-500">
              Explore the essence of your audience
            </p>
          </div>
          <div className="flex space-x-3">
            <DateSelectButton
              appointmentTime={date.appointmentTime}
              setDate={setDate}
            />
            <PurpleButton onClick={() => setIsManageModalOpen(true)}>
              Manage subscription
            </PurpleButton>

          </div>
        </div>



        <div className='w-full'>
          <ul className='w-full flex flex-col lg:flex-row gap-4'>
            <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>Total Subscriptions</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>
                  {stats ? stats.total_subscription : 0}

                </p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#067647] bg-[#ECFDF3] border-[#ABEFC6]'>
                  <Icon icon="jam:arrow-up" width="18" height="24" style={{ color: '#17B26A' }} />
                  50
                </div>
              </div>
            </li>

            <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>Active Subscriptions</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>
                  {stats ? stats.active_subscription : 0}
                </p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#067647] bg-[#ECFDF3] border-[#ABEFC6]'>
                  <Icon icon="jam:arrow-up" width="18" height="24" style={{ color: '#17B26A' }} />
                  7
                </div>
              </div>
            </li>

            <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>Expired Subscriptions</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>
                  {stats ? stats.expired_subscription : 0}
                </p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#B42318] bg-[#FEF3F2] border-[#FECDCA]'>
                  <Icon icon="charm:arrow-down" width="16" height="24" style={{ color: '#F04438' }} />
                  6
                </div>
              </div>
            </li>

            <li className='w-full lg:w-1/3 border-2 rounded-xl border-[#EAECF0] p-6'>
              <p className='text-[#475467] text-sm font-medium'>Total Subscribers</p>
              <div className='flex items-center justify-between mt-2'>
                <p className='font-semibold text-[#101828] text-3xl'>
                  {stats ? stats.total_subscribers : 0}
                </p>
                <div className='w-[71px] border rounded-full flex justify-center items-center gap-1 text-[#067647] bg-[#ECFDF3] border-[#ABEFC6]'>
                  <Icon icon="jam:arrow-up" width="18" height="24" style={{ color: '#17B26A' }} />
                  50
                </div>
              </div>
            </li>
          </ul>
        </div>





        {subscribers.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-[#EAECF0] mt-10">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#F9FAFB] text-[#475467] font-medium">
                <tr>

                  {/* <th className="px-4 py-3">Space Name</th> */}
                  <th className="px-4 py-3">Subscriber</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Subscription Cost</th>
                  <th className="px-4 py-3">Date Paid</th>
                  <th className="px-4 py-3">Subscription</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s, i) => (
                  <tr key={i} className="border-b border-[#EAECF0]  text-[#475467] font-medium font-inter text-[15px]">

                    {/* <td className="px-4 py-3 ">{s.space_name}</td> */}

                    <td className="px-4 py-3 ">{s.customer_name}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status?.toLowerCase() || ""} />
                    </td>
                    <td className="px-4 py-3 text-[#101828] font-inter font-semibold ">{s.subscription_amount}</td>

                    <td className="px-4 py-3">{s.start_date}</td>

                    <td className="px-4 py-3 ">{s.subscription_name}

                    </td>
                    <td className="px-4 py-3 "> <button

                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <HiDotsVertical size={20} />
                    </button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
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
        )}

        <SubscriptionModal
          isModalOpen={isModalOpen}
          onSave={handleSaveSubscription}

          onClose={() => setIsModalOpen(false)}
        />

        {isManageModalOpen ? (
          <ManageSubModal
            isOpen={isManageModalOpen}
            onClose={() => setIsManageModalOpen(false)}
            onNewSubscription={() => {
              setIsManageModalOpen(false);
              setTimeout(() => setIsSubscriptionModalOpen(true), 50);
            }}
          />
        ) : isSubscriptionModalOpen ? (
          <SubscriptionModal
            isModalOpen={isSubscriptionModalOpen}
            onSave={handleSaveSubscription}
            onClose={() => setIsSubscriptionModalOpen(false)}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Subscription;