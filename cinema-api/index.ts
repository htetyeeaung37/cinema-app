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

// ၁။ CORS configuration
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
}));

// ၂။ OPTIONS Request Handler (CORS Preflight error ကို ရှင်းရန်)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.sendStatus(200); 
});

app.use(express.json());

// ── Routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/cinemas", cinemaRoutes);

// Static file များအတွက် path ကို သေချာသတ်မှတ်ခြင်း
app.use('/static', express.static(path.join(process.cwd(), 'public')));

// ── Health check ────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Cinema API is running 🎬" });
});

// ── 404 handler ─────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Vercel အတွက် export လုပ်ပေးခြင်း (ဒါက 500 error မတက်အောင် ကူညီပေးပါတယ်)
export default app;

// Local မှာ run ရန်အတွက်သာ listen လုပ်ခြင်း
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🎬 Cinema API running on http://localhost:${PORT}`);
  });
}