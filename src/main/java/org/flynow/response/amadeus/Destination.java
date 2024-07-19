package org.flynow.response.amadeus;

import com.amadeus.resources.Location.Address;
import com.amadeus.resources.Location.GeoCode;
import com.amadeus.resources.Resource;

public class Destination extends Resource {
    private String type;
    private String subtype;
    private String name;
    private String iataCode;
    private Address address;
    private GeoCode geoCode;

    public Destination() {

    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSubtype() {
        return subtype;
    }

    public void setSubtype(String subtype) {
        this.subtype = subtype;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIataCode() {
        return iataCode;
    }

    public void setIataCode(String iataCode) {
        this.iataCode = iataCode;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public GeoCode getGeoCode() {
        return geoCode;
    }

    public void setGeoCode(GeoCode geoCode) {
        this.geoCode = geoCode;
    }
}
