import * as Select from "@radix-ui/react-select";
import clsx from "clsx";
import Head from "next/head";
import { useEffect, useRef } from "react";
import useDeviceMediaStream from "../hooks/useDeviceMediaStream";
import useStreamerSession from "../hooks/useStreamerSession";

interface SelectProps {
  value: string;
  placeholder: string;
  items: Array<{ label: string; value: string }>;
  onValueChange: (value: string) => void;
}

const AppSelect = ({
  value,
  items,
  placeholder,
  onValueChange,
}: SelectProps) => {
  return (
    <Select.Root onValueChange={onValueChange} value={value}>
      <Select.Trigger
        className="flex items-center justify-center gap-4 overflow-hidden rounded-md bg-neutral-800 px-4 py-1 text-sm"
        aria-label="Video Device"
      >
        <span className="truncate">
          <Select.Value placeholder={placeholder} />
        </span>
        <Select.Icon></Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content>
          <Select.Viewport className="rounded-md bg-neutral-800 p-2 text-sm shadow-lg">
            <Select.Group>
              {items.map(({ value, label }) => (
                <Select.Item
                  key={value}
                  value={value}
                  className="cursor-default rounded-md px-2 py-1 outline-none radix-highlighted:bg-neutral-700"
                >
                  <Select.ItemText>{label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default function Create() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const {
    videoDevices,
    audioDevices,
    selectedDevicesIds,
    updateStream,
    stream,
  } = useDeviceMediaStream();

  const { sessionId, viewers, start, lock, unlock } =
    useStreamerSession(stream);

  console.log({ viewers, sessionId });

  useEffect(() => {
    if (!videoRef.current) return;

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

      <main className="flex min-h-screen flex-wrap items-center justify-center gap-24 bg-neutral-900">
        <div className={clsx("w-[500px]", "bg-neutral-800")}>
          <video
            className="h-full w-full"
            ref={videoRef}
            autoPlay
            controls
            muted
          />
        </div>

        <div className="flex w-96 flex-col gap-7 whitespace-nowrap  text-sm">
          <p>sesh: {sessionId}</p>
          <p>viewers: {viewers}</p>
          <button onClick={start}>start</button>
          <button onClick={lock}>lock</button>
          <button onClick={unlock}>unlock</button>
          <div className="flex gap-8">
            <div className="flex items-center gap-4">
              ico
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
              ico
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
        </div>
      </main>
    </>
  );
}
