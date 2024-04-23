import {Carousel} from "react-bootstrap";

export const FlightDestinationRecommendations = ({flights}: any) => {
    return (
        <div>
            {flights && flights.length > 0 && <Carousel fade>
                {flights.map((flight: any, index: number) =>
                    <Carousel.Item key={index}>
                        <div>
                            <h5>From {flight.origin} to {flight.destination}</h5>
                            <h5>{flight.departureDate}</h5>
                            {flight.returnDate && <h5>{flight.returnDate}</h5>}
                        </div>
                        <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                )}
            </Carousel>}
        </div>
    );
};