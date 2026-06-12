import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DatePickerProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function DatePicker({
  label,
  value,
  placeholder = "PILIH TANGGAL",
  onChange,
}: DatePickerProps) {
  const dateObj = value ? new Date(value) : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <Label className="text-xs font-mono font-black tracking-widest text-zinc-900 dark:text-zinc-500 ">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-11 justify-start text-left font-mono text-xs font-bold bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400 shrink-0" />
            {dateObj ? (
              format(dateObj, "dd LLLL yyyy", { locale: id })
            ) : (
              <span className="text-zinc-400 dark:text-zinc-500 ">
                {placeholder}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 rounded-none border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
          align="start"
        >
          <Calendar
            mode="single"
            selected={dateObj}
            onSelect={(date) => {
              if (date) {
                const localDate = format(date, "yyyy-MM-dd");
                onChange(localDate);
              }
            }}
            className="rounded-none font-mono"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
