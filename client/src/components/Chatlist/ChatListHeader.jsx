import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { useStateProvider } from "@/context/StateContext";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";
import ContextMenu from "../common/ContextMenu";

function ChatListHeader() {
  const [{userInfo}, dispatch] = useStateProvider();
  const router = useRouter();
  const [contextCoordinates, setContextCoordinates] = useState({ x: 0, y: 0 });
  const [contextVisible, setContextVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextCoordinates({ x: e.pageX, y: e.pageY });
    setContextVisible(true);
  };

  const contextMenuOptions = [
    {
      name: "Logout",
      callback: async () => {
        setContextVisible(false);
        router.push("/logout");
      },
    },
  ];

  const handleContactsPage = () => {
    dispatch({
      type: reducerCases.SET_CONTACTS_PAGE,
    });
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type="sm" image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          title="New Chat"
          className="text-panel-header-icon text-xl cursor-pointer"
          onClick={handleContactsPage}
        />
        <>
          <BsThreeDotsVertical
            onClick={showContextMenu}
            id="context-opener"
            title="Menu"
            className="text-panel-header-icon text-xl cursor-pointer"
          />
          {contextVisible && (
            <ContextMenu
              options={contextMenuOptions}
              coordinates={contextCoordinates}
              contextMenu={contextVisible}
              setContextMenu={setContextVisible}
            />
          )}
        </>
      </div>
    </div>
  );
}

export default ChatListHeader;