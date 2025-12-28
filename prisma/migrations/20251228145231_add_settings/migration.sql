-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "includeRRSync" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
