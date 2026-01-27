import React from "react";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-[60] bg-transparent"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-[400px] p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-[#0F172A] mb-3">
                    {title}
                </h3>
                <p className="text-base text-[#475467] mb-6">
                    {message}
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2.5 border border-[#F1F2F3] bg-[#F6F8FA] text-[#0F172A] font-inter text-base font-semibold rounded-xl hover:bg-gray-200 transition cursor-pointer"
                    >
                        No
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2.5 bg-[#685BC7] text-white font-inter text-base font-semibold rounded-xl hover:bg-[#5547b3] transition cursor-pointer"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
