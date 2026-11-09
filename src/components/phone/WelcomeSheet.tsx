"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { welcome } from "@/content/site";
import { Button } from "@/components/ui/atoms";

export function WelcomeSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-sheet-title"
        >
          <motion.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            className="relative z-10 rounded-t-[20px] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-pop)]"
            style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <div className="mx-auto mb-3 h-[4px] w-[36px] rounded-full bg-[color:var(--color-surface-3)]" />
            <h1 id="welcome-sheet-title" className="text-[22px] leading-7 font-[650] tracking-[-0.01em] text-[color:var(--color-ink)]">
              {welcome.heading}
            </h1>
            <div className="mt-3 flex flex-col gap-3 text-[14px] leading-6 text-[color:var(--color-ink)]">
              {welcome.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-[color:var(--color-ink-3)]">{welcome.hint}</p>
            <div className="mt-5 flex flex-col gap-2">
              <Button variant="primary" onClick={onClose}>
                {welcome.primary}
              </Button>
              <Button variant="secondary" onClick={() => router.push("/recruiter")}>
                {welcome.secondary}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
