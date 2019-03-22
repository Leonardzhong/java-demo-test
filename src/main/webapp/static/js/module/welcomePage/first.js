/**
 * Created with IntelliJ IDEA.
 * User: luyanbin
 * Date: 2016/3/7
 * Time: 14:38
 */
//初始化方法
$(document).ready(function() {

    initPic();
    initLinks();
    initWeather('101010100');

    jQuery.each(weatherArea.citycode, function () {
        jQuery("#s_1").append("<option value='" + this.s1 + "'>" + this.s1 + "</option>");
        if (this.s1 == '北京') {
            jQuery.each(this.s2, function () {
                jQuery("#s_2").append("<option value='" + this.code + "'>" + this.name + "</option>");
            });
        }
    });

    jQuery("#s_1").bind("change", function () {
        var sq = jQuery("#s_1").find("option:selected").text();
        jQuery("#s_2").html("");
        jQuery.each(weatherArea.citycode, function () {
            if (this.s1 == sq) {
                jQuery.each(this.s2, function () {
                    jQuery("#s_2").append("<option value='" + this.code + "'>" + this.name + "</option>");
                });
            }
        });
    });
});

function initWeather(city){
    var params = {
         loginPin:$("#loginUser").val(),
        'cityCode':city
    };
    $.ajax({
        type:"GET",
        url:"/erp/homeManageController/getWeatherReport",
        data:params,
        dataType:"json",
        success:function(data){
            inPutWeather(data);
        }
    });
}


function inPutWeather(data){
    $('#city').html(data.c.c3);
    if(data.f.f1[0].fc){
        $("#temperatureToday").html(data.f.f1[0].fc+'℃~'+data.f.f1[0].fd+'℃');//今日气温
    }else{
        $("#temperatureToday").html(data.f.f1[0].fd+'℃');//今日晚间气温
    }
    $('#weatherToday').addClass('w-icon w-'+weatherCode2Pic(data.f.f1[0].fa));//今日天气图片
    $('#weatherStateToday').html(weatherCode2State(data.f.f1[0].fa));//今日天气文字
    $('#weatherWindToday').html(toWind(data.f.f1[0].fe)+toWindNum(data.f.f1[0].fg));//今日 风+风等级
    $('#weathertable').empty();
    for(var i=1;i<data.f.f1.length;i++){
        var tr= $("<tr style='border-bottom: solid 1px'></tr>");
        var tr1= $("<tr ></tr>");
        var td0 = $("<td colspan='2'></td>")
        var td1 = $("<td ></td>")
        var td2 = $("<td></td>")
        td0.append("<div style='font-size: 18px'>"+GetDateStr(i)+"</div>");
        td1.append("<div class='box-warp'><div class='weather-con'><div class='ws-icon ws-"+weatherCode2Pic(data.f.f1[i].fa)+"' style='position: inherit;margin: 0px'></div></div></div>");
        td2.append("<div style='font-size: 17px'>"+data.f.f1[i].fc+"℃~"+data.f.f1[i].fd+"℃</div>");
        tr1.append(td0);
        tr.append(td1);
        tr.append(td2);
        $('#weathertable').append(tr1);
        $('#weathertable').append(tr);
    }
    weatherback();
}


function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
    var m = dd.getMonth()+1;//获取当前月份的日期
    var d = dd.getDate();
    var y = dd.getFullYear();
    return y+"-"+m+"-"+d;
}

function weathereditinit(){
    jQuery("#weatherDiv").hide();
    jQuery("#w_edit").show();
}

function weatherback() {
    jQuery("#weatherDiv").show();
    jQuery("#w_edit").hide();
}

function weatherAreaChange(){
    var s2s = jQuery("#s_2").val();
    if (s2s == '') {
        return;
    }
    var params = {
        loginPin:$("#loginUser").val(),
        cityCode : s2s
    };

    $.ajax({
        type:"POST",
        url:"/erp/homeManageController/setWeatherCode",
        data:params,
        dataType:"json",
        success:function(data){
            initWeather(s2s);
        }
    });
    //initWeather(s2s);

}

/**
 * 初始化轮播图
 */
function initPic(){
    $.ajax({
        type:"POST",
        url:"/erp/homeManageController/getActivity",
        data:{},
        dataType:"json",
        success:function(data){
            jQuery.each(data, function () {
                $('#pic_ul').append('<li class="slide-item" data-ui="slide-item" style="float: left;"><a href="' + this.adv_href + '" target="_blank"><img src="'+this.pic_url+'" alt=""></a></li>');
                $('#pic_slide').append('<span data-ui="slide-nav"></span>');
            });

            seajs.use(['virtuals/popui/js/slide'], function() {
                $('#slide').slide({
                    visible: 1,
                    auto: true,
                    stay: 8000,
                    direction: 'x',
                    navEvent: 'mouseenter'
                })
                $('#slide2').slide({
                    visible: 1,
                    auto: false,
                    direction: 'x',
                    navEvent: 'click'
                })
            })
        }
    });

}


/**
 * 初始化友情链接
 */
function initLinks(){
    $.ajax({
        type:"POST",
        url:"/erp/homeManageController/getLinks",
        data:{},
        dataType:"json",
        success:function(data){
            $('#linksDiv').empty();
            jQuery.each(data, function () {
                $('#linksDiv').append('<a href="'+this.address+'" target="_blank">'+this.title+'</a>');
            });
        }
    });

}


