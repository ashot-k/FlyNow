package org.flynow.utils;

import org.flynow.controller.AmadeusController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AmadeusURLs {

    public static String tokenURL;

    public static String bookingURL;

   public AmadeusURLs(@Value("${amadeus.token.url}") String tokenURL,
                      @Value("${amadeus.booking.url}") String bookingURL){
        AmadeusURLs.tokenURL = tokenURL;
        AmadeusURLs.bookingURL = bookingURL;
    }
}
