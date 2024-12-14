import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import Avatar from "../common/Avatar";
import { FaPlay, FaStop } from "react-icons/fa";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";

function VoiceMessage({ message }) {
  const [{ userInfo, currentChat }, dispatch] = useStateProvider();
  const [audioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayback, setCurrentPlayback] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const waveformRef = useRef(null);
  const wavesurferInstance = useRef(null);

  useEffect(() => {
    if (waveformRef.current && !wavesurferInstance.current) {
      wavesurferInstance.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ccc",
        progressColor: "#2dedb3",
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

  useEffect(() => {
    if (message.message && wavesurferInstance.current) {
      const audioURL = `${message.message}`;
      
      const audio = new Audio(audioURL);
      setAudioMessage(audio);

      wavesurferInstance.current.load(audioURL);

      wavesurferInstance.current.on("ready", () => {
        const duration = wavesurferInstance.current.getDuration();
        setTotalDuration(duration);
      });

      wavesurferInstance.current.on("error", (error) => {
        console.error("Wavesurfer error:", error);
      });
    }
  }, [message.message]);

  useEffect(() => {
    if (audioMessage) {
      const timeUpdateHandler = () => {
        setCurrentPlayback(audioMessage.currentTime);
      };

      audioMessage.addEventListener("timeupdate", timeUpdateHandler);
      
      return () => {
        audioMessage.removeEventListener("timeupdate", timeUpdateHandler);
      };
    }
  }, [audioMessage]);

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time - minutes * 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayAudio = () => {
    if (audioMessage && wavesurferInstance.current) {
      wavesurferInstance.current.play();
      audioMessage.play();
      setIsPlaying(true);
    }
  };

  const handlePauseAudio = () => {
    if (audioMessage && wavesurferInstance.current) {
      wavesurferInstance.current.pause();
      audioMessage.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-5 text-white px-4 pr-2 py-4 text-sm rounded-lg ${
        message.senderId !== currentChat.id
          ? "bg-[#0078d4] rounded-br-none"
          : "bg-[#3b3b3b] rounded-bl-none"
      }`}
    >
      <div>
        <Avatar
          type="lg"
          image={
            message.senderId === userInfo?.id
              ? userInfo.profileImage
              : currentChat.profilePicture
          }
        />
      </div>
      <div className="cursor-pointer text-xl">
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} />
        ) : (
          <FaStop onClick={handlePauseAudio} />
        )}
      </div>
      <div className="relative w-60">
        <div className="w-full" ref={waveformRef} />
        <div className="text-white text-[11px] pt-1 flex justify-between absolute bottom-[-22px] w-full">
          <span>{formatTime(isPlaying ? currentPlayback : totalDuration)}</span>
          <div className="flex gap-1">
            <span>{calculateTime(message.createdAt)}</span>
            {message.senderId === userInfo?.id && (
              <MessageStatus status={message.messageStatus} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoiceMessage;