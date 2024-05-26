package org.flynow.response;

import java.time.Instant;

public record TokenResponse (String token, long expiration, Instant issued_at){
}