$(function(){
    getUserInfo();
    var layer=layui.layer;
    // 点击按钮退出登录
    $("#btn_logout").on("click",function(){
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            // 清空本地存储的token,并跳转到登录页
            localStorage.removeItem('token');
            location.href='/images/大事件/login.html';
            
            layer.close(index);
          });
    })
})
// 获取用户基本信息
function getUserInfo(){
    $.ajax({
        method:"GET",
        url:"/my/userinfo",
        // headers就是请求头配置对象
        // headers:{
        //     Authorization:localStorage.getItem("token")||''
        // },
        success:function(res){
            if(res.status !== 0){
                return layui.layer.msg("获取用户信息失败！");
            }
            // 渲染用户头像
            renderAvatar(res.data);
        },
        // 无论成功失败,最终都会调用complete函数
        // complete:function(res){
        //     // res.responseJSON拿到服务器响应回来的数据
        //     if(res.responseJSON.status ===1  && res.responseJSON.message==='身份认证失败！'){
        //         // 强制清空token,强制跳转到登录界面
        //         localStorage.removeItem("token");
        //         location.href="/images/大事件/login.html";
        //     }
        // }
    });
}
function renderAvatar(user){
    // 获取用户昵称
    var name=user.nickname||user.username;
    $("#welcome").html('欢迎&nbsp;&nbsp;'+name);
    // 按需渲染用户头像
    if(user.user_pic !== null){
        // 渲染图片头像
        $(".layui-nav-img").attr('src',user.user_pic).show();
        $(".text-avatar").hide();
    }else{
        // 渲染文本头像
        $(".layui-nav-img").hide();
        var first=name[0].toUpperCase();
        $(".text-avatar").html(first).show();
    }
}