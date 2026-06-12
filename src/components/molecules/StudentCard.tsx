import { StudentAvatar } from "../atoms/StudentAvatar";

interface StudentCardProps {
  nama: string;
  nim: string;
}

export function StudentCard({ nama, nim }: StudentCardProps) {
  return (
    <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800  shadow-xs transition-all duration-300 hover:border-zinc-900 dark:hover:border-zinc-400 hover:shadow-md relative overflow-hidden group">
      <div className="absolute inset-0 bg-linear-to-r from-zinc-50/0 to-zinc-50/0 group-hover:from-zinc-50/50 dark:group-hover:from-zinc-900/20 transition-all duration-300 pointer-events-none" />

      <StudentAvatar nama={nama} />

      <div className="overflow-hidden text-left relative z-10">
        <p className="text-xs font-black text-zinc-900 dark:text-zinc-200  tracking-tight truncate group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
          {nama}
        </p>
        <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 font-bold mt-0.5 tracking-wide">
          {nim}
        </p>
      </div>
    </div>
  );
}
