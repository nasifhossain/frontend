import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-square bg-gray-300 rounded"></div>
                <div className="aspect-square bg-gray-300 rounded"></div>
                <div className="aspect-square bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}