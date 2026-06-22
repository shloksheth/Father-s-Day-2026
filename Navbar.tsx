'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const PhotoGallery = () => {
  const photos = Array.from({ length: 10 }).map((_, i) => ({ id: i, rotation: Math.random() * 8 - 4, color: i % 2 === 0 ? 'bg-blue-50' : 'bg-red-50' }));
  return (
    <section className="min-h-screen py-24 bg-white border-t border-gray-50 flex flex-col items-center">
      <div className="text-center mb-16"><h2 className="text-5xl font-playfair mb-4">For you, Dad.</h2><p className="text-gray-500 font-inter">A collection of moments and memories.</p></div>
      <div className="max-w-6xl w-full px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-12">
        {photos.map((photo) => (
          <motion.div key={photo.id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1, rotate: photo.rotation }} whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }} className="group relative">
            <div className="bg-[#FAFAF8] p-4 pb-12 rounded-sm shadow-md border-[0.5px] border-gray-200">
              <div className={cn("aspect-[4/5] w-full flex items-center justify-center rounded-sm overflow-hidden bg-gray-50")}>
                <img 
                  src={`/images/gallery/photo${photo.id + 1}.jpg`} 
                  alt="Memory" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  onError={(e) => {
                    // Fallback to placeholder if image not found
                    (e.target as HTMLImageElement).src = `https://picsum.photos/id/${photo.id + 20}/400/500`;
                  }}
                />
              </div>
              <div className="mt-4 h-4 w-2/3 bg-gray-100 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
