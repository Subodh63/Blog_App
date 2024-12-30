import { RiBarChartHorizontalLine } from "react-icons/ri";
import { GoScreenFull } from "react-icons/go";
import { BiExitFullscreen } from "react-icons/bi";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  const [isFullscreen, setisFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setisFullscreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setisFullscreen(false);
        });
      }
    }
  };

  return (
    <>
      <header className="header flex flex-sb">
        <div className="logo flex gap-2">
          <h1>ADMIN</h1>
          <div className="headerham flex flex-center">
            <RiBarChartHorizontalLine />
          </div>
        </div>
        <div className="rightnav flex gap-2">
          <div onClick={toggleFullscreen}>
            {isFullscreen ? <BiExitFullscreen /> : <GoScreenFull />}
          </div>
          <div className="notification">
            <img src="/img/notification.png" alt="noti" />
          </div>
          <div className="profilenav">
            {session ? (
              <img width={10} height={50} src={session.user.image} alt="user" />
            ) : (
              <img width={10} height={50} src="/img/user.png" alt="user" />
            )}
          </div>
        </div>
      </header>
    </>
  );
}