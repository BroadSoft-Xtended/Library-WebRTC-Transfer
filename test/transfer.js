var jsdom = require('mocha-jsdom');
expect = require('expect');
jsdom({});

describe('transfer', function() {

  before(function(){
    core = require('webrtc-core');
    testUA = core.testUA;
    ExSIP = core.exsip;
    testUA.createCore('sipstack');
    testUA.mockWebRTC();
    testUA.createModelAndView('transfer', {transfer: require('../'), 
      callcontrol: require('webrtc-callcontrol'),
      messages: require('webrtc-messages')});
  });

  it('transferPopup', function() {
    expect(transferview.attached).toEqual(undefined);
  });
  it('transferPopup on transfer triggered', function() {
    testUA.startCall();
    testUA.isVisible(transferview.view.find('.transferPopup'), false);
    transfer.visible = true;
    testUA.isVisible(transferview.view.find('.transferPopup'), true);
    transfer.visible = false;
    testUA.isVisible(transferview.view.find('.transferPopup'), false);
  });
  it('transferPopup on transfer rejected', function() {
    testUA.startCall();
    transfer.visible = true;
    testUA.isVisible(transferview.view.find('.transferPopup'), true);
    transferview.reject.trigger("click");
    testUA.isVisible(transferview.view.find('.transferPopup'), false);
  });
  it('hold call and invite target', function() {
    sipstack.enableAutoAnswer = false;
    
    testUA.connect();
    var sessionToTransfer = testUA.outgoingSession({
      id: "sessionToTransfer"
    });
    testUA.startCall(sessionToTransfer);
    expect(sipstack.activeSession.id).toEqual(sessionToTransfer.id);
    sessionToTransfer.hold();
    var targetSession = testUA.outgoingSession({
      id: "targetSession"
    });
    testUA.startCall(targetSession);
    expect(sipstack.activeSession.id).toEqual(targetSession.id);
    // testUA.isVisible(videobar.hangup, true);
  });

  it('hold call and invite target failed', function() {
    sipstack.enableAutoAnswer = false;
    
    testUA.connect();
    var sessionToTransfer = testUA.outgoingSession({
      id: "sessionToTransfer"
    });
    testUA.startCall(sessionToTransfer);
    sessionToTransfer.hold();
    var targetSession = testUA.outgoingSession({
      id: "targetSession"
    });
    testUA.failCall(targetSession);
    expect(sipstack.activeSession.id).toEqual(sessionToTransfer.id);
    // testUA.isVisible(videobar.hangup, true);
  });
  it('acceptTransfer triggered with empty target', function() {
    var transferTarget = null;
    
    ExSIP.UA.prototype.transfer = function(target, rtcSession) {
      transferTarget = target;
    };
    sipstack.callState = 'started';
    transfer.visible = true;
    testUA.isVisible(transferview.view.find('.transferPopup'), true);
    transferview.accept.trigger("click");
    testUA.isVisible(transferview.view.find('.transferPopup'), true);
    expect(transferTarget).toEqual(null);
  });
  it('acceptTransfer triggered with target', function() {
    var transferTarget = null;
    
    ExSIP.UA.prototype.transfer = function(target, rtcSession) {
      transferTarget = target;
    };
    sipstack.callState = 'started';
    transfer.visible = true;
    testUA.isVisible(transferview.view.find('.transferPopup'), true);
    testUA.val(transferview.target, "1000@other.domain.to");
    transferview.accept.trigger("click");
    testUA.isVisible(transferview.view.find('.transferPopup'), false);
    expect(transferTarget).toEqual("sip:1000@other.domain.to");
  });
});