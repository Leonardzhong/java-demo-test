/**
 * bootstrap dataTables 统一分页控件 js文件
 * 适用范围：dataTables ，table：id resultGrid
 */

var pagenum = 0; //当前页码
$(document).ready(function () {
$('#pageNo').val(1);
});
/**
 *  切换每页显示数量
 */
function changePageSize(){
    //console.log(tableGridId.parent)
    pagenum = 0;
    $("#resultGrid").DataTable().page.len($('#pageRange').val());
    $("#resultGrid").DataTable().ajax.reload();
}

/**
 * 切换页码
 */
function changePage(){
    $("#resultGrid").DataTable().ajax.reload();
}



/**
 * 下一页
 */
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
        //alert(pagenum);
        var temp = $('#pageNo').val();
        temp++;
        $('#pageNo').val(temp);
        changePage();
    }
}

/**
 * 上一页
 */
function prevPage(){
    if(pagenum == 0){
        //没有下一页了
        alert("已经是第一页了");
    }else{
        pagenum--;
        var temp = $('#pageNo').val();
        temp--;
        $('#pageNo').val(temp);
        changePage();
    }
}

/**
 * 第一页
 */
function firstPage(){
    pagenum = 0;
    $('#pageNo').val(1);
    changePage();
}

/**
 * 最后一页
 */
function lastPage(){
    var json = $("#resultGrid").DataTable().ajax.json();
    var count = json.totalCount;
    var pageSize = parseInt($('#pageRange').val());
    var totolPage = Math.floor(count/pageSize);
    pagenum = totolPage;
    $('#pageNo').val(pagenum+1);
    changePage();
}

/**
 * 跳转任意页码
 */
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
        //$('#pageNo').val(pagenum);
        changePage();
    }
}