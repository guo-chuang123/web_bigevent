$(function(){
    // 点击去注册的链接
    $("#link_reg").on("click",function(){
        $(".login-box").hide();
        $(".reg-box").show();
    })
    // 点击去登录的链接
    $("#link_login").on("click",function(){
        $(".login-box").show();
        $(".reg-box").hide();
    })

    // layui获取form对象
    var form=layui.form;
    var layer=layui.layer;
    form.verify({
    // 自定义pwd校验规则
        'pwd': [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ] ,
        //   校验两次密码是否一致
        'repwd':function(value){
            var pwd=$('.reg-box [name=password]').val();
            if(pwd !== value){
                return '两次密码不一致';
            }
        }
    })

    // 监听注册提交事件
    $("#form_reg").on('submit',function(e){
        // 阻止默认提交行为
        e.preventDefault();
        // 获取要提交的数据
        var datas={
            username:$("#form_reg [name=username]").val(),
            password:$("#form_reg [name=password]").val()
        }
        $.ajax({
            method:"POST",
            url:"/api/reguser",
            data:datas,
            success:function(res){
                if(res.status !=0){
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录');
                // 注册成功直接跳转到登录界面
                $("#link_login").click();
            }
        })
    })
    // 监听登录提交事件
    $("#form_login").on("submit",function(e){
        e.preventDefault();
        $.ajax({
            method:"POST",
            url:"/api/login",
            data:{
                username:$(".login-box [name=username]").val(),
                password:$(".login-box [name=password]").val()
            },
            success:function(res){
                if(res.status !==0){
                    return layer.msg("登录失败！请检查输入是否正确,或去注册");
                }
                layer.msg('登录成功！');
                // 将登陆成功的字符串，保存到localStorage中
                localStorage.setItem("token",res.token);
                // 跳转后台主页
                location.href="/images/大事件/index.html";
            }
        })
    })
})