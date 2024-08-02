-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "salary" TEXT,
    "url" TEXT NOT NULL,
    "logo" TEXT,
    "img" TEXT,
    "city" TEXT NOT NULL,
    "contract" TEXT NOT NULL
);
