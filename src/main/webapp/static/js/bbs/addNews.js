$(function(){
    init_page();

})
var editor=null ;

//初始化页面
function init_page(){
    KindEditor.ready(function(K) {

        editor = K.create('#news_des', {
            items : [
                'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
                'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
                'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
                'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image',
                /*'flash', 'media',*/ 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
                'anchor', 'link', 'unlink', '|', 'about'
            ],
            resizeType : 0,//1
            allowPreviewEmoticons : true,
            allowImageUpload : true,
            urlType:'domain',
            uploadJson : '/servlet/imageUploadServlet' // 相对于当前页面的路径
        });

    });
    //上传文件
    $("#newsFile").uploadify({
        'uploader': '/static/uploadify/uploadify.swf'+'?ver='+ Math.random(),
        'script': '/servlet/imageUploadServlet'+'?ver='+ Math.random(),
        'fileDesc': '.png .gif .jpeg .jpe .jpg',
        'fileExt': '*.png;*.gif;*.jpeg;*.jpe;*.jpg;',
        'auto': true,
        'multi': false,
        'simUploadLimit': 1,
        'height': 32,
        'width': 32,
        'sizeLimit': 31457280, //30MB
        'buttonImg': '/static/uploadify/addfile.png',
        'cancelImg': '/static/uploadify/cancel.png',
        'removeCompleted': true,
        'onComplete': function(event, queueID, fileObj, response, data){ // 上传完成时
            response= JSON.parse(response);
            if(response.error  == 			0	 ){
                initFileList(queueID,fileObj,response);
            }else{
                if(serverData.errorMessage){
                    alert('附件上传','文件上传失败！文件没有内容!');
                }else{
                    alert('附件上传','文件上传失败！');
                }

            }
        }
    });
  $("#news_type").val( $("#news_type").attr("oVal"))

}
var news_add_post = function() {
    if(jQuery("#news_name").attr("tips")==jQuery("#news_name").val()){
         alert( "请输入标题！");
        return false;
    }
    if(jQuery.trim(jQuery("#news_name").val())==''){
         alert( "请输入标题！");
        return false;
    }
    if(jQuery("#news_type").val()  ==null || jQuery("#news_type").val()  =="" ||jQuery("#news_type").val() == 0){
        alert( "请选择类别！");
        return false;
    }
    if(editor.html() == ""|| editor.html() == null){
        alert( "请输入内容！");
        return false;
    }
    var news={};
    news["name"]=jQuery("#news_name").val();
    news["des"]=editor.html();
    news["type"]=jQuery("#news_type").val();
    news["$exceptionFilter_process"] = 1;
    news["id"]=jQuery("#news_id").val();

    $.ajax({
        url: '/erp/news/doAddNews',
        type: "POST",
        cache: false,
        async: true,
        data: news,
        success: function (json) {
            var msg = jQuery.parseJSON(json);
            alert(msg.msg);
            if (msg && msg.success) {
                goList();
            }
        },
        beforeSend: function () {
            $("#addNewsBtn").removeAttr("onclick").unbind("click")
            $("#addNewsBtn").attr("disabled","disabled");
        },
        complete: function () {
            $("#addNewsBtn").bind("click",news_add_post);
            $("#addNewsBtn").attr("disabled","");
        },
        error: function () {
        }
    });

}

function goList(){
    window.location.href="/erp/news/newsList?type="+jQuery("#news_type").val();
}


function goNewsIndexPage(){
    var url = "/erp/news/newsIndexPage";
    window.location.href=url;
}

function initFileList(queueID,fileObj,response){
    var fileId = response.url;
    jQuery("#add_Eids").val(fileId);
    jQuery("#FileList").attr({href:"javascript:deleteFile('"+fileId+"','"+queueID+"','"+fileObj.name+"');",title:"删除"});
}