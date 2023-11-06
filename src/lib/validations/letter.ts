import * as z from "zod";

export const letterPatchSchema = z.object({
  title: z.string().min(3).max(128).optional(),

  // TODO: Type this properly from editorjs block types?
  content: z.any().optional(),
});

export const letterSchema = z.object({
  title: z.string().min(3).max(128).optional(),

  // TODO: Type this properly from editorjs block types?
  content: z.any().optional(),
  futureSendDate: z.date(),
  public: z.boolean(),
  email: z.string().email(),
});
