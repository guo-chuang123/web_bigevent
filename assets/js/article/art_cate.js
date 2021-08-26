$(function(){
    var layer=layui.layer;
    var form=layui.form;
    initArtCateList();

    //获取文章，并渲染到tbody
    function initArtCateList(){
        $.ajax({
            mthod:"GET",
            url:"/my/article/cates",
            success:function(res){
                if(res.status !==0){
                    return layer.msg('文章获取失败!');
                }
                // 使用模板引擎                
                var htmlStr=template('tpl-table',res);
                $("tbody").html(htmlStr)
            }
        });
    }

    // 为添加类别按钮绑定弹出层事件
    var indexAdd=null;
    $("#btnAddCate").on("click",function(){
        indexAdd= layer.open({
            type:1, //指定为页面层
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
          })
    })

    // 通过代理形式为form绑定事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault();
        $.ajax({
            method:"POST",
            url:"/my/article/addcates",
            data:$(this).serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg("新增文章分类失败!");
                }
                layer.msg(res.message);
                initArtCateList();
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd);
            }
        });
    })
    // 通过代理形式为编辑按钮绑定事件
    var indexEdit=null;
    $("tbody").on('click','.btn-edit',function(){
        // 弹出修改文章信息的层
        indexEdit= layer.open({
            type:1, //指定为页面层
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-Edit").html()
          })
          var  id=$(this).attr('data-id');
        //   发起请求获取对应数据
        $.ajax({
            method:'GET',
            url:'/my/article/cates/'+id,
            success:function(res){
                if(res.status!==0){
                    return layer.msg("信息获取失败");
                }
                form.val('form-edit',res.data);
            }
        })
        // 通过代理形式为修改按钮绑定事件
        $('body').on('submit','#form-edit',function(e){
            e.preventDefault();
            $.ajax({
                method:"POST",
                url:"/my/article/updatecate",
                data:$(this).serialize(),
                success:function(res){
                    if(res.status!==0){
                        return layer.msg("信息修改失败！");
                    }
                    layer.msg(res.message);
                    // 关闭弹出层，刷新数据
                    layer.close(indexEdit);
                    initArtCateList();
                }
            })
        })
    })

    // 通过代理形式为删除键绑定事件
    $("tbody").on("click",".btn-delete",function(){
        var  id=$(this).attr('data-id');
        // 提示用户是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            
            $.ajax({
                method:"GET",
                url:"/my/article/deletecate/"+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg(res.message);
                    }
                    layer.close(index);
                    layer.msg(res.message);
                    initArtCateList();
                }
            })
            
          });
       
    })
})