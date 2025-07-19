function $(t) {
    return document.getElementById(t)
}
function gets(t, e, n) {
    var o = new XMLHttpRequest;
    o.open(null != e ? "POST" : "GET", t, !0),
        o.onreadystatechange = function() {
            4 != o.readyState || 200 != o.status && 304 != o.status || n(o.responseText)
        }
        ,
        o.send(e)
}
var X, Y, M, _gs, _ln, _ff, _v, d31 = [], CX = [-1, -1, -1, 0, 0, 1, 1, 1, 0], CY = [-1, 0, 1, -1, 1, -1, 0, 1, 0];
function S98(t, e) {
    ctx.drawImage(gfb[0], 25 * t, 25 * e),
        setTimeout(function() {
            0 == d31[e][t][0] && ctx.drawImage(gfs[0], 25 * t, 25 * e)
        }, 120)
}
function c67(t, e) {
    for (var n, o = 0, r = 0, a = 0; a < 8; a++)
        f = e + CY[a],
            u = t + CX[a],
        0 <= f && f < Y && 0 <= u && u < X && (2 == (n = (l = d31[f][u])[0]) ? o++ : 0 == n && 1 == l[1] && (r = 1));
    var c = o >= d31[e][t][2];
    for (a = 0; a < 8; a++) {
        var l, f = e + CY[a], u = t + CX[a];
        0 <= f && f < Y && 0 <= u && u < X && 0 == (l = d31[f][u])[0] && (c ? r ? 1 == l[1] && (ctx.drawImage(gfs[2], 25 * u, 25 * f),
            l[0] = 1) : o0o(u, f) : S98(u, f))
    }
    c && r && f17()
}
function f17() {
    var t, e, n;
    for (_edn(),
             $("face").src = gif[2],
             _gs = 3,
             e = 0; e < Y; e++)
        for (t = 0; t < X; t++)
            0 == (n = d31[e][t])[0] ? 1 == n[1] && ctx.drawImage(gfs[3], 25 * t, 25 * e) : 2 == n[0] && 0 == n[1] && (h_f[f_n++] = setInterval(function(t, e) {
                var n = 0;
                return function() {
                    ctx.drawImage(0 == n ? gfb[d31[e][t][2]] : gfs[1], 25 * t, 25 * e),
                        n = !n
                }
            }(t, e), 800))
}
function see() {
    _ln = [];
    for (var t, e, n = 0, o = 0, r = 0; r < Y; r++)
        for (t = 0; t < X; t++) {
            if (2 == (e = d31[r][t])[0] && 1 != e[1])
                return 1;
            0 == e[0] && 0 == e[3] && (1 == e[1] ? n++ : o++,
                _ln.push([t, r]))
        }
    return n != o ? 2 : 0
}
function gtm(t, e) {
    for (var n, o, r = 0, a = 0; a < 8; a++)
        o = e + CY[a],
            n = t + CX[a],
        0 <= o && o < Y && 0 <= n && n < X && 1 == d31[o][n][1] && r++;
    return r
}
function rv() {
    for (var t, e = 0; e < _ln.length; e++)
        t = _ln[e],
            (t = d31[t[1]][t[0]])[1] = 0 == t[1] ? 1 : 0
}
function ck() {
    if (0 != see())
        return 1;
    var t, e, n, o;
    for (rv(),
             e = 0; e < Y; e++)
        for (t = 0; t < X; t++)
            if (o = (n = d31[e][t])[2],
            1 == n[0] && 0 != o && gtm(t, e) != o)
                return rv(),
                    2;
    for (e = 0; e < Y; e++)
        for (t = 0; t < X; t++)
            1 != (n = d31[e][t])[0] && (n[2] = gtm(t, e));
    return 0
}
function ab(t, e) {
    for (var n, o, r, a, c, l, f, u, i, s, _ = 0; _ < 9; _++)
        if (i = e + CY[_],
            u = t + CX[_],
        0 <= i && i < Y && 0 <= u && u < X && (f = (n = d31[i][u])[2],
        1 == n[0]) && 0 < f) {
            for (s = l = 0; s < 8; s++)
                r = i + CY[s],
                    a = u + CX[s],
                0 <= r && r < Y && 0 <= a && a < X && (0 == (c = (o = d31[r][a])[0]) ? l++ : 2 == c && (1 == o[1] ? f-- : l++));
            if (0 < l && f == l)
                for (s = 0; s < 8; s++)
                    r = i + CY[s],
                        a = u + CX[s],
                    0 <= r && r < Y && 0 <= a && a < X && (1 != (c = (o = d31[r][a])[0]) && (o[3] = 1),
                    0 == c) && 1 == _af && M5k(a, r)
        }
}
function o0o(t, e) {
    var n = d31[e][t];
    if (1 == n[1] && (1 == _gs && ck(),
    1 == n[1]))
        return ctx.drawImage(gfs[2], 25 * t, 25 * e),
            n[0] = 1,
            f17(),
            1;
    if (n[0] = 1,
        ctx.drawImage(gfb[n[2]], 25 * t, 25 * e),
    0 == --RB)
        scs();
    else if (0 == n[2])
        for (var o, r, a = 0; a < 8; a++)
            o = e + CY[a],
                r = t + CX[a],
            0 <= o && o < Y && 0 <= r && r < X && 0 == d31[o][r][0] && o0o(r, o);
    return ab(t, e),
        0
}
function scs() {
    var t, e, n;
    for (_ff = _nf ? 2 : _af,
             _gs = 2,
             _edn(),
             e = 0; e < Y; e++)
        for (t = 0; t < X; t++)
            0 == (n = d31[e][t])[0] && (1 != n[1] ? bug(1, t, e) : M5k(t, e));
    0 != RM && bug(2, t, e),
        crm(M),
        $("face").src = gif[1],
        up()
}
function up() {
    var e, t;
    3 < _v && _t0 < 20 || (t = "B" + (e = lid()) + "c3/" + _v + "" + _t0 + "" + _ff,
    3 < _v && (t += "" + X + "" + Y + "" + M),
        gets(app, t, function(t) {
            "" == e && 1 < t.length && (_id = t,
                $("uid").innerHTML = t,
                localStorage.setItem("uid", t))
        }))
}
function DS(t) {
    var o = $(t)
        , r = o.getContext("2d")
        , a = 3;
    return function(t) {
        var e = (t = t < 10 ? "00" + t : t < 100 ? "0" + t : t.toString()).length;
        e != a && (o.width = 13 * e,
            a = e);
        for (var n = 0; n < e; n++)
            r.drawImage(gfd[parseInt(t.charAt(n))], 13 * n, 0)
    }
}
function kai(t, e) {
    for (var n = RB, o = 8; 0 <= o && 0 < n; o--) {
        var r, a = e + CY[o], c = t + CX[o];
        0 <= a && a < Y && 0 <= c && c < X && (r = p32[a * X + c],
            1 == d31[a][c][1] ? (a = Math.floor(Math.random() * n),
                mplus(r, -1),
                mplus(a, 1),
                ex(a, --n)) : ex(r, --n))
    }
    _es()
}
var d32 = []
    , p32 = [];
function _gnt() {
    for (var t, e, n, o = 0; o < Y; o++)
        for (d31[o] = [],
                 t = 0; t < X; t++)
            d31[o][t] = [0, 0, 0, 0];
    for (n = 0; n < XY; n++)
        d32[n] = n,
            p32[n] = n;
    for (RB = XY,
             e = 0; e < M; e++)
        ex(n = Math.floor(Math.random() * RB), --RB);
    for (n = RB; n < XY; n++)
        mplus(n, 1);
    RB = XY - (RM = M)
}
function ex(t, e) {
    var n = d32[t]
        , o = d32[e];
    d32[t] = o,
        d32[e] = n,
        p32[n] = e,
        p32[o] = t
}
function mplus(t, e) {
    var t = d32[t]
        , n = Math.floor(t / X)
        , o = t % X;
    for (d31[n][o][1] += e,
             z = 0; z < 8; z++)
        cy = n + CY[z],
            cx = o + CX[z],
        0 <= cy && cy < Y && 0 <= cx && cx < X && (d31[cy][cx][2] += e)
}
var _nf, _mp1, _mp2, _x0, _y0, _hl, h_f = [], f_n = 0;
function _45() {
    0 < he && (clearInterval(he),
        he = 0);
    for (var t = 0; t < f_n; t++)
        clearInterval(h_f[t]);
    f_n = 0,
        _gnt(),
        _d46(),
        _y0 = _x0 = -1,
        _nf = 1,
        _gs = 0
}
function _65(t) {
    var e, n, o;
    _tch || 1 < _gs || (n = paf.getBoundingClientRect(),
        e = Math.floor((t.clientX - n.left) / 25),
        n = Math.floor((t.clientY - n.top) / 25),
    e < 0) || e == X || n < 0 || n == Y || (_x0 = e,
        o = d31[_y0 = n][e][0],
        2 == t.button ? 1 != _mp2 && (1 == o ? c67 : M5k)(e, n) : 1 != _mp1 && (0 == o ? (0 == _gs && kai(e, n),
            o0o) : 1 == o ? c67 : M5k)(e, n))
}
function _67(t) {
    var e, n, o;
    _tch || 1 < _gs || (n = paf.getBoundingClientRect(),
        e = Math.floor((t.clientX - n.left) / 25),
        n = Math.floor((t.clientY - n.top) / 25),
    e < 0) || e == X || n < 0 || n == Y || (o = d31[n][e][0],
        2 == t.button ? null != _mp2 && (1 == o ? c67 : M5k)(e, n) : null != _mp1 && (0 == o ? (0 == _gs && kai(e, n),
            o0o) : 1 == o ? c67 : M5k)(e, n))
}
function _77(t) {
    var e, n, o;
    1 < _gs || (_tch = 1,
        e = paf.getBoundingClientRect(),
        n = Math.floor((t.touches[0].clientX - e.left) / 25),
        o = Math.floor((t.touches[0].clientY - e.top) / 25),
    n < 0) || n == X || o < 0 || o == Y || (1 == d31[o][n][0] ? c67(n, o) : _hl = setTimeout(function() {
        return lgt(n, o)
    }, 320))
}
function lgt(t, e) {
    1 == _opn && null == _tpn || (0 == _gs ? (kai(t, e),
        o0o(t, e)) : (_tch = 3,
        null == _tpn ? (2 == d31[e][t][0] && M5k(t, e),
        0 == d31[e][t][0] && o0o(t, e)) : M5k(t, e)))
}
var _af, tc0 = 0;
function _75(t) {
    if (1 == _tch) {
        var e = paf.getBoundingClientRect()
            , n = Math.floor((t.changedTouches[0].clientX - e.left) / 25)
            , e = Math.floor((t.changedTouches[0].clientY - e.top) / 25);
        if (n < 0 || n == X || e < 0 || e == Y)
            return;
        var o, r, a = d31[e][n][0];
        0 == _gs ? (kai(n, e),
            o0o(n, e)) : null == _tpn ? 1 != a && (o = Date.now(),
            r = n == _x0 && e == _y0 ? o - tc0 : (_x0 = n,
                _y0 = e,
                tc0 = Date.now(),
                1e3),
            (1 == _opn && r < 400 && 0 == a ? o0o : M5k)(n, e),
            tc0 = o) : 0 == a ? o0o(n, e) : 2 == a && M5k(n, e),
            _tch = 4,
            clearTimeout(_hl)
    }
    t.preventDefault ? t.preventDefault() : window.event.returnValue = !1
}
function saf() {
    _af = $("af").checked ? 1 : 0,
        localStorage.setItem("af", _af),
        _45()
}
function _d46() {
    _edn(),
        _tch = he = 0,
        _mp1 = localStorage.getItem("_mp1"),
        _mp2 = localStorage.getItem("_mp2"),
        _tpn = localStorage.getItem("tpn"),
        _opn = localStorage.getItem("opn"),
    null == (_af = localStorage.getItem("af")) && (_af = 0);
    var t = 25 * X;
    $("p42").style.width = 4 + t + "px",
        paf.width = t,
        paf.height = 25 * Y,
        $("face").src = gif[0];
    for (var e = 0; e < X; e++)
        for (var n = 0; n < Y; n++)
            ctx.drawImage(gfs[0], 25 * e, 25 * n);
    paf.onmousedown = function(t) {
        _65(t)
    }
        ,
        paf.onmouseup = function(t) {
            _67(t)
        }
        ,
        paf.ontouchstart = function(t) {
            _77(t)
        }
        ,
        paf.ontouchmove = function() {
            _tch = 2,
                clearTimeout(_hl)
        }
        ,
        paf.ontouchend = function(t) {
            _75(t)
        }
        ,
        crm(RM),
        ces(0),
        $("af").checked = parseInt(_af)
}
function _edn() {
    _t0 = 0 < he ? (clearInterval(he),
        he = 0,
        _t0 = Date.now() - _t0,
        ces(parseInt(_t0 / 1e3)),
        Math.ceil(_t0 / 100)) : 0
}
var _t0, e33, _tpn, _opn, _tch, RM, RB, paf, ctx, crm, ces, he = 0;
function _es() {
    _t0 = Date.now(),
        e33 = 0,
        _gs = 1,
        he = setInterval(function() {
            ces(++e33)
        }, 1e3)
}
function M5k(t, e) {
    _nf = 0;
    var n = d31[e][t];
    0 == n[0] ? 0 < RM && (0 == n[1] && ck(),
        ctx.drawImage(gfs[1], 25 * t, 25 * e),
        n[0] = 2,
        crm(--RM)) : 2 == n[0] && (ctx.drawImage(gfs[0], 25 * t, 25 * e),
        n[0] = 0,
        crm(++RM))
}
function start() {
    score = $("ss").href + "#";
    var t = localStorage.getItem("df5");
    null == t ? ($("hm").value = 15,
        $("vm").value = 15,
        $("mm").value = 20) : (t = t.split(";"),
        $("hm").value = t[0],
        $("vm").value = t[1],
        $("mm").value = t[2]),
        document.oncontextmenu = function() {
            return !1
        }
        ,
        document.onselectstart = function() {
            return !1
        }
        ,
        paf = $("paf"),
        ctx = paf.getContext("2d"),
        crm = DS("rm"),
        ces = DS("es"),
        _123(localStorage.getItem("ch7")),
        $("uid").innerHTML = lid()
}
var XY, SW, SH, score, _id = null;
function lid() {
    var t;
    return null != _id ? _id : null == (t = null != (t = localStorage.getItem("nick")) && "" != t ? t : localStorage.getItem("uid")) ? "" : t
}
function _123(t) {
    if (_gs = 0,
        SW = document.body.clientWidth,
        SH = document.body.clientHeight,
        _v = t = null == t ? SW < 560 ? 1 : 2 : t,
        $("custom").style.display = 5 == t ? "" : "none",
    1 == t)
        Y = X = 9,
            M = 10,
            XY = 81;
    else if (2 == t)
        Y = X = 16,
            M = 40,
            XY = 256;
    else if (3 == t)
        M = 99,
            Y = SH < SW ? (X = 30,
                16) : (X = 16,
                30),
            XY = 480;
    else if (4 == t)
        X = parseInt((SW - 18) / 25),
            Y = parseInt((SH - 54) / 25),
            M = 480 <= (XY = X * Y) ? .20625 * XY : XY * XY / 5760 + XY / 8,
            M = parseInt(M);
    else {
        if (5 != t)
            return;
        X = parseInt($("hm").value),
            Y = parseInt($("vm").value),
            XY = X * Y,
            M = parseInt($("mm").value),
        XY < M && (M = XY)
    }
    _45(),
        localStorage.setItem("ch7", t),
        $("ss").href = score + _v
}
function udf() {
    _123(5),
        localStorage.setItem("df5", $("hm").value + ";" + $("vm").value + ";" + $("mm").value)
}
function sload(t) {
    var e = localStorage.getItem(t)
        , n = (null == e && (e = 0),
        document.getElementsByName(t));
    for (i = 0; i < n.length; i++)
        n[i].value == e && (n[i].checked = !0);
    return e
}
var rlist = ["_mp1", "_mp2", "tpn", "opn"];
function _save(t, e) {
    var n = rlist[t];
    0 == e ? (localStorage.removeItem(n),
        e = null) : localStorage.setItem(n, e),
        0 == t ? _mp1 = e : 1 == t ? _mp2 = e : 2 == t ? _tpn = e : _opn = e
}
function smore(t) {
    0 == t ? ($("topen").style.display = "block",
        $("thint").style.display = "none") : ($("thint").style.display = "block",
        $("topen").style.display = "none")
}
var mouse2 = function() {
    var t = 0;
    return function() {
        sload("_mp1"),
            sload("_mp2"),
            t = 0 == t ? ($("_mouse").style.display = "block",
                $("setm").innerText = shou,
                1) : ($("_mouse").style.display = "none",
                $("setm").innerText = shez,
                0)
    }
}()
    , touch2 = function() {
    var e = 0;
    return function() {
        var t = sload("tpn");
        sload("opn"),
            smore(t),
            e = 0 == e ? ($("_touch").style.display = "block",
                $("sett").innerText = shou,
                1) : ($("_touch").style.display = "none",
                $("sett").innerText = shez,
                0)
    }
}()
    , setr = function() {
    var t = 0;
    return function() {
        t = 0 == t ? ($("nick").value = localStorage.getItem("nick"),
            $("_rename").style.display = "block",
            $("setr").innerText = shou,
            1) : ($("_rename").style.display = "none",
            $("setr").innerText = shez,
            0)
    }
}();
function rename() {
    var t = $("nick").value.trim();
    t.charCodeAt(0) < 65 ? alert(w1) : (localStorage.setItem("nick", t),
        $("uid").innerHTML = lid(),
        setr())
}
function bcolor() {
    var t = document.body.style
        , e = document.getElementsByTagName("a");
    if ($("bcolor").checked) {
        localStorage.setItem("night", "1"),
            t.backgroundColor = "black",
            t.color = "silver";
        for (var n = 0; n < e.length; n++)
            e[n].style.color = "silver"
    } else {
        localStorage.removeItem("night"),
            t.backgroundColor = "#f7f7f0",
            t.color = "";
        for (n = 0; n < e.length; n++)
            e[n].style.color = ""
    }
}
function night() {
    null != localStorage.getItem("night") && ($("bcolor").checked = !0,
        bcolor())
}
function bug(t, e, n) {
    gets("bug.php", VER + ":" + t, function(t) {})
}
