# lazyload
####LazyLoad allows you to defer image loading until the user scrolls down to each image..


	/**
	 * 图片懒加载工具
	 * @param {Object}   options 配置项(可选)
	 * @param {Function} fn      图片加载出错处理函数(可选)
	 */
	var lazyload = new LazyLoad({
		  container: "lazyload",
		  srcAttr: "data-src",
		  eleClass: ""
	},function() {});
