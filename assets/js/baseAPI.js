
// 每次调用ajax前都会先调用此对象
// 在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的ajax请求前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})