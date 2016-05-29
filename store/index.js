'use strict';

var EventEmitter = require('events').EventEmitter;

class Store extends EventEmitter {
  constructor( options ){
    super();

    this.logger = options.logger.create('Store');
    this.clientKey = options.clientKey || '__data';
    this.data = {};
    this.subStores = {};
  }

  toJSON(){
    return this.data;
  }

  use( subStore ){
    this[ subStore.name ] = Object
      .keys( subStore )
      .reduce( ( boundSubStore, key )=>{
        if ( typeof subStore[ key ] === 'function' ){
          boundSubStore[ key ] = subStore[ key ].bind( this );
        } else {
          boundSubStore[ key ] = subStore[ key ];
        }

        return boundSubStore;
      }, {} );

    return this;
  }

  getSerializedScriptData(){
    var storeJSON = JSON.stringify( this.store );
    return `<script>window.${this.clientKey} = ${storeJSON}</script>`;
  }

  applyDataSource( data ){
    for ( var key in data ){
      if ( key in this.subStores ){
        this.subStores[ key ].parse( data[ key ] );
      }
    }
  }
}

module.exports = Store;
