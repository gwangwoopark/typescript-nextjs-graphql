import { extendType, intArg, objectType } from "nexus";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("url");
    t.nonNull.string("description");
    t.field("favoritedBy", {
      type: "User",
      async resolve(parent, args, context, info) {
        return await context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .favoritedBy();
      },
    });
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
  },
});

export const LinkList = objectType({
  name: "LinkList",
  definition(t) {
    t.nonNull.list.nonNull.field("links", { type: "Link" });
    t.nonNull.int("count");
    t.id("id");
  },
});

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("linkList", {
      type: "LinkList",
      args: {
        skip: intArg(),
        take: intArg(),
      },
      async resolve(parent, args, context, info) {
        const where = {};
        const [links, count] = await context.prisma.$transaction([
          context.prisma.link.findMany({
            where,
            skip: args?.skip as number | undefined,
            take: args?.take ? (args.take as number) : 20,
          }),
          context.prisma.link.count({ where }),
        ]);
        const id = `main-linkList:${JSON.stringify({
          args,
        })}`;
        return {
          links,
          count,
          id,
        };
      },
    });
  },
});
