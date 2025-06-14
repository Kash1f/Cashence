import {neon} from "@neondatabase/serverless";

import "dotenv/config";

//creates SQL connection using our DB URL, sql is the function we will use to run queries
export const sql = neon(process.env.DATABASE_URL)