/* Bộ mô phỏng ECG 12 chuyển đạo: tạo tín hiệu từ mẫu hình thái (template) + nhịp (rhythm),
   vẽ lên giấy ECG chuẩn (25 mm/s, 10 mm/mV) bằng SVG, có thước đo (caliper).
   Chuyển đạo chi tính bằng phép chiếu vector mặt phẳng trán nên trục điện tim nhất quán giữa các chuyển đạo. */
(function (root) {
  "use strict";

  const LEADS = ["I", "II", "III", "aVR", "aVL", "aVF", "V1", "V2", "V3", "V4", "V5", "V6"];
  const LIMB = ["I", "II", "III", "aVR", "aVL", "aVF"];
  const PREC = ["V1", "V2", "V3", "V4", "V5", "V6"];
  const ANG = { I: 0, II: 60, III: 120, aVR: -150, aVL: -30, aVF: 90 };
  const FS = 500;

  function rng(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  const G = (x, c, s) => Math.exp(-((x - c) * (x - c)) / (2 * s * s));
  const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

  /* Chuyển đạo trước tim bình thường (mV) */
  const PREC_NORMAL = {
    V1: { p: 0.06, p2: -0.04, q: 0, r: 0.22, s: -0.95, t: -0.06 },
    V2: { p: 0.07, q: 0, r: 0.42, s: -1.4, t: 0.42 },
    V3: { p: 0.07, q: 0, r: 0.75, s: -0.85, t: 0.45 },
    V4: { p: 0.07, q: -0.03, r: 1.25, s: -0.5, t: 0.4 },
    V5: { p: 0.07, q: -0.07, r: 1.35, s: -0.22, t: 0.33 },
    V6: { p: 0.07, q: -0.07, r: 1.05, s: -0.1, t: 0.25 }
  };
  const FRONTAL_NORMAL = { p: [0.15, 60], q: [0.1, 170], r: [1.15, 55], s: [0.22, -140], rp: [0, 0], t: [0.32, 45] };
  const KEYS = ["p", "p2", "q", "r", "s", "rp", "t", "t2", "u", "st", "stSlope", "delta", "osborn", "eps", "prSeg"];

  /* Biên dịch template: trả về tham số từng chuyển đạo */
  function compile(tpl) {
    tpl = tpl || {};
    const fr = Object.assign({}, FRONTAL_NORMAL, tpl.frontal || {});
    if (tpl.axis != null) {
      fr.r = [fr.r[0], tpl.axis];
      if (!(tpl.frontal && tpl.frontal.q)) fr.q = [fr.q[0], tpl.axis + 115];
      if (!(tpl.frontal && tpl.frontal.s)) fr.s = [fr.s[0], tpl.axis + 165];
      if (!(tpl.frontal && tpl.frontal.t)) fr.t = [fr.t[0], tpl.axis - 10];
    }
    const L = {};
    for (const n of LIMB) {
      const o = {};
      for (const k of Object.keys(fr)) {
        const v = fr[k]; if (!v) continue;
        o[k] = v[0] * Math.cos(((v[1] - ANG[n]) * Math.PI) / 180);
      }
      L[n] = o;
    }
    const pc = tpl.precNormal === false ? {} : PREC_NORMAL;
    for (const n of PREC) L[n] = Object.assign({}, pc[n] || {}, (tpl.prec && tpl.prec[n]) || {});
    for (const n of LEADS) {
      for (const k of KEYS) if (L[n][k] == null) L[n][k] = 0;
      Object.assign(L[n], { wq: 1, wr: 1, ws: 1, wrp: 1, wt: 1 }, tpl.w || {}, L[n].w || {});
    }
    for (const m of tpl.mods || []) {
      const leads = m[0] === "*" ? LEADS : m[0] === "limb" ? LIMB : m[0] === "prec" ? PREC : m[0];
      const op = m[2] || "+";
      for (const n of leads) for (const k of Object.keys(m[1])) {
        const v = m[1][k];
        if (op === "=") L[n][k] = v; else if (op === "*") L[n][k] = (L[n][k] || 0) * v; else L[n][k] = (L[n][k] || 0) + v;
      }
    }
    if (tpl.qrsScale) for (const n of LEADS) for (const k of ["q", "r", "s", "rp", "delta"]) L[n][k] *= tpl.qrsScale;
    if (tpl.allScale) for (const n of LEADS) for (const k of ["p", "p2", "q", "r", "s", "rp", "t", "t2", "u", "st", "delta"]) L[n][k] *= tpl.allScale;
    const g = {
      qrs: tpl.qrs || 0.09, pr: tpl.pr || 0.16, pDur: tpl.pDur || 0.1,
      qtc: tpl.qtc || 0.41, qt: tpl.qt || null, tPeaked: !!tpl.tPeaked, tWide: tpl.tWide || 1,
      pos: Object.assign({ q: 0.12, r: 0.36, s: 0.62, rp: 0.84, delta: 0.2 }, tpl.pos || {}),
      sig: Object.assign({ q: 0.07, r: 0.1, s: 0.095, rp: 0.09, delta: 0.14 }, tpl.sig || {})
    };
    return { g, L };
  }

  /* Sóng P (τ tính từ khởi đầu P) */
  function pWave(lp, g, tau) {
    if (tau < -0.02 || tau > g.pDur + 0.04) return 0;
    let v = lp.p * G(tau, g.pDur * 0.45, g.pDur / 5.2);
    if (lp.p2) v += lp.p2 * G(tau, g.pDur * 0.78, g.pDur / 7);
    return v;
  }

  /* QRS-ST-T (τ tính từ khởi đầu QRS) */
  function qrst(lp, g, tau, qt, beat) {
    const d = g.qrs, P = g.pos, S = g.sig;
    if (tau < -0.4 || tau > qt + 0.3) return 0;
    let v = 0;
    if (beat.prSeg && lp.prSeg) {
      const a = -beat.pr + g.pDur;
      if (tau > a - 0.02 && tau < 0.02) v += lp.prSeg * smooth((tau - a + 0.02) / 0.03) * (1 - smooth((tau + 0.005) / 0.02));
    }
    const sc = beat.scale || 1;
    if (tau > -0.05 && tau < d + 0.06) {
      let q = 0;
      if (lp.q) q += lp.q * G(tau, P.q * d, S.q * d * lp.wq);
      if (lp.r) q += lp.r * G(tau, P.r * d, S.r * d * lp.wr);
      if (lp.s) q += lp.s * G(tau, P.s * d, S.s * d * lp.ws);
      if (lp.rp) q += lp.rp * G(tau, P.rp * d, S.rp * d * lp.wrp);
      if (lp.delta) q += lp.delta * G(tau, P.delta * d, S.delta * d);
      v += q * sc;
    }
    const wt = lp.wt * g.tWide;
    const sf = g.tPeaked ? 0.03 * g.tWide : 0.042 * wt, sr = g.tPeaked ? 0.03 * g.tWide : 0.07 * wt;
    const tp = Math.max(d + 0.06, qt - 2.4 * sf);
    const st0 = lp.st, st1 = lp.st + lp.stSlope;
    if (st0 || st1) {
      if (tau > 0.7 * d && tau <= d) v += st0 * smooth((tau - 0.7 * d) / (0.3 * d));
      else if (tau > d && tau <= tp) v += st0 + ((st1 - st0) * (tau - d)) / (tp - d);
      else if (tau > tp && tau < qt + 0.03) v += st1 * (1 - smooth((tau - tp) / (qt + 0.03 - tp)));
    }
    if (lp.t) v += lp.t * G(tau, tp, tau < tp ? sr : sf);
    if (lp.t2) v += lp.t2 * G(tau, tp + 0.075, 0.04);
    if (lp.u) v += lp.u * G(tau, qt + 0.1, 0.035);
    if (lp.osborn) v += lp.osborn * G(tau, d + 0.01, 0.022);
    if (lp.eps) v += lp.eps * G(tau, d + 0.025, 0.004);
    return v;
  }

  /* ---------- Bộ tạo nhịp ---------- */
  function rrJitter(r, rate, sd) { return Math.max(0.2, 60 / rate + gauss(r) * sd); }

  function genSegment(seg, t0, t1, r, out) {
    const ty = seg.type || "sinus";
    const tpl = seg.tpl || "N";
    const add = (t, o) => { if (t >= t0 - 0.6 && t < t1 + 0.2) out.beats.push(Object.assign({ t, tpl }, o)); };
    const addP = (t, o) => { if (t >= t0 - 0.3 && t < t1 + 0.2) out.atrial.push(Object.assign({ t, tpl: seg.ptpl || tpl }, o)); };
    const pr = seg.pr;
    if (ty === "sinus") {
      let t = t0 + (seg.offset != null ? seg.offset : 0.25 + r() * 0.3);
      let n = 0, prevRR = 60 / seg.rate;
      while (t < t1 + 0.4) {
        let rr = rrJitter(r, seg.rate, seg.sd != null ? seg.sd : 0.012);
        if (seg.arrhythmia) rr *= 1 + seg.arrhythmia * Math.sin((2 * Math.PI * t) / 4.2);
        n++;
        const ect = (seg.ectopic || []).find((e) => (e.every ? n % e.every === 0 : (e.at || []).includes(n)));
        if (ect) {
          const ct = t - prevRR + prevRR * (ect.coupling || 0.55);
          if (ect.kind === "pac") { addP(ct - (ect.pr || 0.14), { tpl: ect.ptpl || "PAC" }); add(ct, { pr: ect.pr || 0.14, prSeg: false, tpl: ect.tpl || "N" }); t = ct + prevRR * (ect.reset || 1.0); }
          else { add(ct, { tpl: ect.tpl || "V", pr: 0, ectopic: true }); if (ect.compensatory !== false) { addP(t - (pr || 0.16), { hidden: true }); t = t + prevRR; } else t = ct + prevRR; }
          continue;
        }
        if (seg.pause && n === seg.pause.at) { t += seg.pause.dur; continue; }
        const prThis = seg.prFn ? seg.prFn(n) : pr;
        addP(t - (prThis || 0.16));
        add(t, { pr: prThis || 0.16, prSeg: true, scale: seg.alternans ? (n % 2 ? 1 : 0.62) : 1 });
        prevRR = rr; t += rr;
      }
    } else if (ty === "af" || ty === "svt" || ty === "junctional" || ty === "vt" || ty === "aivr" || ty === "vescape") {
      let t = t0 + 0.1 + r() * 0.3;
      const tpls = seg.tpls;
      while (t < t1 + 0.4) {
        let rr = ty === "af" ? Math.max(0.24, (60 / seg.rate) * (0.62 + r() * 0.76)) : rrJitter(r, seg.rate, seg.sd != null ? seg.sd : 0.006);
        const tp = tpls ? pick(r, tpls) : tpl;
        add(t, { tpl: tp });
        if (ty === "junctional" && seg.retro) addP(t + 0.06, { tpl: "RETRO" });
        t += rr;
      }
      if (seg.dissociatedP) { let ta = t0 + r() * 0.5; while (ta < t1) { addP(ta, { tpl: "N" }); ta += 60 / seg.dissociatedP; } }
      if (ty === "af") out.fns.push({ t0, t1, kind: "af", amp: seg.fAmp != null ? seg.fAmp : 0.06 });
    } else if (ty === "flutter") {
      const fr = seg.atrialRate || 300, per = 60 / fr;
      const start = t0 + r() * per;
      out.fns.push({ t0, t1, kind: "flutter", per, start, amp: seg.fAmp || 0.3 });
      let k = 0, t = start + 0.05;
      const ratios = seg.ratio === "variable" ? [2, 4, 3, 2, 4, 2, 3] : [seg.ratio || 2];
      let i = 0;
      while (t < t1 + 0.4) { add(t + 0.17, { tpl }); const n = ratios[i++ % ratios.length]; t += n * per; k++; }
    } else if (ty === "avblock") {
      const per = 60 / seg.atrialRate;
      let ta = t0 + 0.15 + r() * 0.2, i = 0;
      const mode = seg.mode;
      while (ta < t1 + 0.4) {
        addP(ta);
        if (mode === "chb") { /* thất riêng */ }
        else if (mode === "wenck") {
          const n = seg.ratio || 4, k = i % n;
          if (k < n - 1) { const prv = 0.18 + [0, 0.12, 0.17, 0.2, 0.22][k]; add(ta + prv, { pr: prv, prSeg: true }); }
        } else if (mode === "mobitz2") {
          const n = seg.ratio || 3;
          if (i % n !== n - 1) add(ta + (seg.pr || 0.18), { pr: seg.pr || 0.18, prSeg: true });
        } else if (mode === "2to1") {
          if (i % 2 === 0) add(ta + (seg.pr || 0.18), { pr: seg.pr || 0.18, prSeg: true });
        }
        ta += per * (1 + gauss(r) * 0.01); i++;
      }
      if (mode === "chb") {
        let t = t0 + 0.4 + r() * 0.5;
        while (t < t1 + 0.4) { add(t, { tpl: seg.escTpl || "ESC" }); t += 60 / seg.ventRate; }
      }
    } else if (ty === "paced") {
      let t = t0 + 0.2 + r() * 0.2, n = 0;
      while (t < t1 + 0.4) {
        n++;
        if (seg.mode === "DDD") { out.spikes.push({ t: t - 0.16, kind: "A" }); addP(t - 0.16 + 0.01, { tpl: "N" }); }
        out.spikes.push({ t, kind: "V" });
        const fail = seg.failEvery && n % seg.failEvery === 0;
        if (!fail) add(t + 0.01, { tpl: "PACED" });
        t += 60 / seg.rate;
      }
      if (seg.underlyingP) { let ta = t0 + 0.3; while (ta < t1) { addP(ta, { tpl: "N" }); ta += 60 / seg.underlyingP; } }
    } else if (ty === "vf") {
      out.fns.push({ t0, t1, kind: "vf", amp: seg.amp || 0.45, seed: r() * 1000 });
    } else if (ty === "torsades") {
      out.fns.push({ t0, t1, kind: "tdp", amp: seg.amp || 1.1, rate: seg.rate || 250 });
    } else if (ty === "asystole") {
      if (seg.pWaves) { let ta = t0 + 0.3; while (ta < t1) { addP(ta, { tpl: "N" }); ta += 60 / seg.pWaves; } }
    }
  }
  function pick(r, arr) { // [[tpl, weight], ...]
    let s = 0; for (const a of arr) s += a[1];
    let x = r() * s; for (const a of arr) { x -= a[1]; if (x <= 0) return a[0]; }
    return arr[arr.length - 1][0];
  }

  /* Tạo tín hiệu 12 chuyển đạo */
  function generate(cfg) {
    const dur = cfg.dur || 10, r = rng(cfg.seed || 7);
    const T = {};
    const tpls = Object.assign({ N: {} }, cfg.templates || {});
    if (!tpls.RETRO) tpls.RETRO = Object.assign({}, tpls.N, { frontal: Object.assign({}, (tpls.N || {}).frontal, { p: [0.12, -90] }), prec: null });
    if (!tpls.PAC) tpls.PAC = Object.assign({}, tpls.N, { frontal: Object.assign({}, (tpls.N || {}).frontal, { p: [0.11, 20] }) });
    for (const k of Object.keys(tpls)) T[k] = compile(tpls[k]);
    const out = { beats: [], atrial: [], spikes: [], fns: [] };
    const segs = cfg.segments || [cfg.rhythm || { type: "sinus", rate: 75 }];
    let t0 = 0;
    for (const s of segs) {
      const t1 = s.dur != null ? t0 + s.dur : dur;
      genSegment(s, t0, Math.min(t1, dur), r, out);
      t0 = t1;
    }
    out.beats.sort((a, b) => a.t - b.t);
    // khoảng RR dùng tính QT
    for (let i = 0; i < out.beats.length; i++) {
      const b = out.beats[i];
      b.rr = i > 0 ? b.t - out.beats[i - 1].t : (out.beats[1] ? out.beats[1].t - b.t : 0.8);
    }
    const n = Math.round(dur * FS);
    const leads = {};
    for (const L of LEADS) leads[L] = new Float32Array(n);
    const noise = cfg.noise != null ? cfg.noise : 0.008;
    const fnSeedR = rng((cfg.seed || 7) + 99);
    const vfPhase = []; for (let k = 0; k < 6; k++) vfPhase.push([3.2 + fnSeedR() * 4, fnSeedR() * 6.28, 0.4 + fnSeedR()]);
    const leadGain = {}; for (const L of LEADS) leadGain[L] = 0.5 + fnSeedR() * 0.9;
    const afPh = []; for (let k = 0; k < 4; k++) afPh.push([5.5 + fnSeedR() * 3, fnSeedR() * 6.28]);
    const flutAmp = Object.assign({ I: 0.03, II: -1, III: -1, aVR: 0.6, aVL: 0.4, aVF: -1, V1: 0.45, V2: 0.3, V3: 0.2, V4: 0.15, V5: 0.12, V6: 0.1 }, cfg.flutterLeads || {});
    const afAmp = { I: 0.3, II: 0.7, III: 0.7, aVR: 0.5, aVL: 0.3, aVF: 0.7, V1: 1, V2: 0.7, V3: 0.5, V4: 0.4, V5: 0.3, V6: 0.3 };
    const tdpSign = { I: 0.6, II: 1, III: 0.8, aVR: -0.8, aVL: -0.4, aVF: 0.9, V1: -0.7, V2: 0.9, V3: 1, V4: 1, V5: 0.9, V6: 0.8 };

    for (const L of LEADS) {
      const sig = leads[L];
      const nr = rng((cfg.seed || 7) * 31 + L.length * 7 + L.charCodeAt(L.length - 1));
      for (const b of out.beats) {
        const C = T[b.tpl] || T.N, lp = C.L[L], g = C.g;
        const rr = Math.min(2, Math.max(0.3, b.rr));
        const qt = g.qt || g.qtc * Math.sqrt(rr);
        const i0 = Math.max(0, Math.floor((b.t - 0.4) * FS)), i1 = Math.min(n, Math.ceil((b.t + qt + 0.3) * FS));
        for (let i = i0; i < i1; i++) sig[i] += qrst(lp, g, i / FS - b.t, qt, b);
      }
      for (const a of out.atrial) {
        if (a.hidden) { /* P vẫn có nhưng thường lẫn trong QRS/T */ }
        const C = T[a.tpl] || T.N, lp = C.L[L], g = C.g;
        const i0 = Math.max(0, Math.floor((a.t - 0.02) * FS)), i1 = Math.min(n, Math.ceil((a.t + g.pDur + 0.04) * FS));
        for (let i = i0; i < i1; i++) sig[i] += pWave(lp, g, i / FS - a.t);
      }
      for (const f of out.fns) {
        const i0 = Math.max(0, Math.floor(f.t0 * FS)), i1 = Math.min(n, Math.ceil(f.t1 * FS));
        for (let i = i0; i < i1; i++) {
          const t = i / FS;
          if (f.kind === "af") {
            let v = 0; for (const [fq, ph] of afPh) v += Math.sin(2 * Math.PI * fq * t + ph + L.length);
            sig[i] += (f.amp * afAmp[L] * v) / 2.2;
          } else if (f.kind === "flutter") {
            const x = (((t - f.start) / f.per) % 1 + 1) % 1;
            const sawN = x < 0.7 ? 0.5 - x / 0.7 : -0.5 + (x - 0.7) / 0.3; // dốc xuống chậm, dốc lên nhanh
            sig[i] -= f.amp * flutAmp[L] * sawN * 0.9;
          } else if (f.kind === "vf") {
            let v = 0;
            for (const [fq, ph, a] of vfPhase) v += a * Math.sin(2 * Math.PI * fq * t + ph + L.charCodeAt(0)) * (0.6 + 0.4 * Math.sin(0.9 * t + fq));
            sig[i] += (f.amp * leadGain[L] * v) / 2.2;
          } else if (f.kind === "tdp") {
            const tt = t - f.t0, fq = f.rate / 60;
            const env = Math.cos((Math.PI * tt) / 1.7);
            const ramp = smooth(tt / 0.25) * (1 - smooth((tt - (f.t1 - f.t0) + 0.3) / 0.3));
            const ph = 2 * Math.PI * fq * tt;
            const wave = Math.sin(ph) + 0.35 * Math.sin(2 * ph + 0.8);
            sig[i] += f.amp * tdpSign[L] * (0.35 + 0.65 * Math.abs(env)) * Math.sign(env || 1) * wave * ramp * 0.8;
          }
        }
      }
      const wander = cfg.wander || 0, tremor = cfg.tremor || 0;
      const wph = nr() * 6;
      for (let i = 0; i < n; i++) {
        let v = noise ? gauss(nr) * noise : 0;
        if (wander) v += wander * Math.sin((2 * Math.PI * 0.28 * i) / FS + wph);
        if (tremor) v += tremor * (0.5 + 0.5 * Math.sin((2 * Math.PI * 0.6 * i) / FS + wph)) * Math.sin((2 * Math.PI * 9.5 * i) / FS + nr() * 0.8) * (0.5 + nr());
        sig[i] += v;
      }
    }
    // Lỗi mắc điện cực
    if (cfg.reversal === "LA-RA") {
      const I = leads.I, II = leads.II, III = leads.III, aVR = leads.aVR, aVL = leads.aVL;
      leads.I = I.map((x) => -x); leads.II = III; leads.III = II; leads.aVR = aVL; leads.aVL = aVR;
    }
    const spikes = out.spikes.map((s) => ({ t: s.t, kind: s.kind }));
    return { fs: FS, dur, leads, spikes, beats: out.beats, atrial: out.atrial };
  }

  /* ---------- Vẽ ---------- */
  const MMS = 25, MMV = 10;
  function pathFor(sig, fs, t0, t1, x0, y0, gain) {
    const i0 = Math.max(0, Math.floor(t0 * fs)), i1 = Math.min(sig.length - 1, Math.floor(t1 * fs));
    let d = "";
    for (let i = i0; i <= i1; i += 1) {
      const x = x0 + (i / fs - t0) * MMS, y = y0 - sig[i] * MMV * gain;
      d += (i === i0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2);
    }
    return d;
  }
  let uid = 0;
  function render(data, opt) {
    opt = opt || {};
    const layout = opt.layout || "12";
    const gain = opt.gain || 1;
    const id = "ecg" + ++uid;
    const calW = 7, rows = [];
    let W, H;
    if (layout === "12") {
      const rh = 31, top = 3;
      const cols = [["I", "II", "III"], ["aVR", "aVL", "aVF"], ["V1", "V2", "V3"], ["V4", "V5", "V6"]];
      for (let ri = 0; ri < 3; ri++) {
        const y = top + rh * ri + rh * 0.58;
        const segs = cols.map((c, ci) => ({ lead: c[ri], t0: ci * 2.5, t1: ci * 2.5 + 2.5 }));
        rows.push({ y, segs });
      }
      const rl = opt.rhythmLead || "II";
      rows.push({ y: top + rh * 3 + rh * 0.58, segs: [{ lead: rl, t0: 0, t1: Math.min(10, data.dur) }] });
      W = calW + 250 + 3; H = top + rh * 4 + 2;
    } else {
      const ls = opt.leads || ["II"], rh = opt.rowH || 30;
      ls.forEach((l, i) => rows.push({ y: 3 + rh * i + rh * 0.6, segs: [{ lead: l, t0: 0, t1: data.dur }] }));
      W = calW + data.dur * MMS + 3; H = 3 + rh * ls.length + 2;
    }
    let s = `<svg class="ecg-svg" id="${id}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" data-w="${W}" data-h="${H}" role="img" aria-label="${opt.label ? esc(opt.label) : "Điện tâm đồ"}">`;
    s += `<defs><pattern id="${id}s" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M1 0V1H0" fill="none" class="g1" stroke-width="0.06"/></pattern>`;
    s += `<pattern id="${id}b" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="url(#${id}s)"/><path d="M5 0V5H0" fill="none" class="g5" stroke-width="0.16"/></pattern></defs>`;
    s += `<rect class="paper" width="${W}" height="${H}"/><rect width="${W}" height="${H}" fill="url(#${id}b)"/>`;
    let paths = "", labels = "", ticks = "", sp = "";
    for (const row of rows) {
      paths += `<path class="cal" d="M1 ${row.y} H2 V${row.y - 10 * gain} H7 V${row.y} H${calW}"/>`;
      for (const sg of row.segs) {
        const x0 = calW + sg.t0 * MMS;
        paths += `<path class="tr" d="${pathFor(data.leads[sg.lead], data.fs, sg.t0, sg.t1, x0, row.y, gain)}"/>`;
        labels += `<text class="lb" x="${x0 + 1.2}" y="${row.y - 9}">${sg.lead}</text>`;
        if (sg.t0 > 0) ticks += `<path class="tk" d="M${x0} ${row.y - 3}V${row.y + 3}"/>`;
        for (const k of data.spikes || []) if (k.t >= sg.t0 && k.t <= sg.t1) {
          const x = x0 + (k.t - sg.t0) * MMS, a = (/^V/.test(sg.lead) ? 9 : 6) * gain * (k.kind === "A" ? 0.7 : 1);
          sp += `<path class="sp" d="M${x.toFixed(2)} ${row.y + 1}V${(row.y - a).toFixed(2)}"/>`;
        }
      }
    }
    s += `<g>${paths}${sp}${ticks}${labels}</g>`;
    s += `<text class="meta" x="${W - 2}" y="${H - 1.2}" text-anchor="end">25 mm/s · ${10 * gain} mm/mV · mô phỏng</text>`;
    s += `<g class="cal-layer"></g></svg>`;
    return s;
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }

  /* Thước đo: bấm 2 điểm trên giấy ECG */
  function attachCaliper(svg, onMeasure) {
    const layer = svg.querySelector(".cal-layer");
    let a = null;
    function pt(ev) {
      const p = svg.createSVGPoint(); p.x = ev.clientX; p.y = ev.clientY;
      return p.matrixTransform(svg.getScreenCTM().inverse());
    }
    function onClick(ev) {
      if (!svg.classList.contains("caliper-on")) return;
      const p = pt(ev);
      const H = +svg.dataset.h;
      if (!a || layer.dataset.done) {
        a = p; layer.dataset.done = "";
        layer.innerHTML = `<path class="cl" d="M${p.x} 0V${H}"/><circle class="cd" cx="${p.x}" cy="${p.y}" r="0.9"/>`;
        onMeasure && onMeasure(null);
        return;
      }
      const dx = p.x - a.x, dy = a.y - p.y;
      const ms = Math.abs(dx) * 40, mm = dy;
      const bx = Math.max(a.x, p.x) + 1.5, by = Math.max(6, Math.min(a.y, p.y) - 2);
      const txt = `${Math.round(ms)} ms · ${mm >= 0 ? "+" : ""}${mm.toFixed(1)} mm`;
      layer.innerHTML += `<path class="cl" d="M${p.x} 0V${H}"/><circle class="cd" cx="${p.x}" cy="${p.y}" r="0.9"/><path class="cl2" d="M${a.x} ${a.y}H${p.x}V${p.y}"/>` +
        `<rect class="cbox" x="${bx - 0.8}" y="${by - 4.2}" width="${txt.length * 1.75}" height="5.6" rx="1"/><text class="ct" x="${bx}" y="${by}">${txt}</text>`;
      layer.dataset.done = "1";
      onMeasure && onMeasure({ ms, mm, rate: ms > 0 ? 60000 / ms : 0 });
    }
    svg.addEventListener("click", onClick);
    return { clear() { layer.innerHTML = ""; a = null; } };
  }

  root.ECG = { LEADS, LIMB, PREC, generate, render, attachCaliper, compile, rng, FS };
})(typeof window !== "undefined" ? window : globalThis);
