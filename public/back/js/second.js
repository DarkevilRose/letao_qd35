$(function () {
    //一进页面发送 ajax 请求

    var currentPage = 1; //当前页
    var pageSize = 5;  //每页条数

    render();  //进页面渲染

    function render() {
        $.ajax({
            type: 'get',
            url: '/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('secondTpl', info);
                $('tbody').html(htmlStr);

                // 实现分页插件的初始化
                $('#paginator').bootstrapPaginator({
                    //版本号
                    bootstrapMajorVersion: 3,
                    //当前页
                    currentPage: info.page,
                    // 总页数
                    totalPages: Math.ceil(info.total / info.size),
                    //给页码添加点击事件
                    onPageClicked: function (a, b, c, page) {
                        //更新当前页
                        currentPage = page;
                        //并且重新渲染
                        render();
                    }
                })

            }
        })
    }

    // 2. 点击添加分类按钮, 显示添加模态框
    $('#addBtn').click(function () {
        // 显示模态框, 就应该发送请求
        $('#addModal').modal('show');

        // 发送请求,获取一级分类的全部数据,将来用于渲染
        // 根据已经有的接口,模拟获取全部数据的接口,
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('dropdownTpl', info);
                $('.dropdown-menu').html(htmlStr);
            }
        })

    });


    //3. 给下拉菜单添加可选功能
    $('.dropdown-menu').on('click', 'a', function () {
        // 获取a的文本
        var txt = $(this).text();
        // console.log(txt);
        // 设置给 button 按钮
        $('#dropdownText').text(txt);

        //获取 id 设置给隐藏域
        var id = $(this).data('id');
        // 设置给隐藏域
        $('[name="categoryId"]').val(id);

        // 只要给隐藏域赋值了, 此时校验状态应该更新成成功        
        $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID')
    });


    //4. 完成文件上传初始化
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            console.log(data);

            var result = data.result;  //后台返回的结果
            var picAddr = result.picAddr; // 获取图片的路径
            // 设置给 img 的 src
            $('#imgBox img').attr('src', picAddr);

            // 把路径赋值给 隐藏域
            $('[name="brandLogo"]').val(picAddr);

            //只要隐藏域有值了, 就是更新成功状态
            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    });


    //5. 直接进行校验
    $('#form').bootstrapValidator({
        excluded:[],
        //2. 指定校验时的图标显示
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        //配置校验字段表
        fields: {
            //选择一级分类
            categoryId: {
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            //请输入二级分类名称
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入二级分类名称'
                    }
                }
            },
            //二级分类图片
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请选择图片'
                    }
                }
            }
        }
    });

    // 6. 注册表单校验成功事件,阻止默认的提交,通过ajax提交
    $('#form').on('success.form.bv',function(e){
        e.preventDefault();

        //发送ajax请求
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$('#form').serialize(),
            dataType:'json',
            success:function(info){
                console.log(info);
                //如果添加成功, 关闭模态框
                if (info.success) {
                    $('#addModal').modal('hide');

                    //页面重新渲染,第一页
                    currentPage: 1;
                    render();

            // 将表单元素重置 (内容和状态都重置)
            $('#form').data('bootstrapValidator').resetForm(true);
            
            // button 和 img 不是表单元素, 手动重置
            $('#dropdownText').text('请输入一级分类');

            $('#imgBox img').attr('src','../images/none.png');

                }
            }
        })




    })



})