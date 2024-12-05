import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";

function ChatHeader() {
  const [{ currentChat, onlineUsers }, dispatch] = useStateProvider();

  const [contextCoordinates, setContextCoordinates] = useState({ x: 0, y: 0 });
  const [contextVisible, setContextVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextCoordinates({ x: e.pageX - 50, y: e.pageY + 20 });
    setContextVisible(true);
  };

  const contextMenuOptions = [
    {
      name: "Exit",
      callback: async () => {
        setContextVisible(false);
        dispatch({ type: reducerCases.SET_EXIT_CHAT });
      },
    },
  ];

  const handleVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChat,
        type: "out-going",
        callType: "voice",
        roomId: Date.now(),
      },
    });
  };

  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChat,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      },
    });
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-[#202020] z-10">
      <div className="flex items-center justify-center gap-4">
        <Avatar type="sm" image={currentChat?.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChat?.name}</span>
          <span className="text-secondary text-sm">
            {onlineUsers.includes(currentChat.id) ? "Online" : "Offline"}
          </span>
        </div>
      </div>
      <div className="flex gap-6">
        <MdCall
          onClick={handleVoiceCall}
          className="text-blue-600 text-xl cursor-pointer"
        />
        <IoVideocam
          onClick={handleVideoCall}
          className="text-blue-600 text-xl cursor-pointer"
        />
        <BiSearchAlt2
          className="text-blue-600 text-xl cursor-pointer"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
        />
        <BsThreeDotsVertical
          onClick={(e) => showContextMenu(e)}
          id="context-opener"
          className="text-blue-600 text-xl cursor-pointer"
        />
        {contextVisible && (
          <ContextMenu
            options={contextMenuOptions}
            coordinates={contextCoordinates}
            contextMenu={contextVisible}
            setContextMenu={setContextVisible}
          />
        )}
      </div>
    </div>
  );
}

export default ChatHeader;