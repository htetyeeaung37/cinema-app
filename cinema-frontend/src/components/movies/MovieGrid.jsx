"use client";

import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { AlertCircle, Film } from "lucide-react";

const MovieGrid = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://cinema-app-iota.vercel.app/api/movies",
        );

        if (!response.ok) throw new Error("Failed to fetch movies");

        const data = await response.json();

        const transformedMovies = data.map((movie) => ({
          ...movie,
          poster: movie.posterUrl,
          duration: `${movie.duration}min`,
          rating: movie.rating,
          showtimes: [],
        }));

        setMovies(transformedMovies);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12 mt-16 md:mt-20">
        <div className="flex items-center gap-3 mb-10 animate-pulse">
          <div className="w-1.5 h-8 bg-slate-700 rounded-full" />
          <div className="h-8 w-48 bg-slate-700 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] w-full bg-slate-800/50 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-20 mt-20 text-center">
        <div className="inline-flex p-4 rounded-full bg-red-500/10 mb-4">
          <AlertCircle className="text-red-500" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all"
        >
          Try Again
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 mt-16">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">
            Now <span className="text-amber-400">Showing</span>
          </h2>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-widest">
          <Film size={16} />
          <span>{movies.length} Movies</span>
        </div>
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
          <p className="text-slate-500 font-medium">
            No movies found in the cinema today.
          </p>
        </div>
      )}
    </section>
  );
};

export default MovieGrid;
