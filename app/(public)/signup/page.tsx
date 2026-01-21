'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import Link from 'next/link';
import Selectbox from '../component/selectbox';
import { registerApi, verifySignupOtpApi, completeRegistrationApi } from '@/app/Apis/publicapi';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import PublicRoute from '../component/publiroute';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react/dist/iconify.js';

type SignupFormValues = {
  name: string;
  business_name: string;
  business_location: any;
  phone_number: string;
  email: string;
  password: string;
  otp: string;
};


const Signupform = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      name: '',
      business_name: '',
      business_location: null,
      phone_number: '',
      email: '',
      password: '',
      otp: '',
    },
    validate: (values) => {
      const errors: Partial<SignupFormValues> = {};

      if (currentStep === 1) {
        if (!values.name) errors.name = 'Name is required';
        if (!values.email) errors.email = 'Email is required';
        else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = 'Invalid email address';
        }
      }

      if (currentStep === 2) {
        if (!values.otp) errors.otp = 'OTP is required';
        else if (values.otp.length !== 6) {
          errors.otp = 'OTP must be 6 digits';
        }
      }

      if (currentStep === 3) {
        if (!values.password || values.password.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        }
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        if (currentStep === 1) {
          // Step 1: Initial registration (send OTP)
          const res = await registerApi({
            name: values.name,
            business_name: values.business_name,
            business_location: values.business_location,
            phone_number: values.phone_number,
            email: values.email,
          });

          if (res?.status) {
            setSnackbar({
              open: true,
              message: res.message || 'OTP sent to your email!',
              severity: 'success',
            });
            setRegisteredEmail(values.email);
            setCurrentStep(2);
          } else {
            let errorMsg = res.message || 'Registration failed';
            if (res.errors?.email?.length > 0) {
              errorMsg = res.errors.email[0];
            }
            setSnackbar({
              open: true,
              message: errorMsg,
              severity: 'error',
            });
          }
        } else if (currentStep === 2) {
          // Step 2: Verify OTP
          const res = await verifySignupOtpApi({
            email: registeredEmail,
            otp: parseInt(values.otp),
          });

          if (res?.status) {
            setSnackbar({
              open: true,
              message: res.message || 'OTP verified successfully!',
              severity: 'success',
            });
            setCurrentStep(3);
          } else {
            setSnackbar({
              open: true,
              message: res.message || 'Invalid OTP',
              severity: 'error',
            });
          }
        } else if (currentStep === 3) {
          // Step 3: Complete registration with password
          const res = await completeRegistrationApi({
            name: values.name,
            business_name: values.business_name,
            business_location: values.business_location,
            phone_number: values.phone_number,
            email: registeredEmail,
            password: values.password,
          });

          if (res?.status) {
            setSnackbar({
              open: true,
              message: res.message || 'Registration completed successfully!',
              severity: 'success',
            });

            if (res.token) {
              localStorage.setItem('token', res.token);
            }

            setTimeout(() => {
              router.push('/login');
            }, 1500);
          } else {
            setSnackbar({
              open: true,
              message: res.message || 'Registration failed',
              severity: 'error',
            });
          }
        }
      } catch (err: any) {
        console.error('Registration Error:', err);
        setSnackbar({
          open: true,
          message: err?.message || 'An error occurred. Please try again.',
          severity: 'error',
        });
      }
    },
  });

  return (
    <PublicRoute>
      <div className="flex">
        <div className="hidden select-none pt-[11px] pl-[7px] w-[684px] h-[1000px] bg-[#685BC71F] md:block">
          <div className="w-[190px] h-[67.05px] mt-[40.94px] ml-[45px]">
            <img className="w-[173.52px] h-[40.24px] mt-[11.05px] ml-[7.66px]" src="Vector.png" alt="Logo" />
          </div>
          <div className="flex justify-center items-center flex-col gap-[47px] mt-[20px] w-full h-auto">
            <img className="w-[440px] h-[431px]" src="cover.png" alt="cover" />
            <div className="flex items-center flex-col w-[532px] h-auto gap-[16px]">
              <p className="text-[#1D2939] font-bold text-[40px] text-center leading-[40px]">
                The fastest way to automate your business
              </p>
              <p className="font-normal text-center text-[18px] leading-[28px] text-[#344054]">
                Croose helps you run your business on WhatsApp with an AI agent that handles bookings, payments, messages, and more — all in one place
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex h-[900px] md:-mt-[40px] md:p-[80px_160px]">
          <section className="w-full md:w-[435px] h-auto flex flex-col gap-[32px]">
            <div className="p-6 space-y-4 sm:p-8">
              <h1 className="font-bold text-[32px] select-none  text-[#1D2939]">Create an account</h1>

              <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Step 1: User Details */}
                {currentStep === 1 && (
                  <>
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium select-none text-[#344054]">Full Name</label>
                      <input type="text" name="name" id="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter Name" className="w-full h-[44px] p-[16px] text-sm border border-gray-300 rounded-[12px] outline-none" />
                      {formik.touched.name && formik.errors.name && <p className="text-red-500  text-sm mt-1">{formik.errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="business_name" className="block mb-2 text-sm font-medium select-none text-[#344054]">Business Name</label>
                      <input type="text" name="business_name" id="business_name" value={formik.values.business_name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter Business Name" className="w-full h-[44px] p-[16px] text-sm border border-gray-300 rounded-[12px] outline-none" />
                    </div>

                    <div>
                      <Selectbox formik={formik} />
                    </div>

                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium select-none  text-[#344054]">Email</label>
                      <input type="email" name="email" id="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter Email" className="w-full h-[44px] p-[16px] text-sm border border-gray-300 rounded-[12px] outline-none" />
                      {formik.touched.email && formik.errors.email && <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>}
                    </div>

                    <div>
                      <label htmlFor="phone_number" className="block mb-2 text-sm font-medium select-none text-[#344054]">Mobile Number</label>
                      <input type="text" name="phone_number" id="phone_number" value={formik.values.phone_number} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter Mobile Number" className="w-full h-[44px] p-[16px] text-sm border border-gray-300 rounded-[12px] outline-none" />
                    </div>
                  </>
                )}

                {/* Step 2: OTP Verification */}
                {currentStep === 2 && (
                  <div>
                    <label htmlFor="otp" className="block mb-2 text-sm font-medium select-none text-[#344054]">Enter OTP</label>
                    <p className="text-sm text-gray-600 mb-2">We've sent a 6-digit OTP to {registeredEmail}</p>
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      value={formik.values.otp}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="w-full h-[44px] p-[16px] text-sm border border-gray-300 rounded-[12px] outline-none"
                    />
                    {formik.touched.otp && formik.errors.otp && <p className="text-red-500 text-sm mt-1">{formik.errors.otp}</p>}
                  </div>
                )}

                {/* Step 3: Password Setup */}
                {currentStep === 3 && (
                  <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium select-none text-[#344054]">Set Password (Min of 8 characters)</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter Password"
                        className="w-full h-[44px] p-[16px] text-sm border border-gray-300 rounded-[12px] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <Icon icon={showPassword ? "tabler:eye-off-filled" : "tabler:eye-filled"} width="20" height="20" />
                      </button>
                    </div>
                    {formik.touched.password && formik.errors.password && <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>}
                  </div>
                )}

                <button type="submit" className="bg-[#685BC7] cursor-pointer text-white font-semibold text-sm flex justify-center items-center w-full h-[48px] rounded-[12px]">
                  {currentStep === 1 && 'Send OTP'}
                  {currentStep === 2 && 'Verify OTP'}
                  {currentStep === 3 && 'Complete Registration'}
                </button>

                <div className="text-center  text-sm text-[#101828] mt-2">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#685BC7] font-medium hover:underline">Log In</Link>
                </div>

                {currentStep === 1 && (
                  <>
                    <div className="flex items-center justify-center w-full gap-4 my-4">
                      <hr className="flex-grow border-t border-gray-300" />
                      <span className="text-gray-500 text-sm font-medium">OR</span>
                      <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <div className='cursor-pointer' >
                      <button type="button" className="flex cursor-pointer items-center justify-center gap-2 w-full h-[48px] border rounded-[12px] text-sm font-medium text-[#344054] border-[#EAECF0]">
                        <img src="google.png" alt="Google" className="w-5 h-5" />
                        Continue with Google
                      </button>
                      <button type="button" className="flex cursor-pointer items-center justify-center gap-2 w-full h-[48px] mt-2 border rounded-[12px] text-sm font-medium text-[#344054] border-[#EAECF0]">
                        <img src="apple.jpeg" alt="Apple" className="w-9 h-auto" />
                        Continue with Apple
                      </button>
                    </div>
                  </>
                )}
              </form>

              <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              >
                <MuiAlert
                  onClose={handleCloseSnackbar}
                  severity={snackbar.severity}
                  sx={{ width: '100%' }}
                  variant="filled"
                  elevation={6}
                >
                  {snackbar.message}
                </MuiAlert>
              </Snackbar>
            </div>
          </section>
        </div>
      </div>
    </PublicRoute>
  );
};

export default Signupform;
