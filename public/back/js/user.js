$(function(){

$.ajax({
    type:'get',
    url:'/user/queryUser',
    data:{
        page: 1,
        pageSize:5,
    },
    dataType:'json',
    success:function(info){
        console.log(info);
        
        var htmlStr = template('tpl',info);
        console.log(htmlStr)
        $('tbody').html(htmlStr);   
    }
})
})