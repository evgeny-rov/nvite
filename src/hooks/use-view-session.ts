import { useState, useEffect } from "react";
import { io } from "socket.io-client";

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

const useViewerSession = (id?: string) => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!id) return;

    // const URL = "https://io-relay.onrender.com";
    const URL = "http://localhost:8080";
    const socket = io(URL);

    socket.onAny((...args) => console.log(...args));
    socket.onAnyOutgoing((...args) => console.log(...args));

    socket.on("session", ({ token }) => {
      console.log(token);
      socket.auth = { sessionToken: token };
    });

    const pc = new RTCPeerConnection(
      peerConnectionConfig
    ) as IRTCPeerConnection;

    pc.isMakingOffer = false;
    pc.isIgnoringOffer = false;
    pc.isSettingRemoteAnswerPending = false;
    pc.isPolite = true;

    window.addEventListener("online", () => pc.restartIce());

    pc.ontrack = (ev) => {
      setStream(ev.streams[0]);
    };

    pc.onicecandidate = ({ candidate }) =>
      socket.emit("direct", {
        type: "candidate",
        to: id,
        data: candidate,
      });

    pc.onnegotiationneeded = async () => {
      try {
        pc.isMakingOffer = true;
        await pc.setLocalDescription();
        socket.emit("direct", {
          type: "description",
          to: id,
          data: pc.localDescription,
        });
      } catch (err) {
        console.error(err);
      } finally {
        pc.isMakingOffer = false;
      }
    };

    socket.on("direct", async ({ type, from, data }) => {
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
    });

    socket.emit("direct", { type: "new", to: id, data: null });

    return () => {
      pc.close();
      socket.close();
    };
  }, [id]);

  return stream;
};

export default useViewerSession;
