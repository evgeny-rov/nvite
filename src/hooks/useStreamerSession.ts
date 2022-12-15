import { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

// screen wake lock?

const useStreamerSession = (stream: MediaStream | null) => {
  const [sessionId, setSessionId] = useState(null);
  const [socket, setSocket] = useState<Socket>();
  const [viewers, setViewers] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const peers = useRef<Map<string, RTCPeerConnection>>(new Map());

  const start = () => socket && socket.emit("host");
  const lock = () => setIsLocked(true);
  const unlock = () => setIsLocked(false);

  const handlePeerMessage = useCallback(
    async ({ type, from, data }: any) => {
      if (!socket) return;

      if (type === "new" && !isLocked) {
        const peerConnection = new RTCPeerConnection(peerConnectionConfig);

        const description = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(description);

        peers.current.set(from, peerConnection);
        setViewers((n) => n + 1);
        socket.emit("peer", { type: "offer", to: from, data: description });

        stream
          ?.getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));

        peerConnection.onicecandidate = (ev) => {
          if (!ev.candidate) return;
          socket.emit("peer", { type: "ice", to: from, data: ev.candidate });
        };

        peerConnection.onconnectionstatechange = () => {
          const closeStates = ["disconnected", "failed"];
          if (closeStates.includes(peerConnection.connectionState)) {
            peerConnection.close();
            peers.current.delete(from);
            setViewers((n) => n - 1);
          }
        };

        peerConnection.onnegotiationneeded = async (ev) => {
          const description = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(description);
          socket.emit("peer", { type: "offer", to: from, data: description });
        };
      } else if (type === "answer") {
        const peerConnection = peers.current.get(from);
        if (!peerConnection) return;

        await peerConnection.setRemoteDescription(data);
      } else if (type === "ice") {
        const peerConnection = peers.current.get(from);
        if (!peerConnection) return;
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    },
    [stream, isLocked, socket]
  );

  useEffect(() => {
    const URL = "https://nvite-sig.onrender.com";
    const socket = io(URL);
    setSocket(socket);

    socket.on("host:promoted", ({ hostId }) => setSessionId(hostId));

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("peer", handlePeerMessage);

    return () => {
      socket.removeAllListeners("peer");
    };
  }, [handlePeerMessage, socket]);

  useEffect(() => {
    if (!stream) return;

    peers.current.forEach((pc) => {
      pc.getSenders().forEach((sender) => pc.removeTrack(sender));
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    });
  }, [stream]);

  return { sessionId, viewers, start, lock, unlock };
};

export default useStreamerSession;
