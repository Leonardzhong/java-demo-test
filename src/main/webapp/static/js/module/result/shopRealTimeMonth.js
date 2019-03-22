/**
 * Created with IntelliJ IDEA.
 * User: yanbingxin
 * Date: 2015/8/24
 * Time: 14:23
 */
$(document).ready(function(){
    //选择区域获取运营中心联动
    $('#area').combobox({
        editable:false,
        onChange:function(newValue,oldValue){
            changeAera('#area','#operateCenter',1);
        }
    });
    $('#operateCenter').combobox({
        editable:false
    });
    initArea();
    controlInit.timeControl();

});

function createTreeGrid(){
    $.ajax({
        url : "/erp/ShopRealTimeMonthController/queryShopRealTimeIndexList",
        dataType : "json",
        type : "post",
        data : {
            orgNo:$('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue'),
            distributeNo:$('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue'),
            shopName:$('#storeName').val(),
            shopLevel:$('#storeLevel').combobox('getValue'),
            statStart:$('#statStart').val(),
            statEnd:$('#statEnd').val(),
            storeId:$('#storeId').combobox('getValue')
        },
        async : false,
        success : function(result) {
            if(result.success){
                if(result.data!=null){
                    var tree = mini.get("resultGrid");
                    //alert(result.data[0].isLeaf)
                    tree.setData(result.data);
                }else{
                    alert("服务器访问出错");
                }
            }else{
                var errorWind=window.open();
                errorWind.document.write('<div>异常信息：<br>'+result.exceptionMsg+'</div>');
                errorWind.document.write('<div style="font-size: 14px;color: red">堆栈信息：<PRE>'+result.stackTrace+'</PRE></div>');
            }
        },error:function(data){
            alert("服务器访问出错")
        }
    });
}

var isClickQuery = false;
function onBeforeTreeLoad(e){
    //var tree = e.sender;    //树控件
    var node = e.node;      //当前节点
    var params = e.params;  //参数对象

    params.clickQuery = isClickQuery;
    if(!isClickQuery){
        params.treeLevel = node.treeLevel;
        params.treeRegionNo = node.regionNo;
        params.treeOrgNo = node.orgNo;
        params.treeDistributeNo = node.distributeNo;
    }
    params.orgNo=$('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue');
    params.distributeNo=$('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue');
    params.shopName=$('#storeName').val();
    params.shopLevel=$('#storeLevel').combobox('getValue');
    params.statStart=$('#statStart').val();
    params.statEnd=$('#statEnd').val();
    params.storeId=$('#storeId').combobox('getValue');
}
// treegrid加载完的操作
function onLoadSuccess(){
    isClickQuery = false;
}

function initArea(){
    $.ajax({
        url : '/erp/common/areaCascadeController/getUserUniqueArea',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                if(data.length>1){
                    data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
                }
                $('#area').combobox('loadData', data);
                $('#area').combobox('select', data[0].org_no); //默认选中全部
                //console.log(data);
            }
        },
        error:function(data){
            alert("获取区域信息失败!");
        }
    });
}
function changeAera(areName,distributeName,tmp){
    areaNo =  $(areName).combobox('getValue');
    if(areaNo=='-1'){
        //区域选择的是全部
        var data = [{"distribute_name":"全部","distribute_no":"-1"}];
        $(distributeName).combobox('loadData', data);
        $(distributeName).combobox('select', "-1"); //默认选中全部
        if(tmp==1){
           // createTreeGrid();
        }
    }else{
        $.ajax({
            url : '/erp/common/areaCascadeController/getOperateCenter',
            data:'areaNo='+areaNo,
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                operateCenterNo='';
                if(data.length>0){
                    if($(distributeName).length>0){//控件是否存在
                        if(data.length>0){

                            if(data.length>1){
                                data.splice(0,0,{"distribute_name":"全部","distribute_no":"-1"});//增加全部选项 -1
                            }
//							console.log(data);
                            $(distributeName).combobox('loadData', data);
                            $(distributeName).combobox('select', data[0].distribute_no); //默认选中全部
                            if(tmp==1){

                              //  createTreeGrid();
                            }
                        }

                    }
                }
            },
            error:function(data){
                alert("获取运营中心信息失败!");
            }
        });
    }

}
function queryForm(){
    var startDate = $('#statStart').val();
    if(startDate==null || startDate=="" || startDate==" "){
        alert("请选择开始时间");
        return;
    }
    var endDate = $('#statEnd').val();
    if(endDate==null || endDate=="" || endDate==" "){
        alert("请选择结束时间");
        return;
    }
    var firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    var nowStr = firstDayOfMonth.format("yyyy-MM-dd");
    //var fort = firstDate.getFullYear()+"-"+(firstDate.getMonth()+1)+"-"+firstDate.getDate;

    if(nowStr == startDate &&  nowStr== endDate){
    }else{
        if(startDate>endDate){
            alert("开始时间必须小于等于结束时间");
            return;
        }
    }
    //
    isClickQuery = true;
    mini.get("resultGrid").reload();
    //createTreeGrid();
}
var controlInit = {
    "timeControl" : function() {
        var firstDate = new Date();
        firstDate.setDate(1); //第一天
        var endDate = new Date();
        endDate.setDate(endDate.getDate()-1);
        $("#statEnd").datetimepicker({
            language: 'zh-CN',
            clearBtn: true,
            autoclose: true,
            format: 'yyyy-mm-dd',
            startView: 2,
            minView: 2,
            initialDate:endDate,
            forceParse: false
        });

        //endDate.setDate(0);
        //$('#statEnd').datetimepicker('setStartDate', firstDate);
        $('#statEnd').datetimepicker('setEndDate', endDate);

        $("#statStart").datetimepicker({
            language: 'zh-CN',
            clearBtn: true,
            autoclose: true,
            format: 'yyyy-mm-dd',
            startView: 2,
            minView: 2,
            initialDate:endDate,
            forceParse: false
        });
        //$('#statStart').datetimepicker('setStartDate', firstDate);
        $('#statStart').datetimepicker('setEndDate', endDate);
    }
};

//打开导出确认窗口
function openExportConfirm(){
    var startDate = $('#statStart').val();
    if(startDate==null || startDate=="" || startDate==" "){
        alert("请选择开始时间");
        return;
    }
    var endDate = $('#statEnd').val();
    if(endDate==null || endDate=="" || endDate==" "){
        alert("请选择结束时间");
        return;
    }
    var firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    var nowStr = firstDayOfMonth.format("yyyy-MM-dd");
    //var fort = firstDate.getFullYear()+"-"+(firstDate.getMonth()+1)+"-"+firstDate.getDate;

    if(nowStr == startDate &&  nowStr== endDate){
    }else{
        if(startDate>endDate){
            alert("开始时间必须小于等于结束时间");
            return;
        }
    }
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
        url: "/erp/ShopRealTimeMonthController/exportLimit",
        data: {
            orgNo:$('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue'),
            distributeNo:$('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue'),
            shopName:$('#storeName').val(),
            shopLevel:$('#storeLevel').combobox('getValue'),
            statStart:$('#statStart').val(),
            statEnd:$('#statEnd').val(),
            storeId:$('#storeId').combobox('getValue')
        },
        success:function (data) {
            if(data.success){
                //初始化参数
                $("#orgNo").val($('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue'));
                $("#distributeNo").val($('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue'));
                $("#shopName").val($('#storeName').val());
                $("#shopLevel").val($('#storeLevel').val());
                $("#statStartE").val($('#statStart').val());
                $("#statEndE").val($('#statEnd').val());
                $("#storeIdE").val($('#storeId').combobox('getValue'));

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