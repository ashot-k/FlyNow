package org.flynow.response;


import java.util.Map;

public record ErrorResponse(int status, String title, Map<String, String> errors) {
}
