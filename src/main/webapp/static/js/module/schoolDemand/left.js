/**
 * Created with IntelliJ IDEA.
 * User: zhaoyiqing1
 * Date: 15-1-29
 * Time: 下午6:02
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created by qiaoshuyi on 2014/11/24.
 */
$(function(){

    var jmMenu ={
        0: [{
            href: "",
            text: "全部课程分类"
        }],
        1: [{
            href: "/index.html",
            text: "首页"
        }],
        2: [{
            href: "/ondemandCourse/queryOndemandCoursePage.action",
            text: "点播课堂"
        }],
        3: [{
            href: "/schoolLive/liveCourseList",
            text: "直播课堂"
        }],
        4: [{
            href:"",
            text:'商家论坛'
        }],
        5: [{
            href:"/offlineCourse/getOfflineCourseList.action",
            text:'线下课程'
        }]
    };

    //导航高亮
    var url = location.href, search = location.search, host = location.host;
    if(search.length > 0){//去掉查询条件
        url = url.substring(0,url.indexOf(search));
    }

    $('.menu_item').removeClass('selected');
    for(var key in jmMenu){
        var value = jmMenu[key];
        for(var j=0,len=value.length; j<len; j++ ){
            var href = '//'+host + value[j].href;
            if(url == href){
                $('.menu_item[data-index='+key+']').addClass('selected');
                break;
            }
        }
    }

});