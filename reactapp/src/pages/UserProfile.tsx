import React, { useContext } from "react";
import { AuthContext } from "../context";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import UserDetails from "../components/UserDetails";

export default function UserProfile() {
  const userData = useContext(AuthContext);

  return (
    <div
      className={
        "flex w-full flex-grow flex-col items-center justify-start bg-flyNow-component bg-opacity-95 py-6 shadow-md shadow-black sm:mb-5 sm:w-5/12"
      }>
      {userData?.username && (
        <div className={"mt-16 flex w-full flex-col items-center gap-2 sm:mt-0"}>
          <div className={"flex w-full flex-col items-center gap-3.5 sm:w-3/4"}>
            <div className={"flex w-full flex-col items-center"}>
              <h1 className={"w-full text-center text-3xl"}>Your Account</h1>
              <hr className={"mb-2 mt-3 w-3/4 border-gray-500"} />
            </div>
            <TabGroup className={"w-full"}>
              <TabList className={"flex w-full justify-center gap-1 py-2"}>
                <Tab className={"transition-color w-1/2 bg-flyNow-component bg-opacity-100 px-4 py-3 duration-500 hover:bg-flyNow-secondary"}>
                  <h2 className={"w-full text-2xl"}>Details</h2>
                </Tab>
                <Tab className={"transition-color w-1/2 bg-flyNow-component bg-opacity-100 px-4 py-3 duration-500 hover:bg-flyNow-secondary"}>
                  <h2 className={"w-full text-2xl"}>Bookings</h2>
                </Tab>
              </TabList>
              <TabPanels className={"w-full sm:mt-2"}>
                <TabPanel className={"animate-fadeIn rounded-xl bg-flyNow-component p-5 shadow-md shadow-black"}>
                  <UserDetails className={"flex w-full flex-col items-center gap-3.5"} />
                </TabPanel>
                <TabPanel className={"animate-fadeIn rounded-xl bg-flyNow-component p-5 shadow-md shadow-black"}>
                  <div className={"flex w-full flex-col items-center gap-3.5"}>bookings</div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      )}
    </div>
  );
}
