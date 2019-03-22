~function(win) {

var px = 'px'
var empty = []
var slice = empty.slice

// root dom
var doc = win.document
var body = doc.body
var docElem = doc.documentElement
var $win = $(win)

// global
var popui = $.popui = {}

/*
 * 浏览器判断对象
 * 
 * 示例
 *   $.ie, $.ie6, $.ie7, $.ie8, $.ie9, $.ie10
 *   $.firefox
 *   $.chrome
 *   $.safari
 *   $.opera
 *   $.sogou
 */
var browser = function(ua) {
    var brow = {
        sogou: /se/.test(ua),
        opera: /opera/.test(ua),
        chrome: /chrome/.test(ua),
        firefox: /firefox/.test(ua),
        maxthon: /maxthon/.test(ua),
        tt: /TencentTraveler/.test(ua),
        ie: /msie/.test(ua) && !/opera/.test(ua),
        safari: /webkit/.test(ua) && !/chrome/.test(ua)
    }
    var mark = ''
    for (var i in brow) {
        if (brow[i]) {
            mark = 'safari' == i ? 'version' : i
            break
        }
    }
    var reg = RegExp('(?:' + mark + ')[\\/: ]([\\d.]+)')
    brow.version = mark && reg.test(ua) ? RegExp.$1 : '0'

    var iv = parseInt(brow.version, 10)
    for (var i = 6; i < 11; i++) {
        brow['ie' + i] = iv === i
    }
    return brow
}(navigator.userAgent.toLowerCase())

// exports to $
$.extend($, browser)


function delay(func, wait) {
    var args = slice.call(arguments, 2)
    return setTimeout(function() {
      return func.apply(null, args)
    }, wait)
}

$.dalay = delay

/*
 * 函数节流，控制间隔时间
 */
$.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result
    var later = function() {
        var last = $.now() - timestamp
        if (last < wait && last > 0) {
            timeout = delay(later, wait - last)
        } else {
            timeout = null
            if (!immediate) {
                result = func.apply(context, args)
                context = args = null
            }
        }
    }
    return function() {
        context = this
        args = arguments
        timestamp = $.now()
        var callNow = immediate && !timeout
        if (!timeout) timeout = delay(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

/*
 * 函数节流，控制执行频率
 */
$.throttle = function(func, wait, options) {
    var context, args, result
    var timeout = null
    var previous = 0
    if (!options) options = {}
    var later = function() {
        previous = options.leading === false ? 0 : $.now()
        timeout = null
        result = func.apply(context, args)
        context = args = null
    }
    return function() {
        var now = $.now()
        if (!previous && options.leading === false) {
            previous = now
        }
        var remaining = wait - (now - previous)
        context = this
        args = arguments
        if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout)
            timeout = null
            previous = now
            result = func.apply(context, args)
            context = args = null
        } else if (!timeout && options.trailing !== false) {
            timeout = delay(later, remaining)
        }
        return result
    }
}

/*
 * 获取浏览器窗口的可视尺寸
 */
$.getViewSize = function() { 
    return {
        width: win['innerWidth'] || docElem.clientWidth,
        height: win['innerHeight'] || docElem.clientHeight
    }
}

/*
 * 获取浏览器窗口的实际尺寸，包含滚动条
 */
$.getRealView = function() {
    return {
        width: Math.max(docElem.clientWidth, body.scrollWidth, docElem.scrollWidth),
        height: Math.max(docElem.clientHeight, body.scrollHeight, docElem.scrollHeight)
    }
}

/*
 * 让任意元素水平居中
 */
$.fn.center = function(option, callback) {
    var setting = $.extend({}, option)
    var position = setting.position || 'fixed'

    function fixIE6($el) {
        $el[0].style.position = 'absolute'
        $win.scroll(function() {
            move($el)
        })
    }
    function move($that) {
        var that = $that[0]
        var size = $.getViewSize()
        var x = (size.width)/2 - (that.clientWidth)/2
        var y = (size.height)/2 - (that.clientHeight)/2
        if ($.ie6) {
            var scrollTop = docElem.scrollTop || body.scrollTop
            y += scrollTop
        }
        $that.css({
            top: y + px,
            left: x + px
        })
    }
    function init($that, option) {
        $that.css({
            position: position
        }).show()
        // ie6 don't support position 'fixed'
        if (position === 'fixed' && $.ie6) {
            fixIE6($that)
        }
        move($that)
    }
    return this.each(function() {
        var $that = $(this)
        init($that, option)
        if (callback) callback($that)
    })
}

/*
 * 获取POPUI的组件对象，为一个jq对象
 */
$.fn.getPopUI = function(name) {
    return this.data(name)
}

/*
 * 返回主机名
 */
$.getHost = function() {
    return 'http://' + location.host + '/'
}

/*
 * 将光标焦点置入输入域
 */
$.fn.focusing = function() {
    return this.each(function() {
        var $el = $(this)
        if ($el.is('input')|| $el.is('textarea')) {
            delay(function() {
                $el[0].focus()
            }, 100)
        }
    })
}

/*
 * 解析data-ui的属性值
 */
$.uiParse = function(action) {
    var arr = action.split('|').slice(1)
    var len = arr.length
    var res = [], exs
    var boo = /^(true|false)$/
    for (var i = 0; i < len; i++) {
        var item = arr[i]
        if (item == '&') {
            item = undefined
        } else if (exs = item.match(boo)) {
            item = exs[0] == 'true' ? true : false
        }
        res[i] = item
    }
    return res
}


}(this);