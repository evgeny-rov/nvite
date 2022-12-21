import { useRef, useEffect } from "react";
import clsx from "clsx";
import HiddenIcon from "../assets/hidden.svg";

interface Props {
  sessionId: string | null;
  stream: MediaStream | null;
  isPreviewShown: boolean;
}

export default function Preview({ stream, isPreviewShown, sessionId }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.srcObject = stream;
  }, [stream, isPreviewShown]);

  return (
    <div className="w-full max-w-xl">
      {isPreviewShown ? (
        <video
          className={clsx(
            "h-full w-full rounded-md ring-rose-500",
            sessionId && "ring-2"
          )}
          ref={videoRef}
          autoPlay
          controls
          muted
        />
      ) : (
        <div
          className={clsx(
            "grid h-72 place-items-center rounded-md bg-neutral-800 ring-rose-500",
            sessionId && "ring-2"
          )}
        >
          <div className="flex items-center gap-4 text-neutral-500">
            <HiddenIcon className="stroke-current" />
            <span className="text-sm">Preview Hidden</span>
          </div>
        </div>
      )}
    </div>
  );
}
