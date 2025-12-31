-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('regular', 'cup');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "type" "MatchType" NOT NULL DEFAULT 'regular';
