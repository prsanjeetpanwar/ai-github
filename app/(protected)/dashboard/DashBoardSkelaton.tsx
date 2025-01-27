import React from "react";

const DashboardPageSkeleton = () => {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between flex-wrap gap-y-4">
        <div className="w-fit rounded-md bg-gray-200 px-4 py-2 animate-pulse">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
            <div className="ml-2">
              <p className="h-4 w-48 bg-gray-300 rounded animate-pulse"></p>
            </div>
          </div>
        </div>

        <div className="h-4"></div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="h-40 col-span-3 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="h-40 col-span-2 bg-gray-200 rounded-md animate-pulse"></div>
      </div>

      <div className="mt-5">
        <div className="space-y-4">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className="h-20 bg-gray-200 rounded-md animate-pulse"
              ></div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPageSkeleton;
