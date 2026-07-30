"use client";
import React from "react";

export function BackgroundDecorativeCircles() {
    return (
        <>
            <div className="absolute top-0 -left-16 w-[150px] h-[150px] md:-top-32 md:-left-32 md:w-[400px] md:h-[400px] rounded-full bg-[#EA4335]/25 dark:bg-[#EA4335]/[0.08]" />
            <div className="absolute top-[45%] -left-10 w-[120px] h-[120px] md:top-auto md:bottom-20 md:-left-20 md:w-[300px] md:h-[300px] rounded-full bg-[#FBBC05]/50 dark:bg-[#FBBC05]/[0.1]" />
            <div className="hidden md:block absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] md:-translate-y-0 md:top-1/3 md:left-1/2 md:-translate-x-1/2 md:w-[350px] md:h-[350px] rounded-full bg-[#4285F4]/22 dark:bg-[#4285F4]/[0.08]" />
            <div className="absolute bottom-5 -right-5 w-[140px] h-[140px] md:bottom-auto md:top-3/4 md:right-[-32px] md:w-[280px] md:h-[280px] rounded-full bg-[#34A853]/55 dark:bg-[#34A853]/[0.08]" />
            <div className="hidden md:block absolute top-20 right-[30%] w-[180px] h-[180px] rounded-full bg-[#4285F4]/65 dark:bg-[#4285F4]/[0.06]" />
            <div className="hidden md:block absolute top-36 right-[5%] w-[150px] h-[150px] rounded-full bg-[#FBBC05]/50 dark:bg-[#FBBC05]/[0.08]" />
        </>
    );
}

export default BackgroundDecorativeCircles;