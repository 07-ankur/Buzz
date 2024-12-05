import Image from "next/image";
import React from "react";

function Empty() {
  return (
    <div className="border-[#FFFFFF] border-opacity-20 border-l w-full bg-[#0D0D0D] flex flex-col justify-center items-center h-screen border-b-4 border-b-[#FFFFFF]">
      <Image src="/Buzz_logo.png" alt="whisper" width={300} height={300} />
    </div>
  );
}

export default Empty;
