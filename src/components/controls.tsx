import clsx from "clsx";

import VisibleIcon from "../assets/visible.svg";
import LockedIcon from "../assets/locked.svg";
import HiddenIcon from "../assets/hidden.svg";

interface Props {
  sessionId: string | null;
  viewers: number;
  isLocked: boolean;
  isPreviewShown: boolean;
  togglePreview: () => void;
  start: () => void;
  lock: () => void;
  unlock: () => void;
}

export default function Controls({
  sessionId,
  viewers,
  isLocked,
  isPreviewShown,
  togglePreview,
  lock,
  start,
  unlock,
}: Props) {
  const toggleSessionLock = isLocked ? unlock : lock;
  const isSessionStarted = sessionId !== null;
  const isLive = sessionId !== null;

  return (
    <div className="grid h-8 grid-cols-3 gap-3">
      <div
        className={clsx(
          "flex justify-around rounded-md bg-neutral-800 text-sm",
          !isLive && "text-neutral-500"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "h-2 w-2 rounded-full bg-current",
              isLive && "text-rose-500"
            )}
          />
          <span>{isLive ? "Live" : "Offline"}</span>
        </div>
        <div className="flex items-center gap-3">
          <VisibleIcon className="stroke-current" />
          <span>{viewers}</span>
        </div>
      </div>

      {isSessionStarted ? (
        <button
          className={clsx(
            "grid place-items-center rounded-md bg-neutral-800 transition-colors",
            isLocked && "bg-blue-500"
          )}
          onClick={toggleSessionLock}
        >
          <LockedIcon strokeWidth="1.5" className="stroke-current" />
        </button>
      ) : (
        <button
          className="rounded-md bg-blue-500 transition-opacity hover:opacity-90"
          onClick={start}
        >
          <span className="font-semibold">Start</span>
        </button>
      )}

      <button
        onClick={togglePreview}
        className={clsx(
          "flex items-center justify-center gap-4 rounded-md bg-neutral-800 transition-colors",
          isPreviewShown && "bg-blue-500"
        )}
      >
        {isPreviewShown ? (
          <VisibleIcon className="stroke-current" />
        ) : (
          <HiddenIcon className="stroke-current" />
        )}
        <span>Preview</span>
      </button>
    </div>
  );
}
