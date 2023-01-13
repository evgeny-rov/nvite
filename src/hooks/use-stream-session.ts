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
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [socket, setSocket] = useState<Socket>();
  const [viewers, setViewers] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const peers = useRef<Map<string, RTCPeerConnection>>(new Map());

  const start = () => {
    socket && socket.connect();
    setIsConnecting(true);
  };
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
        socket.emit("direct", { type: "offer", to: from, data: description });

        stream
          ?.getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream));

        peerConnection.onicecandidate = (ev) => {
          if (!ev.candidate) return;
          socket.emit("direct", { type: "ice", to: from, data: ev.candidate });
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
          socket.emit("direct", { type: "offer", to: from, data: description });
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
    const URL = "https://io-relay.onrender.com";
    const socket = io(URL, { autoConnect: false });

    setSocket(socket);

    socket.on("session", ({ userId, token }) => {
      socket.auth = { sessionToken: token };
      setIsConnecting(false);
      setSessionId(userId);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("direct", handlePeerMessage);

    return () => {
      socket.removeAllListeners("direct");
    };
  }, [handlePeerMessage, socket]);

  useEffect(() => {
    if (!stream) return;

    peers.current.forEach((pc) => {
      pc.getSenders().forEach((sender) => pc.removeTrack(sender));
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    });
  }, [stream]);

  return { sessionId, isLocked, isConnecting, viewers, start, lock, unlock };
};

export default useStreamerSession;
