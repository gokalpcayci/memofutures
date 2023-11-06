import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";

type Props = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  buttonEnabled?: boolean;
  secondImage?: string | null;
  secondImageAlt?: string | null;
  secondImageClass?: string | null;
  specialClass?: string | null;
};

type FeaturesProps = {
  FeaturesProps: Props[];
};

export default function FeaturesComponent({ FeaturesProps }: FeaturesProps) {
  return (
    <section
      id="features-2"
      className="max-w-7xl  relative container z-40 mx-auto font-jakarta overflow-hidden text-primary w-full py-16 space-y-8 md:space-y-16 lg:space-y-24  "
    >
      {FeaturesProps[0] && (
        <div className="mx-auto w-full  flex flex-col space-y-8 md:space-y-0 md:flex-row justify-center md:justify-between ">
          <div className="  md:max-w-[50%] xl:max-w-[48rem] ">
            <div className="relative max-w-[30rem]  mx-auto">
              <Image
                className={FeaturesProps[0]?.specialClass || ""}
                alt={FeaturesProps[0]?.imageAlt}
                src={FeaturesProps[0]?.image}
                sizes="
        (max-width: 412px) 70vw,
        (max-width: 640px) 100vw, 
        (max-width: 1024px) 50vw,
        524px
        "
                width={624}
                height={600}
              />

              {FeaturesProps[0]?.secondImage && (
                <Image
                  className={FeaturesProps[0]?.secondImageClass || ""}
                  alt={FeaturesProps[0]?.secondImageAlt || ""}
                  src={FeaturesProps[0]?.secondImage}
                  sizes="
          (max-width: 412px) 70vw,
          (max-width: 640px) 100vw,
          (max-width: 1024px) 50vw,
          324px
          "
                  width={324}
                  height={300}
                />
              )}
            </div>
          </div>

          <div className="flex flex-col container  md:max-w-[32rem] md:w-1/2 md:items-start items-center  justify-center  space-y-4 xl:space-y-6">
            <h2 className="font-heading w-full text-center text-3xl md:text-left font-bold  lg:text-4xl xl:text-5xl">
              {FeaturesProps[0]?.title}
            </h2>
            <p className="text-center text-[#504A58] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg md:text-left w-full leading-normal text-md lg:text-lg   md:leading-6 lg:leading-8">
              {FeaturesProps[0]?.description}
            </p>

            <Button
              className={cn(
                buttonVariants({ size: "lg" }),
                !FeaturesProps[0]?.buttonEnabled && "hidden"
              )}
              rel="noopener noreferrer"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
      {FeaturesProps[1] && (
        <div className="mx-auto w-full flex flex-col md:flex-row-reverse justify-center md:justify-between space-y-4 md:space-y-0  ">
          <div className="md:max-w-[50%] mx-auto">
            <div className="relative max-w-[30rem] mx-auto">
              <Image
                className={FeaturesProps[1]?.specialClass || ""}
                alt={FeaturesProps[1]?.imageAlt}
                src={FeaturesProps[1]?.image}
                sizes="
        (max-width: 412px) 70vw,
        (max-width: 640px) 100vw, 
        (max-width: 1024px) 50vw,
        524px
        "
                width={624}
                height={600}
              />
              {FeaturesProps[1]?.secondImage && (
                <Image
                  className={FeaturesProps[1]?.secondImageClass || ""}
                  alt={FeaturesProps[1]?.secondImageAlt || ""}
                  src={FeaturesProps[1]?.secondImage}
                  sizes="
                  (max-width: 412px) 70vw,
                  (max-width: 640px) 100vw,
                  (max-width: 1024px) 50vw,
                  324px
                  "
                  width={324}
                  height={300}
                />
              )}
            </div>
          </div>

          <div className="flex  flex-col container  md:max-w-[32rem] md:w-1/2 md:items-start items-center justify-center  space-y-4 xl:space-y-6">
            <h2 className="font-heading w-full text-center text-3xl md:text-left font-bold  lg:text-4xl xl:text-5xl">
              {FeaturesProps[1].title}
            </h2>
            <p className="text-center text-[#504A58] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-lg md:text-left w-full leading-normal text-md lg:text-lg   md:leading-6 lg:leading-8">
              {FeaturesProps[1].description}
            </p>

            <Button
              className={cn(
                buttonVariants({ size: "lg" }),
                !FeaturesProps[0]?.buttonEnabled && "hidden"
              )}
              rel="noopener noreferrer"
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
