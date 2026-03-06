"use client";
import React from "react";

const SeatLegend = () => {
  const items = [
    {
      label: "Available",
      boxClass: "bg-slate-900 border-slate-700",
    },
    {
      label: "Selected",
      boxClass:
        "bg-amber-400 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]",
    },
    {
      label: "Reserved",
      boxClass: "bg-slate-800 border-transparent opacity-40",
    },
    {
      label: "Premium",
      boxClass: "bg-slate-900 border-amber-400/60",
      extra: "(+Ks5000)",
      extraClass: "text-amber-400 ml-1 font-black",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center gap-8 py-6 px-10 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2rem] shadow-xl">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-3 group">
          <div
            className={`w-6 h-6 rounded-lg border-2 transition-transform group-hover:scale-110 ${item.boxClass}`}
          />

          <span className="text-xs font-black  tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">
            {item.label}
            {item.extra && (
              <span className={item.extraClass}>{item.extra}</span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SeatLegend;
