import { notFound, redirect } from "next/navigation";
import { Letter, User } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { Editor } from "@/components/editor";

async function getletterForUser(letterId: Letter["id"], userId: User["id"]) {
  return await db.letter.findFirst({
    where: {
      id: letterId,
      authorId: userId,
    },
  });
}

interface EditorPageProps {
  params: { letterId: string };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const letter = await getletterForUser(params.letterId, user.id);

  if (!letter) {
    notFound();
  }

  return (
    <Editor
      letter={{
        id: letter.id,
        title: letter.title,
        content: letter.content,
        published: letter.published,
      }}
    />
  );
}
