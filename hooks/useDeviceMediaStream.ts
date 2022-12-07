import { useState, useEffect } from "react";

const useDeviceMediaStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support Media API");
      return;
    }

    const onChange = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          setStream(stream);
        })
        .catch((e) => alert(e.message));
    };

    navigator.mediaDevices.addEventListener("devicechange", onChange);
    onChange();

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", onChange);
    };
  }, []);

  return stream;
};

export default useDeviceMediaStream;
