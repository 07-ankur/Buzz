import React from "react";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import MessageBar from "./MessageBar";

function Chat() {
  return (
    <div className="border-[#FFFFFF] border-opacity-20 border-l w-full bg-[#0D0D0D] flex flex-col h-screen z-10">
      <ChatHeader />
      <ChatContainer />
      <MessageBar />
    </div>
  );
}

export default Chat;
