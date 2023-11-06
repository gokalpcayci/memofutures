import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { db } from "@/lib/db";
import * as z from "zod";

const letterCreateSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }
    const { user } = session;
    const letters = await db.letter.findMany({
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
        futureSendDate: true,
        sentToFuture: true,
      },
      where: {
        authorId: user.id,
      },
    });

    return new Response(JSON.stringify(letters));
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = letterCreateSchema.parse(json);

    const letter = await db.letter.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: session.user.id,
      },
      select: {
        id: true,
      },
    });
    return new Response(JSON.stringify(letter));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
}
