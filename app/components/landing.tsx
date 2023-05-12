import { ChevronDown } from "lucide-react";
import Image from "next/image";

import LandingImage from "public/landing.webp";

const Landing = () => (
  <div className="flex relative items-center mb-2 sm:mt-4 lg:mt-8 sm:px-5 lg:container mx-auto 2xl:px-0">
    <div className="flex flex-1 sm:border border-border sm:rounded-xl sm:p-5 items-center lg:p-10 gap-x-5 lg:gap-x-16">
      <div className="absolute sm:static w-full h-full bg-black/50 sm:bg-transparent z-10 flex items-center justify-center">
        <TitleSubtitle />
      </div>
      <div className="w-full sm:min-w-1/2 max-w-[640px] relative min-h-[350px] sm:min-h-[450px] sm:rounded-lg overflow-hidden">
        <Image
          priority
          src={LandingImage}
          className="object-cover w-full h-full object-bottom"
          alt="landing image"
          fill
        />
      </div>
    </div>
  </div>
);

const TitleSubtitle = () => (
  <div className="flex flex-col gap-y-3 sm:gap-y-6 text-white sm:text-black self-center px-6 text-center sm:text-start sm:px-0 items-center sm:items-start">
    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold">
      {"Your One-Stop Shop for Communications Services"}
    </h1>
    <p className="text-lg text-white/90 sm:text-black/90">
      {
        "Enjoy High-Speed Internet, TV and More with Our Cross-Selling Solutions"
      }
    </p>
    <div className="flex gap-x-3 items-center max-w-max pt-10 text-white/80 sm:text-black/80 sm:pl-0.5">
      <p className="text-sm">{"Scroll to see more"}</p>
      <ChevronDown />
    </div>
  </div>
);

export default Landing;
