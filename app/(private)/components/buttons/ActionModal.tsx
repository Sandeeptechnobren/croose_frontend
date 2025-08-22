import {  Archive, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
interface ActionModalProps {
  isActionOpen: boolean;
  onClose: () => void;
}

export default function ActionModal({ isActionOpen, onClose }: ActionModalProps) {
     const modalRef = useRef<HTMLDivElement>(null);
     
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isActionOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActionOpen, onClose]);
  if (!isActionOpen) return null;

  return (
   <div ref={modalRef} className="absolute border border-[#F1F5F9] right-0 mt-2 w-40 rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50">
      <div className="py-2">
     <button className="flex w-full items-center gap-2 px-3 py-2 text-base font-inter tracking-normal text-[#020617] hover:bg-gray-100">
  <img src="/icons/Edit_Icon.svg" alt="Edit" className="h-5 w-5" />
  Edit
</button>
        <button className="flex w-full items-center gap-2 px-3 py-2 text-base font-inter tracking-normal text-[#020617] hover:bg-gray-100">
          <Archive className="h-5 w-5" />
          Archive
        </button>
        <button className="flex w-full items-center gap-2 px-3 py-2 text-base font-inter tracking-normal text-[#B42318] hover:bg-red-100">
          <Trash2 className="h-5 w-5" />
          Delete
        </button>
      </div>
    </div>
  );
}
