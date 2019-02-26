$(function(){
    //一进页面发送 ajax 请求

    var currentPage = 1; //当前页
    var pageSize = 5;  //每页条数

    render();  //进页面渲染

  function render(){
    $.ajax({
        type:'get',
        url:'/category/querySecondCategoryPaging',
        data:{
            page: currentPage,
            pageSize: pageSize
        },
        dataType:'json',
        success:function(info){
            console.log(info);
            var htmlStr = template('secondTpl',info);
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
                onPageClicked:function(a,b,c,page){
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
    $('#addBtn').click(function(){
    // 显示模态框, 就应该发送请求
        $('#addModal').modal('show');


    })
})