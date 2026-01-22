import { useRef, useState } from "react";

function App() {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      setStatus("Uploading audio...");

      try {
        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        setStatus(data.message);
      } catch (error) {
        console.error(error);
        setStatus("Upload failed");
      }
    };

    mediaRecorderRef.current.start();
    setRecording(true);
    setStatus("Recording...");
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Audio Recorder</h1>

      {!recording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      <p>{status}</p>
    </div>
  );
}

export default App;
