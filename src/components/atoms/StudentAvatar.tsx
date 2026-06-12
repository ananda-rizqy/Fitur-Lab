interface StudentAvatarProps {
  nama: string;
}

export function StudentAvatar({ nama }: StudentAvatarProps) {
  const seed = encodeURIComponent(nama || "User");
  return (
    <div className="h-9 w-9  bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-200 dark:border-zinc-800 shrink-0 shadow-xs relative z-10 overflow-hidden">
      <img
        src={`https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=18181b&textColor=f4f4f5`}
        alt={`Avatar ${nama}`}
        className="w-full h-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}
