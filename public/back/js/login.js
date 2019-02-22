// 校验规则：

// 1. 用户名不能为空, 长度为2-6位
// 2. 用户密码不能为空, 密码长度为6-12位 


  // 进行表单校验初始化
$('#form').bootstrapValidator({
    //配置图标
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },

    fields: {
        //用户名
        username: {
        //校验规则
        validators: {
            //非空
            notEmpty: {
                //提示信息
                message:'用户名不能为空'
            },
            //长度校验
            stringLength: {
                min: 2,
                max: 6,
                message:'用户名长度为2-6位'
            }
        }
        },
        //密码
        password: {
        //校验规则
        validators: {
            notEmpty: {
                //提示信息
                message:'密码不能为空'
            },
            //长度校验
            stringLength: {
                min: 6,
                max: 12,
                message:'密码长度必须是6-12'
            }
        }            
        }
    }
});



/* 
    2. 使用 submit 按钮, 会进行表单提交, 此时表单校验插件会立刻进行校验
       (1) 校验成功, 此时会默认提交, 发生页面跳转,  注册表单校验成功事件, 
           在事件中阻止默认的跳转提交, 通过ajax提交
       (2) 校验失败, 自动拦截提交

      注册表单校验成功事件, 在事件中阻止默认的提交, 通过ajax提交
  */
$('#form').on('success.form.bv', function(e){
    e.preventDefault();

    $.ajax({
        type:'post',
        url:'/employee/employeeLogin',
        data:$("#form").serialize(),
        dataType:'json',
        success:function(info){
            console.log(info);
            if (info.error == 1000) {
                alert('用户名不存在');
            }
            if (info.error ==1001) {
                alert('密码错误');
            }
            if (info.success) {
                //登录成功,跳转页面
                location.href = 'index.html';
            }
        }
    })
})

