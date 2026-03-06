import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth";
import movieRoutes from "./routes/movies";
import showtimeRoutes from "./routes/showtimes";
import bookingRoutes from "./routes/bookings";
import seatRoutes from "./routes/seats";
import cinemaRoutes from "./routes/cinemas";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  }),
);

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PATCH,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );
  res.sendStatus(200);
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/cinemas", cinemaRoutes);

app.use("/static", express.static(path.join(process.cwd(), "public")));

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Cinema API is running 🎬" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🎬 Cinema API running on http://localhost:${PORT}`);
  });
}
