import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";

function SearchBar() {
  const [{ contactSearch }, dispatch] = useStateProvider();
  return (
    <div className="bg-[#202020] flex py-3 pl-5 items-center gap-3 h-14">
      <div className="bg-[#3f3f3f] flex items-center gap-2 px-3 py-2 rounded-lg flex-grow">
        <input
          type="text"
          placeholder="Search or start new chat"
          className="bg-transparent w-full text-sm focus:outline-none text-white"
          value={contactSearch}
          onChange={(e) =>
            dispatch({
              type: reducerCases.SET_CONTACT_SEARCH,
              contactSearch: e.target.value,
            })
          }
        />
        <BiSearchAlt2 className="text-panel-header-icon text-lg cursor-pointer" />
      </div>
      <div className="mr-3 p-1.5 cursor-pointer rounded-md hover:bg-[#3f3f3f]">
        <BsFilter className="text-panel-header-icon text-[22px]" />
      </div>
    </div>
  );
}

export default SearchBar;