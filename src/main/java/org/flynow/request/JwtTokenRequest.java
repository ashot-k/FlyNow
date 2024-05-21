package org.flynow.request;

public class JwtTokenRequest {
    private String token;

    public JwtTokenRequest() {
    }

    public JwtTokenRequest(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
