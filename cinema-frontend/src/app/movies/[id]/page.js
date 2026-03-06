"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MovieHero from "@/components/movie-detail/MovieHero";
import ShowtimeGrid from "@/components/movie-detail/ShowtimeGrid";

const DetailSkeleton = () => (
  <div className="animate-pulse space-y-12">
    <div className="bg-[#1b2021]/50 border border-[#3d4849] rounded-3xl p-8 flex flex-col md:flex-row gap-8">
      <div className="w-48 h-72 bg-slate-800 rounded-2xl" />
      <div className="flex-1 space-y-6 py-4">
        <div className="h-10 bg-slate-800 rounded-lg w-3/4" />
        <div className="flex gap-4">
          <div className="h-6 bg-slate-800 rounded w-20" />
          <div className="h-6 bg-slate-800 rounded w-20" />
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-5/6" />
        </div>
      </div>
    </div>

    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-8 bg-slate-800 rounded-full" />
        <div className="h-8 bg-slate-800 rounded-lg w-48" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-52 bg-[#1b2021]/50 border border-[#3d4849] rounded-2xl"
          />
        ))}
      </div>
    </div>
  </div>
);

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/movies/${id}`);
        const data = await response.json();

        const transformedData = {
          ...data,
          showtimes: (data.showtimes || []).map((st) => {
            const dateObj = new Date(st.startTime);
            return {
              ...st,
              time: dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              date: dateObj.toISOString().split("T")[0],
              hall: st.hall?.name || "Hall A",
            };
          }),
        };
        setMovie(transformedData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMovie();
  }, [id]);

  return (
    <main className="min-h-screen bg-[#0F172A] pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {loading ? (
          <DetailSkeleton />
        ) : movie ? (
          <>
            <MovieHero movie={movie} />
            <ShowtimeGrid showtimes={movie.showtimes} />
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl text-slate-500 italic uppercase font-bold">
              Movie not found.
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}
