import algosdk from 'algosdk'

const algodToken = '' // Nodely doesn't need token
const algodServer = 'https://testnet-api.4160.nodely.dev'
const algodPort = 443

export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort)
