(function(window, undefined) {

	// 工具类
	var Util = (function() {

		function Util() {}

		Util.prototype = {
			// 函数绑定
			bind: function(fn, me) {
				return function() { 
					return fn.apply(me, arguments); 
				}
			},
			// 对象扩展
			extend: function(custom, defaults) {
				var key,value;
				for(key in custom) {
					if((value = custom[key]) != null) {
						defaults[key] = value;
					}
				}
				return defaults;
			},
			// 节流器
			throttle: function(c) {
				var isClear = c, fn;
				if(typeof isClear === 'boolean') {
					fn = arguments[1];
					fn.__throttleID && clearTimeout(fn.__throttleID);
				} else {
					fn = isClear;
					param = arguments[1];
					var p = this.extend({
						context: null,
						args: [],
						time: 100
					},param);
					arguments.callee(true, fn);
					fn.__throttleID = setTimeout(function() {
						fn.apply(p.context, p.args);
					}, p.time)
				}
			},
			// 事件添加
			addEvent: function(ele, type, handle) {
			    if(ele.addEventListener) {
			        this.addEvent = function(ele, type, handle){
			            ele.addEventListener(type, handle, false);
			        }
			    }
			    else if(ele.attachEvent) {
			        this.addEvent = function(ele, type, handle){
			            el.attachEvent("on"+type, handle);
			        }
			    }
			    else {
			        this.addEvent = function(ele, type, handle){
			            ele["on" + type] = handle;
			        }
			    }
			    this.addEvent(ele,type,handle);
			},
			// 支持不兼容getElementsByClassName的浏览器
			getEleByClass: function(className, node, tag) {
				if ( node == null ) {
				    node = document;
				}
				if ( tag == null ) {
					tag = '*';
				}
				var i, j, classElements = new Array(),
					pattern = new RegExp("(^|\\s)"+className+"(\\s|$)"), 
					els = node.getElementsByTagName(tag),
					elsLen = els.length;
				for (i = 0, j = 0; i < elsLen; i++) {
			        if ( pattern.test(els[i].className) ) {
		                classElements[j++] = els[i];
			        }
				}
				return classElements;
			}
		}

		return Util;
	})();

	/**
	 * 图片懒加载工具
	 * @param {Object}   options 配置项
	 * @param {Function} fn      图片加载出错处理函数
	 */
	function LazyLoad(options, fn) {
		var config;

		if(options == null) {
			options = {};
		}
		else if(Object.prototype.toString.call(options) === "[object Function]") {
			fn = options;
			options = {};
		}

		config = this.config = this.util().extend(options,this.defaults);
		this.container = document.getElementById(config.container);
		this.errFn = fn;
		this.init();
	}

	LazyLoad.prototype = {
		defaults: {
			container: "lazyload",
			srcAttr: "data-src",
			eleClass: ""
		},
		init: function() {
			this.imgs = this.getImages();

			if(this.errFn) {
				var i, len, imgs,
				util = this.util(),
				imgs = this.imgs,
				errFn = this.errFn;
				for(i = 0, len= imgs.length;i < len;i++) {
					util.addEvent(imgs[i], 'error', util.bind(errFn, imgs[i]));
				}
			}
			this.update();
			this.bindEvent();
		},
		getImages: function() {
			var i, arr = [], len,
				container = this.container,
				eleClass = this.config.eleClass.trim(),
				imgs = eleClass ? 
					container.getElementsByClassName ? 
					container.getElementsByClassName(eleClass) : 
					this.util().getEleByClass(eleClass, container) :
					container.getElementsByTagName('img');

			for(i = 0, len = imgs.length;i < len;i++) {
				arr.push(imgs[i]);
			}

			return arr;
		},
		update: function() {
			if(!this.imgs.length) {
				return;
			}
			var i = this.imgs.length,
				imgs = this.imgs,
				config = this.config.srcAttr;

			for(--i; i >= 0;i--) {
				if(this.shouldShow(i)) {
					imgs[i].src = imgs[i].getAttribute(config);
					imgs.splice(i, 1);
				}
			}
		},
		shouldShow: function(i) {
			var img = this.imgs[i],
				scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
				scrollBottom = document.documentElement.clientHeight + scrollTop,
				imgTop = this.pageY(img),
				imgBottom = imgTop + img.offsetHeight;

			if(imgBottom > scrollTop && imgBottom < scrollBottom || 
				(imgTop > scrollTop && imgTop < scrollBottom)) {
				return true;
			}

			return false;
		},
		pageY: function(ele) {
			if(ele.offsetParent) {
				return ele.offsetTop + this.pageY(ele.offsetParent);
			} else {
				return ele.offsetTop;
			}
		},
		on: function(ele, type, fn) {
			if(ele.addEventListener) {
				addEventListener(type, fn, false);
			} else {
				ele.attachEvent('on' + type, fn, false);
			}
		},
		bindEvent: function() {
			var that = this, 
				util = this.util();
			util.addEvent(window, 'resize', function() {
				util.throttle(that.update, {context: that});
			});
			util.addEvent(window, 'scroll', function() {
				util.throttle(that.update, {context: that});
			})
		},
		util: function() {
			return this._util || (this._util = new Util());
		}
	}

	window.LazyLoad = LazyLoad;
})(window)