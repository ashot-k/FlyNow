package org.flynow.response;

public record TokenResponse (String token, long expiration){
}