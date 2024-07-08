import { searchFlightOffers, searchFlightOffersDummy } from "../services/AmadeusAPIService";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { logSearchTerms } from "../services/FlyNowServiceAPI";

export default function useSearchFlights() {
  const [noResults, setNoResults] = useState<boolean>(false);
  const [pendingFlightSearch, setPendingFlightSearch] = useState<boolean>(false);
  const [flightList, setFlightList] = useState<any[]>([]);
  const [dictionaries, setDictionaries] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const origin = searchParams.get("origin");
    const dest = searchParams.get("dest");
    const departureDate = searchParams.get("depDate");
    const returnDate = searchParams.get("returnDate");
    const adults = searchParams.get("adults");
    const children = searchParams.get("children");
    const maxPrice = searchParams.get("maxPrice");
    if (origin && dest && departureDate)
      searchFlights(
        origin,
        dest,
        departureDate,
        returnDate ? returnDate : "",
        adults ? Number(adults) : 1,
        children ? Number(children) : undefined,
        maxPrice ? Number(maxPrice) : 1000,
      );
  }, [searchParams]);

  function searchFlights(
    originIATA: string,
    destinationIATA: string,
    departureDate: string,
    returnDate?: string,
    adults?: number,
    children?: number,
    maxPrice?: number,
  ) {
    setPendingFlightSearch(true);
    setFlightList([]);
    if (originIATA && destinationIATA && departureDate) {
      logSearchTerms(originIATA, destinationIATA);
      if (process.env.REACT_APP_DEV_MODE === "true") {
        searchFlightOffersDummy({
          originIATA: originIATA,
          destinationIATA: destinationIATA,
          departureDate: departureDate,
          returnDate: returnDate,
          adults: adults ? adults : 1,
          children: children,
          maxPrice: maxPrice ? maxPrice : 1000,
        })
          .then((response) => {
            setNoResults(true);
            setFlightList(response.data.data);
            setDictionaries(response.data.dictionaries);
          })
          .catch((e) => {
            console.error(e);
            setFlightList([]);
          })
          .finally(() => {
            setPendingFlightSearch(false);
          });
      } else {
        searchFlightOffers({
          originIATA: originIATA,
          destinationIATA: destinationIATA,
          departureDate: departureDate,
          returnDate: returnDate,
          adults: adults ? adults : 1,
          children: children,
          maxPrice: maxPrice ? maxPrice : 1000,
        })
          .then((response) => {
            setNoResults(true);
            setFlightList(response.data.data);
            setDictionaries(response.data.dictionaries);
          })
          .catch((e) => {
            console.error(e);
            setFlightList([]);
          })
          .finally(() => {
            setPendingFlightSearch(false);
          });
      }
    }
  }

  return {
    searchFlights,
    flightList,
    setFlightList,
    dictionaries,
    setDictionaries,
    pendingFlightSearch,
    noResults,
  };
}
