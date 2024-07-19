-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "salary" TEXT,
    "url" TEXT NOT NULL,
    "logo" TEXT
);
