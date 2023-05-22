import { PrismaClient } from "@prisma/client";
import { getToken, JWT } from "next-auth/jwt";
import { NextRequest } from "next/server";

export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  token?: JWT;
}

// export function decodeAuthHeader(authHeader: string): AuthTokenPayload {
//   const token = authHeader.replace("Bearer ", "");
//   if (!token) {
//     throw new Error("No token found");
//   }
//   return jwt.verify(token, SECRET) as AuthTokenPayload;
// }

export const context = async ({
  req,
}: {
  req: NextRequest;
}): Promise<Context> => {
  const token = await getToken({ req });
  if (token) {
    // Signed in
    console.log("JSON Web Token", JSON.stringify(token, null, 2));
    return { prisma, token };
  } else {
    // Not Signed in
    console.log("Not Signed in");
    return { prisma };
  }

  // const token =
  //   req && req.headers.authorization
  //     ? decodeAuthHeader(req.headers.authorization)
  //     : undefined;
};
