"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform, animate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

const googleColors = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];

export default function CircularCarousel({ images, autoPlayInterval = 3000 }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Use a ref to track the latest index to prevent stale closures in callbacks
  const indexRef = useRef(activeIndex);
  useEffect(() => { indexRef.current = activeIndex; }, [activeIndex]);

  // --- AUTO PLAY ---
  // Auto-play removed as per user request

  // --- NAVIGATION ---
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // --- SWIPE LOGIC ---
  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const threshold = 50; // Minimum distance to trigger slide
    
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    }
  };

  // --- HELPER: CIRCULAR OFFSET ---
  const getCircularOffset = (index: number, active: number, length: number) => {
    let offset = index - active;
    if (offset > length / 2) offset -= length;
    if (offset < -length / 2) offset += length;
    return offset;
  };

  // --- STYLES GENERATOR ---
  const getCardStyle = (offset: number) => {
    const isCenter = offset === 0;
    const isNear = Math.abs(offset) === 1;

    return {
      // POSITION: 
      // Mobile: 15% spacing allows side cards to "peek" more visibly for swipe cues
      // Desktop: 55% spacing for wide cinematic look
      x: offset === 0 ? "0%" : `${offset * (typeof window !== 'undefined' && window.innerWidth < 768 ? 15 : 55)}%`, 
      
      // SCALE: 
      // Mobile: Less drastic scale difference (0.9) to keep side images recognizable
      scale: isCenter ? 1 : isNear ? 0.9 : 0.7,
      
      opacity: isCenter ? 1 : isNear ? 0.6 : 0,
      zIndex: 50 - Math.abs(offset),
      
      // ROTATION:
      // Removed rotation on mobile for a cleaner "deck" feel, kept on desktop
      rotateY: typeof window !== 'undefined' && window.innerWidth < 768 ? 0 : offset * -10, 
      
      // FILTER:
      // Removed blur() for mobile performance (critical optimization)
      filter: isCenter ? "brightness(1)" : "brightness(0.6)",
    };
  };

  // --- SHADOW & BORDER DEFINITIONS ---
  const activeShadowStr = "0 20px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 255, 255, 0.2) inset";
  const inactiveShadowStr = "0 10px 15px -3px rgba(0, 0, 0, 0.2)";
  
  const activeBorderColor = "rgba(255, 255, 255, 0.5)";
  const inactiveBorderColor = "rgba(255, 255, 255, 0.05)";

  return (
    <div
      className="relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden group perspective-1000 touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- CAROUSEL TRACK --- */}
      {/* Added drag handler here to capture swipes anywhere on the track */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2} // Feel of resistance
        onDragStart={() => setIsDragging(true)}
        onDragEnd={onDragEnd}
      >
        {images.map((src, index) => {
          const offset = getCircularOffset(index, activeIndex, images.length);
          const style = getCardStyle(offset);
          const isCenter = offset === 0;

          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                x: style.x,
                scale: style.scale,
                opacity: style.opacity,
                zIndex: style.zIndex,
                rotateY: style.rotateY,
                filter: style.filter,
                borderColor: isCenter ? activeBorderColor : inactiveBorderColor,
                boxShadow: isCenter ? activeShadowStr : inactiveShadowStr,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 25,
                mass: 1,
              }}
              // UPDATED WIDTHS:
              // Mobile: w-[85vw] prevents edge clipping and shows peeking neighbors
              className="absolute w-[85vw] md:w-[50vw] aspect-video rounded-[1.5rem] md:rounded-[2.5rem] bg-gray-900 will-change-transform border-[1.5px]"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              // Allow clicking side cards to navigate to them
              onClick={() => {
                if(!isDragging) setActiveIndex(index);
              }}
            >
              <div className="relative w-full h-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                <img
                  src={src}
                  alt={`Slide ${index}`}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* --- CONTROLS --- */}
      {/* Always visible on both Mobile and Desktop */}
      <button
        onClick={handlePrev}
        className="flex absolute left-4 md:left-8 z-50 p-3 md:p-4 rounded-full bg-black/20 md:bg-white/10 backdrop-blur-md border border-white/20 text-white 
                   opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 shadow-lg"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button
        onClick={handleNext}
        className="flex absolute right-4 md:right-8 z-50 p-3 md:p-4 rounded-full bg-black/20 md:bg-white/10 backdrop-blur-md border border-white/20 text-white 
                   opacity-100 transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 shadow-lg"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* --- GOOGLE COLORED DOTS --- */}
      <div className="absolute bottom-4 md:bottom-8 z-50 flex gap-2 md:gap-3">
        {images.map((_, i) => {
          const isActive = i === activeIndex;
          const activeColor = googleColors[i % googleColors.length];

          return (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                backgroundColor: isActive ? activeColor : undefined,
                boxShadow: isActive ? `0 0 15px ${activeColor}` : "none",
              }}
              className={`h-2 md:h-2.5 rounded-full transition-all duration-500 ${
                isActive
                  ? "w-6 md:w-8"
                  : "w-2 md:w-2.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}