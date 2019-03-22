//初始化方法
$(document).ready(function () {

    //初始化区域
    initArea();


    $('#multiselect').multiselect();

    provinceControlListener('#province', '#city', '#county', '#town');

    cityControlListener('#city', '#county', '#town');

    countryControlListener('#county', '#town');

    $('#pageNo').keydown(function(e){
        if(e.keyCode==13){
           pageChangeEnter();
        }
    });

});

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
                    data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
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
 * 初始化区域
 */
function initAreaM() {
    $('#areaM').empty();
    $.ajax({
        url: '/erp/common/areaCascadeController/getUserUniqueArea',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                if(data.length>1){
                    data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
                }
                //添加option选项
                for(var i=0;i<data.length;i++){
                    $('#areaM').append("<option value='"+data[i]['org_no']+"'>"+data[i]['org_name']+"</option>");
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
 *
 * @param areaNo
 */
function changeAera(areaNo,temp) {
    if(areaNo==null||areaNo==undefined){
        areaNo = $('#area').val();
    }
    $('#operateCenter').empty();
    if (areaNo == '-1') {
        //区域选择的是全部
        var data = [{"distribute_name": "全部", "distribute_no": "-1"}];
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
                                data.splice(0, 0, {"distribute_name": "全部", "distribute_no": "-1"});//增加全部选项 -1
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

/**
 *
 * @param areaNo
 */
function changeAeraM(areaNo) {
    if(areaNo==null||areaNo==undefined){
        areaNo = $('#areaM').val();
    }
    $('#operateCenterM').empty();
    if (areaNo == '-1') {
        //区域选择的是全部
        var data = [{"distribute_name": "全部", "distribute_no": "-1"}];
        //添加option选项
        for(var i=0;i<data.length;i++){
            $('#operateCenterM').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
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
                    if ($("#operateCenterM").length > 0) {//控件是否存在
                        if (data.length > 0) {
                            if(data.length > 1){
                                data.splice(0, 0, {"distribute_name": "全部", "distribute_no": "-1"});//增加全部选项 -1
                            }
                            //添加option选项
                            for(var i=0;i<data.length;i++){
                                $('#operateCenterM').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
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
    $("#resultGrid").DataTable().ajax.reload();
}

var initDataTable = function() {
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
    } ).DataTable({
        "dom": '<"toolbar"<"row"<"col-md-6"<"btnPlace">>>>rt',
        iDisplayLength: $('#pageRange').val(),
        showRowNumber:true,
        columns : [
            {
                "searchable": false,
                "orderable": false,
                data : "valid"
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
                        return "全部"
                    }
                }

            },
            {
                "searchable": false,
                "orderable": false,
                data: "userName"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "userNo"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "createPerson"

            },
            {
                data: "sites",
                "searchable": false,
                "orderable": false,
                "sWidth": "400px",
                render : function(data, type, row) {
                    var text = '';
                    jQuery.each(data, function() {
                        text += this.siteName+",";
                    });
                    if(text.length > 20){
                        text = text.substring(0,20)+"...";
                    }else{
                        if(text.length > 0){
                            text = text.substring(0,text.length-1);
                        }
                    }
                    return text;
                }
            },
            {
                data : null,
                "sWidth": "60px",
                "searchable": false,
                "orderable": false,
                "bSort":false,
                render : function(data, type, row) {
                    return '<a href="javascript:bindSite(\''+row.userNo+'\',\''+ row.userName +'\');">绑定门店</a>';
                }
            }
        ],
        "aoColumnDefs": [{"bSortable": false, "aTargets": [0]}],
        ajax : {
            "url" : "/ManagerManageController/getManagers?rand=" + Math.random(),
            "method": "POST",
            "data":function (){
                return {
                    "site_no":$('#storeNo').val(),
                    "site_name":$('#storeName').val(),
                    "userName":$('#bulterName').val(),
                    "userNo":$('#bulter_erp').val(),
                    "erp":$('#loginUser').val(),
                    "orgNo":$('#area').val()==-1?'':$('#area').val(),
                    "distributeNo":$('#operateCenter').val()==-1?'':$('#operateCenter').val(),
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
                $('#pageTotal').empty()
                $('#pageTotal').append(totalPage) ;
            }
        }
    });
}

/**
 * 导出
 */
function exportExcel(){

    $.messager.confirm('确认','是否确认导出管家数据？',function(r){
        if (r){
            //初始化参数
            $('#areaExport').val($('#area').val()==-1?'':$('#area').val());
            $('#operateCenterExport').val($('#operateCenter').val()==-1?'':$('#operateCenter').val());
            $('#storeNameExport').val($('#storeName').val());
            $('#storeNoExport').val($('#storeNo').val());
            $('#bulterNameExport').val($('#bulterName').val());
            $('#bulter_erpExport').val($('#bulter_erp').val());
            $('#managerForm').submit();
        }
    });

}

/**
 * 保存
 */
function saveBtn(){

    var siteNos = $("#multiselect_to option").map(function(){return $(this).val();}).get().join(";");
    $.ajax({
        url : "/ManagerManageController/bindSiteBaseInfoForManager?rand=" + Math.random(),
        method : "POST",
        dataType : "json",
        data :{
            "userNo":$('#managerErp').val(),
            "userName":$('#managerName').val(),
            "siteNos": siteNos
        },
        success: function (data) {
            if (data) {
                console.log(data);
                $("#cancelM").click();
                query();
            } else {
                console.log("获取绑定门店信息出错，请联系管理员");
            }
        }
    });
}

/**
 * 绑定门店
 */

function bindSite(userErp,userName){
    $('#multiselect').empty();
    $.ajax({
        url : "/ManagerManageController/getSiteByManagerErp?rand=" + Math.random(),
        method : "POST",
        dataType : "json",
        data :{"userErp":userErp},
        success: function (data) {
            if (data) {
                $('#managerName').val(userName);
                $('#managerErp').val(userErp);
                initMultiselectToData(data);
                //弹出对话框
                $("#updateMode").modal({backdrop: 'static', keyboard: false});
                initAreaM();
                changeAeraM(-1);
                //加载四级地址
                initProvinceRequest('#province');
                initCityRequest('-1','#city');
                initCountryRequest('-1','#county');
                initTownRequest('-1','#town');
            } else {
                console.log("获取绑定门店信息出错，请联系管理员");
            }
        },
        error: function () {
            console.log("获取绑定门店信息出错，请联系管理员");
        }
        });
}

var chooseData = {};

/**
 * 初始化复选框选中内容
 */
function initMultiselectToData(data){
    //console.log(data);
    //首先清空
    $('#multiselect_to').empty();
    for(var i=0;i<data.length;i++){
        $('#multiselect_to').append("<option value='" + data[i].siteNo + "'>" + data[i].siteName  +"</option>");
    }
}

/**
 * 初始化复选框未选中内容
 */
function initMultiselectData(data){
    //首先清空
    $('#multiselect').empty();
    for(var i=0;i<data.length;i++){
        //判断选中内容中是否含有对应的门店
        if( $("#multiselect_to option[value='"+data[i].siteNo+"']").length>0){

        }else{
            if(data[i].managerErp==null||data[i].managerErp==''||data[i].managerErp=='#'){
                $('#multiselect').append("<option value='" + data[i].siteNo + "'>" + data[i].siteName  +"</option>");
            }
        }
    }
}

var provinceControlListener = function (containerId, secondContainerId, thirdContainerId, fourthContainerId) {
    $(containerId).on('change', function () {
        /* 需要清除市县乡镇的关联内容 */
        var provinceNo = $(this).val();
        $(secondContainerId).find('option').remove();
        $(secondContainerId).append('<option value="-1">市</option>');
        $(thirdContainerId).find('option').remove();
        $(thirdContainerId).append('<option value="-1">县</option>');
        $(fourthContainerId).find('option').remove();
        $(fourthContainerId).append('<option value="-1">镇</option>');
        if (provinceNo) {
            initCityRequest(provinceNo, secondContainerId);
        } else {
            console.log("省控件值获取失败，请联系管理员");
        }
    });
};

var cityControlListener = function (containerId, secondContainerId, thirdContainerId) {
    $(containerId).on('change', function () {
        /* 需要清除县乡镇的关联内容 */
        var cityNo = $(this).val();
        $(secondContainerId).find('option').remove();
        $(secondContainerId).append('<option value="-1">县</option>');
        $(thirdContainerId).find('option').remove();
        $(thirdContainerId).append('<option value="-1">镇</option>');
        if (cityNo) {
            initCountryRequest(cityNo, secondContainerId);
        } else {
            console.log("市控件值获取失败，请联系管理员");
        }
    });
};

var countryControlListener = function (containerId, secondContainerId) {
    $(containerId).on('change', function () {
        /* 需要清除乡镇的关联内容 */
        var countryNo = $(this).val();
        $(secondContainerId).find('option').remove();
        $(secondContainerId).append('<option value="-1">镇</option>');
        if (countryNo) {
            initTownRequest(countryNo, secondContainerId);
        } else {
            console.log("县控件值获取失败，请联系管理员");
        }
    });
};

//省
var initProvinceRequest = function (containerId) {
    $.ajax({
        url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo',
        type: 'POST',
        dataType: 'json',
        data: {parentNo: 0},
        success: function (data) {
            if (data) {
                $(containerId).find('option').remove();
                data.splice(0, 0, {"areaName": "省", "areaId": "-1"});//增加全部选项 -1
                $.each(data, function (_index, _obj) {
                    $(containerId).append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                });
            } else {
                console.log("加载省信息出错，请联系管理员");
            }
        },
        error: function () {
            console.log("加载省信息出错，请联系管理员");
        }
    });
};
//市
var initCityRequest = function (provinceNo, containerId) {

    if(provinceNo=='-1'){
        $(containerId).find('option').remove();
        $(containerId).append('<option value="-1">' + '市' + '</option>');
    }else{
        $.ajax({
            url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo=' + provinceNo,
            data: 'parentNo=' + provinceNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    //data.splice(0, 0, {"areaName": "市", "areaId": "-1"});//增加全部选项 -1
                    $.each(data, function (_index, _obj) {
                        $(containerId).append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                    });
                } else {
                    console.log("加载市信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载市信息出错，请联系管理员");
            }
        });
    }
};
//县
var initCountryRequest = function (cityNo, containerId) {
    if(cityNo=='-1'){
        $(containerId).find('option').remove();
        $(containerId).append('<option value="-1">' + '县' + '</option>');
    }else{
        $.ajax({
            url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo=' + cityNo,
            data: 'parentNo=' + cityNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    //data.splice(0, 0, {"areaName": "县", "areaId": "-1"});//增加全部选项 -1
                    $.each(data, function (_index, _obj) {
                        $(containerId).append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                    });
                } else {
                    console.log("加载县信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载县信息出错，请联系管理员");
            }
        });
    }
};
//镇
var initTownRequest = function (countryNo, containerId) {
    if(countryNo=='-1'){
        $(containerId).find('option').remove();
        $(containerId).append('<option value="-1">' + '镇' + '</option>');
    }else{
        $.ajax({
            url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo=' + countryNo,
            data: 'parentNo=' + countryNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    //data.splice(0, 0, {"areaName": "镇", "areaId": "-1"});//增加全部选项 -1
                    $.each(data, function (_index, _obj) {
                        $(containerId).append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                    });
                } else {
                    console.log("加载乡镇信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载乡镇信息出错，请联系管理员");
            }
        });
    }
}

//查询门店按钮
function querySiteInfo(){
    $.ajax({
        url : "/site/querySiteBaseInfoForManager?rand=" + Math.random(),
        method : "POST",
        dataType : "json",
        data :{
            "loginUser":$('#loginUser').val(),
            "orgNo":$('#areaM').val(),
            "distributeNo":$('#operateCenterM').val(),
            "provinceNo":$('#province').val(),
            "cityNo":$('#city').val(),
            "countryNo":$('#country').val(),
            "townNo":$('#town').val()
        },
        success: function (data) {
            if (data) {

                initMultiselectData(data.result);
            } else {
                console.log("获取门店信息出错，请联系管理员");
            }
        },
        error: function () {
            console.log("获取门店信息出错，请联系管理员");
        }
    });
}

function changePageSize(){
    pagenum = 0;
    $("#resultGrid").DataTable().page.len($('#pageRange').val());
    $("#resultGrid").DataTable().ajax.reload();
}

function changePage(){
    $("#resultGrid").DataTable().ajax.reload();
}

var pagenum = 0;

//下一页
function nextPage(){
    var json = $("#resultGrid").DataTable().ajax.json();
    var count = json.totalCount;
    var pageSize = parseInt($('#pageRange').val());
    var totolPage = Math.ceil(count/pageSize);
    if(pagenum+1 >= totolPage){
        //没有下一页了
        alert("已经最后一页了");
    }else{
        pagenum++;
        changePage();
    }
}

//上一页
function prevPage(){
    if(pagenum == 0){
        //没有下一页了
        alert("已经是第一页了");
    }else{
        pagenum--;
        changePage();
    }
}

//第一页
function firstPage(){
    pagenum = 0;
    changePage();
}

//最后一页
function lastPage(){
    var json = $("#resultGrid").DataTable().ajax.json();
    var count = json.totalCount;
    var pageSize = parseInt($('#pageRange').val());
    var totolPage = Math.floor(count/pageSize);
    pagenum = totolPage;
    changePage();
}

function pageChangeEnter(){
    var json = $("#resultGrid").DataTable().ajax.json();
    var count = json.totalCount;
    var pageSize = parseInt($('#pageRange').val());
    var totolPage = count/pageSize;
    if(count%pageSize){
        totolPage ++;
    }
    var pageno = $('#pageNo').val();
    if(pageno>totolPage){
        alert("输入页码有误，请重试");
    }else{
        pagenum = pageno -1;
        changePage();
    }
}


