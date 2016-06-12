package com.kylemsguy.hack4health;

/**
 * Created by kyle on 11/06/16.
 */

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by kyle on 11/06/16.
 */
public class CheckInListAdapter extends RecyclerView.Adapter<CheckInListAdapter.ViewHolder> {
    private List<LoginResponse> mDataset;
    private OnListItemClickAction clickAction;

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
    public CheckInListAdapter(OnListItemClickAction action, List<LoginResponse> myDataset) {
        mDataset = myDataset;
        clickAction = action;
    }

    // Create new views (invoked by the layout manager)
    @Override
    public CheckInListAdapter.ViewHolder onCreateViewHolder(ViewGroup parent,
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
    public void onBindViewHolder(ViewHolder holder, final int position) {
        // - get element from your dataset at this position
        // - replace the contents of the view with that element
        //holder.mTextView.setText(mDataset[position]);
        holder.mClinicName.setText(mDataset.get(position).getClinicName());
        Date date = mDataset.get(position).getDate();
        SimpleDateFormat sdf = new SimpleDateFormat("MM-dd-yyyy @ hh:mma");
        holder.mApptTime.setText(sdf.format(date));
        holder.v.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // get the onclick listener
                clickAction.doAction(v, position);
            }
        });
    }

    // Return the size of your dataset (invoked by the layout manager)
    @Override
    public int getItemCount() {
        return mDataset.size();
    }

}
