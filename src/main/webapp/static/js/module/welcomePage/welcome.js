"use strict";
$(document).ready(function() {
    /* 初始化当前登录人所属区域和运营中心 */
    ajaxRequest.initOrgRequest();
});

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
                        $.fn.listView(6,0,1,"/erp/homeManageController/informationPageQuery", ".newsList", $("#loginUser").val(), orgArray, null);
                        $.fn.listView(6,0,2,"/erp/homeManageController/informationPageQuery", ".newsListRight", $("#loginUser").val(), orgArray, null);
                        $.fn.listView(6,0,3,"/erp/homeManageController/informationPageQuery", "#tempUl", $("#loginUser").val(), orgArray, null);
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
                        $.fn.listView(6,0,1,"/erp/homeManageController/informationPageQuery", ".newsList", $("#loginUser").val(), orgArray, distributeArray);
                        $.fn.listView(6,0,2,"/erp/homeManageController/informationPageQuery", ".newsListRight", $("#loginUser").val(), orgArray, distributeArray);
                        $.fn.listView(6,0,3,"/erp/homeManageController/informationPageQuery", "#tempUl", $("#loginUser").val(), orgArray, distributeArray);
                    } else if(data.length == 1) {
                        $.each(data, function (_index, _obj) {
                            $("#multi_distribute_no").val(_obj.distribute_no);
                            orgArray.push(orgNo);
                            distributeArray.push(_obj.distribute_no);
                        });
                        $.fn.listView(6,0,1,"/erp/homeManageController/informationPageQuery", ".newsList", $("#loginUser").val(), orgArray, distributeArray);
                        $.fn.listView(6,0,2,"/erp/homeManageController/informationPageQuery", ".newsListRight", $("#loginUser").val(), orgArray, distributeArray);
                        $.fn.listView(6,0,3,"/erp/homeManageController/informationPageQuery", "#tempUl", $("#loginUser").val(), orgArray, distributeArray);
                    }

                }
            },
            error: function () {
                //window.alert("加载运营中心信息出错，请联系管理员");
            }
        });
    }
}