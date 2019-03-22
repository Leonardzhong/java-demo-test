//初始化方法
$(document).ready(function () {

    initDataTable();

    $('#pageNo').keydown(function(e){
        if(e.keyCode==13){
           pageChangeEnter();
        }
    });

    $("#start_time, #end_time,#start_time_edit,#end_time_edit").datetimepicker({
        language: 'zh-CN',
        clearBtn: true,
        autoclose: true,
        minView:'month'
    });

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

    $("#updateBtn").click(function(){
        update();
    });

    $("#addBtn").click(function(){
        addPageOpen();
    });


    $("#imgUpload")
        .fileinput({
            language: 'zh',
            uploadUrl: "#",
            autoReplace: true,
            browseClass: "btn btn-primary", //按钮样式
            allowedFileTypes: ['image'],
            maxFileCount: 1,
            maxFileSize:0,
            allowedFileExtensions: ["jpg", "png", "gif"],
            showUpload: false, //是否显示上传按钮
            previewSettings:{
                image: {width: "450px", height: "250px"},
                html: {width: "450px", height: "250px"},
                text: {width: "450px", height: "250px"},
                video: {width: "450px", height: "250px"},
                audio: {width: "450px", height: "250px"},
                flash: {width: "450px", height: "250px"},
                object: {width: "450px", height: "250px"},
                other: {width: "450px", height: "250px"}
            }
        });

    $("#imgUpload_edit")
        .fileinput({
            language: 'zh',
            uploadUrl: "#",
            autoReplace: true,
            maxFileCount: 1,
            maxFileSize:0,
            allowedFileTypes: ['image'],
            allowedFileExtensions: ["jpg", "png", "gif"],
            browseClass: "btn btn-primary", //按钮样式
            showUpload: false, //是否显示上传按钮
            previewSettings:{
                image: {width: "450px", height: "250px"},
                html: {width: "450px", height: "250px"},
                text: {width: "450px", height: "250px"},
                video: {width: "450px", height: "250px"},
                audio: {width: "450px", height: "250px"},
                flash: {width: "450px", height: "250px"},
                object: {width: "450px", height: "250px"},
                other: {width: "450px", height: "250px"}
            }
        });

    $('#imgUpload_edit').on('fileselect', function(event, numFiles, label) {
        imageChange = 1;
    });

});

var imageChange = 0;

/**
 * 打开添加页面
 */
function addPageOpen(){
   //新增，清空表单数据
    clearForm();
    $("#addBtnModal").modal('show');
}

/**
 * 清空表单数据
 */
function clearForm(){
    $("#adv_no_add").val('');
    $("#adv_name_add").val('');
    $("#adv_des_add").val('');
    $("#start_time").val('');
    $("#end_time").val('');
    $("#adv_href_add").val('');
    $("#platform_add").val('-1');
    $("#status_add").val('1');
    $('#imgUpload').fileinput('reset');
    $('#adv_id').val('');
}

/**
 * 查询按钮
 */
function query(){
    //changePageSize();
    $("#resultGrid").DataTable().ajax.reload();
}

var initDataTable = function() {
    var dataTable = $("#resultGrid").on('xhr.dt', function ( e, settings, json, xhr ) {
        //分页
        $('.footerInfo').empty();
        if (json) {
            //$('.footerInfo').append("当前显示从 " + parseInt(parseInt(settings._iDisplayStart) + 1) + " 到 " + settings._iDisplayLength + " 条记录,所有记录共" + json.totalCount + "条");
            $('.footerInfo').append("当前显示从 " + (pagenum * parseInt($('#pageRange').val())+1) + " 到 " + (pagenum * parseInt($('#pageRange').val())+parseInt($('#pageRange').val())) + " 条记录,所有记录共" + json.totalCount + "条");
            var totalPage = Math.floor(json.totalCount/settings._iDisplayLength);
            //totalPage = parseInt(json.totalCount)/parseInt($('#pageRange').val()));
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
                "searchable": false,
                "orderable": false,
                data: "adv_no"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "adv_name"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "platform",
                render : function(data, type, row) {
                    if(data==0){
                        return "内网";
                    }else if(data==1){
                        return "外网";
                    }else{
                        return "全部";
                    }
                }
            },
            {
                "searchable": false,
                "orderable": false,
                data: "start_time",
                render : function(data, type, row) {
                    if(data!=""&&data!=null){
                        return getFormatDateByLong(data,"yyyy-MM-dd");
                    }else{
                        return ""
                    }
                }
            },
            {
                "searchable": false,
                "orderable": false,
                data: "end_time",
                render : function(data, type, row) {
                    if(data!=""&&data!=null){
                        return getFormatDateByLong(data,"yyyy-MM-dd");
                    }else{
                        return ""
                    }
                }
            },
            {
                "searchable": false,
                "orderable": false,
                data: "status",
                render : function(data, type, row) {
                    if(data==0){
                        return "禁用";
                    }else if(data==1){
                        return "启用";
                    }
                }
            },
            {
                data : null,
                "sWidth": "100px",
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
            "url" : "/erp/ActivityManageController/pageQuery",
            "method": "POST",
            dataType:'json',
            "data":function (){
                return {
                    "adv_name":$('#adv_name').val(),
                    "status":$('#statusSelect').val(),
                    "platform":$('#platformSelect').val(),
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

    dataTable.on('order.dt search.dt',
        function() {
            dataTable.column(0, {
                search: 'applied',
                order: 'applied'
            }).nodes().each(function(cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();
}

/**
 * 更改每页数量
 */
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
                url: "/erp/ActivityManageController/deleteByPrimaryKey",
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
 * 添加保存
 */
function save(){
    if(document.getElementById("imgUpload").files[0]==null||document.getElementById("imgUpload").files[0]==undefined){
        alert("请上传一张广告位图片，再试");
        return;
    }else{
        //验证图片大小
        var fileSize = document.getElementById("imgUpload").files[0].size;
        if(fileSize>2048*1024){
            alert("对不起，文件最大可支持2M");
            return;
        }
        //验证文件类型
        var fileName = document.getElementById("imgUpload").files[0].name;
        var fileType = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        if(fileType!='png' && fileType!='jpg' && fileType!='gif'){
            alert("对不起，文件上传只支持图片类型");
            return;
        }
        //验证编码是否存在
        jQuery.ajax({
            type: "POST",
            dataType: 'json',
            url: "/erp/ActivityManageController/selectCountByCondition",
            data: {
                adv_no: $('#adv_no_add').val()
            },
            success:function (data) {
                if(data>0){
                    //有存在no
                    alert("对应的广告位编号已存在，不能重复添加");
                    adv_no: $('#adv_no_add').val('');
                    return;
                }else{
                    if($('#insertForm').trigger("validate").isValid()){
                        saveFunction();
                    }
                }
            }
        });
    }
}

//保存现有数据
function saveFunction(){
    $('.theme-popover-mask').show();
    var formData = new FormData();//用form 表单直接 构造formData 对象; 就不需要下面的append 方法来为表单进行赋值了。
    formData.append("adv_no", $("#adv_no_add").val());
    formData.append("adv_name",$("#adv_name_add").val() );
    formData.append("adv_des", $("#adv_des_add").val());
    formData.append("start_time_str",$("#start_time").val());
    formData.append("end_time_str", $("#end_time").val());
    formData.append("adv_href", $("#adv_href_add").val());
    formData.append("platform", $("#platform_add").val());
    formData.append("status", $("#status_add").val());
    formData.append("file", $("#imgUpload")[0].files[0]);

    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        processData: false,
        contentType: false,
        url: "/erp/ActivityManageController/addActivityInfo",
        data:formData,
        success:function (data) {
            $('#addBtnModal').modal('hide');
            $('.theme-popover-mask').hide();
            alert("保存成功");
            $("#resultGrid").DataTable().ajax.reload();
            $("#insertForm")[0].reset();


        },
        error : function(data){
            $('#addBtnModal').modal('hide');
            $('.theme-popover-mask').hide();
            alert("保存失败");
        }
    });
}

//保存现有数据
function updateFunction(){
    $('.theme-popover-mask').show();//遮罩层
    var formData = new FormData();//用form 表单直接 构造formData 对象; 就不需要下面的append 方法来为表单进行赋值了。
    formData.append("id", $("#adv_id").val());
    formData.append("adv_no", $("#adv_no_edit").val());
    formData.append("adv_name",$("#adv_name_edit").val() );
    formData.append("adv_des", $("#adv_des_edit").val());
    formData.append("start_time_str",$("#start_time_edit").val());
    formData.append("end_time_str", $("#end_time_edit").val());
    formData.append("adv_href", $("#adv_href_edit").val());
    formData.append("platform", $("#platform_edit").val());
    formData.append("status", $("#status_edit").val());
    if(imageChange==1){
        formData.append("file", $("#imgUpload_edit")[0].files[0]);
    }
    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        processData: false,
        contentType: false,
        url: "/erp/ActivityManageController/updateByPrimaryKey",
        data:formData,
        success:function (data) {
            $('#editBtnModal').modal('hide');
            alert("修改成功");
            $("#resultGrid").DataTable().ajax.reload();
            $('.theme-popover-mask').hide();//遮罩层
        },
        error : function(data){
            $('#editBtnModal').modal('hide');
            $('.theme-popover-mask').hide();//遮罩层
            alert("修改失败");

        }
    });
}

/**
 * 打开维护窗口
 * @param userCode 用户编码
 */
function openUpdateWindow(id){
    $('.theme-popover-mask').show();//遮罩层
    imageChange = 0;
    clearForm();
    $('#editBtnModal').modal('show');
    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        url: "/erp/ActivityManageController/selectByPrimaryKey",
        data: {
            id: id
        },
        success:function (data) {
            $('#adv_id').val(id);
            $('#adv_no_edit').val(data.adv_no);
            $('#adv_name_edit').val(data.adv_name);
             $('#adv_des_edit').val(data.adv_des);
            if(data.start_time!=null && data.start_time!=''){
                $('#start_time_edit').val(getFormatDateByLong(data.start_time,"yyyy-MM-dd"));
            }else{
                $('#start_time_edit').val('');
            }
            if(data.end_time!=null && data.end_time!=''){
                $('#end_time_edit').val(getFormatDateByLong(data.end_time,"yyyy-MM-dd"));
            }else{
                $('#end_time_edit').val('');
            }
             $('#adv_href_edit').val(data.adv_href);
             $('#platform_edit').val(data.platform);
             $('#status_edit').val(data.status);
            //设置预览图片
            $('.file-drop-zone-title').html('<img id="tempImg" src="'+data.pic_url+'" style="width: 450px;height: 250px;">');
            $('.file-drop-zone-title').css({"padding": "0px"});
            $('.theme-popover-mask').hide();
        },
        error : function(data){
            $('.theme-popover-mask').hide();
            alert("获取数据失败");
        }
    });

}

/**
 * 修改保存
 */
function update(){

    if(imageChange==1&&(document.getElementById("imgUpload_edit").files[0]==null||document.getElementById("imgUpload_edit").files[0]==undefined)){
        alert("请上传一张广告位图片，再试");
        return;
    }else{
        if(imageChange==1){
            //验证图片大小
            var fileSize = document.getElementById("imgUpload_edit").files[0].size;
            if(fileSize>2048*1024){
                alert("对不起，文件最大可支持2M");
                return;
            }
            //验证文件类型
            var fileName = document.getElementById("imgUpload_edit").files[0].name;
            var fileType = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
            if(fileType!='png' && fileType!='jpg' && fileType!='gif'){
                alert("对不起，文件上传只支持图片类型");
                return;
            }
        }
        if($('#editForm').trigger("validate").isValid()){
            updateFunction();
        }
    }


}
//扩展Date的format方法
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
/**
 *转换日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 *               为true时, 格式如"2000-03-05 01:05:04"
 *               为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */
function getSmpFormatDate(date, isFull) {
    var pattern = "";
    if (isFull == true || isFull == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    } else {
        pattern = "yyyy-MM-dd";
    }
    return getFormatDate(date, pattern);
}
/**
 *转换当前日期对象为日期字符串
 * @param date 日期对象
 * @param isFull 是否为完整的日期数据,
 *               为true时, 格式如"2000-03-05 01:05:04"
 *               为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */

function getSmpFormatNowDate(isFull) {
    return getSmpFormatDate(new Date(), isFull);
}
/**
 *转换long值为日期字符串
 * @param l long值
 * @param isFull 是否为完整的日期数据,
 *               为true时, 格式如"2000-03-05 01:05:04"
 *               为false时, 格式如 "2000-03-05"
 * @return 符合要求的日期字符串
 */

function getSmpFormatDateByLong(l, isFull) {
    return getSmpFormatDate(new Date(l), isFull);
}
/**
 *转换long值为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */

function getFormatDateByLong(l, pattern) {
    return getFormatDate(new Date(l), pattern);
}
/**
 *转换日期对象为日期字符串
 * @param l long值
 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
 * @return 符合要求的日期字符串
 */
function getFormatDate(date, pattern) {
    if (date == undefined) {
        date = new Date();
    }
    if (pattern == undefined) {
        pattern = "yyyy-MM-dd hh:mm:ss";
    }
    return date.format(pattern);
}

