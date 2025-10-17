/*
  Warnings:

  - Added the required column `display_name` to the `creator_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "creator_profiles" ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "display_preference" TEXT NOT NULL DEFAULT 'username';
