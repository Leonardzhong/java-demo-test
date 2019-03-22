/**
 * Created with IntelliJ IDEA.
 * User: yanbingxin
 * Date: 2015/8/18
 * Time: 11:18
 */
$(document).ready(function(){
    $('#researchDetailsWind').window({
        title:'资源详情',
        width:1000,
        height:500,
        modal:true,
        closed:true
    });
    $('#status').combobox({
        data:[{
            "id":-1,
            "text":"全部" ,
            "selected":true
        },{
            "id":0,
            "text":"未完成"

        },{
            "id":1,
            "text":"已完成"
        }],
        valueField:'id',
        textField:'text',
        editable:false
    });
    $('#statusdetail').combobox({
        data:[
            {
                "id":-1,
                "text":"全部" ,
                "selected":true
            },{
                "id":0,
                "text":"未完成"
            },{
                "id":1,
                "text":"已完成"
            }],
        editable:false,
        valueField:'id',
        textField:'text'
    });
    $('#reseachType').combobox({
        data:[  {
            "id":-1,
            "text":"全部" ,
            "selected":true
        },{
            "id":0,
            "text":"价格调研"
        },{
            "id":1,
            "text":"市场调研"
        },{
            "id":2,
            "text":"其他调研"

        }],
        editable:false,
        valueField:'id',
        textField:'text'
    });

    //选择区域获取运营中心联动
    $('#area').combobox({
        editable:false,
        onChange:function(newValue,oldValue){
            changeAera('#area','#operateCenter',1);
        }
    });
    $('#recviearea').combobox({
        editable:false,
        onChange:function(newValue,oldValue){
            changeAera('#recviearea','#recvieCenter',1);
        }
    });
    $('#areadetail').combobox({
        editable:false,
        onChange:function(newValue,oldValue){
            changeAera('#areadetail','#operateCenterdetail',1);
        }
    });
    $('#operateCenter').combobox({
        editable:false
    });
    $('#recvieCenter').combobox({
        editable:false
    });
    $('#operateCenterdetail').combobox({
        editable:false
    });
    initArea();
    createTable();
});

// 改变区域联动运营中心
function changeAera(areName,distributeName,tmp){
    areaNo =  $(areName).combobox('getValue');
    if(areaNo=='-1'){
        //区域选择的是全部
        var data = [{"distribute_name":"全部","distribute_no":"-1"}];
        $(distributeName).combobox('loadData', data);
        $(distributeName).combobox('select', "-1"); //默认选中全部

        /*if(tmp==1){
              createTable();
              //createDetailTable();
        }*/

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

                            $(distributeName).combobox('loadData', data);
                            $(distributeName).combobox('select', data[0].distribute_no); //默认选中全部

                            /*if(tmp==1){
                                createTable();
                               //createDetailTable();
                            }*/
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
/**
 * 初始化区域: area创建人需要全部显示，receive接收人区域显示权限部分
 */
function initArea(){
    $.ajax({
        url : '/erp/common/areaCascadeController/getUserArea',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                if(data.length>1){
                    data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
                }
                $('#recviearea').combobox('loadData', getUniqueAreas(data));
                $('#recviearea').combobox('select', data[0].org_no); //默认选中全部
                $('#areadetail').combobox('loadData', getUniqueAreas(data));
                $('#areadetail').combobox('select', data[0].org_no); //默认选中全部
            }
        },
        error:function(data){
            alert("获取区域信息失败!");
        }
    });
    /*ParamUtil.crateParams();
    ParamUtil.addParam('String',"");
    //获取全部的运营中心，和erp无关
    josnRequest('/erp/common/areaCascadeController/getAllArea',ParamUtil.getParams(),function(data){
        alert(data);
        if(data.length>0){
            if(data.length>1){
                data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
            }
            $('#area').combobox('loadData',  getUniqueAreas(data));
            $('#area').combobox('select', data[0].org_no); //默认选中全部
        }
    });*/
    $.ajax({
        url : '/erp/common/areaCascadeController/getAllArea',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                if(data.length>1){
                    data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
                }
                $('#area').combobox('loadData',  getUniqueAreas(data));
                $('#area').combobox('select', data[0].org_no); //默认选中全部
            }
        },
        error:function(data){
            alert("获取区域信息失败!");
        }
    });
}
function createTable(){
    ParamUtil.crateParams();


    //创建查询条件page对象
    var page = {
        param:{
            createTime:$('#beginTime').datebox('getValue')!=''?$('#beginTime').datebox('getValue')+' 00:00:00':'',//创建时间开始
            createTimeEnd:$('#endTime').datebox('getValue')!=''?$('#endTime').datebox('getValue')+' 23:59:59':'',//创建时间 至datebox
            ERP:$('#erp').val(),
            research:{
                createUserName:$("#createUser").val(),
                type:$('#reseachType').combobox('getValue')=='-1'?"":$('#reseachType').combobox('getValue'),
                org:{org_no:$('#recviearea').combobox('getValue')=='-1'?"":$('#recviearea').combobox('getValue')},//区域no
                distribute:{distribute_no:$('#recvieCenter').combobox('getValue')=='-1'?"":$('#recvieCenter').combobox('getValue')},//运营中心no
                author:{orgNo:$('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue'),
                        distributeNo:$('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue')
                },
                status:$('#status').combobox('getValue')=='-1'?-1:$('#status').combobox('getValue')
            }
        }};

    ParamUtil.addParam('Page',page);
    $('#researchGrid').datagrid({
        url : '/execute/researchService/queryForPageResearch.json',
        queryParams: {'params':ParamUtil.getParams()},
        rownumbers:false,
        striped:true,
        singleSelect:true,
        columns : [ [
            {
                field : 'ck',
                checkbox: true
            },
            {
                field : 'createTime',
                title : '建立时间',
                width : '100',
                align:'center',
                formatter: function(value,row,index){
                    var date = new Date();
                    date.setTime(value);
                    return date.format('yyyy-MM-dd');
                }
            },
            {
                field : 'title',
                title : '调研报告题目',
                width : '100',
                align:'center'
            },
            {
                field : 'type',
                title : '报告类型',
                width : '100',
                align:'center',
                formatter: function(value,row,index){
                    var str="";
                    if(value==0){
                        str="价格调研";
                    } else if(value==1){
                        str="市场调研";
                    } else{
                        str="其他调研";
                    }
                    return str;
                }
            }, {
                field : 'status',
                title : '调研状态',
                width : '100',
                align:'center',
                formatter: function(value,row,index){
                    return value==0?'未完成':'已完成';
                }
            }, {
                field : 'comment',
                title : '完成情况',
                width : '100',
                align:'center'
            }, {
                field : 'range',
                title : '发送范围',
                width : '100',
                align:'center',
                formatter: function(value,row,index){
                    return value==0?'全国':'部分';
                }
            },
            {
                field : 'url',
                title : '调研链接',
                width : '350',
                align:'center'
            },
            {
                field : 'createDepart',
                title : '创建人部门',
                width : '100',
                align:'center'
            },
            {
                field : 'createUserName',
                title : '创建人',
                width : '100',
                align:'center'
            },
            {
                field : '操作',
                title : '操作',
                width : '100',
                align:'center',
                formatter: function(value,row,index){
                    return '<a href="javascript:queryResearchDetail('+index+');">详情</a>';
                }
            }
        ] ],
        pagination:true,
        loader: gridPageLoader,
        onDblClickRow: function (rowIndex, rowData) {
            //console.log('123'+rowData);
            queryResearchDetail(rowIndex);
        }
    });
}
/**
 * 查询信息详细
 */
var research;
function queryResearchDetail(index){
    research = $('#researchGrid').datagrid("getRows")[index];
    $('#statusdetail').combobox('clear');
    //$('#areadetail').combobox('clear');
    //$('#operateCenterdetail').combobox('clear');
    $("#createUserDetail").textbox('setValue','');
    $("#beginDetailTime").textbox('setValue','');
    $("#endDetailTime").textbox('setValue','');
    createDetailTable(research);
    $('#researchDetailsWind').window('open');
}

function createDetailTable(obj){
    ParamUtil.crateParams();

    //创建查询条件page对象
    var page = {
        param:{
            complitTime:$('#beginDetailTime').datebox('getValue')!=''?$('#beginDetailTime').datebox('getValue')+' 00:00:00':'',//创建时间开始
            complitTimeEnd:$('#endDetailTime').datebox('getValue')!=''?$('#endDetailTime').datebox('getValue')+' 23:59:59':'',//创建时间 至datebox
            ERP:$('#erp').val(),
            status: $('#statusdetail').combobox('getValue')==-1?"":$('#statusdetail').combobox('getValue'),
            orgNo:$('#areadetail').combobox('getValue')=='-1'?"":$('#areadetail').combobox('getValue'),
            distributeNo: $('#operateCenterdetail').combobox('getValue')=='-1'?"":$('#operateCenterdetail').combobox('getValue'),
            userName:$("#createUserDetail").val(),
            research:obj
        }};

    ParamUtil.addParam('Page',page);
    $('#researchDetailGrid').datagrid({
        url : '/execute/researchRecordService/queryForPageResearchRecord.json',
        queryParams: {'params':ParamUtil.getParams()},
        rownumbers:false,
        striped:true,
        singleSelect:true,
        columns : [ [
            {
                field : 'ck',
                checkbox: true
            },
            {
                field : 'createTime',
                title : '建立时间',
                width : '100',
                align:'center',
                formatter: function(value,row,index){
                    var date = new Date();
                    date.setTime(value);
                    return date.format('yyyy-MM-dd');
                }
            },
            {
                field : 'title',
                title : '调研报告题目',
                width : '100',
                align:'center'
            },
            {
                field : 'type',
                title : '报告类型',
                width : '100',
                align:'center',
                formatter: function(value,row,index){
                    var str="";
                    if(value=0){
                        str="价格调研";
                    } else if(value=1){
                        str="市场调研";
                    } else{
                        str="其他调研";
                    }
                    return str;
                }
            },
            {
                field : 'status',
                title : '调研状态',
                width : '100',
                align:'center',
                formatter: function(value,row,index){
                    return value==0?'未完成':'已完成';
                }
            },
            {
                field : 'recviceUserName',
                title : '接收人姓名',
                width : '100',
                align:'center'
            },
            {
                field : 'boundErp',
                title : '接收人ERP',
                width : '100',
                align:'center'
            },   {
                field : 'url',
                title : '调研链接',
                width : '350',
                align:'center'
            }
        ] ],
        pagination:true,
        loader: gridPageLoader,
        onDblClickRow: function (rowIndex, rowData) {
            //console.log('123'+rowData);
        }
    });


}
/**
 * 点击查询按钮，重新构建列表
 */
function queryForm(){
    if(!compare('beginTime','endTime')){
        $.messager.alert('提示','发送时间前大于后，请修改！');
        return;
    }
    createTable();
}
function queryDetail(){
    if(!compare('beginDetailTime','endDetailTime')){
        $.messager.alert('提示','完成时间前大于后，请修改！');
        return;
    }
    createDetailTable(research);
}

/**
 * 多区域数组去除重复数据
 */
function getUniqueAreas(arr){
    var result = [];    // 返回结果
    var temp = [];      // 临时存放多区域编号
    for (var i = 0, len = arr.length; i < len; i++) {
        if (temp.indexOf(arr[i].org_no) == -1) {
            temp.push(arr[i].org_no);
            result.push(arr[i]);
        }
    }
    return result;
}