/**
 * Created by liangchen8 on 2017/4/11.
 */

$(function(){

});
function getServiceNoNameFromCookie(){
    var serviceno = getServicenoFromCookie();
    if(serviceno==null||serviceno[1]==null)
        return "";
    return decodeURI(serviceno[1]);
}

function getServiceNoLogoFromCookie(){
    var serviceno = getServicenoFromCookie();
    if(serviceno==null||serviceno[2]==null)
        return "/misc/img/getheadimg.png";
    return decodeURIComponent(serviceno[2]);
}

function getServicenoIdFromCookie(){
    var serviceno = getServicenoFromCookie();
    if(serviceno==null||serviceno[0]==null)
        return "";
    return serviceno[0];
}

function getValueByCookieName(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return decodeURI(arr[2]);
    else
        return null;
}

function getServicenoFromCookie(){
    var cookie = getValueByCookieName("bizcoll_id");
    if(cookie == null)
        return null
    var serviceno = cookie.split("&&")[1];
    return serviceno.split("$#%")
}

function checkIsLogin(){
    $.ajax({
        type:'GET',
        url :'/index/isLogin.action',
        success:function(res){
            if(res == 'false'){
                checkErpIsLogin();
            }else{
                $("#login").css("display","none");
                $("#logout").css("display","inline-block");
                $("#orderList").css("display","inline-block");
            }
            $(".nickname").html(getValueByCookieName('businessCollege_shopName'));
            $(".avatar").attr("src",getServiceNoLogoFromCookie());
        }
    })
}

function checkErpIsLogin(){
    $.ajax({
        type:'GET',
        async:false,
        url :'/index/isErpLogin.action',
        success:function(res){
            if(res == 'false'){
                $("#login").css("display","inline-block");
                $("#logout").css("display","none");
                $("#orderList").css("display","none");
            }else{
                $("#login").css("display","none");
                $("#logout").css("display","inline-block");
                $("#orderList").css("display","inline-block");
            }
        }
    })
}

/**
 * 校验输入的页码
 * @param toPage
 * @param totalPage
 */
function validPage(toPage, totalPage){
    if(toPage!=''){
        var r = /^\+?[1-9][0-9]*$/;
        if(!r.test(toPage)){
            alert("请输入大于0的整数！");
            return false;
        }
        else if(toPage*1>totalPage*1){
            alert("您输入的页数已超过范围！");
            return false;
        }
    }else{
        alert("请输入页数！");
        return false;
    }
    return true;
}
/**
 * 跳转页面
 * @param url
 */
function goToPage(url){
    var toPage = document.getElementsByName("toPage")[0].value;
    var totalPage = document.getElementsByName("totalPage")[0].value;

    if(toPage!=''){
        var r = /^\+?[1-9][0-9]*$/;
        if(!r.test(toPage)){
            alert("请输入大于0的整数！");
            document.getElementsByName("toPage")[0].value='';
            return;
        }
        else if(toPage*1>totalPage*1){
            alert("您输入的页数已超过范围！");
            document.getElementsByName("toPage")[0].value='';
            return;
        }
//        if(url.indexOf("?")>-1){
//            url += "&";
//        }else{
//            url += "?";
//        }
//        url += "currentPage="+toPage ;
//        window.location=url;
        var formId = event.target.parentNode.parentNode.getAttribute('data-form');
        $("#currentPage").val(toPage);
        document.getElementById(formId).submit();
    }
    else{
        alert("请输入页数！");
    }
}

function goToPageA(toPage,event){
    var formId;
    if(event.target.tagName == 'IMG'){
        formId = event.target.parentNode.parentNode.getAttribute('data-form');
    }else{
        formId = event.target.parentNode.getAttribute('data-form');
    }
    $("#currentPage").val(toPage);
    document.getElementById(formId).submit();
}

function initPagination(page,func,data){
    var $page = $(".pagination");
    if(page.totalCount==0){
        $page.html("<p class='empty_tips'>暂无数据</p>");
    }else{
        //显示分页
        $page.pagination(page.totalCount, {
            prev_text: '<img src="/static/images/arrow_left.png"/>',
            next_text: '<img src="/static/images/arrow_right.png"/>',
            items_per_page: page.pageSize, //每页显示10项
            current_page: data.currentPage-1,
            num_edge_entries: 2, //边缘页数
            num_display_entries: 2,//主体页数
            callback_flag: false,
            callback: function(current, obj){
                data.currentPage = current+1;
                func(data);
                return false;
            }
        });
    }
}
