import { EventEmitter } from 'events';
import dispatcher from '../lib/dispatcher';
import Poll from '../models/poll/db';
import PollChoice from '../models/poll-choice';
import utils from '../lib/utils';

var poll = Poll.create({});

class PollStore extends EventEmitter {
  constructor(){
    super();

    this.dispatcher = dispatcher.register( action => {
      this.logger.debug('action received', action);

      switch( action.type ){
        case 'RECEIVE_ERROR':
          this.emit( 'error', action.error );
        break;

        case 'CLEAR_POLL_ID':
          delete poll.id;
          this.emit('change');
        break;

        case 'RECEIVE_POLL':
          poll = action.poll;
          this.emit('change');
        break;

        case 'SAVE_POLL':
          var wasNew = !poll.id;
          poll.save( function( error ){
            if ( error ){
              return this.emit( 'error', error );
            }

            this.emit('change');

            if ( wasNew ){
              this.emit('create');
            }
          }.bind( this ));
        break;

        case 'UPDATE_POLL':
          utils.extend( poll, action.data );
          this.emit('change');
        break;

        case 'UPDATE_CHOICE':
          if ( action.value === '' ){
            poll.choices.splice( action.index, 1 );
          } else {
            poll.choices[ action.index ] = poll.choices[ action.index ] || PollChoice();
            poll.choices[ action.index ].title = action.value;
          }

          this.emit('change');
        break;

        case 'UPDATE_POLL_OPTIONS':
          poll.options[ action.option ] = action.value;
          this.emit('change');
        break;
      }

    });
  }

  get(){
    return poll;
  }

  setLogger( logger ){
    this.logger = logger.create('PollStore');
    return this;
  }
}

export default new PollStore();