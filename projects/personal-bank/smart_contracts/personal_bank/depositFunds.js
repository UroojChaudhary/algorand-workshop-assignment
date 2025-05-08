const algosdk = require('algosdk')

// Algorand Testnet configuration using Nodely
const algodToken = '' // No token required for Nodely
const algodServer = 'https://testnet-api.4160.nodely.dev'
const algodPort = 443

// Create an Algod client
const client = new algosdk.Algodv2(algodToken, algodServer, algodPort)

// Your Testnet account (replace with your mnemonic)
const account = algosdk.mnemonicToSecretKey(
  'magic simple very salmon panther walnut bachelor song nest call ski antenna marine income citizen notable detect river dust mother language thought wear abandon almost',
)

// Define your contract's App ID
const appID = 739100958 // Replace with your App ID

// GitHub handle to store
const githubHandle = 'Urooj Chaudhary' // Replace with your GitHub handle

// Function to call the deposit method and store GitHub handle
async function storeGithubHandle() {
  try {
    // Fetch suggested transaction parameters
    const suggestedParams = await client.getTransactionParams().do()

    // Construct the application call transaction
    const depositTxn = algosdk.makeApplicationCallTxnFromObject({
      from: account.addr,
      appIndex: appID,
      appArgs: [new TextEncoder().encode(githubHandle)], // Pass GitHub handle as a byte array
      suggestedParams: suggestedParams,
    })

    // Sign the transaction
    const signedTxn = depositTxn.signTxn(account.sk)

    // Send the transaction to the network
    const { txId } = await client.sendRawTransaction(signedTxn).do()

    // Wait for transaction confirmation
    console.log(`Transaction Sent: ${txId}`)
    const confirmedTxn = await algosdk.waitForConfirmation(client, txId, 4)

    // Log confirmation details
    console.log('Transaction Confirmed:', confirmedTxn)
  } catch (error) {
    console.error('Error in storing GitHub handle:', error)
  }
}

// Execute the function
storeGithubHandle()
