$(function () {
    // 调用函数获取用户基本信息
    getUserInfo();

    // 导入layui的layer
    let layer = layui.layer;
    // 退出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确认退出登录吗？', {icon: 3, title:'提示'}, function(index){
            // 回调函数用于处理确认退出的功能
            // 清空本地存储中的 token
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href = '/login.html';
            // 关闭confirm询问框
            layer.close(index);
          });
    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            // 调用渲染用户头像函数
            renderAvatar(res.data);
        }
        // 在baseAPI统一挂载complete回调函数
        // complete: function(res) {
        //     // 在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！');
        //     // 强制清空token
        //     localStorage.removeItem('token');
        //     // 强制跳转到登录页面
        //     location.href = '/login.html';
        // }
    })
}

// 渲染用户头像函数
function renderAvatar(user) {
    // 获取用户名称
    let name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 按需渲染用户头像
    if (user.user_pic !== null) {
        // 有图片头像显示图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 没有图片头像显示名称头像
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}