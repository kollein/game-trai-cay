'use strict';

window.AudioPool = (function () {
  var SRC = 'assets/';
  var POOL_SIZE = 4;
  var pool = [];
  var muted = false;
  var unlocked = false;
  var looping = null;
  var bgm = null;
  var tourCh = [];
  var tourFlip = 0;
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
    tourCh = [createEl(), createEl()];
  }

  function unlock() {
    if (unlocked) {
      return;
    }
    unlocked = true;
    function unlockEl(ch) {
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
    }
    pool.forEach(unlockEl);
    tourCh.forEach(unlockEl);
  }

  function play(file, loop) {
    if (!file) {
      return;
    }
    unlock();
    if (muted) {
      return;
    }
    startChannel(pickChannel(!!loop), file, !!loop, !!loop);
  }

  function playBgm(file, loop) {
    if (!file) {
      return;
    }
    startChannel(pool[POOL_SIZE - 1], file, !!loop, true);
  }

  function playTour(file, loop) {
    var next;
    var prev;
    if (!file) {
      return;
    }
    unlock();
    if (muted) {
      return;
    }
    next = tourCh[tourFlip];
    prev = tourCh[1 - tourFlip];
    tourFlip = 1 - tourFlip;
    next.loop = !!loop;
    next.muted = muted;
    next.src = SRC + file + '.ogg';
    try {
      next.currentTime = 0;
    } catch (err) {}
    var playPromise = next.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {});
    }
    bgm = next;
    looping = loop ? next : null;
    if (prev && prev !== next) {
      setTimeout(function () {
        if (bgm !== prev) {
          pauseChannel(prev);
        }
      }, 50);
    }
  }

  function preload(files) {
    (files || []).forEach(function (file) {
      var el = createEl();
      el.src = SRC + file + '.ogg';
    });
  }

  function pickChannel(loop) {
    if (loop) {
      return pool[POOL_SIZE - 1];
    }
    var ch = pool[rr % (POOL_SIZE - 1)];
    rr += 1;
    return ch;
  }

  function pauseChannel(ch) {
    if (!ch) {
      return;
    }
    ch.loop = false;
    try {
      ch.pause();
    } catch (err) {}
    try {
      ch.currentTime = 0;
    } catch (err) {}
  }

  function startChannel(ch, file, loop, isBgm) {
    unlock();
    if (muted) {
      return;
    }
    if (isBgm && bgm && bgm !== ch) {
      pauseChannel(bgm);
    }
    if (looping && looping !== ch) {
      pauseChannel(looping);
    }
    ch.loop = !!loop;
    ch.muted = muted;
    ch.src = SRC + file + '.ogg';
    try {
      ch.currentTime = 0;
    } catch (err) {}
    if (isBgm || loop) {
      bgm = ch;
    }
    looping = loop ? ch : (looping === ch ? null : looping);
    var playPromise = ch.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {});
    }
  }

  function stopBgm() {
    pauseChannel(bgm);
    if (looping === bgm) {
      looping = null;
    }
    bgm = null;
  }

  function stopLoop() {
    pauseChannel(looping);
    if (bgm === looping) {
      bgm = null;
    }
    looping = null;
    stopBgm();
  }

  function stopAll() {
    var i;
    looping = null;
    bgm = null;
    for (i = 0; i < pool.length; i++) {
      pauseChannel(pool[i]);
    }
    for (i = 0; i < tourCh.length; i++) {
      pauseChannel(tourCh[i]);
    }
  }

  function setMuted(value) {
    muted = !!value;
    pool.forEach(function (ch) {
      ch.muted = muted;
    });
    tourCh.forEach(function (ch) {
      ch.muted = muted;
    });
    if (muted) {
      stopAll();
    }
  }

  return {
    init: init,
    play: play,
    playBgm: playBgm,
    playTour: playTour,
    preload: preload,
    stopLoop: stopLoop,
    stopBgm: stopBgm,
    stopAll: stopAll,
    setMuted: setMuted,
    isMuted: function () { return muted; },
    unlock: unlock
  };
})();
