"use client";
import React from "react";
import { Star, Clock, Info, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const MovieHero = ({ movie }) => {
  const router = useRouter();
  const BACKEND_URL = "https://cinema-app-iota.vercel.app/static/movies";

  const ratingMap = { G: 8.5, PG: 7.5, "PG-13": 8.2, R: 8.8 };
  const displayScore = ratingMap[movie.rating] || 7.0;

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900/50 border border-slate-800 p-8 md:p-12 mb-12 shadow-2xl backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-[100px] rounded-full pointer-events-none" />

      <button
        onClick={() => router.push("/")}
        className="relative flex items-center gap-2 text-slate-500 hover:text-amber-400 font-bold text-xs uppercase tracking-widest transition-colors mb-8 group cursor-pointer"
      >
        <ChevronLeft size={16} className="" />
        Back to Movie List
      </button>

      <div className="relative flex flex-col md:flex-row gap-12 items-center md:items-start">
        <div className="relative group flex-shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-b from-amber-400/20 to-transparent blur-lg opacity-30 group-hover:opacity-50 transition duration-500 rounded-3xl" />

          <img
            src={`${BACKEND_URL}/${movie.posterUrl}`}
            alt={movie.title}
            className="relative w-[220px] h-[330px] rounded-2xl object-cover shadow-2xl border border-slate-700/50 transition-transform duration-700 group-hover:scale-[1.03]"
          />

          <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-950/90 backdrop-blur-md border border-slate-700 rounded-xl flex items-center gap-2 shadow-2xl">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span className="text-white text-sm font-black italic">
              {displayScore}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-8 text-center md:text-left pt-4">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">
              {movie.title}
            </h1>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
              <span className="px-4 py-1.5 bg-slate-800 text-slate-400 text-xs font-bold uppercase tracking-widest rounded-lg border border-slate-700">
                {movie.genre}
              </span>

              <div className="flex items-center gap-2 text-slate-500 font-bold">
                <Clock size={18} className="text-amber-400" />
                <span className="text-sm tracking-wide">
                  {movie.duration} MIN
                </span>
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-base md:text-xl leading-relaxed max-w-4xl font-medium">
            {movie.description}
          </p>

          <div className="pt-6 border-t border-slate-800 max-w-xs">
            <div className="h-1 w-20 bg-amber-400 rounded-full" />
            <p className="mt-4 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
              Now Showing At JCGV Cinema
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
