import React, { useState, useEffect , Fragment } from "react";
import { X ,  ChevronDown  , Check} from "lucide-react";
import { getAllProducts, getAllServices, GetSpaceId } from "@/app/Apis/publicapi";
import { Listbox, Transition } from "@headlessui/react";
interface SubscriptionModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  spaceName?: string; // optional, to prefill a space name
}
const initialData = {
  products: [],
  services: [],
};
interface SubscriptionOption {
  value: string;
  title: string;
  label: string;
  description: string;
}
const subscriptionOptions: SubscriptionOption[] = [
 {
    value: "General",
    label: "General",
    title: "General Subscription",
    description: "Non-specific subscription",
  },
  {
    value: "Product",
    label: "Product",
    title: "Product Subscription",
    description: "Subscription to a specific product in your inventory",
  },
  {
    value: "Service",
    label: "Service",
    title: "Service Subscription",
    description: "Subscription to a specific service",
  },
];
const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};
// const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isModalOpen,
  onClose,
  spaceName = "",
}) => {
  const [spaces, setSpaces] = useState<{ id: number; name: string }[]>([]);
 const [data, setData] = useState<any>(initialData);
  
  // ✅ one single form state object
  const [formState, setFormState] = useState({
    space_id: "",
    space_name: spaceName,
    subscriptionName: "",
    subscriptionType: "General" as SubscriptionOption["value"],
    description: "",
    variant: "Monthly",
    currency: "USD",
    price: "",
    accessSetting: "",
    discount : "",
     productId: "",
  serviceId: "",
  });

  useEffect(() => {
    const GetSpaceID = async () => {
      try {
        const res = await GetSpaceId();
        const spaceArray = res?.spaces;

        if (!Array.isArray(spaceArray)) {
          console.warn("Expected array response but got:", spaceArray);
          return;
        }

        const simplified = spaceArray.map((item: any) => ({
          id: item.id,
          name: item.name,
        }));

        setSpaces(simplified);
      } catch (err) {
        console.error("Failed to load space IDs", err);
      }
    };
    GetSpaceID();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productList, serviceList] = await Promise.all([
          getAllProducts(),
          getAllServices(),
        ]);
        setData({
          products: productList?.data || [],
          services: serviceList?.data || [],
        });
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 transition-all">
          <div className="bg-white rounded-2xl w-[420px] h-[706px] shadow-lg border border-[#E2E4E84D] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-[#F1F2F3]">
              <h2 className="text-lg font-semibold text-[#1D2939] font-inter"
              style={{
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "150%",
              }}>
                New Subscription
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center p-2 rounded-full border border-[#F1F2F3] bg-[#F6F8FA] hover:bg-gray-100 transition"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

       
            <div className="p-5 space-y-5 overflow-y-auto flex-1">
           
              <div >
                <label className="block text-sm font-medium mb-1">
                  Space Name
                </label>
                <div className="relative">
                <select
                   className="w-full p-2.5 pr-10 rounded-lg border text-[#98A2B3] border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
  
                  value={formState.space_id}
                  onChange={(e) => {
                    const space_id = e.target.value;
                    const selectedSpace = spaces.find(
                      (s) => String(s.id) === space_id
                    );
                    setFormState((f) => ({
                      ...f,
                      space_id,
                      space_name: selectedSpace?.name || "",
                    }));
                  }}
                >
                  <option value="">Select Space Name</option>
                  {spaces.map((space) => (
                    <option key={space.id} value={String(space.id)}>
                      {space.name}
                    </option>
                  ))}
                </select>
              
  <ChevronDown
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
    size={22}
  />
              </div></div>

          {/* Subscription Name + Type in one row */}
<div className="grid grid-cols-2 gap-4">
  
  <div>
    <label className="block text-sm font-medium mb-1">
      Subscription Name
    </label>
    <input
      type="text"
      value={formState.subscriptionName}
      onChange={(e) =>
        setFormState((f) => ({
          ...f,
          subscriptionName: e.target.value,
        }))
      }
      placeholder="Enter name"
      className="w-full p-2.5 rounded-lg border border-[#D0D5DD] text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Subscription Type */}
  <div>
    <label className="block text-sm font-medium mb-1">
      Subscription Type
    </label>
 


 <Listbox
        value={formState.subscriptionType}
        onChange={(val) =>
          setFormState((f: any) => ({ ...f, subscriptionType: val }))
        }
      >
       <div className="relative">
          <Listbox.Button className=" w-full flex justify-between items-center p-2.5 rounded-lg border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500">
             <span>
              {
                subscriptionOptions.find(
                  (opt) => opt.value === formState.subscriptionType
                )?.label 
              }
            </span>
            <ChevronDown className="text-gray-600" size={20} />
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options 
         className="absolute mt-1 min-w-[380px] w-auto bg-white opacity-100 border border-gray-200 rounded-lg shadow-lg 
              -translate-x-1/2"
>  {subscriptionOptions.map((opt: SubscriptionOption) => (

                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active }) =>
               `cursor-pointer select-none flex items-center justify-between p-3 rounded-xl last:border-b-0 ${
          active ? "bg-indigo-50" : "bg-white"

                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <p className="font-medium text-gray-900">{opt.title}</p>
                        <p className="text-xs text-gray-500  ">{opt.description}</p>
                      </div>
                      {selected && (
                        <span className="ml-2 flex-shrink-0 text-white  bg-[#685BC7] rounded-xl ">
                          <Check size={18} />
                        </span>
                      )}
                    </>
                  )}

                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
  </div>
</div>

{formState.subscriptionType === "Product" && (
  <div className="mt-4">
    <label className="block text-sm font-medium mb-1">Select Product</label>
    <div className="relative">
      <select
        value={formState.productId || ""}
        onChange={(e) =>
          setFormState((f) => ({ ...f, productId: e.target.value }))
        }
        className="w-full p-2.5 pr-10 rounded-lg border text-[#98A2B3] border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
      >
        <option value="">Select a product</option>
        {data.products.map((product: any) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
        size={22}
      />
    </div>
  </div>
)}

{formState.subscriptionType === "Service" && (
  <div className="mt-4">
    <label className="block text-sm font-medium mb-1">Select Service</label>
    <div className="relative">
      <select
        value={formState.serviceId || ""}
        onChange={(e) =>
          setFormState((f) => ({ ...f, serviceId: e.target.value }))
        }
        className="w-full p-2.5 pr-10 rounded-lg border text-[#98A2B3] border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
      >
        <option value="">Select a service</option>
        {data.services.map((service: any) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
        size={22}
      />
    </div>
  </div>
)}



              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1 ">
                  Description
                </label>
                <textarea
                  value={formState.description}
                  onChange={(e) =>
                    setFormState((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe the service or benefits the members get"
                  className="w-full p-2.5 rounded-lg border border-[#D0D5DD] text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              {/* Variant */}
              <div>
                <label className="block text-sm font-medium mb-1">Variant</label>
                <div className="relative">
                <select
                  value={formState.variant}
                  onChange={(e) =>
                    setFormState((f) => ({
                      ...f,
                      variant: e.target.value,
                    }))
                  }
                className="w-full p-2.5 pr-10 rounded-lg border text-[#98A2B3] border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
  >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
                  <ChevronDown
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
    size={22}
  />
             </div>
              </div>

              {/* Currency + Price */}
      


<div className="grid grid-cols-2 gap-3">
  {/* Currency Dropdown */}
  <div>
    <label className="block text-sm font-medium mb-1">Currency</label>
    <div className="relative">
      <select
        value={formState.currency}
        onChange={(e) =>
          setFormState((f) => ({ ...f, currency: e.target.value }))
        }
        className="w-full p-2.5 pr-10 rounded-lg border border-[#D0D5DD] text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
      >
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
        size={22}
      />
    </div>
  </div>

  {/* Price Input with prefix & suffix */}
  <div>
    <label className="block text-sm font-medium mb-1">
      Price per Month
    </label>
    <div className="relative">
      {/* Currency symbol on left */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]">
        {currencySymbols[formState.currency]}
      </span>

      <input
        type="number"
        value={formState.price}
        onChange={(e) =>
          setFormState((f) => ({ ...f, price: e.target.value }))
        }
        placeholder=""
        className="w-full pl-8 pr-10 p-2.5 rounded-lg border border-[#D0D5DD] text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* /mo on right */}
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]">
        /mo
      </span>
    </div>
  </div>
</div>


          
            
<div>
  <label className="block text-sm font-medium mb-2">
    Access Settings
  </label>
  <div className="space-y-2">
    {/* Free Access */}
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="accessSetting"
        value="free"
        checked={formState.accessSetting === "free"}
        onChange={() =>
          setFormState((f) => ({ ...f, accessSetting: "free" }))
        }
        className="accent-indigo-500"
      />
      <span>Free access to all products/services</span>
    </label>

    {/* Individual */}
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="accessSetting"
        value="individual"
        checked={formState.accessSetting === "individual"}
        onChange={() =>
          setFormState((f) => ({ ...f, accessSetting: "individual" }))
        }
        className="accent-indigo-500"
      />
      <span>Subscribers still pay individually</span>
    </label>

    {/* Discount */}
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="accessSetting"
        value="discount"
        checked={formState.accessSetting === "discount"}
        onChange={() =>
          setFormState((f) => ({ ...f, accessSetting: "discount" }))
        }
        className="accent-indigo-500"
      />
      <span>Subscribers get a discount</span>
    </label>

    {/* Conditional Discount Input */}
    {formState.accessSetting === "discount" && (
      <div className="mt-3">
        <label className="block text-sm font-medium mb-1">
          Discount Percentage
        </label>
        <input
          type="number"
          value={formState.discount || ""}
          onChange={(e) =>
            setFormState((f) => ({ ...f, discount: e.target.value }))
          }
          placeholder="5%"
          className="w-full p-2.5 text-[#98A2B3] rounded-lg border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    )}
  </div>
</div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-[#F1F2F3]">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#685BC7] text-white rounded-lg hover:bg-[#5747b9] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
