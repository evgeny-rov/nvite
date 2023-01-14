import { useState, useRef, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface IRTCPeerConnection extends RTCPeerConnection {
  isMakingOffer: boolean;
  isIgnoringOffer: boolean;
  isSettingRemoteAnswerPending: boolean;
  isPolite: boolean;
}

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
  const peers = useRef<Map<string, IRTCPeerConnection>>(new Map());

  const start = () => {
    socket && socket.connect();
    setIsConnecting(true);
  };
  const lock = () => setIsLocked(true);
  const unlock = () => setIsLocked(false);

  const handleNewPeerConnection = useCallback(
    (peerId: any, data: any) => {
      if (!socket) return;

      const pc = new RTCPeerConnection(
        peerConnectionConfig
      ) as IRTCPeerConnection;

      pc.isMakingOffer = false;
      pc.isIgnoringOffer = false;
      pc.isSettingRemoteAnswerPending = false;
      pc.isPolite = false;

      window.addEventListener("online", () => pc.restartIce());

      peers.current.set(peerId, pc);
      stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = ({ candidate }) =>
        socket.emit("direct", {
          type: "candidate",
          to: peerId,
          data: candidate,
        });

      pc.onnegotiationneeded = async () => {
        try {
          pc.isMakingOffer = true;
          await pc.setLocalDescription();
          socket.emit("direct", {
            type: "description",
            to: peerId,
            data: pc.localDescription,
          });
        } catch (err) {
          console.error(err);
        } finally {
          pc.isMakingOffer = false;
        }
      };
    },
    [socket, stream]
  );

  const handlePeerMessage = useCallback(
    async ({ type, from, data }: any) => {
      if (!socket) return;

      if (type === "new") {
        handleNewPeerConnection(from, data);
        return;
      }

      const pc = peers.current.get(from);
      if (!pc) return;

      if (type === "candidate" && data)
        await pc.addIceCandidate(new RTCIceCandidate(data));

      if (type === "description") {
        const isReadyForOffer =
          !pc.isMakingOffer &&
          (pc.signalingState === "stable" || pc.isSettingRemoteAnswerPending);

        const offerCollision = data.type === "offer" && !isReadyForOffer;
        if (offerCollision && !pc.isPolite) return;

        pc.isSettingRemoteAnswerPending = data.type === "answer";
        await pc.setRemoteDescription(data);
        pc.isSettingRemoteAnswerPending = false;

        if (data.type === "offer") {
          await pc.setLocalDescription();
          socket.emit("direct", {
            type: "description",
            to: from,
            data: pc.localDescription,
          });
        }
      }
    },
    [socket, handleNewPeerConnection]
  );

  useEffect(() => {
    // const URL = "https://io-relay.onrender.com";
    const URL = "http://localhost:8080";
    const socket = io(URL, { autoConnect: false });

    socket.onAny((...args) => console.log(...args));
    socket.onAnyOutgoing((...args) => console.log(...args));

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
