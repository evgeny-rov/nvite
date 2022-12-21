import clsx from "clsx";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import useDeviceMediaStream from "../hooks/use-device-media-stream";
import useStreamerSession from "../hooks/use-stream-session";
import Select from "../components/select";

import MicrophoneIcon from "../assets/microphone.svg";
import CameraIcon from "../assets/camera.svg";
import VisibleIcon from "../assets/visible.svg";
import UnlockedIcon from "../assets/unlocked.svg";
import LockedIcon from "../assets/locked.svg";
import Preview from "../components/preview";

export default function Create() {
  const {
    videoDevices,
    audioDevices,
    selectedDevicesIds,
    updateStream,
    stream,
  } = useDeviceMediaStream();
  const { sessionId, isLocked, viewers, start, lock, unlock } =
    useStreamerSession(stream);
  const [isPreviewShown, setIsPreviewShown] = useState(true);

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

      <main className="flex min-h-screen flex-col items-center gap-5 overflow-hidden bg-neutral-900 p-1">
        <Preview
          isPreviewShown={isPreviewShown}
          sessionId={sessionId}
          stream={stream}
        />

        <div className="flex flex-col text-sm">
          <div className="flex h-8 items-center gap-5">
            <div
              className={clsx(
                "flex h-full items-center gap-8 rounded-md bg-neutral-800 px-3 py-1 text-sm text-neutral-500",
                sessionId && "text-current"
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

            {sessionId ? (
              <button
                className={clsx(
                  "h-full rounded-md bg-neutral-800 px-6 py-1",
                  isLocked && "bg-rose-500"
                )}
                onClick={isLocked ? unlock : lock}
              >
                <LockedIcon strokeWidth="1.5" className="stroke-current" />
              </button>
            ) : (
              <button
                className="h-full rounded-md bg-rose-500 px-3 py-1"
                onClick={start}
              >
                Start
              </button>
            )}

            <button
              onClick={() => setIsPreviewShown((state) => !state)}
              className="flex h-full items-center gap-3 rounded-md bg-neutral-800 px-3 py-1"
            >
              {isPreviewShown ? (
                <VisibleIcon className="stroke-current" />
              ) : (
                <HiddenIcon className="stroke-current" />
              )}
              <span>Preview</span>
            </button>
          </div>

          {/* <div className="flex flex-col gap-8">
            <div className="flex">
              <div className="flex items-center gap-4">
                <CameraIcon />
                <span>Video Source</span>
              </div>
              <AppSelect
                value={selectedDevicesIds.video}
                items={[
                  { label: "No Video", value: "" },
                  ...videoDevices.map(({ deviceId, label }) => ({
                    label,
                    value: deviceId,
                  })),
                ]}
                placeholder="Select Video"
                onValueChange={(id) => updateStream("video", id)}
              />
            </div>
            <div className="flex gap-8">
              <div className="flex items-center gap-4">
                <MicrophoneIcon />
                <span>Audio Source</span>
              </div>
              <AppSelect
                value={selectedDevicesIds.audio}
                items={[
                  { label: "No Audio", value: "" },
                  ...audioDevices.map(({ deviceId, label }) => ({
                    label,
                    value: deviceId,
                  })),
                ]}
                placeholder="Select Audio"
                onValueChange={(id) => updateStream("audio", id)}
              />
            </div>
          </div> */}
        </div>
      </main>
    </>
  );
}
