export const Badge = ({
  children,
  variant,
}: {
  children: string;
  variant: "success" | "danger" | "warning" | "info";
}) => {
  const styles = {
    success: "bg-emerald-100 text-emerald-700",
    danger: "bg-rose-100 text-rose-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[variant]}`}
    >
      {children}
    </span>
  );
};
