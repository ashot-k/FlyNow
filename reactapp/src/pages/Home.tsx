import React, { useEffect, useState } from "react";
import FlightSearch, { FlightSearchData } from "../components/FlightSearch";
import { userArea } from "../utils/Utils";
import FlightSearchResults from "../components/FlightSearchResults";
import { log } from "node:util";
import { wait } from "@testing-library/user-event/dist/utils";

interface HomePageProps {
    className?: string;
}

export default function Home({ className }: HomePageProps) {
    const [searchResults, setSearchResults] = useState<FlightSearchData | undefined>(undefined);

    const [originSuggestion, setOriginSuggestion] = useState<string>(userArea);
    const [destinationSuggestion, setDestinationSuggestion] = useState<string>();
    const handleFlightSearch = (searchData: FlightSearchData) => {
        const flightSearch = document.getElementById("flightSearch");
        flightSearch?.classList.add("animate-slideOutFadeOut");
        flightSearch?.classList.add("hidden");
        setSearchResults(searchData);
    };
    useEffect(() => {
        if (searchResults?.pending) {
            const flightSearch = document.getElementById("flightSearch");
            flightSearch?.classList.add("animate-slideOutFadeOut");
            flightSearch?.classList.add("hidden");
        }
    }, [searchResults]);

    return (
        <div className={className}>
            <FlightSearch
                id={"flightSearch"}
                className={
                    "flex h-full w-full flex-grow flex-col items-center justify-between bg-flyNow-component px-5 pb-6 pt-10 text-lg font-normal shadow-md shadow-black sm:mt-36 sm:w-11/12 sm:flex-grow-0 sm:gap-8 sm:rounded-xl sm:px-20 sm:py-20 sm:pb-8 lg:w-5/6 xl:w-2/3"
                }
                onSearch={handleFlightSearch}
                originIATA={originSuggestion}
                destinationIATA={destinationSuggestion ? destinationSuggestion : ""}
            />
            <FlightSearchResults searchResults={searchResults} />
            {searchResults && (
                <div className={"fixed bottom-24 right-2 z-50 sm:bottom-2 sm:right-96"}>
                    <button
                        onClick={() => {
                            const flightSearch = document.getElementById("flightSearch");
                            flightSearch?.classList.remove("animate-slideOutFadeOut");
                            flightSearch?.classList.remove("hidden");
                            wait(100).then(() => window.scrollTo({ top: 0, behavior: "smooth" }));
                        }}
                        className={"text-wrap rounded-xl bg-flyNow-secondary p-5 text-lg hover:bg-flyNow-light"}>
                        Search again
                    </button>
                </div>
            )}
        </div>
    );
}
