
module.exports = (args) => {
  var processPageAndSerialize = (function () {
	'use strict';

	/* @applitools/dom-snapshot@4.0.4 */

	var e = function (e) {
	  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
	        n = new Uint8Array(e),
	        r = n.length,
	        o = r % 3,
	        a = [];
	  let i;

	  for (let e = 0, t = r - o; e < t; e += 16383) a.push(s(e, e + 16383 > t ? t : e + 16383));

	  return 1 === o ? (i = n[r - 1], a.push(t[i >> 2] + t[i << 4 & 63] + "==")) : 2 === o && (i = (n[r - 2] << 8) + n[r - 1], a.push(t[i >> 10] + t[i >> 4 & 63] + t[i << 2 & 63] + "=")), a.join("");

	  function s(e, r) {
	    let o;
	    const a = [];

	    for (let s = e; s < r; s += 3) o = (n[s] << 16 & 16711680) + (n[s + 1] << 8 & 65280) + (255 & n[s + 2]), a.push(t[(i = o) >> 18 & 63] + t[i >> 12 & 63] + t[i >> 6 & 63] + t[63 & i]);

	    var i;
	    return a.join("");
	  }
	};

	var t = function () {
	  return window.crypto.getRandomValues(new Uint32Array(1))[0];
	};

	var n = function (e) {
	  return !/^https?:.+/.test(e.src) || e.contentDocument && e.contentDocument.location && ["about:blank", "about:srcdoc"].includes(e.contentDocument.location.href);
	};

	var r = function (e) {
	  try {
	    const t = e.contentDocument;
	    return Boolean(t && t.defaultView && t.defaultView.frameElement);
	  } catch (e) {}
	};

	var o = function (e, t) {
	  return new URL(e, t).href;
	};

	function a(e) {
	  return {
	    prev: null,
	    next: null,
	    data: e
	  };
	}

	function i(e, t, n) {
	  var r;
	  return null !== l ? (r = l, l = l.cursor, r.prev = t, r.next = n, r.cursor = e.cursor) : r = {
	    prev: t,
	    next: n,
	    cursor: e.cursor
	  }, e.cursor = r, r;
	}

	function s(e) {
	  var t = e.cursor;
	  e.cursor = t.cursor, t.prev = null, t.next = null, t.cursor = l, l = t;
	}

	var l = null,
	    c = function () {
	  this.cursor = null, this.head = null, this.tail = null;
	};

	c.createItem = a, c.prototype.createItem = a, c.prototype.updateCursors = function (e, t, n, r) {
	  for (var o = this.cursor; null !== o;) o.prev === e && (o.prev = t), o.next === n && (o.next = r), o = o.cursor;
	}, c.prototype.getSize = function () {
	  for (var e = 0, t = this.head; t;) e++, t = t.next;

	  return e;
	}, c.prototype.fromArray = function (e) {
	  var t = null;
	  this.head = null;

	  for (var n = 0; n < e.length; n++) {
	    var r = a(e[n]);
	    null !== t ? t.next = r : this.head = r, r.prev = t, t = r;
	  }

	  return this.tail = t, this;
	}, c.prototype.toArray = function () {
	  for (var e = this.head, t = []; e;) t.push(e.data), e = e.next;

	  return t;
	}, c.prototype.toJSON = c.prototype.toArray, c.prototype.isEmpty = function () {
	  return null === this.head;
	}, c.prototype.first = function () {
	  return this.head && this.head.data;
	}, c.prototype.last = function () {
	  return this.tail && this.tail.data;
	}, c.prototype.each = function (e, t) {
	  var n;
	  void 0 === t && (t = this);

	  for (var r = i(this, null, this.head); null !== r.next;) n = r.next, r.next = n.next, e.call(t, n.data, n, this);

	  s(this);
	}, c.prototype.forEach = c.prototype.each, c.prototype.eachRight = function (e, t) {
	  var n;
	  void 0 === t && (t = this);

	  for (var r = i(this, this.tail, null); null !== r.prev;) n = r.prev, r.prev = n.prev, e.call(t, n.data, n, this);

	  s(this);
	}, c.prototype.forEachRight = c.prototype.eachRight, c.prototype.nextUntil = function (e, t, n) {
	  if (null !== e) {
	    var r;
	    void 0 === n && (n = this);

	    for (var o = i(this, null, e); null !== o.next && (r = o.next, o.next = r.next, !t.call(n, r.data, r, this)););

	    s(this);
	  }
	}, c.prototype.prevUntil = function (e, t, n) {
	  if (null !== e) {
	    var r;
	    void 0 === n && (n = this);

	    for (var o = i(this, e, null); null !== o.prev && (r = o.prev, o.prev = r.prev, !t.call(n, r.data, r, this)););

	    s(this);
	  }
	}, c.prototype.some = function (e, t) {
	  var n = this.head;

	  for (void 0 === t && (t = this); null !== n;) {
	    if (e.call(t, n.data, n, this)) return !0;
	    n = n.next;
	  }

	  return !1;
	}, c.prototype.map = function (e, t) {
	  var n = new c(),
	      r = this.head;

	  for (void 0 === t && (t = this); null !== r;) n.appendData(e.call(t, r.data, r, this)), r = r.next;

	  return n;
	}, c.prototype.filter = function (e, t) {
	  var n = new c(),
	      r = this.head;

	  for (void 0 === t && (t = this); null !== r;) e.call(t, r.data, r, this) && n.appendData(r.data), r = r.next;

	  return n;
	}, c.prototype.clear = function () {
	  this.head = null, this.tail = null;
	}, c.prototype.copy = function () {
	  for (var e = new c(), t = this.head; null !== t;) e.insert(a(t.data)), t = t.next;

	  return e;
	}, c.prototype.prepend = function (e) {
	  return this.updateCursors(null, e, this.head, e), null !== this.head ? (this.head.prev = e, e.next = this.head) : this.tail = e, this.head = e, this;
	}, c.prototype.prependData = function (e) {
	  return this.prepend(a(e));
	}, c.prototype.append = function (e) {
	  return this.insert(e);
	}, c.prototype.appendData = function (e) {
	  return this.insert(a(e));
	}, c.prototype.insert = function (e, t) {
	  if (null != t) {
	    if (this.updateCursors(t.prev, e, t, e), null === t.prev) {
	      if (this.head !== t) throw new Error("before doesn't belong to list");
	      this.head = e, t.prev = e, e.next = t, this.updateCursors(null, e);
	    } else t.prev.next = e, e.prev = t.prev, t.prev = e, e.next = t;
	  } else this.updateCursors(this.tail, e, null, e), null !== this.tail ? (this.tail.next = e, e.prev = this.tail) : this.head = e, this.tail = e;
	  return this;
	}, c.prototype.insertData = function (e, t) {
	  return this.insert(a(e), t);
	}, c.prototype.remove = function (e) {
	  if (this.updateCursors(e, e.prev, e, e.next), null !== e.prev) e.prev.next = e.next;else {
	    if (this.head !== e) throw new Error("item doesn't belong to list");
	    this.head = e.next;
	  }
	  if (null !== e.next) e.next.prev = e.prev;else {
	    if (this.tail !== e) throw new Error("item doesn't belong to list");
	    this.tail = e.prev;
	  }
	  return e.prev = null, e.next = null, e;
	}, c.prototype.push = function (e) {
	  this.insert(a(e));
	}, c.prototype.pop = function () {
	  if (null !== this.tail) return this.remove(this.tail);
	}, c.prototype.unshift = function (e) {
	  this.prepend(a(e));
	}, c.prototype.shift = function () {
	  if (null !== this.head) return this.remove(this.head);
	}, c.prototype.prependList = function (e) {
	  return this.insertList(e, this.head);
	}, c.prototype.appendList = function (e) {
	  return this.insertList(e);
	}, c.prototype.insertList = function (e, t) {
	  return null === e.head || (null != t ? (this.updateCursors(t.prev, e.tail, t, e.head), null !== t.prev ? (t.prev.next = e.head, e.head.prev = t.prev) : this.head = e.head, t.prev = e.tail, e.tail.next = t) : (this.updateCursors(this.tail, e.tail, null, e.head), null !== this.tail ? (this.tail.next = e.head, e.head.prev = this.tail) : this.head = e.head, this.tail = e.tail), e.head = null, e.tail = null), this;
	}, c.prototype.replace = function (e, t) {
	  "head" in t ? this.insertList(t, e) : this.insert(t, e), this.remove(e);
	};

	var u = c,
	    h = function (e, t) {
	  var n = window.Object.create(SyntaxError.prototype),
	      r = new Error();
	  return n.name = e, n.message = t, window.Object.defineProperty(n, "stack", {
	    get: function () {
	      return (r.stack || "").replace(/^(.+\n){1,3}/, e + ": " + t + "\n");
	    }
	  }), n;
	};

	function d(e, t) {
	  function n(e, t) {
	    return r.slice(e, t).map(function (t, n) {
	      for (var r = String(e + n + 1); r.length < l;) r = " " + r;

	      return r + " |" + t;
	    }).join("\n");
	  }

	  var r = e.source.split(/\r\n?|\n|\f/),
	      o = e.line,
	      a = e.column,
	      i = Math.max(1, o - t) - 1,
	      s = Math.min(o + t, r.length + 1),
	      l = Math.max(4, String(s).length) + 1,
	      c = 0;
	  (a += ("    ".length - 1) * (r[o - 1].substr(0, a - 1).match(/\t/g) || []).length) > 100 && (c = a - 60 + 3, a = 58);

	  for (var u = i; u <= s; u++) u >= 0 && u < r.length && (r[u] = r[u].replace(/\t/g, "    "), r[u] = (c > 0 && r[u].length > c ? "…" : "") + r[u].substr(c, 98) + (r[u].length > c + 100 - 1 ? "…" : ""));

	  return [n(i, o), new window.Array(a + l + 2).join("-") + "^", n(o, s)].filter(Boolean).join("\n");
	}

	var p = function (e, t, n, r, o) {
	  var a = h("SyntaxError", e);
	  return a.source = t, a.offset = n, a.line = r, a.column = o, a.sourceFragment = function (e) {
	    return d(a, isNaN(e) ? 0 : e);
	  }, window.Object.defineProperty(a, "formattedMessage", {
	    get: function () {
	      return "Parse error: " + a.message + "\n" + d(a, 2);
	    }
	  }), a.parseError = {
	    offset: n,
	    line: r,
	    column: o
	  }, a;
	},
	    m = {
	  EOF: 0,
	  Ident: 1,
	  Function: 2,
	  AtKeyword: 3,
	  Hash: 4,
	  String: 5,
	  BadString: 6,
	  Url: 7,
	  BadUrl: 8,
	  Delim: 9,
	  Number: 10,
	  Percentage: 11,
	  Dimension: 12,
	  WhiteSpace: 13,
	  CDO: 14,
	  CDC: 15,
	  Colon: 16,
	  Semicolon: 17,
	  Comma: 18,
	  LeftSquareBracket: 19,
	  RightSquareBracket: 20,
	  LeftParenthesis: 21,
	  RightParenthesis: 22,
	  LeftCurlyBracket: 23,
	  RightCurlyBracket: 24,
	  Comment: 25
	},
	    f = window.Object.keys(m).reduce(function (e, t) {
	  return e[m[t]] = t, e;
	}, {}),
	    g = {
	  TYPE: m,
	  NAME: f
	};

	function b(e) {
	  return e >= 48 && e <= 57;
	}

	function y(e) {
	  return e >= 65 && e <= 90;
	}

	function k(e) {
	  return e >= 97 && e <= 122;
	}

	function v(e) {
	  return y(e) || k(e);
	}

	function w(e) {
	  return e >= 128;
	}

	function x(e) {
	  return v(e) || w(e) || 95 === e;
	}

	function S(e) {
	  return e >= 0 && e <= 8 || 11 === e || e >= 14 && e <= 31 || 127 === e;
	}

	function C(e) {
	  return 10 === e || 13 === e || 12 === e;
	}

	function A(e) {
	  return C(e) || 32 === e || 9 === e;
	}

	function T(e, t) {
	  return 92 === e && !C(t) && 0 !== t;
	}

	var z = new window.Array(128);
	E.Eof = 128, E.WhiteSpace = 130, E.Digit = 131, E.NameStart = 132, E.NonPrintable = 133;

	for (var P = 0; P < z.length; P++) switch (!0) {
	  case A(P):
	    z[P] = E.WhiteSpace;
	    break;

	  case b(P):
	    z[P] = E.Digit;
	    break;

	  case x(P):
	    z[P] = E.NameStart;
	    break;

	  case S(P):
	    z[P] = E.NonPrintable;
	    break;

	  default:
	    z[P] = P || E.Eof;
	}

	function E(e) {
	  return e < 128 ? z[e] : E.NameStart;
	}

	var L = {
	  isDigit: b,
	  isHexDigit: function (e) {
	    return b(e) || e >= 65 && e <= 70 || e >= 97 && e <= 102;
	  },
	  isUppercaseLetter: y,
	  isLowercaseLetter: k,
	  isLetter: v,
	  isNonAscii: w,
	  isNameStart: x,
	  isName: function (e) {
	    return x(e) || b(e) || 45 === e;
	  },
	  isNonPrintable: S,
	  isNewline: C,
	  isWhiteSpace: A,
	  isValidEscape: T,
	  isIdentifierStart: function (e, t, n) {
	    return 45 === e ? x(t) || 45 === t || T(t, n) : !!x(e) || 92 === e && T(e, t);
	  },
	  isNumberStart: function (e, t, n) {
	    return 43 === e || 45 === e ? b(t) ? 2 : 46 === t && b(n) ? 3 : 0 : 46 === e ? b(t) ? 2 : 0 : b(e) ? 1 : 0;
	  },
	  isBOM: function (e) {
	    return 65279 === e || 65534 === e ? 1 : 0;
	  },
	  charCodeCategory: E
	},
	    O = L.isDigit,
	    D = L.isHexDigit,
	    N = L.isUppercaseLetter,
	    R = L.isName,
	    I = L.isWhiteSpace,
	    B = L.isValidEscape;

	function M(e, t) {
	  return t < e.length ? e.charCodeAt(t) : 0;
	}

	function j(e, t, n) {
	  return 13 === n && 10 === M(e, t + 1) ? 2 : 1;
	}

	function _(e, t, n) {
	  var r = e.charCodeAt(t);
	  return N(r) && (r |= 32), r === n;
	}

	function F(e, t) {
	  for (; t < e.length && O(e.charCodeAt(t)); t++);

	  return t;
	}

	function U(e, t) {
	  if (D(M(e, (t += 2) - 1))) {
	    for (var n = Math.min(e.length, t + 5); t < n && D(M(e, t)); t++);

	    var r = M(e, t);
	    I(r) && (t += j(e, t, r));
	  }

	  return t;
	}

	var q = {
	  consumeEscaped: U,
	  consumeName: function (e, t) {
	    for (; t < e.length; t++) {
	      var n = e.charCodeAt(t);

	      if (!R(n)) {
	        if (!B(n, M(e, t + 1))) break;
	        t = U(e, t) - 1;
	      }
	    }

	    return t;
	  },
	  consumeNumber: function (e, t) {
	    var n = e.charCodeAt(t);

	    if (43 !== n && 45 !== n || (n = e.charCodeAt(t += 1)), O(n) && (t = F(e, t + 1), n = e.charCodeAt(t)), 46 === n && O(e.charCodeAt(t + 1)) && (n = e.charCodeAt(t += 2), t = F(e, t)), _(e, t, 101)) {
	      var r = 0;
	      45 !== (n = e.charCodeAt(t + 1)) && 43 !== n || (r = 1, n = e.charCodeAt(t + 2)), O(n) && (t = F(e, t + 1 + r + 1));
	    }

	    return t;
	  },
	  consumeBadUrlRemnants: function (e, t) {
	    for (; t < e.length; t++) {
	      var n = e.charCodeAt(t);

	      if (41 === n) {
	        t++;
	        break;
	      }

	      B(n, M(e, t + 1)) && (t = U(e, t));
	    }

	    return t;
	  },
	  cmpChar: _,
	  cmpStr: function (e, t, n, r) {
	    if (n - t !== r.length) return !1;
	    if (t < 0 || n > e.length) return !1;

	    for (var o = t; o < n; o++) {
	      var a = e.charCodeAt(o),
	          i = r.charCodeAt(o - t);
	      if (N(a) && (a |= 32), a !== i) return !1;
	    }

	    return !0;
	  },
	  getNewlineLength: j,
	  findWhiteSpaceStart: function (e, t) {
	    for (; t >= 0 && I(e.charCodeAt(t)); t--);

	    return t + 1;
	  },
	  findWhiteSpaceEnd: function (e, t) {
	    for (; t < e.length && I(e.charCodeAt(t)); t++);

	    return t;
	  }
	},
	    W = g.TYPE,
	    Y = g.NAME,
	    V = q.cmpStr,
	    H = W.EOF,
	    $ = W.WhiteSpace,
	    G = W.Comment,
	    K = function () {
	  this.offsetAndType = null, this.balance = null, this.reset();
	};

	K.prototype = {
	  reset: function () {
	    this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, this.tokenEnd = this.firstCharOffset;
	  },
	  lookupType: function (e) {
	    return (e += this.tokenIndex) < this.tokenCount ? this.offsetAndType[e] >> 24 : H;
	  },
	  lookupOffset: function (e) {
	    return (e += this.tokenIndex) < this.tokenCount ? 16777215 & this.offsetAndType[e - 1] : this.source.length;
	  },
	  lookupValue: function (e, t) {
	    return (e += this.tokenIndex) < this.tokenCount && V(this.source, 16777215 & this.offsetAndType[e - 1], 16777215 & this.offsetAndType[e], t);
	  },
	  getTokenStart: function (e) {
	    return e === this.tokenIndex ? this.tokenStart : e > 0 ? e < this.tokenCount ? 16777215 & this.offsetAndType[e - 1] : 16777215 & this.offsetAndType[this.tokenCount] : this.firstCharOffset;
	  },
	  getRawLength: function (e, t) {
	    var n,
	        r = e,
	        o = 16777215 & this.offsetAndType[Math.max(r - 1, 0)];

	    e: for (; r < this.tokenCount && !((n = this.balance[r]) < e); r++) switch (t(this.offsetAndType[r] >> 24, this.source, o)) {
	      case 1:
	        break e;

	      case 2:
	        r++;
	        break e;

	      default:
	        o = 16777215 & this.offsetAndType[r], this.balance[n] === r && (r = n);
	    }

	    return r - this.tokenIndex;
	  },
	  isBalanceEdge: function (e) {
	    return this.balance[this.tokenIndex] < e;
	  },
	  isDelim: function (e, t) {
	    return t ? this.lookupType(t) === W.Delim && this.source.charCodeAt(this.lookupOffset(t)) === e : this.tokenType === W.Delim && this.source.charCodeAt(this.tokenStart) === e;
	  },
	  getTokenValue: function () {
	    return this.source.substring(this.tokenStart, this.tokenEnd);
	  },
	  getTokenLength: function () {
	    return this.tokenEnd - this.tokenStart;
	  },
	  substrToCursor: function (e) {
	    return this.source.substring(e, this.tokenStart);
	  },
	  skipWS: function () {
	    for (var e = this.tokenIndex, t = 0; e < this.tokenCount && this.offsetAndType[e] >> 24 === $; e++, t++);

	    t > 0 && this.skip(t);
	  },
	  skipSC: function () {
	    for (; this.tokenType === $ || this.tokenType === G;) this.next();
	  },
	  skip: function (e) {
	    var t = this.tokenIndex + e;
	    t < this.tokenCount ? (this.tokenIndex = t, this.tokenStart = 16777215 & this.offsetAndType[t - 1], t = this.offsetAndType[t], this.tokenType = t >> 24, this.tokenEnd = 16777215 & t) : (this.tokenIndex = this.tokenCount, this.next());
	  },
	  next: function () {
	    var e = this.tokenIndex + 1;
	    e < this.tokenCount ? (this.tokenIndex = e, this.tokenStart = this.tokenEnd, e = this.offsetAndType[e], this.tokenType = e >> 24, this.tokenEnd = 16777215 & e) : (this.tokenIndex = this.tokenCount, this.eof = !0, this.tokenType = H, this.tokenStart = this.tokenEnd = this.source.length);
	  },
	  dump: function () {
	    var e = this.firstCharOffset;
	    return window.Array.prototype.slice.call(this.offsetAndType, 0, this.tokenCount).map(function (t, n) {
	      var r = e,
	          o = 16777215 & t;
	      return e = o, {
	        idx: n,
	        type: Y[t >> 24],
	        chunk: this.source.substring(r, o),
	        balance: this.balance[n]
	      };
	    }, this);
	  }
	};
	var X = K;

	function Q(e) {
	  return e;
	}

	function Z(e, t, n, r) {
	  var o, a;

	  switch (e.type) {
	    case "Group":
	      o = function (e, t, n, r) {
	        var o = " " === e.combinator || r ? e.combinator : " " + e.combinator + " ",
	            a = e.terms.map(function (e) {
	          return Z(e, t, n, r);
	        }).join(o);
	        return (e.explicit || n) && (a = (r || "," === a[0] ? "[" : "[ ") + a + (r ? "]" : " ]")), a;
	      }(e, t, n, r) + (e.disallowEmpty ? "!" : "");

	      break;

	    case "Multiplier":
	      return Z(e.term, t, n, r) + t(0 === (a = e).min && 0 === a.max ? "*" : 0 === a.min && 1 === a.max ? "?" : 1 === a.min && 0 === a.max ? a.comma ? "#" : "+" : 1 === a.min && 1 === a.max ? "" : (a.comma ? "#" : "") + (a.min === a.max ? "{" + a.min + "}" : "{" + a.min + "," + (0 !== a.max ? a.max : "") + "}"), e);

	    case "Type":
	      o = "<" + e.name + (e.opts ? t(function (e) {
	        switch (e.type) {
	          case "Range":
	            return " [" + (null === e.min ? "-∞" : e.min) + "," + (null === e.max ? "∞" : e.max) + "]";

	          default:
	            throw new Error("Unknown node type `" + e.type + "`");
	        }
	      }(e.opts), e.opts) : "") + ">";
	      break;

	    case "Property":
	      o = "<'" + e.name + "'>";
	      break;

	    case "Keyword":
	      o = e.name;
	      break;

	    case "AtKeyword":
	      o = "@" + e.name;
	      break;

	    case "Function":
	      o = e.name + "(";
	      break;

	    case "String":
	    case "Token":
	      o = e.value;
	      break;

	    case "Comma":
	      o = ",";
	      break;

	    default:
	      throw new Error("Unknown node type `" + e.type + "`");
	  }

	  return t(o, e);
	}

	var J = function (e, t) {
	  var n = Q,
	      r = !1,
	      o = !1;
	  return "function" == typeof t ? n = t : t && (r = Boolean(t.forceBraces), o = Boolean(t.compact), "function" == typeof t.decorate && (n = t.decorate)), Z(e, n, r, o);
	};

	function ee(e, t) {
	  var n = e && e.loc && e.loc[t];
	  return n ? {
	    offset: n.offset,
	    line: n.line,
	    column: n.column
	  } : null;
	}

	var te = function (e, t) {
	  var n = h("SyntaxReferenceError", e + (t ? " `" + t + "`" : ""));
	  return n.reference = t, n;
	},
	    ne = function (e, t, n, r) {
	  var o = h("SyntaxMatchError", e),
	      a = function (e) {
	    for (var t = e.tokens, n = e.longestMatch, r = n < t.length ? t[n].node : null, o = -1, a = 0, i = "", s = 0; s < t.length; s++) s === n && (o = i.length), null !== r && t[s].node === r && (s <= n ? a++ : a = 0), i += t[s].value;

	    return {
	      node: r,
	      css: i,
	      mismatchOffset: -1 === o ? i.length : o,
	      last: null === r || a > 1
	    };
	  }(r),
	      i = a.mismatchOffset || 0,
	      s = a.node || n,
	      l = ee(s, "end"),
	      c = a.last ? l : ee(s, "start"),
	      u = a.css;

	  return o.rawMessage = e, o.syntax = t ? J(t) : "<generic>", o.css = u, o.mismatchOffset = i, o.loc = {
	    source: s && s.loc && s.loc.source || "<unknown>",
	    start: c,
	    end: l
	  }, o.line = c ? c.line : void 0, o.column = c ? c.column : void 0, o.offset = c ? c.offset : void 0, o.message = e + "\n  syntax: " + o.syntax + "\n   value: " + (o.css || "<empty string>") + "\n  --------" + new window.Array(o.mismatchOffset + 1).join("-") + "^", o;
	},
	    re = window.Object.prototype.hasOwnProperty,
	    oe = window.Object.create(null),
	    ae = window.Object.create(null);

	function ie(e, t) {
	  return t = t || 0, e.length - t >= 2 && 45 === e.charCodeAt(t) && 45 === e.charCodeAt(t + 1);
	}

	function se(e, t) {
	  if (t = t || 0, e.length - t >= 3 && 45 === e.charCodeAt(t) && 45 !== e.charCodeAt(t + 1)) {
	    var n = e.indexOf("-", t + 2);
	    if (-1 !== n) return e.substring(t, n + 1);
	  }

	  return "";
	}

	var le = {
	  keyword: function (e) {
	    if (re.call(oe, e)) return oe[e];
	    var t = e.toLowerCase();
	    if (re.call(oe, t)) return oe[e] = oe[t];
	    var n = ie(t, 0),
	        r = n ? "" : se(t, 0);
	    return oe[e] = window.Object.freeze({
	      basename: t.substr(r.length),
	      name: t,
	      vendor: r,
	      prefix: r,
	      custom: n
	    });
	  },
	  property: function (e) {
	    if (re.call(ae, e)) return ae[e];
	    var t = e,
	        n = e[0];
	    "/" === n ? n = "/" === e[1] ? "//" : "/" : "_" !== n && "*" !== n && "$" !== n && "#" !== n && "+" !== n && "&" !== n && (n = "");
	    var r = ie(t, n.length);
	    if (!r && (t = t.toLowerCase(), re.call(ae, t))) return ae[e] = ae[t];
	    var o = r ? "" : se(t, n.length),
	        a = t.substr(0, n.length + o.length);
	    return ae[e] = window.Object.freeze({
	      basename: t.substr(a.length),
	      name: t.substr(n.length),
	      hack: n,
	      vendor: o,
	      prefix: a,
	      custom: r
	    });
	  },
	  isCustomProperty: ie,
	  vendorPrefix: se
	},
	    ce = "undefined" != typeof Uint32Array ? Uint32Array : window.Array,
	    ue = function (e, t) {
	  return null === e || e.length < t ? new ce(Math.max(t + 1024, 16384)) : e;
	},
	    he = g.TYPE,
	    de = L.isNewline,
	    pe = L.isName,
	    me = L.isValidEscape,
	    fe = L.isNumberStart,
	    ge = L.isIdentifierStart,
	    be = L.charCodeCategory,
	    ye = L.isBOM,
	    ke = q.cmpStr,
	    ve = q.getNewlineLength,
	    we = q.findWhiteSpaceEnd,
	    xe = q.consumeEscaped,
	    Se = q.consumeName,
	    Ce = q.consumeNumber,
	    Ae = q.consumeBadUrlRemnants;

	function Te(e, t) {
	  function n(t) {
	    return t < i ? e.charCodeAt(t) : 0;
	  }

	  function r() {
	    return h = Ce(e, h), ge(n(h), n(h + 1), n(h + 2)) ? (g = he.Dimension, void (h = Se(e, h))) : 37 === n(h) ? (g = he.Percentage, void h++) : void (g = he.Number);
	  }

	  function o() {
	    const t = h;
	    return h = Se(e, h), ke(e, t, h, "url") && 40 === n(h) ? 34 === n(h = we(e, h + 1)) || 39 === n(h) ? (g = he.Function, void (h = t + 4)) : void function () {
	      for (g = he.Url, h = we(e, h); h < e.length; h++) {
	        var t = e.charCodeAt(h);

	        switch (be(t)) {
	          case 41:
	            return void h++;

	          case be.Eof:
	            return;

	          case be.WhiteSpace:
	            return 41 === n(h = we(e, h)) || h >= e.length ? void (h < e.length && h++) : (h = Ae(e, h), void (g = he.BadUrl));

	          case 34:
	          case 39:
	          case 40:
	          case be.NonPrintable:
	            return h = Ae(e, h), void (g = he.BadUrl);

	          case 92:
	            if (me(t, n(h + 1))) {
	              h = xe(e, h) - 1;
	              break;
	            }

	            return h = Ae(e, h), void (g = he.BadUrl);
	        }
	      }
	    }() : 40 === n(h) ? (g = he.Function, void h++) : void (g = he.Ident);
	  }

	  function a(t) {
	    for (t || (t = n(h++)), g = he.String; h < e.length; h++) {
	      var r = e.charCodeAt(h);

	      switch (be(r)) {
	        case t:
	          return void h++;

	        case be.Eof:
	          return;

	        case be.WhiteSpace:
	          if (de(r)) return h += ve(e, h, r), void (g = he.BadString);
	          break;

	        case 92:
	          if (h === e.length - 1) break;
	          var o = n(h + 1);
	          de(o) ? h += ve(e, h + 1, o) : me(r, o) && (h = xe(e, h) - 1);
	      }
	    }
	  }

	  t || (t = new X());

	  for (var i = (e = String(e || "")).length, s = ue(t.offsetAndType, i + 1), l = ue(t.balance, i + 1), c = 0, u = ye(n(0)), h = u, d = 0, p = 0, m = 0; h < i;) {
	    var f = e.charCodeAt(h),
	        g = 0;

	    switch (l[c] = i, be(f)) {
	      case be.WhiteSpace:
	        g = he.WhiteSpace, h = we(e, h + 1);
	        break;

	      case 34:
	        a();
	        break;

	      case 35:
	        pe(n(h + 1)) || me(n(h + 1), n(h + 2)) ? (g = he.Hash, h = Se(e, h + 1)) : (g = he.Delim, h++);
	        break;

	      case 39:
	        a();
	        break;

	      case 40:
	        g = he.LeftParenthesis, h++;
	        break;

	      case 41:
	        g = he.RightParenthesis, h++;
	        break;

	      case 43:
	        fe(f, n(h + 1), n(h + 2)) ? r() : (g = he.Delim, h++);
	        break;

	      case 44:
	        g = he.Comma, h++;
	        break;

	      case 45:
	        fe(f, n(h + 1), n(h + 2)) ? r() : 45 === n(h + 1) && 62 === n(h + 2) ? (g = he.CDC, h += 3) : ge(f, n(h + 1), n(h + 2)) ? o() : (g = he.Delim, h++);
	        break;

	      case 46:
	        fe(f, n(h + 1), n(h + 2)) ? r() : (g = he.Delim, h++);
	        break;

	      case 47:
	        42 === n(h + 1) ? (g = he.Comment, 1 === (h = e.indexOf("*/", h + 2) + 2) && (h = e.length)) : (g = he.Delim, h++);
	        break;

	      case 58:
	        g = he.Colon, h++;
	        break;

	      case 59:
	        g = he.Semicolon, h++;
	        break;

	      case 60:
	        33 === n(h + 1) && 45 === n(h + 2) && 45 === n(h + 3) ? (g = he.CDO, h += 4) : (g = he.Delim, h++);
	        break;

	      case 64:
	        ge(n(h + 1), n(h + 2), n(h + 3)) ? (g = he.AtKeyword, h = Se(e, h + 1)) : (g = he.Delim, h++);
	        break;

	      case 91:
	        g = he.LeftSquareBracket, h++;
	        break;

	      case 92:
	        me(f, n(h + 1)) ? o() : (g = he.Delim, h++);
	        break;

	      case 93:
	        g = he.RightSquareBracket, h++;
	        break;

	      case 123:
	        g = he.LeftCurlyBracket, h++;
	        break;

	      case 125:
	        g = he.RightCurlyBracket, h++;
	        break;

	      case be.Digit:
	        r();
	        break;

	      case be.NameStart:
	        o();
	        break;

	      case be.Eof:
	        break;

	      default:
	        g = he.Delim, h++;
	    }

	    switch (g) {
	      case d:
	        for (d = (p = l[m = 16777215 & p]) >> 24, l[c] = m, l[m++] = c; m < c; m++) l[m] === i && (l[m] = c);

	        break;

	      case he.LeftParenthesis:
	      case he.Function:
	        l[c] = p, p = (d = he.RightParenthesis) << 24 | c;
	        break;

	      case he.LeftSquareBracket:
	        l[c] = p, p = (d = he.RightSquareBracket) << 24 | c;
	        break;

	      case he.LeftCurlyBracket:
	        l[c] = p, p = (d = he.RightCurlyBracket) << 24 | c;
	    }

	    s[c++] = g << 24 | h;
	  }

	  for (s[c] = he.EOF << 24 | h, l[c] = i, l[i] = i; 0 !== p;) p = l[m = 16777215 & p], l[m] = i;

	  return t.source = e, t.firstCharOffset = u, t.offsetAndType = s, t.tokenCount = c, t.balance = l, t.reset(), t.next(), t;
	}

	Object.keys(g).forEach(function (e) {
	  Te[e] = g[e];
	}), window.Object.keys(L).forEach(function (e) {
	  Te[e] = L[e];
	}), window.Object.keys(q).forEach(function (e) {
	  Te[e] = q[e];
	});
	var ze = Te,
	    Pe = ze.isDigit,
	    Ee = ze.cmpChar,
	    Le = ze.TYPE,
	    Oe = Le.Delim,
	    De = Le.WhiteSpace,
	    Ne = Le.Comment,
	    Re = Le.Ident,
	    Ie = Le.Number,
	    Be = Le.Dimension;

	function Me(e, t) {
	  return null !== e && e.type === Oe && e.value.charCodeAt(0) === t;
	}

	function je(e, t, n) {
	  for (; null !== e && (e.type === De || e.type === Ne);) e = n(++t);

	  return t;
	}

	function _e(e, t, n, r) {
	  if (!e) return 0;
	  var o = e.value.charCodeAt(t);

	  if (43 === o || 45 === o) {
	    if (n) return 0;
	    t++;
	  }

	  for (; t < e.value.length; t++) if (!Pe(e.value.charCodeAt(t))) return 0;

	  return r + 1;
	}

	function Fe(e, t, n) {
	  var r = !1,
	      o = je(e, t, n);
	  if (null === (e = n(o))) return t;

	  if (e.type !== Ie) {
	    if (!Me(e, 43) && !Me(e, 45)) return t;
	    if (r = !0, o = je(n(++o), o, n), null === (e = n(o)) && e.type !== Ie) return 0;
	  }

	  if (!r) {
	    var a = e.value.charCodeAt(0);
	    if (43 !== a && 45 !== a) return 0;
	  }

	  return _e(e, r ? 0 : 1, r, o);
	}

	var Ue = ze.isHexDigit,
	    qe = ze.cmpChar,
	    We = ze.TYPE,
	    Ye = We.Ident,
	    Ve = We.Delim,
	    He = We.Number,
	    $e = We.Dimension;

	function Ge(e, t) {
	  return null !== e && e.type === Ve && e.value.charCodeAt(0) === t;
	}

	function Ke(e, t) {
	  return e.value.charCodeAt(0) === t;
	}

	function Xe(e, t, n) {
	  for (var r = t, o = 0; r < e.value.length; r++) {
	    var a = e.value.charCodeAt(r);
	    if (45 === a && n && 0 !== o) return Xe(e, t + o + 1, !1) > 0 ? 6 : 0;
	    if (!Ue(a)) return 0;
	    if (++o > 6) return 0;
	  }

	  return o;
	}

	function Qe(e, t, n) {
	  if (!e) return 0;

	  for (; Ge(n(t), 63);) {
	    if (++e > 6) return 0;
	    t++;
	  }

	  return t;
	}

	var Ze = ze.isIdentifierStart,
	    Je = ze.isHexDigit,
	    et = ze.isDigit,
	    tt = ze.cmpStr,
	    nt = ze.consumeNumber,
	    rt = ze.TYPE,
	    ot = ["unset", "initial", "inherit"],
	    at = ["calc(", "-moz-calc(", "-webkit-calc("];

	function it(e, t) {
	  return t < e.length ? e.charCodeAt(t) : 0;
	}

	function st(e, t) {
	  return tt(e, 0, e.length, t);
	}

	function lt(e, t) {
	  for (var n = 0; n < t.length; n++) if (st(e, t[n])) return !0;

	  return !1;
	}

	function ct(e, t) {
	  return t === e.length - 2 && 92 === e.charCodeAt(t) && et(e.charCodeAt(t + 1));
	}

	function ut(e, t, n) {
	  if (e && "Range" === e.type) {
	    var r = Number(void 0 !== n && n !== t.length ? t.substr(0, n) : t);
	    if (isNaN(r)) return !0;
	    if (null !== e.min && r < e.min) return !0;
	    if (null !== e.max && r > e.max) return !0;
	  }

	  return !1;
	}

	function ht(e, t) {
	  var n = e.index,
	      r = 0;

	  do {
	    if (r++, e.balance <= n) break;
	  } while (e = t(r));

	  return r;
	}

	function dt(e) {
	  return function (t, n, r) {
	    return null === t ? 0 : t.type === rt.Function && lt(t.value, at) ? ht(t, n) : e(t, n, r);
	  };
	}

	function pt(e) {
	  return function (t) {
	    return null === t || t.type !== e ? 0 : 1;
	  };
	}

	function mt(e) {
	  return function (t, n, r) {
	    if (null === t || t.type !== rt.Dimension) return 0;
	    var o = nt(t.value, 0);

	    if (null !== e) {
	      var a = t.value.indexOf("\\", o),
	          i = -1 !== a && ct(t.value, a) ? t.value.substring(o, a) : t.value.substr(o);
	      if (!1 === e.hasOwnProperty(i.toLowerCase())) return 0;
	    }

	    return ut(r, t.value, o) ? 0 : 1;
	  };
	}

	function ft(e) {
	  return "function" != typeof e && (e = function () {
	    return 0;
	  }), function (t, n, r) {
	    return null !== t && t.type === rt.Number && 0 === Number(t.value) ? 1 : e(t, n, r);
	  };
	}

	var gt,
	    bt = {
	  "ident-token": pt(rt.Ident),
	  "function-token": pt(rt.Function),
	  "at-keyword-token": pt(rt.AtKeyword),
	  "hash-token": pt(rt.Hash),
	  "string-token": pt(rt.String),
	  "bad-string-token": pt(rt.BadString),
	  "url-token": pt(rt.Url),
	  "bad-url-token": pt(rt.BadUrl),
	  "delim-token": pt(rt.Delim),
	  "number-token": pt(rt.Number),
	  "percentage-token": pt(rt.Percentage),
	  "dimension-token": pt(rt.Dimension),
	  "whitespace-token": pt(rt.WhiteSpace),
	  "CDO-token": pt(rt.CDO),
	  "CDC-token": pt(rt.CDC),
	  "colon-token": pt(rt.Colon),
	  "semicolon-token": pt(rt.Semicolon),
	  "comma-token": pt(rt.Comma),
	  "[-token": pt(rt.LeftSquareBracket),
	  "]-token": pt(rt.RightSquareBracket),
	  "(-token": pt(rt.LeftParenthesis),
	  ")-token": pt(rt.RightParenthesis),
	  "{-token": pt(rt.LeftCurlyBracket),
	  "}-token": pt(rt.RightCurlyBracket),
	  string: pt(rt.String),
	  ident: pt(rt.Ident),
	  "custom-ident": function (e) {
	    if (null === e || e.type !== rt.Ident) return 0;
	    var t = e.value.toLowerCase();
	    return lt(t, ot) || st(t, "default") ? 0 : 1;
	  },
	  "custom-property-name": function (e) {
	    return null === e || e.type !== rt.Ident || 45 !== it(e.value, 0) || 45 !== it(e.value, 1) ? 0 : 1;
	  },
	  "hex-color": function (e) {
	    if (null === e || e.type !== rt.Hash) return 0;
	    var t = e.value.length;
	    if (4 !== t && 5 !== t && 7 !== t && 9 !== t) return 0;

	    for (var n = 1; n < t; n++) if (!Je(e.value.charCodeAt(n))) return 0;

	    return 1;
	  },
	  "id-selector": function (e) {
	    return null === e || e.type !== rt.Hash ? 0 : Ze(it(e.value, 1), it(e.value, 2), it(e.value, 3)) ? 1 : 0;
	  },
	  "an-plus-b": function (e, t) {
	    var n = 0;
	    if (!e) return 0;
	    if (e.type === Ie) return _e(e, 0, !1, n);

	    if (e.type === Re && 45 === e.value.charCodeAt(0)) {
	      if (!Ee(e.value, 1, 110)) return 0;

	      switch (e.value.length) {
	        case 2:
	          return Fe(t(++n), n, t);

	        case 3:
	          return 45 !== e.value.charCodeAt(2) ? 0 : (n = je(t(++n), n, t), _e(e = t(n), 0, !0, n));

	        default:
	          return 45 !== e.value.charCodeAt(2) ? 0 : _e(e, 3, !0, n);
	      }
	    } else if (e.type === Re || Me(e, 43) && t(n + 1).type === Re) {
	      if (e.type !== Re && (e = t(++n)), null === e || !Ee(e.value, 0, 110)) return 0;

	      switch (e.value.length) {
	        case 1:
	          return Fe(t(++n), n, t);

	        case 2:
	          return 45 !== e.value.charCodeAt(1) ? 0 : (n = je(t(++n), n, t), _e(e = t(n), 0, !0, n));

	        default:
	          return 45 !== e.value.charCodeAt(1) ? 0 : _e(e, 2, !0, n);
	      }
	    } else if (e.type === Be) {
	      for (var r = e.value.charCodeAt(0), o = 43 === r || 45 === r ? 1 : 0, a = o; a < e.value.length && Pe(e.value.charCodeAt(a)); a++);

	      return a === o ? 0 : Ee(e.value, a, 110) ? a + 1 === e.value.length ? Fe(t(++n), n, t) : 45 !== e.value.charCodeAt(a + 1) ? 0 : a + 2 === e.value.length ? (n = je(t(++n), n, t), _e(e = t(n), 0, !0, n)) : _e(e, a + 2, !0, n) : 0;
	    }

	    return 0;
	  },
	  urange: function (e, t) {
	    var n = 0;
	    if (null === e || e.type !== Ye || !qe(e.value, 0, 117)) return 0;
	    if (null === (e = t(++n))) return 0;
	    if (Ge(e, 43)) return null === (e = t(++n)) ? 0 : e.type === Ye ? Qe(Xe(e, 0, !0), ++n, t) : Ge(e, 63) ? Qe(1, ++n, t) : 0;

	    if (e.type === He) {
	      if (!Ke(e, 43)) return 0;
	      var r = Xe(e, 1, !0);
	      return 0 === r ? 0 : null === (e = t(++n)) ? n : e.type === $e || e.type === He ? Ke(e, 45) && Xe(e, 1, !1) ? n + 1 : 0 : Qe(r, n, t);
	    }

	    return e.type === $e && Ke(e, 43) ? Qe(Xe(e, 1, !0), ++n, t) : 0;
	  },
	  "declaration-value": function (e, t) {
	    if (!e) return 0;
	    var n = 0,
	        r = 0,
	        o = e.index;

	    e: do {
	      switch (e.type) {
	        case rt.BadString:
	        case rt.BadUrl:
	          break e;

	        case rt.RightCurlyBracket:
	        case rt.RightParenthesis:
	        case rt.RightSquareBracket:
	          if (e.balance > e.index || e.balance < o) break e;
	          r--;
	          break;

	        case rt.Semicolon:
	          if (0 === r) break e;
	          break;

	        case rt.Delim:
	          if ("!" === e.value && 0 === r) break e;
	          break;

	        case rt.Function:
	        case rt.LeftParenthesis:
	        case rt.LeftSquareBracket:
	        case rt.LeftCurlyBracket:
	          r++;
	      }

	      if (n++, e.balance <= o) break;
	    } while (e = t(n));

	    return n;
	  },
	  "any-value": function (e, t) {
	    if (!e) return 0;
	    var n = e.index,
	        r = 0;

	    e: do {
	      switch (e.type) {
	        case rt.BadString:
	        case rt.BadUrl:
	          break e;

	        case rt.RightCurlyBracket:
	        case rt.RightParenthesis:
	        case rt.RightSquareBracket:
	          if (e.balance > e.index || e.balance < n) break e;
	      }

	      if (r++, e.balance <= n) break;
	    } while (e = t(r));

	    return r;
	  },
	  dimension: dt(mt(null)),
	  angle: dt(mt({
	    deg: !0,
	    grad: !0,
	    rad: !0,
	    turn: !0
	  })),
	  decibel: dt(mt({
	    db: !0
	  })),
	  frequency: dt(mt({
	    hz: !0,
	    khz: !0
	  })),
	  flex: dt(mt({
	    fr: !0
	  })),
	  length: dt(ft(mt({
	    px: !0,
	    mm: !0,
	    cm: !0,
	    in: !0,
	    pt: !0,
	    pc: !0,
	    q: !0,
	    em: !0,
	    ex: !0,
	    ch: !0,
	    rem: !0,
	    vh: !0,
	    vw: !0,
	    vmin: !0,
	    vmax: !0,
	    vm: !0
	  }))),
	  resolution: dt(mt({
	    dpi: !0,
	    dpcm: !0,
	    dppx: !0,
	    x: !0
	  })),
	  semitones: dt(mt({
	    st: !0
	  })),
	  time: dt(mt({
	    s: !0,
	    ms: !0
	  })),
	  percentage: dt(function (e, t, n) {
	    return null === e || e.type !== rt.Percentage || ut(n, e.value, e.value.length - 1) ? 0 : 1;
	  }),
	  zero: ft(),
	  number: dt(function (e, t, n) {
	    if (null === e) return 0;
	    var r = nt(e.value, 0);
	    return r === e.value.length || ct(e.value, r) ? ut(n, e.value, r) ? 0 : 1 : 0;
	  }),
	  integer: dt(function (e, t, n) {
	    if (null === e || e.type !== rt.Number) return 0;

	    for (var r = 43 === e.value.charCodeAt(0) || 45 === e.value.charCodeAt(0) ? 1 : 0; r < e.value.length; r++) if (!et(e.value.charCodeAt(r))) return 0;

	    return ut(n, e.value, r) ? 0 : 1;
	  }),
	  "-ms-legacy-expression": (gt = "expression", gt += "(", function (e, t) {
	    return null !== e && st(e.value, gt) ? ht(e, t) : 0;
	  })
	},
	    yt = function (e, t, n) {
	  var r = h("SyntaxError", e);
	  return r.input = t, r.offset = n, r.rawMessage = e, r.message = r.rawMessage + "\n  " + r.input + "\n--" + new window.Array((r.offset || r.input.length) + 1).join("-") + "^", r;
	},
	    kt = function (e) {
	  this.str = e, this.pos = 0;
	};

	kt.prototype = {
	  charCodeAt: function (e) {
	    return e < this.str.length ? this.str.charCodeAt(e) : 0;
	  },
	  charCode: function () {
	    return this.charCodeAt(this.pos);
	  },
	  nextCharCode: function () {
	    return this.charCodeAt(this.pos + 1);
	  },
	  nextNonWsCode: function (e) {
	    return this.charCodeAt(this.findWsEnd(e));
	  },
	  findWsEnd: function (e) {
	    for (; e < this.str.length; e++) {
	      var t = this.str.charCodeAt(e);
	      if (13 !== t && 10 !== t && 12 !== t && 32 !== t && 9 !== t) break;
	    }

	    return e;
	  },
	  substringToPos: function (e) {
	    return this.str.substring(this.pos, this.pos = e);
	  },
	  eat: function (e) {
	    this.charCode() !== e && this.error("Expect `" + String.fromCharCode(e) + "`"), this.pos++;
	  },
	  peek: function () {
	    return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
	  },
	  error: function (e) {
	    throw new yt(e, this.str, this.pos);
	  }
	};

	var vt = kt,
	    wt = function (e) {
	  for (var t = "function" == typeof Uint32Array ? new Uint32Array(128) : new window.Array(128), n = 0; n < 128; n++) t[n] = e(String.fromCharCode(n)) ? 1 : 0;

	  return t;
	}(function (e) {
	  return /[a-zA-Z0-9\-]/.test(e);
	}),
	    xt = {
	  " ": 1,
	  "&&": 2,
	  "||": 3,
	  "|": 4
	};

	function St(e) {
	  return e.substringToPos(e.findWsEnd(e.pos));
	}

	function Ct(e) {
	  for (var t = e.pos; t < e.str.length; t++) {
	    var n = e.str.charCodeAt(t);
	    if (n >= 128 || 0 === wt[n]) break;
	  }

	  return e.pos === t && e.error("Expect a keyword"), e.substringToPos(t);
	}

	function At(e) {
	  for (var t = e.pos; t < e.str.length; t++) {
	    var n = e.str.charCodeAt(t);
	    if (n < 48 || n > 57) break;
	  }

	  return e.pos === t && e.error("Expect a number"), e.substringToPos(t);
	}

	function Tt(e) {
	  var t = e.str.indexOf("'", e.pos + 1);
	  return -1 === t && (e.pos = e.str.length, e.error("Expect an apostrophe")), e.substringToPos(t + 1);
	}

	function zt(e) {
	  var t,
	      n = null;
	  return e.eat(123), t = At(e), 44 === e.charCode() ? (e.pos++, 125 !== e.charCode() && (n = At(e))) : n = t, e.eat(125), {
	    min: Number(t),
	    max: n ? Number(n) : 0
	  };
	}

	function Pt(e, t) {
	  var n = function (e) {
	    var t = null,
	        n = !1;

	    switch (e.charCode()) {
	      case 42:
	        e.pos++, t = {
	          min: 0,
	          max: 0
	        };
	        break;

	      case 43:
	        e.pos++, t = {
	          min: 1,
	          max: 0
	        };
	        break;

	      case 63:
	        e.pos++, t = {
	          min: 0,
	          max: 1
	        };
	        break;

	      case 35:
	        e.pos++, n = !0, t = 123 === e.charCode() ? zt(e) : {
	          min: 1,
	          max: 0
	        };
	        break;

	      case 123:
	        t = zt(e);
	        break;

	      default:
	        return null;
	    }

	    return {
	      type: "Multiplier",
	      comma: n,
	      min: t.min,
	      max: t.max,
	      term: null
	    };
	  }(e);

	  return null !== n ? (n.term = t, n) : t;
	}

	function Et(e) {
	  var t = e.peek();
	  return "" === t ? null : {
	    type: "Token",
	    value: t
	  };
	}

	function Lt(e) {
	  var t,
	      n = null;
	  return e.eat(60), t = Ct(e), 40 === e.charCode() && 41 === e.nextCharCode() && (e.pos += 2, t += "()"), 91 === e.charCodeAt(e.findWsEnd(e.pos)) && (St(e), n = function (e) {
	    var t = null,
	        n = null,
	        r = 1;
	    return e.eat(91), 45 === e.charCode() && (e.peek(), r = -1), -1 == r && 8734 === e.charCode() ? e.peek() : t = r * Number(At(e)), St(e), e.eat(44), St(e), 8734 === e.charCode() ? e.peek() : (r = 1, 45 === e.charCode() && (e.peek(), r = -1), n = r * Number(At(e))), e.eat(93), null === t && null === n ? null : {
	      type: "Range",
	      min: t,
	      max: n
	    };
	  }(e)), e.eat(62), Pt(e, {
	    type: "Type",
	    name: t,
	    opts: n
	  });
	}

	function Ot(e, t) {
	  function n(e, t) {
	    return {
	      type: "Group",
	      terms: e,
	      combinator: t,
	      disallowEmpty: !1,
	      explicit: !1
	    };
	  }

	  for (t = window.Object.keys(t).sort(function (e, t) {
	    return xt[e] - xt[t];
	  }); t.length > 0;) {
	    for (var r = t.shift(), o = 0, a = 0; o < e.length; o++) {
	      var i = e[o];
	      "Combinator" === i.type && (i.value === r ? (-1 === a && (a = o - 1), e.splice(o, 1), o--) : (-1 !== a && o - a > 1 && (e.splice(a, o - a, n(e.slice(a, o), r)), o = a + 1), a = -1));
	    }

	    -1 !== a && t.length && e.splice(a, o - a, n(e.slice(a, o), r));
	  }

	  return r;
	}

	function Dt(e) {
	  for (var t, n = [], r = {}, o = null, a = e.pos; t = Nt(e);) "Spaces" !== t.type && ("Combinator" === t.type ? (null !== o && "Combinator" !== o.type || (e.pos = a, e.error("Unexpected combinator")), r[t.value] = !0) : null !== o && "Combinator" !== o.type && (r[" "] = !0, n.push({
	    type: "Combinator",
	    value: " "
	  })), n.push(t), o = t, a = e.pos);

	  return null !== o && "Combinator" === o.type && (e.pos -= a, e.error("Unexpected combinator")), {
	    type: "Group",
	    terms: n,
	    combinator: Ot(n, r) || " ",
	    disallowEmpty: !1,
	    explicit: !1
	  };
	}

	function Nt(e) {
	  var t = e.charCode();
	  if (t < 128 && 1 === wt[t]) return function (e) {
	    var t;
	    return t = Ct(e), 40 === e.charCode() ? (e.pos++, {
	      type: "Function",
	      name: t
	    }) : Pt(e, {
	      type: "Keyword",
	      name: t
	    });
	  }(e);

	  switch (t) {
	    case 93:
	      break;

	    case 91:
	      return Pt(e, function (e) {
	        var t;
	        return e.eat(91), t = Dt(e), e.eat(93), t.explicit = !0, 33 === e.charCode() && (e.pos++, t.disallowEmpty = !0), t;
	      }(e));

	    case 60:
	      return 39 === e.nextCharCode() ? function (e) {
	        var t;
	        return e.eat(60), e.eat(39), t = Ct(e), e.eat(39), e.eat(62), Pt(e, {
	          type: "Property",
	          name: t
	        });
	      }(e) : Lt(e);

	    case 124:
	      return {
	        type: "Combinator",
	        value: e.substringToPos(124 === e.nextCharCode() ? e.pos + 2 : e.pos + 1)
	      };

	    case 38:
	      return e.pos++, e.eat(38), {
	        type: "Combinator",
	        value: "&&"
	      };

	    case 44:
	      return e.pos++, {
	        type: "Comma"
	      };

	    case 39:
	      return Pt(e, {
	        type: "String",
	        value: Tt(e)
	      });

	    case 32:
	    case 9:
	    case 10:
	    case 13:
	    case 12:
	      return {
	        type: "Spaces",
	        value: St(e)
	      };

	    case 64:
	      return (t = e.nextCharCode()) < 128 && 1 === wt[t] ? (e.pos++, {
	        type: "AtKeyword",
	        name: Ct(e)
	      }) : Et(e);

	    case 42:
	    case 43:
	    case 63:
	    case 35:
	    case 33:
	      break;

	    case 123:
	      if ((t = e.nextCharCode()) < 48 || t > 57) return Et(e);
	      break;

	    default:
	      return Et(e);
	  }
	}

	function Rt(e) {
	  var t = new vt(e),
	      n = Dt(t);
	  return t.pos !== e.length && t.error("Unexpected input"), 1 === n.terms.length && "Group" === n.terms[0].type && (n = n.terms[0]), n;
	}

	Rt("[a&&<b>#|<'c'>*||e() f{2} /,(% g#{1,2} h{2,})]!");

	var It = Rt,
	    Bt = function () {};

	function Mt(e) {
	  return "function" == typeof e ? e : Bt;
	}

	var jt = function (e, t, n) {
	  var r = Bt,
	      o = Bt;
	  if ("function" == typeof t ? r = t : t && (r = Mt(t.enter), o = Mt(t.leave)), r === Bt && o === Bt) throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
	  !function e(t) {
	    switch (r.call(n, t), t.type) {
	      case "Group":
	        t.terms.forEach(e);
	        break;

	      case "Multiplier":
	        e(t.term);
	        break;

	      case "Type":
	      case "Property":
	      case "Keyword":
	      case "AtKeyword":
	      case "Function":
	      case "String":
	      case "Token":
	      case "Comma":
	        break;

	      default:
	        throw new Error("Unknown type: " + t.type);
	    }

	    o.call(n, t);
	  }(e);
	},
	    _t = new X(),
	    Ft = {
	  decorator: function (e) {
	    var t = null,
	        n = {
	      len: 0,
	      node: null
	    },
	        r = [n],
	        o = "";
	    return {
	      children: e.children,
	      node: function (n) {
	        var r = t;
	        t = n, e.node.call(this, n), t = r;
	      },
	      chunk: function (e) {
	        o += e, n.node !== t ? r.push({
	          len: e.length,
	          node: t
	        }) : n.len += e.length;
	      },
	      result: function () {
	        return Ut(o, r);
	      }
	    };
	  }
	};

	function Ut(e, t) {
	  var n = [],
	      r = 0,
	      o = 0,
	      a = t ? t[o].node : null;

	  for (ze(e, _t); !_t.eof;) {
	    if (t) for (; o < t.length && r + t[o].len <= _t.tokenStart;) r += t[o++].len, a = t[o].node;
	    n.push({
	      type: _t.tokenType,
	      value: _t.getTokenValue(),
	      index: _t.tokenIndex,
	      balance: _t.balance[_t.tokenIndex],
	      node: a
	    }), _t.next();
	  }

	  return n;
	}

	var qt = {
	  type: "Match"
	},
	    Wt = {
	  type: "Mismatch"
	},
	    Yt = {
	  type: "DisallowEmpty"
	};

	function Vt(e, t, n) {
	  return t === qt && n === Wt || e === qt && t === qt && n === qt ? e : ("If" === e.type && e.else === Wt && t === qt && (t = e.then, e = e.match), {
	    type: "If",
	    match: e,
	    then: t,
	    else: n
	  });
	}

	function Ht(e) {
	  return e.length > 2 && 40 === e.charCodeAt(e.length - 2) && 41 === e.charCodeAt(e.length - 1);
	}

	function $t(e) {
	  return "Keyword" === e.type || "AtKeyword" === e.type || "Function" === e.type || "Type" === e.type && Ht(e.name);
	}

	function Gt(e) {
	  if ("function" == typeof e) return {
	    type: "Generic",
	    fn: e
	  };

	  switch (e.type) {
	    case "Group":
	      var t = function e(t, n, r) {
	        switch (t) {
	          case " ":
	            for (var o = qt, a = n.length - 1; a >= 0; a--) {
	              o = Vt(l = n[a], o, Wt);
	            }

	            return o;

	          case "|":
	            o = Wt;
	            var i = null;

	            for (a = n.length - 1; a >= 0; a--) {
	              if ($t(l = n[a]) && (null === i && a > 0 && $t(n[a - 1]) && (o = Vt({
	                type: "Enum",
	                map: i = window.Object.create(null)
	              }, qt, o)), null !== i)) {
	                var s = (Ht(l.name) ? l.name.slice(0, -1) : l.name).toLowerCase();

	                if (s in i == !1) {
	                  i[s] = l;
	                  continue;
	                }
	              }

	              i = null, o = Vt(l, qt, o);
	            }

	            return o;

	          case "&&":
	            if (n.length > 5) return {
	              type: "MatchOnce",
	              terms: n,
	              all: !0
	            };

	            for (o = Wt, a = n.length - 1; a >= 0; a--) {
	              var l = n[a];
	              c = n.length > 1 ? e(t, n.filter(function (e) {
	                return e !== l;
	              }), !1) : qt, o = Vt(l, c, o);
	            }

	            return o;

	          case "||":
	            if (n.length > 5) return {
	              type: "MatchOnce",
	              terms: n,
	              all: !1
	            };

	            for (o = r ? qt : Wt, a = n.length - 1; a >= 0; a--) {
	              var c;
	              l = n[a];
	              c = n.length > 1 ? e(t, n.filter(function (e) {
	                return e !== l;
	              }), !0) : qt, o = Vt(l, c, o);
	            }

	            return o;
	        }
	      }(e.combinator, e.terms.map(Gt), !1);

	      return e.disallowEmpty && (t = Vt(t, Yt, Wt)), t;

	    case "Multiplier":
	      return function (e) {
	        var t = qt,
	            n = Gt(e.term);
	        if (0 === e.max) n = Vt(n, Yt, Wt), (t = Vt(n, null, Wt)).then = Vt(qt, qt, t), e.comma && (t.then.else = Vt({
	          type: "Comma",
	          syntax: e
	        }, t, Wt));else for (var r = e.min || 1; r <= e.max; r++) e.comma && t !== qt && (t = Vt({
	          type: "Comma",
	          syntax: e
	        }, t, Wt)), t = Vt(n, Vt(qt, qt, t), Wt);
	        if (0 === e.min) t = Vt(qt, qt, t);else for (r = 0; r < e.min - 1; r++) e.comma && t !== qt && (t = Vt({
	          type: "Comma",
	          syntax: e
	        }, t, Wt)), t = Vt(n, t, Wt);
	        return t;
	      }(e);

	    case "Type":
	    case "Property":
	      return {
	        type: e.type,
	        name: e.name,
	        syntax: e
	      };

	    case "Keyword":
	      return {
	        type: e.type,
	        name: e.name.toLowerCase(),
	        syntax: e
	      };

	    case "AtKeyword":
	      return {
	        type: e.type,
	        name: "@" + e.name.toLowerCase(),
	        syntax: e
	      };

	    case "Function":
	      return {
	        type: e.type,
	        name: e.name.toLowerCase() + "(",
	        syntax: e
	      };

	    case "String":
	      return 3 === e.value.length ? {
	        type: "Token",
	        value: e.value.charAt(1),
	        syntax: e
	      } : {
	        type: e.type,
	        value: e.value.substr(1, e.value.length - 2).replace(/\\'/g, "'"),
	        syntax: e
	      };

	    case "Token":
	      return {
	        type: e.type,
	        value: e.value,
	        syntax: e
	      };

	    case "Comma":
	      return {
	        type: e.type,
	        syntax: e
	      };

	    default:
	      throw new Error("Unknown node type:", e.type);
	  }
	}

	var Kt = qt,
	    Xt = Wt,
	    Qt = Yt,
	    Zt = function (e, t) {
	  return "string" == typeof e && (e = It(e)), {
	    type: "MatchGraph",
	    match: Gt(e),
	    syntax: t || null,
	    source: e
	  };
	},
	    Jt = window.Object.prototype.hasOwnProperty,
	    en = Kt,
	    tn = Xt,
	    nn = Qt,
	    rn = g.TYPE;

	function on(e) {
	  for (var t = null, n = null, r = e; null !== r;) n = r.prev, r.prev = t, t = r, r = n;

	  return t;
	}

	function an(e, t) {
	  if (e.length !== t.length) return !1;

	  for (var n = 0; n < e.length; n++) {
	    var r = e.charCodeAt(n);
	    if (r >= 65 && r <= 90 && (r |= 32), r !== t.charCodeAt(n)) return !1;
	  }

	  return !0;
	}

	function sn(e) {
	  return null === e || e.type === rn.Comma || e.type === rn.Function || e.type === rn.LeftParenthesis || e.type === rn.LeftSquareBracket || e.type === rn.LeftCurlyBracket || e.type === rn.Delim;
	}

	function ln(e) {
	  return null === e || e.type === rn.RightParenthesis || e.type === rn.RightSquareBracket || e.type === rn.RightCurlyBracket || e.type === rn.Delim;
	}

	function cn(e, t, n) {
	  function r() {
	    do {
	      b++, g = b < e.length ? e[b] : null;
	    } while (null !== g && (g.type === rn.WhiteSpace || g.type === rn.Comment));
	  }

	  function o(t) {
	    var n = b + t;
	    return n < e.length ? e[n] : null;
	  }

	  function a(e, t) {
	    return {
	      nextState: e,
	      matchStack: k,
	      syntaxStack: u,
	      thenStack: h,
	      tokenIndex: b,
	      prev: t
	    };
	  }

	  function i(e) {
	    h = {
	      nextState: e,
	      matchStack: k,
	      syntaxStack: u,
	      prev: h
	    };
	  }

	  function s(e) {
	    d = a(e, d);
	  }

	  function l() {
	    k = {
	      type: 1,
	      syntax: t.syntax,
	      token: g,
	      prev: k
	    }, r(), p = null, b > y && (y = b);
	  }

	  function c() {
	    k = 2 === k.type ? k.prev : {
	      type: 3,
	      syntax: u.syntax,
	      token: k.token,
	      prev: k
	    }, u = u.prev;
	  }

	  var u = null,
	      h = null,
	      d = null,
	      p = null,
	      m = 0,
	      f = null,
	      g = null,
	      b = -1,
	      y = 0,
	      k = {
	    type: 0,
	    syntax: null,
	    token: null,
	    prev: null
	  };

	  for (r(); null === f && ++m < 15e3;) switch (t.type) {
	    case "Match":
	      if (null === h) {
	        if (null !== g && (b !== e.length - 1 || "\\0" !== g.value && "\\9" !== g.value)) {
	          t = tn;
	          break;
	        }

	        f = "Match";
	        break;
	      }

	      if ((t = h.nextState) === nn) {
	        if (h.matchStack === k) {
	          t = tn;
	          break;
	        }

	        t = en;
	      }

	      for (; h.syntaxStack !== u;) c();

	      h = h.prev;
	      break;

	    case "Mismatch":
	      if (null !== p && !1 !== p) (null === d || b > d.tokenIndex) && (d = p, p = !1);else if (null === d) {
	        f = "Mismatch";
	        break;
	      }
	      t = d.nextState, h = d.thenStack, u = d.syntaxStack, k = d.matchStack, b = d.tokenIndex, g = b < e.length ? e[b] : null, d = d.prev;
	      break;

	    case "MatchGraph":
	      t = t.match;
	      break;

	    case "If":
	      t.else !== tn && s(t.else), t.then !== en && i(t.then), t = t.match;
	      break;

	    case "MatchOnce":
	      t = {
	        type: "MatchOnceBuffer",
	        syntax: t,
	        index: 0,
	        mask: 0
	      };
	      break;

	    case "MatchOnceBuffer":
	      var v = t.syntax.terms;

	      if (t.index === v.length) {
	        if (0 === t.mask || t.syntax.all) {
	          t = tn;
	          break;
	        }

	        t = en;
	        break;
	      }

	      if (t.mask === (1 << v.length) - 1) {
	        t = en;
	        break;
	      }

	      for (; t.index < v.length; t.index++) {
	        var w = 1 << t.index;

	        if (0 == (t.mask & w)) {
	          s(t), i({
	            type: "AddMatchOnce",
	            syntax: t.syntax,
	            mask: t.mask | w
	          }), t = v[t.index++];
	          break;
	        }
	      }

	      break;

	    case "AddMatchOnce":
	      t = {
	        type: "MatchOnceBuffer",
	        syntax: t.syntax,
	        index: 0,
	        mask: t.mask
	      };
	      break;

	    case "Enum":
	      if (null !== g) if (-1 !== (T = g.value.toLowerCase()).indexOf("\\") && (T = T.replace(/\\[09].*$/, "")), Jt.call(t.map, T)) {
	        t = t.map[T];
	        break;
	      }
	      t = tn;
	      break;

	    case "Generic":
	      var x = null !== u ? u.opts : null,
	          S = b + Math.floor(t.fn(g, o, x));

	      if (!isNaN(S) && S > b) {
	        for (; b < S;) l();

	        t = en;
	      } else t = tn;

	      break;

	    case "Type":
	    case "Property":
	      var C = "Type" === t.type ? "types" : "properties",
	          A = Jt.call(n, C) ? n[C][t.name] : null;
	      if (!A || !A.match) throw new Error("Bad syntax reference: " + ("Type" === t.type ? "<" + t.name + ">" : "<'" + t.name + "'>"));
	      if (!1 !== p && null !== g && "Type" === t.type) if ("custom-ident" === t.name && g.type === rn.Ident || "length" === t.name && "0" === g.value) {
	        null === p && (p = a(t, d)), t = tn;
	        break;
	      }
	      u = {
	        syntax: t.syntax,
	        opts: t.syntax.opts || null !== u && u.opts || null,
	        prev: u
	      }, k = {
	        type: 2,
	        syntax: t.syntax,
	        token: k.token,
	        prev: k
	      }, t = A.match;
	      break;

	    case "Keyword":
	      var T = t.name;

	      if (null !== g) {
	        var z = g.value;

	        if (-1 !== z.indexOf("\\") && (z = z.replace(/\\[09].*$/, "")), an(z, T)) {
	          l(), t = en;
	          break;
	        }
	      }

	      t = tn;
	      break;

	    case "AtKeyword":
	    case "Function":
	      if (null !== g && an(g.value, t.name)) {
	        l(), t = en;
	        break;
	      }

	      t = tn;
	      break;

	    case "Token":
	      if (null !== g && g.value === t.value) {
	        l(), t = en;
	        break;
	      }

	      t = tn;
	      break;

	    case "Comma":
	      null !== g && g.type === rn.Comma ? sn(k.token) ? t = tn : (l(), t = ln(g) ? tn : en) : t = sn(k.token) || ln(g) ? en : tn;
	      break;

	    case "String":
	      var P = "";

	      for (S = b; S < e.length && P.length < t.value.length; S++) P += e[S].value;

	      if (an(P, t.value)) {
	        for (; b < S;) l();

	        t = en;
	      } else t = tn;

	      break;

	    default:
	      throw new Error("Unknown node type: " + t.type);
	  }

	  switch (f) {
	    case null:
	      console.warn("[csstree-match] BREAK after 15000 iterations"), f = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)", k = null;
	      break;

	    case "Match":
	      for (; null !== u;) c();

	      break;

	    default:
	      k = null;
	  }

	  return {
	    tokens: e,
	    reason: f,
	    iterations: m,
	    match: k,
	    longestMatch: y
	  };
	}

	var un = function (e, t, n) {
	  var r = cn(e, t, n || {});
	  if (null === r.match) return r;
	  var o = r.match,
	      a = r.match = {
	    syntax: t.syntax || null,
	    match: []
	  },
	      i = [a];

	  for (o = on(o).prev; null !== o;) {
	    switch (o.type) {
	      case 2:
	        a.match.push(a = {
	          syntax: o.syntax,
	          match: []
	        }), i.push(a);
	        break;

	      case 3:
	        i.pop(), a = i[i.length - 1];
	        break;

	      default:
	        a.match.push({
	          syntax: o.syntax || null,
	          token: o.token.value,
	          node: o.token.node
	        });
	    }

	    o = o.prev;
	  }

	  return r;
	};

	function hn(e) {
	  function t(e) {
	    return null !== e && ("Type" === e.type || "Property" === e.type || "Keyword" === e.type);
	  }

	  var n = null;
	  return null !== this.matched && function r(o) {
	    if (window.Array.isArray(o.match)) {
	      for (var a = 0; a < o.match.length; a++) if (r(o.match[a])) return t(o.syntax) && n.unshift(o.syntax), !0;
	    } else if (o.node === e) return n = t(o.syntax) ? [o.syntax] : [], !0;

	    return !1;
	  }(this.matched), n;
	}

	function dn(e, t, n) {
	  var r = hn.call(e, t);
	  return null !== r && r.some(n);
	}

	var pn = {
	  getTrace: hn,
	  isType: function (e, t) {
	    return dn(this, e, function (e) {
	      return "Type" === e.type && e.name === t;
	    });
	  },
	  isProperty: function (e, t) {
	    return dn(this, e, function (e) {
	      return "Property" === e.type && e.name === t;
	    });
	  },
	  isKeyword: function (e) {
	    return dn(this, e, function (e) {
	      return "Keyword" === e.type;
	    });
	  }
	};
	var mn = {
	  matchFragments: function (e, t, n, r, o) {
	    var a = [];
	    return null !== n.matched && function n(i) {
	      if (null !== i.syntax && i.syntax.type === r && i.syntax.name === o) {
	        var s = function e(t) {
	          return "node" in t ? t.node : e(t.match[0]);
	        }(i),
	            l = function e(t) {
	          return "node" in t ? t.node : e(t.match[t.match.length - 1]);
	        }(i);

	        e.syntax.walk(t, function (e, t, n) {
	          if (e === s) {
	            var r = new u();

	            do {
	              if (r.appendData(t.data), t.data === l) break;
	              t = t.next;
	            } while (null !== t);

	            a.push({
	              parent: n,
	              nodes: r
	            });
	          }
	        });
	      }

	      window.Array.isArray(i.match) && i.match.forEach(n);
	    }(n.matched), a;
	  }
	},
	    fn = window.Object.prototype.hasOwnProperty;

	function gn(e) {
	  return "number" == typeof e && isFinite(e) && Math.floor(e) === e && e >= 0;
	}

	function bn(e) {
	  return Boolean(e) && gn(e.offset) && gn(e.line) && gn(e.column);
	}

	function yn(e, t) {
	  return function (n, r) {
	    if (!n || n.constructor !== window.Object) return r(n, "Type of node should be an window.Object");

	    for (var o in n) {
	      var a = !0;

	      if (!1 !== fn.call(n, o)) {
	        if ("type" === o) n.type !== e && r(n, "Wrong node type `" + n.type + "`, expected `" + e + "`");else if ("loc" === o) {
	          if (null === n.loc) continue;
	          if (n.loc && n.loc.constructor === window.Object) if ("string" != typeof n.loc.source) o += ".source";else if (bn(n.loc.start)) {
	            if (bn(n.loc.end)) continue;
	            o += ".end";
	          } else o += ".start";
	          a = !1;
	        } else if (t.hasOwnProperty(o)) {
	          var i = 0;

	          for (a = !1; !a && i < t[o].length; i++) {
	            var s = t[o][i];

	            switch (s) {
	              case String:
	                a = "string" == typeof n[o];
	                break;

	              case Boolean:
	                a = "boolean" == typeof n[o];
	                break;

	              case null:
	                a = null === n[o];
	                break;

	              default:
	                "string" == typeof s ? a = n[o] && n[o].type === s : window.Array.isArray(s) && (a = n[o] instanceof u);
	            }
	          }
	        } else r(n, "Unknown field `" + o + "` for " + e + " node type");
	        a || r(n, "Bad value for `" + e + "." + o + "`");
	      }
	    }

	    for (var o in t) fn.call(t, o) && !1 === fn.call(n, o) && r(n, "Field `" + e + "." + o + "` is missed");
	  };
	}

	function kn(e, t) {
	  var n = t.structure,
	      r = {
	    type: String,
	    loc: !0
	  },
	      o = {
	    type: '"' + e + '"'
	  };

	  for (var a in n) if (!1 !== fn.call(n, a)) {
	    for (var i = [], s = r[a] = window.Array.isArray(n[a]) ? n[a].slice() : [n[a]], l = 0; l < s.length; l++) {
	      var c = s[l];
	      if (c === String || c === Boolean) i.push(c.name);else if (null === c) i.push("null");else if ("string" == typeof c) i.push("<" + c + ">");else {
	        if (!Array.isArray(c)) throw new Error("Wrong value `" + c + "` in `" + e + "." + a + "` structure definition");
	        i.push("List");
	      }
	    }

	    o[a] = i.join(" | ");
	  }

	  return {
	    docs: o,
	    check: yn(e, r)
	  };
	}

	var vn = te,
	    wn = ne,
	    xn = Zt,
	    Sn = un,
	    Cn = function (e) {
	  var t = {};
	  if (e.node) for (var n in e.node) if (fn.call(e.node, n)) {
	    var r = e.node[n];
	    if (!r.structure) throw new Error("Missed `structure` field in `" + n + "` node type definition");
	    t[n] = kn(n, r);
	  }
	  return t;
	},
	    An = xn("inherit | initial | unset"),
	    Tn = xn("inherit | initial | unset | <-ms-legacy-expression>");

	function zn(e, t, n) {
	  var r = {};

	  for (var o in e) e[o].syntax && (r[o] = n ? e[o].syntax : J(e[o].syntax, {
	    compact: t
	  }));

	  return r;
	}

	function Pn(e, t, n) {
	  return {
	    matched: e,
	    iterations: n,
	    error: t,
	    getTrace: pn.getTrace,
	    isType: pn.isType,
	    isProperty: pn.isProperty,
	    isKeyword: pn.isKeyword
	  };
	}

	function En(e, t, n, r) {
	  var o,
	      a = function (e, t) {
	    return "string" == typeof e ? Ut(e, null) : t.generate(e, Ft);
	  }(n, e.syntax);

	  return function (e) {
	    for (var t = 0; t < e.length; t++) if ("var(" === e[t].value.toLowerCase()) return !0;

	    return !1;
	  }(a) ? Pn(null, new Error("Matching for a tree with var() is not supported")) : (r && (o = Sn(a, e.valueCommonSyntax, e)), r && o.match || (o = Sn(a, t.match, e)).match ? Pn(o.match, null, o.iterations) : Pn(null, new wn(o.reason, t.syntax, n, o), o.iterations));
	}

	var Ln = function (e, t, n) {
	  if (this.valueCommonSyntax = An, this.syntax = t, this.generic = !1, this.atrules = {}, this.properties = {}, this.types = {}, this.structure = n || Cn(e), e) {
	    if (e.types) for (var r in e.types) this.addType_(r, e.types[r]);
	    if (e.generic) for (var r in this.generic = !0, bt) this.addType_(r, bt[r]);
	    if (e.atrules) for (var r in e.atrules) this.addAtrule_(r, e.atrules[r]);
	    if (e.properties) for (var r in e.properties) this.addProperty_(r, e.properties[r]);
	  }
	};

	Ln.prototype = {
	  structure: {},
	  checkStructure: function (e) {
	    function t(e, t) {
	      r.push({
	        node: e,
	        message: t
	      });
	    }

	    var n = this.structure,
	        r = [];
	    return this.syntax.walk(e, function (e) {
	      n.hasOwnProperty(e.type) ? n[e.type].check(e, t) : t(e, "Unknown node type `" + e.type + "`");
	    }), !!r.length && r;
	  },
	  createDescriptor: function (e, t, n) {
	    var r = {
	      type: t,
	      name: n
	    },
	        o = {
	      type: t,
	      name: n,
	      syntax: null,
	      match: null
	    };
	    return "function" == typeof e ? o.match = xn(e, r) : ("string" == typeof e ? window.Object.defineProperty(o, "syntax", {
	      get: function () {
	        return window.Object.defineProperty(o, "syntax", {
	          value: It(e)
	        }), o.syntax;
	      }
	    }) : o.syntax = e, window.Object.defineProperty(o, "match", {
	      get: function () {
	        return window.Object.defineProperty(o, "match", {
	          value: xn(o.syntax, r)
	        }), o.match;
	      }
	    })), o;
	  },
	  addAtrule_: function (e, t) {
	    this.atrules[e] = {
	      prelude: t.prelude ? this.createDescriptor(t.prelude, "AtrulePrelude", e) : null,
	      descriptors: t.descriptors ? window.Object.keys(t.descriptors).reduce((e, n) => (e[n] = this.createDescriptor(t.descriptors[n], "AtruleDescriptor", n), e), {}) : null
	    };
	  },
	  addProperty_: function (e, t) {
	    this.properties[e] = this.createDescriptor(t, "Property", e);
	  },
	  addType_: function (e, t) {
	    this.types[e] = this.createDescriptor(t, "Type", e), t === bt["-ms-legacy-expression"] && (this.valueCommonSyntax = Tn);
	  },
	  matchAtrulePrelude: function (e, t) {
	    var n = le.keyword(e),
	        r = n.vendor ? this.getAtrulePrelude(n.name) || this.getAtrulePrelude(n.basename) : this.getAtrulePrelude(n.name);
	    return r ? En(this, r, t, !0) : n.basename in this.atrules ? Pn(null, new Error("At-rule `" + e + "` should not contain a prelude")) : Pn(null, new vn("Unknown at-rule", e));
	  },
	  matchAtruleDescriptor: function (e, t, n) {
	    var r = le.keyword(e),
	        o = le.keyword(t),
	        a = r.vendor ? this.atrules[r.name] || this.atrules[r.basename] : this.atrules[r.name];
	    if (!a) return Pn(null, new vn("Unknown at-rule", e));
	    if (!a.descriptors) return Pn(null, new Error("At-rule `" + e + "` has no known descriptors"));
	    var i = o.vendor ? a.descriptors[o.name] || a.descriptors[o.basename] : a.descriptors[o.name];
	    return i ? En(this, i, n, !0) : Pn(null, new vn("Unknown at-rule descriptor", t));
	  },
	  matchDeclaration: function (e) {
	    return "Declaration" !== e.type ? Pn(null, new Error("Not a Declaration node")) : this.matchProperty(e.property, e.value);
	  },
	  matchProperty: function (e, t) {
	    var n = le.property(e);
	    if (n.custom) return Pn(null, new Error("Lexer matching doesn't applicable for custom properties"));
	    var r = n.vendor ? this.getProperty(n.name) || this.getProperty(n.basename) : this.getProperty(n.name);
	    return r ? En(this, r, t, !0) : Pn(null, new vn("Unknown property", e));
	  },
	  matchType: function (e, t) {
	    var n = this.getType(e);
	    return n ? En(this, n, t, !1) : Pn(null, new vn("Unknown type", e));
	  },
	  match: function (e, t) {
	    return "string" == typeof e || e && e.type ? ("string" != typeof e && e.match || (e = this.createDescriptor(e, "Type", "anonymous")), En(this, e, t, !1)) : Pn(null, new vn("Bad syntax"));
	  },
	  findValueFragments: function (e, t, n, r) {
	    return mn.matchFragments(this, t, this.matchProperty(e, t), n, r);
	  },
	  findDeclarationValueFragments: function (e, t, n) {
	    return mn.matchFragments(this, e.value, this.matchDeclaration(e), t, n);
	  },
	  findAllFragments: function (e, t, n) {
	    var r = [];
	    return this.syntax.walk(e, {
	      visit: "Declaration",
	      enter: function (e) {
	        r.push.apply(r, this.findDeclarationValueFragments(e, t, n));
	      }.bind(this)
	    }), r;
	  },
	  getAtrulePrelude: function (e) {
	    return this.atrules.hasOwnProperty(e) ? this.atrules[e].prelude : null;
	  },
	  getAtruleDescriptor: function (e, t) {
	    return this.atrules.hasOwnProperty(e) && this.atrules.declarators && this.atrules[e].declarators[t] || null;
	  },
	  getProperty: function (e) {
	    return this.properties.hasOwnProperty(e) ? this.properties[e] : null;
	  },
	  getType: function (e) {
	    return this.types.hasOwnProperty(e) ? this.types[e] : null;
	  },
	  validate: function () {
	    function e(r, o, a, i) {
	      if (a.hasOwnProperty(o)) return a[o];
	      a[o] = !1, null !== i.syntax && jt(i.syntax, function (i) {
	        if ("Type" === i.type || "Property" === i.type) {
	          var s = "Type" === i.type ? r.types : r.properties,
	              l = "Type" === i.type ? t : n;
	          s.hasOwnProperty(i.name) && !e(r, i.name, l, s[i.name]) || (a[o] = !0);
	        }
	      }, this);
	    }

	    var t = {},
	        n = {};

	    for (var r in this.types) e(this, r, t, this.types[r]);

	    for (var r in this.properties) e(this, r, n, this.properties[r]);

	    return t = window.Object.keys(t).filter(function (e) {
	      return t[e];
	    }), n = window.Object.keys(n).filter(function (e) {
	      return n[e];
	    }), t.length || n.length ? {
	      types: t,
	      properties: n
	    } : null;
	  },
	  dump: function (e, t) {
	    return {
	      generic: this.generic,
	      types: zn(this.types, !t, e),
	      properties: zn(this.properties, !t, e)
	    };
	  },
	  toString: function () {
	    return JSON.stringify(this.dump());
	  }
	};
	var On = Ln,
	    Dn = {
	  SyntaxError: yt,
	  parse: It,
	  generate: J,
	  walk: jt
	},
	    Nn = ze.isBOM;

	var Rn = function () {
	  this.lines = null, this.columns = null, this.linesAndColumnsComputed = !1;
	};

	Rn.prototype = {
	  setSource: function (e, t, n, r) {
	    this.source = e, this.startOffset = void 0 === t ? 0 : t, this.startLine = void 0 === n ? 1 : n, this.startColumn = void 0 === r ? 1 : r, this.linesAndColumnsComputed = !1;
	  },
	  ensureLinesAndColumnsComputed: function () {
	    this.linesAndColumnsComputed || (!function (e, t) {
	      for (var n = t.length, r = ue(e.lines, n), o = e.startLine, a = ue(e.columns, n), i = e.startColumn, s = t.length > 0 ? Nn(t.charCodeAt(0)) : 0; s < n; s++) {
	        var l = t.charCodeAt(s);
	        r[s] = o, a[s] = i++, 10 !== l && 13 !== l && 12 !== l || (13 === l && s + 1 < n && 10 === t.charCodeAt(s + 1) && (r[++s] = o, a[s] = i), o++, i = 1);
	      }

	      r[s] = o, a[s] = i, e.lines = r, e.columns = a;
	    }(this, this.source), this.linesAndColumnsComputed = !0);
	  },
	  getLocation: function (e, t) {
	    return this.ensureLinesAndColumnsComputed(), {
	      source: t,
	      offset: this.startOffset + e,
	      line: this.lines[e],
	      column: this.columns[e]
	    };
	  },
	  getLocationRange: function (e, t, n) {
	    return this.ensureLinesAndColumnsComputed(), {
	      source: n,
	      start: {
	        offset: this.startOffset + e,
	        line: this.lines[e],
	        column: this.columns[e]
	      },
	      end: {
	        offset: this.startOffset + t,
	        line: this.lines[t],
	        column: this.columns[t]
	      }
	    };
	  }
	};

	var In = Rn,
	    Bn = ze.TYPE,
	    Mn = Bn.WhiteSpace,
	    jn = Bn.Comment,
	    _n = function (e) {
	  var t = this.createList(),
	      n = null,
	      r = {
	    recognizer: e,
	    space: null,
	    ignoreWS: !1,
	    ignoreWSAfter: !1
	  };

	  for (this.scanner.skipSC(); !this.scanner.eof;) {
	    switch (this.scanner.tokenType) {
	      case jn:
	        this.scanner.next();
	        continue;

	      case Mn:
	        r.ignoreWS ? this.scanner.next() : r.space = this.WhiteSpace();
	        continue;
	    }

	    if (void 0 === (n = e.getNode.call(this, r))) break;
	    null !== r.space && (t.push(r.space), r.space = null), t.push(n), r.ignoreWSAfter ? (r.ignoreWSAfter = !1, r.ignoreWS = !0) : r.ignoreWS = !1;
	  }

	  return t;
	},
	    Fn = q.findWhiteSpaceStart,
	    Un = function () {},
	    qn = g.TYPE,
	    Wn = g.NAME,
	    Yn = qn.WhiteSpace,
	    Vn = qn.Ident,
	    Hn = qn.Function,
	    $n = qn.Url,
	    Gn = qn.Hash,
	    Kn = qn.Percentage,
	    Xn = qn.Number;

	function Qn(e) {
	  return function () {
	    return this[e]();
	  };
	}

	var Zn = function (e) {
	  var t = {
	    scanner: new X(),
	    locationMap: new In(),
	    filename: "<unknown>",
	    needPositions: !1,
	    onParseError: Un,
	    onParseErrorThrow: !1,
	    parseAtrulePrelude: !0,
	    parseRulePrelude: !0,
	    parseValue: !0,
	    parseCustomProperty: !1,
	    readSequence: _n,
	    createList: function () {
	      return new u();
	    },
	    createSingleNodeList: function (e) {
	      return new u().appendData(e);
	    },
	    getFirstListNode: function (e) {
	      return e && e.first();
	    },
	    getLastListNode: function (e) {
	      return e.last();
	    },
	    parseWithFallback: function (e, t) {
	      var n = this.scanner.tokenIndex;

	      try {
	        return e.call(this);
	      } catch (e) {
	        if (this.onParseErrorThrow) throw e;
	        var r = t.call(this, n);
	        return this.onParseErrorThrow = !0, this.onParseError(e, r), this.onParseErrorThrow = !1, r;
	      }
	    },
	    lookupNonWSType: function (e) {
	      do {
	        var t = this.scanner.lookupType(e++);
	        if (t !== Yn) return t;
	      } while (0 !== t);

	      return 0;
	    },
	    eat: function (e) {
	      if (this.scanner.tokenType !== e) {
	        var t = this.scanner.tokenStart,
	            n = Wn[e] + " is expected";

	        switch (e) {
	          case Vn:
	            this.scanner.tokenType === Hn || this.scanner.tokenType === $n ? (t = this.scanner.tokenEnd - 1, n = "Identifier is expected but function found") : n = "Identifier is expected";
	            break;

	          case Gn:
	            this.scanner.isDelim(35) && (this.scanner.next(), t++, n = "Name is expected");
	            break;

	          case Kn:
	            this.scanner.tokenType === Xn && (t = this.scanner.tokenEnd, n = "Percent sign is expected");
	            break;

	          default:
	            this.scanner.source.charCodeAt(this.scanner.tokenStart) === e && (t += 1);
	        }

	        this.error(n, t);
	      }

	      this.scanner.next();
	    },
	    consume: function (e) {
	      var t = this.scanner.getTokenValue();
	      return this.eat(e), t;
	    },
	    consumeFunctionName: function () {
	      var e = this.scanner.source.substring(this.scanner.tokenStart, this.scanner.tokenEnd - 1);
	      return this.eat(Hn), e;
	    },
	    getLocation: function (e, t) {
	      return this.needPositions ? this.locationMap.getLocationRange(e, t, this.filename) : null;
	    },
	    getLocationFromList: function (e) {
	      if (this.needPositions) {
	        var t = this.getFirstListNode(e),
	            n = this.getLastListNode(e);
	        return this.locationMap.getLocationRange(null !== t ? t.loc.start.offset - this.locationMap.startOffset : this.scanner.tokenStart, null !== n ? n.loc.end.offset - this.locationMap.startOffset : this.scanner.tokenStart, this.filename);
	      }

	      return null;
	    },
	    error: function (e, t) {
	      var n = void 0 !== t && t < this.scanner.source.length ? this.locationMap.getLocation(t) : this.scanner.eof ? this.locationMap.getLocation(Fn(this.scanner.source, this.scanner.source.length - 1)) : this.locationMap.getLocation(this.scanner.tokenStart);
	      throw new p(e || "Unexpected input", this.scanner.source, n.offset, n.line, n.column);
	    }
	  };

	  for (var n in e = function (e) {
	    var t = {
	      context: {},
	      scope: {},
	      atrule: {},
	      pseudo: {}
	    };
	    if (e.parseContext) for (var n in e.parseContext) switch (typeof e.parseContext[n]) {
	      case "function":
	        t.context[n] = e.parseContext[n];
	        break;

	      case "string":
	        t.context[n] = Qn(e.parseContext[n]);
	    }
	    if (e.scope) for (var n in e.scope) t.scope[n] = e.scope[n];
	    if (e.atrule) for (var n in e.atrule) {
	      var r = e.atrule[n];
	      r.parse && (t.atrule[n] = r.parse);
	    }
	    if (e.pseudo) for (var n in e.pseudo) {
	      var o = e.pseudo[n];
	      o.parse && (t.pseudo[n] = o.parse);
	    }
	    if (e.node) for (var n in e.node) t[n] = e.node[n].parse;
	    return t;
	  }(e || {})) t[n] = e[n];

	  return function (e, n) {
	    var r,
	        o = (n = n || {}).context || "default";
	    if (ze(e, t.scanner), t.locationMap.setSource(e, n.offset, n.line, n.column), t.filename = n.filename || "<unknown>", t.needPositions = Boolean(n.positions), t.onParseError = "function" == typeof n.onParseError ? n.onParseError : Un, t.onParseErrorThrow = !1, t.parseAtrulePrelude = !("parseAtrulePrelude" in n) || Boolean(n.parseAtrulePrelude), t.parseRulePrelude = !("parseRulePrelude" in n) || Boolean(n.parseRulePrelude), t.parseValue = !("parseValue" in n) || Boolean(n.parseValue), t.parseCustomProperty = "parseCustomProperty" in n && Boolean(n.parseCustomProperty), !t.context.hasOwnProperty(o)) throw new Error("Unknown context `" + o + "`");
	    return r = t.context[o].call(t, n), t.scanner.eof || t.error(), r;
	  };
	},
	    Jn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
	    er = function (e) {
	  if (0 <= e && e < Jn.length) return Jn[e];
	  throw new TypeError("Must be between 0 and 63: " + e);
	};

	var tr = function (e) {
	  var t,
	      n = "",
	      r = function (e) {
	    return e < 0 ? 1 + (-e << 1) : 0 + (e << 1);
	  }(e);

	  do {
	    t = 31 & r, (r >>>= 5) > 0 && (t |= 32), n += er(t);
	  } while (r > 0);

	  return n;
	};

	var nr = function (e, t) {
	  return e(t = {
	    exports: {}
	  }, t.exports), t.exports;
	}(function (e, t) {
	  t.getArg = function (e, t, n) {
	    if (t in e) return e[t];
	    if (3 === arguments.length) return n;
	    throw new Error('"' + t + '" is a required argument.');
	  };

	  var n = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,
	      r = /^data:.+\,.+$/;

	  function o(e) {
	    var t = e.match(n);
	    return t ? {
	      scheme: t[1],
	      auth: t[2],
	      host: t[3],
	      port: t[4],
	      path: t[5]
	    } : null;
	  }

	  function a(e) {
	    var t = "";
	    return e.scheme && (t += e.scheme + ":"), t += "//", e.auth && (t += e.auth + "@"), e.host && (t += e.host), e.port && (t += ":" + e.port), e.path && (t += e.path), t;
	  }

	  function i(e) {
	    var n = e,
	        r = o(e);

	    if (r) {
	      if (!r.path) return e;
	      n = r.path;
	    }

	    for (var i, s = t.isAbsolute(n), l = n.split(/\/+/), c = 0, u = l.length - 1; u >= 0; u--) "." === (i = l[u]) ? l.splice(u, 1) : ".." === i ? c++ : c > 0 && ("" === i ? (l.splice(u + 1, c), c = 0) : (l.splice(u, 2), c--));

	    return "" === (n = l.join("/")) && (n = s ? "/" : "."), r ? (r.path = n, a(r)) : n;
	  }

	  function s(e, t) {
	    "" === e && (e = "."), "" === t && (t = ".");
	    var n = o(t),
	        s = o(e);
	    if (s && (e = s.path || "/"), n && !n.scheme) return s && (n.scheme = s.scheme), a(n);
	    if (n || t.match(r)) return t;
	    if (s && !s.host && !s.path) return s.host = t, a(s);
	    var l = "/" === t.charAt(0) ? t : i(e.replace(/\/+$/, "") + "/" + t);
	    return s ? (s.path = l, a(s)) : l;
	  }

	  t.urlParse = o, t.urlGenerate = a, t.normalize = i, t.join = s, t.isAbsolute = function (e) {
	    return "/" === e.charAt(0) || n.test(e);
	  }, t.relative = function (e, t) {
	    "" === e && (e = "."), e = e.replace(/\/$/, "");

	    for (var n = 0; 0 !== t.indexOf(e + "/");) {
	      var r = e.lastIndexOf("/");
	      if (r < 0) return t;
	      if ((e = e.slice(0, r)).match(/^([^\/]+:\/)?\/*$/)) return t;
	      ++n;
	    }

	    return window.Array(n + 1).join("../") + t.substr(e.length + 1);
	  };
	  var l = !("__proto__" in window.Object.create(null));

	  function c(e) {
	    return e;
	  }

	  function u(e) {
	    if (!e) return !1;
	    var t = e.length;
	    if (t < 9) return !1;
	    if (95 !== e.charCodeAt(t - 1) || 95 !== e.charCodeAt(t - 2) || 111 !== e.charCodeAt(t - 3) || 116 !== e.charCodeAt(t - 4) || 111 !== e.charCodeAt(t - 5) || 114 !== e.charCodeAt(t - 6) || 112 !== e.charCodeAt(t - 7) || 95 !== e.charCodeAt(t - 8) || 95 !== e.charCodeAt(t - 9)) return !1;

	    for (var n = t - 10; n >= 0; n--) if (36 !== e.charCodeAt(n)) return !1;

	    return !0;
	  }

	  function h(e, t) {
	    return e === t ? 0 : null === e ? 1 : null === t ? -1 : e > t ? 1 : -1;
	  }

	  t.toSetString = l ? c : function (e) {
	    return u(e) ? "$" + e : e;
	  }, t.fromSetString = l ? c : function (e) {
	    return u(e) ? e.slice(1) : e;
	  }, t.compareByOriginalPositions = function (e, t, n) {
	    var r = h(e.source, t.source);
	    return 0 !== r || 0 !== (r = e.originalLine - t.originalLine) || 0 !== (r = e.originalColumn - t.originalColumn) || n || 0 !== (r = e.generatedColumn - t.generatedColumn) || 0 !== (r = e.generatedLine - t.generatedLine) ? r : h(e.name, t.name);
	  }, t.compareByGeneratedPositionsDeflated = function (e, t, n) {
	    var r = e.generatedLine - t.generatedLine;
	    return 0 !== r || 0 !== (r = e.generatedColumn - t.generatedColumn) || n || 0 !== (r = h(e.source, t.source)) || 0 !== (r = e.originalLine - t.originalLine) || 0 !== (r = e.originalColumn - t.originalColumn) ? r : h(e.name, t.name);
	  }, t.compareByGeneratedPositionsInflated = function (e, t) {
	    var n = e.generatedLine - t.generatedLine;
	    return 0 !== n || 0 !== (n = e.generatedColumn - t.generatedColumn) || 0 !== (n = h(e.source, t.source)) || 0 !== (n = e.originalLine - t.originalLine) || 0 !== (n = e.originalColumn - t.originalColumn) ? n : h(e.name, t.name);
	  }, t.parseSourceMapInput = function (e) {
	    return JSON.parse(e.replace(/^\)]}'[^\n]*\n/, ""));
	  }, t.computeSourceURL = function (e, t, n) {
	    if (t = t || "", e && ("/" !== e[e.length - 1] && "/" !== t[0] && (e += "/"), t = e + t), n) {
	      var r = o(n);
	      if (!r) throw new Error("sourceMapURL could not be parsed");

	      if (r.path) {
	        var l = r.path.lastIndexOf("/");
	        l >= 0 && (r.path = r.path.substring(0, l + 1));
	      }

	      t = s(a(r), t);
	    }

	    return i(t);
	  };
	}),
	    rr = (nr.getArg, nr.urlParse, nr.urlGenerate, nr.normalize, nr.join, nr.isAbsolute, nr.relative, nr.toSetString, nr.fromSetString, nr.compareByOriginalPositions, nr.compareByGeneratedPositionsDeflated, nr.compareByGeneratedPositionsInflated, nr.parseSourceMapInput, nr.computeSourceURL, window.Object.prototype.hasOwnProperty),
	    or = "undefined" != typeof window.Map;

	function ar() {
	  this._array = [], this._set = or ? new window.Map() : window.Object.create(null);
	}

	ar.fromArray = function (e, t) {
	  for (var n = new ar(), r = 0, o = e.length; r < o; r++) n.add(e[r], t);

	  return n;
	}, ar.prototype.size = function () {
	  return or ? this._set.size : window.Object.getOwnPropertyNames(this._set).length;
	}, ar.prototype.add = function (e, t) {
	  var n = or ? e : nr.toSetString(e),
	      r = or ? this.has(e) : rr.call(this._set, n),
	      o = this._array.length;
	  r && !t || this._array.push(e), r || (or ? this._set.set(e, o) : this._set[n] = o);
	}, ar.prototype.has = function (e) {
	  if (or) return this._set.has(e);
	  var t = nr.toSetString(e);
	  return rr.call(this._set, t);
	}, ar.prototype.indexOf = function (e) {
	  if (or) {
	    var t = this._set.get(e);

	    if (t >= 0) return t;
	  } else {
	    var n = nr.toSetString(e);
	    if (rr.call(this._set, n)) return this._set[n];
	  }

	  throw new Error('"' + e + '" is not in the set.');
	}, ar.prototype.at = function (e) {
	  if (e >= 0 && e < this._array.length) return this._array[e];
	  throw new Error("No element indexed by " + e);
	}, ar.prototype.toArray = function () {
	  return this._array.slice();
	};
	var ir = {
	  ArraySet: ar
	};

	function sr() {
	  this._array = [], this._sorted = !0, this._last = {
	    generatedLine: -1,
	    generatedColumn: 0
	  };
	}

	sr.prototype.unsortedForEach = function (e, t) {
	  this._array.forEach(e, t);
	}, sr.prototype.add = function (e) {
	  var t, n, r, o, a, i;
	  t = this._last, n = e, r = t.generatedLine, o = n.generatedLine, a = t.generatedColumn, i = n.generatedColumn, o > r || o == r && i >= a || nr.compareByGeneratedPositionsInflated(t, n) <= 0 ? (this._last = e, this._array.push(e)) : (this._sorted = !1, this._array.push(e));
	}, sr.prototype.toArray = function () {
	  return this._sorted || (this._array.sort(nr.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
	};
	var lr = ir.ArraySet,
	    cr = {
	  MappingList: sr
	}.MappingList;

	function ur(e) {
	  e || (e = {}), this._file = nr.getArg(e, "file", null), this._sourceRoot = nr.getArg(e, "sourceRoot", null), this._skipValidation = nr.getArg(e, "skipValidation", !1), this._sources = new lr(), this._names = new lr(), this._mappings = new cr(), this._sourcesContents = null;
	}

	ur.prototype._version = 3, ur.fromSourceMap = function (e) {
	  var t = e.sourceRoot,
	      n = new ur({
	    file: e.file,
	    sourceRoot: t
	  });
	  return e.eachMapping(function (e) {
	    var r = {
	      generated: {
	        line: e.generatedLine,
	        column: e.generatedColumn
	      }
	    };
	    null != e.source && (r.source = e.source, null != t && (r.source = nr.relative(t, r.source)), r.original = {
	      line: e.originalLine,
	      column: e.originalColumn
	    }, null != e.name && (r.name = e.name)), n.addMapping(r);
	  }), e.sources.forEach(function (r) {
	    var o = r;
	    null !== t && (o = nr.relative(t, r)), n._sources.has(o) || n._sources.add(o);
	    var a = e.sourceContentFor(r);
	    null != a && n.setSourceContent(r, a);
	  }), n;
	}, ur.prototype.addMapping = function (e) {
	  var t = nr.getArg(e, "generated"),
	      n = nr.getArg(e, "original", null),
	      r = nr.getArg(e, "source", null),
	      o = nr.getArg(e, "name", null);
	  this._skipValidation || this._validateMapping(t, n, r, o), null != r && (r = String(r), this._sources.has(r) || this._sources.add(r)), null != o && (o = String(o), this._names.has(o) || this._names.add(o)), this._mappings.add({
	    generatedLine: t.line,
	    generatedColumn: t.column,
	    originalLine: null != n && n.line,
	    originalColumn: null != n && n.column,
	    source: r,
	    name: o
	  });
	}, ur.prototype.setSourceContent = function (e, t) {
	  var n = e;
	  null != this._sourceRoot && (n = nr.relative(this._sourceRoot, n)), null != t ? (this._sourcesContents || (this._sourcesContents = window.Object.create(null)), this._sourcesContents[nr.toSetString(n)] = t) : this._sourcesContents && (delete this._sourcesContents[nr.toSetString(n)], 0 === window.Object.keys(this._sourcesContents).length && (this._sourcesContents = null));
	}, ur.prototype.applySourceMap = function (e, t, n) {
	  var r = t;

	  if (null == t) {
	    if (null == e.file) throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.');
	    r = e.file;
	  }

	  var o = this._sourceRoot;
	  null != o && (r = nr.relative(o, r));
	  var a = new lr(),
	      i = new lr();
	  this._mappings.unsortedForEach(function (t) {
	    if (t.source === r && null != t.originalLine) {
	      var s = e.originalPositionFor({
	        line: t.originalLine,
	        column: t.originalColumn
	      });
	      null != s.source && (t.source = s.source, null != n && (t.source = nr.join(n, t.source)), null != o && (t.source = nr.relative(o, t.source)), t.originalLine = s.line, t.originalColumn = s.column, null != s.name && (t.name = s.name));
	    }

	    var l = t.source;
	    null == l || a.has(l) || a.add(l);
	    var c = t.name;
	    null == c || i.has(c) || i.add(c);
	  }, this), this._sources = a, this._names = i, e.sources.forEach(function (t) {
	    var r = e.sourceContentFor(t);
	    null != r && (null != n && (t = nr.join(n, t)), null != o && (t = nr.relative(o, t)), this.setSourceContent(t, r));
	  }, this);
	}, ur.prototype._validateMapping = function (e, t, n, r) {
	  if (t && "number" != typeof t.line && "number" != typeof t.column) throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
	  if ((!(e && "line" in e && "column" in e && e.line > 0 && e.column >= 0) || t || n || r) && !(e && "line" in e && "column" in e && t && "line" in t && "column" in t && e.line > 0 && e.column >= 0 && t.line > 0 && t.column >= 0 && n)) throw new Error("Invalid mapping: " + JSON.stringify({
	    generated: e,
	    source: n,
	    original: t,
	    name: r
	  }));
	}, ur.prototype._serializeMappings = function () {
	  for (var e, t, n, r, o = 0, a = 1, i = 0, s = 0, l = 0, c = 0, u = "", h = this._mappings.toArray(), d = 0, p = h.length; d < p; d++) {
	    if (e = "", (t = h[d]).generatedLine !== a) for (o = 0; t.generatedLine !== a;) e += ";", a++;else if (d > 0) {
	      if (!nr.compareByGeneratedPositionsInflated(t, h[d - 1])) continue;
	      e += ",";
	    }
	    e += tr(t.generatedColumn - o), o = t.generatedColumn, null != t.source && (r = this._sources.indexOf(t.source), e += tr(r - c), c = r, e += tr(t.originalLine - 1 - s), s = t.originalLine - 1, e += tr(t.originalColumn - i), i = t.originalColumn, null != t.name && (n = this._names.indexOf(t.name), e += tr(n - l), l = n)), u += e;
	  }

	  return u;
	}, ur.prototype._generateSourcesContent = function (e, t) {
	  return e.map(function (e) {
	    if (!this._sourcesContents) return null;
	    null != t && (e = nr.relative(t, e));
	    var n = nr.toSetString(e);
	    return window.Object.prototype.hasOwnProperty.call(this._sourcesContents, n) ? this._sourcesContents[n] : null;
	  }, this);
	}, ur.prototype.toJSON = function () {
	  var e = {
	    version: this._version,
	    sources: this._sources.toArray(),
	    names: this._names.toArray(),
	    mappings: this._serializeMappings()
	  };
	  return null != this._file && (e.file = this._file), null != this._sourceRoot && (e.sourceRoot = this._sourceRoot), this._sourcesContents && (e.sourcesContent = this._generateSourcesContent(e.sources, e.sourceRoot)), e;
	}, ur.prototype.toString = function () {
	  return JSON.stringify(this.toJSON());
	};
	var hr = {
	  SourceMapGenerator: ur
	}.SourceMapGenerator,
	    dr = {
	  Atrule: !0,
	  Selector: !0,
	  Declaration: !0
	},
	    pr = window.Object.prototype.hasOwnProperty;

	function mr(e, t) {
	  var n = e.children,
	      r = null;
	  "function" != typeof t ? n.forEach(this.node, this) : n.forEach(function (e) {
	    null !== r && t.call(this, r), this.node(e), r = e;
	  }, this);
	}

	var fr = function (e) {
	  function t(e) {
	    if (!pr.call(n, e.type)) throw new Error("Unknown node type: " + e.type);
	    n[e.type].call(this, e);
	  }

	  var n = {};
	  if (e.node) for (var r in e.node) n[r] = e.node[r].generate;
	  return function (e, n) {
	    var r = "",
	        o = {
	      children: mr,
	      node: t,
	      chunk: function (e) {
	        r += e;
	      },
	      result: function () {
	        return r;
	      }
	    };
	    return n && ("function" == typeof n.decorator && (o = n.decorator(o)), n.sourceMap && (o = function (e) {
	      var t = new hr(),
	          n = 1,
	          r = 0,
	          o = {
	        line: 1,
	        column: 0
	      },
	          a = {
	        line: 0,
	        column: 0
	      },
	          i = !1,
	          s = {
	        line: 1,
	        column: 0
	      },
	          l = {
	        generated: s
	      },
	          c = e.node;

	      e.node = function (e) {
	        if (e.loc && e.loc.start && dr.hasOwnProperty(e.type)) {
	          var u = e.loc.start.line,
	              h = e.loc.start.column - 1;
	          a.line === u && a.column === h || (a.line = u, a.column = h, o.line = n, o.column = r, i && (i = !1, o.line === s.line && o.column === s.column || t.addMapping(l)), i = !0, t.addMapping({
	            source: e.loc.source,
	            original: a,
	            generated: o
	          }));
	        }

	        c.call(this, e), i && dr.hasOwnProperty(e.type) && (s.line = n, s.column = r);
	      };

	      var u = e.chunk;

	      e.chunk = function (e) {
	        for (var t = 0; t < e.length; t++) 10 === e.charCodeAt(t) ? (n++, r = 0) : r++;

	        u(e);
	      };

	      var h = e.result;
	      return e.result = function () {
	        return i && t.addMapping(l), {
	          css: h(),
	          map: t
	        };
	      }, e;
	    }(o))), o.node(e), o.result();
	  };
	},
	    gr = window.Object.prototype.hasOwnProperty,
	    br = function () {};

	function yr(e) {
	  return "function" == typeof e ? e : br;
	}

	function kr(e, t) {
	  return function (n, r, o) {
	    n.type === t && e.call(this, n, r, o);
	  };
	}

	function vr(e, t) {
	  var n = t.structure,
	      r = [];

	  for (var o in n) if (!1 !== gr.call(n, o)) {
	    var a = n[o],
	        i = {
	      name: o,
	      type: !1,
	      nullable: !1
	    };
	    window.Array.isArray(n[o]) || (a = [n[o]]);

	    for (var s = 0; s < a.length; s++) {
	      var l = a[s];
	      null === l ? i.nullable = !0 : "string" == typeof l ? i.type = "node" : window.Array.isArray(l) && (i.type = "list");
	    }

	    i.type && r.push(i);
	  }

	  return r.length ? {
	    context: t.walkContext,
	    fields: r
	  } : null;
	}

	function wr(e, t) {
	  var n = e.fields.slice(),
	      r = e.context,
	      o = "string" == typeof r;
	  return t && n.reverse(), function (e, a, i) {
	    var s;
	    o && (s = a[r], a[r] = e);

	    for (var l = 0; l < n.length; l++) {
	      var c = n[l],
	          u = e[c.name];
	      c.nullable && !u || ("list" === c.type ? t ? u.forEachRight(i) : u.forEach(i) : i(u));
	    }

	    o && (a[r] = s);
	  };
	}

	function xr(e) {
	  return {
	    Atrule: {
	      StyleSheet: e.StyleSheet,
	      Atrule: e.Atrule,
	      Rule: e.Rule,
	      Block: e.Block
	    },
	    Rule: {
	      StyleSheet: e.StyleSheet,
	      Atrule: e.Atrule,
	      Rule: e.Rule,
	      Block: e.Block
	    },
	    Declaration: {
	      StyleSheet: e.StyleSheet,
	      Atrule: e.Atrule,
	      Rule: e.Rule,
	      Block: e.Block,
	      DeclarationList: e.DeclarationList
	    }
	  };
	}

	var Sr = function (e) {
	  var t = function (e) {
	    var t = {};

	    for (var n in e.node) if (gr.call(e.node, n)) {
	      var r = e.node[n];
	      if (!r.structure) throw new Error("Missed `structure` field in `" + n + "` node type definition");
	      t[n] = vr(0, r);
	    }

	    return t;
	  }(e),
	      n = {},
	      r = {};

	  for (var o in t) gr.call(t, o) && null !== t[o] && (n[o] = wr(t[o], !1), r[o] = wr(t[o], !0));

	  var a = xr(n),
	      i = xr(r),
	      s = function (e, o) {
	    var s = br,
	        l = br,
	        c = n,
	        u = {
	      root: e,
	      stylesheet: null,
	      atrule: null,
	      atrulePrelude: null,
	      rule: null,
	      selector: null,
	      block: null,
	      declaration: null,
	      function: null
	    };
	    if ("function" == typeof o) s = o;else if (o && (s = yr(o.enter), l = yr(o.leave), o.reverse && (c = r), o.visit)) {
	      if (a.hasOwnProperty(o.visit)) c = o.reverse ? i[o.visit] : a[o.visit];else if (!t.hasOwnProperty(o.visit)) throw new Error("Bad value `" + o.visit + "` for `visit` option (should be: " + window.Object.keys(t).join(", ") + ")");
	      s = kr(s, o.visit), l = kr(l, o.visit);
	    }
	    if (s === br && l === br) throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");

	    if (o.reverse) {
	      var h = s;
	      s = l, l = h;
	    }

	    !function e(t, n, r) {
	      s.call(u, t, n, r), c.hasOwnProperty(t.type) && c[t.type](t, u, e), l.call(u, t, n, r);
	    }(e);
	  };

	  return s.find = function (e, t) {
	    var n = null;
	    return s(e, function (e, r, o) {
	      null === n && t.call(this, e, r, o) && (n = e);
	    }), n;
	  }, s.findLast = function (e, t) {
	    var n = null;
	    return s(e, {
	      reverse: !0,
	      enter: function (e, r, o) {
	        null === n && t.call(this, e, r, o) && (n = e);
	      }
	    }), n;
	  }, s.findAll = function (e, t) {
	    var n = [];
	    return s(e, function (e, r, o) {
	      t.call(this, e, r, o) && n.push(e);
	    }), n;
	  }, s;
	},
	    Cr = function e(t) {
	  var n = {};

	  for (var r in t) {
	    var o = t[r];
	    o && (window.Array.isArray(o) || o instanceof u ? o = o.map(e) : o.constructor === window.Object && (o = e(o))), n[r] = o;
	  }

	  return n;
	},
	    Ar = window.Object.prototype.hasOwnProperty,
	    Tr = {
	  generic: !0,
	  types: {},
	  atrules: {},
	  properties: {},
	  parseContext: {},
	  scope: {},
	  atrule: ["parse"],
	  pseudo: ["parse"],
	  node: ["name", "structure", "parse", "generate", "walkContext"]
	};

	function zr(e) {
	  return e && e.constructor === window.Object;
	}

	function Pr(e) {
	  return zr(e) ? window.Object.assign({}, e) : e;
	}

	function Er(e, t) {
	  for (var n in t) Ar.call(t, n) && (zr(e[n]) ? Er(e[n], Pr(t[n])) : e[n] = Pr(t[n]));
	}

	var Lr = function (e, t) {
	  return function e(t, n, r) {
	    for (var o in r) if (!1 !== Ar.call(r, o)) if (!0 === r[o]) o in n && Ar.call(n, o) && (t[o] = Pr(n[o]));else if (r[o]) {
	      if (zr(r[o])) Er(a = {}, t[o]), Er(a, n[o]), t[o] = a;else if (window.Array.isArray(r[o])) {
	        var a = {},
	            i = r[o].reduce(function (e, t) {
	          return e[t] = !0, e;
	        }, {});

	        for (var s in t[o]) Ar.call(t[o], s) && (a[s] = {}, t[o] && t[o][s] && e(a[s], t[o][s], i));

	        for (var s in n[o]) Ar.call(n[o], s) && (a[s] || (a[s] = {}), n[o] && n[o][s] && e(a[s], n[o][s], i));

	        t[o] = a;
	      }
	    }

	    return t;
	  }(e, t, Tr);
	};

	function Or(e) {
	  var t = Zn(e),
	      n = Sr(e),
	      r = fr(e),
	      o = function (e) {
	    return {
	      fromPlainObject: function (t) {
	        return e(t, {
	          enter: function (e) {
	            e.children && e.children instanceof u == !1 && (e.children = new u().fromArray(e.children));
	          }
	        }), t;
	      },
	      toPlainObject: function (t) {
	        return e(t, {
	          leave: function (e) {
	            e.children && e.children instanceof u && (e.children = e.children.toArray());
	          }
	        }), t;
	      }
	    };
	  }(n),
	      a = {
	    List: u,
	    SyntaxError: p,
	    TokenStream: X,
	    Lexer: On,
	    vendorPrefix: le.vendorPrefix,
	    keyword: le.keyword,
	    property: le.property,
	    isCustomProperty: le.isCustomProperty,
	    definitionSyntax: Dn,
	    lexer: null,
	    createLexer: function (e) {
	      return new On(e, a, a.lexer.structure);
	    },
	    tokenize: ze,
	    parse: t,
	    walk: n,
	    generate: r,
	    find: n.find,
	    findLast: n.findLast,
	    findAll: n.findAll,
	    clone: Cr,
	    fromPlainObject: o.fromPlainObject,
	    toPlainObject: o.toPlainObject,
	    createSyntax: function (e) {
	      return Or(Lr({}, e));
	    },
	    fork: function (t) {
	      var n = Lr({}, e);
	      return Or("function" == typeof t ? t(n, window.Object.assign) : Lr(n, t));
	    }
	  };

	  return a.lexer = new On({
	    generic: !0,
	    types: e.types,
	    atrules: e.atrules,
	    properties: e.properties,
	    node: e.node
	  }, a), a;
	}

	var Dr = function (e) {
	  return Or(Lr({}, e));
	},
	    Nr = {
	  "absolute-size": "xx-small|x-small|small|medium|large|x-large|xx-large",
	  "alpha-value": "<number>|<percentage>",
	  "angle-percentage": "<angle>|<percentage>",
	  "angular-color-hint": "<angle-percentage>",
	  "angular-color-stop": "<color>&&<color-stop-angle>?",
	  "angular-color-stop-list": "[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>",
	  "animateable-feature": "scroll-position|contents|<custom-ident>",
	  attachment: "scroll|fixed|local",
	  "attr()": "attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )",
	  "attr-matcher": "['~'|'|'|'^'|'$'|'*']? '='",
	  "attr-modifier": "i|s",
	  "attribute-selector": "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
	  "auto-repeat": "repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )",
	  "auto-track-list": "[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?",
	  "baseline-position": "[first|last]? baseline",
	  "basic-shape": "<inset()>|<circle()>|<ellipse()>|<polygon()>",
	  "bg-image": "none|<image>",
	  "bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
	  "bg-position": "[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]",
	  "bg-size": "[<length-percentage>|auto]{1,2}|cover|contain",
	  "blur()": "blur( <length> )",
	  "blend-mode": "normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity",
	  box: "border-box|padding-box|content-box",
	  "brightness()": "brightness( <number-percentage> )",
	  "calc()": "calc( <calc-sum> )",
	  "calc-sum": "<calc-product> [['+'|'-'] <calc-product>]*",
	  "calc-product": "<calc-value> ['*' <calc-value>|'/' <number>]*",
	  "calc-value": "<number>|<dimension>|<percentage>|( <calc-sum> )",
	  "cf-final-image": "<image>|<color>",
	  "cf-mixing-image": "<percentage>?&&<image>",
	  "circle()": "circle( [<shape-radius>]? [at <position>]? )",
	  "clamp()": "clamp( <calc-sum>#{3} )",
	  "class-selector": "'.' <ident-token>",
	  "clip-source": "<url>",
	  color: "<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hex-color>|<named-color>|currentcolor|<deprecated-system-color>",
	  "color-stop": "<color-stop-length>|<color-stop-angle>",
	  "color-stop-angle": "<angle-percentage>{1,2}",
	  "color-stop-length": "<length-percentage>{1,2}",
	  "color-stop-list": "[<linear-color-stop> [, <linear-color-hint>]?]# , <linear-color-stop>",
	  combinator: "'>'|'+'|'~'|['||']",
	  "common-lig-values": "[common-ligatures|no-common-ligatures]",
	  compat: "searchfield|textarea|push-button|button-bevel|slider-horizontal|checkbox|radio|square-button|menulist|menulist-button|listbox|meter|progress-bar",
	  "composite-style": "clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor",
	  "compositing-operator": "add|subtract|intersect|exclude",
	  "compound-selector": "[<type-selector>? <subclass-selector>* [<pseudo-element-selector> <pseudo-class-selector>*]*]!",
	  "compound-selector-list": "<compound-selector>#",
	  "complex-selector": "<compound-selector> [<combinator>? <compound-selector>]*",
	  "complex-selector-list": "<complex-selector>#",
	  "conic-gradient()": "conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
	  "contextual-alt-values": "[contextual|no-contextual]",
	  "content-distribution": "space-between|space-around|space-evenly|stretch",
	  "content-list": "[<string>|contents|<url>|<quote>|<attr()>|counter( <ident> , <'list-style-type'>? )]+",
	  "content-position": "center|start|end|flex-start|flex-end",
	  "content-replacement": "<image>",
	  "contrast()": "contrast( [<number-percentage>] )",
	  "counter()": "counter( <custom-ident> , [<counter-style>|none]? )",
	  "counter-style": "<counter-style-name>|symbols( )",
	  "counter-style-name": "<custom-ident>",
	  "counters()": "counters( <custom-ident> , <string> , [<counter-style>|none]? )",
	  "cross-fade()": "cross-fade( <cf-mixing-image> , <cf-final-image>? )",
	  "cubic-bezier-timing-function": "ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number> , <number> , <number> , <number> )",
	  "deprecated-system-color": "ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText",
	  "discretionary-lig-values": "[discretionary-ligatures|no-discretionary-ligatures]",
	  "display-box": "contents|none",
	  "display-inside": "flow|flow-root|table|flex|grid|ruby",
	  "display-internal": "table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container",
	  "display-legacy": "inline-block|inline-list-item|inline-table|inline-flex|inline-grid",
	  "display-listitem": "<display-outside>?&&[flow|flow-root]?&&list-item",
	  "display-outside": "block|inline|run-in",
	  "drop-shadow()": "drop-shadow( <length>{2,3} <color>? )",
	  "east-asian-variant-values": "[jis78|jis83|jis90|jis04|simplified|traditional]",
	  "east-asian-width-values": "[full-width|proportional-width]",
	  "element()": "element( <id-selector> )",
	  "ellipse()": "ellipse( [<shape-radius>{2}]? [at <position>]? )",
	  "ending-shape": "circle|ellipse",
	  "env()": "env( <custom-ident> , <declaration-value>? )",
	  "explicit-track-list": "[<line-names>? <track-size>]+ <line-names>?",
	  "family-name": "<string>|<custom-ident>+",
	  "feature-tag-value": "<string> [<integer>|on|off]?",
	  "feature-type": "@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation",
	  "feature-value-block": "<feature-type> '{' <feature-value-declaration-list> '}'",
	  "feature-value-block-list": "<feature-value-block>+",
	  "feature-value-declaration": "<custom-ident> : <integer>+ ;",
	  "feature-value-declaration-list": "<feature-value-declaration>",
	  "feature-value-name": "<custom-ident>",
	  "fill-rule": "nonzero|evenodd",
	  "filter-function": "<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>",
	  "filter-function-list": "[<filter-function>|<url>]+",
	  "final-bg-layer": "<'background-color'>||<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
	  "fit-content()": "fit-content( [<length>|<percentage>] )",
	  "fixed-breadth": "<length-percentage>",
	  "fixed-repeat": "repeat( [<positive-integer>] , [<line-names>? <fixed-size>]+ <line-names>? )",
	  "fixed-size": "<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )",
	  "font-stretch-absolute": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>",
	  "font-variant-css21": "[normal|small-caps]",
	  "font-weight-absolute": "normal|bold|<number>",
	  "frequency-percentage": "<frequency>|<percentage>",
	  "general-enclosed": "[<function-token> <any-value> )]|( <ident> <any-value> )",
	  "generic-family": "serif|sans-serif|cursive|fantasy|monospace|-apple-system",
	  "generic-name": "serif|sans-serif|cursive|fantasy|monospace",
	  "geometry-box": "<shape-box>|fill-box|stroke-box|view-box",
	  gradient: "<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<-legacy-gradient>",
	  "grayscale()": "grayscale( <number-percentage> )",
	  "grid-line": "auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]",
	  "historical-lig-values": "[historical-ligatures|no-historical-ligatures]",
	  "hsl()": "hsl( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )",
	  "hsla()": "hsla( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )",
	  hue: "<number>|<angle>",
	  "hue-rotate()": "hue-rotate( <angle> )",
	  image: "<url>|<image()>|<image-set()>|<element()>|<cross-fade()>|<gradient>",
	  "image()": "image( <image-tags>? [<image-src>? , <color>?]! )",
	  "image-set()": "image-set( <image-set-option># )",
	  "image-set-option": "[<image>|<string>] <resolution>",
	  "image-src": "<url>|<string>",
	  "image-tags": "ltr|rtl",
	  "inflexible-breadth": "<length>|<percentage>|min-content|max-content|auto",
	  "inset()": "inset( <length-percentage>{1,4} [round <'border-radius'>]? )",
	  "invert()": "invert( <number-percentage> )",
	  "keyframes-name": "<custom-ident>|<string>",
	  "keyframe-block": "<keyframe-selector># { <declaration-list> }",
	  "keyframe-block-list": "<keyframe-block>+",
	  "keyframe-selector": "from|to|<percentage>",
	  "leader()": "leader( <leader-type> )",
	  "leader-type": "dotted|solid|space|<string>",
	  "length-percentage": "<length>|<percentage>",
	  "line-names": "'[' <custom-ident>* ']'",
	  "line-name-list": "[<line-names>|<name-repeat>]+",
	  "line-style": "none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset",
	  "line-width": "<length>|thin|medium|thick",
	  "linear-color-hint": "<length-percentage>",
	  "linear-color-stop": "<color> <color-stop-length>?",
	  "linear-gradient()": "linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
	  "mask-layer": "<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>",
	  "mask-position": "[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?",
	  "mask-reference": "none|<image>|<mask-source>",
	  "mask-source": "<url>",
	  "masking-mode": "alpha|luminance|match-source",
	  "matrix()": "matrix( <number>#{6} )",
	  "matrix3d()": "matrix3d( <number>#{16} )",
	  "max()": "max( <calc-sum># )",
	  "media-and": "<media-in-parens> [and <media-in-parens>]+",
	  "media-condition": "<media-not>|<media-and>|<media-or>|<media-in-parens>",
	  "media-condition-without-or": "<media-not>|<media-and>|<media-in-parens>",
	  "media-feature": "( [<mf-plain>|<mf-boolean>|<mf-range>] )",
	  "media-in-parens": "( <media-condition> )|<media-feature>|<general-enclosed>",
	  "media-not": "not <media-in-parens>",
	  "media-or": "<media-in-parens> [or <media-in-parens>]+",
	  "media-query": "<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?",
	  "media-query-list": "<media-query>#",
	  "media-type": "<ident>",
	  "mf-boolean": "<mf-name>",
	  "mf-name": "<ident>",
	  "mf-plain": "<mf-name> : <mf-value>",
	  "mf-range": "<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>",
	  "mf-value": "<number>|<dimension>|<ident>|<ratio>",
	  "min()": "min( <calc-sum># )",
	  "minmax()": "minmax( [<length>|<percentage>|<flex>|min-content|max-content|auto] , [<length>|<percentage>|<flex>|min-content|max-content|auto] )",
	  "named-color": "transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|<-non-standard-color>",
	  "namespace-prefix": "<ident>",
	  "ns-prefix": "[<ident-token>|'*']? '|'",
	  "number-percentage": "<number>|<percentage>",
	  "numeric-figure-values": "[lining-nums|oldstyle-nums]",
	  "numeric-fraction-values": "[diagonal-fractions|stacked-fractions]",
	  "numeric-spacing-values": "[proportional-nums|tabular-nums]",
	  nth: "<an-plus-b>|even|odd",
	  "opacity()": "opacity( [<number-percentage>] )",
	  "overflow-position": "unsafe|safe",
	  "outline-radius": "<length>|<percentage>",
	  "page-body": "<declaration>? [; <page-body>]?|<page-margin-box> <page-body>",
	  "page-margin-box": "<page-margin-box-type> '{' <declaration-list> '}'",
	  "page-margin-box-type": "@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom",
	  "page-selector-list": "[<page-selector>#]?",
	  "page-selector": "<pseudo-page>+|<ident> <pseudo-page>*",
	  "perspective()": "perspective( <length> )",
	  "polygon()": "polygon( <fill-rule>? , [<length-percentage> <length-percentage>]# )",
	  position: "[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]",
	  "pseudo-class-selector": "':' <ident-token>|':' <function-token> <any-value> ')'",
	  "pseudo-element-selector": "':' <pseudo-class-selector>",
	  "pseudo-page": ": [left|right|first|blank]",
	  quote: "open-quote|close-quote|no-open-quote|no-close-quote",
	  "radial-gradient()": "radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
	  "relative-selector": "<combinator>? <complex-selector>",
	  "relative-selector-list": "<relative-selector>#",
	  "relative-size": "larger|smaller",
	  "repeat-style": "repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}",
	  "repeating-linear-gradient()": "repeating-linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
	  "repeating-radial-gradient()": "repeating-radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
	  "rgb()": "rgb( <percentage>{3} [/ <alpha-value>]? )|rgb( <number>{3} [/ <alpha-value>]? )|rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )",
	  "rgba()": "rgba( <percentage>{3} [/ <alpha-value>]? )|rgba( <number>{3} [/ <alpha-value>]? )|rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )",
	  "rotate()": "rotate( [<angle>|<zero>] )",
	  "rotate3d()": "rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )",
	  "rotateX()": "rotateX( [<angle>|<zero>] )",
	  "rotateY()": "rotateY( [<angle>|<zero>] )",
	  "rotateZ()": "rotateZ( [<angle>|<zero>] )",
	  "saturate()": "saturate( <number-percentage> )",
	  "scale()": "scale( <number> , <number>? )",
	  "scale3d()": "scale3d( <number> , <number> , <number> )",
	  "scaleX()": "scaleX( <number> )",
	  "scaleY()": "scaleY( <number> )",
	  "scaleZ()": "scaleZ( <number> )",
	  "self-position": "center|start|end|self-start|self-end|flex-start|flex-end",
	  "shape-radius": "<length-percentage>|closest-side|farthest-side",
	  "skew()": "skew( [<angle>|<zero>] , [<angle>|<zero>]? )",
	  "skewX()": "skewX( [<angle>|<zero>] )",
	  "skewY()": "skewY( [<angle>|<zero>] )",
	  "sepia()": "sepia( <number-percentage> )",
	  shadow: "inset?&&<length>{2,4}&&<color>?",
	  "shadow-t": "[<length>{2,3}&&<color>?]",
	  shape: "rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )",
	  "shape-box": "<box>|margin-box",
	  "side-or-corner": "[left|right]||[top|bottom]",
	  "single-animation": "<time>||<timing-function>||<time>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]",
	  "single-animation-direction": "normal|reverse|alternate|alternate-reverse",
	  "single-animation-fill-mode": "none|forwards|backwards|both",
	  "single-animation-iteration-count": "infinite|<number>",
	  "single-animation-play-state": "running|paused",
	  "single-transition": "[none|<single-transition-property>]||<time>||<timing-function>||<time>",
	  "single-transition-property": "all|<custom-ident>",
	  size: "closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}",
	  "step-position": "jump-start|jump-end|jump-none|jump-both|start|end",
	  "step-timing-function": "step-start|step-end|steps( <integer> [, <step-position>]? )",
	  "subclass-selector": "<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>",
	  "supports-condition": "not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*",
	  "supports-in-parens": "( <supports-condition> )|<supports-feature>|<general-enclosed>",
	  "supports-feature": "<supports-decl>|<supports-selector-fn>",
	  "supports-decl": "( <declaration> )",
	  "supports-selector-fn": "selector( <complex-selector> )",
	  symbol: "<string>|<image>|<custom-ident>",
	  target: "<target-counter()>|<target-counters()>|<target-text()>",
	  "target-counter()": "target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )",
	  "target-counters()": "target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )",
	  "target-text()": "target-text( [<string>|<url>] , [content|before|after|first-letter]? )",
	  "time-percentage": "<time>|<percentage>",
	  "timing-function": "linear|<cubic-bezier-timing-function>|<step-timing-function>",
	  "track-breadth": "<length-percentage>|<flex>|min-content|max-content|auto",
	  "track-list": "[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?",
	  "track-repeat": "repeat( [<positive-integer>] , [<line-names>? <track-size>]+ <line-names>? )",
	  "track-size": "<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( [<length>|<percentage>] )",
	  "transform-function": "<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>",
	  "transform-list": "<transform-function>+",
	  "translate()": "translate( <length-percentage> , <length-percentage>? )",
	  "translate3d()": "translate3d( <length-percentage> , <length-percentage> , <length> )",
	  "translateX()": "translateX( <length-percentage> )",
	  "translateY()": "translateY( <length-percentage> )",
	  "translateZ()": "translateZ( <length> )",
	  "type-or-unit": "string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%",
	  "type-selector": "<wq-name>|<ns-prefix>? '*'",
	  "var()": "var( <custom-property-name> , <declaration-value>? )",
	  "viewport-length": "auto|<length-percentage>",
	  "wq-name": "<ns-prefix>? <ident-token>",
	  "-legacy-gradient": "<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>",
	  "-legacy-linear-gradient": "-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )",
	  "-legacy-repeating-linear-gradient": "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )",
	  "-legacy-linear-gradient-arguments": "[<angle>|<side-or-corner>]? , <color-stop-list>",
	  "-legacy-radial-gradient": "-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )",
	  "-legacy-repeating-radial-gradient": "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )",
	  "-legacy-radial-gradient-arguments": "[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>",
	  "-legacy-radial-gradient-size": "closest-side|closest-corner|farthest-side|farthest-corner|contain|cover",
	  "-legacy-radial-gradient-shape": "circle|ellipse",
	  "-non-standard-font": "-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body",
	  "-non-standard-color": "-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text",
	  "-non-standard-image-rendering": "optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast",
	  "-non-standard-overflow": "-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable",
	  "-non-standard-width": "min-intrinsic|intrinsic|-moz-min-content|-moz-max-content|-webkit-min-content|-webkit-max-content",
	  "-webkit-gradient()": "-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )",
	  "-webkit-gradient-color-stop": "from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )",
	  "-webkit-gradient-point": "[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]",
	  "-webkit-gradient-radius": "<length>|<percentage>",
	  "-webkit-gradient-type": "linear|radial",
	  "-webkit-mask-box-repeat": "repeat|stretch|round",
	  "-webkit-mask-clip-style": "border|border-box|padding|padding-box|content|content-box|text",
	  "-ms-filter-function-list": "<-ms-filter-function>+",
	  "-ms-filter-function": "<-ms-filter-function-progid>|<-ms-filter-function-legacy>",
	  "-ms-filter-function-progid": "'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]",
	  "-ms-filter-function-legacy": "<ident-token>|<function-token> <any-value>? )",
	  "-ms-filter": "<string>",
	  age: "child|young|old",
	  "attr-name": "<wq-name>",
	  "attr-fallback": "<any-value>",
	  "border-radius": "<length-percentage>{1,2}",
	  bottom: "<length>|auto",
	  "generic-voice": "[<age>? <gender> <integer>?]",
	  gender: "male|female|neutral",
	  left: "<length>|auto",
	  "mask-image": "<mask-reference>#",
	  "name-repeat": "repeat( [<positive-integer>|auto-fill] , <line-names>+ )",
	  paint: "none|<color>|<url> [none|<color>]?|context-fill|context-stroke",
	  "path()": "path( <string> )",
	  ratio: "<integer> / <integer>",
	  right: "<length>|auto",
	  "svg-length": "<percentage>|<length>|<number>",
	  "svg-writing-mode": "lr-tb|rl-tb|tb-rl|lr|rl|tb",
	  top: "<length>|auto",
	  "track-group": "'(' [<string>* <track-minmax> <string>*]+ ')' ['[' <positive-integer> ']']?|<track-minmax>",
	  "track-list-v0": "[<string>* <track-group> <string>*]+|none",
	  "track-minmax": "minmax( <track-breadth> , <track-breadth> )|auto|<track-breadth>|fit-content",
	  x: "<number>",
	  y: "<number>",
	  declaration: "<ident-token> : <declaration-value>? ['!' important]?",
	  "declaration-list": "[<declaration>? ';']* <declaration>?",
	  url: "url( <string> <url-modifier>* )|<url-token>",
	  "url-modifier": "<ident>|<function-token> <any-value> )",
	  "number-zero-one": "<number [0,1]>",
	  "number-one-or-greater": "<number [1,∞]>",
	  "positive-integer": "<integer [0,∞]>"
	},
	    Rr = {
	  "--*": "<declaration-value>",
	  "-ms-accelerator": "false|true",
	  "-ms-block-progression": "tb|rl|bt|lr",
	  "-ms-content-zoom-chaining": "none|chained",
	  "-ms-content-zooming": "none|zoom",
	  "-ms-content-zoom-limit": "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
	  "-ms-content-zoom-limit-max": "<percentage>",
	  "-ms-content-zoom-limit-min": "<percentage>",
	  "-ms-content-zoom-snap": "<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>",
	  "-ms-content-zoom-snap-points": "snapInterval( <percentage> , <percentage> )|snapList( <percentage># )",
	  "-ms-content-zoom-snap-type": "none|proximity|mandatory",
	  "-ms-filter": "<string>",
	  "-ms-flow-from": "[none|<custom-ident>]#",
	  "-ms-flow-into": "[none|<custom-ident>]#",
	  "-ms-high-contrast-adjust": "auto|none",
	  "-ms-hyphenate-limit-chars": "auto|<integer>{1,3}",
	  "-ms-hyphenate-limit-lines": "no-limit|<integer>",
	  "-ms-hyphenate-limit-zone": "<percentage>|<length>",
	  "-ms-ime-align": "auto|after",
	  "-ms-overflow-style": "auto|none|scrollbar|-ms-autohiding-scrollbar",
	  "-ms-scrollbar-3dlight-color": "<color>",
	  "-ms-scrollbar-arrow-color": "<color>",
	  "-ms-scrollbar-base-color": "<color>",
	  "-ms-scrollbar-darkshadow-color": "<color>",
	  "-ms-scrollbar-face-color": "<color>",
	  "-ms-scrollbar-highlight-color": "<color>",
	  "-ms-scrollbar-shadow-color": "<color>",
	  "-ms-scrollbar-track-color": "<color>",
	  "-ms-scroll-chaining": "chained|none",
	  "-ms-scroll-limit": "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
	  "-ms-scroll-limit-x-max": "auto|<length>",
	  "-ms-scroll-limit-x-min": "<length>",
	  "-ms-scroll-limit-y-max": "auto|<length>",
	  "-ms-scroll-limit-y-min": "<length>",
	  "-ms-scroll-rails": "none|railed",
	  "-ms-scroll-snap-points-x": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
	  "-ms-scroll-snap-points-y": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
	  "-ms-scroll-snap-type": "none|proximity|mandatory",
	  "-ms-scroll-snap-x": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
	  "-ms-scroll-snap-y": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
	  "-ms-scroll-translation": "none|vertical-to-horizontal",
	  "-ms-text-autospace": "none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space",
	  "-ms-touch-select": "grippers|none",
	  "-ms-user-select": "none|element|text",
	  "-ms-wrap-flow": "auto|both|start|end|maximum|clear",
	  "-ms-wrap-margin": "<length>",
	  "-ms-wrap-through": "wrap|none",
	  "-moz-appearance": "none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized",
	  "-moz-binding": "<url>|none",
	  "-moz-border-bottom-colors": "<color>+|none",
	  "-moz-border-left-colors": "<color>+|none",
	  "-moz-border-right-colors": "<color>+|none",
	  "-moz-border-top-colors": "<color>+|none",
	  "-moz-context-properties": "none|[fill|fill-opacity|stroke|stroke-opacity]#",
	  "-moz-float-edge": "border-box|content-box|margin-box|padding-box",
	  "-moz-force-broken-image-icon": "<integer>",
	  "-moz-image-region": "<shape>|auto",
	  "-moz-orient": "inline|block|horizontal|vertical",
	  "-moz-outline-radius": "<outline-radius>{1,4} [/ <outline-radius>{1,4}]?",
	  "-moz-outline-radius-bottomleft": "<outline-radius>",
	  "-moz-outline-radius-bottomright": "<outline-radius>",
	  "-moz-outline-radius-topleft": "<outline-radius>",
	  "-moz-outline-radius-topright": "<outline-radius>",
	  "-moz-stack-sizing": "ignore|stretch-to-fit",
	  "-moz-text-blink": "none|blink",
	  "-moz-user-focus": "ignore|normal|select-after|select-before|select-menu|select-same|select-all|none",
	  "-moz-user-input": "auto|none|enabled|disabled",
	  "-moz-user-modify": "read-only|read-write|write-only",
	  "-moz-window-dragging": "drag|no-drag",
	  "-moz-window-shadow": "default|menu|tooltip|sheet|none",
	  "-webkit-appearance": "none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|listbox|listitem|media-fullscreen-button|media-mute-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield",
	  "-webkit-border-before": "<'border-width'>||<'border-style'>||<'color'>",
	  "-webkit-border-before-color": "<'color'>",
	  "-webkit-border-before-style": "<'border-style'>",
	  "-webkit-border-before-width": "<'border-width'>",
	  "-webkit-box-reflect": "[above|below|right|left]? <length>? <image>?",
	  "-webkit-line-clamp": "none|<integer>",
	  "-webkit-mask": "[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<box>|border|padding|content|text]||[<box>|border|padding|content]]#",
	  "-webkit-mask-attachment": "<attachment>#",
	  "-webkit-mask-clip": "[<box>|border|padding|content|text]#",
	  "-webkit-mask-composite": "<composite-style>#",
	  "-webkit-mask-image": "<mask-reference>#",
	  "-webkit-mask-origin": "[<box>|border|padding|content]#",
	  "-webkit-mask-position": "<position>#",
	  "-webkit-mask-position-x": "[<length-percentage>|left|center|right]#",
	  "-webkit-mask-position-y": "[<length-percentage>|top|center|bottom]#",
	  "-webkit-mask-repeat": "<repeat-style>#",
	  "-webkit-mask-repeat-x": "repeat|no-repeat|space|round",
	  "-webkit-mask-repeat-y": "repeat|no-repeat|space|round",
	  "-webkit-mask-size": "<bg-size>#",
	  "-webkit-overflow-scrolling": "auto|touch",
	  "-webkit-tap-highlight-color": "<color>",
	  "-webkit-text-fill-color": "<color>",
	  "-webkit-text-stroke": "<length>||<color>",
	  "-webkit-text-stroke-color": "<color>",
	  "-webkit-text-stroke-width": "<length>",
	  "-webkit-touch-callout": "default|none",
	  "-webkit-user-modify": "read-only|read-write|read-write-plaintext-only",
	  "align-content": "normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>",
	  "align-items": "normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]",
	  "align-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>",
	  all: "initial|inherit|unset|revert",
	  animation: "<single-animation>#",
	  "animation-delay": "<time>#",
	  "animation-direction": "<single-animation-direction>#",
	  "animation-duration": "<time>#",
	  "animation-fill-mode": "<single-animation-fill-mode>#",
	  "animation-iteration-count": "<single-animation-iteration-count>#",
	  "animation-name": "[none|<keyframes-name>]#",
	  "animation-play-state": "<single-animation-play-state>#",
	  "animation-timing-function": "<timing-function>#",
	  appearance: "none|auto|button|textfield|<compat>",
	  azimuth: "<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards",
	  "backdrop-filter": "none|<filter-function-list>",
	  "backface-visibility": "visible|hidden",
	  background: "[<bg-layer> ,]* <final-bg-layer>",
	  "background-attachment": "<attachment>#",
	  "background-blend-mode": "<blend-mode>#",
	  "background-clip": "<box>#",
	  "background-color": "<color>",
	  "background-image": "<bg-image>#",
	  "background-origin": "<box>#",
	  "background-position": "<bg-position>#",
	  "background-position-x": "[center|[left|right|x-start|x-end]? <length-percentage>?]#",
	  "background-position-y": "[center|[top|bottom|y-start|y-end]? <length-percentage>?]#",
	  "background-repeat": "<repeat-style>#",
	  "background-size": "<bg-size>#",
	  "block-overflow": "clip|ellipsis|<string>",
	  "block-size": "<'width'>",
	  border: "<line-width>||<line-style>||<color>",
	  "border-block": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	  "border-block-color": "<'border-top-color'>{1,2}",
	  "border-block-style": "<'border-top-style'>",
	  "border-block-width": "<'border-top-width'>",
	  "border-block-end": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	  "border-block-end-color": "<'border-top-color'>",
	  "border-block-end-style": "<'border-top-style'>",
	  "border-block-end-width": "<'border-top-width'>",
	  "border-block-start": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	  "border-block-start-color": "<'border-top-color'>",
	  "border-block-start-style": "<'border-top-style'>",
	  "border-block-start-width": "<'border-top-width'>",
	  "border-bottom": "<line-width>||<line-style>||<color>",
	  "border-bottom-color": "<'border-top-color'>",
	  "border-bottom-left-radius": "<length-percentage>{1,2}",
	  "border-bottom-right-radius": "<length-percentage>{1,2}",
	  "border-bottom-style": "<line-style>",
	  "border-bottom-width": "<line-width>",
	  "border-collapse": "collapse|separate",
	  "border-color": "<color>{1,4}",
	  "border-end-end-radius": "<length-percentage>{1,2}",
	  "border-end-start-radius": "<length-percentage>{1,2}",
	  "border-image": "<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>",
	  "border-image-outset": "[<length>|<number>]{1,4}",
	  "border-image-repeat": "[stretch|repeat|round|space]{1,2}",
	  "border-image-slice": "<number-percentage>{1,4}&&fill?",
	  "border-image-source": "none|<image>",
	  "border-image-width": "[<length-percentage>|<number>|auto]{1,4}",
	  "border-inline": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	  "border-inline-end": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	  "border-inline-color": "<'border-top-color'>{1,2}",
	  "border-inline-style": "<'border-top-style'>",
	  "border-inline-width": "<'border-top-width'>",
	  "border-inline-end-color": "<'border-top-color'>",
	  "border-inline-end-style": "<'border-top-style'>",
	  "border-inline-end-width": "<'border-top-width'>",
	  "border-inline-start": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	  "border-inline-start-color": "<'border-top-color'>",
	  "border-inline-start-style": "<'border-top-style'>",
	  "border-inline-start-width": "<'border-top-width'>",
	  "border-left": "<line-width>||<line-style>||<color>",
	  "border-left-color": "<color>",
	  "border-left-style": "<line-style>",
	  "border-left-width": "<line-width>",
	  "border-radius": "<length-percentage>{1,4} [/ <length-percentage>{1,4}]?",
	  "border-right": "<line-width>||<line-style>||<color>",
	  "border-right-color": "<color>",
	  "border-right-style": "<line-style>",
	  "border-right-width": "<line-width>",
	  "border-spacing": "<length> <length>?",
	  "border-start-end-radius": "<length-percentage>{1,2}",
	  "border-start-start-radius": "<length-percentage>{1,2}",
	  "border-style": "<line-style>{1,4}",
	  "border-top": "<line-width>||<line-style>||<color>",
	  "border-top-color": "<color>",
	  "border-top-left-radius": "<length-percentage>{1,2}",
	  "border-top-right-radius": "<length-percentage>{1,2}",
	  "border-top-style": "<line-style>",
	  "border-top-width": "<line-width>",
	  "border-width": "<line-width>{1,4}",
	  bottom: "<length>|<percentage>|auto",
	  "box-align": "start|center|end|baseline|stretch",
	  "box-decoration-break": "slice|clone",
	  "box-direction": "normal|reverse|inherit",
	  "box-flex": "<number>",
	  "box-flex-group": "<integer>",
	  "box-lines": "single|multiple",
	  "box-ordinal-group": "<integer>",
	  "box-orient": "horizontal|vertical|inline-axis|block-axis|inherit",
	  "box-pack": "start|center|end|justify",
	  "box-shadow": "none|<shadow>#",
	  "box-sizing": "content-box|border-box",
	  "break-after": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
	  "break-before": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
	  "break-inside": "auto|avoid|avoid-page|avoid-column|avoid-region",
	  "caption-side": "top|bottom|block-start|block-end|inline-start|inline-end",
	  "caret-color": "auto|<color>",
	  clear: "none|left|right|both|inline-start|inline-end",
	  clip: "<shape>|auto",
	  "clip-path": "<clip-source>|[<basic-shape>||<geometry-box>]|none",
	  color: "<color>",
	  "color-adjust": "economy|exact",
	  "column-count": "<integer>|auto",
	  "column-fill": "auto|balance|balance-all",
	  "column-gap": "normal|<length-percentage>",
	  "column-rule": "<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>",
	  "column-rule-color": "<color>",
	  "column-rule-style": "<'border-style'>",
	  "column-rule-width": "<'border-width'>",
	  "column-span": "none|all",
	  "column-width": "<length>|auto",
	  columns: "<'column-width'>||<'column-count'>",
	  contain: "none|strict|content|[size||layout||style||paint]",
	  content: "normal|none|[<content-replacement>|<content-list>] [/ <string>]?",
	  "counter-increment": "[<custom-ident> <integer>?]+|none",
	  "counter-reset": "[<custom-ident> <integer>?]+|none",
	  "counter-set": "[<custom-ident> <integer>?]+|none",
	  cursor: "[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]",
	  direction: "ltr|rtl",
	  display: "block|contents|flex|flow|flow-root|grid|inline|inline-block|inline-flex|inline-grid|inline-list-item|inline-table|list-item|none|ruby|ruby-base|ruby-base-container|ruby-text|ruby-text-container|run-in|table|table-caption|table-cell|table-column|table-column-group|table-footer-group|table-header-group|table-row|table-row-group|-ms-flexbox|-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box",
	  "empty-cells": "show|hide",
	  filter: "none|<filter-function-list>|<-ms-filter-function-list>",
	  flex: "none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]",
	  "flex-basis": "content|<'width'>",
	  "flex-direction": "row|row-reverse|column|column-reverse",
	  "flex-flow": "<'flex-direction'>||<'flex-wrap'>",
	  "flex-grow": "<number>",
	  "flex-shrink": "<number>",
	  "flex-wrap": "nowrap|wrap|wrap-reverse",
	  float: "left|right|none|inline-start|inline-end",
	  font: "[[<'font-style'>||<font-variant-css21>||<'font-weight'>||<'font-stretch'>]? <'font-size'> [/ <'line-height'>]? <'font-family'>]|caption|icon|menu|message-box|small-caption|status-bar",
	  "font-family": "[<family-name>|<generic-family>]#",
	  "font-feature-settings": "normal|<feature-tag-value>#",
	  "font-kerning": "auto|normal|none",
	  "font-language-override": "normal|<string>",
	  "font-optical-sizing": "auto|none",
	  "font-variation-settings": "normal|[<string> <number>]#",
	  "font-size": "<absolute-size>|<relative-size>|<length-percentage>",
	  "font-size-adjust": "none|<number>",
	  "font-stretch": "<font-stretch-absolute>",
	  "font-style": "normal|italic|oblique <angle>?",
	  "font-synthesis": "none|[weight||style]",
	  "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
	  "font-variant-alternates": "normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]",
	  "font-variant-caps": "normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps",
	  "font-variant-east-asian": "normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]",
	  "font-variant-ligatures": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]",
	  "font-variant-numeric": "normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]",
	  "font-variant-position": "normal|sub|super",
	  "font-weight": "<font-weight-absolute>|bolder|lighter",
	  gap: "<'row-gap'> <'column-gap'>?",
	  grid: "<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>",
	  "grid-area": "<grid-line> [/ <grid-line>]{0,3}",
	  "grid-auto-columns": "<track-size>+",
	  "grid-auto-flow": "[row|column]||dense",
	  "grid-auto-rows": "<track-size>+",
	  "grid-column": "<grid-line> [/ <grid-line>]?",
	  "grid-column-end": "<grid-line>",
	  "grid-column-gap": "<length-percentage>",
	  "grid-column-start": "<grid-line>",
	  "grid-gap": "<'grid-row-gap'> <'grid-column-gap'>?",
	  "grid-row": "<grid-line> [/ <grid-line>]?",
	  "grid-row-end": "<grid-line>",
	  "grid-row-gap": "<length-percentage>",
	  "grid-row-start": "<grid-line>",
	  "grid-template": "none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?",
	  "grid-template-areas": "none|<string>+",
	  "grid-template-columns": "none|<track-list>|<auto-track-list>",
	  "grid-template-rows": "none|<track-list>|<auto-track-list>",
	  "hanging-punctuation": "none|[first||[force-end|allow-end]||last]",
	  height: "[<length>|<percentage>]&&[border-box|content-box]?|available|min-content|max-content|fit-content|auto",
	  hyphens: "none|manual|auto",
	  "image-orientation": "from-image|<angle>|[<angle>? flip]",
	  "image-rendering": "auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>",
	  "image-resolution": "[from-image||<resolution>]&&snap?",
	  "ime-mode": "auto|normal|active|inactive|disabled",
	  "initial-letter": "normal|[<number> <integer>?]",
	  "initial-letter-align": "[auto|alphabetic|hanging|ideographic]",
	  "inline-size": "<'width'>",
	  inset: "<'top'>{1,4}",
	  "inset-block": "<'top'>{1,2}",
	  "inset-block-end": "<'top'>",
	  "inset-block-start": "<'top'>",
	  "inset-inline": "<'top'>{1,2}",
	  "inset-inline-end": "<'top'>",
	  "inset-inline-start": "<'top'>",
	  isolation: "auto|isolate",
	  "justify-content": "normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]",
	  "justify-items": "normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]",
	  "justify-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]",
	  left: "<length>|<percentage>|auto",
	  "letter-spacing": "normal|<length-percentage>",
	  "line-break": "auto|loose|normal|strict",
	  "line-clamp": "none|<integer>",
	  "line-height": "normal|<number>|<length>|<percentage>",
	  "line-height-step": "<length>",
	  "list-style": "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
	  "list-style-image": "<url>|none",
	  "list-style-position": "inside|outside",
	  "list-style-type": "<counter-style>|<string>|none",
	  margin: "[<length>|<percentage>|auto]{1,4}",
	  "margin-block": "<'margin-left'>{1,2}",
	  "margin-block-end": "<'margin-left'>",
	  "margin-block-start": "<'margin-left'>",
	  "margin-bottom": "<length>|<percentage>|auto",
	  "margin-inline": "<'margin-left'>{1,2}",
	  "margin-inline-end": "<'margin-left'>",
	  "margin-inline-start": "<'margin-left'>",
	  "margin-left": "<length>|<percentage>|auto",
	  "margin-right": "<length>|<percentage>|auto",
	  "margin-top": "<length>|<percentage>|auto",
	  mask: "<mask-layer>#",
	  "mask-border": "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
	  "mask-border-mode": "luminance|alpha",
	  "mask-border-outset": "[<length>|<number>]{1,4}",
	  "mask-border-repeat": "[stretch|repeat|round|space]{1,2}",
	  "mask-border-slice": "<number-percentage>{1,4} fill?",
	  "mask-border-source": "none|<image>",
	  "mask-border-width": "[<length-percentage>|<number>|auto]{1,4}",
	  "mask-clip": "[<geometry-box>|no-clip]#",
	  "mask-composite": "<compositing-operator>#",
	  "mask-image": "<mask-reference>#",
	  "mask-mode": "<masking-mode>#",
	  "mask-origin": "<geometry-box>#",
	  "mask-position": "<position>#",
	  "mask-repeat": "<repeat-style>#",
	  "mask-size": "<bg-size>#",
	  "mask-type": "luminance|alpha",
	  "max-block-size": "<'max-width'>",
	  "max-height": "<length>|<percentage>|none|max-content|min-content|fit-content|fill-available",
	  "max-inline-size": "<'max-width'>",
	  "max-lines": "none|<integer>",
	  "max-width": "<length>|<percentage>|none|max-content|min-content|fit-content|fill-available|<-non-standard-width>",
	  "min-block-size": "<'min-width'>",
	  "min-height": "<length>|<percentage>|auto|max-content|min-content|fit-content|fill-available",
	  "min-inline-size": "<'min-width'>",
	  "min-width": "<length>|<percentage>|auto|max-content|min-content|fit-content|fill-available|<-non-standard-width>",
	  "mix-blend-mode": "<blend-mode>",
	  "object-fit": "fill|contain|cover|none|scale-down",
	  "object-position": "<position>",
	  offset: "[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?",
	  "offset-anchor": "auto|<position>",
	  "offset-distance": "<length-percentage>",
	  "offset-path": "none|ray( [<angle>&&<size>?&&contain?] )|<path()>|<url>|[<basic-shape>||<geometry-box>]",
	  "offset-position": "auto|<position>",
	  "offset-rotate": "[auto|reverse]||<angle>",
	  opacity: "<number-zero-one>",
	  order: "<integer>",
	  orphans: "<integer>",
	  outline: "[<'outline-color'>||<'outline-style'>||<'outline-width'>]",
	  "outline-color": "<color>|invert",
	  "outline-offset": "<length>",
	  "outline-style": "auto|<'border-style'>",
	  "outline-width": "<line-width>",
	  overflow: "[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>",
	  "overflow-anchor": "auto|none",
	  "overflow-block": "visible|hidden|clip|scroll|auto",
	  "overflow-clip-box": "padding-box|content-box",
	  "overflow-inline": "visible|hidden|clip|scroll|auto",
	  "overflow-wrap": "normal|break-word|anywhere",
	  "overflow-x": "visible|hidden|clip|scroll|auto",
	  "overflow-y": "visible|hidden|clip|scroll|auto",
	  "overscroll-behavior": "[contain|none|auto]{1,2}",
	  "overscroll-behavior-x": "contain|none|auto",
	  "overscroll-behavior-y": "contain|none|auto",
	  padding: "[<length>|<percentage>]{1,4}",
	  "padding-block": "<'padding-left'>{1,2}",
	  "padding-block-end": "<'padding-left'>",
	  "padding-block-start": "<'padding-left'>",
	  "padding-bottom": "<length>|<percentage>",
	  "padding-inline": "<'padding-left'>{1,2}",
	  "padding-inline-end": "<'padding-left'>",
	  "padding-inline-start": "<'padding-left'>",
	  "padding-left": "<length>|<percentage>",
	  "padding-right": "<length>|<percentage>",
	  "padding-top": "<length>|<percentage>",
	  "page-break-after": "auto|always|avoid|left|right|recto|verso",
	  "page-break-before": "auto|always|avoid|left|right|recto|verso",
	  "page-break-inside": "auto|avoid",
	  "paint-order": "normal|[fill||stroke||markers]",
	  perspective: "none|<length>",
	  "perspective-origin": "<position>",
	  "place-content": "<'align-content'> <'justify-content'>?",
	  "place-items": "<'align-items'> <'justify-items'>?",
	  "place-self": "<'align-self'> <'justify-self'>?",
	  "pointer-events": "auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit",
	  position: "static|relative|absolute|sticky|fixed|-webkit-sticky",
	  quotes: "none|[<string> <string>]+",
	  resize: "none|both|horizontal|vertical|block|inline",
	  right: "<length>|<percentage>|auto",
	  rotate: "none|<angle>|[x|y|z|<number>{3}]&&<angle>",
	  "row-gap": "normal|<length-percentage>",
	  "ruby-align": "start|center|space-between|space-around",
	  "ruby-merge": "separate|collapse|auto",
	  "ruby-position": "over|under|inter-character",
	  scale: "none|<number>{1,3}",
	  "scrollbar-color": "auto|dark|light|<color>{2}",
	  "scrollbar-width": "auto|thin|none",
	  "scroll-behavior": "auto|smooth",
	  "scroll-margin": "<length>{1,4}",
	  "scroll-margin-block": "<length>{1,2}",
	  "scroll-margin-block-start": "<length>",
	  "scroll-margin-block-end": "<length>",
	  "scroll-margin-bottom": "<length>",
	  "scroll-margin-inline": "<length>{1,2}",
	  "scroll-margin-inline-start": "<length>",
	  "scroll-margin-inline-end": "<length>",
	  "scroll-margin-left": "<length>",
	  "scroll-margin-right": "<length>",
	  "scroll-margin-top": "<length>",
	  "scroll-padding": "[auto|<length-percentage>]{1,4}",
	  "scroll-padding-block": "[auto|<length-percentage>]{1,2}",
	  "scroll-padding-block-start": "auto|<length-percentage>",
	  "scroll-padding-block-end": "auto|<length-percentage>",
	  "scroll-padding-bottom": "auto|<length-percentage>",
	  "scroll-padding-inline": "[auto|<length-percentage>]{1,2}",
	  "scroll-padding-inline-start": "auto|<length-percentage>",
	  "scroll-padding-inline-end": "auto|<length-percentage>",
	  "scroll-padding-left": "auto|<length-percentage>",
	  "scroll-padding-right": "auto|<length-percentage>",
	  "scroll-padding-top": "auto|<length-percentage>",
	  "scroll-snap-align": "[none|start|end|center]{1,2}",
	  "scroll-snap-coordinate": "none|<position>#",
	  "scroll-snap-destination": "<position>",
	  "scroll-snap-points-x": "none|repeat( <length-percentage> )",
	  "scroll-snap-points-y": "none|repeat( <length-percentage> )",
	  "scroll-snap-stop": "normal|always",
	  "scroll-snap-type": "none|[x|y|block|inline|both] [mandatory|proximity]?",
	  "scroll-snap-type-x": "none|mandatory|proximity",
	  "scroll-snap-type-y": "none|mandatory|proximity",
	  "shape-image-threshold": "<number>",
	  "shape-margin": "<length-percentage>",
	  "shape-outside": "none|<shape-box>||<basic-shape>|<image>",
	  "tab-size": "<integer>|<length>",
	  "table-layout": "auto|fixed",
	  "text-align": "start|end|left|right|center|justify|match-parent",
	  "text-align-last": "auto|start|end|left|right|center|justify",
	  "text-combine-upright": "none|all|[digits <integer>?]",
	  "text-decoration": "<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>",
	  "text-decoration-color": "<color>",
	  "text-decoration-line": "none|[underline||overline||line-through||blink]",
	  "text-decoration-skip": "none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]",
	  "text-decoration-skip-ink": "auto|none",
	  "text-decoration-style": "solid|double|dotted|dashed|wavy",
	  "text-emphasis": "<'text-emphasis-style'>||<'text-emphasis-color'>",
	  "text-emphasis-color": "<color>",
	  "text-emphasis-position": "[over|under]&&[right|left]",
	  "text-emphasis-style": "none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>",
	  "text-indent": "<length-percentage>&&hanging?&&each-line?",
	  "text-justify": "auto|inter-character|inter-word|none",
	  "text-orientation": "mixed|upright|sideways",
	  "text-overflow": "[clip|ellipsis|<string>]{1,2}",
	  "text-rendering": "auto|optimizeSpeed|optimizeLegibility|geometricPrecision",
	  "text-shadow": "none|<shadow-t>#",
	  "text-size-adjust": "none|auto|<percentage>",
	  "text-transform": "none|capitalize|uppercase|lowercase|full-width|full-size-kana",
	  "text-underline-position": "auto|[under||[left|right]]",
	  top: "<length>|<percentage>|auto",
	  "touch-action": "auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation",
	  transform: "none|<transform-list>",
	  "transform-box": "border-box|fill-box|view-box",
	  "transform-origin": "[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?",
	  "transform-style": "flat|preserve-3d",
	  transition: "<single-transition>#",
	  "transition-delay": "<time>#",
	  "transition-duration": "<time>#",
	  "transition-property": "none|<single-transition-property>#",
	  "transition-timing-function": "<timing-function>#",
	  translate: "none|<length-percentage> [<length-percentage> <length>?]?",
	  "unicode-bidi": "normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate",
	  "user-select": "auto|text|none|contain|all",
	  "vertical-align": "baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>",
	  visibility: "visible|hidden|collapse",
	  "white-space": "normal|pre|nowrap|pre-wrap|pre-line",
	  widows: "<integer>",
	  width: "[<length>|<percentage>]&&[border-box|content-box]?|available|min-content|max-content|fit-content|auto",
	  "will-change": "auto|<animateable-feature>#",
	  "word-break": "normal|break-all|keep-all|break-word",
	  "word-spacing": "normal|<length-percentage>",
	  "word-wrap": "normal|break-word",
	  "writing-mode": "horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>",
	  "z-index": "auto|<integer>",
	  zoom: "normal|reset|<number>|<percentage>",
	  "-moz-background-clip": "padding|border",
	  "-moz-border-radius-bottomleft": "<'border-bottom-left-radius'>",
	  "-moz-border-radius-bottomright": "<'border-bottom-right-radius'>",
	  "-moz-border-radius-topleft": "<'border-top-left-radius'>",
	  "-moz-border-radius-topright": "<'border-bottom-right-radius'>",
	  "-moz-control-character-visibility": "visible|hidden",
	  "-moz-osx-font-smoothing": "auto|grayscale",
	  "-moz-user-select": "none|text|all|-moz-none",
	  "-ms-flex-align": "start|end|center|baseline|stretch",
	  "-ms-flex-item-align": "auto|start|end|center|baseline|stretch",
	  "-ms-flex-line-pack": "start|end|center|justify|distribute|stretch",
	  "-ms-flex-negative": "<'flex-shrink'>",
	  "-ms-flex-pack": "start|end|center|justify|distribute",
	  "-ms-flex-order": "<integer>",
	  "-ms-flex-positive": "<'flex-grow'>",
	  "-ms-flex-preferred-size": "<'flex-basis'>",
	  "-ms-interpolation-mode": "nearest-neighbor|bicubic",
	  "-ms-grid-column-align": "start|end|center|stretch",
	  "-ms-grid-columns": "<track-list-v0>",
	  "-ms-grid-row-align": "start|end|center|stretch",
	  "-ms-grid-rows": "<track-list-v0>",
	  "-ms-hyphenate-limit-last": "none|always|column|page|spread",
	  "-webkit-background-clip": "[<box>|border|padding|content|text]#",
	  "-webkit-column-break-after": "always|auto|avoid",
	  "-webkit-column-break-before": "always|auto|avoid",
	  "-webkit-column-break-inside": "always|auto|avoid",
	  "-webkit-font-smoothing": "auto|none|antialiased|subpixel-antialiased",
	  "-webkit-mask-box-image": "[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?",
	  "-webkit-print-color-adjust": "economy|exact",
	  "-webkit-text-security": "none|circle|disc|square",
	  "-webkit-user-drag": "none|element|auto",
	  "-webkit-user-select": "auto|none|text|all",
	  "alignment-baseline": "auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical",
	  "baseline-shift": "baseline|sub|super|<svg-length>",
	  behavior: "<url>+",
	  "clip-rule": "nonzero|evenodd",
	  cue: "<'cue-before'> <'cue-after'>?",
	  "cue-after": "<url> <decibel>?|none",
	  "cue-before": "<url> <decibel>?|none",
	  "dominant-baseline": "auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge",
	  fill: "<paint>",
	  "fill-opacity": "<number-zero-one>",
	  "fill-rule": "nonzero|evenodd",
	  "glyph-orientation-horizontal": "<angle>",
	  "glyph-orientation-vertical": "<angle>",
	  kerning: "auto|<svg-length>",
	  marker: "none|<url>",
	  "marker-end": "none|<url>",
	  "marker-mid": "none|<url>",
	  "marker-start": "none|<url>",
	  pause: "<'pause-before'> <'pause-after'>?",
	  "pause-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
	  "pause-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
	  rest: "<'rest-before'> <'rest-after'>?",
	  "rest-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
	  "rest-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
	  "shape-rendering": "auto|optimizeSpeed|crispEdges|geometricPrecision",
	  src: "[<url> [format( <string># )]?|local( <family-name> )]#",
	  speak: "auto|none|normal",
	  "speak-as": "normal|spell-out||digits||[literal-punctuation|no-punctuation]",
	  stroke: "<paint>",
	  "stroke-dasharray": "none|[<svg-length>+]#",
	  "stroke-dashoffset": "<svg-length>",
	  "stroke-linecap": "butt|round|square",
	  "stroke-linejoin": "miter|round|bevel",
	  "stroke-miterlimit": "<number-one-or-greater>",
	  "stroke-opacity": "<number-zero-one>",
	  "stroke-width": "<svg-length>",
	  "text-anchor": "start|middle|end",
	  "unicode-range": "<urange>#",
	  "voice-balance": "<number>|left|center|right|leftwards|rightwards",
	  "voice-duration": "auto|<time>",
	  "voice-family": "[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve",
	  "voice-pitch": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
	  "voice-range": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
	  "voice-rate": "[normal|x-slow|slow|medium|fast|x-fast]||<percentage>",
	  "voice-stress": "normal|strong|moderate|none|reduced",
	  "voice-volume": "silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]"
	},
	    Ir = {
	  generic: !0,
	  types: Nr,
	  properties: Rr
	},
	    Br = window.Object.freeze({
	  generic: !0,
	  types: Nr,
	  properties: Rr,
	  default: Ir
	}),
	    Mr = ze.cmpChar,
	    jr = ze.isDigit,
	    _r = ze.TYPE,
	    Fr = _r.WhiteSpace,
	    Ur = _r.Comment,
	    qr = _r.Ident,
	    Wr = _r.Number,
	    Yr = _r.Dimension;

	function Vr(e, t) {
	  var n = this.scanner.tokenStart + e,
	      r = this.scanner.source.charCodeAt(n);

	  for (43 !== r && 45 !== r || (t && this.error("Number sign is not allowed"), n++); n < this.scanner.tokenEnd; n++) jr(this.scanner.source.charCodeAt(n)) || this.error("Integer is expected", n);
	}

	function Hr(e) {
	  return Vr.call(this, 0, e);
	}

	function $r(e, t) {
	  if (!Mr(this.scanner.source, this.scanner.tokenStart + e, t)) {
	    var n = "";

	    switch (t) {
	      case 110:
	        n = "N is expected";
	        break;

	      case 45:
	        n = "HyphenMinus is expected";
	    }

	    this.error(n, this.scanner.tokenStart + e);
	  }
	}

	function Gr() {
	  for (var e = 0, t = 0, n = this.scanner.tokenType; n === Fr || n === Ur;) n = this.scanner.lookupType(++e);

	  if (n !== Wr) {
	    if (!this.scanner.isDelim(43, e) && !this.scanner.isDelim(45, e)) return null;
	    t = this.scanner.isDelim(43, e) ? 43 : 45;

	    do {
	      n = this.scanner.lookupType(++e);
	    } while (n === Fr || n === Ur);

	    n !== Wr && (this.scanner.skip(e), Hr.call(this, !0));
	  }

	  return e > 0 && this.scanner.skip(e), 0 === t && 43 !== (n = this.scanner.source.charCodeAt(this.scanner.tokenStart)) && 45 !== n && this.error("Number sign is expected"), Hr.call(this, 0 !== t), 45 === t ? "-" + this.consume(Wr) : this.consume(Wr);
	}

	var Kr = {
	  name: "AnPlusB",
	  structure: {
	    a: [String, null],
	    b: [String, null]
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart,
	        t = null,
	        n = null;
	    if (this.scanner.tokenType === Wr) Hr.call(this, !1), n = this.consume(Wr);else if (this.scanner.tokenType === qr && Mr(this.scanner.source, this.scanner.tokenStart, 45)) switch (t = "-1", $r.call(this, 1, 110), this.scanner.getTokenLength()) {
	      case 2:
	        this.scanner.next(), n = Gr.call(this);
	        break;

	      case 3:
	        $r.call(this, 2, 45), this.scanner.next(), this.scanner.skipSC(), Hr.call(this, !0), n = "-" + this.consume(Wr);
	        break;

	      default:
	        $r.call(this, 2, 45), Vr.call(this, 3, !0), this.scanner.next(), n = this.scanner.substrToCursor(e + 2);
	    } else if (this.scanner.tokenType === qr || this.scanner.isDelim(43) && this.scanner.lookupType(1) === qr) {
	      var r = 0;

	      switch (t = "1", this.scanner.isDelim(43) && (r = 1, this.scanner.next()), $r.call(this, 0, 110), this.scanner.getTokenLength()) {
	        case 1:
	          this.scanner.next(), n = Gr.call(this);
	          break;

	        case 2:
	          $r.call(this, 1, 45), this.scanner.next(), this.scanner.skipSC(), Hr.call(this, !0), n = "-" + this.consume(Wr);
	          break;

	        default:
	          $r.call(this, 1, 45), Vr.call(this, 2, !0), this.scanner.next(), n = this.scanner.substrToCursor(e + r + 1);
	      }
	    } else if (this.scanner.tokenType === Yr) {
	      for (var o = this.scanner.source.charCodeAt(this.scanner.tokenStart), a = (r = 43 === o || 45 === o, this.scanner.tokenStart + r); a < this.scanner.tokenEnd && jr(this.scanner.source.charCodeAt(a)); a++);

	      a === this.scanner.tokenStart + r && this.error("Integer is expected", this.scanner.tokenStart + r), $r.call(this, a - this.scanner.tokenStart, 110), t = this.scanner.source.substring(e, a), a + 1 === this.scanner.tokenEnd ? (this.scanner.next(), n = Gr.call(this)) : ($r.call(this, a - this.scanner.tokenStart + 1, 45), a + 2 === this.scanner.tokenEnd ? (this.scanner.next(), this.scanner.skipSC(), Hr.call(this, !0), n = "-" + this.consume(Wr)) : (Vr.call(this, a - this.scanner.tokenStart + 2, !0), this.scanner.next(), n = this.scanner.substrToCursor(a + 1)));
	    } else this.error();
	    return null !== t && 43 === t.charCodeAt(0) && (t = t.substr(1)), null !== n && 43 === n.charCodeAt(0) && (n = n.substr(1)), {
	      type: "AnPlusB",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      a: t,
	      b: n
	    };
	  },
	  generate: function (e) {
	    var t = null !== e.a && void 0 !== e.a,
	        n = null !== e.b && void 0 !== e.b;
	    t ? (this.chunk("+1" === e.a ? "+n" : "1" === e.a ? "n" : "-1" === e.a ? "-n" : e.a + "n"), n && ("-" === (n = String(e.b)).charAt(0) || "+" === n.charAt(0) ? (this.chunk(n.charAt(0)), this.chunk(n.substr(1))) : (this.chunk("+"), this.chunk(n)))) : this.chunk(String(e.b));
	  }
	},
	    Xr = ze.TYPE,
	    Qr = Xr.WhiteSpace,
	    Zr = Xr.Semicolon,
	    Jr = Xr.LeftCurlyBracket,
	    eo = Xr.Delim;

	function to() {
	  return this.scanner.tokenIndex > 0 && this.scanner.lookupType(-1) === Qr ? this.scanner.tokenIndex > 1 ? this.scanner.getTokenStart(this.scanner.tokenIndex - 1) : this.scanner.firstCharOffset : this.scanner.tokenStart;
	}

	function no() {
	  return 0;
	}

	var ro = {
	  name: "Raw",
	  structure: {
	    value: String
	  },
	  parse: function (e, t, n) {
	    var r,
	        o = this.scanner.getTokenStart(e);
	    return this.scanner.skip(this.scanner.getRawLength(e, t || no)), r = n && this.scanner.tokenStart > o ? to.call(this) : this.scanner.tokenStart, {
	      type: "Raw",
	      loc: this.getLocation(o, r),
	      value: this.scanner.source.substring(o, r)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value);
	  },
	  mode: {
	    default: no,
	    leftCurlyBracket: function (e) {
	      return e === Jr ? 1 : 0;
	    },
	    leftCurlyBracketOrSemicolon: function (e) {
	      return e === Jr || e === Zr ? 1 : 0;
	    },
	    exclamationMarkOrSemicolon: function (e, t, n) {
	      return e === eo && 33 === t.charCodeAt(n) || e === Zr ? 1 : 0;
	    },
	    semicolonIncluded: function (e) {
	      return e === Zr ? 2 : 0;
	    }
	  }
	},
	    oo = ze.TYPE,
	    ao = ro.mode,
	    io = oo.AtKeyword,
	    so = oo.Semicolon,
	    lo = oo.LeftCurlyBracket,
	    co = oo.RightCurlyBracket;

	function uo(e) {
	  return this.Raw(e, ao.leftCurlyBracketOrSemicolon, !0);
	}

	function ho() {
	  for (var e, t = 1; e = this.scanner.lookupType(t); t++) {
	    if (e === co) return !0;
	    if (e === lo || e === io) return !1;
	  }

	  return !1;
	}

	var po = {
	  name: "Atrule",
	  structure: {
	    name: String,
	    prelude: ["AtrulePrelude", "Raw", null],
	    block: ["Block", null]
	  },
	  parse: function () {
	    var e,
	        t,
	        n = this.scanner.tokenStart,
	        r = null,
	        o = null;

	    switch (this.eat(io), t = (e = this.scanner.substrToCursor(n + 1)).toLowerCase(), this.scanner.skipSC(), !1 === this.scanner.eof && this.scanner.tokenType !== lo && this.scanner.tokenType !== so && (this.parseAtrulePrelude ? "AtrulePrelude" === (r = this.parseWithFallback(this.AtrulePrelude.bind(this, e), uo)).type && null === r.children.head && (r = null) : r = uo.call(this, this.scanner.tokenIndex), this.scanner.skipSC()), this.scanner.tokenType) {
	      case so:
	        this.scanner.next();
	        break;

	      case lo:
	        o = this.atrule.hasOwnProperty(t) && "function" == typeof this.atrule[t].block ? this.atrule[t].block.call(this) : this.Block(ho.call(this));
	    }

	    return {
	      type: "Atrule",
	      loc: this.getLocation(n, this.scanner.tokenStart),
	      name: e,
	      prelude: r,
	      block: o
	    };
	  },
	  generate: function (e) {
	    this.chunk("@"), this.chunk(e.name), null !== e.prelude && (this.chunk(" "), this.node(e.prelude)), e.block ? this.node(e.block) : this.chunk(";");
	  },
	  walkContext: "atrule"
	},
	    mo = ze.TYPE,
	    fo = mo.Semicolon,
	    go = mo.LeftCurlyBracket,
	    bo = {
	  name: "AtrulePrelude",
	  structure: {
	    children: [[]]
	  },
	  parse: function (e) {
	    var t = null;
	    return null !== e && (e = e.toLowerCase()), this.scanner.skipSC(), t = this.atrule.hasOwnProperty(e) && "function" == typeof this.atrule[e].prelude ? this.atrule[e].prelude.call(this) : this.readSequence(this.scope.AtrulePrelude), this.scanner.skipSC(), !0 !== this.scanner.eof && this.scanner.tokenType !== go && this.scanner.tokenType !== fo && this.error("Semicolon or block is expected"), null === t && (t = this.createList()), {
	      type: "AtrulePrelude",
	      loc: this.getLocationFromList(t),
	      children: t
	    };
	  },
	  generate: function (e) {
	    this.children(e);
	  },
	  walkContext: "atrulePrelude"
	},
	    yo = ze.TYPE,
	    ko = yo.Ident,
	    vo = yo.String,
	    wo = yo.Colon,
	    xo = yo.LeftSquareBracket,
	    So = yo.RightSquareBracket;

	function Co() {
	  this.scanner.eof && this.error("Unexpected end of input");
	  var e = this.scanner.tokenStart,
	      t = !1,
	      n = !0;
	  return this.scanner.isDelim(42) ? (t = !0, n = !1, this.scanner.next()) : this.scanner.isDelim(124) || this.eat(ko), this.scanner.isDelim(124) ? 61 !== this.scanner.source.charCodeAt(this.scanner.tokenStart + 1) ? (this.scanner.next(), this.eat(ko)) : t && this.error("Identifier is expected", this.scanner.tokenEnd) : t && this.error("Vertical line is expected"), n && this.scanner.tokenType === wo && (this.scanner.next(), this.eat(ko)), {
	    type: "Identifier",
	    loc: this.getLocation(e, this.scanner.tokenStart),
	    name: this.scanner.substrToCursor(e)
	  };
	}

	function Ao() {
	  var e = this.scanner.tokenStart,
	      t = this.scanner.source.charCodeAt(e);
	  return 61 !== t && 126 !== t && 94 !== t && 36 !== t && 42 !== t && 124 !== t && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), this.scanner.next(), 61 !== t && (this.scanner.isDelim(61) || this.error("Equal sign is expected"), this.scanner.next()), this.scanner.substrToCursor(e);
	}

	var To = {
	  name: "AttributeSelector",
	  structure: {
	    name: "Identifier",
	    matcher: [String, null],
	    value: ["String", "Identifier", null],
	    flags: [String, null]
	  },
	  parse: function () {
	    var e,
	        t = this.scanner.tokenStart,
	        n = null,
	        r = null,
	        o = null;
	    return this.eat(xo), this.scanner.skipSC(), e = Co.call(this), this.scanner.skipSC(), this.scanner.tokenType !== So && (this.scanner.tokenType !== ko && (n = Ao.call(this), this.scanner.skipSC(), r = this.scanner.tokenType === vo ? this.String() : this.Identifier(), this.scanner.skipSC()), this.scanner.tokenType === ko && (o = this.scanner.getTokenValue(), this.scanner.next(), this.scanner.skipSC())), this.eat(So), {
	      type: "AttributeSelector",
	      loc: this.getLocation(t, this.scanner.tokenStart),
	      name: e,
	      matcher: n,
	      value: r,
	      flags: o
	    };
	  },
	  generate: function (e) {
	    var t = " ";
	    this.chunk("["), this.node(e.name), null !== e.matcher && (this.chunk(e.matcher), null !== e.value && (this.node(e.value), "String" === e.value.type && (t = ""))), null !== e.flags && (this.chunk(t), this.chunk(e.flags)), this.chunk("]");
	  }
	},
	    zo = ze.TYPE,
	    Po = ro.mode,
	    Eo = zo.WhiteSpace,
	    Lo = zo.Comment,
	    Oo = zo.Semicolon,
	    Do = zo.AtKeyword,
	    No = zo.LeftCurlyBracket,
	    Ro = zo.RightCurlyBracket;

	function Io(e) {
	  return this.Raw(e, null, !0);
	}

	function Bo() {
	  return this.parseWithFallback(this.Rule, Io);
	}

	function Mo(e) {
	  return this.Raw(e, Po.semicolonIncluded, !0);
	}

	function jo() {
	  if (this.scanner.tokenType === Oo) return Mo.call(this, this.scanner.tokenIndex);
	  var e = this.parseWithFallback(this.Declaration, Mo);
	  return this.scanner.tokenType === Oo && this.scanner.next(), e;
	}

	var _o = {
	  name: "Block",
	  structure: {
	    children: [["Atrule", "Rule", "Declaration"]]
	  },
	  parse: function (e) {
	    var t = e ? jo : Bo,
	        n = this.scanner.tokenStart,
	        r = this.createList();
	    this.eat(No);

	    e: for (; !this.scanner.eof;) switch (this.scanner.tokenType) {
	      case Ro:
	        break e;

	      case Eo:
	      case Lo:
	        this.scanner.next();
	        break;

	      case Do:
	        r.push(this.parseWithFallback(this.Atrule, Io));
	        break;

	      default:
	        r.push(t.call(this));
	    }

	    return this.scanner.eof || this.eat(Ro), {
	      type: "Block",
	      loc: this.getLocation(n, this.scanner.tokenStart),
	      children: r
	    };
	  },
	  generate: function (e) {
	    this.chunk("{"), this.children(e, function (e) {
	      "Declaration" === e.type && this.chunk(";");
	    }), this.chunk("}");
	  },
	  walkContext: "block"
	},
	    Fo = ze.TYPE,
	    Uo = Fo.LeftSquareBracket,
	    qo = Fo.RightSquareBracket,
	    Wo = {
	  name: "Brackets",
	  structure: {
	    children: [[]]
	  },
	  parse: function (e, t) {
	    var n,
	        r = this.scanner.tokenStart;
	    return this.eat(Uo), n = e.call(this, t), this.scanner.eof || this.eat(qo), {
	      type: "Brackets",
	      loc: this.getLocation(r, this.scanner.tokenStart),
	      children: n
	    };
	  },
	  generate: function (e) {
	    this.chunk("["), this.children(e), this.chunk("]");
	  }
	},
	    Yo = ze.TYPE.CDC,
	    Vo = {
	  name: "CDC",
	  structure: [],
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.eat(Yo), {
	      type: "CDC",
	      loc: this.getLocation(e, this.scanner.tokenStart)
	    };
	  },
	  generate: function () {
	    this.chunk("--\x3e");
	  }
	},
	    Ho = ze.TYPE.CDO,
	    $o = {
	  name: "CDO",
	  structure: [],
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.eat(Ho), {
	      type: "CDO",
	      loc: this.getLocation(e, this.scanner.tokenStart)
	    };
	  },
	  generate: function () {
	    this.chunk("\x3c!--");
	  }
	},
	    Go = ze.TYPE.Ident,
	    Ko = {
	  name: "ClassSelector",
	  structure: {
	    name: String
	  },
	  parse: function () {
	    return this.scanner.isDelim(46) || this.error("Full stop is expected"), this.scanner.next(), {
	      type: "ClassSelector",
	      loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
	      name: this.consume(Go)
	    };
	  },
	  generate: function (e) {
	    this.chunk("."), this.chunk(e.name);
	  }
	},
	    Xo = ze.TYPE.Ident,
	    Qo = {
	  name: "Combinator",
	  structure: {
	    name: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart;

	    switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
	      case 62:
	      case 43:
	      case 126:
	        this.scanner.next();
	        break;

	      case 47:
	        this.scanner.next(), this.scanner.tokenType === Xo && !1 !== this.scanner.lookupValue(0, "deep") || this.error("Identifier `deep` is expected"), this.scanner.next(), this.scanner.isDelim(47) || this.error("Solidus is expected"), this.scanner.next();
	        break;

	      default:
	        this.error("Combinator is expected");
	    }

	    return {
	      type: "Combinator",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      name: this.scanner.substrToCursor(e)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.name);
	  }
	},
	    Zo = ze.TYPE.Comment,
	    Jo = {
	  name: "Comment",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart,
	        t = this.scanner.tokenEnd;
	    return this.eat(Zo), t - e + 2 >= 2 && 42 === this.scanner.source.charCodeAt(t - 2) && 47 === this.scanner.source.charCodeAt(t - 1) && (t -= 2), {
	      type: "Comment",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      value: this.scanner.source.substring(e + 2, t)
	    };
	  },
	  generate: function (e) {
	    this.chunk("/*"), this.chunk(e.value), this.chunk("*/");
	  }
	},
	    ea = le.isCustomProperty,
	    ta = ze.TYPE,
	    na = ro.mode,
	    ra = ta.Ident,
	    oa = ta.Hash,
	    aa = ta.Colon,
	    ia = ta.Semicolon,
	    sa = ta.Delim;

	function la(e) {
	  return this.Raw(e, na.exclamationMarkOrSemicolon, !0);
	}

	function ca(e) {
	  return this.Raw(e, na.exclamationMarkOrSemicolon, !1);
	}

	function ua() {
	  var e = this.scanner.tokenIndex,
	      t = this.Value();
	  return "Raw" !== t.type && !1 === this.scanner.eof && this.scanner.tokenType !== ia && !1 === this.scanner.isDelim(33) && !1 === this.scanner.isBalanceEdge(e) && this.error(), t;
	}

	var ha = {
	  name: "Declaration",
	  structure: {
	    important: [Boolean, String],
	    property: String,
	    value: ["Value", "Raw"]
	  },
	  parse: function () {
	    var e,
	        t = this.scanner.tokenStart,
	        n = this.scanner.tokenIndex,
	        r = da.call(this),
	        o = ea(r),
	        a = o ? this.parseCustomProperty : this.parseValue,
	        i = o ? ca : la,
	        s = !1;
	    return this.scanner.skipSC(), this.eat(aa), o || this.scanner.skipSC(), e = a ? this.parseWithFallback(ua, i) : i.call(this, this.scanner.tokenIndex), this.scanner.isDelim(33) && (s = pa.call(this), this.scanner.skipSC()), !1 === this.scanner.eof && this.scanner.tokenType !== ia && !1 === this.scanner.isBalanceEdge(n) && this.error(), {
	      type: "Declaration",
	      loc: this.getLocation(t, this.scanner.tokenStart),
	      important: s,
	      property: r,
	      value: e
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.property), this.chunk(":"), this.node(e.value), e.important && this.chunk(!0 === e.important ? "!important" : "!" + e.important);
	  },
	  walkContext: "declaration"
	};

	function da() {
	  var e = this.scanner.tokenStart;
	  if (this.scanner.tokenType === sa) switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
	    case 42:
	    case 36:
	    case 43:
	    case 35:
	    case 38:
	      this.scanner.next();
	      break;

	    case 47:
	      this.scanner.next(), this.scanner.isDelim(47) && this.scanner.next();
	  }
	  return this.scanner.tokenType === oa ? this.eat(oa) : this.eat(ra), this.scanner.substrToCursor(e);
	}

	function pa() {
	  this.eat(sa), this.scanner.skipSC();
	  var e = this.consume(ra);
	  return "important" === e || e;
	}

	var ma = ze.TYPE,
	    fa = ro.mode,
	    ga = ma.WhiteSpace,
	    ba = ma.Comment,
	    ya = ma.Semicolon;

	function ka(e) {
	  return this.Raw(e, fa.semicolonIncluded, !0);
	}

	var va = {
	  name: "DeclarationList",
	  structure: {
	    children: [["Declaration"]]
	  },
	  parse: function () {
	    for (var e = this.createList(); !this.scanner.eof;) switch (this.scanner.tokenType) {
	      case ga:
	      case ba:
	      case ya:
	        this.scanner.next();
	        break;

	      default:
	        e.push(this.parseWithFallback(this.Declaration, ka));
	    }

	    return {
	      type: "DeclarationList",
	      loc: this.getLocationFromList(e),
	      children: e
	    };
	  },
	  generate: function (e) {
	    this.children(e, function (e) {
	      "Declaration" === e.type && this.chunk(";");
	    });
	  }
	},
	    wa = q.consumeNumber,
	    xa = ze.TYPE.Dimension,
	    Sa = {
	  name: "Dimension",
	  structure: {
	    value: String,
	    unit: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart,
	        t = wa(this.scanner.source, e);
	    return this.eat(xa), {
	      type: "Dimension",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      value: this.scanner.source.substring(e, t),
	      unit: this.scanner.source.substring(t, this.scanner.tokenStart)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value), this.chunk(e.unit);
	  }
	},
	    Ca = ze.TYPE.RightParenthesis,
	    Aa = {
	  name: "Function",
	  structure: {
	    name: String,
	    children: [[]]
	  },
	  parse: function (e, t) {
	    var n,
	        r = this.scanner.tokenStart,
	        o = this.consumeFunctionName(),
	        a = o.toLowerCase();
	    return n = t.hasOwnProperty(a) ? t[a].call(this, t) : e.call(this, t), this.scanner.eof || this.eat(Ca), {
	      type: "Function",
	      loc: this.getLocation(r, this.scanner.tokenStart),
	      name: o,
	      children: n
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.name), this.chunk("("), this.children(e), this.chunk(")");
	  },
	  walkContext: "function"
	},
	    Ta = ze.TYPE.Hash,
	    za = {
	  name: "HexColor",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.eat(Ta), {
	      type: "HexColor",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      value: this.scanner.substrToCursor(e + 1)
	    };
	  },
	  generate: function (e) {
	    this.chunk("#"), this.chunk(e.value);
	  }
	},
	    Pa = ze.TYPE.Ident,
	    Ea = {
	  name: "Identifier",
	  structure: {
	    name: String
	  },
	  parse: function () {
	    return {
	      type: "Identifier",
	      loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
	      name: this.consume(Pa)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.name);
	  }
	},
	    La = ze.TYPE.Hash,
	    Oa = {
	  name: "IdSelector",
	  structure: {
	    name: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.eat(La), {
	      type: "IdSelector",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      name: this.scanner.substrToCursor(e + 1)
	    };
	  },
	  generate: function (e) {
	    this.chunk("#"), this.chunk(e.name);
	  }
	},
	    Da = ze.TYPE,
	    Na = Da.Ident,
	    Ra = Da.Number,
	    Ia = Da.Dimension,
	    Ba = Da.LeftParenthesis,
	    Ma = Da.RightParenthesis,
	    ja = Da.Colon,
	    _a = Da.Delim,
	    Fa = {
	  name: "MediaFeature",
	  structure: {
	    name: String,
	    value: ["Identifier", "Number", "Dimension", "Ratio", null]
	  },
	  parse: function () {
	    var e,
	        t = this.scanner.tokenStart,
	        n = null;

	    if (this.eat(Ba), this.scanner.skipSC(), e = this.consume(Na), this.scanner.skipSC(), this.scanner.tokenType !== Ma) {
	      switch (this.eat(ja), this.scanner.skipSC(), this.scanner.tokenType) {
	        case Ra:
	          n = this.lookupNonWSType(1) === _a ? this.Ratio() : this.Number();
	          break;

	        case Ia:
	          n = this.Dimension();
	          break;

	        case Na:
	          n = this.Identifier();
	          break;

	        default:
	          this.error("Number, dimension, ratio or identifier is expected");
	      }

	      this.scanner.skipSC();
	    }

	    return this.eat(Ma), {
	      type: "MediaFeature",
	      loc: this.getLocation(t, this.scanner.tokenStart),
	      name: e,
	      value: n
	    };
	  },
	  generate: function (e) {
	    this.chunk("("), this.chunk(e.name), null !== e.value && (this.chunk(":"), this.node(e.value)), this.chunk(")");
	  }
	},
	    Ua = ze.TYPE,
	    qa = Ua.WhiteSpace,
	    Wa = Ua.Comment,
	    Ya = Ua.Ident,
	    Va = Ua.LeftParenthesis,
	    Ha = {
	  name: "MediaQuery",
	  structure: {
	    children: [["Identifier", "MediaFeature", "WhiteSpace"]]
	  },
	  parse: function () {
	    this.scanner.skipSC();
	    var e = this.createList(),
	        t = null,
	        n = null;

	    e: for (; !this.scanner.eof;) {
	      switch (this.scanner.tokenType) {
	        case Wa:
	          this.scanner.next();
	          continue;

	        case qa:
	          n = this.WhiteSpace();
	          continue;

	        case Ya:
	          t = this.Identifier();
	          break;

	        case Va:
	          t = this.MediaFeature();
	          break;

	        default:
	          break e;
	      }

	      null !== n && (e.push(n), n = null), e.push(t);
	    }

	    return null === t && this.error("Identifier or parenthesis is expected"), {
	      type: "MediaQuery",
	      loc: this.getLocationFromList(e),
	      children: e
	    };
	  },
	  generate: function (e) {
	    this.children(e);
	  }
	},
	    $a = ze.TYPE.Comma,
	    Ga = {
	  name: "MediaQueryList",
	  structure: {
	    children: [["MediaQuery"]]
	  },
	  parse: function (e) {
	    var t = this.createList();

	    for (this.scanner.skipSC(); !this.scanner.eof && (t.push(this.MediaQuery(e)), this.scanner.tokenType === $a);) this.scanner.next();

	    return {
	      type: "MediaQueryList",
	      loc: this.getLocationFromList(t),
	      children: t
	    };
	  },
	  generate: function (e) {
	    this.children(e, function () {
	      this.chunk(",");
	    });
	  }
	},
	    Ka = ze.TYPE.Number,
	    Xa = {
	  name: "Number",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    return {
	      type: "Number",
	      loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
	      value: this.consume(Ka)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value);
	  }
	},
	    Qa = {
	  name: "Operator",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.scanner.next(), {
	      type: "Operator",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      value: this.scanner.substrToCursor(e)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value);
	  }
	},
	    Za = ze.TYPE,
	    Ja = Za.LeftParenthesis,
	    ei = Za.RightParenthesis,
	    ti = {
	  name: "Parentheses",
	  structure: {
	    children: [[]]
	  },
	  parse: function (e, t) {
	    var n,
	        r = this.scanner.tokenStart;
	    return this.eat(Ja), n = e.call(this, t), this.scanner.eof || this.eat(ei), {
	      type: "Parentheses",
	      loc: this.getLocation(r, this.scanner.tokenStart),
	      children: n
	    };
	  },
	  generate: function (e) {
	    this.chunk("("), this.children(e), this.chunk(")");
	  }
	},
	    ni = q.consumeNumber,
	    ri = ze.TYPE.Percentage,
	    oi = {
	  name: "Percentage",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart,
	        t = ni(this.scanner.source, e);
	    return this.eat(ri), {
	      type: "Percentage",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      value: this.scanner.source.substring(e, t)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value), this.chunk("%");
	  }
	},
	    ai = ze.TYPE,
	    ii = ai.Ident,
	    si = ai.Function,
	    li = ai.Colon,
	    ci = ai.RightParenthesis,
	    ui = {
	  name: "PseudoClassSelector",
	  structure: {
	    name: String,
	    children: [["Raw"], null]
	  },
	  parse: function () {
	    var e,
	        t,
	        n = this.scanner.tokenStart,
	        r = null;
	    return this.eat(li), this.scanner.tokenType === si ? (t = (e = this.consumeFunctionName()).toLowerCase(), this.pseudo.hasOwnProperty(t) ? (this.scanner.skipSC(), r = this.pseudo[t].call(this), this.scanner.skipSC()) : (r = this.createList()).push(this.Raw(this.scanner.tokenIndex, null, !1)), this.eat(ci)) : e = this.consume(ii), {
	      type: "PseudoClassSelector",
	      loc: this.getLocation(n, this.scanner.tokenStart),
	      name: e,
	      children: r
	    };
	  },
	  generate: function (e) {
	    this.chunk(":"), this.chunk(e.name), null !== e.children && (this.chunk("("), this.children(e), this.chunk(")"));
	  },
	  walkContext: "function"
	},
	    hi = ze.TYPE,
	    di = hi.Ident,
	    pi = hi.Function,
	    mi = hi.Colon,
	    fi = hi.RightParenthesis,
	    gi = {
	  name: "PseudoElementSelector",
	  structure: {
	    name: String,
	    children: [["Raw"], null]
	  },
	  parse: function () {
	    var e,
	        t,
	        n = this.scanner.tokenStart,
	        r = null;
	    return this.eat(mi), this.eat(mi), this.scanner.tokenType === pi ? (t = (e = this.consumeFunctionName()).toLowerCase(), this.pseudo.hasOwnProperty(t) ? (this.scanner.skipSC(), r = this.pseudo[t].call(this), this.scanner.skipSC()) : (r = this.createList()).push(this.Raw(this.scanner.tokenIndex, null, !1)), this.eat(fi)) : e = this.consume(di), {
	      type: "PseudoElementSelector",
	      loc: this.getLocation(n, this.scanner.tokenStart),
	      name: e,
	      children: r
	    };
	  },
	  generate: function (e) {
	    this.chunk("::"), this.chunk(e.name), null !== e.children && (this.chunk("("), this.children(e), this.chunk(")"));
	  },
	  walkContext: "function"
	},
	    bi = ze.isDigit,
	    yi = ze.TYPE,
	    ki = yi.Number,
	    vi = yi.Delim;

	function wi() {
	  this.scanner.skipWS();

	  for (var e = this.consume(ki), t = 0; t < e.length; t++) {
	    var n = e.charCodeAt(t);
	    bi(n) || 46 === n || this.error("Unsigned number is expected", this.scanner.tokenStart - e.length + t);
	  }

	  return 0 === Number(e) && this.error("Zero number is not allowed", this.scanner.tokenStart - e.length), e;
	}

	var xi = {
	  name: "Ratio",
	  structure: {
	    left: String,
	    right: String
	  },
	  parse: function () {
	    var e,
	        t = this.scanner.tokenStart,
	        n = wi.call(this);
	    return this.scanner.skipWS(), this.scanner.isDelim(47) || this.error("Solidus is expected"), this.eat(vi), e = wi.call(this), {
	      type: "Ratio",
	      loc: this.getLocation(t, this.scanner.tokenStart),
	      left: n,
	      right: e
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.left), this.chunk("/"), this.chunk(e.right);
	  }
	},
	    Si = ze.TYPE,
	    Ci = ro.mode,
	    Ai = Si.LeftCurlyBracket;

	function Ti(e) {
	  return this.Raw(e, Ci.leftCurlyBracket, !0);
	}

	function zi() {
	  var e = this.SelectorList();
	  return "Raw" !== e.type && !1 === this.scanner.eof && this.scanner.tokenType !== Ai && this.error(), e;
	}

	var Pi = {
	  name: "Rule",
	  structure: {
	    prelude: ["SelectorList", "Raw"],
	    block: ["Block"]
	  },
	  parse: function () {
	    var e,
	        t,
	        n = this.scanner.tokenIndex,
	        r = this.scanner.tokenStart;
	    return e = this.parseRulePrelude ? this.parseWithFallback(zi, Ti) : Ti.call(this, n), t = this.Block(!0), {
	      type: "Rule",
	      loc: this.getLocation(r, this.scanner.tokenStart),
	      prelude: e,
	      block: t
	    };
	  },
	  generate: function (e) {
	    this.node(e.prelude), this.node(e.block);
	  },
	  walkContext: "rule"
	},
	    Ei = ze.TYPE.Comma,
	    Li = {
	  name: "SelectorList",
	  structure: {
	    children: [["Selector", "Raw"]]
	  },
	  parse: function () {
	    for (var e = this.createList(); !this.scanner.eof && (e.push(this.Selector()), this.scanner.tokenType === Ei);) this.scanner.next();

	    return {
	      type: "SelectorList",
	      loc: this.getLocationFromList(e),
	      children: e
	    };
	  },
	  generate: function (e) {
	    this.children(e, function () {
	      this.chunk(",");
	    });
	  },
	  walkContext: "selector"
	},
	    Oi = ze.TYPE.String,
	    Di = {
	  name: "String",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    return {
	      type: "String",
	      loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
	      value: this.consume(Oi)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value);
	  }
	},
	    Ni = ze.TYPE,
	    Ri = Ni.WhiteSpace,
	    Ii = Ni.Comment,
	    Bi = Ni.AtKeyword,
	    Mi = Ni.CDO,
	    ji = Ni.CDC;

	function _i(e) {
	  return this.Raw(e, null, !1);
	}

	var Fi = {
	  name: "StyleSheet",
	  structure: {
	    children: [["Comment", "CDO", "CDC", "Atrule", "Rule", "Raw"]]
	  },
	  parse: function () {
	    for (var e, t = this.scanner.tokenStart, n = this.createList(); !this.scanner.eof;) {
	      switch (this.scanner.tokenType) {
	        case Ri:
	          this.scanner.next();
	          continue;

	        case Ii:
	          if (33 !== this.scanner.source.charCodeAt(this.scanner.tokenStart + 2)) {
	            this.scanner.next();
	            continue;
	          }

	          e = this.Comment();
	          break;

	        case Mi:
	          e = this.CDO();
	          break;

	        case ji:
	          e = this.CDC();
	          break;

	        case Bi:
	          e = this.parseWithFallback(this.Atrule, _i);
	          break;

	        default:
	          e = this.parseWithFallback(this.Rule, _i);
	      }

	      n.push(e);
	    }

	    return {
	      type: "StyleSheet",
	      loc: this.getLocation(t, this.scanner.tokenStart),
	      children: n
	    };
	  },
	  generate: function (e) {
	    this.children(e);
	  },
	  walkContext: "stylesheet"
	},
	    Ui = ze.TYPE.Ident;

	function qi() {
	  this.scanner.tokenType !== Ui && !1 === this.scanner.isDelim(42) && this.error("Identifier or asterisk is expected"), this.scanner.next();
	}

	var Wi = {
	  name: "TypeSelector",
	  structure: {
	    name: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.scanner.isDelim(124) ? (this.scanner.next(), qi.call(this)) : (qi.call(this), this.scanner.isDelim(124) && (this.scanner.next(), qi.call(this))), {
	      type: "TypeSelector",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      name: this.scanner.substrToCursor(e)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.name);
	  }
	},
	    Yi = ze.isHexDigit,
	    Vi = ze.cmpChar,
	    Hi = ze.TYPE,
	    $i = ze.NAME,
	    Gi = Hi.Ident,
	    Ki = Hi.Number,
	    Xi = Hi.Dimension;

	function Qi(e, t) {
	  for (var n = this.scanner.tokenStart + e, r = 0; n < this.scanner.tokenEnd; n++) {
	    var o = this.scanner.source.charCodeAt(n);
	    if (45 === o && t && 0 !== r) return 0 === Qi.call(this, e + r + 1, !1) && this.error(), -1;
	    Yi(o) || this.error(t && 0 !== r ? "HyphenMinus" + (r < 6 ? " or hex digit" : "") + " is expected" : r < 6 ? "Hex digit is expected" : "Unexpected input", n), ++r > 6 && this.error("Too many hex digits", n);
	  }

	  return this.scanner.next(), r;
	}

	function Zi(e) {
	  for (var t = 0; this.scanner.isDelim(63);) ++t > e && this.error("Too many question marks"), this.scanner.next();
	}

	function Ji(e) {
	  this.scanner.source.charCodeAt(this.scanner.tokenStart) !== e && this.error($i[e] + " is expected");
	}

	function es() {
	  var e = 0;
	  return this.scanner.isDelim(43) ? (this.scanner.next(), this.scanner.tokenType === Gi ? void ((e = Qi.call(this, 0, !0)) > 0 && Zi.call(this, 6 - e)) : this.scanner.isDelim(63) ? (this.scanner.next(), void Zi.call(this, 5)) : void this.error("Hex digit or question mark is expected")) : this.scanner.tokenType === Ki ? (Ji.call(this, 43), e = Qi.call(this, 1, !0), this.scanner.isDelim(63) ? void Zi.call(this, 6 - e) : this.scanner.tokenType === Xi || this.scanner.tokenType === Ki ? (Ji.call(this, 45), void Qi.call(this, 1, !1)) : void 0) : this.scanner.tokenType === Xi ? (Ji.call(this, 43), void ((e = Qi.call(this, 1, !0)) > 0 && Zi.call(this, 6 - e))) : void this.error();
	}

	var ts,
	    ns = {
	  name: "UnicodeRange",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return Vi(this.scanner.source, e, 117) || this.error("U is expected"), Vi(this.scanner.source, e + 1, 43) || this.error("Plus sign is expected"), this.scanner.next(), es.call(this), {
	      type: "UnicodeRange",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      value: this.scanner.substrToCursor(e)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value);
	  }
	},
	    rs = ze.isWhiteSpace,
	    os = ze.cmpStr,
	    as = ze.TYPE,
	    is = as.Function,
	    ss = as.Url,
	    ls = as.RightParenthesis,
	    cs = {
	  name: "Url",
	  structure: {
	    value: ["String", "Raw"]
	  },
	  parse: function () {
	    var e,
	        t = this.scanner.tokenStart;

	    switch (this.scanner.tokenType) {
	      case ss:
	        for (var n = t + 4, r = this.scanner.tokenEnd - 1; n < r && rs(this.scanner.source.charCodeAt(n));) n++;

	        for (; n < r && rs(this.scanner.source.charCodeAt(r - 1));) r--;

	        e = {
	          type: "Raw",
	          loc: this.getLocation(n, r),
	          value: this.scanner.source.substring(n, r)
	        }, this.eat(ss);
	        break;

	      case is:
	        os(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(") || this.error("Function name must be `url`"), this.eat(is), this.scanner.skipSC(), e = this.String(), this.scanner.skipSC(), this.eat(ls);
	        break;

	      default:
	        this.error("Url or Function is expected");
	    }

	    return {
	      type: "Url",
	      loc: this.getLocation(t, this.scanner.tokenStart),
	      value: e
	    };
	  },
	  generate: function (e) {
	    this.chunk("url"), this.chunk("("), this.node(e.value), this.chunk(")");
	  }
	},
	    us = ze.TYPE.WhiteSpace,
	    hs = window.Object.freeze({
	  type: "WhiteSpace",
	  loc: null,
	  value: " "
	}),
	    ds = {
	  AnPlusB: Kr,
	  Atrule: po,
	  AtrulePrelude: bo,
	  AttributeSelector: To,
	  Block: _o,
	  Brackets: Wo,
	  CDC: Vo,
	  CDO: $o,
	  ClassSelector: Ko,
	  Combinator: Qo,
	  Comment: Jo,
	  Declaration: ha,
	  DeclarationList: va,
	  Dimension: Sa,
	  Function: Aa,
	  HexColor: za,
	  Identifier: Ea,
	  IdSelector: Oa,
	  MediaFeature: Fa,
	  MediaQuery: Ha,
	  MediaQueryList: Ga,
	  Nth: {
	    name: "Nth",
	    structure: {
	      nth: ["AnPlusB", "Identifier"],
	      selector: ["SelectorList", null]
	    },
	    parse: function (e) {
	      this.scanner.skipSC();
	      var t,
	          n = this.scanner.tokenStart,
	          r = n,
	          o = null;
	      return t = this.scanner.lookupValue(0, "odd") || this.scanner.lookupValue(0, "even") ? this.Identifier() : this.AnPlusB(), this.scanner.skipSC(), e && this.scanner.lookupValue(0, "of") ? (this.scanner.next(), o = this.SelectorList(), this.needPositions && (r = this.getLastListNode(o.children).loc.end.offset)) : this.needPositions && (r = t.loc.end.offset), {
	        type: "Nth",
	        loc: this.getLocation(n, r),
	        nth: t,
	        selector: o
	      };
	    },
	    generate: function (e) {
	      this.node(e.nth), null !== e.selector && (this.chunk(" of "), this.node(e.selector));
	    }
	  },
	  Number: Xa,
	  Operator: Qa,
	  Parentheses: ti,
	  Percentage: oi,
	  PseudoClassSelector: ui,
	  PseudoElementSelector: gi,
	  Ratio: xi,
	  Raw: ro,
	  Rule: Pi,
	  Selector: {
	    name: "Selector",
	    structure: {
	      children: [["TypeSelector", "IdSelector", "ClassSelector", "AttributeSelector", "PseudoClassSelector", "PseudoElementSelector", "Combinator", "WhiteSpace"]]
	    },
	    parse: function () {
	      var e = this.readSequence(this.scope.Selector);
	      return null === this.getFirstListNode(e) && this.error("Selector is expected"), {
	        type: "Selector",
	        loc: this.getLocationFromList(e),
	        children: e
	      };
	    },
	    generate: function (e) {
	      this.children(e);
	    }
	  },
	  SelectorList: Li,
	  String: Di,
	  StyleSheet: Fi,
	  TypeSelector: Wi,
	  UnicodeRange: ns,
	  Url: cs,
	  Value: {
	    name: "Value",
	    structure: {
	      children: [[]]
	    },
	    parse: function () {
	      var e = this.scanner.tokenStart,
	          t = this.readSequence(this.scope.Value);
	      return {
	        type: "Value",
	        loc: this.getLocation(e, this.scanner.tokenStart),
	        children: t
	      };
	    },
	    generate: function (e) {
	      this.children(e);
	    }
	  },
	  WhiteSpace: {
	    name: "WhiteSpace",
	    structure: {
	      value: String
	    },
	    parse: function () {
	      return this.eat(us), hs;
	    },
	    generate: function (e) {
	      this.chunk(e.value);
	    }
	  }
	},
	    ps = (ts = Br) && ts.default || ts,
	    ms = {
	  generic: !0,
	  types: ps.types,
	  atrules: ps.atrules,
	  properties: ps.properties,
	  node: ds
	},
	    fs = ze.cmpChar,
	    gs = ze.cmpStr,
	    bs = ze.TYPE,
	    ys = bs.Ident,
	    ks = bs.String,
	    vs = bs.Number,
	    ws = bs.Function,
	    xs = bs.Url,
	    Ss = bs.Hash,
	    Cs = bs.Dimension,
	    As = bs.Percentage,
	    Ts = bs.LeftParenthesis,
	    zs = bs.LeftSquareBracket,
	    Ps = bs.Comma,
	    Es = bs.Delim,
	    Ls = function (e) {
	  switch (this.scanner.tokenType) {
	    case Ss:
	      return this.HexColor();

	    case Ps:
	      return e.space = null, e.ignoreWSAfter = !0, this.Operator();

	    case Ts:
	      return this.Parentheses(this.readSequence, e.recognizer);

	    case zs:
	      return this.Brackets(this.readSequence, e.recognizer);

	    case ks:
	      return this.String();

	    case Cs:
	      return this.Dimension();

	    case As:
	      return this.Percentage();

	    case vs:
	      return this.Number();

	    case ws:
	      return gs(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, e.recognizer);

	    case xs:
	      return this.Url();

	    case ys:
	      return fs(this.scanner.source, this.scanner.tokenStart, 117) && fs(this.scanner.source, this.scanner.tokenStart + 1, 43) ? this.UnicodeRange() : this.Identifier();

	    case Es:
	      var t = this.scanner.source.charCodeAt(this.scanner.tokenStart);
	      if (47 === t || 42 === t || 43 === t || 45 === t) return this.Operator();
	      35 === t && this.error("Hex or identifier is expected", this.scanner.tokenStart + 1);
	  }
	},
	    Os = {
	  getNode: Ls
	},
	    Ds = ze.TYPE,
	    Ns = Ds.Delim,
	    Rs = Ds.Ident,
	    Is = Ds.Dimension,
	    Bs = Ds.Percentage,
	    Ms = Ds.Number,
	    js = Ds.Hash,
	    _s = Ds.Colon,
	    Fs = Ds.LeftSquareBracket;

	var Us = {
	  getNode: function (e) {
	    switch (this.scanner.tokenType) {
	      case Fs:
	        return this.AttributeSelector();

	      case js:
	        return this.IdSelector();

	      case _s:
	        return this.scanner.lookupType(1) === _s ? this.PseudoElementSelector() : this.PseudoClassSelector();

	      case Rs:
	        return this.TypeSelector();

	      case Ms:
	      case Bs:
	        return this.Percentage();

	      case Is:
	        46 === this.scanner.source.charCodeAt(this.scanner.tokenStart) && this.error("Identifier is expected", this.scanner.tokenStart + 1);
	        break;

	      case Ns:
	        switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
	          case 43:
	          case 62:
	          case 126:
	            return e.space = null, e.ignoreWSAfter = !0, this.Combinator();

	          case 47:
	            return this.Combinator();

	          case 46:
	            return this.ClassSelector();

	          case 42:
	          case 124:
	            return this.TypeSelector();

	          case 35:
	            return this.IdSelector();
	        }

	    }
	  }
	},
	    qs = function () {
	  this.scanner.skipSC();
	  var e = this.createSingleNodeList(this.IdSelector());
	  return this.scanner.skipSC(), e;
	},
	    Ws = ze.TYPE,
	    Ys = ro.mode,
	    Vs = Ws.Comma,
	    Hs = {
	  AtrulePrelude: Os,
	  Selector: Us,
	  Value: {
	    getNode: Ls,
	    "-moz-element": qs,
	    element: qs,
	    expression: function () {
	      return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex, null, !1));
	    },
	    var: function () {
	      var e = this.createList();
	      return this.scanner.skipSC(), e.push(this.Identifier()), this.scanner.skipSC(), this.scanner.tokenType === Vs && (e.push(this.Operator()), e.push(this.parseCustomProperty ? this.Value(null) : this.Raw(this.scanner.tokenIndex, Ys.exclamationMarkOrSemicolon, !1))), e;
	    }
	  }
	},
	    $s = ze.TYPE,
	    Gs = $s.String,
	    Ks = $s.Ident,
	    Xs = $s.Url,
	    Qs = $s.Function,
	    Zs = $s.LeftParenthesis,
	    Js = {
	  parse: {
	    prelude: function () {
	      var e = this.createList();

	      switch (this.scanner.skipSC(), this.scanner.tokenType) {
	        case Gs:
	          e.push(this.String());
	          break;

	        case Xs:
	        case Qs:
	          e.push(this.Url());
	          break;

	        default:
	          this.error("String or url() is expected");
	      }

	      return this.lookupNonWSType(0) !== Ks && this.lookupNonWSType(0) !== Zs || (e.push(this.WhiteSpace()), e.push(this.MediaQueryList())), e;
	    },
	    block: null
	  }
	},
	    el = ze.TYPE,
	    tl = el.WhiteSpace,
	    nl = el.Comment,
	    rl = el.Ident,
	    ol = el.Function,
	    al = el.Colon,
	    il = el.LeftParenthesis;

	function sl() {
	  return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex, null, !1));
	}

	function ll() {
	  return this.scanner.skipSC(), this.scanner.tokenType === rl && this.lookupNonWSType(1) === al ? this.createSingleNodeList(this.Declaration()) : cl.call(this);
	}

	function cl() {
	  var e,
	      t = this.createList(),
	      n = null;
	  this.scanner.skipSC();

	  e: for (; !this.scanner.eof;) {
	    switch (this.scanner.tokenType) {
	      case tl:
	        n = this.WhiteSpace();
	        continue;

	      case nl:
	        this.scanner.next();
	        continue;

	      case ol:
	        e = this.Function(sl, this.scope.AtrulePrelude);
	        break;

	      case rl:
	        e = this.Identifier();
	        break;

	      case il:
	        e = this.Parentheses(ll, this.scope.AtrulePrelude);
	        break;

	      default:
	        break e;
	    }

	    null !== n && (t.push(n), n = null), t.push(e);
	  }

	  return t;
	}

	var ul = {
	  parse: function () {
	    return this.createSingleNodeList(this.SelectorList());
	  }
	},
	    hl = {
	  parse: function () {
	    return this.createSingleNodeList(this.Nth(!0));
	  }
	},
	    dl = {
	  parse: function () {
	    return this.createSingleNodeList(this.Nth(!1));
	  }
	};
	var pl = Dr(function () {
	  for (var e = {}, t = 0; t < arguments.length; t++) {
	    var n = arguments[t];

	    for (var r in n) e[r] = n[r];
	  }

	  return e;
	}(ms, {
	  parseContext: {
	    default: "StyleSheet",
	    stylesheet: "StyleSheet",
	    atrule: "Atrule",
	    atrulePrelude: function (e) {
	      return this.AtrulePrelude(e.atrule ? String(e.atrule) : null);
	    },
	    mediaQueryList: "MediaQueryList",
	    mediaQuery: "MediaQuery",
	    rule: "Rule",
	    selectorList: "SelectorList",
	    selector: "Selector",
	    block: function () {
	      return this.Block(!0);
	    },
	    declarationList: "DeclarationList",
	    declaration: "Declaration",
	    value: "Value"
	  },
	  scope: Hs,
	  atrule: {
	    "font-face": {
	      parse: {
	        prelude: null,
	        block: function () {
	          return this.Block(!0);
	        }
	      }
	    },
	    import: Js,
	    media: {
	      parse: {
	        prelude: function () {
	          return this.createSingleNodeList(this.MediaQueryList());
	        },
	        block: function () {
	          return this.Block(!1);
	        }
	      }
	    },
	    page: {
	      parse: {
	        prelude: function () {
	          return this.createSingleNodeList(this.SelectorList());
	        },
	        block: function () {
	          return this.Block(!0);
	        }
	      }
	    },
	    supports: {
	      parse: {
	        prelude: function () {
	          var e = cl.call(this);
	          return null === this.getFirstListNode(e) && this.error("Condition is expected"), e;
	        },
	        block: function () {
	          return this.Block(!1);
	        }
	      }
	    }
	  },
	  pseudo: {
	    dir: {
	      parse: function () {
	        return this.createSingleNodeList(this.Identifier());
	      }
	    },
	    has: {
	      parse: function () {
	        return this.createSingleNodeList(this.SelectorList());
	      }
	    },
	    lang: {
	      parse: function () {
	        return this.createSingleNodeList(this.Identifier());
	      }
	    },
	    matches: ul,
	    not: ul,
	    "nth-child": hl,
	    "nth-last-child": hl,
	    "nth-last-of-type": dl,
	    "nth-of-type": dl,
	    slotted: {
	      parse: function () {
	        return this.createSingleNodeList(this.Selector());
	      }
	    }
	  },
	  node: ds
	}, {
	  node: ds
	}));
	const ml = new window.Map([["background", new window.Set(["background-color", "background-position", "background-position-x", "background-position-y", "background-size", "background-repeat", "background-repeat-x", "background-repeat-y", "background-clip", "background-origin", "background-attachment", "background-image"])], ["background-position", new window.Set(["background-position-x", "background-position-y"])], ["background-repeat", new window.Set(["background-repeat-x", "background-repeat-y"])], ["font", new window.Set(["font-style", "font-variant-caps", "font-weight", "font-stretch", "font-size", "line-height", "font-family", "font-size-adjust", "font-kerning", "font-optical-sizing", "font-variant-alternates", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-language-override", "font-feature-settings", "font-variation-settings"])], ["font-variant", new window.Set(["font-variant-caps", "font-variant-numeric", "font-variant-alternates", "font-variant-ligatures", "font-variant-east-asian"])], ["outline", new window.Set(["outline-width", "outline-style", "outline-color"])], ["border", new window.Set(["border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "border-image-source", "border-image-slice", "border-image-width", "border-image-outset", "border-image-repeat"])], ["border-width", new window.Set(["border-top-width", "border-right-width", "border-bottom-width", "border-left-width"])], ["border-style", new window.Set(["border-top-style", "border-right-style", "border-bottom-style", "border-left-style"])], ["border-color", new window.Set(["border-top-color", "border-right-color", "border-bottom-color", "border-left-color"])], ["border-block", new window.Set(["border-block-start-width", "border-block-end-width", "border-block-start-style", "border-block-end-style", "border-block-start-color", "border-block-end-color"])], ["border-block-start", new window.Set(["border-block-start-width", "border-block-start-style", "border-block-start-color"])], ["border-block-end", new window.Set(["border-block-end-width", "border-block-end-style", "border-block-end-color"])], ["border-inline", new window.Set(["border-inline-start-width", "border-inline-end-width", "border-inline-start-style", "border-inline-end-style", "border-inline-start-color", "border-inline-end-color"])], ["border-inline-start", new window.Set(["border-inline-start-width", "border-inline-start-style", "border-inline-start-color"])], ["border-inline-end", new window.Set(["border-inline-end-width", "border-inline-end-style", "border-inline-end-color"])], ["border-image", new window.Set(["border-image-source", "border-image-slice", "border-image-width", "border-image-outset", "border-image-repeat"])], ["border-radius", new window.Set(["border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"])], ["padding", new window.Set(["padding-top", "padding-right", "padding-bottom", "padding-left"])], ["padding-block", new window.Set(["padding-block-start", "padding-block-end"])], ["padding-inline", new window.Set(["padding-inline-start", "padding-inline-end"])], ["margin", new window.Set(["margin-top", "margin-right", "margin-bottom", "margin-left"])], ["margin-block", new window.Set(["margin-block-start", "margin-block-end"])], ["margin-inline", new window.Set(["margin-inline-start", "margin-inline-end"])], ["inset", new window.Set(["top", "right", "bottom", "left"])], ["inset-block", new window.Set(["inset-block-start", "inset-block-end"])], ["inset-inline", new window.Set(["inset-inline-start", "inset-inline-end"])], ["flex", new window.Set(["flex-grow", "flex-shrink", "flex-basis"])], ["flex-flow", new window.Set(["flex-direction", "flex-wrap"])], ["gap", new window.Set(["row-gap", "column-gap"])], ["transition", new window.Set(["transition-duration", "transition-timing-function", "transition-delay", "transition-property"])], ["grid", new window.Set(["grid-template-rows", "grid-template-columns", "grid-template-areas", "grid-auto-flow", "grid-auto-columns", "grid-auto-rows"])], ["grid-template", new window.Set(["grid-template-rows", "grid-template-columns", "grid-template-areas"])], ["grid-row", new window.Set(["grid-row-start", "grid-row-end"])], ["grid-column", new window.Set(["grid-column-start", "grid-column-end"])], ["grid-gap", new window.Set(["grid-row-gap", "grid-column-gap"])], ["place-content", new window.Set(["align-content", "justify-content"])], ["place-items", new window.Set(["align-items", "justify-items"])], ["place-self", new window.Set(["align-self", "justify-self"])], ["columns", new window.Set(["column-width", "column-count"])], ["column-rule", new window.Set(["column-rule-width", "column-rule-style", "column-rule-color"])], ["list-style", new window.Set(["list-style-type", "list-style-position", "list-style-image"])], ["offset", new window.Set(["offset-position", "offset-path", "offset-distance", "offset-rotate", "offset-anchor"])], ["overflow", new window.Set(["overflow-x", "overflow-y"])], ["overscroll-behavior", new window.Set(["overscroll-behavior-x", "overscroll-behavior-y"])], ["scroll-margin", new window.Set(["scroll-margin-top", "scroll-margin-right", "scroll-margin-bottom", "scroll-margin-left"])], ["scroll-padding", new window.Set(["scroll-padding-top", "scroll-padding-right", "scroll-padding-bottom", "scroll-padding-left"])], ["text-decaration", new window.Set(["text-decoration-line", "text-decoration-style", "text-decoration-color"])], ["text-stroke", new window.Set(["text-stroke-color", "text-stroke-width"])], ["animation", new window.Set(["animation-duration", "animation-timing-function", "animation-delay", "animation-iteration-count", "animation-direction", "animation-fill-mode", "animation-play-state", "animation-name"])], ["mask", new window.Set(["mask-image", "mask-mode", "mask-repeat-x", "mask-repeat-y", "mask-position-x", "mask-position-y", "mask-clip", "mask-origin", "mask-size", "mask-composite"])], ["mask-repeat", new window.Set(["mask-repeat-x", "mask-repeat-y"])], ["mask-position", new window.Set(["mask-position-x", "mask-position-y"])], ["perspective-origin", new window.Set(["perspective-origin-x", "perspective-origin-y"])], ["transform-origin", new window.Set(["transform-origin-x", "transform-origin-y", "transform-origin-z"])]]),
	      fl = new window.Map([kl("animation", "moz"), kl("border-image", "moz"), kl("mask", "moz"), kl("transition", "moz"), kl("columns", "moz"), kl("text-stroke", "moz"), kl("column-rule", "moz"), ["-moz-border-end", new window.Set(["-moz-border-end-color", "-moz-border-end-style", "-moz-border-end-width"])], ["-moz-border-start", new window.Set(["-moz-border-start-color", "-moz-border-start-style", "-moz-border-start-width"])], ["-moz-outline-radius", new window.Set(["-moz-outline-radius-topleft", "-moz-outline-radius-topright", "-moz-outline-radius-bottomright", "-moz-outline-radius-bottomleft"])]]),
	      gl = new window.Map([kl("animation", "webkit"), kl("border-radius", "webkit"), kl("column-rule", "webkit"), kl("columns", "webkit"), kl("flex", "webkit"), kl("flex-flow", "webkit"), kl("mask", "webkit"), kl("text-stroke", "webkit"), kl("perspective-origin", "webkit"), kl("transform-origin", "webkit"), kl("transition", "webkit"), ["-webkit-border-start", new window.Set(["-webkit-border-start-color", "-webkit-border-start-style", "-webkit-border-start-width"])], ["-webkit-border-before", new window.Set(["-webkit-border-before-color", "-webkit-border-before-style", "-webkit-border-before-width"])], ["-webkit-border-end", new window.Set(["-webkit-border-end-color", "-webkit-border-end-style", "-webkit-border-end-width"])], ["-webkit-border-after", new window.Set(["-webkit-border-after-color", "-webkit-border-after-style", "-webkit-border-after-width"])]]),
	      bl = new window.Map([["background-position-x", "background-position"], ["background-position-y", "background-position"], ["background-repeat-x", "background-repeat"], ["background-repeat-y", "background-repeat"]]);
	fl.forEach((e, t) => ml.set(t, e)), gl.forEach((e, t) => ml.set(t, e));
	const yl = new window.Set(window.Array.from(ml.values()).reduce((e, t) => e.concat(window.Array.from(t)), []));

	function kl(e, t) {
	  const n = ml.get(e);
	  if (n) return [`-${t}-${e}`, new window.Set(window.Array.from(n, e => `-${t}-${e}`))];
	}

	function vl(e, t) {
	  const n = ml.get(e);
	  return !!n && n.has(t);
	}

	var wl = {
	  isShorthandFor: vl,
	  hasShorthand: function (e) {
	    return yl.has(e);
	  },
	  hasShorthandWithin: function (e, t) {
	    return t.some(t => vl(t, e));
	  },
	  preferredShorthand: function (e) {
	    return bl.get(e);
	  }
	};
	const {
	  preferredShorthand: xl
	} = wl,
	      Sl = {
	  [2]: {
	    atrule: "charset",
	    prelude: "charset"
	  },
	  [3]: {
	    atrule: "import",
	    prelude: "import"
	  },
	  [10]: {
	    atrule: "namespace",
	    prelude: "namespace"
	  },
	  [1]: {
	    prelude: "selector",
	    block: "style"
	  },
	  [8]: {
	    prelude: "key",
	    block: "style"
	  },
	  [6]: {
	    atrule: "page",
	    prelude: "selector",
	    block: "style"
	  },
	  [5]: {
	    atrule: "font-face",
	    block: "style"
	  },
	  [4]: {
	    atrule: "media",
	    prelude: "condition",
	    block: "nested"
	  },
	  [12]: {
	    atrule: "supports",
	    prelude: "condition",
	    block: "nested"
	  },
	  [13]: {
	    atrule: "document",
	    prelude: "condition",
	    block: "nested"
	  },
	  [7]: {
	    atrule: "keyframes",
	    prelude: "name",
	    block: "nested"
	  }
	};

	var Cl = function e(t) {
	  return window.Array.from(t, t => {
	    const n = Sl[t.type],
	          r = {};

	    if (n.atrule) {
	      r.type = "Atrule";
	      const [e, o] = t.cssText.match(new RegExp("^@(-\\w+-)?" + n.atrule));
	      r.name = o ? o + n.atrule : n.atrule;
	    } else r.type = "Rule";

	    let o;

	    if ("selector" === n.prelude ? o = t.selectorText : "key" === n.prelude ? o = t.keyText : "condition" === n.prelude ? o = t.conditionText : "name" === n.prelude ? o = t.name : "import" === n.prelude ? o = `url("${t.href}") ${t.media.mediaText}` : "namespace" === n.prelude ? o = `${t.prefix} url("${t.namespaceURI}")` : "charset" === n.prelude && (o = `"${t.encoding}"`), o) {
	      const e = n.atrule ? {
	        context: "atrulePrelude",
	        atrule: n.atrule
	      } : {
	        context: "selectorList"
	      };
	      r.prelude = pl.toPlainObject(pl.parse(o, e));
	    } else r.prelude = null;

	    if ("style" === n.block) {
	      const e = window.Array.from(t.style).reduce((e, n) => {
	        const r = xl(n) || n;
	        return e.set(r, {
	          type: "Declaration",
	          important: Boolean(t.style.getPropertyPriority(r)),
	          property: r,
	          value: {
	            type: "Raw",
	            value: t.style.getPropertyValue(r)
	          }
	        }), e;
	      }, new window.Map());
	      r.block = {
	        type: "Block",
	        children: window.Array.from(e.values())
	      };
	    } else "nested" === n.block ? r.block = {
	      type: "Block",
	      children: e(t.cssRules)
	    } : r.block = null;

	    return r;
	  });
	};

	var Al = function (e) {
	  const t = pl.parse(e, {
	    context: "stylesheet",
	    parseAtrulePrelude: !0,
	    parseRulePrelude: !0,
	    parseValue: !1,
	    parseCustomProperty: !1
	  });
	  return pl.walk(t, {
	    visit: "TypeSelector",

	    enter(e, t) {
	      "from" === e.name ? t.data = {
	        type: "Percentage",
	        value: "0"
	      } : "to" === e.name && (t.data = {
	        type: "Percentage",
	        value: "100"
	      });
	    }

	  }), pl.walk(t, {
	    visit: "AtrulePrelude",

	    enter(e) {
	      if (["import", "namespace"].includes(this.atrule.name)) {
	        const t = e.children.toArray(),
	              n = "import" === e.name ? 0 : t.length - 1,
	              r = t[n];
	        let o;
	        "String" === r.type ? o = r.value.slice(1, -1) : "Url" === r.type && ("String" === r.value.type ? o = r.value.value.slice(1, -1) : "Raw" === r.value.type && (o = r.value.value)), o && (t[n] = {
	          type: "Url",
	          value: {
	            type: "String",
	            value: `"${o}"`
	          }
	        }, e.children.fromArray(t));
	      }
	    }

	  }), pl.toPlainObject(t);
	};

	const {
	  isShorthandFor: Tl,
	  hasShorthandWithin: zl
	} = wl,
	      Pl = {
	  "word-wrap": "overflow-wrap",
	  clip: "clip-path"
	};

	function El(e, t) {
	  const n = new window.Map();
	  e.forEach(({
	    type: e,
	    property: t,
	    important: r,
	    value: {
	      value: o
	    } = {}
	  }) => {
	    if ("Declaration" !== e) return;
	    let a = n.get(t);
	    a || (a = new window.Map(), n.set(t, a)), a.set(o, r);
	  }), t.forEach(({
	    type: e,
	    property: t,
	    important: r,
	    value: {
	      value: o
	    } = {}
	  }) => {
	    if ("Declaration" !== e) return;
	    if (zl(t, window.Array.from(n.keys()))) return;
	    let a = n.get(t);
	    a ? a.has(o) ? a.get(o) !== r && a.forEach((e, t) => a.set(t, r)) : a.clear() : (a = new window.Map(), n.set(t, a)), a.set(o, r);
	  });
	  const r = [];
	  return n.forEach((e, t) => {
	    e.forEach((e, n) => r.push({
	      type: "Declaration",
	      property: t,
	      value: {
	        type: "Raw",
	        value: n
	      },
	      important: e
	    }));
	  }), r;
	}

	function Ll(e) {
	  return "Rule" === e.type || /^(-\w+-)?(page|font-face)$/.test(e.name);
	}

	function Ol(e, t, n, r) {
	  for (let o = t; o < n; ++o) r(e[o], o, e);
	}

	var Dl = function e(t, n) {
	  let r = 0;
	  const o = [];
	  return t.forEach(t => {
	    const a = {};
	    a.type = t.type, a.name = t.name, a.prelude = t.prelude, a.block = t.block;

	    const i = function (e, t, n) {
	      return function (e, t, n) {
	        for (let r = t; r < e.length; ++r) if (n(e[r], r, e)) return r;

	        return -1;
	      }(e, t, e => {
	        return e.type === n.type && e.name === n.name && (o = e.prelude, a = n.prelude, !o && !a || o.type === a.type && function e(t, n) {
	          return !Array.isArray(t) && !Array.isArray(n) || window.Array.isArray(t) && window.Array.isArray(n) && t.length === n.length && t.every((t, r) => {
	            const o = n[r];
	            return t.type === o.type && t.name === o.name && (t.value === o.value || t.value.type === o.value.type && t.value.value === o.value.value) && e(t.children, o.children);
	          });
	        }(o.children, a.children)) && (!Ll(n) || (t = e.block.children, (r = n.block.children).reduce((e, n) => {
	          var r;
	          return e + ("Declaration" === n.type && (r = n.property, /^(-\w+-)/.test(r) || t.some(e => function (e, t) {
	            const n = Pl[e] || e,
	                  r = Pl[t] || t;
	            return n === r || Tl(r, n) || Tl(n, r);
	          }(e.property, n.property))) ? 1 : 0);
	        }, 0) >= r.length));
	        var t, r, o, a;
	      });
	    }(n, r, t);

	    i > r && Ol(n, r, i, e => o.push(e)), i >= 0 && (r = i + 1, !function (e) {
	      return "Atrule" === e.type && /^(-\w+-)?(media|supports|document|keyframes)$/.test(e.name);
	    }(t) ? Ll(t) && (a.block = {
	      type: "Block",
	      children: El(t.block.children, n[i].block.children)
	    }) : a.block = {
	      type: "Block",
	      children: e(t.block.children, n[i].block.children)
	    }), o.push(a);
	  }, []), r < n.length && Ol(n, r, n.length, e => o.push(e)), o;
	},
	    Nl = () => {};

	var Rl = function (e) {
	  const t = window.Array.from(e.attributes).map(t => "id" === t.name ? "#" + t.value : "class" === t.name ? window.Array.from(e.classList).map(e => "." + e).join("") : `[${t.name}="${t.value}"]`).join("");
	  return `${e.nodeName}${t}`;
	};

	var Il = function (e, t = Nl) {
	  t("[processInlineCss] processing inline css for", Rl(e));

	  try {
	    const n = Al(e.textContent);
	    t("[processInlineCss] created AST for textContent");
	    const r = Cl(e.sheet.cssRules);
	    t("[processInlineCss] created AST for CSSOM");
	    const o = Dl(n.children, r);
	    t("[processInlineCss] merged AST");
	    const a = pl.generate(pl.fromPlainObject({
	      type: "StyleSheet",
	      children: o
	    }));
	    return t("[processInlineCss] generated cssText of length", a.length), a;
	  } catch (n) {
	    return t("[processInlineCss] error while processing inline css:", n.message, n), e.textContent;
	  }
	};

	var Bl = function (e) {
	  const t = /url\((?!['"]?:)['"]?([^'")]*)['"]?\)/g,
	        n = [];
	  let r;

	  for (; null !== (r = t.exec(e));) n.push(r[1]);

	  return n;
	};

	var Ml = function (e) {
	  const t = e.getAttribute("style");
	  if (t) return Bl(t);
	};

	const jl = /(\S+)(?:\s+[\d.]+[wx])?(?:,|$)/g;

	var _l = function (e) {
	  const t = (e.matches || e.msMatchesSelector).bind(e);
	  let n = [];

	  if (t("img[srcset],source[srcset]") && (n = n.concat(function (e, t, n) {
	    const r = [],
	          o = new RegExp(e.source, e.flags),
	          a = o.global;
	    let i;

	    for (; (i = o.exec(t)) && (r.push(n(i)), a););

	    return r;
	  }(jl, e.getAttribute("srcset"), e => e[1]))), t('img[src],source[src],input[type="image"][src],audio[src],video[src]') && n.push(e.getAttribute("src")), t("image,use")) {
	    const t = e.getAttribute("href") || e.getAttribute("xlink:href");
	    t && "#" !== t[0] && n.push(t);
	  }

	  t("object") && e.getAttribute("data") && n.push(e.getAttribute("data")), t('link[rel~="stylesheet"], link[as="stylesheet"]') && n.push(e.getAttribute("href")), t("video[poster]") && n.push(e.getAttribute("poster"));
	  const r = Ml(e);
	  return r && (n = n.concat(r)), n;
	};

	var Fl = function (e) {
	  const t = Cl(e.cssRules);
	  return pl.generate(pl.fromPlainObject({
	    type: "StyleSheet",
	    children: t
	  }));
	};

	const Ul = new window.Set(["date", "datetime-local", "email", "month", "number", "password", "search", "tel", "text", "time", "url", "week"]),
	      ql = /^on[a-z]+$/;

	function Wl({
	  attributes: e = {}
	}) {
	  return window.Object.keys(e).filter(t => e[t] && e[t].name);
	}

	function Yl(e, t, n) {
	  const r = e.find(e => e.name === t);
	  r ? r.value = n : e.push({
	    name: t,
	    value: n
	  });
	}

	function Vl(e) {
	  return window.Array.from(e.adoptedStyleSheets).map(Fl);
	}

	var Hl = function (e, a, i = Nl) {
	  const s = [{
	    nodeType: Node.DOCUMENT_NODE
	  }],
	        l = [e],
	        c = [],
	        u = [];
	  let h = [];
	  return s[0].childNodeIndexes = d(s, e.childNodes), e.adoptedStyleSheets && e.adoptedStyleSheets.length > 0 && (s[0].exp_adoptedStyleSheets = Vl(e)), {
	    cdt: s,
	    docRoots: l,
	    canvasElements: c,
	    inlineFrames: u,
	    linkUrls: h
	  };

	  function d(e, s) {
	    if (!s || 0 === s.length) return null;
	    const p = [];
	    return window.Array.prototype.forEach.call(s, s => {
	      const m = function e(s, p) {
	        let m, f, g;
	        const {
	          nodeType: b
	        } = p;
	        [Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].includes(b) ? "SCRIPT" !== p.nodeName ? ("STYLE" === p.nodeName && p.sheet && p.sheet.cssRules.length && (s.push(function (e, t) {
	          return {
	            nodeType: Node.TEXT_NODE,
	            nodeValue: Il(e, t)
	          };
	        }(p, i)), f = [s.length - 1]), "TEXTAREA" === p.tagName && p.value !== p.textContent && (s.push(function (e) {
	          return {
	            nodeType: Node.TEXT_NODE,
	            nodeValue: e.value
	          };
	        }(p)), f = [s.length - 1]), m = function (e) {
	          const t = {
	            nodeType: e.nodeType,
	            nodeName: e.nodeName,
	            attributes: Wl(e).map(t => {
	              let n = e.attributes[t].value;
	              const a = e.attributes[t].name;
	              return /^blob:/.test(n) ? n = n.replace(/^blob:/, "") : ql.test(a) ? n = "" : "IFRAME" === e.nodeName && r(e) && "src" === a && "about:blank" !== e.contentDocument.location.href && e.contentDocument.location.href !== o(n, e.ownerDocument.location.href) && (n = e.contentDocument.location.href), {
	                name: a,
	                value: n
	              };
	            })
	          };

	          if ("INPUT" === e.tagName && ["checkbox", "radio"].includes(e.type)) {
	            if (e.attributes.checked && !e.checked) {
	              const e = t.attributes.findIndex(e => "checked" === e.name);
	              t.attributes.splice(e, 1);
	            }

	            !e.attributes.checked && e.checked && t.attributes.push({
	              name: "checked"
	            });
	          }

	          "INPUT" === e.tagName && Ul.has(e.type) && (e.attributes.value && e.attributes.value.value) !== e.value && Yl(t.attributes, "value", e.value);
	          "OPTION" === e.tagName && e.parentElement.selectedOptions && window.Array.from(e.parentElement.selectedOptions).indexOf(e) > -1 && Yl(t.attributes, "selected", "");
	          "STYLE" === e.tagName && e.sheet && e.sheet.disabled && t.attributes.push({
	            name: "data-applitools-disabled",
	            value: ""
	          });
	          "LINK" === e.tagName && "text/css" === e.type && e.sheet && e.sheet.disabled && Yl(t.attributes, "disabled", "");
	          return t;
	        }(p), m.childNodeIndexes = f || (p.childNodes.length ? d(s, p.childNodes) : []), p.shadowRoot && ("undefined" == typeof window || "function" == typeof p.attachShadow && /native code/.test(p.attachShadow.toString()) ? (m.shadowRootIndex = e(s, p.shadowRoot), l.push(p.shadowRoot)) : m.childNodeIndexes = m.childNodeIndexes.concat(d(s, p.shadowRoot.childNodes))), "CANVAS" === p.nodeName && (g = o(`applitools-canvas-${t()}.png`, a), m.attributes.push({
	          name: "data-applitools-src",
	          value: g
	        }), c.push({
	          element: p,
	          url: g
	        })), "IFRAME" === p.nodeName && r(p) && n(p) && (g = o("?applitools-iframe=" + t(), a), m.attributes.push({
	          name: "data-applitools-src",
	          value: g
	        }), u.push({
	          element: p,
	          url: g
	        })), p.adoptedStyleSheets && p.adoptedStyleSheets.length > 0 && (m.exp_adoptedStyleSheets = Vl(p))) : m = function (e) {
	          return {
	            nodeType: Node.ELEMENT_NODE,
	            nodeName: "SCRIPT",
	            attributes: Wl(e).map(t => {
	              const n = e.attributes[t].name;
	              return {
	                name: n,
	                value: ql.test(n) ? "" : e.attributes[t].value
	              };
	            }).filter(e => "src" !== e.name),
	            childNodeIndexes: []
	          };
	        }(p) : b === Node.TEXT_NODE ? m = function (e) {
	          return {
	            nodeType: Node.TEXT_NODE,
	            nodeValue: e.nodeValue
	          };
	        }(p) : b === Node.DOCUMENT_TYPE_NODE && (m = function (e) {
	          return {
	            nodeType: Node.DOCUMENT_TYPE_NODE,
	            nodeName: e.nodeName
	          };
	        }(p));

	        if (m) {
	          if (b === Node.ELEMENT_NODE) {
	            const e = _l(p);

	            e.length > 0 && (h = h.concat(e));
	          }

	          return s.push(m), s.length - 1;
	        }

	        return null;
	      }(e, s);

	      null !== m && p.push(m);
	    }), p;
	  }
	};

	var $l = function (e) {
	  const t = [];
	  return new window.Set(e).forEach(e => e && t.push(e)), t;
	};

	var Gl = function (e) {
	  return e.reduce(({
	    resourceUrls: e,
	    blobsObj: t
	  }, {
	    resourceUrls: n,
	    blobsObj: r
	  }) => ({
	    resourceUrls: $l(e.concat(n)),
	    blobsObj: window.Object.assign(t, r)
	  }), {
	    resourceUrls: [],
	    blobsObj: {}
	  });
	};

	var Kl = function ({
	  processResource: e,
	  aggregateResourceUrlsAndBlobs: t
	}) {
	  return function n({
	    documents: r,
	    urls: o,
	    forceCreateStyle: a = !1,
	    skipResources: i
	  }) {
	    return Promise.all(o.map(t => e({
	      url: t,
	      documents: r,
	      getResourceUrlsAndBlobs: n,
	      forceCreateStyle: a,
	      skipResources: i
	    }))).then(e => t(e));
	  };
	};

	var Xl = function (e) {
	  return /^(blob|https?):/.test(e);
	};

	var Ql = function (e) {
	  const t = e && e.match(/(^[^#]*)/),
	        n = t && t[1] || e;
	  return n && n.replace(/\?\s*$/, "?") || e;
	};

	var Zl = function (e) {
	  return e.reduce((e, t) => e.concat(t), []);
	};

	var Jl = function ({
	  fetchUrl: e,
	  findStyleSheetByUrl: t,
	  getCorsFreeStyleSheet: n,
	  extractResourcesFromStyleSheet: r,
	  extractResourcesFromSvg: a,
	  sessionCache: i,
	  cache: s = {},
	  log: l = Nl
	}) {
	  return function ({
	    url: c,
	    documents: u,
	    getResourceUrlsAndBlobs: h,
	    forceCreateStyle: d = !1,
	    skipResources: p
	  }) {
	    if (!s[c]) if (i && i.getItem(c)) {
	      const e = function e(t) {
	        const n = i.getItem(t);
	        return [t].concat(n ? $l(Zl(n.map(e))) : []);
	      }(c);

	      l("doProcessResource from sessionStorage", c, "deps:", e.slice(1)), s[c] = Promise.resolve({
	        resourceUrls: e
	      });
	    } else if (p && p.indexOf(c) > -1 || /https:\/\/fonts.googleapis.com/.test(c)) l("not processing resource from skip list (or google font):", c), s[c] = Promise.resolve({
	      resourceUrls: [c]
	    });else {
	      const f = Date.now();

	      s[c] = function (s) {
	        l("fetching", s);
	        const c = Date.now();
	        return e(s).catch(e => {
	          if (function (e) {
	            const t = e.message && (e.message.includes("Failed to fetch") || e.message.includes("Network request failed")),
	                  n = e.name && e.name.includes("TypeError");
	            return t && n;
	          }(e)) return {
	            probablyCORS: !0,
	            url: s
	          };
	          if (e.isTimeout) return {
	            isTimeout: !0,
	            url: s
	          };
	          throw e;
	        }).then(({
	          url: e,
	          type: s,
	          value: m,
	          probablyCORS: f,
	          errorStatusCode: g,
	          isTimeout: b
	        }) => {
	          if (f) return l("not fetched due to CORS", `[${Date.now() - c}ms]`, e), i && i.setItem(e, []), {
	            resourceUrls: [e]
	          };

	          if (g) {
	            const t = {
	              [e]: {
	                errorStatusCode: g
	              }
	            };
	            return i && i.setItem(e, []), {
	              blobsObj: t
	            };
	          }

	          if (b) return l("not fetched due to timeout, returning error status code 504 (Gateway timeout)"), i && i.setItem(e, []), {
	            blobsObj: {
	              [e]: {
	                errorStatusCode: 504
	              }
	            }
	          };
	          l(`fetched [${Date.now() - c}ms] ${e} bytes: ${m.byteLength}`);
	          const y = {
	            [e]: {
	              type: s,
	              value: m
	            }
	          };
	          let k;

	          if (/text\/css/.test(s)) {
	            let o = t(e, u);

	            if (o || d) {
	              const {
	                corsFreeStyleSheet: e,
	                cleanStyleSheet: t
	              } = n(m, o);
	              k = r(e), t();
	            }
	          } else if (/image\/svg/.test(s)) try {
	            k = a(m), d = !!k;
	          } catch (e) {
	            l("could not parse svg content", e);
	          }

	          if (k) {
	            const t = k.map(t => o(t, e.replace(/^blob:/, ""))).map(Ql).filter(Xl);
	            return i && i.setItem(e, t), h({
	              documents: u,
	              urls: t,
	              forceCreateStyle: d,
	              skipResources: p
	            }).then(({
	              resourceUrls: e,
	              blobsObj: t
	            }) => ({
	              resourceUrls: e,
	              blobsObj: window.Object.assign(t, y)
	            }));
	          }

	          return i && i.setItem(e, []), {
	            blobsObj: y
	          };
	        }).catch(e => (l("error while fetching", s, e, e ? `message=${e.message} | name=${e.name}` : ""), i && m(), {}));
	      }(c).then(e => (l("doProcessResource", `[${Date.now() - f}ms]`, c), e));
	    }
	    return s[c];

	    function m() {
	      l("clearing from sessionStorage:", c), i.keys().forEach(e => {
	        const t = i.getItem(e);
	        i.setItem(e, t.filter(e => e !== c));
	      }), l("cleared from sessionStorage:", c);
	    }
	  };
	};

	var ec = function ({
	  parser: e,
	  decoder: t,
	  extractResourceUrlsFromStyleTags: n
	}) {
	  return function (r) {
	    const o = (t || new TextDecoder("utf-8")).decode(r),
	          a = (e || new DOMParser()).parseFromString(o, "image/svg+xml"),
	          i = window.Array.from(a.querySelectorAll("img[srcset]")).map(e => e.getAttribute("srcset").split(", ").map(e => e.trim().split(/\s+/)[0])).reduce((e, t) => e.concat(t), []),
	          s = window.Array.from(a.querySelectorAll("img[src]")).map(e => e.getAttribute("src")),
	          l = window.Array.from(a.querySelectorAll('image,use,link[rel="stylesheet"]')).map(e => e.getAttribute("href") || e.getAttribute("xlink:href")),
	          c = window.Array.from(a.getElementsByTagName("object")).map(e => e.getAttribute("data")),
	          u = n(a, !1),
	          h = function (e) {
	      return Zl(window.Array.from(e.querySelectorAll("*[style]")).map(e => e.style.cssText).map(Bl).filter(Boolean));
	    }(a);

	    return i.concat(s).concat(l).concat(c).concat(u).concat(h).filter(e => "#" !== e[0]);
	  };
	};

	var tc = function ({
	  fetch: e = window.fetch,
	  AbortController: t = window.AbortController,
	  timeout: n = 1e4
	}) {
	  return function (r) {
	    return new Promise((o, a) => {
	      const i = new t(),
	            s = setTimeout(() => {
	        const e = new Error("fetchUrl timeout reached");
	        e.isTimeout = !0, a(e), i.abort();
	      }, n);
	      return e(r, {
	        cache: "force-cache",
	        credentials: "same-origin",
	        signal: i.signal
	      }).then(e => (clearTimeout(s), 200 === e.status ? e.arrayBuffer().then(t => ({
	        url: r,
	        type: e.headers.get("Content-Type"),
	        value: t
	      })) : {
	        url: r,
	        errorStatusCode: e.status
	      })).then(o).catch(e => a(e));
	    });
	  };
	};

	var nc = function (e) {
	  const t = new URL(e);
	  return t.username && (t.username = ""), t.password && (t.password = ""), t.href;
	};

	var rc = function ({
	  styleSheetCache: e
	}) {
	  return function (t, n) {
	    const r = Zl(n.map(e => {
	      try {
	        return window.Array.from(e.styleSheets);
	      } catch (e) {
	        return [];
	      }
	    }));
	    return e[t] || r.find(e => {
	      const n = e.href && Ql(e.href);
	      return n && nc(n) === t;
	    });
	  };
	};

	var oc = function ({
	  styleSheetCache: e,
	  CSSRule: t = window.CSSRule
	}) {
	  return function n(r) {
	    return $l(window.Array.from(r.cssRules || []).reduce((r, o) => {
	      const a = {
	        [t.IMPORT_RULE]: () => (o.styleSheet && (e[o.styleSheet.href] = o.styleSheet), o.href),
	        [t.FONT_FACE_RULE]: () => Bl(o.cssText),
	        [t.SUPPORTS_RULE]: () => n(o),
	        [t.MEDIA_RULE]: () => n(o),
	        [t.STYLE_RULE]: () => {
	          let e = [];

	          for (let t = 0, n = o.style.length; t < n; t++) {
	            const n = o.style[t];
	            let r = o.style.getPropertyValue(n);
	            (/^\s*var\s*\(/.test(r) || /^--/.test(n)) && (r = r.replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, e => String.fromCodePoint(parseInt(e.substr(1).trim(), 16))).replace(/\\([^0-9a-fA-F])/g, "$1"));
	            const a = Bl(r);
	            e = e.concat(a);
	          }

	          return e;
	        }
	      }[o.type],
	            i = a && a() || [];
	      return r.concat(i);
	    }, [])).filter(e => "#" !== e[0]);
	  };
	};

	var ac = function (e) {
	  return function (t, n = !0) {
	    return $l(window.Array.from(t.querySelectorAll("style")).reduce((r, o) => {
	      const a = n ? window.Array.from(t.styleSheets).find(e => e.ownerNode === o) : o.sheet;
	      return a ? r.concat(e(a)) : r;
	    }, []));
	  };
	};

	var ic = function (e) {
	  const t = new TextDecoder("utf-8").decode(e),
	        n = document.head || document.querySelectorAll("head")[0],
	        r = document.createElement("style");
	  return r.type = "text/css", r.setAttribute("data-desc", "Applitools tmp variable created by DOM SNAPSHOT"), n.appendChild(r), r.styleSheet ? r.styleSheet.cssText = t : r.appendChild(document.createTextNode(t)), r.sheet;
	};

	var sc = function (e, t, n = Nl) {
	  let r;
	  if (t) try {
	    t.cssRules, r = t;
	  } catch (o) {
	    n(`[dom-snapshot] could not access cssRules for ${t.href} ${o}\ncreating temp style for access.`), r = ic(e);
	  } else r = ic(e);
	  return {
	    corsFreeStyleSheet: r,
	    cleanStyleSheet: function () {
	      r !== t && r.ownerNode.parentNode.removeChild(r.ownerNode);
	    }
	  };
	};

	var lc = function (e) {
	  for (var t = window.atob(e), n = t.length, r = new Uint8Array(n), o = 0; o < n; o++) r[o] = t.charCodeAt(o);

	  return r.buffer;
	};

	var cc = function (e) {
	  return e.map(({
	    url: e,
	    element: t
	  }) => {
	    const n = t.toDataURL("image/png");
	    return {
	      url: e,
	      type: "image/png",
	      value: lc(n.split(",")[1])
	    };
	  });
	};

	var uc = function (e = [document]) {
	  return Zl(e.map(e => window.Array.from(e.querySelectorAll('iframe[src]:not([src=""]),iframe[srcdoc]:not([srcdoc=""])')))).filter(e => r(e) && !n(e)).map(e => e.contentDocument);
	};

	var hc = function (e) {
	  const t = e.querySelectorAll("base")[0] && e.querySelectorAll("base")[0].href;
	  if (t && (n = t) && !/^(about:blank|javascript:void|blob:)/.test(n)) return t;
	  var n;
	};

	var dc = function (e) {
	  return e && e.replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, e => {
	    const t = parseInt(e.substr(1).trim(), 16);
	    return String.fromCodePoint(t);
	  }) || e;
	};

	var pc = function (e) {
	  return function () {
	    const t = ["[dom-snapshot]", `[+${Date.now() - e}ms]`].concat(window.Array.from(arguments));
	    console.log.apply(console, t);
	  };
	};

	var mc = function ({
	  log: e,
	  sessionStorage: t
	}) {
	  let n;

	  try {
	    const e = (t = t || window.sessionStorage).getItem("__process_resource");
	    n = e ? JSON.parse(e) : {};
	  } catch (t) {
	    e("error creating session cache", t);
	  }

	  return {
	    getItem: function (e) {
	      if (n) return n[e];
	    },
	    setItem: function (t, r) {
	      n && (e("saving to in-memory sessionStorage, key:", t, "value:", r), n[t] = r);
	    },
	    keys: function () {
	      return n ? window.Object.keys(n) : [];
	    },
	    persist: function () {
	      n && t.setItem("__process_resource", JSON.stringify(n));
	    }
	  };
	};

	function fc(e) {
	  return window.Object.keys(e).map(t => window.Object.assign({
	    url: t.replace(/^blob:/, "")
	  }, e[t]));
	}

	function gc(e) {
	  return e && Xl(e);
	}

	var bc = function (e = document, {
	  showLogs: t,
	  useSessionCache: n,
	  dontFetchResources: r,
	  fetchTimeout: a,
	  skipResources: i
	} = {}) {
	  /* MARKER FOR TEST - DO NOT DELETE */
	  const s = t ? pc(Date.now()) : Nl;
	  s("processPage start"), s("skipResources length: " + (i && i.length));
	  const l = n && mc({
	    log: s
	  }),
	        c = {},
	        u = oc({
	    styleSheetCache: c
	  }),
	        h = rc({
	    styleSheetCache: c
	  }),
	        d = ac(u),
	        p = ec({
	    extractResourceUrlsFromStyleTags: d
	  }),
	        m = tc({
	    timeout: a
	  }),
	        f = Jl({
	    fetchUrl: m,
	    findStyleSheetByUrl: h,
	    getCorsFreeStyleSheet: sc,
	    extractResourcesFromStyleSheet: u,
	    extractResourcesFromSvg: p,
	    absolutizeUrl: o,
	    log: s,
	    sessionCache: l
	  }),
	        g = Kl({
	    processResource: f,
	    aggregateResourceUrlsAndBlobs: Gl
	  });
	  return function e(t, n = t.location.href) {
	    const a = hc(t) || n,
	          {
	      cdt: c,
	      docRoots: u,
	      canvasElements: h,
	      inlineFrames: p,
	      linkUrls: m
	    } = Hl(t, a, s),
	          f = Zl(u.map(e => d(e))),
	          b = (C = a, function (e) {
	      try {
	        return o(e, C);
	      } catch (e) {}
	    }),
	          y = $l(window.Array.from(m).concat(window.Array.from(f))).map(dc).map(b).map(Ql).filter(gc),
	          k = r ? Promise.resolve({
	      resourceUrls: y,
	      blobsObj: {}
	    }) : g({
	      documents: u,
	      urls: y,
	      skipResources: i
	    }).then(e => (l && l.persist(), e)),
	          v = cc(h),
	          w = uc(u).map(t => e(t)),
	          x = p.map(({
	      element: t,
	      url: n
	    }) => e(t.contentDocument, n)),
	          S = t.defaultView && t.defaultView.frameElement && t.defaultView.frameElement.getAttribute("src");
	    var C;
	    return Promise.all([k].concat(w).concat(x)).then(function (e) {
	      const {
	        resourceUrls: t,
	        blobsObj: r
	      } = e[0],
	            o = e.slice(1);
	      return {
	        cdt: c,
	        url: n,
	        srcAttr: S,
	        resourceUrls: t.map(e => e.replace(/^blob:/, "")),
	        blobs: fc(r).concat(v),
	        frames: o
	      };
	    });
	  }(e).then(e => (s("processPage end"), e.scriptVersion = "4.0.4", e));
	};

	function yc(t) {
	  return t.blobs = t.blobs.map(t => t.value ? window.Object.assign(t, {
	    value: e(t.value)
	  }) : t), t.frames.forEach(yc), t;
	}

	var kc = function () {
	  return bc.apply(this, arguments).then(yc);
	};

	var processPageAndSerializeCjs = kc;

	return processPageAndSerializeCjs;

}());
  return processPageAndSerialize(...args)
}