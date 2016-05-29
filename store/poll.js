var Poll = require('../models/poll')

module.exports = {
  name: 'poll'

, get(){
    return (
      this.data.poll = this.data.poll || Poll.create()
    );
  }

, parse( data ){
    this.data.poll = Poll.create( data );
  }

, fetch( id ){
    // this.loader.start();

    Poll
      .create({ id })
      .fetch( ( error, poll )=>{
        if ( error ){
          return this.errorController.receive( error );
        }

        return this.receive( poll );
      });
  }

, receive( poll ){
    this.data.poll = poll;
    this.emit('change');
  }

, reset(){
    this.data.poll = Poll.create();
    this.emit('change');
  }

, save(){

  }
};