package com.kylemsguy.hack4health;

import android.app.IntentService;
import android.app.Service;
import android.content.Intent;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.os.PowerManager;
import android.support.annotation.Nullable;
import android.util.Log;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;

public class LocationService extends Service {

    public LocationService() {

    }

    @Override
    public void onCreate() {
        super.onCreate();
        
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}