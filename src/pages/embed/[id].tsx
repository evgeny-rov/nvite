import Head from "next/head";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import useViewerSession from "../../hooks/use-view-session";

export default function Consume() {
  const router = useRouter();
  const { id } = router.query;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stream = useViewerSession(Array.isArray(id) ? id[0] : id);

  useEffect(() => {
    if (!stream || !videoRef.current) return;
    videoRef.current.srcObject = stream;
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
      <video
        style={{ position: "fixed", width: "100%", height: "100%" }}
        ref={videoRef}
        controls
        autoPlay
        muted
      ></video>
    </>
  );
}
