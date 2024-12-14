import { useStateProvider } from "@/context/StateContext";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React from "react";
import MessageStatus from "../common/MessageStatus";

function ImageMessage({ message }) {
  const [{ currentChat, userInfo }] = useStateProvider();
  return (
    <div
      className={`p-1 rounded-lg ${
        message.senderId !== currentChat.id
          ? "bg-[#0078d4] rounded-br-none"
          : "bg-[#3b3b3b] rounded-bl-none"
      }`}
    >
      <div className="relative">
        <Image
          src={message.message}
          className="rounded-lg"
          alt="asset"
          height={300}
          width={300}
        />
        <div className="absolute bottom-1 right-1 flex items-end gap-1">
          <span className="text-white text-[9px] pt-1 min-w-fit">
            {calculateTime(message.createdAt)}
          </span>
          <span className="text-white">
            {message.senderId === userInfo?.id && (
              <MessageStatus status={message.messageStatus} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ImageMessage;