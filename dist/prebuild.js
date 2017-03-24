module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_exports__, __vue_options__
	var __vue_styles__ = {}

	/* styles */
	__webpack_require__(1)

	/* script */
	__vue_exports__ = __webpack_require__(6)

	/* template */
	var __vue_template__ = __webpack_require__(44)
	__vue_options__ = __vue_exports__ = __vue_exports__ || {}
	if (
	  typeof __vue_exports__.default === "object" ||
	  typeof __vue_exports__.default === "function"
	) {
	__vue_options__ = __vue_exports__ = __vue_exports__.default
	}
	if (typeof __vue_options__ === "function") {
	  __vue_options__ = __vue_options__.options
	}

	__vue_options__.render = __vue_template__.render
	__vue_options__.staticRenderFns = __vue_template__.staticRenderFns

	module.exports = __vue_exports__


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-2f73843f!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-timepicker.vue", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-rewriter.js?id=data-v-2f73843f!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./vue-timepicker.vue");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	exports.i(__webpack_require__(4), "");

	// module
	exports.push([module.id, "\n", ""]);

	// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".time-picker {\n  display: inline-block;\n  position: relative;\n  font-size: 1em;\n  width: 10em;\n  font-family: sans-serif;\n  vertical-align: middle;\n}\n\n.time-picker * {\n  box-sizing: border-box;\n}\n\n.time-picker input.display-time {\n  border: 1px solid #d2d2d2;\n  width: 10em;\n  height: 2.2em;\n  padding: 0.3em 0.5em;\n  font-size: 1em;\n}\n\n.time-picker .clear-btn {\n  position: absolute;\n  display: flex;\n  flex-flow: column nowrap;\n  justify-content: center;\n  align-items: center;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  margin-top: -0.15em;\n  z-index: 3;\n  font-size: 1.1em;\n  line-height: 1em;\n  vertical-align: middle;\n  width: 1.3em;\n  color: #d2d2d2;\n  background: rgba(255,255,255,0);\n  text-align: center;\n  font-style: normal;\n\n  -webkit-transition: color .2s;\n  transition: color .2s;\n}\n\n.time-picker .clear-btn:hover {\n  color: #797979;\n  cursor: pointer;\n}\n\n.time-picker .time-picker-overlay {\n  z-index: 2;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n\n.time-picker .dropdown {\n  position: absolute;\n  z-index: 5;\n  top: calc(2.2em + 2px);\n  left: 0;\n  background: #fff;\n  box-shadow: 0 1px 6px rgba(0,0,0,0.15);\n  width: 10em;\n  height: 10em;\n  font-weight: normal;\n}\n\n.time-picker .dropdown .select-list {\n  width: 10em;\n  height: 10em;\n  overflow: hidden;\n  display: flex;\n  flex-flow: row nowrap;\n  align-items: stretch;\n  justify-content: space-between;\n}\n\n.time-picker .dropdown ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n\n  flex: 1;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.time-picker .dropdown ul.minutes,\n.time-picker .dropdown ul.seconds,\n.time-picker .dropdown ul.apms{\n  border-left: 1px solid #fff;\n}\n\n.time-picker .dropdown ul li {\n  text-align: center;\n  padding: 0.3em 0;\n  color: #161616;\n}\n\n.time-picker .dropdown ul li:not(.hint):hover {\n  background: rgba(0,0,0,.08);\n  color: #161616;\n  cursor: pointer;\n}\n\n.time-picker .dropdown ul li.active,\n.time-picker .dropdown ul li.active:hover {\n  background: #41B883;\n  color: #fff;\n}\n\n.time-picker .dropdown .hint {\n  color: #a5a5a5;\n  cursor: default;\n  font-size: 0.8em;\n}\n", ""]);

	// exports


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if (media) {
			styleElement.setAttribute("media", media);
		}

		if (sourceMap) {
			// https://developer.chrome.com/devtools/docs/javascript-debugging
			// this makes source maps inside style tags work properly in Chrome
			css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */';
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(7);

	var _keys2 = _interopRequireDefault(_keys);

	var _stringify = __webpack_require__(42);

	var _stringify2 = _interopRequireDefault(_stringify);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var CONFIG = {
	  HOUR_TOKENS: ['HH', 'H', 'hh', 'h', 'kk', 'k'],
	  MINUTE_TOKENS: ['mm', 'm'],
	  SECOND_TOKENS: ['ss', 's'],
	  APM_TOKENS: ['A', 'a']
	};

	exports.default = {
	  name: 'VueTimepicker',

	  props: {
	    value: { type: Object },
	    hideClearButton: { type: Boolean },
	    format: { type: String },
	    minuteInterval: { type: Number },
	    secondInterval: { type: Number },
	    id: { type: String }
	  },

	  data: function data() {
	    return {
	      hours: [],
	      minutes: [],
	      seconds: [],
	      apms: [],
	      showDropdown: false,
	      muteWatch: false,
	      hourType: 'HH',
	      minuteType: 'mm',
	      secondType: '',
	      apmType: '',
	      hour: '',
	      minute: '',
	      second: '',
	      apm: '',
	      fullValues: undefined
	    };
	  },


	  computed: {
	    displayTime: function displayTime() {
	      var formatString = String(this.format || 'HH:mm');
	      if (this.hour) {
	        formatString = formatString.replace(new RegExp(this.hourType, 'g'), this.hour);
	      }
	      if (this.minute) {
	        formatString = formatString.replace(new RegExp(this.minuteType, 'g'), this.minute);
	      }
	      if (this.second && this.secondType) {
	        formatString = formatString.replace(new RegExp(this.secondType, 'g'), this.second);
	      }
	      if (this.apm && this.apmType) {
	        formatString = formatString.replace(new RegExp(this.apmType, 'g'), this.apm);
	      }
	      return formatString;
	    },
	    showClearBtn: function showClearBtn() {
	      if (this.hour && this.hour !== '' || this.minute && this.minute !== '') {
	        return true;
	      }
	      return false;
	    }
	  },

	  watch: {
	    'format': 'renderFormat',
	    minuteInterval: function minuteInterval(newInteval) {
	      this.renderList('minute', newInteval);
	    },
	    secondInterval: function secondInterval(newInteval) {
	      this.renderList('second', newInteval);
	    },

	    'value': 'readValues',
	    'displayTime': 'fillValues'
	  },

	  methods: {
	    formatValue: function formatValue(type, i) {
	      switch (type) {
	        case 'H':
	        case 'm':
	        case 's':
	          return String(i);
	        case 'HH':
	        case 'mm':
	        case 'ss':
	          return i < 10 ? '0' + i : String(i);
	        case 'h':
	        case 'k':
	          return String(i + 1);
	        case 'hh':
	        case 'kk':
	          return i + 1 < 10 ? '0' + (i + 1) : String(i + 1);
	        default:
	          return '';
	      }
	    },
	    checkAcceptingType: function checkAcceptingType(validValues, formatString, fallbackValue) {
	      if (!validValues || !formatString || !formatString.length) {
	        return '';
	      }
	      for (var i = 0; i < validValues.length; i++) {
	        if (formatString.indexOf(validValues[i]) > -1) {
	          return validValues[i];
	        }
	      }
	      return fallbackValue || '';
	    },
	    renderFormat: function renderFormat(newFormat) {
	      newFormat = newFormat || this.format;
	      if (!newFormat || !newFormat.length) {
	        newFormat = 'HH:mm';
	      }

	      this.hourType = this.checkAcceptingType(CONFIG.HOUR_TOKENS, newFormat, 'HH');
	      this.minuteType = this.checkAcceptingType(CONFIG.MINUTE_TOKENS, newFormat, 'mm');
	      this.secondType = this.checkAcceptingType(CONFIG.SECOND_TOKENS, newFormat);
	      this.apmType = this.checkAcceptingType(CONFIG.APM_TOKENS, newFormat);

	      this.renderHoursList();
	      this.renderList('minute');

	      if (this.secondType) {
	        this.renderList('second');
	      }

	      if (this.apmType) {
	        this.renderApmList();
	      }

	      var self = this;
	      this.$nextTick(function () {
	        self.readValues();
	      });
	    },
	    renderHoursList: function renderHoursList() {
	      var hoursCount = this.hourType === 'h' || this.hourType === 'hh' ? 12 : 24;
	      this.hours = [];
	      for (var i = 0; i < hoursCount; i++) {
	        this.hours.push(this.formatValue(this.hourType, i));
	      }
	    },
	    renderList: function renderList(listType, interval) {
	      if (listType === 'second') {
	        interval = interval || this.secondInterval;
	      } else if (listType === 'minute') {
	        interval = interval || this.minuteInterval;
	      } else {
	        return;
	      }

	      if (interval === 0) {
	        interval = 60;
	      } else if (interval > 60) {
	        window.console.warn('`' + listType + '-interval` should be less than 60. Current value is', interval);
	        interval = 1;
	      } else if (interval < 1) {
	        window.console.warn('`' + listType + '-interval` should be NO less than 1. Current value is', interval);
	        interval = 1;
	      } else if (!interval) {
	        interval = 1;
	      }

	      if (listType === 'minute') {
	        this.minutes = [];
	      } else {
	        this.seconds = [];
	      }

	      for (var i = 0; i < 60; i += interval) {
	        if (listType === 'minute') {
	          this.minutes.push(this.formatValue(this.minuteType, i));
	        } else {
	          this.seconds.push(this.formatValue(this.secondType, i));
	        }
	      }
	    },
	    renderApmList: function renderApmList() {
	      this.apms = [];
	      if (!this.apmType) {
	        return;
	      }
	      this.apms = this.apmType === 'A' ? ['AM', 'PM'] : ['am', 'pm'];
	    },
	    readValues: function readValues() {
	      if (!this.value || this.muteWatch) {
	        return;
	      }

	      var timeValue = JSON.parse((0, _stringify2.default)(this.value || {}));

	      var values = (0, _keys2.default)(timeValue);
	      if (values.length === 0) {
	        return;
	      }

	      if (values.indexOf(this.hourType) > -1) {
	        this.hour = timeValue[this.hourType];
	      }

	      if (values.indexOf(this.minuteType) > -1) {
	        this.minute = timeValue[this.minuteType];
	      }

	      if (values.indexOf(this.secondType) > -1) {
	        this.second = timeValue[this.secondType];
	      } else {
	        this.second = 0;
	      }

	      if (values.indexOf(this.apmType) > -1) {
	        this.apm = timeValue[this.apmType];
	      }

	      this.fillValues();
	    },
	    fillValues: function fillValues() {
	      var fullValues = {};

	      var baseHour = this.hour;
	      var baseHourType = this.hourType;

	      var hourValue = baseHour || baseHour === 0 ? Number(baseHour) : '';
	      var baseOnTwelveHours = this.isTwelveHours(baseHourType);
	      var apmValue = baseOnTwelveHours && this.apm ? String(this.apm).toLowerCase() : false;

	      CONFIG.HOUR_TOKENS.forEach(function (token) {
	        if (token === baseHourType) {
	          fullValues[token] = baseHour;
	          return;
	        }

	        var value = void 0;
	        var apm = void 0;
	        switch (token) {
	          case 'H':
	          case 'HH':
	            if (!String(hourValue).length) {
	              fullValues[token] = '';
	              return;
	            } else if (baseOnTwelveHours) {
	              if (apmValue === 'pm') {
	                value = hourValue < 12 ? hourValue + 12 : hourValue;
	              } else {
	                value = hourValue % 12;
	              }
	            } else {
	              value = hourValue % 24;
	            }
	            fullValues[token] = token === 'HH' && value < 10 ? '0' + value : String(value);
	            break;
	          case 'k':
	          case 'kk':
	            if (!String(hourValue).length) {
	              fullValues[token] = '';
	              return;
	            } else if (baseOnTwelveHours) {
	              if (apmValue === 'pm') {
	                value = hourValue < 12 ? hourValue + 12 : hourValue;
	              } else {
	                value = hourValue === 12 ? 24 : hourValue;
	              }
	            } else {
	              value = hourValue === 0 ? 24 : hourValue;
	            }
	            fullValues[token] = token === 'kk' && value < 10 ? '0' + value : String(value);
	            break;
	          case 'h':
	          case 'hh':
	            if (apmValue) {
	              value = hourValue;
	              apm = apmValue || 'am';
	            } else {
	              if (!String(hourValue).length) {
	                fullValues[token] = '';
	                fullValues.a = '';
	                fullValues.A = '';
	                return;
	              } else if (hourValue > 11) {
	                apm = 'pm';
	                value = hourValue === 12 ? 12 : hourValue % 12;
	              } else {
	                if (baseOnTwelveHours) {
	                  apm = '';
	                } else {
	                  apm = 'am';
	                }
	                value = hourValue % 12 === 0 ? 12 : hourValue;
	              }
	            }
	            fullValues[token] = token === 'hh' && value < 10 ? '0' + value : String(value);
	            fullValues.a = apm;
	            fullValues.A = apm.toUpperCase();
	            break;
	        }
	      });

	      if (this.minute || this.minute === 0) {
	        var minuteValue = Number(this.minute);
	        fullValues.m = String(minuteValue);
	        fullValues.mm = minuteValue < 10 ? '0' + minuteValue : String(minuteValue);
	      } else {
	        fullValues.m = '';
	        fullValues.mm = '';
	      }

	      if (this.second || this.second === 0) {
	        var secondValue = Number(this.second);
	        fullValues.s = String(secondValue);
	        fullValues.ss = secondValue < 10 ? '0' + secondValue : String(secondValue);
	      } else {
	        fullValues.s = '';
	        fullValues.ss = '';
	      }

	      this.fullValues = fullValues;
	      this.updateTimeValue(fullValues);
	      this.$emit('change', { data: fullValues });
	    },
	    updateTimeValue: function updateTimeValue(fullValues) {
	      this.muteWatch = true;

	      var self = this;

	      var baseTimeValue = JSON.parse((0, _stringify2.default)(this.value || {}));
	      var timeValue = {};

	      (0, _keys2.default)(baseTimeValue).forEach(function (key) {
	        timeValue[key] = fullValues[key];
	      });

	      this.$emit('input', timeValue);

	      this.$nextTick(function () {
	        self.muteWatch = false;
	      });
	    },
	    isTwelveHours: function isTwelveHours(token) {
	      return token === 'h' || token === 'hh';
	    },
	    toggleDropdown: function toggleDropdown() {
	      this.showDropdown = !this.showDropdown;
	    },
	    select: function select(type, value) {
	      if (type === 'hour') {
	        this.hour = value;
	      } else if (type === 'minute') {
	        this.minute = value;
	      } else if (type === 'second') {
	        this.second = value;
	      } else if (type === 'apm') {
	        this.apm = value;
	      }
	    },
	    clearTime: function clearTime() {
	      this.hour = '';
	      this.minute = '';
	      this.second = '';
	      this.apm = '';
	    }
	  },

	  mounted: function mounted() {
	    this.renderFormat();
	  }
	};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(8), __esModule: true };

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(9);
	module.exports = __webpack_require__(29).Object.keys;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(10)
	  , $keys    = __webpack_require__(12);

	__webpack_require__(27)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(11);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(13)
	  , enumBugKeys = __webpack_require__(26);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(14)
	  , toIObject    = __webpack_require__(15)
	  , arrayIndexOf = __webpack_require__(18)(false)
	  , IE_PROTO     = __webpack_require__(22)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(16)
	  , defined = __webpack_require__(11);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(17);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(15)
	  , toLength  = __webpack_require__(19)
	  , toIndex   = __webpack_require__(21);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(20)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(20)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(23)('keys')
	  , uid    = __webpack_require__(25);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(24)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(28)
	  , core    = __webpack_require__(29)
	  , fails   = __webpack_require__(38);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(24)
	  , core      = __webpack_require__(29)
	  , ctx       = __webpack_require__(30)
	  , hide      = __webpack_require__(32)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(31);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(33)
	  , createDesc = __webpack_require__(41);
	module.exports = __webpack_require__(37) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(34)
	  , IE8_DOM_DEFINE = __webpack_require__(36)
	  , toPrimitive    = __webpack_require__(40)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(37) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(35);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(37) && !__webpack_require__(38)(function(){
	  return Object.defineProperty(__webpack_require__(39)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(38)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 38 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(35)
	  , document = __webpack_require__(24).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(35);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ }),
/* 41 */
/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(43), __esModule: true };

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(29)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ }),
/* 44 */
/***/ (function(module, exports) {

	module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
	  return _c('span', {
	    staticClass: "time-picker"
	  }, [_c('input', {
	    directives: [{
	      name: "model",
	      rawName: "v-model",
	      value: (_vm.displayTime),
	      expression: "displayTime"
	    }],
	    staticClass: "display-time",
	    attrs: {
	      "id": _vm.id,
	      "type": "text",
	      "readonly": ""
	    },
	    domProps: {
	      "value": (_vm.displayTime)
	    },
	    on: {
	      "click": function($event) {
	        $event.stopPropagation();
	        _vm.toggleDropdown($event)
	      },
	      "input": function($event) {
	        if ($event.target.composing) { return; }
	        _vm.displayTime = $event.target.value
	      }
	    }
	  }), _vm._v(" "), (!_vm.hideClearButton) ? _c('span', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (!_vm.showDropdown && _vm.showClearBtn),
	      expression: "!showDropdown && showClearBtn"
	    }],
	    staticClass: "clear-btn",
	    on: {
	      "click": function($event) {
	        $event.stopPropagation();
	        _vm.clearTime($event)
	      }
	    }
	  }, [_vm._v("×")]) : _vm._e(), _vm._v(" "), (_vm.showDropdown) ? _c('div', {
	    staticClass: "time-picker-overlay",
	    on: {
	      "click": function($event) {
	        $event.stopPropagation();
	        _vm.toggleDropdown($event)
	      }
	    }
	  }) : _vm._e(), _vm._v(" "), _c('div', {
	    directives: [{
	      name: "show",
	      rawName: "v-show",
	      value: (_vm.showDropdown),
	      expression: "showDropdown"
	    }],
	    staticClass: "dropdown"
	  }, [_c('div', {
	    staticClass: "select-list"
	  }, [_c('ul', {
	    staticClass: "hours"
	  }, [_c('li', {
	    staticClass: "hint",
	    domProps: {
	      "textContent": _vm._s(_vm.hourType)
	    }
	  }), _vm._v(" "), _vm._l((_vm.hours), function(hr) {
	    return _c('li', {
	      class: {
	        active: _vm.hour === hr
	      },
	      domProps: {
	        "textContent": _vm._s(hr)
	      },
	      on: {
	        "click": function($event) {
	          $event.stopPropagation();
	          _vm.select('hour', hr)
	        }
	      }
	    })
	  })], 2), _vm._v(" "), _c('ul', {
	    staticClass: "minutes"
	  }, [_c('li', {
	    staticClass: "hint",
	    domProps: {
	      "textContent": _vm._s(_vm.minuteType)
	    }
	  }), _vm._v(" "), _vm._l((_vm.minutes), function(m) {
	    return _c('li', {
	      class: {
	        active: _vm.minute === m
	      },
	      domProps: {
	        "textContent": _vm._s(m)
	      },
	      on: {
	        "click": function($event) {
	          $event.stopPropagation();
	          _vm.select('minute', m)
	        }
	      }
	    })
	  })], 2), _vm._v(" "), (_vm.secondType) ? _c('ul', {
	    staticClass: "seconds"
	  }, [_c('li', {
	    staticClass: "hint",
	    domProps: {
	      "textContent": _vm._s(_vm.secondType)
	    }
	  }), _vm._v(" "), _vm._l((_vm.seconds), function(s) {
	    return _c('li', {
	      class: {
	        active: _vm.second === s
	      },
	      domProps: {
	        "textContent": _vm._s(s)
	      },
	      on: {
	        "click": function($event) {
	          $event.stopPropagation();
	          _vm.select('second', s)
	        }
	      }
	    })
	  })], 2) : _vm._e(), _vm._v(" "), (_vm.apmType) ? _c('ul', {
	    staticClass: "apms"
	  }, [_c('li', {
	    staticClass: "hint",
	    domProps: {
	      "textContent": _vm._s(_vm.apmType)
	    }
	  }), _vm._v(" "), _vm._l((_vm.apms), function(a) {
	    return _c('li', {
	      class: {
	        active: _vm.apm === a
	      },
	      domProps: {
	        "textContent": _vm._s(a)
	      },
	      on: {
	        "click": function($event) {
	          $event.stopPropagation();
	          _vm.select('apm', a)
	        }
	      }
	    })
	  })], 2) : _vm._e()])])])
	},staticRenderFns: []}

/***/ })
/******/ ]);