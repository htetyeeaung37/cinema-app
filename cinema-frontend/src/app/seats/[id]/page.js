"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Ticket, ChevronLeft, Loader2 } from "lucide-react";
import SeatLegend from "@/components/seat-booking/SeatLegend";
import SeatGrid from "@/components/seat-booking/SeatGrid";
import Payment from "@/components/seat-booking/Payment";

export default function SeatSelectionPage() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([
    "C5",
    "C6",
    "D1",
    "D2",
    "B7",
    "A10",
    "H5",
    "E6",
    "E7",
    "F1",
  ]);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const router = useRouter();
  const params = useParams();
  const showtimeId = parseInt(params.id, 10);

  const premiumRows = ["A", "B"];

  useEffect(() => {
    const fetchShowtimeData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3001/api/showtimes/${showtimeId}`,
        );
        if (!response.ok) throw new Error("Showtime not found");
        const data = await response.json();

        const startTime = new Date(data.startTime);
        const timeStr = startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setSelectedShowtime({ ...data, time: timeStr, hall: data.hall.name });
        setSelectedMovie({
          ...data.movie,
          poster: data.movie.posterUrl,
          duration: `${data.movie.duration}min`,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchShowtimeData();
  }, [showtimeId]);

  const basePrice = selectedShowtime ? parseFloat(selectedShowtime.price) : 0;

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId],
    );
  };

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seatId) => {
      const rowName = seatId.charAt(0);
      const isPremium = premiumRows.includes(rowName);

      const seatPrice = isPremium ? basePrice + 5000 : basePrice;
      return total + seatPrice;
    }, 0);
  }, [selectedSeats, basePrice]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
        <p className="font-bold tracking-widest uppercase text-xs opacity-50">
          Loading Showtime...
        </p>
      </div>
    );

  if (error || !selectedShowtime)
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black text-white italic mb-4 uppercase">
          Showtime Not Found
        </h2>
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold border border-slate-700 hover:bg-amber-400 hover:text-black transition-all"
        >
          Back to Home
        </button>
      </div>
    );

  if (showPayment)
    return (
      <Payment
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
        selectedMovie={selectedMovie}
        selectedShowtime={selectedShowtime}
        basePrice={basePrice}
        premiumRows={premiumRows}
        onBack={() => setShowPayment(false)}
      />
    );

  return (
    <main className="min-h-screen bg-[#0F172A] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-amber-400 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-10 bg-amber-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)]" />
              <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                Select Your <span className="text-amber-400">Seats</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-bold text-sm ml-6">
              <span className="text-white uppercase italic">
                {selectedMovie.title}
              </span>
              <span className="opacity-30">•</span>
              <span>{selectedShowtime.time}</span>
              <span className="opacity-30">•</span>
              <span className="text-amber-400/80">{selectedShowtime.hall}</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-[2rem] text-right min-w-[200px] backdrop-blur-md shadow-2xl">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
              Total Amount
            </p>
            <p className="text-5xl font-black text-amber-400 tracking-tighter">
              Ks {totalPrice.toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">
              {selectedSeats.length} Seats Selected
            </p>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-8 mb-16">
          <SeatLegend />
        </div>

        <div className="relative mb-24 max-w-4xl mx-auto">
          <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full shadow-[0_15px_30px_rgba(251,191,36,0.4)]" />
          <p className="mt-6 text-slate-600 text-[11px] font-black uppercase tracking-[0.8em] text-center">
            Screen
          </p>
        </div>

        <div className="flex justify-center overflow-x-auto pb-12 scrollbar-hide">
          <div className="min-w-max px-10">
            <SeatGrid
              selectedSeats={selectedSeats}
              toggleSeat={toggleSeat}
              reservedSeats={reservedSeats}
              premiumRows={premiumRows}
            />
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="bg-slate-900 border border-amber-400/30 rounded-[2rem] p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="bg-amber-400/10 p-3 rounded-2xl">
                  <Ticket className="text-amber-400" size={24} />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Selected Seats
                  </p>
                  <p className="text-white font-black text-lg tracking-tight italic">
                    {selectedSeats.sort().join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="text-center md:text-right hidden sm:block">
                  <p className="text-slate-500 text-[10px] font-black uppercase">
                    Final Price
                  </p>
                  <p className="text-amber-400 font-black text-xl">
                    Ks {totalPrice.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="flex-1 md:flex-none px-10 py-4 bg-amber-400 hover:bg-amber-500 text-black font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_10px_20px_rgba(251,191,36,0.2)] cursor-pointer"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
