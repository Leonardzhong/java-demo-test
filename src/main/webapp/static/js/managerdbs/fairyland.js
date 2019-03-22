$(function(){
    $("#submitBtn").bind("click",sumbitData)
})

function sumbitData(){
    var data={
        sql:$("#sql").val(),
        pwd:$("#pwd").val(),
        count:$("#count").val()
    }
    if(data.pwd == null ||data.pwd  == '' ){
        alert("口令不能为空")
        return;
    }
    jQuery.ajax({
        type: "POST",
        url: "/erp/managerdbs/execute",
        dataType: "json",
        data:data,
        success: function (data) {
             if(data.success == true){
                 $("#sql").val("");
                 $("#pwd").val("")
                 $("#count").val("")
             }
            alert(data.msg);

        }
    });

}