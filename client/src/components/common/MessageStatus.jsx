import React from "react";
import { BsCheck, BsCheckAll } from "react-icons/bs";

function MessageStatus({ status }) {
  return (
    <>
      {status === "sent" && <BsCheck className="text-lg" />}
      {status === "delivered" && <BsCheckAll className="text-lg" />}
      {status === "read" && <BsCheckAll className="text-lg text-pink-500" />}
    </>
  );
}

export default MessageStatus;