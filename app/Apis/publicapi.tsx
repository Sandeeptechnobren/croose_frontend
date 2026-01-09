// // utils/axiosRequest.ts

// import axios, { AxiosRequestConfig } from 'axios';

// export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// interface AxiosOptions {
//   method: 'get' | 'post' | 'put' | 'delete';
//   url: string;
//   headers?: any;
//   body?: any;
//   formData?: FormData;
// }





// export const axiosRequest = async ({
//   method,
//   url,
//   headers = {},
//   body,
//   formData,
// }: AxiosOptions): Promise<any> => {
//   try {
//     const config: AxiosRequestConfig = {
//       method,
//       url,
//       headers: {
//         ...headers,
//         ...(formData ? {} : { 'Content-Type': 'application/json' }),
//       },
//       data: formData || body,
//     };

//     const response = await axios(config);
//     return response.data;
//   } catch (error: any) {
//     throw new Error(
//       error?.response?.data?.message || error.message || 'Something went wrong'
//     );
//   }
// };



// export const createSpace = async (formData: FormData) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axios.post(
//       `${BASE_URL}/api/create_space`,

//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // Do NOT set Content-Type for FormData, Axios handles it.
//         },
//       }
//     );
//     return res.data;
//   } catch (err) {


//     console.log(err);
//     throw err;
//   }
// };

// export const spaceIqCheck = async (data: any) => {
//   try {
//     const token = localStorage.getItem("token")
//     const res = await axiosRequest({
//       method: "post",
//       url: `${BASE_URL}/api/checkspaceIQincresed`,
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       body: data

//     })
//     console.log("spaceIqCheck API function response:", res)
//     return res




//   } catch (err) {
//     console.log(err)
//   }
// }


// export const fetchPaymentApi = async () => {
//   try {
//     const token = localStorage.getItem('token');

//     const res = await axios.post(
//       `${BASE_URL}/api/payment_details`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     // ✅ Extract and return only the data array
//     return res.data?.data || [];
//   } catch (error) {
//     console.error("Error fetching payments:", error);
//     throw error;
//   }
// };

// // export const fetchPaymentsApi = async () => {
// //   try {
// //     const token = localStorage.getItem('token'); // Retrieve stored token
// //     const response = await fetch(${BASE_URL}//api/payment_details', {
// //       method: 'POST', // API requires POST
// //       headers: {
// //         'Content-Type': 'application/json',
// //         Authorization: `Bearer ${token}`, // Add token here
// //       },
// //       body: JSON.stringify({}) // Send body if required, else keep empty object
// //     });

// //     if (!response.ok) throw new Error('Failed to fetch payment details');
// //     return await response.json();
// //   } catch (error) {
// //     throw error;
// //   }
// // };


// export const getCustomer = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     console.log("Token:", token);

//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/getCustomer`,

//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("Space List Response:", res);
//     return res;

//   } catch (err: any) {
//     if (err.response) {
//       console.error("Error Response Data:", err.response.data);
//       console.error("Error Response Status:", err.response.status);
//     } else {
//       console.error("Error:", err.message);
//     }
//   }
// };



// export const getSpaceList = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     console.log("Token:", token);

//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/get_space_list`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("Space List Response:", res);
//     return res;

//   } catch (err: any) {
//     if (err.response) {
//       console.error("Error Response Data:", err.response.data);
//       console.error("Error Response Status:", err.response.status);
//     } else {
//       console.error("Error:", err.message);
//     }
//   }
// };

// export const getNewAppointments = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.get(
//       `${BASE_URL}/api/new_appointments`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch new appointments:", error);
//     throw error;
//   }
// };
// export const getTotalAppointments = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.get(
//       `${BASE_URL}/api/total_appointments`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch new appointments:", error);
//     throw error;
//   }
// };
// export const getCancelledAppointments = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.get(
//       `${BASE_URL}/api/cancelled_appointments`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch new appointments:", error);
//     throw error;
//   }
// };

// export const appointmentList = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/appointments`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res;
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const BussinessCategories = async () => {
//   try {

//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/business_categories`,

//     });
//     return res;
//   } catch (err) {
//     console.log(err);
//   }
// };
// export const updateAppointmentStatus = async (id: number, status: string) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: "post",
//       url: `${BASE_URL}/api/appointments_status_update`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: {
//         id,
//         status,
//       },
//     });
//     return res;
//   } catch (err) {
//     console.error("Error updating appointment status:", err);
//     throw err;
//   }
// };

// export const GetSpaceId = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       throw new Error("Token not found in localStorage");
//     }

//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/space`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     console.log("Fetched spaces from API →", res); // Log just the data
//     return res; // ✅ Only return the data part
//   } catch (err) {
//     console.error("Error fetching space data:", err);
//     throw err;
//   }
// };


// export const addProduct = async (formData: FormData) => {
//   const token = localStorage.getItem("token");
//   return await axiosRequest({
//     method: "post",
//     url: `${BASE_URL}/api/products`,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     formData,
//   });
// };
// //update product
// export const updateProduct = async (id: string, data: any) => {
//   const token = localStorage.getItem("token");
//   return await axiosRequest({
//     method: 'put',
//     url: `${BASE_URL}/api/products/${id}`,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: data,
//   });
// };
// export const addServices = async (data: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: 'post',
//       url: `${BASE_URL}/api/services`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: data,
//     });
//     return res;
//   } catch (err: any) {
//     console.log(err);
//     throw new Error(err?.message || "Failed to add service.");
//   }
// };
// export const uploadBulkFile = async (
//   file: File,
//   activeTab: 'products' | 'services',
//   space_id: string
// ) => {
//   try {
//     const token = localStorage.getItem("token");

//     const formData = new FormData();
//     formData.append("file", file, file.name);
//     formData.append("space_id", space_id);

//     console.log('FormData entries:');


//     const url = `${BASE_URL}/api/${activeTab}/bulkupload`;


//     const res = await axios.post(url, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return res.data;
//   } catch (err: any) {
//     console.error('Full error:', err);
//     if (err.response) {
//       console.error('Response data:', err.response.data);
//       console.error('Response status:', err.response.status);
//       console.error('Response headers:', err.response.headers);
//     }
//     throw new Error(err?.response?.data?.message || "Failed to upload file.");
//   }
// };












// export const getSpacePrompt = async (spaceId: number) => {
//   const token = localStorage.getItem("token");

//   return await axios({
//     method: "get",
//     url: `${BASE_URL}/api/get_space_prompt`,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     params: {
//       space_id: spaceId,
//     },
//   });
// };



// export const updateSpacePrompt = async (spaceId: number, promptContent: string) => {
//   const token = localStorage.getItem("token");

//   if (!token) throw new Error("Token not found");

//   return await axios({
//     method: "post",
//     url: `${BASE_URL}/api/update_space_prompt`,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     data: {
//       space_id: spaceId,
//       prompt_content: promptContent,
//     },
//   });
// };

// export const updatePassword = async (currentPassword: string, newPassword: string) => {
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("Token not found");

//     return await axios({
//       method: "post",
//       url: `${BASE_URL}/api/update_password`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: {
//         current_password: currentPassword,
//         new_password: newPassword,
//       },
//     });


//   } catch (err) {
//     console.log("Error updating password:", err);
//     throw err;
//   }
// };




// export const updateServices = async (id: string, data: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: 'put',
//       url: `${BASE_URL}/api/services/${id}`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: data,
//     });
//     return res;
//   } catch (err: any) {
//     console.log(err);
//     throw new Error(err?.message || "Failed to add service.");
//   }
// };
// export const deleteProduct = async (id: string) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: 'delete',
//       url: `${BASE_URL}/api/products/${id}`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res;
//   } catch (err: any) {
//     console.log(err);
//     throw new Error(err?.message || "Failed to delete product.");
//   }
// };
// export const deleteService = async (id: string) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: 'delete',
//       url: `${BASE_URL}/api/services/${id}`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res;
//   } catch (err: any) {
//     console.log(err);
//     throw new Error(err?.message || "Failed to delete service.");
//   }
// };
// export const getAllProducts = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/products`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res;
//   } catch (err) {
//     console.log(err);
//   }
//   return { data: [] };
// };

// export const getProductPage = async (page: number = 1) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/products?page=${page}`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res;
//   } catch (err) {
//     console.log(err);
//     return { status: false, data: [] };
//   }
// };

// export const getServicePage = async (page: number = 1) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/services?page=${page}`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res;
//   } catch (err) {
//     console.log(err);
//     return { status: false, data: [] };
//   }
// };






// export const getnewCustomer = async () => {
//   try {
//     const token = localStorage.getItem('token');
//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/newCustomers`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       }

//     })
//     return res;
//   }
//   catch (err) {
//     console.log(err);

//   }
// }













// export const getAllServices = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axios.get(`${BASE_URL}/api/services`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res.data;
//   } catch (err) {
//     console.log(err);
//   }
//   return { data: [] };
// };

// export const verifyToken = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/manual-token-check`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return res;
//   } catch (err) {
//     return {
//       err: { status: true },
//     };
//   }
// };

// export const loginApi = async (data: any) => {
//   try {
//     const res = await axiosRequest({
//       method: "post",
//       url: `${BASE_URL}/api/login`,
//       headers: {},
//       body: data,
//     });
//     localStorage.setItem("token", res.token);
//     return res;
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const logoutapi = async (data: any) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: "post",
//       url: `${BASE_URL}/api/logout`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: data,
//     });
//     return res;
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const registerApi = async (data: any) => {
//   try {
//     const res = await axiosRequest({
//       method: "post",
//       url: `${BASE_URL}/api/register`,
//       headers: {},
//       body: data,
//     });

//     return res;

//   } catch (err) {
//     console.log(err);
//   }

// };

// export const searchProducts = async (query: string) => {
//   const token = localStorage.getItem("token");
//   const response = await axios.get(`${BASE_URL}/api/products?search=${query}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };


// export const searchServices = async (query: string) => {
//   const token = localStorage.getItem("token");
//   const response = await axios.get(`${BASE_URL}/api/services?search=${query}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };



// export const countryApi = async () => {
//   try {
//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/countries`,
//       headers: {},
//     });
//     return res;
//   } catch (err) {
//     console.log(err);
//   }
// };


// export const fetchOrders = async () => {
//   try {
//     let token = localStorage.getItem("token");
//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/orders`,
//       headers: {
//         Authorization: `Bearer ${token}`
//       },


//     })
//     return res.data;
//   } catch (err) {
//     console.log(err)

//   }
// }

// export const ordersApi = async (data: any) => {
//   try {
//     let token = localStorage.getItem("token")
//     let res = await axiosRequest({
//       method: "post",
//       url: `${BASE_URL}/api/orders_status_update`,
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       body: data,
//     })
//     return res

//   } catch (err) {
//     console.log(err)
//   }
// }


// export const fetchCustomerStatistics = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/customer_statistics`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//     });

//     return res;
//   } catch (err) {
//     console.error('Error fetching customer statistics:', err);
//     throw err; // Optional: rethrow for higher-level handling
//   }
// };


// export const fetchAppointmentStatistics = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/appointment_statistics`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//     });

//     return res;
//   } catch (err) {
//     console.error('Error fetching customer statistics:', err);
//     throw err; // Optional: rethrow for higher-level handling
//   }
// };

// export const fetchTotalChats = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     const res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/total_chats`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//     });

//     return res;
//   } catch (err) {
//     console.error('Error fetching customer statistics:', err);
//     throw err; // Optional: rethrow for higher-level handling
//   }
// };


// export const OrderStatistics = async (data: any) => {
//   try {
//     let token = localStorage.getItem("token")
//     let res = await axiosRequest({
//       method: "get",
//       url: `${BASE_URL}/api/order_statistics`,
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       body: data
//     })
//     return res
//   } catch (err) {
//     console.log(err)
//   }
// }



// export const OrdersStatus = async (data: any) => {
//   try {
//     const token = localStorage.getItem("token")
//     const res = await axiosRequest({
//       method: "post",
//       url: `${BASE_URL}/api/orders_status_update`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: data
//     })
//     return res
//   } catch (err) {
//     console.log(err)
//   }
// }

// export const spaceChats = async (spaceId: number) => {
//   try {
//     const token = localStorage.getItem("token")
//     const res = await axios({
//       method: 'get',
//       url: `${BASE_URL}/api/space_chat_stats`,
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       params: {
//         space_id: spaceId
//       }

//     })



//     return res.data

//   } catch (err) {
//     console.log(err)
//   }
// }

// export const spaceLiveChats = async (spaceId: number) => {
//   try {
//     const token = localStorage.getItem("token");
//     console.log(' Token:', token ? 'Token exists' : 'No token found');
//     console.log(' Making API call with spaceId:', spaceId);
//     if (!token) {
//       throw new Error("No authentication token found");
//     }
//     const res = await axios({
//       method: 'get',
//       url: `${BASE_URL}/api/space_chat_list`,
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       params: {
//         space_id: spaceId,
//       }
//     });
//     console.log(' Full API Response:', res);
//     console.log(' Response Status:', res.status);
//     console.log(' Response Data:', res.data);
//     console.log('🌐 Response Data.data:', res.data.data);
//     console.log('🌐 Type of res.data.data:', typeof res.data.data);
//     return res.data.data
//   } catch (err: any) {
//     console.error('API Error:', err);
//     if (err.response) {
//       console.error('Error Response Status:', err.response.status);
//       console.error('Error Response Data:', err.response.data);
//     }
//     throw err;
//   }
// };


// export const RunAgent = async (spaceid: number) => {
//   try {
//     const token = localStorage.getItem("token")
//     const res = await axios({
//       method: "post",
//       url: `${BASE_URL}/api/whapi/instance`,
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       params: {
//         space_id: spaceid
//       }


//     })
//     return res

//   } catch (err) {
//     console.log(err)
//   }
// }


// export const PayApi = async (uuid: any) => {
//   try {
//     const res = await axios.get(`https://api.joincroose.com/croose/api/paystack/whapi/${uuid}`);
//     return res;
//   } catch (err) {
//     throw err;
//   }
// };

// export const getQr = (space_id: string) => {
//   const token = localStorage.getItem("token");
//   return axios.get('https://api.joincroose.com/croose/api/whapi/instance/qr', {
//     headers: {
//       Authorization: `Bearer ${token}`
//     },
//     params: { space_id },
//     responseType: 'blob'

//   }),
//     console.log('this si the instance data')
// };


export const InstanceActivationStatus = async (spaceId: number) => {
  try {
    let token = localStorage.getItem("token")
    return await axios({
      method: "get",
      url: `${BASE_URL}/api/whapi/instance_activation_status`,
      headers: {
        Authorization: `Bearer ${token}`
      },

      params: {
        space_id: spaceId
      },
    })


  } catch (err) {
    console.log(err)
  }
}


export const findAccountByEmail = async (email: string) => {
  try {
    let res = await axiosRequest({
      method: "post", // Using POST method as specified
      url: `${BASE_URL}/api/find_account/${email}`, // Email as path parameter
      headers: {
        'Content-Type': 'application/json',
      }
      // No body needed since email is in the URL path
    });

    return res;
  } catch (err) {
    console.error('findAccountByEmail API error:', err);
    throw err;
  }
};



// utils/axiosRequest.ts

import axios, { AxiosRequestConfig } from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AxiosOptions {
  method: 'get' | 'post' | 'put' | 'delete';
  url: string;
  headers?: any;
  body?: any;
  formData?: FormData;
}





export const axiosRequest = async ({
  method,
  url,
  headers = {},
  body,
  formData,
}: AxiosOptions): Promise<any> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        ...headers,
        ...(formData ? {} : { 'Content-Type': 'application/json' }),
      },
      data: formData || body,
    };

    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || 'Something went wrong'
    );
  }
};



export const createSpace = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${BASE_URL}/api/create_space`,

      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type for FormData, Axios handles it.
        },
      }
    );
    return res.data;
  } catch (err) {


    console.log(err);
    throw err;
  }
};

export const spaceIqCheck = async (data: any) => {
  try {
    const token = localStorage.getItem("token")
    const res = await axiosRequest({
      method: "post",
      url: `${BASE_URL}/api/checkspaceIQincresed`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data

    })
    console.log("spaceIqCheck API function response:", res)
    return res




  } catch (err) {
    console.log(err)
  }
}


export const fetchPaymentApi = async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await axios.post(
      `${BASE_URL}/api/payment_details`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ Extract and return only the data array
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

// export const fetchPaymentsApi = async () => {
//   try {
//     const token = localStorage.getItem('token'); // Retrieve stored token
//     const response = await fetch(${BASE_URL}//api/payment_details', {
//       method: 'POST', // API requires POST
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`, // Add token here
//       },
//       body: JSON.stringify({}) // Send body if required, else keep empty object
//     });

//     if (!response.ok) throw new Error('Failed to fetch payment details');
//     return await response.json();
//   } catch (error) {
//     throw error;
//   }
// };


export const getCustomer = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/getCustomer`,

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Space List Response:", res);
    return res;

  } catch (err: any) {
    if (err.response) {
      console.error("Error Response Data:", err.response.data);
      console.error("Error Response Status:", err.response.status);
    } else {
      console.error("Error:", err.message);
    }
  }
};



export const getSpaceList = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/get_space_list`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Space List Response:", res);
    return res;

  } catch (err: any) {
    if (err.response) {
      console.error("Error Response Data:", err.response.data);
      console.error("Error Response Status:", err.response.status);
    } else {
      console.error("Error:", err.message);
    }
  }
};

export const getNewAppointments = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}/api/new_appointments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch new appointments:", error);
    throw error;
  }
};
export const getTotalAppointments = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}/api/total_appointments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch new appointments:", error);
    throw error;
  }
};
export const getCancelledAppointments = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}/api/cancelled_appointments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch new appointments:", error);
    throw error;
  }
};

export const appointmentList = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/appointments`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const BussinessCategories = async () => {
  try {

    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/business_categories`,

    });
    return res;
  } catch (err) {
    console.log(err);
  }
};


export const updateAppointmentStatus = async (id: number, status: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: "post",
      url: `${BASE_URL}/api/appointments_status_update`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        id,
        status,
      },
    });
    return res;
  } catch (err) {
    console.error("Error updating appointment status:", err);
    throw err;
  }
};




export const addProduct = async (formData: FormData) => {
  const token = localStorage.getItem("token");
  return await axiosRequest({
    method: "post",
    url: `${BASE_URL}/api/products`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    formData,
  });
};
//update product
export const updateProduct = async (id: string, data: any) => {
  const token = localStorage.getItem("token");
  return await axiosRequest({
    method: 'put',
    url: `${BASE_URL}/api/products/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
};
export const addServices = async (data: any) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: 'post',
      url: `${BASE_URL}/api/services`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    return res;
  } catch (err: any) {
    console.log(err);
    throw new Error(err?.message || "Failed to add service.");
  }
};
export const uploadBulkFile = async (
  file: File,
  activeTab: 'products' | 'services',
  space_id: string
) => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file, file.name);
    formData.append("space_id", space_id);

    console.log('FormData entries:');


    const url = `${BASE_URL}/api/${activeTab}/bulkupload`;


    const res = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (err: any) {
    console.error('Full error:', err);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
    }
    throw new Error(err?.response?.data?.message || "Failed to upload file.");
  }
};












export const getSpacePrompt = async (spaceId: number) => {
  const token = localStorage.getItem("token");

  return await axios({
    method: "get",
    url: `${BASE_URL}/api/get_space_prompt`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      space_id: spaceId,
    },
  });
};

export const updateSpacePrompt = async (spaceId: number, promptContent: string) => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("Token not found");

  return await axios({
    method: "post",
    url: `${BASE_URL}/api/update_space_prompt`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      space_id: spaceId,
      prompt_content: promptContent,
    },
  });
};

export const updatePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token not found");

    return await axios({
      method: "post",
      url: `${BASE_URL}/api/update_password`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        current_password: currentPassword,
        new_password: newPassword,
      },
    });


  } catch (err) {
    console.log("Error updating password:", err);
    throw err;
  }
};




export const updateServices = async (id: string, data: any) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: 'put',
      url: `${BASE_URL}/api/services/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    return res;
  } catch (err: any) {
    console.log(err);
    throw new Error(err?.message || "Failed to add service.");
  }
};
export const deleteProduct = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: 'delete',
      url: `${BASE_URL}/api/products/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err: any) {
    console.log(err);
    throw new Error(err?.message || "Failed to delete product.");
  }
};
export const deleteService = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: 'delete',
      url: `${BASE_URL}/api/services/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err: any) {
    console.log(err);
    throw new Error(err?.message || "Failed to delete service.");
  }
};
export const getAllProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/products`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
  }
  return { data: [] };
};

export const getProductPage = async (page: number = 1) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/products?page=${page}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return { status: false, data: [] };
  }
};

export const getServicePage = async (page: number = 1) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/services?page=${page}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    return { status: false, data: [] };
  }
};






export const getnewCustomer = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/newCustomers`,
      headers: {
        Authorization: `Bearer ${token}`,
      }

    })
    return res;
  }
  catch (err) {
    console.log(err);

  }
}













export const getAllServices = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/api/services`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (err) {
    console.log(err);
  }
  return { data: [] };
};

export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/manual-token-check`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    return {
      err: { status: true },
    };
  }
};

export const loginApi = async (data: any) => {
  try {
    const res = await axiosRequest({
      method: "post",
      url: `${BASE_URL}/api/login`,
      headers: {},
      body: data,
    });
    localStorage.setItem("token", res.token);
    return res;
  } catch (err: any) {
    // Surface the API error back to the caller so the UI can show the real message
    // e.g., {"status": false, "message": "Invalid credentials"}
    throw new Error(err?.message || 'Login failed');
  }
};

export const logoutapi = async (data: any) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: "post",
      url: `${BASE_URL}/api/logout`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const registerApi = async (data: any) => {
  try {
    const res = await axiosRequest({
      method: "post",
      url: `${BASE_URL}/api/register`,
      headers: {},
      body: data,
    });

    return res;

  } catch (err) {
    console.log(err);
  }

};

export const searchProducts = async (query: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/api/products?search=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const searchServices = async (query: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${BASE_URL}/api/services?search=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};



export const countryApi = async () => {
  try {
    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/countries`,
      headers: {},
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};


export const fetchOrders = async () => {
  try {
    let token = localStorage.getItem("token");
    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/orders`,
      headers: {
        Authorization: `Bearer ${token}`
      },


    })
    return res.data;
  } catch (err) {
    console.log(err)

  }
}

export const ordersApi = async (data: any) => {
  try {
    let token = localStorage.getItem("token")
    let res = await axiosRequest({
      method: "post",
      url: `${BASE_URL}/api/orders_status_update`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data,
    })
    return res

  } catch (err) {
    console.log(err)
  }
}


export const fetchCustomerStatistics = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/customer_statistics`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    return res;
  } catch (err) {
    console.error('Error fetching customer statistics:', err);
    throw err; // Optional: rethrow for higher-level handling
  }
};


export const fetchAppointmentStatistics = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/appointment_statistics`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    return res;
  } catch (err) {
    console.error('Error fetching customer statistics:', err);
    throw err; // Optional: rethrow for higher-level handling
  }
};

export const fetchTotalChats = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/total_chats`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    return res;
  } catch (err) {
    console.error('Error fetching customer statistics:', err);
    throw err; // Optional: rethrow for higher-level handling
  }
};


export const OrderStatistics = async (data: any) => {
  try {
    let token = localStorage.getItem("token")
    let res = await axiosRequest({
      method: "get",
      url: `c`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data
    })
    return res
  } catch (err) {
    console.log(err)
  }
}



export const OrdersStatus = async (data: any) => {
  try {
    const token = localStorage.getItem("token")
    const res = await axiosRequest({
      method: "post",
      url: `${BASE_URL}/api/orders_status_update`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data
    })
    return res
  } catch (err) {
    console.log(err)
  }
}

export const spaceChats = async (spaceId: number) => {
  try {
    const token = localStorage.getItem("token")
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}/api/space_chat_stats`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        space_id: spaceId
      }

    })



    return res.data

  } catch (err) {
    console.log(err)
  }
}

export const spaceLiveChats = async (spaceId: number) => {
  try {
    const token = localStorage.getItem("token");
    console.log(' Token:', token ? 'Token exists' : 'No token found');
    console.log(' Making API call with spaceId:', spaceId);
    if (!token) {
      throw new Error("No authentication token found");
    }
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}/api/space_chat_list`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        space_id: spaceId,
      }
    });
    console.log(' Full API Response:', res);
    console.log(' Response Status:', res.status);
    console.log(' Response Data:', res.data);
    console.log('🌐 Response Data.data:', res.data.data);
    console.log('🌐 Type of res.data.data:', typeof res.data.data);
    return res.data.data
  } catch (err: any) {
    console.error('API Error:', err);
    if (err.response) {
      console.error('Error Response Status:', err.response.status);
      console.error('Error Response Data:', err.response.data);
    }
    throw err;
  }
};


export const RunAgent = async (spaceid: number) => {
  try {
    const token = localStorage.getItem("token")
    const res = await axios({
      method: "post",
      url: `${BASE_URL}/api/whapi/instance`,
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        space_id: spaceid
      }


    })
    return res

  } catch (err) {
    console.log(err)
  }
}


// export const RunAgentInfo = async (uuid: any, space_id: any) => {
//   try {
//     const token = localStorage.getItem("token")
//     const res = await axios.get(`https://api.joincroose.com/croose/api/run_agent/${uuid}`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       },
//       params: { space_id },
//       responseType: 'blob'
//     })


//     return res


//   } catch (err) {
//     console.log(err)
//   }
// }

export const RunAgentInfo = async (uuid: string) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    if (!uuid || uuid.trim() === "") {
      throw new Error("UUID is required before calling RunAgentInfo");
    }

    console.log(`Making RunAgentInfo call with UUID: ${uuid}`);

    const res = await axios.get(
      `https://api.joincroose.com/croose/api/run_agent/${uuid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 30000,
      }
    );

    console.log("RunAgentInfo success:", res);
    return res;
  } catch (err: any) {
    console.error("RunAgentInfo error:", err);

    if (err?.code === "ERR_NETWORK") {
      console.error(
        "Network error. This might be a CORS issue or server connectivity problem."
      );
    } else if (err?.response?.status === 404) {
      console.error("Agent not found. Please verify the UUID is correct.");
    } else if (err?.response?.status === 401) {
      console.error("Unauthorized. Please check your authentication token.");
    } else if (err?.response?.status === 403) {
      console.error("Forbidden. You may not have permission to access this resource.");
    } else if (err?.code === "ECONNABORTED") {
      console.error("Request timeout. The server took too long to respond.");
    }

    throw err;
  }
};


export const PayApi = async (uuid: any) => {
  try {
    const res = await axios.get(`https://api.joincroose.com/croose/api/paystack/whapi/${uuid}`);
    return res;
  } catch (err) {
    throw err;
  }
};

export const getQr = (space_id: string) => {
  const token = localStorage.getItem("token");
  return axios.get('https://api.joincroose.com/croose/api/whapi/instance/qr', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { space_id },
    responseType: 'blob'
  });
}

export const GetSpaceId = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token not found in localStorage");
    }

    const res = await axiosRequest({
      method: "get",
      url: `${BASE_URL}/api/space`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Fetched spaces from API →", res);
    return res;
  } catch (err) {
    console.error("Error fetching space data:", err);
    throw err;
  }
};


export const getProductsBySpace = async (spaceId: number) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/api/getProductBySpace`, {
      params: {
        space_id: spaceId
      },
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data.data;
  } catch (error) {
    console.error('Error fetching products by space:', error);
    throw error;
  }
};
export const getServicesBySpace = async (spaceId: number) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/api/getServicesBySpace`, {
      params: {
        space_id: spaceId
      },
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data.data;
  } catch (error) {
    console.error('Error fetching services by space:', error);
    throw error;
  }
};
export const ManualOrder = async (orderData: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/createmanualorder`, orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  } catch (error) {
    console.error('Error creating manual order:', error);
    throw error;
  }
};

export const getCustomerByPhoneAPi = async (whatsappNumber: number) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/getCustomerByPhone`, {
      params: {
        whatsapp_number: whatsappNumber
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return res.data;
  } catch (error) {
    console.error('Error fetching customer by phone:', error);
    throw error;
  }
};

export const resetPassword = async (email: string, securityQuestion: string, securityAnswer: string, newPassword: string, phoneNumber: string) => {
  try {
    return await axios({
      method: 'post',
      url: `${BASE_URL}/api/reset_password`,
      data: {
        email,
        phone_number: phoneNumber, // Now using actual phone number
        security_question: securityQuestion,
        security_answer: securityAnswer,
        password: newPassword,
        password_confirmation: newPassword
      }
    });

  } catch (err) {
    console.log('Reset password error:', err);
    throw err;
  }
};

export const getBroadcastList = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${BASE_URL}/api/broadcast/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error('Error fetching broadcast list:', error);
    throw error;
  }
};
export const getTargetList = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${BASE_URL}/api/target/list`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error('Error fetching broadcast list:', error);
    throw error;
  }
};

export const addBroadcast = async (data: any) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${BASE_URL}/api/broadcast/add`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error('Error adding broadcast:', error);
    throw error;
  }
};
export const addNewMessage = async (data: any) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${BASE_URL}/api/sendBroadcastMessage`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error('Error adding New Message :', error);
    throw error;
  }
};
