import Typography from "@/components/typography";

export default async function Home() {
  return (
    <div className="w-full">
      <div className="space-y-3 px-6 pb-6 pt-16">
        <Typography variant="h3">Tischtennis Manager</Typography>
        <Typography variant="p-gray" className="max-w-[600px]">
          Willkommen beim Tischtennis Manager. Bitte verwende den Login Link,
          den dir dein Mannschaftsführer geschickt hat.
        </Typography>
      </div>
    </div>
  );
}
