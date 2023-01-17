import { useState, useEffect } from "react";

const default_video_constraints: MediaTrackConstraints = {
  width: { ideal: 1920 },
  height: { ideal: 1080 },
  frameRate: { max: 30 },
};

const initial_stream =
  typeof window !== "undefined" &&
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { ...default_video_constraints, facingMode: "environment" },
  });

const enumerateDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const applicableDevices = devices.filter(
    ({ kind }) => kind === "videoinput" || kind === "audioinput"
  );

  return applicableDevices;
};

const useDeviceMediaStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevicesIds, setSelectedDevicesIds] = useState({
    video: "",
    audio: "",
  });

  const updateDevices = async (type: "video" | "audio", id: string) => {
    const newDevices = { ...selectedDevicesIds, [type]: id };
    setSelectedDevicesIds(newDevices);

    if (!id) {
      stream
        ?.getTracks()
        .find((track) => track.kind === type)
        ?.stop();
      return;
    }

    stream?.getTracks().forEach((track) => track.stop());

    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: newDevices.audio ? { deviceId: newDevices.audio } : false,
      video: newDevices.video
        ? { ...default_video_constraints, deviceId: newDevices.video }
        : false,
    });

    setStream(newStream);
  };

  useEffect(() => {
    const setInitialStream = async () => {
      if (!initial_stream) return;
      const stream = await initial_stream;

      const applicableDevices = await enumerateDevices();
      setDevices(applicableDevices);

      setSelectedDevicesIds(() => {
        const videoDeviceId =
          stream
            .getVideoTracks()
            .find((track) => track.readyState === "live")
            ?.getCapabilities().deviceId ?? "";

        const audioDeviceId =
          stream
            .getAudioTracks()
            .find((track) => track.readyState === "live")
            ?.getCapabilities().deviceId ?? "";

        return { video: videoDeviceId, audio: audioDeviceId };
      });

      setStream(stream);
    };

    setInitialStream();
  }, []);

  useEffect(() => {
    const onChange = async () => {
      const devices = await enumerateDevices();
      setDevices(devices);
    };

    navigator.mediaDevices.addEventListener("devicechange", onChange);

    return () =>
      navigator.mediaDevices.removeEventListener("devicechange", onChange);
  }, []);

  return {
    devices,
    selectedDevicesIds,
    updateDevices,
    stream,
  };
};

export default useDeviceMediaStream;
