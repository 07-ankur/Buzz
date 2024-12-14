import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

function CaptureAudio({ hide }) {
  const [{ userInfo, currentChat, socket }, dispatch] = useStateProvider();

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlayback, setCurrentPlayback] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setRenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurferInstance = useRef(null);

  // Recording duration timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          setTotalDuration(prev + 1);
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Initialize WaveSurfer
  useEffect(() => {
    if (waveformRef.current && !wavesurferInstance.current) {
      wavesurferInstance.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ccc",
        progressColor: "#4a9eff",
        cursorColor: "#ccc",
        barWidth: 2,
        height: 30,
        responsive: true,
        fillParent: true,
        normalize: true,
      });

      wavesurferInstance.current.on("finish", () => {
        setIsPlaying(false);
      });

      return () => {
        if (wavesurferInstance.current) {
          wavesurferInstance.current.destroy();
        }
      };
    }
  }, []);

  // Start recording when WaveSurfer is ready
  useEffect(() => {
    if (wavesurferInstance.current) handleStartRecording();
  }, [wavesurferInstance.current]);

  // Start recording
  const handleStartRecording = () => {
    setRecordingDuration(0);
    setTotalDuration(0);
    setCurrentPlayback(0);
    setIsRecording(true);
    setRecordedAudio(null);
    
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);

          // Load waveform
          if (wavesurferInstance.current) {
            wavesurferInstance.current.load(audioURL);
          }
        };

        mediaRecorder.start();
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (wavesurferInstance.current) {
        wavesurferInstance.current.stop();
      }

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });
        setRenderedAudio(audioFile);
      });
    }
  };

  // Track audio playback time
  useEffect(() => {
    if (recordedAudio) {
      const timeUpdateHandler = () => {
        setCurrentPlayback(recordedAudio.currentTime);
      };

      recordedAudio.addEventListener("timeupdate", timeUpdateHandler);
      
      return () => {
        recordedAudio.removeEventListener("timeupdate", timeUpdateHandler);
      };
    }
  }, [recordedAudio]);

  // Play recording
  const handlePlayRecording = () => {
    if (recordedAudio && wavesurferInstance.current) {
      wavesurferInstance.current.play();
      recordedAudio.play();
      setIsPlaying(true);
    }
  };

  // Pause recording
  const handlePauseRecording = () => {
    if (wavesurferInstance.current) {
      wavesurferInstance.current.pause();
    }
    if (recordedAudio) {
      recordedAudio.pause();
    }
    setIsPlaying(false);
  };

  // Send recording
  const sendRecording = async () => {
    try {
      // Validate inputs
      if (!renderedAudio) {
        console.error("No audio file to send");
        return;
      }
      if (!currentChat?.id || !userInfo?.id) {
        console.error("Missing chat or user ID");
        return;
      }

      const formData = new FormData();
      formData.append("audio", renderedAudio, "recording.webm");
      
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          to: currentChat.id,
          from: userInfo.id,
        },
      });

      if (response.status === 201) {
        // Emit socket event
        socket.current.emit("send-msg", {
          to: currentChat.id,
          from: userInfo.id,
          message: response.data.message,
        });

        // Dispatch action to add message
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: response.data.message,
          fromSelf: true,
        });

        // Hide the audio capture component
        hide();
      }
    } catch (error) {
      console.error("Error sending audio message:", error.response ? error.response.data : error.message);
      
      // Optional: Add user-friendly error handling
      if (error.response) {
        alert(`Failed to send audio message: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        alert("No response received from server. Please check your connection.");
      } else {
        alert("Error preparing audio message. Please try again.");
      }
    }
  };

  // Format time helper
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="p-3 hover:bg-red-950 rounded-full">
        <FaTrash className="text-white cursor-pointer" onClick={() => hide()} />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 items-center justify-center bg-[#303030] rounded-full drop-shadow-xl">
        {isRecording ? (
          <div className="text-red-500 animate-pulse w-60 text-center">
            Recording...
            <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveformRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlayback)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4">
        {!isRecording ? (
          <FaMicrophone
            className="text-red-500"
            onClick={handleStartRecording}
          />
        ) : (
          <FaPauseCircle
            className="text-red-500"
            onClick={handleStopRecording}
          />
        )}
      </div>
      <div>
        <MdSend
          className="text-white text-[26px] cursor-pointer mr-4"
          title="Send"
          onClick={sendRecording}
        />
      </div>
    </div>
  );
}

export default CaptureAudio;