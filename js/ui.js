'use strict';

window.UI = (function () {
  var PHOTO = 'assets/480/';
  var MACHINE_W = 480;
  var MACHINE_H = 800;

  var SERIES = {
    img: 'ziti_jp',
    cells: [[1, 0], [24, 0], [47, 0], [70, 0], [93, 0], [116, 0], [137, 0], [159, 0], [183, 0], [207, 0]],
    wh: [23, 33],
    space: 23,
    group: {
      bonus: [198, 100],
      credit: [417, 100],
      resultSB: [243, 403]
    }
  };

  var SERIES_BET = {
    img: 'paidaxiaoshuzi',
    cells: [[0, 0], [18, 0], [36, 0], [54, 0], [71, 0], [89, 0], [107, 0], [126, 0], [143, 0], [161, 0]],
    wh: [18, 29],
    space: 18,
    group: {
      BAR: [46, 668],
      SEVEN: [101, 668],
      STAR: [157, 668],
      WATERMELON: [213, 668],
      BELL: [268, 668],
      MANGO: [324, 668],
      ORGANE: [381, 668],
      APPLE: [436, 668]
    }
  };

  var EFFECT_LIGHTS = {
    topLmachine: { spriteXY: [70, 934], WH: [222, 38], LT: [129, 20] },
    midJPmachine: { spriteXY: [459, 75], WH: [67, 67], LT: [207, 300] },
    fourty: { spriteXY: [126, 507], WH: [52, 30], LT: [76, 630] },
    thirdty: { spriteXY: [180, 507], WH: [52, 30], LT: [126, 630] },
    twenty: { spriteXY: [308, 777], WH: [52, 30], LT: [176, 630] },
    twenty1: { spriteXY: [308, 777], WH: [52, 30], LT: [250, 630] },
    fifteen: { spriteXY: [362, 777], WH: [52, 30], LT: [300, 630] },
    ten: { spriteXY: [396, 896], WH: [52, 30], LT: [350, 630] }
  };

  var ODDS_FOR_FRUIT = {
    BAR: 'midJPmachine',
    SEVEN: 'fourty',
    STAR: 'thirdty',
    WATERMELON: 'twenty',
    BELL: 'twenty1',
    MANGO: 'fifteen',
    ORGANE: 'ten'
  };

  var CONTROLL = {
    allplus1: { pngOn: 'anniu_all+1_01', pngOnclick: 'anniu_all+1_02', pngOff: 'anniu_all+1_03', pngOffclick: 'anniu_all+1_04', WH: [59, 64], LT: [18, 0] },
    leftBonus: { pngOn: 'anniu_zuojian_01', pngOnclick: 'anniu_zuojian_02', pngOff: 'anniu_zuojian_03', pngOffclick: 'anniu_zuojian_04', WH: [99, 59], LT: [61, 0] },
    rightBonus: { pngOn: 'anniu_youjian_01', pngOnclick: 'anniu_youjian_02', pngOff: 'anniu_youjian_03', pngOffclick: 'anniu_youjian_04', WH: [99, 59], LT: [142, 0] },
    onesix: { pngOn: 'anniu_1-7_01', pngOnclick: 'anniu_1-7_02', pngOff: 'anniu_1-7_03', pngOffclick: 'anniu_1-7_04', WH: [59, 64], LT: [229, 0] },
    eighthirteen: { pngOn: 'anniu_8-14_01', pngOnclick: 'anniu_8-14_02', pngOff: 'anniu_8-14_03', pngOffclick: 'anniu_8-14_04', WH: [59, 64], LT: [293, 0] },
    go: { pngOn: 'anniu_kaishi_01', pngOnclick: 'anniu_kaishi_02', pngOff: 'anniu_kaishi_03', pngOffclick: 'anniu_kaishi_04', WH: [114, 63], LT: [358, 0] },
    BAR: { pngOn: 'anniu_bar_01', pngOnclick: 'anniu_bar_02', pngOff: 'anniu_bar_03', pngOffclick: 'anniu_bar_04', WH: [59, 64], LT: [0, 142] },
    SEVEN: { pngOn: 'anniu_77_01', pngOnclick: 'anniu_77_02', pngOff: 'anniu_77_03', pngOffclick: 'anniu_77_04', WH: [59, 64], LT: [60, 142] },
    STAR: { pngOn: 'anniu_xingxing_01', pngOnclick: 'anniu_xingxing_02', pngOff: 'anniu_xingxing_03', pngOffclick: 'anniu_xingxing_04', WH: [59, 64], LT: [119, 142] },
    WATERMELON: { pngOn: 'anniu_xigua_01', pngOnclick: 'anniu_xigua_02', pngOff: 'anniu_xigua_03', pngOffclick: 'anniu_xigua_04', WH: [59, 64], LT: [178, 142] },
    BELL: { pngOn: 'anniu_tongzhong_01', pngOnclick: 'anniu_tongzhong_02', pngOff: 'anniu_tongzhong_03', pngOffclick: 'anniu_tongzhong_04', WH: [59, 64], LT: [241, 142] },
    MANGO: { pngOn: 'anniu_ningmeng_01', pngOnclick: 'anniu_ningmeng_02', pngOff: 'anniu_ningmeng_03', pngOffclick: 'anniu_ningmeng_04', WH: [59, 64], LT: [299, 142] },
    ORGANE: { pngOn: 'anniu_juzi_01', pngOnclick: 'anniu_juzi_02', pngOff: 'anniu_juzi_03', pngOffclick: 'anniu_juzi_04', WH: [59, 64], LT: [358, 142] },
    APPLE: { pngOn: 'anniu_pingguo_01', pngOnclick: 'anniu_pingguo_02', pngOff: 'anniu_pingguo_03', pngOffclick: 'anniu_pingguo_04', WH: [59, 64], LT: [420, 142] }
  };

  var FRUIT_LIGHT = {
    spriteIMG: '002',
    WH: [84, 84],
    SPRITE: [[396, 809], [234, 88], [320, 2], [414, 928], [234, 260], [234, 174], [234, 432], [222, 711], [222, 625], [308, 604], [234, 260], [308, 690], [396, 809], [234, 88], [320, 88], [320, 174], [234, 260], [234, 346], [234, 432], [222, 539], [328, 930], [308, 518], [234, 260], [234, 2]],
    LT: [[25, 131], [83, 131], [141, 131], [198, 131], [256, 131], [314, 131], [371, 131], [371, 189], [371, 247], [371, 305], [371, 362], [371, 420], [371, 478], [314, 478], [256, 478], [198, 478], [140, 478], [83, 478], [25, 478], [25, 420], [25, 362], [25, 305], [25, 247], [25, 189]]
  };

  var FRUITS = ['BAR', 'SEVEN', 'STAR', 'WATERMELON', 'BELL', 'MANGO', 'ORGANE', 'APPLE'];
  var BET_BTNS = FRUITS.concat(['allplus1']);

  var machine;
  var itemLight;
  var controllBet;
  var btnMute;
  var btnCoin;
  var phase = 'idle';
  var pressed = {};
  var enabled = {};
  var tweenRafs = {};

  function $(id) {
    return document.getElementById(id);
  }

  function cssUrl(file) {
    return 'url(' + PHOTO + file + '.png)';
  }

  function spriteBg(file, xy, wh, lt) {
    return 'background:' + cssUrl(file) + ' -' + xy[0] + 'px -' + xy[1] + 'px;width:' + wh[0] + 'px;height:' + wh[1] + 'px;left:' + lt[0] + 'px;top:' + lt[1] + 'px;';
  }

  function createDiv(id, className) {
    var el = document.createElement('div');
    if (id) {
      el.id = id;
    }
    if (className) {
      el.className = className;
    }
    return el;
  }

  function renderDigits(container, value, spec, origin, extraSpace, scale) {
    var n = Math.max(0, Math.floor(Number(value) || 0));
    var digits = String(n).split('').reverse();
    var html = '';
    var i;
    var d;
    var x;
    var space = spec.space + (extraSpace || 0);
    for (i = 0; i < digits.length; i++) {
      d = digits[i];
      if (d < '0' || d > '9') {
        continue;
      }
      x = origin[0] - i * space;
      html += '<div class="seriesGlobal" style="' + spriteBg(spec.img, spec.cells[d], spec.wh, [x, origin[1]]) +
        (scale && scale !== 1 ? 'transform:scale(' + scale + ');' : '') + '"></div>';
    }
    container.innerHTML = html;
  }

  function ensureSeriesBox(id) {
    var box = $(id);
    if (!box) {
      box = createDiv(id, 'seriesBox');
      machine.appendChild(box);
    }
    return box;
  }

  function skinButton(id) {
    var el = $(id);
    var cfg = CONTROLL[id];
    var file;
    if (!el || !cfg) {
      return;
    }
    if (!enabled[id] && pressed[id]) {
      file = cfg.pngOffclick;
    } else if (!enabled[id]) {
      file = cfg.pngOff;
    } else if (pressed[id]) {
      file = cfg.pngOnclick;
    } else {
      file = cfg.pngOn;
    }
    el.style.background = cssUrl(file);
  }

  function setEnabled(id, on) {
    enabled[id] = !!on;
    skinButton(id);
  }

  function setPressed(id, on) {
    pressed[id] = !!on;
    skinButton(id);
  }

  function releaseAll() {
    var id;
    for (id in pressed) {
      if (pressed[id]) {
        pressed[id] = false;
        skinButton(id);
      }
    }
  }

  function setPhase(next) {
    phase = next;
    var idle = next === 'idle';
    var collect = next === 'gamble';
    var canTransfer = idle || collect;
    var i;
    for (i = 0; i < BET_BTNS.length; i++) {
      setEnabled(BET_BTNS[i], idle);
    }
    setEnabled('leftBonus', canTransfer);
    setEnabled('rightBonus', canTransfer);
    setEnabled('onesix', false);
    setEnabled('eighthirteen', false);
    setEnabled('go', idle || collect);
  }

  function createButtons() {
    var id;
    var cfg;
    var el;
    for (id in CONTROLL) {
      if (!Object.prototype.hasOwnProperty.call(CONTROLL, id)) {
        continue;
      }
      cfg = CONTROLL[id];
      el = createDiv(id, 'imgGlobal');
      el.style.cssText = 'background:' + cssUrl(cfg.pngOn) + ';width:' + cfg.WH[0] + 'px;height:' + cfg.WH[1] + 'px;left:' + cfg.LT[0] + 'px;top:' + cfg.LT[1] + 'px;';
      enabled[id] = true;
      pressed[id] = false;
      controllBet.appendChild(el);
    }
  }

  function createLights() {
    var i;
    var el;
    var xy;
    var lt;
    for (i = 0; i < 24; i++) {
      xy = FRUIT_LIGHT.SPRITE[i];
      lt = FRUIT_LIGHT.LT[i];
      el = createDiv('childITEM' + i, 'itemGlobal fruit-light');
      el.style.cssText = spriteBg(FRUIT_LIGHT.spriteIMG, xy, FRUIT_LIGHT.WH, lt);
      itemLight.appendChild(el);
    }
  }

  function createEffectLights() {
    var id;
    var cfg;
    var el;
    for (id in EFFECT_LIGHTS) {
      if (!Object.prototype.hasOwnProperty.call(EFFECT_LIGHTS, id)) {
        continue;
      }
      cfg = EFFECT_LIGHTS[id];
      el = createDiv('lightEffect' + id, 'itemGlobal odds-light');
      el.style.cssText = spriteBg('002', cfg.spriteXY, cfg.WH, cfg.LT);
      machine.appendChild(el);
    }
  }

  function createNumberBoxes() {
    ensureSeriesBox('seribonus');
    ensureSeriesBox('sericredit');
    ensureSeriesBox('seriresultSB');
    FRUITS.forEach(function (fruit) {
      ensureSeriesBox('seri' + fruit);
    });
  }

  function renderBonus(value) {
    renderDigits(ensureSeriesBox('seribonus'), value, SERIES, SERIES.group.bonus, 0, 1);
  }

  function renderCredits(value) {
    renderDigits(ensureSeriesBox('sericredit'), value, SERIES, SERIES.group.credit, 0, 1);
  }

  function renderResult(value) {
    renderDigits(ensureSeriesBox('seriresultSB'), value, SERIES, SERIES.group.resultSB, 5, 1.1);
  }

  function renderBet(fruit, value) {
    renderDigits(ensureSeriesBox('seri' + fruit), value, SERIES_BET, SERIES_BET.group[fruit], 0, 1);
  }

  function renderBets(bets) {
    FRUITS.forEach(function (fruit) {
      renderBet(fruit, bets[fruit] || 0);
    });
  }

  function cancelTween(id) {
    var key;
    if (id) {
      if (tweenRafs[id]) {
        cancelAnimationFrame(tweenRafs[id]);
        delete tweenRafs[id];
      }
      return;
    }
    for (key in tweenRafs) {
      if (Object.prototype.hasOwnProperty.call(tweenRafs, key)) {
        cancelAnimationFrame(tweenRafs[key]);
      }
    }
    tweenRafs = {};
  }

  function animateNumber(id, from, to, ms, render) {
    cancelTween(id);
    var start = performance.now();
    var span = Math.max(16, ms || 400);
    function frame(now) {
      var p = Math.min(1, (now - start) / span);
      var eased = 1 - Math.pow(1 - p, 3);
      render(Math.round(from + (to - from) * eased));
      if (p < 1) {
        tweenRafs[id] = requestAnimationFrame(frame);
      } else {
        delete tweenRafs[id];
      }
    }
    tweenRafs[id] = requestAnimationFrame(frame);
  }

  function setLightOpacity(i, opacity) {
    var el = $('childITEM' + i);
    var v;
    if (!el) {
      return;
    }
    v = opacity > 0.02 ? opacity : 0;
    el.style.opacity = String(v);
    el.classList.toggle('is-on', v > 0);
  }

  function setLights(indices) {
    var on = {};
    var i;
    (indices || []).forEach(function (idx) {
      on[idx] = true;
    });
    for (i = 0; i < 24; i++) {
      setLightOpacity(i, on[i] ? 1 : 0);
    }
  }

  function setComet(head, tail, strength) {
    var ops = [];
    var i;
    var k;
    var idx;
    var fade;
    var s = Math.max(0, Math.min(1, strength));
    for (i = 0; i < 24; i++) {
      ops[i] = 0;
    }
    if (head >= 0 && head < 24) {
      ops[head] = 1;
    }
    for (k = 1; k <= tail; k++) {
      idx = (head - k + 24) % 24;
      fade = Math.max(0.2, Math.pow(0.8, k));
      if (ops[idx] < s * fade) {
        ops[idx] = s * fade;
      }
    }
    for (i = 0; i < 24; i++) {
      setLightOpacity(i, ops[i]);
    }
  }

  function clearLights() {
    setLights([]);
  }

  function setOddsWin(fruitNames) {
    var id;
    var want = {};
    (fruitNames || []).forEach(function (name) {
      if (ODDS_FOR_FRUIT[name]) {
        want[ODDS_FOR_FRUIT[name]] = true;
      }
    });
    for (id in EFFECT_LIGHTS) {
      if (!Object.prototype.hasOwnProperty.call(EFFECT_LIGHTS, id)) {
        continue;
      }
      elToggleWin('lightEffect' + id, !!want[id] || ((id === 'topLmachine' || id === 'midJPmachine') && fruitNames && fruitNames.length));
    }
  }

  function elToggleWin(id, on) {
    var el = $(id);
    if (el) {
      el.classList.toggle('is-win', !!on);
    }
  }

  function clearOddsWin() {
    setOddsWin([]);
  }

  function scaleMachine() {
    var sx = window.innerWidth / MACHINE_W;
    var sy = window.innerHeight / MACHINE_H;
    var s = Math.min(sx, sy);
    if (!isFinite(s) || s <= 0) {
      s = 1;
    }
    machine.style.transform = 'scale(' + s + ')';
  }

  function setMuteLabel(muted) {
    if (btnMute) {
      btnMute.textContent = muted ? 'Âm: tắt' : 'Âm: bật';
    }
  }

  function bindControls(handlers) {
    controllBet.addEventListener('pointerdown', function (e) {
      var btn = e.target.closest('.imgGlobal');
      if (!btn) {
        return;
      }
      e.preventDefault();
      if (handlers.onAnyDown) {
        handlers.onAnyDown(btn.id);
      }
      if (!enabled[btn.id]) {
        return;
      }
      try {
        btn.setPointerCapture(e.pointerId);
      } catch (err) {}
      if (handlers.onDown) {
        handlers.onDown(btn.id, e.button);
      }
    });

    function up() {
      if (handlers.onUp) {
        handlers.onUp();
      }
    }

    controllBet.addEventListener('pointerup', up);
    controllBet.addEventListener('pointercancel', up);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);

    machine.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });

    if (btnCoin) {
      btnCoin.addEventListener('click', function () {
        if (handlers.onAnyDown) {
          handlers.onAnyDown('btnCoin');
        }
        if (handlers.onCoin) {
          handlers.onCoin();
        }
      });
    }
    if (btnMute) {
      btnMute.addEventListener('click', function () {
        if (handlers.onAnyDown) {
          handlers.onAnyDown('btnMute');
        }
        if (handlers.onMute) {
          handlers.onMute();
        }
      });
    }
  }

  function renderAll(state) {
    renderBonus(state.bonus);
    renderCredits(state.credits);
    renderResult(state.lastWin);
    renderBets(state.bets);
    setLights([state.wheelIndex]);
    setPhase(state.phase);
    setMuteLabel(state.muted);
  }

  function init() {
    machine = $('machineCustom');
    itemLight = $('itemLIGHT');
    controllBet = machine.querySelector('.controllBet');
    btnMute = $('btnMute');
    btnCoin = $('btnCoin');
    createEffectLights();
    createLights();
    createNumberBoxes();
    createButtons();
    setPhase('idle');
    scaleMachine();
    window.addEventListener('resize', scaleMachine);
  }

  return {
    init: init,
    bindControls: bindControls,
    setPhase: setPhase,
    setEnabled: setEnabled,
    setPressed: setPressed,
    releaseAll: releaseAll,
    renderBonus: renderBonus,
    renderCredits: renderCredits,
    renderResult: renderResult,
    renderBet: renderBet,
    renderBets: renderBets,
    renderAll: renderAll,
    animateNumber: animateNumber,
    cancelTween: cancelTween,
    setLights: setLights,
    setComet: setComet,
    clearLights: clearLights,
    setOddsWin: setOddsWin,
    clearOddsWin: clearOddsWin,
    scaleMachine: scaleMachine,
    setMuteLabel: setMuteLabel,
    FRUITS: FRUITS
  };
})();
