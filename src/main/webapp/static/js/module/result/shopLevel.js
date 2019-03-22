$(document).ready(function(){
    controlInit.timeControl();
    initArea();
    $("#pageNo").keydown(function(e){
        if(e.keyCode == 13){//Enter键
            pageChangeEnter();
        }
    });
});

var pagenum = 0;

/**
 * 初始化区域
 */
function initArea() {
    $.ajax({
        url: '/erp/common/areaCascadeController/getUserUniqueArea',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                if(data.length>1){
                    data.splice(0,0,{"org_name":"全部","org_no":""});//增加全部选项 #
                }
                //添加option选项
                for(var i=0;i<data.length;i++){
                    $('#areaQ').append("<option value='"+data[i]['org_no']+"'>"+data[i]['org_name']+"</option>");
                }
                changeAera(null,1);
            }
        },
        error: function (data) {
            alert("获取区域信息失败!");
        }
    });
}

/**
 *
 * @param areaNo
 */
function changeAera(areaNo,temp) {
    if(areaNo==null||areaNo==undefined){
        areaNo = $('#areaQ').val();
    }
    $('#operateCenterQ').empty();
    if (areaNo.length == 0) {
        //区域选择的是全部
        var data = [{"distribute_name": "全部", "distribute_no": ""}];
        //添加option选项
        for(var i=0;i<data.length;i++){
            $('#operateCenterQ').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
        }
        if(temp==1){
            //初始化table
            initDataTable();
        }

    } else {
        $.ajax({
            url: '/erp/common/areaCascadeController/getOperateCenter',
            data: 'areaNo=' + areaNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                operateCenterNo = '';
                if (data.length > 0) {
                    if ($("#operateCenterQ").length > 0) {//控件是否存在
                        if (data.length > 0) {
                            if(data.length > 1){
                                data.splice(0, 0, {"distribute_name": "全部", "distribute_no": ""});//增加全部选项 -1
                            }
                            //添加option选项
                            for(var i=0;i<data.length;i++){
                                $('#operateCenterQ').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
                            }
                            if(temp==1){
                                //初始化table
                                initDataTable();
                            }
                        }

                    }
                }
            },
            error: function (data) {
                alert("获取运营中心信息失败!");
            }
        });
    }
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
        columns : [
            {//序号
                "searchable": false,
                "orderable": false,
                data : "order"
            },
            {//区域
                "searchable": false,
                "orderable": false,
                data: "orgName"
            },
            {//运营中心
                "searchable": false,
                "orderable": false,
                data: "distributeName"
            },
            {//门店名称
                "searchable": false,
                "orderable": false,
                data: "shopName"
            },
            {//门店编号
                "searchable": false,
                "orderable": false,
                data: "shopNo"
            },
            {//评比月份
                "searchable": false,
                "orderable": false,
                data: "statMonth"
            },
            {//门店等级
                "searchable": false,
                "orderable": false,
                data: "shopLevel"
            }
        ],
        "aoColumnDefs": [{"bSortable": false, "aTargets": [0]}],
        ajax : {
            "url" : "/erp/ShopLevelController/getLevels",
            "method": "POST",
            "data" : function(){
                return {
                    "orgNo":$('#areaQ').val(),
                    "distributeNo":$('#operateCenterQ').val(),
                    "shopName":$('#storeNameQ').val(),
                    "shopNo":$('#storeNoQ').val(),
                    "shopLevel":$('#shopLevelQ').val(),
                    "statMonth":$('#statMonthQ').val(),
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
                $('#pageTotal').empty()
                $('#pageTotal').append(totalPage) ;
            }
        }
    });
};

/**
 * 操作相关
 */
function query(){
    $("#resultGrid").DataTable().ajax.reload();
}

/**
 * 时间控件
 * @type {{timeControl: Function}}
 */
var controlInit = {
    "timeControl" : function() {
        $("#statMonthQ").datetimepicker({
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