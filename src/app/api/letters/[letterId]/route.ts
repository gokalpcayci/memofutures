import { getServerSession } from "next-auth";
import * as z from "zod";

import { AuthOptions } from "next-auth";
import { db } from "@/lib/db";
import { letterSchema } from "@/lib/validations/letter";
import { authOptions } from "@/lib/auth";

const routeContextSchema = z.object({
  params: z.object({
    letterId: z.string(),
  }),
});

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context);

    if (!(await verifyCurrentUserHasAccessToLetter(params.letterId))) {
      return new Response(null, { status: 403 });
    }

    // delete letters
    await db.letter.delete({
      where: {
        id: params.letterId as string,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }
    return new Response(null, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context);

    if (!(await verifyCurrentUserHasAccessToLetter(params.letterId))) {
      return new Response(null, { status: 403 });
    }
    // Get the request body and revalidate it
    const json = await req.json();
    const body = letterSchema.parse(json);

    await db.letter.update({
      where: {
        id: params.letterId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return new Response(null, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}

async function verifyCurrentUserHasAccessToLetter(letterId: string) {
  const session = await getServerSession(authOptions);
  const count = await db.letter.count({
    where: {
      id: letterId,
      authorId: session?.user.id,
    },
  });
  return count > 0;
}
