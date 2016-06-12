package com.kylemsguy.hack4health;

import android.os.AsyncTask;
import android.os.Handler;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.io.IOException;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

public class CheckInActivity extends AppCompatActivity {
    private ApptDetailResponse apptDetail;

    private int appid;
    private boolean checkedIn = false;
    private String clinicName;
    private int timeToAppt = 0;
    private double distance = 0;

    private ApiWrapper apiWrapper;

    private TextView clinicNameView;
    private TextView timeToApptView;
    private TextView distanceToApptView;
    private Button btnCheckIn;
    private LinearLayout distanceToApptLayout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_check_in);

        apiWrapper = ApiWrapper.getInstance();

        appid = getIntent().getIntExtra("appid", 0);
        checkedIn = getIntent().getBooleanExtra("checkedin", false);
        clinicName = getIntent().getStringExtra("clinicname");

        clinicNameView = (TextView) findViewById(R.id.clinicName);
        timeToApptView = (TextView) findViewById(R.id.timeToAppt);
        distanceToApptView = (TextView) findViewById(R.id.distanceToAppt);
        btnCheckIn = (Button) findViewById(R.id.btnCheckIn);
        distanceToApptLayout = (LinearLayout) findViewById(R.id.distanceToApptLayout);

        clinicNameView.setText(clinicName != null ? clinicName : "");
        timeToApptView.setText("In x min");
        distanceToApptView.setText("x km away");
        btnCheckIn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                checkIn(v);
            }
        });

        final Handler handler = new Handler();
        Timer timer = new Timer();
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    public void run() {
                        new GetApptDetailTask().execute();
                    }
                });
            }
        };

        timer.schedule(task, 0, 5000); //it executes this every 5sec
    }

    public void showDialogBox(String message){
        AlertDialog dialog = new AlertDialog.Builder(this)
                .setPositiveButton("Ok", null)
                .setMessage(message)
                .create();
        dialog.show();
    }

    public void checkIn(View v){
        if(distance > 3) {
            showDialogBox("You need to be within 3km of the clinic to check in.");
            return;
        }
        new AsyncTask<Void, Void, Boolean>(){
            @Override
            protected Boolean doInBackground(Void... params) {
                try{
                    apiWrapper.checkIn(appid);
                    return true;
                } catch(IOException e){
                    e.printStackTrace();
                }
                return false;
            }

            @Override
            protected void onPostExecute(Boolean b) {
                if(b){
                    showDialogBox("Successfully Checked In");
                    new GetApptDetailTask().execute();
                } else {
                    showDialogBox("Unable to check in.");
                }
            }
        }.execute();
    }

    private class GetApptDetailTask extends AsyncTask<Void, Void, ApptDetailResponse>{
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
                timeToAppt = apptDetailResponse.getTime();
                distance = apptDetailResponse.getDistance();
                checkedIn = apptDetailResponse.isCheckedIn();

                NumberFormat formatter = new DecimalFormat("#0.00");

                timeToApptView.setText(timeToAppt + "min");
                distanceToApptView.setText(formatter.format(distance) + "km");

                if(checkedIn){
                    btnCheckIn.setEnabled(false);
                    distanceToApptLayout.setVisibility(View.VISIBLE);
                } else {
                    btnCheckIn.setEnabled(true);
                    distanceToApptLayout.setVisibility(View.INVISIBLE);
                }
            }
        }
    }

}
