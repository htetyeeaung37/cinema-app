"use client";
import Link from "next/link";
import React from "react";
import { Star, Clock, Ticket } from "lucide-react";

const MovieCard = ({
  movie: { id, title, genre, rating, duration, posterUrl, description },
}) => {
  const BACKEND_URL = "https://cinema-app-iota.vercel.app/static/movies";

  return (
    <div className="group relative flex flex-col bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(251,191,36,0.1)]">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={`${BACKEND_URL}/${posterUrl}`}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

        <div className="absolute top-4 right-4 px-2 py-1.5 bg-slate-950/80 backdrop-blur-md border border-slate-700 rounded-xl flex items-center gap-1.5 shadow-xl">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span className="text-white text-xs font-black">{rating}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-700">
            {genre}
          </span>
          <div className="flex items-center gap-1 text-slate-500">
            <Clock size={12} />
            <span className="text-[11px] font-medium">{duration}</span>
          </div>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-6">
          {description}
        </p>

        <Link
          href={`/movies/${id}`}
          className="mt-auto w-full py-3 bg-slate-800 hover:bg-amber-400 text-slate-300 hover:text-slate-950 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group/btn shadow-lg"
        >
          <Ticket
            size={16}
            className="group-hover/btn:rotate-12 transition-transform"
          />
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
