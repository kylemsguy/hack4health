package com.kylemsguy.hack4health;

import android.app.IntentService;
import android.app.Service;
import android.content.Intent;
import android.location.LocationManager;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.os.PowerManager;
import android.util.Log;

public class LocationService extends IntentService {
    public static final String EMAIL_
    private ApiWrapper apiWrapper;
    /**
     * A constructor is required, and must call the super IntentService(String)
     * constructor with a name for the worker thread.
     */
    public LocationService() {
        super("LocationService");
        apiWrapper = ApiWrapper.getInstance();
    }

    /**
     * The IntentService calls this method from the default worker thread with
     * the intent that started the service. When this method returns, IntentService
     * stops the service, as appropriate.
     */
    @Override
    protected void onHandleIntent(Intent intent) {
        // Normally we would do some work here, like download a file.
        // For our sample, we just sleep for 5 seconds.
        Bundle bundle = intent.getStringExtra()
        try {
            apiWrapper.sendLocationToServer()
        } catch (InterruptedException e) {
            // Restore interrupt status.
            Thread.currentThread().interrupt();
        }
    }

}