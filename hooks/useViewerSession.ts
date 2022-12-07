import { useState, useEffect } from "react";
import { io } from "socket.io-client";

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

    const URL = "http://localhost:8080";
    const socket = io(URL);

    const peerConnection = new RTCPeerConnection(peerConnectionConfig);

    socket.on("peer", async ({ type, from, data }) => {
      if (type === "offer") {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data)
        );
        const description = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(description);

        peerConnection.onicecandidate = (ev) => {
          if (!ev.candidate) return;
          socket.emit("peer", { type: "ice", to: id, data: ev.candidate });
        };

        socket.emit("peer", { type: "answer", to: id, data: description });
      } else if (type === "ice") {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });

    peerConnection.ontrack = (ev) => {
      setStream(ev.streams[0]);
    };

    socket.emit("peer", { type: "new", to: id, data: null });

    return () => {
      peerConnection.close();
      socket.close();
    };
  }, [id]);

  return stream;
};

export default useViewerSession;
