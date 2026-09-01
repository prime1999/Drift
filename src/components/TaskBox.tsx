import {
  Inbox,
  ChevronDown,
  MessageSquare,
  CalendarDays,
  Plus,
} from "lucide-react";

const TaskBox = () => {
  return (
    <div className="w-[420px] h-[340px] bg-[#121212] text-zinc-300 rounded-xl p-4 flex flex-col justify-between shadow-2xl border border-zinc-800/50 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Left Title Dropdown */}
        <button className="flex items-center gap-2 hover:bg-zinc-800/60 p-1.5 rounded-lg transition-colors group">
          <Inbox className="w-3.5 h-3.5 text-zinc-200" />
          <span className="text-sm font-semibold text-zinc-100 tracking-tight">
            Task Inbox
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
        </button>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Feedback Pill */}
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-700/80 bg-zinc-900/40 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Empty State / Body */}
      <div className="flex-1 flex items-center justify-center">
        <Inbox className="w-16 h-16 text-zinc-800 stroke-[1.25]" />
      </div>

      {/* Footer / New Task Action */}
      <div className="pt-2">
        <form className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 px-2 py-1.5 rounded-lg w-full transition-colors text-sm font-medium">
          <div className="flex items-center gap-2 w-full">
            <Plus className="w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="New task"
              className="w-full bg-transparent border-none focus:outline-none text-sm font-medium"
            />
            <CalendarDays className="w-3.5 h-3.5" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskBox;
