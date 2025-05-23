/*
  Warnings:

  - The `totalTipped` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `amount` on the `Tip` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Tip" DROP COLUMN "amount",
ADD COLUMN     "amount" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "totalTipped",
ADD COLUMN     "totalTipped" DECIMAL(65,30) NOT NULL DEFAULT 0.0;
