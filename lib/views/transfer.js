module.exports = require('bdsft-sdk-view')(TransferView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
});

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;

function TransferView(sound, transfer) {
  var self = {};

  self.model = transfer;
  

  self.elements = ['accept', 'reject', 'target'];

  self.listeners = function(databinder) {
    databinder.onModelPropChange('visible', function(visible){
      visible && self.target.focus();
    });
    self.accept.bind('click', function(e) {
      e.preventDefault();
      sound.playClick();
      transfer.transfer();
    });

    self.reject.bind('click', function(e) {
      e.preventDefault();
      sound.playClick();
      transfer.visible = false;
    });
  };

  return self;
}