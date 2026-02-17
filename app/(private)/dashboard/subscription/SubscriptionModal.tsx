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
  currency?: string;
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
  INR: "₹",
};

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isModalOpen,
  onClose,
  onSave,
  spaceName = "",
  editData = null,
}) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
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
        currency: "",
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
          const simplified: Space[] = spaceArray.map(item => ({
            id: item.id,
            name: item.name,
            currency: item.currency
          }));
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
  }, [isModalOpen, spaceName]);

  useEffect(() => {
    const spaceIdNum = Number(formState.space_id);
    const subscription_type = formState.subscription_type;

    if (!spaceIdNum || subscription_type === "General") {
      setProducts([]);
      setServices([]);
      return;
    }

    const fetchData = async () => {
      if (subscription_type === "Product") {
        setLoadingProducts(true);
        setProductError('');
        setServices([]);
        try {
          const productsData = await getProductsBySpace(spaceIdNum);
          setProducts(productsData);
        } catch (err) {
          setProductError('Failed to load products.');
        } finally {
          setLoadingProducts(false);
        }
      } else if (subscription_type === "Service") {
        setLoadingServices(true);
        setServiceError('');
        setProducts([]);
        try {
          const servicesData = await getServicesBySpace(spaceIdNum);
          setServices(servicesData);
        } catch (err) {
          setServiceError('Failed to load services.');
        } finally {
          setLoadingServices(false);
        }
      }
    };

    fetchData();
  }, [formState.space_id, formState.subscription_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.space_id || !formState.subscription_name || !formState.price_per_month || !formState.access_type) {
      toast.error("Please fill in all required fields");
      return;
    }

    const mappedAccessType =
      formState.access_type === "free" ? "1" :
        formState.access_type === "individual" ? "2" :
          formState.access_type === "discount_rate" ? "3" : "";

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

    setLoading(true);
    try {
      let res;
      if (editData) {
        res = await updateSubscription(editData.id, payload);
      } else {
        res = await createSubscription(payload);
      }
      toast.success(editData ? "Updated successfully" : "Saved successfully");
      onSave(res.subscription || res);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-[#101828]/40 backdrop-blur-sm transition-all duration-300">
          <form onSubmit={handleSubmit} className="relative z-[10000] w-full h-full flex justify-center items-center py-4 px-4 sm:py-8">
            <div className="relative w-full max-w-[500px] rounded-[24px] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] scale-in-center">
              {/* Header */}
              <header className="flex justify-between items-center px-8 py-6 border-b border-[#EAECF0]">
                <div>
                  <h2 className="text-[20px] font-bold text-[#101828] font-inter leading-tight">
                    {editData ? "Edit Subscription" : "Create Subscription"}
                  </h2>
                  <p className="text-sm text-[#475467] mt-1 font-normal">Set up your new subscription plan details.</p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2.5 rounded-full bg-[#F9FAFB] border border-[#EAECF0] hover:bg-[#F2F4F7] transition-all"
                >
                  <X className="w-4 h-4 text-[#667085]" />
                </button>
              </header>

              {/* Form content */}
              <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                {/* Space Selection */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#344054] flex items-center gap-1.5">
                    <Icon icon="lucide:layout-grid" width="16" height="16" className="text-[#667085]" />
                    Space Context
                  </label>
                  <CustomDropdown
                    value={formState.space_id}
                    onChange={(spaceId) => {
                      const selectedSpace = spaces.find(s => String(s.id) === spaceId);
                      setFormState(f => ({
                        ...f,
                        space_id: spaceId,
                        space_name: selectedSpace?.name || "",
                        currency: selectedSpace?.currency || f.currency,
                        product_ids: [],
                        service_ids: [],
                      }));
                    }}
                    options={spaces.map(s => ({ value: String(s.id), label: s.name }))}
                    placeholder="Select space"
                    loading={loadingSpaces}
                    disabled={loadingSpaces}
                  />
                </div>

                {/* Name and Type Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#344054]">
                      Plan Name
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
                      placeholder="e.g. Premium Plan"
                      className="w-full h-11 px-3.5 rounded-lg border border-[#D0D5DD] bg-white text-[#101828] text-sm focus:border-[#685BC7] focus:ring-4 focus:ring-[#F4EBFF] outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#344054]">
                      Plan Type
                    </label>
                    <CustomDropdown
                      value={formState.subscription_type}
                      onChange={handlesubscription_typeChange}
                      options={subscriptionOptions}
                      showDescriptions={true}
                    />
                  </div>
                </div>

                {/* Conditional Fields */}
                {formState.subscription_type === "Product" && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-sm font-semibold text-[#344054]">Associated Products</label>
                    <CustomDropdown
                      value={formState.product_ids.map(String)}
                      onChange={(values: string[]) => {
                        setFormState((f: any) => ({
                          ...f,
                          product_ids: values.map(Number),
                        }))
                      }}
                      options={products.map((product: any) => ({ value: String(product.id), label: product.name }))}
                      placeholder={!formState.space_id ? "Select space first" : loadingProducts ? "Loading..." : "Select products"}
                      loading={loadingProducts}
                      disabled={!formState.space_id || loadingProducts}
                      multiple={true}
                    />
                  </div>
                )}

                {formState.subscription_type === "Service" && (
                  <div className="space-y-1.5 animate-fade-in">
                    <label className="text-sm font-semibold text-[#344054]">Associated Services</label>
                    <CustomDropdown
                      value={formState.service_ids.map(String)}
                      onChange={(values: string[]) => {
                        setFormState((f: any) => ({
                          ...f,
                          service_ids: values.map(Number),
                        }));
                      }}
                      options={services.map((service: any) => ({ value: String(service.id), label: service.name }))}
                      placeholder="Select services"
                      loading={loadingServices}
                      disabled={loadingServices}
                      multiple={true}
                    />
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#344054]">
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
                    placeholder="Briefly describe the benefits..."
                    className="w-full h-24 px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-white text-[#101828] text-sm focus:border-[#685BC7] focus:ring-4 focus:ring-[#F4EBFF] outline-none transition-all resize-none"
                  />
                </div>

                {/* Pricing Section */}
                <div className="bg-[#F9FAFB] p-5 rounded-2xl space-y-4 border border-[#EAECF0]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#667085] uppercase tracking-wider">Currency</label>
                      <input className="w-full h-10 px-3.5 py-3 rounded-lg border border-[#D0D5DD] bg-white text-[#101828] text-sm focus:border-[#685BC7] focus:ring-4 focus:ring-[#F4EBFF] outline-none transition-all resize-none" type="text" disabled value={formState.currency} onChange={(e) => setFormState((f) => ({ ...f, currency: e.target.value }))} />
                      {/* <CustomDropdown
                        value={formState.currency}
                        onChange={(value) =>
                          setFormState((f) => ({ ...f, currency: value }))
                        }
                        options={[
                          // { value: "USD", label: "USD ($)" },
                          // { value: "EUR", label: "EUR (€)" },
                          // { value: "GBP", label: "GBP (£)" },
                          // { value: "INR", label: "INR (₹)" },
                        ]}
                      /> */}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#667085] uppercase tracking-wider">Variant</label>
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
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#667085] uppercase tracking-wider">Base Price</label>
                    <div className="relative group">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085] font-medium border-r border-[#EAECF0] pr-2.5">
                        {currencySymbols[formState.currency] || "$"}
                      </span>
                      <input
                        type="number"
                        value={formState.price_per_month}
                        onChange={(e) =>
                          setFormState((f) => ({ ...f, price_per_month: e.target.value }))
                        }
                        className="w-full h-12 pl-12 pr-14 rounded-xl border border-[#D0D5DD] bg-white text-[#101828] text-lg font-bold focus:border-[#685BC7] focus:ring-4 focus:ring-[#F4EBFF] outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#667085] font-medium">
                        /{formState.variant === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Access Settings */}

                <div className="space-y-3 pt-2">
                  <label className="text-sm font-semibold text-[#344054]">Access Settings</label>
                  <div
                    onClick={() => setFormState(f => ({ ...f, access_type: "discount_rate" }))}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formState.access_type === "discount_rate"
                      ? 'border-[#685BC7] bg-[#F9F5FF]'
                      : 'border-[#EAECF0] hover:border-[#D0D5DD]'
                      }`}
                  >




                    <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formState.access_type === "discount_rate" ? 'border-[#685BC7] bg-[#685BC7]' : 'border-[#D0D5DD]'
                      }`}>
                      {formState.access_type === "discount_rate" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#101828]">Offer Discount</p>
                      <p className="text-xs text-[#667085] mt-0.5">Subscribers get a percentage discount on items.</p>
                    </div>
                  </div>

                  {formState.access_type === "discount_rate" && (
                    <div className="pl-4 border-l-2 border-[#D0D5DD] ml-2.5 space-y-1.5 animate-slide-down">
                      <label className="text-xs font-bold text-[#667085] uppercase tracking-wider">Discount Rate (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formState.discount_rate || ""}
                          onChange={(e) =>
                            setFormState((f) => ({ ...f, discount_rate: e.target.value }))
                          }
                          placeholder="e.g. 10"
                          className="w-full h-11 px-3.5 rounded-lg border border-[#D0D5DD] bg-white text-[#101828] text-sm focus:border-[#685BC7] focus:ring-4 focus:ring-[#F4EBFF] outline-none transition-all"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] font-bold">%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <footer className="px-8 py-6 border-t border-[#EAECF0] bg-[#F9FAFB] flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-12 rounded-xl border border-[#D0D5DD] bg-white text-sm font-bold text-[#344054] hover:bg-gray-50 transition-all shadow-sm"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] h-12 rounded-xl bg-[#685BC7] text-sm font-bold text-white hover:bg-[#584db1] transition-all shadow-md shadow-[#685BC7]/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <Icon icon="eos-icons:loading" width="20" height="20" className="animate-spin" />
                  ) : (
                    <>
                      <Icon icon="lucide:zap" width="18" height="18" />
                      Save & Publish Plan
                    </>
                  )}
                </button>
              </footer>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default SubscriptionModal;