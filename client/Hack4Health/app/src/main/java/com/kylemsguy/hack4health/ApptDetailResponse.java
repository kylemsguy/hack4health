package com.kylemsguy.hack4health;

import java.util.Date;

/**
 * Created by kyle on 12/06/16.
 */
public class ApptDetailResponse {
    private int time;
    private boolean checkedIn;
    private double distance;

    public int getTime() {
        return time;
    }

    public boolean isCheckedIn() {
        return checkedIn;
    }

    public double getDistance(){
        return distance;
    }
}
