import Headline from "@/components/headline";
import MatchTables from "@/components/match-sync/match-tables";
import SyncSettings from "@/components/match-sync/sync-settings";
import Navbar from "@/components/navbar";
import { prisma } from "@/lib/prisma/prisma";
import {
  categorizeMatchInconsistencies,
  getTTApiMatches,
} from "@/lib/syncUtils";

export const dynamic = "force-dynamic";

const Page = async () => {
  const matches = await getTTApiMatches();
  const {
    missingMatches,
    unequalHomeGameMatches,
    unequalLocationMatches,
    unequalTimeMatches,
  } = await categorizeMatchInconsistencies(matches.matches);

  const ignoredMatches = ((await prisma.hiddenMatch.findMany()) || []).map(
    (match) => match.id
  );

  const settings = await prisma.settings.findFirst();

  return (
    <div className="w-full">
      <Navbar />
      <div className="px-6 pb-6 pt-16 relative">
        <Headline>Spieleimport und Synchronisation</Headline>
        <SyncSettings settings={settings} className="mb-6" />
        <MatchTables
          missingMatches={missingMatches}
          unequalHomeGameMatches={unequalHomeGameMatches}
          unequalLocationMatches={unequalLocationMatches}
          unequalTimeMatches={unequalTimeMatches}
          ignoredMatches={ignoredMatches}
        />
      </div>
    </div>
  );
};

export default Page;
