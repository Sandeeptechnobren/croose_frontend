"use client";
import React from "react";
import Messging5 from "../../components/messging5";
import Navbar from "../../components/Navbar";

const Page = () => {
  return (
    <div className="flex flex-col">
      <Navbar heading="Messaging" />
      <Messging5 />
    </div>
  );
};
export default Page;
