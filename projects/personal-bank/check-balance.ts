import { algodClient } from './config'

const address = 'NLHLTV37QSMNQPGHOQYQU5U3HFIEWDGX5HQNPDB76TIKIMLTAB4XUCRMYY'

async function checkBalance() {
  try {
    const info = await algodClient.accountInformation(address).do()
    console.log(`Balance: ${Number(info.amount) / 1e6} ALGO`)
  } catch (err) {
    console.error('Error checking balance:', err)
  }
}

checkBalance()
