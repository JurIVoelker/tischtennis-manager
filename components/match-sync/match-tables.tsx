"use client";

import { useState } from "react";
import MatchSyncTable from "./table";
import TableControls from "./table-controls";
import { TTApiMatch } from "@/scripts/mytt/importGames";
import { deleteAPI, postAPI } from "@/lib/APIUtils";
import { useUserStore } from "@/store/store";

export type SelectableMatch = TTApiMatch & {
  isSelected?: boolean;
};

const MatchTables = ({
  missingMatches,
  ignoredMatches,
  unequalHomeGameMatches,
  unequalLocationMatches,
  unequalTimeMatches,
}: {
  missingMatches: TTApiMatch[];
  ignoredMatches: string[];
  unequalHomeGameMatches: TTApiMatch[];
  unequalLocationMatches: TTApiMatch[];
  unequalTimeMatches: TTApiMatch[];
}) => {
  const { clubSlug } = useUserStore((state) => state);

  const [missingMatchesState, setMissingMatches] =
    useState<SelectableMatch[]>(missingMatches);

  const [unequalHomeGameMatchesState, setUnequalHomeGameMatches] = useState<
    SelectableMatch[]
  >(unequalHomeGameMatches);

  const [unequalLocationMatchesState, setUnequalLocationMatches] = useState<
    SelectableMatch[]
  >(unequalLocationMatches);

  const [unequalTimeMatchesState, setUnequalTimeMatches] =
    useState<SelectableMatch[]>(unequalTimeMatches);

  const selectedMatches = [
    ...((missingMatchesState || []).filter((match) => match.isSelected) || []),
    ...((unequalHomeGameMatchesState || []).filter(
      (match) => match.isSelected
    ) || []),
    ...((unequalLocationMatchesState || []).filter(
      (match) => match.isSelected
    ) || []),
    ...((unequalTimeMatchesState || []).filter((match) => match.isSelected) ||
      []),
  ];

  const [isLoading, setIsLoading] = useState(false);

  const [showHidden, onShowHidden] = useState(false);

  const onIgnoreSelected = async () => {
    setIsLoading(true);
    const ids = selectedMatches.map((match) => match.id);
    await postAPI("/api/match/sync/ignore", {
      ids,
      clubSlug,
    });
    window.location.reload();
    setIsLoading(false);
  };

  const onDeleteHidden = async () => {
    setIsLoading(true);
    const ids = selectedMatches.map((match) => match.id);
    await deleteAPI("/api/match/sync/ignore", {
      ids,
      clubSlug,
    });
    window.location.reload();
    setIsLoading(false);
  };

  const onImportSelected = async () => {
    setIsLoading(true);
    const ids = selectedMatches.map((match) => match.id);
    await postAPI("/api/match/sync", {
      ids,
      clubSlug,
    });
    window.location.reload();
  };

  const visibleMissingMatches = showHidden
    ? missingMatchesState.filter((match) => ignoredMatches.includes(match.id))
    : missingMatchesState.filter((match) => !ignoredMatches.includes(match.id));

  const visibleUnequalHomeGameMatches = showHidden
    ? unequalHomeGameMatchesState.filter((match) =>
        ignoredMatches.includes(match.id)
      )
    : unequalHomeGameMatchesState.filter(
        (match) => !ignoredMatches.includes(match.id)
      );

  const visibleUnequalLocationMatches = showHidden
    ? unequalLocationMatchesState.filter((match) =>
        ignoredMatches.includes(match.id)
      )
    : unequalLocationMatchesState.filter(
        (match) => !ignoredMatches.includes(match.id)
      );

  const visibleUnequalTimeMatches = showHidden
    ? unequalTimeMatchesState.filter((match) =>
        ignoredMatches.includes(match.id)
      )
    : unequalTimeMatchesState.filter(
        (match) => !ignoredMatches.includes(match.id)
      );

  const allMatchesSynced =
    visibleMissingMatches.length === 0 &&
    visibleUnequalHomeGameMatches.length === 0 &&
    visibleUnequalLocationMatches.length === 0 &&
    visibleUnequalTimeMatches.length === 0;

  return (
    <>
      <div className="space-y-6">
        {visibleMissingMatches.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Fehlende Spiele</h3>
            <MatchSyncTable
              type="missing"
              matches={visibleMissingMatches}
              setSelectedMatches={setMissingMatches}
            />
          </div>
        )}

        {visibleUnequalHomeGameMatches.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Spiele mit ungleichem Austragungsort (Heim/Auswärts)
            </h3>
            <MatchSyncTable
              type="location"
              matches={visibleUnequalHomeGameMatches}
              setSelectedMatches={setUnequalHomeGameMatches}
            />
          </div>
        )}

        {visibleUnequalLocationMatches.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Spiele mit ungleichem Austragungsort (Adresse)
            </h3>
            <MatchSyncTable
              type="location"
              matches={visibleUnequalLocationMatches}
              setSelectedMatches={setUnequalLocationMatches}
            />
          </div>
        )}

        {visibleUnequalTimeMatches.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Spiele mit ungleicher Zeit
            </h3>
            <MatchSyncTable
              type="time"
              matches={visibleUnequalTimeMatches}
              setSelectedMatches={setUnequalTimeMatches}
            />
          </div>
        )}
      </div>

      {allMatchesSynced && (
        <>
          <p className="text-muted-foreground">
            Alle Spiele sind synchronisiert.
          </p>
        </>
      )}

      <TableControls
        isLoading={isLoading}
        noneSelected={selectedMatches.length === 0}
        onShowHidden={onShowHidden}
        onHideSelected={onIgnoreSelected}
        onDeleteHidden={onDeleteHidden}
        showHidden={showHidden}
        onImportSelected={onImportSelected}
      />
    </>
  );
};

export default MatchTables;
