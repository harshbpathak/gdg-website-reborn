"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
// Heavy animation library removed – using plain CSS transitions instead
import { toast } from "react-hot-toast";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import dynamic from "next/dynamic";
const BackgroundDecorativeCircles = dynamic(() => import("@/app/components/ui/backgroundss").then((mod) => mod.default), { ssr: false });

const TECHNICAL_DOMAINS = [
  "Web Development",
  "App Development (Android/iOS)",
  "Machine Learning / AI",
  "Cloud & DevOps",
  "UI/UX Design",
  "AR/VR",
  "Cybersecurity",
  "Other"
];

const NON_TECHNICAL_DOMAINS = [
  "Content Writing",
  "Event Management",
  "Graphic Design",
  "Video Editing",
  "Social Media Management",
  "Public Relations",
  "Other"
];

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export default function SophomoreInterviewApplyPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [hasApplied, setHasApplied] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roll_no: "",
    contact_no: "",
    technical_domains: [] as string[],
    other_technical_domain: "",
    non_technical_domains: [] as string[],
    other_non_technical_domain: "",
    skills: "",
    resume_url: "",
    prior_experience: "",
    why_join_gdg: "",
    expectations: "",
    available_year_round: true,
    attended_gdg_events: false,
    attended_events_list: "",
    part_of_other_clubs: false,
    other_clubs_details: "",
    confirmed_accurate: false,
  });

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sophomore_form_draft");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.formData) {
            setFormData(prev => ({
              ...prev,
              ...parsed.formData,
              technical_domains: Array.isArray(parsed.formData.technical_domains) ? parsed.formData.technical_domains : prev.technical_domains,
              non_technical_domains: Array.isArray(parsed.formData.non_technical_domains) ? parsed.formData.non_technical_domains : prev.non_technical_domains
            }));
          }
          if (parsed.step) setStep(parsed.step);
        } catch(e) {}
      }
    }
    setMounted(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("sophomore_form_draft", JSON.stringify({ formData, step }));
    }
  }, [formData, step, mounted]);

  const toggleTechDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      technical_domains: prev.technical_domains.includes(domain)
        ? prev.technical_domains.filter(d => d !== domain)
        : [...prev.technical_domains, domain]
    }));
  };

  const toggleNonTechDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      non_technical_domains: prev.non_technical_domains.includes(domain)
        ? prev.non_technical_domains.filter(d => d !== domain)
        : [...prev.non_technical_domains, domain]
    }));
  };

  const nextStep = () => {
    // Basic validation
    if (step === 1 && (!formData.name || !formData.roll_no || !formData.contact_no || !formData.email)) {
      toast.error("Please complete all personal details");
      return;
    }
    if (step === 2 && (formData.technical_domains.length === 0 && formData.non_technical_domains.length === 0)) {
      toast.error("Please select at least one domain");
      return;
    }
    if (step === 2 && formData.technical_domains.includes("Other") && !formData.other_technical_domain.trim()) {
      toast.error("Please specify your 'Other' technical domain");
      return;
    }
    if (step === 2 && formData.non_technical_domains.includes("Other") && !formData.other_non_technical_domain.trim()) {
      toast.error("Please specify your 'Other' non-technical domain");
      return;
    }
    if (step === 2 && !formData.resume_url) {
      toast.error("Please provide your Google Drive resume link");
      return;
    }
    if (step === 3 && !formData.why_join_gdg) {
      toast.error("Please tell us why you want to join");
      return;
    }
    
    setStep(s => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!formData.confirmed_accurate) {
      toast.error("Please confirm your information is accurate");
      return;
    }

    setSubmitting(true);
    try {
      // Process "Other" fields and prepare data for Supabase
      const finalTechDomains = formData.technical_domains.filter(d => d !== "Other");
      if (formData.technical_domains.includes("Other") && formData.other_technical_domain) {
        finalTechDomains.push(formData.other_technical_domain);
      }

      const finalNonTechDomains = formData.non_technical_domains.filter(d => d !== "Other");
      if (formData.non_technical_domains.includes("Other") && formData.other_non_technical_domain) {
        finalNonTechDomains.push(formData.other_non_technical_domain);
      }
      
      // Combine non-technical domains into a comma-separated string because the schema expects TEXT, not TEXT[]
      const nonTechDomainString = finalNonTechDomains.join(", ");

      const { error } = await supabase
        .from("sophomore_interviews")
        .insert([{
          name: formData.name,
          email: formData.email,
          roll_no: formData.roll_no,
          contact_no: formData.contact_no,
          technical_domains: finalTechDomains,
          non_technical_domain: nonTechDomainString,
          skills: formData.skills,
          resume_url: formData.resume_url,
          prior_experience: formData.prior_experience,
          why_join_gdg: formData.why_join_gdg,
          expectations: formData.expectations,
          available_year_round: formData.available_year_round,
          attended_gdg_events: formData.attended_gdg_events,
          attended_events_list: formData.attended_events_list,
          part_of_other_clubs: formData.part_of_other_clubs,
          other_clubs_details: formData.other_clubs_details,
          confirmed_accurate: formData.confirmed_accurate,
        }]);

      if (error) throw error;
      
      // Send to Google Sheets via Apps Script Web App
      try {
        const payload = {
          Name: formData.name,
          Email: formData.email,
          "Roll Number": formData.roll_no,
          "Contact Number": formData.contact_no,
          "Technical Domains": finalTechDomains.join(", "),
          "Non-Technical Domains": nonTechDomainString,
          Skills: formData.skills,
          "Resume URL": formData.resume_url,
          "Prior Experience": formData.prior_experience,
          "Why Join GDG": formData.why_join_gdg,
          Expectations: formData.expectations,
          "Available Year Round": formData.available_year_round ? "Yes" : "No",
          "Attended GDG Events": formData.attended_gdg_events ? "Yes" : "No",
          "Attended Events List": formData.attended_events_list,
          "Part of Other Clubs": formData.part_of_other_clubs ? "Yes" : "No",
          "Other Clubs Details": formData.other_clubs_details,
        };

        await fetch("https://script.google.com/macros/s/AKfycbzCVLla7R1jxLBm83RZGt-nKBnRDIA1G-nLJv2OoenQjkoM20XB4ct_6zXnKReYgPt8UA/exec", {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify(payload),
        });
      } catch (sheetError) {
        console.error("Failed to sync to Google Sheets:", sheetError);
        // We don't throw here so the user still sees success if Supabase worked
      }
      
      setHasApplied(true);
      if (typeof window !== "undefined") localStorage.removeItem("sophomore_form_draft");
      toast.success("Application submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  // Do not render anything until mounted to prevent hydration errors
  if (!mounted) {
    return <div className="min-h-screen bg-background"></div>;
  }

  if (hasApplied) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4 relative overflow-hidden">
        <BackgroundDecorativeCircles />
        <div className="bg-card p-8 md:p-10 rounded-3xl border shadow-xl max-w-lg w-full text-center relative z-10 mx-auto">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#34A853]/10 text-[#34A853] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Application Received!</h2>
          <p className="text-muted-foreground mb-8 text-sm md:text-base">
            Thank you for applying to GDG NIT Hamirpur. We've received your application. Please join our WhatsApp group for all further updates regarding the interview process.
          </p>
          <div className="flex flex-col gap-3">
            <Button className="w-full rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white dark:bg-[#25D366] dark:text-white dark:hover:bg-[#128C7E] h-12 text-sm md:text-base font-medium shadow-md shadow-[#25D366]/20" asChild>
              <a href="https://chat.whatsapp.com/JGGcMa9r5ov1poONByOVKy" target="_blank" rel="noopener noreferrer">
                Join WhatsApp Group
              </a>
            </Button>
            <Button className="w-full rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white dark:bg-[#4285F4] dark:text-white dark:hover:bg-[#3367D6] h-12 text-sm md:text-base" onClick={() => router.push('/')}>
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 md:py-24 px-4 relative">
      <BackgroundDecorativeCircles />
      
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Sophomore Application</h1>
          <p className="text-muted-foreground text-sm md:text-base">Join the next generation of GDG leaders and developers.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 relative px-2 md:px-0">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-border -z-10 transform -translate-y-1/2" />
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm border-4 border-background transition-colors ${
                step >= i ? 'bg-[#4285F4] text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              {i}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-3xl border shadow-lg p-5 md:p-10">
          <div>
            {step === 1 && (
              <div className="transition-opacity duration-300">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Personal Details</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div className="space-y-2">
                      <Label>Full Name <span className="text-red-500">*</span></Label>
                      <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email <span className="text-red-500">*</span></Label>
                      <Input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="e.g. john@nith.ac.in" />
                    </div>
                    <div className="space-y-2">
                      <Label>Roll Number <span className="text-red-500">*</span></Label>
                      <Input value={formData.roll_no} onChange={(e) => setFormData({...formData, roll_no: e.target.value})} placeholder="e.g. 23XXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Number <span className="text-red-500">*</span></Label>
                      <Input value={formData.contact_no} onChange={(e) => setFormData({...formData, contact_no: e.target.value})} placeholder="e.g. 9876543210" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="transition-opacity duration-300">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Domains & Skills</h2>
                <div className="space-y-8">
                  
                  {/* Technical Domains */}
                  <div className="space-y-3">
                    <Label className="text-sm md:text-base">Technical Domains (Select multiple)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                      {TECHNICAL_DOMAINS.map(domain => (
                        <div 
                          key={domain}
                          onClick={() => toggleTechDomain(domain)}
                          className={`p-2 md:p-3 rounded-xl border text-xs md:text-sm cursor-pointer transition-all text-center flex items-center justify-center ${
                            formData.technical_domains.includes(domain) 
                            ? 'bg-[#4285F4]/10 border-[#4285F4] text-[#4285F4] font-medium' 
                            : 'hover:bg-muted'
                          }`}
                        >
                          {domain}
                        </div>
                      ))}
                    </div>
                    {formData.technical_domains.includes("Other") && (
                      <div className="pt-2">
                        <Input 
                          placeholder="Please specify your technical domain..." 
                          value={formData.other_technical_domain}
                          onChange={(e) => setFormData({...formData, other_technical_domain: e.target.value})}
                        />
                      </div>
                    )}
                  </div>

                  {/* Non-Technical Domains */}
                  <div className="space-y-3">
                    <Label className="text-sm md:text-base">Non-Technical Domains (Select multiple)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                      {NON_TECHNICAL_DOMAINS.map(domain => (
                        <div 
                          key={domain}
                          onClick={() => toggleNonTechDomain(domain)}
                          className={`p-2 md:p-3 rounded-xl border text-xs md:text-sm cursor-pointer transition-all text-center flex items-center justify-center ${
                            formData.non_technical_domains.includes(domain) 
                            ? 'bg-[#EA4335]/10 border-[#EA4335] text-[#EA4335] font-medium' 
                            : 'hover:bg-muted'
                          }`}
                        >
                          {domain}
                        </div>
                      ))}
                    </div>
                    {formData.non_technical_domains.includes("Other") && (
                      <div className="pt-2">
                        <Input 
                          placeholder="Please specify your non-technical domain..." 
                          value={formData.other_non_technical_domain}
                          onChange={(e) => setFormData({...formData, other_non_technical_domain: e.target.value})}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm md:text-base">List your Top Skills / Tools</Label>
                    <Textarea 
                      placeholder="e.g. React, Node.js, Figma, Python, Video Editing..."
                      value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3 p-4 md:p-5 bg-[#34A853]/5 border border-[#34A853]/20 rounded-2xl">
                    <Label className="text-sm md:text-base font-semibold text-foreground">Google Drive Resume Link <span className="text-red-500">*</span></Label>
                    <p className="text-xs text-muted-foreground">Please ensure link access is set to "Anyone with the link".</p>
                    <Input 
                      placeholder="https://drive.google.com/file/d/..."
                      value={formData.resume_url} onChange={(e) => setFormData({...formData, resume_url: e.target.value})}
                      className="bg-background h-10 md:h-12"
                    />
                  </div>

                </div>
              </div>
            )}

            {step === 3 && (
              <div className="transition-opacity duration-300">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Experience & Motivation</h2>
                <div className="space-y-6">
                  
                  <div className="space-y-3">
                    <Label className="text-sm md:text-base">Prior Experience / Projects</Label>
                    <Textarea 
                      placeholder="Tell us about any projects you've built or prior experience you have..."
                      value={formData.prior_experience} onChange={(e) => setFormData({...formData, prior_experience: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm md:text-base">Why do you want to join GDG? <span className="text-red-500">*</span></Label>
                    <Textarea 
                      placeholder="Your motivation and what you hope to achieve with us..."
                      value={formData.why_join_gdg} onChange={(e) => setFormData({...formData, why_join_gdg: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-5 bg-muted/30 rounded-2xl border">
                    <div className="flex items-center justify-between col-span-1 md:col-span-2">
                      <Label className="text-sm md:text-base">Are you part of other clubs/societies?</Label>
                      <input type="checkbox" className="w-5 h-5 accent-[#4285F4]" checked={formData.part_of_other_clubs} onChange={(e) => setFormData({...formData, part_of_other_clubs: e.target.checked})} />
                    </div>
                    {formData.part_of_other_clubs && (
                      <div className="col-span-1 md:col-span-2 space-y-2 mt-2 md:mt-0">
                        <Label className="text-sm md:text-base">Club Details</Label>
                        <Input placeholder="Club names and your role/responsibilities..." value={formData.other_clubs_details} onChange={(e) => setFormData({...formData, other_clubs_details: e.target.value})} />
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-6">Review & Submit</h2>
                <div className="space-y-6">
                  
                  <div className="bg-muted/50 p-4 md:p-6 rounded-2xl border space-y-4 text-xs md:text-sm">
                    <h3 className="font-semibold text-sm md:text-base border-b pb-2">Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Name:</span> 
                        <span className="font-medium">{formData.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Email:</span> 
                        <span className="font-medium">{formData.email}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Domains:</span> 
                        <span className="font-medium">
                          {formData.technical_domains.join(', ')} 
                          {formData.non_technical_domains.length > 0 && ` | ${formData.non_technical_domains.join(', ')}`}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Resume:</span> 
                        <span className="truncate font-medium text-[#4285F4]">{formData.resume_url}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5 bg-[#EA4335]/5 border border-[#EA4335]/20 rounded-2xl cursor-pointer" onClick={() => setFormData({...formData, confirmed_accurate: !formData.confirmed_accurate})}>
                    <input type="checkbox" className="w-5 h-5 md:w-6 md:h-6 accent-[#EA4335] mt-1" checked={formData.confirmed_accurate} readOnly />
                    <Label className="cursor-pointer text-xs md:text-sm leading-relaxed">
                      I confirm that all the information provided above is accurate and I can commit to the responsibilities if selected.
                    </Label>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 md:mt-10 pt-5 md:pt-6 border-t">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep} className="gap-1 md:gap-2 rounded-xl h-10 md:h-12 px-4 md:px-6 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            ) : <div></div>}
            
            {step < 4 ? (
              <Button onClick={nextStep} className="gap-1 md:gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white dark:bg-[#4285F4] dark:text-white dark:hover:bg-[#3367D6] rounded-xl h-10 md:h-12 px-6 md:px-8 shadow-md text-sm">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!formData.confirmed_accurate || submitting} className="gap-1 md:gap-2 bg-[#34A853] hover:bg-[#2d9249] text-white dark:bg-[#34A853] dark:text-white dark:hover:bg-[#2d9249] rounded-xl h-10 md:h-12 px-6 md:px-8 shadow-lg shadow-[#34A853]/20 text-sm">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} 
                Submit
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
