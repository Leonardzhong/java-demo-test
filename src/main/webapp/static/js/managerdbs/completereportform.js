$(document).ready(function(){
    controlInit.timeControl();
    controlInit_1.timeControl();
    $("#MYRFBtn").bind("click",monthlyReportData);
    $("#MRFBtn").bind("click",monthReportData);
});

function monthlyReportData(){
    var data={
        endMonth:$("#endMonthlyQ").val(),
        startMonth:$("#startMonthlyQ").val()
    }

    if(data.endMonth == null || data.startMonth  == null || data.endMonth == '' || data.startMonth  == ''){
        alert("日期不能为空")
        return;
    }

    if(data.endMonth < data.startMonth){
        alert("开始日期不能大于结束日期");
        return;
    }

    jQuery.ajax({
        type: "POST",
        url: "/erp/completereportform/monthlyreportform",
        dataType: "json",
        data:data,
        success: function (data) {
            alert(data.msg);
        }
    });
}

function monthReportData(){
    var data={
        endDate:$("#endMonthQ").val(),
        startDate:$("#startMonthQ").val()
    }

    if(data.endDate == null || data.startDate  == null || data.endDate == '' || data.startDate  == ''){
        alert("日期不能为空")
        return;
    }

    if(data.endDate < data.startDate){
        alert("开始日期不能大于结束日期");
        return;
    }

    jQuery.ajax({
        type: "POST",
        url: "/erp/completereportform/monthreportform",
        dataType: "json",
        data:data,
        success: function (data) {
            alert(data.msg);
        }
    });
}
/**
 * 时间控件
 * @type {{timeControl: Function}}
 */
var controlInit = {
    "timeControl" : function() {
        $("#startMonthlyQ").datetimepicker({
            language: 'zh-CN',
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true,
            format: 'yyyy-mm',
            startView: 3,
            minView: 3,
            forceParse: false,
            weekStart: 1
        });

        $("#endMonthlyQ").datetimepicker({
            language: 'zh-CN',
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true,
            format: 'yyyy-mm',
            startView: 3,
            minView: 3,
            forceParse: false,
            weekStart: 1
        });
    }
}

var controlInit_1 = {
    "timeControl": function () {
        $("#startMonthQ").datetimepicker({
            language: 'zh-CN',
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true,
            format: 'yyyy-mm-dd',
            startView: 2,
            minView: 2,
            forceParse: false
        });


        $("#endMonthQ").datetimepicker({
            language: 'zh-CN',
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true,
            format: 'yyyy-mm-dd',
            startView: 2,
            minView: 2,
            forceParse: false
        });
    }
}