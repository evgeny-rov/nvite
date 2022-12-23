import ClipboardIcon from "../assets/clipboard.svg";
import { Fragment_Mono } from "@next/font/google";

const fragment_mono = Fragment_Mono({ weight: "400", subsets: ["latin"] });

interface Props {
  sessionId: string;
}

// make font more recognisable

export default function SessionInfo({ sessionId }: Props) {
  const sessionEmbedLinkUrl = `${window.location.origin}/embed/${sessionId}`;

  return (
    <div className="flex gap-3">
      <div className="flex items-center justify-between gap-4 rounded-md bg-neutral-800 py-1.5 px-4">
        <span className={fragment_mono.className}>{sessionId}</span>
        <button className="h-full text-neutral-400 hover:text-current">
          <ClipboardIcon strokeWidth={1.5} className="stroke-current" />
        </button>
      </div>
      <div className="flex grow items-center justify-between break-all rounded-md bg-neutral-800 px-4 py-1.5">
        <span className="text-neutral-400">{sessionEmbedLinkUrl}</span>
        <button className="h-full text-neutral-400 hover:text-current">
          <ClipboardIcon strokeWidth={1.5} className="stroke-current" />
        </button>
      </div>
    </div>
  );
}
