# FlyNow
#### A Flight Booking web app using a Reactjs frontend, Spring Boot backened and the Amadeus self-service segment API. 

## Introduction
FlyNow is a segment search and booking web application in the field of e-commerce designed to simplify the process of travel planning and combat the problem of the time-consuming and often overwhelming task of searching for segments, comparing prices, and making bookings across multiple airlines. It achieves this by providing segment searching capabilities with multiple different filters and parameters such as price range, number of adults or children and airline selection. One of the key features of FlyNow is its personalized recommendation system. By analyzing user preferences, previous searches, and booking history, the application can suggest segments that align with the user's interests according to their interactions within the application. In addition, the service suggests hotel, car rental options and activities according to the user’s destination selection. Users are able to sign up for the service to gain access to more features such as the user profile page which shows their present and past segment/hotel bookings or reviewing their travel experiences. Another key feature is the Tour Planner component. With this feature users can make more elaborate travel plans. 

## Technical Details
For the development of the web application a reactJS frontend was used in conjunction with a spring boot backend using a postgreSQL database. Search for segments was done with the use of the Amadeus API’s test endpoints. This API provides data about - segments, airlines, airports, segment analytics, hotels, destination experiences and more. The reactJS frontend performs all the requests to the Amadeus API while the backend performs user authentication, token handling and saves information related to FlyNow’s functions such as user information, search logging and more.

## Roadmap 
- Destination recommendation based on different activities: Allow users to select different activities they might be interested in and present destinations most suitable for them.
- Information and guides about the destinations.
- Notifications about segment availability and price changes: Notify users about price changes or segment availability via website notifications and email.
- Interactive map for destination selection: Present users with an interactive map showcasing destination prices, points of interest and upcoming events or activities.
  
### TODOS
- [x] Flight search using the AmadeusAPI
- [x] Recommendations based on user location
- [x] Flight recommendation based on previous searches/bookings
- [ ] Result filtering
- [ ] Tour planning
- [ ] Hotel and car rental search
- [x] Recommendations according to trends in destination area
- [ ] Booked segment info storing on the FlyNow service
- [x] User authentication to the FlyNow service
- [ ] User profile page
- [ ] Airline reviews and ratings
- [ ] Flight booking and payment.

