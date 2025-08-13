'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { findAccountByEmail } from '@/app/Apis/publicapi'

const Forgotcard = (props: any) => {
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [accountName, setAccountName] = useState(''); // Store account holder's name

  const handleVerifyEmail = async () => {
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const res = await findAccountByEmail(email);
      console.log('Email verification response:', res);
      
      // Check if account exists using account_existing_status
      if (res?.status === 200 && res?.account_existing_status === 1) {
        // Store the account name for display
        setAccountName(res.name || '');
        
        // Since API doesn't return security question, keep dropdown enabled
        // User will select their security question
        setIsEmailVerified(true);
        setSuccess(`Account found for ${res.name}. Please select and answer your security question.`);
      } else if (res?.account_existing_status === 0) {
        setError('No account found with this email address. Please check and try again.');
      } else {
        setError(res?.message || 'Email not found. Please check and try again.');
      }
    } catch (err: any) {
      console.error('Email verification error:', err);
      // Handle different error scenarios
      if (err?.response?.status === 404) {
        setError('No account found with this email address.');
      } else if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Unable to verify email. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation checks
    if (!securityQuestion) {
      setError('Please select a security question');
      return;
    }
    
    if (!securityAnswer.trim()) {
      setError('Please provide an answer to the security question');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Add password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(newPassword)) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would call your password reset API
      // const resetRes = await resetPassword(email, securityQuestion, securityAnswer, newPassword);
      
      console.log('Password reset request:', {
        email,
        securityQuestion,
        securityAnswer,
        newPassword,
        confirmPassword
      });
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Password reset successfully! You can now login with your new password.');
      
      // Clear form after successful reset
      setTimeout(() => {
        // Redirect to login or clear form
        window.location.href = '/login';
      }, 2000);
      
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err?.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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
            Reset Password
          </h1>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-sm">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-[#344054] text-sm font-medium mb-1"
              >
                Email Address
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email"
                  className="flex-1 h-11 px-4 text-sm text-[#667085] border border-gray-300 rounded-xl outline-none focus:border-[#685BC7] focus:ring-1 focus:ring-[#685BC7]"
                  required
                  disabled={isEmailVerified}
                />
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={isLoading || isEmailVerified}
                  className="px-4 h-11 bg-[#685BC7] text-white text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5a4db5] transition-colors whitespace-nowrap"
                >
                  {isLoading ? 'Verifying...' : isEmailVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
              {isEmailVerified && (
                <div className="flex items-center gap-2 mt-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600 text-xs">
                    Email verified successfully{accountName && ` - ${accountName}`}
                  </span>
                </div>
              )}
            </div>

            {/* Security Question */}
            <div className="flex flex-col">
              <label
                htmlFor="security-question"
                className="text-[#344054] text-sm font-medium mb-1"
              >
                Security Question
              </label>
              <select
                id="security-question"
                name="security-question"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="h-11 px-4 text-sm text-[#667085] border border-gray-300 rounded-xl outline-none focus:border-[#685BC7] focus:ring-1 focus:ring-[#685BC7] disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!isEmailVerified}
              >
                <option value="">{isEmailVerified ? "Select a security question" : "Verify email first"}</option>
                <option value="pet">What was your first pet's name?</option>
                <option value="school">What was your primary school's name?</option>
                <option value="city">In which city were you born?</option>
                <option value="nickname">What is your childhood nickname?</option>
                <option value="mother">What is your mother's maiden name?</option>
                <option value="teacher">What was your favorite teacher's name?</option>
                <option value="food">What is your favorite food?</option>
                <option value="book">What is your favorite book?</option>
              </select>
            </div>

            {/* Security Answer */}
            <div className="flex flex-col">
              <label
                htmlFor="security-answer"
                className="text-[#344054] text-sm font-medium mb-1"
              >
                Your Answer
              </label>
              <input
                type="text"
                name="security-answer"
                id="security-answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder={isEmailVerified ? "Enter your answer" : "Verify email first"}
                className="h-11 px-4 text-sm text-[#667085] border border-gray-300 rounded-xl outline-none focus:border-[#685BC7] focus:ring-1 focus:ring-[#685BC7] disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!isEmailVerified}
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-[#344054] text-sm font-medium mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={isEmailVerified ? "Enter new password" : "Verify email first"}
                className="h-11 px-4 text-sm text-[#667085] border border-gray-300 rounded-xl outline-none focus:border-[#685BC7] focus:ring-1 focus:ring-[#685BC7] disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!isEmailVerified}
              />
              <small className="text-xs text-[#667085] mt-1">
                Must be at least 8 characters with uppercase, lowercase, number and special character
              </small>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label
                htmlFor="confirm-password"
                className="text-[#344054] text-sm font-medium mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={isEmailVerified ? "Confirm password" : "Verify email first"}
                className="h-11 px-4 text-sm text-[#667085] border border-gray-300 rounded-xl outline-none focus:border-[#685BC7] focus:ring-1 focus:ring-[#685BC7] disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled={!isEmailVerified}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={!isEmailVerified || isLoading}
                className="w-full h-11 bg-[#685BC7] text-white text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5a4db5] transition-colors"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
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