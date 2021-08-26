
$(function(){
    var layer=layui.layer;
    var form=layui.form;
    initCate();
    initEditor();
    // 加载文章分类的方法
    function initCate(){
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res){
                if(res.status!==0){
                    return layer.msg('文章类别获取失败');
                }
                var htmlStr=template('tpl-cate',res);
                $('[name=cate_id]').html(htmlStr);
                //调用该方法重新渲染表单结构
                form.render();
            }
        });
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    $("#btnChooseImage").on('click',function(){
        $("#coverFile").click();
    })
    $("#coverFile").on('change',function(e){
        // 获取文件列表数组
        var files=e.target.files;
        if(files.length===0) return;
        // 根据文件创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 重新为裁剪区域设置图片
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })
    var art_state='已发布'  //定义文章状态
    $("#btnSave2").on('click',function(){
        art_state='草稿';
    })
    // 为表单绑定提交事件
    $("#form-pub").on('submit',function(e){
        e.preventDefault();

        // 基于form表单创建formData对象
        var fd=new FormData($(this)[0]);
        fd.append('state',art_state)
        // 将封面裁剪过后的图片,输出为一个文件
        $image  
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，追加到formData对象中
            fd.append("cover_img",blob);
            // 发起ajax请求
            publishArticle(fd);
        })
    })
    function publishArticle(fd){
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            // 提交的为formdata对象，必须添加以下两个配置项
            contentType:false,
            processData:false,
            success:function(res){
                if(res.status!==0){
                    return layer.msg("发布文章失败！");
                }
                layer.msg(res.message);
                location.href='../article/art_list.html';
            }
        })
    }
})