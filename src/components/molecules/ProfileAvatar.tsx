import React from "react";

interface ProfileAvatarProps {
  src?: string;
  name: string;
}

export function ProfileAvatar({ src, name }: ProfileAvatarProps) {
  const seed = encodeURIComponent(name || "User");
  const fallbackSrc = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=18181b&textColor=f4f4f5`;

  return (
    <div className="flex flex-col gap-3 items-center shrink-0">
      <div className="relative group">
        <div className="absolute inset-0 bg-zinc-900/5 dark:bg-white/5 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
        <img
          src={src || fallbackSrc}
          alt="Profile Avatar"
          className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-800 shadow-xs group-hover:scale-[1.02] transition-transform duration-300 bg-zinc-50 dark:bg-zinc-900"
        />
      </div>
    </div>
  );
}
