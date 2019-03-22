var editIndex = -1;
$(function () {

    $('#importGrid').datagrid({
        rownumbers: true,
        width: '100%',
        title: '物料导入',
        columns: [[
            {
                field: 'orgNo',
                title: '区域编号',
                width: '100',
                align: 'center',
                editor: {type: 'textbox', options: {required: true, validType: ['length[0,30]']}}
            },
            {
                field: 'orgName',
                title: '区域名称',
                width: '100',
                align: 'center',
                editor: {type: 'textbox', options: {required: true, validType: ['length[0,30]']}}
            },
            {
                field: 'distributeNo',
                title: '运营中心编号',
                width: '120',
                align: 'center',
                editor: {type: 'textbox', options: {required: true, validType: ['length[0,30]']}}
            },
            {
                field: 'distributeName',
                title: '运营中心名称',
                width: '120',
                align: 'center',
                editor: {type: 'textbox', options: {required: true, validType: ['length[0,30]']}}
            },
            {
                field: 'name',
                title: '物料名称',
                width: '60',
                align: 'center',
                editor: {type: 'textbox', options: {required: true, validType: ['length[0,30]']}}
            },
            {
                field: 'num',
                title: '数量',
                width: '60',
                align: 'center',
                editor: {type: 'numberbox', options: {validType: ['length[0,11]']}}
            },
            {
                field: 'userErp',
                title: '签收人erp',
                width: '80',
                align: 'center',
                editor: {type: 'textbox', options: {required: true, validType: ['length[0,30]']}}
            },
            {
                field: 'userName',
                title: '签收人',
                width: '80',
                align: 'center',
                editor: {type: 'textbox', options: {required: true, validType: ['length[0,30]']}}
            },
            {
                field: 'msg',
                title: '错误消息',
                width: '200',
                align: 'center',
                formatter: function (value, row, index) {
                    var ms = "";
                    if (row['userErp'] == "" || row['userErp'] == null) {
                        ms += "签收人ERP为空;<br>";
                    }
                    if (row['userName'] == "" || row['userName'] == null) {
                        ms += "签收人姓名为空;<br>";
                    }
                    if (row['name'] == "" || row['name'] == null) {
                        ms += "物料名称为空;<br>";
                    }
                    ms += row['orgNoMsg'] + row['orgNameMsg'] + row['distributeNoMsg'] + row['distributeNameMsg'] + row['userErpMsg'];
                    row['msg'] = ms;
                    return '<font style="color: red">' + ms + '</font>';
                }
            },
            {
                field: '操作',
                title: '操作',
                width: '120',
                align: 'center',
                formatter: function (value, row, index) {
                    return '<a href="javascript:updateGrid(' + index + ');">修改</a><br><a href="javascript:finshGrid(' + index + ');">保存</a>';
                }
            }
        ]],
        toolbar: '#tb'
    });

    jQuery('#fileUpload').dialog({
        title: '物料记录',
        closed: true,
        closable: false,
        cache: false,
        modal: true,
        resizable: true,
        width: 250,
        height: 250,
        iconCls: 'icon-save',
        buttons: [
            {
                id: 'yesBtn',
                iconCls: 'icon-ok',
                text: '确定',
                handler: function () {
                    var file = $("#uploadVm").contents().find('input')[0].value
                    if (file == '') {
                        $.messager.alert('提示', '上传文件不能为空！');
                        return;
                    }
                    var reg = /[^\.](\.xlsx)$/i;
                    if (!reg.test(file)) {
                        $.messager.alert('提示', '只能上传2007版Excel！');
                        return;
                    }

                    $('#yesBtn').linkbutton('disable');
                    $('#prossing').css('display', 'block');
                    $("#uploadVm").contents().find('form').ajaxSubmit({
                        type: 'post',
                        url: '/erp/marketingManageController/uploadMaterialRecord',
                        dataType: 'text',
                        timeout: 60000,
                        success: function (data) {
                            try {
                                data = JSON.parse(data);
                                if (data && data.success) {
                                    $('#importGrid').datagrid('loadData', data.data);
                                }
                            } catch (e) {
                                $.messager.alert('提示', '上传失败');
                            }

                            $('#fileUpload').dialog('close');

                            $('#yesBtn').linkbutton('enable');
                            $('#prossing').css('display', 'none');
                        },
                        error: function (data) {
                            if (data.statusText == "timeout") {
                                $.messager.alert('提示', '请求超时!');
                            }
                            $('#fileUpload').dialog('close');

                            $('#yesBtn').linkbutton('enable');
                            $('#prossing').css('display', 'none');
                        }
                    });
                }
            }, {
                text: '取消',
                iconCls: 'icon-undo',
                handler: function () {
                    $('#fileUpload').dialog('close');

                    $('#yesBtn').linkbutton('enable');
                    $('#prossing').css('display', 'none');

                    $("#uploadVm").contents().find('.MultiFile-list').remove();
                }
            }
        ]

    });

});

function importExcel() {
    jQuery('#excelFile').empty();
    var iframe = '<iframe id="uploadVm" name="uploadVm" frameborder="0" src="/getView/upload" style="width:200px;" />';
    jQuery('#fileUpload').dialog('open');
    jQuery('#excelFile').prepend(iframe);
}

function onClickCell(index, field) {
    if (editIndex != index) {
        if (endEditing()) {
            $('#importGrid').datagrid('selectRow', index).datagrid('beginEdit', index);
            var ed = $('#importGrid').datagrid('getEditor', {index: index, field: field});
            ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
            editIndex = index;
        } else {
            $('#importGrid').datagrid('selectRow', editIndex);
        }
    }
}

function endEditing() {
    if (editIndex == undefined) {
        return true
    }
    if ($('#importGrid').datagrid('validateRow', editIndex)) {
        $('#importGrid').datagrid('endEdit', editIndex);
        editIndex = undefined;
        return true;
    } else {
        return false;
    }
}

function submit() {
    if (editIndex != -1) {
        $.messager.alert('提示', '请保存当前编辑状态！');
        return;
    }

    var data = $('#importGrid').datagrid('getData').rows;

    if (data.length <= 0) {
        $.messager.alert('提示', '当前无数据提交！');
        return;
    }

    var materialRecords = new Array();
    var errorData = new Array();

    for (i = 0; i < data.length; i++) {
        if (data[i]['msg'] != "") {
            errorData.push(data[i]);

        } else {

            var materialRecord = {
                name: data[i].name
                , num: data[i].num
                , material: {
                    org: {org_no: data[i].orgNo, org_name: data[i].orgName}
                    , distribute: {distribute_no: data[i].distributeNo, distribute_name: data[i].distributeName}
                    , grantUser: {boundErp: $('#erp').val()}
                }
                , signUser: {boundErp: data[i].userErp}
            };
            materialRecords.push(materialRecord);
        }
    }

    if (materialRecords.length <= 0) {
        $.messager.alert('提示', '当前无正确数据可提交！');
        return;
    }

    ParamUtil.crateParams();
    ParamUtil.addParam('List<MaterialRecord>', materialRecords);

    josnRequest('/execute/materialService/saveMaterialInfo', ParamUtil.getParams(), function (data) {
        $.messager.alert('提示', '保存成功');
        $('#importGrid').datagrid('loadData', {total: 0, rows: errorData});
    });

}


function updateGrid(index) {
    if (editIndex == -1) {
        $('#importGrid').datagrid('selectRow', index).datagrid('beginEdit', index);
        editIndex = index;
    }
}

function finshGrid(index) {
    if ($('#importGrid').datagrid('validateRow', index)) {
        $('#importGrid').datagrid('endEdit', index);
        editIndex = -1;

        var row = $('#importGrid').datagrid('getData').rows[index];

        ParamUtil.crateParams();
        ParamUtil.addParam('String', row['userErp']);
        ParamUtil.addParam('String', row['orgNo']);
        ParamUtil.addParam('String', row['distributeNo']);

        josnRequest('/execute/materialService/getUser'
            , ParamUtil.getParams()
            , function (data) {
                if (data == null) {
                    row['userErpMsg'] = row['userErp'] + "用户不存在<br>";
                    row['orgNoMsg'] = "";
                    row['orgNameMsg'] = "";
                    row['distributeNoMsg'] = "";
                    row['distributeNameMsg'] = "";
                    row['userName'] = "";
                } else {
                    row['userErpMsg'] = "";
                    row['orgNoSys'] = data['orgNo'];
                    row['orgNameSys'] = data['orgName'];
                    row['distributeNoSys'] = data['distributeNo'];
                    row['distributeNameSys'] = data['distributeName'];
                    row['userName'] = data['userName'];

                    if (row['orgNo'] == row['orgNoSys']) {
                        row['orgNoMsg'] = "";
                    } else {
                        row['orgNoMsg'] = "签收人区域编号错误，应为：" + data['orgNo'] + "；<br>";
                    }
                    if (row['orgName'] == row['orgNameSys']) {
                        row['orgNameMsg'] = "";
                    } else {
                        row['orgNameMsg'] = "签收人区域名称错误，应为：" + data['orgName'] + "；<br>";
                    }
                    if (row['distributeNo'] == row['distributeNoSys']) {
                        row['distributeNoMsg'] = "";
                    } else {
                        row['distributeNoMsg'] = "签收人中心编号错误，应为：" + data['distributeNo'] + "；<br>";
                    }
                    if (row['distributeName'] == row['distributeNameSys']) {
                        row['distributeNameMsg'] = "";
                    } else {
                        row['distributeNameMsg'] = "签收人中心名称错误，应为：" + data['distributeName'] + "；<br>";
                    }
                }

            });


        $('#importGrid').datagrid('updateRow', {
            index: index,
            row: row
        });
    }
}

function back() {
    $('#importGrid').datagrid('loadData', {total: 0, rows: []});
}
