import Image from 'next/image'
import Link from 'next/link';
import React,{useContext} from "react";
import { Carousel } from "antd";
import { UserContext } from "@/context/UserContext";



export default function Home() {
  const contentStyle: React.CSSProperties = {
    height: "30px",
    color: "#000",
    lineHeight: "160px",
    textAlign: "center",
    position: "absolute",
    bottom: "0",
    width: "100%",
    background: "gray",
    opacity: "0.15",
    
  };
  const { ready } = useContext(UserContext);
  if (!ready) {
    return <div id="preloader" />;
  }

  return (
    <>
      <Carousel autoplay className="border">
        <div className="">
          <Image
            src="/images/banner/1.jpg"
            alt="Picture of the author"
            width={500}
            height={500}
            className="border w-full object-cover xl:h-[500px] sm:h-96 h-48"
          />
          <h3 style={contentStyle}></h3>
        </div>
        <div>
          <Image
            src="/images/banner/2.webp"
            alt="Picture of the author"
            width={500}
            height={500}
            className="border w-full object-cover xl:h-[500px] sm:h-96 h-48"
          />
          <h3 style={contentStyle}></h3>
        </div>
        <div>
          <Image
            src="/images/banner/3.jpeg"
            alt="Picture of the author"
            width={500}
            height={500}
            className="border w-full object-cover xl:h-[500px] sm:h-96 h-48"
          />
          <div>
            <h3 style={contentStyle}></h3>
          </div>
        </div>
      </Carousel>
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex flex-col items-center justify-center mt-4">
          <h1 className="text-2xl font-bold">Welcome to my website</h1>
          <h2 className="text-xl font-bold">Let&apos;s Begin the Search</h2>
        </div>
        <div className="flex flex-col items-center justify-center mt-4">
          <Link href="/dashboard" legacyBehavior>
            <a className="border border-black rounded-md px-4 py-2">
              Go to dashboard
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
