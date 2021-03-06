'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParatiiEth = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils.js');

var _paratiiEthVids = require('./paratii.eth.vids.js');

var _paratiiEthUsers = require('./paratii.eth.users.js');

var _paratiiEthEvents = require('./paratii.eth.events.js');

var _paratiiEthWallet = require('./paratii.eth.wallet.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Web3 = require('web3');
var dopts = require('default-options');

var ParatiiEth = exports.ParatiiEth = function () {
  function ParatiiEth(config) {
    (0, _classCallCheck3.default)(this, ParatiiEth);

    var defaults = {
      provider: 'http://localhost:8545/rpc/',
      wsprovider: 'ws://localhost:8546',
      registryAddress: null,
      account: {
        address: null,
        privateKey: null
      },
      web3: null,
      isTestNet: false
    };
    var options = dopts(config, defaults, { allowUnknown: true });
    this.config = config;

    if (options.web3) {
      this.web3 = options.web3;
    } else {
      this.web3 = new Web3();
      this.web3.setProvider(new this.web3.providers.WebsocketProvider(options.wsprovider));
    }

    this.wallet = (0, _paratiiEthWallet.patchWallet)(this.web3.eth.accounts.wallet, this.config);
    this.setAccount(this.config.account.address, this.config.account.privateKey);

    this.contracts = {};
    this.contracts.ParatiiToken = this.requireContract('ParatiiToken');
    this.contracts.Avatar = this.requireContract('Avatar');
    this.contracts.Registry = this.requireContract('Registry');
    this.contracts.SendEther = this.requireContract('SendEther');
    this.contracts.Users = this.requireContract('Users');
    this.contracts.Videos = this.requireContract('Videos');
    this.contracts.Store = this.requireContract('Store');

    this.vids = new _paratiiEthVids.ParatiiEthVids(this);
    this.users = new _paratiiEthUsers.ParatiiEthUsers(this);
    this.events = new _paratiiEthEvents.ParatiiEthEvents(this);
  }

  (0, _createClass3.default)(ParatiiEth, [{
    key: 'setAccount',
    value: function setAccount(address, privateKey) {
      this.config.account.address = address;
      this.config.account.privateKey = privateKey;
      this.web3.eth.defaultAccount = address;
      if (privateKey) {
        var account = this.web3.eth.accounts.wallet.add(privateKey);
        if (account.address !== address) {
          throw Error('Private Key and Account are not compatible!');
        }
      }
    }
  }, {
    key: 'requireContract',
    value: function requireContract(contractName) {
      var artifact = require('paratii-contracts/build/contracts/' + contractName + '.json');
      var from = this.config.account.address;

      var contract = new this.web3.eth.Contract(artifact.abi, {
        from: from,
        gas: this.web3.utils.toHex(4e6),
        data: artifact.bytecode
      });
      // contract.setProvider(this.web3.currentProvider, this.web3.eth.accounts)
      return contract;
    }
  }, {
    key: 'deployContract',
    value: function deployContract(name) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var msg, contract, deployedContract;
      return _regenerator2.default.async(function deployContract$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.config.account.address) {
                _context.next = 3;
                break;
              }

              msg = 'You need an Ethereum account to write information to the blockchain - you can use .setAccount(address, [privateKey]) or specify it when creating the object';
              throw Error(msg);

            case 3:
              _context.next = 5;
              return _regenerator2.default.awrap(this.getContract(name));

            case 5:
              contract = _context.sent;
              _context.next = 8;
              return _regenerator2.default.awrap(contract.deploy({ arguments: args }).send());

            case 8:
              deployedContract = _context.sent;

              deployedContract.setProvider(this.web3.currentProvider, this.web3.eth.accounts);
              this.contracts[name] = deployedContract;
              return _context.abrupt('return', deployedContract);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }
    // TODO: this is for testing - remove this

  }, {
    key: 'sleep',
    value: function sleep(ms) {
      return _regenerator2.default.async(function sleep$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', new _promise2.default(function (resolve) {
                return setTimeout(resolve, ms);
              }));

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'deployContracts',
    value: function deployContracts() {
      var paratiiRegistry, paratiiRegistryAddress, paratiiAvatar, paratiiToken, sendEther, userRegistry, videoRegistry, videoStore;
      return _regenerator2.default.async(function deployContracts$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _regenerator2.default.awrap(this.deployContract('Registry'));

            case 2:
              paratiiRegistry = _context3.sent;
              paratiiRegistryAddress = paratiiRegistry.options.address;
              _context3.next = 6;
              return _regenerator2.default.awrap(this.setRegistryAddress(paratiiRegistry.options.address));

            case 6:
              _context3.next = 8;
              return _regenerator2.default.awrap(this.deployContract('Avatar', paratiiRegistryAddress));

            case 8:
              paratiiAvatar = _context3.sent;
              _context3.next = 11;
              return _regenerator2.default.awrap(this.deployContract('ParatiiToken'));

            case 11:
              paratiiToken = _context3.sent;
              _context3.next = 14;
              return _regenerator2.default.awrap(this.deployContract('SendEther'));

            case 14:
              sendEther = _context3.sent;
              _context3.next = 17;
              return _regenerator2.default.awrap(this.deployContract('Users', paratiiRegistryAddress));

            case 17:
              userRegistry = _context3.sent;
              _context3.next = 20;
              return _regenerator2.default.awrap(this.deployContract('Videos', paratiiRegistryAddress));

            case 20:
              videoRegistry = _context3.sent;
              _context3.next = 23;
              return _regenerator2.default.awrap(this.deployContract('Store', paratiiRegistryAddress));

            case 23:
              videoStore = _context3.sent;
              _context3.next = 26;
              return _regenerator2.default.awrap(this.getContract('Registry'));

            case 26:
              paratiiRegistry = _context3.sent;
              _context3.next = 29;
              return _regenerator2.default.awrap(paratiiRegistry.methods.registerAddress('Avatar', paratiiAvatar.options.address).send());

            case 29:
              _context3.next = 31;
              return _regenerator2.default.awrap(paratiiRegistry.methods.registerAddress('ParatiiToken', paratiiToken.options.address).send());

            case 31:
              _context3.next = 33;
              return _regenerator2.default.awrap(paratiiRegistry.methods.registerAddress('SendEther', sendEther.options.address).send());

            case 33:
              _context3.next = 35;
              return _regenerator2.default.awrap(paratiiRegistry.methods.registerAddress('Videos', videoRegistry.options.address).send());

            case 35:
              _context3.next = 37;
              return _regenerator2.default.awrap(paratiiRegistry.methods.registerAddress('Store', videoStore.options.address).send());

            case 37:
              _context3.next = 39;
              return _regenerator2.default.awrap(paratiiRegistry.methods.registerAddress('Users', userRegistry.options.address).send());

            case 39:
              _context3.next = 41;
              return _regenerator2.default.awrap(paratiiRegistry.methods.registerUint('VideoRedistributionPoolShare', this.web3.utils.toWei('0.3')));

            case 41:
              _context3.next = 43;
              return _regenerator2.default.awrap(paratiiAvatar.methods.addToWhitelist(videoStore.address));

            case 43:

              this.contracts = {
                Avatar: paratiiAvatar,
                Registry: paratiiRegistry,
                ParatiiToken: paratiiToken,
                SendEther: sendEther,
                Users: userRegistry,
                Videos: videoRegistry,
                Store: videoStore

                // await this.setContractsProvider()

              };this.config.registryAddress = paratiiRegistryAddress;

              return _context3.abrupt('return', this.contracts);

            case 46:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'setContractsProvider',
    value: function setContractsProvider() {
      var key;
      return _regenerator2.default.async(function setContractsProvider$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              for (key in this.contracts) {
                this.contracts[key].setProvider(this.web3.currentProvider, this.web3.eth.accounts);
              }

            case 1:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getContracts',
    value: function getContracts() {
      var name, contract, address;
      return _regenerator2.default.async(function getContracts$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.t0 = _regenerator2.default.keys(this.contracts);

            case 1:
              if ((_context5.t1 = _context5.t0()).done) {
                _context5.next = 11;
                break;
              }

              name = _context5.t1.value;
              contract = this.contracts[name];

              if (contract.options.address) {
                _context5.next = 9;
                break;
              }

              _context5.next = 7;
              return _regenerator2.default.awrap(this.getContractAddress(name));

            case 7:
              address = _context5.sent;

              if (address && address !== '0x0') {
                contract.options.address = address;
              }

            case 9:
              _context5.next = 1;
              break;

            case 11:
              return _context5.abrupt('return', this.contracts);

            case 12:
            case 'end':
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getContract',
    value: function getContract(name) {
      var contract, address;
      return _regenerator2.default.async(function getContract$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              contract = this.contracts[name];

              if (contract) {
                _context6.next = 3;
                break;
              }

              throw Error('No contract with name "' + name + '" is known');

            case 3:
              if (contract.options.address) {
                _context6.next = 8;
                break;
              }

              _context6.next = 6;
              return _regenerator2.default.awrap(this.getContractAddress(name));

            case 6:
              address = _context6.sent;

              if (address && address !== '0x0') {
                contract.options.address = address;
              }

            case 8:
              if (!contract.methods.constructor._ethAccounts) {
                contract.methods.constructor._ethAccounts = this.web3.eth.accounts;
              }

              return _context6.abrupt('return', contract);

            case 10:
            case 'end':
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'getContractAddress',
    value: function getContractAddress(name) {
      var registryAddress, registry, address;
      return _regenerator2.default.async(function getContractAddress$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              registryAddress = this.getRegistryAddress();

              if (!(name === 'Registry')) {
                _context7.next = 3;
                break;
              }

              return _context7.abrupt('return', registryAddress);

            case 3:
              if (registryAddress) {
                _context7.next = 5;
                break;
              }

              throw Error('No registry address configured');

            case 5:
              _context7.prev = 5;
              _context7.next = 8;
              return _regenerator2.default.awrap(this.getContract('Registry'));

            case 8:
              registry = _context7.sent;

              if (registry) {
                _context7.next = 11;
                break;
              }

              throw Error('No registry contract!');

            case 11:
              _context7.next = 13;
              return _regenerator2.default.awrap(registry.methods.getContract(name).call());

            case 13:
              address = _context7.sent;
              return _context7.abrupt('return', address);

            case 17:
              _context7.prev = 17;
              _context7.t0 = _context7['catch'](5);
              throw _context7.t0;

            case 20:
            case 'end':
              return _context7.stop();
          }
        }
      }, null, this, [[5, 17]]);
    }
  }, {
    key: 'getRegistryAddress',
    value: function getRegistryAddress() {
      return this.config.registryAddress;
    }
  }, {
    key: 'setRegistryAddress',
    value: function setRegistryAddress(registryAddress) {
      this.config.registryAddress = registryAddress;
      for (var name in this.contracts) {
        var contract = this.contracts[name];
        contract.options.address = undefined;
      }
    }
  }, {
    key: 'balanceOf',
    value: function balanceOf(address, symbol) {
      var balance, balances, contract;
      return _regenerator2.default.async(function balanceOf$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              balance = void 0;
              balances = {};

              // TODO: use default-options for argument type checking

              if (!(symbol && !['PTI', 'ETH'].includes(symbol))) {
                _context8.next = 4;
                break;
              }

              throw Error('Unknown symbol "' + symbol + '", must be one of "ETH", "PTI"');

            case 4:
              if (!(!symbol || symbol === 'ETH')) {
                _context8.next = 9;
                break;
              }

              _context8.next = 7;
              return _regenerator2.default.awrap(this.web3.eth.getBalance(address));

            case 7:
              balance = _context8.sent;

              balances.ETH = balance;

            case 9:
              if (!(!symbol || symbol === 'PTI')) {
                _context8.next = 17;
                break;
              }

              _context8.next = 12;
              return _regenerator2.default.awrap(this.getContract('ParatiiToken'));

            case 12:
              contract = _context8.sent;
              _context8.next = 15;
              return _regenerator2.default.awrap(contract.methods.balanceOf(address).call());

            case 15:
              balance = _context8.sent;

              balances.PTI = balance;

            case 17:
              if (!symbol) {
                _context8.next = 21;
                break;
              }

              return _context8.abrupt('return', balance);

            case 21:
              return _context8.abrupt('return', balances);

            case 22:
            case 'end':
              return _context8.stop();
          }
        }
      }, null, this);
    }
    // async _transferETH (beneficiary, amount) {
    //   // @args amount is in Wei
    //   // TODO: use the SendEther contract
    //   // TODO: this will only work on testrpc with unlocked accounts..
    //   let from = this.config.account.address
    //   if (!from) {
    //     throw Error('No account set! Cannot send transactions')
    //   }
    //   if (!beneficiary) {
    //     throw Error('No beneficiary given.')
    //   }
    //   from = add0x(from)
    //   beneficiary = add0x(beneficiary)
    //
    //   let result = await this.web3.eth.sendTransaction({
    //     from: from,
    //     to: beneficiary,
    //     value: amount,
    //     gasPrice: 20000000000,
    //     gas: 21000
    //   })
    //   return result
    // }

  }, {
    key: '_transferETH',
    value: function _transferETH(beneficiary, amount, description) {
      var contract, from, result;
      return _regenerator2.default.async(function _transferETH$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return _regenerator2.default.awrap(this.getContract('SendEther'));

            case 2:
              contract = _context9.sent;

              if (!(!contract.options || !contract.options.address)) {
                _context9.next = 5;
                break;
              }

              throw Error('No SendEther contract known - please run paratii.diagnose()');

            case 5:
              from = this.config.account.address;

              if (from) {
                _context9.next = 8;
                break;
              }

              throw Error('No account set! Cannot send transactions');

            case 8:

              from = (0, _utils.add0x)(from);
              beneficiary = (0, _utils.add0x)(beneficiary);

              _context9.next = 12;
              return _regenerator2.default.awrap(contract.methods.transfer(beneficiary, description).send({ value: amount }));

            case 12:
              result = _context9.sent;
              return _context9.abrupt('return', result);

            case 14:
            case 'end':
              return _context9.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: '_transferPTI',
    value: function _transferPTI(beneficiary, amount) {
      var contract, from, result;
      return _regenerator2.default.async(function _transferPTI$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.next = 2;
              return _regenerator2.default.awrap(this.getContract('ParatiiToken'));

            case 2:
              contract = _context10.sent;

              if (!(!contract.options || !contract.options.address)) {
                _context10.next = 5;
                break;
              }

              throw Error('No ParatiiToken contract known - please run paratii.diagnose()');

            case 5:
              from = this.config.account.address;

              if (from) {
                _context10.next = 8;
                break;
              }

              throw Error('No account set! Cannot send transactions');

            case 8:
              from = (0, _utils.add0x)(from);
              beneficiary = (0, _utils.add0x)(beneficiary);

              _context10.next = 12;
              return _regenerator2.default.awrap(contract.methods.transfer(beneficiary, amount).send());

            case 12:
              result = _context10.sent;
              return _context10.abrupt('return', result);

            case 14:
            case 'end':
              return _context10.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'transfer',
    value: function transfer(beneficiary, amount, symbol, description) {
      return _regenerator2.default.async(function transfer$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              if (!(symbol === 'ETH')) {
                _context11.next = 4;
                break;
              }

              return _context11.abrupt('return', this._transferETH(beneficiary, amount, description));

            case 4:
              if (!(symbol === 'PTI')) {
                _context11.next = 6;
                break;
              }

              return _context11.abrupt('return', this._transferPTI(beneficiary, amount));

            case 6:
            case 'end':
              return _context11.stop();
          }
        }
      }, null, this);
    }
  }]);
  return ParatiiEth;
}();