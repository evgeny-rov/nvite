import { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import createAppRTCPeerConnection from "../utils/create-app-rtc-peer-connection";

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

export default function useStreamSession(stream: MediaStream | null) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [socket, setSocket] = useState<Socket>();
  const [viewers, setViewers] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const peers = useRef<
    Map<string, ReturnType<typeof createAppRTCPeerConnection>>
  >(new Map());

  const start = () => {
    socket && socket.connect();
    setIsConnecting(true);
  };
  const lock = () => setIsLocked(true);
  const unlock = () => setIsLocked(false);

  useEffect(() => {
    if (!stream) return;

    peers.current.forEach((pc) => {
      pc.getSenders().forEach((sender) => pc.removeTrack(sender));
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    });
  }, [stream]);

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

    socket.on("direct", ({ type, from, data }) => {
      let pc = peers.current.get(from);

      if (!pc && isLocked) return;

      if (!pc) {
        const newPc = createAppRTCPeerConnection({
          config: peerConnectionConfig,
          isPolite: false,
          onCandidatePrepared: (candidate) => {
            socket.emit("direct", {
              type: "candidate",
              to: from,
              data: candidate,
            });
          },
          onDescriptionPrepared: (description) => {
            socket.emit("direct", {
              type: "description",
              to: from,
              data: description,
            });
          },
        });

        newPc.oniceconnectionstatechange = () => {
          const connectedViewers = Array.from(peers.current.values()).filter(
            (pc) => pc.iceConnectionState === "connected"
          );

          setViewers(connectedViewers.length);
        };
        window.addEventListener("online", () => newPc.restartIce());
        peers.current.set(from, newPc);
        stream?.getTracks().forEach((track) => newPc.addTrack(track, stream));

        pc = newPc;
      }

      if (type === "candidate")
        data && pc.takeCandidate(new RTCIceCandidate(data));
      if (type === "description")
        data && pc.takeDescription(new RTCSessionDescription(data));
    });

    return () => {
      socket.removeAllListeners("direct");
    };
  }, [socket, stream, isLocked]);

  return { sessionId, isLocked, isConnecting, viewers, start, lock, unlock };
}
