import { Orbit } from "lucide-react";
import Image from "next/image";
import { config } from "@/config";

export default function Brand() {
  return (
    <a className="brand" href="#top" aria-label={`${config.brand.name} home`}>
      <span className="brand-icon">{config.brand.logo ? <Image src={config.brand.logo} alt="" width={44} height={44} unoptimized /> : <Orbit size={28} strokeWidth={2.5} />}</span>
      <span>{config.brand.name}<span className="brand-dot">.</span></span>
    </a>
  );
}
