import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiSearchAlt2 } from "react-icons/bi";
import { calculateTime } from "@/utils/CalculateTime";

function SearchMessages() {
  const [{currentChat, messages}, dispatch] = useStateProvider();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMessages, setSearchedMessages] = useState([]);

  useEffect(() => {
    if(searchTerm) {
      const filteredMessages = messages.filter(message => message.type==="text" && message?.message.toLowerCase().includes(searchTerm.toLowerCase()));
      setSearchedMessages(filteredMessages);
    } else {
      setSearchedMessages([]);
    }
  },[searchTerm]);

  return (
    <div className="border-[#FFFFFF] border-opacity-20 border-l-2 w-full bg-[#2d2d2d] flex flex-col z-10 max-h-screen">
      <div className="h-16 px-4 py-5 flex gap-10 items-center bg-[#202020] text-primary-strong">
        <IoClose
          className="cursor-pointer text-icon-lighter text-2xl"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGE_SEARCH })}
        />
        <span>Search Messages</span>
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex items-center flex-col w-full">
          <div className="flex px-5 items-center gap-3 h-14 w-full">
            <div className="bg-[#212121] flex items-center gap-5 px-3 py-2 rounded-lg flex-grow">
              <div>
                <BiSearchAlt2 className="text-panel-header-icon text-lg cursor-pointer" />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search Messages"
                  className="bg-transparent text-sm focus:outline-none w-full text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <span className="mt-10 text-secondary">
            {!searchTerm.length &&
              `Search for messages with ${currentChat?.name}`}
          </span>
        </div>
        <div className="flex justify-center h-full flex-col">
          {searchTerm.length > 0 && !searchedMessages.length && (
            <span className="text-secondary w-full flex justify-center">
              No messages found
            </span>
          )}
          <div className="flex flex-col h-full w-full">
            {searchedMessages.map((message) => (
              <div className="flex cursor-pointer flex-col justify-center hover:bg-[#3f3f3f] w-full px-5 border-b-[0.1px] border-[#FFFFFF] border-opacity-10 py-5">
                <div className="text-sm text-secondary">
                  {calculateTime(message.createdAt)}
                </div>
                <div className="text-icon-green">{message.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMessages;