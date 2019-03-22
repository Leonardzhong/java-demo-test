/**
 * Created with IntelliJ IDEA.
 * User: luyanbin
 * Date: 2016/3/7
 * Time: 16:12
 */

function weatherCode2Pic(weather){
    if(weather == null || ""==weather || undefined == weather) {
        return "icon1";
    }
    if("00"==(weather))//晴
        return "icon1";
    if("13"==(weather))//阵雪
        return "icon14";
    if("06"==(weather))//雨加雪
        return "icon15";
    if("14"==(weather))  //小雪
        return "icon15";
    if("15"==(weather))  //中雪
        return "icon16";
    if("16"==(weather)) //大雪
        return "icon17";
    if("04"==(weather) || "05"==(weather))//阵雨
        return "icon4";

    if("07"==(weather)) //小雨
        return "icon8";
    if("08"==(weather)) //中雨
        return "icon9";
    if("09"==(weather)) //大雨
        return "icon10";
    if("10"==(weather))  //暴雨
        return "icon12";

    if("01"==(weather))//多云
        return "icon2";
    if("02"==(weather))//阴
        return "icon3";
    if("18"==(weather)) //雾
        return "icon19";
    if("31"==(weather)) //沙尘暴
        return "icon21";
    if("19"==(weather))
        return "icon20";
    if("07"==(weather) || "08"==(weather) || "21"==(weather))//小雨，中雨
        return "icon22";
    if("09"==(weather) || "22"==(weather)) //大雨
        return "icon23";
    if("10"==(weather) || "23"==(weather)) //暴雨
        return "icon24";
    if("11"==(weather) || "12"==(weather) || "24"==(weather) || "25"==(weather)) //大暴雨，特大暴雨
        return "icon25";
    if("14"==(weather) || "15"==(weather) || "26"==(weather)) //小雪，中雪
        return "icon27";
    if("16"==(weather) || "27"==(weather)) //大雪
        return "icon28";
    if("17"==(weather)|| "28"==(weather) ) //暴雪
        return "icon29";
    if("29"==(weather))  //浮沉
        return "icon30";
    if("30"==(weather)) //扬沙
        return "icon31";
    if("53"==(weather)) //霾
        return "icon33";
    return "icon1";
}


function weatherCode2State(weather){
    if(weather == null || ""==(weather)) {
        return "晴";
    }
    if("00"==(weather))
        return "晴";
    if("01"==(weather))
        return "多云";
    if("02"==(weather))
        return "阴";
    if("03"==(weather))
        return "阵雨";
    if("04"==(weather))
        return "雷阵雨";
    if("05"==(weather))
        return "雷阵雨";
    if("06"==(weather))
        return "雨夹雪";
    if("07"==(weather))
        return "小雨";
    if("08"==(weather))
        return "中雨";
    if("09"==(weather))
        return "大雨";

    if("10"==(weather))
        return "暴雨";
    if("11"==(weather))
        return "大暴雨";
    if("12"==(weather))
        return "特大暴雨";
    if("13"==(weather))
        return "阵雪";
    if("14"==(weather))
        return "小雪";
    if("15"==(weather))
        return "中雪";
    if("16"==(weather))
        return "大雪";
    if("17"==(weather))
        return "暴雪";
    if("18"==(weather))
        return "雾";
    if("19"==(weather))
        return "冻雨";
    if("20"==(weather))
        return "沙尘暴";
    if("21"==(weather))
        return "小到中雨";
    if("22"==(weather))
        return "中到大雨";
    if("23"==(weather))
        return "大到暴雨";
    if("24"==(weather))
        return "大到暴雨";
    if("25"==(weather))
        return "大到暴雨";
    if("26"==(weather))
        return "小到中雪";
    if("27"==(weather))
        return "中到大雪";
    if("28"==(weather))
        return "大到暴雪";
    if("29"==(weather))
        return "浮沉";
    if("30"==(weather))
        return "扬沙";
    if("31"==(weather))
        return "强沙尘暴";
    if("53"==(weather))
        return "霾";
    return "晴";
}


function toWindNum(weather){
    if(weather == null || ""==(weather)) {
        return "微风";
    }
    if("0"==(weather))
        return "微风";
    if("1"==(weather))
        return "3-4级";
    if("2"==(weather))
        return "4-5级";
    if("3"==(weather))
        return "5-6级";
    if("4"==(weather))
        return "6-7级";
    if("5"==(weather))
        return "7-8级";
    return "微风";
}

function toWind( weather){
    if(weather == null || ""==(weather)) {
        return "";
    }

    if("0"==(weather))
        return "";
    if("1"==(weather))
        return "东北风";
    if("2"==(weather))
        return "东风";
    if("3"==(weather))
        return "东南风";
    if("4"==(weather))
        return "南风";
    if("5"==(weather))
        return "西南风";
    if("6"==(weather))
        return "西风";
    if("7"==(weather))
        return "西北风";
    if("8"==(weather))
        return "北风";
    if("9"==(weather))
        return "旋转风";
    return "";
}