test = require('../node_modules/webrtc-sipstack/test/includes/common')(require('../node_modules/bdsft-sdk-test/lib/common'));
describe('transfer', function() {

  before(function(){
    test.setupLocalStorage();
    test.createModelAndView('sipstack', {
      sipstack: require('webrtc-sipstack'),
      eventbus: require('bdsft-sdk-eventbus'),
      debug: require('bdsft-sdk-debug'),
      core: require('webrtc-core')
    });
    test.createModelAndView('transfer', {transfer: require('../'), 
      callcontrol: require('webrtc-callcontrol'),
      messages: require('webrtc-messages'),
      sipstack: require('webrtc-sipstack'),
      sound: require('webrtc-sound'),
      history: require('webrtc-history'),
      stats: require('webrtc-stats')
    });
  });

  it('transferPopup', function() {
    expect(transferview.attached).toEqual(undefined);
  });
  it('transferPopup on transfer triggered', function() {
    test.startCall();
    test.isVisible(transferview.view.find('.transferPopup'), false);
    transfer.visible = true;
    test.isVisible(transferview.view.find('.transferPopup'), true);
    transfer.visible = false;
    test.isVisible(transferview.view.find('.transferPopup'), false);
  });
  it('transferPopup on transfer rejected', function() {
    test.startCall();
    transfer.visible = true;
    test.isVisible(transferview.view.find('.transferPopup'), true);
    transferview.reject.trigger("click");
    test.isVisible(transferview.view.find('.transferPopup'), false);
  });
  it('hold call and invite target', function() {
    sipstack.enableAutoAnswer = false;
    
    test.connect();
    var sessionToTransfer = test.outgoingSession({
      id: "sessionToTransfer"
    });
    test.startCall(sessionToTransfer);
    expect(sipstack.activeSession.id).toEqual(sessionToTransfer.id);
    sessionToTransfer.hold();
    var targetSession = test.outgoingSession({
      id: "targetSession"
    });
    test.startCall(targetSession);
    expect(sipstack.activeSession.id).toEqual(targetSession.id);
    // test.isVisible(videobar.hangup, true);
  });

  it('hold call and invite target failed', function() {
    sipstack.enableAutoAnswer = false;
    
    test.connect();
    var sessionToTransfer = test.outgoingSession({
      id: "sessionToTransfer"
    });
    test.startCall(sessionToTransfer);
    sessionToTransfer.hold();
    var targetSession = test.outgoingSession({
      id: "targetSession"
    });
    test.failCall(targetSession);
    expect(sipstack.activeSession.id).toEqual(sessionToTransfer.id);
    // test.isVisible(videobar.hangup, true);
  });
  it('acceptTransfer triggered with empty target', function() {
    var transferTarget = null;
    test.connectAndStartCall();
    sipstack.ua.transfer = function(target, rtcSession) {
      transferTarget = target;
    };
    transfer.visible = true;
    test.isVisible(transferview.view.find('.transferPopup'), true);
    transferview.accept.trigger("click");
    test.isVisible(transferview.view.find('.transferPopup'), true);
    expect(transferTarget).toEqual(null);
  });
  it('acceptTransfer triggered with target', function() {
    var transferTarget = null;
    test.connectAndStartCall();
    sipstack.ua.transfer = function(target, rtcSession) {
      transferTarget = target;
    };
    transfer.visible = true;
    test.isVisible(transferview.view.find('.transferPopup'), true);
    test.val(transferview.target, "1000@other.domain.to");
    transferview.accept.trigger("click");
    test.isVisible(transferview.view.find('.transferPopup'), false);
    expect(transferTarget).toEqual("sip:1000@other.domain.to");
  });
});