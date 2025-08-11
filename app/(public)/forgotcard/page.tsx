import React from 'react'
import Link from 'next/link'

const Forgotcard = () => {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center w-full border-b border-[#EAECF0] py-4 px-5">
        <img
          className="w-36 sm:w-44 md:w-[173px] mt-2"
          src="Vector.png"
          alt="crooselogo"
        />
        <Link
        href={'/signup'}
        >
        <p className="text-sm sm:text-base">Sign Up</p>
        </Link>
      </div>

      {/* Main Card */}
      <div className="flex justify-center items-center flex-1 px-4 py-10">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-[#201E1F]">
            Reset Password
          </h1>

          <form className="space-y-4" action="#">

            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-[#344054] text-sm font-medium mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="h-11 px-4 text-sm text-[#98A2B3] border border-gray-300 rounded-xl outline-none"
                required
              />
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
                className="h-11 px-4 text-sm text-[#98A2B3] border border-gray-300 rounded-xl outline-none"
                required
              >
                <option value="">Select a question</option>
                <option value="pet">What was your first pet's name?</option>
                <option value="school">What was your primary school's name?</option>
                <option value="city">In which city were you born?</option>
                <option value="nickname">What is your childhood nickname?</option>
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
                placeholder="Enter your answer"
                className="h-11 px-4 text-sm text-[#98A2B3] border border-gray-300 rounded-xl outline-none"
                required
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
                placeholder="Enter new password"
                className="h-11 px-4 text-sm text-[#98A2B3] border border-gray-300 rounded-xl outline-none"
                required
              />
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
                placeholder="Confirm password"
                className="h-11 px-4 text-sm text-[#98A2B3] border border-gray-300 rounded-xl outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full h-11 bg-[#685BC7] text-white text-sm font-medium rounded-xl"
              >
                Reset Password
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Forgotcard
