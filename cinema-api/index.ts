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
// CORS ကို Production URL အတွက် ပြင်ဆင်ခြင်း
app.use(cors({
  origin: [
    "https://cinema-app-snye.vercel.app", // မင်းရဲ့ Frontend Vercel URL
    "http://localhost:3000"                // Local မှာ စမ်းဖို့အတွက်
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
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