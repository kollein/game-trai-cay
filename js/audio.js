'use strict';

window.AudioPool = (function () {
  var SRC = 'assets/';
  var POOL_SIZE = 4;
  var pool = [];
  var muted = false;
  var unlocked = false;
  var looping = null;
  var rr = 0;

  function createEl() {
    var audio = new Audio();
    audio.preload = 'auto';
    return audio;
  }

  function init() {
    var i;
    pool = [];
    for (i = 0; i < POOL_SIZE; i++) {
      pool.push(createEl());
    }
  }

  function unlock() {
    if (unlocked) {
      return;
    }
    unlocked = true;
    pool.forEach(function (ch) {
      ch.muted = true;
      var p = ch.play();
      if (p && p.then) {
        p.then(function () {
          ch.pause();
          ch.muted = muted;
        }).catch(function () {
          ch.muted = muted;
        });
      } else {
        ch.muted = muted;
      }
    });
  }

  function play(file, loop) {
    if (!file) {
      return;
    }
    unlock();
    if (muted) {
      return;
    }
    var ch;
    if (loop) {
      ch = pool[POOL_SIZE - 1];
      if (looping && looping !== ch) {
        looping.loop = false;
        looping.pause();
      }
      looping = ch;
      ch.loop = true;
    } else {
      ch = pool[rr % (POOL_SIZE - 1)];
      rr += 1;
      ch.loop = false;
      if (looping === ch) {
        looping = null;
      }
    }
    ch.muted = muted;
    ch.src = SRC + file + '.ogg';
    ch.currentTime = 0;
    var playPromise = ch.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {});
    }
  }

  function stopLoop() {
    if (!looping) {
      return;
    }
    looping.loop = false;
    looping.pause();
    looping = null;
  }

  function setMuted(value) {
    muted = !!value;
    pool.forEach(function (ch) {
      ch.muted = muted;
    });
    if (muted) {
      stopLoop();
    }
  }

  return {
    init: init,
    play: play,
    stopLoop: stopLoop,
    setMuted: setMuted,
    isMuted: function () { return muted; },
    unlock: unlock
  };
})();
