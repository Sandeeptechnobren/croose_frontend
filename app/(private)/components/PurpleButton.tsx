import React from "react";

interface PurpleButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const PurpleButton: React.FC<PurpleButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="bg-[#F9F5FF] text-[#685BC7] hover:bg-violet-200 px-4 py-2 rounded-md whitespace-nowrap hover:cursor-pointer"
      style={{
        display: "flex",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0%",
        color: "#685BC7",
      }}
    >
      {children}
    </button>
  );
};

export default PurpleButton;
