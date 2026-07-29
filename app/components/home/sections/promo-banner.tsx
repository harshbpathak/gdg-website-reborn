"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, ClipboardCheck } from "lucide-react";
import { BorderBeam } from "@/app/components/ui/border-beam";
import { BackgroundDecorativeCircles } from "@/app/components/ui/backgroundss";

const SophomoreInterviewBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-[#0a0a0f] py-28 md:py-40">
      {/* Google-themed background */}
      <div className="absolute inset-0 pointer-events-none">
        <BackgroundDecorativeCircles />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4285F4]/10 dark:bg-[#4285F4]/20 text-[#4285F4] text-base font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Sophomore Interviews 2026
          </div>
          <h2 className="text-4xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
            Ready to Build With Us?
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Take the next step in your GDG journey. Show us your skills, passion, and drive for development.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className={cn(
                "relative overflow-hidden rounded-full px-10 py-7 text-lg font-semibold w-full sm:w-auto",
                "bg-[#4285F4] hover:bg-[#3367D6] text-white dark:bg-[#4285F4] dark:text-white",
                "shadow-lg hover:shadow-xl shadow-[#4285F4]/25",
                "transition-all duration-300 hover:scale-[1.02]"
              )}
              asChild
            >
              <Link href="/sophomore-interviews/apply">
                <ClipboardCheck className="w-5 h-5 mr-3" />
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
                <BorderBeam
                  size={80}
                  duration={6}
                  borderWidth={2}
                  colorFrom="#FBBC05"
                  colorTo="#EA4335"
                />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SophomoreInterviewBanner;
