// routes/cinemas.ts
import { Router, Request, Response } from "express";
import prisma from "../libs/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middlewares/auth";

const router = Router();

// GET /api/cinemas
router.get("/", async (_req: Request, res: Response) => {
  try {
    const cinemas = await prisma.cinema.findMany({
      include: { halls: true },
    });
    res.json(cinemas);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/cinemas/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const cinema = await prisma.cinema.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        halls: {
          include: {
            showtimes: {
              where: {
                startTime: { gte: new Date() },
                isActive: true,
              },
              include: { movie: true },
              orderBy: { startTime: "asc" },
            },
          },
        },
      },
    });

    if (!cinema) {
      res.status(404).json({ error: "Cinema not found" });
      return;
    }

    res.json(cinema);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/cinemas — admin only
router.post(
  "/",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, location } = req.body;
      if (!name || !location) {
        res.status(400).json({ error: "Name and location are required" });
        return;
      }
      const cinema = await prisma.cinema.create({ data: { name, location } });
      res.status(201).json(cinema);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
