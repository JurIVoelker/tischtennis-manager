import { prisma } from "@/lib/prisma/prisma";

export default async function Home() {
  const clubs = await prisma.club.findMany({
    include: {
      teams: true,
    },
  });
  console.log(clubs);
  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h2>Home</h2>
      {clubs.map((club) => (
        <p>{club.name}</p>
      ))}
    </div>
  );
}
