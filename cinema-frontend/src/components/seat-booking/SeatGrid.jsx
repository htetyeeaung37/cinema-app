"use client";
import React from "react";

const SeatGrid = ({ selectedSeats = [], toggleSeat, reservedSeats = [] }) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsCount = 12;
  const premiumRows = ["A", "B"];

  return (
    <div className="flex flex-col gap-3 items-center">
      {rows.map((row) => (
        <div key={row} className="flex items-center gap-4">
          <span className="w-6 text-center text-slate-700 font-black text-xs italic tracking-tighter">
            {row}
          </span>

          <div className="flex gap-2.5">
            {[...Array(seatsCount)].map((_, i) => {
              const seatId = `${row}${i + 1}`;
              const isSelected = selectedSeats.includes(seatId);
              const isReserved = reservedSeats.includes(seatId);
              const isPremium = premiumRows.includes(row);

              return (
                <button
                  key={seatId}
                  disabled={isReserved}
                  onClick={() => toggleSeat(seatId)}
                  className={`
                    w-9 h-9 rounded-xl text-[11px] font-black transition-all duration-300
                    flex items-center justify-center border-2
                    ${
                      isReserved
                        ? "bg-slate-800 border-transparent opacity-20 text-slate-100 cursor-not-allowed"
                        : isSelected
                          ? "bg-amber-400 border-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-110 z-10"
                          : isPremium
                            ? "bg-slate-900/50 border-amber-400/30 text-amber-400 hover:border-amber-400 hover:bg-amber-400/10"
                            : "bg-slate-900 border-slate-800 text-slate-500 hover:border-amber-400/50 hover:text-amber-400"
                    }
                  `}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <span className="w-6 text-center text-slate-700 font-black text-xs italic tracking-tighter">
            {row}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SeatGrid;
