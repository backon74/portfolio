"use client";

import Image from "next/image";
import { WidgetFrame } from "./WidgetFrame";
import { profile } from "@/content/site";
import { useOs } from "@/os/store";

export const PROFILE_WIDGET_SIZE = { w: 340, h: 180 } as const;

export function ProfileWidget() {
  const open = useOs((s) => s.open);
  return (
    <WidgetFrame
      as="button"
      width={PROFILE_WIDGET_SIZE.w}
      height={PROFILE_WIDGET_SIZE.h}
      label="Open Hamza app"
      onClick={() => open("hamza")}
      code="PRF-074"
    >
      <div className="flex h-full items-center gap-[16px] p-[16px]">
        <div className="relative size-[96px] shrink-0 overflow-hidden rounded-[20px] bg-[var(--color-surface-3)]">
          {!profile.photo.placeholder ? (
            <Image src={profile.photo.src} alt={profile.photo.alt} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[28px] text-[color:var(--color-ink-3)]">
              {profile.firstName.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[16px] font-semibold text-[color:var(--color-ink)]">{profile.name}</div>
          <div className="mt-[2px] text-[13px] text-[color:var(--color-ink-2)]">{profile.role}</div>
          <div className="mt-[6px] text-[12px] leading-[1.4] text-[color:var(--color-ink-3)]">
            Muharraq, Bahrain 🇧🇭 · Moroccan roots 🇲🇦
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
}
