import { useState } from "react";
import { fragment_mono } from "../styles/fonts";
import CopyIcon from "../assets/copy.svg";
import DoneIcon from "../assets/done.svg";
import useDelay from "../hooks/use-delay";

interface Props {
  sessionId: string;
}

export default function SessionInfo({ sessionId }: Props) {
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [delay] = useDelay();
  const sessionEmbedLinkUrl = `${window.location.origin}/embed/${sessionId}`;

  const handleCopy = async () => {
    if (!navigator.clipboard) return;

    await navigator.clipboard.writeText(sessionEmbedLinkUrl);
    setIsLinkCopied(true);
    delay(() => setIsLinkCopied(false), 1500);
  };

  return (
    <div className="flex gap-2">
      <div className="flex items-center justify-between gap-4 rounded-md bg-neutral-800 py-1.5 px-4">
        <span className={fragment_mono.className}>{sessionId}</span>
      </div>
      <div className="flex grow items-center justify-between gap-4 break-all rounded-md bg-neutral-800 px-4 py-1.5">
        <span className="text-neutral-400">{sessionEmbedLinkUrl}</span>
        <button
          onClick={handleCopy}
          className="h-full text-neutral-400 hover:text-current"
        >
          {isLinkCopied ? (
            <DoneIcon strokeWidth={1.5} className="stroke-current" />
          ) : (
            <CopyIcon strokeWidth={1.5} className="stroke-current" />
          )}
        </button>
      </div>
    </div>
  );
}
