import React from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { calculateTime } from "@/utils/CalculateTime";
import MessageStatus from "../common/MessageStatus";
import { FaImage, FaMicrophone } from "react-icons/fa";

function ChatListItem({ data, isContactPage = false }) {
  const [{ userInfo }, dispatch] = useStateProvider();
  const handleContactClick = () => {
    if (!isContactPage) {
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT,
        user: {
          name: data?.name,
          about: data?.about,
          email: data?.email,
          profilePicture: data?.profilePicture,
          id:
            userInfo.id === data?.senderId ? data?.receiverId : data?.senderId,
        },
      });
    } else {
      dispatch({
        type: reducerCases.CHANGE_CURRENT_CHAT,
        user: { ...data },
      });
      dispatch({
        type: reducerCases.SET_CONTACTS_PAGE,
      });
    }
  };
  return (
    <div
      className={`flex cursor-pointer items-center hover:bg-[#171515]`}
      onClick={handleContactClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar type="lg" image={data?.profilePicture} />
      </div>
      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
        <div className="flex justify-between">
          <div>
            <span className="text-white">{data?.name}</span>
          </div>
          {!isContactPage && (
            <div>
              <span
                className={`${
                  !data.totalUnreadMessages > 0
                    ? "text-secondary"
                    : "text-icon-green"
                } text-xs`}
              >
                {calculateTime(data.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b border-conversation-border pb-2 pt-1 pr-2">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {isContactPage ? (
                data?.about || "\u00A0"
              ) : (
                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[300px]">
                  {data.senderId === userInfo.id && (
                    <MessageStatus status={data.messageStatus} />
                  )}
                  {data.type === "text" && (
                    <span className="truncate">{data.message}</span>
                  )}
                  {data.type === "audio" && (
                    <span className="flex gap-1 items-center">
                      <FaMicrophone className="text-panel-header-icon" />
                      Audio
                    </span>
                  )}
                  {data.type === "image" && (
                    <span className="flex gap-1 items-center">
                      <FaImage className="text-panel-header-icon" />
                      Image
                    </span>
                  )}
                </div>
              )}
            </span>
            {data.totalUnreadMessages > 0 && (
              <span className="bg-icon-green px-[6px] rounded-full text-sm">
                {data.totalUnreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
