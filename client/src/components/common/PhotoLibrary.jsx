import Image from "next/image";
import React from "react";
import { IoClose } from "react-icons/io5";

function PhotoLibrary({ setImage, hide }) {
  const images = [
    "/avatars/Avatar1.jpg",
    "/avatars/Avatar2.jpg",
    "/avatars/Avatar3.jpg",
    "/avatars/Avatar4.jpg",
    "/avatars/Avatar5.jpg",
    "/avatars/Avatar6.jpg",
    "/avatars/Avatar7.jpg",
    "/avatars/Avatar8.jpg",
    "/avatars/9.png",
  ];

  return (
    <div className="fixed top-[10%] left-0 max-w-[100vw] max-h-[80vh] w-full h-[80%] flex justify-center items-center">
      <div className="bg-gray-900 gap-6 rounded-lg p-4">
        <div
          className="pt-2 pe-2 cursor-pointer flex items-end justify-end"
          onClick={() => hide(false)}
        >
          <IoClose className="h-10 w-10" />
        </div>
        <div className="grid grid-cols-3 justify-center items-center gap-6 p-10 w-full">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => {
                setImage(images[index]);
                hide(false);
              }}

            >
              <div className="h-24 w-24 cursor-pointer relative">
                <Image
                  style={{borderRadius:"50%"}}
                  src={image}
                  alt="avatar"
                  fill
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoLibrary;
