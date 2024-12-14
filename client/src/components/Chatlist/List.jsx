import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ChatListItem from "./ChatListItem";

function Loading() {
  return (
    <div
      role="status"
      className="max-w-md p-4 space-y-4 divide-y rounded shadow animate-pulse divide-gray-700 md:p-6 border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-shrink-0">
            <span className="w-12 h-12 block rounded-full bg-gray-700"></span>
          </div>
          <div>
            <div className="h-2.5 rounded-full bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 rounded-full bg-gray-700"></div>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-shrink-0">
            <span className="w-12 h-12 block rounded-full bg-gray-700"></span>
          </div>
          <div>
            <div className="h-2.5 rounded-full bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 rounded-full bg-gray-700"></div>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-shrink-0">
            <span className="w-12 h-12 block rounded-full bg-gray-700"></span>
          </div>
          <div>
            <div className="h-2.5 rounded-full bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 rounded-full bg-gray-700"></div>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-shrink-0">
            <span className="w-12 h-12 block rounded-full bg-gray-700"></span>
          </div>
          <div>
            <div className="h-2.5 rounded-full bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 rounded-full bg-gray-700"></div>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-700 w-12"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-shrink-0">
            <span className="w-12 h-12 block rounded-full bg-gray-700"></span>
          </div>
          <div>
            <div className="h-2.5 rounded-full bg-gray-600 w-24 mb-2.5"></div>
            <div className="w-32 h-2 rounded-full bg-gray-700"></div>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-700 w-12"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

function List() {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] =
    useStateProvider();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getContacts = async () => {
      try {
        setIsLoading(true);
        const {
          data: { users, onlineUsers },
        } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
        setIsLoading(false);
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
        dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
      } catch (error) {
        console.log(error);
      }
    };
    if (userInfo?.id) getContacts();
  }, [userInfo]);

  return (
    <div className="bg-[#202020] flex-auto overflow-auto max-h-full custom-scrollbar">
      {isLoading ? (
        <Loading />
      ) : filteredContacts.length > 0 ? (
        filteredContacts.map((contact) => (
          <ChatLIstItem data={contact} key={contact.id} />
        ))
      ) : (
        userContacts.map((contact) => (
          <ChatLIstItem data={contact} key={contact.id} />
        ))
      )}
    </div>
  );
}

export default List;
