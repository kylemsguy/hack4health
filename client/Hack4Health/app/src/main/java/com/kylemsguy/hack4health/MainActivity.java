package com.kylemsguy.hack4health;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity implements OnListItemClickAction {

    private RecyclerView mRecyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager mLayoutManager;

    private List<LoginResponse> myDataset = new ArrayList<>();

    private String mEmail;
    private String mPassword;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mRecyclerView = (RecyclerView) findViewById(R.id.apptList);

        // use this setting to improve performance if you know that changes
        // in content do not change the layout size of the RecyclerView
        mRecyclerView.setHasFixedSize(true);

        // use a linear layout manager
        mLayoutManager = new LinearLayoutManager(this);
        mRecyclerView.setLayoutManager(mLayoutManager);

        // specify an adapter (see also next example)
        mAdapter = new ApptListAdapter(this, this, myDataset);
        mRecyclerView.setAdapter(mAdapter);

        mEmail = getIntent().getStringExtra("email");
        mPassword = getIntent().getStringExtra("pass");

        new AsyncTask<Void, Void, List<LoginResponse>>(){
            @Override
            protected List<LoginResponse> doInBackground(Void... params) {
                ApiWrapper apiWrapper = ApiWrapper.getInstance();
                try {
                    return apiWrapper.login(mEmail, mPassword);
                } catch (IOException e) {
                    e.printStackTrace();
                    return null;
                }
            }

            @Override
            protected void onPostExecute(List<LoginResponse> loginResponses) {
                super.onPostExecute(loginResponses);
                myDataset.clear();
                myDataset.addAll(loginResponses);
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mAdapter.notifyDataSetChanged();
                    }
                });
            }
        }.execute();
    }

    @Override
    public void doAction(View v, int position) {
        Intent intent = new Intent(this, CheckInActivity.class);
        intent.putExtra("appid", myDataset.get(position).getAppid());
        intent.putExtra("checkedin", myDataset.get(position).isCheckedIn());
        intent.putExtra("clinicname", myDataset.get(position).getClinicName());
        intent.putExtra("timetoappt", myDataset.get(position).getDate().getTime());

        startActivity(intent);
    }
}
