import  Link  from "next/link";
import React from "react";

export const CampaignCard = () => {
  return (
    <Link href={`/campaign/100`}>

    <div className="w-full sm:w-[320px] bg-white shadow rounded-lg">
      <img
        src="https://plus.unsplash.com/premium_photo-1676923828336-0d9067844055?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Powered Kits"
        className="w-full h-[180px] object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="mt-2 font-title text-neutral-950 text-lg">
          Powered Kits Learning Boxes
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          Fun, durable and reusable boxes with eco-friendly options.
        </p>
        <div className="flex justify-between mt-4 text-sm text-neutral-950">
          <div>
            <p className="font-bold">$2,000</p>
            <p className="text-neutral-600">Raised of $1,900</p>
          </div>
          <div className="text-right">
            <p className="font-bold">173</p>
            <p className="text-neutral-600">Total backers</p>
          </div>
        </div>
        <div className="flex items-center mt-4">
          <img
            src="https://tools-api.webcrumbs.org/image-placeholder/40/40/avatars/2"
            alt="Avatar"
            className="w-[40px] h-[40px] rounded-full object-contain"
          />
          <p className="ml-2 text-sm text-neutral-950">
            by <span className="font-bold">Mahfuzul Nabil</span>
          </p>
        </div>
      </div>
    </div>
    </Link>

  );
};
