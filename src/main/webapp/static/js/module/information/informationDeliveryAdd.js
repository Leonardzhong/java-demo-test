//初始化方法
$(document).ready(function () {

    UE.getEditor('informationContent');

    $('.timeControl').datetimepicker({
        language: 'zh-CN',
        todayBtn: "linked",
        clearBtn: true,
        autoclose: true
    });

    //初始化区域
    hasAllArea();
    //initArea();

    $("#orgNo").change(function(){
        var areaNo = $(this).val();
        $.ajax({
            url : '/erp/common/areaCascadeController/hasAllOperateCenterPrivilege',
            data:'areaNo='+ areaNo,
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                var operateAllflag = $.parseJSON(data);
                changeAera(areaNo,operateAllflag);
            },
            error:function(data){
                alert("获取是否含有全部的运营中心失败!");
            }
        });
    })
    //初始化角色
    initRoleList();

    //初始化表单验证
    $('form').validator({
        theme: 'default',
        stopOnError: false,
        focusInvalid: false,
        ignore: 'hidden'
    });

    $("#saveBtn").click(function(){
        save();
    });

    $("#gobackBtn").click(function(){
        window.history.back();
    });

    $("#file").change(function(){
        var fileName = $(this).val();
       var suffixs=  $("#suffix").val().toLocaleLowerCase().split("|");
        try{
            var suffix = fileName.split(".")[fileName.split(".").length-1].toLocaleLowerCase();
            var isValidateFile = false;
            for(var i=0;i<suffixs.length;i++){
                if(suffixs[i] ==suffix ){
                    isValidateFile=true;
                    break;
                }
            }
            if(isValidateFile == true){
                $("#fileName").html($(this).val());
            }else{
                alert("文件格式不正确");
                $("#file").val("");
            }
        }catch(e){
            alert("文件格式不正确");
        }
    });

    $("#clearFile").click(function(){
        $("#file").val("");
        $("#fileName").html("");
    })
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

/**
 * 初始化区域
 */
function initArea(areaAllflag) {
    $.ajax({
        url: '/erp/common/areaCascadeController/getUserArea',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                if(data.length > 1 && !areaAllflag) {
                    $('#orgNo').empty();
                }
                data = getUniqueAreas(data);
                for(var i=0;i<data.length;i++){
                    $('#orgNo').append("<option value='"+data[i]['org_no']+"'>"+data[i]['org_name']+"</option>");
                }
                if(data.length > 1 && !areaAllflag) {
                    changeAera(data[0]['org_no'],true);
                }
            }
        },
        error: function (data) {
            alert("获取区域信息失败!");
        }
    });
}

/**
 * 区域与配送中心联动
 * @param orgNo
 */
function changeAera(orgNo,operateAllflag) {
    if(orgNo != ""){
        $.ajax({
            url: '/erp/common/areaCascadeController/getOperateCenter',
            data: 'areaNo=' + orgNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    $('#distributeNo').empty();
                    if(data.length > 1 && operateAllflag){
                        $('#distributeNo').append("<option value='#'>全部</option>");
                    }
                    for(var i=0;i<data.length;i++){
                        $('#distributeNo').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
                    }
                }
            },
            error: function (data) {
                alert("获取运营中心信息失败!");
            }
        });
    }
}

function initRoleList(){
    $('#intranetRole').multiselect({
        nonSelectedText: '请选择',
        buttonWidth: '100%',
        buttonClass:'multiselect dropdown-toggle btn btn-default btn-sm',
        enableFiltering: true,
        includeSelectAllOption: true,
        enableCaseInsensitiveFiltering: true,
        onChange: function(option, checked) {
        },
        onDropdownHide: function(event) {
        }
    });
    $.ajax({
        url : '/erp/common/roleController/getRoleList',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    $("<option value='"+data[i].roleNo+"'>"+data[i].roleName+"</option>").appendTo($("#intranetRole"));
                }
                $("#intranetRole").multiselect('rebuild');//刷新内容。
            }
        },
        error:function(data){
            alert("获取内部角色信息失败!");
        }
    });

    $('#extranetRole').multiselect({
        nonSelectedText: '请选择',
        buttonWidth: '100%',
        buttonClass:'multiselect dropdown-toggle btn btn-default btn-sm',
        enableFiltering: true,
        includeSelectAllOption: true,
        enableCaseInsensitiveFiltering: true,
        onChange: function(option, checked) {
        },
        onDropdownHide: function(event) {
        }
    });
    $.ajax({
        url : '/erp/common/roleController/getExternalRoleList',
        data: {loginUser: $("#loginUser").val()},
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    $("<option value='"+data[i].roleNo+"'>"+data[i].roleName+"</option>").appendTo($("#extranetRole"));
                }
                $("#extranetRole").multiselect('rebuild');//刷新内容。
            }
        },
        error:function(data){
            alert("获取外部角色信息失败!");
        }
    });

}

/**
 * 保存
 */
function save(){

    if($('#insertForm').trigger("validate").isValid()){

        if($("#intranetRole").val()==null && $("#extranetRole").val()==null){
            $('#insertForm').validator('showMsg', '#intranetRole', {
                type: "error",
                msg: "请至少填写一种"
            });
            $('#insertForm').validator('showMsg', '#extranetRole', {
                type: "error",
                msg: "请至少填写一种"
            });
            return false;
        }else{
            $('#insertForm').validator('hideMsg', '#intranetRole');
            $('#insertForm').validator('hideMsg', '#extranetRole');
        }

        var intranetRoleName = "";
        var intranetRoles = $("#intranetRole").val();
        if(intranetRoles != null){
            for(var i=0; i<intranetRoles.length; i++){
                intranetRoleName = intranetRoleName + "," + $("#intranetRole").find("option[value='"+intranetRoles[i]+"']").text();
            }
            intranetRoleName = intranetRoleName.substring(1);
        }

        var extranetRoleName = "";
        var extranetRoles = $("#extranetRole").val();
        if(extranetRoles != null){
            for(var i=0; i<extranetRoles.length; i++){
                extranetRoleName = extranetRoleName + "," + $("#extranetRole").find("option[value='"+extranetRoles[i]+"']").text();
            }
            extranetRoleName = extranetRoleName.substring(1);
        }

        var formData = new FormData();//用form 表单直接 构造formData 对象; 就不需要下面的append 方法来为表单进行赋值了。
        formData.append("orgNo", $("#orgNo").val());
        formData.append("orgName", $("#orgNo").find("option:selected").text());
        formData.append("distributeNo", $("#distributeNo").val());
        formData.append("distributeName", $("#distributeNo").find("option:selected").text());
        formData.append("intranetRole", $("#intranetRole").val());
        formData.append("intranetRoleName", intranetRoleName);
        formData.append("extranetRole", $("#extranetRole").val());
        formData.append("extranetRoleName", extranetRoleName);
        formData.append("informationType", $("#informationType").val());
        formData.append("informationTitle", $("#informationTitle").val());
        formData.append("file", $("#file")[0].files[0]);
        formData.append("informationContent",UE.getEditor('informationContent').getContent());

        jQuery.ajax({
            type: "POST",
            url: "/erp/informationDelivery/insert?loginUser="+$("#loginUser").val(),
            data: formData,
            processData : false,
            timeout:1000 * 10000,
            contentType : false,
            success:function (data) {
                if(data.status == true){
                    alert("保存成功!")
                    window.location.href = "/erp/informationDelivery/index";
                }else{
                    alert(data.msg)
                }

            },
            error : function(data){
                alert("保存失败!");
            }
        });

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


