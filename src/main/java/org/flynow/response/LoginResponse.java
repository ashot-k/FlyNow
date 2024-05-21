package org.flynow.response;

public record LoginResponse (String token, long expiration){
}
