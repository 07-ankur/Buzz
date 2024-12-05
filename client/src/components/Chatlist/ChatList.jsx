import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import ChatListHeader from "./ChatListHeader";
import List from "./List";
import { useStateProvider } from "@/context/StateContext";
import ContactsList from "./ContactsList";

function ChatList() {
  const [{ contactsPage }] = useStateProvider();
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contactsPage) {
      setPageType("contacts");
    } else {
      setPageType("default");
    }
  }, [contactsPage]);
  return (
    <div className="bg-[#202020] flex flex-col max-h-screen z-20">
      {pageType === "default" ? (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      ) : (
        <>
          <ContactsList />
        </>
      )}
    </div>
  );
}

export default ChatList;
