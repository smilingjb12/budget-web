import { createEnvRecord } from "./env";

const ENV_VARS = ["SITE_URL"] as const;

export const convexEnv = createEnvRecord(ENV_VARS);
