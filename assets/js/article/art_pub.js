$(function () {
    let layer = layui.layer;
    let form = layui.form;

    initCate();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引起，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 要记得调用form.render()，将表单内容重新渲染的页面中
                form.render();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 上传封面图片
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        e.preventDefault();
        // 获取文件的列表数组
        let files = e.target.files;
        if (files.length === 0) {
            return layer.msg('获取文件失败');
        }
        // 根据文件创建对应的url地址
        let newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区换上新的图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 定义文章的发布状态
    let art_state = '已发布';
    // 发布文章

    // 存为草稿
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 基于form表单，快速创建一个FormData对象
        let fd = new FormData($(this)[0]);
        // 将文章状态存入fd中
        fd.append('state', art_state);
        // 将封面裁剪后的图片输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件追加到fd
                fd.append('cover_img', blob);
                // 发起ajax请求，提交文章内容到服务器
                publishArticle(fd);
            })
    })

    // 发表文章的函数
    function publishArticle(fd) {
        console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交的是FormData格式数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                // 发布文章成功后跳转
                location.href = '/article/art_list.html';
            }
        })
    }
})