module.exports = require('webrtc-core').bdsft.Model(Transfer, {
  config: require('../../js/config.js')
});

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;

function Transfer(sipstack, callcontrol, urlconfig) {
  var self = {};

  self.props = ['classes', 'target', 'visible'];

  self.bindings = {
    classes: {
        transfer: ['visible', 'enableTransfer'],
        sipstack: ['callState', 'sendVideo', 'receiveVideo']
    },
    enableTransfer: {
      urlconfig: 'enableTransfer'
    }
  }

  self.transfer = function() {
    var target = self.target;
    target = callcontrol.validateDestination(target);
    if (target) {
      self.visible = false;
      sipstack.transfer(target, false);
    }
  };

  return self;
}