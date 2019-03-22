//初始化方法
$(document).ready(function () {

    initDataTable();

    $('#pageNo').keydown(function(e){
        if(e.keyCode==13){
           pageChangeEnter();
        }
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

});


function query(){
    $("#resultGrid").DataTable().ajax.reload();
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
                "searchable": false,
                "orderable": false,
                data: "title"
            },
            {
                "searchable": false,
                "orderable": false,
                data: "address"
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
            "url" : "/erp/links/pageQuery.json",
            "method": "POST",
            dataType:'json',
            "data":function (){
                return {
                    "title":$('#title').val(),
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
                url: "/erp/links/deleteByPrimaryKey",
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
 * 保存
 */
function save(){
    if($('#insertForm').trigger("validate").isValid()){

        jQuery.ajax({
            type: "POST",
            dataType: 'json',
            url: "/erp/links/insert",
            data: {
                title: $('#titleI').val(),
                address: $('#addressI').val(),
            },
            success:function (data) {
                $('#addBtnModal').modal('hide');
                alert("保存成功");
                $("#resultGrid").DataTable().ajax.reload();
                $("#insertForm")[0].reset();

            },
            error : function(data){
                $('#addBtnModal').modal('hide');
                alert("保存失败");
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
    jQuery.ajax({
        type: "POST",
        dataType: 'json',
        url: "/erp/links/selectByPrimaryKey",
        data: {
            id: id
        },
        success:function (data) {
            $('#idU').val(data.id);
            $('#titleU').val(data.title);
            $('#addressU').val(data.address);
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
        jQuery.ajax({
            type: "POST",
            dataType: 'json',
            url: "/erp/links/updateByPrimaryKey",
            data: {
                id: $('#idU').val(),
                title: $('#titleU').val(),
                address: $('#addressU').val(),
            },
            success:function (data) {
                $('#updateBtnModal').modal('hide');
                alert("保存成功");
                $("#resultGrid").DataTable().ajax.reload();

            },
            error : function(data){
                $('#updateBtnModal').modal('hide');
                alert("保存失败");
            }
        });
    }

}



