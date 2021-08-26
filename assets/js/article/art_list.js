$(function(){
    var layer=layui.layer;
    var form=layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat=function(date){
        const dt=new Date(date);
        var y=padZero(dt.getFullYear());
        var m=padZero(dt.getMonth()+1);
        var d=padZero(dt.getDate());

        var hh=padZero(dt.getHours());
        var mm=padZero(dt.getMinutes());
        var ss=padZero(dt.getSeconds());
        return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss;
    }

    // 定义补0的方法
    function padZero(n){
        return n>9?n:'0'+n;
    }
    //查询参数对象，请求数据时，要将请求参数对象提交到服务器
    var q={
        pagenum:1,  //页码值
        pagesize:2, //每页显示多少条数据
        cate_id:'',   //文章分类的 Id
        state:''  //文章的状态，可选值有：已发布、草稿
    }

    initTable();
    initCate();

    // 获取文章列表数据
    function initTable(){
        $.ajax({
            method:'GET',
            url:'/my/article/list',
            data:q,
            success:function(res){
                console.log(res);
                if(res.status!==0){
                    return layer.msg('信息获取失败！');
                }
                var htmlStr=template('tpl-table',res);
                $("tbody").html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }
    // 初始化文章分类的方法
    function initCate(){
        $.ajax({
            method:"GET",
            url:"/my/article/cates",
            success:function(res){
                if(res.status!==0){
                    return layer.msg("列表信息获取失败！");
                }
                var htmlStr=template('tpl-cate',res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui重新渲染表单区域的UI结构
                form.render();
            }
        });
    }
    // 为筛选表单绑定提交事件
    $("#form-search").on('submit',function(e){
        e.preventDefault();
        var cate_id=$("[name=cate_id]");
        var state=$("[name=state]");
        // 为查询参数对象q中对应参数赋值
        q.cate_id=cate_id;
        q.state=state;
        initTable();
    })

    // 渲染分页的方法
    function renderPage(total){
        // 调用该方法渲染分页结构
        
        laypage.render({
            elem:'pageBox', //分页容器ID
            count:total,    //总数据条数
            limit:q.pagesize,   //每条显示几条数据
            curr:q.pagenum,     //默认设置被选中的分页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            // 分页发生切换时，触发jump回调
            jump:function(obj,first){
                q.pagenum=obj.curr;//把最新页码值赋给q
                q.pagesize=obj.limit;//把最新条目数付给q

                // 判断first值判断是哪种方式触发jump回调，true为初始触发，false为点击触发
                if(!first){
                    // 获取文章列表数据
                    initTable();
                }
            }
        })
        
    }

    // 通过代理为删除按钮绑定事件
    $("tbody").on('click','.btn-delete',function(){
        var len=$(".btn-delete").length;
        // 询问用户是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            var id=$(this).attr('data-id');
            $.ajax({
                method:'GET',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message);
                    if(len===1){
                        q.pagenum=q.pagenum === 1 ? 1: q.pagenum-1;
                    }
                    initTable();
                }
            })
            
            layer.close(index);
          });
    })
})