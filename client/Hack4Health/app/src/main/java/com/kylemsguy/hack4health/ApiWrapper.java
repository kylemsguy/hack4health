package com.kylemsguy.hack4health;

import android.location.Location;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.reflect.TypeToken;

import java.io.IOException;
import java.lang.reflect.Type;
import java.text.DateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Created by kyle on 11/06/16.
 */
public class ApiWrapper {
    public static final String BASE = "https://hack4health-cherylyli.c9users.io/";
    public static final String LOGIN = BASE + "login/";
    public static final String LOCATION = BASE + "location/";
    public static final String APP_DETAIL = BASE + "appdetail/";
    public static final String CHECK_IN = BASE + "checkin/";
    public static final MediaType MEDIA_TYPE_JSON
            = MediaType.parse("application/json; charset=utf-8");

    private static ApiWrapper instance;

    private OkHttpClient client;

    private ApiWrapper() {
        client = new OkHttpClient();
    }

    public static ApiWrapper getInstance() {
        if (instance == null) {
            instance = new ApiWrapper();
        }
        return instance;
    }

    /**
     * Requests a list of appointments associated with the provided email.
     *
     * @param email
     * @param password
     * @return
     * @throws IOException
     */
    public List<LoginResponse> login(String email, String password) throws IOException {
        JsonObject json = new JsonObject();
        json.addProperty("email", email);
        json.addProperty("password", password);

        Request request = new Request.Builder()
                .url(LOGIN)
                .post(RequestBody.create(MEDIA_TYPE_JSON, json.toString()))
                .build();

        Response response = client.newCall(request).execute();

        if (!response.isSuccessful()) {
            throw new IOException("Unexpected code " + response);
        }

        String responseStr = response.body().string();
        System.out.println(responseStr);
        response.body().close();

        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Date.class, new JsonDeserializer<Date>() {
                    @Override
                    public Date deserialize(JsonElement json, Type typeOfT,
                                            JsonDeserializationContext context)
                            throws JsonParseException {
                        return new Date(json.getAsJsonPrimitive().getAsLong() + (3600000 * 4));
                    }
                })
                .create();
        Type collectionType = new TypeToken<List<LoginResponse>>() {
        }.getType();

        List<LoginResponse> parsedObjs = gson.fromJson(responseStr, collectionType);

        Collections.sort(parsedObjs);

        return parsedObjs;
    }

    public String sendLocationToServer(String email, Location location) throws IOException {
        JsonObject json = new JsonObject();
        json.addProperty("email", email);
        json.addProperty("lat", location.getLatitude());
        json.addProperty("long", location.getLongitude());

        Request request = new Request.Builder()
                .url(LOCATION)
                .post(RequestBody.create(MEDIA_TYPE_JSON, json.toString()))
                .build();

        Response response = client.newCall(request).execute();

        if (!response.isSuccessful()) {
            response.body().close();
            throw new IOException("Unexpected code " + response);
        }

        String body = response.body().string();
        response.body().close();
        return body;
    }

    public ApptDetailResponse getApptDetails(int appid) throws IOException {
        JsonObject json = new JsonObject();
        json.addProperty("appid", appid);

        Request request = new Request.Builder()
                .url(APP_DETAIL)
                .post(RequestBody.create(MEDIA_TYPE_JSON, json.toString()))
                .build();

        Response response = client.newCall(request).execute();

        if (!response.isSuccessful()) {
            response.body().close();
            throw new IOException("Unexpected code " + response);
        }

        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Date.class, new JsonDeserializer<Date>() {
                    @Override
                    public Date deserialize(JsonElement json, Type typeOfT,
                                            JsonDeserializationContext context)
                            throws JsonParseException {
                        return new Date(json.getAsJsonPrimitive().getAsLong());
                    }
                })
                .create();

        String responseStr = response.body().string();

        response.body().close();

        Type objType = new TypeToken<ApptDetailResponse>() {}.getType();

        return gson.fromJson(responseStr, objType);
    }

    public boolean checkIn(int appid) throws IOException {
        JsonObject json = new JsonObject();
        json.addProperty("appid", appid);

        Request request = new Request.Builder()
                .url(CHECK_IN)
                .post(RequestBody.create(MEDIA_TYPE_JSON, json.toString()))
                .build();

        Response response = client.newCall(request).execute();

        if (!response.isSuccessful()) {
            response.body().close();
            throw new IOException("Unexpected code " + response);
        }
        response.body().close();
        return true;
    }

}
