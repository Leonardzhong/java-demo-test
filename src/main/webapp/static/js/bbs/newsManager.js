$(function(){
    init_page();
})
function init_page(){

    $("#searchName").placeholder();
    fefreshGrid(1);
}
function news_search(){
    fefreshGrid(1);
}


function fefreshGrid(currPage){
    //得到查询的参数
    var data={};
    data["name"]=$("#searchName").val2();
    data["type"]=$("#newsType").val();
    data["currPage"]=currPage;
    //刷新grid
    var url =    '/erp/news/newsGrid' ;
    $.ajax({
        url: url,
        type: "POST",
        cache: false,
        async: true,
        data: data,
        success: function (html) {
            jQuery('#gridDiv').html(html);
        }
    });

}

//更新
var news_update = function(newsVo_eid) {
    window.location.href="/erp/news/toAddNews?id="+newsVo_eid;

}
//删除
var news_delete = function(newsVo_eid) {
    var url="/erp/news/deleteNews";
    var data={};
    data["id"]=newsVo_eid;
    $.ajax({
        url: url,
        type: "POST",
        cache: false,
        dataType: "json",
        data: data,
        success: function (msg) {
             alert(msg.msg);
            fefreshGrid(1);
        }
    });

}


//置顶
var news_cancel_top = function(newsVo_eid) {
    var url="/erp/news/cancelTop";
    var data={};
    data["id"]=newsVo_eid;
    $.ajax({
        url: url,
        type: "POST",
        cache: false,
        dataType: "json",
        data: data,
        success: function (msg) {
            alert(msg.msg);
            fefreshGrid(1);
        }
    });

}
//置顶
var news_to_top = function(newsVo_eid) {
    var url="/erp/news/toTop";
    var data={};
    data["id"]=newsVo_eid;
    $.ajax({
        url: url,
        type: "POST",
        cache: false,
        dataType: "json",
        data: data,
        success: function (msg) {
            alert(msg.msg);
            fefreshGrid(1);
        }
    });

}

/*跳转到新闻详细界面*/
function showNewsDetail(newsVoEid,url){
    window.open("/erp/news/detail?id="+newsVoEid);
}
function reply_manage(newsVoEid){
    window.open("/erp/reply/replyManage?id="+newsVoEid);
}

