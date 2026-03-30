"use client";
import { useRouter } from "next/navigation";
import { toPng } from "html-to-image";
import { CheckCircle2, Download, Home } from "lucide-react";
import React, { useRef } from "react";

export default function BookingConfirmation({
  selectedSeats,
  totalPrice,
  selectedMovie,
  selectedShowtime,
  paymentMethod,
}) {
  const router = useRouter();
  const ticketRef = useRef(null);
  const bookingId =
    "BK" + Math.random().toString(36).substring(2, 10).toUpperCase();

  const handleDownload = async () => {
    if (!ticketRef.current) return;

    try {
      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#0f172a",
        style: {
          borderRadius: "0",
        },
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `JCGV-Ticket-${bookingId}.png`;
      link.click();
    } catch (error) {
      console.error("Download failed:", error);
      alert(
        "ပုံထုတ်ရာတွင် error တက်နေပါသည်။ CSS ထဲရှိ lab() အရောင်များကို HEX သို့ ပြောင်းပေးပါ။",
      );
    }
  };

  const details = [
    { label: "MOVIE", value: selectedMovie?.title || "N/A", icon: "🎬" },
    {
      label: "DATE & TIME",
      value: `${selectedShowtime?.date || ""} • ${selectedShowtime?.time || "N/A"}`,
      icon: "📅",
    },
    {
      label: "CINEMA HALL",
      value: selectedShowtime?.hall || "N/A",
      icon: "📍",
    },
    {
      label: "SEATS",
      value: selectedSeats?.sort().join(", ") || "N/A",
      icon: "💺",
      highlight: true,
    },
    { label: "PAYMENT", value: paymentMethod || "N/A", icon: "💳" },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] pt-28 pb-12 px-4 flex flex-col items-center">
      <div className="text-center mb-8">
        <CheckCircle2 className="w-16 h-16 text-[#fbbf24] mx-auto mb-3" />
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
          Booking <span className="text-[#fbbf24]">Confirmed!</span>
        </h1>
      </div>

      <div
        ref={ticketRef}
        id="booking-ticket-card"
        className="w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl relative"
        style={{
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
        }}
      >
        <div
          style={{
            backgroundColor: "#fbbf24",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontWeight: "900",
              fontStyle: "italic",
              color: "#000000",
              fontSize: "24px",
              letterSpacing: "-0.05em",
              textTransform: "uppercase",
              margin: "0",
            }}
          >
            JCGV CINEMA
          </p>
        </div>

        <div style={{ padding: "40px" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
              borderBottom: "1px dashed #1e293b",
              paddingBottom: "24px",
            }}
          >
            <p
              style={{
                color: "#fbbf24",
                fontSize: "32px",
                fontWeight: "900",
                fontStyle: "italic",
                letterSpacing: "0.05em",
                margin: "0",
              }}
            >
              {bookingId}
            </p>
            <p
              style={{
                color: "#64748b",
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                marginTop: "4px",
              }}
            >
              Reference No.
            </p>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {details.map((item, idx) => (
              <div
                key={idx}
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <div>
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "9px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      margin: "0",
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontWeight: "900",
                      fontSize: "17px",
                      fontStyle: "italic",
                      textTransform: "uppercase",
                      color: item.highlight ? "#fbbf24" : "#ffffff",
                      margin: "0",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "48px",
              paddingTop: "32px",
              borderTop: "1px dashed #1e293b",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                color: "#64748b",
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
              }}
            >
              Total Paid
            </span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: "900",
                color: "#ffffff",
                fontStyle: "italic",
                letterSpacing: "-0.05em",
              }}
            >
              Ks {totalPrice?.toLocaleString() || "0"}
            </span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: "135px",
            left: "-16px",
            width: "32px",
            height: "32px",
            backgroundColor: "#0f172a",
            borderRadius: "50%",
            border: "1px solid #1e293b",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "135px",
            right: "-16px",
            width: "32px",
            height: "32px",
            backgroundColor: "#0f172a",
            borderRadius: "50%",
            border: "1px solid #1e293b",
          }}
        ></div>
      </div>

      <div className="flex gap-4 w-full max-w-md mt-10">
        <button
          onClick={() => router.push("/")}
          className="flex-1 py-5 bg-[#1e293b] text-white font-black rounded-2xl border border-slate-700 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Home size={18} /> HOME
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 py-5 bg-[#fbbf24] text-black font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:bg-[#f59e0b] transition-all active:scale-95 cursor-pointer"
        >
          <Download size={18} /> SAVE TICKET
        </button>
      </div>
    </div>
  );
}
