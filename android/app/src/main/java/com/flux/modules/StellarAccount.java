package com.flux.modules;

import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import org.stellar.sdk.KeyPair;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Scanner;

public class StellarAccount extends ReactContextBaseJavaModule {

  StellarAccount(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "StellarAccount";
  }

  @ReactMethod
  public static void createTestAccount(final Promise promise) {


    new Thread(new Runnable() {
      @Override
      public void run() {
        KeyPair pair = KeyPair.random();
        WritableMap ret = Arguments.createMap();
        ret.putString("accountId", pair.getAccountId());
        ret.putString("secretSeed", new String(pair.getSecretSeed()));

        Log.d("STELLAR-ACCOUNT", "Account id: " + pair.getAccountId());
        Log.d("STELLAR-ACCOUNT", "Secret seed: " + new String(pair.getSecretSeed()));

        String friendbotUrl = String.format(
            "https://horizon-testnet.stellar.org/friendbot?addr=%s",
            pair.getAccountId());
        InputStream response = null;
        try {
          response = new URL(friendbotUrl).openStream();
          String body = new Scanner(response, "UTF-8").useDelimiter("\\A").next();
          response.close();
          ret.putString("response", body);
          promise.resolve(ret);
          //successCallback.invoke(relativeX, relativeY, width, height);
        } catch (IOException e) {
          promise.reject(e);
        } finally {
          try {
            if (response != null) {
              response.close();
            }
          } catch (IOException e) {
            // Can't help it.
          }
        }
      }
    }).start();


  }

  @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }
}
