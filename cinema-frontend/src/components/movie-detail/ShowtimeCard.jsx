"use client";
import { useRouter } from "next/navigation";
import { Ticket, MapPin, CalendarDays } from "lucide-react";

const ShowtimeCard = ({ showtime }) => {
  const router = useRouter();

  const handleShowtimeClick = () => {
    router.push(`/seats/${showtime.id}`);
  };

  return (
    <div
      onClick={handleShowtimeClick}
      className="group relative flex flex-col bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 hover:border-amber-400/40 hover:shadow-[0_20px_50px_rgba(251,191,36,0.08)]"
    >
      <div className="px-6 py-6 bg-slate-950/40 border-b border-slate-800/50">
        <h3 className="text-3xl font-black text-white italic tracking-tighter group-hover:text-amber-400 transition-colors">
          {showtime.time}
        </h3>
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-700">
            <MapPin size={12} className="text-amber-400" />
            {showtime.hall}
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <CalendarDays size={12} />
            <span className="text-[11px] font-bold uppercase tracking-tighter">
              {showtime.date}
            </span>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-amber-400 text-sm font-black">Ks</span>
          <span className="text-3xl font-black text-white tracking-tight">
            {Number(showtime.price).toLocaleString()}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShowtimeClick();
          }}
          className="mt-auto w-full py-3.5 bg-slate-800 hover:bg-amber-400 text-slate-300 hover:text-slate-950 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group/btn shadow-lg uppercase tracking-[0.15em] cursor-pointer"
        >
          <Ticket
            size={16}
            className="group-hover/btn:rotate-12 transition-transform"
          />
          Select Seats
        </button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};

export default ShowtimeCard;
