import Head from "next/head";
import { useEffect, useRef } from "react";
import useDeviceMediaStream from "../hooks/useDeviceMediaStream";
import useStreamerSession from "../hooks/useStreamerSession";

export default function Create() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stream = useDeviceMediaStream();
  const { sessionId, numOfViewers } = useStreamerSession(stream);

  useEffect(() => {
    videoRef.current!.srcObject = stream;
  }, [stream]);

  return (
    <>
      <Head>
        <title>Nvite Session</title>
        <meta
          name="description"
          content="Share, View, Embed your media streams"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="grid min-h-screen place-items-center overflow-hidden bg-neutral-900">
        <video ref={videoRef} autoPlay controls />
        <p>sesh: {sessionId}</p>
        <p>viewers: {numOfViewers}</p>
      </main>
    </>
  );
}
