import { ParatiiCore } from './paratii.core.js'
import { ParatiiDb } from './paratii.db.js'
import { ParatiiEth } from './paratii.eth.js'
import { ParatiiIPFS } from './paratii.ipfs.js'

const dopts = require('default-options')
const utils = require('./utils.js')

/**
 * Paratii Library
 * for usage, see https://github.com/Paratii-Video/paratii-contracts/tree/master/docs
 *
 */

class Paratii {
  constructor (opts = {}) {
    let defaults = {
      provider: 'http://localhost:8545',
      wsprovider: 'ws://localhost:8546',
      registryAddress: null,
      address: null, //  Ethereum address
      privateKey: null,
      mnemonic: null,
      'repo': null,
      'db.provider': String
    }
    let options = dopts(opts, defaults)

    this.config = {}
    this.config.provider = options.provider
    this.config.repo = options.repo

    if (this.config.provider === 'http://localhost:8545') {
      this.config.isTestNet = true
    } else if (this.config.provider === 'http://127.0.0.1:8545') {
      this.config.isTestNet = true
    } else {
      this.config.isTestNet = false
    }
    this.config.account = {
      address: options.address,
      privateKey: options.privateKey
    }
    this.config.registryAddress = options.registryAddress

    this.config.paratii = this
    this.core = new ParatiiCore(this.config)
    this.db = new ParatiiDb(this.config)
    this.eth = new ParatiiEth(this.config)
    this.ipfs = new ParatiiIPFS(this.config)
  }

  setAccount (address, privateKey) {
    this.eth.setAccount(address, privateKey)
  }

  setRegistryAddress (address) {
    return this.eth.setRegistryAddress(address)
  }
  async diagnose () {
    // return an array of strings with diagnostic info

    let msg, address, msgs
    let isOk = true
    msgs = []
    function log (msg) {
      msgs.push(msg)
    }
    log('Paratii was initialized with the following options:')
    log(this.config)
    log('Checking main account')
    if (this.config.account.address && this.config.account.privateKey) {
      log(`Your private key: ${this.config.account.privateKey}`)
      log(`Your private key: ${this.config.account.privateKey}`)
      log(`First wallet account: ${this.eth.web3.eth.accounts.wallet[0].address}`)
    }
    address = this.eth.getRegistryAddress()
    if (!address) {
      log('*** No registry address found!')
      log(`Value of this.config.registryAddress: ${this.config.registryAddress}`)
      isOk = false
    } else {
      log('checking deployed code of Registry...')
      msg = await this.eth.web3.eth.getCode(address)
      if (msg === '0x') {
        log(`ERROR: no code was found on the registry address ${address}`)
        log(msg)
      } else {
        log('... seems ok...')
        // log(`We found the following code on the registry address ${address}`)
        // log(msg)
      }
      log(`checking for addresses on registry@${address}`)
      let registry = await this.eth.getContract('Registry')
      log(`(registry address is ${registry.options.address})`)
      for (var name in this.eth.contracts) {
        if (name !== 'Registry') {
          address = await registry.methods.getContract(name).call()
          log(`address of ${name}: ${address}`)
        }
      }
    }
    if (isOk) {
      log('---- everything seems fine -----')
    } else {
      log('***** Something is wrong *****')
    }
    return msgs
  }
}

export { Paratii, utils, ParatiiIPFS, ParatiiDb, ParatiiEth }
