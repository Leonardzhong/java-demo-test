$(document).ready(function(){
    initDataTable();
    validateDef.insertFormValidator();
    validateDef.modifyFormValidator();

    $('#pageNo').keydown(function(e){
        if(e.keyCode==13){
            pageChangeEnter();
        }
    });
});

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
            {//排名类型
                "searchable": false,
                "orderable": false,
                data: "rankTypeName"
            },
            {//类型编号
                "searchable": false,
                "orderable": false,
                data: "rankTypeCode"
            },
            {//考核维度
                "searchable": false,
                "orderable": false,
                data: "assessDimensionName"
            },
            {//指标名称
                "searchable": false,
                "orderable": false,
                data: "indicatorName"
            },
            {//指标编号
                "searchable": false,
                "orderable": false,
                data: "indicatorCode"
            },
            {//权重
                "searchable": false,
                "orderable": false,
                data: "weight",
                render:function(data,type,row,meta){
                    return data+'%';
                }
            },
            {//门槛值
                "searchable": false,
                "orderable": false,
                data: "threshold",
                render:function(data,type,row,meta){
                    if(row.indicatorCode != '3'){//安装满意度不加%
                        return data+'%';
                    }else{
                        return data;
                    }
                }
            },
            {//目标值
                "searchable": false,
                "orderable": false,
                data: "targetValue",
                render:function(data,type,row,meta){//安装满意度不加%
                    if(row.indicatorCode != '3'){
                        return data+'%';
                    }else{
                        return data;
                    }
                }
            },
            {//挑战值
                "searchable": false,
                "orderable": false,
                data: "challengeValue",
                render:function(data,type,row,meta){//安装满意度不加%
                    if(row.indicatorCode != '3'){
                        return data+'%';
                    }else{
                        return data;
                    }
                }
            },
            {//操作-更新、删除
                data : null,
                "sWidth": "60px",
                "searchable": false,
                "orderable": false,
                "bSort":false,
                render : function(data, type, row) {
                    var result = '';
                    result = result + '<a href="javascript:openUpdateWindow(\''+row.id +'\');">修改</a>　';
                    result = result + '<a href="javascript:openDeleteConfirmWindow(\''+row.id+'\',\''+row.encodeId+'\');">删除</a>';
                    return result;
                }
            }
        ],
        "aoColumnDefs": [{"bSortable": false, "aTargets": [0]}],
        ajax : {
            "url" : "/erp/AssessmentRuleController/queryRulesPaginate",
            "method": "POST",
            "data" : function(){
                return {
                    "rankTypeCode":$('#rankTypeQ').val(),
                    "assessDimensionCode":$('#assessDimensionQ').val(),
                    "indicatorCode":$('#indicatorNameQ').val(),
                    "isDelete":"0",
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

//查询
function query(){
    pagenum = 0;
    $("#resultGrid").DataTable().ajax.reload();
}

//新增
function openInsertPage(){
    $("#insertMode").modal('show');
    $("#insertForm")[0].reset();
}

function insertBtn(){
    if(!$("#insertForm").valid()){
        return false;
    }
    $.ajax({
        url:"/erp/AssessmentRuleController/saveRule",
        type:"POST",
        dataType:"json",
        timeout:30*1000,
        data: {
            "rankTypeCode":$('#rankTypeI').val(),
            "rankTypeName":$('#rankTypeI option:selected').text(),
            "assessDimensionCode":$('#assessDimensionI').val(),
            "assessDimensionName":$('#assessDimensionI option:selected').text(),
            "indicatorCode":$('#indicatorNameI').val(),
            "indicatorName":$('#indicatorNameI option:selected').text(),
            "weight":$('#weightI').val(),
            "threshold":$('#thresholdI').val(),
            "targetValue":$('#targetValueI').val(),
            "challengeValue":$('#challengeValueI').val()
        },
        success: function (data) {
            if(data.success){
                $("#cancelBtnI").click();
                query();
            }else{
                alert(data.exceptionMsg);
            }
        },
        error : function(data){
            alert("新增数据失败");
        }
    });
}

//修改
function openUpdateWindow(id){

    $('#updateMode').modal('show');
    //$("#updateForm")[0].reset();

    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        timeout:30*1000,
        url: "/erp/AssessmentRuleController/getRuleById",
        data: {
            id: id
        },
        success:function (data) {
            $('#idM').val(data.id);
            $('#rankTypeM').val(data.rankTypeName);
            $('#assessDimensionM').val(data.assessDimensionName);
            $('#indicatorNameM').val(data.indicatorName);
            $('#weightM').val(data.weight);
            $('#thresholdM').val(data.threshold);
            $('#targetValueM').val(data.targetValue);
            $('#challengeValueM').val(data.challengeValue);
        },
        error : function(data){
            alert("获取数据失败");
        }
    });
}

function saveBtn(){
    if(!$("#upateForm").valid()){
        return false;
    }
    $.ajax({
        url:"/erp/AssessmentRuleController/updateRule",
        type:"POST",
        dataType:"json",
        timeout:30*1000,
        data: {
            "id":$('#idM').val(),
            "weight":$('#weightM').val(),
            "threshold":$('#thresholdM').val(),
            "targetValue":$('#targetValueM').val(),
            "challengeValue":$('#challengeValueM').val()
        },
        success: function (data) {
            if(data.success){
                $("#cancelM").click();
                query();
            }else{
                alert(data.exceptionMsg);
            }
        },
        error : function(data){
            alert("更新数据失败");
        }
    });
}

//删除
function openDeleteConfirmWindow(id,encodeId){
    $("#deleteConfirmModal").modal('show');
    $("#deleteIdHidden").val(id);
    $("#deleteEncodeIdHidden").val(encodeId);
}

function deleteByPrimaryKey(){
    $("#deleteConfirmModal").modal('hide');
    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        timeout:30*1000,
        url: "/erp/AssessmentRuleController/deleteRuleById",
        data: {
            id: $("#deleteIdHidden").val(),
            encodeId: $("#deleteEncodeIdHidden").val()
        },
        success:function (data) {
            if(data.success){
                query();
            }else{
                alert(data.exceptionMsg);
            }
        },
        error : function(data){
            alert("删除数据失败");
        }
    });
}

//新增和修改页面表单校验
var validateDef = {
    insertFormValidator:function(){
        $("#insertForm").validate({
            rules:{
                rankTypeI:"required",
                assessDimensionI:"required",
                indicatorNameI:"required",
                weightI:{
                    required:true,
                    number:true,
                    range:[0,100]
                },
                thresholdI:{
                    required:true,
                    number:true
                },
                targetValueI:{
                    required:true,
                    number:true
                },
                challengeValueI:{
                    required:true,
                    number:true
                }
            },
            messages:{
                rankTypeI:"请选择排名类型！",
                assessDimensionI:"请选择考核维度！",
                indicatorNameI:"请选择指标名称！",
                weightI:{
                    required:"请录入权重!",
                    number:"权重必须录入数字!",
                    range:"权重必须为0-100之前的数字!"
                },
                thresholdI:{
                    required:"请录入门槛值！",
                    number:"门槛值必须录入数字!"
                },
                targetValueI:{
                    required:"请录目标值！",
                    number:"目标值必须录入数字!"
                },
                challengeValueI:{
                    required:"请录入挑战值！",
                    number:"挑战值必须录入数字!"
                }
            },
            errorPlacement: function (error, element) {
                var isDuplicate = false;
                $.each($('.alertInsertValidate label'), function (_index, _obj) {
                    if (error[0].id == $(_obj).attr("id")) {
                        isDuplicate = true;
                    }
                })
                if (!isDuplicate) {
                    error.appendTo($(".alertInsertValidate"));
                }
            },
            success: function (label) {
                $.each($('.alertInsertValidate label'), function (_index, _obj) {
                    if ($(label).attr("id") == $(_obj).attr("id")) {
                        $(_obj).remove();
                    }
                });
            },
            errorContainer: ".alertModifyValidate",
            errorLabelContainer: $("#insertForm .alertInsertValidate")
        });
    },
    modifyFormValidator:function(){
        $("#upateForm").validate({
            rules:{
                weightM:{
                    required:true,
                    number:true,
                    range:[0,100]
                },
                thresholdM:{
                    required:true,
                    number:true
                },
                targetValueM:{
                    required:true,
                    number:true
                },
                challengeValueM:{
                    required:true,
                    number:true
                }
            },
            messages:{
                weightM:{
                    required:"请录入权重!",
                    number:"权重必须录入数字!",
                    range:"权重必须为0-100之前的数字!"
                },
                thresholdM:{
                    required:"请录入门槛值！",
                    number:"门槛值必须录入数字!"
                },
                targetValueM:{
                    required:"请录目标值！",
                    number:"目标值必须录入数字!"
                },
                challengeValueM:{
                    required:"请录入挑战值！",
                    number:"挑战值必须录入数字!"
                }
            },
            errorPlacement: function (error, element) {
                var isDuplicate = false;
                $.each($('.alertModifyValidate label'), function (_index, _obj) {
                    if (error[0].id == $(_obj).attr("id")) {
                        isDuplicate = true;
                    }
                })
                if (!isDuplicate) {
                    error.appendTo($(".alertModifyValidate"));
                }
            },
            success: function (label) {
                $.each($('.alertModifyValidate label'), function (_index, _obj) {
                    if ($(label).attr("id") == $(_obj).attr("id")) {
                        $(_obj).remove();
                    }
                });
            },
            errorContainer: ".alertModifyValidate",
            errorLabelContainer: $("#upateForm .alertModifyValidate")
        });
    }
}