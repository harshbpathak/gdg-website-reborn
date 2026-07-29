"use client";
import React from "react";

export function BackgroundDecorativeCircles() {
    return (
        <>
            <div className="absolute -top-32 -left-32 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-[#EA4335]/25 dark:bg-[#EA4335]/[0.08]" />
            <div className="absolute bottom-20 -left-20 w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full bg-[#FBBC05]/50 dark:bg-[#FBBC05]/[0.1]" />
            <div className="hidden md:block absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-[#4285F4]/22 dark:bg-[#4285F4]/[0.08]" />
            <div className="absolute top-3/4 right-[-32px] w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full bg-[#34A853]/55 dark:bg-[#34A853]/[0.08]" />
            <div className="hidden md:block absolute top-20 right-[30%] w-[180px] h-[180px] rounded-full bg-[#4285F4]/65 dark:bg-[#4285F4]/[0.06]" />
            <div className="hidden md:block absolute top-36 right-[5%] w-[150px] h-[150px] rounded-full bg-[#FBBC05]/50 dark:bg-[#FBBC05]/[0.08]" />
        </>
    );
}

export default BackgroundDecorativeCircles;