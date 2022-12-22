import MicrophoneIcon from "../assets/microphone.svg";
import CameraIcon from "../assets/camera.svg";
import Select from "./select";

interface Props {
  devices: MediaDeviceInfo[];
  selectedDevicesIds: { video: string; audio: string };
  changeDevice: (type: "video" | "audio", id: string) => void;
}

export default function UserDevices({
  devices,
  selectedDevicesIds,
  changeDevice,
}: Props) {
  const videoDevices = devices.filter((device) => device.kind === "videoinput");
  const audioDevices = devices.filter((device) => device.kind === "audioinput");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between gap-10">
        <div className="flex items-center gap-4">
          <CameraIcon className="ml-1" />
          <span>Video Source</span>
        </div>
        <Select
          title="Video Device"
          value={selectedDevicesIds.video}
          items={[
            { label: "No Video", value: "" },
            ...videoDevices.map(({ deviceId, label }) => ({
              label,
              value: deviceId,
            })),
          ]}
          placeholder="Select Video"
          onValueChange={(id) => changeDevice("video", id)}
        />
      </div>
      <div className="flex justify-between gap-10">
        <div className="flex items-center gap-4">
          <MicrophoneIcon className="ml-1" />
          <span>Audio Source</span>
        </div>
        <Select
          title="Audio Device"
          value={selectedDevicesIds.audio}
          items={[
            { label: "No Audio", value: "" },
            ...audioDevices.map(({ deviceId, label }) => ({
              label,
              value: deviceId,
            })),
          ]}
          placeholder="Select Audio"
          onValueChange={(id) => changeDevice("audio", id)}
        />
      </div>
    </div>
  );
}
