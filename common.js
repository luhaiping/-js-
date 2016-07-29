(function (window, localStorage, undefined) {
    var LS = {
            set: function (key, value) {
                if (this.get(key) !== null)
                    this.remove(key);
                localStorage.setItem(key, value);
            },
            get: function (key) {
                return localStorage.getItem(key);
            },
            remove: function (key) {
                localStorage.removeItem(key);
            },
            clear: function () {
                localStorage.clear();
            },
            getJson: function (key) {
                return JSON.parse(this.get(key));
            },
            setJson: function (key, value) {
                this.set(key, JSON.stringify(value));
            }
        },
        Z = window.Zepto;
    window.LS = window.LS || LS;
    if (Z) Z.LS = Z.LS || LS;
})(window, window.localStorage);

(function (window, sessionStorage, undefined) {
    var SS = {
            set: function (key, value) {
                if (this.get(key) !== null)
                    this.remove(key);
                sessionStorage.setItem(key, value);
            },
            get: function (key) {
                return sessionStorage.getItem(key);
            },
            remove: function (key) {
                sessionStorage.removeItem(key);
            },
            clear: function () {
                sessionStorage.clear();
            },
            getJson: function (key) {
                return JSON.parse(this.get(key));
            },
            setJson: function (key, value) {
                this.set(key, JSON.stringify(value));
            }
        },
        Z = window.Zepto;
    window.SS = window.SS || SS;
    if (Z) Z.SS = Z.SS || SS;
})(window, window.sessionStorage);

//操作cookie
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["Zepto"], factory)
    } else {
        if (typeof exports === "object") {
            module.exports = factory(require("Zepto"))
        } else {
            factory(Zepto)
        }
    }
}(function ($) {
    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s)
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s)
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value))
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")
        }
        try {
            s = decodeURIComponent(s.replace(pluses, " "));
            return config.json ? JSON.parse(s) : s
        } catch (e) {
        }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value
    }

    var config = $.cookie = function (key, value, options) {
        if (arguments.length > 1 && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);
            if (typeof options.expires === "number") {
                var days = options.expires,
                    t = options.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 86400000)
            }
            return (document.cookie = [encode(key), "=", stringifyCookieValue(value), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path : "", options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : ""].join(""))
        }
        var result = key ? undefined : {},
            cookies = document.cookie ? document.cookie.split("; ") : [],
            i = 0,
            l = cookies.length;
        for (; i < l; i++) {
            var parts = cookies[i].split("="),
                name = decode(parts.shift()),
                cookie = parts.join("=");
            if (key === name) {
                result = read(cookie, value);
                break
            }
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie
            }
        }
        return result
    };
    config.defaults = {};
    $.removeCookie = function (key, options) {
        $.cookie(key, "", $.extend({}, options, {
            expires: -1
        }));
        return !$.cookie(key)
    }
}));

//生成随机数Guid
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;

    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

//取URL字符串中get方法
String.prototype.GetValue = function (parm) {
    var reg = new RegExp("(^|&)" + parm + "=([^&]*)(&|$)");
    var r = this.substr(this.indexOf("\?") + 1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//把表单格式化成JSON
$.fn.serializeObject = function () {
    var obj = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (obj[this.name] !== undefined) {
            if (!obj[this.name].push) {
                obj[this.name] = [obj[this.name]];
            }
            obj[this.name].push(this.value || '');
        } else {
            obj[this.name] = this.value || '';
        }
    });
    return obj;
};

//表单验证的几个方法
var validate = {
    isStuName: function (str,ele) {
        var patrn = /^[\u4E00-\u9FA5A-Za-z.·`~｀～]+$/;
        if (!patrn.exec(str)) {
            message("提醒", "请填写正确的姓名");
            ele.focus();
            return false;
        }
        else {
            return true;
        };
    },
    isName: function (str, ele) {
        if (str) return true;
        else message("提醒", "请填写姓名");
        if (ele) {
            ele.focus();
        } else {

        }

        return false;
    },
    isAddress: function (str) {
        if (str) return true;
        else message("提醒", "请填写详细地址");

        return false;
    },
    isSex: function (str) {
        if (str) return true;
        else message("提醒", "请选择性别");
        return false;
    },
    isEmail: function (str) {


        return true;
    },
    isMobile: function (str, ele) {
        //var reg = /^[1][0-9]{10}$/;
        var reg=/^1[3３4４5５7７8８]\d{9}$/
        var re = new RegExp(reg);

        if (re.test(str)) return true;
        else message("提醒", "请输入正确手机号码");
        if (ele) {
            ele.focus();
        } else {

        }

        return false;
    },
    isPostcode: function (str) {
        if (str.length == 6) return true;
        else message("提醒", "请输入正确邮政编码");
        return false;
    },
    isIdcard: function (str) {
        var city = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外 "
        };
        var tip = "";
        var pass = true;
        if (str.length == 6) {
            return pass;
        }
        if (!str || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[01])\d{3}(\d|X)$/i.test(str)) {
            tip = "身份证号格式错误";
            pass = false;
        } else if (!city[str.substr(0, 2)]) {
            tip = "地址编码错误";
            pass = false;
        } else {
            if (str.length == 18) {
                str = str.split('');
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = str[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if (parity[sum % 11] != str[17]) {
                    tip = "校验位错误";
                    pass = false;
                }
            }
        }
        if (!pass) message("提醒", tip);
        return pass;
    }
};

//模态窗
function message(title, content, selector) {
    var select = (selector || "#message");
    var obj = $(select);
    clearTimeout(obj.attr("time"))

    obj.attr("time", null);
    obj.show();
    obj.find("h2").text(title);
    obj.find("p").text(content);


    obj.attr("time", window.setTimeout(function () {
        obj.hide();
    }, 2000));


    obj.find(".btn").click(function () {
        obj.fadeOut();
    });
}

//触发FastClick
$(function () {
    FastClick.attach(document.body);
    if (window.location.href.GetValue("source") == "wap") {
        $("#gohistory").attr("href", "javascript:history.go(-2)"); //处理旧版页面添加到购物车后，中间会经过toShopping到购物车
    } else {
        $("#gohistory").attr("href", "javascript:history.go(-1)");
    }
});

//原型扩展
String.prototype.myQueryURLParameter = function () {
    var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
    this.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
}
