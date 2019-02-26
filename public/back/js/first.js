$(function () {
    var currentPage = 1;
    var pageSize = 5;


    render();
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                var htmlStr = template('firstTpl', info)
                $('tbody').html(htmlStr);


                // 完成分页初始化
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, page) {
                        // 更新当前页, 并且重新渲染
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    }


    // 2.点击添加分类按钮， 显示添加模态框
    $('#addBtn').click(function () {
        $('#addModal').modal('show');
    })

    //3. 完成添加效验
    $('#form').bootstrapValidator({
        //2. 指定校验时的图标显示，
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: '请输入一级分类名称'
                    }
                }
            }
        }
    });

    //4. 注册表单效验成功事件,在事件中阻止默认的提交, 通过ajax提交
    $('#form').on('success.form.bv', function (e) {
        //阻止默认提交
        e.preventDefault();

        //通过ajax提交
        $.ajax({
            type: 'post',
            url: '/category/addTopCategory',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (info) {
                console.log(info);

                if (info.success) {

                    //说明添加成功, 关闭模态框
                    $('#addModal').modal('hide');
                    // 重新渲染页面, 重新渲染第一页
                    currentPage = 1;
                    render();


                    // 将表单的内容和状态都要重置
                    $('#form').data('bootstrapValidator').resetForm(true);
                }
            }
        })
    })

})