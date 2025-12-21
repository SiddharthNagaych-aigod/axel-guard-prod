"use client";

import { useState, useRef, MouseEvent } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;

    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  return (
    <div className="w-full min-w-0">
      {/* Main Image Area */}
      <div 
        className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-8 shadow-sm mb-6 relative h-[300px] sm:h-[400px] flex items-center justify-center cursor-crosshair z-20 group"
        ref={imgRef}
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <div className="relative w-full h-full">
          <Image 
            src={selectedImage}
            alt={productName}
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>

        {/* Zoom Portal/Overlay */}
        {showZoom && (
          <div 
            className="absolute left-[103%] top-0 w-[600px] h-[500px] bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden z-50 hidden xl:block"
            style={{
              backgroundImage: `url(${selectedImage})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: "200%", // 2x Zoom level
              backgroundRepeat: "no-repeat"
            }}
          />
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex w-full overflow-x-auto pb-2 gap-2 mt-4 snap-x md:grid md:grid-cols-5 md:overflow-visible md:pb-0 no-scrollbar touch-pan-x">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedImage(img)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 w-20 md:w-auto snap-start cursor-pointer ${
                selectedImage === img 
                  ? "border-black dark:border-white ring-1 ring-black dark:ring-white shadow-md" 
                  : "border-gray-100 dark:border-slate-700 hover:border-black dark:hover:border-white"
              }`}
            >
               <Image 
                 src={img}
                 alt={`${productName} view ${idx + 1}`}
                 fill
                 className="object-contain"
                 unoptimized
               />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
