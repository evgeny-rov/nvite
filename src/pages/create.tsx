import Head from "next/head";
import { useState } from "react";
import useDeviceMediaStream from "../hooks/use-device-media-stream";
import useStreamSession from "../hooks/use-stream-session";

import Preview from "../components/preview";
import Controls from "../components/controls";
import UserDevices from "../components/user-devices";
import SessionInfo from "../components/session-info";

export default function Create() {
  const media = useDeviceMediaStream();
  const session = useStreamSession(media.stream);
  const [isPreviewShown, setIsPreviewShown] = useState(true);

  const togglePreview = () => setIsPreviewShown((state) => !state);

  return (
    <>
      <Head>
        <title>Create - Nvite</title>
        <meta
          name="description"
          content="Share, View, Embed your media streams"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen">
        <main className="flex w-full flex-col items-center gap-5 p-2 md:flex-row lg:justify-center xl:gap-20">
          <div className="w-full lg:max-w-xl">
            <Preview
              isPreviewShown={isPreviewShown}
              stream={media.stream}
              isLive={session.sessionId !== null}
            />
          </div>

          <div className="flex w-full max-w-xl flex-col gap-8 text-sm">
            <div className="grid gap-3">
              <Controls
                {...session}
                isPreviewShown={isPreviewShown}
                togglePreview={togglePreview}
              />
              {session.sessionId && (
                <SessionInfo sessionId={session.sessionId} />
              )}
            </div>

            <UserDevices
              devices={media.devices}
              selectedDevicesIds={media.selectedDevicesIds}
              changeDevice={media.updateDevices}
            />
          </div>
        </main>
      </div>
    </>
  );
}
