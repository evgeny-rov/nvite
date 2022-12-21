import { useState, useEffect } from "react";

const getPermissions = async () => {
  return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
};

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

  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  const audioDevices = devices.filter((device) => device.kind === "audioinput");

  const createStream = async (devices: { video: string; audio: string }) => {
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: devices.video ? { deviceId: devices.video } : false,
      audio: devices.audio ? { deviceId: devices.audio } : false,
    });

    setStream(newStream);
  };

  const updateStream = async (type: "video" | "audio", id: string) => {
    stream?.getTracks().forEach((track) => track.stop());

    const newDevices = { ...selectedDevicesIds, [type]: id };
    setSelectedDevicesIds(newDevices);

    if (!newDevices.video && !newDevices.audio) {
      setStream(null);
      return;
    }

    createStream(newDevices);
  };

  useEffect(() => {
    const createInitialStream = async () => {
      await getPermissions();
      const applicableDevices = await enumerateDevices();

      setDevices(applicableDevices);

      const initialVideoDevice = applicableDevices.find(
        ({ kind }) => kind === "videoinput"
      );
      const initialAudioDevice = applicableDevices.find(
        ({ kind }) => kind === "audioinput"
      );

      if (initialVideoDevice || initialAudioDevice) {
        const selectedDevicesIds = {
          video: initialVideoDevice?.deviceId ?? "",
          audio: initialAudioDevice?.deviceId ?? "",
        };

        setSelectedDevicesIds(selectedDevicesIds);
        createStream(selectedDevicesIds);
      }
    };

    createInitialStream();
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
    videoDevices,
    audioDevices,
    selectedDevicesIds,
    updateStream,
    stream,
  };
};

export default useDeviceMediaStream;
