/**
 * Created by songbaifan on 2015/6/17.
 */
$(document).ready(function(){
    $.ajax({
        url : '../agencyQueryController/getTaskType',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                for(var i=0;i<data.length;i++){
                    $("<option value='"+data[i].messageTypeNo+"'>"+data[i].messageTypeName+"</option>").appendTo($("#messageTypeNo"));
                }
            }
        },
        error:function(data){
            alert("获取任务类型失败!");
        }
    });

    //机构、配送中心、承运商联动
    $("#messageTypeNo").on('change',function(){
        $("#titleNo").html("<option value=''>请选择</option>");
        var messageTypeNo = $(this).val();
        if(messageTypeNo == ''){
            return false;
        }
        $.ajax({
            url : '../agencyQueryController/getMessageTitle',
            data:'messageTypeNo='+messageTypeNo,
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                if(data.length>0){
                    for(var i=0;i<data.length;i++){
                        $("<option value='"+data[i].titleNo+"'>"+data[i].titleName+"</option>").appendTo($("#titleNo"));
                    }
                }
            },
            error:function(data){
                alert("获取任务标题失败!");
            }
        });
    });
});
