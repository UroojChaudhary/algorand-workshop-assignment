const algosdk = require('algosdk');

// Setup: Replace with your details
const algodToken = { 'X-API-Key': 'YOUR_PURESTAKE_API_KEY' }; // Use {} for PureStake
const algodServer = 'https://testnet-algorand.api.purestake.io/ps2';
const algodPort = '';
const applicationId = 739100958;  // Your deployed application ID
const sender = 'NLHLTV37QSMNQPGHOQYQU5U3HFIEWDGX5HQNPDB76TIKIMLTAB4XUCRMYY';  // Replace with your real address

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

async function queryGithubBox() {
  try {
    const boxName = new Uint8Array(Buffer.from("github"));
    const boxValue = await algodClient.getApplicationBoxByName(applicationId, boxName).do();
    const decoded = Buffer.from(boxValue.value).toString('utf8');
    console.log("📦 GitHub handle stored in box:", decoded);
  } catch (err) {
    console.error("❌ Error querying box:", err.message);
  }
}

queryGithubBox();
