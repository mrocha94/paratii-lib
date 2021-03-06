const dopts = require('default-options')

/**
 * ParatiiCoreUsers
 *
 */
export class ParatiiCoreUsers {
  constructor (config) {
    let defaults = {
      'db.provider': null
    }
    let options = dopts(config, defaults, {allowUnknown: true})
    this.config = options
  }
}
