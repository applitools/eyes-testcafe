
module.exports = (args) => {
  var processPageAndSerialize = (function () {
	'use strict';

	/* @applitools/dom-snapshot@4.2.0 */

	function e(e, t = 0) {
	  const n = e.charCodeAt(t);

	  if (n >= 55296 && n < 56320) {
	    return 1024 * (n - 55296) + (e.charCodeAt(t + 1) - 56320) + 65536;
	  }

	  return 56320 <= n && n <= 57343 ? -1 : n;
	}

	var t = function (t, n) {
	  const r = [];
	  let a = 0;

	  for (let i = 0; i < t.length; ++i) {
	    const o = e(t, i);
	    let s = 0;
	    o > 0 && (s = o < 128 ? 1 : o < 2048 ? 2 : o < 65536 ? 3 : o < 2097152 ? 4 : o < 67108864 ? 5 : 6), a + s > n ? (r.push(i), a = s) : a += s;
	  }

	  return r;
	};

	const n = "WIP",
	      r = "SUCCESS",
	      a = "SUCCESS_CHUNKED",
	      i = "ERROR";

	var o = function (e, o, s = {}) {
	  const l = function (e, {
	    chunkByteLength: o = 0
	  } = {}) {
	    if (e) {
	      if (e.value) {
	        if (o) {
	          if (!e.chunks) {
	            const n = JSON.stringify(e.value);
	            e.chunks = t(n, o), e.chunks.length > 0 && (e.from = 0, e.value = n);
	          }

	          if (e.from >= 0) return {
	            status: a,
	            value: e.value.substring(e.from, e.from = e.chunks.shift()),
	            done: !e.from
	          };
	        }

	        return {
	          status: r,
	          value: e.value
	        };
	      }

	      return e.error ? {
	        status: i,
	        error: e.error
	      } : {
	        status: n
	      };
	    }

	    return {
	      status: i,
	      error: "unexpected poll request received - cannot find state of current operation"
	    };
	  }((e = e || {})[o], s);

	  return (l.status === r || l.status === i || l.status === a && l.done) && (e[o] = null), l;
	};

	var s = function (e, t) {
	  return new URL(e, t).href;
	};

	var l = function (e) {
	  return !/^https?:.+/.test(e.src) || e.contentDocument && e.contentDocument.location && (["about:blank", "about:srcdoc"].includes(e.contentDocument.location.href) || "" === e.getAttribute("src") && e.contentDocument.location.href === s(e.getAttribute("src"), e.ownerDocument.location.href));
	};

	var c = {
	  chunkify: t,
	  pollify: function (e, t, n) {
	    return r => function () {
	      return t[n] || (t[n] = {}, e.apply(null, arguments).then(e => t[n].value = e).catch(e => t[n].error = e.message)), o(t, n, r);
	    };
	  },
	  poll: o,
	  absolutizeUrl: s,
	  isInlineFrame: l,
	  isAccessibleFrame: function (e) {
	    try {
	      const t = e.contentDocument;
	      return Boolean(t && t.defaultView && t.defaultView.frameElement);
	    } catch (e) {
	      return !1;
	    }
	  }
	};

	var u = function () {
	  return window.crypto.getRandomValues(new Uint32Array(1))[0];
	};

	function h(e) {
	  return {
	    prev: null,
	    next: null,
	    data: e
	  };
	}

	function d(e, t, n) {
	  var r;
	  return null !== f ? (r = f, f = f.cursor, r.prev = t, r.next = n, r.cursor = e.cursor) : r = {
	    prev: t,
	    next: n,
	    cursor: e.cursor
	  }, e.cursor = r, r;
	}

	function p(e) {
	  var t = e.cursor;
	  e.cursor = t.cursor, t.prev = null, t.next = null, t.cursor = f, f = t;
	}

	var f = null,
	    m = function () {
	  this.cursor = null, this.head = null, this.tail = null;
	};

	m.createItem = h, m.prototype.createItem = h, m.prototype.updateCursors = function (e, t, n, r) {
	  for (var a = this.cursor; null !== a;) a.prev === e && (a.prev = t), a.next === n && (a.next = r), a = a.cursor;
	}, m.prototype.getSize = function () {
	  for (var e = 0, t = this.head; t;) e++, t = t.next;

	  return e;
	}, m.prototype.fromArray = function (e) {
	  var t = null;
	  this.head = null;

	  for (var n = 0; n < e.length; n++) {
	    var r = h(e[n]);
	    null !== t ? t.next = r : this.head = r, r.prev = t, t = r;
	  }

	  return this.tail = t, this;
	}, m.prototype.toArray = function () {
	  for (var e = this.head, t = []; e;) t.push(e.data), e = e.next;

	  return t;
	}, m.prototype.toJSON = m.prototype.toArray, m.prototype.isEmpty = function () {
	  return null === this.head;
	}, m.prototype.first = function () {
	  return this.head && this.head.data;
	}, m.prototype.last = function () {
	  return this.tail && this.tail.data;
	}, m.prototype.each = function (e, t) {
	  var n;
	  void 0 === t && (t = this);

	  for (var r = d(this, null, this.head); null !== r.next;) n = r.next, r.next = n.next, e.call(t, n.data, n, this);

	  p(this);
	}, m.prototype.forEach = m.prototype.each, m.prototype.eachRight = function (e, t) {
	  var n;
	  void 0 === t && (t = this);

	  for (var r = d(this, this.tail, null); null !== r.prev;) n = r.prev, r.prev = n.prev, e.call(t, n.data, n, this);

	  p(this);
	}, m.prototype.forEachRight = m.prototype.eachRight, m.prototype.nextUntil = function (e, t, n) {
	  if (null !== e) {
	    var r;
	    void 0 === n && (n = this);

	    for (var a = d(this, null, e); null !== a.next && (r = a.next, a.next = r.next, !t.call(n, r.data, r, this)););

	    p(this);
	  }
	}, m.prototype.prevUntil = function (e, t, n) {
	  if (null !== e) {
	    var r;
	    void 0 === n && (n = this);

	    for (var a = d(this, e, null); null !== a.prev && (r = a.prev, a.prev = r.prev, !t.call(n, r.data, r, this)););

	    p(this);
	  }
	}, m.prototype.some = function (e, t) {
	  var n = this.head;

	  for (void 0 === t && (t = this); null !== n;) {
	    if (e.call(t, n.data, n, this)) return !0;
	    n = n.next;
	  }

	  return !1;
	}, m.prototype.map = function (e, t) {
	  var n = new m(),
	      r = this.head;

	  for (void 0 === t && (t = this); null !== r;) n.appendData(e.call(t, r.data, r, this)), r = r.next;

	  return n;
	}, m.prototype.filter = function (e, t) {
	  var n = new m(),
	      r = this.head;

	  for (void 0 === t && (t = this); null !== r;) e.call(t, r.data, r, this) && n.appendData(r.data), r = r.next;

	  return n;
	}, m.prototype.clear = function () {
	  this.head = null, this.tail = null;
	}, m.prototype.copy = function () {
	  for (var e = new m(), t = this.head; null !== t;) e.insert(h(t.data)), t = t.next;

	  return e;
	}, m.prototype.prepend = function (e) {
	  return this.updateCursors(null, e, this.head, e), null !== this.head ? (this.head.prev = e, e.next = this.head) : this.tail = e, this.head = e, this;
	}, m.prototype.prependData = function (e) {
	  return this.prepend(h(e));
	}, m.prototype.append = function (e) {
	  return this.insert(e);
	}, m.prototype.appendData = function (e) {
	  return this.insert(h(e));
	}, m.prototype.insert = function (e, t) {
	  if (null != t) {
	    if (this.updateCursors(t.prev, e, t, e), null === t.prev) {
	      if (this.head !== t) throw new Error("before doesn't belong to list");
	      this.head = e, t.prev = e, e.next = t, this.updateCursors(null, e);
	    } else t.prev.next = e, e.prev = t.prev, t.prev = e, e.next = t;
	  } else this.updateCursors(this.tail, e, null, e), null !== this.tail ? (this.tail.next = e, e.prev = this.tail) : this.head = e, this.tail = e;
	  return this;
	}, m.prototype.insertData = function (e, t) {
	  return this.insert(h(e), t);
	}, m.prototype.remove = function (e) {
	  if (this.updateCursors(e, e.prev, e, e.next), null !== e.prev) e.prev.next = e.next;else {
	    if (this.head !== e) throw new Error("item doesn't belong to list");
	    this.head = e.next;
	  }
	  if (null !== e.next) e.next.prev = e.prev;else {
	    if (this.tail !== e) throw new Error("item doesn't belong to list");
	    this.tail = e.prev;
	  }
	  return e.prev = null, e.next = null, e;
	}, m.prototype.push = function (e) {
	  this.insert(h(e));
	}, m.prototype.pop = function () {
	  if (null !== this.tail) return this.remove(this.tail);
	}, m.prototype.unshift = function (e) {
	  this.prepend(h(e));
	}, m.prototype.shift = function () {
	  if (null !== this.head) return this.remove(this.head);
	}, m.prototype.prependList = function (e) {
	  return this.insertList(e, this.head);
	}, m.prototype.appendList = function (e) {
	  return this.insertList(e);
	}, m.prototype.insertList = function (e, t) {
	  return null === e.head || (null != t ? (this.updateCursors(t.prev, e.tail, t, e.head), null !== t.prev ? (t.prev.next = e.head, e.head.prev = t.prev) : this.head = e.head, t.prev = e.tail, e.tail.next = t) : (this.updateCursors(this.tail, e.tail, null, e.head), null !== this.tail ? (this.tail.next = e.head, e.head.prev = this.tail) : this.head = e.head, this.tail = e.tail), e.head = null, e.tail = null), this;
	}, m.prototype.replace = function (e, t) {
	  "head" in t ? this.insertList(t, e) : this.insert(t, e), this.remove(e);
	};

	var g = m,
	    b = function (e, t) {
	  var n = window.Object.create(SyntaxError.prototype),
	      r = new Error();
	  return n.name = e, n.message = t, window.Object.defineProperty(n, "stack", {
	    get: function () {
	      return (r.stack || "").replace(/^(.+\n){1,3}/, e + ": " + t + "\n");
	    }
	  }), n;
	};

	function y(e, t) {
	  function n(e, t) {
	    return r.slice(e, t).map(function (t, n) {
	      for (var r = String(e + n + 1); r.length < l;) r = " " + r;

	      return r + " |" + t;
	    }).join("\n");
	  }

	  var r = e.source.split(/\r\n?|\n|\f/),
	      a = e.line,
	      i = e.column,
	      o = Math.max(1, a - t) - 1,
	      s = Math.min(a + t, r.length + 1),
	      l = Math.max(4, String(s).length) + 1,
	      c = 0;
	  (i += ("    ".length - 1) * (r[a - 1].substr(0, i - 1).match(/\t/g) || []).length) > 100 && (c = i - 60 + 3, i = 58);

	  for (var u = o; u <= s; u++) u >= 0 && u < r.length && (r[u] = r[u].replace(/\t/g, "    "), r[u] = (c > 0 && r[u].length > c ? "…" : "") + r[u].substr(c, 98) + (r[u].length > c + 100 - 1 ? "…" : ""));

	  return [n(o, a), new window.Array(i + l + 2).join("-") + "^", n(a, s)].filter(Boolean).join("\n");
	}

	var k = function (e, t, n, r, a) {
	  var i = b("SyntaxError", e);
	  return i.source = t, i.offset = n, i.line = r, i.column = a, i.sourceFragment = function (e) {
	    return y(i, isNaN(e) ? 0 : e);
	  }, window.Object.defineProperty(i, "formattedMessage", {
	    get: function () {
	      return "Parse error: " + i.message + "\n" + y(i, 2);
	    }
	  }), i.parseError = {
	    offset: n,
	    line: r,
	    column: a
	  }, i;
	},
	    v = {
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
	    w = window.Object.keys(v).reduce(function (e, t) {
	  return e[v[t]] = t, e;
	}, {}),
	    x = {
	  TYPE: v,
	  NAME: w
	};

	function _(e) {
	  return e >= 48 && e <= 57;
	}

	function S(e) {
	  return e >= 65 && e <= 90;
	}

	function C(e) {
	  return e >= 97 && e <= 122;
	}

	function z(e) {
	  return S(e) || C(e);
	}

	function A(e) {
	  return e >= 128;
	}

	function T(e) {
	  return z(e) || A(e) || 95 === e;
	}

	function E(e) {
	  return e >= 0 && e <= 8 || 11 === e || e >= 14 && e <= 31 || 127 === e;
	}

	function P(e) {
	  return 10 === e || 13 === e || 12 === e;
	}

	function L(e) {
	  return P(e) || 32 === e || 9 === e;
	}

	function O(e, t) {
	  return 92 === e && !P(t) && 0 !== t;
	}

	var D = new window.Array(128);
	N.Eof = 128, N.WhiteSpace = 130, N.Digit = 131, N.NameStart = 132, N.NonPrintable = 133;

	for (var R = 0; R < D.length; R++) switch (!0) {
	  case L(R):
	    D[R] = N.WhiteSpace;
	    break;

	  case _(R):
	    D[R] = N.Digit;
	    break;

	  case T(R):
	    D[R] = N.NameStart;
	    break;

	  case E(R):
	    D[R] = N.NonPrintable;
	    break;

	  default:
	    D[R] = R || N.Eof;
	}

	function N(e) {
	  return e < 128 ? D[e] : N.NameStart;
	}

	var B = {
	  isDigit: _,
	  isHexDigit: function (e) {
	    return _(e) || e >= 65 && e <= 70 || e >= 97 && e <= 102;
	  },
	  isUppercaseLetter: S,
	  isLowercaseLetter: C,
	  isLetter: z,
	  isNonAscii: A,
	  isNameStart: T,
	  isName: function (e) {
	    return T(e) || _(e) || 45 === e;
	  },
	  isNonPrintable: E,
	  isNewline: P,
	  isWhiteSpace: L,
	  isValidEscape: O,
	  isIdentifierStart: function (e, t, n) {
	    return 45 === e ? T(t) || 45 === t || O(t, n) : !!T(e) || 92 === e && O(e, t);
	  },
	  isNumberStart: function (e, t, n) {
	    return 43 === e || 45 === e ? _(t) ? 2 : 46 === t && _(n) ? 3 : 0 : 46 === e ? _(t) ? 2 : 0 : _(e) ? 1 : 0;
	  },
	  isBOM: function (e) {
	    return 65279 === e || 65534 === e ? 1 : 0;
	  },
	  charCodeCategory: N
	},
	    I = B.isDigit,
	    M = B.isHexDigit,
	    j = B.isUppercaseLetter,
	    F = B.isName,
	    U = B.isWhiteSpace,
	    q = B.isValidEscape;

	function W(e, t) {
	  return t < e.length ? e.charCodeAt(t) : 0;
	}

	function Y(e, t, n) {
	  return 13 === n && 10 === W(e, t + 1) ? 2 : 1;
	}

	function H(e, t, n) {
	  var r = e.charCodeAt(t);
	  return j(r) && (r |= 32), r === n;
	}

	function Z(e, t) {
	  for (; t < e.length && I(e.charCodeAt(t)); t++);

	  return t;
	}

	function V(e, t) {
	  if (M(W(e, (t += 2) - 1))) {
	    for (var n = Math.min(e.length, t + 5); t < n && M(W(e, t)); t++);

	    var r = W(e, t);
	    U(r) && (t += Y(e, t, r));
	  }

	  return t;
	}

	var $ = {
	  consumeEscaped: V,
	  consumeName: function (e, t) {
	    for (; t < e.length; t++) {
	      var n = e.charCodeAt(t);

	      if (!F(n)) {
	        if (!q(n, W(e, t + 1))) break;
	        t = V(e, t) - 1;
	      }
	    }

	    return t;
	  },
	  consumeNumber: function (e, t) {
	    var n = e.charCodeAt(t);

	    if (43 !== n && 45 !== n || (n = e.charCodeAt(t += 1)), I(n) && (t = Z(e, t + 1), n = e.charCodeAt(t)), 46 === n && I(e.charCodeAt(t + 1)) && (n = e.charCodeAt(t += 2), t = Z(e, t)), H(e, t, 101)) {
	      var r = 0;
	      45 !== (n = e.charCodeAt(t + 1)) && 43 !== n || (r = 1, n = e.charCodeAt(t + 2)), I(n) && (t = Z(e, t + 1 + r + 1));
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

	      q(n, W(e, t + 1)) && (t = V(e, t));
	    }

	    return t;
	  },
	  cmpChar: H,
	  cmpStr: function (e, t, n, r) {
	    if (n - t !== r.length) return !1;
	    if (t < 0 || n > e.length) return !1;

	    for (var a = t; a < n; a++) {
	      var i = e.charCodeAt(a),
	          o = r.charCodeAt(a - t);
	      if (j(i) && (i |= 32), i !== o) return !1;
	    }

	    return !0;
	  },
	  getNewlineLength: Y,
	  findWhiteSpaceStart: function (e, t) {
	    for (; t >= 0 && U(e.charCodeAt(t)); t--);

	    return t + 1;
	  },
	  findWhiteSpaceEnd: function (e, t) {
	    for (; t < e.length && U(e.charCodeAt(t)); t++);

	    return t;
	  }
	},
	    K = x.TYPE,
	    G = x.NAME,
	    X = $.cmpStr,
	    Q = K.EOF,
	    J = K.WhiteSpace,
	    ee = K.Comment,
	    te = function () {
	  this.offsetAndType = null, this.balance = null, this.reset();
	};

	te.prototype = {
	  reset: function () {
	    this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, this.tokenEnd = this.firstCharOffset;
	  },
	  lookupType: function (e) {
	    return (e += this.tokenIndex) < this.tokenCount ? this.offsetAndType[e] >> 24 : Q;
	  },
	  lookupOffset: function (e) {
	    return (e += this.tokenIndex) < this.tokenCount ? 16777215 & this.offsetAndType[e - 1] : this.source.length;
	  },
	  lookupValue: function (e, t) {
	    return (e += this.tokenIndex) < this.tokenCount && X(this.source, 16777215 & this.offsetAndType[e - 1], 16777215 & this.offsetAndType[e], t);
	  },
	  getTokenStart: function (e) {
	    return e === this.tokenIndex ? this.tokenStart : e > 0 ? e < this.tokenCount ? 16777215 & this.offsetAndType[e - 1] : 16777215 & this.offsetAndType[this.tokenCount] : this.firstCharOffset;
	  },
	  getRawLength: function (e, t) {
	    var n,
	        r = e,
	        a = 16777215 & this.offsetAndType[Math.max(r - 1, 0)];

	    e: for (; r < this.tokenCount && !((n = this.balance[r]) < e); r++) switch (t(this.offsetAndType[r] >> 24, this.source, a)) {
	      case 1:
	        break e;

	      case 2:
	        r++;
	        break e;

	      default:
	        a = 16777215 & this.offsetAndType[r], this.balance[n] === r && (r = n);
	    }

	    return r - this.tokenIndex;
	  },
	  isBalanceEdge: function (e) {
	    return this.balance[this.tokenIndex] < e;
	  },
	  isDelim: function (e, t) {
	    return t ? this.lookupType(t) === K.Delim && this.source.charCodeAt(this.lookupOffset(t)) === e : this.tokenType === K.Delim && this.source.charCodeAt(this.tokenStart) === e;
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
	    for (var e = this.tokenIndex, t = 0; e < this.tokenCount && this.offsetAndType[e] >> 24 === J; e++, t++);

	    t > 0 && this.skip(t);
	  },
	  skipSC: function () {
	    for (; this.tokenType === J || this.tokenType === ee;) this.next();
	  },
	  skip: function (e) {
	    var t = this.tokenIndex + e;
	    t < this.tokenCount ? (this.tokenIndex = t, this.tokenStart = 16777215 & this.offsetAndType[t - 1], t = this.offsetAndType[t], this.tokenType = t >> 24, this.tokenEnd = 16777215 & t) : (this.tokenIndex = this.tokenCount, this.next());
	  },
	  next: function () {
	    var e = this.tokenIndex + 1;
	    e < this.tokenCount ? (this.tokenIndex = e, this.tokenStart = this.tokenEnd, e = this.offsetAndType[e], this.tokenType = e >> 24, this.tokenEnd = 16777215 & e) : (this.tokenIndex = this.tokenCount, this.eof = !0, this.tokenType = Q, this.tokenStart = this.tokenEnd = this.source.length);
	  },
	  dump: function () {
	    var e = this.firstCharOffset;
	    return window.Array.prototype.slice.call(this.offsetAndType, 0, this.tokenCount).map(function (t, n) {
	      var r = e,
	          a = 16777215 & t;
	      return e = a, {
	        idx: n,
	        type: G[t >> 24],
	        chunk: this.source.substring(r, a),
	        balance: this.balance[n]
	      };
	    }, this);
	  }
	};
	var ne = te;

	function re(e) {
	  return e;
	}

	function ae(e, t, n, r) {
	  var a, i;

	  switch (e.type) {
	    case "Group":
	      a = function (e, t, n, r) {
	        var a = " " === e.combinator || r ? e.combinator : " " + e.combinator + " ",
	            i = e.terms.map(function (e) {
	          return ae(e, t, n, r);
	        }).join(a);
	        return (e.explicit || n) && (i = (r || "," === i[0] ? "[" : "[ ") + i + (r ? "]" : " ]")), i;
	      }(e, t, n, r) + (e.disallowEmpty ? "!" : "");

	      break;

	    case "Multiplier":
	      return ae(e.term, t, n, r) + t(0 === (i = e).min && 0 === i.max ? "*" : 0 === i.min && 1 === i.max ? "?" : 1 === i.min && 0 === i.max ? i.comma ? "#" : "+" : 1 === i.min && 1 === i.max ? "" : (i.comma ? "#" : "") + (i.min === i.max ? "{" + i.min + "}" : "{" + i.min + "," + (0 !== i.max ? i.max : "") + "}"), e);

	    case "Type":
	      a = "<" + e.name + (e.opts ? t(function (e) {
	        switch (e.type) {
	          case "Range":
	            return " [" + (null === e.min ? "-∞" : e.min) + "," + (null === e.max ? "∞" : e.max) + "]";

	          default:
	            throw new Error("Unknown node type `" + e.type + "`");
	        }
	      }(e.opts), e.opts) : "") + ">";
	      break;

	    case "Property":
	      a = "<'" + e.name + "'>";
	      break;

	    case "Keyword":
	      a = e.name;
	      break;

	    case "AtKeyword":
	      a = "@" + e.name;
	      break;

	    case "Function":
	      a = e.name + "(";
	      break;

	    case "String":
	    case "Token":
	      a = e.value;
	      break;

	    case "Comma":
	      a = ",";
	      break;

	    default:
	      throw new Error("Unknown node type `" + e.type + "`");
	  }

	  return t(a, e);
	}

	var ie = function (e, t) {
	  var n = re,
	      r = !1,
	      a = !1;
	  return "function" == typeof t ? n = t : t && (r = Boolean(t.forceBraces), a = Boolean(t.compact), "function" == typeof t.decorate && (n = t.decorate)), ae(e, n, r, a);
	};

	function oe(e, t) {
	  var n = e && e.loc && e.loc[t];
	  return n ? {
	    offset: n.offset,
	    line: n.line,
	    column: n.column
	  } : null;
	}

	var se = function (e, t) {
	  var n = b("SyntaxReferenceError", e + (t ? " `" + t + "`" : ""));
	  return n.reference = t, n;
	},
	    le = function (e, t, n, r) {
	  var a = b("SyntaxMatchError", e),
	      i = function (e) {
	    for (var t = e.tokens, n = e.longestMatch, r = n < t.length ? t[n].node : null, a = -1, i = 0, o = "", s = 0; s < t.length; s++) s === n && (a = o.length), null !== r && t[s].node === r && (s <= n ? i++ : i = 0), o += t[s].value;

	    return {
	      node: r,
	      css: o,
	      mismatchOffset: -1 === a ? o.length : a,
	      last: null === r || i > 1
	    };
	  }(r),
	      o = i.mismatchOffset || 0,
	      s = i.node || n,
	      l = oe(s, "end"),
	      c = i.last ? l : oe(s, "start"),
	      u = i.css;

	  return a.rawMessage = e, a.syntax = t ? ie(t) : "<generic>", a.css = u, a.mismatchOffset = o, a.loc = {
	    source: s && s.loc && s.loc.source || "<unknown>",
	    start: c,
	    end: l
	  }, a.line = c ? c.line : void 0, a.column = c ? c.column : void 0, a.offset = c ? c.offset : void 0, a.message = e + "\n  syntax: " + a.syntax + "\n   value: " + (a.css || "<empty string>") + "\n  --------" + new window.Array(a.mismatchOffset + 1).join("-") + "^", a;
	},
	    ce = window.Object.prototype.hasOwnProperty,
	    ue = window.Object.create(null),
	    he = window.Object.create(null);

	function de(e, t) {
	  return t = t || 0, e.length - t >= 2 && 45 === e.charCodeAt(t) && 45 === e.charCodeAt(t + 1);
	}

	function pe(e, t) {
	  if (t = t || 0, e.length - t >= 3 && 45 === e.charCodeAt(t) && 45 !== e.charCodeAt(t + 1)) {
	    var n = e.indexOf("-", t + 2);
	    if (-1 !== n) return e.substring(t, n + 1);
	  }

	  return "";
	}

	var fe = {
	  keyword: function (e) {
	    if (ce.call(ue, e)) return ue[e];
	    var t = e.toLowerCase();
	    if (ce.call(ue, t)) return ue[e] = ue[t];
	    var n = de(t, 0),
	        r = n ? "" : pe(t, 0);
	    return ue[e] = window.Object.freeze({
	      basename: t.substr(r.length),
	      name: t,
	      vendor: r,
	      prefix: r,
	      custom: n
	    });
	  },
	  property: function (e) {
	    if (ce.call(he, e)) return he[e];
	    var t = e,
	        n = e[0];
	    "/" === n ? n = "/" === e[1] ? "//" : "/" : "_" !== n && "*" !== n && "$" !== n && "#" !== n && "+" !== n && "&" !== n && (n = "");
	    var r = de(t, n.length);
	    if (!r && (t = t.toLowerCase(), ce.call(he, t))) return he[e] = he[t];
	    var a = r ? "" : pe(t, n.length),
	        i = t.substr(0, n.length + a.length);
	    return he[e] = window.Object.freeze({
	      basename: t.substr(i.length),
	      name: t.substr(n.length),
	      hack: n,
	      vendor: a,
	      prefix: i,
	      custom: r
	    });
	  },
	  isCustomProperty: de,
	  vendorPrefix: pe
	},
	    me = "undefined" != typeof Uint32Array ? Uint32Array : window.Array,
	    ge = function (e, t) {
	  return null === e || e.length < t ? new me(Math.max(t + 1024, 16384)) : e;
	},
	    be = x.TYPE,
	    ye = B.isNewline,
	    ke = B.isName,
	    ve = B.isValidEscape,
	    we = B.isNumberStart,
	    xe = B.isIdentifierStart,
	    _e = B.charCodeCategory,
	    Se = B.isBOM,
	    Ce = $.cmpStr,
	    ze = $.getNewlineLength,
	    Ae = $.findWhiteSpaceEnd,
	    Te = $.consumeEscaped,
	    Ee = $.consumeName,
	    Pe = $.consumeNumber,
	    Le = $.consumeBadUrlRemnants;

	function Oe(e, t) {
	  function n(t) {
	    return t < o ? e.charCodeAt(t) : 0;
	  }

	  function r() {
	    return h = Pe(e, h), xe(n(h), n(h + 1), n(h + 2)) ? (g = be.Dimension, void (h = Ee(e, h))) : 37 === n(h) ? (g = be.Percentage, void h++) : void (g = be.Number);
	  }

	  function a() {
	    const t = h;
	    return h = Ee(e, h), Ce(e, t, h, "url") && 40 === n(h) ? 34 === n(h = Ae(e, h + 1)) || 39 === n(h) ? (g = be.Function, void (h = t + 4)) : void function () {
	      for (g = be.Url, h = Ae(e, h); h < e.length; h++) {
	        var t = e.charCodeAt(h);

	        switch (_e(t)) {
	          case 41:
	            return void h++;

	          case _e.Eof:
	            return;

	          case _e.WhiteSpace:
	            return 41 === n(h = Ae(e, h)) || h >= e.length ? void (h < e.length && h++) : (h = Le(e, h), void (g = be.BadUrl));

	          case 34:
	          case 39:
	          case 40:
	          case _e.NonPrintable:
	            return h = Le(e, h), void (g = be.BadUrl);

	          case 92:
	            if (ve(t, n(h + 1))) {
	              h = Te(e, h) - 1;
	              break;
	            }

	            return h = Le(e, h), void (g = be.BadUrl);
	        }
	      }
	    }() : 40 === n(h) ? (g = be.Function, void h++) : void (g = be.Ident);
	  }

	  function i(t) {
	    for (t || (t = n(h++)), g = be.String; h < e.length; h++) {
	      var r = e.charCodeAt(h);

	      switch (_e(r)) {
	        case t:
	          return void h++;

	        case _e.Eof:
	          return;

	        case _e.WhiteSpace:
	          if (ye(r)) return h += ze(e, h, r), void (g = be.BadString);
	          break;

	        case 92:
	          if (h === e.length - 1) break;
	          var a = n(h + 1);
	          ye(a) ? h += ze(e, h + 1, a) : ve(r, a) && (h = Te(e, h) - 1);
	      }
	    }
	  }

	  t || (t = new ne());

	  for (var o = (e = String(e || "")).length, s = ge(t.offsetAndType, o + 1), l = ge(t.balance, o + 1), c = 0, u = Se(n(0)), h = u, d = 0, p = 0, f = 0; h < o;) {
	    var m = e.charCodeAt(h),
	        g = 0;

	    switch (l[c] = o, _e(m)) {
	      case _e.WhiteSpace:
	        g = be.WhiteSpace, h = Ae(e, h + 1);
	        break;

	      case 34:
	        i();
	        break;

	      case 35:
	        ke(n(h + 1)) || ve(n(h + 1), n(h + 2)) ? (g = be.Hash, h = Ee(e, h + 1)) : (g = be.Delim, h++);
	        break;

	      case 39:
	        i();
	        break;

	      case 40:
	        g = be.LeftParenthesis, h++;
	        break;

	      case 41:
	        g = be.RightParenthesis, h++;
	        break;

	      case 43:
	        we(m, n(h + 1), n(h + 2)) ? r() : (g = be.Delim, h++);
	        break;

	      case 44:
	        g = be.Comma, h++;
	        break;

	      case 45:
	        we(m, n(h + 1), n(h + 2)) ? r() : 45 === n(h + 1) && 62 === n(h + 2) ? (g = be.CDC, h += 3) : xe(m, n(h + 1), n(h + 2)) ? a() : (g = be.Delim, h++);
	        break;

	      case 46:
	        we(m, n(h + 1), n(h + 2)) ? r() : (g = be.Delim, h++);
	        break;

	      case 47:
	        42 === n(h + 1) ? (g = be.Comment, 1 === (h = e.indexOf("*/", h + 2) + 2) && (h = e.length)) : (g = be.Delim, h++);
	        break;

	      case 58:
	        g = be.Colon, h++;
	        break;

	      case 59:
	        g = be.Semicolon, h++;
	        break;

	      case 60:
	        33 === n(h + 1) && 45 === n(h + 2) && 45 === n(h + 3) ? (g = be.CDO, h += 4) : (g = be.Delim, h++);
	        break;

	      case 64:
	        xe(n(h + 1), n(h + 2), n(h + 3)) ? (g = be.AtKeyword, h = Ee(e, h + 1)) : (g = be.Delim, h++);
	        break;

	      case 91:
	        g = be.LeftSquareBracket, h++;
	        break;

	      case 92:
	        ve(m, n(h + 1)) ? a() : (g = be.Delim, h++);
	        break;

	      case 93:
	        g = be.RightSquareBracket, h++;
	        break;

	      case 123:
	        g = be.LeftCurlyBracket, h++;
	        break;

	      case 125:
	        g = be.RightCurlyBracket, h++;
	        break;

	      case _e.Digit:
	        r();
	        break;

	      case _e.NameStart:
	        a();
	        break;

	      case _e.Eof:
	        break;

	      default:
	        g = be.Delim, h++;
	    }

	    switch (g) {
	      case d:
	        for (d = (p = l[f = 16777215 & p]) >> 24, l[c] = f, l[f++] = c; f < c; f++) l[f] === o && (l[f] = c);

	        break;

	      case be.LeftParenthesis:
	      case be.Function:
	        l[c] = p, p = (d = be.RightParenthesis) << 24 | c;
	        break;

	      case be.LeftSquareBracket:
	        l[c] = p, p = (d = be.RightSquareBracket) << 24 | c;
	        break;

	      case be.LeftCurlyBracket:
	        l[c] = p, p = (d = be.RightCurlyBracket) << 24 | c;
	    }

	    s[c++] = g << 24 | h;
	  }

	  for (s[c] = be.EOF << 24 | h, l[c] = o, l[o] = o; 0 !== p;) p = l[f = 16777215 & p], l[f] = o;

	  return t.source = e, t.firstCharOffset = u, t.offsetAndType = s, t.tokenCount = c, t.balance = l, t.reset(), t.next(), t;
	}

	Object.keys(x).forEach(function (e) {
	  Oe[e] = x[e];
	}), window.Object.keys(B).forEach(function (e) {
	  Oe[e] = B[e];
	}), window.Object.keys($).forEach(function (e) {
	  Oe[e] = $[e];
	});
	var De = Oe,
	    Re = De.isDigit,
	    Ne = De.cmpChar,
	    Be = De.TYPE,
	    Ie = Be.Delim,
	    Me = Be.WhiteSpace,
	    je = Be.Comment,
	    Fe = Be.Ident,
	    Ue = Be.Number,
	    qe = Be.Dimension;

	function We(e, t) {
	  return null !== e && e.type === Ie && e.value.charCodeAt(0) === t;
	}

	function Ye(e, t, n) {
	  for (; null !== e && (e.type === Me || e.type === je);) e = n(++t);

	  return t;
	}

	function He(e, t, n, r) {
	  if (!e) return 0;
	  var a = e.value.charCodeAt(t);

	  if (43 === a || 45 === a) {
	    if (n) return 0;
	    t++;
	  }

	  for (; t < e.value.length; t++) if (!Re(e.value.charCodeAt(t))) return 0;

	  return r + 1;
	}

	function Ze(e, t, n) {
	  var r = !1,
	      a = Ye(e, t, n);
	  if (null === (e = n(a))) return t;

	  if (e.type !== Ue) {
	    if (!We(e, 43) && !We(e, 45)) return t;
	    if (r = !0, a = Ye(n(++a), a, n), null === (e = n(a)) && e.type !== Ue) return 0;
	  }

	  if (!r) {
	    var i = e.value.charCodeAt(0);
	    if (43 !== i && 45 !== i) return 0;
	  }

	  return He(e, r ? 0 : 1, r, a);
	}

	var Ve = De.isHexDigit,
	    $e = De.cmpChar,
	    Ke = De.TYPE,
	    Ge = Ke.Ident,
	    Xe = Ke.Delim,
	    Qe = Ke.Number,
	    Je = Ke.Dimension;

	function et(e, t) {
	  return null !== e && e.type === Xe && e.value.charCodeAt(0) === t;
	}

	function tt(e, t) {
	  return e.value.charCodeAt(0) === t;
	}

	function nt(e, t, n) {
	  for (var r = t, a = 0; r < e.value.length; r++) {
	    var i = e.value.charCodeAt(r);
	    if (45 === i && n && 0 !== a) return nt(e, t + a + 1, !1) > 0 ? 6 : 0;
	    if (!Ve(i)) return 0;
	    if (++a > 6) return 0;
	  }

	  return a;
	}

	function rt(e, t, n) {
	  if (!e) return 0;

	  for (; et(n(t), 63);) {
	    if (++e > 6) return 0;
	    t++;
	  }

	  return t;
	}

	var at = De.isIdentifierStart,
	    it = De.isHexDigit,
	    ot = De.isDigit,
	    st = De.cmpStr,
	    lt = De.consumeNumber,
	    ct = De.TYPE,
	    ut = ["unset", "initial", "inherit"],
	    ht = ["calc(", "-moz-calc(", "-webkit-calc("];

	function dt(e, t) {
	  return t < e.length ? e.charCodeAt(t) : 0;
	}

	function pt(e, t) {
	  return st(e, 0, e.length, t);
	}

	function ft(e, t) {
	  for (var n = 0; n < t.length; n++) if (pt(e, t[n])) return !0;

	  return !1;
	}

	function mt(e, t) {
	  return t === e.length - 2 && 92 === e.charCodeAt(t) && ot(e.charCodeAt(t + 1));
	}

	function gt(e, t, n) {
	  if (e && "Range" === e.type) {
	    var r = Number(void 0 !== n && n !== t.length ? t.substr(0, n) : t);
	    if (isNaN(r)) return !0;
	    if (null !== e.min && r < e.min) return !0;
	    if (null !== e.max && r > e.max) return !0;
	  }

	  return !1;
	}

	function bt(e, t) {
	  var n = e.index,
	      r = 0;

	  do {
	    if (r++, e.balance <= n) break;
	  } while (e = t(r));

	  return r;
	}

	function yt(e) {
	  return function (t, n, r) {
	    return null === t ? 0 : t.type === ct.Function && ft(t.value, ht) ? bt(t, n) : e(t, n, r);
	  };
	}

	function kt(e) {
	  return function (t) {
	    return null === t || t.type !== e ? 0 : 1;
	  };
	}

	function vt(e) {
	  return function (t, n, r) {
	    if (null === t || t.type !== ct.Dimension) return 0;
	    var a = lt(t.value, 0);

	    if (null !== e) {
	      var i = t.value.indexOf("\\", a),
	          o = -1 !== i && mt(t.value, i) ? t.value.substring(a, i) : t.value.substr(a);
	      if (!1 === e.hasOwnProperty(o.toLowerCase())) return 0;
	    }

	    return gt(r, t.value, a) ? 0 : 1;
	  };
	}

	function wt(e) {
	  return "function" != typeof e && (e = function () {
	    return 0;
	  }), function (t, n, r) {
	    return null !== t && t.type === ct.Number && 0 === Number(t.value) ? 1 : e(t, n, r);
	  };
	}

	var xt,
	    _t = {
	  "ident-token": kt(ct.Ident),
	  "function-token": kt(ct.Function),
	  "at-keyword-token": kt(ct.AtKeyword),
	  "hash-token": kt(ct.Hash),
	  "string-token": kt(ct.String),
	  "bad-string-token": kt(ct.BadString),
	  "url-token": kt(ct.Url),
	  "bad-url-token": kt(ct.BadUrl),
	  "delim-token": kt(ct.Delim),
	  "number-token": kt(ct.Number),
	  "percentage-token": kt(ct.Percentage),
	  "dimension-token": kt(ct.Dimension),
	  "whitespace-token": kt(ct.WhiteSpace),
	  "CDO-token": kt(ct.CDO),
	  "CDC-token": kt(ct.CDC),
	  "colon-token": kt(ct.Colon),
	  "semicolon-token": kt(ct.Semicolon),
	  "comma-token": kt(ct.Comma),
	  "[-token": kt(ct.LeftSquareBracket),
	  "]-token": kt(ct.RightSquareBracket),
	  "(-token": kt(ct.LeftParenthesis),
	  ")-token": kt(ct.RightParenthesis),
	  "{-token": kt(ct.LeftCurlyBracket),
	  "}-token": kt(ct.RightCurlyBracket),
	  string: kt(ct.String),
	  ident: kt(ct.Ident),
	  "custom-ident": function (e) {
	    if (null === e || e.type !== ct.Ident) return 0;
	    var t = e.value.toLowerCase();
	    return ft(t, ut) || pt(t, "default") ? 0 : 1;
	  },
	  "custom-property-name": function (e) {
	    return null === e || e.type !== ct.Ident || 45 !== dt(e.value, 0) || 45 !== dt(e.value, 1) ? 0 : 1;
	  },
	  "hex-color": function (e) {
	    if (null === e || e.type !== ct.Hash) return 0;
	    var t = e.value.length;
	    if (4 !== t && 5 !== t && 7 !== t && 9 !== t) return 0;

	    for (var n = 1; n < t; n++) if (!it(e.value.charCodeAt(n))) return 0;

	    return 1;
	  },
	  "id-selector": function (e) {
	    return null === e || e.type !== ct.Hash ? 0 : at(dt(e.value, 1), dt(e.value, 2), dt(e.value, 3)) ? 1 : 0;
	  },
	  "an-plus-b": function (e, t) {
	    var n = 0;
	    if (!e) return 0;
	    if (e.type === Ue) return He(e, 0, !1, n);

	    if (e.type === Fe && 45 === e.value.charCodeAt(0)) {
	      if (!Ne(e.value, 1, 110)) return 0;

	      switch (e.value.length) {
	        case 2:
	          return Ze(t(++n), n, t);

	        case 3:
	          return 45 !== e.value.charCodeAt(2) ? 0 : (n = Ye(t(++n), n, t), He(e = t(n), 0, !0, n));

	        default:
	          return 45 !== e.value.charCodeAt(2) ? 0 : He(e, 3, !0, n);
	      }
	    } else if (e.type === Fe || We(e, 43) && t(n + 1).type === Fe) {
	      if (e.type !== Fe && (e = t(++n)), null === e || !Ne(e.value, 0, 110)) return 0;

	      switch (e.value.length) {
	        case 1:
	          return Ze(t(++n), n, t);

	        case 2:
	          return 45 !== e.value.charCodeAt(1) ? 0 : (n = Ye(t(++n), n, t), He(e = t(n), 0, !0, n));

	        default:
	          return 45 !== e.value.charCodeAt(1) ? 0 : He(e, 2, !0, n);
	      }
	    } else if (e.type === qe) {
	      for (var r = e.value.charCodeAt(0), a = 43 === r || 45 === r ? 1 : 0, i = a; i < e.value.length && Re(e.value.charCodeAt(i)); i++);

	      return i === a ? 0 : Ne(e.value, i, 110) ? i + 1 === e.value.length ? Ze(t(++n), n, t) : 45 !== e.value.charCodeAt(i + 1) ? 0 : i + 2 === e.value.length ? (n = Ye(t(++n), n, t), He(e = t(n), 0, !0, n)) : He(e, i + 2, !0, n) : 0;
	    }

	    return 0;
	  },
	  urange: function (e, t) {
	    var n = 0;
	    if (null === e || e.type !== Ge || !$e(e.value, 0, 117)) return 0;
	    if (null === (e = t(++n))) return 0;
	    if (et(e, 43)) return null === (e = t(++n)) ? 0 : e.type === Ge ? rt(nt(e, 0, !0), ++n, t) : et(e, 63) ? rt(1, ++n, t) : 0;

	    if (e.type === Qe) {
	      if (!tt(e, 43)) return 0;
	      var r = nt(e, 1, !0);
	      return 0 === r ? 0 : null === (e = t(++n)) ? n : e.type === Je || e.type === Qe ? tt(e, 45) && nt(e, 1, !1) ? n + 1 : 0 : rt(r, n, t);
	    }

	    return e.type === Je && tt(e, 43) ? rt(nt(e, 1, !0), ++n, t) : 0;
	  },
	  "declaration-value": function (e, t) {
	    if (!e) return 0;
	    var n = 0,
	        r = 0,
	        a = e.index;

	    e: do {
	      switch (e.type) {
	        case ct.BadString:
	        case ct.BadUrl:
	          break e;

	        case ct.RightCurlyBracket:
	        case ct.RightParenthesis:
	        case ct.RightSquareBracket:
	          if (e.balance > e.index || e.balance < a) break e;
	          r--;
	          break;

	        case ct.Semicolon:
	          if (0 === r) break e;
	          break;

	        case ct.Delim:
	          if ("!" === e.value && 0 === r) break e;
	          break;

	        case ct.Function:
	        case ct.LeftParenthesis:
	        case ct.LeftSquareBracket:
	        case ct.LeftCurlyBracket:
	          r++;
	      }

	      if (n++, e.balance <= a) break;
	    } while (e = t(n));

	    return n;
	  },
	  "any-value": function (e, t) {
	    if (!e) return 0;
	    var n = e.index,
	        r = 0;

	    e: do {
	      switch (e.type) {
	        case ct.BadString:
	        case ct.BadUrl:
	          break e;

	        case ct.RightCurlyBracket:
	        case ct.RightParenthesis:
	        case ct.RightSquareBracket:
	          if (e.balance > e.index || e.balance < n) break e;
	      }

	      if (r++, e.balance <= n) break;
	    } while (e = t(r));

	    return r;
	  },
	  dimension: yt(vt(null)),
	  angle: yt(vt({
	    deg: !0,
	    grad: !0,
	    rad: !0,
	    turn: !0
	  })),
	  decibel: yt(vt({
	    db: !0
	  })),
	  frequency: yt(vt({
	    hz: !0,
	    khz: !0
	  })),
	  flex: yt(vt({
	    fr: !0
	  })),
	  length: yt(wt(vt({
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
	  resolution: yt(vt({
	    dpi: !0,
	    dpcm: !0,
	    dppx: !0,
	    x: !0
	  })),
	  semitones: yt(vt({
	    st: !0
	  })),
	  time: yt(vt({
	    s: !0,
	    ms: !0
	  })),
	  percentage: yt(function (e, t, n) {
	    return null === e || e.type !== ct.Percentage || gt(n, e.value, e.value.length - 1) ? 0 : 1;
	  }),
	  zero: wt(),
	  number: yt(function (e, t, n) {
	    if (null === e) return 0;
	    var r = lt(e.value, 0);
	    return r === e.value.length || mt(e.value, r) ? gt(n, e.value, r) ? 0 : 1 : 0;
	  }),
	  integer: yt(function (e, t, n) {
	    if (null === e || e.type !== ct.Number) return 0;

	    for (var r = 43 === e.value.charCodeAt(0) || 45 === e.value.charCodeAt(0) ? 1 : 0; r < e.value.length; r++) if (!ot(e.value.charCodeAt(r))) return 0;

	    return gt(n, e.value, r) ? 0 : 1;
	  }),
	  "-ms-legacy-expression": (xt = "expression", xt += "(", function (e, t) {
	    return null !== e && pt(e.value, xt) ? bt(e, t) : 0;
	  })
	},
	    St = function (e, t, n) {
	  var r = b("SyntaxError", e);
	  return r.input = t, r.offset = n, r.rawMessage = e, r.message = r.rawMessage + "\n  " + r.input + "\n--" + new window.Array((r.offset || r.input.length) + 1).join("-") + "^", r;
	},
	    Ct = function (e) {
	  this.str = e, this.pos = 0;
	};

	Ct.prototype = {
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
	    throw new St(e, this.str, this.pos);
	  }
	};

	var zt = Ct,
	    At = function (e) {
	  for (var t = "function" == typeof Uint32Array ? new Uint32Array(128) : new window.Array(128), n = 0; n < 128; n++) t[n] = e(String.fromCharCode(n)) ? 1 : 0;

	  return t;
	}(function (e) {
	  return /[a-zA-Z0-9\-]/.test(e);
	}),
	    Tt = {
	  " ": 1,
	  "&&": 2,
	  "||": 3,
	  "|": 4
	};

	function Et(e) {
	  return e.substringToPos(e.findWsEnd(e.pos));
	}

	function Pt(e) {
	  for (var t = e.pos; t < e.str.length; t++) {
	    var n = e.str.charCodeAt(t);
	    if (n >= 128 || 0 === At[n]) break;
	  }

	  return e.pos === t && e.error("Expect a keyword"), e.substringToPos(t);
	}

	function Lt(e) {
	  for (var t = e.pos; t < e.str.length; t++) {
	    var n = e.str.charCodeAt(t);
	    if (n < 48 || n > 57) break;
	  }

	  return e.pos === t && e.error("Expect a number"), e.substringToPos(t);
	}

	function Ot(e) {
	  var t = e.str.indexOf("'", e.pos + 1);
	  return -1 === t && (e.pos = e.str.length, e.error("Expect an apostrophe")), e.substringToPos(t + 1);
	}

	function Dt(e) {
	  var t,
	      n = null;
	  return e.eat(123), t = Lt(e), 44 === e.charCode() ? (e.pos++, 125 !== e.charCode() && (n = Lt(e))) : n = t, e.eat(125), {
	    min: Number(t),
	    max: n ? Number(n) : 0
	  };
	}

	function Rt(e, t) {
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
	        e.pos++, n = !0, t = 123 === e.charCode() ? Dt(e) : {
	          min: 1,
	          max: 0
	        };
	        break;

	      case 123:
	        t = Dt(e);
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

	function Nt(e) {
	  var t = e.peek();
	  return "" === t ? null : {
	    type: "Token",
	    value: t
	  };
	}

	function Bt(e) {
	  var t,
	      n = null;
	  return e.eat(60), t = Pt(e), 40 === e.charCode() && 41 === e.nextCharCode() && (e.pos += 2, t += "()"), 91 === e.charCodeAt(e.findWsEnd(e.pos)) && (Et(e), n = function (e) {
	    var t = null,
	        n = null,
	        r = 1;
	    return e.eat(91), 45 === e.charCode() && (e.peek(), r = -1), -1 == r && 8734 === e.charCode() ? e.peek() : t = r * Number(Lt(e)), Et(e), e.eat(44), Et(e), 8734 === e.charCode() ? e.peek() : (r = 1, 45 === e.charCode() && (e.peek(), r = -1), n = r * Number(Lt(e))), e.eat(93), null === t && null === n ? null : {
	      type: "Range",
	      min: t,
	      max: n
	    };
	  }(e)), e.eat(62), Rt(e, {
	    type: "Type",
	    name: t,
	    opts: n
	  });
	}

	function It(e, t) {
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
	    return Tt[e] - Tt[t];
	  }); t.length > 0;) {
	    for (var r = t.shift(), a = 0, i = 0; a < e.length; a++) {
	      var o = e[a];
	      "Combinator" === o.type && (o.value === r ? (-1 === i && (i = a - 1), e.splice(a, 1), a--) : (-1 !== i && a - i > 1 && (e.splice(i, a - i, n(e.slice(i, a), r)), a = i + 1), i = -1));
	    }

	    -1 !== i && t.length && e.splice(i, a - i, n(e.slice(i, a), r));
	  }

	  return r;
	}

	function Mt(e) {
	  for (var t, n = [], r = {}, a = null, i = e.pos; t = jt(e);) "Spaces" !== t.type && ("Combinator" === t.type ? (null !== a && "Combinator" !== a.type || (e.pos = i, e.error("Unexpected combinator")), r[t.value] = !0) : null !== a && "Combinator" !== a.type && (r[" "] = !0, n.push({
	    type: "Combinator",
	    value: " "
	  })), n.push(t), a = t, i = e.pos);

	  return null !== a && "Combinator" === a.type && (e.pos -= i, e.error("Unexpected combinator")), {
	    type: "Group",
	    terms: n,
	    combinator: It(n, r) || " ",
	    disallowEmpty: !1,
	    explicit: !1
	  };
	}

	function jt(e) {
	  var t = e.charCode();
	  if (t < 128 && 1 === At[t]) return function (e) {
	    var t;
	    return t = Pt(e), 40 === e.charCode() ? (e.pos++, {
	      type: "Function",
	      name: t
	    }) : Rt(e, {
	      type: "Keyword",
	      name: t
	    });
	  }(e);

	  switch (t) {
	    case 93:
	      break;

	    case 91:
	      return Rt(e, function (e) {
	        var t;
	        return e.eat(91), t = Mt(e), e.eat(93), t.explicit = !0, 33 === e.charCode() && (e.pos++, t.disallowEmpty = !0), t;
	      }(e));

	    case 60:
	      return 39 === e.nextCharCode() ? function (e) {
	        var t;
	        return e.eat(60), e.eat(39), t = Pt(e), e.eat(39), e.eat(62), Rt(e, {
	          type: "Property",
	          name: t
	        });
	      }(e) : Bt(e);

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
	      return Rt(e, {
	        type: "String",
	        value: Ot(e)
	      });

	    case 32:
	    case 9:
	    case 10:
	    case 13:
	    case 12:
	      return {
	        type: "Spaces",
	        value: Et(e)
	      };

	    case 64:
	      return (t = e.nextCharCode()) < 128 && 1 === At[t] ? (e.pos++, {
	        type: "AtKeyword",
	        name: Pt(e)
	      }) : Nt(e);

	    case 42:
	    case 43:
	    case 63:
	    case 35:
	    case 33:
	      break;

	    case 123:
	      if ((t = e.nextCharCode()) < 48 || t > 57) return Nt(e);
	      break;

	    default:
	      return Nt(e);
	  }
	}

	function Ft(e) {
	  var t = new zt(e),
	      n = Mt(t);
	  return t.pos !== e.length && t.error("Unexpected input"), 1 === n.terms.length && "Group" === n.terms[0].type && (n = n.terms[0]), n;
	}

	Ft("[a&&<b>#|<'c'>*||e() f{2} /,(% g#{1,2} h{2,})]!");

	var Ut = Ft,
	    qt = function () {};

	function Wt(e) {
	  return "function" == typeof e ? e : qt;
	}

	var Yt = function (e, t, n) {
	  var r = qt,
	      a = qt;
	  if ("function" == typeof t ? r = t : t && (r = Wt(t.enter), a = Wt(t.leave)), r === qt && a === qt) throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
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

	    a.call(n, t);
	  }(e);
	},
	    Ht = new ne(),
	    Zt = {
	  decorator: function (e) {
	    var t = null,
	        n = {
	      len: 0,
	      node: null
	    },
	        r = [n],
	        a = "";
	    return {
	      children: e.children,
	      node: function (n) {
	        var r = t;
	        t = n, e.node.call(this, n), t = r;
	      },
	      chunk: function (e) {
	        a += e, n.node !== t ? r.push({
	          len: e.length,
	          node: t
	        }) : n.len += e.length;
	      },
	      result: function () {
	        return Vt(a, r);
	      }
	    };
	  }
	};

	function Vt(e, t) {
	  var n = [],
	      r = 0,
	      a = 0,
	      i = t ? t[a].node : null;

	  for (De(e, Ht); !Ht.eof;) {
	    if (t) for (; a < t.length && r + t[a].len <= Ht.tokenStart;) r += t[a++].len, i = t[a].node;
	    n.push({
	      type: Ht.tokenType,
	      value: Ht.getTokenValue(),
	      index: Ht.tokenIndex,
	      balance: Ht.balance[Ht.tokenIndex],
	      node: i
	    }), Ht.next();
	  }

	  return n;
	}

	var $t = {
	  type: "Match"
	},
	    Kt = {
	  type: "Mismatch"
	},
	    Gt = {
	  type: "DisallowEmpty"
	};

	function Xt(e, t, n) {
	  return t === $t && n === Kt || e === $t && t === $t && n === $t ? e : ("If" === e.type && e.else === Kt && t === $t && (t = e.then, e = e.match), {
	    type: "If",
	    match: e,
	    then: t,
	    else: n
	  });
	}

	function Qt(e) {
	  return e.length > 2 && 40 === e.charCodeAt(e.length - 2) && 41 === e.charCodeAt(e.length - 1);
	}

	function Jt(e) {
	  return "Keyword" === e.type || "AtKeyword" === e.type || "Function" === e.type || "Type" === e.type && Qt(e.name);
	}

	function en(e) {
	  if ("function" == typeof e) return {
	    type: "Generic",
	    fn: e
	  };

	  switch (e.type) {
	    case "Group":
	      var t = function e(t, n, r) {
	        switch (t) {
	          case " ":
	            for (var a = $t, i = n.length - 1; i >= 0; i--) {
	              a = Xt(l = n[i], a, Kt);
	            }

	            return a;

	          case "|":
	            a = Kt;
	            var o = null;

	            for (i = n.length - 1; i >= 0; i--) {
	              if (Jt(l = n[i]) && (null === o && i > 0 && Jt(n[i - 1]) && (a = Xt({
	                type: "Enum",
	                map: o = window.Object.create(null)
	              }, $t, a)), null !== o)) {
	                var s = (Qt(l.name) ? l.name.slice(0, -1) : l.name).toLowerCase();

	                if (s in o == !1) {
	                  o[s] = l;
	                  continue;
	                }
	              }

	              o = null, a = Xt(l, $t, a);
	            }

	            return a;

	          case "&&":
	            if (n.length > 5) return {
	              type: "MatchOnce",
	              terms: n,
	              all: !0
	            };

	            for (a = Kt, i = n.length - 1; i >= 0; i--) {
	              var l = n[i];
	              c = n.length > 1 ? e(t, n.filter(function (e) {
	                return e !== l;
	              }), !1) : $t, a = Xt(l, c, a);
	            }

	            return a;

	          case "||":
	            if (n.length > 5) return {
	              type: "MatchOnce",
	              terms: n,
	              all: !1
	            };

	            for (a = r ? $t : Kt, i = n.length - 1; i >= 0; i--) {
	              var c;
	              l = n[i];
	              c = n.length > 1 ? e(t, n.filter(function (e) {
	                return e !== l;
	              }), !0) : $t, a = Xt(l, c, a);
	            }

	            return a;
	        }
	      }(e.combinator, e.terms.map(en), !1);

	      return e.disallowEmpty && (t = Xt(t, Gt, Kt)), t;

	    case "Multiplier":
	      return function (e) {
	        var t = $t,
	            n = en(e.term);
	        if (0 === e.max) n = Xt(n, Gt, Kt), (t = Xt(n, null, Kt)).then = Xt($t, $t, t), e.comma && (t.then.else = Xt({
	          type: "Comma",
	          syntax: e
	        }, t, Kt));else for (var r = e.min || 1; r <= e.max; r++) e.comma && t !== $t && (t = Xt({
	          type: "Comma",
	          syntax: e
	        }, t, Kt)), t = Xt(n, Xt($t, $t, t), Kt);
	        if (0 === e.min) t = Xt($t, $t, t);else for (r = 0; r < e.min - 1; r++) e.comma && t !== $t && (t = Xt({
	          type: "Comma",
	          syntax: e
	        }, t, Kt)), t = Xt(n, t, Kt);
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

	var tn = $t,
	    nn = Kt,
	    rn = Gt,
	    an = function (e, t) {
	  return "string" == typeof e && (e = Ut(e)), {
	    type: "MatchGraph",
	    match: en(e),
	    syntax: t || null,
	    source: e
	  };
	},
	    on = window.Object.prototype.hasOwnProperty,
	    sn = tn,
	    ln = nn,
	    cn = rn,
	    un = x.TYPE;

	function hn(e) {
	  for (var t = null, n = null, r = e; null !== r;) n = r.prev, r.prev = t, t = r, r = n;

	  return t;
	}

	function dn(e, t) {
	  if (e.length !== t.length) return !1;

	  for (var n = 0; n < e.length; n++) {
	    var r = e.charCodeAt(n);
	    if (r >= 65 && r <= 90 && (r |= 32), r !== t.charCodeAt(n)) return !1;
	  }

	  return !0;
	}

	function pn(e) {
	  return null === e || e.type === un.Comma || e.type === un.Function || e.type === un.LeftParenthesis || e.type === un.LeftSquareBracket || e.type === un.LeftCurlyBracket || e.type === un.Delim;
	}

	function fn(e) {
	  return null === e || e.type === un.RightParenthesis || e.type === un.RightSquareBracket || e.type === un.RightCurlyBracket || e.type === un.Delim;
	}

	function mn(e, t, n) {
	  function r() {
	    do {
	      b++, g = b < e.length ? e[b] : null;
	    } while (null !== g && (g.type === un.WhiteSpace || g.type === un.Comment));
	  }

	  function a(t) {
	    var n = b + t;
	    return n < e.length ? e[n] : null;
	  }

	  function i(e, t) {
	    return {
	      nextState: e,
	      matchStack: k,
	      syntaxStack: u,
	      thenStack: h,
	      tokenIndex: b,
	      prev: t
	    };
	  }

	  function o(e) {
	    h = {
	      nextState: e,
	      matchStack: k,
	      syntaxStack: u,
	      prev: h
	    };
	  }

	  function s(e) {
	    d = i(e, d);
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
	      f = 0,
	      m = null,
	      g = null,
	      b = -1,
	      y = 0,
	      k = {
	    type: 0,
	    syntax: null,
	    token: null,
	    prev: null
	  };

	  for (r(); null === m && ++f < 15e3;) switch (t.type) {
	    case "Match":
	      if (null === h) {
	        if (null !== g && (b !== e.length - 1 || "\\0" !== g.value && "\\9" !== g.value)) {
	          t = ln;
	          break;
	        }

	        m = "Match";
	        break;
	      }

	      if ((t = h.nextState) === cn) {
	        if (h.matchStack === k) {
	          t = ln;
	          break;
	        }

	        t = sn;
	      }

	      for (; h.syntaxStack !== u;) c();

	      h = h.prev;
	      break;

	    case "Mismatch":
	      if (null !== p && !1 !== p) (null === d || b > d.tokenIndex) && (d = p, p = !1);else if (null === d) {
	        m = "Mismatch";
	        break;
	      }
	      t = d.nextState, h = d.thenStack, u = d.syntaxStack, k = d.matchStack, b = d.tokenIndex, g = b < e.length ? e[b] : null, d = d.prev;
	      break;

	    case "MatchGraph":
	      t = t.match;
	      break;

	    case "If":
	      t.else !== ln && s(t.else), t.then !== sn && o(t.then), t = t.match;
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
	          t = ln;
	          break;
	        }

	        t = sn;
	        break;
	      }

	      if (t.mask === (1 << v.length) - 1) {
	        t = sn;
	        break;
	      }

	      for (; t.index < v.length; t.index++) {
	        var w = 1 << t.index;

	        if (0 == (t.mask & w)) {
	          s(t), o({
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
	      if (null !== g) if (-1 !== (z = g.value.toLowerCase()).indexOf("\\") && (z = z.replace(/\\[09].*$/, "")), on.call(t.map, z)) {
	        t = t.map[z];
	        break;
	      }
	      t = ln;
	      break;

	    case "Generic":
	      var x = null !== u ? u.opts : null,
	          _ = b + Math.floor(t.fn(g, a, x));

	      if (!isNaN(_) && _ > b) {
	        for (; b < _;) l();

	        t = sn;
	      } else t = ln;

	      break;

	    case "Type":
	    case "Property":
	      var S = "Type" === t.type ? "types" : "properties",
	          C = on.call(n, S) ? n[S][t.name] : null;
	      if (!C || !C.match) throw new Error("Bad syntax reference: " + ("Type" === t.type ? "<" + t.name + ">" : "<'" + t.name + "'>"));
	      if (!1 !== p && null !== g && "Type" === t.type) if ("custom-ident" === t.name && g.type === un.Ident || "length" === t.name && "0" === g.value) {
	        null === p && (p = i(t, d)), t = ln;
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
	      }, t = C.match;
	      break;

	    case "Keyword":
	      var z = t.name;

	      if (null !== g) {
	        var A = g.value;

	        if (-1 !== A.indexOf("\\") && (A = A.replace(/\\[09].*$/, "")), dn(A, z)) {
	          l(), t = sn;
	          break;
	        }
	      }

	      t = ln;
	      break;

	    case "AtKeyword":
	    case "Function":
	      if (null !== g && dn(g.value, t.name)) {
	        l(), t = sn;
	        break;
	      }

	      t = ln;
	      break;

	    case "Token":
	      if (null !== g && g.value === t.value) {
	        l(), t = sn;
	        break;
	      }

	      t = ln;
	      break;

	    case "Comma":
	      null !== g && g.type === un.Comma ? pn(k.token) ? t = ln : (l(), t = fn(g) ? ln : sn) : t = pn(k.token) || fn(g) ? sn : ln;
	      break;

	    case "String":
	      var T = "";

	      for (_ = b; _ < e.length && T.length < t.value.length; _++) T += e[_].value;

	      if (dn(T, t.value)) {
	        for (; b < _;) l();

	        t = sn;
	      } else t = ln;

	      break;

	    default:
	      throw new Error("Unknown node type: " + t.type);
	  }

	  switch (m) {
	    case null:
	      console.warn("[csstree-match] BREAK after 15000 iterations"), m = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)", k = null;
	      break;

	    case "Match":
	      for (; null !== u;) c();

	      break;

	    default:
	      k = null;
	  }

	  return {
	    tokens: e,
	    reason: m,
	    iterations: f,
	    match: k,
	    longestMatch: y
	  };
	}

	var gn = function (e, t, n) {
	  var r = mn(e, t, n || {});
	  if (null === r.match) return r;
	  var a = r.match,
	      i = r.match = {
	    syntax: t.syntax || null,
	    match: []
	  },
	      o = [i];

	  for (a = hn(a).prev; null !== a;) {
	    switch (a.type) {
	      case 2:
	        i.match.push(i = {
	          syntax: a.syntax,
	          match: []
	        }), o.push(i);
	        break;

	      case 3:
	        o.pop(), i = o[o.length - 1];
	        break;

	      default:
	        i.match.push({
	          syntax: a.syntax || null,
	          token: a.token.value,
	          node: a.token.node
	        });
	    }

	    a = a.prev;
	  }

	  return r;
	};

	function bn(e) {
	  function t(e) {
	    return null !== e && ("Type" === e.type || "Property" === e.type || "Keyword" === e.type);
	  }

	  var n = null;
	  return null !== this.matched && function r(a) {
	    if (window.Array.isArray(a.match)) {
	      for (var i = 0; i < a.match.length; i++) if (r(a.match[i])) return t(a.syntax) && n.unshift(a.syntax), !0;
	    } else if (a.node === e) return n = t(a.syntax) ? [a.syntax] : [], !0;

	    return !1;
	  }(this.matched), n;
	}

	function yn(e, t, n) {
	  var r = bn.call(e, t);
	  return null !== r && r.some(n);
	}

	var kn = {
	  getTrace: bn,
	  isType: function (e, t) {
	    return yn(this, e, function (e) {
	      return "Type" === e.type && e.name === t;
	    });
	  },
	  isProperty: function (e, t) {
	    return yn(this, e, function (e) {
	      return "Property" === e.type && e.name === t;
	    });
	  },
	  isKeyword: function (e) {
	    return yn(this, e, function (e) {
	      return "Keyword" === e.type;
	    });
	  }
	};
	var vn = {
	  matchFragments: function (e, t, n, r, a) {
	    var i = [];
	    return null !== n.matched && function n(o) {
	      if (null !== o.syntax && o.syntax.type === r && o.syntax.name === a) {
	        var s = function e(t) {
	          return "node" in t ? t.node : e(t.match[0]);
	        }(o),
	            l = function e(t) {
	          return "node" in t ? t.node : e(t.match[t.match.length - 1]);
	        }(o);

	        e.syntax.walk(t, function (e, t, n) {
	          if (e === s) {
	            var r = new g();

	            do {
	              if (r.appendData(t.data), t.data === l) break;
	              t = t.next;
	            } while (null !== t);

	            i.push({
	              parent: n,
	              nodes: r
	            });
	          }
	        });
	      }

	      window.Array.isArray(o.match) && o.match.forEach(n);
	    }(n.matched), i;
	  }
	},
	    wn = window.Object.prototype.hasOwnProperty;

	function xn(e) {
	  return "number" == typeof e && isFinite(e) && Math.floor(e) === e && e >= 0;
	}

	function _n(e) {
	  return Boolean(e) && xn(e.offset) && xn(e.line) && xn(e.column);
	}

	function Sn(e, t) {
	  return function (n, r) {
	    if (!n || n.constructor !== window.Object) return r(n, "Type of node should be an window.Object");

	    for (var a in n) {
	      var i = !0;

	      if (!1 !== wn.call(n, a)) {
	        if ("type" === a) n.type !== e && r(n, "Wrong node type `" + n.type + "`, expected `" + e + "`");else if ("loc" === a) {
	          if (null === n.loc) continue;
	          if (n.loc && n.loc.constructor === window.Object) if ("string" != typeof n.loc.source) a += ".source";else if (_n(n.loc.start)) {
	            if (_n(n.loc.end)) continue;
	            a += ".end";
	          } else a += ".start";
	          i = !1;
	        } else if (t.hasOwnProperty(a)) {
	          var o = 0;

	          for (i = !1; !i && o < t[a].length; o++) {
	            var s = t[a][o];

	            switch (s) {
	              case String:
	                i = "string" == typeof n[a];
	                break;

	              case Boolean:
	                i = "boolean" == typeof n[a];
	                break;

	              case null:
	                i = null === n[a];
	                break;

	              default:
	                "string" == typeof s ? i = n[a] && n[a].type === s : window.Array.isArray(s) && (i = n[a] instanceof g);
	            }
	          }
	        } else r(n, "Unknown field `" + a + "` for " + e + " node type");
	        i || r(n, "Bad value for `" + e + "." + a + "`");
	      }
	    }

	    for (var a in t) wn.call(t, a) && !1 === wn.call(n, a) && r(n, "Field `" + e + "." + a + "` is missed");
	  };
	}

	function Cn(e, t) {
	  var n = t.structure,
	      r = {
	    type: String,
	    loc: !0
	  },
	      a = {
	    type: '"' + e + '"'
	  };

	  for (var i in n) if (!1 !== wn.call(n, i)) {
	    for (var o = [], s = r[i] = window.Array.isArray(n[i]) ? n[i].slice() : [n[i]], l = 0; l < s.length; l++) {
	      var c = s[l];
	      if (c === String || c === Boolean) o.push(c.name);else if (null === c) o.push("null");else if ("string" == typeof c) o.push("<" + c + ">");else {
	        if (!Array.isArray(c)) throw new Error("Wrong value `" + c + "` in `" + e + "." + i + "` structure definition");
	        o.push("List");
	      }
	    }

	    a[i] = o.join(" | ");
	  }

	  return {
	    docs: a,
	    check: Sn(e, r)
	  };
	}

	var zn = se,
	    An = le,
	    Tn = an,
	    En = gn,
	    Pn = function (e) {
	  var t = {};
	  if (e.node) for (var n in e.node) if (wn.call(e.node, n)) {
	    var r = e.node[n];
	    if (!r.structure) throw new Error("Missed `structure` field in `" + n + "` node type definition");
	    t[n] = Cn(n, r);
	  }
	  return t;
	},
	    Ln = Tn("inherit | initial | unset"),
	    On = Tn("inherit | initial | unset | <-ms-legacy-expression>");

	function Dn(e, t, n) {
	  var r = {};

	  for (var a in e) e[a].syntax && (r[a] = n ? e[a].syntax : ie(e[a].syntax, {
	    compact: t
	  }));

	  return r;
	}

	function Rn(e, t, n) {
	  return {
	    matched: e,
	    iterations: n,
	    error: t,
	    getTrace: kn.getTrace,
	    isType: kn.isType,
	    isProperty: kn.isProperty,
	    isKeyword: kn.isKeyword
	  };
	}

	function Nn(e, t, n, r) {
	  var a,
	      i = function (e, t) {
	    return "string" == typeof e ? Vt(e, null) : t.generate(e, Zt);
	  }(n, e.syntax);

	  return function (e) {
	    for (var t = 0; t < e.length; t++) if ("var(" === e[t].value.toLowerCase()) return !0;

	    return !1;
	  }(i) ? Rn(null, new Error("Matching for a tree with var() is not supported")) : (r && (a = En(i, e.valueCommonSyntax, e)), r && a.match || (a = En(i, t.match, e)).match ? Rn(a.match, null, a.iterations) : Rn(null, new An(a.reason, t.syntax, n, a), a.iterations));
	}

	var Bn = function (e, t, n) {
	  if (this.valueCommonSyntax = Ln, this.syntax = t, this.generic = !1, this.atrules = {}, this.properties = {}, this.types = {}, this.structure = n || Pn(e), e) {
	    if (e.types) for (var r in e.types) this.addType_(r, e.types[r]);
	    if (e.generic) for (var r in this.generic = !0, _t) this.addType_(r, _t[r]);
	    if (e.atrules) for (var r in e.atrules) this.addAtrule_(r, e.atrules[r]);
	    if (e.properties) for (var r in e.properties) this.addProperty_(r, e.properties[r]);
	  }
	};

	Bn.prototype = {
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
	        a = {
	      type: t,
	      name: n,
	      syntax: null,
	      match: null
	    };
	    return "function" == typeof e ? a.match = Tn(e, r) : ("string" == typeof e ? window.Object.defineProperty(a, "syntax", {
	      get: function () {
	        return window.Object.defineProperty(a, "syntax", {
	          value: Ut(e)
	        }), a.syntax;
	      }
	    }) : a.syntax = e, window.Object.defineProperty(a, "match", {
	      get: function () {
	        return window.Object.defineProperty(a, "match", {
	          value: Tn(a.syntax, r)
	        }), a.match;
	      }
	    })), a;
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
	    this.types[e] = this.createDescriptor(t, "Type", e), t === _t["-ms-legacy-expression"] && (this.valueCommonSyntax = On);
	  },
	  matchAtrulePrelude: function (e, t) {
	    var n = fe.keyword(e),
	        r = n.vendor ? this.getAtrulePrelude(n.name) || this.getAtrulePrelude(n.basename) : this.getAtrulePrelude(n.name);
	    return r ? Nn(this, r, t, !0) : n.basename in this.atrules ? Rn(null, new Error("At-rule `" + e + "` should not contain a prelude")) : Rn(null, new zn("Unknown at-rule", e));
	  },
	  matchAtruleDescriptor: function (e, t, n) {
	    var r = fe.keyword(e),
	        a = fe.keyword(t),
	        i = r.vendor ? this.atrules[r.name] || this.atrules[r.basename] : this.atrules[r.name];
	    if (!i) return Rn(null, new zn("Unknown at-rule", e));
	    if (!i.descriptors) return Rn(null, new Error("At-rule `" + e + "` has no known descriptors"));
	    var o = a.vendor ? i.descriptors[a.name] || i.descriptors[a.basename] : i.descriptors[a.name];
	    return o ? Nn(this, o, n, !0) : Rn(null, new zn("Unknown at-rule descriptor", t));
	  },
	  matchDeclaration: function (e) {
	    return "Declaration" !== e.type ? Rn(null, new Error("Not a Declaration node")) : this.matchProperty(e.property, e.value);
	  },
	  matchProperty: function (e, t) {
	    var n = fe.property(e);
	    if (n.custom) return Rn(null, new Error("Lexer matching doesn't applicable for custom properties"));
	    var r = n.vendor ? this.getProperty(n.name) || this.getProperty(n.basename) : this.getProperty(n.name);
	    return r ? Nn(this, r, t, !0) : Rn(null, new zn("Unknown property", e));
	  },
	  matchType: function (e, t) {
	    var n = this.getType(e);
	    return n ? Nn(this, n, t, !1) : Rn(null, new zn("Unknown type", e));
	  },
	  match: function (e, t) {
	    return "string" == typeof e || e && e.type ? ("string" != typeof e && e.match || (e = this.createDescriptor(e, "Type", "anonymous")), Nn(this, e, t, !1)) : Rn(null, new zn("Bad syntax"));
	  },
	  findValueFragments: function (e, t, n, r) {
	    return vn.matchFragments(this, t, this.matchProperty(e, t), n, r);
	  },
	  findDeclarationValueFragments: function (e, t, n) {
	    return vn.matchFragments(this, e.value, this.matchDeclaration(e), t, n);
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
	    function e(r, a, i, o) {
	      if (i.hasOwnProperty(a)) return i[a];
	      i[a] = !1, null !== o.syntax && Yt(o.syntax, function (o) {
	        if ("Type" === o.type || "Property" === o.type) {
	          var s = "Type" === o.type ? r.types : r.properties,
	              l = "Type" === o.type ? t : n;
	          s.hasOwnProperty(o.name) && !e(r, o.name, l, s[o.name]) || (i[a] = !0);
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
	      types: Dn(this.types, !t, e),
	      properties: Dn(this.properties, !t, e)
	    };
	  },
	  toString: function () {
	    return JSON.stringify(this.dump());
	  }
	};
	var In = Bn,
	    Mn = {
	  SyntaxError: St,
	  parse: Ut,
	  generate: ie,
	  walk: Yt
	},
	    jn = De.isBOM;

	var Fn = function () {
	  this.lines = null, this.columns = null, this.linesAndColumnsComputed = !1;
	};

	Fn.prototype = {
	  setSource: function (e, t, n, r) {
	    this.source = e, this.startOffset = void 0 === t ? 0 : t, this.startLine = void 0 === n ? 1 : n, this.startColumn = void 0 === r ? 1 : r, this.linesAndColumnsComputed = !1;
	  },
	  ensureLinesAndColumnsComputed: function () {
	    this.linesAndColumnsComputed || (!function (e, t) {
	      for (var n = t.length, r = ge(e.lines, n), a = e.startLine, i = ge(e.columns, n), o = e.startColumn, s = t.length > 0 ? jn(t.charCodeAt(0)) : 0; s < n; s++) {
	        var l = t.charCodeAt(s);
	        r[s] = a, i[s] = o++, 10 !== l && 13 !== l && 12 !== l || (13 === l && s + 1 < n && 10 === t.charCodeAt(s + 1) && (r[++s] = a, i[s] = o), a++, o = 1);
	      }

	      r[s] = a, i[s] = o, e.lines = r, e.columns = i;
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

	var Un = Fn,
	    qn = De.TYPE,
	    Wn = qn.WhiteSpace,
	    Yn = qn.Comment,
	    Hn = function (e) {
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
	      case Yn:
	        this.scanner.next();
	        continue;

	      case Wn:
	        r.ignoreWS ? this.scanner.next() : r.space = this.WhiteSpace();
	        continue;
	    }

	    if (void 0 === (n = e.getNode.call(this, r))) break;
	    null !== r.space && (t.push(r.space), r.space = null), t.push(n), r.ignoreWSAfter ? (r.ignoreWSAfter = !1, r.ignoreWS = !0) : r.ignoreWS = !1;
	  }

	  return t;
	},
	    Zn = $.findWhiteSpaceStart,
	    Vn = function () {},
	    $n = x.TYPE,
	    Kn = x.NAME,
	    Gn = $n.WhiteSpace,
	    Xn = $n.Ident,
	    Qn = $n.Function,
	    Jn = $n.Url,
	    er = $n.Hash,
	    tr = $n.Percentage,
	    nr = $n.Number;

	function rr(e) {
	  return function () {
	    return this[e]();
	  };
	}

	var ar = function (e) {
	  var t = {
	    scanner: new ne(),
	    locationMap: new Un(),
	    filename: "<unknown>",
	    needPositions: !1,
	    onParseError: Vn,
	    onParseErrorThrow: !1,
	    parseAtrulePrelude: !0,
	    parseRulePrelude: !0,
	    parseValue: !0,
	    parseCustomProperty: !1,
	    readSequence: Hn,
	    createList: function () {
	      return new g();
	    },
	    createSingleNodeList: function (e) {
	      return new g().appendData(e);
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
	        if (t !== Gn) return t;
	      } while (0 !== t);

	      return 0;
	    },
	    eat: function (e) {
	      if (this.scanner.tokenType !== e) {
	        var t = this.scanner.tokenStart,
	            n = Kn[e] + " is expected";

	        switch (e) {
	          case Xn:
	            this.scanner.tokenType === Qn || this.scanner.tokenType === Jn ? (t = this.scanner.tokenEnd - 1, n = "Identifier is expected but function found") : n = "Identifier is expected";
	            break;

	          case er:
	            this.scanner.isDelim(35) && (this.scanner.next(), t++, n = "Name is expected");
	            break;

	          case tr:
	            this.scanner.tokenType === nr && (t = this.scanner.tokenEnd, n = "Percent sign is expected");
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
	      return this.eat(Qn), e;
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
	      var n = void 0 !== t && t < this.scanner.source.length ? this.locationMap.getLocation(t) : this.scanner.eof ? this.locationMap.getLocation(Zn(this.scanner.source, this.scanner.source.length - 1)) : this.locationMap.getLocation(this.scanner.tokenStart);
	      throw new k(e || "Unexpected input", this.scanner.source, n.offset, n.line, n.column);
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
	        t.context[n] = rr(e.parseContext[n]);
	    }
	    if (e.scope) for (var n in e.scope) t.scope[n] = e.scope[n];
	    if (e.atrule) for (var n in e.atrule) {
	      var r = e.atrule[n];
	      r.parse && (t.atrule[n] = r.parse);
	    }
	    if (e.pseudo) for (var n in e.pseudo) {
	      var a = e.pseudo[n];
	      a.parse && (t.pseudo[n] = a.parse);
	    }
	    if (e.node) for (var n in e.node) t[n] = e.node[n].parse;
	    return t;
	  }(e || {})) t[n] = e[n];

	  return function (e, n) {
	    var r,
	        a = (n = n || {}).context || "default";
	    if (De(e, t.scanner), t.locationMap.setSource(e, n.offset, n.line, n.column), t.filename = n.filename || "<unknown>", t.needPositions = Boolean(n.positions), t.onParseError = "function" == typeof n.onParseError ? n.onParseError : Vn, t.onParseErrorThrow = !1, t.parseAtrulePrelude = !("parseAtrulePrelude" in n) || Boolean(n.parseAtrulePrelude), t.parseRulePrelude = !("parseRulePrelude" in n) || Boolean(n.parseRulePrelude), t.parseValue = !("parseValue" in n) || Boolean(n.parseValue), t.parseCustomProperty = "parseCustomProperty" in n && Boolean(n.parseCustomProperty), !t.context.hasOwnProperty(a)) throw new Error("Unknown context `" + a + "`");
	    return r = t.context[a].call(t, n), t.scanner.eof || t.error(), r;
	  };
	},
	    ir = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
	    or = function (e) {
	  if (0 <= e && e < ir.length) return ir[e];
	  throw new TypeError("Must be between 0 and 63: " + e);
	};

	var sr = function (e) {
	  var t,
	      n = "",
	      r = function (e) {
	    return e < 0 ? 1 + (-e << 1) : 0 + (e << 1);
	  }(e);

	  do {
	    t = 31 & r, (r >>>= 5) > 0 && (t |= 32), n += or(t);
	  } while (r > 0);

	  return n;
	};

	function lr(e, t) {
	  return e(t = {
	    exports: {}
	  }, t.exports), t.exports;
	}

	var cr = lr(function (e, t) {
	  t.getArg = function (e, t, n) {
	    if (t in e) return e[t];
	    if (3 === arguments.length) return n;
	    throw new Error('"' + t + '" is a required argument.');
	  };

	  var n = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,
	      r = /^data:.+\,.+$/;

	  function a(e) {
	    var t = e.match(n);
	    return t ? {
	      scheme: t[1],
	      auth: t[2],
	      host: t[3],
	      port: t[4],
	      path: t[5]
	    } : null;
	  }

	  function i(e) {
	    var t = "";
	    return e.scheme && (t += e.scheme + ":"), t += "//", e.auth && (t += e.auth + "@"), e.host && (t += e.host), e.port && (t += ":" + e.port), e.path && (t += e.path), t;
	  }

	  function o(e) {
	    var n = e,
	        r = a(e);

	    if (r) {
	      if (!r.path) return e;
	      n = r.path;
	    }

	    for (var o, s = t.isAbsolute(n), l = n.split(/\/+/), c = 0, u = l.length - 1; u >= 0; u--) "." === (o = l[u]) ? l.splice(u, 1) : ".." === o ? c++ : c > 0 && ("" === o ? (l.splice(u + 1, c), c = 0) : (l.splice(u, 2), c--));

	    return "" === (n = l.join("/")) && (n = s ? "/" : "."), r ? (r.path = n, i(r)) : n;
	  }

	  function s(e, t) {
	    "" === e && (e = "."), "" === t && (t = ".");
	    var n = a(t),
	        s = a(e);
	    if (s && (e = s.path || "/"), n && !n.scheme) return s && (n.scheme = s.scheme), i(n);
	    if (n || t.match(r)) return t;
	    if (s && !s.host && !s.path) return s.host = t, i(s);
	    var l = "/" === t.charAt(0) ? t : o(e.replace(/\/+$/, "") + "/" + t);
	    return s ? (s.path = l, i(s)) : l;
	  }

	  t.urlParse = a, t.urlGenerate = i, t.normalize = o, t.join = s, t.isAbsolute = function (e) {
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
	      var r = a(n);
	      if (!r) throw new Error("sourceMapURL could not be parsed");

	      if (r.path) {
	        var l = r.path.lastIndexOf("/");
	        l >= 0 && (r.path = r.path.substring(0, l + 1));
	      }

	      t = s(i(r), t);
	    }

	    return o(t);
	  };
	}),
	    ur = (cr.getArg, cr.urlParse, cr.urlGenerate, cr.normalize, cr.join, cr.isAbsolute, cr.relative, cr.toSetString, cr.fromSetString, cr.compareByOriginalPositions, cr.compareByGeneratedPositionsDeflated, cr.compareByGeneratedPositionsInflated, cr.parseSourceMapInput, cr.computeSourceURL, window.Object.prototype.hasOwnProperty),
	    hr = "undefined" != typeof window.Map;

	function dr() {
	  this._array = [], this._set = hr ? new window.Map() : window.Object.create(null);
	}

	dr.fromArray = function (e, t) {
	  for (var n = new dr(), r = 0, a = e.length; r < a; r++) n.add(e[r], t);

	  return n;
	}, dr.prototype.size = function () {
	  return hr ? this._set.size : window.Object.getOwnPropertyNames(this._set).length;
	}, dr.prototype.add = function (e, t) {
	  var n = hr ? e : cr.toSetString(e),
	      r = hr ? this.has(e) : ur.call(this._set, n),
	      a = this._array.length;
	  r && !t || this._array.push(e), r || (hr ? this._set.set(e, a) : this._set[n] = a);
	}, dr.prototype.has = function (e) {
	  if (hr) return this._set.has(e);
	  var t = cr.toSetString(e);
	  return ur.call(this._set, t);
	}, dr.prototype.indexOf = function (e) {
	  if (hr) {
	    var t = this._set.get(e);

	    if (t >= 0) return t;
	  } else {
	    var n = cr.toSetString(e);
	    if (ur.call(this._set, n)) return this._set[n];
	  }

	  throw new Error('"' + e + '" is not in the set.');
	}, dr.prototype.at = function (e) {
	  if (e >= 0 && e < this._array.length) return this._array[e];
	  throw new Error("No element indexed by " + e);
	}, dr.prototype.toArray = function () {
	  return this._array.slice();
	};
	var pr = {
	  ArraySet: dr
	};

	function fr() {
	  this._array = [], this._sorted = !0, this._last = {
	    generatedLine: -1,
	    generatedColumn: 0
	  };
	}

	fr.prototype.unsortedForEach = function (e, t) {
	  this._array.forEach(e, t);
	}, fr.prototype.add = function (e) {
	  var t, n, r, a, i, o;
	  t = this._last, n = e, r = t.generatedLine, a = n.generatedLine, i = t.generatedColumn, o = n.generatedColumn, a > r || a == r && o >= i || cr.compareByGeneratedPositionsInflated(t, n) <= 0 ? (this._last = e, this._array.push(e)) : (this._sorted = !1, this._array.push(e));
	}, fr.prototype.toArray = function () {
	  return this._sorted || (this._array.sort(cr.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
	};
	var mr = pr.ArraySet,
	    gr = {
	  MappingList: fr
	}.MappingList;

	function br(e) {
	  e || (e = {}), this._file = cr.getArg(e, "file", null), this._sourceRoot = cr.getArg(e, "sourceRoot", null), this._skipValidation = cr.getArg(e, "skipValidation", !1), this._sources = new mr(), this._names = new mr(), this._mappings = new gr(), this._sourcesContents = null;
	}

	br.prototype._version = 3, br.fromSourceMap = function (e) {
	  var t = e.sourceRoot,
	      n = new br({
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
	    null != e.source && (r.source = e.source, null != t && (r.source = cr.relative(t, r.source)), r.original = {
	      line: e.originalLine,
	      column: e.originalColumn
	    }, null != e.name && (r.name = e.name)), n.addMapping(r);
	  }), e.sources.forEach(function (r) {
	    var a = r;
	    null !== t && (a = cr.relative(t, r)), n._sources.has(a) || n._sources.add(a);
	    var i = e.sourceContentFor(r);
	    null != i && n.setSourceContent(r, i);
	  }), n;
	}, br.prototype.addMapping = function (e) {
	  var t = cr.getArg(e, "generated"),
	      n = cr.getArg(e, "original", null),
	      r = cr.getArg(e, "source", null),
	      a = cr.getArg(e, "name", null);
	  this._skipValidation || this._validateMapping(t, n, r, a), null != r && (r = String(r), this._sources.has(r) || this._sources.add(r)), null != a && (a = String(a), this._names.has(a) || this._names.add(a)), this._mappings.add({
	    generatedLine: t.line,
	    generatedColumn: t.column,
	    originalLine: null != n && n.line,
	    originalColumn: null != n && n.column,
	    source: r,
	    name: a
	  });
	}, br.prototype.setSourceContent = function (e, t) {
	  var n = e;
	  null != this._sourceRoot && (n = cr.relative(this._sourceRoot, n)), null != t ? (this._sourcesContents || (this._sourcesContents = window.Object.create(null)), this._sourcesContents[cr.toSetString(n)] = t) : this._sourcesContents && (delete this._sourcesContents[cr.toSetString(n)], 0 === window.Object.keys(this._sourcesContents).length && (this._sourcesContents = null));
	}, br.prototype.applySourceMap = function (e, t, n) {
	  var r = t;

	  if (null == t) {
	    if (null == e.file) throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.');
	    r = e.file;
	  }

	  var a = this._sourceRoot;
	  null != a && (r = cr.relative(a, r));
	  var i = new mr(),
	      o = new mr();
	  this._mappings.unsortedForEach(function (t) {
	    if (t.source === r && null != t.originalLine) {
	      var s = e.originalPositionFor({
	        line: t.originalLine,
	        column: t.originalColumn
	      });
	      null != s.source && (t.source = s.source, null != n && (t.source = cr.join(n, t.source)), null != a && (t.source = cr.relative(a, t.source)), t.originalLine = s.line, t.originalColumn = s.column, null != s.name && (t.name = s.name));
	    }

	    var l = t.source;
	    null == l || i.has(l) || i.add(l);
	    var c = t.name;
	    null == c || o.has(c) || o.add(c);
	  }, this), this._sources = i, this._names = o, e.sources.forEach(function (t) {
	    var r = e.sourceContentFor(t);
	    null != r && (null != n && (t = cr.join(n, t)), null != a && (t = cr.relative(a, t)), this.setSourceContent(t, r));
	  }, this);
	}, br.prototype._validateMapping = function (e, t, n, r) {
	  if (t && "number" != typeof t.line && "number" != typeof t.column) throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
	  if ((!(e && "line" in e && "column" in e && e.line > 0 && e.column >= 0) || t || n || r) && !(e && "line" in e && "column" in e && t && "line" in t && "column" in t && e.line > 0 && e.column >= 0 && t.line > 0 && t.column >= 0 && n)) throw new Error("Invalid mapping: " + JSON.stringify({
	    generated: e,
	    source: n,
	    original: t,
	    name: r
	  }));
	}, br.prototype._serializeMappings = function () {
	  for (var e, t, n, r, a = 0, i = 1, o = 0, s = 0, l = 0, c = 0, u = "", h = this._mappings.toArray(), d = 0, p = h.length; d < p; d++) {
	    if (e = "", (t = h[d]).generatedLine !== i) for (a = 0; t.generatedLine !== i;) e += ";", i++;else if (d > 0) {
	      if (!cr.compareByGeneratedPositionsInflated(t, h[d - 1])) continue;
	      e += ",";
	    }
	    e += sr(t.generatedColumn - a), a = t.generatedColumn, null != t.source && (r = this._sources.indexOf(t.source), e += sr(r - c), c = r, e += sr(t.originalLine - 1 - s), s = t.originalLine - 1, e += sr(t.originalColumn - o), o = t.originalColumn, null != t.name && (n = this._names.indexOf(t.name), e += sr(n - l), l = n)), u += e;
	  }

	  return u;
	}, br.prototype._generateSourcesContent = function (e, t) {
	  return e.map(function (e) {
	    if (!this._sourcesContents) return null;
	    null != t && (e = cr.relative(t, e));
	    var n = cr.toSetString(e);
	    return window.Object.prototype.hasOwnProperty.call(this._sourcesContents, n) ? this._sourcesContents[n] : null;
	  }, this);
	}, br.prototype.toJSON = function () {
	  var e = {
	    version: this._version,
	    sources: this._sources.toArray(),
	    names: this._names.toArray(),
	    mappings: this._serializeMappings()
	  };
	  return null != this._file && (e.file = this._file), null != this._sourceRoot && (e.sourceRoot = this._sourceRoot), this._sourcesContents && (e.sourcesContent = this._generateSourcesContent(e.sources, e.sourceRoot)), e;
	}, br.prototype.toString = function () {
	  return JSON.stringify(this.toJSON());
	};
	var yr = {
	  SourceMapGenerator: br
	}.SourceMapGenerator,
	    kr = {
	  Atrule: !0,
	  Selector: !0,
	  Declaration: !0
	},
	    vr = window.Object.prototype.hasOwnProperty;

	function wr(e, t) {
	  var n = e.children,
	      r = null;
	  "function" != typeof t ? n.forEach(this.node, this) : n.forEach(function (e) {
	    null !== r && t.call(this, r), this.node(e), r = e;
	  }, this);
	}

	var xr = function (e) {
	  function t(e) {
	    if (!vr.call(n, e.type)) throw new Error("Unknown node type: " + e.type);
	    n[e.type].call(this, e);
	  }

	  var n = {};
	  if (e.node) for (var r in e.node) n[r] = e.node[r].generate;
	  return function (e, n) {
	    var r = "",
	        a = {
	      children: wr,
	      node: t,
	      chunk: function (e) {
	        r += e;
	      },
	      result: function () {
	        return r;
	      }
	    };
	    return n && ("function" == typeof n.decorator && (a = n.decorator(a)), n.sourceMap && (a = function (e) {
	      var t = new yr(),
	          n = 1,
	          r = 0,
	          a = {
	        line: 1,
	        column: 0
	      },
	          i = {
	        line: 0,
	        column: 0
	      },
	          o = !1,
	          s = {
	        line: 1,
	        column: 0
	      },
	          l = {
	        generated: s
	      },
	          c = e.node;

	      e.node = function (e) {
	        if (e.loc && e.loc.start && kr.hasOwnProperty(e.type)) {
	          var u = e.loc.start.line,
	              h = e.loc.start.column - 1;
	          i.line === u && i.column === h || (i.line = u, i.column = h, a.line = n, a.column = r, o && (o = !1, a.line === s.line && a.column === s.column || t.addMapping(l)), o = !0, t.addMapping({
	            source: e.loc.source,
	            original: i,
	            generated: a
	          }));
	        }

	        c.call(this, e), o && kr.hasOwnProperty(e.type) && (s.line = n, s.column = r);
	      };

	      var u = e.chunk;

	      e.chunk = function (e) {
	        for (var t = 0; t < e.length; t++) 10 === e.charCodeAt(t) ? (n++, r = 0) : r++;

	        u(e);
	      };

	      var h = e.result;
	      return e.result = function () {
	        return o && t.addMapping(l), {
	          css: h(),
	          map: t
	        };
	      }, e;
	    }(a))), a.node(e), a.result();
	  };
	},
	    _r = window.Object.prototype.hasOwnProperty,
	    Sr = function () {};

	function Cr(e) {
	  return "function" == typeof e ? e : Sr;
	}

	function zr(e, t) {
	  return function (n, r, a) {
	    n.type === t && e.call(this, n, r, a);
	  };
	}

	function Ar(e, t) {
	  var n = t.structure,
	      r = [];

	  for (var a in n) if (!1 !== _r.call(n, a)) {
	    var i = n[a],
	        o = {
	      name: a,
	      type: !1,
	      nullable: !1
	    };
	    window.Array.isArray(n[a]) || (i = [n[a]]);

	    for (var s = 0; s < i.length; s++) {
	      var l = i[s];
	      null === l ? o.nullable = !0 : "string" == typeof l ? o.type = "node" : window.Array.isArray(l) && (o.type = "list");
	    }

	    o.type && r.push(o);
	  }

	  return r.length ? {
	    context: t.walkContext,
	    fields: r
	  } : null;
	}

	function Tr(e, t) {
	  var n = e.fields.slice(),
	      r = e.context,
	      a = "string" == typeof r;
	  return t && n.reverse(), function (e, i, o) {
	    var s;
	    a && (s = i[r], i[r] = e);

	    for (var l = 0; l < n.length; l++) {
	      var c = n[l],
	          u = e[c.name];
	      c.nullable && !u || ("list" === c.type ? t ? u.forEachRight(o) : u.forEach(o) : o(u));
	    }

	    a && (i[r] = s);
	  };
	}

	function Er(e) {
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

	var Pr = function (e) {
	  var t = function (e) {
	    var t = {};

	    for (var n in e.node) if (_r.call(e.node, n)) {
	      var r = e.node[n];
	      if (!r.structure) throw new Error("Missed `structure` field in `" + n + "` node type definition");
	      t[n] = Ar(0, r);
	    }

	    return t;
	  }(e),
	      n = {},
	      r = {};

	  for (var a in t) _r.call(t, a) && null !== t[a] && (n[a] = Tr(t[a], !1), r[a] = Tr(t[a], !0));

	  var i = Er(n),
	      o = Er(r),
	      s = function (e, a) {
	    var s = Sr,
	        l = Sr,
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
	    if ("function" == typeof a) s = a;else if (a && (s = Cr(a.enter), l = Cr(a.leave), a.reverse && (c = r), a.visit)) {
	      if (i.hasOwnProperty(a.visit)) c = a.reverse ? o[a.visit] : i[a.visit];else if (!t.hasOwnProperty(a.visit)) throw new Error("Bad value `" + a.visit + "` for `visit` option (should be: " + window.Object.keys(t).join(", ") + ")");
	      s = zr(s, a.visit), l = zr(l, a.visit);
	    }
	    if (s === Sr && l === Sr) throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");

	    if (a.reverse) {
	      var h = s;
	      s = l, l = h;
	    }

	    !function e(t, n, r) {
	      s.call(u, t, n, r), c.hasOwnProperty(t.type) && c[t.type](t, u, e), l.call(u, t, n, r);
	    }(e);
	  };

	  return s.find = function (e, t) {
	    var n = null;
	    return s(e, function (e, r, a) {
	      null === n && t.call(this, e, r, a) && (n = e);
	    }), n;
	  }, s.findLast = function (e, t) {
	    var n = null;
	    return s(e, {
	      reverse: !0,
	      enter: function (e, r, a) {
	        null === n && t.call(this, e, r, a) && (n = e);
	      }
	    }), n;
	  }, s.findAll = function (e, t) {
	    var n = [];
	    return s(e, function (e, r, a) {
	      t.call(this, e, r, a) && n.push(e);
	    }), n;
	  }, s;
	},
	    Lr = function e(t) {
	  var n = {};

	  for (var r in t) {
	    var a = t[r];
	    a && (window.Array.isArray(a) || a instanceof g ? a = a.map(e) : a.constructor === window.Object && (a = e(a))), n[r] = a;
	  }

	  return n;
	},
	    Or = window.Object.prototype.hasOwnProperty,
	    Dr = {
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

	function Rr(e) {
	  return e && e.constructor === window.Object;
	}

	function Nr(e) {
	  return Rr(e) ? window.Object.assign({}, e) : e;
	}

	function Br(e, t) {
	  for (var n in t) Or.call(t, n) && (Rr(e[n]) ? Br(e[n], Nr(t[n])) : e[n] = Nr(t[n]));
	}

	var Ir = function (e, t) {
	  return function e(t, n, r) {
	    for (var a in r) if (!1 !== Or.call(r, a)) if (!0 === r[a]) a in n && Or.call(n, a) && (t[a] = Nr(n[a]));else if (r[a]) {
	      if (Rr(r[a])) Br(i = {}, t[a]), Br(i, n[a]), t[a] = i;else if (window.Array.isArray(r[a])) {
	        var i = {},
	            o = r[a].reduce(function (e, t) {
	          return e[t] = !0, e;
	        }, {});

	        for (var s in t[a]) Or.call(t[a], s) && (i[s] = {}, t[a] && t[a][s] && e(i[s], t[a][s], o));

	        for (var s in n[a]) Or.call(n[a], s) && (i[s] || (i[s] = {}), n[a] && n[a][s] && e(i[s], n[a][s], o));

	        t[a] = i;
	      }
	    }

	    return t;
	  }(e, t, Dr);
	};

	function Mr(e) {
	  var t = ar(e),
	      n = Pr(e),
	      r = xr(e),
	      a = function (e) {
	    return {
	      fromPlainObject: function (t) {
	        return e(t, {
	          enter: function (e) {
	            e.children && e.children instanceof g == !1 && (e.children = new g().fromArray(e.children));
	          }
	        }), t;
	      },
	      toPlainObject: function (t) {
	        return e(t, {
	          leave: function (e) {
	            e.children && e.children instanceof g && (e.children = e.children.toArray());
	          }
	        }), t;
	      }
	    };
	  }(n),
	      i = {
	    List: g,
	    SyntaxError: k,
	    TokenStream: ne,
	    Lexer: In,
	    vendorPrefix: fe.vendorPrefix,
	    keyword: fe.keyword,
	    property: fe.property,
	    isCustomProperty: fe.isCustomProperty,
	    definitionSyntax: Mn,
	    lexer: null,
	    createLexer: function (e) {
	      return new In(e, i, i.lexer.structure);
	    },
	    tokenize: De,
	    parse: t,
	    walk: n,
	    generate: r,
	    find: n.find,
	    findLast: n.findLast,
	    findAll: n.findAll,
	    clone: Lr,
	    fromPlainObject: a.fromPlainObject,
	    toPlainObject: a.toPlainObject,
	    createSyntax: function (e) {
	      return Mr(Ir({}, e));
	    },
	    fork: function (t) {
	      var n = Ir({}, e);
	      return Mr("function" == typeof t ? t(n, window.Object.assign) : Ir(n, t));
	    }
	  };

	  return i.lexer = new In({
	    generic: !0,
	    types: e.types,
	    atrules: e.atrules,
	    properties: e.properties,
	    node: e.node
	  }, i), i;
	}

	var jr = function (e) {
	  return Mr(Ir({}, e));
	},
	    Fr = {
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
	    Ur = {
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
	    qr = {
	  generic: !0,
	  types: Fr,
	  properties: Ur
	},
	    Wr = window.Object.freeze({
	  generic: !0,
	  types: Fr,
	  properties: Ur,
	  default: qr
	}),
	    Yr = De.cmpChar,
	    Hr = De.isDigit,
	    Zr = De.TYPE,
	    Vr = Zr.WhiteSpace,
	    $r = Zr.Comment,
	    Kr = Zr.Ident,
	    Gr = Zr.Number,
	    Xr = Zr.Dimension;

	function Qr(e, t) {
	  var n = this.scanner.tokenStart + e,
	      r = this.scanner.source.charCodeAt(n);

	  for (43 !== r && 45 !== r || (t && this.error("Number sign is not allowed"), n++); n < this.scanner.tokenEnd; n++) Hr(this.scanner.source.charCodeAt(n)) || this.error("Integer is expected", n);
	}

	function Jr(e) {
	  return Qr.call(this, 0, e);
	}

	function ea(e, t) {
	  if (!Yr(this.scanner.source, this.scanner.tokenStart + e, t)) {
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

	function ta() {
	  for (var e = 0, t = 0, n = this.scanner.tokenType; n === Vr || n === $r;) n = this.scanner.lookupType(++e);

	  if (n !== Gr) {
	    if (!this.scanner.isDelim(43, e) && !this.scanner.isDelim(45, e)) return null;
	    t = this.scanner.isDelim(43, e) ? 43 : 45;

	    do {
	      n = this.scanner.lookupType(++e);
	    } while (n === Vr || n === $r);

	    n !== Gr && (this.scanner.skip(e), Jr.call(this, !0));
	  }

	  return e > 0 && this.scanner.skip(e), 0 === t && 43 !== (n = this.scanner.source.charCodeAt(this.scanner.tokenStart)) && 45 !== n && this.error("Number sign is expected"), Jr.call(this, 0 !== t), 45 === t ? "-" + this.consume(Gr) : this.consume(Gr);
	}

	var na = {
	  name: "AnPlusB",
	  structure: {
	    a: [String, null],
	    b: [String, null]
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart,
	        t = null,
	        n = null;
	    if (this.scanner.tokenType === Gr) Jr.call(this, !1), n = this.consume(Gr);else if (this.scanner.tokenType === Kr && Yr(this.scanner.source, this.scanner.tokenStart, 45)) switch (t = "-1", ea.call(this, 1, 110), this.scanner.getTokenLength()) {
	      case 2:
	        this.scanner.next(), n = ta.call(this);
	        break;

	      case 3:
	        ea.call(this, 2, 45), this.scanner.next(), this.scanner.skipSC(), Jr.call(this, !0), n = "-" + this.consume(Gr);
	        break;

	      default:
	        ea.call(this, 2, 45), Qr.call(this, 3, !0), this.scanner.next(), n = this.scanner.substrToCursor(e + 2);
	    } else if (this.scanner.tokenType === Kr || this.scanner.isDelim(43) && this.scanner.lookupType(1) === Kr) {
	      var r = 0;

	      switch (t = "1", this.scanner.isDelim(43) && (r = 1, this.scanner.next()), ea.call(this, 0, 110), this.scanner.getTokenLength()) {
	        case 1:
	          this.scanner.next(), n = ta.call(this);
	          break;

	        case 2:
	          ea.call(this, 1, 45), this.scanner.next(), this.scanner.skipSC(), Jr.call(this, !0), n = "-" + this.consume(Gr);
	          break;

	        default:
	          ea.call(this, 1, 45), Qr.call(this, 2, !0), this.scanner.next(), n = this.scanner.substrToCursor(e + r + 1);
	      }
	    } else if (this.scanner.tokenType === Xr) {
	      for (var a = this.scanner.source.charCodeAt(this.scanner.tokenStart), i = (r = 43 === a || 45 === a, this.scanner.tokenStart + r); i < this.scanner.tokenEnd && Hr(this.scanner.source.charCodeAt(i)); i++);

	      i === this.scanner.tokenStart + r && this.error("Integer is expected", this.scanner.tokenStart + r), ea.call(this, i - this.scanner.tokenStart, 110), t = this.scanner.source.substring(e, i), i + 1 === this.scanner.tokenEnd ? (this.scanner.next(), n = ta.call(this)) : (ea.call(this, i - this.scanner.tokenStart + 1, 45), i + 2 === this.scanner.tokenEnd ? (this.scanner.next(), this.scanner.skipSC(), Jr.call(this, !0), n = "-" + this.consume(Gr)) : (Qr.call(this, i - this.scanner.tokenStart + 2, !0), this.scanner.next(), n = this.scanner.substrToCursor(i + 1)));
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
	    ra = De.TYPE,
	    aa = ra.WhiteSpace,
	    ia = ra.Semicolon,
	    oa = ra.LeftCurlyBracket,
	    sa = ra.Delim;

	function la() {
	  return this.scanner.tokenIndex > 0 && this.scanner.lookupType(-1) === aa ? this.scanner.tokenIndex > 1 ? this.scanner.getTokenStart(this.scanner.tokenIndex - 1) : this.scanner.firstCharOffset : this.scanner.tokenStart;
	}

	function ca() {
	  return 0;
	}

	var ua = {
	  name: "Raw",
	  structure: {
	    value: String
	  },
	  parse: function (e, t, n) {
	    var r,
	        a = this.scanner.getTokenStart(e);
	    return this.scanner.skip(this.scanner.getRawLength(e, t || ca)), r = n && this.scanner.tokenStart > a ? la.call(this) : this.scanner.tokenStart, {
	      type: "Raw",
	      loc: this.getLocation(a, r),
	      value: this.scanner.source.substring(a, r)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value);
	  },
	  mode: {
	    default: ca,
	    leftCurlyBracket: function (e) {
	      return e === oa ? 1 : 0;
	    },
	    leftCurlyBracketOrSemicolon: function (e) {
	      return e === oa || e === ia ? 1 : 0;
	    },
	    exclamationMarkOrSemicolon: function (e, t, n) {
	      return e === sa && 33 === t.charCodeAt(n) || e === ia ? 1 : 0;
	    },
	    semicolonIncluded: function (e) {
	      return e === ia ? 2 : 0;
	    }
	  }
	},
	    ha = De.TYPE,
	    da = ua.mode,
	    pa = ha.AtKeyword,
	    fa = ha.Semicolon,
	    ma = ha.LeftCurlyBracket,
	    ga = ha.RightCurlyBracket;

	function ba(e) {
	  return this.Raw(e, da.leftCurlyBracketOrSemicolon, !0);
	}

	function ya() {
	  for (var e, t = 1; e = this.scanner.lookupType(t); t++) {
	    if (e === ga) return !0;
	    if (e === ma || e === pa) return !1;
	  }

	  return !1;
	}

	var ka = {
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
	        a = null;

	    switch (this.eat(pa), t = (e = this.scanner.substrToCursor(n + 1)).toLowerCase(), this.scanner.skipSC(), !1 === this.scanner.eof && this.scanner.tokenType !== ma && this.scanner.tokenType !== fa && (this.parseAtrulePrelude ? "AtrulePrelude" === (r = this.parseWithFallback(this.AtrulePrelude.bind(this, e), ba)).type && null === r.children.head && (r = null) : r = ba.call(this, this.scanner.tokenIndex), this.scanner.skipSC()), this.scanner.tokenType) {
	      case fa:
	        this.scanner.next();
	        break;

	      case ma:
	        a = this.atrule.hasOwnProperty(t) && "function" == typeof this.atrule[t].block ? this.atrule[t].block.call(this) : this.Block(ya.call(this));
	    }

	    return {
	      type: "Atrule",
	      loc: this.getLocation(n, this.scanner.tokenStart),
	      name: e,
	      prelude: r,
	      block: a
	    };
	  },
	  generate: function (e) {
	    this.chunk("@"), this.chunk(e.name), null !== e.prelude && (this.chunk(" "), this.node(e.prelude)), e.block ? this.node(e.block) : this.chunk(";");
	  },
	  walkContext: "atrule"
	},
	    va = De.TYPE,
	    wa = va.Semicolon,
	    xa = va.LeftCurlyBracket,
	    _a = {
	  name: "AtrulePrelude",
	  structure: {
	    children: [[]]
	  },
	  parse: function (e) {
	    var t = null;
	    return null !== e && (e = e.toLowerCase()), this.scanner.skipSC(), t = this.atrule.hasOwnProperty(e) && "function" == typeof this.atrule[e].prelude ? this.atrule[e].prelude.call(this) : this.readSequence(this.scope.AtrulePrelude), this.scanner.skipSC(), !0 !== this.scanner.eof && this.scanner.tokenType !== xa && this.scanner.tokenType !== wa && this.error("Semicolon or block is expected"), null === t && (t = this.createList()), {
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
	    Sa = De.TYPE,
	    Ca = Sa.Ident,
	    za = Sa.String,
	    Aa = Sa.Colon,
	    Ta = Sa.LeftSquareBracket,
	    Ea = Sa.RightSquareBracket;

	function Pa() {
	  this.scanner.eof && this.error("Unexpected end of input");
	  var e = this.scanner.tokenStart,
	      t = !1,
	      n = !0;
	  return this.scanner.isDelim(42) ? (t = !0, n = !1, this.scanner.next()) : this.scanner.isDelim(124) || this.eat(Ca), this.scanner.isDelim(124) ? 61 !== this.scanner.source.charCodeAt(this.scanner.tokenStart + 1) ? (this.scanner.next(), this.eat(Ca)) : t && this.error("Identifier is expected", this.scanner.tokenEnd) : t && this.error("Vertical line is expected"), n && this.scanner.tokenType === Aa && (this.scanner.next(), this.eat(Ca)), {
	    type: "Identifier",
	    loc: this.getLocation(e, this.scanner.tokenStart),
	    name: this.scanner.substrToCursor(e)
	  };
	}

	function La() {
	  var e = this.scanner.tokenStart,
	      t = this.scanner.source.charCodeAt(e);
	  return 61 !== t && 126 !== t && 94 !== t && 36 !== t && 42 !== t && 124 !== t && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), this.scanner.next(), 61 !== t && (this.scanner.isDelim(61) || this.error("Equal sign is expected"), this.scanner.next()), this.scanner.substrToCursor(e);
	}

	var Oa = {
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
	        a = null;
	    return this.eat(Ta), this.scanner.skipSC(), e = Pa.call(this), this.scanner.skipSC(), this.scanner.tokenType !== Ea && (this.scanner.tokenType !== Ca && (n = La.call(this), this.scanner.skipSC(), r = this.scanner.tokenType === za ? this.String() : this.Identifier(), this.scanner.skipSC()), this.scanner.tokenType === Ca && (a = this.scanner.getTokenValue(), this.scanner.next(), this.scanner.skipSC())), this.eat(Ea), {
	      type: "AttributeSelector",
	      loc: this.getLocation(t, this.scanner.tokenStart),
	      name: e,
	      matcher: n,
	      value: r,
	      flags: a
	    };
	  },
	  generate: function (e) {
	    var t = " ";
	    this.chunk("["), this.node(e.name), null !== e.matcher && (this.chunk(e.matcher), null !== e.value && (this.node(e.value), "String" === e.value.type && (t = ""))), null !== e.flags && (this.chunk(t), this.chunk(e.flags)), this.chunk("]");
	  }
	},
	    Da = De.TYPE,
	    Ra = ua.mode,
	    Na = Da.WhiteSpace,
	    Ba = Da.Comment,
	    Ia = Da.Semicolon,
	    Ma = Da.AtKeyword,
	    ja = Da.LeftCurlyBracket,
	    Fa = Da.RightCurlyBracket;

	function Ua(e) {
	  return this.Raw(e, null, !0);
	}

	function qa() {
	  return this.parseWithFallback(this.Rule, Ua);
	}

	function Wa(e) {
	  return this.Raw(e, Ra.semicolonIncluded, !0);
	}

	function Ya() {
	  if (this.scanner.tokenType === Ia) return Wa.call(this, this.scanner.tokenIndex);
	  var e = this.parseWithFallback(this.Declaration, Wa);
	  return this.scanner.tokenType === Ia && this.scanner.next(), e;
	}

	var Ha = {
	  name: "Block",
	  structure: {
	    children: [["Atrule", "Rule", "Declaration"]]
	  },
	  parse: function (e) {
	    var t = e ? Ya : qa,
	        n = this.scanner.tokenStart,
	        r = this.createList();
	    this.eat(ja);

	    e: for (; !this.scanner.eof;) switch (this.scanner.tokenType) {
	      case Fa:
	        break e;

	      case Na:
	      case Ba:
	        this.scanner.next();
	        break;

	      case Ma:
	        r.push(this.parseWithFallback(this.Atrule, Ua));
	        break;

	      default:
	        r.push(t.call(this));
	    }

	    return this.scanner.eof || this.eat(Fa), {
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
	    Za = De.TYPE,
	    Va = Za.LeftSquareBracket,
	    $a = Za.RightSquareBracket,
	    Ka = {
	  name: "Brackets",
	  structure: {
	    children: [[]]
	  },
	  parse: function (e, t) {
	    var n,
	        r = this.scanner.tokenStart;
	    return this.eat(Va), n = e.call(this, t), this.scanner.eof || this.eat($a), {
	      type: "Brackets",
	      loc: this.getLocation(r, this.scanner.tokenStart),
	      children: n
	    };
	  },
	  generate: function (e) {
	    this.chunk("["), this.children(e), this.chunk("]");
	  }
	},
	    Ga = De.TYPE.CDC,
	    Xa = {
	  name: "CDC",
	  structure: [],
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.eat(Ga), {
	      type: "CDC",
	      loc: this.getLocation(e, this.scanner.tokenStart)
	    };
	  },
	  generate: function () {
	    this.chunk("--\x3e");
	  }
	},
	    Qa = De.TYPE.CDO,
	    Ja = {
	  name: "CDO",
	  structure: [],
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.eat(Qa), {
	      type: "CDO",
	      loc: this.getLocation(e, this.scanner.tokenStart)
	    };
	  },
	  generate: function () {
	    this.chunk("\x3c!--");
	  }
	},
	    ei = De.TYPE.Ident,
	    ti = {
	  name: "ClassSelector",
	  structure: {
	    name: String
	  },
	  parse: function () {
	    return this.scanner.isDelim(46) || this.error("Full stop is expected"), this.scanner.next(), {
	      type: "ClassSelector",
	      loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
	      name: this.consume(ei)
	    };
	  },
	  generate: function (e) {
	    this.chunk("."), this.chunk(e.name);
	  }
	},
	    ni = De.TYPE.Ident,
	    ri = {
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
	        this.scanner.next(), this.scanner.tokenType === ni && !1 !== this.scanner.lookupValue(0, "deep") || this.error("Identifier `deep` is expected"), this.scanner.next(), this.scanner.isDelim(47) || this.error("Solidus is expected"), this.scanner.next();
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
	    ai = De.TYPE.Comment,
	    ii = {
	  name: "Comment",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart,
	        t = this.scanner.tokenEnd;
	    return this.eat(ai), t - e + 2 >= 2 && 42 === this.scanner.source.charCodeAt(t - 2) && 47 === this.scanner.source.charCodeAt(t - 1) && (t -= 2), {
	      type: "Comment",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      value: this.scanner.source.substring(e + 2, t)
	    };
	  },
	  generate: function (e) {
	    this.chunk("/*"), this.chunk(e.value), this.chunk("*/");
	  }
	},
	    oi = fe.isCustomProperty,
	    si = De.TYPE,
	    li = ua.mode,
	    ci = si.Ident,
	    ui = si.Hash,
	    hi = si.Colon,
	    di = si.Semicolon,
	    pi = si.Delim;

	function fi(e) {
	  return this.Raw(e, li.exclamationMarkOrSemicolon, !0);
	}

	function mi(e) {
	  return this.Raw(e, li.exclamationMarkOrSemicolon, !1);
	}

	function gi() {
	  var e = this.scanner.tokenIndex,
	      t = this.Value();
	  return "Raw" !== t.type && !1 === this.scanner.eof && this.scanner.tokenType !== di && !1 === this.scanner.isDelim(33) && !1 === this.scanner.isBalanceEdge(e) && this.error(), t;
	}

	var bi = {
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
	        r = yi.call(this),
	        a = oi(r),
	        i = a ? this.parseCustomProperty : this.parseValue,
	        o = a ? mi : fi,
	        s = !1;
	    return this.scanner.skipSC(), this.eat(hi), a || this.scanner.skipSC(), e = i ? this.parseWithFallback(gi, o) : o.call(this, this.scanner.tokenIndex), this.scanner.isDelim(33) && (s = ki.call(this), this.scanner.skipSC()), !1 === this.scanner.eof && this.scanner.tokenType !== di && !1 === this.scanner.isBalanceEdge(n) && this.error(), {
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

	function yi() {
	  var e = this.scanner.tokenStart;
	  if (this.scanner.tokenType === pi) switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
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
	  return this.scanner.tokenType === ui ? this.eat(ui) : this.eat(ci), this.scanner.substrToCursor(e);
	}

	function ki() {
	  this.eat(pi), this.scanner.skipSC();
	  var e = this.consume(ci);
	  return "important" === e || e;
	}

	var vi = De.TYPE,
	    wi = ua.mode,
	    xi = vi.WhiteSpace,
	    _i = vi.Comment,
	    Si = vi.Semicolon;

	function Ci(e) {
	  return this.Raw(e, wi.semicolonIncluded, !0);
	}

	var zi = {
	  name: "DeclarationList",
	  structure: {
	    children: [["Declaration"]]
	  },
	  parse: function () {
	    for (var e = this.createList(); !this.scanner.eof;) switch (this.scanner.tokenType) {
	      case xi:
	      case _i:
	      case Si:
	        this.scanner.next();
	        break;

	      default:
	        e.push(this.parseWithFallback(this.Declaration, Ci));
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
	    Ai = $.consumeNumber,
	    Ti = De.TYPE.Dimension,
	    Ei = {
	  name: "Dimension",
	  structure: {
	    value: String,
	    unit: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart,
	        t = Ai(this.scanner.source, e);
	    return this.eat(Ti), {
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
	    Pi = De.TYPE.RightParenthesis,
	    Li = {
	  name: "Function",
	  structure: {
	    name: String,
	    children: [[]]
	  },
	  parse: function (e, t) {
	    var n,
	        r = this.scanner.tokenStart,
	        a = this.consumeFunctionName(),
	        i = a.toLowerCase();
	    return n = t.hasOwnProperty(i) ? t[i].call(this, t) : e.call(this, t), this.scanner.eof || this.eat(Pi), {
	      type: "Function",
	      loc: this.getLocation(r, this.scanner.tokenStart),
	      name: a,
	      children: n
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.name), this.chunk("("), this.children(e), this.chunk(")");
	  },
	  walkContext: "function"
	},
	    Oi = De.TYPE.Hash,
	    Di = {
	  name: "HexColor",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.eat(Oi), {
	      type: "HexColor",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      value: this.scanner.substrToCursor(e + 1)
	    };
	  },
	  generate: function (e) {
	    this.chunk("#"), this.chunk(e.value);
	  }
	},
	    Ri = De.TYPE.Ident,
	    Ni = {
	  name: "Identifier",
	  structure: {
	    name: String
	  },
	  parse: function () {
	    return {
	      type: "Identifier",
	      loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
	      name: this.consume(Ri)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.name);
	  }
	},
	    Bi = De.TYPE.Hash,
	    Ii = {
	  name: "IdSelector",
	  structure: {
	    name: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.eat(Bi), {
	      type: "IdSelector",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      name: this.scanner.substrToCursor(e + 1)
	    };
	  },
	  generate: function (e) {
	    this.chunk("#"), this.chunk(e.name);
	  }
	},
	    Mi = De.TYPE,
	    ji = Mi.Ident,
	    Fi = Mi.Number,
	    Ui = Mi.Dimension,
	    qi = Mi.LeftParenthesis,
	    Wi = Mi.RightParenthesis,
	    Yi = Mi.Colon,
	    Hi = Mi.Delim,
	    Zi = {
	  name: "MediaFeature",
	  structure: {
	    name: String,
	    value: ["Identifier", "Number", "Dimension", "Ratio", null]
	  },
	  parse: function () {
	    var e,
	        t = this.scanner.tokenStart,
	        n = null;

	    if (this.eat(qi), this.scanner.skipSC(), e = this.consume(ji), this.scanner.skipSC(), this.scanner.tokenType !== Wi) {
	      switch (this.eat(Yi), this.scanner.skipSC(), this.scanner.tokenType) {
	        case Fi:
	          n = this.lookupNonWSType(1) === Hi ? this.Ratio() : this.Number();
	          break;

	        case Ui:
	          n = this.Dimension();
	          break;

	        case ji:
	          n = this.Identifier();
	          break;

	        default:
	          this.error("Number, dimension, ratio or identifier is expected");
	      }

	      this.scanner.skipSC();
	    }

	    return this.eat(Wi), {
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
	    Vi = De.TYPE,
	    $i = Vi.WhiteSpace,
	    Ki = Vi.Comment,
	    Gi = Vi.Ident,
	    Xi = Vi.LeftParenthesis,
	    Qi = {
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
	        case Ki:
	          this.scanner.next();
	          continue;

	        case $i:
	          n = this.WhiteSpace();
	          continue;

	        case Gi:
	          t = this.Identifier();
	          break;

	        case Xi:
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
	    Ji = De.TYPE.Comma,
	    eo = {
	  name: "MediaQueryList",
	  structure: {
	    children: [["MediaQuery"]]
	  },
	  parse: function (e) {
	    var t = this.createList();

	    for (this.scanner.skipSC(); !this.scanner.eof && (t.push(this.MediaQuery(e)), this.scanner.tokenType === Ji);) this.scanner.next();

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
	    to = De.TYPE.Number,
	    no = {
	  name: "Number",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    return {
	      type: "Number",
	      loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
	      value: this.consume(to)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value);
	  }
	},
	    ro = {
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
	    ao = De.TYPE,
	    io = ao.LeftParenthesis,
	    oo = ao.RightParenthesis,
	    so = {
	  name: "Parentheses",
	  structure: {
	    children: [[]]
	  },
	  parse: function (e, t) {
	    var n,
	        r = this.scanner.tokenStart;
	    return this.eat(io), n = e.call(this, t), this.scanner.eof || this.eat(oo), {
	      type: "Parentheses",
	      loc: this.getLocation(r, this.scanner.tokenStart),
	      children: n
	    };
	  },
	  generate: function (e) {
	    this.chunk("("), this.children(e), this.chunk(")");
	  }
	},
	    lo = $.consumeNumber,
	    co = De.TYPE.Percentage,
	    uo = {
	  name: "Percentage",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart,
	        t = lo(this.scanner.source, e);
	    return this.eat(co), {
	      type: "Percentage",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      value: this.scanner.source.substring(e, t)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value), this.chunk("%");
	  }
	},
	    ho = De.TYPE,
	    po = ho.Ident,
	    fo = ho.Function,
	    mo = ho.Colon,
	    go = ho.RightParenthesis,
	    bo = {
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
	    return this.eat(mo), this.scanner.tokenType === fo ? (t = (e = this.consumeFunctionName()).toLowerCase(), this.pseudo.hasOwnProperty(t) ? (this.scanner.skipSC(), r = this.pseudo[t].call(this), this.scanner.skipSC()) : (r = this.createList()).push(this.Raw(this.scanner.tokenIndex, null, !1)), this.eat(go)) : e = this.consume(po), {
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
	    yo = De.TYPE,
	    ko = yo.Ident,
	    vo = yo.Function,
	    wo = yo.Colon,
	    xo = yo.RightParenthesis,
	    _o = {
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
	    return this.eat(wo), this.eat(wo), this.scanner.tokenType === vo ? (t = (e = this.consumeFunctionName()).toLowerCase(), this.pseudo.hasOwnProperty(t) ? (this.scanner.skipSC(), r = this.pseudo[t].call(this), this.scanner.skipSC()) : (r = this.createList()).push(this.Raw(this.scanner.tokenIndex, null, !1)), this.eat(xo)) : e = this.consume(ko), {
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
	    So = De.isDigit,
	    Co = De.TYPE,
	    zo = Co.Number,
	    Ao = Co.Delim;

	function To() {
	  this.scanner.skipWS();

	  for (var e = this.consume(zo), t = 0; t < e.length; t++) {
	    var n = e.charCodeAt(t);
	    So(n) || 46 === n || this.error("Unsigned number is expected", this.scanner.tokenStart - e.length + t);
	  }

	  return 0 === Number(e) && this.error("Zero number is not allowed", this.scanner.tokenStart - e.length), e;
	}

	var Eo = {
	  name: "Ratio",
	  structure: {
	    left: String,
	    right: String
	  },
	  parse: function () {
	    var e,
	        t = this.scanner.tokenStart,
	        n = To.call(this);
	    return this.scanner.skipWS(), this.scanner.isDelim(47) || this.error("Solidus is expected"), this.eat(Ao), e = To.call(this), {
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
	    Po = De.TYPE,
	    Lo = ua.mode,
	    Oo = Po.LeftCurlyBracket;

	function Do(e) {
	  return this.Raw(e, Lo.leftCurlyBracket, !0);
	}

	function Ro() {
	  var e = this.SelectorList();
	  return "Raw" !== e.type && !1 === this.scanner.eof && this.scanner.tokenType !== Oo && this.error(), e;
	}

	var No = {
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
	    return e = this.parseRulePrelude ? this.parseWithFallback(Ro, Do) : Do.call(this, n), t = this.Block(!0), {
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
	    Bo = De.TYPE.Comma,
	    Io = {
	  name: "SelectorList",
	  structure: {
	    children: [["Selector", "Raw"]]
	  },
	  parse: function () {
	    for (var e = this.createList(); !this.scanner.eof && (e.push(this.Selector()), this.scanner.tokenType === Bo);) this.scanner.next();

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
	    Mo = De.TYPE.String,
	    jo = {
	  name: "String",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    return {
	      type: "String",
	      loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
	      value: this.consume(Mo)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value);
	  }
	},
	    Fo = De.TYPE,
	    Uo = Fo.WhiteSpace,
	    qo = Fo.Comment,
	    Wo = Fo.AtKeyword,
	    Yo = Fo.CDO,
	    Ho = Fo.CDC;

	function Zo(e) {
	  return this.Raw(e, null, !1);
	}

	var Vo = {
	  name: "StyleSheet",
	  structure: {
	    children: [["Comment", "CDO", "CDC", "Atrule", "Rule", "Raw"]]
	  },
	  parse: function () {
	    for (var e, t = this.scanner.tokenStart, n = this.createList(); !this.scanner.eof;) {
	      switch (this.scanner.tokenType) {
	        case Uo:
	          this.scanner.next();
	          continue;

	        case qo:
	          if (33 !== this.scanner.source.charCodeAt(this.scanner.tokenStart + 2)) {
	            this.scanner.next();
	            continue;
	          }

	          e = this.Comment();
	          break;

	        case Yo:
	          e = this.CDO();
	          break;

	        case Ho:
	          e = this.CDC();
	          break;

	        case Wo:
	          e = this.parseWithFallback(this.Atrule, Zo);
	          break;

	        default:
	          e = this.parseWithFallback(this.Rule, Zo);
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
	    $o = De.TYPE.Ident;

	function Ko() {
	  this.scanner.tokenType !== $o && !1 === this.scanner.isDelim(42) && this.error("Identifier or asterisk is expected"), this.scanner.next();
	}

	var Go = {
	  name: "TypeSelector",
	  structure: {
	    name: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return this.scanner.isDelim(124) ? (this.scanner.next(), Ko.call(this)) : (Ko.call(this), this.scanner.isDelim(124) && (this.scanner.next(), Ko.call(this))), {
	      type: "TypeSelector",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      name: this.scanner.substrToCursor(e)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.name);
	  }
	},
	    Xo = De.isHexDigit,
	    Qo = De.cmpChar,
	    Jo = De.TYPE,
	    es = De.NAME,
	    ts = Jo.Ident,
	    ns = Jo.Number,
	    rs = Jo.Dimension;

	function as(e, t) {
	  for (var n = this.scanner.tokenStart + e, r = 0; n < this.scanner.tokenEnd; n++) {
	    var a = this.scanner.source.charCodeAt(n);
	    if (45 === a && t && 0 !== r) return 0 === as.call(this, e + r + 1, !1) && this.error(), -1;
	    Xo(a) || this.error(t && 0 !== r ? "HyphenMinus" + (r < 6 ? " or hex digit" : "") + " is expected" : r < 6 ? "Hex digit is expected" : "Unexpected input", n), ++r > 6 && this.error("Too many hex digits", n);
	  }

	  return this.scanner.next(), r;
	}

	function is(e) {
	  for (var t = 0; this.scanner.isDelim(63);) ++t > e && this.error("Too many question marks"), this.scanner.next();
	}

	function os(e) {
	  this.scanner.source.charCodeAt(this.scanner.tokenStart) !== e && this.error(es[e] + " is expected");
	}

	function ss() {
	  var e = 0;
	  return this.scanner.isDelim(43) ? (this.scanner.next(), this.scanner.tokenType === ts ? void ((e = as.call(this, 0, !0)) > 0 && is.call(this, 6 - e)) : this.scanner.isDelim(63) ? (this.scanner.next(), void is.call(this, 5)) : void this.error("Hex digit or question mark is expected")) : this.scanner.tokenType === ns ? (os.call(this, 43), e = as.call(this, 1, !0), this.scanner.isDelim(63) ? void is.call(this, 6 - e) : this.scanner.tokenType === rs || this.scanner.tokenType === ns ? (os.call(this, 45), void as.call(this, 1, !1)) : void 0) : this.scanner.tokenType === rs ? (os.call(this, 43), void ((e = as.call(this, 1, !0)) > 0 && is.call(this, 6 - e))) : void this.error();
	}

	var ls,
	    cs = {
	  name: "UnicodeRange",
	  structure: {
	    value: String
	  },
	  parse: function () {
	    var e = this.scanner.tokenStart;
	    return Qo(this.scanner.source, e, 117) || this.error("U is expected"), Qo(this.scanner.source, e + 1, 43) || this.error("Plus sign is expected"), this.scanner.next(), ss.call(this), {
	      type: "UnicodeRange",
	      loc: this.getLocation(e, this.scanner.tokenStart),
	      value: this.scanner.substrToCursor(e)
	    };
	  },
	  generate: function (e) {
	    this.chunk(e.value);
	  }
	},
	    us = De.isWhiteSpace,
	    hs = De.cmpStr,
	    ds = De.TYPE,
	    ps = ds.Function,
	    fs = ds.Url,
	    ms = ds.RightParenthesis,
	    gs = {
	  name: "Url",
	  structure: {
	    value: ["String", "Raw"]
	  },
	  parse: function () {
	    var e,
	        t = this.scanner.tokenStart;

	    switch (this.scanner.tokenType) {
	      case fs:
	        for (var n = t + 4, r = this.scanner.tokenEnd - 1; n < r && us(this.scanner.source.charCodeAt(n));) n++;

	        for (; n < r && us(this.scanner.source.charCodeAt(r - 1));) r--;

	        e = {
	          type: "Raw",
	          loc: this.getLocation(n, r),
	          value: this.scanner.source.substring(n, r)
	        }, this.eat(fs);
	        break;

	      case ps:
	        hs(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(") || this.error("Function name must be `url`"), this.eat(ps), this.scanner.skipSC(), e = this.String(), this.scanner.skipSC(), this.eat(ms);
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
	    bs = De.TYPE.WhiteSpace,
	    ys = window.Object.freeze({
	  type: "WhiteSpace",
	  loc: null,
	  value: " "
	}),
	    ks = {
	  AnPlusB: na,
	  Atrule: ka,
	  AtrulePrelude: _a,
	  AttributeSelector: Oa,
	  Block: Ha,
	  Brackets: Ka,
	  CDC: Xa,
	  CDO: Ja,
	  ClassSelector: ti,
	  Combinator: ri,
	  Comment: ii,
	  Declaration: bi,
	  DeclarationList: zi,
	  Dimension: Ei,
	  Function: Li,
	  HexColor: Di,
	  Identifier: Ni,
	  IdSelector: Ii,
	  MediaFeature: Zi,
	  MediaQuery: Qi,
	  MediaQueryList: eo,
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
	          a = null;
	      return t = this.scanner.lookupValue(0, "odd") || this.scanner.lookupValue(0, "even") ? this.Identifier() : this.AnPlusB(), this.scanner.skipSC(), e && this.scanner.lookupValue(0, "of") ? (this.scanner.next(), a = this.SelectorList(), this.needPositions && (r = this.getLastListNode(a.children).loc.end.offset)) : this.needPositions && (r = t.loc.end.offset), {
	        type: "Nth",
	        loc: this.getLocation(n, r),
	        nth: t,
	        selector: a
	      };
	    },
	    generate: function (e) {
	      this.node(e.nth), null !== e.selector && (this.chunk(" of "), this.node(e.selector));
	    }
	  },
	  Number: no,
	  Operator: ro,
	  Parentheses: so,
	  Percentage: uo,
	  PseudoClassSelector: bo,
	  PseudoElementSelector: _o,
	  Ratio: Eo,
	  Raw: ua,
	  Rule: No,
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
	  SelectorList: Io,
	  String: jo,
	  StyleSheet: Vo,
	  TypeSelector: Go,
	  UnicodeRange: cs,
	  Url: gs,
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
	      return this.eat(bs), ys;
	    },
	    generate: function (e) {
	      this.chunk(e.value);
	    }
	  }
	},
	    vs = (ls = Wr) && ls.default || ls,
	    ws = {
	  generic: !0,
	  types: vs.types,
	  atrules: vs.atrules,
	  properties: vs.properties,
	  node: ks
	},
	    xs = De.cmpChar,
	    _s = De.cmpStr,
	    Ss = De.TYPE,
	    Cs = Ss.Ident,
	    zs = Ss.String,
	    As = Ss.Number,
	    Ts = Ss.Function,
	    Es = Ss.Url,
	    Ps = Ss.Hash,
	    Ls = Ss.Dimension,
	    Os = Ss.Percentage,
	    Ds = Ss.LeftParenthesis,
	    Rs = Ss.LeftSquareBracket,
	    Ns = Ss.Comma,
	    Bs = Ss.Delim,
	    Is = function (e) {
	  switch (this.scanner.tokenType) {
	    case Ps:
	      return this.HexColor();

	    case Ns:
	      return e.space = null, e.ignoreWSAfter = !0, this.Operator();

	    case Ds:
	      return this.Parentheses(this.readSequence, e.recognizer);

	    case Rs:
	      return this.Brackets(this.readSequence, e.recognizer);

	    case zs:
	      return this.String();

	    case Ls:
	      return this.Dimension();

	    case Os:
	      return this.Percentage();

	    case As:
	      return this.Number();

	    case Ts:
	      return _s(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, e.recognizer);

	    case Es:
	      return this.Url();

	    case Cs:
	      return xs(this.scanner.source, this.scanner.tokenStart, 117) && xs(this.scanner.source, this.scanner.tokenStart + 1, 43) ? this.UnicodeRange() : this.Identifier();

	    case Bs:
	      var t = this.scanner.source.charCodeAt(this.scanner.tokenStart);
	      if (47 === t || 42 === t || 43 === t || 45 === t) return this.Operator();
	      35 === t && this.error("Hex or identifier is expected", this.scanner.tokenStart + 1);
	  }
	},
	    Ms = {
	  getNode: Is
	},
	    js = De.TYPE,
	    Fs = js.Delim,
	    Us = js.Ident,
	    qs = js.Dimension,
	    Ws = js.Percentage,
	    Ys = js.Number,
	    Hs = js.Hash,
	    Zs = js.Colon,
	    Vs = js.LeftSquareBracket;

	var $s = {
	  getNode: function (e) {
	    switch (this.scanner.tokenType) {
	      case Vs:
	        return this.AttributeSelector();

	      case Hs:
	        return this.IdSelector();

	      case Zs:
	        return this.scanner.lookupType(1) === Zs ? this.PseudoElementSelector() : this.PseudoClassSelector();

	      case Us:
	        return this.TypeSelector();

	      case Ys:
	      case Ws:
	        return this.Percentage();

	      case qs:
	        46 === this.scanner.source.charCodeAt(this.scanner.tokenStart) && this.error("Identifier is expected", this.scanner.tokenStart + 1);
	        break;

	      case Fs:
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
	    Ks = function () {
	  this.scanner.skipSC();
	  var e = this.createSingleNodeList(this.IdSelector());
	  return this.scanner.skipSC(), e;
	},
	    Gs = De.TYPE,
	    Xs = ua.mode,
	    Qs = Gs.Comma,
	    Js = {
	  AtrulePrelude: Ms,
	  Selector: $s,
	  Value: {
	    getNode: Is,
	    "-moz-element": Ks,
	    element: Ks,
	    expression: function () {
	      return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex, null, !1));
	    },
	    var: function () {
	      var e = this.createList();
	      return this.scanner.skipSC(), e.push(this.Identifier()), this.scanner.skipSC(), this.scanner.tokenType === Qs && (e.push(this.Operator()), e.push(this.parseCustomProperty ? this.Value(null) : this.Raw(this.scanner.tokenIndex, Xs.exclamationMarkOrSemicolon, !1))), e;
	    }
	  }
	},
	    el = De.TYPE,
	    tl = el.String,
	    nl = el.Ident,
	    rl = el.Url,
	    al = el.Function,
	    il = el.LeftParenthesis,
	    ol = {
	  parse: {
	    prelude: function () {
	      var e = this.createList();

	      switch (this.scanner.skipSC(), this.scanner.tokenType) {
	        case tl:
	          e.push(this.String());
	          break;

	        case rl:
	        case al:
	          e.push(this.Url());
	          break;

	        default:
	          this.error("String or url() is expected");
	      }

	      return this.lookupNonWSType(0) !== nl && this.lookupNonWSType(0) !== il || (e.push(this.WhiteSpace()), e.push(this.MediaQueryList())), e;
	    },
	    block: null
	  }
	},
	    sl = De.TYPE,
	    ll = sl.WhiteSpace,
	    cl = sl.Comment,
	    ul = sl.Ident,
	    hl = sl.Function,
	    dl = sl.Colon,
	    pl = sl.LeftParenthesis;

	function fl() {
	  return this.createSingleNodeList(this.Raw(this.scanner.tokenIndex, null, !1));
	}

	function ml() {
	  return this.scanner.skipSC(), this.scanner.tokenType === ul && this.lookupNonWSType(1) === dl ? this.createSingleNodeList(this.Declaration()) : gl.call(this);
	}

	function gl() {
	  var e,
	      t = this.createList(),
	      n = null;
	  this.scanner.skipSC();

	  e: for (; !this.scanner.eof;) {
	    switch (this.scanner.tokenType) {
	      case ll:
	        n = this.WhiteSpace();
	        continue;

	      case cl:
	        this.scanner.next();
	        continue;

	      case hl:
	        e = this.Function(fl, this.scope.AtrulePrelude);
	        break;

	      case ul:
	        e = this.Identifier();
	        break;

	      case pl:
	        e = this.Parentheses(ml, this.scope.AtrulePrelude);
	        break;

	      default:
	        break e;
	    }

	    null !== n && (t.push(n), n = null), t.push(e);
	  }

	  return t;
	}

	var bl = {
	  parse: function () {
	    return this.createSingleNodeList(this.SelectorList());
	  }
	},
	    yl = {
	  parse: function () {
	    return this.createSingleNodeList(this.Nth(!0));
	  }
	},
	    kl = {
	  parse: function () {
	    return this.createSingleNodeList(this.Nth(!1));
	  }
	};
	var vl = jr(function () {
	  for (var e = {}, t = 0; t < arguments.length; t++) {
	    var n = arguments[t];

	    for (var r in n) e[r] = n[r];
	  }

	  return e;
	}(ws, {
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
	  scope: Js,
	  atrule: {
	    "font-face": {
	      parse: {
	        prelude: null,
	        block: function () {
	          return this.Block(!0);
	        }
	      }
	    },
	    import: ol,
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
	          var e = gl.call(this);
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
	    matches: bl,
	    not: bl,
	    "nth-child": yl,
	    "nth-last-child": yl,
	    "nth-last-of-type": kl,
	    "nth-of-type": kl,
	    slotted: {
	      parse: function () {
	        return this.createSingleNodeList(this.Selector());
	      }
	    }
	  },
	  node: ks
	}, {
	  node: ks
	}));

	const wl = new window.Map([["background", new window.Set(["background-color", "background-position", "background-position-x", "background-position-y", "background-size", "background-repeat", "background-repeat-x", "background-repeat-y", "background-clip", "background-origin", "background-attachment", "background-image"])], ["background-position", new window.Set(["background-position-x", "background-position-y"])], ["background-repeat", new window.Set(["background-repeat-x", "background-repeat-y"])], ["font", new window.Set(["font-style", "font-variant-caps", "font-weight", "font-stretch", "font-size", "line-height", "font-family", "font-size-adjust", "font-kerning", "font-optical-sizing", "font-variant-alternates", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-language-override", "font-feature-settings", "font-variation-settings"])], ["font-variant", new window.Set(["font-variant-caps", "font-variant-numeric", "font-variant-alternates", "font-variant-ligatures", "font-variant-east-asian"])], ["outline", new window.Set(["outline-width", "outline-style", "outline-color"])], ["border", new window.Set(["border-top-width", "border-right-width", "border-bottom-width", "border-left-width", "border-top-style", "border-right-style", "border-bottom-style", "border-left-style", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "border-image-source", "border-image-slice", "border-image-width", "border-image-outset", "border-image-repeat"])], ["border-width", new window.Set(["border-top-width", "border-right-width", "border-bottom-width", "border-left-width"])], ["border-style", new window.Set(["border-top-style", "border-right-style", "border-bottom-style", "border-left-style"])], ["border-color", new window.Set(["border-top-color", "border-right-color", "border-bottom-color", "border-left-color"])], ["border-block", new window.Set(["border-block-start-width", "border-block-end-width", "border-block-start-style", "border-block-end-style", "border-block-start-color", "border-block-end-color"])], ["border-block-start", new window.Set(["border-block-start-width", "border-block-start-style", "border-block-start-color"])], ["border-block-end", new window.Set(["border-block-end-width", "border-block-end-style", "border-block-end-color"])], ["border-inline", new window.Set(["border-inline-start-width", "border-inline-end-width", "border-inline-start-style", "border-inline-end-style", "border-inline-start-color", "border-inline-end-color"])], ["border-inline-start", new window.Set(["border-inline-start-width", "border-inline-start-style", "border-inline-start-color"])], ["border-inline-end", new window.Set(["border-inline-end-width", "border-inline-end-style", "border-inline-end-color"])], ["border-image", new window.Set(["border-image-source", "border-image-slice", "border-image-width", "border-image-outset", "border-image-repeat"])], ["border-radius", new window.Set(["border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"])], ["padding", new window.Set(["padding-top", "padding-right", "padding-bottom", "padding-left"])], ["padding-block", new window.Set(["padding-block-start", "padding-block-end"])], ["padding-inline", new window.Set(["padding-inline-start", "padding-inline-end"])], ["margin", new window.Set(["margin-top", "margin-right", "margin-bottom", "margin-left"])], ["margin-block", new window.Set(["margin-block-start", "margin-block-end"])], ["margin-inline", new window.Set(["margin-inline-start", "margin-inline-end"])], ["inset", new window.Set(["top", "right", "bottom", "left"])], ["inset-block", new window.Set(["inset-block-start", "inset-block-end"])], ["inset-inline", new window.Set(["inset-inline-start", "inset-inline-end"])], ["flex", new window.Set(["flex-grow", "flex-shrink", "flex-basis"])], ["flex-flow", new window.Set(["flex-direction", "flex-wrap"])], ["gap", new window.Set(["row-gap", "column-gap"])], ["transition", new window.Set(["transition-duration", "transition-timing-function", "transition-delay", "transition-property"])], ["grid", new window.Set(["grid-template-rows", "grid-template-columns", "grid-template-areas", "grid-auto-flow", "grid-auto-columns", "grid-auto-rows"])], ["grid-template", new window.Set(["grid-template-rows", "grid-template-columns", "grid-template-areas"])], ["grid-row", new window.Set(["grid-row-start", "grid-row-end"])], ["grid-column", new window.Set(["grid-column-start", "grid-column-end"])], ["grid-gap", new window.Set(["grid-row-gap", "grid-column-gap"])], ["place-content", new window.Set(["align-content", "justify-content"])], ["place-items", new window.Set(["align-items", "justify-items"])], ["place-self", new window.Set(["align-self", "justify-self"])], ["columns", new window.Set(["column-width", "column-count"])], ["column-rule", new window.Set(["column-rule-width", "column-rule-style", "column-rule-color"])], ["list-style", new window.Set(["list-style-type", "list-style-position", "list-style-image"])], ["offset", new window.Set(["offset-position", "offset-path", "offset-distance", "offset-rotate", "offset-anchor"])], ["overflow", new window.Set(["overflow-x", "overflow-y"])], ["overscroll-behavior", new window.Set(["overscroll-behavior-x", "overscroll-behavior-y"])], ["scroll-margin", new window.Set(["scroll-margin-top", "scroll-margin-right", "scroll-margin-bottom", "scroll-margin-left"])], ["scroll-padding", new window.Set(["scroll-padding-top", "scroll-padding-right", "scroll-padding-bottom", "scroll-padding-left"])], ["text-decaration", new window.Set(["text-decoration-line", "text-decoration-style", "text-decoration-color"])], ["text-stroke", new window.Set(["text-stroke-color", "text-stroke-width"])], ["animation", new window.Set(["animation-duration", "animation-timing-function", "animation-delay", "animation-iteration-count", "animation-direction", "animation-fill-mode", "animation-play-state", "animation-name"])], ["mask", new window.Set(["mask-image", "mask-mode", "mask-repeat-x", "mask-repeat-y", "mask-position-x", "mask-position-y", "mask-clip", "mask-origin", "mask-size", "mask-composite"])], ["mask-repeat", new window.Set(["mask-repeat-x", "mask-repeat-y"])], ["mask-position", new window.Set(["mask-position-x", "mask-position-y"])], ["perspective-origin", new window.Set(["perspective-origin-x", "perspective-origin-y"])], ["transform-origin", new window.Set(["transform-origin-x", "transform-origin-y", "transform-origin-z"])]]),
	      xl = new window.Map([zl("animation", "moz"), zl("border-image", "moz"), zl("mask", "moz"), zl("transition", "moz"), zl("columns", "moz"), zl("text-stroke", "moz"), zl("column-rule", "moz"), ["-moz-border-end", new window.Set(["-moz-border-end-color", "-moz-border-end-style", "-moz-border-end-width"])], ["-moz-border-start", new window.Set(["-moz-border-start-color", "-moz-border-start-style", "-moz-border-start-width"])], ["-moz-outline-radius", new window.Set(["-moz-outline-radius-topleft", "-moz-outline-radius-topright", "-moz-outline-radius-bottomright", "-moz-outline-radius-bottomleft"])]]),
	      _l = new window.Map([zl("animation", "webkit"), zl("border-radius", "webkit"), zl("column-rule", "webkit"), zl("columns", "webkit"), zl("flex", "webkit"), zl("flex-flow", "webkit"), zl("mask", "webkit"), zl("text-stroke", "webkit"), zl("perspective-origin", "webkit"), zl("transform-origin", "webkit"), zl("transition", "webkit"), ["-webkit-border-start", new window.Set(["-webkit-border-start-color", "-webkit-border-start-style", "-webkit-border-start-width"])], ["-webkit-border-before", new window.Set(["-webkit-border-before-color", "-webkit-border-before-style", "-webkit-border-before-width"])], ["-webkit-border-end", new window.Set(["-webkit-border-end-color", "-webkit-border-end-style", "-webkit-border-end-width"])], ["-webkit-border-after", new window.Set(["-webkit-border-after-color", "-webkit-border-after-style", "-webkit-border-after-width"])]]),
	      Sl = new window.Map([["background-position-x", "background-position"], ["background-position-y", "background-position"], ["background-repeat-x", "background-repeat"], ["background-repeat-y", "background-repeat"]]);

	xl.forEach((e, t) => wl.set(t, e)), _l.forEach((e, t) => wl.set(t, e));
	const Cl = new window.Map();

	function zl(e, t) {
	  const n = wl.get(e);
	  if (n) return [`-${t}-${e}`, new window.Set(window.Array.from(n, e => `-${t}-${e}`))];
	}

	function Al(e, t) {
	  const n = wl.get(e);
	  return !!n && n.has(t);
	}

	wl.forEach((e, t) => {
	  e.forEach(e => {
	    Cl.get(e) || Cl.set(e, new window.Set()), Cl.get(e).add(t);
	  });
	});
	var Tl = {
	  isShorthandFor: Al,
	  hasShorthand: function (e) {
	    return Cl.has(e);
	  },
	  hasShorthandWithin: function (e, t) {
	    return t.some(t => Al(t, e));
	  },
	  getShorthands: function (e) {
	    return Cl.get(e);
	  },
	  preferredShorthand: function (e) {
	    return Sl.get(e);
	  }
	};
	const {
	  preferredShorthand: El,
	  getShorthands: Pl
	} = Tl,
	      Ll = {
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

	function Ol(e, t) {
	  return {
	    type: "Declaration",
	    important: Boolean(e.style.getPropertyPriority(t)),
	    property: t,
	    value: {
	      type: "Raw",
	      value: e.style.getPropertyValue(t)
	    }
	  };
	}

	var Dl = function e(t) {
	  return window.Array.from(t, t => {
	    const n = Ll[t.type],
	          r = {};

	    if (n.atrule) {
	      r.type = "Atrule";
	      const [e, a] = t.cssText.match(new RegExp("^@(-\\w+-)?" + n.atrule));
	      r.name = a ? a + n.atrule : n.atrule;
	    } else r.type = "Rule";

	    let a;

	    if ("selector" === n.prelude ? a = t.selectorText : "key" === n.prelude ? a = t.keyText : "condition" === n.prelude ? a = t.conditionText : "name" === n.prelude ? a = t.name : "import" === n.prelude ? a = `url("${t.href}") ${t.media.mediaText}` : "namespace" === n.prelude ? a = `${t.prefix} url("${t.namespaceURI}")` : "charset" === n.prelude && (a = `"${t.encoding}"`), a) {
	      const e = n.atrule ? {
	        context: "atrulePrelude",
	        atrule: n.atrule
	      } : {
	        context: "selectorList"
	      };
	      r.prelude = vl.toPlainObject(vl.parse(a, e));
	    } else r.prelude = null;

	    if ("style" === n.block) {
	      const e = new window.Set(),
	            n = window.Array.from(t.style).reduce((n, r) => {
	        const a = El(r) || r;
	        n.set(a, Ol(t, a));
	        const i = Pl(r);
	        return i && i.forEach(t => e.add(t)), n;
	      }, new window.Map());
	      e.forEach(e => {
	        t.style.getPropertyValue(e) && n.set(e, Ol(t, e));
	      }), r.block = {
	        type: "Block",
	        children: window.Array.from(n.values())
	      };
	    } else "nested" === n.block ? r.block = {
	      type: "Block",
	      children: e(t.cssRules)
	    } : r.block = null;

	    return r;
	  });
	};

	var Rl = function (e) {
	  const t = vl.parse(e, {
	    context: "stylesheet",
	    parseAtrulePrelude: !0,
	    parseRulePrelude: !0,
	    parseValue: !1,
	    parseCustomProperty: !1
	  });
	  return vl.walk(t, {
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

	  }), vl.walk(t, {
	    visit: "AtrulePrelude",

	    enter(e) {
	      if (["import", "namespace"].includes(this.atrule.name)) {
	        const t = e.children.toArray(),
	              n = "import" === e.name ? 0 : t.length - 1,
	              r = t[n];
	        let a;
	        "String" === r.type ? a = r.value.slice(1, -1) : "Url" === r.type && ("String" === r.value.type ? a = r.value.value.slice(1, -1) : "Raw" === r.value.type && (a = r.value.value)), a && (t[n] = {
	          type: "Url",
	          value: {
	            type: "String",
	            value: `"${a}"`
	          }
	        }, e.children.fromArray(t));
	      }
	    }

	  }), vl.toPlainObject(t);
	};

	const {
	  isShorthandFor: Nl,
	  hasShorthandWithin: Bl
	} = Tl,
	      Il = {
	  "word-wrap": "overflow-wrap",
	  clip: "clip-path"
	};

	function Ml(e, t) {
	  const n = new window.Map();
	  e.forEach(({
	    type: e,
	    property: t,
	    important: r,
	    value: {
	      value: a
	    } = {}
	  }) => {
	    if ("Declaration" !== e) return;
	    let i = n.get(t);
	    i || (i = new window.Map(), n.set(t, i)), i.set(a, r);
	  }), t.forEach(({
	    type: e,
	    property: t,
	    important: r,
	    value: {
	      value: a
	    } = {}
	  }) => {
	    if ("Declaration" !== e) return;
	    if (Bl(t, window.Array.from(n.keys()))) return;
	    let i = n.get(t);
	    i ? i.has(a) ? i.get(a) !== r && i.forEach((e, t) => i.set(t, r)) : i.clear() : (i = new window.Map(), n.set(t, i)), i.set(a, r);
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

	function jl(e) {
	  return "Rule" === e.type || /^(-\w+-)?(page|font-face)$/.test(e.name);
	}

	function Fl(e, t, n, r) {
	  for (let a = t; a < n; ++a) r(e[a], a, e);
	}

	var Ul = function e(t, n) {
	  let r = 0;
	  const a = [];
	  return t.forEach(t => {
	    const i = {};
	    i.type = t.type, i.name = t.name, i.prelude = t.prelude, i.block = t.block;

	    const o = function (e, t, n) {
	      return function (e, t, n) {
	        for (let r = t; r < e.length; ++r) if (n(e[r], r, e)) return r;

	        return -1;
	      }(e, t, e => {
	        return e.type === n.type && e.name === n.name && (a = e.prelude, i = n.prelude, !a && !i || a.type === i.type && function e(t, n) {
	          return !Array.isArray(t) && !Array.isArray(n) || window.Array.isArray(t) && window.Array.isArray(n) && t.length === n.length && t.every((t, r) => {
	            const a = n[r];
	            return t.type === a.type && t.name === a.name && (t.value === a.value || t.value.type === a.value.type && t.value.value === a.value.value) && e(t.children, a.children);
	          });
	        }(a.children, i.children)) && (!jl(n) || (t = e.block.children, (r = n.block.children).reduce((e, n) => {
	          var r;
	          return e + ("Declaration" === n.type && (r = n.property, /^(-\w+-)/.test(r) || t.some(e => function (e, t) {
	            const n = Il[e] || e,
	                  r = Il[t] || t;
	            return n === r || Nl(r, n) || Nl(n, r);
	          }(e.property, n.property))) ? 1 : 0);
	        }, 0) >= r.length));
	        var t, r, a, i;
	      });
	    }(n, r, t);

	    o > r && Fl(n, r, o, e => a.push(e)), o >= 0 && (r = o + 1, !function (e) {
	      return "Atrule" === e.type && /^(-\w+-)?(media|supports|document|keyframes)$/.test(e.name);
	    }(t) ? jl(t) && (i.block = {
	      type: "Block",
	      children: Ml(t.block.children, n[o].block.children)
	    }) : i.block = {
	      type: "Block",
	      children: e(t.block.children, n[o].block.children)
	    }), a.push(i);
	  }, []), r < n.length && Fl(n, r, n.length, e => a.push(e)), a;
	},
	    ql = () => {};

	var Wl = function (e) {
	  const t = window.Array.from(e.attributes).map(t => "id" === t.name ? "#" + t.value : "class" === t.name ? window.Array.from(e.classList).map(e => "." + e).join("") : `[${t.name}="${t.value}"]`).join("");
	  return `${e.nodeName}${t}`;
	};

	var Yl = function (e, t = ql) {
	  t("[processInlineCss] processing inline css for", Wl(e));

	  try {
	    const n = Rl(e.textContent);
	    t("[processInlineCss] created AST for textContent");
	    const r = Dl(e.sheet.cssRules);
	    t("[processInlineCss] created AST for CSSOM");
	    const a = Ul(n.children, r);
	    t("[processInlineCss] merged AST");
	    const i = vl.generate(vl.fromPlainObject({
	      type: "StyleSheet",
	      children: a
	    }));
	    return t("[processInlineCss] generated cssText of length", i.length), i;
	  } catch (n) {
	    return t("[processInlineCss] error while processing inline css:", n.message, n), e.textContent;
	  }
	};

	var Hl = function (e) {
	  const t = /url\((?!['"]?:)['"]?([^'")]*)['"]?\)/g,
	        n = [];
	  let r;

	  for (; null !== (r = t.exec(e));) n.push(r[1]);

	  return n;
	};

	var Zl = function (e) {
	  const t = e.getAttribute("style");
	  if (t) return Hl(t);
	};

	const Vl = /(\S+)(?:\s+[\d.]+[wx])?(?:,|$)/g;

	var $l = function (e) {
	  const t = (e.matches || e.msMatchesSelector).bind(e);
	  let n = [];

	  if (t("img[srcset],source[srcset]") && (n = n.concat(function (e, t, n) {
	    const r = [],
	          a = new RegExp(e.source, e.flags),
	          i = a.global;
	    let o;

	    for (; (o = a.exec(t)) && (r.push(n(o)), i););

	    return r;
	  }(Vl, e.getAttribute("srcset"), e => e[1]))), t('img[src],source[src],input[type="image"][src],audio[src],video[src]') && n.push(e.getAttribute("src")), t("image,use")) {
	    const t = e.getAttribute("href") || e.getAttribute("xlink:href");
	    t && "#" !== t[0] && n.push(t);
	  }

	  t("object") && e.getAttribute("data") && n.push(e.getAttribute("data")), t('link[rel~="stylesheet"], link[as="stylesheet"]') && n.push(e.getAttribute("href")), t("video[poster]") && n.push(e.getAttribute("poster"));
	  const r = Zl(e);
	  return r && (n = n.concat(r)), n;
	};

	var Kl = function (e) {
	  const t = Dl(e.cssRules);
	  return vl.generate(vl.fromPlainObject({
	    type: "StyleSheet",
	    children: t
	  }));
	};

	var Gl = function (e) {
	  const {
	    display: t
	  } = e.ownerDocument.defaultView.getComputedStyle(e),
	        {
	    width: n,
	    height: r
	  } = e.getBoundingClientRect();
	  return "none" === t || 0 === n || 0 === r;
	};

	const {
	  absolutizeUrl: Xl,
	  isInlineFrame: Ql,
	  isAccessibleFrame: Jl
	} = c,
	      ec = new window.Set(["date", "datetime-local", "email", "month", "number", "password", "search", "tel", "text", "time", "url", "week"]),
	      tc = /^on[a-z]+$/;

	function nc({
	  attributes: e = {}
	}) {
	  return window.Object.keys(e).filter(t => e[t] && e[t].name);
	}

	function rc(e, t, n) {
	  const r = e.find(e => e.name === t);
	  r ? r.value = n : e.push({
	    name: t,
	    value: n
	  });
	}

	function ac(e) {
	  return window.Array.from(e.adoptedStyleSheets).map(Kl);
	}

	var ic = function (e, t, n = ql) {
	  const r = [{
	    nodeType: Node.DOCUMENT_NODE
	  }],
	        a = [e],
	        i = [],
	        o = [],
	        s = [],
	        l = [];
	  let c = [];
	  return r[0].childNodeIndexes = h(r, e.childNodes), e.adoptedStyleSheets && e.adoptedStyleSheets.length > 0 && (r[0].exp_adoptedStyleSheets = ac(e)), {
	    cdt: r,
	    docRoots: a,
	    canvasElements: i,
	    frames: s,
	    inlineFrames: o,
	    crossFramesSelectors: l,
	    linkUrls: c
	  };

	  function h(e, r) {
	    if (!r || 0 === r.length) return null;
	    const d = [];
	    return window.Array.prototype.forEach.call(r, r => {
	      const p = function e(r, d) {
	        let p, f;
	        const {
	          nodeType: m
	        } = d;
	        if ([Node.ELEMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].includes(m)) {
	          if ("SCRIPT" !== d.nodeName) {
	            if ("STYLE" === d.nodeName && d.sheet && d.sheet.cssRules.length && (r.push(function (e, t) {
	              return {
	                nodeType: Node.TEXT_NODE,
	                nodeValue: Yl(e, t)
	              };
	            }(d, n)), f = [r.length - 1]), "TEXTAREA" === d.tagName && d.value !== d.textContent && (r.push(function (e) {
	              return {
	                nodeType: Node.TEXT_NODE,
	                nodeValue: e.value
	              };
	            }(d)), f = [r.length - 1]), p = function (e) {
	              const t = {
	                nodeType: e.nodeType,
	                nodeName: e.nodeName,
	                attributes: nc(e).map(t => {
	                  let n = e.attributes[t].value;
	                  const r = e.attributes[t].name;
	                  return /^blob:/.test(n) ? n = n.replace(/^blob:/, "") : tc.test(r) ? n = "" : "IFRAME" === e.nodeName && Jl(e) && "src" === r && "about:blank" !== e.contentDocument.location.href && e.contentDocument.location.href !== Xl(n, e.ownerDocument.location.href) && (n = e.contentDocument.location.href), {
	                    name: r,
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

	              "INPUT" === e.tagName && ec.has(e.type) && (e.attributes.value && e.attributes.value.value) !== e.value && rc(t.attributes, "value", e.value);
	              "OPTION" === e.tagName && e.parentElement.selectedOptions && window.Array.from(e.parentElement.selectedOptions).indexOf(e) > -1 && rc(t.attributes, "selected", "");
	              "STYLE" === e.tagName && e.sheet && e.sheet.disabled && t.attributes.push({
	                name: "data-applitools-disabled",
	                value: ""
	              });
	              "LINK" === e.tagName && "text/css" === e.type && e.sheet && e.sheet.disabled && rc(t.attributes, "disabled", "");
	              return t;
	            }(d), p.childNodeIndexes = f || (d.childNodes.length ? h(r, d.childNodes) : []), d.shadowRoot && ("undefined" == typeof window || "function" == typeof d.attachShadow && /native code/.test(d.attachShadow.toString()) ? (p.shadowRootIndex = e(r, d.shadowRoot), a.push(d.shadowRoot)) : d.shadowRoot.childNodes && d.shadowRoot.childNodes.length && (p.childNodeIndexes = p.childNodeIndexes.concat(h(r, d.shadowRoot.childNodes)))), "CANVAS" === d.nodeName) {
	              const e = Xl(`applitools-canvas-${u()}.png`, t);
	              p.attributes.push({
	                name: "data-applitools-src",
	                value: e
	              }), i.push({
	                element: d,
	                url: e
	              });
	            }

	            if ("IFRAME" === d.nodeName) if (Gl(d)) p.attributes.forEach(e => {
	              "src" !== e.name && "srcdoc" !== e.name || (p.attributes.push({
	                name: "data-applitools-original-" + e.name,
	                value: e.value
	              }), e.value = "");
	            });else {
	              const e = u();
	              if (d.setAttribute("data-applitools-selector", e), Jl(d)) {
	                if (Ql(d)) {
	                  const e = /^https?:$/.test(d.contentDocument.location.protocol) ? d.contentDocument.location.href : Xl("?applitools-iframe=" + u(), t);
	                  p.attributes.push({
	                    name: "data-applitools-src",
	                    value: e
	                  }), o.push({
	                    element: d,
	                    url: e
	                  });
	                } else s.push({
	                  element: d
	                });
	              } else {
	                const t = `[data-applitools-selector="${e}"]`;
	                l.push(t);
	              }
	            }
	            d.adoptedStyleSheets && d.adoptedStyleSheets.length > 0 && (p.exp_adoptedStyleSheets = ac(d));
	          } else p = function (e) {
	            return {
	              nodeType: Node.ELEMENT_NODE,
	              nodeName: "SCRIPT",
	              attributes: nc(e).map(t => {
	                const n = e.attributes[t].name;
	                return {
	                  name: n,
	                  value: tc.test(n) ? "" : e.attributes[t].value
	                };
	              }).filter(e => "src" !== e.name),
	              childNodeIndexes: []
	            };
	          }(d);
	        } else m === Node.TEXT_NODE ? p = function (e) {
	          return {
	            nodeType: Node.TEXT_NODE,
	            nodeValue: e.nodeValue
	          };
	        }(d) : m === Node.DOCUMENT_TYPE_NODE && (p = function (e) {
	          return {
	            nodeType: Node.DOCUMENT_TYPE_NODE,
	            nodeName: e.nodeName
	          };
	        }(d));

	        if (p) {
	          if (m === Node.ELEMENT_NODE) {
	            const e = $l(d);
	            e.length > 0 && (c = c.concat(e));
	          }

	          return r.push(p), r.length - 1;
	        }

	        return null;
	      }(e, r);

	      null !== p && d.push(p);
	    }), d;
	  }
	};

	var oc = function (e) {
	  const t = [];
	  return new window.Set(e).forEach(e => e && t.push(e)), t;
	};

	var sc = function (e) {
	  return e.reduce(({
	    resourceUrls: e,
	    blobsObj: t
	  }, {
	    resourceUrls: n,
	    blobsObj: r
	  }) => ({
	    resourceUrls: oc(e.concat(n)),
	    blobsObj: window.Object.assign(t, r)
	  }), {
	    resourceUrls: [],
	    blobsObj: {}
	  });
	};

	var lc = function ({
	  processResource: e,
	  aggregateResourceUrlsAndBlobs: t
	}) {
	  return function n({
	    documents: r,
	    urls: a,
	    forceCreateStyle: i = !1,
	    skipResources: o
	  }) {
	    return Promise.all(a.map(t => e({
	      url: t,
	      documents: r,
	      getResourceUrlsAndBlobs: n,
	      forceCreateStyle: i,
	      skipResources: o
	    }))).then(e => t(e));
	  };
	},
	    cc = lr(function (e, t) {
	  var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;

	  function r(e, t) {
	    return window.Object.prototype.hasOwnProperty.call(e, t);
	  }

	  t.assign = function (e) {
	    for (var t = window.Array.prototype.slice.call(arguments, 1); t.length;) {
	      var n = t.shift();

	      if (n) {
	        if ("object" != typeof n) throw new TypeError(n + "must be non-object");

	        for (var a in n) r(n, a) && (e[a] = n[a]);
	      }
	    }

	    return e;
	  }, t.shrinkBuf = function (e, t) {
	    return e.length === t ? e : e.subarray ? e.subarray(0, t) : (e.length = t, e);
	  };
	  var a = {
	    arraySet: function (e, t, n, r, a) {
	      if (t.subarray && e.subarray) e.set(t.subarray(n, n + r), a);else for (var i = 0; i < r; i++) e[a + i] = t[n + i];
	    },
	    flattenChunks: function (e) {
	      var t, n, r, a, i, o;

	      for (r = 0, t = 0, n = e.length; t < n; t++) r += e[t].length;

	      for (o = new Uint8Array(r), a = 0, t = 0, n = e.length; t < n; t++) i = e[t], o.set(i, a), a += i.length;

	      return o;
	    }
	  },
	      i = {
	    arraySet: function (e, t, n, r, a) {
	      for (var i = 0; i < r; i++) e[a + i] = t[n + i];
	    },
	    flattenChunks: function (e) {
	      return [].concat.apply([], e);
	    }
	  };
	  t.setTyped = function (e) {
	    e ? (t.Buf8 = Uint8Array, t.Buf16 = Uint16Array, t.Buf32 = Int32Array, t.assign(t, a)) : (t.Buf8 = window.Array, t.Buf16 = window.Array, t.Buf32 = window.Array, t.assign(t, i));
	  }, t.setTyped(n);
	});

	cc.assign, cc.shrinkBuf, cc.setTyped, cc.Buf8, cc.Buf16, cc.Buf32;

	function uc(e) {
	  for (var t = e.length; --t >= 0;) e[t] = 0;
	}

	var hc = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
	    dc = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
	    pc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
	    fc = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
	    mc = new window.Array(576);
	uc(mc);
	var gc = new window.Array(60);
	uc(gc);
	var bc = new window.Array(512);
	uc(bc);
	var yc = new window.Array(256);
	uc(yc);
	var kc = new window.Array(29);
	uc(kc);

	var vc,
	    wc,
	    xc,
	    _c = new window.Array(30);

	function Sc(e, t, n, r, a) {
	  this.static_tree = e, this.extra_bits = t, this.extra_base = n, this.elems = r, this.max_length = a, this.has_stree = e && e.length;
	}

	function Cc(e, t) {
	  this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
	}

	function zc(e) {
	  return e < 256 ? bc[e] : bc[256 + (e >>> 7)];
	}

	function Ac(e, t) {
	  e.pending_buf[e.pending++] = 255 & t, e.pending_buf[e.pending++] = t >>> 8 & 255;
	}

	function Tc(e, t, n) {
	  e.bi_valid > 16 - n ? (e.bi_buf |= t << e.bi_valid & 65535, Ac(e, e.bi_buf), e.bi_buf = t >> 16 - e.bi_valid, e.bi_valid += n - 16) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += n);
	}

	function Ec(e, t, n) {
	  Tc(e, n[2 * t], n[2 * t + 1]);
	}

	function Pc(e, t) {
	  var n = 0;

	  do {
	    n |= 1 & e, e >>>= 1, n <<= 1;
	  } while (--t > 0);

	  return n >>> 1;
	}

	function Lc(e, t, n) {
	  var r,
	      a,
	      i = new window.Array(16),
	      o = 0;

	  for (r = 1; r <= 15; r++) i[r] = o = o + n[r - 1] << 1;

	  for (a = 0; a <= t; a++) {
	    var s = e[2 * a + 1];
	    0 !== s && (e[2 * a] = Pc(i[s]++, s));
	  }
	}

	function Oc(e) {
	  var t;

	  for (t = 0; t < 286; t++) e.dyn_ltree[2 * t] = 0;

	  for (t = 0; t < 30; t++) e.dyn_dtree[2 * t] = 0;

	  for (t = 0; t < 19; t++) e.bl_tree[2 * t] = 0;

	  e.dyn_ltree[512] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0;
	}

	function Dc(e) {
	  e.bi_valid > 8 ? Ac(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
	}

	function Rc(e, t, n, r) {
	  var a = 2 * t,
	      i = 2 * n;
	  return e[a] < e[i] || e[a] === e[i] && r[t] <= r[n];
	}

	function Nc(e, t, n) {
	  for (var r = e.heap[n], a = n << 1; a <= e.heap_len && (a < e.heap_len && Rc(t, e.heap[a + 1], e.heap[a], e.depth) && a++, !Rc(t, r, e.heap[a], e.depth));) e.heap[n] = e.heap[a], n = a, a <<= 1;

	  e.heap[n] = r;
	}

	function Bc(e, t, n) {
	  var r,
	      a,
	      i,
	      o,
	      s = 0;
	  if (0 !== e.last_lit) do {
	    r = e.pending_buf[e.d_buf + 2 * s] << 8 | e.pending_buf[e.d_buf + 2 * s + 1], a = e.pending_buf[e.l_buf + s], s++, 0 === r ? Ec(e, a, t) : (Ec(e, (i = yc[a]) + 256 + 1, t), 0 !== (o = hc[i]) && Tc(e, a -= kc[i], o), Ec(e, i = zc(--r), n), 0 !== (o = dc[i]) && Tc(e, r -= _c[i], o));
	  } while (s < e.last_lit);
	  Ec(e, 256, t);
	}

	function Ic(e, t) {
	  var n,
	      r,
	      a,
	      i = t.dyn_tree,
	      o = t.stat_desc.static_tree,
	      s = t.stat_desc.has_stree,
	      l = t.stat_desc.elems,
	      c = -1;

	  for (e.heap_len = 0, e.heap_max = 573, n = 0; n < l; n++) 0 !== i[2 * n] ? (e.heap[++e.heap_len] = c = n, e.depth[n] = 0) : i[2 * n + 1] = 0;

	  for (; e.heap_len < 2;) i[2 * (a = e.heap[++e.heap_len] = c < 2 ? ++c : 0)] = 1, e.depth[a] = 0, e.opt_len--, s && (e.static_len -= o[2 * a + 1]);

	  for (t.max_code = c, n = e.heap_len >> 1; n >= 1; n--) Nc(e, i, n);

	  a = l;

	  do {
	    n = e.heap[1], e.heap[1] = e.heap[e.heap_len--], Nc(e, i, 1), r = e.heap[1], e.heap[--e.heap_max] = n, e.heap[--e.heap_max] = r, i[2 * a] = i[2 * n] + i[2 * r], e.depth[a] = (e.depth[n] >= e.depth[r] ? e.depth[n] : e.depth[r]) + 1, i[2 * n + 1] = i[2 * r + 1] = a, e.heap[1] = a++, Nc(e, i, 1);
	  } while (e.heap_len >= 2);

	  e.heap[--e.heap_max] = e.heap[1], function (e, t) {
	    var n,
	        r,
	        a,
	        i,
	        o,
	        s,
	        l = t.dyn_tree,
	        c = t.max_code,
	        u = t.stat_desc.static_tree,
	        h = t.stat_desc.has_stree,
	        d = t.stat_desc.extra_bits,
	        p = t.stat_desc.extra_base,
	        f = t.stat_desc.max_length,
	        m = 0;

	    for (i = 0; i <= 15; i++) e.bl_count[i] = 0;

	    for (l[2 * e.heap[e.heap_max] + 1] = 0, n = e.heap_max + 1; n < 573; n++) (i = l[2 * l[2 * (r = e.heap[n]) + 1] + 1] + 1) > f && (i = f, m++), l[2 * r + 1] = i, r > c || (e.bl_count[i]++, o = 0, r >= p && (o = d[r - p]), s = l[2 * r], e.opt_len += s * (i + o), h && (e.static_len += s * (u[2 * r + 1] + o)));

	    if (0 !== m) {
	      do {
	        for (i = f - 1; 0 === e.bl_count[i];) i--;

	        e.bl_count[i]--, e.bl_count[i + 1] += 2, e.bl_count[f]--, m -= 2;
	      } while (m > 0);

	      for (i = f; 0 !== i; i--) for (r = e.bl_count[i]; 0 !== r;) (a = e.heap[--n]) > c || (l[2 * a + 1] !== i && (e.opt_len += (i - l[2 * a + 1]) * l[2 * a], l[2 * a + 1] = i), r--);
	    }
	  }(e, t), Lc(i, c, e.bl_count);
	}

	function Mc(e, t, n) {
	  var r,
	      a,
	      i = -1,
	      o = t[1],
	      s = 0,
	      l = 7,
	      c = 4;

	  for (0 === o && (l = 138, c = 3), t[2 * (n + 1) + 1] = 65535, r = 0; r <= n; r++) a = o, o = t[2 * (r + 1) + 1], ++s < l && a === o || (s < c ? e.bl_tree[2 * a] += s : 0 !== a ? (a !== i && e.bl_tree[2 * a]++, e.bl_tree[32]++) : s <= 10 ? e.bl_tree[34]++ : e.bl_tree[36]++, s = 0, i = a, 0 === o ? (l = 138, c = 3) : a === o ? (l = 6, c = 3) : (l = 7, c = 4));
	}

	function jc(e, t, n) {
	  var r,
	      a,
	      i = -1,
	      o = t[1],
	      s = 0,
	      l = 7,
	      c = 4;

	  for (0 === o && (l = 138, c = 3), r = 0; r <= n; r++) if (a = o, o = t[2 * (r + 1) + 1], !(++s < l && a === o)) {
	    if (s < c) do {
	      Ec(e, a, e.bl_tree);
	    } while (0 != --s);else 0 !== a ? (a !== i && (Ec(e, a, e.bl_tree), s--), Ec(e, 16, e.bl_tree), Tc(e, s - 3, 2)) : s <= 10 ? (Ec(e, 17, e.bl_tree), Tc(e, s - 3, 3)) : (Ec(e, 18, e.bl_tree), Tc(e, s - 11, 7));
	    s = 0, i = a, 0 === o ? (l = 138, c = 3) : a === o ? (l = 6, c = 3) : (l = 7, c = 4);
	  }
	}

	uc(_c);
	var Fc = !1;

	function Uc(e, t, n, r) {
	  Tc(e, 0 + (r ? 1 : 0), 3), function (e, t, n, r) {
	    Dc(e), r && (Ac(e, n), Ac(e, ~n)), cc.arraySet(e.pending_buf, e.window, t, n, e.pending), e.pending += n;
	  }(e, t, n, !0);
	}

	var qc = {
	  _tr_init: function (e) {
	    Fc || (!function () {
	      var e,
	          t,
	          n,
	          r,
	          a,
	          i = new window.Array(16);

	      for (n = 0, r = 0; r < 28; r++) for (kc[r] = n, e = 0; e < 1 << hc[r]; e++) yc[n++] = r;

	      for (yc[n - 1] = r, a = 0, r = 0; r < 16; r++) for (_c[r] = a, e = 0; e < 1 << dc[r]; e++) bc[a++] = r;

	      for (a >>= 7; r < 30; r++) for (_c[r] = a << 7, e = 0; e < 1 << dc[r] - 7; e++) bc[256 + a++] = r;

	      for (t = 0; t <= 15; t++) i[t] = 0;

	      for (e = 0; e <= 143;) mc[2 * e + 1] = 8, e++, i[8]++;

	      for (; e <= 255;) mc[2 * e + 1] = 9, e++, i[9]++;

	      for (; e <= 279;) mc[2 * e + 1] = 7, e++, i[7]++;

	      for (; e <= 287;) mc[2 * e + 1] = 8, e++, i[8]++;

	      for (Lc(mc, 287, i), e = 0; e < 30; e++) gc[2 * e + 1] = 5, gc[2 * e] = Pc(e, 5);

	      vc = new Sc(mc, hc, 257, 286, 15), wc = new Sc(gc, dc, 0, 30, 15), xc = new Sc(new window.Array(0), pc, 0, 19, 7);
	    }(), Fc = !0), e.l_desc = new Cc(e.dyn_ltree, vc), e.d_desc = new Cc(e.dyn_dtree, wc), e.bl_desc = new Cc(e.bl_tree, xc), e.bi_buf = 0, e.bi_valid = 0, Oc(e);
	  },
	  _tr_stored_block: Uc,
	  _tr_flush_block: function (e, t, n, r) {
	    var a,
	        i,
	        o = 0;
	    e.level > 0 ? (2 === e.strm.data_type && (e.strm.data_type = function (e) {
	      var t,
	          n = 4093624447;

	      for (t = 0; t <= 31; t++, n >>>= 1) if (1 & n && 0 !== e.dyn_ltree[2 * t]) return 0;

	      if (0 !== e.dyn_ltree[18] || 0 !== e.dyn_ltree[20] || 0 !== e.dyn_ltree[26]) return 1;

	      for (t = 32; t < 256; t++) if (0 !== e.dyn_ltree[2 * t]) return 1;

	      return 0;
	    }(e)), Ic(e, e.l_desc), Ic(e, e.d_desc), o = function (e) {
	      var t;

	      for (Mc(e, e.dyn_ltree, e.l_desc.max_code), Mc(e, e.dyn_dtree, e.d_desc.max_code), Ic(e, e.bl_desc), t = 18; t >= 3 && 0 === e.bl_tree[2 * fc[t] + 1]; t--);

	      return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
	    }(e), a = e.opt_len + 3 + 7 >>> 3, (i = e.static_len + 3 + 7 >>> 3) <= a && (a = i)) : a = i = n + 5, n + 4 <= a && -1 !== t ? Uc(e, t, n, r) : 4 === e.strategy || i === a ? (Tc(e, 2 + (r ? 1 : 0), 3), Bc(e, mc, gc)) : (Tc(e, 4 + (r ? 1 : 0), 3), function (e, t, n, r) {
	      var a;

	      for (Tc(e, t - 257, 5), Tc(e, n - 1, 5), Tc(e, r - 4, 4), a = 0; a < r; a++) Tc(e, e.bl_tree[2 * fc[a] + 1], 3);

	      jc(e, e.dyn_ltree, t - 1), jc(e, e.dyn_dtree, n - 1);
	    }(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, o + 1), Bc(e, e.dyn_ltree, e.dyn_dtree)), Oc(e), r && Dc(e);
	  },
	  _tr_tally: function (e, t, n) {
	    return e.pending_buf[e.d_buf + 2 * e.last_lit] = t >>> 8 & 255, e.pending_buf[e.d_buf + 2 * e.last_lit + 1] = 255 & t, e.pending_buf[e.l_buf + e.last_lit] = 255 & n, e.last_lit++, 0 === t ? e.dyn_ltree[2 * n]++ : (e.matches++, t--, e.dyn_ltree[2 * (yc[n] + 256 + 1)]++, e.dyn_dtree[2 * zc(t)]++), e.last_lit === e.lit_bufsize - 1;
	  },
	  _tr_align: function (e) {
	    Tc(e, 2, 3), Ec(e, 256, mc), function (e) {
	      16 === e.bi_valid ? (Ac(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = 255 & e.bi_buf, e.bi_buf >>= 8, e.bi_valid -= 8);
	    }(e);
	  }
	};

	var Wc = function (e, t, n, r) {
	  for (var a = 65535 & e | 0, i = e >>> 16 & 65535 | 0, o = 0; 0 !== n;) {
	    n -= o = n > 2e3 ? 2e3 : n;

	    do {
	      i = i + (a = a + t[r++] | 0) | 0;
	    } while (--o);

	    a %= 65521, i %= 65521;
	  }

	  return a | i << 16 | 0;
	};

	var Yc = function () {
	  for (var e, t = [], n = 0; n < 256; n++) {
	    e = n;

	    for (var r = 0; r < 8; r++) e = 1 & e ? 3988292384 ^ e >>> 1 : e >>> 1;

	    t[n] = e;
	  }

	  return t;
	}();

	var Hc,
	    Zc = function (e, t, n, r) {
	  var a = Yc,
	      i = r + n;
	  e ^= -1;

	  for (var o = r; o < i; o++) e = e >>> 8 ^ a[255 & (e ^ t[o])];

	  return -1 ^ e;
	},
	    Vc = {
	  2: "need dictionary",
	  1: "stream end",
	  0: "",
	  "-1": "file error",
	  "-2": "stream error",
	  "-3": "data error",
	  "-4": "insufficient memory",
	  "-5": "buffer error",
	  "-6": "incompatible version"
	};

	function $c(e, t) {
	  return e.msg = Vc[t], t;
	}

	function Kc(e) {
	  return (e << 1) - (e > 4 ? 9 : 0);
	}

	function Gc(e) {
	  for (var t = e.length; --t >= 0;) e[t] = 0;
	}

	function Xc(e) {
	  var t = e.state,
	      n = t.pending;
	  n > e.avail_out && (n = e.avail_out), 0 !== n && (cc.arraySet(e.output, t.pending_buf, t.pending_out, n, e.next_out), e.next_out += n, t.pending_out += n, e.total_out += n, e.avail_out -= n, t.pending -= n, 0 === t.pending && (t.pending_out = 0));
	}

	function Qc(e, t) {
	  qc._tr_flush_block(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, Xc(e.strm);
	}

	function Jc(e, t) {
	  e.pending_buf[e.pending++] = t;
	}

	function eu(e, t) {
	  e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = 255 & t;
	}

	function tu(e, t) {
	  var n,
	      r,
	      a = e.max_chain_length,
	      i = e.strstart,
	      o = e.prev_length,
	      s = e.nice_match,
	      l = e.strstart > e.w_size - 262 ? e.strstart - (e.w_size - 262) : 0,
	      c = e.window,
	      u = e.w_mask,
	      h = e.prev,
	      d = e.strstart + 258,
	      p = c[i + o - 1],
	      f = c[i + o];
	  e.prev_length >= e.good_match && (a >>= 2), s > e.lookahead && (s = e.lookahead);

	  do {
	    if (c[(n = t) + o] === f && c[n + o - 1] === p && c[n] === c[i] && c[++n] === c[i + 1]) {
	      i += 2, n++;

	      do {} while (c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && c[++i] === c[++n] && i < d);

	      if (r = 258 - (d - i), i = d - 258, r > o) {
	        if (e.match_start = t, o = r, r >= s) break;
	        p = c[i + o - 1], f = c[i + o];
	      }
	    }
	  } while ((t = h[t & u]) > l && 0 != --a);

	  return o <= e.lookahead ? o : e.lookahead;
	}

	function nu(e) {
	  var t,
	      n,
	      r,
	      a,
	      i,
	      o,
	      s,
	      l,
	      c,
	      u,
	      h = e.w_size;

	  do {
	    if (a = e.window_size - e.lookahead - e.strstart, e.strstart >= h + (h - 262)) {
	      cc.arraySet(e.window, e.window, h, h, 0), e.match_start -= h, e.strstart -= h, e.block_start -= h, t = n = e.hash_size;

	      do {
	        r = e.head[--t], e.head[t] = r >= h ? r - h : 0;
	      } while (--n);

	      t = n = h;

	      do {
	        r = e.prev[--t], e.prev[t] = r >= h ? r - h : 0;
	      } while (--n);

	      a += h;
	    }

	    if (0 === e.strm.avail_in) break;
	    if (o = e.strm, s = e.window, l = e.strstart + e.lookahead, c = a, u = void 0, (u = o.avail_in) > c && (u = c), n = 0 === u ? 0 : (o.avail_in -= u, cc.arraySet(s, o.input, o.next_in, u, l), 1 === o.state.wrap ? o.adler = Wc(o.adler, s, u, l) : 2 === o.state.wrap && (o.adler = Zc(o.adler, s, u, l)), o.next_in += u, o.total_in += u, u), e.lookahead += n, e.lookahead + e.insert >= 3) for (i = e.strstart - e.insert, e.ins_h = e.window[i], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[i + 1]) & e.hash_mask; e.insert && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[i + 3 - 1]) & e.hash_mask, e.prev[i & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = i, i++, e.insert--, !(e.lookahead + e.insert < 3)););
	  } while (e.lookahead < 262 && 0 !== e.strm.avail_in);
	}

	function ru(e, t) {
	  for (var n, r;;) {
	    if (e.lookahead < 262) {
	      if (nu(e), e.lookahead < 262 && 0 === t) return 1;
	      if (0 === e.lookahead) break;
	    }

	    if (n = 0, e.lookahead >= 3 && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 3 - 1]) & e.hash_mask, n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), 0 !== n && e.strstart - n <= e.w_size - 262 && (e.match_length = tu(e, n)), e.match_length >= 3) {
	      if (r = qc._tr_tally(e, e.strstart - e.match_start, e.match_length - 3), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= 3) {
	        e.match_length--;

	        do {
	          e.strstart++, e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 3 - 1]) & e.hash_mask, n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart;
	        } while (0 != --e.match_length);

	        e.strstart++;
	      } else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 1]) & e.hash_mask;
	    } else r = qc._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
	    if (r && (Qc(e, !1), 0 === e.strm.avail_out)) return 1;
	  }

	  return e.insert = e.strstart < 2 ? e.strstart : 2, 4 === t ? (Qc(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.last_lit && (Qc(e, !1), 0 === e.strm.avail_out) ? 1 : 2;
	}

	function au(e, t) {
	  for (var n, r, a;;) {
	    if (e.lookahead < 262) {
	      if (nu(e), e.lookahead < 262 && 0 === t) return 1;
	      if (0 === e.lookahead) break;
	    }

	    if (n = 0, e.lookahead >= 3 && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 3 - 1]) & e.hash_mask, n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = 2, 0 !== n && e.prev_length < e.max_lazy_match && e.strstart - n <= e.w_size - 262 && (e.match_length = tu(e, n), e.match_length <= 5 && (1 === e.strategy || 3 === e.match_length && e.strstart - e.match_start > 4096) && (e.match_length = 2)), e.prev_length >= 3 && e.match_length <= e.prev_length) {
	      a = e.strstart + e.lookahead - 3, r = qc._tr_tally(e, e.strstart - 1 - e.prev_match, e.prev_length - 3), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;

	      do {
	        ++e.strstart <= a && (e.ins_h = (e.ins_h << e.hash_shift ^ e.window[e.strstart + 3 - 1]) & e.hash_mask, n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart);
	      } while (0 != --e.prev_length);

	      if (e.match_available = 0, e.match_length = 2, e.strstart++, r && (Qc(e, !1), 0 === e.strm.avail_out)) return 1;
	    } else if (e.match_available) {
	      if ((r = qc._tr_tally(e, 0, e.window[e.strstart - 1])) && Qc(e, !1), e.strstart++, e.lookahead--, 0 === e.strm.avail_out) return 1;
	    } else e.match_available = 1, e.strstart++, e.lookahead--;
	  }

	  return e.match_available && (r = qc._tr_tally(e, 0, e.window[e.strstart - 1]), e.match_available = 0), e.insert = e.strstart < 2 ? e.strstart : 2, 4 === t ? (Qc(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.last_lit && (Qc(e, !1), 0 === e.strm.avail_out) ? 1 : 2;
	}

	function iu(e, t, n, r, a) {
	  this.good_length = e, this.max_lazy = t, this.nice_length = n, this.max_chain = r, this.func = a;
	}

	function ou() {
	  this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = 8, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new cc.Buf16(1146), this.dyn_dtree = new cc.Buf16(122), this.bl_tree = new cc.Buf16(78), Gc(this.dyn_ltree), Gc(this.dyn_dtree), Gc(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new cc.Buf16(16), this.heap = new cc.Buf16(573), Gc(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new cc.Buf16(573), Gc(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
	}

	function su(e) {
	  var t;
	  return e && e.state ? (e.total_in = e.total_out = 0, e.data_type = 2, (t = e.state).pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? 42 : 113, e.adler = 2 === t.wrap ? 0 : 1, t.last_flush = 0, qc._tr_init(t), 0) : $c(e, -2);
	}

	function lu(e) {
	  var t,
	      n = su(e);
	  return 0 === n && ((t = e.state).window_size = 2 * t.w_size, Gc(t.head), t.max_lazy_match = Hc[t.level].max_lazy, t.good_match = Hc[t.level].good_length, t.nice_match = Hc[t.level].nice_length, t.max_chain_length = Hc[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = 2, t.match_available = 0, t.ins_h = 0), n;
	}

	function cu(e, t, n, r, a, i) {
	  if (!e) return -2;
	  var o = 1;
	  if (-1 === t && (t = 6), r < 0 ? (o = 0, r = -r) : r > 15 && (o = 2, r -= 16), a < 1 || a > 9 || 8 !== n || r < 8 || r > 15 || t < 0 || t > 9 || i < 0 || i > 4) return $c(e, -2);
	  8 === r && (r = 9);
	  var s = new ou();
	  return e.state = s, s.strm = e, s.wrap = o, s.gzhead = null, s.w_bits = r, s.w_size = 1 << s.w_bits, s.w_mask = s.w_size - 1, s.hash_bits = a + 7, s.hash_size = 1 << s.hash_bits, s.hash_mask = s.hash_size - 1, s.hash_shift = ~~((s.hash_bits + 3 - 1) / 3), s.window = new cc.Buf8(2 * s.w_size), s.head = new cc.Buf16(s.hash_size), s.prev = new cc.Buf16(s.w_size), s.lit_bufsize = 1 << a + 6, s.pending_buf_size = 4 * s.lit_bufsize, s.pending_buf = new cc.Buf8(s.pending_buf_size), s.d_buf = 1 * s.lit_bufsize, s.l_buf = 3 * s.lit_bufsize, s.level = t, s.strategy = i, s.method = n, lu(e);
	}

	Hc = [new iu(0, 0, 0, 0, function (e, t) {
	  var n = 65535;

	  for (n > e.pending_buf_size - 5 && (n = e.pending_buf_size - 5);;) {
	    if (e.lookahead <= 1) {
	      if (nu(e), 0 === e.lookahead && 0 === t) return 1;
	      if (0 === e.lookahead) break;
	    }

	    e.strstart += e.lookahead, e.lookahead = 0;
	    var r = e.block_start + n;
	    if ((0 === e.strstart || e.strstart >= r) && (e.lookahead = e.strstart - r, e.strstart = r, Qc(e, !1), 0 === e.strm.avail_out)) return 1;
	    if (e.strstart - e.block_start >= e.w_size - 262 && (Qc(e, !1), 0 === e.strm.avail_out)) return 1;
	  }

	  return e.insert = 0, 4 === t ? (Qc(e, !0), 0 === e.strm.avail_out ? 3 : 4) : (e.strstart > e.block_start && (Qc(e, !1), e.strm.avail_out), 1);
	}), new iu(4, 4, 8, 4, ru), new iu(4, 5, 16, 8, ru), new iu(4, 6, 32, 32, ru), new iu(4, 4, 16, 16, au), new iu(8, 16, 32, 32, au), new iu(8, 16, 128, 128, au), new iu(8, 32, 128, 256, au), new iu(32, 128, 258, 1024, au), new iu(32, 258, 258, 4096, au)];
	var uu = {
	  deflateInit: function (e, t) {
	    return cu(e, t, 8, 15, 8, 0);
	  },
	  deflateInit2: cu,
	  deflateReset: lu,
	  deflateResetKeep: su,
	  deflateSetHeader: function (e, t) {
	    return e && e.state ? 2 !== e.state.wrap ? -2 : (e.state.gzhead = t, 0) : -2;
	  },
	  deflate: function (e, t) {
	    var n, r, a, i;
	    if (!e || !e.state || t > 5 || t < 0) return e ? $c(e, -2) : -2;
	    if (r = e.state, !e.output || !e.input && 0 !== e.avail_in || 666 === r.status && 4 !== t) return $c(e, 0 === e.avail_out ? -5 : -2);
	    if (r.strm = e, n = r.last_flush, r.last_flush = t, 42 === r.status) if (2 === r.wrap) e.adler = 0, Jc(r, 31), Jc(r, 139), Jc(r, 8), r.gzhead ? (Jc(r, (r.gzhead.text ? 1 : 0) + (r.gzhead.hcrc ? 2 : 0) + (r.gzhead.extra ? 4 : 0) + (r.gzhead.name ? 8 : 0) + (r.gzhead.comment ? 16 : 0)), Jc(r, 255 & r.gzhead.time), Jc(r, r.gzhead.time >> 8 & 255), Jc(r, r.gzhead.time >> 16 & 255), Jc(r, r.gzhead.time >> 24 & 255), Jc(r, 9 === r.level ? 2 : r.strategy >= 2 || r.level < 2 ? 4 : 0), Jc(r, 255 & r.gzhead.os), r.gzhead.extra && r.gzhead.extra.length && (Jc(r, 255 & r.gzhead.extra.length), Jc(r, r.gzhead.extra.length >> 8 & 255)), r.gzhead.hcrc && (e.adler = Zc(e.adler, r.pending_buf, r.pending, 0)), r.gzindex = 0, r.status = 69) : (Jc(r, 0), Jc(r, 0), Jc(r, 0), Jc(r, 0), Jc(r, 0), Jc(r, 9 === r.level ? 2 : r.strategy >= 2 || r.level < 2 ? 4 : 0), Jc(r, 3), r.status = 113);else {
	      var o = 8 + (r.w_bits - 8 << 4) << 8;
	      o |= (r.strategy >= 2 || r.level < 2 ? 0 : r.level < 6 ? 1 : 6 === r.level ? 2 : 3) << 6, 0 !== r.strstart && (o |= 32), o += 31 - o % 31, r.status = 113, eu(r, o), 0 !== r.strstart && (eu(r, e.adler >>> 16), eu(r, 65535 & e.adler)), e.adler = 1;
	    }
	    if (69 === r.status) if (r.gzhead.extra) {
	      for (a = r.pending; r.gzindex < (65535 & r.gzhead.extra.length) && (r.pending !== r.pending_buf_size || (r.gzhead.hcrc && r.pending > a && (e.adler = Zc(e.adler, r.pending_buf, r.pending - a, a)), Xc(e), a = r.pending, r.pending !== r.pending_buf_size));) Jc(r, 255 & r.gzhead.extra[r.gzindex]), r.gzindex++;

	      r.gzhead.hcrc && r.pending > a && (e.adler = Zc(e.adler, r.pending_buf, r.pending - a, a)), r.gzindex === r.gzhead.extra.length && (r.gzindex = 0, r.status = 73);
	    } else r.status = 73;
	    if (73 === r.status) if (r.gzhead.name) {
	      a = r.pending;

	      do {
	        if (r.pending === r.pending_buf_size && (r.gzhead.hcrc && r.pending > a && (e.adler = Zc(e.adler, r.pending_buf, r.pending - a, a)), Xc(e), a = r.pending, r.pending === r.pending_buf_size)) {
	          i = 1;
	          break;
	        }

	        i = r.gzindex < r.gzhead.name.length ? 255 & r.gzhead.name.charCodeAt(r.gzindex++) : 0, Jc(r, i);
	      } while (0 !== i);

	      r.gzhead.hcrc && r.pending > a && (e.adler = Zc(e.adler, r.pending_buf, r.pending - a, a)), 0 === i && (r.gzindex = 0, r.status = 91);
	    } else r.status = 91;
	    if (91 === r.status) if (r.gzhead.comment) {
	      a = r.pending;

	      do {
	        if (r.pending === r.pending_buf_size && (r.gzhead.hcrc && r.pending > a && (e.adler = Zc(e.adler, r.pending_buf, r.pending - a, a)), Xc(e), a = r.pending, r.pending === r.pending_buf_size)) {
	          i = 1;
	          break;
	        }

	        i = r.gzindex < r.gzhead.comment.length ? 255 & r.gzhead.comment.charCodeAt(r.gzindex++) : 0, Jc(r, i);
	      } while (0 !== i);

	      r.gzhead.hcrc && r.pending > a && (e.adler = Zc(e.adler, r.pending_buf, r.pending - a, a)), 0 === i && (r.status = 103);
	    } else r.status = 103;

	    if (103 === r.status && (r.gzhead.hcrc ? (r.pending + 2 > r.pending_buf_size && Xc(e), r.pending + 2 <= r.pending_buf_size && (Jc(r, 255 & e.adler), Jc(r, e.adler >> 8 & 255), e.adler = 0, r.status = 113)) : r.status = 113), 0 !== r.pending) {
	      if (Xc(e), 0 === e.avail_out) return r.last_flush = -1, 0;
	    } else if (0 === e.avail_in && Kc(t) <= Kc(n) && 4 !== t) return $c(e, -5);

	    if (666 === r.status && 0 !== e.avail_in) return $c(e, -5);

	    if (0 !== e.avail_in || 0 !== r.lookahead || 0 !== t && 666 !== r.status) {
	      var s = 2 === r.strategy ? function (e, t) {
	        for (var n;;) {
	          if (0 === e.lookahead && (nu(e), 0 === e.lookahead)) {
	            if (0 === t) return 1;
	            break;
	          }

	          if (e.match_length = 0, n = qc._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, n && (Qc(e, !1), 0 === e.strm.avail_out)) return 1;
	        }

	        return e.insert = 0, 4 === t ? (Qc(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.last_lit && (Qc(e, !1), 0 === e.strm.avail_out) ? 1 : 2;
	      }(r, t) : 3 === r.strategy ? function (e, t) {
	        for (var n, r, a, i, o = e.window;;) {
	          if (e.lookahead <= 258) {
	            if (nu(e), e.lookahead <= 258 && 0 === t) return 1;
	            if (0 === e.lookahead) break;
	          }

	          if (e.match_length = 0, e.lookahead >= 3 && e.strstart > 0 && (r = o[a = e.strstart - 1]) === o[++a] && r === o[++a] && r === o[++a]) {
	            i = e.strstart + 258;

	            do {} while (r === o[++a] && r === o[++a] && r === o[++a] && r === o[++a] && r === o[++a] && r === o[++a] && r === o[++a] && r === o[++a] && a < i);

	            e.match_length = 258 - (i - a), e.match_length > e.lookahead && (e.match_length = e.lookahead);
	          }

	          if (e.match_length >= 3 ? (n = qc._tr_tally(e, 1, e.match_length - 3), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (n = qc._tr_tally(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), n && (Qc(e, !1), 0 === e.strm.avail_out)) return 1;
	        }

	        return e.insert = 0, 4 === t ? (Qc(e, !0), 0 === e.strm.avail_out ? 3 : 4) : e.last_lit && (Qc(e, !1), 0 === e.strm.avail_out) ? 1 : 2;
	      }(r, t) : Hc[r.level].func(r, t);
	      if (3 !== s && 4 !== s || (r.status = 666), 1 === s || 3 === s) return 0 === e.avail_out && (r.last_flush = -1), 0;
	      if (2 === s && (1 === t ? qc._tr_align(r) : 5 !== t && (qc._tr_stored_block(r, 0, 0, !1), 3 === t && (Gc(r.head), 0 === r.lookahead && (r.strstart = 0, r.block_start = 0, r.insert = 0))), Xc(e), 0 === e.avail_out)) return r.last_flush = -1, 0;
	    }

	    return 4 !== t ? 0 : r.wrap <= 0 ? 1 : (2 === r.wrap ? (Jc(r, 255 & e.adler), Jc(r, e.adler >> 8 & 255), Jc(r, e.adler >> 16 & 255), Jc(r, e.adler >> 24 & 255), Jc(r, 255 & e.total_in), Jc(r, e.total_in >> 8 & 255), Jc(r, e.total_in >> 16 & 255), Jc(r, e.total_in >> 24 & 255)) : (eu(r, e.adler >>> 16), eu(r, 65535 & e.adler)), Xc(e), r.wrap > 0 && (r.wrap = -r.wrap), 0 !== r.pending ? 0 : 1);
	  },
	  deflateEnd: function (e) {
	    var t;
	    return e && e.state ? 42 !== (t = e.state.status) && 69 !== t && 73 !== t && 91 !== t && 103 !== t && 113 !== t && 666 !== t ? $c(e, -2) : (e.state = null, 113 === t ? $c(e, -3) : 0) : -2;
	  },
	  deflateSetDictionary: function (e, t) {
	    var n,
	        r,
	        a,
	        i,
	        o,
	        s,
	        l,
	        c,
	        u = t.length;
	    if (!e || !e.state) return -2;
	    if (2 === (i = (n = e.state).wrap) || 1 === i && 42 !== n.status || n.lookahead) return -2;

	    for (1 === i && (e.adler = Wc(e.adler, t, u, 0)), n.wrap = 0, u >= n.w_size && (0 === i && (Gc(n.head), n.strstart = 0, n.block_start = 0, n.insert = 0), c = new cc.Buf8(n.w_size), cc.arraySet(c, t, u - n.w_size, n.w_size, 0), t = c, u = n.w_size), o = e.avail_in, s = e.next_in, l = e.input, e.avail_in = u, e.next_in = 0, e.input = t, nu(n); n.lookahead >= 3;) {
	      r = n.strstart, a = n.lookahead - 2;

	      do {
	        n.ins_h = (n.ins_h << n.hash_shift ^ n.window[r + 3 - 1]) & n.hash_mask, n.prev[r & n.w_mask] = n.head[n.ins_h], n.head[n.ins_h] = r, r++;
	      } while (--a);

	      n.strstart = r, n.lookahead = 2, nu(n);
	    }

	    return n.strstart += n.lookahead, n.block_start = n.strstart, n.insert = n.lookahead, n.lookahead = 0, n.match_length = n.prev_length = 2, n.match_available = 0, e.next_in = s, e.input = l, e.avail_in = o, n.wrap = i, 0;
	  },
	  deflateInfo: "pako deflate (from Nodeca project)"
	},
	    hu = !0,
	    du = !0;

	try {
	  String.fromCharCode.apply(null, [0]);
	} catch (e) {
	  hu = !1;
	}

	try {
	  String.fromCharCode.apply(null, new Uint8Array(1));
	} catch (e) {
	  du = !1;
	}

	for (var pu = new cc.Buf8(256), fu = 0; fu < 256; fu++) pu[fu] = fu >= 252 ? 6 : fu >= 248 ? 5 : fu >= 240 ? 4 : fu >= 224 ? 3 : fu >= 192 ? 2 : 1;

	pu[254] = pu[254] = 1;

	function mu(e, t) {
	  if (t < 65534 && (e.subarray && du || !e.subarray && hu)) return String.fromCharCode.apply(null, cc.shrinkBuf(e, t));

	  for (var n = "", r = 0; r < t; r++) n += String.fromCharCode(e[r]);

	  return n;
	}

	var gu = function (e) {
	  var t,
	      n,
	      r,
	      a,
	      i,
	      o = e.length,
	      s = 0;

	  for (a = 0; a < o; a++) 55296 == (64512 & (n = e.charCodeAt(a))) && a + 1 < o && 56320 == (64512 & (r = e.charCodeAt(a + 1))) && (n = 65536 + (n - 55296 << 10) + (r - 56320), a++), s += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;

	  for (t = new cc.Buf8(s), i = 0, a = 0; i < s; a++) 55296 == (64512 & (n = e.charCodeAt(a))) && a + 1 < o && 56320 == (64512 & (r = e.charCodeAt(a + 1))) && (n = 65536 + (n - 55296 << 10) + (r - 56320), a++), n < 128 ? t[i++] = n : n < 2048 ? (t[i++] = 192 | n >>> 6, t[i++] = 128 | 63 & n) : n < 65536 ? (t[i++] = 224 | n >>> 12, t[i++] = 128 | n >>> 6 & 63, t[i++] = 128 | 63 & n) : (t[i++] = 240 | n >>> 18, t[i++] = 128 | n >>> 12 & 63, t[i++] = 128 | n >>> 6 & 63, t[i++] = 128 | 63 & n);

	  return t;
	},
	    bu = function (e) {
	  return mu(e, e.length);
	},
	    yu = function (e) {
	  for (var t = new cc.Buf8(e.length), n = 0, r = t.length; n < r; n++) t[n] = e.charCodeAt(n);

	  return t;
	},
	    ku = function (e, t) {
	  var n,
	      r,
	      a,
	      i,
	      o = t || e.length,
	      s = new window.Array(2 * o);

	  for (r = 0, n = 0; n < o;) if ((a = e[n++]) < 128) s[r++] = a;else if ((i = pu[a]) > 4) s[r++] = 65533, n += i - 1;else {
	    for (a &= 2 === i ? 31 : 3 === i ? 15 : 7; i > 1 && n < o;) a = a << 6 | 63 & e[n++], i--;

	    i > 1 ? s[r++] = 65533 : a < 65536 ? s[r++] = a : (a -= 65536, s[r++] = 55296 | a >> 10 & 1023, s[r++] = 56320 | 1023 & a);
	  }

	  return mu(s, r);
	},
	    vu = function (e, t) {
	  var n;

	  for ((t = t || e.length) > e.length && (t = e.length), n = t - 1; n >= 0 && 128 == (192 & e[n]);) n--;

	  return n < 0 || 0 === n ? t : n + pu[e[n]] > t ? n : t;
	};

	var wu = function () {
	  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
	},
	    xu = window.Object.prototype.toString;

	function _u(e) {
	  if (!(this instanceof _u)) return new _u(e);
	  this.options = cc.assign({
	    level: -1,
	    method: 8,
	    chunkSize: 16384,
	    windowBits: 15,
	    memLevel: 8,
	    strategy: 0,
	    to: ""
	  }, e || {});
	  var t = this.options;
	  t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new wu(), this.strm.avail_out = 0;
	  var n = uu.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
	  if (0 !== n) throw new Error(Vc[n]);

	  if (t.header && uu.deflateSetHeader(this.strm, t.header), t.dictionary) {
	    var r;
	    if (r = "string" == typeof t.dictionary ? gu(t.dictionary) : "[object ArrayBuffer]" === xu.call(t.dictionary) ? new Uint8Array(t.dictionary) : t.dictionary, 0 !== (n = uu.deflateSetDictionary(this.strm, r))) throw new Error(Vc[n]);
	    this._dict_set = !0;
	  }
	}

	function Su(e, t) {
	  var n = new _u(t);
	  if (n.push(e, !0), n.err) throw n.msg || Vc[n.err];
	  return n.result;
	}

	_u.prototype.push = function (e, t) {
	  var n,
	      r,
	      a = this.strm,
	      i = this.options.chunkSize;
	  if (this.ended) return !1;
	  r = t === ~~t ? t : !0 === t ? 4 : 0, "string" == typeof e ? a.input = gu(e) : "[object ArrayBuffer]" === xu.call(e) ? a.input = new Uint8Array(e) : a.input = e, a.next_in = 0, a.avail_in = a.input.length;

	  do {
	    if (0 === a.avail_out && (a.output = new cc.Buf8(i), a.next_out = 0, a.avail_out = i), 1 !== (n = uu.deflate(a, r)) && 0 !== n) return this.onEnd(n), this.ended = !0, !1;
	    0 !== a.avail_out && (0 !== a.avail_in || 4 !== r && 2 !== r) || ("string" === this.options.to ? this.onData(bu(cc.shrinkBuf(a.output, a.next_out))) : this.onData(cc.shrinkBuf(a.output, a.next_out)));
	  } while ((a.avail_in > 0 || 0 === a.avail_out) && 1 !== n);

	  return 4 === r ? (n = uu.deflateEnd(this.strm), this.onEnd(n), this.ended = !0, 0 === n) : 2 !== r || (this.onEnd(0), a.avail_out = 0, !0);
	}, _u.prototype.onData = function (e) {
	  this.chunks.push(e);
	}, _u.prototype.onEnd = function (e) {
	  0 === e && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = cc.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
	};

	var Cu = {
	  Deflate: _u,
	  deflate: Su,
	  deflateRaw: function (e, t) {
	    return (t = t || {}).raw = !0, Su(e, t);
	  },
	  gzip: function (e, t) {
	    return (t = t || {}).gzip = !0, Su(e, t);
	  }
	},
	    zu = function (e, t) {
	  var n, r, a, i, o, s, l, c, u, h, d, p, f, m, g, b, y, k, v, w, x, _, S, C, z;

	  n = e.state, r = e.next_in, C = e.input, a = r + (e.avail_in - 5), i = e.next_out, z = e.output, o = i - (t - e.avail_out), s = i + (e.avail_out - 257), l = n.dmax, c = n.wsize, u = n.whave, h = n.wnext, d = n.window, p = n.hold, f = n.bits, m = n.lencode, g = n.distcode, b = (1 << n.lenbits) - 1, y = (1 << n.distbits) - 1;

	  e: do {
	    f < 15 && (p += C[r++] << f, f += 8, p += C[r++] << f, f += 8), k = m[p & b];

	    t: for (;;) {
	      if (p >>>= v = k >>> 24, f -= v, 0 === (v = k >>> 16 & 255)) z[i++] = 65535 & k;else {
	        if (!(16 & v)) {
	          if (0 == (64 & v)) {
	            k = m[(65535 & k) + (p & (1 << v) - 1)];
	            continue t;
	          }

	          if (32 & v) {
	            n.mode = 12;
	            break e;
	          }

	          e.msg = "invalid literal/length code", n.mode = 30;
	          break e;
	        }

	        w = 65535 & k, (v &= 15) && (f < v && (p += C[r++] << f, f += 8), w += p & (1 << v) - 1, p >>>= v, f -= v), f < 15 && (p += C[r++] << f, f += 8, p += C[r++] << f, f += 8), k = g[p & y];

	        n: for (;;) {
	          if (p >>>= v = k >>> 24, f -= v, !(16 & (v = k >>> 16 & 255))) {
	            if (0 == (64 & v)) {
	              k = g[(65535 & k) + (p & (1 << v) - 1)];
	              continue n;
	            }

	            e.msg = "invalid distance code", n.mode = 30;
	            break e;
	          }

	          if (x = 65535 & k, f < (v &= 15) && (p += C[r++] << f, (f += 8) < v && (p += C[r++] << f, f += 8)), (x += p & (1 << v) - 1) > l) {
	            e.msg = "invalid distance too far back", n.mode = 30;
	            break e;
	          }

	          if (p >>>= v, f -= v, x > (v = i - o)) {
	            if ((v = x - v) > u && n.sane) {
	              e.msg = "invalid distance too far back", n.mode = 30;
	              break e;
	            }

	            if (_ = 0, S = d, 0 === h) {
	              if (_ += c - v, v < w) {
	                w -= v;

	                do {
	                  z[i++] = d[_++];
	                } while (--v);

	                _ = i - x, S = z;
	              }
	            } else if (h < v) {
	              if (_ += c + h - v, (v -= h) < w) {
	                w -= v;

	                do {
	                  z[i++] = d[_++];
	                } while (--v);

	                if (_ = 0, h < w) {
	                  w -= v = h;

	                  do {
	                    z[i++] = d[_++];
	                  } while (--v);

	                  _ = i - x, S = z;
	                }
	              }
	            } else if (_ += h - v, v < w) {
	              w -= v;

	              do {
	                z[i++] = d[_++];
	              } while (--v);

	              _ = i - x, S = z;
	            }

	            for (; w > 2;) z[i++] = S[_++], z[i++] = S[_++], z[i++] = S[_++], w -= 3;

	            w && (z[i++] = S[_++], w > 1 && (z[i++] = S[_++]));
	          } else {
	            _ = i - x;

	            do {
	              z[i++] = z[_++], z[i++] = z[_++], z[i++] = z[_++], w -= 3;
	            } while (w > 2);

	            w && (z[i++] = z[_++], w > 1 && (z[i++] = z[_++]));
	          }

	          break;
	        }
	      }
	      break;
	    }
	  } while (r < a && i < s);

	  r -= w = f >> 3, p &= (1 << (f -= w << 3)) - 1, e.next_in = r, e.next_out = i, e.avail_in = r < a ? a - r + 5 : 5 - (r - a), e.avail_out = i < s ? s - i + 257 : 257 - (i - s), n.hold = p, n.bits = f;
	},
	    Au = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
	    Tu = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
	    Eu = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
	    Pu = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64],
	    Lu = function (e, t, n, r, a, i, o, s) {
	  var l,
	      c,
	      u,
	      h,
	      d,
	      p,
	      f,
	      m,
	      g,
	      b = s.bits,
	      y = 0,
	      k = 0,
	      v = 0,
	      w = 0,
	      x = 0,
	      _ = 0,
	      S = 0,
	      C = 0,
	      z = 0,
	      A = 0,
	      T = null,
	      E = 0,
	      P = new cc.Buf16(16),
	      L = new cc.Buf16(16),
	      O = null,
	      D = 0;

	  for (y = 0; y <= 15; y++) P[y] = 0;

	  for (k = 0; k < r; k++) P[t[n + k]]++;

	  for (x = b, w = 15; w >= 1 && 0 === P[w]; w--);

	  if (x > w && (x = w), 0 === w) return a[i++] = 20971520, a[i++] = 20971520, s.bits = 1, 0;

	  for (v = 1; v < w && 0 === P[v]; v++);

	  for (x < v && (x = v), C = 1, y = 1; y <= 15; y++) if (C <<= 1, (C -= P[y]) < 0) return -1;

	  if (C > 0 && (0 === e || 1 !== w)) return -1;

	  for (L[1] = 0, y = 1; y < 15; y++) L[y + 1] = L[y] + P[y];

	  for (k = 0; k < r; k++) 0 !== t[n + k] && (o[L[t[n + k]]++] = k);

	  if (0 === e ? (T = O = o, p = 19) : 1 === e ? (T = Au, E -= 257, O = Tu, D -= 257, p = 256) : (T = Eu, O = Pu, p = -1), A = 0, k = 0, y = v, d = i, _ = x, S = 0, u = -1, h = (z = 1 << x) - 1, 1 === e && z > 852 || 2 === e && z > 592) return 1;

	  for (;;) {
	    f = y - S, o[k] < p ? (m = 0, g = o[k]) : o[k] > p ? (m = O[D + o[k]], g = T[E + o[k]]) : (m = 96, g = 0), l = 1 << y - S, v = c = 1 << _;

	    do {
	      a[d + (A >> S) + (c -= l)] = f << 24 | m << 16 | g | 0;
	    } while (0 !== c);

	    for (l = 1 << y - 1; A & l;) l >>= 1;

	    if (0 !== l ? (A &= l - 1, A += l) : A = 0, k++, 0 == --P[y]) {
	      if (y === w) break;
	      y = t[n + o[k]];
	    }

	    if (y > x && (A & h) !== u) {
	      for (0 === S && (S = x), d += v, C = 1 << (_ = y - S); _ + S < w && !((C -= P[_ + S]) <= 0);) _++, C <<= 1;

	      if (z += 1 << _, 1 === e && z > 852 || 2 === e && z > 592) return 1;
	      a[u = A & h] = x << 24 | _ << 16 | d - i | 0;
	    }
	  }

	  return 0 !== A && (a[d + A] = y - S << 24 | 64 << 16 | 0), s.bits = x, 0;
	};

	function Ou(e) {
	  return (e >>> 24 & 255) + (e >>> 8 & 65280) + ((65280 & e) << 8) + ((255 & e) << 24);
	}

	function Du() {
	  this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new cc.Buf16(320), this.work = new cc.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
	}

	function Ru(e) {
	  var t;
	  return e && e.state ? (t = e.state, e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = 1 & t.wrap), t.mode = 1, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new cc.Buf32(852), t.distcode = t.distdyn = new cc.Buf32(592), t.sane = 1, t.back = -1, 0) : -2;
	}

	function Nu(e) {
	  var t;
	  return e && e.state ? ((t = e.state).wsize = 0, t.whave = 0, t.wnext = 0, Ru(e)) : -2;
	}

	function Bu(e, t) {
	  var n, r;
	  return e && e.state ? (r = e.state, t < 0 ? (n = 0, t = -t) : (n = 1 + (t >> 4), t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? -2 : (null !== r.window && r.wbits !== t && (r.window = null), r.wrap = n, r.wbits = t, Nu(e))) : -2;
	}

	function Iu(e, t) {
	  var n, r;
	  return e ? (r = new Du(), e.state = r, r.window = null, 0 !== (n = Bu(e, t)) && (e.state = null), n) : -2;
	}

	var Mu,
	    ju,
	    Fu = !0;

	function Uu(e) {
	  if (Fu) {
	    var t;

	    for (Mu = new cc.Buf32(512), ju = new cc.Buf32(32), t = 0; t < 144;) e.lens[t++] = 8;

	    for (; t < 256;) e.lens[t++] = 9;

	    for (; t < 280;) e.lens[t++] = 7;

	    for (; t < 288;) e.lens[t++] = 8;

	    for (Lu(1, e.lens, 0, 288, Mu, 0, e.work, {
	      bits: 9
	    }), t = 0; t < 32;) e.lens[t++] = 5;

	    Lu(2, e.lens, 0, 32, ju, 0, e.work, {
	      bits: 5
	    }), Fu = !1;
	  }

	  e.lencode = Mu, e.lenbits = 9, e.distcode = ju, e.distbits = 5;
	}

	function qu(e, t, n, r) {
	  var a,
	      i = e.state;
	  return null === i.window && (i.wsize = 1 << i.wbits, i.wnext = 0, i.whave = 0, i.window = new cc.Buf8(i.wsize)), r >= i.wsize ? (cc.arraySet(i.window, t, n - i.wsize, i.wsize, 0), i.wnext = 0, i.whave = i.wsize) : ((a = i.wsize - i.wnext) > r && (a = r), cc.arraySet(i.window, t, n - r, a, i.wnext), (r -= a) ? (cc.arraySet(i.window, t, n - r, r, 0), i.wnext = r, i.whave = i.wsize) : (i.wnext += a, i.wnext === i.wsize && (i.wnext = 0), i.whave < i.wsize && (i.whave += a))), 0;
	}

	var Wu = {
	  inflateReset: Nu,
	  inflateReset2: Bu,
	  inflateResetKeep: Ru,
	  inflateInit: function (e) {
	    return Iu(e, 15);
	  },
	  inflateInit2: Iu,
	  inflate: function (e, t) {
	    var n,
	        r,
	        a,
	        i,
	        o,
	        s,
	        l,
	        c,
	        u,
	        h,
	        d,
	        p,
	        f,
	        m,
	        g,
	        b,
	        y,
	        k,
	        v,
	        w,
	        x,
	        _,
	        S,
	        C,
	        z = 0,
	        A = new cc.Buf8(4),
	        T = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

	    if (!e || !e.state || !e.output || !e.input && 0 !== e.avail_in) return -2;
	    12 === (n = e.state).mode && (n.mode = 13), o = e.next_out, a = e.output, l = e.avail_out, i = e.next_in, r = e.input, s = e.avail_in, c = n.hold, u = n.bits, h = s, d = l, _ = 0;

	    e: for (;;) switch (n.mode) {
	      case 1:
	        if (0 === n.wrap) {
	          n.mode = 13;
	          break;
	        }

	        for (; u < 16;) {
	          if (0 === s) break e;
	          s--, c += r[i++] << u, u += 8;
	        }

	        if (2 & n.wrap && 35615 === c) {
	          n.check = 0, A[0] = 255 & c, A[1] = c >>> 8 & 255, n.check = Zc(n.check, A, 2, 0), c = 0, u = 0, n.mode = 2;
	          break;
	        }

	        if (n.flags = 0, n.head && (n.head.done = !1), !(1 & n.wrap) || (((255 & c) << 8) + (c >> 8)) % 31) {
	          e.msg = "incorrect header check", n.mode = 30;
	          break;
	        }

	        if (8 != (15 & c)) {
	          e.msg = "unknown compression method", n.mode = 30;
	          break;
	        }

	        if (u -= 4, x = 8 + (15 & (c >>>= 4)), 0 === n.wbits) n.wbits = x;else if (x > n.wbits) {
	          e.msg = "invalid window size", n.mode = 30;
	          break;
	        }
	        n.dmax = 1 << x, e.adler = n.check = 1, n.mode = 512 & c ? 10 : 12, c = 0, u = 0;
	        break;

	      case 2:
	        for (; u < 16;) {
	          if (0 === s) break e;
	          s--, c += r[i++] << u, u += 8;
	        }

	        if (n.flags = c, 8 != (255 & n.flags)) {
	          e.msg = "unknown compression method", n.mode = 30;
	          break;
	        }

	        if (57344 & n.flags) {
	          e.msg = "unknown header flags set", n.mode = 30;
	          break;
	        }

	        n.head && (n.head.text = c >> 8 & 1), 512 & n.flags && (A[0] = 255 & c, A[1] = c >>> 8 & 255, n.check = Zc(n.check, A, 2, 0)), c = 0, u = 0, n.mode = 3;

	      case 3:
	        for (; u < 32;) {
	          if (0 === s) break e;
	          s--, c += r[i++] << u, u += 8;
	        }

	        n.head && (n.head.time = c), 512 & n.flags && (A[0] = 255 & c, A[1] = c >>> 8 & 255, A[2] = c >>> 16 & 255, A[3] = c >>> 24 & 255, n.check = Zc(n.check, A, 4, 0)), c = 0, u = 0, n.mode = 4;

	      case 4:
	        for (; u < 16;) {
	          if (0 === s) break e;
	          s--, c += r[i++] << u, u += 8;
	        }

	        n.head && (n.head.xflags = 255 & c, n.head.os = c >> 8), 512 & n.flags && (A[0] = 255 & c, A[1] = c >>> 8 & 255, n.check = Zc(n.check, A, 2, 0)), c = 0, u = 0, n.mode = 5;

	      case 5:
	        if (1024 & n.flags) {
	          for (; u < 16;) {
	            if (0 === s) break e;
	            s--, c += r[i++] << u, u += 8;
	          }

	          n.length = c, n.head && (n.head.extra_len = c), 512 & n.flags && (A[0] = 255 & c, A[1] = c >>> 8 & 255, n.check = Zc(n.check, A, 2, 0)), c = 0, u = 0;
	        } else n.head && (n.head.extra = null);

	        n.mode = 6;

	      case 6:
	        if (1024 & n.flags && ((p = n.length) > s && (p = s), p && (n.head && (x = n.head.extra_len - n.length, n.head.extra || (n.head.extra = new window.Array(n.head.extra_len)), cc.arraySet(n.head.extra, r, i, p, x)), 512 & n.flags && (n.check = Zc(n.check, r, p, i)), s -= p, i += p, n.length -= p), n.length)) break e;
	        n.length = 0, n.mode = 7;

	      case 7:
	        if (2048 & n.flags) {
	          if (0 === s) break e;
	          p = 0;

	          do {
	            x = r[i + p++], n.head && x && n.length < 65536 && (n.head.name += String.fromCharCode(x));
	          } while (x && p < s);

	          if (512 & n.flags && (n.check = Zc(n.check, r, p, i)), s -= p, i += p, x) break e;
	        } else n.head && (n.head.name = null);

	        n.length = 0, n.mode = 8;

	      case 8:
	        if (4096 & n.flags) {
	          if (0 === s) break e;
	          p = 0;

	          do {
	            x = r[i + p++], n.head && x && n.length < 65536 && (n.head.comment += String.fromCharCode(x));
	          } while (x && p < s);

	          if (512 & n.flags && (n.check = Zc(n.check, r, p, i)), s -= p, i += p, x) break e;
	        } else n.head && (n.head.comment = null);

	        n.mode = 9;

	      case 9:
	        if (512 & n.flags) {
	          for (; u < 16;) {
	            if (0 === s) break e;
	            s--, c += r[i++] << u, u += 8;
	          }

	          if (c !== (65535 & n.check)) {
	            e.msg = "header crc mismatch", n.mode = 30;
	            break;
	          }

	          c = 0, u = 0;
	        }

	        n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = !0), e.adler = n.check = 0, n.mode = 12;
	        break;

	      case 10:
	        for (; u < 32;) {
	          if (0 === s) break e;
	          s--, c += r[i++] << u, u += 8;
	        }

	        e.adler = n.check = Ou(c), c = 0, u = 0, n.mode = 11;

	      case 11:
	        if (0 === n.havedict) return e.next_out = o, e.avail_out = l, e.next_in = i, e.avail_in = s, n.hold = c, n.bits = u, 2;
	        e.adler = n.check = 1, n.mode = 12;

	      case 12:
	        if (5 === t || 6 === t) break e;

	      case 13:
	        if (n.last) {
	          c >>>= 7 & u, u -= 7 & u, n.mode = 27;
	          break;
	        }

	        for (; u < 3;) {
	          if (0 === s) break e;
	          s--, c += r[i++] << u, u += 8;
	        }

	        switch (n.last = 1 & c, u -= 1, 3 & (c >>>= 1)) {
	          case 0:
	            n.mode = 14;
	            break;

	          case 1:
	            if (Uu(n), n.mode = 20, 6 === t) {
	              c >>>= 2, u -= 2;
	              break e;
	            }

	            break;

	          case 2:
	            n.mode = 17;
	            break;

	          case 3:
	            e.msg = "invalid block type", n.mode = 30;
	        }

	        c >>>= 2, u -= 2;
	        break;

	      case 14:
	        for (c >>>= 7 & u, u -= 7 & u; u < 32;) {
	          if (0 === s) break e;
	          s--, c += r[i++] << u, u += 8;
	        }

	        if ((65535 & c) != (c >>> 16 ^ 65535)) {
	          e.msg = "invalid stored block lengths", n.mode = 30;
	          break;
	        }

	        if (n.length = 65535 & c, c = 0, u = 0, n.mode = 15, 6 === t) break e;

	      case 15:
	        n.mode = 16;

	      case 16:
	        if (p = n.length) {
	          if (p > s && (p = s), p > l && (p = l), 0 === p) break e;
	          cc.arraySet(a, r, i, p, o), s -= p, i += p, l -= p, o += p, n.length -= p;
	          break;
	        }

	        n.mode = 12;
	        break;

	      case 17:
	        for (; u < 14;) {
	          if (0 === s) break e;
	          s--, c += r[i++] << u, u += 8;
	        }

	        if (n.nlen = 257 + (31 & c), c >>>= 5, u -= 5, n.ndist = 1 + (31 & c), c >>>= 5, u -= 5, n.ncode = 4 + (15 & c), c >>>= 4, u -= 4, n.nlen > 286 || n.ndist > 30) {
	          e.msg = "too many length or distance symbols", n.mode = 30;
	          break;
	        }

	        n.have = 0, n.mode = 18;

	      case 18:
	        for (; n.have < n.ncode;) {
	          for (; u < 3;) {
	            if (0 === s) break e;
	            s--, c += r[i++] << u, u += 8;
	          }

	          n.lens[T[n.have++]] = 7 & c, c >>>= 3, u -= 3;
	        }

	        for (; n.have < 19;) n.lens[T[n.have++]] = 0;

	        if (n.lencode = n.lendyn, n.lenbits = 7, S = {
	          bits: n.lenbits
	        }, _ = Lu(0, n.lens, 0, 19, n.lencode, 0, n.work, S), n.lenbits = S.bits, _) {
	          e.msg = "invalid code lengths set", n.mode = 30;
	          break;
	        }

	        n.have = 0, n.mode = 19;

	      case 19:
	        for (; n.have < n.nlen + n.ndist;) {
	          for (; b = (z = n.lencode[c & (1 << n.lenbits) - 1]) >>> 16 & 255, y = 65535 & z, !((g = z >>> 24) <= u);) {
	            if (0 === s) break e;
	            s--, c += r[i++] << u, u += 8;
	          }

	          if (y < 16) c >>>= g, u -= g, n.lens[n.have++] = y;else {
	            if (16 === y) {
	              for (C = g + 2; u < C;) {
	                if (0 === s) break e;
	                s--, c += r[i++] << u, u += 8;
	              }

	              if (c >>>= g, u -= g, 0 === n.have) {
	                e.msg = "invalid bit length repeat", n.mode = 30;
	                break;
	              }

	              x = n.lens[n.have - 1], p = 3 + (3 & c), c >>>= 2, u -= 2;
	            } else if (17 === y) {
	              for (C = g + 3; u < C;) {
	                if (0 === s) break e;
	                s--, c += r[i++] << u, u += 8;
	              }

	              u -= g, x = 0, p = 3 + (7 & (c >>>= g)), c >>>= 3, u -= 3;
	            } else {
	              for (C = g + 7; u < C;) {
	                if (0 === s) break e;
	                s--, c += r[i++] << u, u += 8;
	              }

	              u -= g, x = 0, p = 11 + (127 & (c >>>= g)), c >>>= 7, u -= 7;
	            }

	            if (n.have + p > n.nlen + n.ndist) {
	              e.msg = "invalid bit length repeat", n.mode = 30;
	              break;
	            }

	            for (; p--;) n.lens[n.have++] = x;
	          }
	        }

	        if (30 === n.mode) break;

	        if (0 === n.lens[256]) {
	          e.msg = "invalid code -- missing end-of-block", n.mode = 30;
	          break;
	        }

	        if (n.lenbits = 9, S = {
	          bits: n.lenbits
	        }, _ = Lu(1, n.lens, 0, n.nlen, n.lencode, 0, n.work, S), n.lenbits = S.bits, _) {
	          e.msg = "invalid literal/lengths set", n.mode = 30;
	          break;
	        }

	        if (n.distbits = 6, n.distcode = n.distdyn, S = {
	          bits: n.distbits
	        }, _ = Lu(2, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, S), n.distbits = S.bits, _) {
	          e.msg = "invalid distances set", n.mode = 30;
	          break;
	        }

	        if (n.mode = 20, 6 === t) break e;

	      case 20:
	        n.mode = 21;

	      case 21:
	        if (s >= 6 && l >= 258) {
	          e.next_out = o, e.avail_out = l, e.next_in = i, e.avail_in = s, n.hold = c, n.bits = u, zu(e, d), o = e.next_out, a = e.output, l = e.avail_out, i = e.next_in, r = e.input, s = e.avail_in, c = n.hold, u = n.bits, 12 === n.mode && (n.back = -1);
	          break;
	        }

	        for (n.back = 0; b = (z = n.lencode[c & (1 << n.lenbits) - 1]) >>> 16 & 255, y = 65535 & z, !((g = z >>> 24) <= u);) {
	          if (0 === s) break e;
	          s--, c += r[i++] << u, u += 8;
	        }

	        if (b && 0 == (240 & b)) {
	          for (k = g, v = b, w = y; b = (z = n.lencode[w + ((c & (1 << k + v) - 1) >> k)]) >>> 16 & 255, y = 65535 & z, !(k + (g = z >>> 24) <= u);) {
	            if (0 === s) break e;
	            s--, c += r[i++] << u, u += 8;
	          }

	          c >>>= k, u -= k, n.back += k;
	        }

	        if (c >>>= g, u -= g, n.back += g, n.length = y, 0 === b) {
	          n.mode = 26;
	          break;
	        }

	        if (32 & b) {
	          n.back = -1, n.mode = 12;
	          break;
	        }

	        if (64 & b) {
	          e.msg = "invalid literal/length code", n.mode = 30;
	          break;
	        }

	        n.extra = 15 & b, n.mode = 22;

	      case 22:
	        if (n.extra) {
	          for (C = n.extra; u < C;) {
	            if (0 === s) break e;
	            s--, c += r[i++] << u, u += 8;
	          }

	          n.length += c & (1 << n.extra) - 1, c >>>= n.extra, u -= n.extra, n.back += n.extra;
	        }

	        n.was = n.length, n.mode = 23;

	      case 23:
	        for (; b = (z = n.distcode[c & (1 << n.distbits) - 1]) >>> 16 & 255, y = 65535 & z, !((g = z >>> 24) <= u);) {
	          if (0 === s) break e;
	          s--, c += r[i++] << u, u += 8;
	        }

	        if (0 == (240 & b)) {
	          for (k = g, v = b, w = y; b = (z = n.distcode[w + ((c & (1 << k + v) - 1) >> k)]) >>> 16 & 255, y = 65535 & z, !(k + (g = z >>> 24) <= u);) {
	            if (0 === s) break e;
	            s--, c += r[i++] << u, u += 8;
	          }

	          c >>>= k, u -= k, n.back += k;
	        }

	        if (c >>>= g, u -= g, n.back += g, 64 & b) {
	          e.msg = "invalid distance code", n.mode = 30;
	          break;
	        }

	        n.offset = y, n.extra = 15 & b, n.mode = 24;

	      case 24:
	        if (n.extra) {
	          for (C = n.extra; u < C;) {
	            if (0 === s) break e;
	            s--, c += r[i++] << u, u += 8;
	          }

	          n.offset += c & (1 << n.extra) - 1, c >>>= n.extra, u -= n.extra, n.back += n.extra;
	        }

	        if (n.offset > n.dmax) {
	          e.msg = "invalid distance too far back", n.mode = 30;
	          break;
	        }

	        n.mode = 25;

	      case 25:
	        if (0 === l) break e;

	        if (p = d - l, n.offset > p) {
	          if ((p = n.offset - p) > n.whave && n.sane) {
	            e.msg = "invalid distance too far back", n.mode = 30;
	            break;
	          }

	          p > n.wnext ? (p -= n.wnext, f = n.wsize - p) : f = n.wnext - p, p > n.length && (p = n.length), m = n.window;
	        } else m = a, f = o - n.offset, p = n.length;

	        p > l && (p = l), l -= p, n.length -= p;

	        do {
	          a[o++] = m[f++];
	        } while (--p);

	        0 === n.length && (n.mode = 21);
	        break;

	      case 26:
	        if (0 === l) break e;
	        a[o++] = n.length, l--, n.mode = 21;
	        break;

	      case 27:
	        if (n.wrap) {
	          for (; u < 32;) {
	            if (0 === s) break e;
	            s--, c |= r[i++] << u, u += 8;
	          }

	          if (d -= l, e.total_out += d, n.total += d, d && (e.adler = n.check = n.flags ? Zc(n.check, a, d, o - d) : Wc(n.check, a, d, o - d)), d = l, (n.flags ? c : Ou(c)) !== n.check) {
	            e.msg = "incorrect data check", n.mode = 30;
	            break;
	          }

	          c = 0, u = 0;
	        }

	        n.mode = 28;

	      case 28:
	        if (n.wrap && n.flags) {
	          for (; u < 32;) {
	            if (0 === s) break e;
	            s--, c += r[i++] << u, u += 8;
	          }

	          if (c !== (4294967295 & n.total)) {
	            e.msg = "incorrect length check", n.mode = 30;
	            break;
	          }

	          c = 0, u = 0;
	        }

	        n.mode = 29;

	      case 29:
	        _ = 1;
	        break e;

	      case 30:
	        _ = -3;
	        break e;

	      case 31:
	        return -4;

	      case 32:
	      default:
	        return -2;
	    }

	    return e.next_out = o, e.avail_out = l, e.next_in = i, e.avail_in = s, n.hold = c, n.bits = u, (n.wsize || d !== e.avail_out && n.mode < 30 && (n.mode < 27 || 4 !== t)) && qu(e, e.output, e.next_out, d - e.avail_out), h -= e.avail_in, d -= e.avail_out, e.total_in += h, e.total_out += d, n.total += d, n.wrap && d && (e.adler = n.check = n.flags ? Zc(n.check, a, d, e.next_out - d) : Wc(n.check, a, d, e.next_out - d)), e.data_type = n.bits + (n.last ? 64 : 0) + (12 === n.mode ? 128 : 0) + (20 === n.mode || 15 === n.mode ? 256 : 0), (0 === h && 0 === d || 4 === t) && 0 === _ && (_ = -5), _;
	  },
	  inflateEnd: function (e) {
	    if (!e || !e.state) return -2;
	    var t = e.state;
	    return t.window && (t.window = null), e.state = null, 0;
	  },
	  inflateGetHeader: function (e, t) {
	    var n;
	    return e && e.state ? 0 == (2 & (n = e.state).wrap) ? -2 : (n.head = t, t.done = !1, 0) : -2;
	  },
	  inflateSetDictionary: function (e, t) {
	    var n,
	        r = t.length;
	    return e && e.state ? 0 !== (n = e.state).wrap && 11 !== n.mode ? -2 : 11 === n.mode && Wc(1, t, r, 0) !== n.check ? -3 : qu(e, t, r, r) ? (n.mode = 31, -4) : (n.havedict = 1, 0) : -2;
	  },
	  inflateInfo: "pako inflate (from Nodeca project)"
	},
	    Yu = {
	  Z_NO_FLUSH: 0,
	  Z_PARTIAL_FLUSH: 1,
	  Z_SYNC_FLUSH: 2,
	  Z_FULL_FLUSH: 3,
	  Z_FINISH: 4,
	  Z_BLOCK: 5,
	  Z_TREES: 6,
	  Z_OK: 0,
	  Z_STREAM_END: 1,
	  Z_NEED_DICT: 2,
	  Z_ERRNO: -1,
	  Z_STREAM_ERROR: -2,
	  Z_DATA_ERROR: -3,
	  Z_BUF_ERROR: -5,
	  Z_NO_COMPRESSION: 0,
	  Z_BEST_SPEED: 1,
	  Z_BEST_COMPRESSION: 9,
	  Z_DEFAULT_COMPRESSION: -1,
	  Z_FILTERED: 1,
	  Z_HUFFMAN_ONLY: 2,
	  Z_RLE: 3,
	  Z_FIXED: 4,
	  Z_DEFAULT_STRATEGY: 0,
	  Z_BINARY: 0,
	  Z_TEXT: 1,
	  Z_UNKNOWN: 2,
	  Z_DEFLATED: 8
	};

	var Hu = function () {
	  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
	},
	    Zu = window.Object.prototype.toString;

	function Vu(e) {
	  if (!(this instanceof Vu)) return new Vu(e);
	  this.options = cc.assign({
	    chunkSize: 16384,
	    windowBits: 0,
	    to: ""
	  }, e || {});
	  var t = this.options;
	  t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, 0 === t.windowBits && (t.windowBits = -15)), !(t.windowBits >= 0 && t.windowBits < 16) || e && e.windowBits || (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && 0 == (15 & t.windowBits) && (t.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new wu(), this.strm.avail_out = 0;
	  var n = Wu.inflateInit2(this.strm, t.windowBits);
	  if (n !== Yu.Z_OK) throw new Error(Vc[n]);
	  if (this.header = new Hu(), Wu.inflateGetHeader(this.strm, this.header), t.dictionary && ("string" == typeof t.dictionary ? t.dictionary = gu(t.dictionary) : "[object ArrayBuffer]" === Zu.call(t.dictionary) && (t.dictionary = new Uint8Array(t.dictionary)), t.raw && (n = Wu.inflateSetDictionary(this.strm, t.dictionary)) !== Yu.Z_OK)) throw new Error(Vc[n]);
	}

	function $u(e, t) {
	  var n = new Vu(t);
	  if (n.push(e, !0), n.err) throw n.msg || Vc[n.err];
	  return n.result;
	}

	Vu.prototype.push = function (e, t) {
	  var n,
	      r,
	      a,
	      i,
	      o,
	      s = this.strm,
	      l = this.options.chunkSize,
	      c = this.options.dictionary,
	      u = !1;
	  if (this.ended) return !1;
	  r = t === ~~t ? t : !0 === t ? Yu.Z_FINISH : Yu.Z_NO_FLUSH, "string" == typeof e ? s.input = yu(e) : "[object ArrayBuffer]" === Zu.call(e) ? s.input = new Uint8Array(e) : s.input = e, s.next_in = 0, s.avail_in = s.input.length;

	  do {
	    if (0 === s.avail_out && (s.output = new cc.Buf8(l), s.next_out = 0, s.avail_out = l), (n = Wu.inflate(s, Yu.Z_NO_FLUSH)) === Yu.Z_NEED_DICT && c && (n = Wu.inflateSetDictionary(this.strm, c)), n === Yu.Z_BUF_ERROR && !0 === u && (n = Yu.Z_OK, u = !1), n !== Yu.Z_STREAM_END && n !== Yu.Z_OK) return this.onEnd(n), this.ended = !0, !1;
	    s.next_out && (0 !== s.avail_out && n !== Yu.Z_STREAM_END && (0 !== s.avail_in || r !== Yu.Z_FINISH && r !== Yu.Z_SYNC_FLUSH) || ("string" === this.options.to ? (a = vu(s.output, s.next_out), i = s.next_out - a, o = ku(s.output, a), s.next_out = i, s.avail_out = l - i, i && cc.arraySet(s.output, s.output, a, i, 0), this.onData(o)) : this.onData(cc.shrinkBuf(s.output, s.next_out)))), 0 === s.avail_in && 0 === s.avail_out && (u = !0);
	  } while ((s.avail_in > 0 || 0 === s.avail_out) && n !== Yu.Z_STREAM_END);

	  return n === Yu.Z_STREAM_END && (r = Yu.Z_FINISH), r === Yu.Z_FINISH ? (n = Wu.inflateEnd(this.strm), this.onEnd(n), this.ended = !0, n === Yu.Z_OK) : r !== Yu.Z_SYNC_FLUSH || (this.onEnd(Yu.Z_OK), s.avail_out = 0, !0);
	}, Vu.prototype.onData = function (e) {
	  this.chunks.push(e);
	}, Vu.prototype.onEnd = function (e) {
	  e === Yu.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = cc.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
	};
	var Ku = {
	  Inflate: Vu,
	  inflate: $u,
	  inflateRaw: function (e, t) {
	    return (t = t || {}).raw = !0, $u(e, t);
	  },
	  ungzip: $u
	},
	    Gu = {};
	(0, cc.assign)(Gu, Cu, Ku, Yu);
	var Xu = Gu;

	var Qu = function (e) {
	  const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
	        n = new Uint8Array(e),
	        r = n.length,
	        a = r % 3,
	        i = [];
	  let o;

	  for (let e = 0, t = r - a; e < t; e += 16383) i.push(s(e, e + 16383 > t ? t : e + 16383));

	  return 1 === a ? (o = n[r - 1], i.push(t[o >> 2] + t[o << 4 & 63] + "==")) : 2 === a && (o = (n[r - 2] << 8) + n[r - 1], i.push(t[o >> 10] + t[o >> 4 & 63] + t[o << 2 & 63] + "=")), i.join("");

	  function s(e, r) {
	    let a;
	    const i = [];

	    for (let s = e; s < r; s += 3) a = (n[s] << 16 & 16711680) + (n[s + 1] << 8 & 65280) + (255 & n[s + 2]), i.push(t[(o = a) >> 18 & 63] + t[o >> 12 & 63] + t[o >> 6 & 63] + t[63 & o]);

	    var o;
	    return i.join("");
	  }
	};

	const {
	  deflate: Ju
	} = Xu;

	var eh = function ({
	  type: e,
	  value: t,
	  compress: n,
	  serialize: r
	}) {
	  const a = {
	    type: e,
	    value: t
	  };
	  return n && (a.value = Ju(new Uint8Array(a.value)), a.compressed = !0), r && (a.value = Qu(a.value)), a;
	};

	var th = function (e) {
	  return /^(blob|https?):/.test(e);
	};

	var nh = function (e) {
	  const t = e && e.match(/(^[^#]*)/),
	        n = t && t[1] || e;
	  return n && n.replace(/\?\s*$/, "?") || e;
	};

	var rh = function (e) {
	  return e.reduce((e, t) => e.concat(t), []);
	};

	const {
	  absolutizeUrl: ah
	} = c;

	var ih = function ({
	  fetchUrl: e,
	  findStyleSheetByUrl: t,
	  getCorsFreeStyleSheet: n,
	  extractResourcesFromStyleSheet: r,
	  extractResourcesFromSvg: a,
	  sessionCache: i,
	  cache: o = {},
	  compress: s,
	  serialize: l,
	  log: c = ql
	}) {
	  return function ({
	    url: u,
	    documents: h,
	    getResourceUrlsAndBlobs: d,
	    forceCreateStyle: p = !1,
	    skipResources: f
	  }) {
	    if (!o[u]) if (i && i.getItem(u)) {
	      const e = function e(t) {
	        const n = i.getItem(t);
	        return [t].concat(n ? oc(rh(n.map(e))) : []);
	      }(u);

	      c("doProcessResource from sessionStorage", u, "deps:", e.slice(1)), o[u] = Promise.resolve({
	        resourceUrls: e
	      });
	    } else if (f && f.indexOf(u) > -1 || /https:\/\/fonts.googleapis.com/.test(u)) c("not processing resource from skip list (or google font):", u), o[u] = Promise.resolve({
	      resourceUrls: [u]
	    });else {
	      const g = Date.now();

	      o[u] = function (o) {
	        c("fetching", o);
	        const u = Date.now();
	        return e(o).catch(e => {
	          if (function (e) {
	            const t = e.message && (e.message.includes("Failed to fetch") || e.message.includes("Network request failed")),
	                  n = e.name && e.name.includes("TypeError");
	            return t && n;
	          }(e)) return {
	            probablyCORS: !0,
	            url: o
	          };
	          if (e.isTimeout) return {
	            isTimeout: !0,
	            url: o
	          };
	          throw e;
	        }).then(({
	          url: e,
	          type: o,
	          value: m,
	          probablyCORS: g,
	          errorStatusCode: b,
	          isTimeout: y
	        }) => {
	          if (g) return c("not fetched due to CORS", `[${Date.now() - u}ms]`, e), i && i.setItem(e, []), {
	            resourceUrls: [e]
	          };

	          if (b) {
	            const t = {
	              [e]: {
	                errorStatusCode: b
	              }
	            };
	            return i && i.setItem(e, []), {
	              blobsObj: t
	            };
	          }

	          if (y) return c("not fetched due to timeout, returning error status code 504 (Gateway timeout)"), i && i.setItem(e, []), {
	            blobsObj: {
	              [e]: {
	                errorStatusCode: 504
	              }
	            }
	          };
	          let k;

	          if (c(`fetched [${Date.now() - u}ms] ${e} bytes: ${m.byteLength}`), /text\/css/.test(o)) {
	            let a = t(e, h);

	            if (a || p) {
	              const {
	                corsFreeStyleSheet: e,
	                cleanStyleSheet: t
	              } = n(m, a);
	              k = r(e), t();
	            }
	          } else if (/image\/svg/.test(o)) try {
	            k = a(m), p = !!k;
	          } catch (e) {
	            c("could not parse svg content", e);
	          }

	          const v = {
	            [e]: eh({
	              type: o,
	              value: m,
	              compress: s,
	              serialize: l
	            })
	          };

	          if (k) {
	            const t = k.map(t => ah(t, e.replace(/^blob:/, ""))).map(nh).filter(th);
	            return i && i.setItem(e, t), d({
	              documents: h,
	              urls: t,
	              forceCreateStyle: p,
	              skipResources: f
	            }).then(({
	              resourceUrls: e,
	              blobsObj: t
	            }) => ({
	              resourceUrls: e,
	              blobsObj: window.Object.assign(t, v)
	            }));
	          }

	          return i && i.setItem(e, []), {
	            blobsObj: v
	          };
	        }).catch(e => (c("error while fetching", o, e, e ? `message=${e.message} | name=${e.name}` : ""), i && m(), {}));
	      }(u).then(e => (c("doProcessResource", `[${Date.now() - g}ms]`, u), e));
	    }
	    return o[u];

	    function m() {
	      c("clearing from sessionStorage:", u), i.keys().forEach(e => {
	        const t = i.getItem(e);
	        i.setItem(e, t.filter(e => e !== u));
	      }), c("cleared from sessionStorage:", u);
	    }
	  };
	};

	var oh = function ({
	  parser: e,
	  decoder: t,
	  extractResourceUrlsFromStyleTags: n
	}) {
	  return function (r) {
	    const a = (t || new TextDecoder("utf-8")).decode(r),
	          i = (e || new DOMParser()).parseFromString(a, "image/svg+xml"),
	          o = window.Array.from(i.querySelectorAll("img[srcset]")).map(e => e.getAttribute("srcset").split(", ").map(e => e.trim().split(/\s+/)[0])).reduce((e, t) => e.concat(t), []),
	          s = window.Array.from(i.querySelectorAll("img[src]")).map(e => e.getAttribute("src")),
	          l = window.Array.from(i.querySelectorAll('image,use,link[rel="stylesheet"]')).map(e => e.getAttribute("href") || e.getAttribute("xlink:href")),
	          c = window.Array.from(i.getElementsByTagName("object")).map(e => e.getAttribute("data")),
	          u = n(i, !1),
	          h = function (e) {
	      return rh(window.Array.from(e.querySelectorAll("*[style]")).map(e => e.style.cssText).map(Hl).filter(Boolean));
	    }(i);

	    return o.concat(s).concat(l).concat(c).concat(u).concat(h).filter(e => "#" !== e[0]);
	  };
	};

	var sh = function ({
	  fetch: e = window.fetch,
	  AbortController: t = window.AbortController,
	  timeout: n = 1e4
	}) {
	  return function (r) {
	    return new Promise((a, i) => {
	      const o = new t(),
	            s = setTimeout(() => {
	        const e = new Error("fetchUrl timeout reached");
	        e.isTimeout = !0, i(e), o.abort();
	      }, n);
	      return e(r, {
	        cache: "force-cache",
	        credentials: "same-origin",
	        signal: o.signal
	      }).then(e => (clearTimeout(s), 200 === e.status ? e.arrayBuffer().then(t => ({
	        url: r,
	        type: e.headers.get("Content-Type"),
	        value: t
	      })) : {
	        url: r,
	        errorStatusCode: e.status
	      })).then(a).catch(e => i(e));
	    });
	  };
	};

	var lh = function (e) {
	  const t = new URL(e);
	  return t.username && (t.username = ""), t.password && (t.password = ""), t.href;
	};

	var ch = function ({
	  styleSheetCache: e
	}) {
	  return function (t, n) {
	    const r = rh(n.map(e => {
	      try {
	        return window.Array.from(e.styleSheets);
	      } catch (e) {
	        return [];
	      }
	    }));
	    return e[t] || r.find(e => {
	      const n = e.href && nh(e.href);
	      return n && lh(n) === t;
	    });
	  };
	};

	var uh = function ({
	  styleSheetCache: e,
	  CSSRule: t = window.CSSRule
	}) {
	  return function n(r) {
	    return oc(window.Array.from(r.cssRules || []).reduce((r, a) => {
	      const i = {
	        [t.IMPORT_RULE]: () => (a.styleSheet && (e[a.styleSheet.href] = a.styleSheet), a.href),
	        [t.FONT_FACE_RULE]: () => Hl(a.cssText),
	        [t.SUPPORTS_RULE]: () => n(a),
	        [t.MEDIA_RULE]: () => n(a),
	        [t.STYLE_RULE]: () => {
	          let e = [];

	          for (let t = 0, n = a.style.length; t < n; t++) {
	            const n = a.style[t];
	            let r = a.style.getPropertyValue(n);
	            (/^\s*var\s*\(/.test(r) || /^--/.test(n)) && (r = r.replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, e => String.fromCodePoint(parseInt(e.substr(1).trim(), 16))).replace(/\\([^0-9a-fA-F])/g, "$1"));
	            const i = Hl(r);
	            e = e.concat(i);
	          }

	          return e;
	        }
	      }[a.type],
	            o = i && i() || [];
	      return r.concat(o);
	    }, [])).filter(e => "#" !== e[0]);
	  };
	};

	var hh = function (e) {
	  return function (t, n = !0) {
	    return oc(window.Array.from(t.querySelectorAll("style")).reduce((r, a) => {
	      const i = n ? window.Array.from(t.styleSheets).find(e => e.ownerNode === a) : a.sheet;
	      return i ? r.concat(e(i)) : r;
	    }, []));
	  };
	};

	var dh = function (e) {
	  const t = new TextDecoder("utf-8").decode(e),
	        n = document.head || document.querySelectorAll("head")[0],
	        r = document.createElement("style");
	  return r.type = "text/css", r.setAttribute("data-desc", "Applitools tmp variable created by DOM SNAPSHOT"), n.appendChild(r), r.styleSheet ? r.styleSheet.cssText = t : r.appendChild(document.createTextNode(t)), r.sheet;
	};

	var ph = function (e, t, n = ql) {
	  let r;
	  if (t) try {
	    t.cssRules, r = t;
	  } catch (a) {
	    n(`[dom-snapshot] could not access cssRules for ${t.href} ${a}\ncreating temp style for access.`), r = dh(e);
	  } else r = dh(e);
	  return {
	    corsFreeStyleSheet: r,
	    cleanStyleSheet: function () {
	      r !== t && r.ownerNode.parentNode.removeChild(r.ownerNode);
	    }
	  };
	};

	var fh = function (e, {
	  log: t,
	  compress: n,
	  serialize: r
	}) {
	  return e.reduce((e, {
	    url: a,
	    element: i
	  }) => {
	    const o = new Promise(e => {
	      try {
	        i.toBlob(t => e(t.arrayBuffer()), "image/png");
	      } catch (r) {
	        t(r.message, i && i.attributes && (n = i, JSON.stringify(window.Array.from(n.attributes).reduce((e, t) => window.Object.assign({
	          [t.name]: t.value
	        }, e), {})))), e();
	      }

	      var n;
	    });
	    return e.then(e => o.then(t => {
	      if (t) {
	        const i = eh({
	          type: "image/png",
	          value: t,
	          compress: n,
	          serialize: r
	        });
	        i.url = a, e.push(i);
	      }

	      return e;
	    }));
	  }, Promise.resolve([]));
	};

	var mh = function (e) {
	  const t = e.querySelectorAll("base")[0] && e.querySelectorAll("base")[0].href;
	  if (t && (n = t) && !/^(about:blank|javascript:void|blob:)/.test(n)) return t;
	  var n;
	};

	var gh = function (e) {
	  return e && e.replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, e => {
	    const t = parseInt(e.substr(1).trim(), 16);
	    return String.fromCodePoint(t);
	  }) || e;
	};

	var bh = function (e) {
	  return function () {
	    const t = ["[dom-snapshot]", `[+${Date.now() - e}ms]`].concat(window.Array.from(arguments));
	    console.log.apply(console, t);
	  };
	};

	var yh = function ({
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

	const {
	  absolutizeUrl: kh
	} = c;

	function vh(e) {
	  return function (t) {
	    try {
	      return kh(t, e);
	    } catch (e) {}
	  };
	}

	function wh(e) {
	  return window.Object.keys(e).map(t => window.Object.assign({
	    url: t.replace(/^blob:/, "")
	  }, e[t]));
	}

	function xh(e) {
	  return e && th(e);
	}

	var _h = function ({
	  doc: e = document,
	  showLogs: t,
	  useSessionCache: n,
	  dontFetchResources: r,
	  fetchTimeout: a,
	  skipResources: i,
	  compressResources: o,
	  serializeResources: s
	} = {}) {
	  /* MARKER FOR TEST - DO NOT DELETE */
	  arguments[0] instanceof Document && (e = arguments[0], t = arguments[1].showLogs, n = arguments[1].useSessionCache, r = arguments[1].dontFetchResources, a = arguments[1].fetchTimeout, i = arguments[1].skipResources, o = arguments[1].compressResources, s = arguments[1].serializeResources);
	  const l = t ? bh(Date.now()) : ql;
	  l("processPage start"), l("skipResources length: " + (i && i.length));
	  const c = n && yh({
	    log: l
	  }),
	        u = {},
	        h = uh({
	    styleSheetCache: u
	  }),
	        d = ch({
	    styleSheetCache: u
	  }),
	        p = hh(h),
	        f = oh({
	    extractResourceUrlsFromStyleTags: p
	  }),
	        m = sh({
	    timeout: a
	  }),
	        g = ih({
	    fetchUrl: m,
	    findStyleSheetByUrl: d,
	    getCorsFreeStyleSheet: ph,
	    extractResourcesFromStyleSheet: h,
	    extractResourcesFromSvg: f,
	    absolutizeUrl: kh,
	    log: l,
	    sessionCache: c,
	    compress: o,
	    serialize: s
	  }),
	        b = lc({
	    processResource: g,
	    aggregateResourceUrlsAndBlobs: sc
	  });
	  return y(e).then(e => (l("processPage end"), e.scriptVersion = "4.2.0", e));

	  function y(e, t = e.location.href) {
	    const n = mh(e) || t,
	          {
	      cdt: a,
	      docRoots: u,
	      canvasElements: h,
	      frames: d,
	      inlineFrames: f,
	      crossFramesSelectors: m,
	      linkUrls: g
	    } = ic(e, n, l),
	          k = rh(u.map(e => p(e))),
	          v = vh(n),
	          w = oc(window.Array.from(g).concat(window.Array.from(k))).map(gh).map(v).map(nh).filter(xh),
	          x = r ? Promise.resolve({
	      resourceUrls: w,
	      blobsObj: {}
	    }) : b({
	      documents: u,
	      urls: w,
	      skipResources: i
	    }).then(e => (c && c.persist(), e)),
	          _ = fh(h, {
	      log: l,
	      compress: o,
	      serialize: s
	    }),
	          S = d.map(({
	      element: e
	    }) => y(e.contentDocument)),
	          C = f.map(({
	      element: e,
	      url: t
	    }) => y(e.contentDocument, t));

	    return Promise.all([x].concat(_).concat(S).concat(C)).then(function (e) {
	      const {
	        resourceUrls: n,
	        blobsObj: r
	      } = e[0],
	            i = e[1],
	            o = e.slice(2),
	            s = z("src"),
	            l = z("data-applitools-selector"),
	            c = l ? `[data-applitools-selector="${l}"]` : void 0;
	      return {
	        cdt: a,
	        url: t,
	        srcAttr: s,
	        resourceUrls: n.map(e => e.replace(/^blob:/, "")),
	        blobs: wh(r).concat(i),
	        frames: o,
	        crossFramesSelectors: m,
	        selector: c
	      };
	    });

	    function z(t) {
	      return e.defaultView && e.defaultView.frameElement && e.defaultView.frameElement.getAttribute(t);
	    }
	  }
	};

	var Sh = function (e) {
	  return _h(window.Object.assign({
	    serializeResources: !0
	  }, e));
	};

	var processPageAndSerializeCjs = Sh;

	return processPageAndSerializeCjs;

}());
  return processPageAndSerialize(...args)
}