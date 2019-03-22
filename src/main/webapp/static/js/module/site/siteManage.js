/**
 * 模态对话框初始化的时候需要加Loading
 * 控件联动处理时需要禁用关联控件
 * 错误提示信息需要优化
 * 必填字段验证
 * 日期控件需要添加日期图标
 **/
$(document).ready(function () {
    "use strict";
    /* 初始化页面按钮监听 */
    btnListener.addBtnListener();
    btnListener.exportBtnListener();
    /* 初始化页面 */
    pageInit();
    /* 初始化DataTable控件 */
    initDataTable();
    initDetailDataTable();
    initTmsDataTable();
    initImDataTable();
    /* 门店页面监听 */
    btnListener.queryBtnListener();
    btnListener.confirmInfoBtnListener();
    btnListener.deleteConfirmBtnListener();
    btnListener.deleteSiteInfoBtnListener();
    btnListener.modifySiteInfoBtnListener();
    btnListener.viewSiteInfoBtnListener();
    controlListener.fileUploadControlListener();
    controlListener.pageSizeControlListener();
    controlListener.orgControlListener('#org_no', '#distribute_no');
    controlListener.provinceControlListener('#province_no', '#city_no', '#country_no', '#town_no');
    controlListener.cityControlListener('#city_no', '#country_no', '#town_no');
    controlListener.countryControlListener('#country_no', '#town_no');
    /* Modal 添加框体内的监听 */
    validatorDefine.insertSiteInfoValidator();
    btnListener.insertBtnListener();
    btnListener.uploadBtnListener();
    controlListener.confirmDeleteModalHiddenListener();
    controlListener.confirmModifyModalHiddenListener();
    controlListener.confirmModalHiddenListener();
    controlListener.modalHiddenControlListener();
    controlListener.orgControlListener('#org_no_add', '#distribute_no_add');
    controlListener.provinceControlListener('#province_no_add', '#city_no_add', '#country_no_add', '#town_no_add');
    controlListener.cityControlListener('#city_no_add', '#country_no_add', '#town_no_add');
    controlListener.countryControlListener('#country_no_add', '#town_no_add');
    /* Modal 修改框体内的监听 */
    validatorDefine.modifySiteInfoValidator();
    btnListener.modifySaveBtnListener();
    btnListener.deleteUploadedModifyBtnListener();
    btnListener.uploadBtnModifyListener();
    controlListener.fileUploadControlModifyListener();
    controlListener.modalHiddenModifyControlListener();
    controlListener.siteStatusModifyControlListener();
    controlListener.orgControlListener('#org_no_modify', '#distribute_no_modify');
    controlListener.provinceControlListener('#province_no_modify', '#city_no_modify', '#country_no_modify', '#town_no_modify');
    controlListener.cityControlListener('#city_no_modify', '#country_no_modify', '#town_no_modify');
    controlListener.countryControlListener('#country_no_modify', '#town_no_modify');

});

var uploadData = new Array(), uploadedData = new Array(), uploadDataModify = new Array(), uploadedDataModify = new Array(), uploadDataCount = 0, uploadDataDone = 0, uploadDataCountModify = 0, uploadDataDoneModify = 0;

var pageInit = function () {
    ajaxRequest.initOrgRequest('#org_no', '#distribute_no', true);
    ajaxRequest.initCancelManagerBtn();
    ajaxRequest.initAddSiteBtn();
    ajaxRequest.initProvinceRequest('#province_no');
    btnListener.timePickerListener();
    $("#create_time_begin, #create_time_end, #open_time_begin, #open_time_end, #open_time_add, #open_time_modify, #bussiness_license_term_validity_add, #bussiness_license_term_validity_modify").datetimepicker({
        language: 'zh-CN',
        todayBtn: "linked",
        clearBtn: true,
        autoclose: true
    });
    $('#fileupload').fileupload({
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|doc|xsl|ppt|rar|zip)$/i,
        maxNumberOfFiles: 5,
        maxFileSize: 5000000,
        add: function (e, data) {
            $('.progress').hide(function () {
                $('#progressBar').css({'width': '10%'})
                $('#progressBar').attr('aria-valuenow', 10);
                $('#progressBar').text('10%');
            });
            uploadData.push(data);
            uploadDataCount = uploadDataCount + 1;
        },
        done: function (e, data) {
            uploadDataDone = uploadDataDone + 1;
            if (uploadDataDone == uploadDataCount) {
                $('.shadowContainer').hide();
                uploadDataCount = 0;
                uploadDataDone = 0;
            }
            $.each(data.result, function (index, file) {
                for (var item in file) {
                    uploadedData.push(file[item]);
                    var uploadedInput = $('#uploadedInput').val();
                    if (uploadedInput) {
                        if (file[item].indexOf("http") > -1) {
                            $('#uploadedInput').val(uploadedInput + "," + file[item]);
                        }
                    } else {
                        if (file[item].indexOf("http") > -1) {
                            $('#uploadedInput').val(file[item]);
                        }
                    }
                }
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('.progress').show(function () {
                $('#progressBar').css({'width': progress + '%'});
                $('#progressBar').attr('aria-valuenow', progress);
                $('#progressBar').text(progress + '%');
            });
        }
    });
    $('#fileuploadModify').fileupload({
        dataType: 'json',
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png|doc|xsl|ppt|rar|zip)$/i,
        maxNumberOfFiles: 5,
        maxFileSize: 5000000,
        add: function (e, data) {
            $('.progressModify').hide(function () {
                $('#progressBarModify').css({'width': '10%'})
                $('#progressBarModify').attr('aria-valuenow', 10);
                $('#progressBarModify').text('10%');
            });
            uploadDataModify.push(data);
            uploadDataCountModify = uploadDataCountModify + 1;
        },
        done: function (e, data) {
            uploadDataDoneModify = uploadDataDoneModify + 1;
            if (uploadDataDoneModify == uploadDataCountModify) {
                $('.shadowContainer').hide();
                uploadDataCountModify = 0;
                uploadDataDoneModify = 0;
            }
            $.each(data.result, function (index, file) {
                for (var item in file) {
                    uploadedDataModify.push(file[item]);
                    var uploadedInput = $('#uploadedInputModify').val();
                    if (uploadedInput) {
                        if (file[item].indexOf("http") > -1) {
                            $('#uploadedInputModify').val(uploadedInput + "," + file[item]);
                        }
                    } else {
                        if (file[item].indexOf("http") > -1) {
                            $('#uploadedInputModify').val(file[item]);
                        }
                    }
                }
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('.progressModify').show(function () {
                $('#progressBarModify').css({'width': progress + '%'});
                $('#progressBarModify').attr('aria-valuenow', progress);
                $('#progressBarModify').text(progress + '%');
            });
        }
    });
}

var initDataTable = function (ajaxOptions) {
    "use strict";
    var orgAllStr = "";
    if($('#org_no').val() == "-1" || $('#org_no').val() == -1) {
        var options = $('#org_no').find('option');
        $.each(options, function(_index, _obj) {
            if($(_obj).val() != -1 && $(_obj).val() != "-1") {
                orgAllStr = orgAllStr + $(_obj).val();
                if(_index + 1 != options.length) {
                    orgAllStr = orgAllStr + ",";
                }
            }
        });
    }
    var jsonParameter = function () {
        return {
            "orgNo": $('#org_no').val(),
            "distributeNo": $('#distribute_no').val(),
            "siteName": $('#site_name').val(),
            "bussinessSiteNo": $('#bussiness_site_no').val(),
            "siteStatus": $('#site_status').val(),
            "siteLevel": $('#site_level').val(),
            "provinceNo": $('#province_no').val(),
            "cityNo": $('#city_no').val(),
            "countryNo": $('#country_no').val(),
            "townNo": $('#town_no').val(),
            "siteNo": $('#siteNo').val(),

            "jdAccount": $('#jd_account').val(),
            "siteManager": $('#site_manager').val(),
            "managerName": $('#manager_name').val(),
            "createTimeBegin": $('#create_time_begin').val(),
            "createTimeEnd": $('#create_time_end').val(),
            "openTimeBegin": $('#open_time_begin').val(),
            "openTimeEnd": $('#open_time_end').val(),
            "currentPage": $('.currentPage').val(),
            "pageSize": $('#pageRange').val(),
            "nextPage": $('.nextPageInput').val(),
            "prevPage": $('.prevPageInput').val(),
            "erp":$('#loginUser').val(),
            "orgAllList": orgAllStr
        }
    };
    var tableAjaxSetting = {
        ajax: {
            "url": "/site/querySiteBaseInfoForPage",
            "method": "POST",
            "data": jsonParameter(),
            "dataSrc": "result"
        }
    }
    var tableSetting = {
        "dom": '<"toolbar"<"row"<"col-md-6"<"btnPlace">>>>rt',
        iDisplayLength: $('#pageRange').val(),
        columns: [
            {
                data: null,
                "sWidth": "10px",
                "searchable": false,
                "orderable": false,
                "bSort": false,
                render: function (data, type, row) {

                    var json=JSON.stringify(row);
                    return '<input type="checkbox"  value=\''+json+'\' name="switchSingleInput" id="switchSingleInput" class="switchSingleInput"/>';
                }
            },
            {
                data: "orgName"
            },
            {
                data: "distributeName"
            },
            {
                data: "siteName"
            },


            {
                data: "bussinessSiteNo"
            },
            {
                data: "siteNo"
            },
            {
                data: "provinceName"
            },
            {
                data: "cityName"
            },
            {
                data: "countryName"
            },
            {
                data: "managerName"
            },
            {
                data: "managerTel"
            },
            {
                data: "siteManager"
            },
            {
                data: "jdAccount"
            },
            {
                data: "siteLevel",
                render: function (data, type, row) {
                    if (data == 0) {
                        return "A级";
                    } else if (data == 1) {
                        return "B级";
                    } else if (data == 2) {
                        return "C级";
                    } else if (data == 3) {
                        return "D级";
                    } else if (data == 4) {
                        return "E级";
                    } else {
                        return "未定级";
                    }
                }
            },
            {
                data: "siteStatus",
                render: function (data, type, row) {
                    if (data == "0") {
                        return "未启用";
                    } else if (data == "1") {
                        return "启用";
                    } else if (data == "2") {
                        return "禁用";
                    } else {
                        return "未知";
                    }
                }
            },
            /*{
             data: "createTime",
             render: function (data, type, row) {
             return timeConvert(data);
             }
             },*/
            {
                data: "openTime",
                render: function (data, type, row) {
                    var convert = timeConvert(data);
                    if(convert == "1970-01-01") {
                        convert = "无开业日期"
                    }
                    return convert;
                }
            },
            {
                data: null,
                "sWidth": "90px",
                "searchable": false,
                "orderable": false,
                "bSort": false,
                render: function (data, type, row) {
                    if(data.hasDelRight && data.hasEditRight){
                        return '<button type="button" class="bootstrapBtn viewSiteInfoBtn" data-target="#viewBtnModal"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> 查看</div>'
                                + '<button type="button" class="bootstrapBtn modifySiteInfoBtn" data-target="#modifyBtnModal"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span> 修改</div>'
                                + '<button type="button" class="bootstrapBtn marginLeft10 deleteSiteInfoBtn" style="margin-left: 2px;"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> 删除</div>';
                    }else if(data.hasDelRight && !data.hasEditRight){
                        return  '<button type="button" class="bootstrapBtn viewSiteInfoBtn" data-target="#viewBtnModal"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> 查看</div>'
                                + '<button type="button" class="bootstrapBtn marginLeft10 deleteSiteInfoBtn" style="margin-left: 2px;"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> 删除</div>';
                    }else if(!data.hasDelRight && data.hasEditRight){
                        return '<button type="button" class="bootstrapBtn viewSiteInfoBtn" data-target="#viewBtnModal"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> 查看</div>'
                                + '<button type="button" style="margin-left: 25px" class="bootstrapBtn modifySiteInfoBtn" data-target="#modifyBtnModal"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span> 修改</div>';
                    }else{
                        return '<button type="button" class="bootstrapBtn viewSiteInfoBtn" data-target="#viewBtnModal"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> 查看</div>';
                    }
                }
            }
        ],
        "aoColumnDefs": [{"bSortable": false, "aTargets": [0]}],
        "bDestroy": true,
        fnCreatedRow: function (nRow, aData,
                                iDisplayIndex) {
            $(nRow).addClass("table-row")
        },
        "initComplete": function (settings, json) {
            var footerInfoText = $('.footerInfo').text();
            var splitArray = footerInfoText.split(',');
            $('#exportBtn').removeAttr('disabled');
            $('.footerInfo').empty();
            if (json) {
                $('.footerInfo').append("当前显示从 " + parseInt(parseInt(settings._iDisplayStart) + 1) + " 到 " + settings._iDisplayLength + " 条记录,共" + json.totalSize + "条");
                $('.totalPage').empty();
                $('.totalPage').text(json.totalPage);
            } else {
                $('.footerInfo').append("当前显示从 " + parseInt(parseInt(settings._iDisplayStart) + 1) + " 到 " + settings._iDisplayLength + " 条记录," + splitArray[1]);
            }
        },
        "rowCallback": function (nRow, aData, iRowNum) {
        },
        "language": {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": 'Loading...',
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        }
    }
    var mergeSetting = {};
    btnListener.refreshBtnListenerRemove();
    btnListener.nextPageBtnListenerRemove();
    btnListener.prevPageBtnListenerRemove();
    btnListener.lastPageBtnListenerRemove();
    btnListener.firstPageBtnListenerRemove();
    if (ajaxOptions) {
        btnListener.refreshBtnListener();
        btnListener.nextPageBtnListener();
        btnListener.prevPageBtnListener();
        btnListener.lastPageBtnListener();
        btnListener.firstPageBtnListener();
        $.extend(mergeSetting, tableSetting, tableAjaxSetting)
        $("#resultGrid").DataTable(mergeSetting);
    } else {
        $("#resultGrid").DataTable(tableSetting);
    }
}

var initTmsDataTable = function () {
    var tableSetting = {
        "dom": '<"toolbar"<"row"<"col-md-6"<"btnPlace">>>>rt',
        iDisplayLength: 40,
        columns: [
            {
                data: null,
                "searchable": false,
                "orderable": false,
                "sWidth": "40px",
                "bSort": false,
                render: function (data, type, row) {
                    return '';
                }
            },
            {
                data: "belongsBranchName"
            },
            {
                data: "belongLargewarehouseName"
            },
            {
                data: "websiteNo"
            },
            {
                data: "websiteName"
            }
        ],
        "bDestroy": true,
        fnCreatedRow: function (nRow, aData,
                                iDisplayIndex) {
            $(nRow).addClass("table-row")
        },
        "initComplete": function (settings, json) {
        },
        "rowCallback": function (nRow, aData, iRowNum) {
            $(nRow).find('td:first').empty().text(iRowNum + 1);
        },
        "language": {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": 'Loading...',
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        }
    }
    $('#resultTmsGrid').DataTable(tableSetting);
    $('#resultTmsGridView').DataTable(tableSetting);
}

var initImDataTable = function () {
    var tableSetting = {
        "dom": '<"toolbar"<"row"<"col-md-6"<"btnPlace">>>>rt',
        iDisplayLength: 40,
        "sWidth": "40px",
        columns: [
            {
                data: null,
                "searchable": false,
                "orderable": false,
                "bSort": false,
                render: function (data, type, row) {
                    return '';
                }
            },
            {
                data: "belongsBranchName"
            },
            {
                data: "belongLargewarehouseName"
            },
            {
                data: "websiteNo"
            },
            {
                data: "websiteName"
            }
        ],
        "bDestroy": true,
        fnCreatedRow: function (nRow, aData,
                                iDisplayIndex) {
            $(nRow).addClass("table-row")
        },
        "initComplete": function (settings, json) {
        },
        "rowCallback": function (nRow, aData, iRowNum) {
            $(nRow).find('td:first').empty().text(iRowNum + 1);
        },
        "language": {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": 'Loading...',
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        }
    }
    $('#resultImGrid').DataTable(tableSetting);
    $('#resultImGridView').DataTable(tableSetting);
}

var initDetailDataTable = function () {
    var tableSetting = {
        "dom": '<"toolbar"<"row"<"col-md-6"<"btnPlace">>>>rt',
        iDisplayLength: 5,
        columns: [
            {
                data: "fileName"
            },
            {
                data: "jssUrl"
            },
            {
                data: null,
                "searchable": false,
                "orderable": false,
                "bSort": false,
                render: function (data, type, row) {
                    if (data.fileName && data.fileName != "#") {
                        return '<button type="button" class="bootstrapBtn marginLeft10 deleteUploadedBtnModify" style="margin-left: 2px;"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> 删除</div>';
                    } else {
                        return '';
                    }
                }
            }
        ],
        "bDestroy": true,
        fnCreatedRow: function (nRow, aData,
                                iDisplayIndex) {
            $(nRow).addClass("table-row")
        },
        "initComplete": function (settings, json) {
        },
        "rowCallback": function (nRow, aData, iRowNum) {
        },
        "language": {
            "sProcessing": "处理中...",
            "sLengthMenu": "显示 _MENU_ 项结果",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
            "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": 'Loading...',
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        }
    }
    $('#resultGridModify').DataTable(tableSetting);
    $('#resultGridView').DataTable(tableSetting);
}

var ajaxHandler = {
    successHandler: function (data1, data2, data3) {
        $('.progressModify').hide(function () {
            $('#progressBarModify').css({'width': '10%'})
            $('#progressBarModify').attr('aria-valuenow', 10);
            $('#progressBarModify').text('10%');
        });
        $("#selectedFilesNameModify").text('');
        $('#org_no_modify').find('option').remove();
        $('#org_no_modify').append('<option value="-1">请选择</option>');
        $('#province_no_modify').find('option').remove();
        $('#province_no_modify').append('<option value="-1">请选择</option>');
        var orgNo, provinceNo, distributeNo;

        if (data1 && data1[1] == "success") {
            orgNo = data1[0].result.orgNo;
            provinceNo = data1[0].result.provinceNo;
            distributeNo = data1[0].result.distributeNo;
            var result = data1[0].result;
            if(data1[0].systemAdmin) {
                $("#site_status_modify").prop("disabled", false);
            } else {
                $("#site_status_modify").prop("disabled", true);
            }
            $('input[name="company_type_modify"]:checked').removeAttr('checked');
            $('#site_name_modify,#site_no_modify, #bussiness_site_no_modify, #open_time_modify, #address_modify, #gps_longitude_modify, #gps_latitude_modify, #jd_account_modify,' +
                ' #site_manager_modify, #telephone_modify, #email_modify, #weixin_modify, #managerName_modify, #managerErp_modify, #company_name_modify,' +
                ' #bussiness_license_no_modify, #bussiness_license_address_modify, #tax_registration_no_modify, #bank_deposit_name_modify,' +
                ' #bank_deposit_address_modify, #bank_account_modify, #bank_account_name_modify, #unionpay_number_modify, #bussiness_license_term_validity_modify, #remark_modify').val('');
            $('#start_time_modify').val('false');
            $('#site_status_modify option:selected').attr('selected', 'false');
            $('#site_status_modify option:eq(0)').attr('selected', 'selected');
            $('#tax_type_modify option:selected').attr('selected', 'false');
            $('#tax_type_modify option:eq(0)').attr('selected', 'selected');
            $('#tax_rate_modify option:selected').attr('selected', 'false');
            $('#tax_rate_modify option:eq(0)').attr('selected', 'selected');
            $('#site_name_modify').val(result.siteName);
            $('#bussiness_site_no_modify').val(result.bussinessSiteNo);
            $('#site_no_modify').val(result.siteNo);
            $('#site_status_modify option').each(function (_index, _obj) {
                if (result.siteStatus == $(_obj).val()) {
                    $('#site_status_modify option:selected').attr('selected', 'false');
                    $(_obj).attr("selected", "selected");
                }
            });
            var convert = timeConvert(result.openTime, true);
            if(convert.indexOf('1970-01-01') > -1) {
                convert = "";
            }
            $('#open_time_modify').val(convert);
            $('#address_modify').val(result.address);
            $('#gps_longitude_modify').val(result.gpsLongitude);
            $('#gps_latitude_modify').val(result.gpsLatitude);
            $('#jd_account_modify').val(result.jdAccount);
            $('#site_manager_modify').val(result.siteManager);
            $('#telephone_modify').val(result.telephone);
            $('#email_modify').val(result.email);
            $('#weixin_modify').val(result.wechat);
            $('#managerName_modify').val(result.managerName);
            $('#managerErp_modify').val(result.managerErp);
            if(data1[0].syncResult) {
                var tmsJsonObject = [];
                var imJsonObject = [];
                $.each(data1[0].syncResult, function(_index, _obj) {
                    if(_obj.systemSource == 0) {
                        tmsJsonObject.push(_obj);
                    } else {
                        imJsonObject.push(_obj);
                    }
                });
                $('#resultImGrid').DataTable().rows.add(imJsonObject).draw();
                $('#resultTmsGrid').DataTable().rows.add(tmsJsonObject).draw();
            }

            if (result.siteExtendInfo) {
                if (result.siteExtendInfo.jssAttachement && $.fn.DataTable.isDataTable('#resultGrid')) {
                    var _jsonArray = [];
                    var jssUrlArray = result.siteExtendInfo.jssAttachement.split(',');
                    $.each(jssUrlArray, function (_index, _obj) {
                        var _fileName = _obj.substring(_obj.lastIndexOf('_') + 1, _obj.length);
                        var _jsonObject = {"fileName": _fileName, "jssUrl": _obj};
                        if (_jsonObject.fileName && _jsonObject.fileName !== "#") {
                            _jsonArray.push(_jsonObject);
                        }
                    });
                    $('#resultGridModify').DataTable().rows.add(_jsonArray).draw();
                }
                $('#company_name_modify').val(result.siteExtendInfo.companyName);
                $('#bussiness_license_no_modify').val(result.siteExtendInfo.bussinessLicenseNo);
                $('#bussiness_license_address_modify').val(result.siteExtendInfo.bussinessLicenseAddress);
                $('#tax_registration_no_modify').val(result.siteExtendInfo.taxRegistrationNo);
                $('#bank_deposit_name_modify').val(result.siteExtendInfo.bankDepositName);
                $('#bank_deposit_address_modify').val(result.siteExtendInfo.bankDepositAddress);
                $('#bank_account_modify').val(result.siteExtendInfo.bankAccount);
                $('#bank_account_name_modify').val(result.siteExtendInfo.bankAccountName);
                $('#unionpay_number_modify').val(result.siteExtendInfo.unionpayNumber);
                var convertBbussinessLicenseTermValidity = timeConvert(result.siteExtendInfo.bussinessLicenseTermValidity);
                if (convertBbussinessLicenseTermValidity !== "1000-01-06") {
                    $('#bussiness_license_term_validity_modify').val(convertBbussinessLicenseTermValidity);
                }
                $('#remark_modify').val(result.siteExtendInfo.remark);
                $('#tax_type_modify option').each(function (_index, _obj) {
                    if (result.siteExtendInfo.taxType == $(_obj).val()) {
                        $('#tax_type_modify option:selected').attr('selected', 'false');
                        $(_obj).attr("selected", "selected");
                    }
                });
                $('#tax_rate_modify option').each(function (_index, _obj) {
                    if (result.siteExtendInfo.taxRate == $(_obj).val()) {
                        $('#tax_rate_modify option:selected').attr('selected', 'false');
                        $(_obj).attr("selected", "selected");
                    }
                });
                $('#modifyBtnModal input[name="company_type_modify"]').each(function (_index, _obj) {
                    if (result.siteExtendInfo.companyType == $(_obj).val()) {
                        $('#modifyBtnModal input[name="company_type_modify"]:checked').removeAttr('checked');
                        $(_obj).prop("checked", true)
                    }
                });
            }
        }
        if (data2 && data2[1] == "success") {
            $.each(data2[0], function (_index, _obj) {
                if (orgNo == _obj.org_no) {
                    $("#org_no_modify option:selected").removeAttr('selected');
                    $("#org_no_modify").append('<option value="' + _obj.org_no + '" selected>' + _obj.org_name + '</option>');
                    ajaxRequest.initDistributeRequest(_obj.org_no, '#distribute_no_modify', distributeNo);
                } else {
                    $("#org_no_modify").append('<option value="' + _obj.org_no + '">' + _obj.org_name + '</option>');
                }
            });
        }
        if (data3 && data3[1] == "success") {
            $.each(data3[0], function (_index, _obj) {
                if (provinceNo == _obj.areaId) {
                    $('#province_no_modify option:selected').removeAttr('selected');
                    $("#province_no_modify").append('<option value="' + _obj.areaId + '" selected>' + _obj.areaName + '</option>');
                    ajaxRequest.initCityRequest(_obj.areaId, '#city_no_modify', data1[0].result)
                } else {
                    $("#province_no_modify").append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                }
            });
        }
        $('.shadowContainer').hide();
        $('#modifyBtnModal').modal('show');
    },
    viewSuccessHandler: function (data1, data2, data3) {
        $('#org_no_view').find('option').remove();
        $('#org_no_view').append('<option value="-1">请选择</option>');
        $('#province_no_view').find('option').remove();
        $('#province_no_view').append('<option value="-1">请选择</option>');
        var orgNo, provinceNo, distributeNo;

        if (data1 && data1[1] == "success") {
            orgNo = data1[0].result.orgNo;
            provinceNo = data1[0].result.provinceNo;
            distributeNo = data1[0].result.distributeNo;
            var result = data1[0].result;
            $('input[name="company_type_view"]:checked').removeAttr('checked');
            $('#site_name_view,#site_no_view, #bussiness_site_no_view, #open_time_view, #address_view, #gps_longitude_view, #gps_latitude_view, #jd_account_view,' +
            ' #site_manager_view, #telephone_view, #email_view, #weixin_view, #managerName_view, #managerErp_view, #company_name_view,' +
            ' #bussiness_license_no_view, #bussiness_license_address_view, #tax_registration_no_view, #bank_deposit_name_view,' +
            ' #bank_deposit_address_view, #bank_account_view, #bank_account_name_view, #unionpay_number_view, #bussiness_license_term_validity_view, #remark_view').val('');
            $('#start_time_view').val('false');
            $('#site_status_view option:selected').attr('selected', 'false');
            $('#site_status_view option:eq(0)').attr('selected', 'selected');
            $('#tax_type_view option:selected').attr('selected', 'false');
            $('#tax_type_view option:eq(0)').attr('selected', 'selected');
            $('#tax_rate_view option:selected').attr('selected', 'false');
            $('#tax_rate_view option:eq(0)').attr('selected', 'selected');
            $('#site_name_view').val(result.siteName);
            $('#bussiness_site_no_view').val(result.bussinessSiteNo);
            $('#site_no_view').val(result.siteNo);
            $('#site_status_view option').each(function (_index, _obj) {
                if (result.siteStatus == $(_obj).val()) {
                    $('#site_status_view option:selected').attr('selected', 'false');
                    $(_obj).attr("selected", "selected");
                }
            });
            var convert = timeConvert(result.openTime, true);
            if(convert.indexOf('1970-01-01') > -1) {
                convert = "";
            }
            $('#open_time_view').val(convert);
            $('#address_view').val(result.address);
            $('#gps_longitude_view').val(result.gpsLongitude);
            $('#gps_latitude_view').val(result.gpsLatitude);
            $('#jd_account_view').val(result.jdAccount);
            $('#site_manager_view').val(result.siteManager);
            $('#telephone_view').val(result.telephone);
            $('#email_view').val(result.email);
            $('#weixin_view').val(result.wechat);
            $('#managerName_view').val(result.managerName);
            $('#managerErp_view').val(result.managerErp);
            if(data1[0].syncResult) {
                var tmsJsonObject = [];
                var imJsonObject = [];
                $.each(data1[0].syncResult, function(_index, _obj) {
                    if(_obj.systemSource == 0) {
                        tmsJsonObject.push(_obj);
                    } else {
                        imJsonObject.push(_obj);
                    }
                });
                $('#resultImGridView').DataTable().rows.add(imJsonObject).draw();
                $('#resultTmsGridView').DataTable().rows.add(tmsJsonObject).draw();
            }

            if (result.siteExtendInfo) {
                if (result.siteExtendInfo.jssAttachement && $.fn.DataTable.isDataTable('#resultGrid')) {
                    var _jsonArray = [];
                    var jssUrlArray = result.siteExtendInfo.jssAttachement.split(',');
                    $.each(jssUrlArray, function (_index, _obj) {
                        var _fileName = _obj.substring(_obj.lastIndexOf('_') + 1, _obj.length);
                        var _jsonObject = {"fileName": _fileName, "jssUrl": _obj};
                        if (_jsonObject.fileName && _jsonObject.fileName !== "#") {
                            _jsonArray.push(_jsonObject);
                        }
                    });
                    $('#resultGridView').DataTable().rows.add(_jsonArray).draw();
                }
                $('#company_name_view').val(result.siteExtendInfo.companyName);
                $('#bussiness_license_no_view').val(result.siteExtendInfo.bussinessLicenseNo);
                $('#bussiness_license_address_view').val(result.siteExtendInfo.bussinessLicenseAddress);
                $('#tax_registration_no_view').val(result.siteExtendInfo.taxRegistrationNo);
                $('#bank_deposit_name_view').val(result.siteExtendInfo.bankDepositName);
                $('#bank_deposit_address_view').val(result.siteExtendInfo.bankDepositAddress);
                $('#bank_account_view').val(result.siteExtendInfo.bankAccount);
                $('#bank_account_name_view').val(result.siteExtendInfo.bankAccountName);
                $('#unionpay_number_view').val(result.siteExtendInfo.unionpayNumber);
                var convertBbussinessLicenseTermValidity = timeConvert(result.siteExtendInfo.bussinessLicenseTermValidity);
                if (convertBbussinessLicenseTermValidity !== "1000-01-06") {
                    $('#bussiness_license_term_validity_view').val(convertBbussinessLicenseTermValidity);
                }
                $('#remark_view').val(result.siteExtendInfo.remark);
                $('#tax_type_view option').each(function (_index, _obj) {
                    if (result.siteExtendInfo.taxType == $(_obj).val()) {
                        $('#tax_type_modify option:selected').attr('selected', 'false');
                        $(_obj).attr("selected", "selected");
                    }
                });
                $('#tax_rate_view option').each(function (_index, _obj) {
                    if (result.siteExtendInfo.taxRate == $(_obj).val()) {
                        $('#tax_rate_view option:selected').attr('selected', 'false');
                        $(_obj).attr("selected", "selected");
                    }
                });
                $('#viewBtnModal input[name="company_type_view"]').each(function (_index, _obj) {
                    if (result.siteExtendInfo.companyType == $(_obj).val()) {
                        $('#viewBtnModal input[name="company_type_view"]:checked').removeAttr('checked');
                        $(_obj).prop("checked", true)
                    }
                });
            }
        }
        if (data2 && data2[1] == "success") {
            $.each(data2[0], function (_index, _obj) {
                if (orgNo == _obj.org_no) {
                    $("#org_no_view option:selected").removeAttr('selected');
                    $("#org_no_view").append('<option value="' + _obj.org_no + '" selected>' + _obj.org_name + '</option>');
                    ajaxRequest.initDistributeRequest(_obj.org_no, '#distribute_no_view', distributeNo);
                } else {
                    $("#org_no_view").append('<option value="' + _obj.org_no + '">' + _obj.org_name + '</option>');
                }
            });
        }
        if (data3 && data3[1] == "success") {
            $.each(data3[0], function (_index, _obj) {
                if (provinceNo == _obj.areaId) {
                    $('#province_no_view option:selected').removeAttr('selected');
                    $("#province_no_view").append('<option value="' + _obj.areaId + '" selected>' + _obj.areaName + '</option>');
                    ajaxRequest.initViewCityRequest(_obj.areaId, '#city_no_view', data1[0].result);
                } else {
                    $("#province_no_view").append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                }
            });

        }
        $('#viewBtnModal :input').each(function(){
            $(this).attr("disabled", "disabled");
        });

        $(".close").removeAttr('disabled');
        $('.shadowContainer').hide();
        $('#viewBtnModal').modal('show');
    },
    failureHandler: function (data1, data2, data3) {
        console.log("加载区域、运营中心、四级地址信息出错，请联系管理员");
        window.alert("加载区域、运营中心、四级地址信息出错，请联系管理员");
        $('.shadowContainer').hide();
    },
    successDeleteHandler: function (data1, data2) {
        if (data1 && data1[1] == "success" && data2 && data2[1] == "success") {
            /* 删除云存储文件成功,且更新数据库成功 */
            $('#resultGridModify').DataTable().row($('.needRemove')).remove().draw();
            $('.shadowContainer').hide();
        }
    },
    failureDeleteHandler: function (data1, data2) {
        window.alert("删除附件或者更新数据库失败，请联系管理员");
        console.log("删除附件或者更新数据库失败，请联系管理员");
        $('.shadowContainer').hide();
    }
}

var btnListener = {
    confirmInfoBtnListener: function () {
        $('.confirmInfoBtn').on('click', function () {
            $('.nextPageInput').val("1");
            $('.prevPageInput').val("0");
            initDataTable(true);
            $('.pageNoInput').val("1");
            $('.currentPage').val("1");
        });
    },
    deleteConfirmBtnListener: function () {
        $('.deleteConfirmBtn').on('click', function () {
            var siteNo = $('#deleteHiddenInput').val();
            if (siteNo) {
                ajaxRequest.deleteSiteInfo(siteNo);
            } else {
                $('#confirmInfoModal .confirmInfoContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> 删除门店出错，门店编码为空，请联系管理员');
                $('#confirmInfoModal').modal('show');
            }
        });
    },
    uploadBtnModifyListener: function () {
        $('#uploadBtnModify').on('click', function () {
            $('.shadowContainer').show();
            $.each(uploadDataModify, function (_index, _obj) {
                _obj.submit();
            });
            $('#uploadBtnModify').attr("disabled", "disabled");
            uploadDataModify = new Array();
        });
    },
    exportBtnListener: function () {
        $('#exportBtn').on('click', function () {
            $('#exportForm').submit();
        });
    },
    uploadBtnListener: function () {
        $('#uploadBtn').on('click', function () {
            $('.shadowContainer').show();
            $.each(uploadData, function (_index, _obj) {
                _obj.submit();
            });
            $('#uploadBtn').attr("disabled", "disabled");
            uploadData = new Array();
        });
    },
    modifySaveBtnListener: function () {
        $('.modifySaveBtn').on('click', function (e) {
            e.preventDefault();
            if($('#modifySiteInfoForm').valid()) {
                $('.shadowContainer').show();
                ajaxRequest.modifySiteRequest();
            }
        });
    },
    modifySiteInfoBtnListener: function () {
        $('#resultGrid').on('click', '.modifySiteInfoBtn', function () {
            $('.shadowContainer').show();
            var siteNo = $('#resultGrid').DataTable().row($(this).parents('tr')).data().siteNo;
            var loginUser = $('#loginUser').val();
            $('#resultGridModify').DataTable().clear().draw();
            $('#resultTmsGrid').DataTable().clear().draw();
            $('#resultImGrid').DataTable().clear().draw();
            if (siteNo && loginUser) {
                $.when($.ajax({
                        url: '/site/queryOneSiteInfoForPage',
                        data: {
                            'siteNo': siteNo,
                            'loginUser': loginUser
                        },
                        type: 'POST',
                        dataType: 'json'
                    }), $.ajax({
                        url: '/erp/common/areaCascadeController/getUserUniqueArea',
                        type: 'POST',
                        dataType: 'json'
                    }), $.ajax({
                        url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo',
                        type: 'POST',
                        dataType: 'json',
                        data: {parentNo: 0}
                    }))
                    .then(ajaxHandler.successHandler, ajaxHandler.failureHandler);
            } else {
                console.log('门店编码为空，请联系管理员');
                window.alert("门店编码为空，请联系管理员");
            }
        });
    },
    viewSiteInfoBtnListener: function () {
        $('#resultGrid').on('click', '.viewSiteInfoBtn', function () {
            $('.shadowContainer').show();
            var siteNo = $('#resultGrid').DataTable().row($(this).parents('tr')).data().siteNo;
            var loginUser = $('#loginUser').val();
            $('#resultGridView').DataTable().clear().draw();
            $('#resultTmsGridView').DataTable().clear().draw();
            $('#resultImGridView').DataTable().clear().draw();
            if (siteNo && loginUser) {
                $.when($.ajax({
                    url: '/site/queryOneSiteInfoForPage',
                    data: {
                        'siteNo': siteNo,
                        'loginUser': loginUser
                    },
                    type: 'POST',
                    dataType: 'json'
                }), $.ajax({
                    url: '/erp/common/areaCascadeController/getUserUniqueArea',
                    type: 'POST',
                    dataType: 'json'
                }), $.ajax({
                    url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo',
                    type: 'POST',
                    dataType: 'json',
                    data: {parentNo: 0}
                }))
                    .then(ajaxHandler.viewSuccessHandler, ajaxHandler.failureHandler);
            } else {
                console.log('门店编码为空，请联系管理员');
                window.alert("门店编码为空，请联系管理员");
            }
        });
    },
    deleteUploadedModifyBtnListener: function () {
        $('#resultGridModify').on('click', '.deleteUploadedBtnModify', function () {
            $('.shadowContainer').show();
            var urlStr = $('#resultGridModify').DataTable().row($(this).parents('tr')).data().jssUrl;
            $(this).parents('tr').addClass("needRemove");
            var rowsData = $('#resultGridModify').DataTable().rows().data();
            var leaveStr = "";
            for (var i = 0; i < rowsData.length; i++) {
                if (rowsData[i].jssUrl !== urlStr) {
                    if (leaveStr && leaveStr != "") {
                        leaveStr = leaveStr + "," + rowsData[i].jssUrl;
                    } else {
                        leaveStr = rowsData[i].jssUrl;
                    }
                }
            }
            if (urlStr) {
                /* 删除云存储,更新扩展表jss字段,重新绘制表格 */
                urlStr = urlStr.substring(urlStr.lastIndexOf('/') + 1, urlStr.length);
                $.when($.ajax({
                        url: '/site/deleteUploadedForPage',
                        type: 'POST',
                        data: {
                            "uploadedList": urlStr
                        },
                        type: 'POST'
                    }), $.ajax({
                        url: '/site/updateSiteUploadInfo',
                        data: {
                            "siteNo": $('#site_no_modify').val(),
                            "jssAttachement": leaveStr
                        },
                        type: 'POST',
                        dataType: 'json'
                    }))
                    .then(ajaxHandler.successDeleteHandler, ajaxHandler.failureDeleteHandler);
            }
        });
    },
    deleteSiteInfoBtnListener: function () {
        $('#resultGrid').on('click', '.deleteSiteInfoBtn', function () {
            $('#deleteHiddenInput').val('');
            var siteNo = $('#resultGrid').DataTable().row($(this).parents('tr')).data().siteNo;
            $('#deleteHiddenInput').val(siteNo);
            $('#deleteConfirmModal').modal('show');
        });
    },
    firstPageBtnListenerRemove: function () {
        $('.firstPage').off('click');
    },
    firstPageBtnListener: function () {
        $('.firstPage').on('click', function () {
            $('.nextPageInput').val("1");
            var currentPage = $('.currentPage').val();
            if (parseInt(currentPage) !== 1) {
                $('.prevPageInput').val("1");
                initDataTable(true);
                $('.pageNoInput').val("1");
                $('.currentPage').val("1");
            }
        });
    },
    lastPageBtnListenerRemove: function () {
        $('.lastPage').off('click');
    },
    lastPageBtnListener: function () {
        $('.lastPage').on('click', function () {
            $(".prevPageInput").val("0");
            var totalPage = $('.totalPage').text();
            var currentPage = $('.currentPage').val();
            if (currentPage !== totalPage) {
                $('.nextPageInput').val(totalPage);
                initDataTable(true);
                $('.pageNoInput').val(totalPage);
                $('.currentPage').val(totalPage);
            }
        });
    },
    prevPageBtnListenerRemove: function () {
        $('.prevPage').off('click');
    },
    prevPageBtnListener: function () {
        $('.prevPage').on('click', function () {
            $('.nextPageInput').val(1);
            var currentPage = $('.currentPage').val();
            var prevPageInput = parseInt(currentPage) - parseInt(1);
            if (prevPageInput >= 1) {
                $('.prevPageInput').val(prevPageInput);
                initDataTable(true);
                $('.pageNoInput').val(prevPageInput);
                $('.currentPage').val(prevPageInput);
            }
        });
    },
    nextPageBtnListenerRemove: function () {
        $('.nextPage').off('click');
    },
    nextPageBtnListener: function () {
        $('.nextPage').on('click', function () {
            $('.prevPageInput').val("0");
            var currentPage = $('.currentPage').val();
            var totalPage = $('.totalPage').text();
            var nextPageInput = parseInt(currentPage) + parseInt(1);
            if (nextPageInput <= totalPage) {
                $('.nextPageInput').val(nextPageInput);
                initDataTable(true);
                $('.pageNoInput').val(nextPageInput);
                $('.currentPage').val(nextPageInput);
            }
        });
    },
    refreshBtnListenerRemove: function () {
        $('.refreshBtn').off('click');
    },
    refreshBtnListener: function () {
        $('.refreshBtn').on('click', function () {
            $('.nextPageInput').val("1");
            $('.prevPageInput').val("0");
            $('#resultGrid').DataTable().ajax.reload();
        });
    },
    queryBtnListener: function () {
        $('#querySiteBtn').on('click', function (e) {
            e.preventDefault();
            $('.currentPage').val("1");
            $('.nextPageInput').val("1");
            $('.prevPageInput').val("0");
            if ($.fn.DataTable.isDataTable('#resultGrid')) {
                $("#resultGrid").DataTable().destroy();
                initDataTable(true);
                $('.pageNoInput').val("1");
            }
        });
    },
    addBtnListener: function () {
        $('#addBtn').on('click', function (e) {
            e.preventDefault();
        });
        $('#unbindBtn').on('click', function (e) {
            e.preventDefault();

            unbindManager();

        });



        $('#addBtnModal').on("show.bs.modal", function (e) {
            if (e.relatedTarget) {
                $('.progress').hide(function () {
                    $('#progressBar').css({'width': '10%'})
                    $('#progressBar').attr('aria-valuenow', 10);
                    $('#progressBar').text('10%');
                });
                $('#selectedFilesName').text('');
                $('#org_no_add').find('option').remove();
                $('#org_no_add').append('<option value="-1">请选择</option>');
                $('#province_no_add').find('option').remove();
                $('#province_no_add').append('<option value="-1">请选择</option>');
                $('#selectedFilesName').empty();
                ajaxRequest.initOrgRequest('#org_no_add', '#distribute_no_add', true);
                ajaxRequest.initProvinceRequest('#province_no_add');
            }
        });
    },
    timePickerListener: function () {
        $('#create_time_end').datetimepicker({
            language: 'zh-CN',
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true
        }).on('changeDate', function () {
            if ($(this).val() < $('#create_time_begin').val()) {
                window.alert('创建日期的结束时间不能小于起始时间');
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
                    window.alert('创建日期的起始时间不能大于于结束时间');
                    $(this).val("");
                }
            }
        });
        $('#open_time_end').datetimepicker({
            language: 'zh-CN',
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true
        }).on('changeDate', function () {
            if ($(this).val() < $('#open_time_begin').val()) {
                window.alert('起始日期的结束时间不能小于起始时间');
                $(this).val("");
            }
        });
        $('#open_time_begin').datetimepicker({
            language: 'zh-CN',
            todayBtn: "linked",
            clearBtn: true,
            autoclose: true
        }).on('changeDate', function () {
            if ($('#open_time_end').val()) {
                if ($(this).val() > $('#open_time_end').val()) {
                    window.alert('起始日期的起始时间不能大于于结束时间');
                    $(this).val("");
                }
            }
        });
    },
    insertBtnListener: function () {
        $('.insertBtn').on('click', function (e) {
            e.preventDefault();
            if ($(".insertSiteInfoForm").valid()) {
                $(".shadowContainer").show();
                ajaxRequest.insertSiteRequest();
            }
        });
    }
}

var controlListener = {
    confirmModifyModalHiddenListener: function () {
        $('#confirmModifyModal').on('hide.bs.modal', function () {
            $('#modifyBtnModal').modal('hide');
        });
    },
    siteStatusModifyControlListener: function () {
        $('#site_status_modify').on('change', function () {
            var controlVal = $(this).val();
            if (controlVal && controlVal == 1) {
                $('#start_time_modify').val('true');
            }
        });
    },
    confirmModalHiddenListener: function () {
        $('#confirmModal').on('hide.bs.modal', function () {
            $('#addBtnModal').modal('hide');
        });
    },
    confirmDeleteModalHiddenListener: function () {
        $('#confirmInfoModal').on('hide.bs.modal', function () {
            $('#deleteConfirmModal').modal('hide');
        });
    },
    modalHiddenControlListener: function () {
        $('#addBtnModal').on('hide.bs.modal', function () {
            $('#uploadedInput').val("");
            if (uploadedData) {
                ajaxRequest.uploadedDeleteRequest();
            }
        });
    },
    modalHiddenModifyControlListener: function () {
        $('#modifyBtnModal').on('hide.bs.modal', function () {
            $('#uploadedInputModify').val("");
            if (uploadedDataModify) {
                ajaxRequest.uploadedDeleteModifyRequest();
            }
        });
    },
    fileUploadControlModifyListener: function () {
        $('#fileuploadModify').on('change', function () {
            if ($(this)[0] && $(this)[0].files && $(this)[0].files.length > 1) {
                if ($(this)[0].files.length > 5) {
                    console.log("您选择的文件大于5个，请重新选择");
                    window.alert("您选择的文件大于5个，请重新选择");
                    $('#uploadBtnModify').attr("disabled", "disabled");
                    uploadDataModify = new Array();
                    $('#uploadedInputModify').val('');
                } else {
                    $("#selectedFilesNameModify").text("已选择 " + $(this)[0].files.length + " 个文件");
                    $('#uploadBtnModify').removeAttr("disabled");
                }
            } else if ($(this)[0] && $(this)[0].files && $(this)[0].files.length == 1) {
                $("#selectedFilesNameModify").text("已选择文件： " + $(this)[0].files[0].name);
                $('#uploadBtnModify').removeAttr("disabled");
                $('#uploadedInputModify').val('');
            }
            if ($(this)[0] && $(this)[0].files) {
                $.each($(this)[0].files, function (_index, _file) {
                    if (_file.size > 5000000) {
                        console.log("您选择的文件中存在单个文件大小大于5M的文件，请重新选择");
                        window.alert("您选择的文件中存在单个文件大小大于5M的文件，请重新选择");
                        $('#uploadBtnModify').attr("disabled", "disabled");
                        uploadDataModify = new Array();
                        $('#uploadedInputModify').val('');
                    }
                    if (_file.name.indexOf(' ') > -1) {
                        console.log("您选择的文件中存在单个文件名称不合法包含空格，请重新选择");
                        window.alert("您选择的文件中存在单个文件名称不合法包含空格，请重新选择");
                        $('#uploadBtnModify').attr("disabled", "disabled");
                        uploadDataModify = new Array();
                        $('#uploadedInputModify').val('');
                    }
                    return;
                });
            }
        });
    },
    fileUploadControlListener: function () {
        $('#fileupload').on('change', function () {
            if ($(this)[0] && $(this)[0].files && $(this)[0].files.length > 1) {
                if ($(this)[0].files.length > 5) {
                    console.log("您选择的文件大于5个，请重新选择");
                    window.alert("您选择的文件大于5个，请重新选择");
                    $('#uploadBtn').attr("disabled", "disabled");
                    uploadData = new Array();
                    $('#uploadedInput').val('');
                } else {
                    $("#selectedFilesName").text("已选择 " + $(this)[0].files.length + " 个文件");
                    $('#uploadBtn').removeAttr("disabled");
                }
            } else if ($(this)[0] && $(this)[0].files && $(this)[0].files.length == 1) {
                console.log($(this)[0].files[0].name)
                $("#selectedFilesName").text("已选择文件： " + $(this)[0].files[0].name);
                $('#uploadBtn').removeAttr("disabled");
                $('#uploadedInput').val('');
            }
            if ($(this)[0] && $(this)[0].files) {
                $.each($(this)[0].files, function (_index, _file) {
                    if (_file.size > 5000000) {
                        console.log("您选择的文件中存在单个文件大小大于5M的文件，请重新选择");
                        window.alert("您选择的文件中存在单个文件大小大于5M的文件，请重新选择");
                        $('#uploadBtn').attr("disabled", "disabled");
                        uploadData = new Array();
                        $('#uploadedInput').val('');
                    }
                    if (_file.name.indexOf(' ') > -1) {
                        console.log("您选择的文件中存在单个文件名称不合法包含空格，请重新选择");
                        window.alert("您选择的文件中存在单个文件名称不合法包含空格，请重新选择");
                        $('#uploadBtn').attr("disabled", "disabled");
                        uploadData = new Array();
                        $('#uploadedInput').val('');
                    }
                    return;
                });
            }
        });
    },
    pageSizeControlListener: function () {
        $('#pageRange').on('change', function () {
            $('.currentPage').val("1");
            $('.nextPageInput').val("1");
            $('.prevPageInput').val("0");
            $('.pageNoInput').val("1");
            initDataTable(true);
        });
    },
    orgControlListener: function (containerId, secondContainerId) {
        $(containerId).on('change', function () {
            $(secondContainerId).find('option').remove();
            $(secondContainerId).append('<option value="-1">请选择</option>');
            var selectedOrgNo = $(this).val();
            if (selectedOrgNo) {
                ajaxRequest.initDistributeRequest(selectedOrgNo, secondContainerId);
            } else {
                console.log("区域控件值获取失败，请联系管理员");
                window.alert("区域控件值获取失败，请联系管理员");
            }
        });
    },
    provinceControlListener: function (containerId, secondContainerId, thirdContainerId, fourthContainerId) {
        $(containerId).on('change', function () {
            /* 需要清除市县乡镇的关联内容 */
            var provinceNo = $(this).val();
            $(secondContainerId).find('option').remove();
            $(secondContainerId).append('<option value="-1">请选择</option>');
            $(thirdContainerId).find('option').remove();
            $(thirdContainerId).append('<option value="-1">请选择</option>');
            $(fourthContainerId).find('option').remove();
            $(fourthContainerId).append('<option value="-1">请选择</option>');
            if (provinceNo) {
                ajaxRequest.initCityRequest(provinceNo, secondContainerId);
            } else {
                console.log("省控件值获取失败，请联系管理员");
                window.alert("省控件值获取失败，请联系管理员");
            }
        });
    },
    cityControlListener: function (containerId, secondContainerId, thirdContainerId) {
        $(containerId).on('change', function () {
            /* 需要清除县乡镇的关联内容 */
            var cityNo = $(this).val();
            $(secondContainerId).find('option').remove();
            $(secondContainerId).append('<option value="-1">请选择</option>');
            $(thirdContainerId).find('option').remove();
            $(thirdContainerId).append('<option value="-1">请选择</option>');
            if (cityNo) {
                ajaxRequest.initCountryRequest(cityNo, secondContainerId);
            } else {
                console.log("市控件值获取失败，请联系管理员");
                window.alert("市控件值获取失败，请联系管理员");
            }
        });
    },
    countryControlListener: function (containerId, secondContainerId) {
        $(containerId).on('change', function () {
            /* 需要清除乡镇的关联内容 */
            var countryNo = $(this).val();
            $(secondContainerId).find('option').remove();
            $(secondContainerId).append('<option value="-1">请选择</option>');
            if (countryNo) {
                ajaxRequest.initTownRequest(countryNo, secondContainerId);
            } else {
                console.log("县控件值获取失败，请联系管理员");
                window.alert("县控件值获取失败，请联系管理员");
            }
        });
    }
}

var ajaxRequest = {
    uploadedDeleteModifyRequest: function () {
        var uploadedStr = "";
        if (uploadedDataModify) {
            for (var i = 0; i < uploadedDataModify.length; i++) {
                if (i == 0) {
                    uploadedStr = uploadedDataModify[i];
                } else {
                    uploadedStr = uploadedStr + "," + uploadedDataModify[i];
                }
            }
        }
        $.ajax({
            url: '/site/deleteUploadedForPage',
            type: 'POST',
            data: {
                "uploadedList": uploadedStr
            },
            success: function (data) {
                if (data) {

                } else {
                    console.log("删除云存储文件出错，请联系管理员");
                    window.alert("删除云存储文件出错，请联系管理员");
                }
            },
            error: function () {
                console.log("删除云存储文件出错，请联系管理员");
                window.alert("删除云存储文件出错，请联系管理员");
            }
        });
        uploadedDataModify = new Array();
    },
    uploadedDeleteRequest: function () {
        var uploadedStr = "";
        if (uploadedData) {
            for (var i = 0; i < uploadedData.length; i++) {
                if (i == 0) {
                    uploadedStr = uploadedData[i];
                } else {
                    uploadedStr = uploadedStr + "," + uploadedData[i];
                }
            }
        }
        $.ajax({
            url: '/site/deleteUploadedForPage',
            type: 'POST',
            data: {
                "uploadedList": uploadedStr
            },
            success: function (data) {
                if (data) {

                } else {
                    console.log("删除云存储文件出错，请联系管理员");
                    window.alert("删除云存储文件出错，请联系管理员");
                }
            },
            error: function () {
                console.log("删除云存储文件出错，请联系管理员");
                window.alert("删除云存储文件出错，请联系管理员");
            }
        });
        uploadedData = new Array();
    },
    initOrgRequest: function (containerId, linkedContainerId, isDefault) {
        $.ajax({
            url: '/erp/common/areaCascadeController/getUserUniqueArea',
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    if(data.length > 1) {
                        $.each(data, function (_index, _obj) {
                            $(containerId).append('<option value="' + _obj.org_no + '">' + _obj.org_name + '</option>');
                        });
                    } else if(data.length == 1) {
                        $(containerId).find('option').remove();
                        $.each(data, function (_index, _obj) {
                            if(isDefault && linkedContainerId) {
                                $(containerId).append('<option value="' + _obj.org_no + '" selected="selected">' + _obj.org_name + '</option>');
                                ajaxRequest.initDistributeRequest(_obj.org_no, linkedContainerId, null, true);
                            }
                        });
                    }
                } else {
                    console.log("加载区域信息出错，请联系管理员");
                    window.alert("加载区域信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载区域信息出错，请联系管理员");
                window.alert("加载区域信息出错，请联系管理员");
            }
        });
    },

    initCancelManagerBtn:function(){
        $.ajax({
            url: '/site/getCancelManagerBtnPermission',
            data:{
                "erp" : $('#loginUser').val()
            },
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                //alert("当前用户"+$('#loginUser').val()+"===权限查询结果"+data.result);
                if (data) {
                    if(!(data.result)){
                        $("#unbindBtn").hide();
                    }else{
                        $("#unbindBtn").show();
                    }
                } else {
                    console.log("加载权限信息出错，请联系管理员");
                    window.alert("加载权限信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载权限信息出错，请联系管理员");
                window.alert("加载权限信息出错，请联系管理员");
            }
        });
    },

    initAddSiteBtn:function(){
        $.ajax({
            url: '/site/getAddSiteBtnPermission',
            data:{
                "erp" : $('#loginUser').val()
            },
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                //alert("当前用户"+$('#loginUser').val()+"===权限查询结果"+data.result);
                if (data) {
                    if(!(data.result)){
                        $("#addBtn").hide();
                    }else{
                        $("#addBtn").show();
                    }
                } else {
                    console.log("加载权限信息出错，请联系管理员");
                    window.alert("加载权限信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载权限信息出错，请联系管理员");
                window.alert("加载权限信息出错，请联系管理员");
            }
        });
    },

    initDistributeRequest: function (orgNo, containerId, selectedId, isDefault) {
        $.ajax({
            url: '/erp/common/areaCascadeController/getOperateCenter',
            data: 'areaNo=' + orgNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    if(data.length > 1) {
                        if(isDefault) {
                            $.each(data, function (_index, _obj) {
                                if (selectedId && selectedId == _obj.distribute_no) {
                                    $(containerId).find('option:selected').removeAttr('selected');
                                    $(containerId).append('<option value="' + _obj.distribute_no + '" selected>' + _obj.distribute_name + '</option>');
                                } else {
                                    $(containerId).append('<option value="' + _obj.distribute_no + '">' + _obj.distribute_name + '</option>');
                                }
                            });
                        } else {
                            $.each(data, function (_index, _obj) {
                                if (selectedId && selectedId == _obj.distribute_no) {
                                    $(containerId).find('option:selected').removeAttr('selected');
                                    $(containerId).append('<option value="' + _obj.distribute_no + '" selected>' + _obj.distribute_name + '</option>');
                                } else {
                                    $(containerId).append('<option value="' + _obj.distribute_no + '">' + _obj.distribute_name + '</option>');
                                }
                            });
                        }
                    } else if(data.length == 1) {
                        if(isDefault) {
                            $(containerId).find('option').remove();
                            $.each(data, function (_index, _obj) {
                                    $(containerId).append('<option value="' + _obj.distribute_no + '" selected="selected">' + _obj.distribute_name + '</option>');
                            });
                        } else {
                            $.each(data, function (_index, _obj) {
                                if (selectedId && selectedId == _obj.distribute_no) {
                                    $(containerId).find('option:selected').removeAttr('selected');
                                    $(containerId).append('<option value="' + _obj.distribute_no + '" selected>' + _obj.distribute_name + '</option>');
                                } else {
                                    $(containerId).append('<option value="' + _obj.distribute_no + '">' + _obj.distribute_name + '</option>');
                                }
                            });
                        }
                    }

                }
            },
            error: function () {
                console.log("加载运营中心信息出错，请联系管理员");
                window.alert("加载运营中心信息出错，请联系管理员");
            }
        });
    },
    initProvinceRequest: function (containerId) {
        $.ajax({
            url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo',
            type: 'POST',
            dataType: 'json',
            data: {parentNo: 0},
            success: function (data) {
                if (data) {
                    $.each(data, function (_index, _obj) {
                        $(containerId).append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                    });
                } else {
                    console.log("加载省信息出错，请联系管理员");
                    window.alert("加载省信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载省信息出错，请联系管理员");
                window.alert("加载省信息出错，请联系管理员");
            }
        });
    },
    initCityRequest: function (provinceNo, containerId, selectedData) {
        $.ajax({
            url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo=' + provinceNo,
            data: 'parentNo=' + provinceNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    $.each(data, function (_index, _obj) {
                        if (selectedData && selectedData.cityNo && selectedData.cityNo == _obj.areaId) {
                            $(containerId).find('option:selected').removeAttr('selected');
                            $(containerId).append('<option value="' + _obj.areaId + '" selected>' + _obj.areaName + '</option>');
                            ajaxRequest.initCountryRequest(selectedData.cityNo, '#country_no_modify', selectedData);
                        } else {
                            $(containerId).append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                        }
                    });
                } else {
                    console.log("加载市信息出错，请联系管理员");
                    window.alert("加载市信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载市信息出错，请联系管理员");
                window.alert("加载市信息出错，请联系管理员");
            }
        });
    },
    initViewCityRequest: function (provinceNo, containerId, selectedData) {
        $.ajax({
            url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo=' + provinceNo,
            data: 'parentNo=' + provinceNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    $.each(data, function (_index, _obj) {
                        if (selectedData && selectedData.cityNo && selectedData.cityNo == _obj.areaId) {
                            $(containerId).find('option:selected').removeAttr('selected');
                            $(containerId).append('<option value="' + _obj.areaId + '" selected>' + _obj.areaName + '</option>');
                            ajaxRequest.initViewCountryRequest(selectedData.cityNo, '#country_no_view', selectedData);
                        } else {
                            $(containerId).append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                        }
                    });
                } else {
                    console.log("加载市信息出错，请联系管理员");
                    window.alert("加载市信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载市信息出错，请联系管理员");
                window.alert("加载市信息出错，请联系管理员");
            }
        });
    },
    initCountryRequest: function (cityNo, containerId, selectedData) {
        $.ajax({
            url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo=' + cityNo,
            data: 'parentNo=' + cityNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    $.each(data, function (_index, _obj) {
                        if (selectedData && selectedData.countryNo && selectedData.countryNo == _obj.areaId) {
                            $(containerId).find("option:selected").removeAttr("selected");
                            $(containerId).append('<option value="' + _obj.areaId + '" selected>' + _obj.areaName + '</option>');
                            ajaxRequest.initTownRequest(selectedData.countryNo, '#town_no_modify', selectedData);
                        } else {
                            $(containerId).append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                        }
                    });
                } else {
                    console.log("加载县信息出错，请联系管理员");
                    window.alert("加载县信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载县信息出错，请联系管理员");
                window.alert("加载县信息出错，请联系管理员");
            }
        });
    },
    initViewCountryRequest: function (cityNo, containerId, selectedData) {
        $.ajax({
            url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo=' + cityNo,
            data: 'parentNo=' + cityNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    $.each(data, function (_index, _obj) {
                        if (selectedData && selectedData.countryNo && selectedData.countryNo == _obj.areaId) {
                            $(containerId).find("option:selected").removeAttr("selected");
                            $(containerId).append('<option value="' + _obj.areaId + '" selected>' + _obj.areaName + '</option>');
                            ajaxRequest.initTownRequest(selectedData.countryNo, '#town_no_view', selectedData);
                        } else {
                            $(containerId).append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                        }
                    });
                } else {
                    console.log("加载县信息出错，请联系管理员");
                    window.alert("加载县信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载县信息出错，请联系管理员");
                window.alert("加载县信息出错，请联系管理员");
            }
        });
    },
    initTownRequest: function (countryNo, containerId, selectedData) {
        $.ajax({
            url: '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo=' + countryNo,
            data: 'parentNo=' + countryNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data) {
                    $.each(data, function (_index, _obj) {
                        if (selectedData && selectedData.townNo && selectedData.townNo == _obj.areaId) {
                            $(containerId).find("option:selected").removeAttr("selected");
                            $(containerId).append('<option value="' + _obj.areaId + '" selected>' + _obj.areaName + '</option>');
                        } else {
                            $(containerId).append('<option value="' + _obj.areaId + '">' + _obj.areaName + '</option>');
                        }
                    });
                } else {
                    console.log("加载乡镇信息出错，请联系管理员");
                    window.alert("加载乡镇信息出错，请联系管理员");
                }
            },
            error: function () {
                console.log("加载乡镇信息出错，请联系管理员");
                window.alert("加载乡镇信息出错，请联系管理员");
            }
        });
    },
    modifySiteRequest: function () {
        var rowsData = $('#resultGridModify').DataTable().rows().data();
        var jssStr = "";
        for (var i = 0; i < rowsData.length; i++) {
            if (jssStr) {
                jssStr = jssStr + "," + rowsData[i].jssUrl;
            } else {
                jssStr = rowsData[i].jssUrl;
            }
        }
        var data= {
            "orgNo": $('#org_no_modify').val(),
            "orgName": $('#org_no_modify').find(':selected').text(),
            "distributeNo": $('#distribute_no_modify').val(),
            "distributeName": $('#distribute_no_modify').find(':selected').text(),
            "siteNo": $('#site_no_modify').val(),
            "bussinessSiteNo": $('#bussiness_site_no_modify').val(),
            "siteName": $('#site_name_modify').val(),
            "siteStatus": $('#site_status_modify').val(),
            "startTime": $('#start_time_modify').val(),
            "openTime": $('#open_time_modify').val(),
            "provinceNo": $('#province_no_modify').val(),
            "provinceName": $('#province_no_modify').find(':selected').text(),
            "cityNo": $('#city_no_modify').val(),
            "cityName": $('#city_no_modify').find(':selected').text(),
            "countryNo": $('#country_no_modify').val(),
            "countryName": $('#country_no_modify').find(':selected').text(),
            "townNo": $('#town_no_modify').val(),
            "townName": $('#town_no_modify').find(':selected').text(),
            "address": $('#address_modify').val(),
            "gpsLongitude": $('#gps_longitude_modify').val(),
            "gpsLatitude": $('#gps_latitude_modify').val(),
            "jdAccount": $('#jd_account_modify').val(),
            "siteManager": $('#site_manager_modify').val(),
            "telephone": $('#telephone_modify').val(),
            "email": $('#email_modify').val(),
            "weixin": $('#weixin_modify').val(),
            "createUser": $('#loginUser').val(),
            "updateUser": $('#loginUser').val(),
            "companyName": $('#company_name_modify').val(),
            "bussinessLicenseNo": $('#bussiness_license_no_modify').val(),
            "bussinessLicenseAddress": $('#bussiness_license_address_modify').val(),
            "taxRegistrationNo": $('#tax_registration_no_modify').val(),
            "bankDepositName": $('#bank_deposit_name_modify').val(),
            "bankDepositAddress": $('#bank_deposit_address_modify').val(),
            "bankAccount": $('#bank_account_modify').val(),
            "bankAccountName": $('#bank_account_name_modify').val(),
            "unionpayNumber": $('#unionpay_number_modify').val(),
            "bussinessLicenseTermValidity": $('#bussiness_license_term_validity_modify').val(),
            "taxType": $('#tax_type_modify').val(),
            "taxRate": $('#tax_rate_modify').val(),
            "companyType": $('input[name="company_type_modify"]:checked').val(),
            "remark": $('#remark_modify').val(),
            "managerErp": $('#managerErp_modify').val(),
            "managerName": $('#managerName_modify').val(),
            "jssAttachement": jssStr + "," + $('#uploadedInputModify').val()
        };
        var msg=validateSite(data)
        if(msg != null && msg != ''){

            $('#confirmModifyModal .confirmModifyContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> '+msg);

            return;
        }
        $.ajax({
            url: '/site/insertOrUpdateSiteInfoForPage',
            data:data,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data && data.success) {
                    uploadedDataModify = new Array();
                    $('.shadowContainer').hide();
                    $('#confirmModifyModal .confirmModifyContent').empty().append('<span class="glyphicon glyphicon-ok-sign text-success"></span> 门店信息修改成功');
                    $("#confirmModifyModal").modal('show');
                } else {
                    var msg=data.localizedMessage ==null? " 添加门店信息出错，请联系管理员":data.localizedMessage ;
                    $(".shadowContainer").hide();
                    $('#confirmModal .confirmContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> '+msg);
                    $('#confirmModal').modal('show');
                }
            },
            error: function () {
                $('.shadowContainer').hide();
                $('#confirmModifyModal .confirmModifyContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> 更新门店信息出错，请联系管理员');
                $("#confirmModifyModal").modal('show');
            }
        })
    },
    insertSiteRequest: function () {
        console.info($('#unionpay_number_add').val())
        var data={
            "orgNo": $('#org_no_add').val(),
            "orgName": $('#org_no_add').find(':selected').text(),
            "distributeNo": $('#distribute_no_add').val(),
            "distributeName": $('#distribute_no_add').find(':selected').text(),
            "bussinessSiteNo": $('#bussiness_site_no_add').val(),
            "siteName": $('#site_name_add').val(),
            "siteStatus": $('#site_status_add').val(),
            "startTime": $('#start_time_add').val(),
            "openTime": $('#open_time_add').val(),
            "provinceNo": $('#province_no_add').val(),
            "provinceName": $('#province_no_add').find(':selected').text(),
            "cityNo": $('#city_no_add').val(),
            "cityName": $('#city_no_add').find(':selected').text(),
            "countryNo": $('#country_no_add').val(),
            "countryName": $('#country_no_add').find(':selected').text(),
            "townNo": $('#town_no_add').val(),
            "townName": $('#town_no_add').find(':selected').text(),
            "address": $('#address_add').val(),
            "gpsLongitude": $('#gps_longitude_add').val(),
            "gpsLatitude": $('#gps_latitude_add').val(),
            "jdAccount": $('#jd_account_add').val(),
            "siteManager": $('#site_manager_add').val(),
            "telephone": $('#telephone_add').val(),
            "email": $('#email_add').val(),
            "weixin": $('#weixin_add').val(),
            "createUser": $('#loginUser').val(),
            "updateUser": $('#loginUser').val(),
            "companyName": $('#company_name_add').val(),
            "bussinessLicenseNo": $('#bussiness_license_no_add').val(),
            "bussinessLicenseAddress": $('#bussiness_license_address_add').val(),
            "taxRegistrationNo": $('#tax_registration_no_add').val(),
            "bankDepositName": $('#bank_deposit_name_add').val(),
            "bankDepositAddress": $('#bank_deposit_address_add').val(),
            "bankAccount": $('#bank_account_add').val(),
            "bankAccountName": $('#bank_account_name_add').val(),
            "unionpayNumber":$('#unionpay_number_add').val(),
            "bussinessLicenseTermValidity": $('#bussiness_license_term_validity_add').val(),
            "taxType": $('#tax_type_add').val(),
            "taxRate": $('#tax_rate_add').val(),
            "companyType": $('input[name="company_type_add"]:checked').val(),
            "remark": $('#remark_add').val(),
            "jssAttachement": $('#uploadedInput').val()
        };
        var msg=validateSite(data)
        if(msg != null && msg != ''){
            $('#confirmModifyModal .confirmModifyContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> '+msg);
            return;
        }
        $.ajax({
            url: '/site/insertSiteBaseInfoForPage',
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data && data.success) {
                    /* 此处需要弹出确认框然后关闭模态框 */
                    uploadedData = new Array();
                    $(".shadowContainer").hide();
                    $('#confirmModal .confirmContent').empty().append('<span class="glyphicon glyphicon-ok-sign text-success"></span> 门店信息添加成功');
                    $('#confirmModal').modal('show');
                } else {
                    var msg=data.localizedMessage ==null? " 添加门店信息出错，请联系管理员":data.localizedMessage ;
                    $(".shadowContainer").hide();
                    $('#confirmModal .confirmContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> '+msg);
                    $('#confirmModal').modal('show');
                }
            },
            error: function () {
                var msg=data.localizedMessage ==null? " 添加门店信息出错，请联系管理员":data.localizedMessage ;
                $(".shadowContainer").hide();
                $('#confirmModal .confirmContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> '+msg);
                $('#confirmModal').modal('show');
            }
        });
    },
    deleteSiteInfo: function (siteNo) {
        $.ajax({
            url: '/site/deleteSiteInfoForPage',
            data: {
                'siteNo': siteNo
            },
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                if (data && data.success) {
                    $('#confirmInfoModal .confirmInfoContent').empty().append('<span class="glyphicon glyphicon-ok-sign text-success"></span> 删除门店信息成功');
                    $('#confirmInfoModal').modal('show');
                } else {
                    $('#confirmInfoModal .confirmInfoContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> 删除门店信息出错，请联系管理员');
                    $('#confirmInfoModal').modal('show');
                }
            },
            error: function () {
                $('#confirmInfoModal .confirmInfoContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> 删除门店信息出错，请联系管理员');
                $('#confirmInfoModal').modal('show');
            }
        });
    }
}
function validateSite(data){
    //var reg = new RegExp("^[0-9]*$");
    var reg = new RegExp("^[0-9]+\.{0,1}[0-9]*$");
    if((data. gps_longitude != null &&  data. gps_longitude !='') && !reg.test(data. gps_longitude)){
       return "地址经度必须是数字!" ;
    }
    if((data.gps_latitude != null &&  data.gps_latitude !='') &&   !reg.test(data.gps_latitude)){
        return "地址纬度必须是数字!" ;
    }
}
var validatorDefine = {
    modifySiteInfoValidator: function () {
        $('#modifySiteInfoForm').validate({
            rules: {
                site_name_modify: {
                    required: true
                },
                bussiness_site_no_modify: {
                    required: true
                },
                province_no_modify: {
                    required: true,
                    min: 0
                },
                city_no_modify: {
                    required: true,
                    min: 0
                },
                address_modify: {
                    required: true
                },
                jd_account_modify: {
                    required: true
                },
                site_manager_modify: {
                    required: true
                },
                telephone_modify: {
                    required: true,
                    digits: true,
                    rangelength:[11,11]
                },
                email_modify: {
                    email: true
                },
                company_name_modify: {
                    required: true
                },
                bussiness_license_no_modify: {
                    required: true
                },
                bussiness_license_address_modify: {
                    required: true
                },
                tax_registration_no_modify: {
                    required: true
                },
                bank_deposit_name_modify: {
                    required: true
                },
                bank_deposit_address_modify: {
                    required: true
                },
                bank_account_modify: {
                    required: true
                },
                bank_account_name_modify: {
                    required: true
                },
                bussiness_license_term_validity_modify: {
                    required: true
                },
                remark_add: {
                    rangelength:[0,200]
                }
            },
            messages: {
                org_no_modify: {
                    required: "请选择区域",
                    min: "请选择区域"
                },
                distribute_no_modify: {
                    required: "请选择运营中心",
                    min: "请选择运营中心"
                },
                site_name_modify: {
                    required: "门店名称必填"
                },
                bussiness_site_no_modify: {
                    required: "业务门店编码必填"
                },
                province_no_modify: {
                    required: "请选择省",
                    min: "请选择省"
                },
                city_no_modify: {
                    required: "请选择市",
                    min: "请选择市"
                },
                address_modify: {
                    required: "详细地址必填"
                },
                jd_account_modify: {
                    required: "商城账号必填"
                },
                site_manager_modify: {
                    required: "店长必填"
                },
                telephone_modify: {
                    required: "联系电话必填",
                    digits: "联系电话不合法",
                    rangelength: "联系电话不合法"
                },
                email_modify: {
                    email: "请输入合法的电子邮件地址"
                },
                company_name_modify: {
                    required: "公司名称必填"
                },
                bussiness_license_no_modify: {
                    required: "营业执照编号必填"
                },
                bussiness_license_address_modify: {
                    required: "营业执照所在地必填"
                },
                tax_registration_no_modify: {
                    required: "税务登记号必填"
                },
                bank_deposit_name_modify: {
                    required: "开户行名称必填"
                },
                bank_deposit_address_modify: {
                    required: "开户行地址必填"
                },
                bank_account_modify: {
                    required: "银行账号必填"
                },
                bank_account_name_modify: {
                    required: "开户名称必填"
                },
                bussiness_license_term_validity_modify: {
                    required: "营业执照有效期必填"
                },
                remark_add: {
                    rangelength: "备注输入请小于200字符"
                }
            },
            errorPlacement: function (error, element) {
                var isDuplicate = false;
                $.each($('.alertModifyValidate label'), function (_index, _obj) {
                    if (error[0].id == $(_obj).attr("id")) {
                        isDuplicate = true;
                    }
                })
                if (!isDuplicate) {
                    error.appendTo($(".alertModifyValidate"));
                }
            },
            success: function (label) {
                $.each($('.alertModifyValidate label'), function (_index, _obj) {
                    if ($(label).attr("id") == $(_obj).attr("id")) {
                        $(_obj).remove();
                    }
                });
            },
            errorContainer: ".alertModifyValidate",
            errorLabelContainer: $("#modifySiteInfoForm .alertModifyValidate")
        });
    },
    insertSiteInfoValidator: function () {
        $('#insertSiteInfoForm').validate({
            rules: {
                org_no_add: {
                    required: true,
                    min: 0
                },
                distribute_no_add: {
                    required: true,
                    min: 0
                },
                site_name_add: {
                    required: true
                },
                bussiness_site_no_add: {
                    required: true
                },
                province_no_add: {
                    required: true,
                    min: 0
                },
                city_no_add: {
                    required: true,
                    min: 0
                },
                address_add: {
                    required: true
                },
                jd_account_add: {
                    required: true
                },
                site_manager_add: {
                    required: true
                },
                telephone_add: {
                    required: true,
                    digits: true,
                    rangelength:[11,11]
                },
                email_add: {
                    email: true
                },
                company_name_add: {
                    required: true
                },
                bussiness_license_no_add: {
                    required: true
                },
                bussiness_license_address_add: {
                    required: true
                },
                tax_registration_no_add: {
                    required: true
                },
                bank_deposit_name_add: {
                    required: true
                },
                bank_deposit_address_add: {
                    required: true
                },
                bank_account_add: {
                    required: true
                },
                bank_account_name_add: {
                    required: true
                },
                bussiness_license_term_validity_add: {
                    required: true
                },
                remark_add: {
                    rangelength:[0,200]
                }
            },
            messages: {
                org_no_add: {
                    required: "请选择区域",
                    min: "请选择区域"
                },
                distribute_no_add: {
                    required: "请选择运营中心",
                    min: "请选择运营中心"
                },
                site_name_add: {
                    required: "门店名称必填"
                },
                bussiness_site_no_add: {
                    required: "业务门店编码必填"
                },
                province_no_add: {
                    required: "请选择省",
                    min: "请选择省"
                },
                city_no_add: {
                    required: "请选择市",
                    min: "请选择市"
                },
                address_add: {
                    required: "详细地址必填"
                },
                jd_account_add: {
                    required: "商城账号必填"
                },
                site_manager_add: {
                    required: "店长必填"
                },
                telephone_add: {
                    required: "联系电话必填",
                    digits: "联系电话不合法",
                    rangelength: "联系电话不合法"
                },
                email_add: {
                    email: "请输入合法的电子邮件地址"
                },
                company_name_add: {
                    required: "公司名称必填"
                },
                bussiness_license_no_add: {
                    required: "营业执照编号必填"
                },
                bussiness_license_address_add: {
                    required: "营业执照所在地必填"
                },
                tax_registration_no_add: {
                    required: "税务登记号必填"
                },
                bank_deposit_name_add: {
                    required: "开户行名称必填"
                },
                bank_deposit_address_add: {
                    required: "开户行地址必填"
                },
                bank_account_add: {
                    required: "银行账号必填"
                },
                bank_account_name_add: {
                    required: "开户名称必填"
                },
                bussiness_license_term_validity_add: {
                    required: "营业执照有效期必填"
                },
                remark_add: {
                    rangelength: "备注输入请小于200字符"
                }
            },
            errorPlacement: function (error, element) {
                var isDuplicate = false;
                $.each($('.alertValidate label'), function (_index, _obj) {
                    if (error[0].id == $(_obj).attr("id")) {
                        isDuplicate = true;
                    }
                })
                if (!isDuplicate) {
                    error.appendTo($(".alertValidate"));
                }
            },
            success: function (label) {
                $.each($('.alertValidate label'), function (_index, _obj) {
                    if ($(label).attr("id") == $(_obj).attr("id")) {
                        $(_obj).remove();
                    }
                });
            },
            errorContainer: ".alertValidate",
            errorLabelContainer: $("#insertSiteInfoForm .alertValidate")
        });
    }
}

function unbindManager(){

    var rows=[],ids='';
    var chs=$('input[ name="switchSingleInput"]:checked');
    for(var i=0;i<chs.length;i++) {
        var m=$.parseJSON($(chs[i]).val());
        if(m.managerErp != null  && m.managerErp != ''  && m.managerErp != '#'){
            rows.push(m);
            if(i > 0){
                ids +=','+ m.siteNo;
            }else{
                ids = m.siteNo;
            }
        }
    };
   if(rows.length ==0){
       window.alert("至少要选择一条要取消帮定的记录");
   }
    $.ajax({
        url: '/site/unbindManager',
        data: 'ids=' + ids,
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data) {
                $('.currentPage').val("1");
                $('.nextPageInput').val("1");
                $('.prevPageInput').val("0");
                if ($.fn.DataTable.isDataTable('#resultGrid')) {
                    $("#resultGrid").DataTable().destroy();
                    initDataTable(true);
                    $('.pageNoInput').val("1");
                }
            } else {
                console.log("加载乡镇信息出错，请联系管理员");
                window.alert("加载乡镇信息出错，请联系管理员");
            }
        },
        error: function () {
            console.log("加载乡镇信息出错，请联系管理员");
            window.alert("加载乡镇信息出错，请联系管理员");
        }
    });


}

var timeConvert = function (time, isMore) {
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