interface LoanStatusTabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  listData: any[];
}

export function LoanStatusTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  listData,
}: LoanStatusTabsProps<T>) {
  return (
    <div className="flex border-2 border-zinc-950 dark:border-zinc-800  p-1.5 bg-white dark:bg-zinc-900 overflow-x-auto gap-1 scrollbar-none select-none shadow-xs">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const count =
          tab === "ALL"
            ? listData.length
            : listData.filter((i) => i.status?.toUpperCase() === tab).length;

        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 min-w-[95px] py-2.5 px-3 font-mono font-black text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              isActive
                ? "bg-zinc-950 text-white border-2 border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white"
                : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 bg-transparent border-2 border-transparent"
            }`}
          >
            <span>{tab}</span>
            <span
              className={`text-xs px-1.5 py-0.5  font-sans ${
                isActive
                  ? "bg-white/20 text-white dark:bg-zinc-950 dark:text-white"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
