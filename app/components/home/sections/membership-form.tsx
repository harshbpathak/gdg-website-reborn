"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { User, Linkedin, Github, Loader2, CheckCircle, Sparkles } from "lucide-react";

interface MembershipFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  memberCount: number;
}

const GOOGLE_COLORS = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];

export function MembershipFormModal({
  open,
  onOpenChange,
  onSuccess,
  memberCount,
}: MembershipFormProps) {
  const [name, setName] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          linkedin: linkedin.trim() || undefined,
          github: github.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      // Mark as joined in localStorage
      localStorage.setItem("gdg-nith-member-joined", "true");
      localStorage.setItem("gdg-nith-member-name", name.trim());

      setIsSuccess(true);
      onSuccess();

      // Auto-close after 2.5s
      setTimeout(() => {
        onOpenChange(false);
        // Reset form state after close animation
        setTimeout(() => {
          setIsSuccess(false);
          setName("");
          setLinkedin("");
          setGithub("");
        }, 300);
      }, 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to join. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-white dark:bg-[#1a1a2e] shadow-2xl">
        {/* Google color bar at top */}
        <div className="flex h-1.5">
          {GOOGLE_COLORS.map((color, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-16 px-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-[#34A853]/10 flex items-center justify-center mb-6"
              >
                <CheckCircle className="w-10 h-10 text-[#34A853]" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Welcome to the Community!
              </h3>
              <p className="text-muted-foreground text-center">
                You&apos;re now part of the GDG NIT Hamirpur family 🎉
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 pb-6 pt-2"
            >
              <DialogHeader className="mb-6 text-left">
                <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FBBC05]" />
                  Join NIT Hamirpur Chapter
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground mt-1">
                  GDG Ludhiana — Become a part of our developer community
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="member-name" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-[#4285F4]" />
                    Full Name <span className="text-[#EA4335]">*</span>
                  </Label>
                  <Input
                    id="member-name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl border-border/50 bg-background focus:border-[#4285F4] focus:ring-[#4285F4]/20 transition-all"
                    required
                  />
                </div>

                {/* LinkedIn Field */}
                <div className="space-y-2">
                  <Label htmlFor="member-linkedin" className="text-sm font-medium flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    LinkedIn Profile
                  </Label>
                  <Input
                    id="member-linkedin"
                    placeholder="https://linkedin.com/in/your-profile"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="h-12 rounded-xl border-border/50 bg-background focus:border-[#4285F4] focus:ring-[#4285F4]/20 transition-all"
                  />
                </div>

                {/* GitHub Field */}
                <div className="space-y-2">
                  <Label htmlFor="member-github" className="text-sm font-medium flex items-center gap-2">
                    <Github className="w-4 h-4 text-foreground" />
                    GitHub Profile
                  </Label>
                  <Input
                    id="member-github"
                    placeholder="https://github.com/your-username"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="h-12 rounded-xl border-border/50 bg-background focus:border-[#4285F4] focus:ring-[#4285F4]/20 transition-all"
                  />
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-[#EA4335] font-medium"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl text-base font-semibold bg-[#4285F4] hover:bg-[#3367D6] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Joining...
                    </>
                  ) : (
                    "Join Community →"
                  )}
                </Button>

                {/* Member count hint */}
                {memberCount > 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    Join{" "}
                    <span className="font-semibold text-[#4285F4]">
                      {memberCount}+
                    </span>{" "}
                    developers in the community
                  </p>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
