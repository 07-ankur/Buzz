import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import ChatListItem from "./ChatListItem";

function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState([]);
  const [{}, dispatch] = useStateProvider();

  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};
      Object.keys(contacts).forEach((key) => {
        const filter = contacts[key].filter((obj) =>
          obj.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filter.length) filteredData[key] = filter;
      });
      setSearchContacts(filteredData);
    } else {
      setSearchContacts(contacts);
    }
  }, [searchTerm]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data } = await axios.get(GET_CONTACTS_ROUTE);
        setContacts(data.data);
        setSearchContacts(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getContacts();
  }, []);
  return (
    <div className="h-full flex flex-col">
      <div className="h-16 flex items-end px-3 py-5">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack
            className="text-2xl cursor-pointer"
            onClick={() => dispatch({ type: reducerCases.SET_CONTACTS_PAGE })}
          />
          <span>New Chat</span>
        </div>
      </div>

      <div className="bg-[#202020] pb-10 h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 mx-4 h-14">
          <div className="bg-[#3f3f3f] flex items-center gap-5 px-3 py-1.5 rounded-lg flex-grow">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon text-lg cursor-pointer" />
            </div>
            <div>
              <input
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent text-sm focus:outline-none w-full text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (
            userList.length && (
              <div key={Date.now() + initialLetter}>
                <div className="text-teal-light pl-10 pt-5 pb-2">
                  {initialLetter}
                </div>
                {userList.map((user) => {
                  return (
                    <ChatListItem
                      data={user}
                      isContactPage={true}
                      key={user.id}
                    />
                  );
                })}
              </div>
            )
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;