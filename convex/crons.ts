import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "Optimize file storage",
  { hourUTC: 0, minuteUTC: 0 },
  internal.files.optimizeFileStorage
);

export default crons;
