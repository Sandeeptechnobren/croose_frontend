
'use client';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import toast, { Toaster } from 'react-hot-toast';
import SendMessageModal from './SendMessageModal';
import { getBroadcastList, getTargetList, addBroadcast, updateBroadcast } from '@/app/Apis/publicapi';
import CustomDropdown from './CustomDropdown';


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
  const [editingId, setEditingId] = useState<number | string | null>(null);

  // Reset form
  const resetForm = () => {
    setSelectedTarget("");
    setFrequency("");
    setDate("");
    setContent("");
    setEditingId(null);
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
        target_id: Number(selectedTarget),
        frequency: frequency,
        content: content,
        scheduled_at: date
      }

      console.log("Sending payload:", payload)

      if (editingId) {
        await updateBroadcast(editingId, payload);
      } else {
        await addBroadcast(payload);
      }

      // Success
      setMessaging(false);
      resetForm();
      fetchBroadcastList(1); // Refresh list to first page
      toast.success(editingId ? "Broadcast updated successfully" : "New Broadcast created successfully", {
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

  // Handle edit
  const handleEdit = (broadcast: any) => {
    setEditingId(broadcast.id);
    setSelectedTarget(String(broadcast.target_id));
    setFrequency(broadcast.frequency?.toLowerCase() || "");
    // Convert date for datetime-local input
    const dateToUse = broadcast.scheduled_at || broadcast.date;
    if (dateToUse) {
      const dateObj = new Date(dateToUse);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      setDate(`${year}-${month}-${day}T${hours}:${minutes}`);
    } else {
      setDate("");
    }
    setContent(broadcast.content || "");
    setMessaging(true);
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
    <div className="flex-col w-full mt-0 bg-[#F9FAFB] min-h-screen pb-10">
      <Toaster />
      <section className="flex flex-col items-center gap-6 pt-8">

        <section className="w-[94%] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full sm:w-[75%] flex flex-col">
            <h1 className="font-Inter font-bold text-2xl sm:text-[24px] leading-[32px] text-[#101828]">
              Broadcast Management
            </h1>
            <p className="font-Inter font-normal text-[15px] leading-[22px] text-[#475467] mt-1">
              Manage your broadcast messages, schedules, and delivery status.
            </p>
          </div>
          <div className="w-full sm:w-auto flex flex-row items-center gap-3">
            {/* Send Message Button */}
            <button
              onClick={() => setSendOpen(true)}
              className="px-4 h-[44px] flex items-center justify-center bg-white border border-[#D0D5DD] gap-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
            >
              <Icon icon="lucide:send" width="18" height="18" className="text-[#344054]" />
              <span className="font-Inter font-semibold text-sm text-[#344054]">
                Send Message
              </span>
            </button>
            {/* New Broadcast Button */}
            <button
              onClick={() => {
                resetForm();
                setMessaging(true);
              }}
              className="px-6 h-[44px] flex items-center justify-center bg-[#685BC7] gap-2 rounded-lg cursor-pointer hover:bg-[#584db1] transition-all shadow-sm"
            >
              <Icon icon="lucide:plus" width="18" height="18" className="text-white" />
              <span className="font-Inter font-semibold text-sm text-white">
                New Broadcast
              </span>
            </button>
          </div>
        </section>

        {/* Table Section with Enhanced Design */}
        <div className="w-[94%] border border-[#EAECF0] rounded-[12px] bg-white shadow-sm overflow-hidden mb-6">
          {/* Mobile scroll hint */}
          <div className="sm:hidden px-4 py-2 text-xs text-[#475467] bg-[#F9FAFB] border-b border-[#EAECF0] flex items-center gap-2">
            <Icon icon="material-symbols:swipe-left" width="16" height="16" />
            Swipe left to see more columns
          </div>

          {/* Scrollable container */}
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full text-sm text-left bg-white">
              <thead className="text-[13px] text-[#475467] font-Inter bg-[#F9FAFB] border-b border-[#EAECF0] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold sticky left-0 bg-[#F9FAFB] z-10 w-[40px]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border-2 border-[#D0D5DD] rounded-[4px] accent-[#685BC7]"
                    />
                  </th>
                  <th className="px-6 py-4 font-semibold min-w-[300px] sticky left-4 bg-[#F9FAFB] z-10">Content</th>
                  <th className="px-6 py-4 font-semibold min-w-[160px]">Schedule Date</th>
                  <th className="px-6 py-4 font-semibold min-w-[120px]">Frequency</th>
                  <th className="px-6 py-4 font-semibold min-w-[120px]">Status</th>
                  <th className="px-6 py-4 font-semibold min-w-[140px]">Target Group</th>
                  <th className="px-6 py-4 font-semibold min-w-[100px] text-center">Actions</th>
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
                    <tr key={broadcast.id || index} className="group border-b border-[#EAECF0] hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-[#F9FAFB] z-10">
                        <input
                          type="checkbox"
                          className="w-4 h-4 border-2 border-[#D0D5DD] rounded-[4px] accent-[#685BC7]"
                        />
                      </td>
                      <td className="px-6 py-4 sticky left-4 bg-white group-hover:bg-[#F9FAFB] z-10">
                        <div className="text-[#101828] font-Inter font-medium text-[14px] leading-[20px] line-clamp-1 max-w-[400px]">
                          {broadcast.content || 'No content'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#475467] font-normal whitespace-nowrap">
                        {(broadcast.scheduled_at || broadcast.date) ? new Date(broadcast.scheduled_at || broadcast.date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        }) : 'Oct 24, 2024'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[#475467] font-medium px-2.5 py-1 bg-gray-100 rounded-full text-xs">
                          {broadcast.frequency || 'Once'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${broadcast.status === 'Scheduled'
                          ? 'bg-[#EFF8FF] text-[#175CD3] border border-[#B2DDFF]'
                          : 'bg-[#ECFDF3] text-[#067647] border border-[#ABEFC6]'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${broadcast.status === 'Scheduled' ? 'bg-[#175CD3]' : 'bg-[#067647]'
                            }`} />
                          {broadcast.status || 'Sent'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-[#344054] text-xs font-medium">
                          <Icon icon="lucide:users" width="14" height="14" className="mr-1.5 text-[#667085]" />
                          Target #{broadcast.target_id || '291'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(broadcast)}
                            className="p-2 hover:bg-[#F2F4F7] rounded-md transition-colors text-[#667085] hover:text-[#344054]"
                          >
                            <Icon icon="lucide:edit" width="18" height="18" />
                          </button>
                          <button className="p-2 hover:bg-[#F2F4F7] rounded-md transition-colors text-[#667085] hover:text-[#344054]">
                            <Icon icon="bi:three-dots-vertical" width="18" height="18" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer with Improved Pagination */}
          <div className="px-6 py-4 border-t border-[#EAECF0] bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
              {/* Left Button */}
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${pagination.current_page === 1
                  ? 'bg-white text-[#D0D5DD] border-[#F2F4F7] cursor-not-allowed'
                  : 'bg-white text-[#344054] border-[#D0D5DD] hover:bg-gray-50 shadow-sm'
                  }`}
              >
                <Icon icon="lucide:chevron-left" width="18" height="18" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {generatePageNumbers().map((pageNum, index) => (
                  <button
                    key={index}
                    onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                    className={`min-w-[40px] h-[40px] flex items-center justify-center rounded-lg text-sm font-medium transition-all ${pageNum === pagination.current_page
                      ? 'bg-[#F9F5FF] text-[#685BC7] font-semibold'
                      : pageNum === '...'
                        ? 'text-[#667085] cursor-default'
                        : 'text-[#667085] hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Right Button */}
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${pagination.current_page === pagination.last_page
                  ? 'bg-white text-[#D0D5DD] border-[#F2F4F7] cursor-not-allowed'
                  : 'bg-white text-[#344054] border-[#D0D5DD] hover:bg-gray-50 shadow-sm'
                  }`}
              >
                Next
                <Icon icon="lucide:chevron-right" width="18" height="18" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for New Broadcast - Refined Design */}
      {messaging && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-[#101828]/40 backdrop-blur-sm transition-all duration-300">
          <section className="relative z-[10000] w-full h-full flex justify-center items-center py-4 px-4 sm:py-8">
            <div className="relative w-full max-w-[640px] rounded-[16px] bg-white shadow-2xl overflow-hidden scale-in-center">
              {/* Header */}
              <header className="w-full flex justify-between items-center px-6 py-4 border-b border-[#EAECF0]">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#101828]">
                    {editingId ? "Edit Broadcast Message" : "New Broadcast Message"}
                  </h2>
                  <p className="text-sm text-[#475467] font-normal">
                    {editingId ? "Update your existing message." : "Schedule a new message for your customers."}
                  </p>
                </div>
                <button
                  onClick={() => setMessaging(false)}
                  className="p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  <Icon icon="lucide:x" width="20" height="20" className="text-[#667085]" />
                </button>
              </header>

              {/* Form Body */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Target */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#344054]">
                      Recipient Group
                    </label>
                    <CustomDropdown
                      value={selectedTarget}
                      onChange={(val: string) => setSelectedTarget(val)}
                      options={targetList.map((target: any) => ({ value: String(target.id || target.name), label: target.name || 'Unnamed Target' }))}
                      placeholder="Select group"
                    />
                  </div>

                  {/* Frequency */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#344054]">
                      Sending Frequency
                    </label>
                    <CustomDropdown
                      value={frequency}
                      onChange={(val: string) => setFrequency(val)}
                      options={[
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' },
                        { value: 'once', label: 'Once' },
                      ]}
                      placeholder="Select frequency"
                    />
                  </div>
                </div>

                {/* Schedule Date */}
                <div className="flex flex-col gap-1.5 mb-6">
                  <label className="text-sm font-medium text-[#344054]">
                    Schedule Date & Time
                  </label>
                  <div className="relative group">
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-lg border border-[#D0D5DD] bg-white text-[#101828] text-sm focus:border-[#685BC7] focus:ring-4 focus:ring-[#F4EBFF] outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5 mb-8">
                  <label className="text-sm font-medium text-[#344054]">
                    Message Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter message content..."
                    className="w-full h-32 px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-white text-[#101828] text-sm focus:border-[#685BC7] focus:ring-4 focus:ring-[#F4EBFF] outline-none transition-all resize-none"
                  />
                  <p className="text-xs text-[#667085] mt-1">Maximum 500 characters recommended.</p>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAECF0]">
                  <button
                    onClick={() => setMessaging(false)}
                    className="px-4 h-11 rounded-lg border border-[#D0D5DD] bg-white text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSchedule}
                    disabled={submitting}
                    className="px-6 h-11 rounded-lg bg-[#685BC7] text-sm font-semibold text-white hover:bg-[#584db1] transition-all shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Icon icon="eos-icons:loading" width="20" height="20" className="animate-spin" />
                    ) : (
                      <>
                        <Icon icon={editingId ? "lucide:save" : "lucide:calendar-check"} width="18" height="18" />
                        {editingId ? "Save Changes" : "Schedule Broadcast"}
                      </>
                    )}
                  </button>
                </div>
              </div>
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
