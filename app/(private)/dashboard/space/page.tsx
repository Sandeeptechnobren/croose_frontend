'use client'
import React from "react";
import Myspace from "../../components/myspace";
import { Suspense } from 'react';

// Create a wrapper component to handle the Suspense boundary
const MyspaceWrapper = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#685BC7] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading space...</p>
      </div>
    </div>}>
      <Myspace />
    </Suspense>
  );
};

const Page = () => {
  return <MyspaceWrapper />;
};

export default Page;
