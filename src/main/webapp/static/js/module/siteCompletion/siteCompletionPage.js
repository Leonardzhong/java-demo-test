$(function(){
$("#updateBtn").bind("click",submitData)
})
function submitData(){

  var formData=new FormData();
    formData.append("file", $("#file")[0].files[0]);
    jQuery.ajax({
        type: "POST",
        url: "/erp/SiteCompletionController/completion",
        data: formData,
        processData : false,
        timeout:1000 * 10000,
        contentType : false,
        success:function (data) {
            data=JSON.parse(data);
            if(data.status == true){
                alert("保存成功");
            }else{
                alert(data.msg);
            }

        },
        error : function(data){
            alert("保存失败!");
        }
    });
}