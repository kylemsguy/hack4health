package com.kylemsguy.hack4health;

import android.view.View;

/**
 * Created by kyle on 11/06/16.
 */
// Provide a method to call for each click
public interface OnListItemClickAction {
    void doAction(View v, int position);
}