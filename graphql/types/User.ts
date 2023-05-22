import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("email");
    t.nonNull.string("password");
    t.nonNull.string("name");
    t.nonNull.list.nonNull.field("favoriteLinks", {
      type: "Link",
      async resolve(parent, args, context, info) {
        return await context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .favoriteLinks();
      },
    });
    t.nonNull.dateTime("createdAt");
    t.nonNull.dateTime("updatedAt");
  },
});
