'use strict';

window.Game = (function () {
  var FRUITS = ['BAR', 'SEVEN', 'STAR', 'WATERMELON', 'BELL', 'MANGO', 'ORGANE', 'APPLE'];

  var PAYTABLE = {
    BAR: 100,
    SEVEN: 40,
    STAR: 30,
    WATERMELON: 20,
    BELL: 20,
    MANGO: 15,
    ORGANE: 10,
    APPLE: 5,
    LUCKY: 0
  };

  var CELL_ODDS = [
    10, 20, 50, 100, 5, 3, 15,
    20, 3, 0, 5, 3,
    10, 20, 3, 40, 5, 3, 15,
    30, 3, 0, 5, 3
  ];

  var WHEEL = [
    'ORGANE', 'BELL', 'BAR', 'BAR', 'APPLE', 'APPLE',
    'MANGO', 'WATERMELON', 'WATERMELON', 'LUCKY', 'APPLE',
    'ORGANE', 'ORGANE', 'BELL', 'SEVEN', 'SEVEN',
    'APPLE', 'MANGO', 'MANGO', 'STAR', 'STAR',
    'LUCKY', 'APPLE', 'BELL'
  ];

  var BET_SOUND = {
    BAR: 'Y208',
    SEVEN: 'Y207',
    STAR: 'Y206',
    WATERMELON: 'Y205',
    BELL: 'Y204',
    MANGO: 'Y203',
    ORGANE: 'Y202',
    APPLE: 'Y201'
  };

  var RESULT_SOUND = {
    BAR: 'Y108_e',
    SEVEN: 'Y107_e',
    STAR: 'Y106_e',
    WATERMELON: 'Y105_e',
    BELL: 'Y104_e',
    MANGO: 'Y103_e',
    ORGANE: 'Y102_e',
    APPLE: 'Y101_e',
    LUCKY: 'Y112-1_e'
  };

  var TOUR_START = [
    { file: 'Y021', ms: 1512 },
    { file: 'Y022', ms: 1584 },
    { file: 'Y023', ms: 1624 },
    { file: 'Y024', ms: 1684 },
    { file: 'Y025', ms: 1632 },
    { file: 'Y026', ms: 1608 },
    { file: 'Y027', ms: 1714 },
    { file: 'Y028', ms: 1560 }
  ];
  var TOUR_FAST = { file: 'Y029', ms: 309 };
  var TOUR_END = { file: 'Y030', ms: 1320 };
  var FINISH = ['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15'];

  var LIMIT_BET = 10;
  var START_CREDIT = 100;
  var COIN_PACK = 50;
  var MAX_CREDIT = 99999;
  var STORAGE_KEY = 'mariSlots.v1';

  var state = {
    credits: START_CREDIT,
    bonus: 0,
    lastWin: 0,
    pendingWin: 0,
    bets: {},
    phase: 'idle',
    wheelIndex: 0,
    hitIndices: [],
    muted: false,
    timers: [],
    intervals: [],
    raf: 0,
    blinkRaf: 0
  };

  var holdTimer = null;

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function emptyBets() {
    var bets = {};
    FRUITS.forEach(function (fruit) {
      bets[fruit] = 0;
    });
    return bets;
  }

  function totalBet() {
    return FRUITS.reduce(function (sum, fruit) {
      return sum + (state.bets[fruit] || 0);
    }, 0);
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        credits: state.credits,
        bonus: state.bonus,
        bets: state.bets,
        muted: state.muted,
        pendingWin: state.pendingWin
      }));
    } catch (err) {}
  }

  function load() {
    state.bets = emptyBets();
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      var data = JSON.parse(raw);
      if (typeof data.credits === 'number' && isFinite(data.credits)) {
        state.credits = clamp(Math.floor(data.credits), 0, MAX_CREDIT);
      }
      if (typeof data.bonus === 'number' && isFinite(data.bonus)) {
        state.bonus = clamp(Math.floor(data.bonus), 0, MAX_CREDIT);
      }
      if (data.bets && typeof data.bets === 'object') {
        FRUITS.forEach(function (fruit) {
          if (typeof data.bets[fruit] === 'number' && isFinite(data.bets[fruit])) {
            state.bets[fruit] = clamp(Math.floor(data.bets[fruit]), 0, LIMIT_BET);
          }
        });
      }
      if (typeof data.muted === 'boolean') {
        state.muted = data.muted;
      }
      if (typeof data.pendingWin === 'number' && data.pendingWin > 0) {
        state.bonus = clamp(state.bonus + Math.floor(data.pendingWin), 0, MAX_CREDIT);
        state.pendingWin = 0;
      }
    } catch (err) {}
  }

  function later(fn, ms) {
    var id = setTimeout(function () {
      state.timers = state.timers.filter(function (t) { return t !== id; });
      fn();
    }, Math.max(0, ms || 0));
    state.timers.push(id);
    return id;
  }

  function clearAllTimers() {
    state.timers.forEach(clearTimeout);
    state.timers = [];
    state.intervals.forEach(clearInterval);
    state.intervals = [];
    if (state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
    }
    if (state.blinkRaf) {
      cancelAnimationFrame(state.blinkRaf);
      state.blinkRaf = 0;
    }
    window.UI.cancelTween();
    window.AudioPool.stopLoop();
  }

  function setPhase(phase) {
    state.phase = phase;
    window.UI.setPhase(phase);
    refreshControls();
  }

  function refreshControls() {
    var idle = state.phase === 'idle';
    var collect = state.phase === 'gamble';
    var canMove = idle || collect;
    window.UI.setEnabled('go', collect || (idle && totalBet() > 0 && state.credits > 0));
    window.UI.setEnabled('leftBonus', canMove && state.credits > 0);
    window.UI.setEnabled('rightBonus', canMove && state.bonus > 0);
  }

  function computeWin(indices) {
    var total = 0;
    var i;
    var idx;
    var name;
    var odds;
    for (i = 0; i < indices.length; i++) {
      idx = indices[i];
      name = WHEEL[idx];
      if (!name || name === 'LUCKY') {
        continue;
      }
      odds = CELL_ODDS[idx];
      if (odds == null) {
        odds = PAYTABLE[name] || 0;
      }
      total += (state.bets[name] || 0) * odds;
    }
    return total;
  }

  function fruitsFromHits(indices) {
    var names = [];
    var seen = {};
    indices.forEach(function (idx) {
      var name = WHEEL[idx];
      if (name && name !== 'LUCKY' && !seen[name]) {
        seen[name] = true;
        names.push(name);
      }
    });
    return names;
  }

  function changeBet(fruit, delta) {
    var cur;
    if (state.phase !== 'idle') {
      return false;
    }
    if (FRUITS.indexOf(fruit) === -1) {
      return false;
    }
    cur = state.bets[fruit] || 0;
    if (delta > 0) {
      if (cur >= LIMIT_BET || state.credits < 1) {
        return false;
      }
      state.bets[fruit] = cur + 1;
      state.credits -= 1;
    } else if (delta < 0) {
      if (cur <= 0) {
        return false;
      }
      state.bets[fruit] = cur - 1;
      state.credits += 1;
    } else {
      return false;
    }
    window.UI.renderCredits(state.credits);
    window.UI.renderBet(fruit, state.bets[fruit]);
    persist();
    refreshControls();
    return true;
  }

  function clearBet(fruit) {
    var cur;
    if (state.phase !== 'idle') {
      return false;
    }
    if (FRUITS.indexOf(fruit) === -1) {
      return false;
    }
    cur = state.bets[fruit] || 0;
    if (cur <= 0) {
      return false;
    }
    state.bets[fruit] = 0;
    state.credits = clamp(state.credits + cur, 0, MAX_CREDIT);
    window.UI.renderCredits(state.credits);
    window.UI.renderBet(fruit, 0);
    persist();
    refreshControls();
    return true;
  }

  function allPlus(delta) {
    var i;
    var any = false;
    if (state.phase !== 'idle') {
      return false;
    }
    for (i = 0; i < FRUITS.length; i++) {
      if (changeBet(FRUITS[i], delta)) {
        any = true;
      }
      if (delta > 0 && state.credits < 1) {
        break;
      }
    }
    if (any) {
      window.AudioPool.play(delta > 0 ? 'Y208' : 'Y201');
    }
    return any;
  }

  function insertCoins(amount) {
    var n = amount || COIN_PACK;
    window.AudioPool.unlock();
    state.credits = clamp(state.credits + n, 0, MAX_CREDIT);
    window.UI.renderCredits(state.credits);
    window.AudioPool.play('Y010');
    persist();
    refreshControls();
  }

  function toggleMute() {
    state.muted = !state.muted;
    window.AudioPool.setMuted(state.muted);
    window.UI.setMuteLabel(state.muted);
    persist();
  }

  function stopHold() {
    if (holdTimer != null) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }

  function startHold(fn) {
    var delay = 150;
    stopHold();
    function tick() {
      holdTimer = null;
      if (fn() === false) {
        return;
      }
      delay = Math.max(30, Math.round(delay * 0.84));
      holdTimer = setTimeout(tick, delay);
    }
    holdTimer = setTimeout(tick, delay);
  }

  function stopBlink() {
    if (state.blinkRaf) {
      cancelAnimationFrame(state.blinkRaf);
      state.blinkRaf = 0;
    }
  }

  function startBlink(indices) {
    var on = true;
    var last = 0;
    stopBlink();
    window.UI.setLights(indices);
    function frame(now) {
      if (!last) {
        last = now;
      }
      if (now - last >= 180) {
        last = now;
        on = !on;
        window.UI.setLights(on ? indices : []);
      }
      state.blinkRaf = requestAnimationFrame(frame);
    }
    state.blinkRaf = requestAnimationFrame(frame);
  }

  function finishRound() {
    stopBlink();
    window.UI.clearOddsWin();
    if (state.hitIndices.length) {
      window.UI.setLights(state.hitIndices);
    } else {
      window.UI.setLights([state.wheelIndex]);
    }
    state.pendingWin = 0;
    setPhase('idle');
    persist();
  }

  function countMs(amount) {
    return clamp(450 + Math.abs(amount) * 4, 450, 1000);
  }

  function collectWin() {
    var gain;
    var fromBonus;
    var toBonus;
    var ms;
    if (state.phase !== 'gamble') {
      return;
    }
    gain = state.pendingWin;
    if (gain <= 0) {
      finishRound();
      return;
    }
    setPhase('payout');
    fromBonus = state.bonus;
    toBonus = clamp(fromBonus + gain, 0, MAX_CREDIT);
    state.bonus = toBonus;
    state.pendingWin = 0;
    state.lastWin = 0;
    ms = countMs(gain);
    persist();
    window.AudioPool.stopBgm();
    window.AudioPool.play('C01');
    window.UI.animateNumber('result', gain, 0, ms, window.UI.renderResult);
    window.UI.animateNumber('bonus', fromBonus, toBonus, ms, window.UI.renderBonus);
    later(function () {
      finishRound();
    }, ms + 40);
  }

  function transferOne(fromBonus) {
    if (state.phase !== 'idle' && state.phase !== 'gamble') {
      return false;
    }
    if (fromBonus) {
      if (state.bonus < 1) {
        return false;
      }
      state.bonus -= 1;
      state.credits = clamp(state.credits + 1, 0, MAX_CREDIT);
    } else {
      if (state.credits < 1) {
        return false;
      }
      state.credits -= 1;
      state.bonus = clamp(state.bonus + 1, 0, MAX_CREDIT);
    }
    window.UI.renderBonus(state.bonus);
    window.UI.renderCredits(state.credits);
    persist();
    refreshControls();
    return true;
  }

  function payout(indices) {
    var win;
    var name;
    setPhase('payout');
    state.hitIndices = indices.slice();
    win = computeWin(indices);
    state.lastWin = win;
    state.pendingWin = win;
    window.UI.setLights(indices);
    startBlink(indices);
    window.UI.setOddsWin(fruitsFromHits(indices));
    name = WHEEL[indices[0]];
    if (name && RESULT_SOUND[name]) {
      window.AudioPool.play(RESULT_SOUND[name]);
    }
    window.UI.animateNumber('result', 0, win, 480, window.UI.renderResult);
    later(function () {
      window.AudioPool.playBgm(FINISH[randomInt(0, FINISH.length - 1)]);
      if (win > 0) {
        setPhase('gamble');
      } else {
        later(finishRound, 400);
      }
    }, 900);
  }

  function animateFly(startIdx, steps, done) {
    var step = 0;
    var last = 0;
    var acc = 0;
    var interval = 60;
    function frame(now) {
      var idx;
      if (!last) {
        last = now;
      }
      acc += now - last;
      last = now;
      while (acc >= interval && step < steps) {
        acc -= interval;
        step += 1;
        idx = (startIdx + step - 1) % 24;
        window.UI.setLights(state.hitIndices.concat([idx]));
      }
      if (step < steps) {
        state.raf = requestAnimationFrame(frame);
      } else {
        state.raf = 0;
        done((startIdx + steps - 1) % 24);
      }
    }
    state.raf = requestAnimationFrame(frame);
  }

  function runShot(from, total, doneCount) {
    var fly;
    if (doneCount >= total) {
      payout(state.hitIndices);
      return;
    }
    window.AudioPool.play(doneCount === 0 ? 'Y003' : 'Y009', true);
    fly = randomInt(6, 23);
    later(function () {
      window.AudioPool.stopLoop();
      if (fly < 10) {
        window.AudioPool.play('Y014');
      }
      animateFly((from + 1) % 24, fly, function (land) {
        window.AudioPool.play('Y001');
        state.hitIndices.push(land);
        state.wheelIndex = land;
        window.UI.setLights(state.hitIndices);
        later(function () {
          runShot(land, total, doneCount + 1);
        }, 225);
      });
    }, randomInt(8, 10) * 100);
  }

  function startLuckyShoot(origin) {
    setPhase('shooting');
    state.hitIndices = [origin];
    window.UI.setLights([origin]);
    window.AudioPool.play('Y112-1_e');
    later(function () {
      window.AudioPool.play('Y002');
      later(function () {
        window.AudioPool.play('Y005');
        later(function () {
          runShot(origin, randomInt(1, 2), 0);
        }, 832);
      }, 311);
    }, 400);
  }

  function onSpinLand(index) {
    var name = WHEEL[index];
    window.AudioPool.stopLoop();
    state.wheelIndex = index;
    state.hitIndices = [index];
    window.UI.setLights([index]);
    if (name === 'LUCKY') {
      startLuckyShoot(index);
    } else {
      payout([index]);
    }
  }

  function delaysForPhase(count, fromMs, toMs, totalMs) {
    var i;
    var t;
    var raw = [];
    var out = [];
    var sum = 0;
    var scale;
    var d;
    var rest;
    if (count <= 0) {
      return [];
    }
    for (i = 0; i < count; i++) {
      t = count === 1 ? 1 : i / (count - 1);
      d = fromMs + (toMs - fromMs) * t;
      raw.push(d);
      sum += d;
    }
    scale = totalMs / Math.max(sum, 1);
    sum = 0;
    for (i = 0; i < count - 1; i++) {
      d = Math.max(16, raw[i] * scale);
      out.push(d);
      sum += d;
    }
    rest = totalMs - sum;
    out.push(Math.max(16, rest));
    return out;
  }

  function animateWheel(from, target, done) {
    var start = TOUR_START[randomInt(0, TOUR_START.length - 1)];
    var n1 = 12;
    var n3 = 16;
    var remainder = ((target - from - n1 - n3) % 24 + 24) % 24;
    var n2 = 5 * 24 + remainder;
    var fastDelays = [];
    var i;
    for (i = 0; i < n2; i++) {
      fastDelays.push(28);
    }
    var delays = delaysForPhase(n1, 150, 42, start.ms)
      .concat(fastDelays)
      .concat(delaysForPhase(n3, 42, 175, TOUR_END.ms));
    var totalSteps = delays.length;
    var step = 0;
    var last = 0;
    var acc = 0;
    var soundPhase = 'start';

    window.AudioPool.playTour(start.file, false);

    function frame(now) {
      var need;
      var idx;
      if (!last) {
        last = now;
      }
      acc += now - last;
      last = now;
      need = delays[Math.min(step, totalSteps - 1)];
      while (acc >= need && step < totalSteps) {
        acc -= need;
        step += 1;
        idx = (from + step) % 24;
        state.wheelIndex = idx;
        window.UI.setLights([idx]);
        if (soundPhase === 'start' && step >= n1 - 1) {
          soundPhase = 'fast';
          window.AudioPool.playTour(TOUR_FAST.file, true);
        } else if (soundPhase === 'fast' && step >= n1 + n2) {
          soundPhase = 'end';
          window.AudioPool.playTour(TOUR_END.file, false);
        }
        need = delays[Math.min(step, totalSteps - 1)];
      }
      if (step < totalSteps) {
        state.raf = requestAnimationFrame(frame);
      } else {
        state.raf = 0;
        state.wheelIndex = target;
        window.UI.setLights([target]);
        done(target);
      }
    }
    state.raf = requestAnimationFrame(frame);
  }

  function startSpin() {
    var from;
    var target;
    if (state.phase !== 'idle') {
      return;
    }
    if (state.credits < 1 || totalBet() <= 0) {
      window.AudioPool.play('Y016');
      return;
    }
    stopHold();
    clearAllTimers();
    window.AudioPool.stopAll();
    stopBlink();
    window.UI.clearOddsWin();
    state.lastWin = 0;
    state.pendingWin = 0;
    window.UI.renderResult(0);
    setPhase('spinning');
    from = state.wheelIndex;
    target = randomInt(0, 23);
    window.UI.clearLights();
    animateWheel(from, target, onSpinLand);
  }

  function pressGo() {
    window.AudioPool.unlock();
    if (state.phase === 'idle') {
      startSpin();
    } else if (state.phase === 'gamble') {
      window.AudioPool.stopAll();
      collectWin();
    }
  }

  function onButtonDown(id, button) {
    window.AudioPool.unlock();
    window.UI.setPressed(id, true);
    if (id === 'go') {
      pressGo();
      return;
    }
    if (id === 'leftBonus') {
      if (transferOne(false)) {
        window.AudioPool.play('Y201');
        startHold(function () {
          if (!transferOne(false)) {
            return false;
          }
          window.AudioPool.play('Y201');
        });
      } else {
        window.AudioPool.play('Y016');
      }
      return;
    }
    if (id === 'rightBonus') {
      if (transferOne(true)) {
        window.AudioPool.play('Y208');
        startHold(function () {
          if (!transferOne(true)) {
            return false;
          }
          window.AudioPool.play('Y208');
        });
      } else {
        window.AudioPool.play('Y016');
      }
      return;
    }
    if (id === 'onesix' || id === 'eighthirteen') {
      return;
    }
    if (state.phase !== 'idle') {
      return;
    }
    if (id === 'allplus1') {
      if (button !== 2 && state.credits < 1) {
        window.AudioPool.play('Y016');
        return;
      }
      (function (delta) {
        allPlus(delta);
        startHold(function () {
          return allPlus(delta);
        });
      }(button === 2 ? -1 : 1));
      return;
    }
    if (FRUITS.indexOf(id) !== -1) {
      if ((state.bets[id] || 0) >= LIMIT_BET) {
        if (clearBet(id)) {
          window.AudioPool.play(BET_SOUND[id]);
        }
        return;
      }
      if (state.credits < 1) {
        window.AudioPool.play('Y016');
        return;
      }
      if (changeBet(id, 1)) {
        window.AudioPool.play(BET_SOUND[id]);
      }
      startHold(function () {
        if (!changeBet(id, 1)) {
          return false;
        }
        window.AudioPool.play(BET_SOUND[id]);
      });
    }
  }

  function onButtonUp() {
    stopHold();
    window.UI.releaseAll();
  }

  function onKeyDown(e) {
    if (e.repeat) {
      return;
    }
    if (e.code === 'Space' || e.keyCode === 32) {
      e.preventDefault();
      pressGo();
    } else if (e.code === 'KeyC' || e.key === 'c' || e.key === 'C') {
      insertCoins(COIN_PACK);
    } else if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') {
      toggleMute();
    }
  }

  function init() {
    load();
    state.wheelIndex = randomInt(0, 23);
    state.phase = 'idle';
    window.AudioPool.init();
    window.AudioPool.preload(
      TOUR_START.map(function (item) { return item.file; })
        .concat([TOUR_FAST.file, TOUR_END.file])
    );
    window.AudioPool.setMuted(state.muted);
    window.UI.init();
    window.UI.renderAll(state);
    refreshControls();
    window.UI.bindControls({
      onDown: onButtonDown,
      onUp: onButtonUp,
      onCoin: function () { insertCoins(COIN_PACK); },
      onMute: toggleMute
    });
    window.addEventListener('keydown', onKeyDown);
  }

  return {
    init: init,
    computeWin: computeWin,
    PAYTABLE: PAYTABLE,
    CELL_ODDS: CELL_ODDS,
    WHEEL: WHEEL,
    FRUITS: FRUITS,
    getState: function () { return state; }
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.Game.init);
} else {
  window.Game.init();
}
