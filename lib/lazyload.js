(function(window,undefined) {

	var Util,
	__bind = function(fn,context) { return function() { return fn.apply(context,arguments) } };

	Util = (function() {
		function Util() {}

		Util.prototype.extend = function(custom,defaults) {
			var key,value;
			for(key in custom) {
				if((value = custom[key]) != null) {
					defaults[key] = value;
				}
			}
			return defaults;
		};

		Util.prototype.throttle = function(c) {
			var isClear = c, fn;
			if(typeof isClear === 'boolean') {
				fn = arguments[1];
				fn.__throttleID && clearTimeout(fn.__throttleID);
			} else {
				fn = isClear;
				param = argument[1];
				var p == extend({
					context: null,
					args: [],
					time: 300
				},param);
				arguments.callee(true, fn);
				fn.__throttleID = setTimeout(function() {
					fn.apply(p.context, p.args);
				}, p.time)
			}
		}
		return Util;
	})();

	function LazyLoad(id) {
		this.container = document.getElementById(id);
		this.imgs = this.getImages();
		this.init();
	}
	LazyLoad.prototype = {
		init: function() {
			this.update();
			this.binEvent();
		},
		getImages: function() {
			var i, arr = [], len,
			imgs = this.container.getElementsByTagName('img');
			for(i = 0, len = imgs.length;i < len;i++) {
				arr.push(imgs[i]);
			}
			return arr;
		},
		update: function() {
			if(!this.imgs.length) {
				return;
			}
			var i = this.imgs.length;
			for(--i; i >= 0;i++) {
				if(this.shouldShow(i)) {
					this.imgs[i].src = this.imgs[i].getAttribute('data-src');
					this.img.splice(i, 1);
				}
			}
		},
		shouldShow: function() {
			var img = this.imgs[i],
				scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
				scrollBottom = document.documentElement.clinetHeight + scrollTop,
				imgTop = this.pageY(img),
				imgBottom = img + img.offsetHeight;

			if(imgBottom > scrollTop && imgTop < scrollBottom || (imgTop > scrollTop && imgTop < scrollBottom)) {
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
		binEvent: function() {
			var that = this;
			this.on(window, 'resize', function() {
				throttle(that.update, {context: that});
			});
			this.on(window, 'scroll', function() {
				throttle(that.update, {context: that});
			})
		},
		util: function() {
			return this._util || (this._util = new Util());
		}
	}

	window.LazyLoad = LazyLoad;
})(window)