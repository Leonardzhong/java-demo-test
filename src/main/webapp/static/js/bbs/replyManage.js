$(function(){
    init_page();
})
function init_page(){


    $("#createOrg").placeholder();
    $("#searchName").placeholder();
    fefreshGrid(1);

}
function news_search(){
    fefreshGrid(1);
}


function fefreshGrid(currPage){
    //得到查询的参数
    var data={};
    data["createOrg"]=$("#createOrg").val2();
    data["name"]=$("#searchName").val2();
    data["replyStart"]=$("#replyStart").val();
    data["replyEnd"]=$("#replyEnd").val();
    data["type"]=$("#newsType").val();
    data["id"]=$("#news_id").val();
    data["currPage"]=currPage;
    //刷新grid
    var url =    '/erp/reply/list' ;
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



//删除
var deleteReply = function(id) {
    var url="/erp/reply/doDelete";
    var data={};
    data["id"]=id;
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




