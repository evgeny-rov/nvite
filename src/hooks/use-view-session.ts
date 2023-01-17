import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import createAppRTCPeerConnection from "../utils/create-app-rtc-peer-connection";

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

export default function useViewSession(id?: string) {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!id) return;

    const URL = "https://io-relay.onrender.com";
    const socket = io(URL);

    socket.on("session", ({ token }) => {
      socket.auth = { sessionToken: token };
    });

    const pc = createAppRTCPeerConnection({
      config: peerConnectionConfig,
      isPolite: true,
      onCandidatePrepared: (candidate) => {
        socket.emit("direct", {
          type: "candidate",
          to: id,
          data: candidate,
        });
      },
      onDescriptionPrepared: (description) => {
        socket.emit("direct", {
          type: "description",
          to: id,
          data: description,
        });
      },
    });

    socket.on("direct", ({ type, _, data }) => {
      if (type === "candidate")
        data && pc.takeCandidate(new RTCIceCandidate(data));
      if (type === "description")
        data && pc.takeDescription(new RTCSessionDescription(data));
    });

    pc.ontrack = (ev) => {
      setStream(ev.streams[0]);
    };

    pc.oniceconnectionstatechange = () => {
      const peerConnectionLostStates = ["disconnected", "failed"];

      const isNetworkConnectionLost =
        peerConnectionLostStates.includes(pc.iceConnectionState) &&
        !socket.connected;

      if (isNetworkConnectionLost) {
        socket.once("connect", () => {
          if (!peerConnectionLostStates.includes(pc.iceConnectionState)) return;
          pc.restartIce();
        });
      }
    };

    pc.negotiate();

    return () => {
      pc.close();
      socket.close();
    };
  }, [id]);

  return stream;
}
