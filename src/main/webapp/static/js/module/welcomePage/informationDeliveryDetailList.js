"use strict";
$(document).ready(function() {
    /* 初始化当前登录人所属区域和运营中心 */
    controlInit.timeControl();
    controlListener.timePickerListener();
    ajaxRequest.initOrgRequest();
    btnListener.queryBtnListener();
    btnListener.prevPageBtnListener();
    btnListener.nextPageBtnListener();
    btnListener.pageNumBtnListener();
});

var controlInit = {
    "timeControl" : function() {
        $("#create_time_begin, #create_time_end").datetimepicker({
            language: 'zh-CN',
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true
        });
    }
}

var controlListener = {
    timePickerListener : function() {
        $('#create_time_end').datetimepicker({
            language: 'zh-CN',
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true
        }).on('changeDate', function () {
            if ($(this).val() < $('#create_time_begin').val()) {
                window.alert('发布日期的结束时间不能小于起始时间');
                $(this).val("");
            }
        });
        $('#create_time_begin').datetimepicker({
            language: 'zh-CN',
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true
        }).on('changeDate', function () {
            if ($('#create_time_end').val()) {
                if ($(this).val() > $('#create_time_end').val()) {
                    window.alert('发布日期的起始时间不能大于于结束时间');
                    $(this).val("");
                }
            }
        });
    }
}

var btnListener = {
    queryBtnListener : function() {
        $('#queryBtn').on('click', function() {
            var orgNos = $("#multi_org_no").val();
            var distributeNos = $("#multi_distribute_no").val();
            var informationTitle = $("#informationTitle").val();
            var create_time_begin = $("#create_time_begin").val();
            var create_time_end = $("#create_time_end").val();
            var createPin = $("#createPin").val();
            var orgArray = orgNos.split(",");
            var distributeArray = distributeNos.split(",");
            $.fn.listGrid(10,0,$('#type').val(),"/erp/homeManageController/informationPageQuery", ".classUL", $("#loginUser").val(), orgArray, distributeArray, ".paginationNav", 1, informationTitle, createPin, create_time_begin, create_time_end);
        });
    },
    prevPageBtnListener : function() {
        $(".paginationNav").on('click', 'li:first', function() {
            var currentPageNum = $("#currentPageNum").val();
            if(currentPageNum) {
                currentPageNum = parseInt(currentPageNum);
            }
            if(currentPageNum != 1) {
                var skipSize = parseInt((currentPageNum - 2) * 10);
                var entryPage = parseInt(currentPageNum - 1);
                var orgNos = $("#multi_org_no").val();
                var distributeNos = $("#multi_distribute_no").val();
                var orgArray = orgNos.split(",");
                var distributeArray = distributeNos.split(",");
                $.fn.listGrid(10,skipSize,$('#type').val(),"/erp/homeManageController/informationPageQuery", ".classUL", $("#loginUser").val(), orgArray, distributeArray, ".paginationNav", entryPage);
            }
        });
    },
    nextPageBtnListener : function() {
        $(".paginationNav").on('click', 'li:last', function() {
            var totalPageNum = $('#totalPageNum').val();
            var currentPageNum = $("#currentPageNum").val();
            if(totalPageNum) {
                totalPageNum = parseInt(totalPageNum);
            }
            if(currentPageNum) {
                currentPageNum = parseInt(currentPageNum);
            }
            if(currentPageNum != totalPageNum) {
                var entryPage = parseInt(currentPageNum + 1);
                var skipSize = parseInt((entryPage - 1) * 10);
                var orgNos = $("#multi_org_no").val();
                var distributeNos = $("#multi_distribute_no").val();
                var orgArray = orgNos.split(",");
                var distributeArray = distributeNos.split(",");
                $.fn.listGrid(10,skipSize,$('#type').val(),"/erp/homeManageController/informationPageQuery", ".classUL", $("#loginUser").val(), orgArray, distributeArray, ".paginationNav", entryPage);
            }
        });
    },
    pageNumBtnListener: function() {
        $(".paginationNav").on('click', '.numPageBtn', function() {
            var entryPage = $(this).text();
            var skipSize = parseInt((entryPage - 1) * 10);
            var orgNos = $("#multi_org_no").val();
            var distributeNos = $("#multi_distribute_no").val();
            var orgArray = orgNos.split(",");
            var distributeArray = distributeNos.split(",");
            $.fn.listGrid(10,skipSize,$('#type').val(),"/erp/homeManageController/informationPageQuery", ".classUL", $("#loginUser").val(), orgArray, distributeArray, ".paginationNav", entryPage);
        });
    }
}

var ajaxRequest = {
    "initOrgRequest": function() {
        $.ajax({
            url: '/erp/common/areaCascadeController/getUserArea',
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    if(data.length > 1) {
                        var orgStr = "";
                        var orgArray = [];
                        $.each(data, function (_index, _obj) {
                            /* 多个区域情况 */
                            if(_index !== data.length - 1) {
                                orgStr = orgStr + _obj.org_no + ",";
                            } else {
                                orgStr = orgStr + _obj.org_no;
                            }
                            orgArray.push(_obj.org_no);
                        });
                        $("#multi_org_no").val(orgStr);
                        $.fn.listGrid(10,0,$('#type').val(),"/erp/homeManageController/informationPageQuery", ".classUL", $("#loginUser").val(), orgArray, null, ".paginationNav", 1);
                    } else if(data.length == 1) {
                        $.each(data, function (_index, _obj) {
                            $("#multi_org_no").val(_obj.org_no);
                            ajaxRequest.initDistributeRequest(_obj.org_no);
                        });
                    }
                } else {
                    //window.alert("加载区域信息出错，请联系管理员");
                }
            },
            error: function () {
                //window.alert("加载区域信息出错，请联系管理员");
            }
        });
    },
    initDistributeRequest: function (orgNo) {
        $.ajax({
            url: '/erp/common/areaCascadeController/getOperateCenter',
            data: 'areaNo=' + orgNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    var orgArray = [];
                    var distributeArray = [];
                    if(data.length > 1) {
                        var distributeStr = "";
                        $.each(data, function (_index, _obj) {
                            /*  多个运营中心情况 */
                            if(_index !== data.length - 1) {
                                distributeStr = distributeStr + _obj.distribute_no + ",";
                            } else {
                                distributeStr = distributeStr + _obj.distribute_no;
                            }
                            distributeArray.push(_obj.distribute_no);
                        });
                        $("#multi_distribute_no").val(distributeStr);
                        orgArray.push(orgNo);
                        $.fn.listGrid(10,0,$('#type').val(),"/erp/homeManageController/informationPageQuery", ".classUL", $("#loginUser").val(), orgArray, distributeArray, ".paginationNav", 1);
                    } else if(data.length == 1) {
                        $.each(data, function (_index, _obj) {
                            $("#multi_distribute_no").val(_obj.distribute_no);
                            orgArray.push(orgNo);
                            distributeArray.push(_obj.distribute_no);
                        });
                        $.fn.listGrid(10,0,$('#type').val(),"/erp/homeManageController/informationPageQuery", ".classUL", $("#loginUser").val(), orgArray, distributeArray, ".paginationNav", 1);
                    }
                }
            },
            error: function () {
                //window.alert("加载运营中心信息出错，请联系管理员");
            }
        });
    }
}