/**
 * Created by songbaifan on 2015/6/8.
 */
$(document).ready(function () {

    //表格 消息查询列表
    var tableCol = [
        {
            display: '序号', name: 'index', width: 40, align: 'left', exportFlag: 'false',
            process: function (tdDiv, id) {
                rowSequence++;
                $(tdDiv).html(rowSequence);
            }
        },
        {display: '建立时间', name: 'buildTime', width: 80, align: 'left'},
        {display: '消息阅读状态', name: 'completeStatus', width: 320, align: 'left'},
        {display: '消息状态', name: 'waitStatus', width: 160, align: 'left'},
        {display: '消息题目', name: 'messageTitle', width: 160, align: 'left'},
        {display: '任务范围', name: 'taskRange', width: 160, align: 'left'}

    ];

    $('.messageManagerTable').flexigrid({
        idProperty: "id",
        height: 400,
        showToggleBtn: true,
        resizable: true,
        colMove: true,
        usepager: true,
        colModel: tableCol,
        onSubmit: function () {
            rowSequence = 0;
            return true;
        }
    });

    //初始化角色
    hasAllArea();

    $("#area").change(function () {
        var areaNo = $(this).val();
        $.ajax({
            url: '/erp/common/areaCascadeController/hasAllOperateCenterPrivilege',
            data: 'areaNo=' + areaNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                var operateAllflag = $.parseJSON(data);
                changeAera(areaNo, operateAllflag);
            },
            error: function (data) {
                alert("获取是否含有全部的运营中心失败!");
            }
        });
    })

    //点击查询按钮
    $("#queryMessage").on('click', function () {
        query();
    });

    function query() {
        if ($("#beginBuildTime").val() > $("#endBuildTime").val()) {
            alert("建立时间前大于后，请修改！");
            return;
        }
        $('.messageManagerTable').flexOptions({
            url: "../messageQueryController/queryMessage",
            dataType: 'json',
            params: [
                {'name': 'taskRange', 'value': $("#taskRange").val()},
                {'name': 'waitStatus', 'value': $("#waitStatus").val()},
                {'name': 'beginBuildTime', 'value': $("#beginBuildTime").val()},
                {'name': 'endBuildTime', 'value': $("#endBuildTime").val()},
                {'name': 'tableCol', 'value': JSON.stringify(tableCol)}
            ]
        });
        //$('.orderGoodsTable').changePage("first");
        $('.messageManagerTable').flexOptions({//重置表格的某些参数
            newp: "1"//设置查询参数
        }).flexReload();

    }

    $("#export").on('click', function () {
        $("#formMessage").append("<input type='hidden' name='tableCol' value='" + JSON.stringify(tableCol) + "'/>");
        $("#formMessage").append("<input type='hidden' name='mesType' value='1'/>");
        $("#formMessage").submit();
    });

    //消息新建弹出框
    $("#createMessageForm").on('click', function () {
        $("#messageTitle").val("")
        $("#messageContent").val("");
        $("#createMode").modal({backdrop: 'static', keyboard: false});

    });

    $("#cancel").on('click', function () {
        $('#createMode').modal('hide');
    });

    $("#create").on('click', function () {
        var messageTitle = $("#messageTitle").val();
        var messageContent = $("#messageContent").val();
        var area = $("#area").val();
        var operateCenter = $("#operateCenter").val();
        if (messageTitle == "") {
            alert("请填写标题");
            return;
        }
        if (messageTitle.length > 100) {
            alert("标题长度不能大于100");
            return;
        }
        if (messageContent == "") {
            alert("请填写内容");
            return;
        }
        if (messageContent.length > 500) {
            alert("内容长度不能大于500");
            return;
        }

        var parm = [
            {'name': 'areaId', 'value': $("#area").val()},
            {'name': 'areaName', 'value': $("#area").find("option:selected").text()},
            {'name': 'operateCenterId', 'value': $("#operateCenter").val()},
            {'name': 'operateCenterName', 'value': $("#operateCenter").find("option:selected").text()},
            {'name': 'messageTitle', 'value': messageTitle},
            {'name': 'messageContent', 'value': messageContent}

        ];
        $.ajax({
            url: '../messageQueryController/createMessage',
            data: parm,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data.sucess) {
                    alert("创建成功");
                    $('#createMode').modal('hide');
                    query();
                } else {
                    alert(data.msg);
                    $('#createMode').modal('hide');
                    return;
                }
            },
            error: function (data) {
                alert("创建系统消息失败!!!");
                return;
            }
        });
    });

    $("#messageTable td").tooltip();

    $("#messageTable").dblclick(function (e) {
        var trTarget = $(e.target);
        var n = 0;
        trOpt(trTarget);
    });
    function trOpt(trTarget) {
        if (trTarget.is("tr")) {
            var id = trTarget.attr("id");
            var targetUrl = "../messageQueryController/messageDetailOpenManager?id=" + id;
            window.open(targetUrl);
        } else {
            var p = trTarget.parent();
            trOpt(p);
        }
    }

    /**
     *  判断当前用户的区域权限是否是全国（#），然后再进行初始化区域
     */
    function hasAllArea() {
        var areaAllflag = false;
        $.ajax({
            url: '/erp/common/areaCascadeController/hasAllAreaPrivilege',
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                areaAllflag = $.parseJSON(data);
                initArea(areaAllflag);
            },
            error: function (data) {
                alert("获取是否含有全国区域失败!");
            }
        });
    }

    /**
     * 初始化区域
     */
    function initArea(areaAllflag) {
        $.ajax({
            url: '/erp/common/areaCascadeController/getUserArea',
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    if (data.length > 1 && !areaAllflag) {
                        $('#area').empty();
                    }
                    data = getUniqueAreas(data);
                    for (var i = 0; i < data.length; i++) {
                        $('#area').append("<option value='" + data[i]['org_no'] + "'>" + data[i]['org_name'] + "</option>");
                    }
                    if (data.length > 1 && !areaAllflag) {
                        changeAera(data[0]['org_no'], true);
                    }
                }
            },
            error: function (data) {
                alert("获取区域信息失败!");
            }
        });
    }

    /**
     * 区域与配送中心联动
     */
    function changeAera(orgNo, operateAllflag) {
        if (orgNo != "") {
            $.ajax({
                url: '/erp/common/areaCascadeController/getOperateCenter',
                data: 'areaNo=' + orgNo,
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    if (data.length > 0) {
                        $('#operateCenter').empty();
                        if (data.length > 1 && operateAllflag) {
                            $('#operateCenter').append("<option value='#'>全部</option>");
                        }
                        for (var i = 0; i < data.length; i++) {
                            $('#operateCenter').append("<option value='" + data[i]['distribute_no'] + "'>" + data[i]['distribute_name'] + "</option>");
                        }
                    }
                },
                error: function (data) {
                    alert("获取运营中心信息失败!");
                }
            });
        }
    }

    /**
     * 多区域数组去除重复数据
     */
    function getUniqueAreas(arr) {
        var result = [];    // 返回结果
        var temp = [];      // 临时存放多区域编号
        for (var i = 0, len = arr.length; i < len; i++) {
            if (temp.indexOf(arr[i].org_no) == -1) {
                temp.push(arr[i].org_no);
                result.push(arr[i]);
            }
        }
        return result;
    }

});