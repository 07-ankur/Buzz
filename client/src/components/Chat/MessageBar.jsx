import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_IMAGE_MESSAGE_ROUTE, ADD_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import PhotoPicker from "../common/PhotoPicker";
import dynamic from "next/dynamic";
const CaptureAudio = dynamic(() => import("../common/CaptureAudio"), {
  ssr: false,
});

function MessageBar() {
  const [{ userInfo, currentChat, socket }, dispatch] = useStateProvider();
  const [message, setMessage] = useState("");
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [recorder, setRecorder] = useState(false);
  const [emojiPicker, setEmojiPicker] = useState(false);
  const emojiRef = useRef(null);

  const photoPickerChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(ADD_IMAGE_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          to: currentChat?.id,
          from: userInfo?.id,
        },
      });
      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChat?.id,
          from: userInfo?.id,
          message: response.data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [grabPhoto]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        event.target.id !== "emoji-open" &&
        emojiRef.current &&
        !emojiRef.current.contains(event.target)
      ) {
        setEmojiPicker(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleEmojiModal = () => {
    setEmojiPicker(!emojiPicker);
  };

  const handleEmojiClick = (emoji) => {
    setMessage(message + emoji.emoji);
  };

  const sendMessage = async () => {
    try {
      const { data } = await axios.post(ADD_MESSAGE_ROUTE, {
        to: currentChat?.id,
        from: userInfo?.id,
        message,
      });
      socket.current.emit("send-msg", {
        to: currentChat?.id,
        from: userInfo?.id,
        message: data.message,
      });
      dispatch({
        type: reducerCases.ADD_MESSAGE,
        newMessage: {
          ...data.message,
        },
        fromSelf: true,
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* <div className="w-[98%] mx-3 my-1 h-[1px] bg-[#FFFFFF] opacity-25" /> */}
      <div className="bg-[#202020] h-20 px-6 flex items-center gap-6 relative">
        {!recorder && (
          <>
            <div className="bg-[#3f3f3f] shadow-lg flex w-full items-center justify-center rounded-lg py-1 px-4">
              <div className="flex gap-6">
                <BsEmojiSmile
                  title="Emoji"
                  className="text-white text-opacity-60 text-xl cursor-pointer"
                  id="emoji-open"
                  onClick={handleEmojiModal}
                />
                {emojiPicker && (
                  <div
                    ref={emojiRef}
                    className="absolute bottom-20 left-1 z-40"
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
                  </div>
                )}
                <ImAttachment
                  title="Attach file"
                  className="text-white text-opacity-60 text-xl cursor-pointer"
                  onClick={() => setGrabPhoto(true)}
                />
              </div>
              <div className="w-full rounded-lg h-10 flex items-center">
                <input
                  type="text"
                  placeholder="Type a message"
                  className="bg-transparent text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <div className="flex w-10 items-center justify-center">
              <button className="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
                {message.length ? (
                  <MdSend
                    title="Send Message"
                    className="text-white text-[26px] cursor-pointer"
                    onClick={sendMessage}
                  />
                ) : (
                  <div className="bg-[#1A66FF] p-2.5 rounded-lg">
                    <FaMicrophone
                      title="Record"
                      className="text-white text-xl cursor-pointer"
                      onClick={() => setRecorder(true)}
                    />
                  </div>
                )}
              </button>
            </div>
          </>
        )}
        {grabPhoto && <PhotoPicker onChange={photoPickerChange} />}
        {recorder && <CaptureAudio hide={setRecorder} />}
      </div>
    </>
  );
}

export default MessageBar;