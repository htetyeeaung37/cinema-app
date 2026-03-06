// index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';

import authRoutes from "./routes/auth";
import movieRoutes from "./routes/movies";
import showtimeRoutes from "./routes/showtimes";
import bookingRoutes from "./routes/bookings";
import seatRoutes from "./routes/seats";
import cinemaRoutes from "./routes/cinemas";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────
// CORS setting ကို route တွေ အပေါ်ဆုံးမှာ ထားပါ
app.use(cors({
  origin: "*", // အားလုံးကို ခွင့်ပြုထားခြင်း
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // OPTIONS ကိုပါ ထည့်ပေးပါ
  allowedHeaders: ["Content-Type", "Authorization"], // လိုအပ်တဲ့ header တွေ ခွင့်ပြုပါ
  credentials: true
}));

app.use(express.json());

// ── Routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use('/static', express.static(path.join(__dirname, 'public')));

// ── Health check ────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Cinema API is running 🎬" });
});

// ── 404 handler ─────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🎬 Cinema API running on http://localhost:${PORT}`);
});