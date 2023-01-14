export interface IRTCPeerConnection extends RTCPeerConnection {
  isMakingOffer: boolean;
  isIgnoringOffer: boolean;
  isSettingRemoteAnswerPending: boolean;
  isPolite: boolean;
  takeCandidate: (candidate: RTCIceCandidate) => Promise<void>;
  takeDescription: (description: RTCSessionDescription) => Promise<void>;
  negotiate: () => Promise<void>;
}

interface AppRTCConnectionParams {
  isPolite: boolean;
  onDescriptionPrepared: (description: RTCSessionDescription | null) => void;
  onCandidatePrepared: (candidate: RTCIceCandidate | null) => void;
  config: RTCConfiguration;
}

export default function createAppRTCPeerConnection(
  params: AppRTCConnectionParams
): IRTCPeerConnection {
  const pc = new RTCPeerConnection(params.config) as IRTCPeerConnection;

  pc.isPolite = params.isPolite;
  pc.isMakingOffer = false;
  pc.isIgnoringOffer = false;
  pc.isSettingRemoteAnswerPending = false;

  const negotiate = async () => {
    try {
      pc.isMakingOffer = true;
      await pc.setLocalDescription();
      params.onDescriptionPrepared(pc.localDescription);
    } catch (err) {
      console.error(err);
    } finally {
      pc.isMakingOffer = false;
    }
  };

  pc.onnegotiationneeded = () => {
    negotiate();
  };

  pc.onicecandidate = ({ candidate }) => params.onCandidatePrepared(candidate);

  pc.takeCandidate = async (candidate: RTCIceCandidate) =>
    await pc.addIceCandidate(candidate);

  pc.takeDescription = async (description: RTCSessionDescription) => {
    const isReadyForOffer =
      !pc.isMakingOffer &&
      (pc.signalingState === "stable" || pc.isSettingRemoteAnswerPending);

    const offerCollision = description.type === "offer" && !isReadyForOffer;
    if (offerCollision && !pc.isPolite) return;

    pc.isSettingRemoteAnswerPending = description.type === "answer";
    await pc.setRemoteDescription(description);
    pc.isSettingRemoteAnswerPending = false;

    if (description.type === "offer") {
      await pc.setLocalDescription();
      params.onDescriptionPrepared(pc.localDescription);
    }
  };

  pc.negotiate = negotiate;
  return pc;
}
