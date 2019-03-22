//初始化方法
$(document).ready(function () {
    initDataTable();

    $('#multiselect').multiselect();

    $('#pageNo').keydown(function(e){
        if(e.keyCode==13){
            pageChangeEnter();
        }
    });

});

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
                data : "regionNo"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "regionName"
            },
            {
                "searchable": false,
                "orderable": false,
                "sWidth": "400px",
                data: "orgNames"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "regionManager"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "telephone"

            },
            {
                "searchable": false,
                "orderable": false,
                data: "email"

            },
            {
                data : null,
                "sWidth": "60px",
                "searchable": false,
                "orderable": false,
                "bSort":false,
                render : function(data, type, row) {
                    return '<a href="javascript:bindOrg(\''+row.regionNo+'\');">维护</a>';
                }
            }
        ],
        "aoColumnDefs": [{"bSortable": false, "aTargets": [0]}],
        ajax : {
            "url" : "/region/getRegionInfo?rand=" + Math.random(),
            "method": "POST",
            "data":{},
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
 * 保存
 */
function saveBtn(){
    var orgNoArr = Array();

    $("#multiselect_to option").each(function() {
        orgNoArr.push($(this).attr("value"));
    });
    var orgNos = orgNoArr.join(",");

    $.ajax({
        url : "/region/updateRegionInfo?rand=" + Math.random(),
        method : "POST",
        dataType : "json",
        data :{
            "regionNo":$('#regionNo_h').val(),
            "regionManager":$('#regionManager').val(),
            "telephone":$('#telephone').val(),
            "email":$('#email').val(),
            "orgNos": orgNos
        },
        success: function (data) {
            if (data.state) {
                console.log(data.state);
                $("#cancelM").click();
                query();
            } else {
                console.log("更新区域信息出错，请联系管理员");
            }
        }
    });
}

/**
 * 绑定机构
 */

function bindOrg(regionNo){
    $('#multiselect').empty();
    $.ajax({
        url : "/region/getRegionInfoByNo?rand=" + Math.random(),
        method : "POST",
        dataType : "json",
        data :{"regionNo":regionNo},
        success: function (data) {
            if (data.state) {
                $("#regionNo").val(data.regioninfo.regionNo);
                $("#regionNo_h").val(data.regioninfo.regionNo);
                $("#regionName").val(data.regioninfo.regionName);
                $("#regionManager").val(data.regioninfo.regionManager);
                $("#telephone").val(data.regioninfo.telephone);
                $("#email").val(data.regioninfo.email);

                initMultiselectToData(data);
                initMultiselectData(data);
                //弹出对话框
                $("#updateMode").modal({backdrop: 'static', keyboard: false});
            } else {
                console.log("获取绑定机构信息出错，请联系管理员");
            }
        },
        error: function () {
            console.log("获取绑定机构信息出错，请联系管理员");
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
    var chosen = data.chosen;
    for(var i=0;i<chosen.length;i++){
        $('#multiselect_to').append("<option value='" + chosen[i].mcustCode + "'>" + chosen[i].mcustName  +"</option>");
    }
}

/**
 * 初始化复选框未选中内容
 */
function initMultiselectData(data){
    //首先清空
    $('#multiselect').empty();
    var unchosen = data.unchosen;
    for(var i=0;i<unchosen.length;i++){
        $('#multiselect').append("<option value='" + unchosen[i].mcustCode + "'>" + unchosen[i].mcustName  +"</option>");
    }
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


