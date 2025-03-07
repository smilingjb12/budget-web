-- Trim all comment values in records table
UPDATE "records" SET "comment" = TRIM("comment") WHERE "comment" IS NOT NULL;

-- Replace specific values
UPDATE "records" 
SET "comment" = 'Accounting' 
WHERE "comment" IN ('Bóch', 'Bokh', 'Bookh');

UPDATE "records" 
SET "comment" = 'Dvalera gift' 
WHERE "comment" IN ('D Valera', 'D valera gift', 'Dvalera');

UPDATE "records" 
SET "comment" = 'Donation' 
WHERE "comment" IN ('Donat', 'Donate');

UPDATE "records" 
SET "comment" = 'Wow gold' 
WHERE "comment" = 'Wow g';

UPDATE "records" 
SET "comment" = 'Wow token' 
WHERE "comment" = 'Wow yoken';

UPDATE "records" 
SET "comment" = 'Zabka' 
WHERE "comment" IN ('Za', 'Za ka', 'Zab6', 'Zabja', 'Żabka'); 