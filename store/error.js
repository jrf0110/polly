module.exports = {
  name: 'error'

, get(){
    return this.data.error;
  }

, parse( error ){
    this.data.error = error;
  }

  receive( error ){
    this.error.parse( error );
    this.emit('change');
  }

  reset(){
    delete this.data.error;
    this.emit('change');
  }
};