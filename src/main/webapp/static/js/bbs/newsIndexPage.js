/**
 * Created by huhuanye on 2016/4/13.
 */


$(function () {
    $("#news_search_keyWord").placeholder();
});


var queryName;
//首页标题查询
function newsSearch(){
    var name = $('#news_search_keyWord').val2();
    queryName=name;
    var url = "/erp/news/newsIndexPage?name="+name;
    url=encodeURI(url);
    url=encodeURI(url);
    window.location.href=url;
}

