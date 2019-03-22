$(document).ready(function(){
    controlInit.timeControl();
    initArea();
    $("#pageNo").keydown(function(e){
        if(e.keyCode == 13){//Enter键
            pageChangeEnter();
        }
    });
    initDataTable();
});

var pagenum = 0;

/**
 * 初始化区域
 */
function initArea() {
    $.ajax({
        url: '/erp/schoolLiveRecordController/getRegionList',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                if(data.length>1){
                    $('#regionNoQ').append("<option value=''>全部</option>");
                }
                //添加option选项
                for(var i=0;i<data.length;i++){
                    $('#regionNoQ').append("<option value='"+data[i]['regionNo']+"'>"+data[i]['regionName']+"</option>");
                }
            }
        },
        error: function (data) {
            alert("获取区域信息失败!");
        }
    });
}


var initDataTable = function(){
    "use strict";
    $("#resultGrid").on('xhr.dt', function ( e, settings, json, xhr ) {
        //分页
        $('.footerInfo').empty();
        if (json) {
            $('.footerInfo').append("当前显示从 " + (pagenum * parseInt($('#pageRange').val())+1) + " 到 " + (pagenum * parseInt($('#pageRange').val())+parseInt($('#pageRange').val())) + " 条记录,所有记录共" + json.totalCount + "条");
            var totalPage = Math.floor(json.totalCount/settings._iDisplayLength);
            if(json.totalCount%settings._iDisplayLength > 0){
                parseInt(totalPage++);
            }
            $('#pageTotal').empty();
            $('#pageTotal').append(totalPage) ;
        }
    }).DataTable({
        "dom": '<"toolbar"<"row"<"col-md-6"<"btnPlace">>>>rt',//页面布局
        iDisplayLength: $('#pageRange').val(),//每页记录数
        showRowNumber:true,
        "scrollX": true,//有滚动条
        columns : [
            {
                "searchable": false,
                "orderable": false,
                "width": 50,
                data : "userPin"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "regionName"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "shopName"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "liveCourse"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "courseTeacher"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "timePerViewer"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "joinTime",
                render:function(data,type,row,meta){
                    if(data!=null){
                        return formatDate(data);
                    }else{
                        return data;
                    }
                }
            },
            {
                "searchable": false,
                "orderable": false,
                data: "leaveTime",
                render:function(data,type,row,meta){
                    if(data!=null){
                        return formatDate(data);
                    }else{
                        return data;
                    }


                }
            }
        ],
        "aoColumnDefs": [{"bSortable": false, "aTargets": [0]}],
        ajax : {
            "url" : "/erp/schoolLiveRecordController/getSchoolLiveRecordList",
            "method": "POST",
            "data" : function(){
                return {
                    "userPin":$('#userPinQ').val(),
                    "regionNo":$('#regionNoQ').val(),
                    "courseTeacher":$('#courseTeacherQ').val(),
                    "liveCourse":$('#liveCourseQ').val(),
                    "startDate":$('#startDateQ').val(),
                    "endDate":$('#endDateQ').val(),
                    "size":$('#pageRange').val(),
                    "skip":pagenum*$('#pageRange').val()
                }
            },
            "language" : {
                "sProcessing":   "处理中...",
                "sLengthMenu":   "显示 _MENU_ 项结果",
                "sZeroRecords":  "没有匹配结果",
                "sInfo":         "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                "sInfoEmpty":    "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix":  "",
                "sSearch":       "",
                "sUrl":          "",
                "sEmptyTable":     "表中数据为空",
                "sLoadingRecords": 'Loading...',
                "sInfoThousands":  ",",
                "oPaginate": {
                    "sFirst":    "首页",
                    "sPrevious": "上页",
                    "sNext":     "下页",
                    "sLast":     "末页"
                },
                "oAria": {
                    "sSortAscending":  ": 以升序排列此列",
                    "sSortDescending": ": 以降序排列此列"
                }
            },
            "dataSrc": "resultList"
        },
        fnCreatedRow: function (nRow, aData,iDisplayIndex) {//创建行时执行
            $(nRow).addClass("table-row");
        },
        "initComplete": function (settings, json) {//初始化结束后执行
            $('.footerInfo').empty();
            if (json) {
                $('.footerInfo').append("当前显示从 " + parseInt(parseInt(settings._iDisplayStart) + 1) + " 到 " + settings._iDisplayLength + " 条记录,所有记录共" + json.totalCount + "条");

                var totalPage = Math.floor(json.totalCount/settings._iDisplayLength);
                //totalPage = parseInt(json.totalCount)/parseInt($('#pageRange').val()));
                if(json.totalCount%settings._iDisplayLength > 0){
                    parseInt(totalPage++);
                }
                $('#pageTotal').empty();
                $('#pageTotal').append(totalPage) ;
            }
        }
    });
};

/**
 * 操作相关
 */

//查询
function query(){
    pagenum = 0;
    $("#resultGrid").DataTable().ajax.reload();
}

//打开导出确认窗口
function openExportConfirm(){
    $("#exportConfirmModal").modal('show');
}

//导出excel
function exportExcel(){
    $("#exportConfirmModal").modal('hide');

    exportLimit();//提交表单
}

/**
 * 导出限制条数
 */
function exportLimit(){
    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        url: "/erp/schoolLiveRecordController/exportLimit",
        data: {
            "userPin":$('#userPinQ').val(),
            "regionNo":$('#regionNoQ').val(),
            "courseTeacher":$('#courseTeacherQ').val(),
            "liveCourse":$('#liveCourseQ').val(),
            "startDate":$('#startDateQ').val(),
            "endDate":$('#endDateQ').val()

        },
        success:function (data) {
            if(data.success){
                //初始化参数
                $("#regionNo").val($('#regionNoQ').val());
                $("#userPin").val($('#userPinQ').val());
                $("#courseTeacher").val($('#courseTeacherQ').val());
                $("#liveCourse").val($('#liveCourseQ').val());
                $("#startDate").val($('#startDateQ').val());
                $("#endDate").val($('#endDateQ').val());

                $("#exportForm").submit();//提交表单
            }else{
                alert(data.exceptionMsg);
            }
        },
        error : function(data){
            alert("导出数据失败");
        }
    });
}

/**
 * 时间控件
 * @type {{timeControl: Function}}
 */
var controlInit = {

    "timeControl" : function() {

        $("#startDateQ,#endDateQ").datetimepicker({
            format: 'yyyy-mm-dd',
            minView : 'month',
            startView: 'month',
            language:'zh-CN',
            //todayHighlight : true,
            autoclose : true
        });
    }
};

function formatDate(od){
    var objDate = new Date(od);
    var year=objDate.getFullYear();   //四位数字年
    var month=objDate.getMonth()+1;   //getMonth()返回的月份是从0开始的，还要加1
    var date=objDate.getDate();
    var hours=objDate.getHours();
    var minutes=objDate.getMinutes();
    var seconds=objDate.getSeconds();

    var result = year+"-";
    if(parseInt(month)<10){
        result = result+"0"+month;
    }else{
        result = result+month;
    }
   result = result+"-";
    if(parseInt(date)<10){
        result = result+"0"+date;
    }else{
        result = result+date;
    }
    result = result+" ";
    if(parseInt(hours)<10){
        result = result+"0"+hours;
    }else{
        result = result+hours;
    }
    result = result+":";
    if(parseInt(minutes)<10){
        result = result+"0"+minutes;
    }else{
        result = result+minutes;
    }
    result = result+":";
    if(parseInt(seconds)<10){
        result = result+"0"+seconds;
    }else{
        result = result+seconds;
    }

    return result;
}

