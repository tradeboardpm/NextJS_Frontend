import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  addMonths,
  isFuture,
  isToday,
  startOfMonth,
  isSameMonth,
  endOfMonth,
  parseISO,
  format,
} from "date-fns";
import {
  useMonthlyProfitLoss,
  ProfitLossType,
} from "@/hooks/useMonthlyProfitLoss";
import { WeeklyCharts } from "./Charts";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

export function TradingCalendar({ selectedDate, onSelect, tradesPerDay }) {
  const [month, setMonth] = React.useState(startOfMonth(selectedDate));
  const { profitLossData, isLoading } = useMonthlyProfitLoss(month);

  const today = new Date();

  const modifiers = {
    future: (date) => isFuture(date),
    today: (date) => isToday(date),
    profit: (date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      return Object.keys(profitLossData).some(
        (key) =>
          format(parseISO(key), "yyyy-MM-dd") === dateKey &&
          profitLossData[key] === "profit"
      );
    },
    loss: (date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      return Object.keys(profitLossData).some(
        (key) =>
          format(parseISO(key), "yyyy-MM-dd") === dateKey &&
          profitLossData[key] === "loss"
      );
    },
    breakeven: (date) => {
      const dateKey = format(date, "yyyy-MM-dd");
      return Object.keys(profitLossData).some(
        (key) =>
          format(parseISO(key), "yyyy-MM-dd") === dateKey &&
          profitLossData[key] === "breakeven"
      );
    },
  };

  const modifiersStyles = {
    future: { opacity: 0.5, pointerEvents: "none" },
    today: { border: "2px solid purple" },
    profit: {
      backgroundColor: "#C0F9E5",
      color: "#0ED991",
      dark: {
        backgroundColor: "rgba(192, 249, 229, 0.2)",
        color: "#0ED991",
      },
    },
    loss: {
      backgroundColor: "#FFD3D8",
      color: "#FF8190",
      dark: {
        backgroundColor: "rgba(255, 211, 216, 0.2)",
        color: "#FF8190",
      },
    },
    breakeven: {
      backgroundColor: "#FFF8B8",
      color: "#FAC300",
      dark: {
        backgroundColor: "rgba(255, 248, 184, 0.2)",
        color: "#FAC300",
      },
    },
  };

  const handleMonthChange = (newMonth) => {
    setMonth(startOfMonth(newMonth));
  };

  return (
    <div className="flex flex-col gap-4 ">
      <Card className="w-fit shadow-lg bg-[#FAF7FF] dark:bg-[#363637]">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelect}
            month={month}
            onMonthChange={handleMonthChange}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border-0 flex-1"
            classNames={{
              nav_button_previous: "hover:bg-muted",
              head_cell:
                "text-muted-foreground font-medium uppercase text-xs w-9 text-center",
              cell: cn(
                "h-9 w-9 text-center text-sm relative rounded-sm",
                "[&:has([aria-selected])]:border-2",
                "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                "focus-within:relative focus-within:z-20"
              ),
              day: cn(
                "h-8 w-8 p-0 rounded font-normal",
                "aria-selected:text-primary-foreground"
              ),
              day_selected:
                "bg-primary/15 text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground z-10",
            }}
          />
          {/* Legend */}
          <div className="py-2 px-2 border-t flex flex-wrap gap-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{
                  backgroundColor: "#C0F9E5",
                  color: "#0ED991",
                }}
              />
              <span className="text-[#0ED991] dark:text-[#0ED991]">Profit</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{
                  backgroundColor: "#FFD3D8",
                  color: "#FF8190",
                }}
              />
              <span className="text-[#FF8190] dark:text-[#FF8190]">Loss</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded"
                style={{
                  backgroundColor: "#FFF8B8",
                  color: "#FAC300",
                }}
              />
              <span className="text-[#FAC300] dark:text-[#FAC300]">
                Break Even
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-2 mt-4">Performance</h2>

        <WeeklyCharts selectedDate={selectedDate} tradesPerDay={tradesPerDay} />
      </div>
    </div>
  );
}
