var form=layui.form
var layer=layui.layer

$(function(){
    form.verify({
        nickname:function(value){
            if(value.length>6){
                return "昵称长度必须在1-6个字符之间!";
            }
        }
    })
    initUserInfo();
    // 重置表单数据
    $("#btnReset").on("click",function(e){
        // 阻止表单默认重置
        e.preventDefault();
        initUserInfo();
    })
    // 监听表单提交事件
    $(".layui-form").on("submit",function(e){
        e.preventDefault();
        $.ajax({
            method:"POST",
            url:"/my/userinfo",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg("更新用户信息失败");
                }
                layer.msg("更新用户信息成功");
                // 调用父页面中的方法,重新渲染用户的头像和用户信息
                window.parent.getUserInfo();
            }
        });
    })
})

// 初始化用户信息 
function initUserInfo(){
    $.ajax({
        method:"GET",
        url:"/my/userinfo",
        success:function(res){
            if(res.status !==0){
                return layer.msg('信息获取失败');
            }
            // 调用form.val()快速为表单赋值
            form.val("formUsrInfo",res.data);
        }
    })
}
