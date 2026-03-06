// routes/movies.ts
import { Router, Request, Response } from "express";
import prisma from "../libs/prisma";
import { authenticate, requireAdmin, AuthRequest } from "../middlewares/auth";

const router = Router();

// GET /api/movies  — list all active movies (with optional genre/search filter)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { genre, search, active } = req.query;

    const movies = await prisma.movie.findMany({
      where: {
        ...(active !== "false" && { isActive: true }),
        ...(genre && { genre: { equals: genre as string } }),
        ...(search && {
          title: { contains: search as string },
        }),
      },
      orderBy: { releaseDate: "desc" },
    });

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/movies/:id — single movie with upcoming showtimes
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        showtimes: {
          where: {
            isActive: true,
          },
          include: { hall: { include: { cinema: true } } },
          orderBy: { startTime: "asc" },
        },
      },
    });

    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/movies/genres/list — all distinct genres
router.get("/genres/list", async (_req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany({
      select: { genre: true },
      distinct: ["genre"],
      where: { isActive: true },
    });
    res.json(movies.map((m) => m.genre));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/movies — admin: create movie
router.post(
  "/",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        title, description, genre, duration,
        rating, posterUrl, language, releaseDate,
      } = req.body;

      if (!title || !description || !genre || !duration || !rating || !releaseDate) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const movie = await prisma.movie.create({
        data: {
          title, description, genre,
          duration: Number(duration),
          rating,
          posterUrl,
          language: language || "English",
          releaseDate: new Date(releaseDate),
        },
      });

      res.status(201).json(movie);
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// PUT /api/movies/:id — admin: update movie
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const movie = await prisma.movie.update({
        where: { id: Number(req.params.id) },
        data: req.body,
      });
      res.json(movie);
    } catch (err) {
      res.status(500).json({ error: "Movie not found or update failed" });
    }
  }
);

// DELETE /api/movies/:id — admin: soft delete (set isActive = false)
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      await prisma.movie.update({
        where: { id: Number(req.params.id) },
        data: { isActive: false },
      });
      res.json({ message: "Movie deactivated" });
    } catch (err) {
      res.status(500).json({ error: "Movie not found" });
    }
  }
);

export default router;
