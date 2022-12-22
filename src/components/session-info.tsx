import ClipboardIcon from "../assets/clipboard.svg";

interface Props {
  sessionId: string;
}

// make font more recognisable

export default function SessionInfo({ sessionId }: Props) {
  const sessionEmbedLinkUrl = `${window.location.origin}/embed/${sessionId}`;

  return (
    <div className="flex gap-3">
      <div className="flex items-center rounded-md bg-neutral-800 py-1.5 pl-5">
        <span>{sessionId}</span>
        <button className="h-full px-5 hover:text-neutral-400">
          <ClipboardIcon strokeWidth={1.5} className="stroke-current" />
        </button>
      </div>
      <div className="flex grow items-center justify-between break-all rounded-md bg-neutral-800 py-1.5 pl-5">
        <span className="text-neutral-400">{sessionEmbedLinkUrl}</span>
        <button className="h-full px-5 hover:text-neutral-400">
          <ClipboardIcon strokeWidth={1.5} className="stroke-current" />
        </button>
      </div>
    </div>
  );
}
