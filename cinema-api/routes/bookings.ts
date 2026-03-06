// routes/bookings.ts
import { Router, Response } from "express";
import prisma from "../libs/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middlewares/auth";

const router = Router();

// All booking routes require authentication
router.use(authenticate);

// GET /api/bookings — user's own bookings (or all bookings for admin)
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user!.role === "ADMIN";

    const bookings = await prisma.booking.findMany({
      where: isAdmin ? {} : { userId: req.user!.id },
      include: {
        showtime: {
          include: {
            movie: true,
            hall: { include: { cinema: true } },
          },
        },
        bookedSeats: { include: { seat: true } },
        user: isAdmin
          ? { select: { id: true, name: true, email: true } }
          : false,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/bookings/:id — single booking
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        showtime: {
          include: {
            movie: true,
            hall: { include: { cinema: true } },
          },
        },
        bookedSeats: { include: { seat: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    // Users can only view their own bookings
    if (req.user!.role !== "ADMIN" && booking.userId !== req.user!.id) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/bookings — create a new booking
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const { showtimeId, seatIds } = req.body;

    if (!showtimeId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
      res.status(400).json({ error: "showtimeId and seatIds array are required" });
      return;
    }

    // Verify showtime exists and is active
    const showtime = await prisma.showtime.findUnique({
      where: { id: Number(showtimeId), isActive: true },
    });

    if (!showtime) {
      res.status(404).json({ error: "Showtime not found or no longer available" });
      return;
    }

    // Check if showtime has already started
    if (showtime.startTime < new Date()) {
      res.status(400).json({ error: "Cannot book a showtime that has already started" });
      return;
    }

    // Check if requested seats belong to the correct hall
    const seats = await prisma.seat.findMany({
      where: {
        id: { in: seatIds.map(Number) },
        hallId: showtime.hallId,
      },
    });

    if (seats.length !== seatIds.length) {
      res.status(400).json({ error: "One or more seats are invalid for this showtime" });
      return;
    }

    // Check if any seat is already booked
    const alreadyBooked = await prisma.bookedSeat.findFirst({
      where: {
        seatId: { in: seatIds.map(Number) },
        booking: {
          showtimeId: Number(showtimeId),
          status: { in: ["PENDING", "CONFIRMED"] },
        },
      },
    });

    if (alreadyBooked) {
      res.status(409).json({ error: "One or more seats are already taken" });
      return;
    }

    const totalAmount = showtime.price * seatIds.length;

    const booking = await prisma.booking.create({
      data: {
        userId: req.user!.id,
        showtimeId: Number(showtimeId),
        totalAmount,
        status: "PENDING",
        bookedSeats: {
          create: seatIds.map((seatId: number) => ({ seatId: Number(seatId) })),
        },
      },
      include: {
        showtime: {
          include: {
            movie: true,
            hall: { include: { cinema: true } },
          },
        },
        bookedSeats: { include: { seat: true } },
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/bookings/:id/confirm — simulate payment confirmation
router.post("/:id/confirm", async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (req.user!.role !== "ADMIN" && booking.userId !== req.user!.id) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    if (booking.status !== "PENDING") {
      res.status(400).json({ error: `Booking is already ${booking.status}` });
      return;
    }

    const paymentRef = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CONFIRMED", paymentRef },
      include: {
        showtime: {
          include: {
            movie: true,
            hall: { include: { cinema: true } },
          },
        },
        bookedSeats: { include: { seat: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/bookings/:id — cancel booking
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: Number(req.params.id) },
      include: { showtime: true },
    });

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    if (req.user!.role !== "ADMIN" && booking.userId !== req.user!.id) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    if (booking.status === "CANCELLED") {
      res.status(400).json({ error: "Booking is already cancelled" });
      return;
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" },
    });

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
