package org.flynow;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class AmadeusTokenExtractor {
    public String extractAccessToken(String jsonString){
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            AmadeusToken token = objectMapper.readValue(jsonString, AmadeusToken.class);
            return token.getAccess_token();
        } catch (IOException ioException) {
            return null;
        }
    }

}
