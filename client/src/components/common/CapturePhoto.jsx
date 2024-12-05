import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

function CapturePhoto({ setImage, hide }) {
  const videoRef = useRef(null);

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    };
    startCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  },[]);

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, 300, 150);
    setImage(canvas.toDataURL("image/jpeg"));
    hide(false);
  };

  return (
    <div className="absolute h-[90%] w-1/2 top-[5%] left-[25%] bg-gray-900 gap-3 rounded-lg pt-2 flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full">
        <div
          className="pt-2 pe-2 -mb-6 cursor-pointer flex items-center justify-center"
          onClick={() => hide(false)}
        >
          <IoClose className="h-10 w-10" />
        </div>
        <div className="flex justify-center">
          <video id="video" width="500" autoPlay ref={videoRef} className="rounded-lg"></video>
        </div>
        <button className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2 mb-4 mx-auto" onClick={capturePhoto} />
      </div>
    </div>
  );
}

export default CapturePhoto;  