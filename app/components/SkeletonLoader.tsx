import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-sm mx-auto">
      <div className="animate-pulse flex flex-col space-y-4">
        <div className="rounded-lg bg-gray-200 h-48 w-full"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;

