'use client'
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSpace } from '@/app/Apis/publicapi';

const Customisespace = () => {
    const [spaceName, setSpaceName] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [chatBotName, setChatBotName] = useState("");
    const [StartTime, setStartTime] = useState('');
    const [EndTime, setEndTime] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", spaceName);
        formData.append('chatbot_name', chatBotName);
        formData.append('start_time', StartTime);
        formData.append('end_time', EndTime);
        const categoryId = localStorage.getItem("categoryId");
        const categoryName = localStorage.getItem("categoryName");

        formData.append("category", categoryName || "default_name");
        formData.append("is_active", "1");
        if (image) {
            formData.append("image", image);
        }

        try {
            const res = await createSpace(formData);
            console.log("Space created:", res);
            router.push("/dashboard/createnewspace");
        } catch (err) {
            console.log("Space not created:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='select-none flex flex-col h-screen'>
            {/* Header */}
            <div className='flex justify-between items-center border-b border-[#EAECF0] px-5 py-3'>
                <img className='w-[130px]' src="/Vector.png" alt='crooselogo' />
                <p className='text-white text-sm'>Sign Up</p>
            </div>

            {/* Main Content */}
            <div className='flex-1 flex items-center justify-center px-5 py-6 overflow-auto'>
                <div className='w-full max-w-[520px]'>
                    <h1 className='text-2xl font-bold text-[#1D2939] text-center mb-6'>
                        Create a customised space
                    </h1>

                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        {/* Space Name */}
                        <div className='flex flex-col gap-1.5'>
                            <label className='font-medium text-sm'>Space name</label>
                            <input
                                className='w-full p-3 border-2 border-[#D0D5DD] rounded-lg'
                                type='text'
                                placeholder='Enter space name'
                                value={spaceName}
                                onChange={(e) => setSpaceName(e.target.value)}
                            />
                        </div>

                        {/* Assistant Name */}
                        <div className='flex flex-col gap-1.5'>
                            <label className='font-medium text-sm'>Assistant name</label>
                            <input
                                className='w-full p-3 border-2 border-[#D0D5DD] rounded-lg'
                                type='text'
                                placeholder='Enter Chatbot name'
                                value={chatBotName}
                                onChange={(e) => setChatBotName(e.target.value)}
                            />
                        </div>

                        {/* Time Fields - Side by Side */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="font-medium text-sm">Start time</label>
                                <input
                                    className='w-full p-3 border-2 border-[#D0D5DD] rounded-lg'
                                    type="time"
                                    value={StartTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="font-medium text-sm">End time</label>
                                <input
                                    className='w-full p-3 border-2 border-[#D0D5DD] rounded-lg'
                                    type="time"
                                    value={EndTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Upload Image */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-medium text-sm">Upload Image</label>
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-full h-28 transition bg-white border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-[#685BC7] hover:bg-purple-50"
                            >
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setImage(e.target.files[0]);
                                        }
                                    }}
                                />

                                {image ? (
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <span className="text-xs text-green-600 font-medium max-w-[200px] truncate">
                                            {image.name}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-500">
                                        <span className="font-medium text-[#685BC7]">Click to upload</span> or drag & drop
                                    </span>
                                )}
                            </label>
                        </div>

                        {/* Footer Buttons */}
                        <div className='flex justify-end gap-3 mt-2'>
                            <button
                                onClick={() => router.back()}
                                type="button"
                                className='px-5 cursor-pointer py-2 border-2 border-[#D0D5DD] rounded-lg font-semibold text-sm bg-white text-[#344054] hover:bg-gray-50'>
                                Previous
                            </button>
                            <button
                                type='submit'
                                disabled={loading}
                                className='px-6 cursor-pointer py-2 rounded-lg font-semibold text-sm bg-[#685BC7] text-white hover:bg-[#5749a8] disabled:opacity-50'
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Customisespace;