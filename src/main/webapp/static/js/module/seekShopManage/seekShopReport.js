
/**
 * Created by huhuanye on 2016/7/5.
 */
//初始化方法
$(document).ready(function () {

    //初始化表单验证
 
    $('form').validator({
        theme: 'default',
        stopOnError: false,
        focusInvalid: false,
        ignore: 'hidden'
    });
    //初始化区域
    initReportArea();
    $("#org_no").change(function(){
        changeAera($(this).val());
    });
    $("#org_no_add").change(function(){
        changeAeraAdd($(this).val());
    });
    $("#reportFile").change(function(){
       
        var fileName = $(this).val();
        try{
            var fileNameList=fileName.split("\\");
            var reportName=fileNameList[fileNameList.length-1];
            var suffixList=fileName.split(".");
            var suffix = suffixList[suffixList.length-1].toLocaleLowerCase();
            if(suffix == "pdf"){
                $("#reportFileName").val(reportName);
            }else{
                alert("文件格式不正确");
                $("#reportFile").val("");
                $("#reportFileName").val("");
            }
        }catch(e){
            alert("文件格式不正确");
        }
    });
    initReportTable();
    alert("bind keydown")
    $('#pageNo').keydown(function(e){
       
        alert("pageNo keydown")
        if(e.keyCode==13){
            pageChangeEnter();
        }
    });

    $('#pageNo').change(function(e){
        if(e.keyCode==13){
            pageChangeEnter();
        }
    });
    $("#clearFile").click(function(){
       
        $("#reportFile").val("");
        $("#fileName").html("");
    });
});

function addReportModel(){
    $("#insertSeekReportForm")[0].reset();
    //$('#addBtnModal').modal('empty');
    $('#addBtnModal').modal('show');
}

/**
 * 保存巡店报告数据
 */
function saveReportDate(){

    if($('#insertSeekReportForm').trigger("validate").isValid()){
       

        var orgName=$("#org_no_add").find("option:selected").text();
        var distributeName=$("#operateCenter_add").find("option:selected").text();
        $("#org_name_add").val(orgName);
        $("#operateCenterName_add").val(distributeName);
        if($("#highlight_add").val()==null||$("#highlight_add").val()==""){
            alert("请输入门店优点");
            return false;
        }
        if($("#highlight_add").val().length>200){
            $('#insertSeekReportForm').validator('showMsg', '#highlight_add', {
                type: "error",
                msg: "所输入内容大于200字"
            });
            return false;
        }
        if($("#insufficient_add").val()==null||$("#insufficient_add").val()==""){
            alert("请输入门店问题");
            return false;
        }
        if($("#insufficient_add").val().length>200){
            $('#insertSeekReportForm').validator('showMsg', '#insufficient_add', {
                type: "error",
                msg: "所输入内容大于200字"
            });
            return false;
        }
        if($("#improvement_add").val()==null||$("#improvement_add").val()==""){
            alert("请输入门店改善点");
            return false;
        }
        if($("#improvement_add").val().length>200){
            $('#insertSeekReportForm').validator('showMsg', '#improvement_add', {
                type: "error",
                msg: "所输入内容大于200字"
            });
            return false;
        }
        if($("#reportFileName").val().length<=0){
            alert("请上传文件");
            return false;
        }
        //if($("#reportFile").val().length<=0){
        //    alert("请上传文件");
        //    return false;
        //}
        var suffixList=$("#reportFileName").val().split(".");
        var suffix = suffixList[suffixList.length-1].toLocaleLowerCase();
        if(suffix != "pdf"){
            alert("文件格式不正确,请选择PDF格式文件");
            return false;
        }
        //var params = $("#insertSeekReportForm").serialize();
        //var formData = new FormData();//用form 表单直接 构造formData 对象; 就不需要下面的append 方法来为表单进行赋值了。
        //var org=$("#org_no_add").val();
        //formData.append("orgNo", org);
        //formData.append("orgName", $("#org_no_add").find("option:selected").text());
        //formData.append("distributeNo", $("#operateCenter_add").val());
        //formData.append("distributeName", $("#operateCenter_add").find("option:selected").text());
        //formData.append("month", $("#month_add").val());
        //formData.append("title", $("#report_title_add").val());
        //formData.append("highlight", $("#highlight_add").val());
        //formData.append("insufficient", $("#insufficient_add").val());
        //formData.append("improvement", $("#improvement_add").val());
        //formData.append("jssAttachement", $('#uploadedInput').val());

        $("#insertSeekReportForm").submit();

        //jQuery.ajax({
        //    type: "POST",
        //    url: "/erp/seekShopReportController/insertSeekReport",
        //    data: params,
        //    dataType: 'json',
        //    processData : false,
        //    //contentType: "multipart/form-data",
        //    success:function (data) {
        //        alert("保存成功!")
        //        window.location.href = "/erp/seekShopReportController/query";
        //    },
        //    error : function(data){
        //       
        //        alert("保存失败!");
        //    }
        //});
    }
}

/**
 * 更新巡店报告数据
 */
function updateReportDate(){

    if($('#updateSeekReportForm').trigger("validate").isValid()){
       

        var orgName=$("#org_no_update").find("option:selected").text();
        var distributeName=$("#operateCenter_update").find("option:selected").text();
        $("#org_name_update").val(orgName);
        $("#operateCenterName_update").val(distributeName);
        if($("#highlight_update").val().length>200){
            $('#updateSeekReportForm').validator('showMsg', '#highlight_update', {
                type: "error",
                msg: "所输入内容大于200字"
            });
            return false;
        }
        if($("#insufficient_update").val().length>200){
            $('#updateSeekReportForm').validator('showMsg', '#insufficient_update', {
                type: "error",
                msg: "所输入内容大于200字"
            });
            return false;
        }
        if($("#improvement_update").val().length>200){
            $('#updateSeekReportForm').validator('showMsg', '#improvement_update', {
                type: "error",
                msg: "所输入内容大于200字"
            });
            return false;
        }
        if($("#uploadReportFileName").val().length<=0){
            alert("请上传文件");
            return false;
        }
        var suffixList=$("#uploadReportFileName").val().split(".");
        var suffix = suffixList[suffixList.length-1].toLocaleLowerCase();
        if(suffix != "pdf"){
            alert("文件格式不正确,请选择PDF格式文件");
            return false;
        }
        $("#updateSeekReportForm").submit();
    }
}

/**
 * 查询巡店报告数据
 */
function queryReport(){
    changePageSize();
}
/**
 * 初始化
 */
var initReportTable = function() {
   
    var dataTable = $("#resultGrid").on('xhr.dt', function ( e, settings, json, xhr ) {
        //分页
        $('.footerInfo').empty();
        if (json) {
            $('.footerInfo').append("当前显示从 " + ((pagenum-1) * parseInt($('#pageRange').val())+1) + " 到 " + ((pagenum-1) * parseInt($('#pageRange').val())+parseInt($('#pageRange').val())) + " 条记录,所有记录共" + json.totalCount + "条");
            var totalPage = Math.floor(json.totalCount/settings._iDisplayLength);
            if(json.totalCount%settings._iDisplayLength > 0){
                //parseInt(totalPage++);
                totalPage++;
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
                data: "order"
            },
            {
                width: 0,
                "searchable": false,
                "orderable": false,
                "visible":false,
                data: "dbid"
            },
            {
                width: 300,
                "searchable": false,
                "orderable": false,
                data: "title"
            },
            {
                width: 80,
                "searchable": false,
                "orderable": false,
                data: "month"
            },
            {
                width: 180,
                "searchable": false,
                "orderable": false,
                data: "org_name"
            },
            {
                width: 180,
                "searchable": false,
                "orderable": false,
                data: "distribute_name"
            },
            {
                width: 100,
                "searchable": false,
                "orderable": false,
                data: "createrName"
            },
            {
                width: 100,
                "searchable": false,
                "orderable": false,
                data: "createDate"
            },
            {
                data : null,
                width: 100,
                "searchable": false,
                "orderable": false,
                "bSort":false,
                render : function(data, type, row) {
                    var result = '';
                    //<button type="button" style="margin-left: 25px" class="bootstrapBtn modifySiteInfoBtn" data-target="#modifyBtnModal"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span> 修改</div>'
                    result = result + '<a href="javascript:openUpdateModel(\''+row.dbid+'\');">修改</a>　';
                    result = result + '<a href="javascript:deleteSeekReport(\''+row.dbid+'\');">删除</a>';
                    return result;
                }
            }
        ],
        "aoColumnDefs": [{"bSortable": false, "aTargets": [0]}],
        ajax : {
            "url" : "/erp/seekShopReportController/query",
            "method": "POST",
            dataType:'json',
            "data":function (){
                return {
                    "reportTitle":$('#reportTitle').val(),
                    "month":$('#month').val(),
                    "org_no":$('#org_no').val(),
                    "operateCenter":$('#operateCenter').val(),
                    "managerName":$('#managerName').val(),
                    "beginCreateTime":$('#beginCreateTime').val(),
                    "endCreateTime":$('#endCreateTime').val(),
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
};
/**
 * 初始化区域
 */
function initReportArea() {
    $.ajax({
        url: '/erp/common/areaCascadeController/getUserArea',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                for(var i=0;i<data.length;i++){
                    $('#org_no').append("<option value='"+data[i]['org_no']+"'>"+data[i]['org_name']+"</option>");
                    $('#org_no_add').append("<option value='"+data[i]['org_no']+"'>"+data[i]['org_name']+"</option>");
                    $('#org_no_update').append("<option value='"+data[i]['org_no']+"'>"+data[i]['org_name']+"</option>");
                }
            }
        },
        error: function (data) {
            alert("获取区域信息失败!");
        }
    });
}
/**
 * 查询巡店报告数据
 */
function changePageSize(){
    pagenum = 1;
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
    if(pagenum >= totolPage){
        //没有下一页了
        alert("已经最后一页了");
    }else{
        pagenum++;
        changePage();
    }
}

//上一页
function prevPage(){
    if(pagenum == 1){
        //没有下一页了
        alert("已经是第一页了");
    }else{
        pagenum--;
        changePage();
    }
}

//第一页
function firstPage(){
    pagenum = 1;
    changePage();
}

//最后一页
function lastPage(){
    var json = $("#resultGrid").DataTable().ajax.json();
    var count = json.totalCount;
    var pageSize = parseInt($('#pageRange').val());
    var totolPage = Math.ceil(count/pageSize);
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
        pagenum = pageno;
        changePage();
    }
}

/**
 * 删除选中的报告数据
 */
function deleteSeekReport(id){
    $.messager.confirm('确认','是否确认删除数据？',function(r){
        if (r){
            jQuery.ajax({
                type:"POST",
                dataType:'json',
                url: "/erp/seekShopReportController/deleteSeekReport",
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
function changeAera(orgNo) {
    if(orgNo != ""){
        $.ajax({
            url: '/erp/common/areaCascadeController/getOperateCenter',
            data: 'areaNo=' + orgNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    $('#operateCenter').empty();
                    if(data.length > 1){
                        $('#operateCenter').empty().append("<option value=''>请选择</option>");
                    }
                    for(var i=0;i<data.length;i++){
                        $('#operateCenter').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
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
/**
 * 区域与配送中心联动
 * @param orgNo
 */
function changeAeraAdd(orgNo) {
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
                        $('#operateCenter_add').empty().append("<option value='#'>全部</option>");
                        $('#operateCenter_update').empty().append("<option value='#'>全部</option>");
                    }
                    for(var i=0;i<data.length;i++){
                        $('#operateCenter_add').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
                        $('#operateCenter_update').append("<option value='"+data[i]['distribute_no']+"'>"+data[i]['distribute_name']+"</option>");
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
 * 打开修改model
 */
function openUpdateModel(id){
    $('#updateBtnModal').modal('show');
    $("#updateSeekReportForm")[0].reset();
    //$("#reportFile").val("");
    //$("#fileName").html("");

    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        url: "/erp/seekShopReportController/selectByReportId",
        data: {
            id: id
        },
        success:function (data) {

            $('#downloadFileInput').val(JSON.stringify(data));

            $('#id_U').val(data.dbid);
            $('#org_no_update').val(data.org_no);
            changeAeraAdd(data.org_no);
            $('#operateCenter_update').val(data.distribute_no);
            $('#month_update').val(data.month);
            $('#report_title_update').val(data.title);
            $('#highlight_update').val(data.highlights);
            $('#insufficient_update').val(data.insufficient);
            $('#improvement_update').val(data.improvement);

            var uploadFileUrl = data.pdfurl;
            var uploadFileName = data.fileName;

            if(uploadFileName != null && uploadFileName!=""){
                $("#uploadReportFileName").val(uploadFileName);
                $('#uploadReportFileName').html(uploadFileName);
                $("#pdfUrl_U").val(uploadFileUrl);
            }
        },
        error : function(data){
            alert("获取数据失败");
        }
    });

}
function downloadFile(){
 var json=JSON.parse($("#downloadFileInput").val());
    window.open(json.pdfurl);

}

function clearReportFile(){
    $("#uploadReportFileName").val("");
    $("#reportFileName").val("");
}

function changeTitle(){
    var timeAdd=$("#month_add").val();
    var timeUpdate=$("#month_update").val();
    if(timeAdd!=null &&timeAdd!=""){
        var yearAdd=timeAdd.split("-")[0];
        var monthAdd=timeAdd.split("-")[1];
        $("#report_title_add").val(yearAdd+"年"+monthAdd+"月巡店报告");
    }
    if(timeUpdate!=null &&timeUpdate!=""){
        var yearUpdate=timeUpdate.split("-")[0];
        var monthUpdate=timeUpdate.split("-")[1];
        $("#report_title_update").val(yearUpdate+"年"+monthUpdate+"月巡店报告");
    }
}

function reportFileChange(){
   
    var fileName = $("#reportFile").val();
    try{
        var fileNameList=fileName.split("\\");
        var reportName=fileNameList[fileNameList.length-1];
        var suffixList=fileName.split(".");
        var suffix = suffixList[suffixList.length-1].toLocaleLowerCase();
        if(suffix == "pdf"){
            $("#reportFileName").val(reportName);
        }else{
            alert("文件格式不正确");
            $("#reportFile").val("");
            $("#reportFileName").val("");
        }
    }catch(e){
        alert("文件格式不正确");
    }
}

function updateReportFileChange(){
   
    var fileName = $("#updateReportFile").val();
    try{
        var fileNameList=fileName.split("\\");
        var reportName=fileNameList[fileNameList.length-1];
        var suffixList=fileName.split(".");
        var suffix = suffixList[suffixList.length-1].toLocaleLowerCase();
        if(suffix == "pdf"){
            $("#uploadReportFileName").val(reportName);
            $("#pdfUrl_U").val("");
        }else{
            alert("文件格式不正确");
            $("#updateReportFile").val("");
            $("#uploadReportFileName").val("");
        }
    }catch(e){
        alert("文件格式不正确");
    }
}

/**
 * 保存
 */
//function update(){
//    if($('#updateForm').trigger("validate").isValid()){
//        if($("#intranetRoleU").val()==null && $("#extranetRoleU").val()==null){
//            $('#updateForm').validator('showMsg', '#intranetRoleU', {
//                type: "error",
//                msg: "请至少填写一种"
//            });
//            $('#updateForm').validator('showMsg', '#extranetRoleU', {
//                type: "error",
//                msg: "请至少填写一种"
//            });
//            return false;
//        }else{
//            $('#updateForm').validator('hideMsg', '#intranetRoleU');
//            $('#updateForm').validator('hideMsg', '#extranetRoleU');
//        }
//
//        var intranetRoleName = "";
//        var intranetRoles = $("#intranetRoleU").val();
//        if(intranetRoles != null){
//            for(var i=0; i<intranetRoles.length; i++){
//                intranetRoleName = intranetRoleName + "," + $("#intranetRoleU").find("option[value='"+intranetRoles[i]+"']").text();
//            }
//            intranetRoleName = intranetRoleName.substring(1);
//        }
//
//        var extranetRoleName = "";
//        var extranetRoles = $("#extranetRoleU").val();
//        if(extranetRoles != null){
//            for(var i=0; i<extranetRoles.length; i++){
//                extranetRoleName = extranetRoleName + "," + $("#extranetRoleU").find("option[value='"+extranetRoles[i]+"']").text();
//            }
//            extranetRoleName = extranetRoleName.substring(1);
//        }
//
//        var formData = new FormData();
//        formData.append("id", $("#idU").val());
//        formData.append("orgNo", $("#orgNoU").val());
//        formData.append("orgName", $("#orgNoU").find("option:selected").text());
//        formData.append("distributeNo", $("#distributeNoU").val());
//        formData.append("distributeName", $("#distributeNoU").find("option:selected").text());
//        formData.append("intranetRole", $("#intranetRoleU").val());
//        formData.append("intranetRoleName", intranetRoleName);
//        formData.append("extranetRole", $("#extranetRoleU").val());
//        formData.append("extranetRoleName", extranetRoleName);
//        formData.append("informationType", $("#informationTypeU").val());
//        formData.append("informationTitle", $("#informationTitleU").val());
//        formData.append("file", $("#file")[0].files[0]);
//        formData.append("informationContent",UE.getEditor('informationContentU').getContent());
//
//        jQuery.ajax({
//            type: "POST",
//            url: "/erp/informationDelivery/updateByPrimaryKey",
//            data: formData,
//            processData : false,
//            contentType : false,
//            success:function (data) {
//                $('#updateBtnModal').modal('hide');
//                alert("保存成功");
//                $("#resultGrid").DataTable().ajax.reload();
//            },
//            error : function(data){
//                $('#updateBtnModal').modal('hide');
//                alert("保存失败!");
//            }
//        });
//    }
//
//}