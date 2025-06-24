!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? (module.exports = t()) : "function" == typeof define && define.amd ? define(t) : ((e = "undefined" != typeof globalThis ? globalThis : e || self).Mexp = t());
})(this, function () {
    "use strict";


    // Configure Decimal.js globally (optional, but good practice for consistency)
    // You might want to adjust precision and rounding mode based on your needs.
    Decimal.set({
        precision: 30, // Example: 30 significant digits of precision
        rounding: Decimal.ROUND_HALF_UP // Standard rounding
    });

    function e() {
        return (
            (e = Object.assign
                ? Object.assign.bind()
                : function (e) {
                      for (var t = 1; t < arguments.length; t++) {
                          var n = arguments[t];
                          for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
                      }
                      return e;
                  }),
            e.apply(this, arguments)
        );
    }
    var t,
        n = { 0: 11, 1: 0, 2: 3, 3: 0, 4: 0, 5: 0, 6: 0, 7: 11, 8: 11, 9: 1, 10: 10, 11: 0, 12: 11, 13: 0, 14: -1 };
    function a(e, t) {
        for (var n = 0; n < e.length; n++) e[n] += t;
        return e;
    }
    !(function (e) {
        (e[(e.FUNCTION_WITH_ONE_ARG = 0)] = "FUNCTION_WITH_ONE_ARG"),
            (e[(e.NUMBER = 1)] = "NUMBER"),
            (e[(e.BINARY_OPERATOR_HIGH_PRECENDENCE = 2)] = "BINARY_OPERATOR_HIGH_PRECENDENCE"),
            (e[(e.CONSTANT = 3)] = "CONSTANT"),
            (e[(e.OPENING_PARENTHESIS = 4)] = "OPENING_PARENTHESIS"),
            (e[(e.CLOSING_PARENTHESIS = 5)] = "CLOSING_PARENTHESIS"),
            (e[(e.DECIMAL = 6)] = "DECIMAL"),
            (e[(e.POSTFIX_FUNCTION_WITH_ONE_ARG = 7)] = "POSTFIX_FUNCTION_WITH_ONE_ARG"),
            (e[(e.FUNCTION_WITH_N_ARGS = 8)] = "FUNCTION_WITH_N_ARGS"),
            (e[(e.BINARY_OPERATOR_LOW_PRECENDENCE = 9)] = "BINARY_OPERATOR_LOW_PRECENDENCE"),
            (e[(e.BINARY_OPERATOR_PERMUTATION = 10)] = "BINARY_OPERATOR_PERMUTATION"),
            (e[(e.COMMA = 11)] = "COMMA"),
            (e[(e.EVALUATED_FUNCTION = 12)] = "EVALUATED_FUNCTION"),
            (e[(e.EVALUATED_FUNCTION_PARAMETER = 13)] = "EVALUATED_FUNCTION_PARAMETER"),
            (e[(e.SPACE = 14)] = "SPACE");
    })(t || (t = {}));
    var o = { 0: !0, 1: !0, 3: !0, 4: !0, 6: !0, 8: !0, 9: !0, 12: !0, 13: !0, 14: !0 },
        h = { 0: !0, 1: !0, 2: !0, 3: !0, 4: !0, 5: !0, 6: !0, 7: !0, 8: !0, 9: !0, 10: !0, 11: !0, 12: !0, 13: !0 },
        r = { 0: !0, 3: !0, 4: !0, 8: !0, 12: !0, 13: !0 },
        u = {},
        s = { 0: !0, 1: !0, 3: !0, 4: !0, 6: !0, 8: !0, 12: !0, 13: !0 },
        p = { 1: !0 },
        i = [
            [],
            ["1", "2", "3", "7", "8", "9", "4", "5", "6", "+", "-", "*", "/", "(", ")", "^", "!", "P", "C", "e", "0", ".", ",", "n", " ", "&"],
            ["pi", "ln", "Pi"],
            ["sin", "cos", "tan", "Del", "int", "Mod", "log", "pow"],
            ["asin", "acos", "atan", "cosh", "root", "tanh", "sinh"],
            ["acosh", "atanh", "asinh", "Sigma"],
        ];
    function l(e, t, n, a) {
        for (var o = 0; o < a; o++) if (e[n + o] !== t[o]) return !1;
        return !0;
    }
    function E(e) {
        for (var a = 0; a < e.length; a++) {
            var o = e[a].token.length,
                h = -1;
            e[a].type === t.FUNCTION_WITH_N_ARGS && void 0 === e[a].numberOfArguments && (e[a].numberOfArguments = 2), (i[o] = i[o] || []);
            for (var r = 0; r < i[o].length; r++)
                if (e[a].token === i[o][r]) {
                    h = N(i[o][r], this.tokens);
                    break;
                }
            -1 === h
                ? (this.tokens.push(e[a]), (e[a].precedence = n[e[a].type]), i.length <= e[a].token.length && (i[e[a].token.length] = []), i[e[a].token.length].push(e[a].token))
                : ((this.tokens[h] = e[a]), (e[a].precedence = n[e[a].type]));
        }
    }
    function N(e, t) {
        for (var n = 0; n < t.length; n++) if (t[n].token === e) return n;
        return -1;
    }
    var v = function (e, n) {
        var E,
            v = { value: this.math.changeSign, type: t.FUNCTION_WITH_ONE_ARG, precedence: 4, show: "-" },
            f = { value: ")", show: ")", type: t.CLOSING_PARENTHESIS, precedence: 0 },
            y = { value: "(", type: t.OPENING_PARENTHESIS, precedence: 0, show: "(" },
            A = [y],
            c = [],
            _ = e,
            O = o,
            T = 0,
            R = u,
            I = "";
        void 0 !== n && this.addToken(n);
        var w = (function (e, t) {
            for (var n, a, o, h = [], r = t.length, u = 0; u < r; u++)
                if (!(u < r - 1 && " " === t[u] && " " === t[u + 1])) {
                    for (n = "", a = t.length - u > i.length - 2 ? i.length - 1 : t.length - u; a > 0; a--) if (void 0 !== i[a]) for (o = 0; o < i[a].length; o++) l(t, i[a][o], u, a) && ((n = i[a][o]), (o = i[a].length), (a = 0));
                    if (((u += n.length - 1), "" === n)) throw new Error("Can't understand after " + t.slice(u));
                    h.push(e.tokens[N(n, e.tokens)]);
                }
            return h;
        })(this, _);
        for (E = 0; E < w.length; E++) {
            var P = w[E];
            if (14 !== P.type) {
                var m,
                    M = P.token,
                    g = P.type,
                    C = P.value,
                    d = P.precedence,
                    k = P.show,
                    S = A[A.length - 1];
                for (m = c.length; m-- && 0 === c[m]; )
                    if (
                        -1 !==
                        [
                            t.FUNCTION_WITH_ONE_ARG,
                            t.BINARY_OPERATOR_HIGH_PRECENDENCE,
                            t.CONSTANT,
                            t.OPENING_PARENTHESIS,
                            t.CLOSING_PARENTHESIS,
                            t.BINARY_OPERATOR_LOW_PRECENDENCE,
                            t.BINARY_OPERATOR_PERMUTATION,
                            t.COMMA,
                            t.EVALUATED_FUNCTION,
                            t.EVALUATED_FUNCTION_PARAMETER,
                        ].indexOf(g)
                    ) {
                        if (!0 !== O[g]) throw new Error(M + " is not allowed after " + I);
                        A.push(f), (O = h), (R = s), c.pop();
                    }
                if (!0 !== O[g]) throw new Error(M + " is not allowed after " + I);
                !0 === R[g] && ((g = t.BINARY_OPERATOR_HIGH_PRECENDENCE), (C = this.math.mul), (k = "&times;"), (d = 3), (E -= 1));
                var U = { value: C, type: g, precedence: d, show: k, numberOfArguments: P.numberOfArguments };
                if (g === t.FUNCTION_WITH_ONE_ARG) (O = o), (R = u), a(c, 1), A.push(U), w[E + 1].type !== t.OPENING_PARENTHESIS && (A.push(y), c.push(2));
                else if (g === t.NUMBER) S.type === t.NUMBER ? ((S.value += C), a(c, 1)) : A.push(U), (O = h), (R = r); // Keep value as string for numbers
                else if (g === t.BINARY_OPERATOR_HIGH_PRECENDENCE) (O = o), (R = u), a(c, 2), A.push(U);
                else if (g === t.CONSTANT) A.push(U), (O = h), (R = s);
                else if (g === t.OPENING_PARENTHESIS) a(c, 1), T++, (O = o), (R = u), A.push(U);
                else if (g === t.CLOSING_PARENTHESIS) {
                    if (!T) throw new Error("Closing parenthesis are more than opening one, wait What!!!");
                    T--, (O = h), (R = s), A.push(U), a(c, 1);
                } else if (g === t.DECIMAL) {
                    if (S.hasDec) throw new Error("Two decimals are not allowed in one number");
                    S.type !== t.NUMBER && ((S = { show: "0", value: "0", type: t.NUMBER, precedence: 0 }), A.push(S), a(c, -1)), (O = p), a(c, 1), (R = u), (S.value += C), (S.hasDec = !0); // Keep value as string for decimals
                } else g === t.POSTFIX_FUNCTION_WITH_ONE_ARG && ((O = h), (R = s), a(c, 1), A.push(U));
                g === t.FUNCTION_WITH_N_ARGS
                    ? ((O = o), (R = u), a(c, P.numberOfArguments + 2), A.push(U), w[E + 1].type !== t.OPENING_PARENTHESIS && (A.push(y), c.push(P.numberOfArguments + 2)))
                    : g === t.BINARY_OPERATOR_LOW_PRECENDENCE
                    ? (S.type === t.BINARY_OPERATOR_LOW_PRECENDENCE
                          ? S.value === this.math.add
                              ? ((S.value = C), (S.show = k), a(c, 1))
                              : S.value === this.math.sub && "-" === k && ((S.value = this.math.add), (S.show = "+"), a(c, 1))
                          : S.type !== t.CLOSING_PARENTHESIS && S.type !== t.POSTFIX_FUNCTION_WITH_ONE_ARG && S.type !== t.NUMBER && S.type !== t.CONSTANT && S.type !== t.EVALUATED_FUNCTION_PARAMETER
                          ? "-" === M && ((O = o), (R = u), a(c, 1), c.push(2), A.push(v), A.push(y))
                          : (A.push(U), a(c, 2)),
                      (O = o),
                      (R = u))
                    : g === t.BINARY_OPERATOR_PERMUTATION
                    ? ((O = o), (R = u), a(c, 2), A.push(U))
                    : g === t.COMMA
                    ? ((O = o), (R = u), A.push(U))
                    : g === t.EVALUATED_FUNCTION
                    ? ((O = o), (R = u), a(c, 6), A.push(U), w[E + 1].type !== t.OPENING_PARENTHESIS && (A.push(y), c.push(6)))
                    : g === t.EVALUATED_FUNCTION_PARAMETER && ((O = h), (R = s), A.push(U)),
                    a(c, -1),
                    (I = M);
            } else if (E > 0 && E < w.length - 1 && 1 === w[E + 1].type && (1 === w[E - 1].type || 6 === w[E - 1].type)) throw new Error("Unexpected Space");
        }
        for (m = c.length; m--; ) A.push(f);
        if (!0 !== O[5]) throw new Error("complete the expression");
        for (; T--; ) A.push(f);
        return A.push(f), A;
    };
    function f(e) {
        for (var t, n, a, o = [], h = -1, r = -1, u = [{ value: "(", type: 4, precedence: 0, show: "(" }], s = 1; s < e.length; s++)
            if (1 === e[s].type || 3 === e[s].type || 13 === e[s].type) { // If it's a NUMBER, CONSTANT, or EVALUATED_FUNCTION_PARAMETER
                // Convert number and constant values to Decimal objects here
                // EVALUATED_FUNCTION_PARAMETER (type 13) value will be resolved later in postfixEval
                if (e[s].type === 1 || e[s].type === 3) {
                    e[s].value = new Decimal(e[s].value); // Convert string to Decimal
                }
                o.push(e[s]);
            }
            else if (4 === e[s].type) u.push(e[s]);
            else if (5 === e[s].type)
                for (; 4 !== (null == (p = n = u.pop()) ? void 0 : p.type); ) {
                    var p;
                    n && o.push(n);
                }
            else if (11 === e[s].type) {
                for (; 4 !== (null == (i = n = u.pop()) ? void 0 : i.type); ) {
                    var i;
                    n && o.push(n);
                }
                u.push(n);
            } else {
                (r = (t = e[s]).precedence), (h = (a = u[u.length - 1]).precedence);
                // No change needed for this logic, as it operates on precedence values
                var l = "Math.pow" == a.value && "Math.pow" == t.value;
                if (r > h) u.push(t);
                else {
                    for (; (h >= r && !l) || (l && r < h); ) (n = u.pop()), (a = u[u.length - 1]), n && o.push(n), (h = a.precedence), (l = "Math.pow" == t.value && "Math.pow" == a.value);
                    u.push(t);
                }
            }
        return o;
    }
    function y(e, t) {
        // Initialize PI and E as Decimal objects
        ((t = t || {}).PI = new Decimal(Math.PI));
        (t.E = new Decimal(Math.E));
        for (var n, a, o, h = [], r = void 0 !== t.n, u = 0; u < e.length; u++)
            if (1 === e[u].type) h.push({ value: e[u].value, type: 1 }); // Value is already Decimal from f()
            else if (3 === e[u].type) h.push({ value: e[u].value, type: 3 }); // Value is already Decimal from f()
            else if (0 === e[u].type) { // FUNCTION_WITH_ONE_ARG
                var s = h[h.length - 1];
                // Ensure s.value is a Decimal and function returns a Decimal
                Array.isArray(s) ? s.push(e[u]) : (s.value = e[u].value(s.value));
            } else if (7 === e[u].type) { // POSTFIX_FUNCTION_WITH_ONE_ARG
                var p = h[h.length - 1];
                // Ensure p.value is a Decimal and function returns a Decimal
                Array.isArray(p) ? p.push(e[u]) : (p.value = e[u].value(p.value));
            } else if (8 === e[u].type) { // FUNCTION_WITH_N_ARGS
                for (var i = [], l = 0; l < e[u].numberOfArguments; l++) {
                    var E = h.pop();
                    E && i.push(E.value); // Values should be Decimal
                }
                h.push({ type: 1, value: e[u].value.apply(e[u], i.reverse()) }); // Function should return Decimal
            } else if (10 === e[u].type) { // BINARY_OPERATOR_PERMUTATION (e.g., ^)
                (n = h.pop()), (a = h.pop()); // n and a should be Decimal
                Array.isArray(a) ? ((a = a.concat(n)).push(e[u]), h.push(a)) : Array.isArray(n) ? (n.unshift(a), n.push(e[u]), h.push(n)) : h.push({ type: 1, value: e[u].value(a.value, n.value) });
            } else if (2 === e[u].type || 9 === e[u].type) { // BINARY_OPERATOR_HIGH_PRECENDENCE (* /) or LOW_PRECENDENCE (+ -)
                (n = h.pop()), (a = h.pop()); // n and a should be Decimal
                Array.isArray(a) ? ((a = a.concat(n)).push(e[u]), h.push(a)) : Array.isArray(n) ? (n.unshift(a), n.push(e[u]), h.push(n)) : h.push({ type: 1, value: e[u].value(a.value, n.value) });
            } else if (12 === e[u].type) { // EVALUATED_FUNCTION
                n = h.pop();
                var N = void 0;
                (N = !Array.isArray(n) && n ? [n] : n || []), (a = h.pop()), (o = h.pop()), h.push({ type: 1, value: e[u].value(o.value, a.value, N) });
            } else if (13 === e[u].type) { // EVALUATED_FUNCTION_PARAMETER (e.g., 'n' in Sigma)
                r ? h.push({ value: new Decimal(t[e[u].value]), type: 3 }) : h.push([e[u]]); // Ensure parameter value is Decimal
            }
        if (h.length > 1) throw new Error("Uncaught Syntax error");
        return h[0].value; // Return the Decimal object directly
    }
    var A = (function () {
        function t() {
            var t;
            (this.toPostfix = f),
                (this.addToken = E),
                (this.lex = v),
                (this.postfixEval = y),
                (this.math =
                    ((t = this),
                    {
                        isDegree: !0,
                        add: function (e, t) {
                            return e.plus(t);
                        },
                        changeSign: function (e) {
                            return e.negated();
                        },
                        div: function (e, t) {
                            if (t.equals(new Decimal(0))) throw new Error("infinity");
                            if (e.equals(new Decimal(0))) return e;
                            if (t.abs().greaterThan(new Decimal('1e9'))) throw new Error("explode");
                            if (t.abs().lessThan(new Decimal('1e-9')) && !t.equals(new Decimal(0))) throw new Error("explode"); // Added !t.equals(0) to handle exact zero
                            return e.dividedBy(t);
                        },
                        fact: function (e) {
                            // Check using Decimal methods
                            if (!e.isInteger()) throw new Error("undefined");
                            if (e.isNegative()) throw new Error("undefined");
                            if (e.greaterThan(new Decimal(20))) throw new Error("explode");
                            let res = new Decimal(1); // Initialize result with Decimal
                            for (let n = new Decimal(2); n.lessThanOrEqualTo(e); n = n.plus(1)) {
                                res = res.times(n);
                            }
                            return res;
                        },
                        inverse: function (e) {
                            return new Decimal(1).dividedBy(e);
                        },
                        mul: function (e, t) {
                            return e.times(t);
                        },
                        pow: function(x, y) {
                            if (x.equals(new Decimal(1))) {
                                return x;
                            }
                            if (y.equals(new Decimal(0))) {
                                return new Decimal(1);
                            }
                            if (y.abs().greaterThan(new Decimal(20))) throw new Error("explode");
                            const result = x.pow(y); // Result will be a Decimal
                            if (result.abs().lessThan(new Decimal('1e-9')) && !x.equals(new Decimal(0))) throw new Error("explode");
                            if (result.abs().greaterThan(new Decimal('1e15'))) throw new Error("explode");
                            return result;
                        },
                        sub: function (e, t) {
                            return e.minus(t);
                        }
                    })),
                (this.tokens = (function (t) {
                    return [
                        { token: "pi", show: "&pi;", type: 3, value: "PI" },
                        { token: "(", show: "(", type: 4, value: "(" },
                        { token: ")", show: ")", type: 5, value: ")" },
                        { token: " ", show: " ", type: 14, value: " ".anchor },
                        { token: "7", show: "7", type: 1, value: "7" },
                        { token: "8", show: "8", type: 1, value: "8" },
                        { token: "9", show: "9", type: 1, value: "9" },
                        // Use Decimal's floor method
                        { token: "int", show: "Int", type: 0, value: (val) => val.floor() },
                        { token: "^", show: "^", type: 10, value: t.math.pow },
                        // Use Decimal's sqrt method
                        { token: "root", show: "root", type: 0, value: (val) => val.sqrt() },
                        { token: "4", show: "4", type: 1, value: "4" },
                        { token: "5", show: "5", type: 1, value: "5" },
                        { token: "6", show: "6", type: 1, value: "6" },
                        { token: "/", show: "&divide;", type: 2, value: t.math.div },
                        { token: "!", show: "!", type: 7, value: t.math.fact },
                        { token: "1", show: "1", type: 1, value: "1" },
                        { token: "2", show: "2", type: 1, value: "2" },
                        { token: "3", show: "3", type: 1, value: "3" },
                        { token: "*", show: "&times;", type: 2, value: t.math.mul },
                        { token: "e", show: "e", type: 3, value: "E" },
                        { token: "0", show: "0", type: 1, value: "0" },
                        { token: ".", show: ".", type: 6, value: "." },
                        { token: "+", show: "+", type: 9, value: t.math.add },
                        { token: "-", show: "-", type: 9, value: t.math.sub },
                        { token: ",", show: ",", type: 11, value: "," },
                        { token: "n", show: "n", type: 13, value: "n" },
                        { token: "pow", show: "pow", type: 8, value: t.math.pow, numberOfArguments: 2 },
                    ].map(function (t) {
                        return e({}, t, { precedence: n[t.type] });
                    });
                })(this));
        }
        return (
            (t.prototype.eval = function (e, t, n) {
                // The result of postfixEval will now be a Decimal object
                if(e.includes("^-")) {
                    throw new Error("caretminus")
                }
                return this.postfixEval(this.toPostfix(this.lex(e, t)), n);
            }),
            t
        );
    })();
    return (A.TOKEN_TYPES = t), (A.tokenTypes = t), A;
});