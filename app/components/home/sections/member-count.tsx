"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export function MemberCount() {
  const [count, setCount] = useState<number>(0);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCount() {
      const { count: memberCount, error } = await supabase
        .from("members")
        .select("*", { count: "exact", head: true });
        
      if (!error && memberCount !== null) {
        setCount(memberCount);
      }
    }
    fetchCount();
    
    // Optional: Subscribe to new members to update count live
    const subscription = supabase
      .channel('public:members')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'members' }, payload => {
        setCount(c => c + 1);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase]);

  if (count === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border shadow-sm text-sm font-medium mb-8"
    >
      <div className="flex -space-x-2 mr-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`w-6 h-6 rounded-full border-2 border-background bg-gradient-to-br from-[#4285F4] to-[#3367D6] flex items-center justify-center text-[10px] text-white z-${4-i}0`} style={{ zIndex: 10 - i }}>
            {/* placeholder for avatar stack */}
            <span className="opacity-0">.</span>
          </div>
        ))}
      </div>
      <span className="text-foreground">
        Join <span className="font-bold text-[#4285F4]">{count}+</span> Developers
      </span>
    </motion.div>
  );
}
