package org.flynow.config.security;

public class TokenResponse {
    private String token;
    private long expiration;

    public TokenResponse(String token, long expiration) {
        this.token = token;
        this.expiration = expiration;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }

    // Getters and setters

    /*// You can also override the toString() method to get a JSON representation of the object
    @Override
    public String toString() {
        return "{\"token\":\"" + token + "\",\"expiration\":" + expiration + "}";
    }*/
}