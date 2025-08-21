'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from "@iconify/react";
import axios from 'axios';
import Navbar from "../../components/Navbar";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// TypeScript interfaces
interface Order {
    id: number;
    space_name: string;
    customer_name: string;
    customer_number: string;
    product_name: string;
    order_amount:  string;
    payment_status: string;
    order_date: string;
    status: string;
}

interface OrderStatistics {
    total_new_orders: number;
    total_new_orders_growth: number;
    total_orders: number;
    total_orders_growth: number;
    cancelled_orders: number;
    cancelled_orders_growth: number;
}

interface Space {
    id: number;
    name?: string;
    space_name?: string;
}

interface Product {
    id: number;
    name: string;
    product_name: string;
    price?: number;
    original_string?: string;
    label?: string;
}

interface Customer {
    customer_name?: string;
    name?: string;
    customer_address?: string;
    customer_email?: string;
}

interface NewOrder {
    customerName: string;
    spaceId: string;
    productId: string;
    whatsappNumber: string;
    orderQuantity: number;
    address: string;
    email: string;
}

interface ApiResponse<T> {
    success?: boolean;
    data?: T;
    message?: string;
}

// API Functions
const fetchOrders = async (): Promise<Order[]> => {
    try {
        const res = await axios.get(`${BASE_URL}/api/orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data?.data || res.data || [];
    } catch (err) {
        console.error("Failed to fetch orders:", err);
        throw err;
    }
};

const OrderStatistics = async (): Promise<OrderStatistics> => {
    try {
        const res = await axios.get(`${BASE_URL}/api/order_statistics`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data?.data || res.data || {};
    } catch (err) {
        console.error("Failed to fetch order stats:", err);
        throw err;
    }
};

const OrdersStatus = async (data: { id: number; status: string }): Promise<ApiResponse<any>> => {
    try {
        const res = await axios.post(`${BASE_URL}/api/orders_status_update`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to update order status:", err);
        throw err;
    }
};

const GetSpaceId = async (): Promise<Space[]> => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const res = await axios.get(`${BASE_URL}/api/space`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const spacesData = res.data?.data || res.data?.spaces || res.data || [];
        return Array.isArray(spacesData) ? spacesData : [];
    } catch (err) {
        console.error("Error fetching space data:", err);
        throw err;
    }
};

// FIXED: Updated function to handle the actual API response format with proper IDs
const getProductsBySpace = async (spaceId: number): Promise<Product[]> => {
    try {
        console.log(`Fetching products for space ID: ${spaceId}`);

        const res = await axios.get(`${BASE_URL}/api/getProductBySpace`, {
            params: { space_id: spaceId },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            timeout: 10000,
        });

        console.log('Raw API response:', res.data);

        // Parse the response based on your actual API structure
        let productsData = [];

        if (res.data?.data && Array.isArray(res.data.data)) {
            productsData = res.data.data;
        } else if (Array.isArray(res.data)) {
            productsData = res.data;
        } else if (res.data?.message === "Products List according to the space" && res.data?.data) {
            productsData = res.data.data;
        }

        console.log('Raw products data:', productsData);

        // Handle the actual API response structure with proper IDs and labels
        const formattedProducts = productsData.map((product: any) => {
            // If product is already an object with id and label
            if (typeof product === 'object' && product.id && product.label) {
                // Extract product name and price from label like "Bodywave 2 tone HD 6by 6 wig (4060.00 GHS)"
                const match = product.label.match(/^(.+?)\s*\(([0-9.]+)\s*(GHS|₹)?\s*\)$/);
                
                let productName = product.label;
                let price = 0;

                if (match) {
                    productName = match[1].trim();
                    price = parseFloat(match[2]);
                }

                return {
                    id: product.id, // Use the actual ID from API
                    name: productName,
                    product_name: productName,
                    price: price,
                    original_string: product.label, // Keep original label for reference
                    label: product.label // Keep the label field
                };
            }
            // If product is a string (fallback for old format)
            else if (typeof product === 'string') {
                // Extract product name and price from string like "Bodywave 2 tone HD 6by 6 wig(4060.00 )"
                const match = product.match(/^(.+?)\(([0-9.]+)\s*\)$/);

                let productName = product;
                let price = 0;

                if (match) {
                    productName = match[1].trim();
                    price = parseFloat(match[2]);
                }

                return {
                    id: productsData.indexOf(product) + 1, // Generate sequential IDs for string format
                    name: productName,
                    product_name: productName,
                    price: price,
                    original_string: product // Keep original for reference
                };
            }
            // Handle any other format
            else {
                return {
                    id: product.id || productsData.indexOf(product) + 1,
                    name: product.name || product.product_name || 'Unknown Product',
                    product_name: product.name || product.product_name || 'Unknown Product',
                    price: product.price || 0,
                    original_string: product.label || product.name || 'Unknown Product'
                };
            }
        });

        console.log('Formatted products:', formattedProducts);
        return formattedProducts;

    } catch (error) {
        console.error('Error fetching products by space:', error);
        return [];
    }
};

const ManualOrder = async (orderData: any): Promise<ApiResponse<any>> => {
    try {
        const res = await axios.post(`${BASE_URL}/api/createmanualorder`, orderData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return res.data;
    } catch (error) {
        console.error('Error creating manual order:', error);
        throw error;
    }
};

// FIXED: Updated getCustomerByPhoneAPi with better validation
const getCustomerByPhoneAPi = async (whatsappNumber: string): Promise<Customer | null> => {
    try {
        const res = await axios.get(`${BASE_URL}/api/getCustomerByPhone`, {
            params: { whatsapp_number: whatsappNumber },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        console.log('Raw customer API response:', res.data);

        const customerData = res.data?.data || res.data?.customer || res.data;
        
        // Check if we actually have valid customer data
        if (customerData && 
            typeof customerData === 'object' && 
            (customerData.customer_name || customerData.name) &&
            (customerData.customer_name?.trim() !== '' || customerData.name?.trim() !== '')) {
            return customerData;
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching customer by phone:', error);
        return null;
    }
};

const OrdersTable: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [OrdersStatistics, setOrdersStatistics] = useState<OrderStatistics>({
        total_new_orders: 0,
        total_new_orders_growth: 0,
        total_orders: 0,
        total_orders_growth: 0,
        cancelled_orders: 0,
        cancelled_orders_growth: 0,
    });
    const [showmodel, setShowModel] = useState<boolean>(false);

    const [newOrder, setNewOrder] = useState<NewOrder>({
        customerName: '',
        spaceId: '',
        productId: '',
        whatsappNumber: '',
        orderQuantity: 1,
        address: '',
        email: ''
    });

    const [customerFound, setCustomerFound] = useState<boolean>(false);
    const [searchingCustomer, setSearchingCustomer] = useState<boolean>(false);
    const [spaceError, setSpaceError] = useState<string>('');
    const [productError, setProductError] = useState<string>('');

    // Dynamic data from APIs
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingSpaces, setLoadingSpaces] = useState<boolean>(false);
    const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

    // FIXED: Add state to track pending status updates
    const [pendingStatusUpdates, setPendingStatusUpdates] = useState<{[key: number]: string}>({});

    useEffect(() => {
        const fetchOrderStatistics = async () => {
            try {
                const res = await OrderStatistics();
                setOrdersStatistics(res || {
                    total_new_orders: 0,
                    total_new_orders_growth: 0,
                    total_orders: 0,
                    total_orders_growth: 0,
                    cancelled_orders: 0,
                    cancelled_orders_growth: 0,
                });
            } catch (err) {
                console.error("Failed to fetch order stats:", err);
            }
        };
        fetchOrderStatistics();
    }, []);

    useEffect(() => {
        getOrders();
        fetchSpaces();
    }, []);

    const fetchSpaces = async () => {
        setLoadingSpaces(true);
        setSpaceError('');
        try {
            const spacesData = await GetSpaceId();
            console.log("Fetched spaces:", spacesData);

            if (Array.isArray(spacesData) && spacesData.length > 0) {
                setSpaces(spacesData);
            } else {
                console.error("No spaces found or invalid format:", spacesData);
                setSpaceError('No spaces available');
                setSpaces([]);
            }
        } catch (err) {
            console.error("Failed to fetch spaces:", err);
            setSpaceError('Failed to load spaces. Please check your connection and try again.');
            setSpaces([]);
        } finally {
            setLoadingSpaces(false);
        }
    };

    const fetchProducts = async (spaceId: number) => {
        if (!spaceId) {
            setProducts([]);
            setProductError('');
            return;
        }

        setLoadingProducts(true);
        setProductError('');

        try {
            console.log(`Fetching products for space ID: ${spaceId}`);
            const productsData = await getProductsBySpace(spaceId);
            console.log("Fetched products:", productsData);

            if (Array.isArray(productsData) && productsData.length > 0) {
                setProducts(productsData);
                setProductError('');
            } else {
                console.warn("No products found for space:", spaceId);
                setProducts([]);
                setProductError('No products available for this space');
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setProducts([]);
            setProductError('Failed to load products. Please try again.');
        } finally {
            setLoadingProducts(false);
        }
    };

    const getOrders = async () => {
        try {
            const ordersData = await fetchOrders();
            console.log("Fetched orders:", ordersData);
            setOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setOrders([]);
        }
    };

    // FIXED: Updated handleStatusChange to track pending changes
    const handleStatusChange = (orderId: number, newStatus: string) => {
        // Update the local state immediately for better UX
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
        
        // Track that this order has a pending status change
        setPendingStatusUpdates(prev => ({
            ...prev,
            [orderId]: newStatus
        }));
    };

    // FIXED: Updated handleOrderStatusUpdate to use pending changes
    const handleOrderStatusUpdate = async (orderId: number) => {
        try {
            // Get the pending status change for this order
            const newStatus = pendingStatusUpdates[orderId];
            if (!newStatus) {
                console.log("No pending status change for order:", orderId);
                return;
            }
            
            console.log(`Updating order ${orderId} status to: ${newStatus}`);
            
            const res = await OrdersStatus({ id: orderId, status: newStatus });
            
            if (res?.success) {
                console.log("Order status updated successfully in backend");
                
                // Remove from pending updates since it's now confirmed
                setPendingStatusUpdates(prev => {
                    const updated = { ...prev };
                    delete updated[orderId];
                    return updated;
                });
                
                // Ensure the status is set correctly in the orders state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, status: newStatus } : order
                    )
                );
                
                console.log(`Order ${orderId} status confirmed as: ${newStatus}`);
                
            } else {
                console.error("Failed to update order status:", res);
                // Remove from pending updates
                setPendingStatusUpdates(prev => {
                    const updated = { ...prev };
                    delete updated[orderId];
                    return updated;
                });
                // Refresh orders to get the correct status from backend
                getOrders();
                alert('Failed to update order status. Please try again.');
            }
        } catch (err) {
            console.error("Order update error:", err);
            
            // Remove from pending updates and revert
            setPendingStatusUpdates(prev => {
                const updated = { ...prev };
                delete updated[orderId];
                return updated;
            });
            
            // Refresh orders to get the correct status from backend
            getOrders();
            
            alert('Error updating order status. Please try again.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        console.log(`Input change - ${name}: ${value}`);

        setNewOrder(prev => {
            const updated = { ...prev, [name]: value };
            console.log('Updated newOrder state:', updated);
            return updated;
        });

        // Handle space selection
        if (name === 'spaceId' && value) {
            const spaceId = parseInt(value);
            if (!isNaN(spaceId)) {
                fetchProducts(spaceId);
                setNewOrder(prev => ({ ...prev, productId: '' }));
            }
        }
    };

    // FIXED: Updated searchCustomerByPhone with stricter validation
    const searchCustomerByPhone = async (phoneNumber: string) => {
        if (phoneNumber.length < 10) {
            setCustomerFound(false);
            // Clear customer data when phone number is too short
            setNewOrder(prev => ({
                ...prev,
                customerName: '',
                address: '',
                email: ''
            }));
            return;
        }

        setSearchingCustomer(true);
        try {
            const customerData = await getCustomerByPhoneAPi(phoneNumber);
            console.log("Customer data:", customerData);

            // More strict validation for customer existence
            if (customerData && 
                (customerData.customer_name || customerData.name) && 
                (customerData.customer_name?.trim() !== '' || customerData.name?.trim() !== '')) {
                
                const customerName = customerData.customer_name || customerData.name || '';
                const address = customerData.customer_address || '';
                const email = customerData.customer_email || '';

                console.log('Setting customer data:', { customerName, address, email });

                setNewOrder(prev => {
                    const updated = {
                        ...prev,
                        customerName: customerName.trim(),
                        address: address.trim(),
                        email: email.trim()
                    };
                    console.log('Updated order with customer data:', updated);
                    return updated;
                });
                setCustomerFound(true);
            } else {
                // Customer not found or invalid data
                console.log('Customer not found or invalid customer data');
                setCustomerFound(false);
                setNewOrder(prev => ({
                    ...prev,
                    customerName: '',
                    address: '',
                    email: ''
                }));
            }
        } catch (error) {
            console.error('Error searching customer:', error);
            setCustomerFound(false);
            setNewOrder(prev => ({
                ...prev,
                customerName: '',
                address: '',
                email: ''
            }));
        } finally {
            setSearchingCustomer(false);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const phoneNumber = e.target.value;
        setNewOrder(prev => ({ ...prev, whatsappNumber: phoneNumber }));

        // Reset customer found status when phone number changes
        setCustomerFound(false);

        if (phoneNumber.length >= 10) {
            searchCustomerByPhone(phoneNumber);
        } else {
            setCustomerFound(false);
            // Clear customer data when phone number is invalid
            setNewOrder(prev => ({
                ...prev,
                customerName: '',
                address: '',
                email: ''
            }));
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(`Textarea change - ${name}: ${value}`);

        setNewOrder(prev => {
            const updated = { ...prev, [name]: value };
            console.log('Updated newOrder from textarea:', updated);
            return updated;
        });
    };

    // Updated handleSubmitOrder function to use actual product ID
    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newOrder.customerName || !newOrder.spaceId || !newOrder.productId || !newOrder.whatsappNumber) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // FIXED: Send the actual product ID and name
            const selectedProduct = products.find(p => p.id.toString() === newOrder.productId);
            
            const orderData = {
                space_id: parseInt(newOrder.spaceId),
                product_name: selectedProduct?.label || selectedProduct?.original_string || selectedProduct?.name || '', // Send the full product label/string
                product_id: selectedProduct ? selectedProduct.id : parseInt(newOrder.productId), // Use actual product ID from API
                order_quantity: parseInt(newOrder.orderQuantity.toString()),
                whatsapp_number: newOrder.whatsappNumber,
                customer_name: newOrder.customerName,
                address: newOrder.address,
                email: newOrder.email
            };

            console.log('Submitting order with actual product ID:', orderData);

            const response = await ManualOrder(orderData);

            if (response?.success || response?.data || response) {
                alert('Order created successfully!');
                closeModal();
                getOrders();
            } else {
                const errorMessage = response || 'Unknown error occurred';
                alert('Failed to create order: ' + errorMessage);
            }
        } catch (err) {
            console.error("Failed to create order:", err);
            alert('Failed to create order. Please try again.');
        }
    };

    const closeModal = () => {
        setShowModel(false);
        setNewOrder({
            customerName: '',
            spaceId: '',
            productId: '',
            whatsappNumber: '',
            orderQuantity: 1,
            address: '',
            email: ''
        });
        setCustomerFound(false);
        setProducts([]);
        setProductError('');
    };

    return (
        <div className='select-none'>
            <Navbar heading="Orders" />

            <div className="p-6 space-y-6">
                <div className="flex justify-between items-start px-8">
                    <div>
                        <h2 className="text-xl font-semibold">Orders</h2>
                        <p className="text-sm text-gray-500">
                            Dive deep into your orders and manage them efficiently.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModel(true)}
                        className="bg-[#F9F5FF] text-[#685BC7] hover:bg-violet-200 px-4 py-2 rounded-md whitespace-nowrap hover:cursor-pointer"
                        style={{
                            display: 'flex',
                            fontWeight: '600',
                            fontSize: '14px',
                            lineHeight: '20px',
                            letterSpacing: '0%',
                            color: '#685BC7'
                        }}
                    >
                        Add Orders
                    </button>
                </div>

                {/* Add Order Popup Modal */}
                {showmodel && (
                    <div className="fixed inset-0 bg-[#9999] h-[700px] bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Add New Order</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <Icon icon="mdi:close" className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitOrder} className="space-y-4">
                                {/* WhatsApp Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        WhatsApp Number *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="whatsappNumber"
                                            value={newOrder.whatsappNumber}
                                            onChange={handlePhoneChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#685BC7] focus:border-transparent"
                                            placeholder="Enter WhatsApp number"
                                            required
                                        />
                                        {searchingCustomer && (
                                            <div className="absolute right-3 top-2.5">
                                                <Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin text-[#685BC7]" />
                                            </div>
                                        )}
                                    </div>
                                    {customerFound && (
                                        <p className="text-sm text-green-600 mt-1 flex items-center">
                                            <Icon icon="mdi:check-circle" className="w-4 h-4 mr-1" />
                                            Customer found! Details auto-filled.
                                        </p>
                                    )}
                                    {!customerFound && newOrder.whatsappNumber.length >= 10 && !searchingCustomer && (
                                        <p className="text-sm text-red-600 mt-1 flex items-center">
                                            <Icon icon="mdi:close-circle" className="w-4 h-4 mr-1" />
                                            Customer not found. Please enter details manually.
                                        </p>
                                    )}
                                </div>

                                {/* Customer Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Customer Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={newOrder.customerName || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#685BC7] focus:border-transparent"
                                        placeholder="Enter customer name"
                                        required
                                    />
                                </div>

                                {/* Space Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Space *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="spaceId"
                                            value={newOrder.spaceId || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#685BC7] focus:border-transparent"
                                            required
                                            disabled={loadingSpaces}
                                        >
                                            <option value="">
                                                {loadingSpaces ? "Loading spaces..." :
                                                    spaceError ? spaceError :
                                                        spaces.length === 0 ? "No spaces available" :
                                                            "Select a space"}
                                            </option>
                                            {spaces.map((space) => (
                                                <option key={space.id} value={space.id}>
                                                    {space.name || space.space_name || `Space ${space.id}`}
                                                </option>
                                            ))}
                                        </select>
                                        {loadingSpaces && (
                                            <div className="absolute right-8 top-2.5">
                                                <Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin text-[#685BC7]" />
                                            </div>
                                        )}
                                    </div>
                                    {spaceError && (
                                        <p className="text-sm text-red-600 mt-1">{spaceError}</p>
                                    )}
                                </div>

                                {/* Product Dropdown - FIXED: Now shows actual product names with proper IDs */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product *
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="productId"
                                            value={newOrder.productId || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#685BC7] focus:border-transparent"
                                            required
                                            disabled={!newOrder.spaceId || loadingProducts}
                                        >
                                            <option value="">
                                                {!newOrder.spaceId
                                                    ? "Select a space first"
                                                    : loadingProducts
                                                        ? "Loading products..."
                                                        : productError
                                                            ? productError
                                                            : products.length === 0
                                                                ? "No products available for this space"
                                                                : "Select a product"}
                                            </option>
                                            {products.map((product) => (
                                                <option key={product.id} value={product.id} title={`ID: ${product.id} - Price: ${product.price}`}>
                                                    {product.name} {product.price ? `(${product.price} GHS)` : ''} 
                                                </option>
                                            ))}
                                        </select>
                                        {loadingProducts && (
                                            <div className="absolute right-8 top-2.5">
                                                <Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin text-[#685BC7]" />
                                            </div>
                                        )}
                                    </div>
                                    {productError && (
                                        <p className="text-sm text-red-600 mt-1">{productError}</p>
                                    )}
                                    {/* Show selected product details */}
                                    {newOrder.productId && products.length > 0 && (
                                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                            {(() => {
                                                const selectedProduct = products.find(p => p.id.toString() === newOrder.productId);
                                                return selectedProduct ? (
                                                    <div>
                                                        <strong>Selected:</strong> {selectedProduct.name}
                                                        {selectedProduct.price && <span className="ml-2 text-green-600">{selectedProduct.price} GHS</span>}
                                                        <br />
                                                    </div>
                                                ) : null;
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Order Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        name="orderQuantity"
                                        value={newOrder.orderQuantity || 1}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#685BC7] focus:border-transparent"
                                        placeholder="Enter quantity"
                                        min="1"
                                        required
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <textarea
                                        key={`address-${newOrder.whatsappNumber}`}
                                        name="address"
                                        value={newOrder.address || ''}
                                        onChange={handleTextareaChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#685BC7] focus:border-transparent"
                                        placeholder="Enter customer address"
                                        rows={2}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        key={`email-${newOrder.whatsappNumber}`}
                                        type="email"
                                        name="email"
                                        value={newOrder.email || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#685BC7] focus:border-transparent"
                                        placeholder="Enter customer email"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#685BC7]"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-[#685BC7] border border-transparent rounded-md hover:bg-[#5748B8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#685BC7]"
                                    >
                                        Create Order
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Statistics Cards */}
                <div className="w-full flex flex-wrap gap-6 px-8">
                    <div className="w-full lg:w-[31%] border rounded-[12px] border-[#EAECF0] p-[24px]">
                        <p className="text-[#475467] text-[14px] font-medium">New Orders</p>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-[#101828] text-[30px]">
                                {OrdersStatistics?.total_new_orders || 0}
                            </p>
                            <div className="flex items-center text-[#067647] bg-[#ECFDF3] border border-[#ABEFC6] px-2 py-1 rounded-full text-sm">
                                <Icon icon="jam:arrow-up" className="mr-1" />
                                {OrdersStatistics?.total_new_orders_growth || 0}%
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[32%] border rounded-[12px] border-[#EAECF0] p-[24px]">
                        <p className="text-[#475467] text-[14px] font-medium">Total Orders</p>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-[#101828] text-[30px]">
                                {OrdersStatistics?.total_orders || 0}
                            </p>
                            <div className="flex items-center text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] px-2 py-1 rounded-full text-sm">
                                <Icon icon="charm:arrow-down" className="mr-1" />
                                {OrdersStatistics?.total_orders_growth || 0}%
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-[32%] border rounded-[12px] border-[#EAECF0] p-[24px]">
                        <p className="text-[#475467] text-[14px] font-medium">Cancelled Orders</p>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-[#101828] text-[30px]">
                                {OrdersStatistics?.cancelled_orders || 0}
                            </p>
                            <div className="flex items-center text-[#B42318] bg-[#FEF3F2] border border-[#FECDCA] px-2 py-1 rounded-full text-sm">
                                <Icon icon="charm:arrow-down" className="mr-1" />
                                {OrdersStatistics?.cancelled_orders_growth || 0}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
              <div className="overflow-x-auto rounded-lg border border-[#EAECF0]">
  <table className="min-w-full text-sm text-left">
    <thead className="bg-[#F9FAFB] text-[#475467] font-medium">  <tr>
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Space</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Amount</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders && orders.length > 0 ? (
                                orders.map((order: Order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 text-[#475467] border-b border-[#EAECF0]">
                                        <td className="px-4 py-2">{order.id || 'N/A'}</td>
                                        <td className="px-4 py-2">{order.space_name || 'N/A'}</td>
                                        <td className="px-4 py-2">{order.customer_name || 'N/A'}</td>
                                        <td className="px-4 py-2">{order.customer_number || 'N/A'}</td>
                                        <td className="px-4 py-2">{order.product_name || 'N/A'}</td>
                                        <td className="px-4 py-2">
                                            {order.order_amount ? Number(order.order_amount).toLocaleString() : '0'}
                                        </td>
                                        <td className="px-4 py-2 capitalize">{order.payment_status || 'pending'}</td>
                                        <td className="px-4 py-2">
                                            {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-4 py-2 capitalize">
                                      <select
  value={order.status || "pending"}
  onChange={(e) => handleStatusChange(order.id, e.target.value)}
  className={`border rounded px-2 py-1 text-xs capitalize
    ${order.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
    ${order.status === "cancelled" ? "bg-red-100 text-red-800" : ""}
    ${order.status === "processing" ? "bg-blue-100 text-blue-800" : ""}
    ${order.status === "delivered" ? "bg-green-100 text-green-800" : ""}
    ${order.status === "returned" ? "bg-purple-100 text-purple-800" : ""}
    ${order.status === "refunded" ? "bg-gray-200 text-gray-800" : ""}
  `}
>
  <option value="pending">Pending</option>
  <option value="cancelled">Cancelled</option>
  <option value="processing">Processing</option>
  <option value="delivered">Delivered</option>
  <option value="returned">Returned</option>
  <option value="refunded">Refunded</option>
</select>

                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleOrderStatusUpdate(order.id)}
                                                disabled={!pendingStatusUpdates[order.id]}
                                                className={`px-3 py-1 rounded text-xs hover:cursor-pointer transition-colors ${
                                                    pendingStatusUpdates[order.id] 
                                                        ? 'bg-[#685BC7] text-white hover:bg-[#5748B8]' 
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                {pendingStatusUpdates[order.id] ? 'Update Status' : 'No Changes'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-4 py-6 text-center text-gray-400" colSpan={10}>
                                        No orders available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrdersTable;