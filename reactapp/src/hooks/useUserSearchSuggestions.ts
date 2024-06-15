import {useEffect, useState} from "react";
import {SearchSuggestion} from "../components/search-suggestions/SearchSuggestions";
import {getSearchTerms} from "../services/FlyNowServiceAPI";

export default function useUserSearchSuggestions() {
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        getSearchTerms().then((r) => {
            console.log(r.data);
            let unformattedSuggestions = r.data;
            let suggestions: SearchSuggestion[] = [];
            for (const unformattedSuggestion of unformattedSuggestions) {
                suggestions.push({
                    originIATA: unformattedSuggestion.origin,
                    destinationIATA: unformattedSuggestion.destination
                });
            }
            setSuggestions(suggestions);
        }).catch(e => console.log(e))
    }, []);
    return {pendingUserSearchSuggestions: pending, setPending, userSearchSuggestions: suggestions, setSuggestions};
}