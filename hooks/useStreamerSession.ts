import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

const useStreamerSession = (stream: MediaStream | null) => {
  const [sessionId, setSessionId] = useState(null);
  const [numOfViewers, setNumviewers] = useState(0);
  const viewers = useRef<Map<string, RTCPeerConnection>>(new Map());

  useEffect(() => {
    if (!stream) return;

    viewers.current.forEach((pc) => {
      pc.getSenders().forEach((sender) => pc.removeTrack(sender));
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    });
  }, [stream]);

  useEffect(() => {
    if (!stream) return;

    const URL = "https://nvite-sig.onrender.com";
    const socket = io(URL);

    socket.on("peer", async ({ type, from, data }) => {
      if (type === "new") {
        const peerConnection = new RTCPeerConnection(peerConnectionConfig);
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));

        const description = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(description);

        viewers.current.set(from, peerConnection);

        setNumviewers((n) => n + 1);

        peerConnection.onconnectionstatechange = () => {
          const closeStates = ["disconnected", "failed"];
          if (closeStates.includes(peerConnection.connectionState)) {
            peerConnection.close();
            viewers.current.delete(from);
            setNumviewers((n) => n - 1);
          }
        };

        peerConnection.onicecandidate = (ev) => {
          if (!ev.candidate) return;
          socket.emit("peer", { type: "ice", to: from, data: ev.candidate });
        };

        socket.emit("peer", { type: "offer", to: from, data: description });
      } else if (type === "answer") {
        const peerConnection = viewers.current.get(from);
        if (!peerConnection) return;

        await peerConnection.setRemoteDescription(data);
      } else if (type === "ice") {
        const peerConnection = viewers.current.get(from);
        if (!peerConnection) return;
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });

    socket.on("host:promoted", ({ hostId }) => {
      setSessionId(hostId);
    });

    socket.emit("host");
  }, [stream]);

  return { sessionId, numOfViewers };
};

export default useStreamerSession;
