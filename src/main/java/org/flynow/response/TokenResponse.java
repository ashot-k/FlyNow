package org.flynow.response;


public record TokenResponse(String token, long expiration, String issued_at) {
}