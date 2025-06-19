import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoCall = () => {
  const { appointmentId } = useParams();
  const [callActive, setCallActive] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(new RTCPeerConnection(configuration));
  const localStream = useRef();
  const remoteStream = useRef(new MediaStream());
if (!appointmentId) {
  return <div style={{ padding: 20 }}>Invalid or missing appointment ID.</div>;
}

  useEffect(() => {
    const startCall = async () => {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStream.current.getTracks().forEach((track) => {
        pc.current.addTrack(track, localStream.current);
      });

      pc.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.current.addTrack(track);
        });
      };

      localVideoRef.current.srcObject = localStream.current;
      remoteVideoRef.current.srcObject = remoteStream.current;

      const callRef = doc(db, "calls", appointmentId);
      const offerCandidates = collection(callRef, "offerCandidates");
      const answerCandidates = collection(callRef, "answerCandidates");

      pc.current.onicecandidate = async (event) => {
        if (event.candidate) {
          await addDoc(offerCandidates, event.candidate.toJSON());
        }
      };

      // Create offer
      const offerDescription = await pc.current.createOffer();
      await pc.current.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await setDoc(callRef, { offer });

      onSnapshot(callRef, async (snapshot) => {
        const data = snapshot.data();
        if (!pc.current.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          await pc.current.setRemoteDescription(answerDescription);
        }
      });

      onSnapshot(answerCandidates, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.current.addIceCandidate(candidate);
          }
        });
      });

      setCallActive(true);
    };

    startCall();

    return () => {
      localStream.current?.getTracks().forEach((track) => track.stop());
      remoteStream.current?.getTracks().forEach((track) => track.stop());
    };
  }, [appointmentId]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Video Call - Room: {appointmentId}</h2>
      <div style={{ display: "flex", gap: "1rem" }}>
        <video ref={localVideoRef} autoPlay muted playsInline width="50%" />
        <video ref={remoteVideoRef} autoPlay playsInline width="50%" />
      </div>
      {!callActive && <p>Setting up the call...</p>}
    </div>
  );
};

export default VideoCall;
