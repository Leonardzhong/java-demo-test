//初始化方法
$(document).ready(function () {
    $('.timeControl').datetimepicker({
        language: 'zh-CN',
        todayBtn: "linked",
        clearBtn: true,
        autoclose: true
    });

    //初始化区域
    initArea();
    $("#orgNo").change(function(){
        changeAera($(this).val());
    })
    $("#orgNoU").change(function(){
        changeAeraU($(this).val());
    })
    //初始化角色
    initRoleList();


    initDataTable();

    $('#pageNo').keydown(function(e){
        if(e.keyCode==13){
           pageChangeEnter();
        }
    });

    $("#updateBtn").click(function(){
        update();
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
 * 初始化区域
 */
function initArea() {
    $.ajax({
        url: '/erp/common/areaCascadeController/getUserArea',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                data = getUniqueAreas(data);
                for(var i=0;i<data.length;i++){
                    $('#orgNo').append("<option value='"+data[i]['org_no']+"'>"+data[i]['org_name']+"</option>");
                    $('#orgNoU').append("<option value='"+data[i]['org_no']+"'>"+data[i]['org_name']+"</option>");
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
function changeAera(orgNo) {
    if(orgNo != ""){
        $.ajax({
            url: '/erp/common/areaCascadeController/getOperateCenter',
            data: 'areaNo=' + orgNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    $('#distributeNo').empty();
                    if(data.length > 1){
                        $('#distributeNo').empty().append("<option value=''>请选择</option>");
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
    } else {
        $('#distributeNo').empty().append("<option value=''>请选择</option>");
    }
}

function initRoleList(){

    var setting = {
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
    }

    $('#intranetRole, #intranetRoleU').multiselect(setting);
    $.ajax({
        url : '/erp/common/roleController/getRoleList',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    $("<option value='"+data[i].roleNo+"'>"+data[i].roleName+"</option>").appendTo($("#intranetRole, #intranetRoleU"));
                }
                $("#intranetRole, #intranetRoleU").multiselect('rebuild');//刷新内容。
            }
        },
        error:function(data){
            alert("获取内部角色信息失败!");
        }
    });

    $('#extranetRole, #extranetRoleU').multiselect(setting);
    $.ajax({
        url : '/erp/common/roleController/getExternalRoleList',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    $("<option value='"+data[i].roleNo+"'>"+data[i].roleName+"</option>").appendTo($("#extranetRole, #extranetRoleU"));
                }
                $("#extranetRole, #extranetRoleU").multiselect('rebuild');//刷新内容。
            }
        },
        error:function(data){
            alert("获取内部角色信息失败!");
        }
    });

}


function query(){
    changePageSize();
    //$("#resultGrid").DataTable().ajax.reload();
}

var initDataTable = function() {

    var dataTable = $("#resultGrid").on('xhr.dt', function ( e, settings, json, xhr ) {
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
        ordering:  false,
        "dom": '<"toolbar"<"row"<"col-md-6"<"btnPlace">>>>rt',
        iDisplayLength: $('#pageRange').val(),
        showRowNumber:true,
        columns : [
            {
                width: 5,
                "searchable": false,
                "orderable": false,
                data: null
            },
            {
                width: 80,
                "searchable": false,
                "orderable": false,
                data: "orgName"
            },
            {
                width: 80,
                "searchable": false,
                "orderable": false,
                data: "distributeName"
            },
            {
                width: 300,
                "searchable": false,
                "orderable": false,
                data: "informationTitle"
            },
            {
                width: 60,
                "searchable": false,
                "orderable": false,
                data: "informationType",
                render : function(data, type, row) {
                    if(data == 1){
                        return "新闻";
                    }else if(data == 2){
                        return "公告";
                    }else if(data == 3){
                        return "培训资料";
                    }else{
                        return "";
                    }

                }
            },
            {
                width: 200,
                "searchable": false,
                "orderable": false,
                data: "intranetRoleName",
                render : function(data, type, row) {
                    if(data!=null&&data!=undefined&&data.length > 10){
                        data = "<span title='"+ data+"'>"+ data.substring(0,10)+"..."+"<span/>";
                        return data;
                    }else{
                        if(data!=null&&data!=undefined){
                            return data;
                        }else{
                            return "";
                        }
                    }
                }
            },
            //{
            //    width: 100,
            //    "searchable": false,
            //    "orderable": false,
            //    data: "extranetRoleName"
            //},
            {
                width: 60,
                "searchable": false,
                "orderable": false,
                data: "createPin"
            },
            {
                width: 60,
                "searchable": false,
                "orderable": false,
                data: "attachment",
                render : function(data, type, row) {
                    if(data == null){
                        return "无";
                    }else{
                        return "有";
                    }

                }
            },
            {
                width: 50,
                "searchable": false,
                "orderable": false,
                data: "browseCount"
            },

            {
                width: 50,
                "searchable": false,
                "orderable": false,
                data: "downloadCount"
            },
            {
                width: 50,
                "searchable": false,
                "orderable": false,
                data: "updateTimeBegin"
            },
            {
                data : null,
                width: 100,
                "searchable": false,
                "orderable": false,
                "bSort":false,
                render : function(data, type, row) {
                    var result = '';
                    result = result + '<a href="javascript:openUpdateWindow(\''+row.id+'\');">修改</a>　';
                    result = result + '<a href="javascript:deleteByPrimaryKey(\''+row.id+'\');">删除</a>';
                    return result;
                }
            }
        ],
        "aoColumnDefs": [{"bSortable": false, "aTargets": [0]}],
        ajax : {
            "url" : "/erp/informationDelivery/pageQuery.json",
            "method": "POST",
            dataType:'json',
            "data":function (){
                var intranetRole = "";
                var intranetRoles = $('#intranetRole').val();
                if(intranetRoles != null){
                    for(var i=0; i<intranetRoles.length; i++ ){
                        intranetRole = intranetRole + "," + intranetRoles[i];
                    }
                    intranetRole = intranetRole.substring(1);
                }

                var extranetRole = "";
                var extranetRoles = $('#extranetRole').val();
                if(extranetRoles != null){
                    for(var i=0; i<extranetRoles.length; i++ ){
                        extranetRole = extranetRole + "," + extranetRoles[i];
                    }
                    extranetRole = extranetRole.substring(1);
                }


                return {
                    "orgNo":$('#orgNo').val(),
                    "distributeNo":$('#distributeNo').val(),
                    "intranetRole":intranetRole,
                    "extranetRole":extranetRole,
                    "informationTitle":$('#informationTitle').val(),
                    "createPin":$('#createPin').val(),
                    "informationType":$('#informationType').val(),
                    "createTimeBegin":$('#createTimeBegin').val(),
                    "createTimeEnd":$('#createTimeEnd').val(),
                    "pageSize":$('#pageRange').val(),
                    "pageNum":pagenum,
                    "loginUser":$("#loginUser").val()
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
        }
    });

    dataTable.on('order.dt search.dt', function() {
        dataTable.column(0, {
            search: 'applied',
            order: 'applied'
        }).nodes().each(function(cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();
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

/**
 * 根据主键删除数据
 * @param id 主键ID
 */
function deleteByPrimaryKey(id){
    $.messager.confirm('确认','是否确认删除数据？',function(r){
        if (r){
            jQuery.ajax({
                type:"POST",
                dataType:'json',
                url: "/erp/informationDelivery/deleteByPrimaryKey",
                data:{
                    id:  id
                },
                success:function (data) {
                    $("#resultGrid").DataTable().ajax.reload();
                    alert("删除成功");

                },
                error : function(data){
                    alert("删除失败");
                }
            });
        }
    });
}

/**
 * 区域与配送中心联动
 * @param orgNo
 */
function changeAeraU(orgNo) {
    if(orgNo != ""){
        $.ajax({
            url: '/erp/common/areaCascadeController/getOperateCenter',
            data: 'areaNo=' + orgNo,
            type: 'POST',
            dataType: 'json',
            async: false,
            success: function (data) {
                if (data.length > 0) {
                    if(data.length > 1){
                        $('#distributeNoU').empty().append("<option value='#'>全部</option>");
                    }
                    for(var i=0;i<data.length;i++){
                        $('#distributeNoU').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
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
 * 打开维护窗口
 * @param userCode 用户编码
 */
function openUpdateWindow(id){

    $('#updateBtnModal').modal('show')
    $("#updateForm")[0].reset();
    $("#file").val("");
    $("#fileName").html("");

    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        url: "/erp/informationDelivery/selectByPrimaryKey",
        data: {
            id: id
        },
        success:function (data) {

            $('#idU').val(data.id);
            $('#orgNoU').val(data.orgNo);
            changeAeraU(data.orgNo);
            $('#distributeNoU').val(data.distributeNo);

            if(data.intranetRole != null && data.intranetRole != ""){
                var intranetRoles = data.intranetRole.split(",");
                $('#intranetRoleU').val(intranetRoles);
                $('#intranetRoleU').multiselect("refresh");
            }
            if(data.extranetRole !=  null && data.extranetRole != ""){
                var extranetRoles = data.extranetRole.split(",");
                $('#extranetRoleU').val(extranetRoles);
                $('#extranetRoleU').multiselect("refresh");
            }
            $('#informationTypeU').val(data.informationType);
            $('#informationTitleU').val(data.informationTitle);

            var uploadFile = data.attachment;
            if(uploadFile != null){
                var uploadFileJson = JSON.parse(uploadFile);
                $('#attachmentName').html(uploadFileJson.fileName);
                $('#downLoadUrl').html(uploadFileJson.downLoadUrl);
            }

            UE.getEditor('informationContentU').setContent(data.informationContent);

        },
        error : function(data){
            alert("获取数据失败");
        }
    });

}

/**
 * 保存
 */
function update(){
    if($('#updateForm').trigger("validate").isValid()){
        if($("#intranetRoleU").val()==null && $("#extranetRoleU").val()==null){
            $('#updateForm').validator('showMsg', '#intranetRoleU', {
                type: "error",
                msg: "请至少填写一种"
            });
            $('#updateForm').validator('showMsg', '#extranetRoleU', {
                type: "error",
                msg: "请至少填写一种"
            });
            return false;
        }else{
            $('#updateForm').validator('hideMsg', '#intranetRoleU');
            $('#updateForm').validator('hideMsg', '#extranetRoleU');
        }

        var intranetRoleName = "";
        var intranetRoles = $("#intranetRoleU").val();
        if(intranetRoles != null){
            for(var i=0; i<intranetRoles.length; i++){
                intranetRoleName = intranetRoleName + "," + $("#intranetRoleU").find("option[value='"+intranetRoles[i]+"']").text();
            }
            intranetRoleName = intranetRoleName.substring(1);
        }

        var extranetRoleName = "";
        var extranetRoles = $("#extranetRoleU").val();
        if(extranetRoles != null){
            for(var i=0; i<extranetRoles.length; i++){
                extranetRoleName = extranetRoleName + "," + $("#extranetRoleU").find("option[value='"+extranetRoles[i]+"']").text();
            }
            extranetRoleName = extranetRoleName.substring(1);
        }

        var formData = new FormData();
        formData.append("id", $("#idU").val());
        formData.append("orgNo", $("#orgNoU").val());
        formData.append("orgName", $("#orgNoU").find("option:selected").text());
        formData.append("distributeNo", $("#distributeNoU").val());
        formData.append("distributeName", $("#distributeNoU").find("option:selected").text());
        formData.append("intranetRole", $("#intranetRoleU").val());
        formData.append("intranetRoleName", intranetRoleName);
        formData.append("extranetRole", $("#extranetRoleU").val());
        formData.append("extranetRoleName", extranetRoleName);
        formData.append("informationType", $("#informationTypeU").val());
        formData.append("informationTitle", $("#informationTitleU").val());
        formData.append("file", $("#file")[0].files[0]);
        formData.append("informationContent",UE.getEditor('informationContentU').getContent());




        jQuery.ajax({
            type: "POST",
            url: "/erp/informationDelivery/updateByPrimaryKey?loginUser="+$("#loginUser").val(),
            data: formData,
            processData : false,
            timeout:1000 * 10000,
            contentType : false,
            success:function (data) {
                if(data.status == true){
                    $('#updateBtnModal').modal('hide');
                    alert("保存成功");
                    $("#resultGrid").DataTable().ajax.reload();
                }else{
                    $('#updateBtnModal').modal('hide');
                    alert(data.msg);
                }




            },
            error : function(data){
                alert("保存失败!");
            }
        });
    }

}

/**
 * 打开新增页面
 */
function openInsertPage(){
    window.location.href = "/erp/informationDelivery/insertPage";
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

