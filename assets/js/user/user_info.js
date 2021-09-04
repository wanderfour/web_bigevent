$(function () {
    let form = layui.form;
    let layer = layui.layer;

    // 渲染用户数据
    initUserInfo();

    // 校验表单格式
    form.verify({
        nickname: function (value) {
            console.log(value.length);
            if (value.length > 6) {
                return '昵称长度必须在 1~6 个字符之间！';
            }
        }
    })

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 重置按钮
    $('#btnReset').on('click', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        initUserInfo();
    });

    // 提交用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        // 发起post请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败');
                }
                layer.msg('更新用户信息成功');
                
                // 调用父页面中的方法，重新渲染用户头像和信息
                window.parent.getUserInfo();
            }
        })
    })
})