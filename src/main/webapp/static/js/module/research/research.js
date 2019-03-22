/**
 * Created with IntelliJ IDEA.
 * User: yanbingxin
 * Date: 2015/8/24
 * Time: 14:23
 */
$(document).ready(function(){
    $('#area').combobox({
        editable:false,
        onChange:function(newValue,oldValue){
            areaNo =  $('#area').combobox('getValue');

            $.ajax({
                url : '/erp/common/areaCascadeController/hasAllOperateCenterPrivilege',
                data:'areaNo='+areaNo,
                type : 'POST',
                dataType : 'json',
                success : function(data) {
                    var operateAllflag = $.parseJSON(data);
                    changeAera(operateAllflag);
                },
                error:function(data){
                    alert("获取是否含有全部的运营中心失败!");
                }
            });
        }
    });
    $('#operateCenter').combobox({
        editable:false
    });
    $('#roleList').combobox({
        editable:false
    });

    hasAllArea();
    //initArea();
    initRoleLsit();
});

/**
 *  判断当前用户的区域权限是否是全国（#），然后再进行初始化区域
 */
function hasAllArea() {

    var areaAllflag = false;

    $.ajax({
        url : '/erp/common/areaCascadeController/hasAllAreaPrivilege',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            areaAllflag = $.parseJSON(data);
            initArea(areaAllflag);
        },
        error:function(data){
            alert("获取是否含有全国区域失败!");
        }
    });
}

//初始化区域
function initArea(areaAllflag){

    $.ajax({
        url : '/erp/common/areaCascadeController/getUserArea',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                if(data.length > 1 && areaAllflag){
                    data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
                }
                $('#area').combobox('loadData', getUniqueAreas(data));
                $('#area').combobox('select', data[0].org_no); //默认选中全部
                //console.log(data);
            }
        },
        error:function(data){
            alert("获取区域信息失败!");
        }
    });
}
function initRoleLsit(){
    $.ajax({
        url : '/erp/common/roleController/getRoleList',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                $('#roleList').combobox('loadData', data);
            }
        },
        error:function(data){
            alert("获取角色信息失败!");
        }
    });
}
function changeAera(operateAllflag){
    areaNo =  $('#area').combobox('getValue');
    console.log(areaNo);
    if(areaNo=='-1'){
        //区域选择的是全部
        var data = [{"distribute_name":"全部","distribute_no":"-1"}];
        $('#operateCenter').combobox('loadData', data);
        $('#operateCenter').combobox('select', "-1"); //默认选中全部
    }else{
        $.ajax({
            url : '/erp/common/areaCascadeController/getOperateCenter',
            data:'areaNo='+areaNo,
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                operateCenterNo='';
                if(data.length>0){
                    if($("#operateCenter").length>0){//控件是否存在
                        if(data.length>0){

                            if(data.length>1 && operateAllflag){
                                data.splice(0,0,{"distribute_name":"全部","distribute_no":"-1"});//增加全部选项 -1
                            }
                            $('#operateCenter').combobox('loadData', data);
                            $('#operateCenter').combobox('select', data[0].distribute_no); //默认选中全部
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
//$.messager.defaults = { ok: "是", cancel: "否" };
function submitForm(){
    ParamUtil.crateParams();
    var researchType=$('input[name="researchType"]:checked').val();
    var  titles=$("#researchTitle").val();
    var  researchUrl = $("#researchUrl").val();
    var arr = $('#roleList').combobox('getValues');
    var roleListStr = "";
    //判断role是否选择
    if(arr!=null||arr.length!=0){

        for(var i=0;i<arr.length;i++){
            roleListStr+=arr[i]+",";
        }
    }
    var params = {
        type: researchType,
        title: titles,
        url:researchUrl,
        createuserid:$('#userpin').val(),
        org:{org_no:$('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue')},
        distribute:{distribute_no:$('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue')},
        range:$('#area').combobox('getValue')=='-1'?0:1,
        'roleNoList':roleListStr
    };

    ParamUtil.addParam('Research',params);
    var res = vailduteForm();
    if(res!=null){
        //验证失败
        $.messager.alert("错误",res,'error');
        return;
    }
    $.messager.confirm("确认", "你确认提交？", function (r)
        {
            $.ajax({
                url :  '/execute/researchService/saveResearch',
                contentType : "application/json",
                type : "post",
                data:JSON.stringify(ParamUtil.getParams()),
                async : false,
                success : function(result) {
                    if(result.data==1){
                        alert("保存成功");
                        window.location.href="/getView/marketingManage/researchManage";
                    }else if(result.data==0){
                        jQuery.messager.alert('失败:','未找到对应发送用户!','提示');
                    }else if(result.data==2){
                        jQuery.messager.alert('失败:','调研链接缺少调研平台合法标识!','提示');
                    }
                    else {
                        jQuery.messager.alert('失败:','数据保存失败!','提示');
                    }

                }
            });
        }
    ) ;
}
//表单校验
function vailduteForm(){
    if(!$("#researchTitle").textbox('isValid')){
        return '标题填写不合规，必填不得超过50个字';
    }
    if(!$("#researchUrl").textbox('isValid')){
        return '调查链接填写不合规，必填符合url的地址';
    }
    if(!$("#roleList").combobox('isValid')){
        return '角色填写不合规，角色必填请填写角色选项';
    }
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