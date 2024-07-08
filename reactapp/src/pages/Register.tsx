import React, { useEffect, useState } from "react";
import { register } from "../services/FlyNowServiceAPI";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@headlessui/react";
import successIcon from "../static/assets/success-svgrepo-com.svg";
import errorIcon from "../static/assets/error-svgrepo-com.svg";

interface RegisterPageProps {
  className?: string;
}

export default function Register({ className }: RegisterPageProps) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [pendingRegister, setPendingRegister] = useState<boolean>(false);
  const [registerStatus, setRegisterStatus] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setShowAlert(false);
  }, [username, password]);

  function handleRegistration(e: React.FormEvent) {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setPendingRegister(true);
      register({
        username,
        password,
        email,
        city,
        country,
        lastName,
        firstName,
        phoneNumber,
        postalCode,
      })
        .then((r) => {
          if (r && r.username) {
            console.log(r);
            setRegisterStatus(true);
            setShowAlert(true);
            setResponseMessage(r.message);
            setTimeout(() => {
              navigate("/login");
            }, 750);
          } else {
            setRegisterStatus(false);
            setShowAlert(true);
            setResponseMessage(r);
          }
        })
        .catch((e) => {
          console.log(e);
          setShowAlert(true);
          setRegisterStatus(false);
          if (e.data) setResponseMessage(e.data);
          setPendingRegister(false);
        });
    }
  }

  return (
    <form onSubmit={handleRegistration} className={className}>
      <div className={"w-full"}>
        <h1 className={"text-3xl"}>Create your account</h1>
        <hr className={"mt-2 border-gray-500"} />
      </div>
      <div className={"static flex w-full flex-col items-start justify-evenly gap-3.5 sm:w-full sm:flex-row sm:py-5"}>
        <div className={"flex w-full flex-col items-center gap-1.5 sm:w-4/12"}>
          <h1 className={"hidden w-full text-center text-xl sm:block"}>Credentials</h1>
          <hr className={"hidden w-2/3 border-gray-500 sm:block"} />
          <div className={"flex w-full flex-col gap-1.5"}>
            <label className={"w-full text-lg"} htmlFor={"username"}>
              Username
            </label>
            <Input
              name={"username"}
              className={
                "w-full rounded-lg bg-transparent px-3 py-2 text-lg text-white outline outline-1 outline-gray-500 invalid:visible data-[focus]:outline-flyNow-light sm:py-1.5"
              }
              type={"text"}
              placeholder={"Enter username"}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={"flex w-full flex-col gap-1.5"}>
            <label className={"w-full text-lg"} htmlFor={"email"}>
              Email
            </label>
            <Input
              name={"email"}
              className={
                "w-full rounded-lg bg-transparent px-3 py-2 text-lg text-white outline outline-1 outline-gray-500 invalid:visible data-[focus]:outline-flyNow-light sm:py-1.5"
              }
              type={"text"}
              placeholder={"Enter email"}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={"flex w-full flex-col gap-1.5"}>
            <label className={"w-full text-lg"} htmlFor={"password"}>
              Password
            </label>
            <Input
              name={"password"}
              className={
                "w-full rounded-lg bg-transparent px-3 py-2 text-lg text-white outline outline-1 outline-gray-500 invalid:visible data-[focus]:outline-flyNow-light sm:py-1.5"
              }
              type={"password"}
              placeholder={"Enter password"}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className={"flex w-full flex-col items-center gap-1.5 sm:w-6/12"}>
          <h1 className={"w-full text-center text-xl"}>Address Information</h1>
          <hr className={"hidden w-2/3 border-gray-500 sm:block"} />
          <div className={"flex w-full gap-3.5"}>
            <div className={"flex w-1/2 flex-col gap-1.5"}>
              <label className={"w-full text-sm"} htmlFor={"firstName"}>
                First name
              </label>
              <Input
                name={"firstName"}
                className={
                  "w-full rounded-lg bg-transparent px-3 py-2 text-sm text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:py-1.5"
                }
                type={"text"}
                placeholder={"Enter first name"}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className={"flex w-1/2 flex-col gap-1.5"}>
              <label className={"w-full text-sm"} htmlFor={"lastName"}>
                Last name
              </label>
              <Input
                name={"lastName"}
                className={
                  "w-full rounded-lg bg-transparent px-3 py-2 text-sm text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:py-1.5"
                }
                type={"text"}
                placeholder={"Enter last name"}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className={"flex w-full gap-3.5"}>
            <div className={"flex w-1/2 flex-col gap-1.5"}>
              <label className={"w-full text-sm"} htmlFor={"phoneNumber"}>
                Phone Number
              </label>
              <Input
                name={"phoneNumber"}
                className={
                  "w-full rounded-lg bg-transparent px-3 py-2 text-sm text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:py-1.5"
                }
                type={"text"}
                placeholder={"Enter phone number"}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className={"flex w-1/2 flex-col gap-1.5"}>
              <label className={"w-full text-sm"} htmlFor={"country"}>
                Country
              </label>
              <Input
                name={"country"}
                className={
                  "w-full rounded-lg bg-transparent px-3 py-2 text-sm text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:py-1.5"
                }
                type={"text"}
                placeholder={"Enter Country"}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
          <div className={"flex w-full gap-3.5"}>
            <div className={"flex w-1/2 flex-col gap-1.5"}>
              <label className={"w-full text-sm"} htmlFor={"city"}>
                City
              </label>
              <Input
                name={"city"}
                className={
                  "w-full rounded-lg bg-transparent px-3 py-2 text-sm text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:py-1.5"
                }
                type={"text"}
                placeholder={"Enter City"}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className={"flex w-1/2 flex-col gap-1.5"}>
              <label className={"w-full text-sm"} htmlFor={"postalCode"}>
                Zip Code
              </label>
              <Input
                name={"postalCode"}
                className={
                  "w-full rounded-lg bg-transparent px-3 py-2 text-sm text-white outline outline-1 outline-gray-500 data-[focus]:outline-flyNow-light sm:py-1.5"
                }
                type={"text"}
                placeholder={"Enter zip code"}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <button className={"w-full rounded-xl bg-flyNow-light px-5 py-1.5 outline outline-flyNow-light sm:w-1/2"} type={"submit"}>
        Register
      </button>
      <div
        className={"data-[alert-type=danger]:text-red-500 data-[alert-type=success]:text-emerald-500"}
        data-alert-type={registerStatus ? "success" : "danger"}
        hidden={!showAlert}>
        {registerStatus ? (
          <div className={"flex w-full gap-1"}>
            Registration success.
            <img src={successIcon} className={"h-8 w-8"} alt={""} />
          </div>
        ) : (
          <div className={"flex w-full gap-2"}>
            {responseMessage}
            <img src={errorIcon} className={"h-8 w-8"} alt={""} />
          </div>
        )}
      </div>
      <span>
        Already have an account?{" "}
        <Link to={"/login"} className={"text-flyNow-light-secondary underline"}>
          Log in
        </Link>
      </span>
      {/* <Alert variant={registerStatus ? "success" : "danger"} show={!pendingRegister && showAlert}>{responseMessage}</Alert>*/}
    </form>
  );
}
