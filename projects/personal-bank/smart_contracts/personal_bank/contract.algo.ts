import { abimethod, Account, assert, BoxMap, Contract, Global } from '@algorandfoundation/algorand-typescript'

export class PersonalBank extends Contract {
  public githubBox = BoxMap<Account, string>({ keyPrefix: 'github' })

  @abimethod()
  public deposit(githubHandle: string) {
    // Validate the GitHub handle by ensuring it is not an empty string
    assert(githubHandle !== '', 'Invalid GitHub handle')

    const sender = Global.currentApplicationAddress

    this.githubBox(sender).value = githubHandle

    return githubHandle
  }
}
