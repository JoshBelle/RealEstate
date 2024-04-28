/*
  Warnings:

  - You are about to drop the `Complex` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Complex";

-- CreateTable
CREATE TABLE "Apartment" (
    "id" SERIAL NOT NULL,
    "image" BYTEA,
    "rooms" INTEGER NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "floor" INTEGER NOT NULL,
    "buildingPart" TEXT,
    "deliveryDate" TIMESTAMP(3),
    "price" DOUBLE PRECISION NOT NULL,
    "complexId" INTEGER NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ResidentialComplexToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ResidentialComplexToUser_AB_unique" ON "_ResidentialComplexToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ResidentialComplexToUser_B_index" ON "_ResidentialComplexToUser"("B");

-- AddForeignKey
ALTER TABLE "Apartment" ADD CONSTRAINT "Apartment_complexId_fkey" FOREIGN KEY ("complexId") REFERENCES "ResidentialComplex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResidentialComplexToUser" ADD CONSTRAINT "_ResidentialComplexToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ResidentialComplex"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResidentialComplexToUser" ADD CONSTRAINT "_ResidentialComplexToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
