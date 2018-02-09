package com.flux.modules;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.stellar.sdk.Account;
import org.stellar.sdk.AssetTypeNative;
import org.stellar.sdk.KeyPair;
import org.stellar.sdk.Memo;
import org.stellar.sdk.Network;
import org.stellar.sdk.PaymentOperation;
import org.stellar.sdk.Server;
import org.stellar.sdk.Transaction;
import org.stellar.sdk.responses.AccountResponse;
import org.stellar.sdk.responses.SubmitTransactionResponse;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Scanner;

import javax.annotation.Nullable;

public class StellarAccount extends ReactContextBaseJavaModule {

  private static final String HORIZON_TESTNET_URL = "https://horizon-testnet.stellar.org";

  private static final String E_AMOUNT_TOO_SMALL = "E_AMOUNT_TOO_SMALL";

  private static final String E_DESTINATION_DOES_NOT_EXIT = "E_DESTINATION_DOES_NOT_EXIT";

  private static final String E_ACCOUNT_DOES_NOT_EXIT = "E_ACCOUNT_DOES_NOT_EXIT";

  private static final String EV_SOURCE_ACCOUNT_UPDATED = "EV_SOURCE_ACCOUNT_UPDATED";

  private static final String EV_DESTINATION_ACCOUNT_CHECKED = "EV_DESTINATION_ACCOUNT_CHECKED";

  private static final String EV_CREATED_TRANSACTION = "EV_CREATED_TRANSACTION";

  private String mSecretKey;

  private String mAccountId;

  private KeyPair mKeyPair;

  StellarAccount(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "StellarAccount";
  }

  @ReactMethod
  public void initializeWithSecretKey(final String secretKey) {
    mSecretKey = secretKey;
    mKeyPair = KeyPair.fromSecretSeed(secretKey);
  }

  @ReactMethod
  public void initializeWithAccountId(final String accountId) {
    mAccountId = accountId;
    mKeyPair = KeyPair.fromAccountId(accountId);
  }

  private void sendEvent(String eventName, @Nullable WritableMap params) {
    getReactApplicationContext()
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(eventName, params);
  }

  @ReactMethod
  public void sendLumensWithEvents(final String destinationAccountId, final double amount, final String memo, final Promise promise) {
    if (amount <= 0) {
      promise.reject(E_AMOUNT_TOO_SMALL, "The amount to be send is less or equal to 0.");
      return;
    }

    new Thread(new Runnable() {
      @Override
      public void run() {
        Network.useTestNetwork();
        Server server = new Server(HORIZON_TESTNET_URL);

        KeyPair destination = null;
        try {
          destination = KeyPair.fromAccountId(destinationAccountId);
          server.accounts().account(destination);
        } catch (Exception e) {
          promise.reject(e);
        }
        sendEvent("EV_DESTINATION_ACCOUNT_CHECKED", null);

        AccountResponse sourceAccount = null;
        try {
          sourceAccount = server.accounts().account(mKeyPair);
        } catch (Exception e) {
          promise.reject(e);
        }
        sendEvent("EV_SOURCE_ACCOUNT_UPDATED", null);

        Transaction.Builder txBuilder = new Transaction.Builder(sourceAccount)
            .addOperation(new PaymentOperation.Builder(destination, new AssetTypeNative(), String.valueOf(amount)).build());

        if (memo != null && memo.length() > 0) {
          txBuilder.addMemo(Memo.text(memo));
        }

        Transaction tx = txBuilder.build();
        tx.sign(mKeyPair);
        sendEvent("EV_CREATED_TRANSACTION", null);

        try {
          SubmitTransactionResponse response = server.submitTransaction(tx);
          promise.resolve(response.getHash());
        } catch (Exception e) {
          System.out.println("Something went wrong!");
          System.out.println(e.getMessage());
          promise.reject(e);
          // If the result is unknown (no response body, timeout etc.) we simply resubmit
          // already built transaction:
          // SubmitTransactionResponse response = server.submitTransaction(transaction);
        }
      }
    }).start();
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

        String friendbotUrl = String.format(HORIZON_TESTNET_URL + "/friendbot?addr=%s", pair.getAccountId());
        InputStream response = null;
        try {
          response = new URL(friendbotUrl).openStream();
          response.close();
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
  public static void getBalance(final String accountId, final Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        Server server = new Server(HORIZON_TESTNET_URL);
        KeyPair pair = KeyPair.fromAccountId(accountId);
        Double xlmBalance = 0.0;
        try {
          AccountResponse account = server.accounts().account(pair);
          for (AccountResponse.Balance balance : account.getBalances()) {
            if (balance.getAssetType() != null && balance.getAssetType().equals("native")) {
              xlmBalance += Double.valueOf(balance.getBalance());
            }
          }
          promise.resolve(xlmBalance);
        } catch (IOException e) {
          promise.reject(e);
        }
      }
    }).start();
  }

  @ReactMethod
  public static void isValidAccountId(final String accountId, final Promise promise) {
    // TODO: Reimplement checksum so we don't rely on exceptions for code flow.
    try {
      KeyPair.fromAccountId(accountId);
      promise.resolve(true);
    } catch (Exception e) {
      promise.resolve(false);
    }
  }

  @ReactMethod
  public static void existsAccount(final String accountId, Promise promise) {
    Network.useTestNetwork();
    Server server = new Server(HORIZON_TESTNET_URL);

    try {
      KeyPair pair = KeyPair.fromAccountId(accountId);
      server.accounts().account(pair);
      promise.resolve(true);
    } catch (Exception e) {
      promise.resolve(false);
    }
  }

  @ReactMethod
  public static void sendLumensWithMemo(final String sourceSecretKey,
                                final String destinationAccountId,
                                final double amount,
                                final String memo,
                                final Promise promise) {
    if (amount <= 0) {
      promise.reject(E_AMOUNT_TOO_SMALL, "The amount to be send is less or equal to 0.");
      return;
    }

    Network.useTestNetwork();
    Server server = new Server(HORIZON_TESTNET_URL);

    KeyPair source = KeyPair.fromSecretSeed(sourceSecretKey);
    KeyPair destination = KeyPair.fromAccountId(destinationAccountId);

    AccountResponse sourceAccount = null;
    try {
      sourceAccount = server.accounts().account(source);
    } catch (Exception e) {
      promise.reject(e);
    }

    Transaction.Builder txBuilder = new Transaction.Builder(sourceAccount)
        .addOperation(new PaymentOperation.Builder(destination, new AssetTypeNative(), String.valueOf(amount)).build());

    if (memo != null && memo.length() > 0) {
      txBuilder.addMemo(Memo.text(memo));
    }

    Transaction tx = txBuilder.build();
    tx.sign(source);

    try {
      SubmitTransactionResponse response = server.submitTransaction(tx);
      System.out.println("Success!");
      System.out.println(response);
    } catch (Exception e) {
      System.out.println("Something went wrong!");
      System.out.println(e.getMessage());
      // If the result is unknown (no response body, timeout etc.) we simply resubmit
      // already built transaction:
      // SubmitTransactionResponse response = server.submitTransaction(transaction);
    }
  }

  @ReactMethod
  public static void sendLumens(final String sourceSecretKey,
                                final String destinationAccountId,
                                final double amount,
                                final Promise promise) {
    sendLumensWithMemo(sourceSecretKey, destinationAccountId, amount, null, promise);
  }
}
