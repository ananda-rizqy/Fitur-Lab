import type { ReactNode } from "react";
import { Card } from "../ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon?: ReactNode;
  color: string;
}

export const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card variant="brutal">
    <div>
      <p className="text-xs font-bold  text-slate-500 tracking-wider mb-1">
        {title}
      </p>
      <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
    </div>
    <div className={`p-3 bg-slate-50/50 ${color}`}>{icon}</div>
  </Card>
);
