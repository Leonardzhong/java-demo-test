var intDiff = 0;
$(document).ready(function () {
    $.ajax({
        type:'POST',
        url :'/school/queryLiveCourseTimeDown',
        async: false,
        dataType:'json',
        success:function(res){
            if(res != null){
                if( res.recentLive != null && res.recentLive != ""){
                    var datetime = new Date(parseInt(res.recentLive.startTime));
                    var year = datetime.getFullYear();
                    var month = fillZero(datetime.getMonth());
                    var day = fillZero(datetime.getDate());

                    var hour =fillZero(datetime.getHours());
                    var min = fillZero(datetime.getMinutes());

                    var start_time = year+"-"+month+"-"+day+" "+hour+":"+min;
                    $("#studyUrl").attr("href", res.recentLive.studyUrl);
                    $("#studyUrl").html(res.recentLive.courseName);
                    $("#studyUrl").attr("title", res.recentLive.courseName)
                    $("#ctime").html(start_time);
                    $("#cteacher").html(res.recentLive.teacherName);
                    $("#cdesc").html(res.recentLive.courseDesc);
                    $("#cunits").html(res.recentLive.source);
                }

                if(res.activity != null && res.activity != ""){
                    loadActivityData(res.activity);
                }

                initslider();
                startTimeDown(res.startTime, res.nowTime);
            }
        }
    });
});

function loadActivityData(data){
    for (var i = 0; i < data.length; i++){
        var html =
            "<li class='aimg_bg'>"+
            "<div class='aimg content'> "+
            "<a href='"+data[i].adv_href+"' target='_blank'>"+
            "<img src='"+data[i].pic_url+"' draggable='false'>"+
            "</a></div></li>";

        $("#slides").append(html);
    }
}

function fillZero(v){
    if(v<10){v='0'+v;}
    return v;
}

function initslider(){
    $('.flexslider').flexslider({
        animation: "fade",
        itemWidth:630,
        maxItems:1,
        slideshow: true,
        animationLoop: true,
        slideshowSpeed: 1000,
        animationSpeed: 3000,
        directionNav:false,
        pauseOnAction: false,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
        pauseOnHover: true
    });
}

function startTimeDown(endTime,severTime){
    var nowtime =  severTime;
    var d1 =   $('.d1');
    var d2 =   $('.d2');
    var h1 =   $('.h1');
    var h2 =   $('.h2');
    var m1 =   $('.m1');
    var m2 =   $('.m2');
    var s1 =   $('.s1');
    var s2 =   $('.s2');

    function GetRTime(){
        nowtime = nowtime + 100;
        var t =endTime - nowtime;
        var d=0;
        var h=0;
        var m=0;
        var s=0;
        if(t < 0){
            clearInterval(GetRTime);
            return;
        }
        if(t>=0){
            d=checkTime( parseInt(t / 1000 / 60 / 60 / 24, 10));
            h=checkTime(parseInt(t / 1000 / 60 / 60 % 24, 10));
            m=checkTime(parseInt(t / 1000 / 60 % 60, 10));
            s=checkTime(parseInt(t / 1000 % 60, 10));
        }
        if(d[0]=='0'&&d[1]=='0'){
            $('.timedown').addClass('noDay');
        }else{
            $('.timedown').removeClass('noDay');
            d1.text(d[0]);
            d2.html(d[1]+'<div>天</div>');
        }

        h1.text(h[0]);
        h2.text(h[1]);
        m1.text(m[0]);
        m2.text(m[1]);
        s1.text(s[0]);
        s2.text(s[1]);
    }
    function checkTime(i)
    {
        if (i < 10) {
            //return ['0',i.toString()]
            i = "0" + i.toString();
        }
        return [i.toString().substr(0,1),i.toString().substr(1,1)];
    }
    GetRTime();
    setInterval(GetRTime,100);
}