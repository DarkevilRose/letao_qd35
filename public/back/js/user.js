$(function () {
    // 1. 一进入页面, 应该发送 ajax 请求, 获取数据, 动态渲染 (模板引擎)
    // template(模板id, 数据对象)  返回一个 htmlStr
    var currentPage = 1;
    var pageSize = 5;

    var currentId; // 标记当前正在编辑的用户 id
    var isDelete;  // 标记修改用户成什么状态

    render();
    function render() {
        $.ajax({
            type: 'get',
            url: '/user/queryUser',
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);

                var htmlStr = template('tpl', info);
                // console.log(htmlStr)
                $('tbody').html(htmlStr);


                // 根据请求回来的数据, 完成分页的初始化显示
                $("#paginator").bootstrapPaginator({
                    //版本号
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    //当前页
                    currentPage: info.page,
                    //总页数
                    totalPages: Math.ceil(info.total / info.size),
                    // size:"small",//设置控件的大小，mini, small, normal,large
                    //为按钮绑定点击事件 page:当前点击的按钮值           
                    onPageClicked: function (event, originalEvent, type, page) {
                        // console.log(page);
                        currentPage = page;
                        render();
                    }
                });
            }
        })
    }

    // 2. 点击表格中的按钮, 显示模态框
    // 事件委托的作用:
    // 1. 给动态创建的元素绑定点击事件
    // 2. 批量绑定点击事件 (效率比较高的)
    // 思路: 使用事件委托绑定按钮点击事件

    $('tbody').on('click', '.btn', function () {

        //显示模态框
        $('#userModal').modal('show');

        //获取id
        currentId = $(this).parent().data('id');

        // 获取启用禁用状态
        // 有btn-danger类 => 禁用按钮
        // 禁用按钮 ? 改成禁用状态 0 : 改成启用状态 1
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1;

        //给模态框的确定按钮注册点击事件
        $('#confirmBtn').click(function () {
            // 发送ajax请求, 完成用户状态的编辑
            $.ajax({
                type: 'post',
                url: '/user/updateUser',
                data: {
                    id: currentId,
                    isDelete: isDelete
                },
                dataType: 'json',
                success: function (info) {
                    console.log(info);
                    if (info.success) {
                        $('#userModal').modal('hide');
                        render();
                    }
                }
            })
        })
    })
})