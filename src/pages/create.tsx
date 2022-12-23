import Head from "next/head";
import { useState } from "react";
import useDeviceMediaStream from "../hooks/use-device-media-stream";
import useStreamSession from "../hooks/use-stream-session";

import Preview from "../components/preview";
import Controls from "../components/controls";
import UserDevices from "../components/user-devices";
import SessionInfo from "../components/session-info";
import clsx from "clsx";

export default function Create() {
  const media = useDeviceMediaStream();
  const session = useStreamSession(media.stream);
  const [isPreviewShown, setIsPreviewShown] = useState(true);

  const togglePreview = () => setIsPreviewShown((state) => !state);

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

      <main className="fixed grid h-full w-full place-items-center bg-neutral-900">
        <div
          className={clsx(
            "grid h-full w-full grid-rows-2 gap-5 p-2",
            "md:max-h-96 md:max-w-6xl md:grid-cols-2 md:grid-rows-none md:items-center lg:gap-20"
          )}
        >
          <Preview
            isPreviewShown={isPreviewShown}
            stream={media.stream}
            isLive={session.sessionId !== null}
          />

          <div className="flex flex-col gap-8 text-sm">
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
              changeDevice={media.changeDevice}
            />
          </div>
        </div>
      </main>
    </>
  );
}
