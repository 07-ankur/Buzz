import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import React, { useEffect, useRef } from "react";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";
import dynamic from "next/dynamic";
const VoiceMessage = dynamic(() => import("./VoiceMessage"), {
  ssr: false,
});

function ChatContainer() {
  const [{ messages, userInfo }] = useStateProvider();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-[#2d2d2d] bg-transparent bg-fixed h-full w-full fixed left-0 top-0 z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === userInfo?.id
                    ? "justify-end"
                    : "justify-start"
                } gap-1`}
              >
                {message.type === "text" && (
                  <div
                    className={`flex text-white px-2.5 py-[6px] text-sm rounded-lg items-center max-w-[45%] ${
                      message.senderId === userInfo?.id
                        ? "bg-[#0078d4] rounded-br-none"
                        : "bg-[#3b3b3b] rounded-bl-none"
                    } gap-2`}
                  >
                    <span className="break-all">{message.message}</span>
                    <div className="flex gap-1 items-end">
                      <span className="text-white text-[9px] pt-1 min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      <span>
                        {message.senderId === userInfo?.id && (
                          <MessageStatus status={message.messageStatus} />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {message.type === "image" && <ImageMessage message={message} />}
                {message.type === "audio" && <VoiceMessage message={message} />}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
