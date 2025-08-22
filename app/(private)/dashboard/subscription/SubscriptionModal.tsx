import React, { useState, useEffect , Fragment } from "react";
import { X ,  ChevronDown  , Check} from "lucide-react";
import { toast } from "react-toastify";
import { getAllProducts, getAllServices, getProductsBySpace, getServicesBySpace, GetSpaceId } from "@/app/Apis/publicapi";
import { Listbox, Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface SubscriptionModalProps {
  isModalOpen: boolean;
  onClose: () => void;
    onSave: (subscription: any) => void;
  spaceName?: string; // optional, to prefill a space name
}
const initialData = {
  products: [],
  services: [],
};
interface Space {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
}

interface Service {
    id: number;
    name: string;
}
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

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isModalOpen,
  onClose,
  onSave, 
  spaceName = "",
}) => {
  const [spaces, setSpaces] = useState<{ id: number; name: string }[]>([]);
 const [data, setData] = useState<any>(initialData);
      const [products, setProducts] = useState([]);
   const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(false);
   
    const [loadingSpaces, setLoadingSpaces] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingServices, setLoadingServices] = useState(false);
    const [spaceError, setSpaceError] = useState('');
    const [productError, setProductError] = useState('');
    const [serviceError, setServiceError] = useState('');
  const [formState, setFormState] = useState({
    space_id: "",
    space_name: spaceName,
    subscription_name: "",
    subscription_type: "General" as SubscriptionOption["value"],
    description: "",
    variant: "monthly",
    currency: "USD",
 price_per_month: "",
    access_type: "",
    discount_rate : "",
     product_ids: [] as number[],
  service_ids: [] as number[],
  });
 // Handle space dropdown change
    const handleSpaceChange = (e : any) => {
        const spaceId = e.target.value;
        const selectedSpace = spaces.find(s => String(s.id) === spaceId);
        setFormState(f => ({
            ...f,
            space_id: spaceId,
            space_name: selectedSpace?.name || "",
          product_ids: [], // ✅ fix here
    service_ids: [],
        }));
    };
  // Handle subscription type change (General, Product, Service)
    const handlesubscription_typeChange = (value : any) => {
        setFormState(f => ({
            ...f,
            subscription_type: value,
           product_ids: [], 
    service_ids: [],
        }));
    };
 useEffect(() => {
        const fetchSpaces = async () => {
            setLoadingSpaces(true);
            setSpaceError('');
            try {
                const res = await GetSpaceId();
                const spaceArray = res?.spaces;
                if (Array.isArray(spaceArray) && spaceArray.length > 0) {
                    const simplified = spaceArray.map(item => ({ id: item.id, name: item.name }));
                    setSpaces(simplified);
                    if (spaceName) {
                        const spaceToSelect = simplified.find(s => s.name === spaceName);
                        if (spaceToSelect) {
                            setFormState(f => ({ ...f, space_id: String(spaceToSelect.id), space_name: spaceToSelect.name }));
                        }
                    }
                } else {
                    setSpaceError('No spaces available');
                }
            } catch (err) {
                setSpaceError('Failed to load spaces. Please try again.');
            } finally {
                setLoadingSpaces(false);
            }
        };

        if (isModalOpen) {
            fetchSpaces();
        }
    }, [isModalOpen, spaceName]);// DEPENDENCY: This hook runs whenever the modal state changes.

useEffect(() => {
        const spaceIdNum = Number(formState.space_id);
        const subscription_type = formState.subscription_type;

        // Clear products/services if no space is selected or type is General
        if (!spaceIdNum || subscription_type === "General") {
            setProducts([]);
            setServices([]);
            return;
        }

        const fetchData = async () => {
            if (subscription_type === "Product") {
                setLoadingProducts(true);
                setProductError('');
                setServices([]); // Clear services list
                try {
                    const productsData = await getProductsBySpace(spaceIdNum);
                    setProducts(productsData);
                    if (productsData.length === 0) {
                        setProductError('No products available for this space.');
                    }
                } catch (err) {
                    setProductError('Failed to load products. Please try again.');
                } finally {
                    setLoadingProducts(false);
                }
            } else if (subscription_type === "Service") {
                setLoadingServices(true);
                setServiceError('');
                setProducts([]); // Clear products list
                try {
                    const servicesData = await getServicesBySpace(spaceIdNum);
                    setServices(servicesData);
                    if (servicesData.length === 0) {
                        setServiceError('No services available for this space.');
                    }
                } catch (err) {
                    setServiceError('Failed to load services. Please try again.');
                } finally {
                    setLoadingServices(false);
                }
            }
        };

        fetchData();
    }, [formState.space_id, formState.subscription_type]);


    
  // Your existing state and useEffect code
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");
    
    // Validation
    if (!formState.space_id || !formState.subscription_name || !formState.price_per_month) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Prepare payload
    const payload: any = {
      space_id: formState.space_id,
      space_name: formState.space_name,
      subscription_name: formState.subscription_name,
      subscription_type: formState.subscription_type,
      description: formState.description,
      variant: formState.variant,
      currency: formState.currency,
      price_per_month: formState.price_per_month,
      discount_rate: formState.discount_rate,
      access_setting: formState.access_type,
    };
    
 if (formState.subscription_type === "Product") {
  payload.product_ids = formState.product_ids ? formState.product_ids : [];
} else if (formState.subscription_type === "Service") {
  payload.service_ids = formState.service_ids ? formState.service_ids: [];
}

    console.log("Submitting payload:", payload);
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token);
      console.log("API endpoint:", `${BASE_URL}/api/create_subscription`);
      
      const res = await axios.post(
        `${BASE_URL}/api/create_subscription`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log("API response:", res.data);
          toast.success("Subscription saved successfully");
      const newSub = res.data.subscription || res.data; 
      onSave(newSub); 
      onClose(); 
      

    } catch (err: any) {
      console.error("API error:", err);
      alert(
        err?.response?.data?.message ||
          err.message ||
          "Failed to create subscription."
      );
       toast.error("Failed to save subscription ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
       <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 transition-all">
  <form onSubmit={handleSubmit} className="flex items-center justify-center w-full h-full">
    <div className="bg-white rounded-2xl w-[420px] max-h-[706px] shadow-lg border border-[#E2E4E84D] flex flex-col overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex justify-between items-center p-5 border-b border-[#F1F2F3] flex-shrink-0">
        <h2 
          className="text-lg font-semibold text-[#1D2939] font-inter"
          style={{
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "150%",
          }}
        >
          New Subscription
        </h2>

                <button
                  onClick={onClose}
                  className="flex items-center justify-center p-2 rounded-full border border-[#F1F2F3] bg-[#F6F8FA] hover:bg-gray-100 transition"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {/* Form content - your existing form fields */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 ">
           
              <div >
                <label className="block font-inter text-base tracking-normal  mb-1">
                  Space Name
                </label>
                <div className="relative">
                
              <select
                                className="w-full p-2.5 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                value={formState.space_id}
                                onChange={handleSpaceChange}
                                disabled={loadingSpaces}
                            >
                                <option value="">
                                    {loadingSpaces ? "Loading spaces..." : "Select the space the subscription is for"}
                                </option>
                                {spaces.map(space => (
                                    <option key={space.id} value={String(space.id)}>{space.name}</option>
                                ))}
                            </select>
              
  {/* <ChevronDown
    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600"
    size={22}
  /> */}
              </div></div>

          {/* Subscription Name + Type in one row */}
<div className="grid grid-cols-2 gap-4">
  
  <div>
    <label className="block font-inter text-base tracking-normal mb-1">
      Subscription Name
    </label>
    <input
      type="text"
      value={formState.subscription_name}
      onChange={(e) =>
        setFormState((f) => ({
          ...f,
          subscription_name: e.target.value,
        }))
      }
      placeholder="Enter name"
    className="w-full p-2.5 rounded-lg border border-[#D0D5DD]  text-black placeholder:text-[#98A2B3] placeholder:font-inter placeholder:text-base placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
  </div>

  {/* Subscription Type */}
  <div>
    <label className="block font-inter text-base tracking-normal mb-1">
      Subscription Type
    </label>
 


 <Listbox
        value={formState.subscription_type}
        onChange={handlesubscription_typeChange
        }
      >
       <div className="relative">
          <Listbox.Button className=" w-full flex justify-between items-center p-2.5 rounded-lg border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500">
             <span>
              {
                subscriptionOptions.find(
                  (opt) => opt.value === formState.subscription_type
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
          active ? "bg-indigo-50" : "bg-white "

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

        {formState.subscription_type === "Product" && (
                        <div className="mt-4">
                            <label className="block font-inter text-base tracking-normal text-gray-700 mb-1">Product</label>
                            <div className="relative">
                                <select
                                  multiple
  value={formState.product_ids.map(String)}
  onChange={(e) =>{
   
  setFormState(f => ({
      ...f,
      product_ids: Array.from(e.target.selectedOptions, opt => Number(opt.value)),
    }))}
  }
     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                    disabled={!formState.space_id || loadingProducts}
                                >
                                    <option value="">
                                        {!formState.space_id ? "Select a space first" : loadingProducts ? "Loading products..." : productError || (products.length === 0 ? "No products available" : "Search or select product from your inventory")}
                                    </option>
                                  {products?.map((product: any) => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>
                                {loadingProducts && <div className="absolute right-8 top-2.5"><Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin text-indigo-500" /></div>}
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600" size={20} />
                            </div>
                            {productError && <p className="text-sm text-red-600 mt-1">{productError}</p>}
                        </div>
                    )}

{formState.subscription_type === "Service" && (
  <div className="mt-4">
    <label className="block font-inter text-base tracking-normal mb-1">Select Service</label>
    <div className="relative">
      <select
    multiple  
  value={formState.service_ids.map(String)}
onChange={(e) => {
  const values = Array.from(e.target.selectedOptions, opt => Number(opt.value));
  
  setFormState(f => ({
    ...f,
    service_ids: values,
  }));
}}


        className="w-full p-2.5 pr-10 rounded-lg border text-[#98A2B3] border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
      >
        <option value="">Select a service</option>
        {services?.map((service: any) => (
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
                <label className="block font-inter text-base tracking-normal mb-1 ">
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
                  className="w-full p-2.5 rounded-lg border border-[#D0D5DD] text-black placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              {/* Variant */}
              <div>
                <label className="block font-inter text-base tracking-normal mb-1">Variant</label>
                <div className="relative">
                <select
                  value={formState.variant}
                  onChange={(e) =>
                    setFormState((f) => ({
                      ...f,
                      variant: e.target.value,
                    }))
                  }
                className="w-full p-2.5 pr-10 rounded-lg border text-black placeholder:text-[#98A2B3]border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
  >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
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
    <label className="block font-inter text-base tracking-normal mb-1">Currency</label>
    <div className="relative">
      <select
        value={formState.currency}
        onChange={(e) =>
          setFormState((f) => ({ ...f, currency: e.target.value }))
        }
        className="w-full p-2.5 pr-10 rounded-lg border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
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
    <label className="block font-inter text-base tracking-normal mb-1">
      Price per Month
    </label>
    <div className="relative">
      {/* Currency symbol on left */}
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]">
        {currencySymbols[formState.currency]}
      </span>

      <input
        type="number"
        value={formState.price_per_month}
        onChange={(e) =>
          setFormState((f) => ({ ...f, price_per_month: e.target.value }))
        }
        placeholder=""
        className="w-full pl-8 pr-10 p-2.5 rounded-lg border border-[#D0D5DD] text-black placeholder:text-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* /mo on right */}
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]">
        /mo
      </span>
    </div>
  </div>
</div>


          
            
<div>
  <label className="block font-inter text-base tracking-normal mb-2">
    Access Settings
  </label>
  <div className="space-y-2">
    {/* Free Access */}
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="access_type"
        value="free"
        checked={formState.access_type === "free"}
        onChange={() =>
          setFormState((f) => ({ ...f, access_type: "free" }))
        }
        className="accent-indigo-500"
      />
      <span>Free access to all products/services</span>
    </label>

    {/* Individual */}
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="access_type"
        value="individual"
        checked={formState.access_type === "individual"}
        onChange={() =>
          setFormState((f) => ({ ...f, access_type: "individual" }))
        }
        className="accent-indigo-500"
      />
      <span>Subscribers still pay individually</span>
    </label>

    {/* discount_rate */}
    <label className="flex items-center space-x-2">
      <input
        type="radio"
        name="access_type"
        value="discount_rate"
        checked={formState.access_type === "discount_rate"}
        onChange={() =>
          setFormState((f) => ({ ...f, access_type: "discount_rate" }))
        }
        className="accent-indigo-500"
      />
      <span>Subscribers get a discount_rate</span>
    </label>

    {/* Conditional discount_rate Input */}
    {formState.access_type === "discount_rate" && (
      <div className="mt-3">
        <label className="block font-inter text-base tracking-normal mb-1">
        Discount Percentage
        </label>
        <input
          type="number"
          value={formState.discount_rate || ""}
          onChange={(e) =>
            setFormState((f) => ({ ...f, discount_rate: e.target.value }))
          }
          placeholder="5%"
          className="w-full p-2.5 text-[#98A2B3] rounded-lg border border-[#D0D5DD] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    )}
  </div>
</div>

            </div>
           
            {/* <div className="flex  h-full justify-between items-center p-5 border-b border-[#F1F2F3]">
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
            </div> */}

            {/* Footer */}
            <div className="p-5 border-t border-[#F1F2F3]">
              <button
                 type="submit"
                  disabled={loading}
                className="w-full py-3 bg-[#685BC7] font-inter text-base tracking-normal text-white rounded-lg hover:bg-[#5747b9] focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
              {loading ? "Creating..." : "Save & Publish"}
              </button>
            </div>
          </div>
          </form>
        </div>
      )}
    </>
  );
};

export default SubscriptionModal;
