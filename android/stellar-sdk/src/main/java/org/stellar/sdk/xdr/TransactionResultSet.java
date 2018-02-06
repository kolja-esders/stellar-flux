// Automatically generated by xdrgen 
// DO NOT EDIT or your changes may be overwritten

package org.stellar.sdk.xdr;


import java.io.IOException;

// === xdr source ============================================================

//  struct TransactionResultSet
//  {
//      TransactionResultPair results<>;
//  };

//  ===========================================================================
public class TransactionResultSet  {
  public TransactionResultSet () {}
  private TransactionResultPair[] results;
  public TransactionResultPair[] getResults() {
    return this.results;
  }
  public void setResults(TransactionResultPair[] value) {
    this.results = value;
  }
  public static void encode(XdrDataOutputStream stream, TransactionResultSet encodedTransactionResultSet) throws IOException{
    int resultssize = encodedTransactionResultSet.getResults().length;
    stream.writeInt(resultssize);
    for (int i = 0; i < resultssize; i++) {
      TransactionResultPair.encode(stream, encodedTransactionResultSet.results[i]);
    }
  }
  public static TransactionResultSet decode(XdrDataInputStream stream) throws IOException {
    TransactionResultSet decodedTransactionResultSet = new TransactionResultSet();
    int resultssize = stream.readInt();
    decodedTransactionResultSet.results = new TransactionResultPair[resultssize];
    for (int i = 0; i < resultssize; i++) {
      decodedTransactionResultSet.results[i] = TransactionResultPair.decode(stream);
    }
    return decodedTransactionResultSet;
  }
}
