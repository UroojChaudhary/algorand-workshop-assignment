import algosdk from 'algosdk'

// Mnemonic phrase se private key aur address derive karna
const mnemonic =
  'magic simple very salmon panther walnut bachelor song nest call ski antenna marine income citizen notable detect river dust mother language thought wear abandon almost'
const account = algosdk.mnemonicToSecretKey(mnemonic)

const senderAddress = account.addr // Wallet address
const privateKey = account.sk // Private key

const appId = 739100958 // Tumhare application ka ID
const githubHandle = 'UroojChaudhary' // Tumhara GitHub username

const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const algodServer = 'http://localhost'
const algodPort = 4001

async function storeGitHubHandle() {
  // Algod client initialize karna
  const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort)

  // Transaction parameters fetch karna
  const params = await algodClient.getTransactionParams().do()

  // Application call ke arguments
  const appArgs = [new Uint8Array(Buffer.from('set_github')), new Uint8Array(Buffer.from(githubHandle))]

  // Transaction create karna
  const txn = algosdk.makeApplicationCallTxnFromObject({
    sender: senderAddress, // Corrected property name
    appIndex: appId,
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    appArgs: appArgs,
    suggestedParams: params,
  })

  // Transaction sign karna
  const signedTxn = txn.signTxn(privateKey)
  const txId = txn.txID().toString()

  // Signed transaction send karna
  await algodClient.sendRawTransaction(signedTxn).do()
  console.log(`Transaction sent with ID: ${txId}`)

  // Transaction confirmation wait karna
  const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4)
  console.log('GitHub handle stored successfully:', confirmedTxn)
}

// Function ko call karna
storeGitHubHandle().catch(console.error)
