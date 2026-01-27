import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { HiDotsVertical } from "react-icons/hi";
import PurpleButton from "../../components/PurpleButton";
import SubscriptionModal from "./SubscriptionModal";
import ActionModal from "../../components/buttons/ActionModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import { toast } from "react-toastify";
import { getSubscriptions, archiveSubscription, deleteSubscription, UnarchiveSubscription } from "../../../Apis/publicapi";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ManageSubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSubscription: () => void;
}

interface ApiResponse {
  status: boolean;
  filter: string;
  data: Subscription[];
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
  const [showArchived, setShowArchived] = useState(0); // 0 for active, 1 for archived
  const [editingSubscription, setEditingSubscription] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingUnarchiveId, setPendingUnarchiveId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [pendingArchiveId, setPendingArchiveId] = useState<number | null>(null);

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

  const handleDelete = async (id: number) => {
    setPendingDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    setShowDeleteModal(false);
    try {
      await deleteSubscription(pendingDeleteId);
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== pendingDeleteId));
      toast.success("Subscription deleted successfully");
    } catch (err) {
      console.error("Error deleting subscription:", err);
      toast.error("Failed to delete subscription");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPendingDeleteId(null);
  };

  const handleArchive = async (id: number) => {
    // Show confirmation dialog for unarchive
    if (showArchived === 1) {
      setPendingUnarchiveId(id);
      setShowConfirmModal(true);
      return;
    }

    // Show confirmation dialog for archive
    setPendingArchiveId(id);
    setShowArchiveModal(true);
  };

  const confirmArchive = async () => {
    if (pendingArchiveId === null) return;
    setShowArchiveModal(false);
    try {
      await archiveSubscription(pendingArchiveId);
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== pendingArchiveId));
      toast.success("Subscription archived successfully");
    } catch (err) {
      console.error("Error archiving subscription:", err);
      toast.error("Failed to archive subscription");
    } finally {
      setPendingArchiveId(null);
    }
  };

  const cancelArchive = () => {
    setShowArchiveModal(false);
    setPendingArchiveId(null);
  };

  const confirmUnarchive = async () => {
    if (pendingUnarchiveId === null) return;

    setShowConfirmModal(false);

    try {
      await UnarchiveSubscription(pendingUnarchiveId);
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== pendingUnarchiveId));
      toast.success("Subscription unarchived successfully");
    } catch (err) {
      console.error("Error unarchiving subscription:", err);
      toast.error("Failed to unarchive subscription");
    } finally {
      setPendingUnarchiveId(null);
    }
  };

  const cancelUnarchive = () => {
    setShowConfirmModal(false);
    setPendingUnarchiveId(null);
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsModalOpen(true);
  };

  const handleUpdateList = (updatedSub: any) => {
    setSubscriptions((prev) => {
      const exists = prev.find(s => s.id === updatedSub.id);
      if (exists) {
        return prev.map(s => s.id === updatedSub.id ? updatedSub : s);
      }
      return [...prev, updatedSub];
    });
  };

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const res = await getSubscriptions(showArchived);
        setSubscriptions(res.data || []);
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [showArchived]);

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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center cursor-pointer justify-center p-2 rounded-full border border-[#F1F2F3] bg-[#F6F8FA] hover:bg-gray-100 transition"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className=" text-[#0F172A] font-inter text-medium tracking-normal mb-2">
            Here's a list of all your {showArchived === 0 ? "active" : "archived"} subscriptions
          </p>
          <button
            type="button"
            onClick={() => setShowArchived(showArchived === 0 ? 1 : 0)}
            className="px-4 py-2 bg-[#F6F8FA] border border-[#F1F2F3] text-[#685BC7] font-inter text-sm font-semibold rounded-xl hover:bg-gray-100 transition cursor-pointer"
          >
            {showArchived === 0 ? "Show Archived" : "Show Active"}
          </button>
        </div>

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
                      onArchive={() => handleArchive(sub.id)}
                      onDelete={() => handleDelete(sub.id)}
                      onEdit={() => handleEdit(sub)}
                      isArchived={showArchived === 1}
                    />
                  )}

                </div>
                <p className="text-[#475467] font-inter text-base tracking-tight">{sub.description}</p>
                <span
                  className={`inline-block mt-3 px-4 py-2  font-inter text-base tracking-tight rounded-full border border-[#ABEFC6] ${sub.status === "active"
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
          onClick={() => {
            setEditingSubscription(null);
            setIsModalOpen(true);
          }}
        >
          New Subscription
        </button>

        {isModalOpen && (
          <SubscriptionModal
            isModalOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingSubscription(null);
            }}
            onSave={handleUpdateList}
            editData={editingSubscription}
          />
        )}

        <ConfirmationModal
          isOpen={showConfirmModal}
          title="Unarchive Subscription"
          message="Are you sure you want to unarchive this subscription?"
          onConfirm={confirmUnarchive}
          onCancel={cancelUnarchive}
        />

        <ConfirmationModal
          isOpen={showDeleteModal}
          title="Delete Subscription"
          message="Are you sure you want to delete this subscription? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />

        <ConfirmationModal
          isOpen={showArchiveModal}
          title="Archive Subscription"
          message="Are you sure you want to archive this subscription?"
          onConfirm={confirmArchive}
          onCancel={cancelArchive}
        />
      </div>
    </div>
  );
};

export default ManageSubModal;