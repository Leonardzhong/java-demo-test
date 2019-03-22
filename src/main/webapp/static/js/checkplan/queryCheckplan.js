
$(function() {
    initGrid();
    initExportBtn();
    $("#queryBtn").bind("click", query);
    $("#clearBtn").bind("click", clearForm);
    $("#exportBtn").bind("click", function () {
        $('#ff').submit();
    });
    province_county();



});
function clearForm(applicationid, applicantid) {
    $("#qstatus").val("");
    $('#ff').form('clear');
    $("#answerStart").val('');
    $("#answerEnd").val('');
    $("#applyStart").val('');
    $("#applyEnd").val('');
    $("#applicantName").val('');
    $("#city").empty();
    $("#county").empty();
    $("#township").empty();
    $("#province").val('');
    $("#distribute").empty();
    $("#wareHouse").val('');

}
function query() {
    $('#dataGrid').datagrid('load', getQueryData());
}
function getQueryData() {
    return {
        org : $("#org").val(),
        distribute : $("#distribute").val(),
        managerNo : $("#managerNo").val(),
        shopName : $("#shopName").val(),
        planstatus : $("#planstatus").val(),
        wareHouseString : $("#wareHouseString").val(),
        distributeString : $("#distributeString").val(),
        plandate : $("#plandate").val(),
        signedStart : $("#signedStart").val(),
        signedEnd : $("#signedEnd").val()
    }
}

function initExportBtn(){
    $.ajax({
        url: '/erp/getExportBtnPermission',
        data:{
        },
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            console.info("权限查询结果"+data.result);
            //alert("当前用户"+$('#loginUser').val()+"===权限查询结果"+data.result);
            if (data) {
                if(!(data.result)){
                    $("#exportBtn").hide();
                }else{
                    $("#exportBtn").show();
                }
            } else {
                console.log("加载权限信息出错，请联系管理员");
                window.alert("加载权限信息出错，请联系管理员");
            }
        },
        error: function () {
            console.log("加载权限信息出错，请联系管理员");
            window.alert("加载权限信息出错，请联系管理员");
        }
    });
}

function initGrid() {
    var grid = $('#dataGrid')
        .datagrid(
        {
            url : "/erp/queryCheckplan",
            queryParams : getQueryData(),
            rownumbers:false,
            striped:true,
            pagination : true,
            columns : [ [

                {
                    field : 'plandate',
                    title : '月份',
                    width : 30
                },
                {
                    field : 'org_name',
                    title : '区域',
                    width : 100
                },
                {
                    field : 'distribute_name',
                    title : '运营中心'  ,
                    width : 100
                },
                {
                    field : 'managerName',
                    title : '管家姓名',
                    width : 70
                },
                {
                    field : 'managerNo',
                    title : '商城账号',
                    width : 80
                },
                {
                    field : 'shopName',
                    title : '门店名称'
                },
                {
                    field : 'address',
                    title : '门店地址',
                    width : 150
                },
                {
                    field : 'score',
                    title : '巡店得分',
                    width :60
                },
                {
                    field : 'signedStart',
                    title : '签到时间',
                    width : 80
                },
                {
                    field : 'signedStartAddress',
                    title : '签到地址',
                    width : 150
                },
                {
                    field : 'signedEndDate',
                    title : '结束时间',
                    width : 80
                },
                {
                    field : 'signedEndAddress',
                    title : '结束地址',
                    width : 150
                },
                {
                    field : 'trainRoleNames',
                    title : '培训对象',
                    width : 100
                },
                {
                    field : 'trainContentNames',
                    title : '培训内容',
                    width : 100
                },

                {
                    field : 'inventoryStatus',
                    title : '盘点结果',
                    width : 50
                },
                {
                    field : 'marketStatus',
                    title : '市场调研',
                    width : 50
                },
                {
                    field : 'summaryStatus',
                    title : '巡店小结',
                    width : 50
                },
                {
                    field : 'planstatus',
                    title : '巡店状态',
                    width : 50
                }
                 ] ]
        });
    var getPager = $('#dataGrid').datagrid('getPager');
    $(getPager).pagination({
        pageSize : 10,// 每页显示的记录条数，默认为10
        pageList : [ 5, 10, 15 ],// 可以设置每页记录条数的列表
        beforePageText : '第',// 页数文本框前显示的汉字
        afterPageText : '页    共 {pages} 页',
        displayMsg : '当前显示 {from} - {to} 条记录   共 {total} 条记录'
        /*
         * onBeforeRefresh:function(){ $(this).pagination('loading'); alert('before
         * refresh'); $(this).pagination('loaded'); }
         */
    });
}

//三级联动
function province_county() {
    $("#org").on("change", function() {
        if("" == $(this).val()){
            $("#distribute").empty();
        }else{

            getDistribute($(this).val());
        }
    })

}
//地区也运营中心

function getDistribute(org,fn){
    $.ajax({
        type : "POST",
        url : "/erp/application/getDistributeByNo",
        data : "wareHouseNo=" + org+"&userNo="+$("#userNo").val(),
        success : function(msg) {
            $("#distribute").empty();
            var data=$.parseJSON(msg);
            var html='<option value="">--请选择--</option>';
            for (var i = 0; i < data.length; i++) {
                html +="<option value='"+data[i].deliverCenterCode+"'>"+data[i].deliverCenterName+"</option>";
            }
            $("#distribute").append(html);
            if($.type(fn) == 'function'){
                fn();
            }

        }
    });
}

function exportCheckPlanData() {
    $('#dataGrid').datagrid('load', getQueryData());
}
