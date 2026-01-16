
'use client';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import toast, { Toaster } from 'react-hot-toast';
import SendMessageModal from './SendMessageModal';
import { getBroadcastList, getTargetList, addBroadcast } from '@/app/Apis/publicapi';


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
  const [sendOpen, setSendOpen] = useState(false);
  const [broadcastData, setBroadcastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 1,
    total: 0
  });

  const [targetList, setTargetList] = useState<any[]>([]);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [frequency, setFrequency] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Reset form
  const resetForm = () => {
    setSelectedTarget("");
    setFrequency("");
    setDate("");
    setContent("");
  };

  // Handle schedule broadcast
  // Handle schedule broadcast
  const handleSchedule = async () => {
    if (!selectedTarget || !frequency || !date || !content) {
      toast.error("Please fill in all fields", {
        position: 'top-center',
        style: {
          background: 'red',
          color: 'white',
        }
      });
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        target_id: selectedTarget,
        frequency: frequency,
        content: content,
        scheduled_at: date
      }

      console.log("Sending payload:", payload)

      await addBroadcast(payload);

      // Success
      setMessaging(false);
      resetForm();
      fetchBroadcastList(1); // Refresh list to first page
      toast.success("New Broadcast create successfull", {
        position: 'top-center',
        style: {
          background: 'green',
          color: 'white',
        }
      });
    } catch (error) {
      toast.error("Failed to schedule broadcast. Please try again.", {
        position: 'top-center',
        style: {
          background: 'red',
          color: 'white',
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch targets when modal opens
  useEffect(() => {
    if (messaging) {
      const fetchTargets = async () => {
        try {
          const res = await getTargetList();
          console.log('Target list response:', res);
          // Handle different response structures gracefully
          setTargetList(res?.data || res || []);
        } catch (error) {
          console.error('Error fetching target list:', error);
          setTargetList([]);
        }
      };

      fetchTargets();
    }
  }, [messaging]);

  // Fetch broadcast list
  const fetchBroadcastList = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await getBroadcastList();
      console.log('Broadcast list response:', response);

      // Extract data and pagination info
      if (response?.data) {
        setBroadcastData(response.data.data || response.data || []);

        // Extract pagination metadata
        setPagination({
          current_page: response.data.current_page || 1,
          last_page: response.data.last_page || 1,
          from: response.data.from || 1,
          to: response.data.to || 0,
          total: response.data.total || 0
        });
      } else {
        setBroadcastData([]);
      }
    } catch (error) {
      console.error('Error fetching broadcast list:', error);
      setBroadcastData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBroadcastList();
  }, []);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      fetchBroadcastList(newPage);
    }
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const { current_page, last_page } = pagination;

    if (last_page <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      if (current_page > 3) {
        pages.push('...');
      }

      // Show pages around current page
      for (let i = Math.max(2, current_page - 1); i <= Math.min(last_page - 1, current_page + 1); i++) {
        pages.push(i);
      }

      if (current_page < last_page - 2) {
        pages.push('...');
      }

      // Show last page
      pages.push(last_page);
    }

    return pages;
  };

  return (
    <div className=" flex-col w-full mt-0 bg-white">
      <Toaster />
      <section className="flex flex-col items-center gap-2 mt-0">
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
            <div onClick={() => setSendOpen(true)} className="w-full cursor-pointer sm:w-[135px] h-[36px] flex items-center justify-center bg-[#F1F0FA] gap-[10px] px-[16px] py-[8px] rounded-lg">
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#475467]">
                      Loading broadcast list...
                    </td>
                  </tr>
                ) : broadcastData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#475467]">
                      No broadcast messages found
                    </td>
                  </tr>
                ) : (
                  broadcastData.map((broadcast: any, index: number) => (
                    <tr key={broadcast.id || index} className="border-b border-[#EAECF0]">
                      <td className="px-3 sm:px-6 py-4 min-w-[250px] sticky left-0 bg-white z-10">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="appearance-none w-4 h-4 border-2 border-[#D0D5DD] rounded-[4px] checked:bg-[#D0D5DD] checked:border-[#D0D5DD] flex-shrink-0"
                          />
                          <div className="text-[#101828] font-Inter font-medium text-[14px] leading-[20px] line-clamp-2">
                            {broadcast.content || 'No content'}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 min-w-[140px] whitespace-nowrap">
                        {broadcast.date ? new Date(broadcast.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        }) : 'N/A'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-[#475467] min-w-[100px]">
                        {broadcast.frequency || 'N/A'}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-[#475467] min-w-[100px]">
                        <div className="inline-flex w-fit items-center border rounded-full font-inter font-semibold text-[12px] leading-[18px] bg-[#ECFDF3] text-[#067647] border-[#ABEFC6]">
                          <span className="flex items-center justify-center pl-1">
                            <Icon icon="uil:arrow-up" width="20" height="20" />
                          </span>
                          <span className="px-2 py-[2px]">Sent</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-[#475467] min-w-[120px]">
                        <div className="inline-flex w-fit items-center border rounded-full font-inter font-semibold text-[12px] leading-[18px] bg-[#EFF8FF] text-[#175CD3] border-[#B2DDFF]">
                          <span className="px-2 py-[2px]">Target #{broadcast.target_id || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-[#475467] min-w-[50px]">
                        <Icon icon="bi:three-dots-vertical" width="16" height="16" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer - moved outside the scrollable area */}
          <div className="px-3 sm:px-6 py-4 border-t border-[#EAECF0] bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 w-full">
              {/* Left Button */}
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className={`px-4 py-2 text-sm rounded-md flex gap-2 ${pagination.current_page === 1
                  ? 'bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed'
                  : 'bg-[#F2F4F7] text-[#344054] cursor-pointer hover:bg-[#E4E7EC]'
                  }`}
              >
                <Icon
                  icon="meteor-icons:arrow-left"
                  width="20"
                  height="20"
                />
                Previous
              </button>

              {/* Center Count - Dynamic pagination */}
              <div className="flex gap-[2px] items-center">
                {generatePageNumbers().map((pageNum, index) => (
                  <div
                    key={index}
                    onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                    className={`h-[40px] w-[40px] flex justify-center items-center rounded ${pageNum === pagination.current_page
                      ? 'bg-[#685BC7] text-white font-semibold'
                      : pageNum === '...'
                        ? 'bg-transparent text-[#475467] cursor-default'
                        : 'bg-[#F9FAFB] text-[#475467] cursor-pointer hover:bg-[#E4E7EC]'
                      }`}
                  >
                    {pageNum}
                  </div>
                ))}

                {/* Page info */}
                <span className="ml-3 text-sm text-[#475467] hidden sm:block">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
              </div>

              {/* Right Button */}
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className={`px-4 py-2 text-sm rounded-md flex gap-2 ${pagination.current_page === pagination.last_page
                  ? 'bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed'
                  : 'bg-[#F2F4F7] text-[#344054] cursor-pointer hover:bg-[#E4E7EC]'
                  }`}
              >
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
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-[#18181B1F]">
          {/* Backdrop - intentionally no onClick handler to prevent closing */}
          <div className="absolute inset-0 z-[9998]"></div>

          <section className="relative z-[10000] w-full h-full flex justify-center items-center py-4 px-2 sm:py-8 pointer-events-none">
            <div className="relative w-full max-w-[717px] mx-4 rotate-0 opacity-100 rounded-[16px] border border-solid bg-[#ffffff] border-[#E2E4E84D] overflow-y-auto max-h-[90vh] pointer-events-auto shadow-xl">
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
                      <div className="relative h-[44px]">
                        <select
                          value={selectedTarget}
                          onChange={(e) => setSelectedTarget(e.target.value)}
                          className="w-full h-full rounded-[12px] border border-[#D0D5DD] px-[16px] font-normal text-[14px] leading-[20px] font-sans focus:outline-none appearance-none bg-white text-[#101828]"
                        >
                          <option value="" disabled>Select target</option>
                          {targetList.map((target: any, index: number) => (
                            <option key={index} value={target.id || target.name}>
                              {target.name || 'Unnamed Target'}
                            </option>
                          ))}
                        </select>
                        <Icon
                          icon="ri:arrow-down-s-line"
                          width="24"
                          height="24"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#344054] pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Frequency */}
                    <div className="flex-1">
                      <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">
                        Frequency
                      </label>
                      <div className="relative h-[44px]">
                        <select
                          value={frequency}
                          onChange={(e) => setFrequency(e.target.value)}
                          className="w-full h-full rounded-[12px] border border-[#D0D5DD] px-[16px] font-normal text-[14px] leading-[20px] font-sans focus:outline-none appearance-none bg-white text-[#101828]"
                        >
                          <option value="" disabled>Select frequency</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="once">Once</option>
                        </select>
                        <Icon
                          icon="ri:arrow-down-s-line"
                          width="24"
                          height="24"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#344054] pointer-events-none"
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
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="flex-1 bg-transparent outline-none border-none font-normal text-[14px] leading-[20px] font-sans text-[#101828]"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block mb-1 font-medium text-[14px] leading-[20px] text-[#344054]">
                      Content
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Add content"
                      className="w-full h-[79px] resize-none rounded-[12px] border border-[#D0D5DD] px-[16px] py-2 font-normal text-[14px] leading-[20px] font-sans focus:outline-none text-[#101828]"
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
                  <button
                    onClick={handleSchedule}
                    disabled={submitting}
                    className="w-full sm:w-[161px] h-[40px] rounded-lg bg-[#685BC7] px-[16px] font-semibold text-sm leading-5 text-center font-sans text-white disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
                      <Icon icon="eos-icons:loading" width="20" height="20" className="animate-spin" />
                    ) : (
                      'Schedule'
                    )}
                  </button>
                </div>
              </section>
            </div>
          </section>


        </div>
      )}
      {/* Send Message Modal */}
      <SendMessageModal
        isOpen={sendOpen}
        onClose={() => setSendOpen(false)}
      />
    </div>
  );
};

export default Page;
