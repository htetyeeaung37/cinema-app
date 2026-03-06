"use client";
import React from "react";
import { Calendar } from "lucide-react";
import ShowtimeCard from "./ShowtimeCard";

const ShowtimeGrid = ({ showtimes }) => {
  return (
    <div className="mt-16 space-y-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-amber-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)]" />

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
            Select <span className="text-amber-400">Showtime</span>
          </h2>
        </div>

        {showtimes && showtimes.length > 0 && (
          <div className="hidden sm:block px-4 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {showtimes.length} Slots Available
          </div>
        )}
      </div>

      {showtimes && showtimes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {showtimes.map((st) => (
            <ShowtimeCard key={st.id} showtime={st} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 rounded-[2.5rem] border-2 border-dashed border-slate-800 bg-slate-900/30 backdrop-blur-sm">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full" />
            <Calendar
              className="relative mx-auto text-slate-700"
              size={64}
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-xl font-bold text-slate-300 mb-2">
            No Screenings Found
          </h3>
          <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed">
            There are currently no showtimes available for this movie. Please
            check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShowtimeGrid;
