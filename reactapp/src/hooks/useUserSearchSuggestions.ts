import { useContext, useEffect, useState } from "react";
import { SearchSuggestion } from "../components/search-suggestions/SearchSuggestions";
import { getSearchTerms } from "../services/FlyNowServiceAPI";
import { AuthContext } from "../context";

export default function useUserSearchSuggestions() {
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [pending, setPending] = useState(false);
    const userData = useContext(AuthContext);
    useEffect(() => {
        if (userData?.username) {
            setPending(true);
            getSearchTerms()
                .then((r) => {
                    let unformattedSuggestions = r.data;
                    let suggestions: SearchSuggestion[] = [];
                    for (const unformattedSuggestion of unformattedSuggestions) {
                        suggestions.push({
                            originIATA: unformattedSuggestion.origin,
                            destinationIATA: unformattedSuggestion.destination,
                        });
                    }
                    setSuggestions(suggestions);
                })
                .catch((e) => console.log(e))
                .finally(() => setPending(false));
        }
    }, [userData]);
    return {
        pendingUserSearchSuggestions: pending,
        setPendingUserSearchSuggestions: setPending,
        userSearchSuggestions: suggestions,
        setUserSearchSuggestions: setSuggestions,
    };
}
