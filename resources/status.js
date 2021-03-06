var _status_catalog = {
        commands: {},
        responses: {},
        functions: {}
    },
    status = {};

function Command() {
}
function Response() {
}

Command.prototype.addToCatalog = function () {
    _status_catalog.commands[this.name] = this;
};

Command.prototype.param = function (parameter) {
    this.params.push(parameter);

    return this;
};

Command.prototype.create = function (com) {
    this.name = com.name;
    this.title = com.title;
    this.description = com.description;
    this.handler = com.handler;
    this["has-handler"] = com.handler != null;
    this["registered-only"] = com.registeredOnly;
    this.validator = com.validator;
    this.color = com.color;
    this.icon = com.icon;
    this.params = com.params || [];
    this.preview = com.preview;
    this["short-preview"] = com.shortPreview;
    this["on-send"] = com.onSend;
    this.fullscreen = com.fullscreen;
    this.request = com.request;
    this["sequential-params"] = com.sequentialParams;
    this.addToCatalog();

    return this;
};


Response.prototype = Object.create(Command.prototype);
Response.prototype.addToCatalog = function () {
    _status_catalog.responses[this.name] = this;
};
Response.prototype.onReceiveResponse = function (handler) {
    this.onReceive = handler;
};

var context = {}

function addContext(ns, key, value) {
    context[ns][key] = value;
}

function call(pathStr, paramsStr) {
    var params = JSON.parse(paramsStr),
        path = JSON.parse(pathStr),
        fn, callResult, message_id;

    if (typeof params.context !== "undefined" &&
        typeof params.context["message-id"] !== "undefined") {
        message_id = params.context["message-id"];
    } else {
        message_id = null;
    }
    context[message_id] = {};
    status.message_id = message_id;

    fn = path.reduce(function (catalog, name) {
            if (catalog && catalog[name]) {
                return catalog[name];
            }
        },
        _status_catalog
    );

    if (!fn) {
        return null;
    }

    context.messages = [];

    callResult = fn(params.parameters, params.context);
    result = {
        returned: callResult,
        context: context[message_id],
        messages: context.messages
    };

    return JSON.stringify(result);
}

function text(options, s) {
    s = Array.isArray(s) ? s : [s];
    return ['text', options].concat(s);
}

function view(options, elements) {
    return ['view', options].concat(elements);
}

function image(options) {
    return ['image', options];
}

function touchable(options, element) {
    return ['touchable', options, element];
}

function scrollView(options, elements) {
    return ['scroll-view', options].concat(elements);
}

function webView(url) {
    return ['web-view', {
        source: {
            uri: url
        },
        javaScriptEnabled: true
    }];
}

function bridgedWebView(url) {
    return ['bridged-web-view', {
        url: url
    }];
}

function validationMessage(titleText, descriptionText) {
    return ['validation-message', {
        title: titleText,
        description: descriptionText
    }];
}

var status = {
    command: function (h) {
        var command = new Command();
        return command.create(h);
    },
    response: function (h) {
        var response = new Response();
        return response.create(h);
    },
    registerFunction: function (name, fn){
        _status_catalog.functions[name] = fn;
    },
    autorun: function (commandName) {
        _status_catalog.autorun = commandName;
    },
    localizeNumber: function (num, del, sep) {
        return I18n.toNumber(
            num.replace(",", "."),
            {precision: 10, strip_insignificant_zeros: true, delimiter: del, separator: sep});
    },
    types: {
        TEXT: 'text',
        NUMBER: 'number',
        PHONE: 'phone',
        PASSWORD: 'password'
    },
    events: {
        SET_VALUE: 'set-value',
        SET_COMMAND_ARGUMENT: 'set-command-argument'
    },
    components: {
        view: view,
        text: text,
        image: image,
        touchable: touchable,
        scrollView: scrollView,
        webView: webView,
        validationMessage: validationMessage,
        bridgedWebView: bridgedWebView
    }
};

// i18n.js 3.0.0.rc14
!function(a){if("undefined"!=typeof module&&module.exports)module.exports=a(this);else if("function"==typeof define&&define.amd){var b=this;define("i18n",function(){return a(b)})}else this.I18n=a(this)}(function(a){"use strict";var b=a&&a.I18n||{},c=Array.prototype.slice,d=function(a){return("0"+a.toString()).substr(-2)},e=function(a,b){return h("round",a,-b).toFixed(b)},f=function(a){var b=typeof a;return"function"===b||"object"===b&&!!a},g=function(a){return Array.isArray?Array.isArray(a):"[object Array]"===Object.prototype.toString.call(a)},h=function(a,b,c){return"undefined"==typeof c||0===+c?Math[a](b):(b=+b,c=+c,isNaN(b)||"number"!=typeof c||c%1!==0?NaN:(b=b.toString().split("e"),b=Math[a](+(b[0]+"e"+(b[1]?+b[1]-c:-c))),b=b.toString().split("e"),+(b[0]+"e"+(b[1]?+b[1]+c:c))))},i=function(a,b){var c,d;for(c in b)b.hasOwnProperty(c)&&(d=b[c],"[object String]"===Object.prototype.toString.call(d)?a[c]=d:(null==a[c]&&(a[c]={}),i(a[c],d)));return a},j={day_names:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbr_day_names:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],month_names:[null,"January","February","March","April","May","June","July","August","September","October","November","December"],abbr_month_names:[null,"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],meridian:["AM","PM"]},k={precision:3,separator:".",delimiter:",",strip_insignificant_zeros:!1},l={unit:"$",precision:2,format:"%u%n",sign_first:!0,delimiter:",",separator:"."},m={unit:"%",precision:3,format:"%n%u",separator:".",delimiter:""},n=[null,"kb","mb","gb","tb"],o={defaultLocale:"en",locale:"en",defaultSeparator:".",placeholder:/(?:\{\{|%\{)(.*?)(?:\}\}?)/gm,fallbacks:!1,translations:{},missingBehaviour:"message",missingTranslationPrefix:""};return b.reset=function(){this.defaultLocale=o.defaultLocale,this.locale=o.locale,this.defaultSeparator=o.defaultSeparator,this.placeholder=o.placeholder,this.fallbacks=o.fallbacks,this.translations=o.translations,this.missingBehaviour=o.missingBehaviour,this.missingTranslationPrefix=o.missingTranslationPrefix},b.initializeOptions=function(){"undefined"==typeof this.defaultLocale&&null!==this.defaultLocale&&(this.defaultLocale=o.defaultLocale),"undefined"==typeof this.locale&&null!==this.locale&&(this.locale=o.locale),"undefined"==typeof this.defaultSeparator&&null!==this.defaultSeparator&&(this.defaultSeparator=o.defaultSeparator),"undefined"==typeof this.placeholder&&null!==this.placeholder&&(this.placeholder=o.placeholder),"undefined"==typeof this.fallbacks&&null!==this.fallbacks&&(this.fallbacks=o.fallbacks),"undefined"==typeof this.translations&&null!==this.translations&&(this.translations=o.translations),"undefined"==typeof this.missingBehaviour&&null!==this.missingBehaviour&&(this.missingBehaviour=o.missingBehaviour),"undefined"==typeof this.missingTranslationPrefix&&null!==this.missingTranslationPrefix&&(this.missingTranslationPrefix=o.missingTranslationPrefix)},b.initializeOptions(),b.locales={},b.locales.get=function(a){var c=this[a]||this[b.locale]||this.default;return"function"==typeof c&&(c=c(a)),g(c)===!1&&(c=[c]),c},b.locales.default=function(a){var e,c=[],d=[];return a&&c.push(a),!a&&b.locale&&c.push(b.locale),b.fallbacks&&b.defaultLocale&&c.push(b.defaultLocale),c.forEach(function(a){e=a.split("-")[0],~d.indexOf(a)||d.push(a),b.fallbacks&&e&&e!==a&&!~d.indexOf(e)&&d.push(e)}),c.length||c.push("en"),d},b.pluralization={},b.pluralization.get=function(a){return this[a]||this[b.locale]||this.default},b.pluralization.default=function(a){switch(a){case 0:return["zero","other"];case 1:return["one"];default:return["other"]}},b.currentLocale=function(){return this.locale||this.defaultLocale},b.isSet=function(a){return void 0!==a&&null!==a},b.lookup=function(a,b){b=this.prepareOptions(b);var e,f,g,c=this.locales.get(b.locale).slice();c[0];for(a=this.getFullScope(a,b);c.length;)if(e=c.shift(),f=a.split(this.defaultSeparator),g=this.translations[e]){for(;f.length&&(g=g[f.shift()],void 0!==g&&null!==g););if(void 0!==g&&null!==g)return g}if(this.isSet(b.defaultValue))return b.defaultValue},b.meridian=function(){var a=this.lookup("time"),b=this.lookup("date");return a&&a.am&&a.pm?[a.am,a.pm]:b&&b.meridian?b.meridian:j.meridian},b.prepareOptions=function(){for(var d,a=c.call(arguments),b={};a.length;)if(d=a.shift(),"object"==typeof d)for(var e in d)d.hasOwnProperty(e)&&(this.isSet(b[e])||(b[e]=d[e]));return b},b.createTranslationOptions=function(a,b){var c=[{scope:a}];return this.isSet(b.defaults)&&(c=c.concat(b.defaults)),this.isSet(b.defaultValue)&&(c.push({message:b.defaultValue}),delete b.defaultValue),c},b.translate=function(a,b){b=this.prepareOptions(b);var d,c=this.createTranslationOptions(a,b),e=c.some(function(a){if(this.isSet(a.scope)?d=this.lookup(a.scope,b):this.isSet(a.message)&&(d=a.message),void 0!==d&&null!==d)return!0},this);return e?("string"==typeof d?d=this.interpolate(d,b):f(d)&&this.isSet(b.count)&&(d=this.pluralize(b.count,d,b)),d):this.missingTranslation(a,b)},b.interpolate=function(a,b){b=this.prepareOptions(b);var d,e,f,g,c=a.match(this.placeholder);if(!c)return a;for(var e;c.length;)d=c.shift(),f=d.replace(this.placeholder,"$1"),e=this.isSet(b[f])?b[f].toString().replace(/\$/gm,"_#$#_"):f in b?this.nullPlaceholder(d,a,b):this.missingPlaceholder(d,a,b),g=new RegExp(d.replace(/\{/gm,"\\{").replace(/\}/gm,"\\}")),a=a.replace(g,e);return a.replace(/_#\$#_/g,"$")},b.pluralize=function(a,b,c){c=this.prepareOptions(c);var d,e,g,h,i;if(d=f(b)?b:this.lookup(b,c),!d)return this.missingTranslation(b,c);for(e=this.pluralization.get(c.locale),g=e(a);g.length;)if(h=g.shift(),this.isSet(d[h])){i=d[h];break}return c.count=String(a),this.interpolate(i,c)},b.missingTranslation=function(a,b){if("guess"==this.missingBehaviour){var c=a.split(".").slice(-1)[0];return(this.missingTranslationPrefix.length>0?this.missingTranslationPrefix:"")+c.replace("_"," ").replace(/([a-z])([A-Z])/g,function(a,b,c){return b+" "+c.toLowerCase()})}var d=null!=b&&null!=b.locale?b.locale:this.currentLocale(),e=this.getFullScope(a,b),f=[d,e].join(this.defaultSeparator);return'[missing "'+f+'" translation]'},b.missingPlaceholder=function(a,b,c){return"[missing "+a+" value]"},b.nullPlaceholder=function(){return b.missingPlaceholder.apply(b,arguments)},b.toNumber=function(a,b){b=this.prepareOptions(b,this.lookup("number.format"),k);var g,i,c=a<0,d=e(Math.abs(a),b.precision).toString(),f=d.split("."),h=[],j=b.format||"%n",l=c?"-":"";for(a=f[0],g=f[1];a.length>0;)h.unshift(a.substr(Math.max(0,a.length-3),3)),a=a.substr(0,a.length-3);return i=h.join(b.delimiter),b.strip_insignificant_zeros&&g&&(g=g.replace(/0+$/,"")),b.precision>0&&g&&(i+=b.separator+g),j=b.sign_first?"%s"+j:j.replace("%n","%s%n"),i=j.replace("%u",b.unit).replace("%n",i).replace("%s",l)},b.toCurrency=function(a,b){return b=this.prepareOptions(b,this.lookup("number.currency.format"),this.lookup("number.format"),l),this.toNumber(a,b)},b.localize=function(a,b,c){switch(c||(c={}),a){case"currency":return this.toCurrency(b);case"number":return a=this.lookup("number.format"),this.toNumber(b,a);case"percentage":return this.toPercentage(b);default:var d;return d=a.match(/^(date|time)/)?this.toTime(a,b):b.toString(),this.interpolate(d,c)}},b.parseDate=function(a){var b,c,d;if("object"==typeof a)return a;if(b=a.toString().match(/(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2})([\.,]\d{1,3})?)?(Z|\+00:?00)?/)){for(var e=1;e<=6;e++)b[e]=parseInt(b[e],10)||0;b[2]-=1,d=b[7]?1e3*("0"+b[7]):null,c=b[8]?new Date(Date.UTC(b[1],b[2],b[3],b[4],b[5],b[6],d)):new Date(b[1],b[2],b[3],b[4],b[5],b[6],d)}else"number"==typeof a?(c=new Date,c.setTime(a)):a.match(/([A-Z][a-z]{2}) ([A-Z][a-z]{2}) (\d+) (\d+:\d+:\d+) ([+-]\d+) (\d+)/)?(c=new Date,c.setTime(Date.parse([RegExp.$1,RegExp.$2,RegExp.$3,RegExp.$6,RegExp.$4,RegExp.$5].join(" ")))):a.match(/\d+ \d+:\d+:\d+ [+-]\d+ \d+/)?(c=new Date,c.setTime(Date.parse(a))):(c=new Date,c.setTime(Date.parse(a)));return c},b.strftime=function(a,c){var e=this.lookup("date"),f=b.meridian();if(e||(e={}),e=this.prepareOptions(e,j),isNaN(a.getTime()))throw new Error("I18n.strftime() requires a valid date object, but received an invalid date.");var g=a.getDay(),h=a.getDate(),i=a.getFullYear(),k=a.getMonth()+1,l=a.getHours(),m=l,n=l>11?1:0,o=a.getSeconds(),p=a.getMinutes(),q=a.getTimezoneOffset(),r=Math.floor(Math.abs(q/60)),s=Math.abs(q)-60*r,t=(q>0?"-":"+")+(r.toString().length<2?"0"+r:r)+(s.toString().length<2?"0"+s:s);return m>12?m-=12:0===m&&(m=12),c=c.replace("%a",e.abbr_day_names[g]),c=c.replace("%A",e.day_names[g]),c=c.replace("%b",e.abbr_month_names[k]),c=c.replace("%B",e.month_names[k]),c=c.replace("%d",d(h)),c=c.replace("%e",h),c=c.replace("%-d",h),c=c.replace("%H",d(l)),c=c.replace("%-H",l),c=c.replace("%I",d(m)),c=c.replace("%-I",m),c=c.replace("%m",d(k)),c=c.replace("%-m",k),c=c.replace("%M",d(p)),c=c.replace("%-M",p),c=c.replace("%p",f[n]),c=c.replace("%S",d(o)),c=c.replace("%-S",o),c=c.replace("%w",g),c=c.replace("%y",d(i)),c=c.replace("%-y",d(i).replace(/^0+/,"")),c=c.replace("%Y",i),c=c.replace("%z",t)},b.toTime=function(a,b){var c=this.parseDate(b),d=this.lookup(a);return c.toString().match(/invalid/i)?c.toString():d?this.strftime(c,d):c.toString()},b.toPercentage=function(a,b){return b=this.prepareOptions(b,this.lookup("number.percentage.format"),this.lookup("number.format"),m),this.toNumber(a,b)},b.toHumanSize=function(a,b){for(var f,g,c=1024,d=a,e=0;d>=c&&e<4;)d/=c,e+=1;return 0===e?(f=this.t("number.human.storage_units.units.byte",{count:d}),g=0):(f=this.t("number.human.storage_units.units."+n[e]),g=d-Math.floor(d)===0?0:1),b=this.prepareOptions(b,{unit:f,precision:g,format:"%n%u",delimiter:""}),this.toNumber(d,b)},b.getFullScope=function(a,b){return b=this.prepareOptions(b),a.constructor===Array&&(a=a.join(this.defaultSeparator)),b.scope&&(a=[b.scope,a].join(this.defaultSeparator)),a},b.extend=function(a,b){return"undefined"==typeof a&&"undefined"==typeof b?{}:i(a,b)},b.t=b.translate,b.l=b.localize,b.p=b.pluralize,b});
I18n.defaultLocale = "en";
I18n.fallbacks = true;
