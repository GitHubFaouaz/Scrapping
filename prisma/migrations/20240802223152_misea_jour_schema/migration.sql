/*
  Warnings:

  - Added the required column `typeWork` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "salary" TEXT,
    "url" TEXT NOT NULL,
    "logo" TEXT,
    "img" TEXT,
    "city" TEXT NOT NULL,
    "contract" TEXT NOT NULL,
    "typeWork" TEXT NOT NULL
);
INSERT INTO "new_Jobs" ("city", "company", "contract", "date", "id", "img", "logo", "salary", "title", "url") SELECT "city", "company", "contract", "date", "id", "img", "logo", "salary", "title", "url" FROM "Jobs";
DROP TABLE "Jobs";
ALTER TABLE "new_Jobs" RENAME TO "Jobs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
