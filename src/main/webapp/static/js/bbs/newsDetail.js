var currentNews=null;
$(function () {
    currentNews= JSON.parse($("#currentNewsJSON").val());
    init_xheditor();
    reloadReplyList(1);
})
function init_xheditor() {
    $('#replyContent').xheditor({
        tools: 'Emot',
        skin: 'o2007silver',
        showBlocktag: true,
        internalScript: false,
        internalStyle: false,
        width: 854,
        height: 100,
        html5Upload: false,
        fullscreen: false,
        forcePtag: true,
        disableContextmenu: true
    });
}


function doAdd() {
    var reply = $("#replyContent").val();
    var anonym=$("#anonym")[0].checked;
    var currentNews= JSON.parse($("#currentNewsJSON").val())
    currentNews["des"] = null;
    currentNews["content"] = reply;
    currentNews["anonym"] = anonym;
    currentNews["$exceptionFilter_process"] = 1;
    reply = reply.replace(/ alt=\"\"/g,"");
    var length = reply.length;
    if(length < 5){
         alert(  '回复内容不能少于5个字符！');
        return;
    }
    if(length > 300){
        alert ( '回复内容（包含样式字符）不能超过300个字符！');
        return;
    }
   // reply=reply.replace(/<script/g,"");

    $.ajax({
        url: '/erp/news/reply',
        type: "POST",
        cache: false,
        async: true,
        data: currentNews,
        success: function (json) {
            var msg = jQuery.parseJSON(json);
            alert(msg.msg)
            if (msg && msg.success) {
                jQuery("#replyContent").val('');
                reloadReplyList(1);
            }
        },
        beforeSend: function () {
            $("#publishBtn").removeAttr("onclick").unbind("click")
            $("#publishBtn").attr("disabled","disabled");

        },
        complete: function () {
           $("#publishBtn").bind("click",doAdd);
         $("#publishBtn").attr("disabled","");
        },
        error: function () {
        }
    });

}


function doPraise(){
    var currentNews= JSON.parse($("#currentNewsJSON").val());
    jQuery.ajax({
        url: '/erp/news/doPraise',
        type : "POST",
        cache : false,
        async : true,
        data : currentNews,
        success : function(json) {

            var msg = jQuery.parseJSON(json);
            if(msg && msg.success){
                 alert('亲，谢谢你的赞，么么哒');
                $('#praiseId').html('已赞');
            }else if(msg.erMsg == '点赞失败'){
                alert('点赞失败，请联系网站运维人员，谢谢！');
            }else{
               alert('亲，请先登录，之后再来赞我，不见不散，等你来哦！');
            }
        },
        error : function(){}
    });
}

var reloadReplyList = function(page){
    var url =    '/erp/news/replyList?newsid=' + currentNews.id;
    if(page){
        url = url + '&currPage=' + page;
    }
    $.ajax({
        url: url,
        type: "POST",
        cache: false,
        async: true,
        data: currentNews,
        success: function (html) {
            jQuery('#replyList').html(html);
        }
    });


}

function goNewsIndexPage(){
    var url = "/erp/news/newsIndexPage";
    window.location.href=url;
}

$(function () {
        $('span[class="xheIcon xheBtnAbout"]').hide();
    }
)
