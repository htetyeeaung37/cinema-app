import { PrismaClient } from "../generated/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Cleaning database...");
  await prisma.bookedSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.hall.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.cinema.deleteMany();

  console.log("✨ Database cleaned. Starting to seed...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "admin@cinema.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@cinema.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
      },
    });
  }

  const cinema = await prisma.cinema.create({
    data: { name: "CineStar Multiplex", location: "Downtown Mall, 3rd Floor" },
  });

  const hallA = await prisma.hall.create({
    data: { name: "Hall A", totalRows: 8, totalCols: 12, cinemaId: cinema.id },
  });
  const hallB = await prisma.hall.create({
    data: {
      name: "Hall B (IMAX)",
      totalRows: 10,
      totalCols: 12,
      cinemaId: cinema.id,
    },
  });
  const hallC = await prisma.hall.create({
    data: {
      name: "Hall C (Premium)",
      totalRows: 8,
      totalCols: 12,
      cinemaId: cinema.id,
    },
  });
  const hallD = await prisma.hall.create({
    data: {
      name: "Hall D (VIP)",
      totalRows: 8,
      totalCols: 12,
      cinemaId: cinema.id,
    },
  });

  const createSeats = async (
    hallId: number,
    rowsArr: string[],
    cols: number,
  ) => {
    for (const row of rowsArr) {
      for (let col = 1; col <= cols; col++) {
        const type = row === "A" || row === "B" ? "VIP" : "STANDARD";
        await prisma.seat.create({ data: { row, col, type, hallId } });
      }
    }
  };

  const allRows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  await createSeats(hallA.id, allRows, 12);
  await createSeats(
    hallB.id,
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
    12,
  );
  await createSeats(hallC.id, allRows, 12);
  await createSeats(hallD.id, allRows, 12);

  console.log(`✅ Created 4 halls and seats (Row A & B are Premium)`);

  const moviesData = [
    {
      title: "Accused",
      genre: "Mystery",
      duration: 110,
      rating: "G",
      posterUrl: "https://res.cloudinary.com/dcvgxzbyt/image/upload/v1772890627/accused_ois4ha.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "A gripping mystery where a wrongly accused individual must race against time to prove their innocence.",
    },
    {
      title: "Call Me by Your Name",
      genre: "Romance",
      duration: 110,
      rating: "PG",
      posterUrl: "cmbyn.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "A sensual and soulful tale of first love, set in the sun-drenched Italian countryside.",
    },
    {
      title: "Dark Nuns",
      genre: "Thriller",
      duration: 126,
      rating: "PG-13",
      posterUrl: "dark-nuns.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "When an ancient evil awakens, specialized nuns must use their unique skills to prevent a catastrophe.",
    },
    {
      title: "K-Pop Demon Hunters",
      genre: "Fantasy",
      duration: 134,
      rating: "PG-13",
      posterUrl: "demon-hunters.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "World-famous K-Pop stars lead double lives as elite demon hunters.",
    },
    {
      title: "Karate Kid: Legends",
      genre: "Action",
      duration: 113,
      rating: "PG-13",
      posterUrl: "karate-kid-legends.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "A new generation of fighters rises as legendary masters return to train a young underdog.",
    },
    {
      title: "Tales from the Magic Garden",
      genre: "Animation",
      duration: 107,
      rating: "PG",
      posterUrl: "tales-magic-garden.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "A journey through an enchanted garden where tiny creatures discover the power of kindness.",
    },
    {
      title: "The Housemaid",
      genre: "Psychological thriller",
      duration: 162,
      rating: "R",
      posterUrl: "the-housemaid.jpg",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "A chilling exploration of obsession when a new housemaid enters a wealthy household.",
    },
    {
      title: "Omniscient Reader: The Prophecy",
      genre: "Action",
      duration: 128,
      rating: "PG-13",
      posterUrl: "the-prophecy.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "When a web novel becomes reality, the only reader must navigate a dangerous world.",
    },
    {
      title: "The Shadow's Edge",
      genre: "Crime",
      duration: 99,
      rating: "G",
      posterUrl: "tsse.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "A seasoned detective is pulled into a cat-and-mouse game with a brilliant criminal.",
    },
    {
      title: "Vanaveera",
      genre: "Drama",
      duration: 100,
      rating: "G",
      posterUrl: "vanaveera.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "A powerful drama about heritage and the struggle to protect a sacred forest.",
    },
    {
      title: "Your Heart Will Be Broken",
      genre: "Romance",
      duration: 114,
      rating: "PG-13",
      posterUrl: "yhwbb.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "A poignant romance that explores the beauty and pain of limited time together.",
    },
    {
      title: "Zootopia 2",
      genre: "Animation",
      duration: 116,
      rating: "PG",
      posterUrl: "zootopia-2.webp",
      language: "English",
      releaseDate: new Date("2026-02-10"),
      description:
        "Judy Hopps and Nick Wilde return to solve a new case in the secrets of Zootopia.",
    },
  ];

  const movies = [];
  for (const data of moviesData) {
    const movie = await prisma.movie.create({ data });
    movies.push(movie);
  }

  const hallOptions = [hallA, hallB, hallC, hallD];
  const times = ["10:00 AM", "1:30 PM", "4:30 PM", "7:30 PM"];
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);

  function parseTime(timeStr: string) {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return { hour: hours, minute: minutes };
  }

  console.log(`🌱 Generating showtimes for today...`);
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    const selectedHall = hallOptions[i % 4];

    const basePrice =
      selectedHall.name === "Hall A"
        ? 8000
        : selectedHall.name.includes("IMAX")
          ? 12000
          : selectedHall.name.includes("Premium")
            ? 15000
            : selectedHall.name.includes("VIP")
              ? 20000
              : 8000;

    for (const t of times) {
      const { hour, minute } = parseTime(t);
      const start = new Date(baseDate);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start.getTime() + movie.duration * 60000);

      await prisma.showtime.create({
        data: {
          movieId: movie.id,
          hallId: selectedHall.id,
          startTime: start,
          endTime: end,
          price: basePrice,
          format: "2D",
          language: "English",
        },
      });
    }
  }

  console.log(
    "🎬 Seeding complete! Base Prices and Row A/B Premium set correctly.",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
