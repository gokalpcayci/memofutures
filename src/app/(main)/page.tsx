import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import FeaturesComponent from "@/components/features";
import AboveFooter from "@/components/above_footer";
import { Letter } from "@prisma/client";
import { LetterCreateButton } from "@/components/letter-create-button";

const features = [
  {
    title: "Time Your Messages Perfectly",
    description:
      "Choose the exact moment you want to hear from your past self. MemoFutures lets you schedule your letters for delivery on special occasions, milestones, or any future date. Revel in the surprise and wisdom of your own words, precisely when you need them.",
    image: "https://illustrations.popsy.co/gray/engineer.svg",
    imageAlt: "Hero",
  },
  {
    title: "Share Your Journey",
    description:
      "Open your heart and experiences to the MemoFutures community. If you wish, make your letters public for others to read and gain inspiration from your story. Connect, learn, and grow together as you explore the narratives of fellow time-traveling authors on our platform.",
    image: "https://illustrations.popsy.co/gray/student-in-the-classroom.svg",
    imageAlt: "Hero",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen z-20 overflow-hidden">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading font-semibold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Connect with Your Future Self{" "}
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Write to your future self. Unleash the power of time-travel
            messaging with MemoFutures.{" "}
          </p>
          <div className="space-x-4">
            <LetterCreateButton />
            <Link
              href="#"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>
      <FeaturesComponent FeaturesProps={features} />
      <AboveFooter />
    </div>
  );
}
