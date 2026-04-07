import "server-only";

import { snacksTable } from "@/snacks/data/snacksTable";
import { snackResource } from "@/snacks/models/resource";

export const snackServerResource = {
  ...snackResource,
  drizzleTable: snacksTable,
};
