"use client";
import BookingConfirmation from "@/components/seat-booking/BookingConfirmation";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const { id } = useParams();

  const seats = searchParams.get("seats")?.split(",") || [];
  const total = searchParams.get("total") || 0;
  const method = searchParams.get("method") || "Unknown";

  const [movieData, setMovieData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/showtimes/${id}`)
      .then((res) => res.json())
      .then((data) => setMovieData(data));
  }, [id]);

  if (!movieData) return <div className="min-h-screen bg-[#0F172A]" />;

  return (
    <BookingConfirmation
      selectedSeats={seats}
      totalPrice={parseFloat(total)}
      selectedMovie={movieData.movie}
      selectedShowtime={{
        time: new Date(movieData.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        hall: movieData.hall.name,
      }}
      paymentMethod={method}
    />
  );
}
