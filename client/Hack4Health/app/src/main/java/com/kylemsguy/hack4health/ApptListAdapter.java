package com.kylemsguy.hack4health;

import android.content.Context;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import org.w3c.dom.Text;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

/**
 * Created by kyle on 11/06/16.
 */
public class ApptListAdapter extends RecyclerView.Adapter<ApptListAdapter.ViewHolder> {
    private List<LoginResponse> mDataset;
    private OnListItemClickAction clickAction;
    private Context mContext;

    // Provide a reference to the views for each data item
    // Complex data items may need more than one view per item, and
    // you provide access to all the views for a data item in a view holder
    public static class ViewHolder extends RecyclerView.ViewHolder {
        public View v;
        public TextView mClinicName;
        public TextView mApptTime;

        public ViewHolder(View v) {
            super(v);
            this.v = v;
            this.mClinicName = (TextView) v.findViewById(R.id.clinicName);
            this.mApptTime = (TextView) v.findViewById(R.id.apptTime);
        }
    }

    // Provide a suitable constructor (depends on the kind of dataset)
    public ApptListAdapter(Context context, OnListItemClickAction action, List<LoginResponse> myDataset) {
        mContext = context;
        mDataset = myDataset;
        clickAction = action;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public ApptListAdapter.ViewHolder onCreateViewHolder(ViewGroup parent,
                                                   int viewType) {
        // create a new view
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.appt_list_item, parent, false);
        // set the view's size, margins, paddings and layout parameters
        ViewHolder vh = new ViewHolder(v);
        return vh;
    }

    // Replace the contents of a view (invoked by the layout manager)
    @Override
    public void onBindViewHolder(final ViewHolder holder, int position) {
        // - get element from your dataset at this position
        // - replace the contents of the view with that element
        //holder.mTextView.setText(mDataset[position]);
        holder.v.setEnabled(true);
        holder.mClinicName.setText(mDataset.get(position).getClinicName());
        final Date date = mDataset.get(position).getDate();
        SimpleDateFormat sdf = new SimpleDateFormat("MM-dd-yyyy @ hh:mma");
        sdf.setTimeZone(TimeZone.getDefault());
        holder.mApptTime.setText(sdf.format(date).toString());

        Date currDate = new Date();

        long diff = date.getTime() - currDate.getTime();
        if(diff > 1800000){ // 30min
            // change colour
            holder.v.setBackgroundColor(mContext.getResources().getColor(R.color.notReady));
        } else if(diff < 0) { // past
            // change colour
            holder.v.setBackgroundColor(mContext.getResources().getColor(R.color.missedAppt));
        } else {
            // reset to default colour
            holder.v.setBackgroundColor(mContext.getResources().getColor(R.color.normalAppt));
        }

        holder.v.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Date currDate = new Date();
                long diff = date.getTime() - currDate.getTime();

                if(diff > 1800000){ // 30min
                    AlertDialog builder = new AlertDialog.Builder(mContext)
                            .setMessage("You may only check in to your appointment 1 hour before.")
                            .setPositiveButton("Ok", null)
                            .create();
                    builder.show();
                } else if(diff < 0) { // past
                    AlertDialog builder = new AlertDialog.Builder(mContext)
                            .setMessage("This appointment has expired.")
                            .setPositiveButton("Ok", null)
                            .create();
                    builder.show();
                } else {
                    // get the onclick listener
                    clickAction.doAction(v, holder.getAdapterPosition());
                }
            }
        });
    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return mDataset.size();
    }

}
