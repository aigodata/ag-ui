/**
 * 模拟的静态服务器
 */

var path = require('path');
var conf = require('../config/dev.env');
const Koa = require('koa');
const etag = require('koa-etag');
const serve = require('koa-static');
const proxy = require('koa-proxies');
const favicon = require('koa-favicon');
const compress = require('koa-compress');
const conditional = require('koa-conditional-get');
// const historyFallback = require('koa2-history-api-fallback');

let app = new Koa();

let opt = {
	publicPath: path.resolve(__dirname, '../src'),
	index: '/index.html',
	favicon: '/favicon.ico',
	proxy: conf.proxy.target,	// 后台代理地址
	port: conf.port, 					// 访问端口
};

// http代理转发
app.use(proxy('/api', {
	target: opt.proxy,
	changeOrigin: true,
	// agent: new httpsProxyAgent('http://1.2.3.4:88'),
	// rewrite: path => path.replace(/^\/octocat(\/|\/\w+)?$/, '/vagusx'),
	// logs: true
}));

// gzip压缩
app.use(compress({
	flush: require('zlib').Z_SYNC_FLUSH
}))

// etag缓存控制
app.use(conditional());
app.use(etag());

// HTML5 history api
// app.use(historyFallback());

// favicon
app.use(favicon(opt.publicPath + opt.favicon));

// 静态资源
app.use(serve(opt.publicPath, {extensions: ['html']}));

app.on('error', function(err){
	console.error('server error', err);
});

app.listen(opt.port);

console.log('服务器已启动开始监听 :)  浏览器地址栏访问: localhost:' + opt.port);
