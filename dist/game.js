"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // node_modules/@kobalab/majiang-core/lib/rule.js
  var require_rule = __commonJS({
    "node_modules/@kobalab/majiang-core/lib/rule.js"(exports, module) {
      "use strict";
      module.exports = function(param = {}) {
        let rule = {
          /* 点数関連 */
          "\u914D\u7D66\u539F\u70B9": 25e3,
          "\u9806\u4F4D\u70B9": ["20.0", "10.0", "-10.0", "-20.0"],
          "\u9023\u98A8\u724C\u306F2\u7B26": false,
          /* 赤牌有無/クイタンなど */
          "\u8D64\u724C": { m: 1, p: 1, s: 1 },
          "\u30AF\u30A4\u30BF\u30F3\u3042\u308A": true,
          "\u55B0\u3044\u66FF\u3048\u8A31\u53EF\u30EC\u30D9\u30EB": 0,
          // 0: 喰い替えなし, 1: スジ喰い替えあり,  2: 現物喰い替えもあり
          /* 局数関連 */
          "\u5834\u6570": 2,
          // 0: 一局戦, 1: 東風戦, 2： 東南戦, 4: 一荘戦
          "\u9014\u4E2D\u6D41\u5C40\u3042\u308A": true,
          "\u6D41\u3057\u6E80\u8CAB\u3042\u308A": true,
          "\u30CE\u30FC\u30C6\u30F3\u5BA3\u8A00\u3042\u308A": false,
          "\u30CE\u30FC\u30C6\u30F3\u7F70\u3042\u308A": true,
          "\u6700\u5927\u540C\u6642\u548C\u4E86\u6570": 2,
          // 1: 頭ハネ, 2: ダブロンあり, 3: トリロンあり
          "\u9023\u8358\u65B9\u5F0F": 2,
          // 0: 連荘なし, 1: 和了連荘, 2: テンパイ連荘, 3: ノーテン連荘
          "\u30C8\u30D3\u7D42\u4E86\u3042\u308A": true,
          "\u30AA\u30FC\u30E9\u30B9\u6B62\u3081\u3042\u308A": true,
          "\u5EF6\u9577\u6226\u65B9\u5F0F": 1,
          // 0: 延長戦なし, 1: サドンデス, 2: 連荘優先サドンデス, 3: 4局固定
          /* リーチ/ドラ関連 */
          "\u4E00\u767A\u3042\u308A": true,
          "\u88CF\u30C9\u30E9\u3042\u308A": true,
          "\u30AB\u30F3\u30C9\u30E9\u3042\u308A": true,
          "\u30AB\u30F3\u88CF\u3042\u308A": true,
          "\u30AB\u30F3\u30C9\u30E9\u5F8C\u4E57\u305B": true,
          "\u30C4\u30E2\u756A\u306A\u3057\u30EA\u30FC\u30C1\u3042\u308A": false,
          "\u30EA\u30FC\u30C1\u5F8C\u6697\u69D3\u8A31\u53EF\u30EC\u30D9\u30EB": 2,
          // 0: 暗槓不可, 1: 牌姿の変わる暗槓不可, 2： 待ちの変わる暗槓不可
          /* 役満関連 */
          "\u5F79\u6E80\u306E\u8907\u5408\u3042\u308A": true,
          "\u30C0\u30D6\u30EB\u5F79\u6E80\u3042\u308A": true,
          "\u6570\u3048\u5F79\u6E80\u3042\u308A": true,
          "\u5F79\u6E80\u30D1\u30AA\u3042\u308A": true,
          "\u5207\u308A\u4E0A\u3052\u6E80\u8CAB\u3042\u308A": false
        };
        for (let key of Object.keys(param)) {
          rule[key] = param[key];
        }
        return rule;
      };
    }
  });

  // node_modules/@kobalab/majiang-core/lib/shoupai.js
  var require_shoupai = __commonJS({
    "node_modules/@kobalab/majiang-core/lib/shoupai.js"(exports, module) {
      "use strict";
      module.exports = class Shoupai {
        static valid_pai(p) {
          if (p.match(/^(?:[mps]\d|z[1-7])_?\*?[\+\=\-]?$/)) return p;
        }
        static valid_mianzi(m) {
          if (m.match(/^z.*[089]/)) return;
          let h = m.replace(/0/g, "5");
          if (h.match(/^[mpsz](\d)\1\1[\+\=\-]\1?$/)) {
            return m.replace(/([mps])05/, "$150");
          } else if (h.match(/^[mpsz](\d)\1\1\1[\+\=\-]?$/)) {
            return m[0] + m.match(/\d(?![\+\=\-])/g).sort().reverse().join("") + (m.match(/\d[\+\=\-]$/) || [""])[0];
          } else if (h.match(/^[mps]\d+\-\d*$/)) {
            let hongpai = m.match(/0/);
            let nn = h.match(/\d/g).sort();
            if (nn.length != 3) return;
            if (+nn[0] + 1 != +nn[1] || +nn[1] + 1 != +nn[2]) return;
            h = h[0] + h.match(/\d[\+\=\-]?/g).sort().join("");
            return hongpai ? h.replace(/5/, "0") : h;
          }
        }
        constructor(qipai = []) {
          this._bingpai = {
            _: 0,
            m: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            p: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            s: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            z: [0, 0, 0, 0, 0, 0, 0, 0]
          };
          this._fulou = [];
          this._zimo = null;
          this._lizhi = false;
          for (let p of qipai) {
            if (p == "_") {
              this._bingpai._++;
              continue;
            }
            if (!(p = Shoupai.valid_pai(p))) throw new Error(p);
            let s = p[0], n = +p[1];
            if (this._bingpai[s][n] == 4) throw new Error([this, p]);
            this._bingpai[s][n]++;
            if (s != "z" && n == 0) this._bingpai[s][5]++;
          }
        }
        static fromString(paistr = "") {
          let fulou = paistr.split(",");
          let bingpai = fulou.shift();
          let qipai = bingpai.match(/^_*/)[0].match(/_/g) || [];
          for (let suitstr of bingpai.match(/[mpsz]\d+_*/g) || []) {
            let s = suitstr[0];
            for (let n of suitstr.match(/\d/g)) {
              if (s == "z" && (n < 1 || 7 < n)) continue;
              qipai.push(s + n);
            }
            qipai = qipai.concat(suitstr.match(/_/g) || []);
          }
          qipai = qipai.slice(0, 14 - fulou.filter((x) => x).length * 3);
          let zimo = qipai.length + fulou.length * 3 == 14 && qipai.slice(-1)[0];
          const shoupai = new Shoupai(qipai);
          let last;
          for (let m of fulou) {
            if (!m) {
              shoupai._zimo = last;
              break;
            }
            m = Shoupai.valid_mianzi(m);
            if (m) {
              shoupai._fulou.push(m);
              last = m;
            }
          }
          shoupai._zimo = shoupai._zimo || zimo || null;
          shoupai._lizhi = bingpai.slice(-1) == "*";
          return shoupai;
        }
        toString() {
          let paistr = "";
          for (let s of ["m", "p", "s", "z"]) {
            let suitstr = s;
            let bingpai = this._bingpai[s];
            let n_hongpai = s == "z" ? 0 : bingpai[0];
            for (let n = 1; n < bingpai.length; n++) {
              let n_pai = bingpai[n];
              if (this._zimo) {
                if (s + n == this._zimo) {
                  n_pai--;
                }
                if (n == 5 && s + 0 == this._zimo) {
                  n_pai--;
                  n_hongpai--;
                }
              }
              for (let i = 0; i < n_pai; i++) {
                if (n == 5 && n_hongpai > 0) {
                  suitstr += 0;
                  n_hongpai--;
                } else {
                  suitstr += n;
                }
              }
            }
            if (suitstr.length > 1) paistr += suitstr;
          }
          paistr += "_".repeat(this._bingpai._ + (this._zimo == "_" ? -1 : 0));
          if (this._zimo && this._zimo.length <= 2) paistr += this._zimo;
          if (this._lizhi) paistr += "*";
          for (let m of this._fulou) {
            paistr += "," + m;
          }
          if (this._zimo && this._zimo.length > 2) paistr += ",";
          return paistr;
        }
        clone() {
          const shoupai = new Shoupai();
          shoupai._bingpai = {
            _: this._bingpai._,
            m: this._bingpai.m.concat(),
            p: this._bingpai.p.concat(),
            s: this._bingpai.s.concat(),
            z: this._bingpai.z.concat()
          };
          shoupai._fulou = this._fulou.concat();
          shoupai._zimo = this._zimo;
          shoupai._lizhi = this._lizhi;
          return shoupai;
        }
        fromString(paistr) {
          const shoupai = Shoupai.fromString(paistr);
          this._bingpai = {
            _: shoupai._bingpai._,
            m: shoupai._bingpai.m.concat(),
            p: shoupai._bingpai.p.concat(),
            s: shoupai._bingpai.s.concat(),
            z: shoupai._bingpai.z.concat()
          };
          this._fulou = shoupai._fulou.concat();
          this._zimo = shoupai._zimo;
          this._lizhi = shoupai._lizhi;
          return this;
        }
        decrease(s, n) {
          let bingpai = this._bingpai[s];
          n = +n;
          if (bingpai[n] == 0 || n == 5 && bingpai[0] == bingpai[5]) {
            if (this._bingpai._ == 0) throw new Error([this, s + n]);
            this._bingpai._--;
          } else {
            bingpai[n]--;
            if (n == 0) bingpai[5]--;
          }
        }
        zimo(p, check = true) {
          if (check && this._zimo) throw new Error([this, p]);
          if (p == "_") {
            this._bingpai._++;
            this._zimo = p;
          } else {
            if (!Shoupai.valid_pai(p)) throw new Error(p);
            let s = p[0], n = +p[1];
            let bingpai = this._bingpai[s];
            if (bingpai[n] == 4) throw new Error([this, p]);
            bingpai[n]++;
            if (n == 0) {
              if (bingpai[5] == 4) throw new Error([this, p]);
              bingpai[5]++;
            }
            this._zimo = s + n;
          }
          return this;
        }
        dapai(p, check = true) {
          if (check && !this._zimo) throw new Error([this, p]);
          if (!Shoupai.valid_pai(p)) throw new Error(p);
          let s = p[0], n = +p[1];
          this.decrease(s, n);
          this._zimo = null;
          if (p.slice(-1) == "*") this._lizhi = true;
          return this;
        }
        fulou(m, check = true) {
          if (check && this._zimo) throw new Error([this, m]);
          if (m != Shoupai.valid_mianzi(m)) throw new Error(m);
          if (m.match(/\d{4}$/)) throw new Error([this, m]);
          if (m.match(/\d{3}[\+\=\-]\d$/)) throw new Error([this, m]);
          let s = m[0];
          for (let n of m.match(/\d(?![\+\=\-])/g)) {
            this.decrease(s, n);
          }
          this._fulou.push(m);
          if (!m.match(/\d{4}/)) this._zimo = m;
          return this;
        }
        gang(m, check = true) {
          if (check && !this._zimo) throw new Error([this, m]);
          if (check && this._zimo.length > 2) throw new Error([this, m]);
          if (m != Shoupai.valid_mianzi(m)) throw new Error(m);
          let s = m[0];
          if (m.match(/\d{4}$/)) {
            for (let n of m.match(/\d/g)) {
              this.decrease(s, n);
            }
            this._fulou.push(m);
          } else if (m.match(/\d{3}[\+\=\-]\d$/)) {
            let m1 = m.slice(0, 5);
            let i = this._fulou.findIndex((m2) => m1 == m2);
            if (i < 0) throw new Error([this, m]);
            this._fulou[i] = m;
            this.decrease(s, m.slice(-1));
          } else throw new Error([this, m]);
          this._zimo = null;
          return this;
        }
        get menqian() {
          return this._fulou.filter((m) => m.match(/[\+\=\-]/)).length == 0;
        }
        get lizhi() {
          return this._lizhi;
        }
        get_dapai(check = true) {
          if (!this._zimo) return null;
          let deny = {};
          if (check && this._zimo.length > 2) {
            let m = this._zimo;
            let s = m[0];
            let n = +m.match(/\d(?=[\+\=\-])/) || 5;
            deny[s + n] = true;
            if (!m.replace(/0/, "5").match(/^[mpsz](\d)\1\1/)) {
              if (n < 7 && m.match(/^[mps]\d\-\d\d$/)) deny[s + (n + 3)] = true;
              if (3 < n && m.match(/^[mps]\d\d\d\-$/)) deny[s + (n - 3)] = true;
            }
          }
          let dapai = [];
          if (!this._lizhi) {
            for (let s of ["m", "p", "s", "z"]) {
              let bingpai = this._bingpai[s];
              for (let n = 1; n < bingpai.length; n++) {
                if (bingpai[n] == 0) continue;
                if (deny[s + n]) continue;
                if (s + n == this._zimo && bingpai[n] == 1) continue;
                if (s == "z" || n != 5) dapai.push(s + n);
                else {
                  if (bingpai[0] > 0 && s + 0 != this._zimo || bingpai[0] > 1)
                    dapai.push(s + 0);
                  if (bingpai[0] < bingpai[5]) dapai.push(s + n);
                }
              }
            }
          }
          if (this._zimo.length == 2) dapai.push(this._zimo + "_");
          return dapai;
        }
        get_chi_mianzi(p, check = true) {
          if (this._zimo) return null;
          if (!Shoupai.valid_pai(p)) throw new Error(p);
          let mianzi = [];
          let s = p[0], n = +p[1] || 5, d = p.match(/[\+\=\-]$/);
          if (!d) throw new Error(p);
          if (s == "z" || d != "-") return mianzi;
          if (this._lizhi) return mianzi;
          let bingpai = this._bingpai[s];
          if (3 <= n && bingpai[n - 2] > 0 && bingpai[n - 1] > 0) {
            if (!check || (3 < n ? bingpai[n - 3] : 0) + bingpai[n] < 14 - (this._fulou.length + 1) * 3) {
              if (n - 2 == 5 && bingpai[0] > 0) mianzi.push(s + "067-");
              if (n - 1 == 5 && bingpai[0] > 0) mianzi.push(s + "406-");
              if (n - 2 != 5 && n - 1 != 5 || bingpai[0] < bingpai[5])
                mianzi.push(s + (n - 2) + (n - 1) + (p[1] + d));
            }
          }
          if (2 <= n && n <= 8 && bingpai[n - 1] > 0 && bingpai[n + 1] > 0) {
            if (!check || bingpai[n] < 14 - (this._fulou.length + 1) * 3) {
              if (n - 1 == 5 && bingpai[0] > 0) mianzi.push(s + "06-7");
              if (n + 1 == 5 && bingpai[0] > 0) mianzi.push(s + "34-0");
              if (n - 1 != 5 && n + 1 != 5 || bingpai[0] < bingpai[5])
                mianzi.push(s + (n - 1) + (p[1] + d) + (n + 1));
            }
          }
          if (n <= 7 && bingpai[n + 1] > 0 && bingpai[n + 2] > 0) {
            if (!check || bingpai[n] + (n < 7 ? bingpai[n + 3] : 0) < 14 - (this._fulou.length + 1) * 3) {
              if (n + 1 == 5 && bingpai[0] > 0) mianzi.push(s + "4-06");
              if (n + 2 == 5 && bingpai[0] > 0) mianzi.push(s + "3-40");
              if (n + 1 != 5 && n + 2 != 5 || bingpai[0] < bingpai[5])
                mianzi.push(s + (p[1] + d) + (n + 1) + (n + 2));
            }
          }
          return mianzi;
        }
        get_peng_mianzi(p) {
          if (this._zimo) return null;
          if (!Shoupai.valid_pai(p)) throw new Error(p);
          let mianzi = [];
          let s = p[0], n = +p[1] || 5, d = p.match(/[\+\=\-]$/);
          if (!d) throw new Error(p);
          if (this._lizhi) return mianzi;
          let bingpai = this._bingpai[s];
          if (bingpai[n] >= 2) {
            if (n == 5 && bingpai[0] >= 2) mianzi.push(s + "00" + p[1] + d);
            if (n == 5 && bingpai[0] >= 1 && bingpai[5] - bingpai[0] >= 1)
              mianzi.push(s + "50" + p[1] + d);
            if (n != 5 || bingpai[5] - bingpai[0] >= 2)
              mianzi.push(s + n + n + p[1] + d);
          }
          return mianzi;
        }
        get_gang_mianzi(p) {
          let mianzi = [];
          if (p) {
            if (this._zimo) return null;
            if (!Shoupai.valid_pai(p)) throw new Error(p);
            let s = p[0], n = +p[1] || 5, d = p.match(/[\+\=\-]$/);
            if (!d) throw new Error(p);
            if (this._lizhi) return mianzi;
            let bingpai = this._bingpai[s];
            if (bingpai[n] == 3) {
              if (n == 5) mianzi = [s + "5".repeat(3 - bingpai[0]) + "0".repeat(bingpai[0]) + p[1] + d];
              else mianzi = [s + n + n + n + n + d];
            }
          } else {
            if (!this._zimo) return null;
            if (this._zimo.length > 2) return null;
            let p2 = this._zimo.replace(/0/, "5");
            for (let s of ["m", "p", "s", "z"]) {
              let bingpai = this._bingpai[s];
              for (let n = 1; n < bingpai.length; n++) {
                if (bingpai[n] == 0) continue;
                if (bingpai[n] == 4) {
                  if (this._lizhi && s + n != p2) continue;
                  if (n == 5) mianzi.push(s + "5".repeat(4 - bingpai[0]) + "0".repeat(bingpai[0]));
                  else mianzi.push(s + n + n + n + n);
                } else {
                  if (this._lizhi) continue;
                  for (let m of this._fulou) {
                    if (m.replace(/0/g, "5").slice(0, 4) == s + n + n + n) {
                      if (n == 5 && bingpai[0] > 0) mianzi.push(m + 0);
                      else mianzi.push(m + n);
                    }
                  }
                }
              }
            }
          }
          return mianzi;
        }
      };
    }
  });

  // node_modules/@kobalab/majiang-core/lib/shan.js
  var require_shan = __commonJS({
    "node_modules/@kobalab/majiang-core/lib/shan.js"(exports, module) {
      "use strict";
      var Majiang = { Shoupai: require_shoupai() };
      module.exports = class Shan {
        static zhenbaopai(p) {
          if (!Majiang.Shoupai.valid_pai(p)) throw new Error(p);
          let s = p[0], n = +p[1] || 5;
          return s == "z" ? n < 5 ? s + (n % 4 + 1) : s + ((n - 4) % 3 + 5) : s + (n % 9 + 1);
        }
        constructor(rule) {
          this._rule = rule;
          let hongpai = rule["\u8D64\u724C"];
          let pai = [];
          for (let s of ["m", "p", "s", "z"]) {
            for (let n = 1; n <= (s == "z" ? 7 : 9); n++) {
              for (let i = 0; i < 4; i++) {
                if (n == 5 && i < hongpai[s]) pai.push(s + 0);
                else pai.push(s + n);
              }
            }
          }
          this._pai = [];
          while (pai.length) {
            this._pai.push(pai.splice(Math.random() * pai.length, 1)[0]);
          }
          this._baopai = [this._pai[4]];
          this._fubaopai = rule["\u88CF\u30C9\u30E9\u3042\u308A"] ? [this._pai[9]] : null;
          this._weikaigang = false;
          this._closed = false;
        }
        zimo() {
          if (this._closed) throw new Error(this);
          if (this.paishu == 0) throw new Error(this);
          if (this._weikaigang) throw new Error(this);
          return this._pai.pop();
        }
        gangzimo() {
          if (this._closed) throw new Error(this);
          if (this.paishu == 0) throw new Error(this);
          if (this._weikaigang) throw new Error(this);
          if (this._baopai.length == 5) throw new Error(this);
          this._weikaigang = this._rule["\u30AB\u30F3\u30C9\u30E9\u3042\u308A"];
          if (!this._weikaigang) this._baopai.push("");
          return this._pai.shift();
        }
        kaigang() {
          if (this._closed) throw new Error(this);
          if (!this._weikaigang) throw new Error(this);
          this._baopai.push(this._pai[4]);
          if (this._fubaopai && this._rule["\u30AB\u30F3\u88CF\u3042\u308A"])
            this._fubaopai.push(this._pai[9]);
          this._weikaigang = false;
          return this;
        }
        close() {
          this._closed = true;
          return this;
        }
        get paishu() {
          return this._pai.length - 14;
        }
        get baopai() {
          return this._baopai.filter((x) => x);
        }
        get fubaopai() {
          return !this._closed ? null : this._fubaopai ? this._fubaopai.concat() : null;
        }
      };
    }
  });

  // node_modules/@kobalab/majiang-core/lib/he.js
  var require_he = __commonJS({
    "node_modules/@kobalab/majiang-core/lib/he.js"(exports, module) {
      "use strict";
      var Majiang = { Shoupai: require_shoupai() };
      module.exports = class He {
        constructor() {
          this._pai = [];
          this._find = {};
        }
        dapai(p) {
          if (!Majiang.Shoupai.valid_pai(p)) throw new Error(p);
          this._pai.push(p.replace(/[\+\=\-]$/, ""));
          this._find[p[0] + (+p[1] || 5)] = true;
          return this;
        }
        fulou(m) {
          if (!Majiang.Shoupai.valid_mianzi(m)) throw new Error(m);
          let p = m[0] + m.match(/\d(?=[\+\=\-])/), d = m.match(/[\+\=\-]/);
          if (!d) throw new Error(m);
          if (this._pai[this._pai.length - 1].slice(0, 2) != p)
            throw new Error(m);
          this._pai[this._pai.length - 1] += d;
          return this;
        }
        find(p) {
          return this._find[p[0] + (+p[1] || 5)];
        }
      };
    }
  });

  // node_modules/@kobalab/majiang-core/lib/board.js
  var require_board = __commonJS({
    "node_modules/@kobalab/majiang-core/lib/board.js"(exports, module) {
      "use strict";
      var Majiang = {
        Shoupai: require_shoupai(),
        He: require_he()
      };
      var Shan = class {
        constructor(baopai) {
          this.paishu = 136 - 13 * 4 - 14;
          this.baopai = [].concat(baopai || []);
          this.fubaopai;
        }
        zimo(p) {
          this.paishu--;
          return p || "_";
        }
        kaigang(baopai) {
          this.baopai.push(baopai);
        }
      };
      module.exports = class Board {
        constructor(kaiju) {
          if (kaiju) this.kaiju(kaiju);
        }
        kaiju(kaiju) {
          this.title = kaiju.title;
          this.player = kaiju.player;
          this.qijia = kaiju.qijia;
          this.zhuangfeng = 0;
          this.jushu = 0;
          this.changbang = 0;
          this.lizhibang = 0;
          this.defen = [];
          this.shan = null;
          this.shoupai = [];
          this.he = [];
          this.player_id = [0, 1, 2, 3];
          this.lunban = -1;
          this._lizhi;
          this._fenpei;
          this._lianzhuang;
          this._changbang;
          this._lizhibang;
        }
        menfeng(id) {
          return (id + 4 - this.qijia + 4 - this.jushu) % 4;
        }
        qipai(qipai) {
          this.zhuangfeng = qipai.zhuangfeng;
          this.jushu = qipai.jushu;
          this.changbang = qipai.changbang;
          this.lizhibang = qipai.lizhibang;
          this.shan = new Shan(qipai.baopai);
          for (let l = 0; l < 4; l++) {
            let paistr = qipai.shoupai[l] || "_".repeat(13);
            this.shoupai[l] = Majiang.Shoupai.fromString(paistr);
            this.he[l] = new Majiang.He();
            this.player_id[l] = (this.qijia + this.jushu + l) % 4;
            this.defen[this.player_id[l]] = qipai.defen[l];
          }
          this.lunban = -1;
          this._lizhi = false;
          this._fenpei = null;
          this._changbang = qipai.changbang;
          this._lizhibang = qipai.lizhibang;
        }
        lizhi() {
          if (this._lizhi) {
            this.defen[this.player_id[this.lunban]] -= 1e3;
            this.lizhibang++;
            this._lizhi = false;
          }
        }
        zimo(zimo) {
          this.lizhi();
          this.lunban = zimo.l;
          this.shoupai[zimo.l].zimo(this.shan.zimo(zimo.p), false);
        }
        dapai(dapai) {
          this.lunban = dapai.l;
          this.shoupai[dapai.l].dapai(dapai.p, false);
          this.he[dapai.l].dapai(dapai.p);
          this._lizhi = dapai.p.slice(-1) == "*";
        }
        fulou(fulou) {
          this.lizhi();
          this.he[this.lunban].fulou(fulou.m);
          this.lunban = fulou.l;
          this.shoupai[fulou.l].fulou(fulou.m, false);
        }
        gang(gang) {
          this.lunban = gang.l;
          this.shoupai[gang.l].gang(gang.m, false);
        }
        kaigang(kaigang) {
          this.shan.kaigang(kaigang.baopai);
        }
        hule(hule) {
          let shoupai = this.shoupai[hule.l];
          shoupai.fromString(hule.shoupai);
          if (hule.baojia != null) shoupai.dapai(shoupai.get_dapai().pop());
          if (this._fenpei) {
            this.changbang = 0;
            this.lizhibang = 0;
            for (let l = 0; l < 4; l++) {
              this.defen[this.player_id[l]] += this._fenpei[l];
            }
          }
          this.shan.fubaopai = hule.fubaopai;
          this._fenpei = hule.fenpei;
          this._lizhibang = 0;
          if (hule.l == 0) this._lianzhuang = true;
        }
        pingju(pingju) {
          if (!pingju.name.match(/^三家和/)) this.lizhi();
          for (let l = 0; l < 4; l++) {
            if (pingju.shoupai[l])
              this.shoupai[l].fromString(pingju.shoupai[l]);
          }
          this._fenpei = pingju.fenpei;
          this._lizhibang = this.lizhibang;
          this._lianzhuang = true;
        }
        last() {
          if (!this._fenpei) return;
          this.changbang = this._lianzhuang ? this._changbang + 1 : 0;
          this.lizhibang = this._lizhibang;
          for (let l = 0; l < 4; l++) {
            this.defen[this.player_id[l]] += this._fenpei[l];
          }
        }
        jieju(paipu) {
          for (let id = 0; id < 4; id++) {
            this.defen[id] = paipu.defen[id];
          }
          this.lunban = -1;
        }
      };
    }
  });

  // node_modules/@kobalab/majiang-core/lib/xiangting.js
  var require_xiangting = __commonJS({
    "node_modules/@kobalab/majiang-core/lib/xiangting.js"(exports, module) {
      "use strict";
      function _xiangting(m, d, g, j) {
        let n = j ? 4 : 5;
        if (m > 4) {
          d += m - 4;
          m = 4;
        }
        if (m + d > 4) {
          g += m + d - 4;
          d = 4 - m;
        }
        if (m + d + g > n) {
          g = n - m - d;
        }
        if (j) d++;
        return 13 - m * 3 - d * 2 - g;
      }
      function dazi(bingpai) {
        let n_pai = 0, n_dazi = 0, n_guli = 0;
        for (let n = 1; n <= 9; n++) {
          n_pai += bingpai[n];
          if (n <= 7 && bingpai[n + 1] == 0 && bingpai[n + 2] == 0) {
            n_dazi += n_pai >> 1;
            n_guli += n_pai % 2;
            n_pai = 0;
          }
        }
        n_dazi += n_pai >> 1;
        n_guli += n_pai % 2;
        return {
          a: [0, n_dazi, n_guli],
          b: [0, n_dazi, n_guli]
        };
      }
      function mianzi(bingpai, n = 1) {
        if (n > 9) return dazi(bingpai);
        let max = mianzi(bingpai, n + 1);
        if (n <= 7 && bingpai[n] > 0 && bingpai[n + 1] > 0 && bingpai[n + 2] > 0) {
          bingpai[n]--;
          bingpai[n + 1]--;
          bingpai[n + 2]--;
          let r = mianzi(bingpai, n);
          bingpai[n]++;
          bingpai[n + 1]++;
          bingpai[n + 2]++;
          r.a[0]++;
          r.b[0]++;
          if (r.a[2] < max.a[2] || r.a[2] == max.a[2] && r.a[1] < max.a[1]) max.a = r.a;
          if (r.b[0] > max.b[0] || r.b[0] == max.b[0] && r.b[1] > max.b[1]) max.b = r.b;
        }
        if (bingpai[n] >= 3) {
          bingpai[n] -= 3;
          let r = mianzi(bingpai, n + 1);
          bingpai[n] += 3;
          r.a[0]++;
          r.b[0]++;
          if (r.a[2] < max.a[2] || r.a[2] == max.a[2] && r.a[1] < max.a[1]) max.a = r.a;
          if (r.b[0] > max.b[0] || r.b[0] == max.b[0] && r.b[1] > max.b[1]) max.b = r.b;
        }
        return max;
      }
      function mianzi_all(shoupai, jiangpai) {
        let r = {
          m: mianzi(shoupai._bingpai.m),
          p: mianzi(shoupai._bingpai.p),
          s: mianzi(shoupai._bingpai.s)
        };
        let z = [0, 0, 0];
        for (let n = 1; n <= 7; n++) {
          if (shoupai._bingpai.z[n] >= 3) z[0]++;
          else if (shoupai._bingpai.z[n] == 2) z[1]++;
          else if (shoupai._bingpai.z[n] == 1) z[2]++;
        }
        let n_fulou = shoupai._fulou.length;
        let min = 13;
        for (let m of [r.m.a, r.m.b]) {
          for (let p of [r.p.a, r.p.b]) {
            for (let s of [r.s.a, r.s.b]) {
              let x = [n_fulou, 0, 0];
              for (let i = 0; i < 3; i++) {
                x[i] += m[i] + p[i] + s[i] + z[i];
              }
              let n_xiangting = _xiangting(x[0], x[1], x[2], jiangpai);
              if (n_xiangting < min) min = n_xiangting;
            }
          }
        }
        return min;
      }
      function xiangting_yiban(shoupai) {
        let min = mianzi_all(shoupai);
        for (let s of ["m", "p", "s", "z"]) {
          let bingpai = shoupai._bingpai[s];
          for (let n = 1; n < bingpai.length; n++) {
            if (bingpai[n] >= 2) {
              bingpai[n] -= 2;
              let n_xiangting = mianzi_all(shoupai, true);
              bingpai[n] += 2;
              if (n_xiangting < min) min = n_xiangting;
            }
          }
        }
        if (min == -1 && shoupai._zimo && shoupai._zimo.length > 2) return 0;
        return min;
      }
      function xiangting_guoshi(shoupai) {
        if (shoupai._fulou.length) return Infinity;
        let n_yaojiu = 0;
        let n_duizi = 0;
        for (let s of ["m", "p", "s", "z"]) {
          let bingpai = shoupai._bingpai[s];
          let nn = s == "z" ? [1, 2, 3, 4, 5, 6, 7] : [1, 9];
          for (let n of nn) {
            if (bingpai[n] >= 1) n_yaojiu++;
            if (bingpai[n] >= 2) n_duizi++;
          }
        }
        return n_duizi ? 12 - n_yaojiu : 13 - n_yaojiu;
      }
      function xiangting_qidui(shoupai) {
        if (shoupai._fulou.length) return Infinity;
        let n_duizi = 0;
        let n_guli = 0;
        for (let s of ["m", "p", "s", "z"]) {
          let bingpai = shoupai._bingpai[s];
          for (let n = 1; n < bingpai.length; n++) {
            if (bingpai[n] >= 2) n_duizi++;
            else if (bingpai[n] == 1) n_guli++;
          }
        }
        if (n_duizi > 7) n_duizi = 7;
        if (n_duizi + n_guli > 7) n_guli = 7 - n_duizi;
        return 13 - n_duizi * 2 - n_guli;
      }
      function xiangting(shoupai) {
        return Math.min(
          xiangting_yiban(shoupai),
          xiangting_guoshi(shoupai),
          xiangting_qidui(shoupai)
        );
      }
      function tingpai(shoupai, f_xiangting = xiangting) {
        if (shoupai._zimo) return null;
        let pai = [];
        let n_xiangting = f_xiangting(shoupai);
        for (let s of ["m", "p", "s", "z"]) {
          let bingpai = shoupai._bingpai[s];
          for (let n = 1; n < bingpai.length; n++) {
            if (bingpai[n] >= 4) continue;
            bingpai[n]++;
            if (f_xiangting(shoupai) < n_xiangting) pai.push(s + n);
            bingpai[n]--;
          }
        }
        return pai;
      }
      module.exports = {
        xiangting_guoshi,
        xiangting_qidui,
        xiangting_yiban,
        xiangting,
        tingpai
      };
    }
  });

  // node_modules/@kobalab/majiang-core/lib/hule.js
  var require_hule = __commonJS({
    "node_modules/@kobalab/majiang-core/lib/hule.js"(exports, module) {
      "use strict";
      var Majiang = {
        Shan: require_shan(),
        rule: require_rule()
      };
      function mianzi(s, bingpai, n = 1) {
        if (n > 9) return [[]];
        if (bingpai[n] == 0) return mianzi(s, bingpai, n + 1);
        let shunzi = [];
        if (n <= 7 && bingpai[n] > 0 && bingpai[n + 1] > 0 && bingpai[n + 2] > 0) {
          bingpai[n]--;
          bingpai[n + 1]--;
          bingpai[n + 2]--;
          shunzi = mianzi(s, bingpai, n);
          bingpai[n]++;
          bingpai[n + 1]++;
          bingpai[n + 2]++;
          for (let s_mianzi of shunzi) {
            s_mianzi.unshift(s + n + (n + 1) + (n + 2));
          }
        }
        let kezi = [];
        if (bingpai[n] == 3) {
          bingpai[n] -= 3;
          kezi = mianzi(s, bingpai, n + 1);
          bingpai[n] += 3;
          for (let k_mianzi of kezi) {
            k_mianzi.unshift(s + n + n + n);
          }
        }
        return shunzi.concat(kezi);
      }
      function mianzi_all(shoupai) {
        let shupai_all = [[]];
        for (let s of ["m", "p", "s"]) {
          let new_mianzi = [];
          for (let mm of shupai_all) {
            for (let nn of mianzi(s, shoupai._bingpai[s])) {
              new_mianzi.push(mm.concat(nn));
            }
          }
          shupai_all = new_mianzi;
        }
        let zipai = [];
        for (let n = 1; n <= 7; n++) {
          if (shoupai._bingpai.z[n] == 0) continue;
          if (shoupai._bingpai.z[n] != 3) return [];
          zipai.push("z" + n + n + n);
        }
        let fulou = shoupai._fulou.map((m) => m.replace(/0/g, "5"));
        return shupai_all.map((shupai) => shupai.concat(zipai).concat(fulou));
      }
      function add_hulepai(mianzi2, p) {
        let [s, n, d] = p;
        let regexp = new RegExp(`^(${s}.*${n})`);
        let replacer = `$1${d}!`;
        let new_mianzi = [];
        for (let i = 0; i < mianzi2.length; i++) {
          if (mianzi2[i].match(/[\+\=\-]|\d{4}/)) continue;
          if (i > 0 && mianzi2[i] == mianzi2[i - 1]) continue;
          let m = mianzi2[i].replace(regexp, replacer);
          if (m == mianzi2[i]) continue;
          let tmp_mianzi = mianzi2.concat();
          tmp_mianzi[i] = m;
          new_mianzi.push(tmp_mianzi);
        }
        return new_mianzi;
      }
      function hule_mianzi_yiban(shoupai, hulepai) {
        let mianzi2 = [];
        for (let s of ["m", "p", "s", "z"]) {
          let bingpai = shoupai._bingpai[s];
          for (let n = 1; n < bingpai.length; n++) {
            if (bingpai[n] < 2) continue;
            bingpai[n] -= 2;
            let jiangpai = s + n + n;
            for (let mm of mianzi_all(shoupai)) {
              mm.unshift(jiangpai);
              if (mm.length != 5) continue;
              mianzi2 = mianzi2.concat(add_hulepai(mm, hulepai));
            }
            bingpai[n] += 2;
          }
        }
        return mianzi2;
      }
      function hule_mianzi_qidui(shoupai, hulepai) {
        if (shoupai._fulou.length > 0) return [];
        let mianzi2 = [];
        for (let s of ["m", "p", "s", "z"]) {
          let bingpai = shoupai._bingpai[s];
          for (let n = 1; n < bingpai.length; n++) {
            if (bingpai[n] == 0) continue;
            if (bingpai[n] == 2) {
              let m = s + n == hulepai.slice(0, 2) ? s + n + n + hulepai[2] + "!" : s + n + n;
              mianzi2.push(m);
            } else return [];
          }
        }
        return mianzi2.length == 7 ? [mianzi2] : [];
      }
      function hule_mianzi_guoshi(shoupai, hulepai) {
        if (shoupai._fulou.length > 0) return [];
        let mianzi2 = [];
        let n_duizi = 0;
        for (let s of ["m", "p", "s", "z"]) {
          let bingpai = shoupai._bingpai[s];
          let nn = s == "z" ? [1, 2, 3, 4, 5, 6, 7] : [1, 9];
          for (let n of nn) {
            if (bingpai[n] == 2) {
              let m = s + n == hulepai.slice(0, 2) ? s + n + n + hulepai[2] + "!" : s + n + n;
              mianzi2.unshift(m);
              n_duizi++;
            } else if (bingpai[n] == 1) {
              let m = s + n == hulepai.slice(0, 2) ? s + n + hulepai[2] + "!" : s + n;
              mianzi2.push(m);
            } else return [];
          }
        }
        return n_duizi == 1 ? [mianzi2] : [];
      }
      function hule_mianzi_jiulian(shoupai, hulepai) {
        if (shoupai._fulou.length > 0) return [];
        let s = hulepai[0];
        if (s == "z") return [];
        let mianzi2 = s;
        let bingpai = shoupai._bingpai[s];
        for (let n = 1; n <= 9; n++) {
          if (bingpai[n] == 0) return [];
          if ((n == 1 || n == 9) && bingpai[n] < 3) return [];
          let n_pai = n == hulepai[1] ? bingpai[n] - 1 : bingpai[n];
          for (let i = 0; i < n_pai; i++) {
            mianzi2 += n;
          }
        }
        if (mianzi2.length != 14) return [];
        mianzi2 += hulepai.slice(1) + "!";
        return [[mianzi2]];
      }
      function hule_mianzi(shoupai, rongpai) {
        let new_shoupai = shoupai.clone();
        if (rongpai) new_shoupai.zimo(rongpai);
        if (!new_shoupai._zimo || new_shoupai._zimo.length > 2) return [];
        let hulepai = (rongpai || new_shoupai._zimo + "_").replace(/0/, "5");
        return [].concat(hule_mianzi_yiban(new_shoupai, hulepai)).concat(hule_mianzi_qidui(new_shoupai, hulepai)).concat(hule_mianzi_guoshi(new_shoupai, hulepai)).concat(hule_mianzi_jiulian(new_shoupai, hulepai));
      }
      function get_hudi(mianzi2, zhuangfeng, menfeng, rule) {
        const zhuangfengpai = new RegExp(`^z${zhuangfeng + 1}.*$`);
        const menfengpai = new RegExp(`^z${menfeng + 1}.*$`);
        const sanyuanpai = /^z[567].*$/;
        const yaojiu = /^.*[z19].*$/;
        const zipai = /^z.*$/;
        const kezi = /^[mpsz](\d)\1\1.*$/;
        const ankezi = /^[mpsz](\d)\1\1(?:\1|_\!)?$/;
        const gangzi = /^[mpsz](\d)\1\1.*\1.*$/;
        const danqi = /^[mpsz](\d)\1[\+\=\-\_]\!$/;
        const kanzhang = /^[mps]\d\d[\+\=\-\_]\!\d$/;
        const bianzhang = /^[mps](123[\+\=\-\_]\!|7[\+\=\-\_]\!89)$/;
        let hudi = {
          fu: 20,
          menqian: true,
          zimo: true,
          shunzi: {
            m: [0, 0, 0, 0, 0, 0, 0, 0],
            p: [0, 0, 0, 0, 0, 0, 0, 0],
            s: [0, 0, 0, 0, 0, 0, 0, 0]
          },
          kezi: {
            m: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            p: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            s: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            z: [0, 0, 0, 0, 0, 0, 0, 0]
          },
          n_shunzi: 0,
          n_kezi: 0,
          n_ankezi: 0,
          n_gangzi: 0,
          n_yaojiu: 0,
          n_zipai: 0,
          danqi: false,
          pinghu: false,
          zhuangfeng,
          menfeng
        };
        for (let m of mianzi2) {
          if (m.match(/[\+\=\-](?!\!)/)) hudi.menqian = false;
          if (m.match(/[\+\=\-]\!/)) hudi.zimo = false;
          if (mianzi2.length == 1) continue;
          if (m.match(danqi)) hudi.danqi = true;
          if (mianzi2.length == 13) continue;
          if (m.match(yaojiu)) hudi.n_yaojiu++;
          if (m.match(zipai)) hudi.n_zipai++;
          if (mianzi2.length != 5) continue;
          if (m == mianzi2[0]) {
            let fu = 0;
            if (m.match(zhuangfengpai)) fu += 2;
            if (m.match(menfengpai)) fu += 2;
            if (m.match(sanyuanpai)) fu += 2;
            fu = rule["\u9023\u98A8\u724C\u306F2\u7B26"] && fu > 2 ? 2 : fu;
            hudi.fu += fu;
            if (hudi.danqi) hudi.fu += 2;
          } else if (m.match(kezi)) {
            hudi.n_kezi++;
            let fu = 2;
            if (m.match(yaojiu)) {
              fu *= 2;
            }
            if (m.match(ankezi)) {
              fu *= 2;
              hudi.n_ankezi++;
            }
            if (m.match(gangzi)) {
              fu *= 4;
              hudi.n_gangzi++;
            }
            hudi.fu += fu;
            hudi.kezi[m[0]][m[1]]++;
          } else {
            hudi.n_shunzi++;
            if (m.match(kanzhang)) hudi.fu += 2;
            if (m.match(bianzhang)) hudi.fu += 2;
            hudi.shunzi[m[0]][m[1]]++;
          }
        }
        if (mianzi2.length == 7) {
          hudi.fu = 25;
        } else if (mianzi2.length == 5) {
          hudi.pinghu = hudi.menqian && hudi.fu == 20;
          if (hudi.zimo) {
            if (!hudi.pinghu) hudi.fu += 2;
          } else {
            if (hudi.menqian) hudi.fu += 10;
            else if (hudi.fu == 20) hudi.fu = 30;
          }
          hudi.fu = Math.ceil(hudi.fu / 10) * 10;
        }
        return hudi;
      }
      function get_pre_hupai(hupai) {
        let pre_hupai = [];
        if (hupai.lizhi == 1) pre_hupai.push({ name: "\u7ACB\u76F4", fanshu: 1 });
        if (hupai.lizhi == 2) pre_hupai.push({ name: "\u30C0\u30D6\u30EB\u7ACB\u76F4", fanshu: 2 });
        if (hupai.yifa) pre_hupai.push({ name: "\u4E00\u767A", fanshu: 1 });
        if (hupai.haidi == 1) pre_hupai.push({ name: "\u6D77\u5E95\u6478\u6708", fanshu: 1 });
        if (hupai.haidi == 2) pre_hupai.push({ name: "\u6CB3\u5E95\u6488\u9B5A", fanshu: 1 });
        if (hupai.lingshang) pre_hupai.push({ name: "\u5DBA\u4E0A\u958B\u82B1", fanshu: 1 });
        if (hupai.qianggang) pre_hupai.push({ name: "\u69CD\u69D3", fanshu: 1 });
        if (hupai.tianhu == 1) pre_hupai = [{ name: "\u5929\u548C", fanshu: "*" }];
        if (hupai.tianhu == 2) pre_hupai = [{ name: "\u5730\u548C", fanshu: "*" }];
        return pre_hupai;
      }
      function get_hupai(mianzi2, hudi, pre_hupai, post_hupai, rule) {
        function menqianqing() {
          if (hudi.menqian && hudi.zimo)
            return [{ name: "\u9580\u524D\u6E05\u81EA\u6478\u548C", fanshu: 1 }];
          return [];
        }
        function fanpai() {
          let feng_hanzi = ["\u6771", "\u5357", "\u897F", "\u5317"];
          let fanpai_all = [];
          if (hudi.kezi.z[hudi.zhuangfeng + 1])
            fanpai_all.push({
              name: "\u5834\u98A8 " + feng_hanzi[hudi.zhuangfeng],
              fanshu: 1
            });
          if (hudi.kezi.z[hudi.menfeng + 1])
            fanpai_all.push({
              name: "\u81EA\u98A8 " + feng_hanzi[hudi.menfeng],
              fanshu: 1
            });
          if (hudi.kezi.z[5]) fanpai_all.push({ name: "\u7FFB\u724C \u767D", fanshu: 1 });
          if (hudi.kezi.z[6]) fanpai_all.push({ name: "\u7FFB\u724C \u767C", fanshu: 1 });
          if (hudi.kezi.z[7]) fanpai_all.push({ name: "\u7FFB\u724C \u4E2D", fanshu: 1 });
          return fanpai_all;
        }
        function pinghu() {
          if (hudi.pinghu) return [{ name: "\u5E73\u548C", fanshu: 1 }];
          return [];
        }
        function duanyaojiu() {
          if (hudi.n_yaojiu > 0) return [];
          if (rule["\u30AF\u30A4\u30BF\u30F3\u3042\u308A"] || hudi.menqian)
            return [{ name: "\u65AD\u5E7A\u4E5D", fanshu: 1 }];
          return [];
        }
        function yibeikou() {
          if (!hudi.menqian) return [];
          const shunzi = hudi.shunzi;
          let beikou = shunzi.m.concat(shunzi.p).concat(shunzi.s).map((x) => x >> 1).reduce((a, b) => a + b);
          if (beikou == 1) return [{ name: "\u4E00\u76C3\u53E3", fanshu: 1 }];
          return [];
        }
        function sansetongshun() {
          const shunzi = hudi.shunzi;
          for (let n = 1; n <= 7; n++) {
            if (shunzi.m[n] && shunzi.p[n] && shunzi.s[n])
              return [{ name: "\u4E09\u8272\u540C\u9806", fanshu: hudi.menqian ? 2 : 1 }];
          }
          return [];
        }
        function yiqitongguan() {
          const shunzi = hudi.shunzi;
          for (let s of ["m", "p", "s"]) {
            if (shunzi[s][1] && shunzi[s][4] && shunzi[s][7])
              return [{ name: "\u4E00\u6C17\u901A\u8CAB", fanshu: hudi.menqian ? 2 : 1 }];
          }
          return [];
        }
        function hunquandaiyaojiu() {
          if (hudi.n_yaojiu == 5 && hudi.n_shunzi > 0 && hudi.n_zipai > 0)
            return [{ name: "\u6DF7\u5168\u5E2F\u5E7A\u4E5D", fanshu: hudi.menqian ? 2 : 1 }];
          return [];
        }
        function qiduizi() {
          if (mianzi2.length == 7) return [{ name: "\u4E03\u5BFE\u5B50", fanshu: 2 }];
          return [];
        }
        function duiduihu() {
          if (hudi.n_kezi == 4) return [{ name: "\u5BFE\u3005\u548C", fanshu: 2 }];
          return [];
        }
        function sananke() {
          if (hudi.n_ankezi == 3) return [{ name: "\u4E09\u6697\u523B", fanshu: 2 }];
          return [];
        }
        function sangangzi() {
          if (hudi.n_gangzi == 3) return [{ name: "\u4E09\u69D3\u5B50", fanshu: 2 }];
          return [];
        }
        function sansetongke() {
          const kezi = hudi.kezi;
          for (let n = 1; n <= 9; n++) {
            if (kezi.m[n] && kezi.p[n] && kezi.s[n])
              return [{ name: "\u4E09\u8272\u540C\u523B", fanshu: 2 }];
          }
          return [];
        }
        function hunlaotou() {
          if (hudi.n_yaojiu == mianzi2.length && hudi.n_shunzi == 0 && hudi.n_zipai > 0)
            return [{ name: "\u6DF7\u8001\u982D", fanshu: 2 }];
          return [];
        }
        function xiaosanyuan() {
          const kezi = hudi.kezi;
          if (kezi.z[5] + kezi.z[6] + kezi.z[7] == 2 && mianzi2[0].match(/^z[567]/))
            return [{ name: "\u5C0F\u4E09\u5143", fanshu: 2 }];
          return [];
        }
        function hunyise() {
          for (let s of ["m", "p", "s"]) {
            const yise = new RegExp(`^[z${s}]`);
            if (mianzi2.filter((m) => m.match(yise)).length == mianzi2.length && hudi.n_zipai > 0)
              return [{ name: "\u6DF7\u4E00\u8272", fanshu: hudi.menqian ? 3 : 2 }];
          }
          return [];
        }
        function chunquandaiyaojiu() {
          if (hudi.n_yaojiu == 5 && hudi.n_shunzi > 0 && hudi.n_zipai == 0)
            return [{ name: "\u7D14\u5168\u5E2F\u5E7A\u4E5D", fanshu: hudi.menqian ? 3 : 2 }];
          return [];
        }
        function erbeikou() {
          if (!hudi.menqian) return [];
          const shunzi = hudi.shunzi;
          let beikou = shunzi.m.concat(shunzi.p).concat(shunzi.s).map((x) => x >> 1).reduce((a, b) => a + b);
          if (beikou == 2) return [{ name: "\u4E8C\u76C3\u53E3", fanshu: 3 }];
          return [];
        }
        function qingyise() {
          for (let s of ["m", "p", "s"]) {
            const yise = new RegExp(`^[${s}]`);
            if (mianzi2.filter((m) => m.match(yise)).length == mianzi2.length)
              return [{ name: "\u6E05\u4E00\u8272", fanshu: hudi.menqian ? 6 : 5 }];
          }
          return [];
        }
        function guoshiwushuang() {
          if (mianzi2.length != 13) return [];
          if (hudi.danqi) return [{ name: "\u56FD\u58EB\u7121\u53CC\u5341\u4E09\u9762", fanshu: "**" }];
          else return [{ name: "\u56FD\u58EB\u7121\u53CC", fanshu: "*" }];
        }
        function sianke() {
          if (hudi.n_ankezi != 4) return [];
          if (hudi.danqi) return [{ name: "\u56DB\u6697\u523B\u5358\u9A0E", fanshu: "**" }];
          else return [{ name: "\u56DB\u6697\u523B", fanshu: "*" }];
        }
        function dasanyuan() {
          const kezi = hudi.kezi;
          if (kezi.z[5] + kezi.z[6] + kezi.z[7] == 3) {
            let bao_mianzi = mianzi2.filter((m) => m.match(/^z([567])\1\1(?:[\+\=\-]|\1)(?!\!)/));
            let baojia = bao_mianzi[2] && bao_mianzi[2].match(/[\+\=\-]/);
            if (baojia)
              return [{ name: "\u5927\u4E09\u5143", fanshu: "*", baojia: baojia[0] }];
            else return [{ name: "\u5927\u4E09\u5143", fanshu: "*" }];
          }
          return [];
        }
        function sixihu() {
          const kezi = hudi.kezi;
          if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 4) {
            let bao_mianzi = mianzi2.filter((m) => m.match(/^z([1234])\1\1(?:[\+\=\-]|\1)(?!\!)/));
            let baojia = bao_mianzi[3] && bao_mianzi[3].match(/[\+\=\-]/);
            if (baojia)
              return [{ name: "\u5927\u56DB\u559C", fanshu: "**", baojia: baojia[0] }];
            else return [{ name: "\u5927\u56DB\u559C", fanshu: "**" }];
          }
          if (kezi.z[1] + kezi.z[2] + kezi.z[3] + kezi.z[4] == 3 && mianzi2[0].match(/^z[1234]/))
            return [{ name: "\u5C0F\u56DB\u559C", fanshu: "*" }];
          return [];
        }
        function ziyise() {
          if (hudi.n_zipai == mianzi2.length)
            return [{ name: "\u5B57\u4E00\u8272", fanshu: "*" }];
          return [];
        }
        function lvyise() {
          if (mianzi2.filter((m) => m.match(/^[mp]/)).length > 0) return [];
          if (mianzi2.filter((m) => m.match(/^z[^6]/)).length > 0) return [];
          if (mianzi2.filter((m) => m.match(/^s.*[1579]/)).length > 0) return [];
          return [{ name: "\u7DD1\u4E00\u8272", fanshu: "*" }];
        }
        function qinglaotou() {
          if (hudi.n_yaojiu == 5 && hudi.n_kezi == 4 && hudi.n_zipai == 0)
            return [{ name: "\u6E05\u8001\u982D", fanshu: "*" }];
          return [];
        }
        function sigangzi() {
          if (hudi.n_gangzi == 4) return [{ name: "\u56DB\u69D3\u5B50", fanshu: "*" }];
          return [];
        }
        function jiulianbaodeng() {
          if (mianzi2.length != 1) return [];
          if (mianzi2[0].match(/^[mpsz]1112345678999/))
            return [{ name: "\u7D14\u6B63\u4E5D\u84EE\u5B9D\u71C8", fanshu: "**" }];
          else return [{ name: "\u4E5D\u84EE\u5B9D\u71C8", fanshu: "*" }];
        }
        let damanguan = pre_hupai.length > 0 && pre_hupai[0].fanshu[0] == "*" ? pre_hupai : [];
        damanguan = damanguan.concat(guoshiwushuang()).concat(sianke()).concat(dasanyuan()).concat(sixihu()).concat(ziyise()).concat(lvyise()).concat(qinglaotou()).concat(sigangzi()).concat(jiulianbaodeng());
        for (let hupai2 of damanguan) {
          if (!rule["\u30C0\u30D6\u30EB\u5F79\u6E80\u3042\u308A"]) hupai2.fanshu = "*";
          if (!rule["\u5F79\u6E80\u30D1\u30AA\u3042\u308A"]) delete hupai2.baojia;
        }
        if (damanguan.length > 0) return damanguan;
        let hupai = pre_hupai.concat(menqianqing()).concat(fanpai()).concat(pinghu()).concat(duanyaojiu()).concat(yibeikou()).concat(sansetongshun()).concat(yiqitongguan()).concat(hunquandaiyaojiu()).concat(qiduizi()).concat(duiduihu()).concat(sananke()).concat(sangangzi()).concat(sansetongke()).concat(hunlaotou()).concat(xiaosanyuan()).concat(hunyise()).concat(chunquandaiyaojiu()).concat(erbeikou()).concat(qingyise());
        if (hupai.length > 0) hupai = hupai.concat(post_hupai);
        return hupai;
      }
      function get_post_hupai(shoupai, rongpai, baopai, fubaopai) {
        let new_shoupai = shoupai.clone();
        if (rongpai) new_shoupai.zimo(rongpai);
        let paistr = new_shoupai.toString();
        let post_hupai = [];
        let suitstr = paistr.match(/[mpsz][^mpsz,]*/g);
        let n_baopai = 0;
        for (let p of baopai) {
          p = Majiang.Shan.zhenbaopai(p);
          const regexp = new RegExp(p[1], "g");
          for (let m of suitstr) {
            if (m[0] != p[0]) continue;
            m = m.replace(/0/, "5");
            let nn2 = m.match(regexp);
            if (nn2) n_baopai += nn2.length;
          }
        }
        if (n_baopai) post_hupai.push({ name: "\u30C9\u30E9", fanshu: n_baopai });
        let n_hongpai = 0;
        let nn = paistr.match(/0/g);
        if (nn) n_hongpai = nn.length;
        if (n_hongpai) post_hupai.push({ name: "\u8D64\u30C9\u30E9", fanshu: n_hongpai });
        let n_fubaopai = 0;
        for (let p of fubaopai || []) {
          p = Majiang.Shan.zhenbaopai(p);
          const regexp = new RegExp(p[1], "g");
          for (let m of suitstr) {
            if (m[0] != p[0]) continue;
            m = m.replace(/0/, "5");
            let nn2 = m.match(regexp);
            if (nn2) n_fubaopai += nn2.length;
          }
        }
        if (n_fubaopai) post_hupai.push({ name: "\u88CF\u30C9\u30E9", fanshu: n_fubaopai });
        return post_hupai;
      }
      function get_defen(fu, hupai, rongpai, param) {
        if (hupai.length == 0) return { defen: 0 };
        let menfeng = param.menfeng;
        let fanshu, damanguan, defen, base, baojia, defen2, base2, baojia2;
        if (hupai[0].fanshu[0] == "*") {
          fu = void 0;
          damanguan = !param.rule["\u5F79\u6E80\u306E\u8907\u5408\u3042\u308A"] ? 1 : hupai.map((h2) => h2.fanshu.length).reduce((x, y) => x + y);
          base = 8e3 * damanguan;
          let h = hupai.find((h2) => h2.baojia);
          if (h) {
            baojia2 = (menfeng + { "+": 1, "=": 2, "-": 3 }[h.baojia]) % 4;
            base2 = 8e3 * Math.min(h.fanshu.length, damanguan);
          }
        } else {
          fanshu = hupai.map((h) => h.fanshu).reduce((x, y) => x + y);
          base = fanshu >= 13 && param.rule["\u6570\u3048\u5F79\u6E80\u3042\u308A"] ? 8e3 : fanshu >= 11 ? 6e3 : fanshu >= 8 ? 4e3 : fanshu >= 6 ? 3e3 : param.rule["\u5207\u308A\u4E0A\u3052\u6E80\u8CAB\u3042\u308A"] && fu << 2 + fanshu == 1920 ? 2e3 : Math.min(fu << 2 + fanshu, 2e3);
        }
        let fenpei = [0, 0, 0, 0];
        let chang = param.jicun.changbang;
        let lizhi = param.jicun.lizhibang;
        if (baojia2 != null) {
          if (rongpai) base2 = base2 / 2;
          base = base - base2;
          defen2 = base2 * (menfeng == 0 ? 6 : 4);
          fenpei[menfeng] += defen2;
          fenpei[baojia2] -= defen2;
        } else defen2 = 0;
        if (rongpai || base == 0) {
          baojia = base == 0 ? baojia2 : (menfeng + { "+": 1, "=": 2, "-": 3 }[rongpai[2]]) % 4;
          defen = Math.ceil(base * (menfeng == 0 ? 6 : 4) / 100) * 100;
          fenpei[menfeng] += defen + chang * 300 + lizhi * 1e3;
          fenpei[baojia] -= defen + chang * 300;
        } else {
          let zhuangjia = Math.ceil(base * 2 / 100) * 100;
          let sanjia = Math.ceil(base / 100) * 100;
          if (menfeng == 0) {
            defen = zhuangjia * 3;
            for (let l = 0; l < 4; l++) {
              if (l == menfeng)
                fenpei[l] += defen + chang * 300 + lizhi * 1e3;
              else fenpei[l] -= zhuangjia + chang * 100;
            }
          } else {
            defen = zhuangjia + sanjia * 2;
            for (let l = 0; l < 4; l++) {
              if (l == menfeng)
                fenpei[l] += defen + chang * 300 + lizhi * 1e3;
              else if (l == 0)
                fenpei[l] -= zhuangjia + chang * 100;
              else fenpei[l] -= sanjia + chang * 100;
            }
          }
        }
        return {
          hupai,
          fu,
          fanshu,
          damanguan,
          defen: defen + defen2,
          fenpei
        };
      }
      function hule(shoupai, rongpai, param) {
        if (rongpai) {
          if (!rongpai.match(/[\+\=\-]$/)) throw new Error(rongpai);
          rongpai = rongpai.slice(0, 2) + rongpai.slice(-1);
        }
        let max;
        let pre_hupai = get_pre_hupai(param.hupai);
        let post_hupai = get_post_hupai(
          shoupai,
          rongpai,
          param.baopai,
          param.fubaopai
        );
        for (let mianzi2 of hule_mianzi(shoupai, rongpai)) {
          let hudi = get_hudi(
            mianzi2,
            param.zhuangfeng,
            param.menfeng,
            param.rule
          );
          let hupai = get_hupai(mianzi2, hudi, pre_hupai, post_hupai, param.rule);
          let rv = get_defen(hudi.fu, hupai, rongpai, param);
          if (!max || rv.defen > max.defen || rv.defen == max.defen && (!rv.fanshu || rv.fanshu > max.fanshu || rv.fanshu == max.fanshu && rv.fu > max.fu)) max = rv;
        }
        return max;
      }
      function hule_param(param = {}) {
        let rv = {
          rule: param.rule ?? Majiang.rule(),
          zhuangfeng: param.zhuangfeng ?? 0,
          menfeng: param.menfeng ?? 1,
          hupai: {
            lizhi: param.lizhi ?? 0,
            yifa: param.yifa ?? false,
            qianggang: param.qianggang ?? false,
            lingshang: param.lingshang ?? false,
            haidi: param.haidi ?? 0,
            tianhu: param.tianhu ?? 0
          },
          baopai: param.baopai ? [].concat(param.baopai) : [],
          fubaopai: param.fubaopai ? [].concat(param.fubaopai) : null,
          jicun: {
            changbang: param.changbang ?? 0,
            lizhibang: param.lizhibang ?? 0
          }
        };
        return rv;
      }
      module.exports = {
        hule,
        hule_param,
        hule_mianzi
      };
    }
  });

  // node_modules/@kobalab/majiang-core/lib/game.js
  var require_game = __commonJS({
    "node_modules/@kobalab/majiang-core/lib/game.js"(exports, module) {
      "use strict";
      var Majiang = {
        rule: require_rule(),
        Shoupai: require_shoupai(),
        Shan: require_shan(),
        He: require_he(),
        Util: Object.assign(
          require_xiangting(),
          require_hule()
        )
      };
      module.exports = class Game {
        constructor(players, callback, rule, title) {
          this._players = players;
          this._callback = callback || (() => {
          });
          this._rule = rule || Majiang.rule();
          this._model = {
            title: title || "\u96FB\u8133\u9EBB\u5C06\n" + (/* @__PURE__ */ new Date()).toLocaleString(),
            player: ["\u79C1", "\u4E0B\u5BB6", "\u5BFE\u9762", "\u4E0A\u5BB6"],
            qijia: 0,
            zhuangfeng: 0,
            jushu: 0,
            changbang: 0,
            lizhibang: 0,
            defen: [0, 0, 0, 0].map((x) => this._rule["\u914D\u7D66\u539F\u70B9"]),
            shan: null,
            shoupai: [],
            he: [],
            player_id: [0, 1, 2, 3]
          };
          this._view;
          this._status;
          this._reply = [];
          this._sync = false;
          this._stop = null;
          this._dwell = 0;
          this._wait = 0;
          this._timeout_id;
          this._handler;
          this._speed = 3;
        }
        get model() {
          return this._model;
        }
        set view(view) {
          this._view = view;
        }
        get view() {
          return this._view;
        }
        set dwell(ms) {
          this._dwell = ms;
        }
        set wait(wait) {
          this._wait = wait;
        }
        set handler(callback) {
          this._handler = callback;
        }
        get speed() {
          return this._speed;
        }
        set speed(speed) {
          this._speed = speed;
          this.dwell = speed * 200;
        }
        add_paipu(paipu) {
          this._paipu.log[this._paipu.log.length - 1].push(paipu);
        }
        delay(callback, timeout) {
          if (this._sync) return callback();
          timeout = this._dwell == 0 ? 0 : timeout == null ? Math.max(500, this._dwell) : timeout;
          setTimeout(callback, timeout);
        }
        say(name, l) {
          if (this._view) this._view.say(name, l);
        }
        stop(callback = () => {
        }) {
          this._stop = callback;
        }
        start() {
          if (this._timeout_id) return;
          this._stop = null;
          this._timeout_id = setTimeout(() => this.next(), 0);
        }
        notify_players(type, msg) {
          for (let l = 0; l < 4; l++) {
            let id = this._model.player_id[l];
            if (this._sync)
              this._players[id].action(msg[l]);
            else setTimeout(() => {
              this._players[id].action(msg[l]);
            }, 0);
          }
        }
        call_players(type, msg, timeout) {
          timeout = this._dwell == 0 ? 0 : timeout == null ? this._dwell : timeout;
          this._status = type;
          this._reply = [];
          for (let l = 0; l < 4; l++) {
            let id = this._model.player_id[l];
            if (this._sync)
              this._players[id].action(
                msg[l],
                (reply) => this.reply(id, reply)
              );
            else setTimeout(() => {
              this._players[id].action(
                msg[l],
                (reply) => this.reply(id, reply)
              );
            }, 0);
          }
          if (!this._sync)
            this._timeout_id = setTimeout(() => this.next(), timeout);
        }
        reply(id, reply) {
          this._reply[id] = reply || {};
          if (this._sync) return;
          if (this._reply.filter((x) => x).length < 4) return;
          if (!this._timeout_id)
            this._timeout_id = setTimeout(() => this.next(), 0);
        }
        next() {
          this._timeout_id = clearTimeout(this._timeout_id);
          if (this._reply.filter((x) => x).length < 4) return;
          if (this._stop) return this._stop();
          if (this._status == "kaiju") this.reply_kaiju();
          else if (this._status == "qipai") this.reply_qipai();
          else if (this._status == "zimo") this.reply_zimo();
          else if (this._status == "dapai") this.reply_dapai();
          else if (this._status == "fulou") this.reply_fulou();
          else if (this._status == "gang") this.reply_gang();
          else if (this._status == "gangzimo") this.reply_zimo();
          else if (this._status == "hule") this.reply_hule();
          else if (this._status == "pingju") this.reply_pingju();
          else this._callback(this._paipu);
        }
        do_sync() {
          this._sync = true;
          this.kaiju();
          for (; ; ) {
            if (this._status == "kaiju") this.reply_kaiju();
            else if (this._status == "qipai") this.reply_qipai();
            else if (this._status == "zimo") this.reply_zimo();
            else if (this._status == "dapai") this.reply_dapai();
            else if (this._status == "fulou") this.reply_fulou();
            else if (this._status == "gang") this.reply_gang();
            else if (this._status == "gangzimo") this.reply_zimo();
            else if (this._status == "hule") this.reply_hule();
            else if (this._status == "pingju") this.reply_pingju();
            else break;
          }
          this._callback(this._paipu);
          return this;
        }
        kaiju(qijia) {
          this._model.qijia = qijia ?? Math.floor(Math.random() * 4);
          this._max_jushu = this._rule["\u5834\u6570"] == 0 ? 0 : this._rule["\u5834\u6570"] * 4 - 1;
          this._paipu = {
            title: this._model.title,
            player: this._model.player,
            qijia: this._model.qijia,
            log: [],
            defen: this._model.defen.concat(),
            point: [],
            rank: []
          };
          let msg = [];
          for (let id = 0; id < 4; id++) {
            msg[id] = JSON.parse(JSON.stringify({
              kaiju: {
                id,
                rule: this._rule,
                title: this._paipu.title,
                player: this._paipu.player,
                qijia: this._paipu.qijia
              }
            }));
          }
          this.call_players("kaiju", msg, 0);
          if (this._view) this._view.kaiju();
        }
        qipai(shan) {
          let model = this._model;
          model.shan = shan || new Majiang.Shan(this._rule);
          for (let l = 0; l < 4; l++) {
            let qipai = [];
            for (let i = 0; i < 13; i++) {
              qipai.push(model.shan.zimo());
            }
            model.shoupai[l] = new Majiang.Shoupai(qipai);
            model.he[l] = new Majiang.He();
            model.player_id[l] = (model.qijia + model.jushu + l) % 4;
          }
          model.lunban = -1;
          this._diyizimo = true;
          this._fengpai = this._rule["\u9014\u4E2D\u6D41\u5C40\u3042\u308A"];
          this._dapai = null;
          this._gang = null;
          this._lizhi = [0, 0, 0, 0];
          this._yifa = [0, 0, 0, 0];
          this._n_gang = [0, 0, 0, 0];
          this._neng_rong = [1, 1, 1, 1];
          this._hule = [];
          this._hule_option = null;
          this._no_game = false;
          this._lianzhuang = false;
          this._changbang = model.changbang;
          this._fenpei = null;
          this._paipu.defen = model.defen.concat();
          this._paipu.log.push([]);
          let paipu = {
            qipai: {
              zhuangfeng: model.zhuangfeng,
              jushu: model.jushu,
              changbang: model.changbang,
              lizhibang: model.lizhibang,
              defen: model.player_id.map((id) => model.defen[id]),
              baopai: model.shan.baopai[0],
              shoupai: model.shoupai.map((shoupai) => shoupai.toString())
            }
          };
          this.add_paipu(paipu);
          let msg = [];
          for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
            for (let i = 0; i < 4; i++) {
              if (i != l) msg[l].qipai.shoupai[i] = "";
            }
          }
          this.call_players("qipai", msg);
          if (this._view) this._view.redraw();
        }
        zimo() {
          let model = this._model;
          model.lunban = (model.lunban + 1) % 4;
          let zimo = model.shan.zimo();
          model.shoupai[model.lunban].zimo(zimo);
          let paipu = { zimo: { l: model.lunban, p: zimo } };
          this.add_paipu(paipu);
          let msg = [];
          for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
            if (l != model.lunban) msg[l].zimo.p = "";
          }
          this.call_players("zimo", msg);
          if (this._view) this._view.update(paipu);
        }
        dapai(dapai) {
          let model = this._model;
          this._yifa[model.lunban] = 0;
          if (!model.shoupai[model.lunban].lizhi)
            this._neng_rong[model.lunban] = true;
          model.shoupai[model.lunban].dapai(dapai);
          model.he[model.lunban].dapai(dapai);
          if (this._diyizimo) {
            if (!dapai.match(/^z[1234]/)) this._fengpai = false;
            if (this._dapai && this._dapai.slice(0, 2) != dapai.slice(0, 2))
              this._fengpai = false;
          } else this._fengpai = false;
          if (dapai.slice(-1) == "*") {
            this._lizhi[model.lunban] = this._diyizimo ? 2 : 1;
            this._yifa[model.lunban] = this._rule["\u4E00\u767A\u3042\u308A"];
          }
          if (Majiang.Util.xiangting(model.shoupai[model.lunban]) == 0 && Majiang.Util.tingpai(model.shoupai[model.lunban]).find((p) => model.he[model.lunban].find(p))) {
            this._neng_rong[model.lunban] = false;
          }
          this._dapai = dapai;
          let paipu = { dapai: { l: model.lunban, p: dapai } };
          this.add_paipu(paipu);
          if (this._gang) this.kaigang();
          let msg = [];
          for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
          }
          this.call_players("dapai", msg);
          if (this._view) this._view.update(paipu);
        }
        fulou(fulou) {
          let model = this._model;
          this._diyizimo = false;
          this._yifa = [0, 0, 0, 0];
          model.he[model.lunban].fulou(fulou);
          let d = fulou.match(/[\+\=\-]/);
          model.lunban = (model.lunban + "_-=+".indexOf(d)) % 4;
          model.shoupai[model.lunban].fulou(fulou);
          if (fulou.match(/^[mpsz]\d{4}/)) {
            this._gang = fulou;
            this._n_gang[model.lunban]++;
          }
          let paipu = { fulou: { l: model.lunban, m: fulou } };
          this.add_paipu(paipu);
          let msg = [];
          for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
          }
          this.call_players("fulou", msg);
          if (this._view) this._view.update(paipu);
        }
        gang(gang) {
          let model = this._model;
          model.shoupai[model.lunban].gang(gang);
          let paipu = { gang: { l: model.lunban, m: gang } };
          this.add_paipu(paipu);
          if (this._gang) this.kaigang();
          this._gang = gang;
          this._n_gang[model.lunban]++;
          let msg = [];
          for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
          }
          this.call_players("gang", msg);
          if (this._view) this._view.update(paipu);
        }
        gangzimo() {
          let model = this._model;
          this._diyizimo = false;
          this._yifa = [0, 0, 0, 0];
          let zimo = model.shan.gangzimo();
          model.shoupai[model.lunban].zimo(zimo);
          let paipu = { gangzimo: { l: model.lunban, p: zimo } };
          this.add_paipu(paipu);
          if (!this._rule["\u30AB\u30F3\u30C9\u30E9\u5F8C\u4E57\u305B"] || this._gang.match(/^[mpsz]\d{4}$/)) this.kaigang();
          let msg = [];
          for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
            if (l != model.lunban) msg[l].gangzimo.p = "";
          }
          this.call_players("gangzimo", msg);
          if (this._view) this._view.update(paipu);
        }
        kaigang() {
          this._gang = null;
          if (!this._rule["\u30AB\u30F3\u30C9\u30E9\u3042\u308A"]) return;
          let model = this._model;
          model.shan.kaigang();
          let baopai = model.shan.baopai.pop();
          let paipu = { kaigang: { baopai } };
          this.add_paipu(paipu);
          let msg = [];
          for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
          }
          this.notify_players("kaigang", msg);
          if (this._view) this._view.update(paipu);
        }
        hule() {
          let model = this._model;
          if (this._status != "hule") {
            model.shan.close();
            this._hule_option = this._status == "gang" ? "qianggang" : this._status == "gangzimo" ? "lingshang" : null;
          }
          let menfeng = this._hule.length ? this._hule.shift() : model.lunban;
          let rongpai = menfeng == model.lunban ? null : (this._hule_option == "qianggang" ? this._gang[0] + this._gang.slice(-1) : this._dapai.slice(0, 2)) + "_+=-"[(4 + model.lunban - menfeng) % 4];
          let shoupai = model.shoupai[menfeng].clone();
          let fubaopai = shoupai.lizhi ? model.shan.fubaopai : null;
          let param = {
            rule: this._rule,
            zhuangfeng: model.zhuangfeng,
            menfeng,
            hupai: {
              lizhi: this._lizhi[menfeng],
              yifa: this._yifa[menfeng],
              qianggang: this._hule_option == "qianggang",
              lingshang: this._hule_option == "lingshang",
              haidi: model.shan.paishu > 0 || this._hule_option == "lingshang" ? 0 : !rongpai ? 1 : 2,
              tianhu: !(this._diyizimo && !rongpai) ? 0 : menfeng == 0 ? 1 : 2
            },
            baopai: model.shan.baopai,
            fubaopai,
            jicun: {
              changbang: model.changbang,
              lizhibang: model.lizhibang
            }
          };
          let hule = Majiang.Util.hule(shoupai, rongpai, param);
          if (this._rule["\u9023\u8358\u65B9\u5F0F"] > 0 && menfeng == 0) this._lianzhuang = true;
          if (this._rule["\u5834\u6570"] == 0) this._lianzhuang = false;
          this._fenpei = hule.fenpei;
          let paipu = {
            hule: {
              l: menfeng,
              shoupai: rongpai ? shoupai.zimo(rongpai).toString() : shoupai.toString(),
              baojia: rongpai ? model.lunban : null,
              fubaopai,
              fu: hule.fu,
              fanshu: hule.fanshu,
              damanguan: hule.damanguan,
              defen: hule.defen,
              hupai: hule.hupai,
              fenpei: hule.fenpei
            }
          };
          for (let key of ["fu", "fanshu", "damanguan"]) {
            if (!paipu.hule[key]) delete paipu.hule[key];
          }
          this.add_paipu(paipu);
          let msg = [];
          for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
          }
          this.call_players("hule", msg, this._wait);
          if (this._view) this._view.update(paipu);
        }
        pingju(name, shoupai = ["", "", "", ""]) {
          let model = this._model;
          let fenpei = [0, 0, 0, 0];
          if (!name) {
            let n_tingpai = 0;
            for (let l = 0; l < 4; l++) {
              if (this._rule["\u30CE\u30FC\u30C6\u30F3\u5BA3\u8A00\u3042\u308A"] && !shoupai[l] && !model.shoupai[l].lizhi) continue;
              if (!this._rule["\u30CE\u30FC\u30C6\u30F3\u7F70\u3042\u308A"] && (this._rule["\u9023\u8358\u65B9\u5F0F"] != 2 || l != 0) && !model.shoupai[l].lizhi) {
                shoupai[l] = "";
              } else if (Majiang.Util.xiangting(model.shoupai[l]) == 0 && Majiang.Util.tingpai(model.shoupai[l]).length > 0) {
                n_tingpai++;
                shoupai[l] = model.shoupai[l].toString();
                if (this._rule["\u9023\u8358\u65B9\u5F0F"] == 2 && l == 0)
                  this._lianzhuang = true;
              } else {
                shoupai[l] = "";
              }
            }
            if (this._rule["\u6D41\u3057\u6E80\u8CAB\u3042\u308A"]) {
              for (let l = 0; l < 4; l++) {
                let all_yaojiu = true;
                for (let p of model.he[l]._pai) {
                  if (p.match(/[\+\=\-]$/)) {
                    all_yaojiu = false;
                    break;
                  }
                  if (p.match(/^z/)) continue;
                  if (p.match(/^[mps][19]/)) continue;
                  all_yaojiu = false;
                  break;
                }
                if (all_yaojiu) {
                  name = "\u6D41\u3057\u6E80\u8CAB";
                  for (let i = 0; i < 4; i++) {
                    fenpei[i] += l == 0 && i == l ? 12e3 : l == 0 ? -4e3 : l != 0 && i == l ? 8e3 : l != 0 && i == 0 ? -4e3 : -2e3;
                  }
                }
              }
            }
            if (!name) {
              name = "\u8352\u724C\u5E73\u5C40";
              if (this._rule["\u30CE\u30FC\u30C6\u30F3\u7F70\u3042\u308A"] && 0 < n_tingpai && n_tingpai < 4) {
                for (let l = 0; l < 4; l++) {
                  fenpei[l] = shoupai[l] ? 3e3 / n_tingpai : -3e3 / (4 - n_tingpai);
                }
              }
            }
            if (this._rule["\u9023\u8358\u65B9\u5F0F"] == 3) this._lianzhuang = true;
          } else {
            this._no_game = true;
            this._lianzhuang = true;
          }
          if (this._rule["\u5834\u6570"] == 0) this._lianzhuang = true;
          this._fenpei = fenpei;
          let paipu = {
            pingju: { name, shoupai, fenpei }
          };
          this.add_paipu(paipu);
          let msg = [];
          for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
          }
          this.call_players("pingju", msg, this._wait);
          if (this._view) this._view.update(paipu);
        }
        last() {
          let model = this._model;
          model.lunban = -1;
          if (this._view) this._view.update();
          if (!this._lianzhuang) {
            model.jushu++;
            model.zhuangfeng += model.jushu / 4 | 0;
            model.jushu = model.jushu % 4;
          }
          let jieju = false;
          let guanjun = -1;
          const defen = model.defen;
          for (let i = 0; i < 4; i++) {
            let id = (model.qijia + i) % 4;
            if (defen[id] < 0 && this._rule["\u30C8\u30D3\u7D42\u4E86\u3042\u308A"]) jieju = true;
            if (defen[id] >= 3e4 && (guanjun < 0 || defen[id] > defen[guanjun])) guanjun = id;
          }
          let sum_jushu = model.zhuangfeng * 4 + model.jushu;
          if (15 < sum_jushu) jieju = true;
          else if ((this._rule["\u5834\u6570"] + 1) * 4 - 1 < sum_jushu) jieju = true;
          else if (this._max_jushu < sum_jushu) {
            if (this._rule["\u5EF6\u9577\u6226\u65B9\u5F0F"] == 0) jieju = true;
            else if (this._rule["\u5834\u6570"] == 0) jieju = true;
            else if (guanjun >= 0) jieju = true;
            else {
              this._max_jushu += this._rule["\u5EF6\u9577\u6226\u65B9\u5F0F"] == 3 ? 4 : this._rule["\u5EF6\u9577\u6226\u65B9\u5F0F"] == 2 ? 1 : 0;
            }
          } else if (this._max_jushu == sum_jushu) {
            if (this._rule["\u30AA\u30FC\u30E9\u30B9\u6B62\u3081\u3042\u308A"] && guanjun == model.player_id[0] && this._lianzhuang && !this._no_game) jieju = true;
          }
          if (jieju) this.delay(() => this.jieju(), 0);
          else this.delay(() => this.qipai(), 0);
        }
        jieju() {
          let model = this._model;
          let paiming = [];
          const defen = model.defen;
          for (let i = 0; i < 4; i++) {
            let id = (model.qijia + i) % 4;
            for (let j = 0; j < 4; j++) {
              if (j == paiming.length || defen[id] > defen[paiming[j]]) {
                paiming.splice(j, 0, id);
                break;
              }
            }
          }
          defen[paiming[0]] += model.lizhibang * 1e3;
          this._paipu.defen = defen;
          let rank = [0, 0, 0, 0];
          for (let i = 0; i < 4; i++) {
            rank[paiming[i]] = i + 1;
          }
          this._paipu.rank = rank;
          const round = !this._rule["\u9806\u4F4D\u70B9"].find((p) => p.match(/\.\d$/));
          let point = [0, 0, 0, 0];
          for (let i = 1; i < 4; i++) {
            let id = paiming[i];
            point[id] = (defen[id] - 3e4) / 1e3 + +this._rule["\u9806\u4F4D\u70B9"][i];
            if (round) point[id] = Math.round(point[id]);
            point[paiming[0]] -= point[id];
          }
          this._paipu.point = point.map((p) => p.toFixed(round ? 0 : 1));
          let paipu = { jieju: this._paipu };
          let msg = [];
          for (let l = 0; l < 4; l++) {
            msg[l] = JSON.parse(JSON.stringify(paipu));
          }
          this.call_players("jieju", msg, this._wait);
          if (this._view) this._view.summary(this._paipu);
          if (this._handler) this._handler();
        }
        get_reply(l) {
          let model = this._model;
          return this._reply[model.player_id[l]];
        }
        reply_kaiju() {
          this.delay(() => this.qipai(), 0);
        }
        reply_qipai() {
          this.delay(() => this.zimo(), 0);
        }
        reply_zimo() {
          let model = this._model;
          let reply = this.get_reply(model.lunban);
          if (reply.daopai) {
            if (this.allow_pingju()) {
              let shoupai = ["", "", "", ""];
              shoupai[model.lunban] = model.shoupai[model.lunban].toString();
              return this.delay(() => this.pingju("\u4E5D\u7A2E\u4E5D\u724C", shoupai), 0);
            }
          } else if (reply.hule) {
            if (this.allow_hule()) {
              this.say("zimo", model.lunban);
              return this.delay(() => this.hule());
            }
          } else if (reply.gang) {
            if (this.get_gang_mianzi().find((m) => m == reply.gang)) {
              this.say("gang", model.lunban);
              return this.delay(() => this.gang(reply.gang));
            }
          } else if (reply.dapai) {
            let dapai = reply.dapai.replace(/\*$/, "");
            if (this.get_dapai().find((p2) => p2 == dapai)) {
              if (reply.dapai.slice(-1) == "*" && this.allow_lizhi(dapai)) {
                this.say("lizhi", model.lunban);
                return this.delay(() => this.dapai(reply.dapai));
              }
              return this.delay(() => this.dapai(dapai), 0);
            }
          }
          let p = this.get_dapai().pop();
          this.delay(() => this.dapai(p), 0);
        }
        reply_dapai() {
          let model = this._model;
          for (let i = 1; i < 4; i++) {
            let l2 = (model.lunban + i) % 4;
            let reply2 = this.get_reply(l2);
            if (reply2.hule && this.allow_hule(l2)) {
              if (this._rule["\u6700\u5927\u540C\u6642\u548C\u4E86\u6570"] == 1 && this._hule.length)
                continue;
              this.say("rong", l2);
              this._hule.push(l2);
            } else {
              let shoupai = model.shoupai[l2].clone().zimo(this._dapai);
              if (Majiang.Util.xiangting(shoupai) == -1)
                this._neng_rong[l2] = false;
            }
          }
          if (this._hule.length == 3 && this._rule["\u6700\u5927\u540C\u6642\u548C\u4E86\u6570"] == 2) {
            let shoupai = ["", "", "", ""];
            for (let l2 of this._hule) {
              shoupai[l2] = model.shoupai[l2].toString();
            }
            return this.delay(() => this.pingju("\u4E09\u5BB6\u548C", shoupai));
          } else if (this._hule.length) {
            return this.delay(() => this.hule());
          }
          if (this._dapai.slice(-1) == "*") {
            model.defen[model.player_id[model.lunban]] -= 1e3;
            model.lizhibang++;
            if (this._lizhi.filter((x) => x).length == 4 && this._rule["\u9014\u4E2D\u6D41\u5C40\u3042\u308A"]) {
              let shoupai = model.shoupai.map((s) => s.toString());
              return this.delay(() => this.pingju("\u56DB\u5BB6\u7ACB\u76F4", shoupai));
            }
          }
          if (this._diyizimo && model.lunban == 3) {
            this._diyizimo = false;
            if (this._fengpai) {
              return this.delay(() => this.pingju("\u56DB\u98A8\u9023\u6253"), 0);
            }
          }
          if (this._n_gang.reduce((x, y) => x + y) == 4) {
            if (Math.max(...this._n_gang) < 4 && this._rule["\u9014\u4E2D\u6D41\u5C40\u3042\u308A"]) {
              return this.delay(() => this.pingju("\u56DB\u958B\u69D3"), 0);
            }
          }
          if (!model.shan.paishu) {
            let shoupai = ["", "", "", ""];
            for (let l2 = 0; l2 < 4; l2++) {
              let reply2 = this.get_reply(l2);
              if (reply2.daopai) shoupai[l2] = reply2.daopai;
            }
            return this.delay(() => this.pingju("", shoupai), 0);
          }
          for (let i = 1; i < 4; i++) {
            let l2 = (model.lunban + i) % 4;
            let reply2 = this.get_reply(l2);
            if (reply2.fulou) {
              let m = reply2.fulou.replace(/0/g, "5");
              if (m.match(/^[mpsz](\d)\1\1\1/)) {
                if (this.get_gang_mianzi(l2).find((m2) => m2 == reply2.fulou)) {
                  this.say("gang", l2);
                  return this.delay(() => this.fulou(reply2.fulou));
                }
              } else if (m.match(/^[mpsz](\d)\1\1/)) {
                if (this.get_peng_mianzi(l2).find((m2) => m2 == reply2.fulou)) {
                  this.say("peng", l2);
                  return this.delay(() => this.fulou(reply2.fulou));
                }
              }
            }
          }
          let l = (model.lunban + 1) % 4;
          let reply = this.get_reply(l);
          if (reply.fulou) {
            if (this.get_chi_mianzi(l).find((m) => m == reply.fulou)) {
              this.say("chi", l);
              return this.delay(() => this.fulou(reply.fulou));
            }
          }
          this.delay(() => this.zimo(), 0);
        }
        reply_fulou() {
          let model = this._model;
          if (this._gang) {
            return this.delay(() => this.gangzimo(), 0);
          }
          let reply = this.get_reply(model.lunban);
          if (reply.dapai) {
            if (this.get_dapai().find((p2) => p2 == reply.dapai)) {
              return this.delay(() => this.dapai(reply.dapai), 0);
            }
          }
          let p = this.get_dapai().pop();
          this.delay(() => this.dapai(p), 0);
        }
        reply_gang() {
          let model = this._model;
          if (this._gang.match(/^[mpsz]\d{4}$/)) {
            return this.delay(() => this.gangzimo(), 0);
          }
          for (let i = 1; i < 4; i++) {
            let l = (model.lunban + i) % 4;
            let reply = this.get_reply(l);
            if (reply.hule && this.allow_hule(l)) {
              if (this._rule["\u6700\u5927\u540C\u6642\u548C\u4E86\u6570"] == 1 && this._hule.length)
                continue;
              this.say("rong", l);
              this._hule.push(l);
            } else {
              let p = this._gang[0] + this._gang.slice(-1);
              let shoupai = model.shoupai[l].clone().zimo(p);
              if (Majiang.Util.xiangting(shoupai) == -1)
                this._neng_rong[l] = false;
            }
          }
          if (this._hule.length) {
            return this.delay(() => this.hule());
          }
          this.delay(() => this.gangzimo(), 0);
        }
        reply_hule() {
          let model = this._model;
          for (let l = 0; l < 4; l++) {
            model.defen[model.player_id[l]] += this._fenpei[l];
          }
          model.changbang = 0;
          model.lizhibang = 0;
          if (this._hule.length) {
            return this.delay(() => this.hule());
          } else {
            if (this._lianzhuang) model.changbang = this._changbang + 1;
            return this.delay(() => this.last(), 0);
          }
        }
        reply_pingju() {
          let model = this._model;
          for (let l = 0; l < 4; l++) {
            model.defen[model.player_id[l]] += this._fenpei[l];
          }
          model.changbang++;
          this.delay(() => this.last(), 0);
        }
        get_dapai() {
          let model = this._model;
          return Game.get_dapai(this._rule, model.shoupai[model.lunban]);
        }
        get_chi_mianzi(l) {
          let model = this._model;
          let d = "_+=-"[(4 + model.lunban - l) % 4];
          return Game.get_chi_mianzi(
            this._rule,
            model.shoupai[l],
            this._dapai + d,
            model.shan.paishu
          );
        }
        get_peng_mianzi(l) {
          let model = this._model;
          let d = "_+=-"[(4 + model.lunban - l) % 4];
          return Game.get_peng_mianzi(
            this._rule,
            model.shoupai[l],
            this._dapai + d,
            model.shan.paishu
          );
        }
        get_gang_mianzi(l) {
          let model = this._model;
          if (l == null) {
            return Game.get_gang_mianzi(
              this._rule,
              model.shoupai[model.lunban],
              null,
              model.shan.paishu,
              this._n_gang.reduce((x, y) => x + y)
            );
          } else {
            let d = "_+=-"[(4 + model.lunban - l) % 4];
            return Game.get_gang_mianzi(
              this._rule,
              model.shoupai[l],
              this._dapai + d,
              model.shan.paishu,
              this._n_gang.reduce((x, y) => x + y)
            );
          }
        }
        allow_lizhi(p) {
          let model = this._model;
          return Game.allow_lizhi(
            this._rule,
            model.shoupai[model.lunban],
            p,
            model.shan.paishu,
            model.defen[model.player_id[model.lunban]]
          );
        }
        allow_hule(l) {
          let model = this._model;
          if (l == null) {
            let hupai = model.shoupai[model.lunban].lizhi || this._status == "gangzimo" || model.shan.paishu == 0;
            return Game.allow_hule(
              this._rule,
              model.shoupai[model.lunban],
              null,
              model.zhuangfeng,
              model.lunban,
              hupai
            );
          } else {
            let p = (this._status == "gang" ? this._gang[0] + this._gang.slice(-1) : this._dapai) + "_+=-"[(4 + model.lunban - l) % 4];
            let hupai = model.shoupai[l].lizhi || this._status == "gang" || model.shan.paishu == 0;
            return Game.allow_hule(
              this._rule,
              model.shoupai[l],
              p,
              model.zhuangfeng,
              l,
              hupai,
              this._neng_rong[l]
            );
          }
        }
        allow_pingju() {
          let model = this._model;
          return Game.allow_pingju(
            this._rule,
            model.shoupai[model.lunban],
            this._diyizimo
          );
        }
        static get_dapai(rule, shoupai) {
          if (rule["\u55B0\u3044\u66FF\u3048\u8A31\u53EF\u30EC\u30D9\u30EB"] == 0) return shoupai.get_dapai(true);
          if (rule["\u55B0\u3044\u66FF\u3048\u8A31\u53EF\u30EC\u30D9\u30EB"] == 1 && shoupai._zimo && shoupai._zimo.length > 2) {
            let deny = shoupai._zimo[0] + (+shoupai._zimo.match(/\d(?=[\+\=\-])/) || 5);
            return shoupai.get_dapai(false).filter((p) => p.replace(/0/, "5") != deny);
          }
          return shoupai.get_dapai(false);
        }
        static get_chi_mianzi(rule, shoupai, p, paishu) {
          let mianzi = shoupai.get_chi_mianzi(p, rule["\u55B0\u3044\u66FF\u3048\u8A31\u53EF\u30EC\u30D9\u30EB"] == 0);
          if (!mianzi) return mianzi;
          if (rule["\u55B0\u3044\u66FF\u3048\u8A31\u53EF\u30EC\u30D9\u30EB"] == 1 && shoupai._fulou.length == 3 && shoupai._bingpai[p[0]][p[1]] == 2) mianzi = [];
          return paishu == 0 ? [] : mianzi;
        }
        static get_peng_mianzi(rule, shoupai, p, paishu) {
          let mianzi = shoupai.get_peng_mianzi(p);
          if (!mianzi) return mianzi;
          return paishu == 0 ? [] : mianzi;
        }
        static get_gang_mianzi(rule, shoupai, p, paishu, n_gang) {
          let mianzi = shoupai.get_gang_mianzi(p);
          if (!mianzi || mianzi.length == 0) return mianzi;
          if (shoupai.lizhi) {
            if (rule["\u30EA\u30FC\u30C1\u5F8C\u6697\u69D3\u8A31\u53EF\u30EC\u30D9\u30EB"] == 0) return [];
            else if (rule["\u30EA\u30FC\u30C1\u5F8C\u6697\u69D3\u8A31\u53EF\u30EC\u30D9\u30EB"] == 1) {
              let new_shoupai, n_hule1 = 0, n_hule2 = 0;
              new_shoupai = shoupai.clone().dapai(shoupai._zimo);
              for (let p2 of Majiang.Util.tingpai(new_shoupai)) {
                n_hule1 += Majiang.Util.hule_mianzi(new_shoupai, p2).length;
              }
              new_shoupai = shoupai.clone().gang(mianzi[0]);
              for (let p2 of Majiang.Util.tingpai(new_shoupai)) {
                n_hule2 += Majiang.Util.hule_mianzi(new_shoupai, p2).length;
              }
              if (n_hule1 > n_hule2) return [];
            } else {
              let new_shoupai;
              new_shoupai = shoupai.clone().dapai(shoupai._zimo);
              let n_tingpai1 = Majiang.Util.tingpai(new_shoupai).length;
              new_shoupai = shoupai.clone().gang(mianzi[0]);
              if (Majiang.Util.xiangting(new_shoupai) > 0) return [];
              let n_tingpai2 = Majiang.Util.tingpai(new_shoupai).length;
              if (n_tingpai1 > n_tingpai2) return [];
            }
          }
          return paishu == 0 || n_gang == 4 ? [] : mianzi;
        }
        static allow_lizhi(rule, shoupai, p, paishu, defen) {
          if (!shoupai._zimo) return false;
          if (shoupai.lizhi) return false;
          if (!shoupai.menqian) return false;
          if (!rule["\u30C4\u30E2\u756A\u306A\u3057\u30EA\u30FC\u30C1\u3042\u308A"] && paishu < 4) return false;
          if (rule["\u30C8\u30D3\u7D42\u4E86\u3042\u308A"] && defen < 1e3) return false;
          if (Majiang.Util.xiangting(shoupai) > 0) return false;
          if (p) {
            let new_shoupai = shoupai.clone().dapai(p);
            return Majiang.Util.xiangting(new_shoupai) == 0 && Majiang.Util.tingpai(new_shoupai).length > 0;
          } else {
            let dapai = [];
            for (let p2 of Game.get_dapai(rule, shoupai)) {
              let new_shoupai = shoupai.clone().dapai(p2);
              if (Majiang.Util.xiangting(new_shoupai) == 0 && Majiang.Util.tingpai(new_shoupai).length > 0) {
                dapai.push(p2);
              }
            }
            return dapai.length ? dapai : false;
          }
        }
        static allow_hule(rule, shoupai, p, zhuangfeng, menfeng, hupai, neng_rong) {
          if (p && !neng_rong) return false;
          let new_shoupai = shoupai.clone();
          if (p) new_shoupai.zimo(p);
          if (Majiang.Util.xiangting(new_shoupai) != -1) return false;
          if (hupai) return true;
          let param = {
            rule,
            zhuangfeng,
            menfeng,
            hupai: {},
            baopai: [],
            jicun: { changbang: 0, lizhibang: 0 }
          };
          let hule = Majiang.Util.hule(shoupai, p, param);
          return hule.hupai != null;
        }
        static allow_pingju(rule, shoupai, diyizimo) {
          if (!(diyizimo && shoupai._zimo)) return false;
          if (!rule["\u9014\u4E2D\u6D41\u5C40\u3042\u308A"]) return false;
          let n_yaojiu = 0;
          for (let s of ["m", "p", "s", "z"]) {
            let bingpai = shoupai._bingpai[s];
            let nn = s == "z" ? [1, 2, 3, 4, 5, 6, 7] : [1, 9];
            for (let n of nn) {
              if (bingpai[n] > 0) n_yaojiu++;
            }
          }
          return n_yaojiu >= 9;
        }
        static allow_no_daopai(rule, shoupai, paishu) {
          if (paishu > 0 || shoupai._zimo) return false;
          if (!rule["\u30CE\u30FC\u30C6\u30F3\u5BA3\u8A00\u3042\u308A"]) return false;
          if (shoupai.lizhi) return false;
          return Majiang.Util.xiangting(shoupai) == 0 && Majiang.Util.tingpai(shoupai).length > 0;
        }
      };
    }
  });

  // node_modules/@kobalab/majiang-core/lib/player.js
  var require_player = __commonJS({
    "node_modules/@kobalab/majiang-core/lib/player.js"(exports, module) {
      "use strict";
      var Majiang = {
        Shoupai: require_shoupai(),
        He: require_he(),
        Game: require_game(),
        Board: require_board(),
        Util: Object.assign(
          require_xiangting(),
          require_hule()
        )
      };
      module.exports = class Player {
        constructor() {
          this._model = new Majiang.Board();
        }
        action(msg, callback) {
          this._callback = callback;
          if (msg.kaiju) this.kaiju(msg.kaiju);
          else if (msg.qipai) this.qipai(msg.qipai);
          else if (msg.zimo) this.zimo(msg.zimo);
          else if (msg.dapai) this.dapai(msg.dapai);
          else if (msg.fulou) this.fulou(msg.fulou);
          else if (msg.gang) this.gang(msg.gang);
          else if (msg.gangzimo) this.zimo(msg.gangzimo, true);
          else if (msg.kaigang) this.kaigang(msg.kaigang);
          else if (msg.hule) this.hule(msg.hule);
          else if (msg.pingju) this.pingju(msg.pingju);
          else if (msg.jieju) this.jieju(msg.jieju);
        }
        get shoupai() {
          return this._model.shoupai[this._menfeng];
        }
        get he() {
          return this._model.he[this._menfeng];
        }
        get shan() {
          return this._model.shan;
        }
        get hulepai() {
          return Majiang.Util.xiangting(this.shoupai) == 0 && Majiang.Util.tingpai(this.shoupai) || [];
        }
        get model() {
          return this._model;
        }
        set view(view) {
          this._view = view;
        }
        get view() {
          return this._view;
        }
        kaiju(kaiju) {
          this._id = kaiju.id;
          this._rule = kaiju.rule;
          this._model.kaiju(kaiju);
          if (this._view) this._view.kaiju(kaiju.id);
          if (this._callback) this.action_kaiju(kaiju);
        }
        qipai(qipai) {
          this._model.qipai(qipai);
          this._menfeng = this._model.menfeng(this._id);
          this._diyizimo = true;
          this._n_gang = 0;
          this._neng_rong = true;
          if (this._view) this._view.redraw();
          if (this._callback) this.action_qipai(qipai);
        }
        zimo(zimo, gangzimo) {
          this._model.zimo(zimo);
          if (gangzimo) this._n_gang++;
          if (this._view) {
            if (gangzimo) this._view.update({ gangzimo: zimo });
            else this._view.update({ zimo });
          }
          if (this._callback) this.action_zimo(zimo, gangzimo);
        }
        dapai(dapai) {
          if (dapai.l == this._menfeng) {
            if (!this.shoupai.lizhi) this._neng_rong = true;
          }
          this._model.dapai(dapai);
          if (this._view) this._view.update({ dapai });
          if (this._callback) this.action_dapai(dapai);
          if (dapai.l == this._menfeng) {
            this._diyizimo = false;
            if (this.hulepai.find((p) => this.he.find(p))) this._neng_rong = false;
          } else {
            let s = dapai.p[0], n = +dapai.p[1] || 5;
            if (this.hulepai.find((p) => p == s + n)) this._neng_rong = false;
          }
        }
        fulou(fulou) {
          this._model.fulou(fulou);
          if (this._view) this._view.update({ fulou });
          if (this._callback) this.action_fulou(fulou);
          this._diyizimo = false;
        }
        gang(gang) {
          this._model.gang(gang);
          if (this._view) this._view.update({ gang });
          if (this._callback) this.action_gang(gang);
          this._diyizimo = false;
          if (gang.l != this._menfeng && !gang.m.match(/^[mpsz]\d{4}$/)) {
            let s = gang.m[0], n = +gang.m.slice(-1) || 5;
            if (this.hulepai.find((p) => p == s + n)) this._neng_rong = false;
          }
        }
        kaigang(kaigang) {
          this._model.kaigang(kaigang);
          if (this._view) this._view.update({ kaigang });
        }
        hule(hule) {
          this._model.hule(hule);
          if (this._view) this._view.update({ hule });
          if (this._callback) this.action_hule(hule);
        }
        pingju(pingju) {
          this._model.pingju(pingju);
          if (this._view) this._view.update({ pingju });
          if (this._callback) this.action_pingju(pingju);
        }
        jieju(paipu) {
          this._model.jieju(paipu);
          this._paipu = paipu;
          if (this._view) this._view.summary(paipu);
          if (this._callback) this.action_jieju(paipu);
        }
        get_dapai(shoupai) {
          return Majiang.Game.get_dapai(this._rule, shoupai);
        }
        get_chi_mianzi(shoupai, p) {
          return Majiang.Game.get_chi_mianzi(
            this._rule,
            shoupai,
            p,
            this.shan.paishu
          );
        }
        get_peng_mianzi(shoupai, p) {
          return Majiang.Game.get_peng_mianzi(
            this._rule,
            shoupai,
            p,
            this.shan.paishu
          );
        }
        get_gang_mianzi(shoupai, p) {
          return Majiang.Game.get_gang_mianzi(
            this._rule,
            shoupai,
            p,
            this.shan.paishu,
            this._n_gang
          );
        }
        allow_lizhi(shoupai, p) {
          return Majiang.Game.allow_lizhi(
            this._rule,
            shoupai,
            p,
            this.shan.paishu,
            this._model.defen[this._id]
          );
        }
        allow_hule(shoupai, p, hupai) {
          hupai = hupai || shoupai.lizhi || this.shan.paishu == 0;
          return Majiang.Game.allow_hule(
            this._rule,
            shoupai,
            p,
            this._model.zhuangfeng,
            this._menfeng,
            hupai,
            this._neng_rong
          );
        }
        allow_pingju(shoupai) {
          return Majiang.Game.allow_pingju(
            this._rule,
            shoupai,
            this._diyizimo
          );
        }
        allow_no_daopai(shoupai) {
          return Majiang.Game.allow_no_daopai(
            this._rule,
            shoupai,
            this.shan.paishu
          );
        }
      };
    }
  });

  // node_modules/@kobalab/majiang-core/lib/index.js
  var require_lib = __commonJS({
    "node_modules/@kobalab/majiang-core/lib/index.js"(exports, module) {
      "use strict";
      module.exports = {
        rule: require_rule(),
        Shoupai: require_shoupai(),
        Shan: require_shan(),
        He: require_he(),
        Board: require_board(),
        Game: require_game(),
        Player: require_player(),
        Util: Object.assign(
          require_xiangting(),
          require_hule()
        )
      };
    }
  });

  // src/engine.js
  var require_engine = __commonJS({
    "src/engine.js"(exports, module) {
      "use strict";
      var Majiang = require_lib();
      var RULE = Majiang.rule({ "\u5834\u6570": 1, "\u8D64\u724C": { m: 1, p: 1, s: 1 }, "\u30AB\u30F3\u30C9\u30E9\u5F8C\u4E57\u305B": false });
      var CHARACTERS = ["\u59AE\u53EF", "\u6BD4\u5229", "\u96C5", "\u827E\u83B2"];
      var WINDS = ["\u4E1C", "\u5357", "\u897F", "\u5317"];
      function handTiles(hand) {
        const result = [];
        for (const match of hand.toString().split(",")[0].matchAll(/([mpsz])(\d+)/g)) for (const n of match[2]) result.push(match[1] + n);
        return result;
      }
      function tileId(p) {
        if (p[1] === "0") return 34 + "mps".indexOf(p[0]);
        return p[0] === "z" ? 26 + Number(p[1]) : "mps".indexOf(p[0]) * 9 + Number(p[1]) - 1;
      }
      function tileFile(p) {
        const id = typeof p === "number" ? p : tileId(p);
        return id < 27 ? ["man", "pin", "sou"][Math.floor(id / 9)] + "-" + (id % 9 + 1) : id < 34 ? ["east", "south", "west", "north", "white", "green", "red"][id - 27] : ["man", "pin", "sou"][id - 34] + "-red-5";
      }
      function meldKind(m) {
        return (m.match(/\d/g) || []).length === 4 ? "kan" : new Set(m.match(/\d/g).map((n) => n === "0" ? "5" : n)).size === 1 ? "pon" : "chi";
      }
      function meldTiles(m) {
        return [...m.matchAll(/(\d)([+=-]?)/g)].map((x) => ({ p: m[0] + x[1], called: !!x[2] }));
      }
      function turnChoices(player, gangzimo = false) {
        return { type: "turn", discards: player.get_dapai(player.shoupai) || [], riichi: player.allow_lizhi(player.shoupai) || [], kan: player.get_gang_mianzi(player.shoupai) || [], win: !!player.allow_hule(player.shoupai, null, gangzimo), abort: player.allow_pingju(player.shoupai) };
      }
      function responseChoices(player, event, rob = false) {
        const d = ["", "+", "=", "-"][(4 + event.l - player._menfeng) % 4];
        const p = (rob ? event.m[0] + event.m.slice(-1) : event.p.slice(0, 2)) + d;
        if (rob && /^[mpsz]\d{4}$/.test(event.m)) return { type: "response", calls: [], win: false };
        return { type: "response", from: event.l, tile: p, rob, win: !!player.allow_hule(player.shoupai, p, rob), calls: rob ? [] : [...player.get_gang_mianzi(player.shoupai, p) || [], ...player.get_peng_mianzi(player.shoupai, p) || [], ...player.get_chi_mianzi(player.shoupai, p) || []] };
      }
      var HumanPlayer = class extends Majiang.Player {
        constructor(onDecision) {
          super();
          this.onDecision = onDecision;
        }
        decide(options) {
          const cb = this._callback;
          this.onDecision(options, (reply) => cb(reply));
        }
        action_kaiju() {
          this._callback();
        }
        action_qipai() {
          this._callback();
        }
        action_zimo(event, gangzimo) {
          if (event.l !== this._menfeng) return this._callback();
          this.decide(turnChoices(this, gangzimo));
        }
        action_dapai(event) {
          if (event.l === this._menfeng) return this._callback();
          const options = responseChoices(this, event);
          if (options.win || options.calls.length) this.decide(options);
          else this._callback();
        }
        action_fulou(event) {
          if (event.l !== this._menfeng || meldKind(event.m) === "kan") return this._callback();
          this.decide({ type: "turn", discards: this.get_dapai(this.shoupai) || [], riichi: [], kan: [], win: false, abort: false });
        }
        action_gang(event) {
          if (event.l === this._menfeng) return this._callback();
          const options = responseChoices(this, event, true);
          if (options.win) this.decide(options);
          else this._callback();
        }
        action_hule(result) {
          this.decide({ type: "result", result });
        }
        action_pingju(result) {
          this.decide({ type: "draw", result });
        }
        action_jieju(result) {
          this.decide({ type: "match", result });
        }
      };
      var Match = class extends Majiang.Game {
        constructor(...args) {
          super(...args);
          this.active = true;
          this.scheduled = /* @__PURE__ */ new Set();
        }
        reply(id, reply) {
          if (!this.active) return;
          this._reply[id] = reply || {};
          if (this._reply.filter(Boolean).length === 4 && !this._timeout_id) this._timeout_id = this.schedule(() => this.next());
        }
        next() {
          if (!this.active) return;
          return super.next();
        }
        schedule(fn, ms = 0) {
          const id = setTimeout(() => {
            this.scheduled.delete(id);
            if (this.active) fn();
          }, ms);
          this.scheduled.add(id);
          return id;
        }
        delay(fn, timeout) {
          if (this._sync) return fn();
          this.schedule(fn, this._dwell === 0 ? 0 : timeout == null ? Math.max(500, this._dwell) : timeout);
        }
        call_players(type, msg, timeout) {
          this._status = type;
          this._reply = [];
          for (let l = 0; l < 4; l++) {
            const id = this.model.player_id[l];
            this.schedule(() => this._players[id].action(msg[l], (reply) => {
              if (this.active) this.reply(id, reply);
            }));
          }
          this._timeout_id = this.schedule(() => this.next(), this._dwell === 0 ? 0 : timeout ?? this._dwell);
        }
        notify_players(type, msg) {
          for (let l = 0; l < 4; l++) {
            const id = this.model.player_id[l];
            this.schedule(() => this._players[id].action(msg[l]));
          }
        }
        dispose() {
          this.active = false;
          clearTimeout(this._timeout_id);
          for (const id of this.scheduled) clearTimeout(id);
          this.scheduled.clear();
          this._players.forEach((p) => p.dispose?.());
        }
      };
      module.exports = { Majiang, RULE, CHARACTERS, WINDS, handTiles, tileId, tileFile, meldKind, meldTiles, turnChoices, responseChoices, HumanPlayer, Match };
    }
  });

  // src/scene-resources.js
  var require_scene_resources = __commonJS({
    "src/scene-resources.js"(exports, module) {
      "use strict";
      var THEMES = { nicole: { floor: "floor-expanded.png", wide: "floor-layer.png", table: "table-layer.png" }, billy: { floor: "themes/billy-floor.png", table: "themes/billy-table.png" }, miyabi: { floor: "themes/miyabi-floor.png", table: "themes/miyabi-table.png" }, ellen: { floor: "themes/ellen-floor.png", table: "themes/ellen-table.png" } };
      function initSceneResources() {
        const floorSelect = document.getElementById("floor-theme"), tableSelect = document.getElementById("table-theme"), status = document.getElementById("scene-resource-status");
        const state = { floor: "nicole", table: "nicole" };
        try {
          const saved = JSON.parse(localStorage.getItem("riichi-scene") || "{}");
          for (const key of ["floor", "table"]) if (THEMES[saved[key]]) state[key] = saved[key];
        } catch {
        }
        const versions = { floor: 0, table: 0 };
        function floorPath() {
          const theme = THEMES[state.floor];
          return theme.wide && innerWidth / innerHeight >= 2 / 3 ? theme.wide : theme.floor;
        }
        let lastFloor = "";
        function fitGround() {
          const path = floorPath();
          if (path !== lastFloor) {
            document.body.style.setProperty("--floor-image", `url("${path}")`);
            lastFloor = path;
          }
        }
        async function select(kind, value, save = true) {
          const serial = ++versions[kind];
          const previous = state[kind], entry = THEMES[value];
          if (!entry) return;
          const path = kind === "table" ? entry.table : entry.wide && innerWidth / innerHeight >= 2 / 3 ? entry.wide : entry.floor;
          const image = new Image();
          image.src = path;
          try {
            await image.decode();
            if (serial !== versions[kind]) return;
            state[kind] = value;
            if (kind === "table") document.querySelector(".table-layer").src = path;
            else fitGround();
            status.textContent = "";
            if (save) try {
              localStorage.setItem("riichi-scene", JSON.stringify(state));
            } catch {
            }
          } catch {
            if (serial !== versions[kind]) return;
            (kind === "floor" ? floorSelect : tableSelect).value = previous;
            status.textContent = "\u7D20\u6750\u8F7D\u5165\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002";
          }
        }
        floorSelect.value = state.floor;
        tableSelect.value = state.table;
        fitGround();
        select("table", state.table, false);
        floorSelect.addEventListener("change", () => select("floor", floorSelect.value));
        tableSelect.addEventListener("change", () => select("table", tableSelect.value));
        window.addEventListener("resize", fitGround);
      }
      module.exports = { initSceneResources };
    }
  });

  // src/i18n.js
  var require_i18n = __commonJS({
    "src/i18n.js"(exports, module) {
      "use strict";
      var copy = [
        ["\u56DB\u4EBA\u5404 25,000 \u70B9\u3002\u5E84\u5BB6\u968F\u673A\uFF0C\u6309\u4E1C\u4E00\u81F3\u4E1C\u56DB\u63A8\u8FDB\uFF1B\u5E84\u5BB6\u548C\u724C\u6216\u542C\u724C\u8FDE\u5E84\u3002\u65E0\u4EBA\u8FBE\u5230 30,000 \u70B9\u65F6\u8FDB\u5165\u5357\u5165\u5EF6\u957F\uFF1B\u98DE\u4EBA\u7ED3\u675F\u3002", "Each player starts with 25,000 points. A random dealer starts East 1\u20134. The dealer repeats after winning or a tenpai draw. Play extends into South if nobody reaches 30,000; bankruptcy ends the match.", "\u5404\u5BB625,000\u70B9\u6301\u3061\u3002\u8D77\u5BB6\u306F\u30E9\u30F3\u30C0\u30E0\u3067\u67711\u301C4\u5C40\u3092\u9032\u884C\u3002\u89AA\u306E\u548C\u4E86\u30FB\u8074\u724C\u3067\u9023\u8358\u300230,000\u70B9\u672A\u6E80\u306A\u3089\u5357\u5165\u3001\u30C8\u30D3\u3067\u7D42\u4E86\u3002"],
        ["\u5403\u4EC5\u9650\u4E0A\u5BB6\uFF1B\u78B0\u3001\u660E\u6760\u53EF\u63A5\u4EFB\u610F\u5BF9\u624B\u3002\u8363\u548C\u4F18\u5148\u4E8E\u78B0\u6760\uFF0C\u78B0\u6760\u4F18\u5148\u4E8E\u5403\u3002\u7981\u6B62\u98DF\u66FF\u3002", "Chi is only from the player on your left. Pon and open Kan can use any opponent\u2019s discard. Ron takes priority over Pon/Kan, then Chi. Kuikae is prohibited.", "\u30C1\u30FC\u306F\u4E0A\u5BB6\u304B\u3089\u306E\u307F\u3002\u30DD\u30F3\u30FB\u5927\u660E\u69D3\u306F\u5168\u54E1\u304B\u3089\u53EF\u80FD\u3002\u30ED\u30F3\u3001\u30DD\u30F3\u30FB\u30AB\u30F3\u3001\u30C1\u30FC\u306E\u9806\u306B\u512A\u5148\u3002\u55B0\u3044\u66FF\u3048\u306F\u7981\u6B62\u3002"],
        ["\u6697\u6760\u3001\u52A0\u6760\u3001\u660E\u6760\u540E\u6478\u5CAD\u4E0A\u724C\u5E76\u7FFB\u6760\u5B9D\u724C\u3002\u52A0\u6760\u53EF\u88AB\u62A2\u6760\uFF0C\u56DB\u6760\u6563\u4E86\u9664\u5355\u4EBA\u56DB\u6760\u3002", "All Kans draw a replacement tile and reveal Kan dora. Added Kan can be robbed. Four Kans abort the hand unless all belong to one player.", "\u69D3\u306E\u5F8C\u306F\u5DBA\u4E0A\u724C\u3092\u5F15\u304D\u3001\u69D3\u30C9\u30E9\u3092\u8868\u793A\u3002\u52A0\u69D3\u306B\u306F\u69CD\u69D3\u304C\u53EF\u80FD\u3002\u56DB\u69D3\u6563\u4E86\u3042\u308A\uFF081\u4EBA\u306E\u56DB\u69D3\u3092\u9664\u304F\uFF09\u3002"],
        ["\u548C\u724C\u5FC5\u987B\u6709\u5F79\u3002\u652F\u6301\u81EA\u6478\u3001\u8363\u548C\u3001\u632F\u542C\u3001\u540C\u5DE1\u632F\u542C\u3001\u7ACB\u76F4\u632F\u542C\uFF0C\u4EE5\u53CA\u6807\u51C6\u5F79\u79CD\u4E0E\u7B26\u756A\u8BA1\u5206\u3002", "A winning hand needs a yaku. Tsumo, Ron, furiten, temporary furiten, riichi furiten, standard yaku and fu/han scoring are supported.", "\u548C\u4E86\u306B\u306F\u5F79\u304C\u5FC5\u8981\u3002\u30C4\u30E2\u30FB\u30ED\u30F3\u30FB\u632F\u8074\u30FB\u540C\u5DE1\u632F\u8074\u30FB\u7ACB\u76F4\u5F8C\u306E\u632F\u8074\u3068\u3001\u6A19\u6E96\u306E\u5F79\u30FB\u7B26\u7FFB\u8A08\u7B97\u306B\u5BFE\u5FDC\u3002"],
        ["\u95E8\u524D\u542C\u724C\u53EF\u4ED8 1,000 \u70B9\u7ACB\u76F4\u3002\u652F\u6301\u4E00\u53D1\u3001\u53CC\u7ACB\u76F4\u3001\u8D64\u5B9D\u724C\u3001\u91CC\u5B9D\u724C\u3001\u6760\u5B9D\u724C\uFF1B\u7ACB\u76F4\u540E\u4EC5\u5141\u8BB8\u4E0D\u6539\u53D8\u542C\u724C\u7684\u6697\u6760\u3002", "A closed tenpai hand may declare Riichi for 1,000 points. Ippatsu, double Riichi, red/ura/Kan dora apply. After Riichi, a concealed Kan must preserve the wait.", "\u9580\u524D\u8074\u724C\u30671,000\u70B9\u3092\u4F9B\u8A17\u3057\u3066\u7ACB\u76F4\u3002\u4E00\u767A\u30FB\u30C0\u30D6\u30EB\u7ACB\u76F4\u30FB\u8D64\u30C9\u30E9\u30FB\u88CF\u30C9\u30E9\u30FB\u69D3\u30C9\u30E9\u3042\u308A\u3002\u7ACB\u76F4\u5F8C\u306E\u6697\u69D3\u306F\u5F85\u3061\u304C\u5909\u308F\u3089\u306A\u3044\u5834\u5408\u306E\u307F\u3002"],
        ["\u53CC\u54CD\u6709\u6548\uFF0C\u4E09\u5BB6\u548C\u6D41\u5C40\u3002\u6D41\u5C40\u542C\u724C\u7F5A\u7B26 3,000 \u70B9\uFF0C\u4F9B\u6258\u4E0E\u672C\u573A\u6309\u89C4\u5219\u5EF6\u7EED\u3002", "Double Ron is allowed; triple Ron aborts the hand. Exhaustive draws use a 3,000-point tenpai payment. Deposits and repeats carry over according to the rules.", "\u30C0\u30D6\u30ED\u30F3\u3042\u308A\u3001\u4E09\u5BB6\u548C\u306F\u6D41\u5C40\u3002\u6D41\u5C40\u6642\u306E\u30CE\u30FC\u30C6\u30F3\u7F70\u7B26\u306F3,000\u70B9\u3002\u4F9B\u8A17\u30FB\u672C\u5834\u306F\u30EB\u30FC\u30EB\u306B\u5F93\u3063\u3066\u6301\u3061\u8D8A\u3057\u3002"],
        ["\u89D2\u8272\u4F4D\u7F6E\u4FDD\u6301\u4E0D\u53D8\uFF1B\u4E1C\u5357\u897F\u5317\u8EAB\u4EFD\u968F\u5E84\u5BB6\u8F6E\u6362\u3002\u7ED3\u7B97\u9700\u786E\u8BA4\u540E\u8FDB\u5165\u4E0B\u4E00\u5C40\u3002", "Characters keep their seats; seat winds rotate with the dealer. Confirm the result to start the next hand.", "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u306E\u4F4D\u7F6E\u306F\u56FA\u5B9A\u3067\u3001\u98A8\u306F\u89AA\u3068\u3068\u3082\u306B\u4EA4\u4EE3\u3002\u7CBE\u7B97\u3092\u78BA\u8A8D\u3059\u308B\u3068\u6B21\u5C40\u3078\u9032\u307F\u307E\u3059\u3002"],
        ["\u5F53\u524D\u70B9\u6570\u548C\u672C\u573A\u8FDB\u5EA6\u4F1A\u91CD\u7F6E\uFF0C\u56DB\u4EBA\u4ECE 25,000 \u70B9\u5F00\u59CB\u3002", "Scores and repeats will reset. Everyone starts with 25,000 points.", "\u70B9\u6570\u3068\u672C\u5834\u3092\u30EA\u30BB\u30C3\u30C8\u3057\u3001\u5168\u54E125,000\u70B9\u304B\u3089\u958B\u59CB\u3057\u307E\u3059\u3002"],
        ["\u672C\u724C\u5C40\u76F4\u63A5\u4F7F\u7528\u8FD9\u4E9B PNG\uFF1B\u6BCF\u95E8\u4E00\u5F20\u7EA2\u4E94\uFF0C\u8BA1\u5165\u8D64\u5B9D\u724C\u3002", "These tiles are used in play. Each suit has one red five, counted as red dora.", "\u5BFE\u5C40\u3067\u4F7F\u7528\u3059\u308B\u724C\u3067\u3059\u3002\u5404\u8272\u306B\u8D645\u304C1\u679A\u3042\u308A\u3001\u8D64\u30C9\u30E9\u3068\u3057\u3066\u6570\u3048\u307E\u3059\u3002"],
        ["\u4E0A\u5BB6\u5F03\u724C\u53EF\u7EC4\u6210\u987A\u5B50\u65F6\u53EF\u5403", "Chi is available when the left player\u2019s discard completes a sequence.", "\u4E0A\u5BB6\u306E\u6368\u3066\u724C\u3067\u9806\u5B50\u3092\u4F5C\u308C\u308B\u3068\u304D\u306B\u30C1\u30FC\u3067\u304D\u307E\u3059"],
        ["\u5BF9\u624B\u5F03\u724C\u4E0E\u4F60\u7684\u5BF9\u5B50\u76F8\u540C\u65F6\u53EF\u78B0", "Pon is available when a discard matches your pair.", "\u5BFE\u5B50\u3068\u540C\u3058\u724C\u304C\u6368\u3066\u3089\u308C\u305F\u3068\u304D\u306B\u30DD\u30F3\u3067\u304D\u307E\u3059"],
        ["\u6301\u6709\u56DB\u5F20\u540C\u724C\u6216\u53EF\u52A0\u6760\u65F6\u5F00\u653E", "Kan is available with four identical tiles or an added Kan.", "\u540C\u3058\u724C\u304C4\u679A\u3042\u308B\u3068\u304D\u3001\u307E\u305F\u306F\u52A0\u69D3\u3067\u304D\u308B\u3068\u304D\u306B\u9078\u3079\u307E\u3059"],
        ["\u8363\u548C\u4F18\u5148\uFF1B\u8DF3\u8FC7\u8363\u548C\u4F1A\u8FDB\u5165\u632F\u542C", "Ron has priority. Passing Ron causes furiten.", "\u30ED\u30F3\u304C\u512A\u5148\u3002\u30ED\u30F3\u3092\u898B\u9001\u308B\u3068\u632F\u8074\u306B\u306A\u308A\u307E\u3059"],
        ["\u5207\u51FA\u9AD8\u4EAE\u724C\u5E76\u652F\u4ED8 1,000 \u70B9", "Discard a highlighted tile and pay 1,000 points.", "\u9078\u629E\u53EF\u80FD\u306A\u724C\u3092\u5207\u308A\u30011,000\u70B9\u3092\u4F9B\u8A17\u3057\u307E\u3059"],
        ["\u7ACB\u76F4\u540E\u53EA\u53EF\u6478\u5207\u3001\u5408\u6CD5\u6697\u6760\u6216\u548C\u724C", "After Riichi: discard the drawn tile, make a legal concealed Kan, or win.", "\u7ACB\u76F4\u5F8C\u306F\u30C4\u30E2\u5207\u308A\u30FB\u5408\u6CD5\u306A\u6697\u69D3\u30FB\u548C\u4E86\u306E\u307F"],
        ["\u724C\u5F62\u5B8C\u6210\uFF0C\u987B\u6709\u5F79\u624D\u80FD\u548C\u724C", "Complete shape \u2014 a yaku is required to win.", "\u548C\u4E86\u5F62\u3067\u3059\u3002\u548C\u4E86\u306B\u306F\u5F79\u304C\u5FC5\u8981\u3067\u3059"],
        ["\u7535\u8111\u8BA1\u7B97\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u65B0\u5F00\u59CB\u5BF9\u5C40\u3002", "AI interrupted. Please start a new match.", "AI\u304C\u505C\u6B62\u3057\u307E\u3057\u305F\u3002\u5BFE\u5C40\u3092\u518D\u958B\u3057\u3066\u304F\u3060\u3055\u3044\u3002"],
        ["\u7535\u8111\u8F7D\u5165\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u540E\u91CD\u8BD5\u3002", "AI could not load. Please reload the page.", "AI\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u3066\u304F\u3060\u3055\u3044\u3002"],
        ["\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u5168\u5C4F", "Fullscreen unavailable in this browser", "\u3053\u306E\u30D6\u30E9\u30A6\u30B6\u3067\u306F\u5168\u753B\u9762\u306B\u975E\u5BFE\u5FDC"],
        ["\u70B9\u51FB\u90A6\u5E03\u5C55\u5F00\u724C\u5C40\u4FE1\u606F", "Tap Bangboo for round details", "\u30DC\u30F3\u30D7\u3092\u30BF\u30C3\u30D7\u3057\u3066\u5C40\u60C5\u5831\u3092\u8868\u793A"],
        ["\u67E5\u770B\u7ACB\u7ED8\u4E0E\u7ED3\u7B97 \u2197", "View results \u2197", "\u7CBE\u7B97\u3092\u898B\u308B \u2197"],
        ["\u786E\u8BA4\u7ED3\u7B97 \xB7 \u7EE7\u7EED", "Continue", "\u78BA\u8A8D\u3057\u3066\u6B21\u3078"],
        ["\u56DB\u4EBA\u7ACB\u76F4\u9EBB\u5C06 \xB7 \u4E1C\u98CE\u6218", "Four-player Riichi \xB7 East match", "\u56DB\u4EBA\u30EA\u30FC\u30C1\u9EBB\u96C0\u30FB\u6771\u98A8\u6226"],
        ["\u4E1C\u98CE\u6218 \xB7 \u7EC8\u5C40", "Final standings", "\u6771\u98A8\u6226\u30FB\u6700\u7D42\u7D50\u679C"],
        ["\u91CD\u65B0\u5F00\u59CB\u4E1C\u98CE\u6218\uFF1F", "Start a new match?", "\u5BFE\u5C40\u3092\u3084\u308A\u76F4\u3057\u307E\u3059\u304B\uFF1F"],
        ["\u65B0\u827E\u5229\u90FD \xB7 37 \u5F20\u7279\u8272\u724C", "New Eridu \xB7 37 tile designs", "\u65B0\u30A8\u30EA\u30FC\u90FD\u30FB37\u7A2E\u306E\u724C"],
        ["\u90A6\u5E03\u64AD\u62A5 \xB7 \u6771\u98A8\u6226", "Bangboo \xB7 East match", "\u30DC\u30F3\u30D7\u901A\u4FE1\u30FB\u6771\u98A8\u6226"],
        ["\u4E1C\u98CE\u6218 \xB7 25,000 \u70B9\u8D77\u59CB", "East match \xB7 25,000 starting points", "\u6771\u98A8\u6226\u30FB25,000\u70B9\u6301\u3061"],
        ["\u5DF2\u7ACB\u76F4 \xB7 \u6478\u5207\uFF0F\u81EA\u6478", "Riichi \xB7 Draw discard / Tsumo", "\u7ACB\u76F4\u4E2D\u30FB\u30C4\u30E2\u5207\u308A\uFF0F\u30C4\u30E2"],
        ["\u5CAD\u4E0A\u6478\u724C \xB7 \u8BF7\u9009\u62E9\u51FA\u724C", "Replacement draw \xB7 Choose a discard", "\u5DBA\u4E0A\u724C\u30FB\u6253\u724C\u3092\u9078\u629E"],
        ["\u53EF\u4FDD\u6301\u542C\u724C \xB7 \u8BF7\u9009\u62E9\u5207\u724C", "Tenpai available \xB7 Choose a discard", "\u8074\u724C\u53EF\u80FD\u30FB\u6253\u724C\u3092\u9078\u629E"],
        ["\u7ACB\u76F4 \xB7 \u9009\u62E9\u5207\u724C", "Riichi \xB7 Choose a discard", "\u7ACB\u76F4\u30FB\u6253\u724C\u3092\u9078\u629E"],
        ["\u53EF\u4EE5\u9E23\u724C\uFF0F\u8363\u548C", "Call or Ron available", "\u9CF4\u304D\uFF0F\u30ED\u30F3\u304C\u53EF\u80FD"],
        ["\u9009\u62E9\u6697\u6760\uFF0F\u52A0\u6760", "Choose a Kan", "\u6697\u69D3\uFF0F\u52A0\u69D3\u3092\u9078\u629E"],
        ["\u8F6E\u5230\u4F60\u51FA\u724C", "Your turn", "\u3042\u306A\u305F\u306E\u756A\u3067\u3059"],
        ["\u6B63\u5728\u53D1\u724C\u2026", "Dealing\u2026", "\u914D\u724C\u4E2D\u2026"],
        ["\u65B0\u4E00\u5C40\u5F00\u59CB", "New hand", "\u65B0\u3057\u3044\u5C40"],
        ["\u6B63\u5728\u601D\u8003\u2026", "Thinking\u2026", "\u8003\u3048\u4E2D\u2026"],
        ["\u672C\u5C40\u6D41\u5C40", "Drawn hand", "\u6D41\u5C40"],
        ["\u5BF9\u5C40\u5DF2\u6682\u505C", "Match paused", "\u5BFE\u5C40\u3092\u4E2D\u65AD"],
        ["\u9009\u62E9\u4E00\u5F20\u724C", "Select a tile", "\u724C\u3092\u9078\u629E"],
        ["\u62A2\u6760\u673A\u4F1A", "Robbing a Kan", "\u69CD\u69D3\u306E\u6A5F\u4F1A"],
        ["\u5173\u95ED\u724C\u5C40\u4FE1\u606F", "Close round details", "\u5C40\u60C5\u5831\u3092\u9589\u3058\u308B"],
        ["\u6536\u8D77\u724C\u5C40\u4FE1\u606F", "Close round details", "\u5C40\u60C5\u5831\u3092\u9589\u3058\u308B"],
        ["\u6253\u5F00\u6E38\u620F\u83DC\u5355", "Open game menu", "\u30E1\u30CB\u30E5\u30FC\u3092\u958B\u304F"],
        ["\u5173\u95ED\u83DC\u5355", "Close menu", "\u30E1\u30CB\u30E5\u30FC\u3092\u9589\u3058\u308B"],
        ["\u5173\u95ED\u70B9\u6570", "Close scores", "\u70B9\u6570\u3092\u9589\u3058\u308B"],
        ["\u70B9\u51FB\u7A7A\u767D\u5904\u6536\u8D77", "Tap outside to close", "\u5916\u5074\u3092\u30BF\u30C3\u30D7\u3057\u3066\u9589\u3058\u308B"],
        ["\u70B9\u51FB\u5C55\u5F00 \u2303", "Details \u2303", "\u8A73\u7D30 \u2303"],
        ["\u9884\u89C8\u5403\u724C\u6F14\u51FA", "Preview Chi", "\u30C1\u30FC\u6F14\u51FA\u3092\u898B\u308B"],
        ["\u9884\u89C8\u78B0\u724C\u6F14\u51FA", "Preview Pon", "\u30DD\u30F3\u6F14\u51FA\u3092\u898B\u308B"],
        ["\u9884\u89C8\u6760\u724C\u6F14\u51FA", "Preview Kan", "\u30AB\u30F3\u6F14\u51FA\u3092\u898B\u308B"],
        ["\u6F14\u51FA\u89D2\u8272", "Preview character", "\u6F14\u51FA\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC"],
        ["\u6F14\u51FA\u9884\u89C8", "Preview", "\u6F14\u51FA\u30D7\u30EC\u30D3\u30E5\u30FC"],
        ["\u89D2\u8272\u6F14\u51FA", "Character effects", "\u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u6F14\u51FA"],
        ["\u56DB\u5BB6\u70B9\u6570", "Player scores", "\u5404\u5BB6\u306E\u70B9\u6570"],
        ["\u724C\u684C\u83DC\u5355", "Game menu", "\u5BFE\u5C40\u30E1\u30CB\u30E5\u30FC"],
        ["\u724C\u5C40\u4FE1\u606F", "Round details", "\u5C40\u60C5\u5831"],
        ["\u8FDB\u5165\u5168\u5C4F \u2197", "Fullscreen \u2197", "\u5168\u753B\u9762 \u2197"],
        ["\u9000\u51FA\u5168\u5C4F \u2199", "Exit fullscreen \u2199", "\u5168\u753B\u9762\u3092\u7D42\u4E86 \u2199"],
        ["\u73A9\u6CD5\u8BF4\u660E", "How to play", "\u904A\u3073\u65B9"],
        ["\u52A8\u4F5C\u7279\u6548", "Motion", "\u6F14\u51FA"],
        ["\u58F0\u97F3", "Sound", "\u30B5\u30A6\u30F3\u30C9"],
        ["\u5149\u7EBF\uFF1A", "Lighting: ", "\u7167\u660E\uFF1A"],
        ["\u5207\u6362\u573A\u666F\u5149\u7EBF", "Change lighting", "\u7167\u660E\u3092\u5909\u66F4"],
        ["\u65E5\u5149", "Day", "\u663C"],
        ["\u591C\u573A", "Night", "\u591C"],
        ["\u65B0\u5BF9\u5C40 \u2197", "New match \u2197", "\u65B0\u3057\u3044\u5BFE\u5C40 \u2197"],
        ["\u91CD\u65B0\u5F00\u59CB", "Restart", "\u3084\u308A\u76F4\u3059"],
        ["\u518D\u5F00\u4E00\u573A", "Play again", "\u3082\u3046\u4E00\u5EA6"],
        ["\u4FDD\u5B58\u724C\u8C31", "Save game log", "\u724C\u8B5C\u3092\u4FDD\u5B58"],
        ["\u724C\u9762\u56FE\u9274 \u2197", "Tile gallery \u2197", "\u724C\u4E00\u89A7 \u2197"],
        ["\u8DF3\u8FC7 \xB7 Esc", "Pass \xB7 Esc", "\u898B\u9001\u308A \xB7 Esc"],
        ["\u5173\u95ED \xD7", "Close \xD7", "\u9589\u3058\u308B \xD7"],
        ["\u724C\u5C71\u5269\u4F59", "Tiles left", "\u6B8B\u308A\u724C"],
        ["\u91CC\u5B9D\u724C\u6307\u793A", "Ura dora indicators", "\u88CF\u30C9\u30E9\u8868\u793A\u724C"],
        ["\u5B9D\u724C\u6307\u793A", "Dora indicators", "\u30C9\u30E9\u8868\u793A\u724C"],
        ["\u672C\u573A", "Honba", "\u672C\u5834"],
        ["\u4F9B\u6258", "Deposits", "\u4F9B\u8A17"],
        ["\u53D6\u6D88\u7ACB\u76F4", "Cancel", "\u53D6\u6D88"],
        ["\u5DF2\u7ACB\u76F4", "Riichi", "\u7ACB\u76F4\u4E2D"],
        ["\u6697\u6760\u80CC\u9762", "Concealed Kan back", "\u6697\u69D3\u306E\u88CF\u9762"],
        ["\u660E\u6760\uFF0F\u52A0\u6760", "Open / added Kan", "\u5927\u660E\u69D3\uFF0F\u52A0\u69D3"],
        ["\u5F20\u6697\u724C", "concealed tiles", "\u679A\u306E\u624B\u724C"],
        ["\u4F60\u7684\u684C\u9762\u624B\u724C", "Your hand", "\u3042\u306A\u305F\u306E\u624B\u724C"],
        ["\u4F60\u7684\u684C\u9762\u526F\u9732", "Your melds", "\u3042\u306A\u305F\u306E\u526F\u9732"],
        ["\u4E13\u5C5E\u548C\u724C\u7ACB\u7ED8", "win illustration", "\u548C\u4E86\u30A4\u30E9\u30B9\u30C8"],
        ["\u548C\u724C\u7ACB\u7ED8", "win illustration", "\u548C\u4E86\u30A4\u30E9\u30B9\u30C8"],
        ["\u4E13\u5C5E\u52A8\u4F5C", "action illustration", "\u5C02\u7528\u30A2\u30AF\u30B7\u30E7\u30F3"],
        ["\u4E3E\u724C\u5C0F\u90A6\u5E03", "Bangboo holding a sign", "\u770B\u677F\u3092\u6301\u3064\u30DC\u30F3\u30D7"],
        ["\u5411\u542C \xB7 \u5403\u78B0\u540E\u4E0D\u53EF\u7ACB\u76F4", "shanten \xB7 Open hands cannot declare Riichi", "\u5411\u8074\u30FB\u9CF4\u304F\u3068\u7ACB\u76F4\u4E0D\u53EF"],
        ["\u89C4\u5219\u5F15\u64CE\u4E0E majiang-ai \u7535\u8111\uFF1BMIT \u6388\u6743\u3002\u975E\u5B98\u65B9\u540C\u4EBA\u4F5C\u54C1\u3002", "rules and majiang-ai opponents; MIT licensed. Unofficial fan game.", "\u30EB\u30FC\u30EB\u30A8\u30F3\u30B8\u30F3\u3068 majiang-ai \u3092\u4F7F\u7528\u3002MIT\u30E9\u30A4\u30BB\u30F3\u30B9\u3002\u975E\u516C\u5F0F\u30D5\u30A1\u30F3\u4F5C\u54C1\u3002"],
        ["\u59AE\u53EF", "Nicole", "\u30CB\u30B3"],
        ["\u6BD4\u5229", "Billy", "\u30D3\u30EA\u30FC"],
        ["\u827E\u83B2", "Ellen", "\u30A8\u30EC\u30F3"],
        ["\u96C5", "Miyabi", "\u96C5"],
        ["\u4E1C\u5BB6", "East", "\u6771\u5BB6"],
        ["\u5357\u5BB6", "South", "\u5357\u5BB6"],
        ["\u897F\u5BB6", "West", "\u897F\u5BB6"],
        ["\u5317\u5BB6", "North", "\u5317\u5BB6"],
        ["\u8352\u724C\u6D41\u5C40", "Exhaustive draw", "\u8352\u724C\u6D41\u5C40"],
        ["\u4E5D\u79CD\u4E5D\u724C", "Nine terminals", "\u4E5D\u7A2E\u4E5D\u724C"],
        ["\u56DB\u98CE\u8FDE\u6253", "Four winds", "\u56DB\u98A8\u9023\u6253"],
        ["\u56DB\u5BB6\u7ACB\u76F4", "Four Riichi", "\u56DB\u5BB6\u7ACB\u76F4"],
        ["\u56DB\u6760\u6563\u4E86", "Four Kans", "\u56DB\u69D3\u6563\u4E86"],
        ["\u4E09\u5BB6\u548C\u6D41\u5C40", "Triple Ron", "\u4E09\u5BB6\u548C"],
        ["\u6D41\u5C40\u6EE1\u8D2F", "Nagashi Mangan", "\u6D41\u3057\u6E80\u8CAB"],
        ["\u95E8\u524D\u6E05\u81EA\u6478\u548C", "Menzen Tsumo", "\u9580\u524D\u6E05\u81EA\u6478\u548C"],
        ["\u9580\u524D\u6E05\u81EA\u6478\u548C", "Menzen Tsumo", "\u9580\u524D\u6E05\u81EA\u6478\u548C"],
        ["\u30C0\u30D6\u30EB\u7ACB\u76F4", "Double Riichi", "\u30C0\u30D6\u30EB\u7ACB\u76F4"],
        ["\u4E00\u767A", "Ippatsu", "\u4E00\u767A"],
        ["\u5E73\u548C", "Pinfu", "\u5E73\u548C"],
        ["\u65AD\u5E7A\u4E5D", "Tanyao", "\u65AD\u5E7A\u4E5D"],
        ["\u5F79\u724C", "Yakuhai", "\u5F79\u724C"],
        ["\u4E00\u76C3\u53E3", "Iipeikou", "\u4E00\u76C3\u53E3"],
        ["\u4E8C\u76C3\u53E3", "Ryanpeikou", "\u4E8C\u76C3\u53E3"],
        ["\u4E03\u5BFE\u5B50", "Chiitoitsu", "\u4E03\u5BFE\u5B50"],
        ["\u5BFE\u3005\u548C", "Toitoi", "\u5BFE\u3005\u548C"],
        ["\u4E09\u6697\u523B", "Sanankou", "\u4E09\u6697\u523B"],
        ["\u4E09\u69D3\u5B50", "Sankantsu", "\u4E09\u69D3\u5B50"],
        ["\u4E09\u8272\u540C\u9806", "Sanshoku Doujun", "\u4E09\u8272\u540C\u9806"],
        ["\u4E09\u8272\u540C\u523B", "Sanshoku Doukou", "\u4E09\u8272\u540C\u523B"],
        ["\u4E00\u6C17\u901A\u8CAB", "Ittsu", "\u4E00\u6C17\u901A\u8CAB"],
        ["\u6DF7\u5168\u5E2F\u5E7A\u4E5D", "Chanta", "\u6DF7\u5168\u5E2F\u5E7A\u4E5D"],
        ["\u7D14\u5168\u5E2F\u5E7A\u4E5D", "Junchan", "\u7D14\u5168\u5E2F\u5E7A\u4E5D"],
        ["\u6DF7\u8001\u982D", "Honroutou", "\u6DF7\u8001\u982D"],
        ["\u5C0F\u4E09\u5143", "Shousangen", "\u5C0F\u4E09\u5143"],
        ["\u6DF7\u4E00\u8272", "Honitsu", "\u6DF7\u4E00\u8272"],
        ["\u6E05\u4E00\u8272", "Chinitsu", "\u6E05\u4E00\u8272"],
        ["\u5DBA\u4E0A\u958B\u82B1", "Rinshan Kaihou", "\u5DBA\u4E0A\u958B\u82B1"],
        ["\u69CD\u69D3", "Chankan", "\u69CD\u69D3"],
        ["\u6D77\u5E95\u6478\u6708", "Haitei", "\u6D77\u5E95\u6478\u6708"],
        ["\u6CB3\u5E95\u6488\u9B5A", "Houtei", "\u6CB3\u5E95\u6488\u9B5A"],
        ["\u56FD\u58EB\u7121\u53CC", "Kokushi Musou", "\u56FD\u58EB\u7121\u53CC"],
        ["\u56DB\u6697\u523B", "Suuankou", "\u56DB\u6697\u523B"],
        ["\u5927\u4E09\u5143", "Daisangen", "\u5927\u4E09\u5143"],
        ["\u5B57\u4E00\u8272", "Tsuuiisou", "\u5B57\u4E00\u8272"],
        ["\u7DD1\u4E00\u8272", "Ryuuiisou", "\u7DD1\u4E00\u8272"],
        ["\u6E05\u8001\u982D", "Chinroutou", "\u6E05\u8001\u982D"],
        ["\u5C0F\u56DB\u559C", "Shousuushii", "\u5C0F\u56DB\u559C"],
        ["\u5927\u56DB\u559C", "Daisuushii", "\u5927\u56DB\u559C"],
        ["\u56DB\u69D3\u5B50", "Suukantsu", "\u56DB\u69D3\u5B50"],
        ["\u4E5D\u84EE\u5B9D\u71C8", "Chuuren Poutou", "\u4E5D\u84EE\u5B9D\u71C8"],
        ["\u5929\u548C", "Tenhou", "\u5929\u548C"],
        ["\u5730\u548C", "Chiihou", "\u5730\u548C"],
        ["\u88CF\u30C9\u30E9", "Ura Dora", "\u88CF\u30C9\u30E9"],
        ["\u8D64\u30C9\u30E9", "Red Dora", "\u8D64\u30C9\u30E9"],
        ["\u30C9\u30E9", "Dora", "\u30C9\u30E9"],
        ["\u81EA\u6478", "Tsumo", "\u30C4\u30E2"],
        ["\u8363\u548C", "Ron", "\u30ED\u30F3"],
        ["\u653E\u94F3", "dealt in", "\u653E\u9283"],
        ["\u542C\u724C", "Tenpai", "\u8074\u724C"],
        ["\u7ACB\u76F4", "Riichi", "\u7ACB\u76F4"],
        ["\u6697\u6760", "Concealed Kan", "\u6697\u69D3"],
        ["\u52A0\u6760", "Added Kan", "\u52A0\u69D3"],
        ["\u5403", "Chi", "\u30C1\u30FC"],
        ["\u78B0", "Pon", "\u30DD\u30F3"],
        ["\u6760", "Kan", "\u30AB\u30F3"],
        ["\u6253\u51FA", "Discard", "\u6253\u724C"],
        ["\u5207\u51FA", "discards", "\u6253\u724C"],
        ["\u6478\u5165", "drawn", "\u30C4\u30E2\u724C"],
        ["\u500D\u5F79\u6EE1", "\xD7 Yakuman", "\u500D\u5F79\u6E80"],
        ["\u70B9\u6570", "Scores", "\u70B9\u6570"],
        ["\u83DC\u5355 \u2630", "Menu \u2630", "\u30E1\u30CB\u30E5\u30FC \u2630"],
        ["\u756A", "han", "\u7FFB"],
        ["\u7B26", "fu", "\u7B26"],
        ["\u70B9", "pts", "\u70B9"],
        ["\u679A", "tiles", "\u679A"],
        ["\u5E84", "Dealer", "\u89AA"],
        ["\u7B49\u5F85\u53D1\u724C", "Waiting for tiles", "\u914D\u724C\u5F85\u3061"],
        ["\u9009\u62E9", "Choose ", "\u9078\u629E"],
        ["\u724C\u7EC4\u5408", " combination", "\u306E\u7D44\u5408\u305B"],
        ["\u4F7F\u7528 ", "Uses ", "\u4F7F\u7528\uFF1A"],
        ["\u4E07\u5B50", "Characters", "\u842C\u5B50"],
        ["\u997C\u5B50", "Circles", "\u7B52\u5B50"],
        ["\u7D22\u5B50", "Bamboo", "\u7D22\u5B50"],
        ["\u5B57\u724C", "Honors", "\u5B57\u724C"],
        ["\u8D64\u4E94", "Red fives", "\u8D645"],
        ["\u8D64 ", "Red ", "\u8D64 "],
        [" / \u5207", " / Discard", " / \u6253\u724C"]
      ];
      var digits = ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u4E03", "\u516B", "\u4E5D"];
      for (let suit = 0; suit < 3; suit++) digits.forEach((d, n) => copy.push([d + ["\u842C", "\u7B52", "\u7D22"][suit], `${n + 1} ${["Characters", "Circles", "Bamboo"][suit]}`, `${d}${["\u842C", "\u7B52", "\u7D22"][suit]}`]));
      copy.push(["\u6771", "East", "\u6771"], ["\u5357", "South", "\u5357"], ["\u897F", "West", "\u897F"], ["\u5317", "North", "\u5317"], ["\u767D", "White", "\u767D"], ["\u767C", "Green", "\u767C"], ["\u4E2D", "Red", "\u4E2D"]);
      copy.push(["\u5834\u98A8", "Round wind", "\u5834\u98A8"], ["\u81EA\u98A8", "Seat wind", "\u81EA\u98A8"], ["\u7FFB\u724C", "Dragon", "\u5F79\u724C"], ["\u56FD\u58EB\u7121\u53CC\u5341\u4E09\u9762", "Kokushi 13-sided wait", "\u56FD\u58EB\u7121\u53CC\u5341\u4E09\u9762"], ["\u56DB\u6697\u523B\u5358\u9A0E", "Suuankou single wait", "\u56DB\u6697\u523B\u5358\u9A0E"], ["\u7D14\u6B63\u4E5D\u84EE\u5B9D\u71C8", "Pure Chuuren Poutou", "\u7D14\u6B63\u4E5D\u84EE\u5B9D\u71C8"]);
      copy.push(["\u573A\u666F\u7D20\u6750", "Scene styles", "\u30B7\u30FC\u30F3\u7D20\u6750"], ["\u5730\u9762", "Floor", "\u5E8A"], ["\u724C\u684C", "Table", "\u5353"], ["\u9713\u8679\u8857\u533A", "Neon streets", "\u30CD\u30AA\u30F3\u8857"], ["\u8D64\u8272\u5DE5\u574A", "Crimson workshop", "\u8D64\u306E\u5DE5\u623F"], ["\u971C\u6708\u9053\u573A", "Frostmoon dojo", "\u971C\u6708\u9053\u5834"], ["\u6DF1\u6D77\u4F1A\u9986", "Deep sea lounge", "\u6DF1\u6D77\u30E9\u30A6\u30F3\u30B8"], ["\u7D20\u6750\u8F7D\u5165\u5931\u8D25\uFF0C\u8BF7\u91CD\u8BD5\u3002", "Could not load the artwork. Please try again.", "\u7D20\u6750\u3092\u8AAD\u307F\u8FBC\u3081\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002"]);
      var entries = new Map(copy.map((r) => [r[0], r]));
      var escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var pattern = new RegExp([...entries.keys()].sort((a, b) => b.length - a.length).map(escape).join("|"), "g");
      function initLanguage() {
        let locale = "zh";
        try {
          const saved = localStorage.getItem("riichi-language");
          if (["zh", "en", "ja"].includes(saved)) locale = saved;
        } catch {
        }
        const sources = /* @__PURE__ */ new WeakMap();
        function translate(text) {
          if (locale === "zh") return text;
          return text.replace(/([东南西北]) (\d+) 局/g, (_, w, n) => locale === "en" ? `${{ \u4E1C: "East", \u5357: "South", \u897F: "West", \u5317: "North" }[w]} ${n}` : `${w === "\u4E1C" ? "\u6771" : w}${n}\u5C40`).replace(pattern, (key) => entries.get(key)[locale === "en" ? 1 : 2]);
        }
        function set(node, key, value, write) {
          let map = sources.get(node);
          if (!map) {
            map = /* @__PURE__ */ new Map();
            sources.set(node, map);
          }
          let saved = map.get(key);
          if (!saved || value !== saved.last) saved = { source: value, last: value };
          const next = translate(saved.source);
          saved.last = next;
          map.set(key, saved);
          if (next !== value) write(next);
        }
        function walk(root) {
          if (root.nodeType === 3) {
            if (root.parentElement?.closest("script,style,#language-select")) return;
            set(root, "text", root.nodeValue, (v) => root.nodeValue = v);
            return;
          }
          if (root.nodeType !== 1) return;
          if (root.matches("script,style,#language-select")) return;
          for (const key of ["title", "aria-label", "alt"]) if (root.hasAttribute(key)) set(root, key, root.getAttribute(key), (v) => root.setAttribute(key, v));
          for (const child of root.childNodes) walk(child);
        }
        const select = document.getElementById("language-select");
        function apply() {
          document.documentElement.lang = { zh: "zh-CN", en: "en", ja: "ja" }[locale];
          select.value = locale;
          walk(document.body);
        }
        select.addEventListener("change", () => {
          locale = select.value;
          try {
            localStorage.setItem("riichi-language", locale);
          } catch {
          }
          apply();
        });
        new MutationObserver((changes) => {
          for (const m of changes) {
            if (m.type === "childList") for (const n of m.addedNodes) walk(n);
            else walk(m.target);
          }
        }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["title", "aria-label", "alt"] });
        apply();
      }
      module.exports = { initLanguage };
    }
  });

  // src/game.js
  var require_game2 = __commonJS({
    "src/game.js"() {
      var { Majiang, RULE, CHARACTERS, WINDS, handTiles, tileId, tileFile, meldKind, meldTiles, HumanPlayer, Match } = require_engine();
      var $ = (id) => document.getElementById(id);
      var NAMES = ["\u4E00\u842C", "\u4E8C\u842C", "\u4E09\u842C", "\u56DB\u842C", "\u4E94\u842C", "\u516D\u842C", "\u4E03\u842C", "\u516B\u842C", "\u4E5D\u842C", "\u4E00\u7B52", "\u4E8C\u7B52", "\u4E09\u7B52", "\u56DB\u7B52", "\u4E94\u7B52", "\u516D\u7B52", "\u4E03\u7B52", "\u516B\u7B52", "\u4E5D\u7B52", "\u4E00\u7D22", "\u4E8C\u7D22", "\u4E09\u7D22", "\u56DB\u7D22", "\u4E94\u7D22", "\u516D\u7D22", "\u4E03\u7D22", "\u516B\u7D22", "\u4E5D\u7D22", "\u6771", "\u5357", "\u897F", "\u5317", "\u767D", "\u767C", "\u4E2D"];
      var WIN_ART = ["nicole", "billy", "miyabi", "ellen"];
      var WIN_COLORS = ["#ff4d9b", "#ff9a4d", "#7fddff", "#ff4664"];
      var tileName = (p) => {
        const id = typeof p === "number" ? p : tileId(p);
        return id >= 34 ? "\u8D64 " + NAMES[[4, 13, 22][id - 34]] : NAMES[id];
      };
      var match;
      var human;
      var decision = null;
      var reply = null;
      var selected = -1;
      var riichiPick = false;
      var kanPick = false;
      var callFilter = null;
      var lastText = "\u6B63\u5728\u53D1\u724C\u2026";
      var sound = false;
      var ctx;
      var actionEffects = [];
      var effectsTimers = [];
      var resultOpen = false;
      var later = (fn, ms) => {
        const id = setTimeout(fn, ms);
        effectsTimers.push(id);
        return id;
      };
      function tone(freq = 450) {
        if (!sound) return;
        try {
          ctx ?? (ctx = new (window.AudioContext || window.webkitAudioContext)());
          ctx.resume();
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.type = "triangle";
          o.frequency.value = freq;
          o.connect(g);
          g.connect(ctx.destination);
          g.gain.setValueAtTime(0.045, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + 0.13);
          o.start();
          o.stop(ctx.currentTime + 0.14);
        } catch {
        }
      }
      function tile(p, small = false) {
        const id = typeof p === "number" ? p : tileId(p), el = document.createElement("span");
        el.className = "tile art-tile png-tile" + (small ? " small" : "") + (id >= 34 ? " aka" : "");
        el.title = tileName(p);
        el.setAttribute("aria-label", tileName(p));
        const img = document.createElement("img");
        img.src = "tiles/" + tileFile(p) + ".png";
        img.alt = "";
        img.draggable = false;
        el.appendChild(img);
        return el;
      }
      function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
      }
      function clearEffects() {
        effectsTimers.forEach(clearTimeout);
        effectsTimers = [];
        for (const fx of actionEffects) fx.remove();
        actionEffects = [];
        document.querySelectorAll(".character-sprite").forEach((p) => p.classList.remove("discarding"));
        $("cutin").hidden = true;
        $("call-fx").hidden = true;
      }
      var BotWorker = class {
        constructor() {
          this.worker = new Worker("ai-worker.js?v=1990cbdae121");
          this.pending = /* @__PURE__ */ new Map();
          this.sequence = 0;
          this.alive = true;
          this.worker.onmessage = ({ data }) => {
            if (!this.alive) return;
            if (data.error) return failMatch("\u7535\u8111\u8BA1\u7B97\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u65B0\u5F00\u59CB\u5BF9\u5C40\u3002");
            const cb = this.pending.get(data.id);
            this.pending.delete(data.id);
            cb?.(data.result);
          };
          this.worker.onerror = () => {
            if (this.alive) failMatch("\u7535\u8111\u8F7D\u5165\u5931\u8D25\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u540E\u91CD\u8BD5\u3002");
          };
        }
        action(message, callback) {
          const id = ++this.sequence;
          if (callback) this.pending.set(id, callback);
          this.worker.postMessage({ id, message, reply: !!callback });
        }
        dispose() {
          this.alive = false;
          this.worker.terminate();
          this.pending.clear();
        }
      };
      function failMatch(text) {
        match?.dispose();
        decision = null;
        reply = null;
        lastText = text;
        render();
        show("<h2>\u5BF9\u5C40\u5DF2\u6682\u505C</h2><p>" + text + '</p><button id="restart-error">\u91CD\u65B0\u5F00\u59CB</button>');
        $("restart-error").onclick = newGame;
      }
      function submit(answer) {
        if (!reply) return;
        const cb = reply;
        reply = null;
        decision = null;
        riichiPick = false;
        kanPick = false;
        callFilter = null;
        selected = -1;
        if (resultOpen) {
          resultOpen = false;
          $("modal").close();
          $("victory").close();
          $("modal").classList.remove("winner-result");
        }
        render();
        cb(answer);
      }
      function onDecision(options, callback) {
        decision = options;
        reply = callback;
        selected = -1;
        riichiPick = false;
        kanPick = false;
        callFilter = null;
        if (["result", "draw", "match"].includes(options.type)) {
          if (options.type === "result") showVictory(options);
          else showResult(options);
          render();
          return;
        }
        render();
      }
      function newGame(dealer) {
        $("round-info").hidePopover();
        match?.dispose();
        clearEffects();
        if ($("modal").open) $("modal").close();
        if ($("victory").open) $("victory").close();
        $("modal").classList.remove("winner-result");
        resultOpen = false;
        decision = null;
        reply = null;
        selected = -1;
        riichiPick = false;
        kanPick = false;
        callFilter = null;
        lastText = "\u6B63\u5728\u53D1\u724C\u2026";
        human = new HumanPlayer(onDecision);
        match = new Match([human, new BotWorker(), new BotWorker(), new BotWorker()], () => {
        }, RULE, "Nicole \u2022 Riichi Club \xB7 \u4E1C\u98CE\u6218");
        match.model.player = CHARACTERS.slice();
        match.speed = 4;
        match.wait = 0;
        match.view = { kaiju: render, redraw: () => {
          clearEffects();
          lastText = "\u65B0\u4E00\u5C40\u5F00\u59CB";
          render();
        }, update: onEvent, say: () => {
        }, summary: render };
        match.kaiju(Number.isInteger(dealer) ? dealer : void 0);
      }
      function onEvent(event) {
        render();
        if (!event) return;
        const [type, data] = Object.entries(event)[0], id = data.l == null ? null : match.model.player_id[data.l];
        if (type === "dapai") {
          lastText = CHARACTERS[id] + " \u5207\u51FA " + tileName(data.p);
          animateDiscard(id, data.p);
          if (data.p.includes("*")) {
            lastText = CHARACTERS[id] + " \u7ACB\u76F4";
            playWords("\u7ACB\u76F4", "RIICHI", id);
          }
        } else if (type === "fulou" || type === "gang") {
          const kind = type === "gang" ? "kan" : meldKind(data.m);
          lastText = CHARACTERS[id] + " " + { chi: "\u5403", pon: "\u78B0", kan: "\u6760" }[kind];
          playCallEffect(kind, id);
        } else if (type === "zimo" || type === "gangzimo") {
          lastText = id === 0 ? type === "gangzimo" ? "\u5CAD\u4E0A\u6478\u724C \xB7 \u8BF7\u9009\u62E9\u51FA\u724C" : "\u8F6E\u5230\u4F60\u51FA\u724C" : CHARACTERS[id] + " \u6B63\u5728\u601D\u8003\u2026";
        } else if (type === "hule") {
          lastText = CHARACTERS[id] + (data.baojia == null ? " \u81EA\u6478" : " \u8363\u548C");
          $("cutin").hidden = true;
        } else if (type === "pingju") {
          lastText = "\u672C\u5C40\u6D41\u5C40";
        }
        render();
      }
      function ownSeat() {
        return match.model.player_id.indexOf(0);
      }
      function discardCode(index) {
        const hand = match.model.shoupai[ownSeat()], tiles = handTiles(hand);
        return tiles[index] + (hand._zimo?.length === 2 && index === tiles.length - 1 ? "_" : "");
      }
      function selectDiscard(index) {
        if (decision?.type !== "turn") return;
        const p = discardCode(index), allowed = riichiPick ? decision.riichi : decision.discards;
        if (!allowed.includes(p)) return;
        if (selected === index) discard();
        else {
          selected = index;
          tone(540);
          render();
        }
      }
      function discard() {
        if (decision?.type !== "turn" || selected < 0) return;
        const p = discardCode(selected), allowed = riichiPick ? decision.riichi : decision.discards;
        if (allowed.includes(p)) submit({ dapai: p + (riichiPick ? "*" : "") });
      }
      function renderMeld(m, small = true) {
        const group = document.createElement("div");
        group.className = "meld";
        group.title = meldKind(m) === "kan" ? /[+=-]/.test(m) ? "\u660E\u6760\uFF0F\u52A0\u6760" : "\u6697\u6760" : meldKind(m) === "pon" ? "\u78B0" : "\u5403";
        const tiles = meldTiles(m), closed = meldKind(m) === "kan" && !/[+=-]/.test(m);
        let calledSlot;
        tiles.forEach((t, i) => {
          const v = tile(t.p, small);
          if (closed && (i === 0 || i === 3)) {
            v.className = "tile tile-back" + (small ? " small" : "");
            v.replaceChildren();
            v.setAttribute("aria-label", "\u6697\u6760\u80CC\u9762");
          }
          if (/[+=-]\d$/.test(m) && i === tiles.length - 1 && calledSlot) {
            v.classList.add("added-kan");
            calledSlot.appendChild(v);
            return;
          }
          if (t.called) {
            v.classList.add("claimed");
            calledSlot = document.createElement("span");
            calledSlot.className = "meld-called";
            calledSlot.appendChild(v);
            group.appendChild(calledSlot);
          } else group.appendChild(v);
        });
        return group;
      }
      function render() {
        if (!match?.model.shan) return;
        const model = match.model, seat = ownSeat(), hand = model.shoupai[seat];
        $("round-label").textContent = WINDS[model.zhuangfeng] + " " + (model.jushu + 1) + " \u5C40";
        $("my-points").textContent = model.defen[0].toLocaleString();
        $("round-info-title").textContent = $("round-label").textContent;
        $("wall").textContent = model.shan.paishu;
        $("sticks").textContent = model.changbang + " \u672C\u573A \xB7 " + model.lizhibang + " \u4F9B\u6258";
        $("dora").replaceChildren(...model.shan.baopai.map((p) => tile(p, true)));
        for (let l = 0; l < 4; l++) {
          const id = model.player_id[l], river = $("river" + id);
          river.replaceChildren(...model.he[l]._pai.map((p) => {
            const v = tile(p, true);
            if (/[+=-]$/.test(p)) v.classList.add("called-away");
            if (p.includes("*")) v.classList.add("riichi-tile");
            return v;
          }));
          const score = $("score" + id);
          score.querySelector("small").textContent = WINDS[l] + "\u5BB6" + (l === 0 ? " \xB7 \u5E84" : "") + (model.shoupai[l].lizhi ? " \xB7 \u7ACB\u76F4" : "");
          score.querySelector("b").textContent = model.defen[id].toLocaleString();
          score.classList.toggle("active-seat", model.lunban === l);
          $("seat-label" + id).textContent = CHARACTERS[id] + " \xB7 " + WINDS[l] + "\u5BB6";
          $("board-melds" + id).replaceChildren(...model.shoupai[l]._fulou.map((m) => renderMeld(m)));
          if (id !== 0) {
            const backs = $("backs" + id);
            backs.replaceChildren();
            for (let i = 0; i < handTiles(model.shoupai[l]).length; i++) {
              const back = document.createElement("span");
              back.className = "tile-back";
              back.setAttribute("aria-hidden", "true");
              backs.appendChild(back);
            }
            backs.setAttribute("aria-label", CHARACTERS[id] + " \xB7 " + handTiles(model.shoupai[l]).length + " \u5F20\u6697\u724C");
          }
        }
        $("melds").replaceChildren(...hand._fulou.map((m) => renderMeld(m)));
        $("melds").hidden = !hand._fulou.length;
        const handNode = $("hand");
        handNode.replaceChildren();
        handTiles(hand).forEach((p, i) => {
          const v = tile(p), b = document.createElement("button");
          b.className = v.className + (selected === i ? " selected" : "") + (hand._zimo?.length === 2 && i === handTiles(hand).length - 1 ? " drawn" : "");
          b.replaceChildren(...v.childNodes);
          b.title = tileName(p);
          b.setAttribute("aria-label", tileName(p) + (b.classList.contains("drawn") ? " \u6478\u5165" : ""));
          b.setAttribute("aria-pressed", selected === i);
          const legal = decision?.type === "turn" ? riichiPick ? decision.riichi : decision.discards : [];
          b.disabled = !legal.includes(discardCode(i));
          b.onclick = () => selectDiscard(i);
          handNode.appendChild(b);
        });
        $("discard").disabled = decision?.type !== "turn" || selected < 0;
        $("win").disabled = decision?.type !== "turn" || !decision.win;
        $("riichi").disabled = decision?.type !== "turn" || !decision.riichi.length;
        $("riichi").textContent = hand.lizhi ? "\u5DF2\u7ACB\u76F4" : riichiPick ? "\u53D6\u6D88\u7ACB\u76F4" : "\u7ACB\u76F4";
        for (const kind of ["chi", "pon", "kan"]) {
          const available = decision?.type === "response" ? decision.calls.some((m) => meldKind(m) === kind) : kind === "kan" && decision?.type === "turn" && decision.kan.length > 0;
          $(kind).disabled = !available;
          $(kind).setAttribute("aria-expanded", kind === "kan" && decision?.type === "turn" ? kanPick : callFilter === kind);
          $(kind).title = available ? "\u9009\u62E9" + { chi: "\u5403", pon: "\u78B0", kan: "\u6760" }[kind] + "\u724C\u7EC4\u5408" : { chi: "\u4E0A\u5BB6\u5F03\u724C\u53EF\u7EC4\u6210\u987A\u5B50\u65F6\u53EF\u5403", pon: "\u5BF9\u624B\u5F03\u724C\u4E0E\u4F60\u7684\u5BF9\u5B50\u76F8\u540C\u65F6\u53EF\u78B0", kan: "\u6301\u6709\u56DB\u5F20\u540C\u724C\u6216\u53EF\u52A0\u6760\u65F6\u5F00\u653E" }[kind];
        }
        $("abort").hidden = decision?.type !== "turn" || !decision.abort;
        $("status").textContent = decision?.type === "response" ? decision.rob ? "\u62A2\u6760\u673A\u4F1A" : "\u53EF\u4EE5\u9E23\u724C\uFF0F\u8363\u548C" : decision?.type === "turn" ? riichiPick ? "\u7ACB\u76F4 \xB7 \u9009\u62E9\u5207\u724C" : hand.lizhi ? "\u5DF2\u7ACB\u76F4 \xB7 \u6478\u5207\uFF0F\u81EA\u6478" : "\u8F6E\u5230\u4F60\u51FA\u724C" : lastText;
        const shanten = Majiang.Util.xiangting(hand);
        $("hint").textContent = decision?.type === "response" ? "\u8363\u548C\u4F18\u5148\uFF1B\u8DF3\u8FC7\u8363\u548C\u4F1A\u8FDB\u5165\u632F\u542C" : riichiPick ? "\u5207\u51FA\u9AD8\u4EAE\u724C\u5E76\u652F\u4ED8 1,000 \u70B9" : hand.lizhi ? "\u7ACB\u76F4\u540E\u53EA\u53EF\u6478\u5207\u3001\u5408\u6CD5\u6697\u6760\u6216\u548C\u724C" : shanten === 0 ? hand._zimo ? "\u53EF\u4FDD\u6301\u542C\u724C \xB7 \u8BF7\u9009\u62E9\u5207\u724C" : "\u542C\u724C \xB7 " + (Majiang.Util.tingpai(hand) || []).map(tileName).join("\u3001") : shanten < 0 ? "\u724C\u5F62\u5B8C\u6210\uFF0C\u987B\u6709\u5F79\u624D\u80FD\u548C\u724C" : shanten + " \u5411\u542C \xB7 \u5403\u78B0\u540E\u4E0D\u53EF\u7ACB\u76F4";
        $("tilelabel").textContent = selected >= 0 ? tileName(handTiles(hand)[selected]) : "\u9009\u62E9\u4E00\u5F20\u724C";
        renderChoices();
      }
      function actionButton(label, action, meld, kind) {
        const b = document.createElement("button");
        b.className = "call-choice";
        b.setAttribute("aria-label", label + (meld ? " " + meldTiles(meld).map((t) => tileName(t.p)).join("\u3001") : ""));
        if (kind) {
          const img = document.createElement("img");
          img.src = kind + "-fx.png";
          img.alt = label;
          b.appendChild(img);
        } else {
          const text = document.createElement("strong");
          text.textContent = label;
          b.appendChild(text);
        }
        if (meld) meldTiles(meld).forEach((t) => b.appendChild(tile(t.p, true)));
        b.onclick = action;
        return b;
      }
      function renderChoices() {
        const panel = $("call-panel"), choices = $("call-choices");
        choices.replaceChildren();
        const response = decision?.type === "response";
        panel.hidden = !response && !(kanPick && decision?.kan.length);
        $("call-pass").hidden = !response;
        if (panel.hidden) return;
        if (response) {
          $("call-label").textContent = CHARACTERS[match.model.player_id[decision.from]] + " " + (decision.rob ? "\u52A0\u6760" : "\u5207\u51FA") + " " + tileName(decision.tile);
          if (decision.win) choices.appendChild(actionButton("\u8363\u548C", () => submit({ hule: "-" })));
          for (const m of decision.calls) {
            const kind = meldKind(m);
            if (callFilter && kind !== callFilter) continue;
            choices.appendChild(actionButton({ chi: "\u5403", pon: "\u78B0", kan: "\u6760" }[kind], () => submit({ fulou: m }), m, kind));
          }
        } else {
          $("call-label").textContent = "\u9009\u62E9\u6697\u6760\uFF0F\u52A0\u6760";
          for (const m of decision.kan) choices.appendChild(actionButton(/[+=-]/.test(m) ? "\u52A0\u6760" : "\u6697\u6760", () => submit({ gang: m }), m, "kan"));
        }
      }
      var callEffectTimer;
      function playCallEffect(kind, id = 0, preview = false) {
        const layer = $("call-fx");
        clearTimeout(callEffectTimer);
        $("call-character").src = "calls/" + WIN_ART[id] + "-" + kind + ".png";
        $("call-character").alt = CHARACTERS[id] + " \xB7 " + { chi: "\u5403", pon: "\u78B0", kan: "\u6760" }[kind] + " \u4E13\u5C5E\u52A8\u4F5C";
        $("call-badge").src = kind + "-fx.png";
        $("call-badge").alt = { chi: "\u5403 Chi", pon: "\u78B0 Pon", kan: "\u6760 Kan" }[kind];
        layer.style.setProperty("--action-color", WIN_COLORS[id]);
        layer.querySelector("small").textContent = (preview ? "\u6F14\u51FA\u9884\u89C8 \xB7 " : "") + CHARACTERS[id] + " \xB7 " + { chi: "\u5403", pon: "\u78B0", kan: "\u6760" }[kind];
        layer.hidden = false;
        layer.classList.remove("playing");
        void layer.offsetWidth;
        layer.classList.add("playing");
        tone(kind === "kan" ? 220 : 660);
        callEffectTimer = later(() => layer.hidden = true, 2100);
      }
      function chooseCallKind(kind) {
        if (decision?.type === "response" && decision.calls.some((m) => meldKind(m) === kind)) {
          callFilter = callFilter === kind ? null : kind;
          render();
          return;
        }
        if (kind === "kan" && decision?.type === "turn" && decision.kan.length) {
          kanPick = !kanPick;
          riichiPick = false;
          selected = -1;
          render();
        }
      }
      function playWords(title, english, id) {
        if (document.body.classList.contains("no-motion") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        $("cut-title").textContent = title;
        $("cut-sub").textContent = CHARACTERS[id] + " \xB7 " + english;
        $("cutin").hidden = false;
        later(() => $("cutin").hidden = true, 1800);
      }
      function show(html) {
        $("modalbody").innerHTML = html;
        if (!$("modal").open) $("modal").showModal();
      }
      var DRAW_NAMES = { "\u8352\u724C\u5E73\u5C40": "\u8352\u724C\u6D41\u5C40", "\u4E5D\u7A2E\u4E5D\u724C": "\u4E5D\u79CD\u4E5D\u724C", "\u56DB\u98A8\u9023\u6253": "\u56DB\u98CE\u8FDE\u6253", "\u56DB\u5BB6\u7ACB\u76F4": "\u56DB\u5BB6\u7ACB\u76F4", "\u56DB\u958B\u69D3": "\u56DB\u6760\u6563\u4E86", "\u4E09\u5BB6\u548C": "\u4E09\u5BB6\u548C\u6D41\u5C40", "\u6D41\u3057\u6E80\u8CAB": "\u6D41\u5C40\u6EE1\u8D2F" };
      function addWinAtmosphere(root) {
        root.querySelector(".win-atmosphere")?.remove();
        const fx = document.createElement("div");
        fx.className = "win-atmosphere";
        fx.setAttribute("aria-hidden", "true");
        for (const name of ["win-halo", "win-beam", "win-streak", "win-flare"]) {
          const el = document.createElement("i");
          el.className = name;
          fx.appendChild(el);
        }
        for (let i = 0; i < 18; i++) {
          const el = document.createElement("i");
          el.className = "win-spark";
          el.style.cssText = `--x:${(i * 37 + 11) % 100}%;--y:${(i * 23 + 7) % 100}%;--delay:${-(i % 7) * 0.65}s;--duration:${3 + i % 4}s`;
          fx.appendChild(el);
        }
        root.prepend(fx);
      }
      function showVictory(options) {
        resultOpen = true;
        const r = options.result, id = match.model.player_id[r.l], dialog = $("victory");
        clearEffects();
        if ($("modal").open) $("modal").close();
        dialog.style.setProperty("--winner-color", WIN_COLORS[id]);
        addWinAtmosphere(dialog);
        $("victory-art").src = "winners/" + WIN_ART[id] + ".png";
        $("victory-art").alt = CHARACTERS[id] + " \u4E13\u5C5E\u548C\u724C\u7ACB\u7ED8";
        $("victory-title").textContent = CHARACTERS[id] + " \xB7 " + (r.baojia == null ? "\u81EA\u6478" : "\u8363\u548C");
        $("victory-sub").textContent = (r.damanguan ? r.damanguan + " \u500D\u5F79\u6EE1" : r.fanshu + " \u756A " + r.fu + " \u7B26") + " / " + r.defen.toLocaleString() + " \u70B9";
        $("reveal-result").onclick = () => {
          dialog.close();
          showResult(options);
        };
        if (!dialog.open) dialog.showModal();
        $("reveal-result").focus();
      }
      $("victory").addEventListener("cancel", (e) => e.preventDefault());
      function showResult(options) {
        resultOpen = true;
        $("modal").classList.remove("winner-result");
        const result = options.result, model = match.model;
        if (options.type === "match") {
          show('<h2>\u4E1C\u98CE\u6218 \xB7 \u7EC8\u5C40</h2><div class="settlement">' + result.rank.map((rank, id) => ({ rank, id })).sort((a, b) => a.rank - b.rank).map(({ rank, id }) => "<p><b>#" + rank + " " + CHARACTERS[id] + "</b><span>" + result.defen[id].toLocaleString() + " \u70B9</span></p>").join("") + '</div><button id="next" class="primary">\u518D\u5F00\u4E00\u573A</button><button id="download-log">\u4FDD\u5B58\u724C\u8C31</button>');
          $("next").onclick = newGame;
          $("download-log").onclick = () => downloadLog(result);
          return;
        }
        const win = options.type === "result";
        const title = win ? CHARACTERS[model.player_id[result.l]] + " " + (result.baojia == null ? "\u81EA\u6478" : "\u8363\u548C \xB7 " + CHARACTERS[model.player_id[result.baojia]] + " \u653E\u94F3") : DRAW_NAMES[result.name] || result.name;
        const detail = win ? (result.damanguan ? result.damanguan + " \u500D\u5F79\u6EE1" : result.fanshu + " \u756A " + result.fu + " \u7B26") + " \xB7 " + result.defen.toLocaleString() + " \u70B9" : "";
        show("<h2>" + escapeHtml(title) + '</h2><strong class="result-points">' + detail + '</strong><div id="result-hand"></div><div class="yaku-list">' + (result.hupai || []).map((h) => "<span>" + escapeHtml(h.name) + " <b>" + escapeHtml(h.fanshu) + " \u756A</b></span>").join("") + "</div>" + (result.fubaopai?.length ? '<p>\u91CC\u5B9D\u724C\u6307\u793A</p><div id="ura"></div>' : "") + '<div class="settlement">' + result.fenpei.map((delta, l) => {
          const id = model.player_id[l];
          return "<p><b>" + CHARACTERS[id] + "</b><span>" + model.defen[id].toLocaleString() + " \u2192 " + (model.defen[id] + delta).toLocaleString() + '</span><em class="' + (delta >= 0 ? "gain" : "loss") + '">' + (delta > 0 ? "+" : "") + delta + "</em></p>";
        }).join("") + '</div><button id="next" class="primary">\u786E\u8BA4\u7ED3\u7B97 \xB7 \u7EE7\u7EED</button>');
        if (win) {
          const id = model.player_id[result.l];
          $("modal").classList.add("winner-result");
          $("modal").style.setProperty("--winner-color", WIN_COLORS[id]);
          addWinAtmosphere($("modal"));
          const art = document.createElement("img");
          art.src = "winners/" + WIN_ART[id] + ".png";
          art.alt = CHARACTERS[id] + " \u548C\u724C\u7ACB\u7ED8";
          art.className = "settlement-art";
          const detail2 = document.createElement("div");
          detail2.className = "settlement-detail";
          detail2.append(...$("modalbody").childNodes);
          $("modalbody").replaceChildren(art, detail2);
          const h = Majiang.Shoupai.fromString(result.shoupai);
          $("result-hand").replaceChildren(...handTiles(h).map((p) => tile(p, true)), ...h._fulou.map((m) => renderMeld(m)));
          if ($("ura")) $("ura").replaceChildren(...result.fubaopai.map((p) => tile(p, true)));
        } else {
          result.shoupai.forEach((s, l) => {
            if (!s) return;
            const label = document.createElement("p");
            label.textContent = CHARACTERS[model.player_id[l]] + " \u542C\u724C";
            $("result-hand").appendChild(label);
            const h = Majiang.Shoupai.fromString(s);
            handTiles(h).forEach((p) => $("result-hand").appendChild(tile(p, true)));
          });
        }
        $("next").onclick = () => submit({});
      }
      function downloadLog(log) {
        const blob = new Blob([JSON.stringify(log, null, 2)], { type: "application/json" }), url = URL.createObjectURL(blob), a = document.createElement("a");
        a.href = url;
        a.download = "nicole-riichi-" + Date.now() + ".json";
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1e3);
      }
      function showGallery() {
        show('<h2>\u65B0\u827E\u5229\u90FD \xB7 37 \u5F20\u7279\u8272\u724C</h2><p>\u672C\u724C\u5C40\u76F4\u63A5\u4F7F\u7528\u8FD9\u4E9B PNG\uFF1B\u6BCF\u95E8\u4E00\u5F20\u7EA2\u4E94\uFF0C\u8BA1\u5165\u8D64\u5B9D\u724C\u3002</p><div id="tile-catalog"></div>');
        const families = [["\u4E07\u5B50", 0, 9], ["\u997C\u5B50", 9, 18], ["\u7D22\u5B50", 18, 27], ["\u5B57\u724C", 27, 34], ["\u8D64\u4E94", 34, 37]];
        for (const [label, start, end] of families) {
          const h = document.createElement("h3");
          h.textContent = label;
          const row = document.createElement("div");
          row.className = "catalog-row";
          for (let id = start; id < end; id++) row.appendChild(tile(id));
          $("tile-catalog").append(h, row);
        }
      }
      $("round-info").addEventListener("toggle", (e) => $("round-toggle").setAttribute("aria-expanded", String(e.newState === "open")));
      $("discard").onclick = discard;
      $("win").onclick = () => {
        if (decision?.type === "turn" && decision.win) submit({ hule: "-" });
      };
      $("riichi").onclick = () => {
        if (decision?.type === "turn" && decision.riichi.length) {
          riichiPick = !riichiPick;
          selected = -1;
          kanPick = false;
          render();
        }
      };
      $("chi").onclick = () => chooseCallKind("chi");
      $("pon").onclick = () => chooseCallKind("pon");
      $("kan").onclick = () => chooseCallKind("kan");
      $("abort").onclick = () => {
        if (decision?.abort) submit({ daopai: "-" });
      };
      $("call-pass").onclick = () => {
        if (decision?.type === "response") submit({});
      };
      $("new").onclick = () => {
        if (resultOpen) return;
        show('<h2>\u91CD\u65B0\u5F00\u59CB\u4E1C\u98CE\u6218\uFF1F</h2><p>\u5F53\u524D\u70B9\u6570\u548C\u672C\u573A\u8FDB\u5EA6\u4F1A\u91CD\u7F6E\uFF0C\u56DB\u4EBA\u4ECE 25,000 \u70B9\u5F00\u59CB\u3002</p><button id="reset" class="primary">\u91CD\u65B0\u5F00\u59CB</button>');
        $("reset").onclick = newGame;
      };
      $("close").onclick = () => {
        if (!resultOpen) $("modal").close();
      };
      $("modal").addEventListener("cancel", (e) => {
        if (resultOpen) e.preventDefault();
      });
      $("sound").onclick = () => {
        sound = !sound;
        $("sound").textContent = "\u58F0\u97F3 " + (sound ? "ON" : "OFF");
        $("sound").setAttribute("aria-pressed", sound);
        tone();
      };
      $("motion").onclick = () => {
        const off = document.body.classList.toggle("no-motion");
        $("motion").textContent = "\u52A8\u4F5C\u7279\u6548 " + (off ? "OFF" : "ON");
        $("motion").setAttribute("aria-pressed", !off);
        if (off) clearEffects();
      };
      $("scene").onclick = () => {
        const roof = document.body.classList.toggle("rooftop");
        $("scene").textContent = "\u5149\u7EBF\uFF1A" + (roof ? "\u65E5\u5149" : "\u591C\u573A") + " \u21BB";
      };
      $("preview-chi").onclick = () => playCallEffect("chi", Number($("preview-character").value), true);
      $("preview-pon").onclick = () => playCallEffect("pon", Number($("preview-character").value), true);
      $("preview-kan").onclick = () => playCallEffect("kan", Number($("preview-character").value), true);
      $("tile-gallery").onclick = showGallery;
      $("rules").onclick = () => show('<h2>\u56DB\u4EBA\u7ACB\u76F4\u9EBB\u5C06 \xB7 \u4E1C\u98CE\u6218</h2><p>\u56DB\u4EBA\u5404 25,000 \u70B9\u3002\u5E84\u5BB6\u968F\u673A\uFF0C\u6309\u4E1C\u4E00\u81F3\u4E1C\u56DB\u63A8\u8FDB\uFF1B\u5E84\u5BB6\u548C\u724C\u6216\u542C\u724C\u8FDE\u5E84\u3002\u65E0\u4EBA\u8FBE\u5230 30,000 \u70B9\u65F6\u8FDB\u5165\u5357\u5165\u5EF6\u957F\uFF1B\u98DE\u4EBA\u7ED3\u675F\u3002</p><ul><li>\u5403\u4EC5\u9650\u4E0A\u5BB6\uFF1B\u78B0\u3001\u660E\u6760\u53EF\u63A5\u4EFB\u610F\u5BF9\u624B\u3002\u8363\u548C\u4F18\u5148\u4E8E\u78B0\u6760\uFF0C\u78B0\u6760\u4F18\u5148\u4E8E\u5403\u3002\u7981\u6B62\u98DF\u66FF\u3002</li><li>\u6697\u6760\u3001\u52A0\u6760\u3001\u660E\u6760\u540E\u6478\u5CAD\u4E0A\u724C\u5E76\u7FFB\u6760\u5B9D\u724C\u3002\u52A0\u6760\u53EF\u88AB\u62A2\u6760\uFF0C\u56DB\u6760\u6563\u4E86\u9664\u5355\u4EBA\u56DB\u6760\u3002</li><li>\u548C\u724C\u5FC5\u987B\u6709\u5F79\u3002\u652F\u6301\u81EA\u6478\u3001\u8363\u548C\u3001\u632F\u542C\u3001\u540C\u5DE1\u632F\u542C\u3001\u7ACB\u76F4\u632F\u542C\uFF0C\u4EE5\u53CA\u6807\u51C6\u5F79\u79CD\u4E0E\u7B26\u756A\u8BA1\u5206\u3002</li><li>\u95E8\u524D\u542C\u724C\u53EF\u4ED8 1,000 \u70B9\u7ACB\u76F4\u3002\u652F\u6301\u4E00\u53D1\u3001\u53CC\u7ACB\u76F4\u3001\u8D64\u5B9D\u724C\u3001\u91CC\u5B9D\u724C\u3001\u6760\u5B9D\u724C\uFF1B\u7ACB\u76F4\u540E\u4EC5\u5141\u8BB8\u4E0D\u6539\u53D8\u542C\u724C\u7684\u6697\u6760\u3002</li><li>\u53CC\u54CD\u6709\u6548\uFF0C\u4E09\u5BB6\u548C\u6D41\u5C40\u3002\u6D41\u5C40\u542C\u724C\u7F5A\u7B26 3,000 \u70B9\uFF0C\u4F9B\u6258\u4E0E\u672C\u573A\u6309\u89C4\u5219\u5EF6\u7EED\u3002</li><li>\u89D2\u8272\u4F4D\u7F6E\u4FDD\u6301\u4E0D\u53D8\uFF1B\u4E1C\u5357\u897F\u5317\u8EAB\u4EFD\u968F\u5E84\u5BB6\u8F6E\u6362\u3002\u7ED3\u7B97\u9700\u786E\u8BA4\u540E\u8FDB\u5165\u4E0B\u4E00\u5C40\u3002</li></ul><p>\u4F7F\u7528 <a href="https://github.com/kobalab/majiang-core" target="_blank" rel="noopener">majiang-core</a> \u89C4\u5219\u5F15\u64CE\u4E0E majiang-ai \u7535\u8111\uFF1BMIT \u6388\u6743\u3002\u975E\u5B98\u65B9\u540C\u4EBA\u4F5C\u54C1\u3002</p>');
      document.addEventListener("keydown", (e) => {
        if ($("modal").open || $("victory").open || document.querySelector("[popover]:popover-open")) return;
        if (decision?.type === "response") {
          if (e.key === "Escape") submit({});
          return;
        }
        if (decision?.type !== "turn") return;
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          const n = handTiles(match.model.shoupai[ownSeat()]).length, step = e.key === "ArrowRight" ? 1 : -1;
          for (let k = 0; k < n; k++) {
            selected = (selected + step + n) % n;
            if ((riichiPick ? decision.riichi : decision.discards).includes(discardCode(selected))) break;
          }
          render();
        }
        if (e.key === "Enter" && document.activeElement.tagName !== "BUTTON") discard();
      });
      var viewport = document.querySelector(".board");
      var world = document.querySelector(".world");
      var compactLayout = matchMedia("(max-aspect-ratio: 1/1), (max-width: 700px)");
      var rack = document.querySelector(".player-rack");
      var nameplate = document.querySelector(".player-label");
      function fitScene() {
        const scale = Math.min(viewport.clientWidth / 1e3, viewport.clientHeight / (2e3 / 3));
        world.style.setProperty("--scene-scale", scale);
        world.style.setProperty("--touch-world", 44 / Math.max(scale, 0.01) + "px");
      }
      function fitHand() {
        const target = compactLayout.matches ? $("mobile-hand-dock") : world;
        target.append(rack);
        world.append(nameplate);
        fitScene();
      }
      compactLayout.addEventListener("change", fitHand);
      new ResizeObserver(fitScene).observe(viewport);
      fitHand();
      $("fullscreen").hidden = !document.fullscreenEnabled;
      $("fullscreen").onclick = async () => {
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
          else await document.documentElement.requestFullscreen();
          $("game-menu").hidePopover();
        } catch {
          $("fullscreen").textContent = "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u5168\u5C4F";
        }
      };
      document.addEventListener("fullscreenchange", () => {
        $("fullscreen").textContent = document.fullscreenElement ? "\u9000\u51FA\u5168\u5C4F \u2199" : "\u8FDB\u5165\u5168\u5C4F \u2197";
      });
      for (const id of ["rules", "new", "tile-gallery"]) $(id).addEventListener("click", () => $("game-menu").hidePopover());
      for (const id of ["preview-chi", "preview-pon", "preview-kan"]) $(id).addEventListener("click", () => $("game-menu").hidePopover());
      function animateDiscard(player, called) {
        if (document.body.classList.contains("no-motion") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const target = $("river" + player).lastElementChild;
        if (!target?.animate) return;
        const board = document.querySelector(".world"), rect = board.getBoundingClientRect(), tr = target.getBoundingClientRect(), scale = rect.width / 1e3, br = { width: 1e3, height: 2e3 / 3 };
        const x = (tr.left + tr.width / 2 - rect.left) / scale, y = (tr.top + tr.height / 2 - rect.top) / scale;
        const origins = [[550, 470], [800, 280], [450, 197], [200, 385]];
        const [sx, sy] = origins[player];
        const person = board.querySelector?.(".person-" + player + " .character-sprite");
        if (person) {
          person.classList.remove("discarding");
          void person.offsetWidth;
          person.classList.add("discarding");
          later(() => person.classList.remove("discarding"), 1200);
        }
        target.animate([{ opacity: 0 }, { opacity: 0, offset: 0.99 }, { opacity: 1 }], { duration: 650 });
        const fly = target.cloneNode(true);
        fly.className += " flying-tile";
        fly.style.opacity = "0";
        board.appendChild(fly);
        actionEffects.push(fly);
        fly.animate([{ transform: `translate(${sx}px,${sy}px) translate(-50%,-50%) rotate(-22deg) scale(2.2)`, opacity: 1 }, { transform: `translate(${x}px,${y}px) translate(-50%,-50%) rotate(0deg) scale(1)`, opacity: 1 }], { duration: 250, delay: 400, easing: "cubic-bezier(.16,.8,.28,1)", fill: "forwards" });
        const burst = document.createElement("img");
        burst.src = "impact.png";
        burst.className = "impact-art";
        burst.alt = "";
        burst.style.left = x + "px";
        burst.style.top = y + "px";
        board.appendChild(burst);
        actionEffects.push(burst);
        burst.animate([{ opacity: 0, transform: "translate(-50%,-50%) scale(.15)" }, { opacity: 0, transform: "translate(-50%,-50%) scale(.15)", offset: 0.54 }, { opacity: 0.95, transform: "translate(-50%,-50%) scale(.65)", offset: 0.56 }, { opacity: 0, transform: "translate(-50%,-50%) scale(1.25)" }], { duration: 1200, fill: "forwards" });
        const banner = document.createElement("div");
        banner.className = "discard-banner " + (player === 0 ? "nicole-banner" : "opponent-banner");
        const label = document.createElement("b");
        label.textContent = ["\u59AE\u53EF", "\u6BD4\u5229", "\u96C5", "\u827E\u83B2"][player] + " / \u5207";
        banner.appendChild(label);
        const name = document.createElement("span");
        name.textContent = tileName(called);
        banner.appendChild(name);
        board.appendChild(banner);
        actionEffects.push(banner);
        banner.animate([{ opacity: 0, transform: "translateX(-110%) skewX(-7deg)" }, { opacity: 1, transform: "translateX(0) skewX(-7deg)", offset: 0.2 }, { opacity: 1, transform: "translateX(0) skewX(-7deg)", offset: 0.7 }, { opacity: 0, transform: "translateX(30%) skewX(-7deg)" }], { duration: 900, fill: "forwards" });
        const surface = board.querySelector?.(".table-layer") || board;
        surface.animate([{ transform: "translate(0,0)" }, { transform: "translate(2px,1px)" }, { transform: "translate(-2px,0)" }, { transform: "translate(0,0)" }], { duration: 150, delay: 650 });
        later(() => {
          fly.remove();
          tone(190);
        }, 650);
        later(() => {
          for (const el of [fly, burst, banner]) el.remove();
          actionEffects = actionEffects.filter((el) => ![fly, burst, banner].includes(el));
        }, 1230);
      }
      function publicTable() {
        const m = match?.model;
        if (!m?.shan) return {};
        return { round: WINDS[m.zhuangfeng] + (m.jushu + 1), scores: m.defen.slice(), remaining: m.shan.paishu, hand: handTiles(m.shoupai[ownSeat()]).map(tileName), rivers: m.he.map((h) => h._pai.map(tileName)), melds: m.shoupai.map((h) => h._fulou.slice()), turn: m.player_id[m.lunban], available: decision ? { type: decision.type, win: decision.win, kan: decision.kan, calls: decision.calls } : null };
      }
      if (navigator.modelContext?.registerTool) {
        try {
          navigator.modelContext.registerTool({ name: "read_mahjong_table", description: "Read public mahjong table and your own hand; never opponent hands or hidden wall.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async () => ({ content: [{ type: "text", text: JSON.stringify(publicTable()) }] }) });
        } catch {
        }
      }
      if (new URLSearchParams(location.search).has("test")) window.mahjongTest = { get match() {
        return match;
      }, get decision() {
        return decision;
      }, get human() {
        return human;
      }, newGame, submit, render, tile, publicTable, Majiang, RULE, showVictory, showResult, playCallEffect };
      require_scene_resources().initSceneResources();
      require_i18n().initLanguage();
      newGame();
    }
  });
  require_game2();
})();
/*! Bundled license information:

@kobalab/majiang-core/lib/index.js:
  (*!
   *  @kobalab/majiang-core v1.4.1
   *
   *  Copyright(C) 2021 Satoshi Kobayashi
   *  Released under the MIT license
   *  https://github.com/kobalab/majiang-core/blob/master/LICENSE
   *)
*/
