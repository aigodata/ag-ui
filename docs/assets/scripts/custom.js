/*
 * 自定义脚本
 */

$(function () {

	//可视化展示侧边栏
	var visualBtn = $('.rx-visual .rx-sidebar ul li a');

	visualBtn.click(function () {
		$(this).addClass('active').parent().siblings().children().removeClass('active');
	});

	//复制代码
	var clipboard = new Clipboard('.rx-page-component a.copy');

	//显示隐藏代码块
	var toggleBtn = $('.rx-demo-layout .example-wrap a.toggle-btn'); //获取显示隐藏的按钮

	toggleBtn.click(function () {

		if ($(this).prev().is(':visible')) {
			$(this).prev().slideUp(150);
			$(this).text('显示代码');

		} else {
			$(this).prev().slideDown(150);
			$(this).text('隐藏代码');
		}

	});

	//隐藏代码块
	var aBtn = $('.code-block a.up');

	aBtn.click(function () {
		$(this).parent().slideUp(550);
		$(this).parent().next().text('显示代码');
	});

});
