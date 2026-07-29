"use client";

import React, { useRef, useState, useEffect } from "react";

import { CardCarousel } from "../../animation/card-carousel";
import { InView } from "../../animation/in-view";
import { Icon } from "../../icons";
import { Separator } from "../../ui/separator";
import { ButtonLink } from "../../utils/link";
import Link from "next/link";

interface EventData {
  id: string;
  year: string;
  title: string;
  description: string;
  date: string;
  image: string;
  details: string;
}

function EventsSection() {
  const containerRef = useRef(null);
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    fetch("/assets/event-data.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to load events:", err));
  }, []);

  const variants = {
    hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
    visible: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: {
        staggerChildren: 0.09,
      },
    },
  };
  return (
    <InView
      as="section"
      variants={variants}
      viewOptions={{ margin: '0px 0px -200px 0px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      id="members"
      className="
            
            mb-50
  max-w-7xl
  z-20
  mx-auto
  p-0 pt-10 md:p-16 md:pt-0
  flex flex-col items-start gap-5
  
  -mt-70 md:-mt-60
  relative
  translate-y-45
  rounded-[20px]
  md:rounded-[40px]
"
    >
      
      <div className="flex flex-col justify-center pb-2 pl-4 pt-2 md:items-center ">
        <div className="flex gap-2">
          <div>
            <h3 className="text-4xl opacity-85 font-bold tracking-tight ">
              Our Events
              {/* <div className="absolute -bottom-2 left-0 right-0 h-2 bg-[#057cfb] rounded-sm opacity-80"></div> */}
            </h3>

            <Separator className="my-2 bg-(--primary) h-0.5 rounded-full max-w-[200px]" />

            <p className="text-muted-foreground">
              Explore our amazing events and workshops that empower developers and foster innovation
            </p>
          </div>
        </div>
      </div>
      <CardCarousel
        images={events.map(event => ({ src: event.image, alt: event.title }))}
        showPagination={true}
        showNavigation={true}
        className="w-full"
      />
    </InView>
  );

}
export default EventsSection;