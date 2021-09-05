$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let laypage = layui.laypage;

    // 定义美化事件的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        let y = dt.getFullYear();
        let m = paddingZero(dt.getMonth() + 1);
        let d = paddingZero(dt.getDate());
        let hh = paddingZero(dt.getHours());
        let mm = paddingZero(dt.getMinutes());
        let ss = paddingZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 时间补0函数
    function paddingZero(t) {
        return t > 9 ? t : '0' + t;
    }

    // 定义一个查询的参数对象
    // 后续请求数据时，需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    // 渲染列表数据
    initTable();
    // 渲染分类数据
    initCate();

    // 获取文章列表数据的的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                // 使用模板引擎渲染页面的数据
                let htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 列表数据渲染完成后，调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }

    // 获取文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 调用模板引起渲染分类的可选项
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过layui重新渲染表单区域的ui结构
                form.render();
            }
        })
    }

    // 筛选功能
    // 监听表单提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中的选中项的值
        let cate_id = $('[name=cate_id]').val();
        let state = $('[name=state]').val();
        // 为查询参数对象q对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 重新渲染文章列表数据
        initTable();
    });

    // 分页功能方法
    // 渲染分页区域
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页几条数据
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 自定义排版
            limits: [2, 5, 10, 20], // 每页条数的选择项
            curr: q.pagenum, // 设置默认被选中的分页
            groups: 3, // 连续显示多少页
            theme: '#1E9FFF', // 自定义主题颜色
            // 触发jump回调的两个情况：1、点击页码；2、调用renderPage()
            jump: function (obj, first) {
                // obj包含了当前分页的所有参数，比如：
                // obj.curr 得到当前页，以便向服务端请求对应页的数据。
                // obj.limit 得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                // first值，当首次执行为true
                //  首次不执行，避免死循环
                if (!first) {
                    initTable();
                }
            }
        });
    }
    // 删除功能
    // 通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取页面删除按钮的个数
        let len = $('.btn-delete').length;
        let id = $(this).attr('data-id');
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            // 发起删除请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功');
                    // 删除最后一页数据没有更新页码的问题
                    // 当数据删除完成后，需要判断当前页是否还有剩余的数据，如果么有，则让页码值减1
                    if (len === 1 && q.pagenum > 1) {
                        q.pagenum = q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
          });
    })
    // TODO：文章编辑功能
    $('tbody').on('click', '.btn-edit', function() {
        layer.msg('功能开发中，敬请期待');
    })
})