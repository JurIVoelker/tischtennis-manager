-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "positionPriority" JSONB NOT NULL DEFAULT '{"jugend19": 0, "damen": 0, "erwachsene": 0, "maedchen19": 0, "jugend15": 0, "jugend12": 0, "maedchen15": 0}';
