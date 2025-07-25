package com.graphhopper.jsprit.optimroute.vrp;

/**
 * VrpException
 */
public class VrpException extends IllegalArgumentException {

    private String code;

    public VrpException(String code, String message) {
        super(message);
        this.setCode(code);
    }

    public VrpException(String code, String message, Throwable cause) {
        super(message, cause);
        this.setCode(code);
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}