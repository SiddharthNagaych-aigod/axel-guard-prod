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
    <div>
      {/* Main Image Area */}
      <div 
        className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm mb-6 relative h-[400px] flex items-center justify-center cursor-crosshair z-20 group"
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
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedImage(img)}
              className={`bg-white p-2 border rounded-lg cursor-pointer transition-all h-20 relative ${
                selectedImage === img 
                  ? "border-black ring-1 ring-black shadow-md" 
                  : "border-gray-100 hover:border-black"
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
