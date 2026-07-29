"use client"

import Image from "next/image"
import { PixelCanvas } from "@/app/components/ui/pixel-canvas"

export function SocietyLeadSection() {
  return (
    <section className="py-24 -mt-20 md:-mt-20 mb-0 md:mb-0 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex justify-center">
          
          {/* Pixel Canvas Card */}
          <div className="group relative w-full max-w-8xl overflow-hidden rounded-[32px] border border-border bg-background transition-colors hover:border-[#0ea5e9]">
            {/* Pixel Canvas */}
            

            {/* Content */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 p-10 md:p-14">
              <PixelCanvas
              gap={12}
              speed={22}
              colors={["#e5e7eb", "#cbd5e1", "#94a3b8"]}
              style={{position: "absolute", inset: 0, pointerEvents: "none", width: "100%", height: "100%"}}
              
            />
              {/* Image */}
              <div className="flex justify-center md:justify-start">
                <div className="relative w-52 h-64 rounded-2xl overflow-hidden border border-border shadow-lg shadow-black/40">

                  <Image
                    src="/assets/soham.jpeg"
                    alt="Society Lead"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center space-y-5 text-center md:text-left">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Soham Juneja
                  </h2>
                  <p className="mt-1 text-sm md:text-base text-muted-foreground">
                    Campus Lead · GDG NITH-CHAPTER
                  </p>
                </div>

                <blockquote className="relative text-base md:text-lg leading-relaxed text-muted-foreground italic">
                  <span className="absolute -left-4 top-0 text-4xl text-muted-foreground/30">
                    “
                  </span>
                  Leadership is not about authority, it is about responsibility.
                  Build people first, technology will follow.
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
