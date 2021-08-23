// 每次调用$.get()|$.post()|$.ajax()时,会先调用$.ajaxPrefilter()
// 这个函数中可以拿到给Ajax提供的配置对象
$.ajaxPrefilter(function(options){
    options.url="http://api-breakingnews-web.itheima.net"+options.url;

    // 统一为有权限的接口,设置header请求头
    if(options.url.indexOf("/my/")!==-1){
        options.headers={
            Authorization:localStorage.getItem("token")||''
        }
    }
    
    // 全局统一挂载complete函数
    options.complete=function(res){
         // res.responseJSON拿到服务器响应回来的数据
         if(res.responseJSON.status ===1  && res.responseJSON.message==='身份认证失败！'){
            // 强制清空token,强制跳转到登录界面
            localStorage.removeItem("token");
            location.href="/images/大事件/login.html";
        }
    }
})