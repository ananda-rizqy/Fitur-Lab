interface SectionHeaderProps {
    title: string;
    badgeText?: string;
    description: string;
    rightElement?: React.ReactNode;
}

export const SectionHeader = ({ title, badgeText, description, rightElement }: SectionHeaderProps) => (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200">
                    {badgeText}
                </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{title}</h1>
            <p className="text-slate-500 text-sm font-medium">{description}</p>
        </div>
        {rightElement}
    </header>
);