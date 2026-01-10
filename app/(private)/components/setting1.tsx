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
import { logoutapi, updatePassword } from '@/app/Apis/publicapi'

const Setting1 = () => {
  const router = useRouter()
  const { setOpenSetting1 } = useContext<any>(SettingContext)

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [registerData, setRegisterData] = useState<any>(null)

  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('userdata')
    if (storedUser) setRegisterData(JSON.parse(storedUser))
  }, [])

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
    localStorage.removeItem('token')
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

      <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/40 px-4 animate-fadeIn rounded-t-[16px]">
        <div className="w-full max-w-[800px] min-h-[700px] bg-white rounded-t-[16px] border shadow-xl flex flex-col">

          <div className="flex items-center justify-between px-6  py-4 border-b rounded-[16px] bg-[#13102E]">
            <h2 className="text-[20px] font-semibold text-white">Settings</h2>
            <button
              onClick={() => setOpenSetting1(false)}
              className="w-9 h-9 rounded-full border bg-[#F6F8FA] flex items-center justify-center hover:bg-[#EEF1F4] active:scale-95 transition"
            >
              <Icon icon="iconamoon:close-bold" width="20" />
            </button>
          </div>

          <div className="flex gap-6 px-6 pt-4 border-b">
            {['profile', 'security'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
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

          <div className="flex-1 px-6 py-6 space-y-6">

            {activeTab === 'profile' && (
              <div className="animate-slideUp space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-[80px] h-[80px] rounded-full bg-[#F2F4F7] flex items-center justify-center text-xl font-semibold text-[#475467]">
                    {registerData?.data?.name?.[0] || 'U'}
                  </div>
                  <button className="px-5 py-2 rounded-full bg-[#F2F4F7] text-xs font-semibold text-[#475467] hover:bg-[#E5E7EB] active:scale-95 transition">
                    Upload photo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['Full Name', registerData?.data?.name],
                    ['Business Name', registerData?.data?.business_name],
                    ['Business Location', registerData?.data?.business_location],
                    ['Email', registerData?.data?.email]
                  ].map(([label, value]) => (
                    <div key={label}>
                      <label className="text-sm font-medium text-[#344054]">{label}</label>
                      <div className="mt-1 h-[44px] rounded-[12px] border px-4 flex items-center text-sm text-[#667085] bg-[#F9FAFB]">
                        {value || '-'}
                      </div>
                    </div>
                  ))}
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

          <div className="px-6 py-4 border-t bg-[#FCFCFD] flex justify-end">
            {activeTab === 'security' && (
              <button
                onClick={handlePasswordUpdate}
                disabled={!canUpdatePassword}
                className={`px-7 py-2 rounded-lg font-semibold transition-all ${
                  canUpdatePassword
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
