module.exports = require('webrtc-core').bdsft.Model(Transfer, {
  config: require('../../js/config.js')
});

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;

function Transfer(sipstack, eventbus, callcontrol, urlconfig) {
  var self = {};

  self.props = ['classes', 'target', 'typeAttended', 'visible'];

  self.bindings = {
    'classes': {
        transfer: ['visible', 'enableTransfer'],
        sipstack: 'callState'
    }
  }

  self.init = function(){
    self.enableTransfer = urlconfig.enableTransfer || self.enableTransfer;
  };

  self.transfer = function() {
    var target = self.target;
    if (!target) {
      eventbus.emptyDestination();
      return;
    }
    target = callcontrol.validateDestination(target);
    if (target) {
      self.visible = false;
      sipstack.transfer(target, self.typeAttended);
    } else {
      eventbus.invalidDestination();
    }
  };

  return self;
}