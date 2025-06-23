import {
  abimethod,
  Account,
  assert,
  BoxMap,
  Contract,
  Global,
  gtxn,
  itxn,
  Txn,
  uint64,
} from '@algorandfoundation/algorand-typescript'

export class PersonalBank extends Contract {
  public depositors = BoxMap<Account, uint64>({ keyPrefix: 'depositors' })
  public githubBox = BoxMap<string, string>({ keyPrefix: 'github' })

  @abimethod()
  public deposit(payTxn: gtxn.PaymentTxn) {
    assert(payTxn.receiver === Global.currentApplicationAddress, 'Receiver must be the contract address')
    assert(payTxn.amount > 0, 'Deposit amount must be greater than zero')

    const depositAmount = payTxn.amount
    const isDeposited = this.depositors(payTxn.sender).exists

    if (isDeposited) {
      this.depositors(payTxn.sender).value += depositAmount
    } else {
      this.depositors(payTxn.sender).value = depositAmount
    }

    const githubHandle = 'your-github-username' // 🔁 Replace with your GitHub username
    this.githubBox('handle').value = githubHandle

    return this.depositors(payTxn.sender).value
  }

  @abimethod()
  public withdraw() {
    const [depositedAmount, isDeposited] = this.depositors(Txn.sender).maybe()
    assert(isDeposited, 'No deposits found for this account')

    const result = itxn
      .payment({
        receiver: Txn.sender,
        amount: depositedAmount,
        fee: 0,
      })
      .submit()

    this.depositors(Txn.sender).value = 0

    return result.amount
  }
}
