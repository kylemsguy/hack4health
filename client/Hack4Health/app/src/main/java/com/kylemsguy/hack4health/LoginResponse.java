package com.kylemsguy.hack4health;

import java.util.Date;

/**
 * Created by kyle on 11/06/16.
 */
public class LoginResponse implements Comparable<LoginResponse> {
    private int appid;
    private String email;
    private String clinicName;
    private boolean checkedIn;
    private double distance;
    private Date date;

    public int getAppid() {
        return appid;
    }

    public String getEmail() {
        return email;
    }

    public String getClinicName() {
        return clinicName;
    }

    public boolean isCheckedIn() {
        return checkedIn;
    }

    public double getDistance() {
        return distance;
    }

    public Date getDate() {
        return date;
    }

    @Override
    public int compareTo(LoginResponse another) {
        return (int) (date.getTime() - another.getDate().getTime());
    }
}
