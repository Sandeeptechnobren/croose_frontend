'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { addForgetPassword } from '@/app/Apis/publicapi'
import toast, { Toaster } from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

const Forgotcard = (props: any) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: email
      };

      console.log('Sending OTP request:', payload);
      const res = await addForgetPassword(payload);
      console.log('OTP sending response:', res);

      const isSuccess = res?.status === 200 || res?.status === "200" || res?.status === true || res?.success || res?.message?.toLowerCase().includes('sent');

      if (isSuccess) {
        toast.success(res?.message || `OTP has been sent to ${email}`);
        setStep(2);
      } else {
        toast.error(res?.message || 'Failed to send OTP. Please check your email.');
      }
    } catch (err: any) {
      console.error('OTP sending error:', err);
      toast.error(err?.response?.data?.message || 'Unable to send OTP. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: email,
        otp: parseInt(otp)
      };

      console.log('Verifying OTP payload:', payload);
      const res = await addForgetPassword(payload);
      console.log('OTP verification response:', res);

      const isSuccess = res?.status === 200 || res?.status === "200" || res?.status === true || res?.success || res?.message?.toLowerCase().includes('verified') || res?.message?.toLowerCase().includes('success');

      if (isSuccess) {
        toast.success(res?.message || 'OTP verified successfully!');
        setStep(3);
      } else {
        toast.error(res?.message || 'Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      console.error('OTP verification error:', err);
      toast.error(err?.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      toast.error('Password must contain uppercase, lowercase, number, and special character');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email: email,
        otp: parseInt(otp),
        new_password: newPassword,
        confirm_password: confirmPassword
      };

      console.log('Resetting password payload:', payload);
      const res = await addForgetPassword(payload);
      console.log('Reset password response:', res);

      const isSuccess = res?.status === 200 || res?.status === "200" || res?.status === true || res?.success || res?.message?.toLowerCase().includes('success');

      if (isSuccess) {
        toast.success(res?.message || 'Password reset successfully!');

        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error(res?.message || 'Failed to reset password.');
      }
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast.error(err?.response?.data?.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* Header */}
      <div className="flex justify-between items-center w-full border-b border-[#EAECF0] py-4 px-5">
        <img
          className="w-36 sm:w-44 md:w-[173px] mt-2"
          src="Vector.png"
          alt="crooselogo"
        />
        <Link href={'/signup'}>
          <p className="text-sm sm:text-base">Sign Up</p>
        </Link>
      </div>

      {/* Main Card */}
      <div className="flex justify-center items-center flex-1 px-4 py-10">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-[#201E1F]">
            {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Set New Password'}
          </h1>
          <p className="text-[#667085] text-sm">
            {step === 1
              ? 'Enter your email to receive a password reset OTP'
              : step === 2
                ? `We've sent an OTP to ${email}`
                : 'Please enter your new password below'}
          </p>

          <form className="space-y-4" onSubmit={step === 1 ? handleVerifyEmail : step === 2 ? handleVerifyOTP : handleResetPassword}>
            {step === 1 && (
              <div className="flex flex-col">
                <label htmlFor="email" className="text-[#344054] text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-11 px-4 text-sm text-[#667085] border border-gray-300 rounded-xl outline-none focus:border-[#685BC7] focus:ring-1 focus:ring-[#685BC7]"
                  required
                />
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col">
                <label htmlFor="otp" className="text-[#344054] text-sm font-medium mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6 digit OTP"
                  className="h-11 px-4 text-sm text-[#667085] border border-gray-300 rounded-xl outline-none focus:border-[#685BC7] focus:ring-1 focus:ring-[#685BC7]"
                  required
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#685BC7] mt-2 text-left hover:underline"
                >
                  Change Email?
                </button>
              </div>
            )}

            {step === 3 && (
              <>
                <div className="flex flex-col">
                  <label htmlFor="password" className="text-[#344054] text-sm font-medium mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full h-11 px-4 pr-10 text-sm text-[#667085] border border-gray-300 rounded-xl outline-none focus:border-[#685BC7] focus:ring-1 focus:ring-[#685BC7]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <small className="text-xs text-[#667085] mt-1">
                    At least 8 chars, uppercase, lowercase, number & special char
                  </small>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="confirm-password" className="text-[#344054] text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full h-11 px-4 pr-10 text-sm text-[#667085] border border-gray-300 rounded-xl outline-none focus:border-[#685BC7] focus:ring-1 focus:ring-[#685BC7]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#685BC7] text-white text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5a4db5] transition-colors"
              >
                {isLoading
                  ? (step === 1 ? 'Verifying Email...' : step === 2 ? 'Verifying OTP...' : 'Resetting Password...')
                  : (step === 1 ? 'Verify Email' : step === 2 ? 'Verify OTP' : 'Reset Password')}
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link href="/login" className="text-[#685BC7] text-sm hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forgotcard
