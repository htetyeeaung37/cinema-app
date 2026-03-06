// routes/seats.ts
import { Router, Request, Response } from "express";
import prisma from "../libs/prisma";

const router = Router();

// GET /api/seats/showtime/:showtimeId — get seat map for a specific showtime
router.get("/showtime/:showtimeId", async (req: Request, res: Response) => {
  try {
    const showtimeId = Number(req.params.showtimeId);

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        hall: {
          include: { seats: { orderBy: [{ row: "asc" }, { col: "asc" }] } },
        },
      },
    });

    if (!showtime) {
      res.status(404).json({ error: "Showtime not found" });
      return;
    }

    // Get booked seat IDs
    const booked = await prisma.bookedSeat.findMany({
      where: {
        booking: {
          showtimeId,
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      },
      select: { seatId: true },
    });

    const bookedIds = new Set(booked.map((b) => b.seatId));

    // Build a 2D grid representation
    const rows = [...new Set(showtime.hall.seats.map((s) => s.row))].sort();
    const grid = rows.map((row) => ({
      row,
      seats: showtime.hall.seats
        .filter((s) => s.row === row)
        .sort((a, b) => a.col - b.col)
        .map((seat) => ({
          id: seat.id,
          row: seat.row,
          col: seat.col,
          type: seat.type,
          isBooked: bookedIds.has(seat.id),
          price: showtime.price,
        })),
    }));

    res.json({
      showtimeId,
      hallName: showtime.hall.name,
      totalSeats: showtime.hall.seats.length,
      availableSeats: showtime.hall.seats.length - bookedIds.size,
      price: showtime.price,
      grid,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
