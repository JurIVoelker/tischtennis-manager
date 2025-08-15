import { useId } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { SelectableMatch } from "./match-tables";
import { Badge } from "../ui/badge";

type Type = "missing" | "location" | "time";

const MatchSyncTable = ({
  matches,
  type,
  setSelectedMatches,
}: {
  matches: SelectableMatch[];
  type: Type;
  setSelectedMatches: (matches: SelectableMatch[]) => void;
}) => {
  const id = useId();

  const selectedMatches = matches.filter((match) => match.isSelected);

  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11">
                <Checkbox
                  id={id}
                  checked={selectedMatches.length === matches.length}
                  onCheckedChange={(checked) => {
                    setSelectedMatches(
                      checked
                        ? matches.map((match) => ({
                            ...match,
                            isSelected: true,
                          }))
                        : matches.map((match) => ({
                            ...match,
                            isSelected: false,
                          }))
                    );
                  }}
                />
              </TableHead>
              <TableHead className="h-11">Heim</TableHead>
              <TableHead className="h-11">Auswärts</TableHead>
              <TableHead className="h-11">Liga</TableHead>
              <TableHead className="h-11">Datum</TableHead>
              {type === "location" && (
                <TableHead className="h-11">Austragungsort</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell>
                  <Checkbox
                    id={`table-checkbox-${match.id}`}
                    checked={match.isSelected}
                    onCheckedChange={(checked) => {
                      const updatedMatches = matches.map((m) =>
                        m.id === match.id
                          ? { ...m, isSelected: checked as boolean }
                          : m
                      );
                      setSelectedMatches(updatedMatches);
                    }}
                  />
                </TableCell>
                <TableCell>{match.teams.home.name}</TableCell>
                <TableCell>{match.teams.away.name}</TableCell>
                <TableCell>{match.league.name}</TableCell>
                <TableCell>
                  {format(new Date(match.datetime), "dd.MM.yyyy HH:mm")} Uhr
                </TableCell>
                {type === "location" && (
                  <TableCell>
                    <span>
                      {match.location.name} ({match.location.address.street},{" "}
                      {match.location.address.zip} {match.location.address.city}
                      )
                    </span>
                    <Badge className="ml-2">
                      {match.isHomeGame ? "Heim" : "Auswärts"}
                    </Badge>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {matches.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            Keine Spiele gefunden
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchSyncTable;
