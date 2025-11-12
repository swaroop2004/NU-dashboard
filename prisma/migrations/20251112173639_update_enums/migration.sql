-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "LeadStatus" ADD VALUE 'NEW';
ALTER TYPE "LeadStatus" ADD VALUE 'FOLLOW_UP';
ALTER TYPE "LeadStatus" ADD VALUE 'LOST';
ALTER TYPE "LeadStatus" ADD VALUE 'NURTURED';
ALTER TYPE "LeadStatus" ADD VALUE 'CONVERTED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Source" ADD VALUE 'SOCIAL_MEDIA';
ALTER TYPE "Source" ADD VALUE 'WALK_IN';
ALTER TYPE "Source" ADD VALUE 'CALL';
ALTER TYPE "Source" ADD VALUE 'EMAIL';
