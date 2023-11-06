"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Letter } from "@prisma/client";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import * as z from "zod";
import "@/styles/editor.css";
import { toast } from "@/components/ui/use-toast";
import { letterSchema } from "@/lib/validations/letter";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "./icons";
import { Calendar } from "@/components/ui/calendar";
import { letterPatchSchema } from "@/lib/validations/letter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";

interface EditorProps {
  letter: Pick<Letter, "id" | "title" | "content" | "published">;
}

type FormData = z.infer<typeof letterSchema>;

export function Editor({ letter }: EditorProps) {
  const choices = [
    { choice: "or choose a date", val: false },
    { choice: "or choose a duration", val: true },
  ];

  const [selectedChoice, setSelectedChoice] = useState(choices[0].val);
  const form = useForm<FormData>({
    resolver: zodResolver(letterSchema),
  });
  const ref = React.useRef<EditorJS>();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  const initializeEditor = React.useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;

    const body = letterPatchSchema.parse(letter);

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your letter...",
        inlineToolbar: true,
        data: body.content,
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, [letter]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      initializeEditor();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    const blocks = await ref.current?.save();

    const response = await fetch(`/api/letters/${letter.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: blocks,
        email: data.email,
        futureSendDate: data.futureSendDate,
        public: data.public,
      }),
    });

    setIsSaving(false);

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your letter was not saved. Please try again.",
        variant: "destructive",
      });
    }

    router.refresh();

    return toast({
      description: "Your letter has been saved.",
    });
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid w-full gap-10">
          <div className="flex w-full items-center justify-between  ">
            <div className="flex items-center space-x-10">
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                <>
                  <Icons.chevronLeft className="mr-2 h-4 w-4" />
                  Back
                </>
              </Link>
              <p className="text-sm text-muted-foreground">
                {letter.published ? "Published" : "Draft"}
              </p>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button className={cn(buttonVariants({ size: "sm" }))}>
                  Continue
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full  sm:min-w-[580px]">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-heading border-b">
                    Let's finish it with the last touches..
                  </SheetTitle>
                  <SheetDescription>
                    <div className="flex flex-col items-start  w-full gap-2 py-12">
                      <div className="flex items-center justify-between w-full">
                        <h2 className="text-muted-foreground font-heading text-lg font-semibold">
                          Deliver in
                        </h2>
                        <button
                          onClick={() => setSelectedChoice(!selectedChoice)}
                          className={cn(
                            "text-muted-foreground font-heading text-md font-semibold"
                          )}
                        >
                          {selectedChoice
                            ? choices[1].choice
                            : choices[0].choice}
                        </button>
                      </div>
                      <div className="flex items-center justify-between z-40 w-full">
                        {choices[0].val === selectedChoice ? (
                          <div className="flex flex-row items-center space-x-2">
                            <FormField
                              control={form.control}
                              name="public"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={"6-months"}
                                      className="flex space-x-1"
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="6-months" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          6 months
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="1-year" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          1 year
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="3-year" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          3 year
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="5-year" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          5 year
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ) : (
                          <FormField
                            control={form.control}
                            name="futureSendDate"
                            render={({ field }) => (
                              <FormItem className="flex border shadow-sm rounded-md flex-col">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      <Icons.calendar className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-start  w-full gap-2 ">
                      <h2 className="text-muted-foreground font-heading text-lg font-semibold">
                        Select your audience
                      </h2>

                      <div className="flex flex-row items-center space-x-2">
                        <FormField
                          control={form.control}
                          name="public"
                          defaultValue={false}
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value.toString()}
                                  className="flex flex-col space-y-1"
                                >
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem
                                        value={false.toString()}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Private
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={true.toString()} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Public, but anonymous
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start  w-full gap-2 pt-12 pb-4">
                      <h2 className="text-muted-foreground font-heading text-lg font-semibold">
                        Make sure you get your letter
                      </h2>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input placeholder="Email" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <p>
                      You will receive a confirmation email - please make sure
                      your email address is correct! By writing a letter and
                      signing up for FutureMe you agree to the Terms of use
                    </p>
                    <SheetClose asChild>
                      <Button
                        type="submit"
                        className={cn(
                          buttonVariants({ size: "lg" }),
                          "w-full mt-4 flex justify-center gap-2"
                        )}
                      >
                        {isSaving && (
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Send to the Future
                      </Button>
                    </SheetClose>
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
          <div className="prose prose-stone mx-auto w-full md:w-[800px] dark:prose-invert">
            <TextareaAutosize
              autoFocus
              id="title"
              defaultValue={letter.title}
              placeholder="letter title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
              {...form.register("title")}
            />
            <div id="editor" className="min-h-[500px]" />
            <p className="text-sm text-gray-500">
              Use{" "}
              <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                Tab
              </kbd>{" "}
              to open the command menu.
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
}
