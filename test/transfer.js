var jsdom = require('mocha-jsdom');
expect = require('expect');
jsdom({});

describe('transfer', function() {

  before(function(){
    core = require('webrtc-core');
    testUA = core.testUA;
    ExSIP = core.exsip;
    config = {enableTransfer: true, enableCallStats: false};
    testUA.createCore('configuration', config);
    testUA.createCore('sipstack', config);
    testUA.mockWebRTC();
    testUA.createModelAndView('transfer', {transfer: require('../'), callcontrol: require('webrtc-callcontrol')});
    eventbus = bdsft_client_instances.eventbus_test;
  });

  it('transferPopup', function() {
    
    expect(transferview.attached).toEqual(false);
  });
  it('transferPopup on transfer triggered', function() {
    testUA.startCall();
    testUA.isVisible(transferview.transferPopup, false);
    eventbus.toggleView(core.constants.VIEW_TRANSFER);
    testUA.isVisible(transferview.transferPopup, true);
    eventbus.toggleView(core.constants.VIEW_TRANSFER);
    testUA.isVisible(transferview.transferPopup, false);
  });
  it('transferPopup on transfer rejected', function() {
    testUA.startCall();
    eventbus.toggleView(core.constants.VIEW_TRANSFER);
    testUA.isVisible(transferview.transferPopup, true);
    transferview.reject.trigger("click");
    testUA.isVisible(transferview.transferPopup, false);
  });
  it('hold call and invite target', function() {
    configuration.enableAutoAnswer = false;
    
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
    configuration.enableAutoAnswer = false;
    
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
    testUA.startCall();
    eventbus.toggleView(core.constants.VIEW_TRANSFER);
    testUA.isVisible(transferview.transferPopup, true);
    transferview.accept.trigger("click");
    testUA.isVisible(transferview.transferPopup, true);
    expect(transferTarget).toEqual(null);
    eventbus.toggleView(core.constants.VIEW_TRANSFER);
  });
  it('acceptTransfer triggered with target', function() {
    var transferTarget = null;
    
    ExSIP.UA.prototype.transfer = function(target, rtcSession) {
      transferTarget = target;
    };
    testUA.startCall();
    eventbus.toggleView(core.constants.VIEW_TRANSFER);
    testUA.isVisible(transferview.transferPopup, true);
    testUA.val(transferview.target, "1000@other.domain.to");
    transferview.accept.trigger("click");
    testUA.isVisible(transferview.transferPopup, false);
    expect(transferTarget).toEqual("sip:1000@other.domain.to");
  });
  it('acceptTransfer triggered with target and with attended checked', function() {
    var basicTransferTarget = null;
    var attendedTransferTarget = null;
    
    ExSIP.UA.prototype.transfer = function(target, rtcSession) {
      basicTransferTarget = target;
    };
    ExSIP.UA.prototype.attendedTransfer = function(target, rtcSession) {
      attendedTransferTarget = target;
    };
    testUA.startCall();
    eventbus.toggleView(core.constants.VIEW_TRANSFER);
    testUA.check(transferview.typeAttended, true);
    testUA.val(transferview.target, "1000@other.domain.to");
    transferview.accept.trigger("click");
    expect(attendedTransferTarget).toEqual("sip:1000@other.domain.to");
  });
});