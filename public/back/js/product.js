$(function () {

    //一进入页面 完成渲染
    var currentPage = 1; //当前页
    var pageSize = 2; //每页条数

    render();

    function render() {
        $.ajax({
            type: 'get',
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('productTpl', info);
                $('tbody').html(htmlStr);


                //完成分页初始化
                $('#paginator').bootstrapPaginator({

                    // 版本号
                    bootstrapMajorVersion: 3,
                    //当前页
                    currentPage: info.page,
                    // 总页数  总条数 /每页的条数
                    totalPages: Math.ceil(info.total / info.size),
                    //给页码添加点击事件
                    onPageClicked: function(a, b, c, page) {
                        //更新当前页
                        currentPage = page;
                        // 重新渲染
                        render();
                    }
                })
            }
        });
    }


})