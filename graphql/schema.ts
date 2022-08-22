import { makeSchema } from "nexus";
import { join } from "path";

export const schema = makeSchema({
  types: [],
  outputs: {
    schema: join(process.cwd(), "./graphql/generated/schema.graphql"),
    typegen: join(process.cwd(), "./graphql/generated/nexus-typegen.d.ts"),
  },
});
