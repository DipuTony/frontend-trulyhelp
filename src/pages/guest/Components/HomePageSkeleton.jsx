import React from 'react';

const shimmer = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200';

const HomePageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    {/* Banner Skeleton */}
    <div className="w-full h-64 bg-gray-200 relative overflow-hidden">
      <div className={`${shimmer} absolute inset-0`}></div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Skeleton */}
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className={`h-24 rounded-xl ${shimmer}`}></div>
          ))}
          <div className={`h-48 rounded-xl ${shimmer}`}></div>
          <div className={`h-48 rounded-xl ${shimmer}`}></div>
        </div>
        {/* Right Side Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* Vision Section */}
          <div className={`h-24 rounded-xl ${shimmer}`}></div>
          {/* Donation Card Skeleton */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 space-y-6">
            <div className="flex justify-center">
              <div className={`h-10 w-40 rounded-full ${shimmer}`}></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-16 rounded-xl ${shimmer}`}></div>
              ))}
            </div>
            <div className={`h-12 rounded-lg ${shimmer}`}></div>
            <div className="text-center">
              <div className={`h-12 w-48 mx-auto rounded-full ${shimmer}`}></div>
              <div className={`h-4 w-32 mx-auto mt-2 rounded ${shimmer}`}></div>
            </div>
          </div>
          {/* Testimonial Skeleton */}
          <div className={`h-40 rounded-xl ${shimmer}`}></div>
        </div>
      </div>
    </div>
  </div>
);

export default HomePageSkeleton; 