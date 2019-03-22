$(function () {
    initPage();
    initArea();
    loadAlbum(0);

});

/**
 * 用来初始货页面。页面只执行一次
 */

function initPage(){
    //删除照片
    $('#delete').hide();
    //分页
    $("#page").hide();
    $('#album_panel').panel({
        width: '100%',
        height: $(window).height() - 140,
        title: '相册管理'
    });

    $('#addWind').window({
        title: "新建相册",
        width: 300,
        height: 200,
        modal: true,
        closed: true
    });

    //创建相册弹出窗口
    $('#add').bind('click', function () {
        if (leve == 0) {
            $('#addWind').window('open');
        } else {
            $.messager.alert('提示', '只可以创建第一级相册！');
        }
    });

    //创建相册弹出窗口
    $('#back').bind('click', function () {
        back();
    });
    $('#createAlbum').bind('click', createAlbum);
    $('#queryBtn').unbind("click");
    $('#queryBtn').bind("click", function () {
        if(leve ==2){
            jqueryloadPhoto.reDraw(getQueryPhotoData());
            return;
        }
        window["queryAlbum_" + leve]();
    });
    $('#update').unbind("click");
    $('#update').bind("click", function () {
        updateAlbum()
    });
    $('#del').unbind("click");
    $('#del').bind("click", function () {
        delAlbum()
    });

}





var jqueryloadPhoto;
var type_falg = -1;
var info = {
    leve_0: null,
    leve_1: null,
    leve_2: null
};
var leve = 0;
var currId = 0;
var deleteId;
var leve1Name = "";
var leve2Name = "";
/**
 * 清除相册
 */
function clearAlbum() {
    $('#album_container').empty();
}
/**
 * 添加相册
 * @param name
 * @param url
 * @param action
 */
function addAlbum(name, url, action, total, id) {
    var html = '<div class="album" id="album_' + id + '" onclick="clickAlbum(' + id + ')"><img alt=""  flag="ima_album"   albumname="' + name + '" id="albumimg_' + id + '" src="' + url + '" style="width: 150px;height: 150px"><a href=' + action + '>' + name + '(' + total + '张)' + '</a></div>';
    $('#album_container').append(html);
}
function selectAlbum() {
    var ids = [];
    $('img[flag="ima_album"]').each(function (index, item) {
        if ($(item).hasClass("selectedAlbum")) {
            var id = $(item).attr("id").split("_")[1];
            var albumname = $(item).attr("albumname");
            ids.push({
                id: $.trim(id),
                name: albumname
            });
        }
    })
    return ids;
}
function clickAlbum(id) {

    //当前ima
    var div = $("#albumimg_" + id);
    var isSelf = null;
    //如果当前是选中的
    if ($(div).hasClass("selectedAlbum")) {
        //当前是选中
        isSelf = true;
    } else {
        isSelf = false;
    }
    $('img[flag="ima_album"]').each(function (index, item) {
        $(item).removeClass("selectedAlbum")
    })
    if (!isSelf) {
        $(div).addClass("selectedAlbum")
    }


}
/**
 * 添加相片
 * @param name
 * @param url
 */
function addPhoto(name, url, id) {
    var html = '<div class="album"><img alt="" src="' + url + '" style="width: 150px;height: 150px"><input type="checkbox" value="' + id + '"><a href="' + url + '" target="blank">' + name + '</a></div>';
    $('#album_container').append(html);
}
/**
 * 加载相册
 * @param parentId
 */
function loadAlbum(parentId, action, name, type) {
    if (parentId != 0) {
        if (action) {
            leve = leve + 1;
        }
    }

    if (leve == 2) {
        $("#album_panel").panel('setTitle', $("#album_panel").panel('options').title + "》" + name);

        loadPhoto(parentId);
        info.name_2 = name;
        info.leve_2 = parentId;
        init_page_2()
    } else {
        if (leve == 0) {

            $("#album_panel").panel('setTitle', "照片管理");

            init_page_0();
        } else if (leve == 1) {

            $("#album_panel").panel('setTitle', "照片管理》" + name);
            init_page_1()
            info.leve_1 = parentId;
            info.name_1 = name;
        }
        //刷新
        window["queryAlbum_" + leve](parentId);
    }

}
function init_page_0(){
    $("#level_1").hide();
    $("#level_2").show();
    $("#queryPanel").show();
    $('#photoType').combobox({disabled: false});
    $('#photoErp').textbox({disabled: true});
    $('#createStart').attr("disabled", true);
    $('#createEnd').attr("disabled", true);
    $('#add').show();
    $('#del').show();
    $('#update').show();
    $('#back').hide();
    $('#upPhoto').hide();
}
function init_page_2(){
    $('#add').hide();
    $('#delete').show();
    $('#back').show();
    $("#level_1").hide();
    $("#level_2").show();
    $('#createStart').attr("disabled", false);
    $('#createEnd').attr("disabled", false);
    $('#photoErp').textbox({disabled: false});
    $('#photoType').combobox({disabled: true});
}
function init_page_1(){
    $('#upPhoto').hide();
    $("#shop").show();
    $("#level_1").show();
    $("#level_2").hide();
    $("#page").hide();
    $('#delete').hide();
    $('#add').hide();
    $('#del').hide();
    $('#update').hide();
    $('#back').show();
    $("#level_1").show();
    $('#createStart').attr("disabled", true);
    $('#createEnd').attr("disabled", true);
}

/**
 * 加载相片
 * @param parentId
 */
function loadPhoto(parentId) {
    $("#address").hide();
    $("#shop").hide();
    $("#page").show();
    $('#upPhoto').show();
    jqueryloadPhoto=$('#album_container').loadPhoto({
        photoErp: $('#photoErp').textbox('getValue'),
        parentId: parentId,
        pageNumber: 1
    });
}


/**
 * 创建相册
 */
function createAlbum() {
    if ($('#albumName').validatebox("isValid")) {
        var album = {
            name: $("#albumName").val(),
            parent: {id: 0},
            total: 0,
            type: $('input[name="albumType"]:checked').val(),
            id: $("#albumId").val(),
            createUser: $('#userPin').val()
        };
        ParamUtil.crateParams();
        ParamUtil.addParam('Album', album);
        josnRequest('/execute/albumPhotoService/saveOrUpdateAlbum'
            , ParamUtil.getParams()
            , function (data) {
                clearAlbum();
                loadAlbum(0);
                $('#addWind').window('close');
                $("#albumName").val('');
                $("#albumId").val('');
            });
    }
}

function back() {
    if (leve > 0) {
        leve--;
    }

    //刷新
    var ts = $("#album_panel").panel('options').title.split("》");
    if (leve == 0) {
        $("#album_panel").panel('setTitle', "照片管理");
        init_page_0();
    }
    if (leve == 1) {
        init_page_1()
        $("#album_panel").panel('setTitle', "照片管理》" + info.name_1);
    }
    if (leve == 2) {
        init_page_2();
        $("#album_panel").panel('setTitle', "照片管理》" + info.name_1);
        $("#album_panel").panel('setTitle', $("#album_panel").panel('options').title + "》" + info.name_2);
    }
    window["queryAlbum_" + leve](info["leve_"+leve]);

}
//初始化区域
function initArea() {
    $("#shopName").textbox('setValue', "");
    $('#area').combobox({
        valueField: 'org_no',
        textField: 'org_name',
        editable: false,
        onSelect: function (record) {
            changeAera();
        }
    });


    $('#photoType').combobox({
        valueField: 'id',
        textField: 'name',
        editable: false
    });

    $('#operateCenter').combobox({
        valueField: 'distribute_no',
        textField: 'distribute_name',
        editable: false
    });
    $.ajax({
        url: '/erp/common/areaCascadeController/getPhotoType',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                if (data.length > 1) {
                    data.splice(0, 0, {"name": "全部", "id": ""});//增加全部选项 #
                }
                $('#photoType').combobox('loadData', data);
                $('#photoType').combobox('select', data[0].id); //默认选中全部
            }
        },
        error: function (data) {
            alert("获取相片类型信息失败!");
        }
    });
    $.ajax({
        url: '/erp/common/areaCascadeController/getUserArea',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                if (data.length > 1) {
                    data.splice(0, 0, {"org_name": "全部", "org_no": ""});//增加全部选项 #
                }
                $('#area').combobox('loadData', data = getUniqueAreas(data));
                $('#area').combobox('select', data[0].org_no); //默认选中全部
            }
        },
        error: function (data) {
            alert("获取区域信息失败!");
        }
    });
    var data = [{
        "distribute_name": "全部",
        "distribute_no": ""
    }];
    $('#operateCenter').combobox('loadData', data);
    $('#operateCenter').combobox('select', ""); // 默认选中全部
}


function changeAera() {
    areaNo = $('#area').combobox('getValue');
    if (areaNo == '') {
        // 区域选择的是全部
        var data = [{
            "distribute_name": "全部",
            "distribute_no": ""
        }];
        $('#operateCenter').combobox('loadData', data);
        $('#operateCenter').combobox('select', ""); // 默认选中全部
    } else {
        $.ajax({
            url: '/erp/common/areaCascadeController/getOperateCenter',
            data: 'areaNo=' + areaNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                operateCenterNo = '';
                if (data.length > 0) {
                    if ($("#operateCenter").length > 0) {// 控件是否存在
                        if (data.length > 0) {
                            if (data.length > 1) {
                                data.splice(0, 0, {"distribute_name": "全部", "distribute_no": ""});//增加全部选项 -1
                            }
                            $('#operateCenter').combobox('loadData', data);
                            $('#operateCenter').combobox('select', data[0].distribute_no); //默认选中全部
                        }

                    }
                }
            },
            error: function (data) {
                alert("获取运营中心信息失败!");
            }
        });
    }
}
function updateAlbum() {
    var ids = selectAlbum();
    if (ids.length == 0) {
        $.messager.alert("操作提示", "请选择一个要修改的相册！");
        return;
    }
    $("#albumName").val(ids[0].name);
    $("#albumId").val(ids[0].id);
    $('#addWind').window('open');
}
/**
 * 店铺纬度查询
 */

function queryAlbum_0() {
    var album = {
        type: 0
        , erp: $('#userPin').val(),
         id: $('#photoType').combobox('getValue'),
        parent: {id: 0}
    };
    ParamUtil.crateParams();
    ParamUtil.addParam('Album', album);
    josnRequest('/execute/albumPhotoService/queryAlbum_0'
        , ParamUtil.getParams()
        , function (data) {
            clearAlbum();
            for (i = 0; i < data.length; i++) {
                var o = data[i];
                addAlbum(o.name, '/static/images/dir.jpg', 'javascript:loadAlbum(' + o.id + ',true,"' + o.name + '",' + o.type + ')', o.total, o.id);
            }
        });
}
function queryAlbum_1(parentId) {
    var album = {
        type: 1
        , erp: $('#userPin').val(),
        type: 0,
        createUser: $('#photoErp').textbox('getValue'),
        createStart: $('#createStart').val(),
        createEnd: $('#createEnd').val(),
        org: {org_no: $('#area').combobox('getValue')},
        distribute: {distribute_no: $('#operateCenter').combobox('getValue')},
        site: {shopName: $('#shopName').textbox('getValue') == null ? "" : $.trim($('#shopName').textbox('getValue'))}
        , //id: $('#photoType').combobox('getValue'),
        parent: {id: info.leve_1}
    };
    ParamUtil.crateParams();
    ParamUtil.addParam('Album', album);
    josnRequest('/execute/albumPhotoService/queryAlbum_1'
        , ParamUtil.getParams()
        , function (data) {
            clearAlbum();
            for (i = 0; i < data.length; i++) {
                var o = data[i];
                addAlbum(o.name, '/static/images/dir.jpg', 'javascript:loadAlbum(' + o.id + ',true,"' + o.name + '",' + o.type + ')', o.total, o.id);
            }
        });
}
function delAlbum() {
    var ids = selectAlbum();
    if (ids.length == 0) {
        $.messager.alert("操作提示", "请选择一个要删除的相册！");
        return;
    }
    $.messager.confirm("操作提示", "是否确认删除该相册下所有的文件夹及照片？", function (data) {
        if (data) {
            var aids = [];
            for (var i = 0; i < ids.length; i++) {
                aids.push(ids[i].id)
            }
            ParamUtil.crateParams();
            ParamUtil.addParam('List<Long>', aids);
            josnRequest('/execute/albumPhotoService/deleteAlbum'
                , ParamUtil.getParams()
                , function (data) {
                    if (data.status == false) {
                        $.messager.alert('提示', data.msg, "error");
                        return;
                    }
                    queryAlbum_0()
                });


        }
        else {

        }
    });

}


function deletePhoto() {
    var ids = new Array();
    var checkboxs = $(":checkbox:checked");
    if (checkboxs.length <= 0) {
        $.messager.alert('提示', '请选择至少一张相片');
        return;
    }
    for (i = 0; i < checkboxs.length; i++) {
        ids.push($(checkboxs[i]).val());
    }

    $.messager.confirm('确认', '确认删除所选照片？', function (r) {
        if (r) {
            ParamUtil.crateParams();
            ParamUtil.addParam('List<Long>', ids);

            josnRequest('/execute/albumPhotoService/deletePhoto'
                , ParamUtil.getParams()
                , function (data) {

                    jqueryloadPhoto.reDraw(getQueryPhotoData());
                });
        }
    });
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


function upPhoto() {
    $('#uploadFileDIv').dialog('open');
    $('#uploadFileDIv').show();
}
function showFileName() {

    console.log(" FileList Demo:");
    var name = "";
    var file;
    var issfzupload = true;
    // 取得FileList取得的file集合
    var filesList = document.getElementById("uploadFileName");
    filesList.length = filesList.length || 0;
    if (filesList.length > 5) {
        alert("最多只能上传5个文件");
        $("#uploadsfzButton").attr("disabled", "true");
    } else {

        for (var i = 0; i < filesList.length; i++) {
            // file对象为用户选择的某一个文件
            file = document.getElementById("uploadFileName")[i];
            // 此时取出这个文件进行处理，这里只是显示文件名
            console.log(file.name);
            //格式验证
            if (isPic(file.name)) {

                if (file.size / 1024 / 1024 > 5) {
                    alert("文件不能超过5兆");
                    issfzupload = false;
                    break;
                } else {
                    name += file.name
                    + "&nbsp;&nbsp;&nbsp;&nbsp;<br>";
                }


            } else {
                alert("文件支持bmp,png,gif,jpeg,jpg格式图片");
                issfzupload = false;
                break;
            }


        }
        // alert(name);
        $("#uploadFileNameDIv").html(name);
        // $("#uploadsfzButton").attr("disabled","false");
        if (issfzupload == false) {
            $("#uploadsfzButton").attr("disabled", "true");
        } else {
            $("#uploadsfzButton").removeAttr("disabled");
        }
    }
}
function uploadsfzFile() {

    var file_upload_sfz = $("#file_upload_sfz");
    var infomation = {
        erp: $('#userPin').val(),
        albumId: info.leve_2

    };
    var url = "/upload/img?_=&";
    url += $.param(infomation);
    $('#file_upload_sfz').form(
        'submit',
        {
            url: url,
            dataType: 'json',
            onSubmit: function () {
            },
            success: function (data) {
                if ($.type(data) == 'string') {
                  data = $.parseJSON(data);
                 }
                if (data.status) {
                    $.messager.alert("提示", "上传成功", "info");
                    $('#uploadFileDIv').dialog('close');
                    jqueryloadPhoto.reDraw(getQueryPhotoData());
                } else    {
                    $.messager.alert("提示", data.msg, "error");
                }

            },
            failure: function () {
                $.messager.alert("提示", "上传失败", "error");
            }
        });
}
function getQueryPhotoData(){
    return {
        photoErp: $.trim( $('#photoErp').textbox('getValue')||""),
        createStart: $('#createStart').val(),
        createEnd: $('#createEnd').val()
    }
}