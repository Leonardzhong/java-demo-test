//初始化方法
$(document).ready(function () {
    //初始化区域
    initArea();
    initManager();
    initShopName();

    initShopNameNew();
    // 日期，只选择年
    $("#tYear").datetimepicker({
        format: 'yyyy',
        minView : '4',
        startView: '4',
        language:'zh-CN',
        autoclose : true,
        todayHighlight : true
    });

    $('#pageNo').keydown(function(e){
        if(e.keyCode==13){
           pageChangeEnter();
        }
    });
});

function initShopName(){
    //远程数据源
    var remote_cities = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('siteName'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // 在文本框输入字符时才发起请求
        remote: {
            url: '/erp/ShopAssessmentController/querySiteBaseInfo?shopName=%QUERY',
            wildcard: '%QUERY'
        }
    });
    $('#storeName').typeahead({
            hint: true,
            highlight: true,
            delay: 3000,
            minLength: 1
        },
        {
            name: 'siteBaseInfos',
            displayKey: 'siteName',
            source: remote_cities.ttAdapter()
        });
    $('#storeName').bind('typeahead:select', function(ev, suggestion) {
        //$('#addShopName').val(null);
        //$('#addShopName').val(suggestion.siteName);
        $("#storeId").val(suggestion.siteNo);
    });
}

/**
 * 初始化-查询条件-管家下拉列表
 */
function initManager(){
    $.ajax({
        url: '/erp/ShopAssessmentController/queryListManagers',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                if(data.length>1){
                    data.splice(0,0,{"userName":"全部","userNo":"all"});//增加全部选项 #
                }
                //添加option选项
                for(var i=0;i<data.length;i++){
                    $('#managerCenter').append("<option value='"+data[i]['userNo']+"'>"+data[i]['userName']+"</option>");
                }
            }
        },
        error: function (data) {
            alert("获取管家信息失败!");
        }
    });
}

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
                    data.splice(0,0,{"org_name":"全部","org_no":"all"});//增加全部选项 #
                }
                //添加option选项
                for(var i=0;i<data.length;i++){
                    $('#area').append("<option value='"+data[i]['org_no']+"'>"+data[i]['org_name']+"</option>");
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
        areaNo = $('#area').val();
    }
    $('#operateCenter').empty();
    if (areaNo == 'all') {
        //区域选择的是全部
        var data = [{"distribute_name": "全部", "distribute_no": "all"}];
        //添加option选项
        for(var i=0;i<data.length;i++){
            $('#operateCenter').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
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
                    if ($("#operateCenter").length > 0) {//控件是否存在
                        if (data.length > 0) {
                            if(data.length > 1){
                                data.splice(0, 0, {"distribute_name": "全部", "distribute_no": "all"});//增加全部选项 all
                            }
                            //$('#operateCenter').combobox('loadData', data);
                            //$('#operateCenter').combobox('select',  data[0].distribute_no); //默认选中全部
                            //添加option选项
                            for(var i=0;i<data.length;i++){
                                $('#operateCenter').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
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

function query(){
    pagenum = 0;
    var shop_name_back = $("#storeName").val();
    if(shop_name_back==null || shop_name_back=='' ||
        shop_name_back==undefined || shop_name_back== ' '){
        $("#storeId").val(null);
    }
    $("#resultGrid").DataTable().ajax.reload();
}

var initDataTable = function() {
    "use strict";
    var t = $("#resultGrid").on('xhr.dt', function ( e, settings, json, xhr ) {
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
    } ).DataTable({
        "dom": '<"toolbar"<"row"<"col-md-6"<"btnPlace">>>>rt',
        iDisplayLength: $('#pageRange').val(),
        showRowNumber:true,
        columns : [
            {
                 data : "id",
                "searchable": false,
                "orderable": false
            },
            {
                data : "idByMd5Encode",
                "searchable": false,
                "orderable": false,
                "visible": false
            },
            {
                "searchable": false,
                "orderable": false,
                data: "orgName",
                render : function(data, type, row) {
                    if(data!=null&&data!=undefined&&data!='#'&&data!=''){
                        return data;
                    }else{
                        return "全部"
                    }
                }
            },
            {
                "searchable": false,
                "orderable": false,
                data: "distributeName",
                render : function(data, type, row) {
                    if(data!=null&&data!=undefined&&data!='#'&&data!=''){
                        return data;
                    }else{
                        return ""
                    }
                }

            },
            {
                "searchable": false,
                "orderable": false,
                data: "managerName"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "shopName"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "tType",
                render : function(data, type, row) {
                    if(data!=null&&data!=undefined&&data!='#'){
                        if(data == 0){
                            return '区域';
                        }else if(data == 1){
                            return '中心';
                        }else if(data == 2){
                            return '管家';
                        }else{
                            return '京东帮';
                        }
                    }else{
                        return ""
                    }
                }
            },
            {
                "searchable": false,
                "orderable": false,
                data: "tIndex",
                render : function(data, type, row) {
                    if(data!=null&&data!=undefined&&data!='#'){
                        if(data == '0'){
                            return '单量';
                        }else{
                            return '销售额';
                        }
                    }else{
                        return ""
                    }
                }

            },
            {
                "searchable": false,
                "orderable": false,
                data: "tYear"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "january"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "february"

            },

            {
                "searchable": false,
                "orderable": false,
                data: "march"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "april"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "may"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "june"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "july"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "august"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "september"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "october"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "november"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "december"

            },
            {
                data : null,
                "sWidth": "60px",
                "searchable": false,
                "orderable": false,
                "bSort":false,
                render : function(data, type, row) {
                    return  '<a style="padding-\:8px;" href="javascript:editShopAssessment(\''+row.id+'\',\''+row.idByMd5Encode+'\');">修改</a>'+'&nbsp;&nbsp;'+
                             '<a style="padding-right:8px;" href="javascript:openDeleteConfirmWindow(\''+row.id+'\',\''+row.idByMd5Encode+'\');">删除</a>';
                }
            }
        ],
        "aoColumnDefs": [{"bSortable": false, "aTargets": [0]}],
        ajax : {
            "url" : "/erp/ShopAssessmentController/getShopAssessments?rand=" + Math.random(),
            "method": "POST",
            "data":function (){
                return {
                    "orgNo":$('#area').val()=='all'?'':$('#area').val(),
                    "distributeNo":$('#operateCenter').val()=='all'?'':$('#operateCenter').val(),
                    "managerNo":$('#managerCenter').val()=='all'?'':$('#managerCenter').val(),
                    "shopName":$('#storeName').val(),
                    "shopNo":$('#storeId').val(),
                    "tType":$('#tType').val(),
                    "tIndex":$('#tIndex').val(),
                    "tYear":$('#tYear').val(),
                    "pageSize":$('#pageRange').val(),
                    "pageNum":pagenum
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
        fnCreatedRow: function (nRow, aData,iDisplayIndex) {
            $(nRow).addClass("table-row");
        },
        "initComplete": function (settings, json) {
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
    // 生成序号
    t.on( 'order.dt search.dt', function () {
        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();
};

/**
 * 导出
 */
function exportExcel(){

    $.messager.confirm('确认','是否确认导出门店考核目标数据？',function(r){
        if (r){
            exportLimit();
        }
    });
}
/**
 * 导出限制条数
 */
function exportLimit(){
    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        url: "/erp/ShopAssessmentController/exportLimit",
        data: {
            "orgNo":$('#area').val()=='all'?'':$('#area').val(),
            "distributeNo":$('#operateCenter').val()=='all'?'':$('#operateCenter').val(),
            "managerNo":$('#managerCenter').val()=='all'?'':$('#managerCenter').val(),
            "shopNo":$('#storeId').val(),
            "tType":$('#tType').val(),
            "tIndex":$('#tIndex').val(),
            "tYear":$('#tYear').val()
        },
        success:function (data) {
            if(data.success){
                //初始化参数
                $('#orgNoExport').val($('#area').val()=='all'?'':$('#area').val());
                $('#distributeNoExport').val($('#operateCenter').val()=='all'?'':$('#operateCenter').val());
                $('#managerNoExport').val($('#managerCenter').val()=='all'?'':$('#managerCenter').val());
                $('#shopNameExport').val($('#storeId').val());
                $('#tTypeExport').val($('#tType').val());
                $('#tIndexExport').val($('#tIndex').val());
                $('#tYearExport').val($('#tYear').val());
                $('#managerForm').submit();
            }else{
                alert(data.exceptionMsg);
            }
        },
        error : function(data){
            alert("导出数据失败");
        }
    });
}

//删除
function openDeleteConfirmWindow(id, idMd5){
    $("#deleteConfirmModal").modal('show');
    $("#deleteIdHidden").val(id);
    $("#deleteIdMd5Hidden").val(idMd5);
}

/**
 * 删除
 * @param id
 */
function deleteByPrimaryKey(){
    $("#deleteConfirmModal").modal('hide');
    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        cache: false,
        url: "/erp/ShopAssessmentController/deleteShopAssessmentById",
        data: {
            id: $("#deleteIdHidden").val(),
            idByMd5Encode: $("#deleteIdMd5Hidden").val()
        },
        success:function (data) {
            if(data.success){
                alert("删除成功!");
                query();
            }else{
                alert("删除数据失败");
            }
        },
        error : function(data){
            alert("删除数据失败");
        }
    });
}
/******************************新建或修改页的 js 操作***********************************************************/
/**
 * 新建
 */
function addNew(){
    $('#myModal').modal({backdrop: 'static', keyboard: false});

    initAreaM();
    initManagerM();
    clearVal();


    // 日期，只选择年
    $("#addTyear").datetimepicker({
        format: 'yyyy',
        minView : '4',
        startView: '4',
        language:'zh-CN',
        autoclose : true,
        todayHighlight : true
    });
}

function initShopNameNew(showShopName){
    $('#addShopName').val(showShopName);
    //远程数据源
    var remote_cities = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('siteName'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        // 在文本框输入字符时才发起请求
        remote: {
            url: '/erp/ShopAssessmentController/querySiteBaseInfo?shopName=%QUERY',
            wildcard: '%QUERY'
        }
    });
    $('#addShopName').typeahead({
            hint: true,
            highlight: true,
            delay: 3000,
            minLength: 1
        },
        {
            name: 'siteBaseInfos',
            displayKey: 'siteName',
            source: remote_cities.ttAdapter()
        });
    $('#addShopName').bind('typeahead:select', function(ev, suggestion) {
        //$('#addShopName').val(null);
        //$('#addShopName').val(suggestion.siteName);
        $("#addShopNo").val(suggestion.siteNo);
    });
}

/**
 * 修改时，初始化操作
 * @param id
 */
function editShopAssessment(id, idByMd5Encode){
    $.ajax({
        url: "/erp/ShopAssessmentController/initShopAssessment?id=" + id+"&idByMd5Encode="+idByMd5Encode,
        type: "POST",
        dataType: "json",
        success: function (data) {
            $('#myModal').modal({backdrop: 'static', keyboard: false});
            initShopAssessmentData(data);
        },
        error: function (xhr, st, err) {
            alert("修改时初始化数据失败,请联系管理员!");
        }
    });
}

/**
 * 修改时初始化数据
 * @type {null}
 */
var dDistributeNoVal = null; // 运营中心  默认显示值
function initShopAssessmentData(data){
    dDistributeNoVal = data.distributeNo;
    initAreaM(data.orgNo);
    initManagerM(data.managerNo);
    //initShopNameNew(data.shopName)

    // 日期，只选择年
    $("#addTyear").datetimepicker({
        format: 'yyyy',
        minView : '4',
        startView: '4',
        language:'zh-CN',
        autoclose : true,
        todayHighlight : true
    });

    $("#addTtype").val(data.tType);
    $("#addTindex").val(data.tIndex);

    $("#addId").val(data.id);
    $("#addIdByMd5Encode").val(data.idByMd5Encode);
    $("#orgNameAddId").val(data.orgName);
    $("#distributeNameAddId").val(data.distributeName);
    $("#managerNameAddId").val(data.managerName);
    $("#addShopName").val(data.shopName);
    $("#addShopNo").val(data.shopNo);

    $("#addTyear").val(data.tYear);

    $("#januaryM").val(data.january);
    $("#februaryM").val(data.february);
    $("#marchM").val(data.march);
    $("#aprilM").val(data.april);
    $("#mayM").val(data.may);
    $("#juneM").val(data.june);
    $("#julyM").val(data.july);
    $("#augustM").val(data.august);
    $("#septemberM").val(data.september);
    $("#octoberM").val(data.october);
    $("#novemberM").val(data.november);
    $("#decemberM").val(data.december);

    changeTtypeM();
}
/**
 * 初始化新建或修改也的【区域】下拉列表
 * dOrgNoVal 默认显示值
 */
function initAreaM(dOrgNoVal) {
    $('#addOrgNo').empty();
    $.ajax({
        url: '/erp/common/areaCascadeController/getUserUniqueArea',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                if(data.length>1){
                    data.splice(0,0,{"org_name":"全部","org_no":"all"});//增加全部选项 #
                }
                //添加option选项
                for(var i=0;i<data.length;i++){
                    $('#addOrgNo').append("<option value='"+data[i]['org_no']+"'>"+data[i]['org_name']+"</option>");
                }
                if(dOrgNoVal != null && dOrgNoVal != undefined){
                    $("#addOrgNo").val(dOrgNoVal);
                }
                changeAeraM();
            }
        },
        error: function (data) {
            alert("获取区域信息失败!");
        }
    });
}


/**
 * 初始化新建或修改页的【运营中心】下拉列表
 * @param areaNo
 */
function changeAeraM(areaNo) {
    if(areaNo==null||areaNo==undefined){
        areaNo = $('#addOrgNo').val();
        var orgNameVal = $('#addOrgNo option:selected').text();
        if(areaNo != "all"){
            $('#orgNameAddId').val(orgNameVal);
        }
    }

    $('#addDistributeNo').empty();
    if (areaNo == 'all') {
        //区域选择的是全部
        var data = [{"distribute_name": "全部", "distribute_no": "all"}];
        //添加option选项
        for(var i=0;i<data.length;i++){
            $('#addDistributeNo').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
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
                    if ($("#addDistributeNo").length > 0) {//控件是否存在
                        if (data.length > 0) {
                            if(data.length > 1){
                                data.splice(0, 0, {"distribute_name": "全部", "distribute_no": "all"});//增加全部选项 all
                            }
                            //添加option选项
                            for(var i=0;i<data.length;i++){
                                $('#addDistributeNo').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
                            }

                            if(dDistributeNoVal != null && dDistributeNoVal != undefined){
                                $("#addDistributeNo").val(dDistributeNoVal);
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

/**
 * 运营中心改变时，赋值name
 */
function changeDistributeM(){
    var addDistributeNo = $('#addDistributeNo').val();
    if(addDistributeNo != "all"){
        $('#distributeNameAddId').val($('#addDistributeNo option:selected').text());
    }
}

/**
 * 初始化-查询条件-管家下拉列表
 */
function initManagerM(dManagerNoVal){
    $('#addManagerNo').empty();
    $.ajax({
        url: '/erp/ShopAssessmentController/queryListManagers',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                if(data.length>1){
                    data.splice(0,0,{"userName":"全部","userNo":"all"});//增加全部选项 #
                }
                //添加option选项
                for(var i=0;i<data.length;i++){
                    $('#addManagerNo').append("<option value='"+data[i]['userNo']+"'>"+data[i]['userName']+"</option>");
                }

                if(dManagerNoVal != null && dManagerNoVal != undefined){
                    $("#addManagerNo").val(dManagerNoVal);
                }
            }
        },
        error: function (data) {
            alert("获取管家信息失败!");
        }
    });
}

/**
 * 管家改变时，赋值name
 */
function changeManagerM(){
    var addDistributeNo = $('#addManagerNo').val();
    if(addDistributeNo != "all"){
        $('#managerNameAddId').val($('#addManagerNo option:selected').text());
    }
}

/**
 * 类型改变时的逻辑操作
 */
var addDistributeNoB = false, addManagerNoB = false, addShopNameB = false; // 提交时的判断
function changeTtypeM(){
    var itype = $("#addTtype").val();
    // 类型为区域，中心、管家、京东帮不可选
    if(itype == "0"){
        $("#addDistributeNo").attr("disabled","disabled");
        $("#addManagerNo").attr("disabled","disabled");
        $("#addShopName").attr("disabled","disabled");

        addDistributeNoB = false;
        addManagerNoB = false;
        addShopNameB = false;

        $("#addDistributeNo").val("all");
        $("#addManagerNo").val("all");
        $("#addShopName").val("");
    }// 类型为中心，管家、京东帮不可选
    else if(itype == "1"){
        $("#addDistributeNo").removeAttr("disabled");
        $("#addManagerNo").attr("disabled","disabled");
        $("#addShopName").attr("disabled","disabled");

        addDistributeNoB = true;
        addManagerNoB = false;
        addShopNameB = false;

        $("#addManagerNo").val("all");
        $("#addShopName").val("");
    }// 类型为管家，京东帮不可选
    else if(itype == "2"){
        $("#addDistributeNo").removeAttr("disabled");
        $("#addManagerNo").removeAttr("disabled");
        $("#addShopName").attr("disabled","disabled");

        addDistributeNoB = true;
        addManagerNoB = true;
        addShopNameB = false;

        $("#addShopName").val("");
    }else{
        $("#addDistributeNo").removeAttr("disabled");
        $("#addManagerNo").removeAttr("disabled");
        $("#addShopName").removeAttr("disabled");

        addDistributeNoB = true;
        addManagerNoB = true;
        addShopNameB = true;
    }
}

/**
 * 新建时，清空值
 */
function clearVal(){
    $("#addId").val(null);
    $("#addShopName").val(null);
    $("#addTyear").val(null);
    $(".validNumClass").each(function(){
        $(this).val(null);
    });
}
/**
 * 新建或修改的保存操作
 */
function saveOrUpdateBtn() {

    if($("#addOrgNo option:selected").val()=="all"){
        alert("请选择区域");
        return;
    }
    if(addDistributeNoB && ($("#addDistributeNo option:selected").val()==null
        || $("#addDistributeNo option:selected").val()==undefined
        || $("#addDistributeNo option:selected").val()=="all"
        || $("#addDistributeNo option:selected").val()=="")){
        alert("请选择运营中心");
        return;
    }
    if(addManagerNoB && ($("#addManagerNo option:selected").val()==null
        || $("#addManagerNo option:selected").val()==undefined
        || $("#addManagerNo option:selected").val()=="all"
        || $("#addManagerNo option:selected").val()=="")){
        alert("请选择管家");
        return;
    }
    if(addShopNameB && ($("#addShopName").val()==null
        || $("#addShopName").val()==undefined || $("#addShopName").val()=="")){
        alert("请填写京东帮门店名称");
        return;
    }
    if($("#addTyear").val()==null || $("#addTyear").val()==undefined || $("#addTyear").val()==""){
        alert("年度不能为空");
        return;
    }

    var isValidNum = true;
    // 判断月份要输入值必须为数字，可以为null
    $(".validNumClass").each(function(){
        var isNumVal = $(this).val();
        if(isNumVal != null && isNumVal !=undefined && isNumVal!= "" && isNumVal!=" " ){
            //alert(isNaN(isNumVal));
            if(isNaN(isNumVal)){
                isValidNum = false;
                alert("月份值必须数字");
                return;
            }
            if(isNumVal.length>13){
                isValidNum = false;
                alert("月份值长度不能超过13位");
                return;
            }
        }
    });

    if(isValidNum == false){
        return;
    }
    //把表单的数据进行序列化
    var params = $("#updateUserForm").serialize();

    $.ajax({
        url : "/erp/ShopAssessmentController/saveOrUpdateShopAssessment?rand=" + Math.random(),
        type : "POST",
        data : params,
        dataType : "json",
        success : function(data) {
            if (data.success) {
                alert("操作成功!");
                $("#cancelM").click();
                query();
            } else{
                alert(data.exceptionMsg);
            }
        },
        error : function(xhr, st, err) {
            alert("保存失败!");
        }
    });
}