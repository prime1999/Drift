"use client";

import { useState } from "react";
import {
  Inbox,
  ChevronDown,
  MessageSquare,
  CalendarDays,
  Plus,
} from "lucide-react";
import { addDays, format } from "date-fns";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TaskBox = () => {
  const [date, setDate] = useState<any>("");
  const [startTime, setStartTime] = useState<any>("");
  const [endTime, setEndTime] = useState<any>("");

  const [taskPrompt, setTaskPrompt] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-[420px] min-h-[340px] bg-[#121212] text-zinc-300 rounded-xl p-4 flex flex-col justify-between shadow-2xl border border-zinc-800/50 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 hover:bg-zinc-800/60 p-1.5 rounded-lg transition-colors group">
          <Inbox className="w-3.5 h-3.5 text-zinc-200" />

          <span className="text-sm font-semibold text-zinc-100 tracking-tight">
            Task Inbox
          </span>

          <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
        </button>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-700/80 bg-zinc-900/40 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center">
        <Inbox className="w-16 h-16 text-zinc-800 stroke-[1.25]" />
      </div>

      {/* Footer */}
      <div className="pt-2">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 px-2 py-1.5 rounded-lg w-full transition-colors text-sm font-medium"
        >
          <div className="flex items-center gap-2 w-full">
            <Plus className="w-3.5 h-3.5 shrink-0" />

            <input
              type="text"
              placeholder="New task"
              value={taskPrompt}
              onChange={(e) => setTaskPrompt(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-sm font-medium"
            />

            <Popover>
              <PopoverTrigger>
                <button
                  type="button"
                  aria-label="Select due date"
                  className="flex items-center gap-1 text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <CalendarDays className="w-3.5 h-3.5" />

                  {date && startTime && endTime && (
                    <span className="text-xs whitespace-nowrap">
                      {startTime}–{endTime}
                    </span>
                  )}
                </button>
              </PopoverTrigger>

              <PopoverContent align="start" className="w-72 p-4">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">
                      Date
                    </label>

                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">
                      Start Time
                    </label>

                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-400">
                      End Time
                    </label>

                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500"
                    />
                  </div>

                  <button className="w-full bg-zinc-900 text-white/70 text-xs text-center cursor-pointer rounded-md py-1">
                    Save Schedule
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskBox;
