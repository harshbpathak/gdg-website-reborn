"use client";
import { cn, smoothScrollTo } from "@/lib/utils";
import { ArrowRight, Users } from "lucide-react";
import { BorderBeam } from "@/app/components/ui/border-beam";
import Image from "next/image";
import { OrbitingGraphic } from "@/app/components/ui/floating-orbitals";
import { BackgroundDecorativeCircles } from "@/app/components/ui/backgroundss";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BaseHeroSectionProps {
    title?: string | React.ReactNode;
    description?: string;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    animationContent?: React.ReactNode;
}

const googleColors = ["#4285F4", "#EA4335", "#FBBC05", "#4285F4", "#34A853", "#EA4335"];

function AnimatedTitle() {
    const text = "Google Developer Groups - NITH Chapter";
    const words = text.split(" ");
    let charIndex = 0;

    return (
        <span className="inline-flex flex-wrap">
            {words.map((word, wordIdx) => (
                <span key={wordIdx} className="inline-flex mr-4">
                    {word.split("").map((char, idx) => {
                        const currentCharIndex = charIndex++;
                        const color = googleColors[currentCharIndex % googleColors.length];
                        return (
                            <span
                                key={idx}
                                className="inline-block opacity-0 animate-reveal-letter text-black dark:text-white"
                                style={{
                                    animationDelay: `${currentCharIndex * 0.08}s`,
                                    ["--google-color" as string]: color,
                                    animationFillMode: "forwards",
                                }}
                            >
                                {char}
                            </span>
                        );
                    })}
                </span>
            ))}
        </span>
    );
}

function BaseHeroSection(props: BaseHeroSectionProps) {
    const [memberCount, setMemberCount] = useState(0);

    useEffect(() => {
        import("@/lib/supabase/client").then(({ createClient }) => {
            const supabase = createClient();
            supabase
                .from("members")
                .select("*", { count: "exact", head: true })
                .then(({ count, error }) => {
                    if (!error && count !== null) setMemberCount(count);
                });
        });
    }, []);

    return <section
        id="hero"
        className={cn("w-full relative min-h-screen py-16 pt-24 bg-white dark:bg-[#0a0a0f] overflow-hidden")}
        style={props.style}
    >

        {/* Background Decorative Circles */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Floating Orbitals */}
            <div className="absolute top-16 left-1/4">
                <OrbitingGraphic />
            </div>
            <BackgroundDecorativeCircles />

        </div>

        <div className="w-full min-h-[80dvh] max-w-[1600px] mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 gap-12 relative z-10 pt-20 md:pt-0">
            {/* Left Section - Text Content */}
            <div className="flex flex-col items-center lg:items-start justify-center flex-1 text-center lg:text-left p-4 md:p-8 relative pt-10 h-full order-2 lg:order-1">
                <h1 className={cn("mb-6 md:mb-8 text-4xl md:text-6xl lg:text-7xl xl:text-7xl font-bold leading-tight md:leading-none", props.titleClassName)}>
                    <AnimatedTitle />
                </h1>
                <p className={cn("text-lg md:text-2xl lg:text-4xl text-foreground max-w-2xl leading-relaxed md:leading-[1.8]", props.descriptionClassName)}>
                    {props.description}
                </p>
                {/* <p className={cn("text-xl md:text-2xl lg:text-4xl text-foreground max-w-2xl leading-relaxed", props.descriptionClassName)}>
                    <Cover>
                        Empowering Developers, Elevating Innovation at GDG NITH Chapter.
                    </Cover>
                </p> */}
                <div
                    className="mt-8 md:mt-12 flex flex-col md:flex-row flex-wrap gap-y-6 gap-x-8 items-center justify-center lg:justify-start"
                    data-aos="fade-up"
                    data-aos-anchor-placement="center-bottom"
                >
                    <button 
                        className="relative px-8 py-4 text-base font-semibold rounded-full bg-[#4285F4] dark:bg-white text-white dark:text-black hover:bg-gradient-to-r hover:from-[#EA4335] hover:via-[#FBBC05] hover:to-[#34A853] hover:text-white transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(234,67,53,0.5)] flex items-center gap-3 group overflow-hidden" 
                        onClick={() => window.location.href = "#events"}
                    >
                        Check out events !!
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                        <BorderBeam
                            size={120}
                            duration={4}
                            borderWidth={3}
                            colorFrom="#EA4335"
                            colorTo="#FBBC05"
                            delay={0}
                        />
                    </button>

                    {/* Live Member Count Badge */}
                    {memberCount > 0 && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                            onClick={() => smoothScrollTo('sophomore-registration', 800)}
                            className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#34A853]/10 dark:bg-[#34A853]/20 text-[#34A853] hover:bg-[#34A853]/20 dark:hover:bg-[#34A853]/30 transition-all duration-300 cursor-pointer border border-[#34A853]/20 hover:border-[#34A853]/40 group"
                        >
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                                {memberCount}+ Community Members
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </motion.button>
                    )}

                    {props.children}
                </div>
            </div>

            {/* Right Section - SVG */}
            <div
                className="flex-shrink-0 flex items-center justify-center w-full max-w-xs md:max-w-xl lg:max-w-lg relative z-10 order-1 lg:order-2 mb-8 lg:mb-0"
                data-aos="fade-left"
                data-aos-duration="1000"
            >
                <Image
                    src="/assets/hero-img.svg"
                    alt="GDG NITH"
                    className="w-full h-auto animate-hero-entrance"
                    width={600}
                    height={600}
                    priority={true}
                />
            </div>
        </div>

        <style>
            {`
            @keyframes reveal-letter {
                0% {
                    opacity: 0;
                    transform: translateY(20px) scale(0.8);
                    color: var(--google-color);
                }
                40% {
                    opacity: 1;
                    transform: translateY(0) scale(1.1);
                    color: var(--google-color);
                }
                70% {
                    transform: scale(1);
                    color: var(--google-color);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            .animate-reveal-letter {
                animation: reveal-letter 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            @keyframes hero-entrance {
                0% {
                    opacity: 0;
                    transform: translateY(30px) scale(0.9);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            @keyframes hero-float {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                }
                25% {
                    transform: translateY(-6px) rotate(1deg);
                }
                50% {
                    transform: translateY(-10px) rotate(0deg);
                }
                75% {
                    transform: translateY(-6px) rotate(-1deg);
                }
            }
            .animate-hero-entrance {
                opacity: 0;
                animation: 
                    hero-entrance 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards,
                    hero-float 10s ease-in-out 1.5s infinite;
            }
        `}
        </style>
    </section>
}

BaseHeroSection.displayName = "BaseHeroSection";
export { BaseHeroSection };

