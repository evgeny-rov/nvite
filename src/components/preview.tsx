import { useRef, useEffect } from "react";
import clsx from "clsx";
import HiddenIcon from "../assets/hidden.svg";

interface Props {
  isLive: boolean;
  stream: MediaStream | null;
  isPreviewShown: boolean;
}

export default function Preview({ stream, isPreviewShown, isLive }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
  }, [stream, isPreviewShown]);

  if (!isPreviewShown) {
    return (
      <div
        className={clsx(
          "grid h-full w-full place-items-center rounded-md bg-neutral-800 shadow-lg ring-rose-500",
          isLive && "ring-2"
        )}
      >
        <div className="flex items-center gap-4 text-neutral-500">
          <HiddenIcon className="stroke-current" />
          <span className="text-sm">Preview Hidden</span>
        </div>
      </div>
    );
  }

  return (
    <video
      className={clsx("rounded-md shadow-lg ring-rose-500", isLive && "ring-2")}
      ref={videoRef}
      autoPlay
      controls
      muted
    />
  );
}
