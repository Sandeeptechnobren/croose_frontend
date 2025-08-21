

interface StatusBadgeProps {
  status: string; // coming from API
  value?: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, value }) => {
  let styles = {
    container: "w-fit border rounded-full flex justify-center items-center gap-1 px-3 py-1",
    border: "",
    bg: "",
    text: "",

  };

  switch (status.toLowerCase()) {
    case "active":
      styles = {
        ...styles,
        border: "border-[#ABEFC6]",
        bg: "bg-[#ECFDF3]",
    text: "font-inter font-medium text-[14px] leading-[18px] tracking-[0] text-center text-[#067647]",

  
      };
      break;

    case "inactive":
      styles = {
        ...styles,
        border: "border-[#FCA5A5]",
        bg: "bg-[#FEF2F2]",
        text: "text-[#B91C1C]",
    
      };
      break;

    case "expired":
      styles = {
        ...styles,
        border: "border-[#FCD34D]",
        bg: "bg-[#FFFBEB]",
        text: "text-[#92400E]",
       
      };
      break;

    default:
      styles = {
        ...styles,
        border: "border-gray-300",
        bg: "bg-gray-100",
        text: "text-gray-600",
      
      };
  }

  return (
    <div className={`${styles.container} ${styles.bg} ${styles.border} ${styles.text}`}>
     
      {value !== undefined ? value : status}
    </div>
  );
};

export default StatusBadge;
