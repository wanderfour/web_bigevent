$(function () {

    let layer = layui.layer;
    let form = layui.form;

    // 获取文章分类的列表
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                console.log(res);
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    let indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，为form-add绑定submit事件，因为表单是通过script标签动态创建上去的，直接通过表单id不能获取元素
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList();
                layer.msg('新增分类成功');
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    });

    let indexEdit = null;
    // 通过代理的形式，为btn-edit按钮绑定事件
    $('tbody').on('click', '#btn-edit', function (e) {
        e.preventDefault();
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 获取编辑的类别信息
        let id = $(this).attr('data-id');

        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })


    })

    // 通过代理绑定修改提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        // 发起请求修改分类数据
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！');
                }
                initArtCateList();
                layer.msg('更新分类数据成功');
                // 根据索引关闭对应的弹出层
                layer.close(indexEdit);
            }
        })
    })

    // 删除文章列表功能
    $('tbody').on('click', '#btnDelete', function (e) {
        e.preventDefault();
        let id = $(this).attr('data-id');
        console.log(id);
        layer.confirm('确认删除此文章列表?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);
                    initArtCateList();
                }
            })
        });
    })
})