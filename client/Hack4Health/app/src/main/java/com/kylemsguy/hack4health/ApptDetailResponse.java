package com.kylemsguy.hack4health;

import java.util.Date;

/**
 * Created by kyle on 12/06/16.
 */
public class ApptDetailResponse {
    private Date time;
    private boolean checkedIn;

    public Date getTime() {
        return time;
    }

    public boolean isCheckedIn() {
        return checkedIn;
    }
}
