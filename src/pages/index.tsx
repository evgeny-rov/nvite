import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import MicrophoneIcon from "../assets/microphone.svg";
import CameraIcon from "../assets/camera.svg";

export default function Home() {
  const router = useRouter();

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    router.push("/embed/" + ev.currentTarget.sessionId.value);
  };

  return (
    <>
      <Head>
        <title>Nvite</title>
        <meta
          name="description"
          content="Share, View, Embed your media streams"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid min-h-screen place-items-center overflow-hidden bg-neutral-900">
        <div className="grid max-w-xl gap-8 p-4">
          <h1 className="text-6xl font-bold">
            Easiest way to stream your media.
          </h1>
          <div className="flex items-center gap-4 text-blue-300">
            <h2 className="text-lg font-medium">Share / View / Embed</h2>
            <MicrophoneIcon className="stroke-current" />
            <CameraIcon className="stroke-current" />
          </div>
          <Link
            href="/create"
            className="h-16 w-full rounded-xl bg-gradient-to-br from-white/20 to-transparent p-5 text-lg font-bold shadow-lg transition-all hover:bg-blue-500"
          >
            Create
          </Link>

          <form
            className="flex h-16 items-center gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              required
              name="sessionId"
              placeholder="Session ID"
              className="h-full w-full flex-grow rounded-xl border-[1px] border-neutral-800 bg-transparent px-5 text-base font-bold placeholder:text-neutral-500"
            />
            <button className="rounded-xl bg-gradient-to-br from-white/20 to-transparent p-5 text-lg font-bold shadow-lg transition-all hover:bg-blue-500">
              Connect
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
