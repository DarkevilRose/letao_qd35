$(function(){
    var currentPage = 1;
    var pageSize =  5;
    

    render();
    function render(){
        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data:{
                page: currentPage,
                pageSize: pageSize
            } ,
            dataType:'json',
            success:function(info){
                 console.log(info);
                 var htmlStr = template('firstTpl',info)
                 $('tbody').html(htmlStr);
     
     
                 // 完成分页初始化
                 $('#paginator').bootstrapPaginator({
                     bootstrapMajorVersion: 3,
                     currentPage: info.page,
                     totalPages: Math.ceil(info.total/info.size),
                     onPageClicked:function(a,b,c,page){
                         // 更新当前页, 并且重新渲染
                         currentPage = page;
                         render();
                     }
                 })
            }
         })
    }






})