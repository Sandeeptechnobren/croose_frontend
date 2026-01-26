// 'use client'
// import React, { useEffect } from 'react'
// import { Icon } from '@iconify/react/dist/iconify.js'
// import Selectbox from '@/app/(public)/component/selectbox'
// import { useFormik } from 'formik'
// import { SettingContext } from '@/app/context/SettingContext'
// import Snackbar from '@mui/material/Snackbar';
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'

// import { useContext } from 'react'
// import { logoutapi, registerApi, updatePassword } from '@/app/Apis/publicapi'

// const Setting1 = () => {

//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const router = useRouter()
//   const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'security'


//   const { setOpenSetting1 } = useContext<any>(SettingContext)

//   const formik = useFormik({
//     initialValues: {
//       fullName: '',
//       businessName: '',
//       businessLocation: '',
//       email: '',
//     },
//     onSubmit: (values) => {
//       console.log('Form submitted:', values)
//     },
//   })

//   const handlelogout = async () => {
//     try {
//       await logoutapi({});
//       localStorage.removeItem("token");
//       setOpenSetting1(false);
//       setSnackbarMessage('Logout successful');
//       setOpenSnackbar(true);

//       setTimeout(() => {
//         router.push("/login");
//       }, 1000);
//     } catch (err: any) {
//       setSnackbarMessage(err.message || "Logout failed");
//       setOpenSnackbar(true);
//     }
//   };

//   const [registerData, setUser] = useState<any>()

//   useEffect(() => {
//     const storedUser = localStorage.getItem('userdata')
//     if (storedUser) {
//       setUser(JSON.parse(storedUser))
//       console.log(storedUser)
//     }
//   }, [])

//   // Security tab states
//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [oldPass, setOldPass] = useState('');
//   const [newPass, setNewPass] = useState('');
//   const [confirmPass, setConfirmPass] = useState('');
//   const [msg, setMsg] = useState('');

//   const handlePasswordUpdate = async () => {
//     if (newPass !== confirmPass) {
//       setMsg("New password and confirm password do not match.");
//       return;
//     }

//     try {
//       await updatePassword(oldPass, newPass);
//       setMsg("Password updated successfully!");
//       setOldPass('');
//       setNewPass('');
//       setConfirmPass('');
//       setSnackbarMessage('Password updated successfully!');
//       setOpenSnackbar(true);
//     } catch (err) {
//       setMsg("Failed to update password. Check your current password.");
//     }
//   };

//   return (
//     <div>
//       <div className="fixed inset-0 flex items-center justify-center bg-[#9999] p-4 sm:p-6 select-none z-[10001]">

//         <div className="relative z-[10002] flex justify-center items-center w-full">
//           <div className="w-full max-w-[800px] min-h-[700px] opacity-100 border-[#E2E4E84D] bg-[#ffffff] rounded-[16px] border border-solid overflow-y-auto">

//             <section className="w-full h-auto flex justify-between items-center border-b border-[#F6F6F6] rounded-t-[16px] px-4 py-3 sm:px-[20px] sm:py-[12px]">
//               <span className="w-auto font-inter font-semibold text-[18px] sm:text-[20px] leading-[150%] tracking-[-0.04em] text-[#1D2939]">
//                 Settings
//               </span>
//               <span className="w-9 h-9 rounded-full border p-2 flex items-center cursor-pointer justify-center border-[#F1F2F3] bg-[#F6F8FA]" onClick={() => setOpenSetting1(false)}>
//                 <Icon icon="iconamoon:close-bold" width="24" height="24" style={{ color: '#000' }} />
//               </span>
//             </section>

//             <section className="w-full h-auto px-4 py-4 sm:px-[64px] sm:py-[24px] flex flex-col">
//               <div className="w-full flex flex-col gap-4">
//                 <div className="w-full flex flex-wrap items-center gap-2 sm:gap-5">
//                   <div className="flex flex-wrap gap-2 w-full">
//                     <button
//                       className={`rounded-sm text-sm px-3 py-2 ${activeTab === 'profile' ? 'bg-[#F9F5FF]' : ''}`}
//                       onClick={() => setActiveTab('profile')}
//                     >
//                       <span className={`font-semibold text-[14px] ${activeTab === 'profile' ? 'text-[#685BC7]' : 'text-[#667085] hover:text-[#685BC7]'}`}>
//                         Profile
//                       </span>
//                     </button>
//                     <button
//                       className={`rounded-sm text-sm px-3 py-2 ${activeTab === 'security' ? 'bg-[#F9F5FF]' : ''}`}
//                       onClick={() => setActiveTab('security')}
//                     >
//                       <span className={`font-semibold text-[14px] ${activeTab === 'security' ? 'text-[#685BC7]' : 'text-[#667085] hover:text-[#685BC7]'}`}>
//                         Security
//                       </span>
//                     </button>
//                     <button className="rounded-sm text-sm px-3 py-2" onClick={handlelogout}>
//                       <span className="font-semibold text-[14px] text-[#667085] hover:text-[red] bg-[white] rounded-sm text-sm px-3 py-2 hover:cursor-pointer">Log Out</span>
//                     </button>
//                   </div>
//                 </div>
//                 <div className="text-[18px] font-semibold text-[#101828]">
//                   {activeTab === 'profile' ? 'Account Profile' : 'Security'}
//                 </div>
//               </div>

//               {/* Profile Tab Content */}
//               {activeTab === 'profile' && (
//                 <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
//                   <div className="flex flex-col items-start gap-4">
//                     <div className="flex items-center gap-4">
//                       <img src="/userse.png" className="w-[80px] h-[80px] bg-[#F2F4F7] rounded-full" />
//                       <div className="rounded-[64px] bg-[#F2F4F7] px-5 py-2 text-center">
//                         <span className="text-[12px] font-semibold text-[#475467]">Upload Photo</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 lg:col-span-2">
//                     <div>
//                       <label className="block text-sm font-medium text-[#344054] mb-1">Full Name</label>
//                       <div className="w-full h-[44px] text-[#98A2B3] flex items-center text-sm rounded-[12px] border border-[#D0D5DD] px-4">
//                         {registerData?.data?.name}
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-[#344054] mb-1">Business Name</label>
//                       <div className="w-full h-[44px] text-[#98A2B3] flex items-center text-sm rounded-[12px] border border-[#D0D5DD] px-4">
//                         {registerData?.data?.business_name}
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-[#344054] mb-1">Business location</label>
//                       <div className="w-full h-[44px] text-[#98A2B3] flex items-center text-sm rounded-[12px] border border-[#D0D5DD] px-4">
//                         {registerData?.data?.business_location}
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-[#344054] mb-1">Email</label>
//                       <div className="w-full h-[44px] text-[#98A2B3] text-sm rounded-[12px] flex items-center border border-[#D0D5DD] px-4">
//                         {registerData?.data?.email}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Security Tab Content */}
//               {activeTab === 'security' && (
//                 <div className="w-full flex flex-col gap-4 mt-4">
//                   <div className="w-full flex flex-col">
//                     <label className="block font-medium text-sm leading-5 font-inter text-[#344054] mb-1">Current Password</label>
//                     <div className="relative w-full">
//                       <input
//                         type={showOldPassword ? "text" : "password"}
//                         onChange={(e) => setOldPass(e.target.value)}
//                         value={oldPass}
//                         className="w-full h-[44px] border-[1px] border-[#D0D5DD] rounded-[12px] px-3"
//                         placeholder="Enter your current password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowOldPassword(!showOldPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                       >
//                         <Icon icon={showOldPassword ? "tabler:eye-off-filled" : "tabler:eye-filled"} width="20" height="20" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="w-full flex flex-col">
//                     <label className="block font-medium text-sm leading-5 font-inter text-[#344054] mb-1">New Password</label>
//                     <div className="relative w-full">
//                       <input
//                         type={showNewPassword ? "text" : "password"}
//                         onChange={(e) => setNewPass(e.target.value)}
//                         value={newPass}
//                         className="w-full h-[44px] border-[1px] border-[#D0D5DD] rounded-[12px] px-3"
//                         placeholder="Enter new password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowNewPassword(!showNewPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                       >
//                         <Icon icon={showNewPassword ? "tabler:eye-off-filled" : "tabler:eye-filled"} width="20" height="20" />
//                       </button>
//                     </div>
//                   </div>

//                   <div className="w-full flex flex-col">
//                     <label className="block font-medium text-sm leading-5 font-inter text-[#344054] mb-1">Confirm Password</label>
//                     <div className="relative w-full">
//                       <input
//                         type={showConfirmPassword ? "text" : "password"}
//                         onChange={(e) => setConfirmPass(e.target.value)}
//                         value={confirmPass}
//                         className="w-full h-[44px] border-[1px] border-[#D0D5DD] rounded-[12px] px-3"
//                         placeholder="Confirm new password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//                       >
//                         <Icon icon={showConfirmPassword ? "tabler:eye-off-filled" : "tabler:eye-filled"} width="20" height="20" />
//                       </button>
//                     </div>
//                     {msg && <p className="text-sm mt-2 text-[red]">{msg}</p>}
//                   </div>
//                 </div>
//               )}
//             </section>

//             <section className="w-full flex justify-end border-t border-[#F6F6F6] px-4 py-3 sm:px-[20px] sm:py-[12px]">
//               {activeTab === 'profile' ? (
//                 <button
//                   onClick={() => { formik.handleSubmit() }}
//                   className="rounded-lg cursor-pointer bg-[#685BC7] text-white text-sm font-semibold px-7 py-2"
//                 >
//                   Save changes
//                 </button>
//               ) : (
//                 <button
//                   onClick={handlePasswordUpdate}
//                   className="rounded-lg cursor-pointer bg-[#685BC7] text-white text-sm font-semibold px-7 py-2"
//                 >
//                   Update password
//                 </button>
//               )}
//             </section>
//           </div>
//         </div>
//       </div>

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={3000}
//         onClose={() => setOpenSnackbar(false)}
//         message={snackbarMessage}
//       />
//     </div>
//   )
// }

// export default Setting1

'use client'
import React, { useEffect, useState, useContext } from 'react'
import { Icon } from '@iconify/react'
import Snackbar from '@mui/material/Snackbar'
import { useRouter } from 'next/navigation'
import { SettingContext } from '@/app/context/SettingContext'
import { logoutapi, updatePassword, addProfileUpdate } from '@/app/Apis/publicapi'

const Setting1 = () => {
  const router = useRouter()
  const { setOpenSetting1 } = useContext<any>(SettingContext)

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [registerData, setRegisterData] = useState<any>(null)

  // Profile Form State
  const [isLoading, setIsLoading] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    business_name: '',
    business_location: '',
    email: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Security Form State
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('userdata')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      console.log('Current stored user data:', parsedUser)
      setRegisterData(parsedUser)
      setProfileForm({
        name: parsedUser?.data?.name || '',
        business_name: parsedUser?.data?.business_name || '',
        business_location: parsedUser?.data?.business_location || '',
        email: parsedUser?.data?.email || ''
      })
      // If there's an existing photo, you might want to show it. The API response has 'profile_photo'.
      // Usually it's a path, so we'd need the base URL or just rely on the fallback U icon until they upload a new one.
      // But for now, we leave previewImage null unless they select a new file.
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', profileForm.name)
      formData.append('business_name', profileForm.business_name)
      formData.append('business_location', profileForm.business_location)
      formData.append('email', profileForm.email)

      if (selectedFile) {
        formData.append('photo', selectedFile)
      }

      const response = await addProfileUpdate(formData)

      // Update local storage and state with new data
      if (response && response.data) {
        // Construct the new userdata object, preserving structure if needed. 
        // Assuming response structure matches what's stored in userdata.
        // The user showed: "data": { "id": 22, ... }
        // We will merge this into the existing structure or replace it.
        const updatedUser = { ...registerData, data: response.data }
        localStorage.setItem('userdata', JSON.stringify(updatedUser))
        setRegisterData(updatedUser)
        setProfileForm({
          name: response.data.name,
          business_name: response.data.business_name,
          business_location: response.data.business_location,
          email: response.data.email
        })

        setSnackbarMessage('Profile updated successfully!')
        setOpenSnackbar(true)
      }
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to update profile')
      setOpenSnackbar(true)
    } finally {
      setIsLoading(false)
    }
  }

  const canUpdatePassword =
    oldPass.trim() !== '' &&
    newPass.trim() !== '' &&
    confirmPass.trim() !== '' &&
    newPass === confirmPass

  const handlePasswordUpdate = async () => {
    if (!canUpdatePassword) return
    try {
      await updatePassword(oldPass, newPass)
      setSnackbarMessage('Password updated successfully')
      setOpenSnackbar(true)
      setOldPass('')
      setNewPass('')
      setConfirmPass('')
      setError('')
    } catch {
      setError('Current password is incorrect')
    }
  }

  const handleLogout = async () => {
    await logoutapi({})
    // Close settings modal
    setOpenSetting1(false)
    // Clear all authentication data
    localStorage.removeItem('token')
    localStorage.removeItem('userdata')
    setSnackbarMessage('Logout successful')
    setOpenSnackbar(true)
    setTimeout(() => router.push('/login'), 800)
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>

      <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/40 px-4 animate-fadeIn">
        <div className="w-full max-w-[800px] min-h-[700px] bg-white rounded-[16px] shadow-xl flex flex-col max-h-[90vh] overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b bg-[#13102E] shrink-0">
            <h2 className="text-[20px] font-semibold text-white">Settings</h2>
            <button
              onClick={() => setOpenSetting1(false)}
              className="w-9 h-9 rounded-full border bg-[#F6F8FA] flex items-center justify-center hover:bg-[#EEF1F4] active:scale-95 transition"
            >
              <Icon icon="iconamoon:close-bold" width="20" />
            </button>
          </div>

          <div className="flex gap-6 px-6 pt-4 border-b shrink-0">
            {['profile', 'security'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 text-sm font-semibold transition-all duration-300 ${activeTab === tab
                  ? 'text-[#685BC7] border-b-2 border-[#685BC7]'
                  : 'text-[#667085] hover:text-[#685BC7]'
                  }`}
              >
                {tab === 'profile' ? 'Profile' : 'Security'}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="ml-auto text-sm font-semibold text-[#667085] hover:text-red-500 active:scale-95 transition"
            >
              Log out
            </button>
          </div>

          <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">

            {activeTab === 'profile' && (
              <div className="animate-slideUp space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-[80px] h-[80px] rounded-full bg-[#F2F4F7] flex items-center justify-center overflow-hidden border border-gray-200 relative group">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover animate-fadeIn"
                      />
                    ) : registerData?.data?.profile_photo ? (
                      <img
                        src={`https://api.joincroose.com/storage/${registerData.data.profile_photo}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.log("Image failed to load:", target.src);

                          if (target.src.includes('api.joincroose.com/storage/')) {
                            console.log("Trying path 2: /croose/storage/");
                            target.src = `https://api.joincroose.com/croose/storage/${registerData.data.profile_photo}`;
                          } else if (target.src.includes('api.joincroose.com/croose/storage/')) {
                            console.log("Trying path 3: /croose/public/storage/");
                            target.src = `https://api.joincroose.com/croose/public/storage/${registerData.data.profile_photo}`;
                          } else {
                            console.log("All attempts failed. Showing fallback.");
                            target.style.display = 'none';
                          }
                        }}
                      />
                    ) : (
                      <div className="text-xl font-semibold text-[#475467]">
                        {registerData?.data?.name?.[0] || 'U'}
                      </div>
                    )}
                    {/* Fallback Initial (shown if image is missing or fails) */}
                    {!previewImage && !registerData?.data?.profile_photo && (
                      <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-[#475467]">
                        {registerData?.data?.name?.[0] || 'U'}
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer px-5 py-2 rounded-full bg-[#F2F4F7] text-xs font-semibold text-[#475467] hover:bg-[#E5E7EB] active:scale-95 transition">
                    Upload photo
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        handleFileChange(e);
                        console.log("File selected for preview");
                      }}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#344054]">Full Name</label>
                    <input
                      type="text"
                      className="mt-1 w-full h-[44px] rounded-[12px] border px-4 text-sm text-[#101828] outline-none focus:ring-2 focus:ring-[#685BC7] transition"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#344054]">Business Name</label>
                    <input
                      type="text"
                      className="mt-1 w-full h-[44px] rounded-[12px] border px-4 text-sm text-[#101828] outline-none focus:ring-2 focus:ring-[#685BC7] transition"
                      value={profileForm.business_name}
                      onChange={(e) => setProfileForm({ ...profileForm, business_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#344054]">Business Location</label>
                    <input
                      type="text"
                      className="mt-1 w-full h-[44px] rounded-[12px] border px-4 text-sm text-[#101828] outline-none focus:ring-2 focus:ring-[#685BC7] transition"
                      value={profileForm.business_location}
                      onChange={(e) => setProfileForm({ ...profileForm, business_location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#344054]">Email</label>
                    <input
                      type="email"
                      disabled
                      className="mt-1 w-full h-[44px] rounded-[12px] border px-4 text-sm text-[#98A2B3] bg-gray-50 cursor-not-allowed outline-none focus:ring-0 transition"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-slideUp space-y-4 max-w-md">
                {[
                  ['Current Password', oldPass, setOldPass, showOld, setShowOld],
                  ['New Password', newPass, setNewPass, showNew, setShowNew],
                  ['Confirm Password', confirmPass, setConfirmPass, showConfirm, setShowConfirm]
                ].map(([label, value, setter, show, toggle]: any) => (
                  <div key={label}>
                    <label className="text-sm font-medium text-[#344054]">{label}</label>
                    <div className="relative mt-1">
                      <input
                        type={show ? 'text' : 'password'}
                        value={value}
                        onChange={(e) => setter(e.target.value)}
                        className="w-full h-[44px] rounded-[12px] border px-4 outline-none focus:ring-2 focus:ring-[#685BC7] transition"
                      />
                      <button
                        type="button"
                        onClick={() => toggle(!show)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:scale-110 transition"
                      >
                        <Icon icon={show ? 'tabler:eye-off-filled' : 'tabler:eye-filled'} width="20" />
                      </button>
                    </div>
                  </div>
                ))}

                {newPass && confirmPass && newPass !== confirmPass && (
                  <p className="text-sm text-red-500 animate-fadeIn">
                    Passwords do not match
                  </p>
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t bg-[#FCFCFD] flex justify-end shrink-0">
            {activeTab === 'profile' && (
              <button
                onClick={handleProfileUpdate}
                disabled={isLoading}
                className={`px-7 py-2 rounded-lg font-semibold transition-all ${isLoading
                  ? 'bg-[#E4E7EC] text-[#98A2B3] cursor-not-allowed'
                  : 'bg-[#685BC7] text-white hover:bg-[#5A4FCF] active:scale-95'
                  }`}
              >
                {isLoading ? 'Saving...' : 'Save changes'}
              </button>
            )}

            {activeTab === 'security' && (
              <button
                onClick={handlePasswordUpdate}
                disabled={!canUpdatePassword}
                className={`px-7 py-2 rounded-lg font-semibold transition-all ${canUpdatePassword
                  ? 'bg-[#685BC7] text-white hover:bg-[#5A4FCF] active:scale-95'
                  : 'bg-[#E4E7EC] text-[#98A2B3] cursor-not-allowed'
                  }`}
              >
                Update password
              </button>
            )}
          </div>
        </div>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
        />
      </div>
    </>
  )
}

export default Setting1
