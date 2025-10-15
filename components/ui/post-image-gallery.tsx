"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostImageGalleryProps {
  images: string[];
  alt?: string;
  className?: string;
  compact?: boolean; // New prop for compact mode
}

export function PostImageGallery({ images, alt = "Post image", className = "", compact = false }: PostImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setSelectedIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  // Single image display
  if (images.length === 1) {
    return (
      <div className={`relative ${className}`}>
        <div 
          className={`relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer ${
            compact ? 'aspect-square' : 'aspect-video'
          }`}
          onClick={openFullscreen}
        >
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
            }}
          />
        </div>
        
        {/* Fullscreen Modal */}
        {isFullscreen && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <Button
              onClick={closeFullscreen}
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
            <img
              src={images[0]}
              alt={alt}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    );
  }

  // Multiple images display with carousel
  return (
    <div className={`relative ${className} group`}>
      {/* Main Image Display */}
      <div className={`relative rounded-lg overflow-hidden bg-gray-100 ${
        compact ? 'aspect-square mb-2' : 'aspect-video mb-3'
      }`}>
        <img
          src={images[selectedIndex]}
          alt={`${alt} ${selectedIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer"
          onClick={openFullscreen}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
          }}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              onClick={prevImage}
              variant="ghost"
              size="sm"
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white ${
                compact ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={nextImage}
              variant="ghost"
              size="sm"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white ${
                compact ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
        
        {/* Image Counter */}
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Selection - Show on hover in compact mode */}
      <div className={`flex space-x-2 overflow-x-auto pb-2 ${
        compact 
          ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity' 
          : ''
      }`}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => selectImage(index)}
            className={`flex-shrink-0 ${compact ? 'w-12 h-12' : 'w-16 h-16'} rounded-md overflow-hidden border-2 transition-all ${
              index === selectedIndex 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : compact 
                  ? 'border-white/50 hover:border-white/80'
                  : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`${alt} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Img';
              }}
            />
          </button>
        ))}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <Button
            onClick={closeFullscreen}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
          >
            <X className="w-6 h-6" />
          </Button>
          
          {/* Fullscreen Navigation */}
          {images.length > 1 && (
            <>
              <Button
                onClick={prevImage}
                variant="ghost"
                size="lg"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                onClick={nextImage}
                variant="ghost"
                size="lg"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}
          
          <img
            src={images[selectedIndex]}
            alt={`${alt} ${selectedIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
          
          {/* Fullscreen Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded">
            {selectedIndex + 1} / {images.length}
          </div>
          
          {/* Fullscreen Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-center">
              <div className="flex space-x-2 overflow-x-auto max-w-md">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                      index === selectedIndex 
                        ? 'border-white ring-2 ring-white/50' 
                        : 'border-white/50 hover:border-white/80'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${alt} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}