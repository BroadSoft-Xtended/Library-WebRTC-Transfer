module.exports = require('webrtc-core').bdsft.Model(Transfer);

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;

function Transfer(sipstack, eventbus, configuration, callcontrol) {
  var self = {};

  self.props = {
    'classes': true,
    'target': true,
    'typeAttended': true,
    'visible': true
  };

  self.bindings = {
    'classes': {
        transfer: 'visible',
        sipstack: 'callState',
        configuration: 'enableTransfer'
    }
  }

  self.listeners = function(){
    eventbus.on('viewChanged', function(e){
      if(e.view === 'transfer') {
        self.visible = e.visible;
      }
    });
  };

  self.transfer = function() {
    var target = self.target;
    if (!target) {
      eventbus.emit('message', {
        text: configuration.messageOutsideDomain,
        level: 'alert'
      });
      return;
    }
    target = callcontrol.validateDestination(target);
    if (target) {
      self.visible = false;
      sipstack.transfer(target, self.typeAttended);
    }
  };

  return self;
}