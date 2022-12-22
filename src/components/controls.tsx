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

  return (
    <div className="grid h-8 grid-cols-3 gap-3">
      <div
        className={clsx(
          "flex justify-around rounded-md bg-neutral-800 text-sm",
          !sessionId && "text-neutral-500"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "h-2 w-2 rounded-full bg-current",
              sessionId && "text-rose-500"
            )}
          />
          <span>Live</span>
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
            isLocked && "bg-rose-500"
          )}
          onClick={toggleSessionLock}
        >
          <LockedIcon strokeWidth="1.5" className="stroke-current" />
        </button>
      ) : (
        <button
          className="rounded-md bg-rose-500 transition-opacity hover:opacity-90"
          onClick={start}
        >
          <span className="font-semibold">Start</span>
        </button>
      )}

      <button
        onClick={togglePreview}
        className="flex items-center justify-center gap-3 rounded-md bg-neutral-800"
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
