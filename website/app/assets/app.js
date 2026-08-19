(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@mediapipe/tasks-audio/audio_bundle.mjs
  var audio_bundle_exports = {};
  __export(audio_bundle_exports, {
    AudioClassifier: () => Vi,
    AudioTaskRunner: () => Ni,
    FilesetResolver: () => Di,
    TaskRunner: () => Pi
  });
  function n(n2, e2) {
    t: {
      for (var r2 = ["CLOSURE_FLAGS"], i2 = t, o2 = 0; o2 < r2.length; o2++) if (null == (i2 = i2[r2[o2]])) {
        r2 = null;
        break t;
      }
      r2 = i2;
    }
    return null != (n2 = r2 && r2[n2]) ? n2 : e2;
  }
  function e() {
    throw Error("Invalid UTF8");
  }
  function r(t2, n2) {
    return n2 = String.fromCharCode.apply(null, n2), null == t2 ? n2 : t2 + n2;
  }
  function c(t2) {
    if (u) t2 = (a || (a = new TextEncoder())).encode(t2);
    else {
      let e2 = 0;
      const r2 = new Uint8Array(3 * t2.length);
      for (let i2 = 0; i2 < t2.length; i2++) {
        var n2 = t2.charCodeAt(i2);
        if (n2 < 128) r2[e2++] = n2;
        else {
          if (n2 < 2048) r2[e2++] = n2 >> 6 | 192;
          else {
            if (n2 >= 55296 && n2 <= 57343) {
              if (n2 <= 56319 && i2 < t2.length) {
                const o2 = t2.charCodeAt(++i2);
                if (o2 >= 56320 && o2 <= 57343) {
                  n2 = 1024 * (n2 - 55296) + o2 - 56320 + 65536, r2[e2++] = n2 >> 18 | 240, r2[e2++] = n2 >> 12 & 63 | 128, r2[e2++] = n2 >> 6 & 63 | 128, r2[e2++] = 63 & n2 | 128;
                  continue;
                }
                i2--;
              }
              n2 = 65533;
            }
            r2[e2++] = n2 >> 12 | 224, r2[e2++] = n2 >> 6 & 63 | 128;
          }
          r2[e2++] = 63 & n2 | 128;
        }
      }
      t2 = e2 === r2.length ? r2 : r2.subarray(0, e2);
    }
    return t2;
  }
  function d() {
    var n2 = t.navigator;
    return n2 && (n2 = n2.userAgent) ? n2 : "";
  }
  function p(t2) {
    return p[" "](t2), t2;
  }
  function y(t2) {
    const n2 = t2.length;
    let e2 = 3 * n2 / 4;
    e2 % 3 ? e2 = Math.floor(e2) : -1 != "=.".indexOf(t2[n2 - 1]) && (e2 = -1 != "=.".indexOf(t2[n2 - 2]) ? e2 - 2 : e2 - 1);
    const r2 = new Uint8Array(e2);
    let i2 = 0;
    return (function(t3, n3) {
      function e3(n4) {
        for (; r3 < t3.length; ) {
          const n5 = t3.charAt(r3++), e4 = m[n5];
          if (null != e4) return e4;
          if (!/^[\s\xa0]*$/.test(n5)) throw Error("Unknown base64 encoding at char: " + n5);
        }
        return n4;
      }
      b();
      let r3 = 0;
      for (; ; ) {
        const t4 = e3(-1), r4 = e3(0), i3 = e3(64), o2 = e3(64);
        if (64 === o2 && -1 === t4) break;
        n3(t4 << 2 | r4 >> 4), 64 != i3 && (n3(r4 << 4 & 240 | i3 >> 2), 64 != o2 && n3(i3 << 6 & 192 | o2));
      }
    })(t2, (function(t3) {
      r2[i2++] = t3;
    })), i2 !== e2 ? r2.subarray(0, i2) : r2;
  }
  function b() {
    if (!m) {
      m = {};
      var t2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), n2 = ["+/=", "+/", "-_=", "-_.", "-_"];
      for (let e2 = 0; e2 < 5; e2++) {
        const r2 = t2.concat(n2[e2].split(""));
        v[e2] = r2;
        for (let t3 = 0; t3 < r2.length; t3++) {
          const n3 = r2[t3];
          void 0 === m[n3] && (m[n3] = t3);
        }
      }
    }
  }
  function I(t2) {
    return A[t2] || "";
  }
  function E(t2) {
    if (!_) return y(t2);
    t2 = S.test(t2) ? t2.replace(S, I) : t2, t2 = atob(t2);
    const n2 = new Uint8Array(t2.length);
    for (let e2 = 0; e2 < t2.length; e2++) n2[e2] = t2.charCodeAt(e2);
    return n2;
  }
  function B() {
    return L || (L = new P(null, T));
  }
  function U(t2) {
    j(T);
    var n2 = t2.g;
    return null == (n2 = null == n2 || w && null != n2 && n2 instanceof Uint8Array ? n2 : "string" == typeof n2 ? E(n2) : null) ? n2 : t2.g = n2;
  }
  function j(t2) {
    if (t2 !== T) throw Error("illegal external caller");
  }
  function O(t2, n2) {
    t2.__closure__error__context__984382 || (t2.__closure__error__context__984382 = {}), t2.__closure__error__context__984382.severity = n2;
  }
  function V() {
    const t2 = Error("int32");
    return O(t2, "warning"), t2;
  }
  function k(n2, e2) {
    if (null != n2) {
      var r2 = N ?? (N = {}), i2 = r2[n2] || 0;
      i2 >= e2 || (r2[n2] = i2 + 1, O(n2 = Error(), "incident"), (function(n3) {
        t.setTimeout((() => {
          throw n3;
        }), 0);
      })(n2));
    }
  }
  function x() {
    return "function" == typeof BigInt;
  }
  function M(t2, n2, e2 = false) {
    return "function" == typeof Symbol && "symbol" == typeof Symbol() ? e2 && Symbol.for && t2 ? Symbol.for(t2) : null != t2 ? Symbol(t2) : Symbol() : n2;
  }
  function q(t2, n2) {
    F || J in t2 || K(t2, z), t2[J] |= n2;
  }
  function Q(t2, n2) {
    F || J in t2 || K(t2, z), t2[J] = n2;
  }
  function tt(t2, n2) {
    return void 0 === n2 ? t2.g !== nt && !!(2 & (0 | t2.l[J])) : !!(2 & n2) && t2.g !== nt;
  }
  function et(t2, n2) {
    if (null != t2) {
      if ("string" == typeof t2) t2 = t2 ? new P(t2, T) : B();
      else if (t2.constructor !== P) if (w && null != t2 && t2 instanceof Uint8Array) t2 = t2.length ? new P(new Uint8Array(t2), T) : B();
      else {
        if (!n2) throw Error();
        t2 = void 0;
      }
    }
    return t2;
  }
  function it(t2, n2, e2) {
    const r2 = 128 & n2 ? 0 : -1, i2 = t2.length;
    var o2;
    (o2 = !!i2) && (o2 = null != (o2 = t2[i2 - 1]) && "object" == typeof o2 && o2.constructor === Object);
    const s2 = i2 + (o2 ? -1 : 0);
    for (n2 = 128 & n2 ? 1 : 0; n2 < s2; n2++) e2(n2 - r2, t2[n2]);
    if (o2) {
      t2 = t2[i2 - 1];
      for (const n3 in t2) !isNaN(n3) && e2(+n3, t2[n3]);
    }
  }
  function st(t2) {
    return 128 & t2 ? ot : void 0;
  }
  function at(t2) {
    return t2.M = true, t2;
  }
  function ft(t2) {
    var n2 = t2;
    if (ct(n2)) {
      if (!/^\s*(?:-?[1-9]\d*|0)?\s*$/.test(n2)) throw Error(String(n2));
    } else if (ut(n2) && !Number.isSafeInteger(n2)) throw Error(String(n2));
    return ht ? BigInt(t2) : t2 = lt(t2) ? t2 ? "1" : "0" : ct(t2) ? t2.trim() || "0" : String(t2);
  }
  function yt(t2, n2) {
    if (t2.length > n2.length) return false;
    if (t2.length < n2.length || t2 === n2) return true;
    for (let e2 = 0; e2 < t2.length; e2++) {
      const r2 = t2[e2], i2 = n2[e2];
      if (r2 > i2) return false;
      if (r2 < i2) return true;
    }
  }
  function At(t2) {
    const n2 = t2 >>> 0;
    _t = n2, St = (t2 - n2) / 4294967296 >>> 0;
  }
  function It(t2) {
    if (t2 < 0) {
      At(-t2);
      const [n2, e2] = jt(_t, St);
      _t = n2 >>> 0, St = e2 >>> 0;
    } else At(t2);
  }
  function Et(t2, n2) {
    const e2 = 4294967296 * n2 + (t2 >>> 0);
    return Number.isSafeInteger(e2) ? e2 : Ut(t2, n2);
  }
  function Tt(t2, n2) {
    return ft(x() ? BigInt.asUintN(64, (BigInt(n2 >>> 0) << BigInt(32)) + BigInt(t2 >>> 0)) : Ut(t2, n2));
  }
  function Bt(t2, n2) {
    return x() ? ft(BigInt.asIntN(64, (BigInt.asUintN(32, BigInt(n2)) << BigInt(32)) + BigInt.asUintN(32, BigInt(t2)))) : ft(Lt(t2, n2));
  }
  function Ut(t2, n2) {
    if (t2 >>>= 0, (n2 >>>= 0) <= 2097151) var e2 = "" + (4294967296 * n2 + t2);
    else x() ? e2 = "" + (BigInt(n2) << BigInt(32) | BigInt(t2)) : (t2 = (16777215 & t2) + 6777216 * (e2 = 16777215 & (t2 >>> 24 | n2 << 8)) + 6710656 * (n2 = n2 >> 16 & 65535), e2 += 8147497 * n2, n2 *= 2, t2 >= 1e7 && (e2 += t2 / 1e7 >>> 0, t2 %= 1e7), e2 >= 1e7 && (n2 += e2 / 1e7 >>> 0, e2 %= 1e7), e2 = n2 + Pt(e2) + Pt(t2));
    return e2;
  }
  function Pt(t2) {
    return t2 = String(t2), "0000000".slice(t2.length) + t2;
  }
  function Lt(t2, n2) {
    if (2147483648 & n2) if (x()) t2 = "" + (BigInt(0 | n2) << BigInt(32) | BigInt(t2 >>> 0));
    else {
      const [e2, r2] = jt(t2, n2);
      t2 = "-" + Ut(e2, r2);
    }
    else t2 = Ut(t2, n2);
    return t2;
  }
  function Nt(t2) {
    if (t2.length < 16) It(Number(t2));
    else if (x()) t2 = BigInt(t2), _t = Number(t2 & BigInt(4294967295)) >>> 0, St = Number(t2 >> BigInt(32) & BigInt(4294967295));
    else {
      const n2 = +("-" === t2[0]);
      St = _t = 0;
      const e2 = t2.length;
      for (let r2 = n2, i2 = (e2 - n2) % 6 + n2; i2 <= e2; r2 = i2, i2 += 6) {
        const n3 = Number(t2.slice(r2, i2));
        St *= 1e6, _t = 1e6 * _t + n3, _t >= 4294967296 && (St += Math.trunc(_t / 4294967296), St >>>= 0, _t >>>= 0);
      }
      if (n2) {
        const [t3, n3] = jt(_t, St);
        _t = t3, St = n3;
      }
    }
  }
  function jt(t2, n2) {
    return n2 = ~n2, t2 ? t2 = 1 + ~t2 : n2 += 1, [t2, n2];
  }
  function Ot(t2) {
    return Array.prototype.slice.call(t2);
  }
  function Dt(t2) {
    return null == t2 || "number" == typeof t2 ? t2 : "NaN" === t2 || "Infinity" === t2 || "-Infinity" === t2 ? Number(t2) : void 0;
  }
  function Ct(t2) {
    switch (typeof t2) {
      case "bigint":
        return true;
      case "number":
        return Ft(t2);
      case "string":
        return Gt.test(t2);
      default:
        return false;
    }
  }
  function Rt(t2) {
    if (null == t2) return t2;
    if ("string" == typeof t2 && t2) t2 = +t2;
    else if ("number" != typeof t2) return;
    return Ft(t2) ? 0 | t2 : void 0;
  }
  function Wt(t2) {
    const n2 = t2.length;
    return ("-" === t2[0] ? n2 < 20 || 20 === n2 && t2 <= "-9223372036854775808" : n2 < 19 || 19 === n2 && t2 <= "9223372036854775807") ? t2 : (Nt(t2), Lt(_t, St));
  }
  function $t(t2) {
    if (t2 = Mt(t2), !xt(t2)) {
      It(t2);
      var n2 = _t, e2 = St;
      (t2 = 2147483648 & e2) && (e2 = ~e2 >>> 0, 0 == (n2 = 1 + ~n2 >>> 0) && (e2 = e2 + 1 >>> 0)), t2 = "number" == typeof (n2 = Et(n2, e2)) ? t2 ? -n2 : n2 : t2 ? "-" + n2 : n2;
    }
    return t2;
  }
  function Ht(t2) {
    var n2 = Mt(Number(t2));
    return xt(n2) ? String(n2) : (-1 !== (n2 = t2.indexOf(".")) && (t2 = t2.substring(0, n2)), Wt(t2));
  }
  function zt(t2) {
    var n2 = typeof t2;
    return null == t2 ? t2 : "bigint" === n2 ? ft(Vt(64, t2)) : Ct(t2) ? ("string" === n2 ? (n2 = Mt(Number(t2)), xt(n2) ? t2 = ft(n2) : (-1 !== (n2 = t2.indexOf(".")) && (t2 = t2.substring(0, n2)), t2 = x() ? ft(Vt(64, BigInt(t2))) : ft(Wt(t2)))) : xt(t2) ? t2 = ft($t(t2)) : (t2 = Mt(t2), xt(t2) ? t2 = String(t2) : (It(t2), t2 = Lt(_t, St)), t2 = ft(t2)), t2) : void 0;
  }
  function Kt(t2) {
    if ("string" != typeof t2) throw Error();
    return t2;
  }
  function Jt(t2) {
    if (null != t2 && "string" != typeof t2) throw Error();
    return t2;
  }
  function Xt(t2) {
    return null == t2 || "string" == typeof t2 ? t2 : void 0;
  }
  function Yt(t2, n2, e2) {
    if (null != t2 && t2[H] === Z) return t2;
    if (Array.isArray(t2)) {
      var r2 = 0 | t2[J];
      return (e2 = r2 | 32 & e2 | 2 & e2) !== r2 && Q(t2, e2), new n2(t2);
    }
  }
  function qt(t2) {
    return C ? t2[C] : void 0;
  }
  function Qt(t2, n2) {
    for (const e2 in t2) !isNaN(e2) && n2(t2, +e2, t2[e2]);
  }
  function tn(t2, n2) {
    n2 < 100 || k(R, 1);
  }
  function nn(t2, n2, e2, r2) {
    const i2 = void 0 !== r2;
    r2 = !!r2;
    var o2, s2 = C;
    !i2 && F && s2 && (o2 = t2[s2]) && Qt(o2, tn), s2 = [];
    var a2 = t2.length;
    let u2;
    o2 = 4294967295;
    let c2 = false;
    const l2 = !!(64 & n2), h2 = l2 ? 128 & n2 ? 0 : -1 : void 0;
    1 & n2 || (u2 = a2 && t2[a2 - 1], null != u2 && "object" == typeof u2 && u2.constructor === Object ? o2 = --a2 : u2 = void 0, !l2 || 128 & n2 || i2 || (c2 = true, o2 = o2 - h2 + h2)), n2 = void 0;
    for (var f2 = 0; f2 < a2; f2++) {
      let i3 = t2[f2];
      if (null != i3 && null != (i3 = e2(i3, r2))) if (l2 && f2 >= o2) {
        const t3 = f2 - h2;
        (n2 ?? (n2 = {}))[t3] = i3;
      } else s2[f2] = i3;
    }
    if (u2) for (let t3 in u2) {
      if (null == (a2 = u2[t3]) || null == (a2 = e2(a2, r2))) continue;
      let i3;
      f2 = +t3, l2 && !Number.isNaN(f2) && (i3 = f2 + h2) < o2 ? s2[i3] = a2 : (n2 ?? (n2 = {}))[t3] = a2;
    }
    return n2 && (c2 ? s2.push(n2) : s2[o2] = n2), i2 && C && (t2 = qt(t2)) && t2 instanceof Zt && (s2[C] = (function(t3) {
      const n3 = new Zt();
      return Qt(t3, ((t4, e3, r3) => {
        n3[e3] = Ot(r3);
      })), n3.g = t3.g, n3;
    })(t2)), s2;
  }
  function en(t2) {
    switch (typeof t2) {
      case "number":
        return Number.isFinite(t2) ? t2 : "" + t2;
      case "bigint":
        return dt(t2) ? Number(t2) : "" + t2;
      case "boolean":
        return t2 ? 1 : 0;
      case "object":
        if (Array.isArray(t2)) {
          var n2 = 0 | t2[J];
          return 0 === t2.length && 1 & n2 ? void 0 : nn(t2, n2, en);
        }
        if (null != t2 && t2[H] === Z) return sn(t2);
        if (t2 instanceof P) {
          if (null == (n2 = t2.g)) t2 = "";
          else if ("string" == typeof n2) t2 = n2;
          else {
            if (_) {
              for (var e2 = "", r2 = 0, i2 = n2.length - 10240; r2 < i2; ) e2 += String.fromCharCode.apply(null, n2.subarray(r2, r2 += 10240));
              e2 += String.fromCharCode.apply(null, r2 ? n2.subarray(r2) : n2), n2 = btoa(e2);
            } else {
              void 0 === e2 && (e2 = 0), b(), e2 = v[e2], r2 = Array(Math.floor(n2.length / 3)), i2 = e2[64] || "";
              let t3 = 0, c2 = 0;
              for (; t3 < n2.length - 2; t3 += 3) {
                var o2 = n2[t3], s2 = n2[t3 + 1], a2 = n2[t3 + 2], u2 = e2[o2 >> 2];
                o2 = e2[(3 & o2) << 4 | s2 >> 4], s2 = e2[(15 & s2) << 2 | a2 >> 6], a2 = e2[63 & a2], r2[c2++] = u2 + o2 + s2 + a2;
              }
              switch (u2 = 0, a2 = i2, n2.length - t3) {
                case 2:
                  a2 = e2[(15 & (u2 = n2[t3 + 1])) << 2] || i2;
                case 1:
                  n2 = n2[t3], r2[c2] = e2[n2 >> 2] + e2[(3 & n2) << 4 | u2 >> 4] + a2 + i2;
              }
              n2 = r2.join("");
            }
            t2 = t2.g = n2;
          }
          return t2;
        }
        return;
    }
    return t2;
  }
  function sn(t2) {
    return nn(t2 = t2.l, 0 | t2[J], en);
  }
  function an(t2, n2) {
    return un(t2, n2[0], n2[1]);
  }
  function un(t2, n2, e2, r2 = 0) {
    if (null == t2) {
      var i2 = 32;
      e2 ? (t2 = [e2], i2 |= 128) : t2 = [], n2 && (i2 = -16760833 & i2 | (1023 & n2) << 14);
    } else {
      if (!Array.isArray(t2)) throw Error("narr");
      if (i2 = 0 | t2[J], f && 1 & i2) throw Error("rfarr");
      if (2048 & i2 && !(2 & i2) && (function() {
        if (f) throw Error("carr");
        k($, 5);
      })(), 256 & i2) throw Error("farr");
      if (64 & i2) return (i2 | r2) !== i2 && Q(t2, i2 | r2), t2;
      if (e2 && (i2 |= 128, e2 !== t2[0])) throw Error("mid");
      t: {
        i2 |= 64;
        var o2 = (e2 = t2).length;
        if (o2) {
          var s2 = o2 - 1;
          const t3 = e2[s2];
          if (null != t3 && "object" == typeof t3 && t3.constructor === Object) {
            if ((s2 -= n2 = 128 & i2 ? 0 : -1) >= 1024) throw Error("pvtlmt");
            for (var a2 in t3) (o2 = +a2) < s2 && (e2[o2 + n2] = t3[a2], delete t3[a2]);
            i2 = -16760833 & i2 | (1023 & s2) << 14;
            break t;
          }
        }
        if (n2) {
          if ((a2 = Math.max(n2, o2 - (128 & i2 ? 0 : -1))) > 1024) throw Error("spvt");
          i2 = -16760833 & i2 | (1023 & a2) << 14;
        }
      }
    }
    return Q(t2, 64 | i2 | r2), t2;
  }
  function cn(t2, n2) {
    if ("object" != typeof t2) return t2;
    if (Array.isArray(t2)) {
      var e2 = 0 | t2[J];
      return 0 === t2.length && 1 & e2 ? t2 = void 0 : 2 & e2 || (!n2 || 4096 & e2 || 16 & e2 ? t2 = hn(t2, e2, false, n2 && !(16 & e2)) : (q(t2, 34), 4 & e2 && Object.freeze(t2))), t2;
    }
    return null != t2 && t2[H] === Z ? tt(t2, e2 = 0 | (n2 = t2.l)[J]) ? t2 : vn(t2, n2, e2) ? ln(t2, n2) : hn(n2, e2) : t2 instanceof P ? t2 : void 0;
  }
  function ln(t2, n2, e2) {
    return t2 = new t2.constructor(n2), e2 && (t2.g = nt), t2.m = nt, t2;
  }
  function hn(t2, n2, e2, r2) {
    return r2 ?? (r2 = !!(34 & n2)), t2 = nn(t2, n2, cn, r2), r2 = 32, e2 && (r2 |= 2), Q(t2, n2 = 16769217 & n2 | r2), t2;
  }
  function fn(t2) {
    const n2 = t2.l, e2 = 0 | n2[J];
    return tt(t2, e2) ? vn(t2, n2, e2) ? ln(t2, n2, true) : new t2.constructor(hn(n2, e2, false)) : t2;
  }
  function dn(t2) {
    if (t2.g !== nt) return false;
    var n2 = t2.l;
    return q(n2 = hn(n2, 0 | n2[J]), 2048), t2.l = n2, t2.g = void 0, t2.m = void 0, true;
  }
  function gn(t2) {
    if (!dn(t2) && tt(t2, 0 | t2.l[J])) throw Error();
  }
  function pn(t2, n2) {
    void 0 === n2 && (n2 = 0 | t2[J]), 32 & n2 && !(4096 & n2) && Q(t2, 4096 | n2);
  }
  function vn(t2, n2, e2) {
    return !!(2 & e2) || !(!(32 & e2) || 4096 & e2) && (Q(n2, 2 | e2), t2.g = nt, true);
  }
  function yn(t2, n2, e2, r2) {
    if (null !== (t2 = bn(t2.l, n2, e2, r2))) return t2;
  }
  function bn(t2, n2, e2, r2) {
    if (-1 === n2) return null;
    const i2 = n2 + (e2 ? 0 : -1), o2 = t2.length - 1;
    let s2, a2;
    if (!(o2 < 1 + (e2 ? 0 : -1))) {
      if (i2 >= o2) if (s2 = t2[o2], null != s2 && "object" == typeof s2 && s2.constructor === Object) e2 = s2[n2], a2 = true;
      else {
        if (i2 !== o2) return;
        e2 = s2;
      }
      else e2 = t2[i2];
      if (r2 && null != e2) {
        if (null == (r2 = r2(e2))) return r2;
        if (!Object.is(r2, e2)) return a2 ? s2[n2] = r2 : t2[i2] = r2, r2;
      }
      return e2;
    }
  }
  function wn(t2, n2, e2, r2) {
    gn(t2), _n(t2 = t2.l, 0 | t2[J], n2, e2, r2);
  }
  function _n(t2, n2, e2, r2, i2) {
    const o2 = e2 + (i2 ? 0 : -1);
    var s2 = t2.length - 1;
    if (s2 >= 1 + (i2 ? 0 : -1) && o2 >= s2) {
      const i3 = t2[s2];
      if (null != i3 && "object" == typeof i3 && i3.constructor === Object) return i3[e2] = r2, n2;
    }
    return o2 <= s2 ? (t2[o2] = r2, n2) : (void 0 !== r2 && (e2 >= (s2 = (n2 ?? (n2 = 0 | t2[J])) >> 14 & 1023 || 536870912) ? null != r2 && (t2[s2 + (i2 ? 0 : -1)] = { [e2]: r2 }) : t2[o2] = r2), n2);
  }
  function Sn(t2, n2, e2, r2, i2, o2, s2, a2) {
    let u2 = n2;
    return 1 === o2 || 4 === o2 && (2 & n2 || !(16 & n2) && 32 & r2) ? En(n2) || ((n2 |= !t2.length || s2 && !(4096 & n2) || 32 & r2 && !(4096 & n2 || 16 & n2) ? 2 : 256) !== u2 && Q(t2, n2), Object.freeze(t2)) : (2 === o2 && En(n2) && (t2 = Ot(t2), u2 = 0, n2 = Dn(n2, r2), r2 = _n(e2, r2, i2, t2)), En(n2) || (a2 || (n2 |= 16), n2 !== u2 && Q(t2, n2))), 2 & n2 || !(4096 & n2 || 16 & n2) || pn(e2, r2), t2;
  }
  function An(t2, n2, e2) {
    return t2 = bn(t2, n2, e2), Array.isArray(t2) ? t2 : X;
  }
  function In(t2, n2) {
    return 2 & n2 && (t2 |= 2), 1 | t2;
  }
  function En(t2) {
    return !!(2 & t2) && !!(4 & t2) || !!(256 & t2);
  }
  function Tn(t2) {
    return et(t2, true);
  }
  function Bn(t2, n2, e2) {
    gn(t2);
    let r2 = 0 | (t2 = t2.l)[J];
    if (null == e2) _n(t2, r2, n2);
    else {
      var i2 = e2 === X ? 7 : 0 | e2[J], o2 = i2, s2 = En(i2), a2 = s2 || Object.isFrozen(e2);
      for (s2 || (i2 = 0), a2 || (e2 = Ot(e2), o2 = 0, i2 = Dn(i2, r2), a2 = false), i2 |= 5, i2 |= (4 & i2 ? 512 & i2 ? 512 : 1024 & i2 ? 1024 : 0 : void 0) ?? 1024, s2 = 0; s2 < e2.length; s2++) {
        const t3 = e2[s2], n3 = Kt(t3);
        Object.is(t3, n3) || (a2 && (e2 = Ot(e2), o2 = 0, i2 = Dn(i2, r2), a2 = false), e2[s2] = n3);
      }
      i2 !== o2 && (a2 && (e2 = Ot(e2), i2 = Dn(i2, r2)), Q(e2, i2)), _n(t2, r2, n2, e2);
    }
  }
  function Un(t2, n2, e2) {
    if (2 & n2) throw Error();
    const r2 = st(n2);
    let i2 = An(t2, e2, r2), o2 = i2 === X ? 7 : 0 | i2[J], s2 = In(o2, n2);
    return (2 & s2 || En(s2) || 16 & s2) && (s2 === o2 || En(s2) || Q(i2, s2), i2 = Ot(i2), o2 = 0, s2 = Dn(s2, n2), _n(t2, n2, e2, i2, r2)), s2 &= -13, s2 !== o2 && Q(i2, s2), i2;
  }
  function Pn(t2) {
    if (F) return t2[G] ?? (t2[G] = /* @__PURE__ */ new Map());
    if (G in t2) return t2[G];
    const n2 = /* @__PURE__ */ new Map();
    return Object.defineProperty(t2, G, { value: n2 }), n2;
  }
  function Ln(t2, n2, e2, r2, i2) {
    const o2 = Pn(t2), s2 = Nn(o2, t2, n2, e2, i2);
    return s2 !== r2 && (s2 && (n2 = _n(t2, n2, s2, void 0, i2)), o2.set(e2, r2)), n2;
  }
  function Nn(t2, n2, e2, r2, i2) {
    let o2 = t2.get(r2);
    if (null != o2) return o2;
    o2 = 0;
    for (let t3 = 0; t3 < r2.length; t3++) {
      const s2 = r2[t3];
      null != bn(n2, s2, i2) && (0 !== o2 && (e2 = _n(n2, e2, o2, void 0, i2)), o2 = s2);
    }
    return t2.set(r2, o2), o2;
  }
  function jn(t2, n2, e2) {
    let r2 = 0 | t2[J];
    const i2 = st(r2), o2 = bn(t2, e2, i2);
    let s2;
    if (null != o2 && o2[H] === Z) {
      if (!tt(o2)) return dn(o2), o2.l;
      s2 = o2.l;
    } else Array.isArray(o2) && (s2 = o2);
    if (s2) {
      const t3 = 0 | s2[J];
      2 & t3 && (s2 = hn(s2, t3));
    }
    return s2 = an(s2, n2), s2 !== o2 && _n(t2, r2, e2, s2, i2), s2;
  }
  function On(t2, n2, e2) {
    let r2 = t2.l, i2 = 0 | r2[J];
    if (n2 = (function(t3, n3, e3, r3) {
      let i3 = false;
      if (null != (r3 = bn(t3, r3, void 0, ((t4) => {
        const r4 = Yt(t4, e3, n3);
        return i3 = r4 !== t4 && null != r4, r4;
      })))) return i3 && !tt(r3) && pn(t3, n3), r3;
    })(r2, i2, n2, e2), null == n2) return n2;
    if (i2 = 0 | r2[J], !tt(t2, i2)) {
      const o2 = fn(n2);
      o2 !== n2 && (dn(t2) && (r2 = t2.l, i2 = 0 | r2[J]), i2 = _n(r2, i2, e2, n2 = o2), pn(r2, i2));
    }
    return n2;
  }
  function Vn(t2, n2, e2, r2, i2, o2, s2) {
    var a2 = tt(t2, e2);
    i2 = a2 ? 1 : i2, o2 = !!o2 || 3 === i2, a2 = s2 && !a2, (2 === i2 || a2) && dn(t2) && (e2 = 0 | (n2 = t2.l)[J]);
    var u2 = (t2 = An(n2, 1)) === X ? 7 : 0 | t2[J], c2 = In(u2, e2);
    if (s2 = !(4 & c2)) {
      var l2 = t2, h2 = e2;
      const n3 = !!(2 & c2);
      n3 && (h2 |= 2);
      let i3 = !n3, o3 = true, s3 = 0, a3 = 0;
      for (; s3 < l2.length; s3++) {
        const t3 = Yt(l2[s3], r2, h2);
        if (t3 instanceof r2) {
          if (!n3) {
            const n4 = tt(t3);
            i3 && (i3 = !n4), o3 && (o3 = n4);
          }
          l2[a3++] = t3;
        }
      }
      a3 < s3 && (l2.length = a3), c2 |= 4, c2 = o3 ? -4097 & c2 : 4096 | c2, c2 = i3 ? 8 | c2 : -9 & c2;
    }
    if (c2 !== u2 && (Q(t2, c2), 2 & c2 && Object.freeze(t2)), a2 && !(8 & c2 || !t2.length && (1 === i2 || 4 === i2 && (2 & c2 || !(16 & c2) && 32 & e2)))) {
      for (En(c2) && (t2 = Ot(t2), c2 = Dn(c2, e2), e2 = _n(n2, e2, 1, t2)), r2 = t2, a2 = c2, u2 = 0; u2 < r2.length; u2++) (l2 = r2[u2]) !== (c2 = fn(l2)) && (r2[u2] = c2);
      a2 |= 8, Q(t2, c2 = a2 = r2.length ? 4096 | a2 : -4097 & a2);
    }
    return Sn(t2, c2, n2, e2, 1, i2, s2, o2);
  }
  function kn(t2, n2) {
    const e2 = t2.l;
    return Vn(t2, e2, 0 | e2[J], n2, void 0 === rt ? 2 : 4, false, true);
  }
  function xn(t2) {
    return null == t2 && (t2 = void 0), t2;
  }
  function Fn(t2, n2, e2, r2, i2) {
    return wn(t2, e2, r2 = xn(r2), i2), r2 && !tt(r2) && pn(t2.l), t2;
  }
  function Mn(t2, n2, e2) {
    var r2 = li;
    t: {
      var i2 = e2 = xn(e2);
      gn(t2);
      const o2 = t2.l;
      let s2 = 0 | o2[J];
      if (null == i2) {
        const t3 = Pn(o2);
        if (Nn(t3, o2, s2, r2) !== n2) break t;
        t3.set(r2, 0);
      } else s2 = Ln(o2, s2, r2, n2);
      _n(o2, s2, n2, i2);
    }
    e2 && !tt(e2) && pn(t2.l);
  }
  function Dn(t2, n2) {
    return -273 & (t2 = 2 & n2 ? 2 | t2 : -3 & t2);
  }
  function Gn(t2, n2, e2) {
    gn(t2);
    let r2 = t2.l, i2 = 0 | r2[J];
    const o2 = tt(t2, i2) ? 1 : 2;
    2 === o2 && dn(t2) && (r2 = t2.l, i2 = 0 | r2[J]);
    let s2 = (t2 = An(r2, n2)) === X ? 7 : 0 | t2[J];
    var a2 = In(s2, i2);
    const u2 = !(4 & a2);
    if (u2) {
      4 & a2 && (t2 = Ot(t2), s2 = 0, a2 = Dn(a2, i2), i2 = _n(r2, i2, n2, t2));
      let e3 = 0, o3 = 0;
      for (; e3 < t2.length; e3++) {
        const n3 = Xt(t2[e3]);
        null != n3 && (t2[o3++] = n3);
      }
      o3 < e3 && (t2.length = o3), a2 = -513 & (4 | a2), a2 &= -1025, a2 &= -4097;
    }
    a2 !== s2 && (Q(t2, a2), 2 & a2 && Object.freeze(t2)), (t2 = Sn(t2, a2, r2, i2, n2, o2, u2, true)).push(Kt(e2));
  }
  function Rn(t2, n2) {
    if ("string" == typeof t2) return new Cn(E(t2), n2);
    if (Array.isArray(t2)) return new Cn(new Uint8Array(t2), n2);
    if (t2.constructor === Uint8Array) return new Cn(t2, false);
    if (t2.constructor === ArrayBuffer) return t2 = new Uint8Array(t2), new Cn(t2, false);
    if (t2.constructor === P) return n2 = U(t2) || new Uint8Array(0), new Cn(n2, true, t2);
    if (t2 instanceof Uint8Array) return t2 = t2.constructor === Uint8Array ? t2 : new Uint8Array(t2.buffer, t2.byteOffset, t2.byteLength), new Cn(t2, false);
    throw Error();
  }
  function Wn(t2, n2) {
    let e2, r2 = 0, i2 = 0, o2 = 0;
    const s2 = t2.i;
    let a2 = t2.g;
    do {
      e2 = s2[a2++], r2 |= (127 & e2) << o2, o2 += 7;
    } while (o2 < 32 && 128 & e2);
    if (o2 > 32) for (i2 |= (127 & e2) >> 4, o2 = 3; o2 < 32 && 128 & e2; o2 += 7) e2 = s2[a2++], i2 |= (127 & e2) << o2;
    if (Jn(t2, a2), !(128 & e2)) return n2(r2 >>> 0, i2 >>> 0);
    throw Error();
  }
  function $n(t2) {
    let n2 = 0, e2 = t2.g;
    const r2 = e2 + 10, i2 = t2.i;
    for (; e2 < r2; ) {
      const r3 = i2[e2++];
      if (n2 |= r3, 0 == (128 & r3)) return Jn(t2, e2), !!(127 & n2);
    }
    throw Error();
  }
  function Hn(t2) {
    const n2 = t2.i;
    let e2 = t2.g, r2 = n2[e2++], i2 = 127 & r2;
    if (128 & r2 && (r2 = n2[e2++], i2 |= (127 & r2) << 7, 128 & r2 && (r2 = n2[e2++], i2 |= (127 & r2) << 14, 128 & r2 && (r2 = n2[e2++], i2 |= (127 & r2) << 21, 128 & r2 && (r2 = n2[e2++], i2 |= r2 << 28, 128 & r2 && 128 & n2[e2++] && 128 & n2[e2++] && 128 & n2[e2++] && 128 & n2[e2++] && 128 & n2[e2++]))))) throw Error();
    return Jn(t2, e2), i2;
  }
  function zn(t2) {
    var n2 = t2.i;
    const e2 = t2.g, r2 = n2[e2], i2 = n2[e2 + 1], o2 = n2[e2 + 2];
    return n2 = n2[e2 + 3], Jn(t2, t2.g + 4), (r2 << 0 | i2 << 8 | o2 << 16 | n2 << 24) >>> 0;
  }
  function Kn(t2) {
    return Hn(t2);
  }
  function Jn(t2, n2) {
    if (t2.g = n2, n2 > t2.j) throw Error();
  }
  function Xn(t2, n2) {
    if (n2 < 0) throw Error();
    const e2 = t2.g;
    if ((n2 = e2 + n2) > t2.j) throw Error();
    return t2.g = n2, e2;
  }
  function Yn(t2, n2) {
    if (0 == n2) return B();
    var e2 = Xn(t2, n2);
    return t2.A && t2.u ? e2 = t2.i.subarray(e2, e2 + n2) : (t2 = t2.i, e2 = e2 === (n2 = e2 + n2) ? new Uint8Array(0) : bt ? t2.slice(e2, n2) : new Uint8Array(t2.subarray(e2, n2))), 0 == e2.length ? B() : new P(e2, T);
  }
  function Qn(t2, n2, e2, r2) {
    if (ae.length) {
      const i2 = ae.pop();
      return i2.o(r2), i2.g.init(t2, n2, e2, r2), i2;
    }
    return new se(t2, n2, e2, r2);
  }
  function Zn(t2) {
    t2.g.clear(), t2.j = -1, t2.i = -1, ae.length < 100 && ae.push(t2);
  }
  function te(t2) {
    var n2 = t2.g;
    if (n2.g == n2.j) return false;
    t2.m = t2.g.g;
    var e2 = Hn(t2.g) >>> 0;
    if (n2 = e2 >>> 3, !((e2 &= 7) >= 0 && e2 <= 5)) throw Error();
    if (n2 < 1) throw Error();
    return t2.j = n2, t2.i = e2, true;
  }
  function ne(t2) {
    switch (t2.i) {
      case 0:
        0 != t2.i ? ne(t2) : $n(t2.g);
        break;
      case 1:
        Jn(t2 = t2.g, t2.g + 8);
        break;
      case 2:
        if (2 != t2.i) ne(t2);
        else {
          var n2 = Hn(t2.g) >>> 0;
          Jn(t2 = t2.g, t2.g + n2);
        }
        break;
      case 5:
        Jn(t2 = t2.g, t2.g + 4);
        break;
      case 3:
        for (n2 = t2.j; ; ) {
          if (!te(t2)) throw Error();
          if (4 == t2.i) {
            if (t2.j != n2) throw Error();
            break;
          }
          ne(t2);
        }
        break;
      default:
        throw Error();
    }
  }
  function ee(t2, n2, e2) {
    const r2 = t2.g.j;
    var i2 = Hn(t2.g) >>> 0;
    let o2 = (i2 = t2.g.g + i2) - r2;
    if (o2 <= 0 && (t2.g.j = i2, e2(n2, t2, void 0, void 0, void 0), o2 = i2 - t2.g.g), o2) throw Error();
    t2.g.g = i2, t2.g.j = r2;
  }
  function re(t2) {
    var n2 = Hn(t2.g) >>> 0, a2 = Xn(t2 = t2.g, n2);
    if (t2 = t2.i, s) {
      var u2, c2 = t2;
      (u2 = o) || (u2 = o = new TextDecoder("utf-8", { fatal: true })), n2 = a2 + n2, c2 = 0 === a2 && n2 === c2.length ? c2 : c2.subarray(a2, n2);
      try {
        var l2 = u2.decode(c2);
      } catch (t3) {
        if (void 0 === i) {
          try {
            u2.decode(new Uint8Array([128]));
          } catch (t4) {
          }
          try {
            u2.decode(new Uint8Array([97])), i = true;
          } catch (t4) {
            i = false;
          }
        }
        throw !i && (o = void 0), t3;
      }
    } else {
      n2 = (l2 = a2) + n2, a2 = [];
      let i2, o2 = null;
      for (; l2 < n2; ) {
        var h2 = t2[l2++];
        h2 < 128 ? a2.push(h2) : h2 < 224 ? l2 >= n2 ? e() : (i2 = t2[l2++], h2 < 194 || 128 != (192 & i2) ? (l2--, e()) : a2.push((31 & h2) << 6 | 63 & i2)) : h2 < 240 ? l2 >= n2 - 1 ? e() : (i2 = t2[l2++], 128 != (192 & i2) || 224 === h2 && i2 < 160 || 237 === h2 && i2 >= 160 || 128 != (192 & (u2 = t2[l2++])) ? (l2--, e()) : a2.push((15 & h2) << 12 | (63 & i2) << 6 | 63 & u2)) : h2 <= 244 ? l2 >= n2 - 2 ? e() : (i2 = t2[l2++], 128 != (192 & i2) || i2 - 144 + (h2 << 28) >> 30 != 0 || 128 != (192 & (u2 = t2[l2++])) || 128 != (192 & (c2 = t2[l2++])) ? (l2--, e()) : (h2 = (7 & h2) << 18 | (63 & i2) << 12 | (63 & u2) << 6 | 63 & c2, h2 -= 65536, a2.push(55296 + (h2 >> 10 & 1023), 56320 + (1023 & h2)))) : e(), a2.length >= 8192 && (o2 = r(o2, a2), a2.length = 0);
      }
      l2 = r(o2, a2);
    }
    return l2;
  }
  function ie(t2) {
    const n2 = Hn(t2.g) >>> 0;
    return Yn(t2.g, n2);
  }
  function oe(t2, n2, e2) {
    var r2 = Hn(t2.g) >>> 0;
    for (r2 = t2.g.g + r2; t2.g.g < r2; ) e2.push(n2(t2.g));
  }
  function ue(t2) {
    return t2 ? /^\d+$/.test(t2) ? (Nt(t2), new ce(_t, St)) : null : le || (le = new ce(0, 0));
  }
  function he(t2) {
    return t2 ? /^-?\d+$/.test(t2) ? (Nt(t2), new fe(_t, St)) : null : de || (de = new fe(0, 0));
  }
  function ge(t2, n2, e2) {
    for (; e2 > 0 || n2 > 127; ) t2.g.push(127 & n2 | 128), n2 = (n2 >>> 7 | e2 << 25) >>> 0, e2 >>>= 7;
    t2.g.push(n2);
  }
  function pe(t2, n2) {
    for (; n2 > 127; ) t2.g.push(127 & n2 | 128), n2 >>>= 7;
    t2.g.push(n2);
  }
  function ve(t2, n2) {
    if (n2 >= 0) pe(t2, n2);
    else {
      for (let e2 = 0; e2 < 9; e2++) t2.g.push(127 & n2 | 128), n2 >>= 7;
      t2.g.push(1);
    }
  }
  function me(t2, n2) {
    t2.g.push(n2 >>> 0 & 255), t2.g.push(n2 >>> 8 & 255), t2.g.push(n2 >>> 16 & 255), t2.g.push(n2 >>> 24 & 255);
  }
  function ye(t2, n2) {
    0 !== n2.length && (t2.j.push(n2), t2.i += n2.length);
  }
  function be(t2, n2, e2) {
    pe(t2.g, 8 * n2 + e2);
  }
  function we(t2, n2) {
    return be(t2, n2, 2), n2 = t2.g.end(), ye(t2, n2), n2.push(t2.i), n2;
  }
  function _e(t2, n2) {
    var e2 = n2.pop();
    for (e2 = t2.i + t2.g.length() - e2; e2 > 127; ) n2.push(127 & e2 | 128), e2 >>>= 7, t2.i++;
    n2.push(e2), t2.i++;
  }
  function Se(t2, n2, e2) {
    be(t2, n2, 2), pe(t2.g, e2.length), ye(t2, t2.g.end()), ye(t2, e2);
  }
  function Ae() {
    const t2 = class {
      constructor() {
        throw Error();
      }
    };
    return Object.setPrototypeOf(t2, t2.prototype), t2;
  }
  function Fe(t2, n2) {
    return new xe(t2, n2, Ie);
  }
  function Me(t2, n2, e2, r2, i2) {
    null != (n2 = Ye(n2, r2)) && (e2 = we(t2, e2), i2(n2, t2), _e(t2, e2));
  }
  function Je(t2, n2, e2, r2) {
    var i2 = r2[t2];
    if (i2) return i2;
    (i2 = {}).H = r2, i2.v = (function(t3) {
      switch (typeof t3) {
        case "boolean":
          return rn || (rn = [0, void 0, true]);
        case "number":
          return t3 > 0 ? void 0 : 0 === t3 ? on || (on = [0, void 0]) : [-t3, void 0];
        case "string":
          return [0, t3];
        case "object":
          return t3;
      }
    })(r2[0]);
    var o2 = r2[1];
    let s2 = 1;
    o2 && o2.constructor === Object && (i2.B = o2, "function" == typeof (o2 = r2[++s2]) && (i2.F = true, ze ?? (ze = o2), Ke ?? (Ke = r2[s2 + 1]), o2 = r2[s2 += 2]));
    const a2 = {};
    for (; o2 && Array.isArray(o2) && o2.length && "number" == typeof o2[0] && o2[0] > 0; ) {
      for (var u2 = 0; u2 < o2.length; u2++) a2[o2[u2]] = o2;
      o2 = r2[++s2];
    }
    for (u2 = 1; void 0 !== o2; ) {
      let t3;
      "number" == typeof o2 && (u2 += o2, o2 = r2[++s2]);
      var c2 = void 0;
      if (o2 instanceof xe ? t3 = o2 : (t3 = De, s2--), t3?.j) {
        o2 = r2[++s2], c2 = r2;
        var l2 = s2;
        "function" == typeof o2 && (o2 = o2(), c2[l2] = o2), c2 = o2;
      }
      for (l2 = u2 + 1, "number" == typeof (o2 = r2[++s2]) && o2 < 0 && (l2 -= o2, o2 = r2[++s2]); u2 < l2; u2++) {
        const r3 = a2[u2];
        c2 ? e2(i2, u2, t3, c2, r3) : n2(i2, u2, t3, r3);
      }
    }
    return r2[t2] = i2;
  }
  function Xe(t2) {
    return Array.isArray(t2) ? t2[0] instanceof xe ? t2 : [Ge, t2] : [t2, void 0];
  }
  function Ye(t2, n2) {
    return t2 instanceof ke ? t2.l : Array.isArray(t2) ? an(t2, n2) : void 0;
  }
  function qe(t2, n2, e2, r2) {
    const i2 = e2.g;
    t2[n2] = r2 ? (t3, n3, e3) => i2(t3, n3, e3, r2) : i2;
  }
  function Qe(t2, n2, e2, r2, i2) {
    const o2 = e2.g;
    let s2, a2;
    t2[n2] = (t3, n3, e3) => o2(t3, n3, e3, a2 || (a2 = Je(Re, qe, Qe, r2).v), s2 || (s2 = Ze(r2)), i2);
  }
  function Ze(t2) {
    let n2 = t2[We];
    if (null != n2) return n2;
    const e2 = Je(Re, qe, Qe, t2);
    return n2 = e2.F ? (t3, n3) => ze(t3, n3, e2) : (t3, n3) => {
      for (; te(n3) && 4 != n3.i; ) {
        var r2 = n3.j, i2 = e2[r2];
        if (null == i2) {
          var o2 = e2.B;
          o2 && (o2 = o2[r2]) && (null != (o2 = nr(o2)) && (i2 = e2[r2] = o2));
        }
        if (null == i2 || !i2(n3, t3, r2)) {
          if (i2 = (o2 = n3).m, ne(o2), o2.D) var s2 = void 0;
          else s2 = o2.g.g - i2, o2.g.g = i2, s2 = Yn(o2.g, s2);
          i2 = void 0, o2 = t3, s2 && ((i2 = o2[C] ?? (o2[C] = new Zt()))[r2] ?? (i2[r2] = [])).push(s2);
        }
      }
      return (t3 = qt(t3)) && (t3.g = e2.H[He]), true;
    }, t2[We] = n2, t2[He] = tr.bind(t2), n2;
  }
  function tr(t2, n2, e2, r2) {
    var i2 = this[Re];
    const o2 = this[We], s2 = an(void 0, i2.v), a2 = qt(t2);
    if (a2) {
      var u2 = false, c2 = i2.B;
      if (c2) {
        if (i2 = (n3, e3, i3) => {
          if (0 !== i3.length) if (c2[e3]) for (const t3 of i3) {
            n3 = Qn(t3);
            try {
              u2 = true, o2(s2, n3);
            } finally {
              Zn(n3);
            }
          }
          else r2?.(t2, e3, i3);
        }, null == n2) Qt(a2, i2);
        else if (null != a2) {
          const t3 = a2[n2];
          t3 && i2(a2, n2, t3);
        }
        if (u2) {
          let r3 = 0 | t2[J];
          if (2 & r3 && 2048 & r3 && !e2?.R) throw Error();
          const i3 = st(r3), o3 = (n3, o4) => {
            if (null != bn(t2, n3, i3)) {
              if (1 === e2?.P) return;
              throw Error();
            }
            null != o4 && (r3 = _n(t2, r3, n3, o4, i3)), delete a2[n3];
          };
          null == n2 ? it(s2, 0 | s2[J], ((t3, n3) => {
            o3(t3, n3);
          })) : o3(n2, bn(s2, n2, i3));
        }
      }
    }
  }
  function nr(t2) {
    const n2 = (t2 = Xe(t2))[0].g;
    if (t2 = t2[1]) {
      const e2 = Ze(t2), r2 = Je(Re, qe, Qe, t2).v;
      return (t3, i2, o2) => n2(t3, i2, o2, r2, e2);
    }
    return n2;
  }
  function er(t2, n2, e2) {
    t2[n2] = e2.i;
  }
  function rr(t2, n2, e2, r2) {
    let i2, o2;
    const s2 = e2.i;
    t2[n2] = (t3, n3, e3) => s2(t3, n3, e3, o2 || (o2 = Je(Ce, er, rr, r2).v), i2 || (i2 = ir(r2)));
  }
  function ir(t2) {
    let n2 = t2[$e];
    if (!n2) {
      const e2 = Je(Ce, er, rr, t2);
      n2 = (t3, n3) => or(t3, n3, e2), t2[$e] = n2;
    }
    return n2;
  }
  function or(t2, n2, e2) {
    it(t2, 0 | t2[J], ((t3, r2) => {
      if (null != r2) {
        var i2 = (function(t4, n3) {
          var e3 = t4[n3];
          if (e3) return e3;
          if ((e3 = t4.B) && (e3 = e3[n3])) {
            var r3 = (e3 = Xe(e3))[0].i;
            if (e3 = e3[1]) {
              const n4 = ir(e3), i3 = Je(Ce, er, rr, e3).v;
              e3 = t4.F ? Ke(i3, n4) : (t5, e4, o2) => r3(t5, e4, o2, i3, n4);
            } else e3 = r3;
            return t4[n3] = e3;
          }
        })(e2, t3);
        i2 ? i2(n2, r2, t3) : t3 < 500 || k(W, 3);
      }
    })), (t2 = qt(t2)) && Qt(t2, ((t3, e3, r2) => {
      for (ye(n2, n2.g.end()), t3 = 0; t3 < r2.length; t3++) ye(n2, U(r2[t3]) || new Uint8Array(0));
    }));
  }
  function ar(t2, n2) {
    if (Array.isArray(n2)) {
      var e2 = 0 | n2[J];
      if (4 & e2) return n2;
      for (var r2 = 0, i2 = 0; r2 < n2.length; r2++) {
        const e3 = t2(n2[r2]);
        null != e3 && (n2[i2++] = e3);
      }
      return i2 < r2 && (n2.length = i2), (t2 = -1537 & (5 | e2)) !== e2 && Q(n2, t2), 2 & t2 && Object.freeze(n2), n2;
    }
  }
  function ur(t2, n2, e2) {
    return new xe(t2, n2, e2);
  }
  function cr(t2, n2, e2) {
    return new xe(t2, n2, e2);
  }
  function lr(t2, n2, e2) {
    _n(t2, 0 | t2[J], n2, e2, st(0 | t2[J]));
  }
  function hr(t2, n2, e2) {
    if (n2 = (function(t3) {
      if (null == t3) return t3;
      const n3 = typeof t3;
      if ("bigint" === n3) return String(Vt(64, t3));
      if (Ct(t3)) {
        if ("string" === n3) return Ht(t3);
        if ("number" === n3) return $t(t3);
      }
    })(n2), null != n2) {
      if ("string" == typeof n2) he(n2);
      if (null != n2) switch (be(t2, e2, 0), typeof n2) {
        case "number":
          t2 = t2.g, It(n2), ge(t2, _t, St);
          break;
        case "bigint":
          e2 = BigInt.asUintN(64, n2), e2 = new fe(Number(e2 & BigInt(4294967295)), Number(e2 >> BigInt(32))), ge(t2.g, e2.i, e2.g);
          break;
        default:
          e2 = he(n2), ge(t2.g, e2.i, e2.g);
      }
    }
  }
  function fr(t2, n2, e2) {
    null != (n2 = Rt(n2)) && null != n2 && (be(t2, e2, 0), ve(t2.g, n2));
  }
  function dr(t2, n2, e2) {
    null != (n2 = null == n2 || "boolean" == typeof n2 ? n2 : "number" == typeof n2 ? !!n2 : void 0) && (be(t2, e2, 0), t2.g.g.push(n2 ? 1 : 0));
  }
  function gr(t2, n2, e2) {
    null != (n2 = Xt(n2)) && Se(t2, e2, c(n2));
  }
  function pr(t2, n2, e2, r2, i2) {
    null != (n2 = Ye(n2, r2)) && (e2 = we(t2, e2), i2(n2, t2), _e(t2, e2));
  }
  function vr(t2, n2, e2) {
    null != (n2 = null == n2 || "string" == typeof n2 || n2 instanceof P ? n2 : void 0) && Se(t2, e2, Rn(n2, true).buffer);
  }
  function mr(t2, n2, e2) {
    n2 = (function(t3) {
      if (null == t3) return t3;
      if ("string" == typeof t3 && t3) t3 = +t3;
      else if ("number" != typeof t3) return;
      return Ft(t3) ? t3 >>> 0 : void 0;
    })(n2), null != n2 && null != n2 && (be(t2, e2, 0), pe(t2.g, n2));
  }
  function Dr(t2) {
    var n2;
    return void 0 === Fr && (Fr = (function() {
      let t3 = null;
      if (!Mr) return t3;
      try {
        const n3 = (t4) => t4;
        t3 = Mr.createPolicy("goog#html", { createHTML: n3, createScript: n3, createScriptURL: n3 });
      } catch (t4) {
      }
      return t3;
    })()), t2 = (n2 = Fr) ? n2.createScriptURL(t2) : t2, new class {
      constructor(t3) {
        this.g = t3;
      }
      toString() {
        return this.g + "";
      }
    }(t2);
  }
  function Gr(t2, ...n2) {
    if (0 === n2.length) return Dr(t2[0]);
    let e2 = t2[0];
    for (let r2 = 0; r2 < n2.length; r2++) e2 += encodeURIComponent(n2[r2]) + t2[r2 + 1];
    return Dr(e2);
  }
  function vi() {
    var t2 = navigator;
    return "undefined" != typeof OffscreenCanvas && (!(function(t3 = navigator) {
      return (t3 = t3.userAgent).includes("Safari") && !t3.includes("Chrome");
    })(t2) || !!((t2 = t2.userAgent.match(/Version\/([\d]+).*Safari/)) && t2.length >= 1 && Number(t2[1]) >= 17));
  }
  async function mi(t2) {
    if ("function" != typeof importScripts) {
      const n2 = document.createElement("script");
      return n2.src = t2.toString(), n2.crossOrigin = "anonymous", new Promise(((t3, e2) => {
        n2.addEventListener("load", (() => {
          t3();
        }), false), n2.addEventListener("error", ((t4) => {
          e2(t4);
        }), false), document.body.appendChild(n2);
      }));
    }
    try {
      importScripts(t2.toString());
    } catch (n2) {
      if (!(n2 instanceof TypeError)) throw n2;
      {
        const n3 = self.import;
        n3 ? await n3(t2.toString()) : await import(t2.toString());
      }
    }
  }
  function yi(t2, n2, e2) {
    t2.m || console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target"), e2(n2 = t2.h.stringToNewUTF8(n2)), t2.h._free(n2);
  }
  function bi(t2, n2, e2) {
    t2.m || console.error("No wasm multistream support detected: ensure dependency inclusion of :gl_graph_runner_internal_multi_input target");
    const r2 = new Uint32Array(n2.length);
    for (let e3 = 0; e3 < n2.length; e3++) r2[e3] = t2.h.stringToNewUTF8(n2[e3]);
    n2 = t2.h._malloc(4 * r2.length), t2.h.HEAPU32.set(r2, n2 >> 2), e2(n2);
    for (const n3 of r2) t2.h._free(n3);
    t2.h._free(n2);
  }
  function wi(t2, n2, e2) {
    t2.h.simpleListeners = t2.h.simpleListeners || {}, t2.h.simpleListeners[n2] = e2;
  }
  function _i(t2, n2, e2) {
    let r2 = [];
    t2.h.simpleListeners = t2.h.simpleListeners || {}, t2.h.simpleListeners[n2] = (t3, n3, i2) => {
      n3 ? (e2(r2, i2), r2 = []) : r2.push(t3);
    };
  }
  async function Ii(t2, n2) {
    const e2 = await (async (t3, n3, e3) => {
      var r2 = Vi;
      if (t3 && await mi(t3), !self.ModuleFactory) throw Error("ModuleFactory not set.");
      if (n3 && (await mi(n3), !self.ModuleFactory)) throw Error("ModuleFactory not set.");
      return self.Module && e3 && ((t3 = self.Module).locateFile = e3.locateFile, e3.mainScriptUrlOrBlob && (t3.mainScriptUrlOrBlob = e3.mainScriptUrlOrBlob)), e3 = await self.ModuleFactory(self.Module || e3), self.ModuleFactory = self.Module = void 0, new r2(e3, null);
    })(t2.wasmLoaderPath, t2.assetLoaderPath, { locateFile: (n3) => n3.endsWith(".wasm") ? t2.wasmBinaryPath.toString() : t2.assetBinaryPath && n3.endsWith(".data") ? t2.assetBinaryPath.toString() : n3 });
    return await e2.o(n2), e2;
  }
  async function Ei(t2, n2) {
    return Ii(t2, n2);
  }
  function Ti(t2, n2) {
    const e2 = On(t2.baseOptions, hi, 1) || new hi();
    "string" == typeof n2 ? (wn(e2, 2, Jt(n2)), wn(e2, 1)) : n2 instanceof Uint8Array && (wn(e2, 1, et(n2, false)), wn(e2, 2)), Fn(t2.baseOptions, 0, 1, e2);
  }
  function Bi(t2, n2) {
    const e2 = n2.baseOptions || {};
    if (n2.baseOptions?.modelAssetBuffer && n2.baseOptions?.modelAssetPath) throw Error("Cannot set both baseOptions.modelAssetPath and baseOptions.modelAssetBuffer");
    if (!(On(t2.baseOptions, hi, 1)?.i() || On(t2.baseOptions, hi, 1)?.j() || n2.baseOptions?.modelAssetBuffer || n2.baseOptions?.modelAssetPath)) throw Error("Either baseOptions.modelAssetPath or baseOptions.modelAssetBuffer must be set");
    if ((function(t3, n3) {
      let e3 = On(t3.baseOptions, ci, 3);
      if (!e3) {
        var r2 = e3 = new ci();
        Mn(r2, 4, new zr());
      }
      "delegate" in n3 && ("GPU" === n3.delegate ? Mn(n3 = e3, 2, r2 = new Rr()) : Mn(n3 = e3, 4, r2 = new zr())), Fn(t3.baseOptions, 0, 3, e3);
    })(t2, e2), e2.modelAssetPath) return fetch(e2.modelAssetPath.toString()).then(((t3) => {
      if (t3.ok) return t3.arrayBuffer();
      throw Error(`Failed to fetch model: ${e2.modelAssetPath} (${t3.status})`);
    })).then(((n3) => {
      try {
        t2.g.h.FS_unlink("/model.dat");
      } catch {
      }
      t2.g.h.FS_createDataFile("/", "model.dat", new Uint8Array(n3), true, false, false), Ti(t2, "/model.dat"), Oi(t2);
    }));
    if (e2.modelAssetBuffer instanceof Uint8Array) Ti(t2, e2.modelAssetBuffer);
    else if (e2.modelAssetBuffer) return (async function(t3) {
      const n3 = [];
      for (var e3 = 0; ; ) {
        const { done: r2, value: i2 } = await t3.read();
        if (r2) break;
        n3.push(i2), e3 += i2.length;
      }
      if (0 === n3.length) return new Uint8Array(0);
      if (1 === n3.length) return n3[0];
      t3 = new Uint8Array(e3), e3 = 0;
      for (const r2 of n3) t3.set(r2, e3), e3 += r2.length;
      return t3;
    })(e2.modelAssetBuffer).then(((n3) => {
      Ti(t2, n3), Oi(t2);
    }));
    return Oi(t2), Promise.resolve();
  }
  function Ui(t2) {
    try {
      const n2 = t2.m.length;
      if (1 === n2) throw Error(t2.m[0].message);
      if (n2 > 1) throw Error("Encountered multiple errors: " + t2.m.map(((t3) => t3.message)).join(", "));
    } finally {
      t2.m = [];
    }
  }
  async function Li(t2, n2) {
    return Ei(t2, n2);
  }
  function ji(t2) {
    const n2 = { classifications: kn(t2, gi).map(((t3) => (function(t4, n3 = -1, e2 = "") {
      return { categories: t4.map(((t5) => ({ index: Rt(yn(t5, 1)) ?? 0 ?? -1, score: yn(t5, 2, void 0, Dt) ?? 0 ?? 0, categoryName: Xt(yn(t5, 3)) ?? "" ?? "", displayName: Xt(yn(t5, 4)) ?? "" ?? "" }))), headIndex: n3, headName: e2 };
    })(On(t3, si, 4)?.i() ?? [], Rt(yn(t3, 2)) ?? 0, Xt(yn(t3, 3)) ?? ""))) };
    return null != (function(t3) {
      return null == t3 ? t3 : "bigint" == typeof t3 ? (dt(t3) ? t3 = Number(t3) : (t3 = Vt(64, t3), t3 = dt(t3) ? Number(t3) : String(t3)), t3) : Ct(t3) ? "number" == typeof t3 ? $t(t3) : Ht(t3) : void 0;
    })(yn(t2, 2, void 0, zt)) && (n2.timestampMs = (function(t3) {
      const n3 = Number(t3);
      return Number.isSafeInteger(n3) ? n3 : String(t3);
    })(yn(t2, 2, void 0, zt) ?? mn)), n2;
  }
  function Oi(t2) {
    var n2 = new ri();
    Gn(n2, 10, "audio_in"), Gn(n2, 10, "sample_rate"), Gn(n2, 15, "timestamped_classifications");
    const e2 = new Xr();
    !(function(t3, n3) {
      var e3 = ii, r3 = t3.l;
      C && C in r3 && (r3 = r3[C]) && delete r3[451755788], e3.g ? e3.j(t3, e3.g, 451755788, n3, e3.i) : e3.j(t3, 451755788, n3, e3.i);
    })(e2, t2.i);
    const r2 = new Zr();
    !(function(t3) {
      var n3 = Jt("mediapipe.tasks.audio.audio_classifier.AudioClassifierGraph");
      gn(t3), _n(t3 = t3.l, 0 | t3[J], 2, "" === n3 ? void 0 : n3);
    })(r2), Gn(r2, 3, "AUDIO:audio_in"), Gn(r2, 3, "SAMPLE_RATE:sample_rate"), Gn(r2, 4, "TIMESTAMPED_CLASSIFICATIONS:timestamped_classifications"), r2.o(e2), (function(t3, n3) {
      var e3 = Zr;
      gn(t3);
      const r3 = t3.l;
      t3 = Vn(t3, r3, 0 | r3[J], e3, 2, true), n3 = null != n3 ? n3 : new e3(), t3.push(n3);
      const i2 = e3 = t3 === X ? 7 : 0 | t3[J];
      (n3 = tt(n3)) ? (e3 &= -9, 1 === t3.length && (e3 &= -4097)) : e3 |= 4096, e3 !== i2 && Q(t3, e3), n3 || pn(r3);
    })(n2, r2), t2.g.attachProtoVectorListener("timestamped_classifications", ((n3, e3) => {
      !(function(t3, n4) {
        n4.forEach(((n5) => {
          n5 = pi(n5), t3.u.push(ji(n5));
        }));
      })(t2, n3), t2.j = Math.max(t2.j, e3);
    })), t2.g.attachEmptyPacketListener("timestamped_classifications", ((n3) => {
      t2.j = Math.max(t2.j, n3);
    })), n2 = n2.i(), t2.setGraph(new Uint8Array(n2), true);
  }
  async function Fi(t2) {
    if (t2) return true;
    if (void 0 === ki) try {
      await WebAssembly.instantiate(xi), ki = true;
    } catch {
      ki = false;
    }
    return ki;
  }
  async function Mi(t2, n2, e2) {
    return { wasmLoaderPath: `${n2}/${t2}_${e2 = `wasm${e2 ? "_module" : ""}${await Fi(e2) ? "" : "_nosimd"}_internal`}.js`, wasmBinaryPath: `${n2}/${t2}_${e2}.wasm` };
  }
  var t, i, o, s, a, u, l, h, f, g, v, m, w, _, S, A, T, P, L, N, F, D, G, C, R, W, $, H, z, K, J, X, Y, Z, nt, rt, ot, ut, ct, lt, ht, dt, gt, pt, vt, mt, bt, wt, _t, St, Vt, kt, xt, Ft, Mt, Gt, Zt, rn, on, mn, Cn, qn, se, ae, ce, le, fe, de, Ie, Ee, Te, Be, Ue, Pe, Le, Ne, je, Oe, Ve, ke, xe, De, Ge, Ce, Re, We, $e, He, ze, Ke, sr, yr, br, wr, _r, Sr, Ar, Ir, Er, Tr, Br, Ur, Pr, Lr, Nr, jr, Or, Vr, kr, xr, Fr, Mr, Cr, Rr, Wr, $r, Hr, zr, Kr, Jr, Xr, Yr, qr, Qr, Zr, ti, ni, ei, ri, ii, oi, si, ai, ui, ci, li, hi, fi, di, gi, pi, Si, Ai, Pi, Ni, Vi, ki, xi, Di;
  var init_audio_bundle = __esm({
    "node_modules/@mediapipe/tasks-audio/audio_bundle.mjs"() {
      t = "undefined" != typeof self ? self : {};
      s = "undefined" != typeof TextDecoder;
      u = "undefined" != typeof TextEncoder;
      h = n(610401301, false);
      f = n(748402147, true);
      g = t.navigator;
      l = g && g.userAgentData || null, p[" "] = function() {
      };
      v = {};
      m = null;
      w = "undefined" != typeof Uint8Array;
      _ = !(!(h && l && l.brands.length > 0) && (-1 != d().indexOf("Trident") || -1 != d().indexOf("MSIE"))) && "function" == typeof btoa;
      S = /[-_.]/g;
      A = { "-": "+", _: "/", ".": "=" };
      T = {};
      P = class {
        constructor(t2, n2) {
          if (j(n2), this.g = t2, null != t2 && 0 === t2.length) throw Error("ByteString should be constructed with non-empty values");
        }
      };
      F = "function" == typeof Symbol && "symbol" == typeof Symbol();
      D = M("jas", void 0, true);
      G = M(void 0, "1oa");
      C = M(void 0, Symbol());
      R = M(void 0, "0ubs");
      W = M(void 0, "0ubsb");
      $ = M(void 0, "0actk");
      H = M("m_m", "O", true);
      z = { J: { value: 0, configurable: true, writable: true, enumerable: false } };
      K = Object.defineProperties;
      J = F ? D : "J";
      Y = [];
      Q(Y, 7), X = Object.freeze(Y);
      Z = {};
      nt = {};
      rt = Object.freeze({});
      ot = {};
      ut = at(((t2) => "number" == typeof t2));
      ct = at(((t2) => "string" == typeof t2));
      lt = at(((t2) => "boolean" == typeof t2));
      ht = "function" == typeof t.BigInt && "bigint" == typeof t.BigInt(0);
      dt = at(((t2) => ht ? t2 >= pt && t2 <= mt : "-" === t2[0] ? yt(t2, gt) : yt(t2, vt)));
      gt = Number.MIN_SAFE_INTEGER.toString();
      pt = ht ? BigInt(Number.MIN_SAFE_INTEGER) : void 0;
      vt = Number.MAX_SAFE_INTEGER.toString();
      mt = ht ? BigInt(Number.MAX_SAFE_INTEGER) : void 0;
      bt = "function" == typeof Uint8Array.prototype.slice;
      _t = 0;
      St = 0;
      Vt = "function" == typeof BigInt ? BigInt.asIntN : void 0;
      kt = "function" == typeof BigInt ? BigInt.asUintN : void 0;
      xt = Number.isSafeInteger;
      Ft = Number.isFinite;
      Mt = Math.trunc;
      Gt = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;
      Zt = class {
      };
      mn = ft(0);
      Cn = class {
        constructor(t2, n2, e2) {
          if (this.buffer = t2, e2 && !n2) throw Error();
          this.g = n2;
        }
      };
      qn = [];
      se = class {
        constructor(t2, n2, e2, r2) {
          if (qn.length) {
            const i2 = qn.pop();
            i2.init(t2, n2, e2, r2), t2 = i2;
          } else t2 = new class {
            constructor(t3, n3, e3, r3) {
              this.i = null, this.u = false, this.g = this.j = this.m = 0, this.init(t3, n3, e3, r3);
            }
            init(t3, n3, e3, { A: r3 = false, C: i2 = false } = {}) {
              this.A = r3, this.C = i2, t3 && (t3 = Rn(t3, this.C), this.i = t3.buffer, this.u = t3.g, this.m = n3 || 0, this.j = void 0 !== e3 ? this.m + e3 : this.i.length, this.g = this.m);
            }
            clear() {
              this.i = null, this.u = false, this.g = this.j = this.m = 0, this.A = false;
            }
          }(t2, n2, e2, r2);
          this.g = t2, this.m = this.g.g, this.i = this.j = -1, this.o(r2);
        }
        o({ D: t2 = false } = {}) {
          this.D = t2;
        }
      };
      ae = [];
      ce = class {
        constructor(t2, n2) {
          this.i = t2 >>> 0, this.g = n2 >>> 0;
        }
      };
      fe = class {
        constructor(t2, n2) {
          this.i = t2 >>> 0, this.g = n2 >>> 0;
        }
      };
      Ie = Ae();
      Ee = Ae();
      Te = Ae();
      Be = Ae();
      Ue = Ae();
      Pe = Ae();
      Le = Ae();
      Ne = Ae();
      je = Ae();
      Oe = Ae();
      Ve = Ae();
      ke = class {
        constructor(t2, n2) {
          this.l = un(t2, n2, void 0, 2048);
        }
        toJSON() {
          return sn(this);
        }
      };
      ke.prototype[H] = Z, ke.prototype.toString = function() {
        return this.l.toString();
      };
      xe = class {
        constructor(t2, n2, e2) {
          this.g = t2, this.i = n2, t2 = Ie, this.j = !!t2 && e2 === t2 || false;
        }
      };
      De = Fe((function(t2, n2, e2, r2, i2) {
        return 2 === t2.i && (ee(t2, jn(n2, r2, e2), i2), true);
      }), Me);
      Ge = Fe((function(t2, n2, e2, r2, i2) {
        return 2 === t2.i && (ee(t2, jn(n2, r2, e2), i2), true);
      }), Me);
      Ce = Symbol();
      Re = Symbol();
      We = Symbol();
      $e = Symbol();
      He = Symbol();
      sr = ft(0);
      yr = ur((function(t2, n2, e2) {
        if (1 !== t2.i) return false;
        var r2 = t2.g;
        t2 = zn(r2);
        const i2 = zn(r2);
        r2 = 2 * (i2 >> 31) + 1;
        const o2 = i2 >>> 20 & 2047;
        return t2 = 4294967296 * (1048575 & i2) + t2, lr(n2, e2, 2047 == o2 ? t2 ? NaN : r2 * (1 / 0) : 0 == o2 ? 5e-324 * r2 * t2 : r2 * Math.pow(2, o2 - 1075) * (t2 + 4503599627370496)), true;
      }), (function(t2, n2, e2) {
        null != (n2 = Dt(n2)) && (be(t2, e2, 1), t2 = t2.g, (e2 = wt || (wt = new DataView(new ArrayBuffer(8)))).setFloat64(0, +n2, true), _t = e2.getUint32(0, true), St = e2.getUint32(4, true), me(t2, _t), me(t2, St));
      }), je);
      br = ur((function(t2, n2, e2) {
        if (5 !== t2.i) return false;
        var r2 = zn(t2.g);
        t2 = 2 * (r2 >> 31) + 1;
        const i2 = r2 >>> 23 & 255;
        return r2 &= 8388607, lr(n2, e2, 255 == i2 ? r2 ? NaN : t2 * (1 / 0) : 0 == i2 ? 1401298464324817e-60 * t2 * r2 : t2 * Math.pow(2, i2 - 150) * (r2 + 8388608)), true;
      }), (function(t2, n2, e2) {
        null != (n2 = Dt(n2)) && (be(t2, e2, 5), t2 = t2.g, (e2 = wt || (wt = new DataView(new ArrayBuffer(8)))).setFloat32(0, +n2, true), St = 0, _t = e2.getUint32(0, true), me(t2, _t));
      }), Ne);
      wr = ur((function(t2, n2, e2) {
        return 0 !== t2.i ? t2 = false : (lr(n2, e2, Wn(t2.g, Bt)), t2 = true), t2;
      }), hr, Pe);
      _r = ur((function(t2, n2, e2) {
        return 0 !== t2.i ? n2 = false : (lr(n2, e2, (t2 = Wn(t2.g, Bt)) === sr ? void 0 : t2), n2 = true), n2;
      }), hr, Pe);
      Sr = ur((function(t2, n2, e2) {
        return 0 !== t2.i ? t2 = false : (lr(n2, e2, Wn(t2.g, Tt)), t2 = true), t2;
      }), (function(t2, n2, e2) {
        if (n2 = (function(t3) {
          if (null == t3) return t3;
          var n3 = typeof t3;
          if ("bigint" === n3) return String(kt(64, t3));
          if (Ct(t3)) {
            if ("string" === n3) return n3 = Mt(Number(t3)), xt(n3) && n3 >= 0 ? t3 = String(n3) : (-1 !== (n3 = t3.indexOf(".")) && (t3 = t3.substring(0, n3)), (n3 = "-" !== t3[0] && ((n3 = t3.length) < 20 || 20 === n3 && t3 <= "18446744073709551615")) || (Nt(t3), t3 = Ut(_t, St))), t3;
            if ("number" === n3) return (t3 = Mt(t3)) >= 0 && xt(t3) || (It(t3), t3 = Et(_t, St)), t3;
          }
        })(n2), null != n2) {
          if ("string" == typeof n2) ue(n2);
          if (null != n2) switch (be(t2, e2, 0), typeof n2) {
            case "number":
              t2 = t2.g, It(n2), ge(t2, _t, St);
              break;
            case "bigint":
              e2 = BigInt.asUintN(64, n2), e2 = new ce(Number(e2 & BigInt(4294967295)), Number(e2 >> BigInt(32))), ge(t2.g, e2.i, e2.g);
              break;
            default:
              e2 = ue(n2), ge(t2.g, e2.i, e2.g);
          }
        }
      }), Le);
      Ar = ur((function(t2, n2, e2) {
        return 0 === t2.i && (lr(n2, e2, Hn(t2.g)), true);
      }), fr, Be);
      Ir = cr((function(t2, n2, e2) {
        return (0 === t2.i || 2 === t2.i) && (n2 = Un(n2, 0 | n2[J], e2), 2 == t2.i ? oe(t2, Hn, n2) : n2.push(Hn(t2.g)), true);
      }), (function(t2, n2, e2) {
        if (null != (n2 = ar(Rt, n2)) && n2.length) {
          e2 = we(t2, e2);
          for (let e3 = 0; e3 < n2.length; e3++) ve(t2.g, n2[e3]);
          _e(t2, e2);
        }
      }), Be);
      Er = ur((function(t2, n2, e2) {
        return 0 === t2.i && (lr(n2, e2, 0 === (t2 = Hn(t2.g)) ? void 0 : t2), true);
      }), fr, Be);
      Tr = ur((function(t2, n2, e2) {
        return 0 === t2.i && (lr(n2, e2, $n(t2.g)), true);
      }), dr, Ee);
      Br = ur((function(t2, n2, e2) {
        return 0 === t2.i && (lr(n2, e2, false === (t2 = $n(t2.g)) ? void 0 : t2), true);
      }), dr, Ee);
      Ur = cr((function(t2, n2, e2) {
        return 2 === t2.i && (t2 = re(t2), Un(n2, 0 | n2[J], e2).push(t2), true);
      }), (function(t2, n2, e2) {
        if (null != (n2 = ar(Xt, n2))) for (let s2 = 0; s2 < n2.length; s2++) {
          var r2 = t2, i2 = e2, o2 = n2[s2];
          null != o2 && Se(r2, i2, c(o2));
        }
      }), Te);
      Pr = ur((function(t2, n2, e2) {
        return 2 === t2.i && (lr(n2, e2, "" === (t2 = re(t2)) ? void 0 : t2), true);
      }), gr, Te);
      Lr = ur((function(t2, n2, e2) {
        return 2 === t2.i && (lr(n2, e2, re(t2)), true);
      }), gr, Te);
      Nr = (function(t2, n2, e2 = Ie) {
        return new xe(t2, n2, e2);
      })((function(t2, n2, e2, r2, i2) {
        return 2 === t2.i && (r2 = an(void 0, r2), Un(n2, 0 | n2[J], e2).push(r2), ee(t2, r2, i2), true);
      }), (function(t2, n2, e2, r2, i2) {
        if (Array.isArray(n2)) {
          for (let o2 = 0; o2 < n2.length; o2++) pr(t2, n2[o2], e2, r2, i2);
          1 & (t2 = 0 | n2[J]) || Q(n2, 1 | t2);
        }
      }));
      jr = Fe((function(t2, n2, e2, r2, i2, o2) {
        if (2 !== t2.i) return false;
        let s2 = 0 | n2[J];
        return Ln(n2, s2, o2, e2, st(s2)), ee(t2, n2 = jn(n2, r2, e2), i2), true;
      }), pr);
      Or = ur((function(t2, n2, e2) {
        return 2 === t2.i && (lr(n2, e2, ie(t2)), true);
      }), vr, Oe);
      Vr = ur((function(t2, n2, e2) {
        return 0 === t2.i && (lr(n2, e2, 0 === (t2 = Hn(t2.g) >>> 0) ? void 0 : t2), true);
      }), mr, Ue);
      kr = ur((function(t2, n2, e2) {
        return 0 === t2.i && (lr(n2, e2, Hn(t2.g)), true);
      }), (function(t2, n2, e2) {
        null != (n2 = Rt(n2)) && (n2 = parseInt(n2, 10), be(t2, e2, 0), ve(t2.g, n2));
      }), Ve);
      xr = [0, Pr, ur((function(t2, n2, e2) {
        return 2 === t2.i && (lr(n2, e2, (t2 = ie(t2)) === B() ? void 0 : t2), true);
      }), (function(t2, n2, e2) {
        if (null != n2) {
          if (n2 instanceof ke) {
            const r2 = n2.S;
            return void (r2 ? (n2 = r2(n2), null != n2 && Se(t2, e2, Rn(n2, true).buffer)) : k(W, 3));
          }
          if (Array.isArray(n2)) return void k(W, 3);
        }
        vr(t2, n2, e2);
      }), Oe)];
      Mr = globalThis.trustedTypes;
      Cr = [0, Ar, kr, Tr, -1, Ir, kr, -1, Tr];
      Rr = class extends ke {
        constructor(t2) {
          super(t2);
        }
      };
      Wr = [0, Tr, Lr, Tr, kr, -1, cr((function(t2, n2, e2) {
        return (0 === t2.i || 2 === t2.i) && (n2 = Un(n2, 0 | n2[J], e2), 2 == t2.i ? oe(t2, Kn, n2) : n2.push(Hn(t2.g)), true);
      }), (function(t2, n2, e2) {
        if (null != (n2 = ar(Rt, n2)) && n2.length) {
          e2 = we(t2, e2);
          for (let e3 = 0; e3 < n2.length; e3++) ve(t2.g, n2[e3]);
          _e(t2, e2);
        }
      }), Ve), Lr, -1, [0, Tr, -1], kr, Tr, -1];
      $r = [0, 3, Tr, -1, 2, [0, [2], Ar, jr, [0, ur((function(t2, n2, e2) {
        return 0 === t2.i && (lr(n2, e2, Hn(t2.g) >>> 0), true);
      }), mr, Ue)]], [0, kr, Tr, kr, Tr, kr, Tr, Lr, -1], [0, [3, 4], Lr, -1, jr, [0, Ar], jr, [0, kr]], [0]];
      Hr = [0, Lr, -2];
      zr = class extends ke {
        constructor(t2) {
          super(t2);
        }
      };
      Kr = [0];
      Jr = [0, Ar, Tr, 1, Tr, -4];
      Xr = class extends ke {
        constructor(t2) {
          super(t2, 2);
        }
      };
      Yr = {};
      Yr[336783863] = [0, Lr, Tr, -1, Ar, [0, [1, 2, 3, 4, 5, 6, 7, 8, 9], jr, Kr, jr, Wr, jr, Hr, jr, Jr, jr, Cr, jr, [0, Lr, -2], jr, [0, Lr, kr], jr, $r, jr, [0, kr, -1, Tr]], [0, Lr], Tr, [0, [1, 3], [2, 4], jr, [0, Ir], -1, jr, [0, Ur], -1, Nr, [0, Lr, -1]], Lr];
      Qr = [0, _r, -1, Br, -3, _r, Ir, Pr, Er, _r, -1, Br, Er, Br, -2, Pr];
      Zr = class extends ke {
        constructor(t2) {
          super(t2, 500);
        }
        o(t2) {
          return Fn(this, 0, 7, t2);
        }
      };
      ti = [-1, {}];
      ni = [0, Lr, 1, ti];
      ei = [0, Lr, Ur, ti];
      ri = class extends ke {
        constructor(t2) {
          super(t2, 500);
        }
        o(t2) {
          return Fn(this, 0, 1001, t2);
        }
      };
      ri.prototype.i = (qr = [-500, Nr, [-500, Pr, -1, Ur, -3, [-2, Yr, Tr], Nr, xr, Er, -1, ni, ei, Nr, [0, Pr, Br], Pr, Qr, Er, Ur, 987, Ur], 4, Nr, [-500, Lr, -1, [-1, {}], 998, Lr], Nr, [-500, Lr, Ur, -1, [-2, {}, Tr], 997, Ur, -1], Er, Nr, [-500, Lr, Ur, ti, 998, Ur], Ur, Er, ni, ei, Nr, [0, Pr, -1, ti], Ur, -2, Qr, Pr, -1, Br, [0, Br, Vr], 978, ti, Nr, xr], function() {
        const t2 = new class {
          constructor() {
            this.j = [], this.i = 0, this.g = new class {
              constructor() {
                this.g = [];
              }
              length() {
                return this.g.length;
              }
              end() {
                const t3 = this.g;
                return this.g = [], t3;
              }
            }();
          }
        }();
        or(this.l, t2, Je(Ce, er, rr, qr)), ye(t2, t2.g.end());
        const n2 = new Uint8Array(t2.i), e2 = t2.j, r2 = e2.length;
        let i2 = 0;
        for (let t3 = 0; t3 < r2; t3++) {
          const r3 = e2[t3];
          n2.set(r3, i2), i2 += r3.length;
        }
        return t2.j = [n2], n2;
      });
      oi = class extends ke {
        constructor(t2) {
          super(t2);
        }
      };
      si = class extends ke {
        constructor(t2) {
          super(t2);
        }
        i() {
          return kn(this, oi);
        }
      };
      ai = [0, Nr, [0, Ar, br, Lr, -1]];
      ui = class extends ke {
        constructor(t2) {
          super(t2);
        }
      };
      ci = class extends ke {
        constructor(t2) {
          super(t2);
        }
      };
      li = [1, 2, 3, 4, 5, 6];
      hi = class extends ke {
        constructor(t2) {
          super(t2);
        }
        i() {
          return null != yn(this, 1, void 0, Tn);
        }
        j() {
          return null != Xt(yn(this, 2));
        }
      };
      fi = class extends ke {
        constructor(t2) {
          super(t2);
        }
      };
      di = class extends ke {
        constructor(t2) {
          super(t2);
        }
      };
      ii = new class {
        constructor() {
          var t2 = Xr;
          this.g = di, this.j = Fn, this.defaultValue = void 0, this.i = null != t2.N ? ot : void 0;
        }
        register() {
          p(this);
        }
      }(), Yr[451755788] = [0, [0, [0, Or, Lr, [0, Ar, wr, -1], [0, Sr, wr]], Tr, [0, li, jr, Jr, jr, Wr, jr, Cr, jr, Kr, jr, Hr, jr, $r], kr], [0, Lr, Ar, br, Ur, -1], yr];
      gi = class extends ke {
        constructor(t2) {
          super(t2);
        }
      };
      pi = /* @__PURE__ */ (function(t2, n2) {
        return (e2, r2) => {
          {
            const o2 = { C: true };
            r2 && Object.assign(o2, r2), e2 = Qn(e2, void 0, void 0, o2);
            try {
              const r3 = new t2(), o3 = r3.l;
              Ze(n2)(o3, e2);
              var i2 = r3;
            } finally {
              Zn(e2);
            }
          }
          return i2;
        };
      })(class extends ke {
        constructor(t2) {
          super(t2);
        }
      }, [0, Nr, [0, 1, Ar, Lr, ai], wr]);
      Si = /* @__PURE__ */ (function(t2) {
        return class extends t2 {
          K() {
            this.h._registerModelResourcesGraphService();
          }
        };
      })(class {
        constructor(t2, n2) {
          this.j = true, this.h = t2, this.g = null, this.i = 0, this.m = "function" == typeof this.h._addIntToInputStream, void 0 !== n2 ? this.h.canvas = n2 : vi() ? this.h.canvas = new OffscreenCanvas(1, 1) : (console.warn("OffscreenCanvas not supported and GraphRunner constructor glCanvas parameter is undefined. Creating backup canvas."), this.h.canvas = document.createElement("canvas"));
        }
        async initializeGraph(t2) {
          const n2 = await (await fetch(t2)).arrayBuffer();
          t2 = !(t2.endsWith(".pbtxt") || t2.endsWith(".textproto")), this.setGraph(new Uint8Array(n2), t2);
        }
        setGraphFromString(t2) {
          this.setGraph(new TextEncoder().encode(t2), false);
        }
        setGraph(t2, n2) {
          const e2 = t2.length, r2 = this.h._malloc(e2);
          this.h.HEAPU8.set(t2, r2), n2 ? this.h._changeBinaryGraph(e2, r2) : this.h._changeTextGraph(e2, r2), this.h._free(r2);
        }
        configureAudio(t2, n2, e2, r2, i2) {
          this.h._configureAudio || console.warn('Attempting to use configureAudio without support for input audio. Is build dep ":gl_graph_runner_audio" missing?'), yi(this, r2 || "input_audio", ((r3) => {
            yi(this, i2 = i2 || "audio_header", ((i3) => {
              this.h._configureAudio(r3, i3, t2, n2 ?? 0, e2);
            }));
          }));
        }
        setAutoResizeCanvas(t2) {
          this.j = t2;
        }
        setAutoRenderToScreen(t2) {
          this.h._setAutoRenderToScreen(t2);
        }
        setGpuBufferVerticalFlip(t2) {
          this.h.gpuOriginForWebTexturesIsBottomLeft = t2;
        }
        attachErrorListener(t2) {
          this.h.errorListener = t2;
        }
        attachEmptyPacketListener(t2, n2) {
          this.h.emptyPacketListeners = this.h.emptyPacketListeners || {}, this.h.emptyPacketListeners[t2] = n2;
        }
        addAudioToStream(t2, n2, e2) {
          this.addAudioToStreamWithShape(t2, 0, 0, n2, e2);
        }
        addAudioToStreamWithShape(t2, n2, e2, r2, i2) {
          const o2 = 4 * t2.length;
          this.i !== o2 && (this.g && this.h._free(this.g), this.g = this.h._malloc(o2), this.i = o2), this.h.HEAPF32.set(t2, this.g / 4), yi(this, r2, ((t3) => {
            this.h._addAudioToInputStream(this.g, n2, e2, t3, i2);
          }));
        }
        addGpuBufferToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            if (!this.h.canvas) throw Error("No OpenGL canvas configured.");
            n3 ? this.h._bindTextureToStream(n3) : this.h._bindTextureToCanvas();
            const r2 = this.h.canvas.getContext("webgl2") || this.h.canvas.getContext("webgl");
            if (!r2) throw Error("Failed to obtain WebGL context from the provided canvas. `getContext()` should only be invoked with `webgl` or `webgl2`.");
            this.h.gpuOriginForWebTexturesIsBottomLeft && r2.pixelStorei(r2.UNPACK_FLIP_Y_WEBGL, true), r2.texImage2D(r2.TEXTURE_2D, 0, r2.RGBA, r2.RGBA, r2.UNSIGNED_BYTE, t2), this.h.gpuOriginForWebTexturesIsBottomLeft && r2.pixelStorei(r2.UNPACK_FLIP_Y_WEBGL, false);
            const [i2, o2] = void 0 !== t2.videoWidth ? [t2.videoWidth, t2.videoHeight] : void 0 !== t2.naturalWidth ? [t2.naturalWidth, t2.naturalHeight] : void 0 !== t2.displayWidth ? [t2.displayWidth, t2.displayHeight] : [t2.width, t2.height];
            !this.j || i2 === this.h.canvas.width && o2 === this.h.canvas.height || (this.h.canvas.width = i2, this.h.canvas.height = o2);
            const [s2, a2] = [i2, o2];
            this.h._addBoundTextureToStream(n3, s2, a2, e2);
          }));
        }
        addBoolToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            this.h._addBoolToInputStream(t2, n3, e2);
          }));
        }
        addDoubleToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            this.h._addDoubleToInputStream(t2, n3, e2);
          }));
        }
        addFloatToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            this.h._addFloatToInputStream(t2, n3, e2);
          }));
        }
        addIntToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            this.h._addIntToInputStream(t2, n3, e2);
          }));
        }
        addUintToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            this.h._addUintToInputStream(t2, n3, e2);
          }));
        }
        addStringToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            yi(this, t2, ((t3) => {
              this.h._addStringToInputStream(t3, n3, e2);
            }));
          }));
        }
        addStringRecordToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            bi(this, Object.keys(t2), ((r2) => {
              bi(this, Object.values(t2), ((i2) => {
                this.h._addFlatHashMapToInputStream(r2, i2, Object.keys(t2).length, n3, e2);
              }));
            }));
          }));
        }
        addProtoToStream(t2, n2, e2, r2) {
          yi(this, e2, ((e3) => {
            yi(this, n2, ((n3) => {
              const i2 = this.h._malloc(t2.length);
              this.h.HEAPU8.set(t2, i2), this.h._addProtoToInputStream(i2, t2.length, n3, e3, r2), this.h._free(i2);
            }));
          }));
        }
        addEmptyPacketToStream(t2, n2) {
          yi(this, t2, ((t3) => {
            this.h._addEmptyPacketToInputStream(t3, n2);
          }));
        }
        addBoolVectorToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            const r2 = this.h._allocateBoolVector(t2.length);
            if (!r2) throw Error("Unable to allocate new bool vector on heap.");
            for (const n4 of t2) this.h._addBoolVectorEntry(r2, n4);
            this.h._addBoolVectorToInputStream(r2, n3, e2);
          }));
        }
        addDoubleVectorToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            const r2 = this.h._allocateDoubleVector(t2.length);
            if (!r2) throw Error("Unable to allocate new double vector on heap.");
            for (const n4 of t2) this.h._addDoubleVectorEntry(r2, n4);
            this.h._addDoubleVectorToInputStream(r2, n3, e2);
          }));
        }
        addFloatVectorToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            const r2 = this.h._allocateFloatVector(t2.length);
            if (!r2) throw Error("Unable to allocate new float vector on heap.");
            for (const n4 of t2) this.h._addFloatVectorEntry(r2, n4);
            this.h._addFloatVectorToInputStream(r2, n3, e2);
          }));
        }
        addIntVectorToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            const r2 = this.h._allocateIntVector(t2.length);
            if (!r2) throw Error("Unable to allocate new int vector on heap.");
            for (const n4 of t2) this.h._addIntVectorEntry(r2, n4);
            this.h._addIntVectorToInputStream(r2, n3, e2);
          }));
        }
        addUintVectorToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            const r2 = this.h._allocateUintVector(t2.length);
            if (!r2) throw Error("Unable to allocate new unsigned int vector on heap.");
            for (const n4 of t2) this.h._addUintVectorEntry(r2, n4);
            this.h._addUintVectorToInputStream(r2, n3, e2);
          }));
        }
        addStringVectorToStream(t2, n2, e2) {
          yi(this, n2, ((n3) => {
            const r2 = this.h._allocateStringVector(t2.length);
            if (!r2) throw Error("Unable to allocate new string vector on heap.");
            for (const n4 of t2) yi(this, n4, ((t3) => {
              this.h._addStringVectorEntry(r2, t3);
            }));
            this.h._addStringVectorToInputStream(r2, n3, e2);
          }));
        }
        addBoolToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            this.h._addBoolToInputSidePacket(t2, n3);
          }));
        }
        addDoubleToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            this.h._addDoubleToInputSidePacket(t2, n3);
          }));
        }
        addFloatToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            this.h._addFloatToInputSidePacket(t2, n3);
          }));
        }
        addIntToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            this.h._addIntToInputSidePacket(t2, n3);
          }));
        }
        addUintToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            this.h._addUintToInputSidePacket(t2, n3);
          }));
        }
        addStringToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            yi(this, t2, ((t3) => {
              this.h._addStringToInputSidePacket(t3, n3);
            }));
          }));
        }
        addProtoToInputSidePacket(t2, n2, e2) {
          yi(this, e2, ((e3) => {
            yi(this, n2, ((n3) => {
              const r2 = this.h._malloc(t2.length);
              this.h.HEAPU8.set(t2, r2), this.h._addProtoToInputSidePacket(r2, t2.length, n3, e3), this.h._free(r2);
            }));
          }));
        }
        addBoolVectorToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            const e2 = this.h._allocateBoolVector(t2.length);
            if (!e2) throw Error("Unable to allocate new bool vector on heap.");
            for (const n4 of t2) this.h._addBoolVectorEntry(e2, n4);
            this.h._addBoolVectorToInputSidePacket(e2, n3);
          }));
        }
        addDoubleVectorToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            const e2 = this.h._allocateDoubleVector(t2.length);
            if (!e2) throw Error("Unable to allocate new double vector on heap.");
            for (const n4 of t2) this.h._addDoubleVectorEntry(e2, n4);
            this.h._addDoubleVectorToInputSidePacket(e2, n3);
          }));
        }
        addFloatVectorToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            const e2 = this.h._allocateFloatVector(t2.length);
            if (!e2) throw Error("Unable to allocate new float vector on heap.");
            for (const n4 of t2) this.h._addFloatVectorEntry(e2, n4);
            this.h._addFloatVectorToInputSidePacket(e2, n3);
          }));
        }
        addIntVectorToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            const e2 = this.h._allocateIntVector(t2.length);
            if (!e2) throw Error("Unable to allocate new int vector on heap.");
            for (const n4 of t2) this.h._addIntVectorEntry(e2, n4);
            this.h._addIntVectorToInputSidePacket(e2, n3);
          }));
        }
        addUintVectorToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            const e2 = this.h._allocateUintVector(t2.length);
            if (!e2) throw Error("Unable to allocate new unsigned int vector on heap.");
            for (const n4 of t2) this.h._addUintVectorEntry(e2, n4);
            this.h._addUintVectorToInputSidePacket(e2, n3);
          }));
        }
        addStringVectorToInputSidePacket(t2, n2) {
          yi(this, n2, ((n3) => {
            const e2 = this.h._allocateStringVector(t2.length);
            if (!e2) throw Error("Unable to allocate new string vector on heap.");
            for (const n4 of t2) yi(this, n4, ((t3) => {
              this.h._addStringVectorEntry(e2, t3);
            }));
            this.h._addStringVectorToInputSidePacket(e2, n3);
          }));
        }
        attachBoolListener(t2, n2) {
          wi(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachBoolListener(t3);
          }));
        }
        attachBoolVectorListener(t2, n2) {
          _i(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachBoolVectorListener(t3);
          }));
        }
        attachIntListener(t2, n2) {
          wi(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachIntListener(t3);
          }));
        }
        attachIntVectorListener(t2, n2) {
          _i(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachIntVectorListener(t3);
          }));
        }
        attachUintListener(t2, n2) {
          wi(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachUintListener(t3);
          }));
        }
        attachUintVectorListener(t2, n2) {
          _i(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachUintVectorListener(t3);
          }));
        }
        attachDoubleListener(t2, n2) {
          wi(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachDoubleListener(t3);
          }));
        }
        attachDoubleVectorListener(t2, n2) {
          _i(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachDoubleVectorListener(t3);
          }));
        }
        attachFloatListener(t2, n2) {
          wi(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachFloatListener(t3);
          }));
        }
        attachFloatVectorListener(t2, n2) {
          _i(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachFloatVectorListener(t3);
          }));
        }
        attachStringListener(t2, n2) {
          wi(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachStringListener(t3);
          }));
        }
        attachStringVectorListener(t2, n2) {
          _i(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachStringVectorListener(t3);
          }));
        }
        attachProtoListener(t2, n2, e2) {
          wi(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachProtoListener(t3, e2 || false);
          }));
        }
        attachProtoVectorListener(t2, n2, e2) {
          _i(this, t2, n2), yi(this, t2, ((t3) => {
            this.h._attachProtoVectorListener(t3, e2 || false);
          }));
        }
        attachAudioListener(t2, n2, e2) {
          this.h._attachAudioListener || console.warn('Attempting to use attachAudioListener without support for output audio. Is build dep ":gl_graph_runner_audio_out" missing?'), wi(this, t2, ((t3, e3) => {
            t3 = new Float32Array(t3.buffer, t3.byteOffset, t3.length / 4), n2(t3, e3);
          })), yi(this, t2, ((t3) => {
            this.h._attachAudioListener(t3, e2 || false);
          }));
        }
        finishProcessing() {
          this.h._waitUntilIdle();
        }
        closeGraph() {
          this.h._closeGraph(), this.h.simpleListeners = void 0, this.h.emptyPacketListeners = void 0;
        }
      });
      Ai = class extends Si {
      };
      Pi = class {
        constructor(t2) {
          this.g = t2, this.m = [], this.j = 0, this.g.setAutoRenderToScreen(false);
        }
        setGraph(t2, n2) {
          this.g.attachErrorListener(((t3, n3) => {
            this.m.push(Error(n3));
          })), this.g.K(), this.g.setGraph(t2, n2), Ui(this);
        }
        finishProcessing() {
          this.g.finishProcessing(), Ui(this);
        }
        close() {
          this.g.closeGraph();
        }
      };
      Pi.prototype.close = Pi.prototype.close;
      Ni = class extends Pi {
        constructor() {
          super(...arguments), this.G = 48e3;
        }
        L(t2) {
          this.G = t2;
        }
      };
      Ni.prototype.setDefaultSampleRate = Ni.prototype.L;
      Vi = class extends Ni {
        constructor(t2, n2) {
          super(new Ai(t2, n2)), this.u = [], Fn(t2 = this.i = new di(), 0, 1, n2 = new fi());
        }
        get baseOptions() {
          return On(this.i, fi, 1);
        }
        set baseOptions(t2) {
          Fn(this.i, 0, 1, t2);
        }
        o(t2) {
          var n2 = this.i, e2 = On(this.i, ui, 2);
          if (e2) {
            var r2 = e2.l;
            const t3 = 0 | r2[J];
            e2 = vn(e2, r2, t3) ? ln(e2, r2, true) : new e2.constructor(hn(r2, t3, false));
          } else e2 = new ui();
          if (void 0 !== t2.displayNamesLocale ? wn(e2, 1, Jt(t2.displayNamesLocale)) : void 0 === t2.displayNamesLocale && wn(e2, 1), void 0 !== t2.maxResults) {
            if (null != (r2 = t2.maxResults)) {
              if ("number" != typeof r2) throw V();
              if (!Ft(r2)) throw V();
              r2 |= 0;
            }
            wn(e2, 2, r2);
          } else "maxResults" in t2 && wn(e2, 2);
          if (void 0 !== t2.scoreThreshold) {
            if (null != (r2 = t2.scoreThreshold) && "number" != typeof r2) throw Error(`Value of float/double field must be a number, found ${typeof r2}: ${r2}`);
            wn(e2, 3, r2);
          } else "scoreThreshold" in t2 && wn(e2, 3);
          return void 0 !== t2.categoryAllowlist ? Bn(e2, 4, t2.categoryAllowlist) : "categoryAllowlist" in t2 && wn(e2, 4), void 0 !== t2.categoryDenylist ? Bn(e2, 5, t2.categoryDenylist) : "categoryDenylist" in t2 && wn(e2, 5), Fn(n2, 0, 2, e2), Bi(this, t2);
        }
        I(t2, n2) {
          var e2 = this.j + 1;
          return this.g.addDoubleToStream(n2 ?? this.G, "sample_rate", e2), this.g.addAudioToStreamWithShape(t2, 1, t2.length, "audio_in", e2), this.u = [], this.finishProcessing(), [...this.u];
        }
      };
      Vi.prototype.classify = Vi.prototype.I, Vi.prototype.setOptions = Vi.prototype.o, Vi.createFromModelPath = function(t2, n2) {
        return Ei(t2, { baseOptions: { modelAssetPath: n2 } });
      }, Vi.createFromModelBuffer = function(t2, n2) {
        return Li(t2, { baseOptions: { modelAssetBuffer: n2 } });
      }, Vi.createFromOptions = function(t2, n2) {
        return Li(t2, n2);
      };
      xi = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]);
      Di = class {
      };
      Di.forVisionTasks = function(t2, n2 = false) {
        return Mi("vision", t2 ?? Gr``, n2);
      }, Di.forTextTasks = function(t2, n2 = false) {
        return Mi("text", t2 ?? Gr``, n2);
      }, Di.forGenAiTasks = function(t2, n2 = false) {
        return Mi("genai", t2 ?? Gr``, n2);
      }, Di.forAudioTasks = function(t2, n2 = false) {
        return Mi("audio", t2 ?? Gr``, n2);
      }, Di.isSimdSupported = function(t2 = false) {
        return Fi(t2);
      };
    }
  });

  // src/paths.js
  function appDirectoryUrl() {
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = "";
    let path = url.pathname || "/";
    if (!path.endsWith("/")) {
      const last = path.split("/").pop() || "";
      if (last.includes(".")) {
        path = path.slice(0, path.lastIndexOf("/") + 1);
      } else {
        path += "/";
      }
    }
    url.pathname = path;
    return url;
  }

  // src/capture.js
  var WORKLET_SOURCE = `
class CaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (channel && channel.length) {
      this.port.postMessage(channel.slice());
    }
    return true;
  }
}
registerProcessor("capture-processor", CaptureProcessor);
`;
  var PREFERRED_AUDIO = {
    echoCancellation: { ideal: true },
    noiseSuppression: { ideal: false },
    autoGainControl: { ideal: false },
    channelCount: { ideal: 1 }
  };
  function audioContextConstructor() {
    return window.AudioContext || window.webkitAudioContext;
  }
  function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
      const id = window.setTimeout(() => resolve("timeout"), ms);
      promise.then(
        (value) => {
          window.clearTimeout(id);
          resolve(value);
        },
        (error) => {
          window.clearTimeout(id);
          reject(error);
        }
      );
    });
  }
  var MicCapture = class {
    constructor(onAudio) {
      this.onAudio = onAudio;
      this.context = null;
      this.stream = null;
      this.node = null;
      this.source = null;
      this.silent = null;
      this.workletObjectUrl = null;
      this._onStateChange = null;
      this._onTrackEnded = null;
      this._frameLogged = false;
      this.onCaptureError = null;
    }
    async start() {
      if (this.context || this.stream) {
        await this.stop();
      }
      if (!window.isSecureContext) {
        const error = new Error("Microphone access needs HTTPS.");
        error.name = "SecurityError";
        throw error;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        const error = new Error("This browser cannot access a microphone.");
        error.name = "NotSupportedError";
        throw error;
      }
      const AudioCtx = audioContextConstructor();
      if (!AudioCtx) {
        const error = new Error("This browser cannot process microphone audio.");
        error.name = "NotSupportedError";
        throw error;
      }
      this.context = new AudioCtx();
      const resumeAttempt = this.context.resume();
      try {
        this.stream = await this._openMicrophone();
      } catch (error) {
        await this.stop();
        throw error;
      }
      try {
        this.source = this.context.createMediaStreamSource(this.stream);
        this.silent = this.context.createGain();
        this.silent.gain.value = 1e-5;
        await this._connectProcessor();
        this.source.connect(this.node);
        this.node.connect(this.silent);
        this.silent.connect(this.context.destination);
        try {
          await withTimeout(resumeAttempt, 1500);
        } catch (error) {
          console.warn("AudioContext.resume() failed", error?.name || "", error?.message || error);
        }
        if (this.context.state === "suspended") {
          try {
            await this.context.resume();
          } catch (error) {
            console.warn("AudioContext.resume() retry failed", error?.name || "", error?.message || error);
          }
        }
        if (this.context.state === "suspended") {
          const error = new Error("Click Listening so the browser can start the microphone.");
          error.name = "AudioContextSuspendedError";
          throw error;
        }
        this._listenForInterruptions();
      } catch (error) {
        await this.stop();
        throw error;
      }
    }
    async resume() {
      if (!this.context || this.context.state === "closed") return;
      if (this.context.state === "suspended") {
        await this.context.resume();
      }
    }
    async stop() {
      this._unlistenForInterruptions();
      try {
        this.node?.disconnect();
      } catch {
      }
      try {
        this.source?.disconnect();
      } catch {
      }
      try {
        this.silent?.disconnect();
      } catch {
      }
      this.stream?.getTracks().forEach((track) => track.stop());
      if (this.workletObjectUrl) {
        URL.revokeObjectURL(this.workletObjectUrl);
      }
      if (this.context && this.context.state !== "closed") {
        try {
          await this.context.close();
        } catch {
        }
      }
      this.context = null;
      this.stream = null;
      this.node = null;
      this.source = null;
      this.silent = null;
      this.workletObjectUrl = null;
      this._frameLogged = false;
    }
    async _openMicrophone() {
      try {
        return await navigator.mediaDevices.getUserMedia({
          audio: PREFERRED_AUDIO,
          video: false
        });
      } catch (error) {
        if (error?.name === "OverconstrainedError" || error?.name === "ConstraintNotSatisfiedError") {
          console.warn("Microphone constraints not supported; retrying with defaults");
          return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        }
        throw error;
      }
    }
    async _connectProcessor() {
      const deliver = (samples) => {
        if (!this.context) return;
        if (!this._frameLogged) {
          this._frameLogged = true;
          console.info("Microphone capture is receiving audio");
        }
        this.onAudio(samples, this.context.sampleRate);
      };
      if (this.context.audioWorklet) {
        try {
          await Promise.race([
            this._loadWorkletModule(),
            new Promise((_2, reject) => {
              window.setTimeout(() => reject(new Error("AudioWorklet addModule timed out")), 4e3);
            })
          ]);
          this.node = new AudioWorkletNode(this.context, "capture-processor");
          this.node.port.onmessage = (event) => {
            deliver(event.data);
          };
          return;
        } catch (error) {
          console.warn("AudioWorklet failed; using script processor", error?.message || error);
        }
      }
      const processor = this.context.createScriptProcessor?.(4096, 1, 1);
      if (!processor) {
        const error = new Error("This browser cannot process microphone audio.");
        error.name = "NotSupportedError";
        throw error;
      }
      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        deliver(new Float32Array(input));
      };
      this.node = processor;
    }
    async _loadWorkletModule() {
      const blob = new Blob([WORKLET_SOURCE], { type: "application/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      try {
        await this.context.audioWorklet.addModule(blobUrl);
        this.workletObjectUrl = blobUrl;
        return;
      } catch (error) {
        URL.revokeObjectURL(blobUrl);
        console.warn("Blob AudioWorklet module failed", error?.message || error);
      }
      const fileUrl = new URL("assets/capture-processor.js", appDirectoryUrl()).href;
      await this.context.audioWorklet.addModule(fileUrl);
    }
    _listenForInterruptions() {
      this._onStateChange = () => {
        if (this.context?.state === "suspended") {
          console.warn("AudioContext was suspended while listening");
        }
      };
      this.context?.addEventListener("statechange", this._onStateChange);
      const track = this.stream?.getAudioTracks?.()[0];
      if (!track) return;
      this._onTrackEnded = () => {
        console.warn("Microphone track ended");
        this.onCaptureError?.(new Error("The microphone was disconnected."));
      };
      track.addEventListener("ended", this._onTrackEnded);
    }
    _unlistenForInterruptions() {
      if (this._onStateChange && this.context) {
        this.context.removeEventListener("statechange", this._onStateChange);
      }
      const track = this.stream?.getAudioTracks?.()[0];
      if (this._onTrackEnded && track) {
        track.removeEventListener("ended", this._onTrackEnded);
      }
      this._onStateChange = null;
      this._onTrackEnded = null;
    }
  };

  // src/detection/classifying.js
  function sneezeScores(sneeze = 0, cough = 0) {
    return { sneeze, cough };
  }

  // src/detection/acoustic.js
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  function resample(input, fromRate, toRate) {
    if (fromRate === toRate) return input;
    const ratio = fromRate / toRate;
    const length = Math.max(1, Math.round(input.length / ratio));
    const output = new Float32Array(length);
    for (let i2 = 0; i2 < length; i2 += 1) {
      const src = i2 * ratio;
      const i0 = Math.floor(src);
      const i1 = Math.min(i0 + 1, input.length - 1);
      const frac = src - i0;
      output[i2] = input[i0] * (1 - frac) + input[i1] * frac;
    }
    return output;
  }
  function fftMagnitudes(time) {
    const n2 = time.length;
    const real = new Float32Array(n2);
    const imag = new Float32Array(n2);
    real.set(time);
    for (let i2 = 1, j2 = 0; i2 < n2; i2 += 1) {
      let bit = n2 >> 1;
      while (j2 & bit) {
        j2 ^= bit;
        bit >>= 1;
      }
      j2 ^= bit;
      if (i2 < j2) {
        const tmpR = real[i2];
        real[i2] = real[j2];
        real[j2] = tmpR;
        const tmpI = imag[i2];
        imag[i2] = imag[j2];
        imag[j2] = tmpI;
      }
    }
    for (let size = 2; size <= n2; size <<= 1) {
      const half = size >> 1;
      const step = 2 * Math.PI / size;
      for (let i2 = 0; i2 < n2; i2 += size) {
        for (let k2 = 0; k2 < half; k2 += 1) {
          const angle = step * k2;
          const wr2 = Math.cos(angle);
          const wi2 = -Math.sin(angle);
          const evenR = real[i2 + k2];
          const evenI = imag[i2 + k2];
          const oddR = real[i2 + k2 + half];
          const oddI = imag[i2 + k2 + half];
          const tR = wr2 * oddR - wi2 * oddI;
          const tI = wr2 * oddI + wi2 * oddR;
          real[i2 + k2] = evenR + tR;
          imag[i2 + k2] = evenI + tI;
          real[i2 + k2 + half] = evenR - tR;
          imag[i2 + k2 + half] = evenI - tI;
        }
      }
    }
    const mags = new Float32Array(n2 / 2);
    for (let i2 = 0; i2 < mags.length; i2 += 1) {
      mags[i2] = Math.hypot(real[i2], imag[i2]) / n2;
    }
    return mags;
  }
  function frameFeatures(frame, sampleRate) {
    let sumSq = 0;
    let zcr = 0;
    for (let i2 = 0; i2 < frame.length; i2 += 1) {
      sumSq += frame[i2] * frame[i2];
      if (i2 > 0 && frame[i2 - 1] * frame[i2] < 0) zcr += 1;
    }
    const rms = Math.sqrt(sumSq / frame.length);
    const windowed = new Float32Array(frame.length);
    for (let i2 = 0; i2 < frame.length; i2 += 1) {
      const hann = 0.5 * (1 - Math.cos(2 * Math.PI * i2 / (frame.length - 1)));
      windowed[i2] = frame[i2] * hann;
    }
    const mags = fftMagnitudes(windowed);
    const binHz = sampleRate / frame.length;
    let total = 0;
    let weighted = 0;
    let high = 0;
    let low = 0;
    for (let i2 = 1; i2 < mags.length; i2 += 1) {
      const hz = i2 * binHz;
      const mag = mags[i2];
      total += mag;
      weighted += mag * hz;
      if (hz >= 2e3 && hz <= 8e3) high += mag;
      if (hz < 1500) low += mag;
    }
    return {
      rms,
      zcr: zcr / frame.length,
      centroid: total > 0 ? weighted / total : 0,
      highRatio: total > 0 ? high / total : 0,
      lowRatio: total > 0 ? low / total : 0
    };
  }
  var AcousticDetector = class {
    constructor(onResult) {
      this.onResult = onResult;
      this.sampleRate = 16e3;
      this.frameSize = 1024;
      this.pending = new Float32Array(0);
      this.noiseRms = 0.01;
      this.event = null;
    }
    push(samples, sampleRate) {
      const resampled = resample(samples, sampleRate, this.sampleRate);
      const merged = new Float32Array(this.pending.length + resampled.length);
      merged.set(this.pending);
      merged.set(resampled, this.pending.length);
      let offset = 0;
      while (offset + this.frameSize <= merged.length) {
        this._consumeFrame(merged.subarray(offset, offset + this.frameSize));
        offset += this.frameSize / 2;
      }
      this.pending = merged.slice(offset);
    }
    _consumeFrame(frame) {
      const features = frameFeatures(frame, this.sampleRate);
      if (features.rms < this.noiseRms * 1.8) {
        this.noiseRms = this.noiseRms * 0.995 + features.rms * 5e-3;
      }
      const burst = features.rms > Math.max(this.noiseRms * 7, 0.03) && features.highRatio > 0.32 && features.centroid > 1400;
      if (!this.event && burst) {
        this.event = { frames: [features], startedQuiet: 0 };
        return;
      }
      if (this.event) {
        this.event.frames.push(features);
        if (!burst && features.rms < this.noiseRms * 2.2) {
          this.event.startedQuiet += 1;
        } else {
          this.event.startedQuiet = 0;
        }
        const duration = this.event.frames.length * (this.frameSize / 2 / this.sampleRate);
        if (this.event.startedQuiet >= 4 || duration > 0.9) {
          this._finishEvent();
        }
      }
    }
    _finishEvent() {
      const frames = this.event.frames;
      this.event = null;
      if (frames.length < 3) return;
      const duration = frames.length * (this.frameSize / 2 / this.sampleRate);
      let peakIndex = 0;
      for (let i2 = 1; i2 < frames.length; i2 += 1) {
        if (frames[i2].rms > frames[peakIndex].rms) peakIndex = i2;
      }
      const peak = frames[peakIndex];
      const attack = peakIndex * (this.frameSize / 2 / this.sampleRate);
      const durationScore = duration >= 0.12 && duration <= 0.75 ? 1 : duration < 0.12 ? duration / 0.12 : clamp(1 - (duration - 0.75) / 0.3, 0, 1);
      const attackScore = attack <= 0.12 ? 1 : clamp(1 - (attack - 0.12) / 0.15, 0, 1);
      const centroidScore = peak.centroid >= 1600 && peak.centroid <= 6200 ? 1 : 0.2;
      const highScore = clamp((peak.highRatio - 0.25) / 0.35, 0, 1);
      const coughHint = peak.lowRatio > 0.55 && peak.centroid < 1800 ? 0.75 : peak.lowRatio * 0.35;
      const sneeze = clamp(
        durationScore * 0.28 + attackScore * 0.18 + centroidScore * 0.24 + highScore * 0.3,
        0,
        1
      );
      const cough = clamp(coughHint + (duration > 0.55 ? 0.15 : 0), 0, 1);
      if (sneeze > 0.05 || cough > 0.05) {
        const scores = sneezeScores(sneeze, cough);
        this.onResult(scores.sneeze, scores.cough);
      }
    }
    stop() {
      this.pending = new Float32Array(0);
      this.event = null;
    }
  };

  // src/detection/yamnet.js
  function scoreFor(categories, pattern) {
    let best = 0;
    for (const category of categories) {
      const name = `${category.categoryName || ""} ${category.displayName || ""}`;
      if (pattern.test(name)) {
        best = Math.max(best, category.score || 0);
      }
    }
    return best;
  }
  function assetUrl(relativePath) {
    return new URL(relativePath, appDirectoryUrl()).href;
  }
  async function createYamnetDetector(onResult, onError) {
    let AudioClassifier;
    let FilesetResolver;
    try {
      ({ AudioClassifier, FilesetResolver } = await Promise.resolve().then(() => (init_audio_bundle(), audio_bundle_exports)));
    } catch (error) {
      console.warn("MediaPipe audio tasks are unavailable", error?.message || error);
      return null;
    }
    const wasmBase = assetUrl("wasm").replace(/\/$/, "");
    const modelPath = assetUrl("models/yamnet.tflite");
    try {
      const modelProbe = await fetch(modelPath, {
        credentials: "same-origin",
        signal: typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(8e3) : void 0
      });
      if (!modelProbe.ok) {
        console.warn("YAMNet model was not found", modelProbe.status);
        return null;
      }
      const fileset = await FilesetResolver.forAudioTasks(wasmBase);
      const classifier = await AudioClassifier.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: modelPath
        },
        runningMode: "AUDIO_CLIPS",
        maxResults: 12,
        scoreThreshold: 0.05
      });
      return {
        kind: "yamnet",
        classify(samples, sampleRate) {
          try {
            const results = classifier.classify(samples, sampleRate);
            let sneeze = 0;
            let cough = 0;
            for (const result of results || []) {
              const categories = result.classifications?.[0]?.categories || [];
              sneeze = Math.max(sneeze, scoreFor(categories, /sneeze/i));
              cough = Math.max(cough, scoreFor(categories, /cough/i));
            }
            if (sneeze > 0.05 || cough > 0.05) {
              const scores = sneezeScores(sneeze, cough);
              onResult(scores.sneeze, scores.cough);
            }
          } catch (error) {
            console.error("YAMNet classify failed", error?.message || error);
            onError?.(error.message || String(error));
          }
        },
        close() {
          classifier.close?.();
        }
      };
    } catch (error) {
      console.warn("YAMNet failed to initialise", error?.name || "", error?.message || error);
      return null;
    }
  }

  // src/detection/pipeline.js
  var TARGET_RATE = 16e3;
  var WINDOW_SAMPLES = 16e3;
  var HOP_SAMPLES = 8e3;
  var YAMNET_TIMEOUT_MS = 12e3;
  function withTimeout2(promise, ms, label) {
    return new Promise((resolve, reject) => {
      const id = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
      promise.then(
        (value) => {
          clearTimeout(id);
          resolve(value);
        },
        (error) => {
          clearTimeout(id);
          reject(error);
        }
      );
    });
  }
  var SneezePipeline = class {
    constructor({ onResult, onError }) {
      this.onResult = onResult;
      this.onError = onError;
      this.yamnet = null;
      this.acoustic = new AcousticDetector(onResult);
      this.buffer = new Float32Array(0);
      this.ready = false;
      this.initialized = false;
    }
    async start() {
      this.ready = true;
      if (!this.initialized) {
        try {
          this.yamnet = await withTimeout2(
            createYamnetDetector(this.onResult, this.onError),
            YAMNET_TIMEOUT_MS,
            "YAMNet"
          );
        } catch (error) {
          console.warn("YAMNet unavailable; using acoustic detection", error?.message || error);
          this.yamnet = null;
        }
        this.initialized = true;
      }
      return this.yamnet ? "yamnet" : "acoustic";
    }
    push(samples, sampleRate) {
      if (!this.ready) return;
      const resampled = resample(samples, sampleRate, TARGET_RATE);
      if (this.yamnet) {
        const merged = new Float32Array(this.buffer.length + resampled.length);
        merged.set(this.buffer);
        merged.set(resampled, this.buffer.length);
        this.buffer = merged;
        while (this.buffer.length >= WINDOW_SAMPLES) {
          const window2 = this.buffer.subarray(0, WINDOW_SAMPLES);
          this.yamnet.classify(window2, TARGET_RATE);
          this.buffer = this.buffer.slice(HOP_SAMPLES);
        }
        return;
      }
      this.acoustic.push(resampled, TARGET_RATE);
    }
    stop() {
      this.buffer = new Float32Array(0);
      this.acoustic.stop();
      this.ready = false;
    }
  };

  // src/platform.js
  function getRuntime() {
    const api = window.blessyou;
    if (api?.isElectron) {
      return { shell: "electron", os: api.platform };
    }
    const ua = navigator.userAgent || "";
    const platform = navigator.userAgentData?.platform || navigator.platform || "";
    if (/Android/i.test(ua)) return { shell: "web", os: "android" };
    if (/CrOS/.test(ua)) return { shell: "web", os: "chromeos" };
    if (/Win/i.test(platform) || /Windows/i.test(ua)) return { shell: "web", os: "win32" };
    if ((/Mac/i.test(platform) || /Mac OS X/.test(ua)) && !/iPhone|iPad|iPod/.test(ua)) {
      return { shell: "web", os: "darwin" };
    }
    if (/Linux/i.test(platform) || /Linux/i.test(ua)) return { shell: "web", os: "linux" };
    return { shell: "web", os: "unknown" };
  }
  function supportsAutoStart() {
    return Boolean(window.blessyou?.isElectron);
  }
  function supportsNativeQuit() {
    return Boolean(window.blessyou?.isElectron);
  }
  function deviceNoun(os = getRuntime().os) {
    if (os === "darwin") return "Mac";
    if (os === "win32") return "PC";
    if (os === "chromeos") return "Chromebook";
    return "device";
  }
  function microphoneHelp(os = getRuntime().os) {
    if (getRuntime().shell === "web") {
      return "Allow the microphone when your browser asks, then turn listening on.";
    }
    if (os === "darwin") {
      return "Allow the microphone in System Settings so ach000 can hear a sneeze.";
    }
    if (os === "win32") {
      return "Allow the microphone in Windows Settings so ach000 can hear a sneeze.";
    }
    if (os === "linux") {
      return "Allow the microphone in your system sound settings so ach000 can hear a sneeze.";
    }
    if (os === "android" || os === "chromeos") {
      return "Allow the microphone when asked, and keep this screen open so ach000 can keep listening.";
    }
    return "Allow the microphone when your browser asks so ach000 can hear a sneeze.";
  }
  function microphoneButtonLabel(os = getRuntime().os) {
    if (os === "darwin") return "Open Microphone Settings";
    if (os === "win32") return "Open Microphone Settings";
    if (os === "linux") return "Open Sound Settings";
    return "How to allow the microphone";
  }
  async function openMicrophoneSettings() {
    if (window.blessyou?.openMicSettings) {
      return window.blessyou.openMicSettings();
    }
    return false;
  }
  function applyRuntimeClass() {
    const { shell, os } = getRuntime();
    document.body.classList.add(shell === "electron" ? "shell" : "web");
    document.body.dataset.os = os;
    document.body.dataset.shell = shell;
  }

  // src/speech/speaking.js
  var UTTERANCE = "Bless you.";
  function preferredVoice() {
    const voices = speechSynthesis.getVoices?.() || [];
    const preferred = [
      "Daniel",
      "Kate",
      "Serena",
      "Samantha",
      "Google UK English Male",
      "Google UK English Female",
      "Microsoft George",
      "Microsoft Hazel"
    ];
    for (const name of preferred) {
      const match = voices.find((voice) => voice.name.includes(name));
      if (match) return match;
    }
    return voices.find((voice) => voice.lang?.toLowerCase().startsWith("en-gb")) || voices.find((voice) => voice.lang?.toLowerCase().startsWith("en")) || null;
  }
  function speakInBrowser() {
    if (!("speechSynthesis" in window)) return false;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(UTTERANCE);
    utterance.rate = 0.93;
    utterance.pitch = 1.04;
    const voice = preferredVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "en-GB";
    }
    speechSynthesis.speak(utterance);
    return true;
  }
  function speakBlessYou() {
    const voices = speechSynthesis.getVoices?.() || [];
    if (voices.length === 0 && window.blessyou?.speak) {
      window.blessyou.speak(UTTERANCE).then((ok) => {
        if (!ok) speakInBrowser();
      });
      return;
    }
    if (!speakInBrowser() && window.blessyou?.speak) {
      window.blessyou.speak(UTTERANCE);
    }
  }
  function warmUpVoices() {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener?.("voiceschanged", () => {
      speechSynthesis.getVoices();
    });
  }
  function unlockSpeech() {
    if (!("speechSynthesis" in window)) return;
    try {
      const utterance = new SpeechSynthesisUtterance(" ");
      utterance.volume = 0;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn("Could not unlock speech", error?.message || error);
    }
  }

  // src/app.js
  var KEYS = {
    sensitivity: "sensitivity",
    sneezeCount: "sneezeCount",
    micKnown: "micKnown"
  };
  var MIC_EXPLAIN = "ach000 listens with the microphone so it can hear a sneeze and say bless you. Audio stays on this device and is never recorded, stored, or uploaded.";
  var COOLDOWN = 3;
  var DEFAULT_SENSITIVITY = 0.55;
  var state = {
    isListening: false,
    permissionDenied: false,
    statusText: "Ready",
    lastSneezeAt: null,
    sneezeCount: Number(localStorage.getItem(KEYS.sneezeCount) || 0),
    errorMessage: null,
    sensitivity: Number(localStorage.getItem(KEYS.sensitivity) ?? DEFAULT_SENSITIVITY),
    lastTrigger: 0,
    deviceChangeHandler: null,
    starting: false
  };
  var pipeline = new SneezePipeline({
    onResult: handleClassification,
    onError: (message) => {
      console.error("Classifier error", message);
      state.errorMessage = "The sneeze detector hit a problem. Try turning listening off and on.";
      state.statusText = "Classifier error";
      render();
    }
  });
  var capture = new MicCapture((samples, sampleRate) => {
    pipeline.push(samples, sampleRate);
  });
  capture.onCaptureError = (error) => {
    console.warn("Microphone capture interrupted", error?.message || error);
    if (!state.isListening) return;
    state.errorMessage = error?.message || "The microphone stopped.";
    state.statusText = "Microphone stopped";
    stop();
  };
  var wakeLock = null;
  var startGeneration = 0;
  var els = {};
  function isWeb() {
    return getRuntime().shell === "web";
  }
  function threshold() {
    return 0.78 - state.sensitivity * 0.52;
  }
  function sensitivityLabel() {
    if (state.sensitivity < 0.35) return "Picky";
    if (state.sensitivity > 0.7) return "Eager";
    return "Balanced";
  }
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  function handleClassification(sneeze, cough) {
    if (!state.isListening) return;
    const now = Date.now() / 1e3;
    if (now - state.lastTrigger < COOLDOWN) return;
    if (sneeze < threshold()) return;
    if (sneeze < cough) return;
    state.lastTrigger = now;
    state.lastSneezeAt = /* @__PURE__ */ new Date();
    state.sneezeCount += 1;
    localStorage.setItem(KEYS.sneezeCount, String(state.sneezeCount));
    state.statusText = "Bless you";
    speakBlessYou();
    render();
    window.setTimeout(() => {
      if (state.isListening && state.statusText === "Bless you") {
        state.statusText = "Listening for sneezes";
        render();
      }
    }, 2200);
  }
  async function requestWakeLock() {
    try {
      if (document.visibilityState === "visible" && navigator.wakeLock) {
        wakeLock = await navigator.wakeLock.request("screen");
        wakeLock.addEventListener("release", () => {
          wakeLock = null;
        });
      }
    } catch {
      wakeLock = null;
    }
  }
  async function releaseWakeLock() {
    try {
      await wakeLock?.release();
    } catch {
    }
    wakeLock = null;
  }
  async function microphoneNeedsPrompt() {
    if (localStorage.getItem(KEYS.micKnown) === "1") return false;
    try {
      const status = await navigator.permissions.query({ name: "microphone" });
      return status.state === "prompt";
    } catch {
      return true;
    }
  }
  async function explainMicrophone() {
    if (window.blessyou?.explainMicrophone) {
      return window.blessyou.explainMicrophone();
    }
    return window.confirm(`${MIC_EXPLAIN}

Continue?`);
  }
  function describeListenFailure(error) {
    const name = error?.name || "";
    const message = error?.message || "";
    const denied = name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError" || /permission|denied|not allowed/i.test(message);
    if (denied) {
      return {
        denied: true,
        statusText: "Microphone blocked",
        errorMessage: isWeb() ? "Microphone permission was denied." : null
      };
    }
    if (name === "NotFoundError" || name === "DevicesNotFoundError") {
      return { denied: false, statusText: "No microphone", errorMessage: "No microphone was found." };
    }
    if (name === "NotReadableError" || name === "TrackStartError") {
      return {
        denied: false,
        statusText: "Microphone busy",
        errorMessage: "The microphone is in use by another app."
      };
    }
    if (name === "NotSupportedError") {
      return {
        denied: true,
        statusText: "Microphone blocked",
        errorMessage: message || "This browser cannot access a microphone."
      };
    }
    if (name === "AudioContextSuspendedError") {
      return {
        denied: false,
        statusText: "Click to listen",
        errorMessage: "Click Listening so the browser can start the microphone."
      };
    }
    if (name === "AbortError") {
      return {
        denied: false,
        statusText: "Could not start microphone",
        errorMessage: "Microphone access was interrupted."
      };
    }
    return {
      denied: false,
      statusText: "Could not start microphone",
      errorMessage: "Could not start the microphone."
    };
  }
  async function start() {
    const generation = ++startGeneration;
    state.errorMessage = null;
    state.starting = true;
    state.statusText = "Starting";
    render();
    if (!window.isSecureContext) {
      state.permissionDenied = true;
      state.starting = false;
      state.statusText = "Microphone blocked";
      state.errorMessage = "This page needs HTTPS to use the microphone.";
      console.error("Microphone requires a secure context");
      render();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      state.permissionDenied = true;
      state.starting = false;
      state.statusText = "Microphone blocked";
      state.errorMessage = "This browser cannot access a microphone.";
      console.error("navigator.mediaDevices.getUserMedia is unavailable");
      render();
      return;
    }
    if (!isWeb() && await microphoneNeedsPrompt()) {
      const allowed = await explainMicrophone();
      if (!allowed) {
        state.isListening = false;
        state.starting = false;
        state.statusText = "Paused";
        render();
        return;
      }
    }
    try {
      if (isWeb()) {
        unlockSpeech();
        const detector = pipeline.start();
        await capture.start();
        if (generation !== startGeneration) {
          pipeline.stop();
          await capture.stop();
          state.starting = false;
          return;
        }
        localStorage.setItem(KEYS.micKnown, "1");
        state.permissionDenied = false;
        state.isListening = true;
        state.starting = false;
        state.statusText = "Listening for sneezes";
        render();
        const kind = await detector;
        if (generation !== startGeneration) return;
        if (kind !== "yamnet") {
          console.warn("YAMNet did not load; using on-device acoustic detection");
        }
        await requestWakeLock();
        return;
      }
      await pipeline.start();
      await capture.start();
      if (generation !== startGeneration) {
        pipeline.stop();
        await capture.stop();
        state.starting = false;
        return;
      }
      localStorage.setItem(KEYS.micKnown, "1");
      state.permissionDenied = false;
      state.isListening = true;
      state.starting = false;
      state.statusText = "Listening for sneezes";
      watchDevices();
      await requestWakeLock();
    } catch (error) {
      console.error("Could not start listening", error?.name || "", error?.message || error);
      const failure = describeListenFailure(error);
      state.isListening = false;
      state.starting = false;
      state.permissionDenied = failure.denied;
      state.statusText = failure.statusText;
      state.errorMessage = failure.errorMessage;
      if (failure.denied) {
        localStorage.setItem(KEYS.micKnown, "1");
      }
      pipeline.stop();
      await capture.stop();
    }
    render();
  }
  async function stop() {
    startGeneration += 1;
    unwatchDevices();
    await capture.stop();
    pipeline.stop();
    await releaseWakeLock();
    state.isListening = false;
    state.starting = false;
    state.statusText = "Paused";
    render();
  }
  function watchDevices() {
    if (!navigator.mediaDevices?.addEventListener || state.deviceChangeHandler) return;
    state.deviceChangeHandler = async () => {
      if (!state.isListening) return;
      await stop();
      await start();
    };
    navigator.mediaDevices.addEventListener("devicechange", state.deviceChangeHandler);
  }
  function unwatchDevices() {
    if (state.deviceChangeHandler) {
      navigator.mediaDevices.removeEventListener("devicechange", state.deviceChangeHandler);
      state.deviceChangeHandler = null;
    }
  }
  function blessNow() {
    speakBlessYou();
    state.lastTrigger = Date.now() / 1e3;
  }
  function quit() {
    stop();
    if (window.blessyou?.quit) {
      window.blessyou.quit();
      return;
    }
    window.close();
  }
  function render() {
    const { os } = getRuntime();
    els.status.textContent = state.statusText;
    els.listening.checked = state.isListening || state.starting;
    els.listeningLabel.textContent = state.isListening || state.starting ? "Listening" : "Not listening";
    els.sensitivity.value = String(state.sensitivity);
    els.sensLabel.textContent = sensitivityLabel();
    els.count.textContent = state.sneezeCount === 1 ? "1 sneeze blessed" : `${state.sneezeCount} sneezes blessed`;
    els.last.hidden = !state.lastSneezeAt;
    if (state.lastSneezeAt) {
      els.last.textContent = `Last sneeze ${formatTime(state.lastSneezeAt)}`;
    }
    els.privacy.textContent = `Audio never leaves this ${deviceNoun(os)}.`;
    els.error.hidden = !state.errorMessage;
    els.error.textContent = state.errorMessage || "";
    els.permission.hidden = !state.permissionDenied;
    els.permissionText.textContent = microphoneHelp(os);
    els.micButton.textContent = microphoneButtonLabel(os);
    els.micButton.hidden = isWeb();
    els.loginRow.hidden = !supportsAutoStart();
    els.quit.hidden = !supportsNativeQuit() && !window.blessyou;
    els.androidNote.hidden = !(os === "android" || os === "chromeos");
  }
  async function init() {
    applyRuntimeClass();
    warmUpVoices();
    els.status = document.getElementById("status");
    els.listening = document.getElementById("listening");
    els.listeningLabel = document.getElementById("listening-label");
    els.sensitivity = document.getElementById("sensitivity");
    els.sensLabel = document.getElementById("sens-label");
    els.count = document.getElementById("count");
    els.last = document.getElementById("last");
    els.privacy = document.getElementById("privacy");
    els.error = document.getElementById("error");
    els.permission = document.getElementById("permission");
    els.permissionText = document.getElementById("permission-text");
    els.micButton = document.getElementById("mic-settings");
    els.loginRow = document.getElementById("login-row");
    els.login = document.getElementById("login");
    els.quit = document.getElementById("quit");
    els.androidNote = document.getElementById("android-note");
    els.listening.addEventListener("change", () => {
      if (els.listening.checked) start();
      else stop();
    });
    els.sensitivity.addEventListener("input", () => {
      state.sensitivity = Number(els.sensitivity.value);
      localStorage.setItem(KEYS.sensitivity, String(state.sensitivity));
      els.sensLabel.textContent = sensitivityLabel();
    });
    document.getElementById("bless").addEventListener("click", blessNow);
    els.quit.addEventListener("click", quit);
    els.micButton.addEventListener("click", () => {
      openMicrophoneSettings();
    });
    if (supportsAutoStart()) {
      const enabled = await window.blessyou.getAutoStart();
      els.login.checked = enabled;
      els.login.addEventListener("change", async () => {
        const ok = await window.blessyou.setAutoStart(els.login.checked);
        if (!ok) {
          els.login.checked = await window.blessyou.getAutoStart();
        }
      });
    }
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && state.isListening) {
        requestWakeLock();
        if (isWeb()) {
          capture.resume().catch((error) => {
            console.warn("Could not resume AudioContext", error?.message || error);
          });
        }
      }
    });
    render();
    if (!isWeb()) {
      window.setTimeout(() => {
        if (!state.isListening && !state.permissionDenied) start();
      }, 400);
    }
    if ("serviceWorker" in navigator && isWeb()) {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("Service worker was not registered", error?.message || error);
      });
    }
  }
  init();
})();
//# sourceMappingURL=app.js.map
