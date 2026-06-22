import dynamic from "next/dynamic";
import { ComponentType } from "react";

const LoaderScreenDynamic: ComponentType = dynamic(
  () => import("./LoaderScreen"),
  { ssr: false }
);

export default LoaderScreenDynamic;
