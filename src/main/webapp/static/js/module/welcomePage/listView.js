(function ($) {
    $.fn.extend({
        listView: function(listSize, listSkip, listType, requestUrl, targetContainer, loginUser, orgNos, distributeNos) {
            if(!requestUrl || !listType || !targetContainer || !loginUser) {
                window.alert("请求参数失效，请联系管理员");
            }
            if(!listSkip) {
                listSkip = 0;
            }
            if(!listSize) {
                listSize = 6
            }
            $.ajax({
                url: requestUrl,
                type:"POST",
                dataType: "json",
                "data": {
                    "size": listSize,
                    "skip": listSkip,
                    "informationType": listType,
                    "loginUser": loginUser,
                    "orgNosPage": orgNos,
                    "distributeNosPage": distributeNos
                },
                "success": function(data) {
                    if(data && data.ret) {
                        $(targetContainer).find("li").remove();
                        if(data.result.data.length <= 0) {
                            $(targetContainer).append('<li>暂无数据</li>');
                        }
                        $.each(data.result.data, function(_index, _obj) {
                            $(targetContainer).append('<li><a href="/erp/homeManageController/informationDeliveryDetailQuery/' +_obj.id  + '" target="_blank">' + _obj.informationTitle + '</a><span>' + $.fn.timeConvert(_obj.createTime) + '</span></li>');
                        });
                    } else {
                        //window.alert("查询失败，请联系管理员");
                    }
                },
                "error": function() {
                    //window.alert("查询失败，请联系管理员");
                }
            });
        },
        "listGrid" : function(listSize, listSkip, listType, requestUrl, targetContainer, loginUser, orgNos, distributeNos, paginationNav, entryPage, informationTitle, createPin, create_time_begin, create_time_end) {
            if(!requestUrl || !listType || !targetContainer || !loginUser || !paginationNav) {
                window.alert("请求参数失效，请联系管理员");
            }
            if(!listSkip) {
                listSkip = 0;
            }
            if(!listSize) {
                listSize = 6
            }
            $.ajax({
                url: requestUrl,
                type:"POST",
                dataType: "json",
                "data": {
                    "size": listSize,
                    "skip": listSkip,
                    "informationType": listType,
                    "loginUser": loginUser,
                    "orgNosPage": orgNos,
                    "distributeNosPage": distributeNos,
                    "informationTitle": informationTitle,
                    "createPin": createPin,
                    "createTimeBegin": create_time_begin,
                    "createTimeEnd": create_time_end
                },
                "success": function(data) {
                    if(data && data.ret) {
                        var totalSize = data.result.total;
                        var totalPage = 0;
                        if(parseInt(totalSize) % parseInt(listSize) > 0) {
                            totalPage = parseInt(totalSize/listSize + 1);
                        } else {
                            totalPage = parseInt(totalSize/listSize);
                        }
                        $(paginationNav).find("ul").remove();
                        $(paginationNav).append('<ul class="pagination" id="paginationUl"></ul>');
                        $(paginationNav).find("ul").append('<li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>');
                        for(var i = 0; i < totalPage; i ++) {
                            $(paginationNav).find("ul").append('<li class="pageBtn numPageBtn"><a href="javascript:void(0);">' + parseInt(i + 1) + '</a></li>');
                        }
                        $(paginationNav).find("ul").append('<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');
                        $(targetContainer).find("li").remove();
                        $.each(data.result.data, function(_index, _obj) {
                            $(targetContainer).append('<li><a href="/erp/homeManageController/informationDeliveryDetailQuery/' +_obj.id  + '" target="_blank">' + _obj.informationTitle + '<span class="gridDate">' + $.fn.timeConvert(_obj.createTime) + '</span> <span class="gridUser">' + _obj.createPin + '</span></a></li>');
                        });
                        $('#currentPageNum').val(entryPage);
                        $('#totalPageNum').val(totalPage);
                    } else {
                        //window.alert("查询失败，请联系管理员");
                    }
                },
                "error": function() {
                    //window.alert("查询失败，请联系管理员");
                }
            });
        },
        "timeConvert": function (time, isMore) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var date1 = date.getDate();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var second = date.getSeconds();
            if (isMore) {
                if (month < 10) {
                    month = '0' + month;
                }
                if (date1 < 10) {
                    date1 = '0' + date1;
                }
                if (hour < 10) {
                    hour = '0' + hour;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (second < 10) {
                    second = '0' + second;
                }
                return year + '-' + month + '-' + date1 + ' ' + hour + ':' + minutes + ':' + second;
            } else {
                if (month < 10) {
                    month = '0' + month;
                }
                if (date1 < 10) {
                    date1 = '0' + date1;
                }
                return year + '-' + month + '-' + date1;
            }

        }
    });
})(jQuery);