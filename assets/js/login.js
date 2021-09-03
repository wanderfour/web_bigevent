$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 自定义layui校验规则
    // 从layui获取form对象
    let form = layui.form;
    // 通过form.verify()自定义校验规则
    form.verify({
        // 自定义pwd校验规则
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 
        repwd: function(value) {
            // 将两次密码框的内容进行比较
            let pwd = $('.reg-box [name=password]').val();
            // 形参是当前表单的值，即确认密码框的值
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })

    // 监听注册表单的提交事件
    // 获取layui的layer对象
    let layer = layui.layer;
    $('#form_reg').on('submit', (e) => {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起ajax的post请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 提示注册成功
                layer.msg('注册成功');
                // 模拟点击行为跳转到登录界面
                $('#link_login').click(); 
            }
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault();

        $.post('/api/login', $(this).serialize(),function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('登录成功');
            // 将登录成功得到的token字符串，保存到localStorage
            localStorage.setItem('token', res.token);
            // 跳转到后台主页
            location.href = '/index.html';
        })
    })

})