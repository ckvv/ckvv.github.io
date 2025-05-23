!(function (t) {
  typeof define == 'function' && define.amd ? define(t) : t();
}(() => {
  'use strict'; function t() {} function e(t) {
    return t();
  } function n() {
    return Object.create(null);
  } function r(t) {
    t.forEach(e);
  } function o(t) {
    return typeof t == 'function';
  } function a(t, e) {
    return t != t ? e == e : t !== e || t && typeof t == 'object' || typeof t == 'function';
  } function s(t, e) {
    t.appendChild(e);
  } function i(t, e, n) {
    t.insertBefore(e, n || null);
  } function c(t) {
    t.parentNode.removeChild(t);
  } function l(t) {
    return document.createElement(t);
  } function u(t) {
    return document.createTextNode(t);
  } function d() {
    return u(' ');
  } function f() {
    return u('');
  } function p(t, e, n, r) {
    return t.addEventListener(e, n, r), () => t.removeEventListener(e, n, r);
  } function m(t, e, n) {
    n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
  } function g(t, e) {
    e = `${e}`, t.wholeText !== e && (t.data = e);
  } function h(t, e) {
    t.value = e == null ? '' : e;
  } function y(t, e, n) {
    t.classList[n ? 'add' : 'remove'](e);
  } let b; function $(t) {
    b = t;
  } function x() {
    if (!b) {
      throw new Error('Function called outside component initialization');
    } return b;
  } function k(t) {
    x().$$.on_mount.push(t);
  } function v(t, e) {
    x().$$.context.set(t, e);
  } function w(t) {
    return x().$$.context.get(t);
  } const _ = []; const C = []; const S = []; const I = []; const L = Promise.resolve(); let R = !1; function A(t) {
    S.push(t);
  } let E = !1; const N = new Set(); function O() {
    if (!E) {
      E = !0; do {
        for (let t = 0; t < _.length; t += 1) {
          const e = _[t]; $(e), M(e.$$);
        } for ($(null), _.length = 0; C.length;)C.pop()(); for (let t = 0; t < S.length; t += 1) {
          const e = S[t]; N.has(e) || (N.add(e), e());
        }S.length = 0;
      } while (_.length); for (;I.length;)I.pop()(); R = !1, E = !1, N.clear();
    }
  } function M(t) {
    if (t.fragment !== null) {
      t.update(), r(t.before_update); const e = t.dirty; t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(A);
    }
  } const T = new Set(); let q; function j() {
    q = { r: 0, c: [], p: q };
  } function U() {
    q.r || r(q.c), q = q.p;
  } function z(t, e) {
    t && t.i && (T.delete(t), t.i(e));
  } function P(t, e, n, r) {
    if (t && t.o) {
      if (T.has(t)) {
        return;
      } T.add(t), q.c.push(() => {
        T.delete(t), r && (n && t.d(1), r());
      }), t.o(e);
    }
  } function F(t, e) {
    P(t, 1, 1, () => {
      e.delete(t.key);
    });
  } function D(t, e, n, r, o, a, s, i, c, l, u, d) {
    let f = t.length; let p = a.length; let m = f; const g = {}; for (;m--;)g[t[m].key] = m; const h = []; const y = new Map(); const b = new Map(); for (m = p; m--;) {
      const t = d(o, a, m); const i = n(t); let c = s.get(i); c ? r && c.p(t, e) : (c = l(i, t), c.c()), y.set(i, h[m] = c), i in g && b.set(i, Math.abs(m - g[i]));
    } const $ = new Set(); const x = new Set(); function k(t) {
      z(t, 1), t.m(i, u), s.set(t.key, t), u = t.first, p--;
    } for (;f && p;) {
      const e = h[p - 1]; const n = t[f - 1]; const r = e.key; const o = n.key; e === n ? (u = e.first, f--, p--) : y.has(o) ? !s.has(r) || $.has(r) ? k(e) : x.has(o) ? f-- : b.get(r) > b.get(o) ? (x.add(r), k(e)) : ($.add(o), f--) : (c(n, s), f--);
    } for (;f--;) {
      const e = t[f]; y.has(e.key) || c(e, s);
    } for (;p;)k(h[p - 1]); return h;
  } function H(t) {
    t && t.c();
  } function J(t, n, a, s) {
    const { fragment: i, on_mount: c, on_destroy: l, after_update: u } = t.$$; i && i.m(n, a), s || A(() => {
      const n = c.map(e).filter(o); l ? l.push(...n) : r(n), t.$$.on_mount = [];
    }), u.forEach(A);
  } function B(t, e) {
    const n = t.$$; n.fragment !== null && (r(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
  } function Y(t, e) {
    t.$$.dirty[0] === -1 && (_.push(t), R || (R = !0, L.then(O)), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
  } function G(e, o, a, s, i, l, u = [-1]) {
    const d = b; $(e); const f = e.$$ = { fragment: null, ctx: null, props: l, update: t, not_equal: i, bound: n(), on_mount: [], on_destroy: [], on_disconnect: [], before_update: [], after_update: [], context: new Map(d ? d.$$.context : o.context || []), callbacks: n(), dirty: u, skip_bound: !1 }; let p = !1; if (f.ctx = a
      ? a(e, o.props || {}, (t, n, ...r) => {
          const o = r.length ? r[0] : n; return f.ctx && i(f.ctx[t], f.ctx[t] = o) && (!f.skip_bound && f.bound[t] && f.bound[t](o), p && Y(e, t)), n;
        })
      : [], f.update(), p = !0, r(f.before_update), f.fragment = !!s && s(f.ctx), o.target) {
      if (o.hydrate) {
        const t = (m = o.target, Array.from(m.childNodes)); f.fragment && f.fragment.l(t), t.forEach(c);
      } else {
        f.fragment && f.fragment.c();
      }o.intro && z(e.$$.fragment), J(e, o.target, o.anchor, o.customElement), O();
    } let m; $(d);
  } class K {
    $destroy() {
      B(this, 1), this.$destroy = t;
    }

    $on(t, e) {
      const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []); return n.push(e), () => {
        const t = n.indexOf(e); t !== -1 && n.splice(t, 1);
      };
    }

    $set(t) {
      let e; this.$$set && (e = t, Object.keys(e).length !== 0) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
    }
  } const Q = (function t(e) {
    function n(t, e, r) {
      let o; const a = {}; if (Array.isArray(t)) {
 return t.concat(e); 
} for (o in t)a[r ? o.toLowerCase() : o] = t[o]; for (o in e) {
        const s = r ? o.toLowerCase() : o; const i = e[o]; a[s] = s in a && typeof i == 'object' ? n(a[s], i, s === 'headers') : i;
      } return a;
    } function r(t, r, o, a) {
      typeof t != 'string' && (t = (r = t).url); const s = { config: r }; const i = n(e, r); const c = {}; let l = a || i.data; (i.transformRequest || []).map((t) => {
        l = t(l, i.headers) || l;
      }), l && typeof l == 'object' && typeof l.append != 'function' && (l = JSON.stringify(l), c['content-type'] = 'application/json'); const u = typeof document != 'undefined' && document.cookie.match(new RegExp(`(^|; )${i.xsrfCookieName}=([^;]*)`)); if (u && (c[i.xsrfHeaderName] = u[2]), i.auth && (c.authorization = i.auth), i.baseURL && (t = t.replace(/^(?!.*\/\/)\/?(.*)$/, `${i.baseURL}/$1`)), i.params) {
        const d = ~t.indexOf('?') ? '&' : '?'; t += d + (i.paramsSerializer ? i.paramsSerializer(i.params) : new URLSearchParams(i.params));
      } return (i.fetch || fetch)(t, { method: o || i.method, body: l, headers: n(i.headers, c, !0), credentials: i.withCredentials ? 'include' : 'same-origin' }).then((t) => {
        for (const e in t) typeof t[e] != 'function' && (s[e] = t[e]); const n = i.validateStatus ? i.validateStatus(t.status) : t.ok; return i.responseType == 'stream'
          ? (s.data = t.body, s)
          : t[i.responseType || 'text']().then((t) => {
              s.data = t, s.data = JSON.parse(t);
            }).catch(Object).then(() => {
              return n ? s : Promise.reject(s);
            });
      });
    } return e = e || {}, r.request = r, r.get = function (t, e) {
      return r(t, e, 'get');
    }, r.delete = function (t, e) {
      return r(t, e, 'delete');
    }, r.head = function (t, e) {
      return r(t, e, 'head');
    }, r.options = function (t, e) {
      return r(t, e, 'options');
    }, r.post = function (t, e, n) {
      return r(t, n, 'post', e);
    }, r.put = function (t, e, n) {
      return r(t, n, 'put', e);
    }, r.patch = function (t, e, n) {
      return r(t, n, 'patch', e);
    }, r.all = Promise.all.bind(Promise), r.spread = function (t) {
      return function (e) {
        return t.apply(this, e);
      };
    }, r.CancelToken = typeof AbortController == 'function' ? AbortController : Object, r.defaults = e, r.create = t, r;
  }()); const V = { powered_by: '', post_comment: 'Comment', loading: 'Loading', email: 'Email (optional)', nickname: 'Nickname', reply_placeholder: 'Reply...', reply_btn: 'Reply', sending: 'sending...', mod_badge: 'MOD', content_is_required: 'Content is required', nickname_is_required: 'Nickname is required', comment_has_been_sent: 'Your comment has been sent. Please wait for approval.' }; function W(t) {
    const e = window.CUSDIS_LOCALE || V; const n = e[t] || V[t]; return e[t], n;
  } function X(e) {
    let n; let o; let a; let f; let b; let $; let x; let k; let v; let w; let _; let C; let S; let I; let L; let R; let A; let E; let N; let O; let M; let T; let q = `${e[3] ? W('sending') : W('post_comment')}`; return { c() {
      n = l('div'), o = l('div'), a = l('div'), f = l('label'), f.textContent = `${W('nickname')}`, b = d(), $ = l('input'), x = d(), k = l('div'), v = l('label'), v.textContent = `${W('email')}`, w = d(), _ = l('input'), C = d(), S = l('div'), I = l('label'), I.textContent = `${W('reply_placeholder')}`, L = d(), R = l('textarea'), A = d(), E = l('div'), N = l('button'), O = u(q), m(f, 'class', 'mb-2 block dark:text-gray-200'), m(f, 'for', 'nickname'), m($, 'name', 'nickname'), m($, 'class', 'w-full p-2 border border-gray-200 bg-transparent dark:text-gray-100 dark:outline-none'), m($, 'type', 'text'), m(v, 'class', 'mb-2 block dark:text-gray-200'), m(v, 'for', 'email'), m(_, 'name', 'email'), m(_, 'class', 'w-full p-2 border border-gray-200 bg-transparent  dark:text-gray-100 dark:outline-none'), m(_, 'type', 'email'), m(o, 'class', 'grid grid-cols-2 gap-4'), m(I, 'class', 'mb-2 block dark:text-gray-200'), m(I, 'for', 'reply_content'), m(R, 'name', 'reply_content'), m(R, 'class', 'w-full p-2 border border-gray-200 h-24 bg-transparent dark:text-gray-100 dark:outline-none'), m(N, 'class', 'text-sm bg-gray-200 p-2 px-4 font-bold'), y(N, 'cusdis-disabled', e[3]), m(n, 'class', 'grid grid-cols-1 gap-4');
    }, m(t, r) {
      i(t, n, r), s(n, o), s(o, a), s(a, f), s(a, b), s(a, $), h($, e[1]), s(o, x), s(o, k), s(k, v), s(k, w), s(k, _), h(_, e[2]), s(n, C), s(n, S), s(S, I), s(S, L), s(S, R), h(R, e[0]), s(n, A), s(n, E), s(E, N), s(N, O), M || (T = [p($, 'input', e[7]), p(_, 'input', e[8]), p(R, 'input', e[9]), p(N, 'click', e[4])], M = !0);
    }, p(t, [e]) {
      2 & e && $.value !== t[1] && h($, t[1]), 4 & e && _.value !== t[2] && h(_, t[2]), 1 & e && h(R, t[0]), 8 & e && q !== (q = `${t[3] ? W('sending') : W('post_comment')}`) && g(O, q), 8 & e && y(N, 'cusdis-disabled', t[3]);
    }, i: t, o: t, d(t) {
      t && c(n), M = !1, r(T);
    } };
  } function Z(t, e, n) {
    let { parentId: r } = e; let o = ''; let a = ''; let s = ''; let i = !1; let { onSuccess: c } = e; const l = w('api'); const u = w('setMessage'); const { appId: d, pageId: f, pageUrl: p, pageTitle: m } = w('attrs'); const g = w('refresh'); return t.$$set = (t) => {
      'parentId' in t && n(5, r = t.parentId), 'onSuccess' in t && n(6, c = t.onSuccess);
    }, [o, a, s, i, async function () {
      if (o) {
        if (a) {
          try {
            n(3, i = !0); await l.post('/api/open/comments', { appId: d, pageId: f, content: o, nickname: a, email: s, parentId: r, pageUrl: p, pageTitle: m }); await g(), n(0, o = ''), n(1, a = ''), n(2, s = ''), c && c(), u(W('comment_has_been_sent'));
          } finally {
            n(3, i = !1);
          }
        } else {
          alert(W('nickname_is_required'));
        }
      } else {
        alert(W('content_is_required'));
      }
    }, r, c, function () {
      a = this.value, n(1, a);
    }, function () {
      s = this.value, n(2, s);
    }, function () {
      o = this.value, n(0, o);
    }];
  } class tt extends K {
    constructor(t) {
      super(), G(this, t, Z, X, a, { parentId: 5, onSuccess: 6 });
    }
  } function et(t, e, n) {
    const r = t.slice(); return r[6] = e[n], r;
  } function nt(e) {
    let n, r; return { c() {
      n = l('div'), r = l('span'), r.textContent = `${W('mod_badge')}`, m(n, 'class', 'mr-2 dark:bg-gray-500 bg-gray-200 text-xs py-0.5 px-1 rounded dark:text-gray-100');
    }, m(t, e) {
      i(t, n, e), s(n, r);
    }, p: t, d(t) {
      t && c(n);
    } };
  } function rt(t) {
    let e; let n; let r = []; const o = new Map(); let a = t[1].replies.data; const s = t => t[6].id; for (let i = 0; i < a.length; i += 1) {
      const e = et(t, a, i); const n = s(e); o.set(n, r[i] = ot(n, e));
    } return { c() {
      for (let t = 0; t < r.length; t += 1)r[t].c(); e = f();
    }, m(t, o) {
      for (let e = 0; e < r.length; e += 1)r[e].m(t, o); i(t, e, o), n = !0;
    }, p(t, n) {
      2 & n && (a = t[1].replies.data, j(), r = D(r, n, s, 1, t, a, o, e.parentNode, F, ot, e, et), U());
    }, i(t) {
      if (!n) {
        for (let t = 0; t < a.length; t += 1)z(r[t]); n = !0;
      }
    }, o(t) {
      for (let e = 0; e < r.length; e += 1)P(r[e]); n = !1;
    }, d(t) {
      for (let e = 0; e < r.length; e += 1)r[e].d(t); t && c(e);
    } };
  } function ot(t, e) {
    let n, r, o; return r = new ct({ props: { isChild: !0, comment: e[6] } }), { key: t, first: null, c() {
      n = f(), H(r.$$.fragment), this.first = n;
    }, m(t, e) {
      i(t, n, e), J(r, t, e), o = !0;
    }, p(t, n) {
      e = t; const o = {}; 2 & n && (o.comment = e[6]), r.$set(o);
    }, i(t) {
      o || (z(r.$$.fragment, t), o = !0);
    }, o(t) {
      P(r.$$.fragment, t), o = !1;
    }, d(t) {
      t && c(n), B(r, t);
    } };
  } function at(t) {
    let e, n, r; return n = new tt({ props: { parentId: t[1].id, onSuccess: t[5] } }), { c() {
      e = l('div'), H(n.$$.fragment), m(e, 'class', 'mt-4 pl-4 border-l-2 border-gray-200');
    }, m(t, o) {
      i(t, e, o), J(n, e, null), r = !0;
    }, p(t, e) {
      const r = {}; 2 & e && (r.parentId = t[1].id), 1 & e && (r.onSuccess = t[5]), n.$set(r);
    }, i(t) {
      r || (z(n.$$.fragment, t), r = !0);
    }, o(t) {
      P(n.$$.fragment, t), r = !1;
    }, d(t) {
      t && c(e), B(n);
    } };
  } function st(t) {
    let e; let n; let r; let o; let a; let f; let h; let b; let $; let x; let k; let v; let w; let _; let C; let S; let I; let L; let R = `${t[1].by_nickname}`; let A = `${t[1].parsedCreatedAt}`; let E = `${t[1].parsedContent}`; let N = t[1].moderatorId && nt(); let O = t[1].replies.data.length > 0 && rt(t); let M = t[0] && at(t); return { c() {
      e = l('div'), n = l('div'), r = l('div'), o = u(R), a = d(), N && N.c(), f = d(), h = l('div'), b = u(A), $ = d(), x = l('div'), k = d(), O && O.c(), v = d(), w = l('div'), _ = l('button'), _.textContent = `${W('reply_btn')}`, C = d(), M && M.c(), m(r, 'class', 'mr-2 font-medium dark:text-gray-100'), m(n, 'class', 'flex items-center'), m(h, 'class', 'text-gray-500 text-sm dark:text-gray-400'), m(x, 'class', 'text-gray-500 my-2 dark:text-gray-200'), m(_, 'class', 'font-medium text-sm text-gray-500 dark:bg-transparent dark:text-gray-100'), m(_, 'type', 'button'), m(e, 'class', 'my-4'), y(e, 'pl-4', t[2]), y(e, 'border-l-2', t[2]), y(e, 'border-color-gray-200', t[2]), y(e, 'cusdis-indicator', t[3]);
    }, m(c, l) {
      i(c, e, l), s(e, n), s(n, r), s(r, o), s(n, a), N && N.m(n, null), s(e, f), s(e, h), s(h, b), s(e, $), s(e, x), x.innerHTML = E, s(e, k), O && O.m(e, null), s(e, v), s(e, w), s(w, _), s(e, C), M && M.m(e, null), S = !0, I || (L = p(_, 'click', t[4]), I = !0);
    }, p(t, [r]) {
      (!S || 2 & r) && R !== (R = `${t[1].by_nickname}`) && g(o, R), t[1].moderatorId ? N ? N.p(t, r) : (N = nt(), N.c(), N.m(n, null)) : N && (N.d(1), N = null), (!S || 2 & r) && A !== (A = `${t[1].parsedCreatedAt}`) && g(b, A), (!S || 2 & r) && E !== (E = `${t[1].parsedContent}`) && (x.innerHTML = E), t[1].replies.data.length > 0
        ? O ? (O.p(t, r), 2 & r && z(O, 1)) : (O = rt(t), O.c(), z(O, 1), O.m(e, v))
        : O && (j(), P(O, 1, 1, () => {
          O = null;
        }), U()), t[0]
        ? M ? (M.p(t, r), 1 & r && z(M, 1)) : (M = at(t), M.c(), z(M, 1), M.m(e, null))
        : M && (j(), P(M, 1, 1, () => {
          M = null;
        }), U()), 4 & r && y(e, 'pl-4', t[2]), 4 & r && y(e, 'border-l-2', t[2]), 4 & r && y(e, 'border-color-gray-200', t[2]);
    }, i(t) {
      S || (z(O), z(M), S = !0);
    }, o(t) {
      P(O), P(M), S = !1;
    }, d(t) {
      t && c(e), N && N.d(), O && O.d(), M && M.d(), I = !1, L();
    } };
  } function it(t, e, n) {
    let { comment: r } = e; let { showReplyForm: o = !1 } = e; let { isChild: a = !1 } = e; const { showIndicator: s } = w('attrs'); return t.$$set = (t) => {
      'comment' in t && n(1, r = t.comment), 'showReplyForm' in t && n(0, o = t.showReplyForm), 'isChild' in t && n(2, a = t.isChild);
    }, [o, r, a, s, (t) => {
      n(0, o = !o);
    }, () => {
      n(0, o = !1);
    }];
  } class ct extends K {
    constructor(t) {
      super(), G(this, t, it, st, a, { comment: 1, showReplyForm: 0, isChild: 2 });
    }
  } function lt(t, e, n) {
    const r = t.slice(); return r[12] = e[n], r[14] = n, r;
  } function ut(t, e, n) {
    const r = t.slice(); return r[15] = e[n], r;
  } function dt(t) {
    let e; let n; let r; let o; let a; let u; let f; let p; let g; let h; let b; let $; let x; let k; let v; let w = t[3] && ft(t); r = new tt({}); const _ = [mt, pt]; const C = []; function S(t, e) {
      return t[2] ? 0 : 1;
    } return p = S(t), g = C[p] = _[p](t), { c() {
      e = l('div'), w && w.c(), n = d(), H(r.$$.fragment), o = d(), a = l('div'), u = d(), f = l('div'), g.c(), h = d(), b = l('div'), $ = d(), x = l('div'), k = l('a'), k.textContent = `${W('powered_by')}`, m(a, 'class', 'my-8'), m(f, 'class', 'mt-4'), m(b, 'class', 'my-8'), m(k, 'class', 'underline '), m(k, 'href', 'https://cusdis.com'), m(x, 'class', 'text-center text-sm text-gray-900 dark:text-gray-100'), y(e, 'dark', t[5] === 'dark');
    }, m(t, c) {
      i(t, e, c), w && w.m(e, null), s(e, n), J(r, e, null), s(e, o), s(e, a), s(e, u), s(e, f), C[p].m(f, null), s(e, h), s(e, b), s(e, $), s(e, x), s(x, k), v = !0;
    }, p(t, r) {
      t[3] ? w ? w.p(t, r) : (w = ft(t), w.c(), w.m(e, n)) : w && (w.d(1), w = null); const o = p; p = S(t), p === o
        ? C[p].p(t, r)
        : (j(), P(C[o], 1, 1, () => {
            C[o] = null;
          }), U(), g = C[p], g ? g.p(t, r) : (g = C[p] = _[p](t), g.c()), z(g, 1), g.m(f, null)), 32 & r && y(e, 'dark', t[5] === 'dark');
    }, i(t) {
      v || (z(r.$$.fragment, t), z(g), v = !0);
    }, o(t) {
      P(r.$$.fragment, t), P(g), v = !1;
    }, d(t) {
      t && c(e), w && w.d(), B(r), C[p].d();
    } };
  } function ft(t) {
    let e, n; return { c() {
      e = l('div'), n = u(t[3]), m(e, 'class', 'p-2 mb-4 bg-blue-500 text-white');
    }, m(t, r) {
      i(t, e, r), s(e, n);
    }, p(t, e) {
      8 & e && g(n, t[3]);
    }, d(t) {
      t && c(e);
    } };
  } function pt(t) {
    let e; let n; let r; let o = []; const a = new Map(); let s = t[0].data; const l = t => t[15].id; for (let i = 0; i < s.length; i += 1) {
      const e = ut(t, s, i); const n = l(e); a.set(n, o[i] = gt(n, e));
    } let u = t[0].pageCount > 1 && ht(t); return { c() {
      for (let t = 0; t < o.length; t += 1)o[t].c(); e = d(), u && u.c(), n = f();
    }, m(t, a) {
      for (let e = 0; e < o.length; e += 1)o[e].m(t, a); i(t, e, a), u && u.m(t, a), i(t, n, a), r = !0;
    }, p(t, r) {
      1 & r && (s = t[0].data, j(), o = D(o, r, l, 1, t, s, a, e.parentNode, F, gt, e, ut), U()), t[0].pageCount > 1 ? u ? u.p(t, r) : (u = ht(t), u.c(), u.m(n.parentNode, n)) : u && (u.d(1), u = null);
    }, i(t) {
      if (!r) {
        for (let t = 0; t < s.length; t += 1)z(o[t]); r = !0;
      }
    }, o(t) {
      for (let e = 0; e < o.length; e += 1)P(o[e]); r = !1;
    }, d(t) {
      for (let e = 0; e < o.length; e += 1)o[e].d(t); t && c(e), u && u.d(t), t && c(n);
    } };
  } function mt(e) {
    let n; return { c() {
      n = l('div'), n.textContent = `${W('loading')}...`, m(n, 'class', 'text-gray-900 dark:text-gray-100');
    }, m(t, e) {
      i(t, n, e);
    }, p: t, i: t, o: t, d(t) {
      t && c(n);
    } };
  } function gt(t, e) {
    let n, r, o; return r = new ct({ props: { comment: e[15], firstFloor: !0 } }), { key: t, first: null, c() {
      n = f(), H(r.$$.fragment), this.first = n;
    }, m(t, e) {
      i(t, n, e), J(r, t, e), o = !0;
    }, p(t, n) {
      e = t; const o = {}; 1 & n && (o.comment = e[15]), r.$set(o);
    }, i(t) {
      o || (z(r.$$.fragment, t), o = !0);
    }, o(t) {
      P(r.$$.fragment, t), o = !1;
    }, d(t) {
      t && c(n), B(r, t);
    } };
  } function ht(t) {
    let e; let n = new Array(t[0].pageCount); const r = []; for (let o = 0; o < n.length; o += 1)r[o] = yt(lt(t, n, o)); return { c() {
      e = l('div'); for (let t = 0; t < r.length; t += 1)r[t].c();
    }, m(t, n) {
      i(t, e, n); for (let o = 0; o < r.length; o += 1)r[o].m(e, null);
    }, p(t, o) {
      if (67 & o) {
        let a; for (n = new Array(t[0].pageCount), a = 0; a < n.length; a += 1) {
          const s = lt(t, n, a); r[a] ? r[a].p(s, o) : (r[a] = yt(s), r[a].c(), r[a].m(e, null));
        } for (;a < r.length; a += 1)r[a].d(1); r.length = n.length;
      }
    }, d(t) {
      t && c(e), (function (t, e) {
        for (let n = 0; n < t.length; n += 1)t[n] && t[n].d(e);
      }(r, t));
    } };
  } function yt(t) {
    let e; let n; let r; let o; const a = `${t[14] + 1}`; function d(...e) {
      return t[8](t[14], ...e);
    } return { c() {
      e = l('button'), n = u(a), m(e, 'class', 'px-2 py-1 text-sm mr-2 dark:text-gray-200'), y(e, 'underline', t[1] === t[14] + 1);
    }, m(t, a) {
      i(t, e, a), s(e, n), r || (o = p(e, 'click', d), r = !0);
    }, p(n, r) {
      t = n, 2 & r && y(e, 'underline', t[1] === t[14] + 1);
    }, d(t) {
      t && c(e), r = !1, o();
    } };
  } function bt(t) {
    let e; let n; let r = !t[4] && dt(t); return { c() {
      r && r.c(), e = f();
    }, m(t, o) {
      r && r.m(t, o), i(t, e, o), n = !0;
    }, p(t, [n]) {
      t[4]
        ? r && (j(), P(r, 1, 1, () => {
          r = null;
        }), U())
        : r ? (r.p(t, n), 16 & n && z(r, 1)) : (r = dt(t), r.c(), z(r, 1), r.m(e.parentNode, e));
    }, i(t) {
      n || (z(r), n = !0);
    }, o(t) {
      P(r), n = !1;
    }, d(t) {
      r && r.d(t), t && c(e);
    } };
  } function $t(t, e, n) {
    let r; let { attrs: o } = e; let { commentsResult: a } = e; let s = 1; let i = !0; let c = ''; let l = o.theme || 'light'; const u = Q.create({ baseURL: o.host }); async function d(t = 1) {
      n(2, i = !0); try {
        const e = await u.get('/api/open/comments', { headers: { 'x-timezone-offset': -(new Date()).getTimezoneOffset() }, params: { page: t, appId: o.appId, pageId: o.pageId } }); n(0, a = e.data.data);
      } catch (e) {
        n(4, r = e);
      } finally {
        n(2, i = !1);
      }
    } function f(t) {
      n(1, s = t), d(t);
    }k(() => {
      function t(t) {
        try {
          const e = JSON.parse(t.data); if (e.from === 'cusdis') {
            switch (e.event) {
              case 'setTheme':n(5, l = e.data);
            }
          }
        } catch (e) {}
      } return window.addEventListener('message', t), () => {
        window.removeEventListener('message', t);
      };
    }), v('api', u), v('attrs', o), v('refresh', d), v('setMessage', (t) => {
      n(3, c = t);
    }), k(() => {
      d();
    }); return t.$$set = (t) => {
      'attrs' in t && n(7, o = t.attrs), 'commentsResult' in t && n(0, a = t.commentsResult);
    }, [a, s, i, c, r, l, f, o, (t, e) => f(t + 1)];
  }window.CUSDIS = {}; const xt = window.parent; const kt = document.querySelector('#root'); const vt = window.__DATA__; function wt(t, e = {}) {
    xt.postMessage(JSON.stringify({ from: 'cusdis', event: t, data: e }));
  } function _t() {
    wt('resize', document.documentElement.offsetHeight);
  } new class extends K {
    constructor(t) {
      super(), G(this, t, $t, bt, a, { attrs: 7, commentsResult: 0 });
    }
  }({ target: kt, props: { attrs: vt } }), wt('onload'), _t(); new MutationObserver(() => {
    _t();
  }).observe(kt, { childList: !0, subtree: !0 });
}));
