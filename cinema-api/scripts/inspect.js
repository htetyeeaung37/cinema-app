const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

(async () => {
  try {
    const prisma = new PrismaClient();
    const movies = await prisma.movie.findMany();
    fs.writeFileSync("movies-output.json", JSON.stringify(movies, null, 2));
    console.log("wrote movies-output.json");
    await prisma.$disconnect();
  } catch (e) {
    fs.writeFileSync("movies-output.json", e.toString());
    console.error(e);
  }
})();
