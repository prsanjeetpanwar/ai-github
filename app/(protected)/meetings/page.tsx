import React from "react";
import { AlertCircle } from "lucide-react";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50 overflow-hidden">
   
      <AlertCircle
        className="text-gray-500 mb-4 animate-bounce"
        size={48}
      />

   
      <h1 className="text-2xl font-semibold text-gray-800 animate-fadeIn">
        Coming Soon
      </h1>

      
      <p className="text-gray-600 mt-2 animate-fadeIn delay-100">
        This feature is under development and will be available soon.
      </p>
    </div>
  );
};

export default Page;
