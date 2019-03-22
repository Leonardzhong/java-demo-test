"use strict";
$(document).ready(function() {
    ajaxRequest.initInformationDeliveryDetail();
});

var ajaxRequest = {
    initInformationDeliveryDetail : function() {
        $.ajax({
            url: '/erp/homeManageController/informationDeliveryDetailInfo',
            type: 'POST',
            dataType: 'json',
            data: {
                id: $('#requestId').val()
            },
            success: function (data) {
                console.log(data);
                if(data.ret) {
                    $(".title").empty().text(data.result.informationTitle);
                    $(".timeAndUser").empty().html("时间：" + $.fn.timeConvert(data.result.createTime) + "&nbsp;&nbsp;&nbsp;&nbsp;" + data.result.createPin);
                    $(".count").empty().html("点击量：" + data.result.browseCount + "&nbsp;&nbsp;&nbsp;&nbsp;" + "下载量："+data.result.downloadCount);
                    $(".infoContent").empty().html(data.result.informationContent);
                    $(".returnBtn").attr("href","/erp/homeManageController/informationDeliveryDetailList/" + data.result.informationType);
                    if(data.result.attachment){
                        //判断是否含有附件
                        var attachmentJson = eval('('+data.result.attachment+')');
                        $('#attachment').empty().html('<span style="font-size: 18px">附件：'+'<a onclick="downloadAdd(\''+data.result.id+'\');" class="hover-red" href="'+attachmentJson.downLoadUrl+'" target="_blank">'+attachmentJson.fileName+'</a></span>');
                        $('#attachment').show();
                    }
                } else {
                    console.log("加载失败")
                }
            },
            error: function() {
                console.log("加载失败");
            }
        });
    }
}

/**
 * 有下载量
 */
function downloadAdd(id){
    $.ajax({
        url: '/erp/homeManageController/updateDownloadCount',
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        success: function (data) {
            console.log(data);
        }
    });
}