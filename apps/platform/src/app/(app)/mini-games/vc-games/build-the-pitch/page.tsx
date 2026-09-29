import type { Metadata } from "next";

import { BuildThePitch } from "./BuildThePitch";

export const metadata: Metadata = {
  title: "Build the Pitch | The Deal Room",
  description: "Build a startup metrics slide across four authored VC-finance sections.",
};

export default function BuildThePitchPage() {
  return <BuildThePitch />;
}
