import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import axios from "axios";
import { message } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import generateBrowserFingerprint from "../util/GenerateFingerprint";
import getGoogleOAuthUrl from "@/util/getGoogleUrl";
import ReCAPTCHA from "react-google-recaptcha";

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const reRef = useRef<ReCAPTCHA>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    handleValidation();

    if (passwordError || confirmPasswordError) {
      message.error("Please fill all the fields correctly");
      return;
    }

    const captchatoken = await reRef.current?.getValue();
    if (!captchatoken) {
      message.error("Please verify captcha");
      setLoading(false);
      return;
    }
    reRef.current?.reset();

    try {
      const fingerPrint = await generateBrowserFingerprint();
      setLoading(true);
      try {
        await axios.post("/authentication/register", {
          username,
          email,
          password,
          fingerPrint,
          captchaToken: captchatoken,
        });

        message.success("Registration successful!");
        setRedirect(true);
      } catch (error) {
        console.log(error);
        message.error("Registration failed! Please try again.");
      }
    } catch (error) {
      console.log(error);
      message.error("Registration failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = () => {
    const validationRules: [RegExp, string][] = [
      [/(?=.*?[A-Z])/, "At least one Uppercase"],
      [/(?=.*?[a-z])/, "At least one Lowercase"],
      [/(?=.*?[0-9])/, "At least one digit"],
      [/(?=.*?[#?!@$%^&*-])/, "At least one Special Character"],
      [/.{8,}/, "At least minimum 8 characters"],
    ];

    const passwordValue = password.trim();
    let errMsg = "";
    for (const [pattern, errorMsg] of validationRules) {
      if (!pattern.test(passwordValue)) {
        errMsg = errorMsg;
        break;
      }
    }
    setPasswordError(errMsg);

    if (confirmPassword.trim() && passwordValue !== confirmPassword.trim()) {
      setConfirmPasswordError("Confirm password does not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  useEffect(() => {
    if (redirect) {
      router.push("/login");
    }
  }, [redirect]);

  if (loading) return <div id="preloader" />;

  return (
    <>
      {contextHolder}
      <div className="flex flex-col items-center h-screen">
        <h1 className="text-3xl font-bold">Welcome!!</h1>
        <p className="text-gray-500">Let's begin by creating your account</p>
        <form className="w-fit mx-auto mt-4 rounded-2xl border px-10 py-6 bg-gray-100 flex flex-col">
          <label htmlFor="username">Username</label>
          <input
            className="w-full border-2 border-gray-300 my-1 py-2 px-3 rounded-2xl"
            type="text"
            id="username"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            required
          />

          <label htmlFor="email">Email</label>
          <input
            className="w-full border-2 border-gray-300 my-1 py-2 px-3 rounded-2xl"
            type="email"
            id="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />

          <label htmlFor="password">Password</label>
          <input
            className="w-full border-2 border-gray-300 my-1 py-2 px-3 rounded-2xl"
            type="password"
            id="password"
            name="password"
            value={password}
            onKeyUp={handleValidation}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            required
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="w-full border-2 border-gray-300 my-1 py-2 px-3 rounded-2xl"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onKeyUp={handleValidation}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
          {confirmPasswordError && (
            <p className="text-red-500">{confirmPasswordError}</p>
          )}

          <ReCAPTCHA
            ref={reRef}
            sitekey="6LeSVromAAAAAILFwfqWxlwwDpfxQyurWRpx0S-b"
            className="mt-3"
          />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2"
            onClick={handleSubmit}
          >
            Register
          </button>

          <div className="flex justify-center gap-2 mt-2">
            <p>Already have an account?</p>
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
        </form>

        <div className="flex flex-col items-center mt-2 ">
          <h1 className="text-3xl font-bold my-4">OR</h1>
          <a href={getGoogleOAuthUrl()}>
            <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-200 flex items-center gap-3">
              <img
                className="w-6 h-6"
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google logo"
              />
              <span>Continue with Google</span>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
