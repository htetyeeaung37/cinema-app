// routes/showtimes.ts
import { Router, Request, Response } from "express";
import prisma from "../libs/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middlewares/auth";

const router = Router();

// GET /api/showtimes — list showtimes (filter by movieId, date, format)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { movieId, date, format } = req.query;

    let dateFilter: { gte?: Date; lt?: Date } = {};
    if (date) {
      const d = new Date(date as string);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      dateFilter = { gte: d, lt: next };
    } else {
      dateFilter = { gte: new Date() };
    }

    const showtimes = await prisma.showtime.findMany({
      where: {
        isActive: true,
        startTime: dateFilter,
        ...(movieId && { movieId: Number(movieId) }),
        ...(format && { format: format as string }),
      },
      include: {
        movie: true,
        hall: { include: { cinema: true } },
      },
      orderBy: { startTime: "asc" },
    });

    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/showtimes/:id — single showtime with seat availability
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const showtimeId = Number(req.params.id);

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        movie: true,
        hall: {
          include: {
            cinema: true,
            seats: true,
          },
        },
      },
    });

    if (!showtime) {
      res.status(404).json({ error: "Showtime not found" });
      return;
    }

    // Find all booked seats for this showtime
    const bookedSeats = await prisma.bookedSeat.findMany({
      where: {
        booking: {
          showtimeId,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      },
      select: { seatId: true },
    });

    const bookedSeatIds = new Set(bookedSeats.map((bs) => bs.seatId));

    // Annotate each seat with availability
    const seatsWithStatus = showtime.hall.seats.map((seat) => ({
      ...seat,
      isBooked: bookedSeatIds.has(seat.id),
    }));

    res.json({
      ...showtime,
      hall: {
        ...showtime.hall,
        seats: seatsWithStatus,
      },
      availableSeats: showtime.hall.seats.length - bookedSeatIds.size,
      totalSeats: showtime.hall.seats.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/showtimes — admin: create showtime
router.post(
  "/",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { movieId, hallId, startTime, price, format, language } = req.body;

      if (!movieId || !hallId || !startTime || !price) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const movie = await prisma.movie.findUnique({ where: { id: Number(movieId) } });
      if (!movie) {
        res.status(404).json({ error: "Movie not found" });
        return;
      }

      const start = new Date(startTime);
      const end = new Date(start.getTime() + movie.duration * 60 * 1000);

      const showtime = await prisma.showtime.create({
        data: {
          movieId: Number(movieId),
          hallId: Number(hallId),
          startTime: start,
          endTime: end,
          price: Number(price),
          format: format || "2D",
          language: language || "English",
        },
        include: { movie: true, hall: { include: { cinema: true } } },
      });

      res.status(201).json(showtime);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE /api/showtimes/:id — admin: cancel showtime
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      await prisma.showtime.update({
        where: { id: Number(req.params.id) },
        data: { isActive: false },
      });
      res.json({ message: "Showtime cancelled" });
    } catch (err) {
      res.status(500).json({ error: "Showtime not found" });
    }
  }
);

export default router;
