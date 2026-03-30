"use client";
import { useState } from "react";
import {
  ChevronLeft,
  CreditCard,
  Landmark,
  Info,
  User,
  Hash,
} from "lucide-react";
import BookingConfirmation from "./BookingConfirmation";

export default function Payment({
  selectedSeats,
  totalPrice,
  selectedMovie,
  selectedShowtime,
  onBack,
}) {
  const [paymentMethod, setPaymentMethod] = useState("cbbank");
  const [confirmed, setConfirmed] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [errors, setErrors] = useState({});

  const banks = [
    { id: "cbbank", label: "CB Bank Acc" },
    { id: "ayabank", label: "AYA Bank Acc" },
    { id: "kbzbank", label: "KBZ Bank Acc" },
    { id: "abank", label: "A Bank Acc" },
  ];

  const selectedBank = banks.find((b) => b.id === paymentMethod);

  const validate = () => {
    const newErrors = {};
    if (!accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }
    if (!accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (!/^[0-9\-\s]+$/.test(accountNumber)) {
      newErrors.accountNumber = "Enter a valid account number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (validate()) setConfirmed(true);
  };

  if (confirmed) {
    return (
      <BookingConfirmation
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
        selectedMovie={selectedMovie}
        selectedShowtime={selectedShowtime}
        paymentMethod={`${selectedBank.label} • ${accountName}`}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] pt-28 pb-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-amber-400 font-bold text-xs uppercase transition-colors"
          >
            <ChevronLeft size={16} /> Edit Seats
          </button>

          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Checkout <span className="text-amber-400">Process</span>
          </h1>

          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-xl">
            <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-slate-800 pb-4">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between font-bold uppercase text-xs italic">
                <span className="text-slate-500">Movie</span>
                <span className="text-white">{selectedMovie?.title}</span>
              </div>
              <div className="flex justify-between font-bold uppercase text-xs italic">
                <span className="text-slate-500">Date</span>
                <span className="text-white">{selectedShowtime?.date}</span>
              </div>
              <div className="flex justify-between font-bold uppercase text-xs italic">
                <span className="text-slate-500">Hall / Time</span>
                <span className="text-white">
                  {selectedShowtime?.hall} • {selectedShowtime?.time}
                </span>
              </div>
              <div className="flex justify-between font-bold uppercase text-xs italic">
                <span className="text-slate-500">Seats</span>
                <span className="text-amber-400 font-black tracking-tight">
                  {selectedSeats?.join(", ")}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <span className="text-white font-black italic">
                  Total Amount
                </span>
                <span className="text-3xl font-black text-amber-400">
                  Ks {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-5 flex gap-3">
            <Info size={16} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-slate-400 text-xs font-bold italic leading-relaxed">
              Please enter your own bank account details below. Our team will
              verify your transfer and confirm your booking.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-lg font-black text-white uppercase italic mb-6">
              Payment Details
            </h2>

            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
              Select Your Bank
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => {
                    setPaymentMethod(bank.id);
                    setErrors({});
                  }}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl border-2 transition-all duration-200 ${
                    paymentMethod === bank.id
                      ? "bg-amber-400/10 border-amber-400"
                      : "bg-slate-800/40 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-lg ${paymentMethod === bank.id ? "bg-amber-400 text-black" : "bg-slate-800 text-slate-500"}`}
                  >
                    <Landmark size={16} />
                  </div>
                  <span
                    className={`font-black uppercase italic text-xs ${paymentMethod === bank.id ? "text-white" : "text-slate-400"}`}
                  >
                    {bank.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                  Your Account Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={accountName}
                    onChange={(e) => {
                      setAccountName(e.target.value);
                      setErrors((prev) => ({ ...prev, accountName: "" }));
                    }}
                    className={`w-full bg-slate-950 border ${
                      errors.accountName ? "border-red-500" : "border-slate-800"
                    } rounded-xl pl-10 pr-5 py-4 text-white font-bold focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-700`}
                  />
                </div>
                {errors.accountName && (
                  <p className="text-red-500 text-[9px] font-bold mt-1.5 uppercase italic">
                    ⚠ {errors.accountName}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                  Your Account Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-400 transition-colors">
                    <Hash size={16} />
                  </div>

                  <input
                    type="text"
                    placeholder="e.g. 0987-6543-2101"
                    value={accountNumber}
                    onChange={(e) => {
                      setAccountNumber(e.target.value);
                      setErrors((prev) => ({ ...prev, accountNumber: "" }));
                    }}
                    className={`w-full bg-slate-950 border ${
                      errors.accountNumber
                        ? "border-red-500"
                        : "border-slate-800"
                    } rounded-xl pl-10 pr-5 py-4 text-white font-bold focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-700`}
                  />
                </div>
                {errors.accountNumber && (
                  <p className="text-red-500 text-[9px] font-bold mt-1.5 uppercase italic">
                    ⚠ {errors.accountNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                  Amount to Transfer
                </label>
                <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 flex items-center justify-between">
                  <span className="text-slate-600 font-bold text-sm italic uppercase">
                    KS
                  </span>
                  <span className="text-amber-400 font-black text-2xl tracking-tighter">
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full mt-8 py-5 bg-amber-400 hover:bg-amber-500 text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <CreditCard size={20} />
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
