"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";

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
import { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import { addMonths, addYears } from "date-fns";
import { useFormContext } from "react-hook-form";

const Dates = [
  { value: addMonths(new Date(), 6), label: "6 months" },
  { value: addYears(new Date(), 1), label: "1 year" },
  { value: addYears(new Date(), 3), label: "3 years" },
  { value: addYears(new Date(), 5), label: "5 years" },
];

const Audience = [
  { value: false, label: "Private" },
  { value: true, label: "Public, but anonymous" },
];

export default function LetterForm({ isSaving }: { isSaving: boolean }) {
  const { register, handleSubmit, reset, formState, setValue } =
    useFormContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined | null>(
    Dates[0].value
  );
  const [selectedAudience, setSelectedAudience] = useState(false);
  const [date, setDate] = React.useState<Date>();

  useEffect(() => {
    setValue("futureSendDate", selectedDate);
    setValue("public", selectedAudience);
  }, [selectedDate, selectedAudience]);

  return (
    <div>
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
                  <h2 className="text-muted-foreground font-heading text-md font-semibold">
                    or choose a <span className="text-primary">date</span>
                  </h2>
                </div>
                <div className="flex items-center justify-between z-40 w-full">
                  <div className="flex flex-row items-center space-x-2">
                    {Dates.map((date) => (
                      <Button
                        key={date.label}
                        onClick={() => setSelectedDate(date.value)}
                        className={`${
                          selectedDate === date.value
                            ? buttonVariants({ variant: "default" })
                            : buttonVariants({ variant: "secondary" })
                        }`}
                      >
                        {date.label}
                      </Button>
                    ))}
                  </div>

                  <Popover>
                    <PopoverTrigger>
                      <Button
                        variant={"outline"}
                        className={cn(
                          " justify-start  text-left font-normal",
                          !date && "text-muted-foreground px-10"
                        )}
                      >
                        {date ? (
                          format(date, "MMM do, yyyy")
                        ) : (
                          <Icons.calendar className="h-6 w-6" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto  mr-6 p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex flex-col items-start  w-full gap-2 ">
                <h2 className="text-muted-foreground font-heading text-lg font-semibold">
                  Select your audience
                </h2>

                <div className="flex flex-row items-center space-x-2">
                  {Audience.map((audience) => (
                    <Button
                      onClick={() => setSelectedAudience(audience.value)}
                      className={`${
                        selectedAudience === audience.value
                          ? buttonVariants({ variant: "default" })
                          : buttonVariants({ variant: "secondary" })
                      }`}
                    >
                      {audience.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start  w-full gap-2 pt-12 pb-4">
                <h2 className="text-muted-foreground font-heading text-lg font-semibold">
                  Make sure you get your letter
                </h2>
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                />
              </div>
              <p>
                You will receive a confirmation email - please make sure your
                email address is correct! By writing a letter and signing up for
                FutureMe you agree to the Terms of use
              </p>
              SheetClose
              <SheetClose asChild>
                {/* <button type="submit" className={cn(buttonVariants())}>
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button> */}
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
  );
}
