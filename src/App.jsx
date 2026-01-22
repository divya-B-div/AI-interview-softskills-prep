import { useState, useRef } from "react";

function App() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>AI Interview App — Microphone Test</h1>
      {!recording && <button onClick={startRecording}>Start Recording</button>}
      {recording && <button onClick={stopRecording}>Stop Recording</button>}
      {audioURL && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Playback:</h3>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
}

export default App;
