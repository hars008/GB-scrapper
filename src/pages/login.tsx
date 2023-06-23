import Link from "next/link";
import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import getGoogleOAuthUrl from "@/util/getGoogleUrl";
import generateBrowserFingerprint from "../util/GenerateFingerprint";
import ReCAPTCHA from "react-google-recaptcha";
import { message } from "antd";
import Image from "next/image";

const LoginSign = () => {
  const router = useRouter();
  const [email, setEmail] = useState("harshbansal699@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [loading, setLoading] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const { setUser, setReady, setToken, ready } =
    useContext(UserContext);
  const reRef = useRef<ReCAPTCHA>(null);
  // const reRef = createRef<ReCAPTCHA>();
  // const recaptchaRef = createRef<ReCAPTCHA>();
  const [messageApi, contextHolder] = message.useMessage();

  async function loginUser(e: any) {
    e.preventDefault();
    setLoading(true);
    const captchatoken = await reRef.current?.getValue();
    if(!captchatoken){
      message.error("Please verify captcha");
      setLoading(false);
      return;
    }
    reRef.current?.reset();
    try {
      let fingerPrint = "";
      await generateBrowserFingerprint()
        .then((result) => {
          fingerPrint = result;
        })
        .catch((error) => {
          console.error("Error:Genertating FingerPrint ", error);
        });
      const { data } = await axios.post(
        "/authentication/login",
        {
          user: email,
          password: password,
          fingerPrint: fingerPrint,
          captchaToken: captchatoken,
        },
        { withCredentials: true }
      );
      setUser(data.userDoc);
      setToken(data.accessToken);
      setReady(true);
      message.success("Login Successfull");
      router.push("/");
    } catch (e) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading || !ready) return <div id="preloader" />;

  return (
    <>
      {contextHolder}
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold">Welcome Back!!</h1>
        <p className="text-gray-500">Login to your Account</p>

        <form
          className="flex flex-col justify-center mt-2 gap-3 rounded-2xl w-fit mx-auto  border px-10 py-5 bg-gray-100 "
          onSubmit={loginUser}
        >
          <p className="text-center text-gray-500 font-semibold text-base">
            {" "}
            Enter Your Credentials
          </p>

          <div className="flex justify-between overflow-hidden items-center w-full border-2  px-2 border-gray-300 my-1 bg-white rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            <input
              className="w-full py-2 px-3 rounded-2xl focus:outline-none"
              type="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-between overflow-hidden items-center w-full border-2  px-2 border-gray-300 my-1 bg-white rounded-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>

            <input
              placeholder="Password"
              className="w-full   py-2 px-3 rounded-2xl focus:outline-none"
              type={seePassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="text-sm sm:text-[16px] text-gray-500 hover:underline"
              onClick={() => setSeePassword(!seePassword)}
            >
              {seePassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </div>
          </div>
          <ReCAPTCHA
            ref={reRef}
            // onChange={(token) => console.log(token)}
            // size="invisible"
            sitekey="6LeSVromAAAAAILFwfqWxlwwDpfxQyurWRpx0S-b"
          />
          <button type="submit" className="primary mt-5">
            Login
          </button>
          <div className="flex gap-2 text-sm sm:text-[16px] justify-center mt-4">
            <p>Don&apos;t have an account?</p>
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
      <div className="flex flex-col items-center ">
        <h1 className="text-3xl font-bold my-4">OR</h1>
        <a href={getGoogleOAuthUrl()}>
          <div className="googleButton items-center border px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-200  flex gap-3">
            <Image
              width={24}
              height={24}
              className="googleIcon w-6 h-6"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google logo"
            />
            <span>Continue with Google</span>
          </div>
        </a>
      </div>
    </>
  );
};

export default LoginSign;
