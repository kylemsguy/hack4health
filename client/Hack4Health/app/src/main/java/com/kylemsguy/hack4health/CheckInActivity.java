package com.kylemsguy.hack4health;

import android.os.AsyncTask;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

public class CheckInActivity extends AppCompatActivity {
    private ApptDetailResponse apptDetail;

    private int appid;
    private boolean checkedIn = false;
    private String clinicName;

    private ApiWrapper apiWrapper;

    private TextView clinicNameView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_check_in);

        apiWrapper = ApiWrapper.getInstance();

        appid = getIntent().getIntExtra("appid", 0);
        checkedIn = getIntent().getBooleanExtra("checkedin", false);
        clinicName = getIntent().getStringExtra("clinicname");

        clinicNameView = (TextView) findViewById(R.id.clinicName);


        final Handler handler = new Handler();
        Timer timer = new Timer();
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    public void run() {
                        new AsyncTask<Void, Void, ApptDetailResponse>(){
                            @Override
                            protected ApptDetailResponse doInBackground(Void... params) {
                                try{
                                    return apiWrapper.getApptDetails(appid);
                                } catch(IOException e){
                                    e.printStackTrace();
                                    return null;
                                }
                            }

                            @Override
                            protected void onPostExecute(ApptDetailResponse apptDetailResponse) {
                                super.onPostExecute(apptDetailResponse);
                                if(apptDetailResponse != null){
                                    // update stuffs
                                }
                            }
                        };
                    }
                });
            }
        };

        timer.schedule(task, 0, 5000); //it executes this every 5sec
    }

    public void checkIn(View v){
        new AsyncTask<Void, Void, Void>(){
            @Override
            protected Void doInBackground(Void... params) {
                try{
                    apiWrapper.checkIn(appid);
                } catch(IOException e){
                    e.printStackTrace();
                }
            }
        }
    }

}
