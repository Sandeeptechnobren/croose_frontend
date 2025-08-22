import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { HiDotsVertical } from "react-icons/hi";
import PurpleButton from "../../components/PurpleButton";
import SubscriptionModal from "./SubscriptionModal";
import ActionModal from "../../components/buttons/ActionModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ManageSubModalProps {
  isOpen: boolean;
  onClose: () => void;
    onNewSubscription: () => void;
}

interface ApiResponse {
  status: number;
  description: string;
  name: string;
  subscriptions_list: Subscription[];
}

interface Subscription {
  id: number;
  name: string;
  description: string;
  subscription_type: string;
  variant: string;
  price: string;
  status: string;
}

const ManageSubModal: React.FC<ManageSubModalProps> = ({ isOpen, onClose, onNewSubscription }) => {
  if (!isOpen) return null;
   const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
     const [activeActionId, setActiveActionId] = useState<number | null>(null); 
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSaveSubscription = (newSub: any) => {
    setSubscriptions((prev) => [...prev, newSub]);
  };
  
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `${BASE_URL}/api/subscription_list`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubscriptions(res.data.subscriptions_list || []);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed w-full min-w-[416px] h-auto inset-0 flex items-center justify-center z-50 bg-opacity-40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-payments-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-[500px] max-h-[90vh] flex flex-col p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-[#F1F2F3] pb-3">
          <h2 className="text-lg font-semibold" id="manage-payments-title">
            Manage Subscriptions
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center p-2 rounded-full border border-[#F1F2F3] bg-[#F6F8FA] hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <p className=" text-[#0F172A] font-inter text-medium mb-4 tracking-normal">
          Here's a list of all your subscriptions
        </p>

        {/* Scrollable container for subscriptions */}
        <div className="flex-grow  overflow-y-auto mb-4 pr-2 -mr-2">
          {loading && <p className="text-sm text-gray-500">Loading...</p>}

          {!loading && subscriptions.length > 0 ? (
            subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="border h-[138px] border-[#F1F2F3] rounded-xl p-4 mb-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                 <p className="font-medium tracking-tight text-[#020617] font-inter text-base">
  {sub.name}
</p>


                <button
  onClick={() =>
    setActiveActionId(activeActionId === sub.id ? null : sub.id)
  }
  className="p-2 rounded text-gray-400"
>
  <HiDotsVertical size={20} />
</button>

{activeActionId === sub.id && (
  <ActionModal
    isActionOpen={true}
    onClose={() => setActiveActionId(null)}
  />
)}

                </div>
                <p className="text-[#475467] font-inter text-base tracking-tight">{sub.description}</p>
                <span
                  className={`inline-block mt-3 px-4 py-2  font-inter text-base tracking-tight rounded-full border border-[#ABEFC6] ${
                    sub.status === "active"
                      ? "text-[#067647] bg-green-100 "
                      : "text-[#067647] bg-gray-200"
                  }`}
                >
                  {sub.status}
                </span>
              </div>
            ))
          ) : (
            !loading && (
              <p className="font-inter text-base tracking-normal text-gray-500">No subscriptions found.</p>
            )
          )}
        </div>

        <button 
          className="w-full py-3 bg-[#F1F5F9] text-[#0F172A] font-inter rounded-xl text-base font-semibold tracking-wide hover:bg-gray-100 cursor-pointer"
    onClick={onNewSubscription}
        >
          New Subscription
        </button>

     
      </div> 
    </div>
  );
};

export default ManageSubModal;