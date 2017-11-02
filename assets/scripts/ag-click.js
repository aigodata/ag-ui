// 选中模块
!function () {

	// 常量
	var EASY = {
		MARK: 'ag-click',									// 标记
		ACTIVE: 'active',										// 选中
		TOGGLE: 'toggle',										// 切换
		REMOVE: 'remove',										// 清除
		TARGET: 'target',										// 一个源控制多个目标
		TARGET_ONLY: 'target-only',					// 多个源仅控制一个目标
		TARGET_GROUP: 'target-group',				// 一个源关联目标组的一个目标
		TARGET_ENTER: 'target-enter',				// 被控制目标进入动画
		TARGET_LEAVE: 'target-leave',				// 被控制目标离开动画
		ACTIVE_HEIGHT: 'active-height',			// 选中时添加高度样式
	};

	// 工具方法
	var utils = {
		// 查询节点
		searchUp: function (node, name) {
			// 向上递归到顶就停
			if (!node || node === document.body || node === document) return undefined;
			if (node.getAttribute(name) !== null) return node;
			return this.searchUp(node.parentNode, name);
		}
	};

	// 初始模块
	var mod = {
		init: function () {
			this.unbind();
			this.bind();
		},
		destroy: function () {
			this.unbind();
		},
		bind: function () {
			document.addEventListener('click', this.click, true);
		},
		unbind: function () {
			document.removeEventListener('click', this.click, true);
		},
		click: function (event) {
			var self = mod;
			var el = utils.searchUp(event.target, EASY.MARK);
			if (!el) return;
			// 选中
			self.active(self.pre(el, EASY.MARK));
			// 是否开启了target
			self.has(el, EASY.TARGET) && self.target(el, self);
			// 是否开启了target_only
			self.has(el, EASY.TARGET_ONLY) && self.targetOnly(el, self);
			// 是否开启了target-group
			self.has(el, EASY.TARGET_GROUP) && self.targetGroup(el, self);
		},
		target: function (el, self) {
			// 支持多对象
			var targets = [];
			el.getAttribute(EASY.TARGET).split(' ').map(function (name) {
				var el = document.querySelector('[' + name + ']');
				el && targets.push({name: name, target: el});
			});
			[].forEach.call(targets, function (v) {
				self.enterAnimate(v.target);
				self.leaveAnimate(v.target);
				self.active(self.pre(el, v.name, v.target));
			});
		},
		targetOnly: function (el, self) {
			var name = el.getAttribute(EASY.TARGET_ONLY);
			var target = document.querySelector('[' + name + ']');
			// 第一次进入
			if (!self.prevEl) {
				self.enterAnimate(target);
			}
			// 切换
			else if (self.prevEl !== el) {
				self.leaveAnimate(target, true);
				target.addEventListener('animationend', function() {
					self.enterAnimate(target);
				}, false);
			}
			self.prevEl = el;
			self.active(self.pre(el, name, target));
		},
		targetGroup: function (el, self) {
			var targetName = el.getAttribute(EASY.TARGET_GROUP);
			var targets = document.querySelectorAll('[' + targetName + ']');
			var prevTarget = document.querySelector('[' + targetName + '][active]');
			// 预处理
			var pre = self.pre(el, EASY.MARK, undefined, targets);
			// 执行逻辑判断
			[].forEach.call(targets, function (target) {
				var activeHeight = self.has(target,EASY.ACTIVE_HEIGHT);
				// 当前选中的离开动画
				if (target === prevTarget) {
					self.leaveAnimate(target);
				}
				// 正在选中的进入动画
				if (target === targets[pre.index]) {
					self.enterAnimate(target);
					// 是否添加了选中高度
					activeHeight && (target.style.height = target.clientHeight || target.scrollHeight + 'px')
				} else {
					// 是否添加了选中高度
					activeHeight && target.style.removeProperty('height');
				}
			});
			self.active(pre);
		},
		// 预处理
		pre: function(el, name, target, targets) {
			var list = this.filter(target || el, name);
			return {
				list: targets || list,
				index: this.index(target || el, list),
				toggle: this.has(el, EASY.TOGGLE),
				remove: this.has(el, EASY.REMOVE)
			};
		},
		active: function (pre) {
			var self = this;
			[].forEach.call(pre.list, function (v, i) {
				// 当前选中
				if (i === pre.index) {
					// 判断是否删除
					if (pre.remove) {
						return v.removeAttribute(EASY.ACTIVE);
					}
					// 判断是否切换
					var active = self.has(v, EASY.ACTIVE);
					var activeHeight = self.has(v, EASY.ACTIVE_HEIGHT)
					if (active && pre.toggle) {
						v.removeAttribute(EASY.ACTIVE);
						// 是否添加了选中高度
						activeHeight && v.style.removeProperty('height');
					}
					// 默认选中
					else {
						v.setAttribute(EASY.ACTIVE, "");
						// 是否添加了选中高度
						activeHeight && (v.style.height = v.clientHeight || v.scrollHeight + 'px')
					}
				}
				// 兄弟元素移除选中
				else {
					v.removeAttribute(EASY.ACTIVE);
					// 是否添加了选中高度
					activeHeight && v.style.removeProperty('height');
				}
			});
		},
		// 进入动画
		enterAnimate: function (target) {
			if (this.has(target, EASY.TARGET_ENTER)) {
				this.className('remove', target, EASY.TARGET_LEAVE);
				this.className('add', target, EASY.TARGET_ENTER);
			}
		},
		// 离开动画
		leaveAnimate: function (target, active) {
			active = active || this.has(target, EASY.ACTIVE);
			if (this.has(target, EASY.TARGET_LEAVE) && active) {
				this.className('remove', target, EASY.TARGET_ENTER);
				this.className('add', target, EASY.TARGET_LEAVE);
			}
		},
		className: function (fn, target, name) {
			var classList = target.getAttribute(name).split(' ');
			classList.forEach(function (v) {
				target.classList[fn](v);
			})
		},
		filter: function (el, mark) {
			var self = this;
			return [].filter.call(el.parentNode.children, function (v) {
				return self.has(v, mark);
			});
		},
		index: function (el, list) {
			return [].findIndex.call(list, function (v) {
				return v === el
			});
		},
		has: function(el, name) {
			return el.getAttribute(name) !== null
		}
	};

	mod.init();

}();
