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
  }, [stream]);

  return (
    <div className="relative">
      <div
        className={clsx(
          "absolute flex h-full w-full justify-center rounded-md bg-neutral-800 shadow-lg ring-blue-500",
          isLive && "ring-2"
        )}
      >
        {!isPreviewShown && (
          <div className="flex items-center gap-4 text-neutral-500">
            <HiddenIcon className="stroke-current" />
            <span className="text-sm">Preview Hidden</span>
          </div>
        )}
      </div>
      <video
        className={clsx(
          "relative w-full rounded-md",
          !isPreviewShown && "invisible"
        )}
        ref={videoRef}
        autoPlay
        controls
        muted
      />
    </div>
  );
}
