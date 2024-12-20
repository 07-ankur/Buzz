import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useStateProvider } from "@/context/StateContext";
import Input from "@/components/common/Input";
import Avatar from "@/components/common/Avatar";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";
import { useRouter } from "next/router";
import axios from "axios";

function onboarding() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");

  useEffect(() => {
    if (!newUser && !userInfo?.email) {
      router.push("/login");
    } else if (!newUser && userInfo?.email) {
      router.push("/");
    }
  }, [newUser, userInfo, router]);

  const onBoardClickHandler = async () => {
    if (validateDetails) {
      const email = userInfo.email;
      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          about,
          image,
        });
        if (data.status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              email,
              name,
              status: about,
              profileImage: image,
            },
          });
          router.push("/");
        } else {
          const {
            id,
            name,
            email,
            profilePicture: profileImage,
            status,
          } = data;

          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id,
              email,
              name,
              status,
              profileImage,
            },
          });
          router.push("/");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const validateDetails = () => {
    if (name.length < 3) {
      return false;
    }
    return true;
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-1">
        <Image src="/buzz_logo.png" alt="Buzz" height={250} width={250} />
        {/* <Lottie animationData={Buzz_anim} style={{ width: 200, height: 200 }}/> */}
        <span className="text-7xl">Buzz</span>
      </div>
      <h2 className="text-2xl">Create Your Profile</h2>
      <div className="flex gap-6 mt-2">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input name="Display Name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex item-center justify-center">
            <button
              onClick={onBoardClickHandler}
              className="flex items-center justify-center gap-5 bg-search-input-container-background p-3 shadow-lg rounded-lg"
            >
              <span className="text-white text-2xl"> Create profile</span>
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}

export default onboarding;
