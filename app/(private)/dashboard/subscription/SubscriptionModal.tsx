import React, { useState, useEffect, Fragment } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { toast } from "react-toastify";
import { getAllProducts, getAllServices, getProductsBySpace, getServicesBySpace, GetSpaceId, createSubscription, updateSubscription } from "@/app/Apis/publicapi";
import { Icon } from "@iconify/react";
import CustomDropdown from "../../components/CustomDropdown";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
interface SubscriptionModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  onSave: (subscription: any) => void;
  spaceName?: string; // optional, to prefill a space name
  editData?: any; // subscription data for editing
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
  editData = null,
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
    discount_rate: "",
    product_ids: [] as number[],
    service_ids: [] as number[],
  });

  useEffect(() => {
    if (editData) {
      setFormState({
        space_id: String(editData.space_id),
        space_name: editData.space_name || "",
        subscription_name: editData.name || "",
        subscription_type: editData.subscription_type || "General",
        description: editData.description || "",
        variant: editData.variant || "monthly",
        currency: editData.currency || "USD",
        price_per_month: editData.price || "",
        access_type: (editData.access_type == 1) ? "free" : (editData.access_type == 2) ? "individual" : (editData.access_type == 3) ? "discount_rate" : "free",
        discount_rate: editData.discount_rate || "",
        product_ids: editData.product_ids || [],
        service_ids: editData.service_ids || [],
      });
    } else {
      setFormState({
        space_id: "",
        space_name: spaceName,
        subscription_name: "",
        subscription_type: "General",
        description: "",
        variant: "monthly",
        currency: "USD",
        price_per_month: "",
        access_type: "",
        discount_rate: "",
        product_ids: [],
        service_ids: [],
      });
    }
  }, [editData, isModalOpen, spaceName]);

  // Handle subscription type change (General, Product, Service)
  const handlesubscription_typeChange = (value: any) => {
    setFormState((f: any) => ({
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
    if (!formState.space_id || !formState.subscription_name || !formState.price_per_month || !formState.access_type) {
      toast.error("Please fill in all required fields (Space, Name, Price, and Access Settings)");
      return;
    }

    // Map access_type back to string values
    const mappedAccessType =
      formState.access_type === "free" ? "1" :
        formState.access_type === "individual" ? "2" :
          formState.access_type === "discount_rate" ? "3" : "";

    if (!mappedAccessType) {
      toast.error("Please select an Access Setting");
      return;
    }

    // Prepare payload
    const payload: any = {
      space_id: formState.space_id,
      space_name: formState.space_name,
      name: formState.subscription_name,
      subscription_type: formState.subscription_type,
      description: formState.description,
      variant: formState.variant,
      currency: formState.currency,
      price: Number(formState.price_per_month),
      discount_rate: Number(formState.discount_rate) || 0,
      access_type: Number(mappedAccessType),
    };

    if (formState.subscription_type === "Product") {
      payload.product_ids = formState.product_ids || [];
    } else if (formState.subscription_type === "Service") {
      payload.service_ids = formState.service_ids || [];
    }

    console.log("Submitting payload:", payload);

    setLoading(true);
    try {
      let res;

      if (editData) {
        if (!editData.id) {
          console.error("Missing subscription ID in editData:", editData);
          toast.error("Error: Subscription ID is missing. Please try closing and reopening the list.");
          setLoading(false);
          return;
        }
        res = await updateSubscription(editData.id, payload);
      } else {
        res = await createSubscription(payload);
      }

      toast.success(editData ? "Subscription updated successfully" : "Subscription saved successfully");
      const newSub = res.subscription || res;
      onSave(newSub);
      onClose();


    } catch (err: any) {
      console.error("API error:", err);
      toast.error(
        err?.response?.data?.message ||
        err.message ||
        "Failed to save subscription"
      );
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
                  {editData ? "Edit Subscription" : "New Subscription"}
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

                <div>
                  <label className="block font-inter text-base tracking-normal  mb-1">
                    Space Name
                  </label>
                  <CustomDropdown
                    value={formState.space_id}
                    onChange={(spaceId) => {
                      const selectedSpace = spaces.find(s => String(s.id) === spaceId);
                      setFormState(f => ({
                        ...f,
                        space_id: spaceId,
                        space_name: selectedSpace?.name || "",
                        product_ids: [],
                        service_ids: [],
                      }));
                    }}
                    options={spaces.map(s => ({ value: String(s.id), label: s.name }))}
                    placeholder="Select the space the subscription is for"
                    loading={loadingSpaces}
                    disabled={loadingSpaces}
                  />
                </div>

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
                  <div className="mb-8">
                    <label className="block font-inter text-base tracking-normal mb-1">
                      Subscription Type
                    </label>

                    <CustomDropdown
                      value={formState.subscription_type}
                      onChange={handlesubscription_typeChange}
                      options={subscriptionOptions}
                      showDescriptions={true}
                      optionsClassName="min-w-[380px] w-auto -translate-x-1/2"
                    />
                  </div>
                </div>

                {formState.subscription_type === "Product" && (
                  <div className="mt-4">
                    <label className="block font-inter  text-base tracking-normal text-gray-700 mb-1">Product</label>
                    <CustomDropdown
                      value={formState.product_ids.map(String)}
                      onChange={(values: string[]) => {
                        setFormState((f: any) => ({
                          ...f,
                          product_ids: values.map(Number),
                        }))
                      }}
                      options={products.map((product: any) => ({ value: String(product.id), label: product.name }))}
                      placeholder={!formState.space_id ? "Select a space first" : loadingProducts ? "Loading products..." : productError || (products.length === 0 ? "No products available" : "Search or select product from your inventory")}
                      loading={loadingProducts}
                      disabled={!formState.space_id || loadingProducts}
                      multiple={true}
                    />
                    {productError && <p className="text-sm text-red-600 mt-1">{productError}</p>}
                  </div>
                )}

                {formState.subscription_type === "Service" && (
                  <div className="mt-4">
                    <label className="block font-inter text-base tracking-normal mb-1">Select Service</label>
                    <CustomDropdown
                      value={formState.service_ids.map(String)}
                      onChange={(values: string[]) => {
                        setFormState((f: any) => ({
                          ...f,
                          service_ids: values.map(Number),
                        }));
                      }}
                      options={services.map((service: any) => ({ value: String(service.id), label: service.name }))}
                      placeholder="Select a service"
                      loading={loadingServices}
                      disabled={loadingServices}
                      multiple={true}
                    />
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
                  <CustomDropdown
                    value={formState.variant}
                    onChange={(value) =>
                      setFormState((f) => ({
                        ...f,
                        variant: value,
                      }))
                    }
                    options={[
                      { value: "monthly", label: "Monthly" },
                      { value: "yearly", label: "Yearly" },
                    ]}
                  />
                </div>

                {/* Currency + Price */}



                <div className="grid grid-cols-2 gap-3">
                  {/* Currency Dropdown */}
                  <div>
                    <label className="block font-inter text-base tracking-normal mb-1">Currency</label>
                    <CustomDropdown
                      value={formState.currency}
                      onChange={(value) =>
                        setFormState((f) => ({ ...f, currency: value }))
                      }
                      options={[
                        { value: "USD", label: "USD ($)" },
                        { value: "EUR", label: "EUR (€)" },
                        { value: "GBP", label: "GBP (£)" },
                      ]}
                    />
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
                    {/* <label className="flex items-center space-x-2">
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
                    </label> */}

                    {/* Individual */}
                    {/* <label className="flex items-center space-x-2">
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
                    </label> */}

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