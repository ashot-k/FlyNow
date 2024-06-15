import {getAirportByIATA} from "../../utils/Utils";
import pendingSearchIcon from "../../static/infinite-spinner.svg";
import '../../static/SearchSuggestions.css'
import {SearchSuggestion} from "./SearchSuggestions";
import DestinationSuggestion from "./DestinationSuggestion";
import usePopularDestinationSuggestions from "../../hooks/usePopularDestinationSuggestions";


interface PopularDestinationSuggestionListProps {
    period: string,
    onSuggestionSelect: (suggestion: SearchSuggestion) => void;
    className?: string;
}

export default function PopularDestinationSuggestionsList({
                                                              period,
                                                              onSuggestionSelect, className}: PopularDestinationSuggestionListProps) {

    const {popularDestinations, pending} = usePopularDestinationSuggestions(period);
    return (
        <>{pending ? <img src={pendingSearchIcon} width={"25%"} height={"25%"}
                          alt={""}/> : popularDestinations?.length > 0 ?
            <div className={className}>
                <h4>Popular destinations from your area</h4>
                <div className={'search-suggestion-list d-flex flex-wrap gap-2 overflow-auto'}>
                    {popularDestinations.map((destIATA, index) => (
                        (getAirportByIATA(destIATA)?.iata && getAirportByIATA(destIATA)?.city && getAirportByIATA(destIATA)?.name != "All Airports") ?
                               <DestinationSuggestion key={index} selectSuggestion={onSuggestionSelect} destIATA={destIATA} type={"full"}/>
                            : <></>
                    ))}
                </div>
            </div> : <></>}
        </>
    );
};