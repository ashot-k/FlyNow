package org.flynow.response.amadeus;

import java.util.Hashtable;


public record Dictionaries(
        Hashtable<String, LocationInfo> locations,
        Hashtable<String, String> aircraft,
        Hashtable<String, String> currencies,
        Hashtable<String, String> carriers) {
}
