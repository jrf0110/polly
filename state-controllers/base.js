var Store = require('../store');

class StateController {
  constructor( store, options ){
    if ( !(store instanceof Store) ){
      throw new Error('First argument must be instance of Store');
    }

    this.store = store;
  }
}

module.exports = StateController;