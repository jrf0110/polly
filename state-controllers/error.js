var StateController = require('./base');
var ErrorSubStore = require('../store/error');

class ErrorStateController extends StateController {
  receive( error ){
    ErrorSubStore.parse.call( this.store, error );
    this.emit('change');
  }

  reset(){
    delete this.store.data.error;
    this.emit('change');
  }
}

module.exports = ErrorStateController;