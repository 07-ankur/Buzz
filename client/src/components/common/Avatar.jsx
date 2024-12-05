import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);
  const [contextVisible, setContextVisible] = useState(false);
  const [contextCoordinates, setContextCoordinates] = useState({ x: 0, y: 0 });
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCapture, setShowCapture] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextCoordinates({ x: e.pageX, y: e.pageY });
    setContextVisible(true);
  };

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        },1000);
      }
    }
  },[grabPhoto]);

  const contextMenuOptions = [
    {name: "Take Photo", callback: () => {
      setShowCapture(true);
    }},
    {name: "Choose from Library", callback: () => {
      setShowLibrary(true);
    }},
    {name: "Upload Photo", callback: () => {
      setGrabPhoto(true);
    }},
    {name: "Remove Photo", callback: () => {
      setImage("/default_avatar.png");
    }},
  ];

  const photoPickerChange = async(e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = (event) => {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src);
    }, 100);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <div className="relative h-10 w-10">
            <Image src={image} alt="avatar" fill className="rounded-full"/>
          </div>
        )}
        {type === "lg" && (
          <div className="relative h-14 w-14">
            <Image src={image} alt="avatar" fill className="rounded-full"/>
          </div>
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0 mt-2"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`z-10 bg-photopicker-overlay-background h-36 w-36 absolute top-0 left-0 flex items-center justify-center rounded-full flex-col text-center gap-2 ${
                hover ? "visible" : "hidden"
              }`}
              id="context-opener"
              onClick={(e) => showContextMenu(e)}
            >
              <FaCamera
                onClick={(e) => showContextMenu(e)}
                className="text-2xl"
                id="context-opener"
              />
              <span onClick={(e) => showContextMenu(e)} id="context-opener">
                Change <br /> Profile Photo
              </span>
            </div>
            <div className="h-36 w-36 flex items-center justify-center">
              <Image src={image} alt="avatar" fill className="rounded-full" />
            </div>
          </div>
        )}
      </div>
      {contextVisible && (
        <ContextMenu
          options={contextMenuOptions}
          coordinates={contextCoordinates}
          contextMenu={contextVisible}
          setContextMenu={setContextVisible}
        />
      )}
      {grabPhoto && (
        <PhotoPicker onChange={photoPickerChange} />
      )}

      {showLibrary && (
        <PhotoLibrary setImage={setImage} hide={setShowLibrary} />
      )}

      {showCapture && (
        <CapturePhoto setImage={setImage} hide={setShowCapture} />
      )}
    </>
  );
}

export default Avatar;