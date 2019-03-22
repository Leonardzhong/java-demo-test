$(function () {
        $("span[class='xheIcon xheBtnAbout']").hide();
        GroupSet.initTree();
        GroupSet.bindEvent();
        GridSet.initPage();
        GridSet.initGrid();


    }
)

var GridSet = {
    getTotenPriceFormData: function () {
        var json = $("#tokenpriceJSon").val();
        var data = null;
        if (json != null && json.length > 1) {
            data = JSON.parse(json);
        } else {
            data = {};
        }
        // id,tokenprice,sku,begin_time,end_time,groupid,sort,name,typeid ,tokenPriceImg
        data.id = $("#tokenpricereid").val()
        data.tokenprice = $("#tokenprice").textbox('getValue')
        data.sku = $("#sku").textbox('getValue')
        data.begin_time = $("#begin_time").val()
        data.end_time = $("#end_time").val()
        data.name = $("#skuName").val()
        data.groupid = $("#tokenpricegroupid").val()
        data.sort = $("#tokenpriceSort").val()
        data.typeid = $("#tokenpricetypeid").val()
        data.tokenPriceImg = $("#tokenPriceImg").attr("src");
        data.remark = $("#tokenpriceremark").textbox('getValue')
        return data;
    },
    savetokenprice: function () {
        var me = this;
        //得到所有选中的数据
        var data = this.getTotenPriceFormData();
        // id,tokenprice,sku,begin_time,end_time,groupid,sort,name,typeid ,tokenPriceImg

        if (data.sort == '') {
            $.messager.alert('提示', "令牌产品展示顺序不能为空", "error");
            return;
        }
        if (data.sku == '') {
            $.messager.alert('提示', "令牌产品sku不能为空", "error");
            return;
        }
        if (data.tokenprice == '') {
            $.messager.alert('提示', "令牌产品价格不能为空", "error");
            return;
        }
        if (data.groupid == '') {
            $.messager.alert('提示', "活动分类不能为空", "error");
            return;
        }
        if (data.tokenPriceImg == '') {
            $.messager.alert('提示', "令牌产品图片不能为空", "error");
            return;
        }
        if (data.begin_time == '') {
            $.messager.alert('提示', "开始促销日期不能为空", "error");
            return;
        }
        if (data.end_time == '') {
            $.messager.alert('提示', "结束促销日期不能为空", "error");
            return;
        }
        $.messager.progress({
            title: '请稍后',
            msg: '正在提交数据...',
            text: '保存数据中...'
        });
        //提交到后台
        jQuery.ajax({
            type: "POST",
            url: "/erp/saveOrUpdateTokenPrice",
            dataType: "json",
            data: data,
            complete: function () {
                $.messager.progress('close');
            },
            success: function (resp) {
                $('#winTokenPrice').panel('close');
                $.messager.alert("提示", resp.msg);
                me.queryGrid()

            }
        });

    },
    reset: function () {
        $("#warning").val("")
        $("#valid").val("")
        $("#beginTime").val("")
        $("#endTime").val("")
        $("#timeout").val("")
        $("#querysku").textbox('setValue', "")
    },
    showTokenPrice: function (id) {
        var formData = this.getTotenPriceFormData();
        //1、点击预览，判断必填字段是否维护，若否，提示先维护；若是，则调用商品组接口获取商品的描述、图片信息；调用价格组的接口获取该商品的实时价格以及移动端的专享价；然后结合令牌价格和生成如下所示的预览图
        if ($("#tokenpriceJSon").val() == null || "" == $("#tokenpriceJSon").val()) {
            $.messager.alert('提示', "请先维护商品SKU!", "error");
            return;
        }
        $('#showTokenPrice').window({
            title: "预览",
            collapsible: false,
            minimizable: false,
            maximizable: false,
            closable: true,
            border: false,
            modal: true
        });

        $("#showTokenPriceDiv").tokenPrice({
            autoDraw: true,
            tokenPriceId: id,
            data: formData

        })
    },
    initPage: function () {
        var me = this;
        me.reset();
        $("#showTokenPriceBtn").bind("click", function () {
            var id = $("#tokenpricereid").val();
            me.showTokenPrice(id);
        });
        $("#clearBtn").bind("click", function () {
            me.reset();
        });
        $("#savetokenprice").bind("click", function () {
            me.savetokenprice();
        });
        $("#queryBtn").bind("click", function () {
            me.queryGrid();
        });
        $("input", $("#sku").next("span")).blur(function () {
            if (null == $(this).val() || $(this).val() == "") {
                $.messager.alert('提示', "商品的sku不能为空", "error");
                return;
            }
            jQuery.ajax({
                type: "POST",
                url: "/erp/getTokenPriceBySku",
                dataType: "json",
                data: {sku: $(this).val()},
                success: function (resp) {
                    var data = resp.data;
                    if (data.name == null || '' == data.name || 'null' == data.name) {
                        $("#tokenpriceJSon").val("");
                        $.messager.alert('提示', "查询不到商品的信息", "error");
                        $("#skuName").val("")
                        $("#tokenPriceImg").attr("src", "").attr("alt", "查询不到商品的信息")

                        $('#savetokenprice').linkbutton('disable');
                        return;
                    }
                    $('#savetokenprice').linkbutton('enable');
                    $("#tokenpriceJSon").val(JSON.stringify(data));
                    $("#tokenPriceImg").attr("src", data.img + "?" + Math.random()).attr("alt", data.name);
                    $("#skuName").val(data.name).attr("title", data.name);
                }
            });
        });
        $("#createBtn").bind("click", function () {
            me.resetTokenPriceForm();
            var nodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
            var node = null;
            if (nodes.length > 1) {
                $.messager.alert('提示', "只能选择一个商品分类", "error");
                return;
            }
            if (nodes.length == 1) {
                node = nodes[0];

                if (node.level != 2) {
                    $.messager.alert('提示', "请正确选择商品分类", "error");
                    return;
                }

            } else {
                $.messager.alert('提示', "请正确选择商品分类", "error");
                return;
            }
            $("#tokenpricetypeid").val(node.id);
            $("#tokenpricegroupid").val(node.getParentNode().id);
            $("#typeName").val(node.name);
            $("#groupName").val(node.getParentNode().name);
            $('#winTokenPrice').window({
                title: "添加令牌商品",
                collapsible: false,
                minimizable: false,
                maximizable: false,
                width: 500,
                height: 600,
                modal: true
            });
        })

    },
    getQueryData: function () {
        var nodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
        var queryData = {
            sku: $("#querysku").textbox('getValue'),
            beginTime: $("#beginTime").val(),
            endTime: $("#endTime").val(),
            warning: $("#warning").val(),
            timeout: $("#timeout").val()

        }
        queryData["typeid"] = '';

        if (nodes.length == 1) {

            if (nodes[0].level != 0) {
                queryData["typeid"] = nodes[0].id
            }
        }
        return queryData;
    },
    queryGrid: function () {

        var queryData = this.getQueryData();
        $('#dataGrid').datagrid('load', queryData);
    },
    resetTokenPriceForm: function () {
        $("#tokenpricereid").val("")
        $("#tokenprice").textbox('setValue', "");
        $("#sku").textbox('setValue', "")
        $("#begin_time").val("");
        $("#end_time").val("");
        $("#skuName").val("")
        $("#tokenpricegroupid").val("")
        $("#tokenpricetypeid").val("")
        $("#tokenPriceImg").attr("src", "");
        $("#typeName").val("");
        $("#groupName").val("");
        $("#tokenpricereid").val("");
        $("#tokenpriceremark").textbox('setValue', "");
        $("#tokenpriceSort").textbox('setValue', "");


    },
    grid: null,
    editToken: function (id) {
        this.resetTokenPriceForm();
        jQuery.ajax({
            type: "POST",
            url: "/erp/getTokenPriceById",
            dataType: "json",
            data: {id: id},
            success: function (resp) {
                var data = resp.data;
                $("#tokenpricereid").val(data.id)
                $("#tokenprice").textbox('setValue', data.tokenprice);
                $("#sku").textbox('setValue', data.sku)
                $("#begin_time").val(data.begintime);
                $("#end_time").val(data.endtime);
                $("#skuName").val(data.name)
                $("#tokenpricegroupid").val(data.groupid)
                $("#tokenpriceSort").textbox('setValue', data.sort);
                $("#tokenpricetypeid").val(data.typeid)
                $("#tokenPriceImg").attr("src", data.tokenPriceImg);
                $("#typeName").val(data.typename);
                $("#groupName").val(data.groupame);
                $("#tokenpriceremark").textbox('setValue', data.remark);
                $('#winTokenPrice').window({
                    title: "修改令牌商品",
                    collapsible: false,
                    minimizable: false,
                    maximizable: false,
                    width: 500,
                    height: 600,
                    modal: true
                });

            }
        });


    },
    delToken: function (id) {
        if (id == null || id == '') {
            $.messager.alert("提示", "请选择要删除的数据", "error");
            return;
        }
        $.messager.confirm('提示', '将删除令牌商品数据，确认删除？', function (r) {
            if (r) {
                $.messager.progress({
                    title: '请稍后',
                    msg: '正在提交数据...',
                    text: '保存数据中...'
                });
                jQuery.ajax({
                    type: "POST",
                    url: "/erp/delTokenPrice",
                    dataType: "json",
                    data: {id: id},
                    complete: function () {
                        $.messager.progress('close');
                    },
                    success: function (resp) {
                        $.messager.alert("提示", resp.msg);
                        GridSet.queryGrid();
                    }
                });
            }
        });


    },
    initGrid: function () {
        var me = this;
        grid = $('#dataGrid')
            .datagrid(
            {
                url: "/erp/queryTokenPrice",
                queryParams: this.getQueryData(),
                rownumbers: true,
                striped: true,
                pagination: false,
                rowStyler: function (index, row) {
                    if (row.expired == 1) {
                        return 'background-color:yellow;';
                    }
                    if (row.warning == 1) {
                        return 'background-color:red;';
                    }


                },
                columns: [[

                    {
                        field: 'groupame',
                        title: '活动分类',
                        width: 60
                    },
                    {
                        field: 'typename',
                        title: '商品分类',
                        width: 60
                    },
                    {
                        field: 'sku',
                        title: 'SKU'
                    },
                    {
                        field: 'sort',
                        title: '展示顺序',
                        width: 60
                    },
                    {
                        field: 'tokenprice',
                        title: '令牌价',
                        width: 60
                    },
                    {
                        field: 'jdprice',
                        title: '商场价',
                        width: 60
                    },
                    {
                        field: 'mobilejdprice',
                        title: '移动端专项价',
                        width: 80
                    },
                    {
                        field: 'begintime',
                        title: '促销开始日期',
                        width: 80
                    },
                    {
                        field: 'endtime',
                        title: '促销结束日期',
                        width: 85
                    },
                    {
                        field: 'opration',
                        title: '操作',
                        width: 75,
                        formatter: function (value, rec) {

                            var btn = "<a class='editcls' onclick='GridSet.editToken(\""
                                + rec.id
                                + "\",\""
                                + rec.typdid
                                + "\")'   href='javascript:void(0)'>修改</a> <a class='editcls' onclick='GridSet.delToken(\""
                                + rec.id
                                + "\",\""
                                + rec.typdid
                                + "\",\""
                                + rec.typdid
                                + "\")'   href='javascript:void(0)'>删除</a>";

                            return btn;
                        }
                    }]]
            });
        var getPager = $('#dataGrid').datagrid('getPager');
        $(getPager).pagination({
            pageSize: 10,// 每页显示的记录条数，默认为10
            pageList: [5, 10, 15],// 可以设置每页记录条数的列表
            beforePageText: '第',// 页数文本框前显示的汉字
            afterPageText: '页    共 {pages} 页',
            displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录'
        });
    }


}

var GroupSet = {
    _initGroup: function () {
        $("#groupTd").html("")
        var nodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
        if (nodes.length == 1) {
            var node = nodes[0];
            if (!node.isParent) {
                $("#groupTd").html(node.name + '<input    style="width:300px; "    type="hidden" id="group" value="' + node.id + '"    />');

            } else {
                var children = node.children;
                var select = '<select style="width:300px; " id="group" >';
                for (var i = 0; i < children.length; i++) {
                    select += '<option value="' + children[i].id + '">' + children[i].name + '</option>';

                }
                $(select + '</select>').appendTo($("#groupTd"))

            }
        }
    },
    /**
     * 修改，新增分组时，初始化父组
     * @returns {string}
     * @private
     */
    _initTypeGroup: function () {

        var nodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
        if (nodes.length == 1) {
            var node = nodes[0];
            if (node.name == '分组信息') {
                return "请正确选择组";
            } else if (node.level == 2) {
                return "请正确选择组";
            } else {
                node = node.getParentNode();
                $("#groupTd").html(node.name + '<input    style="width:300px; "    type="hidden" id="pid" value="' + node.id + '"    />');
            }
        }
        return;
    },
    reflashTree: function () {
        $.fn.zTree.getZTreeObj("tree").destroy();
        this.initTree();
    },
    _resetForm: function () {
        $("#grouid").val("")
        $("#remark").textbox('setValue', "")
        $("#sort").textbox('setValue', "")
        $("#name").textbox('setValue', "")

    },
    bindEvent: function () {
        var me = this;
        $('#addType').bind("click", function () {
            $("#groupTd").html("")
            var nodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
            if (nodes.length > 1) {
                $.messager.alert('提示', "只能选择一个父组", "error");
                return;
            }
            if (nodes.length == 1) {
                var node = nodes[0];
                if (node.level == 2) {
                    $.messager.alert('提示', "不能再进行分组", "error");
                    return;

                } else {
                    $("#groupTd").html(node.name + '<input    style="width:300px; "    type="hidden" id="pid" value="' + node.id + '"    />');
                }
            } else {

                if ($.fn.zTree.getZTreeObj("tree").getNodes().length > 0) {
                    $.messager.alert('提示', "请选择一个父组", "error");
                    return;
                }
                $("#groupTd").html("" + '<input    style="width:300px; "    type="hidden" id="pid" value=""    />');
            }
            me._resetForm({});
            $('#win').window({
                title: "添加",
                collapsible: false,
                minimizable: false,
                maximizable: false,
                width: 400,
                height: 300,
                modal: true
            });
        })
        $('#updateType').bind("click", function () {

            $("#groupTd").html("")
            var nodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
            if (nodes.length > 1) {
                $.messager.alert('提示', "一次只能修改一个数据", "error");
                return;
            }
            if (nodes.length == 1) {
                var node = nodes[0];
                if (node.name == '分组信息') {
                    $.messager.alert('提示', "根节点不能修改", "error");
                    return;
                } else if (node.level == 0) {
                    $.messager.alert('提示', "根节点不能修改", "error");
                    return;
                } else {
                    node = node.getParentNode();
                    $("#groupTd").html(node.name + '<input    style="width:300px; "    type="hidden" id="pid" value="' + node.id + '"    />');
                }
            } else {
                $.messager.alert('提示', "请选择需要修改的组", "error");
                return;
            }

            //重置groupForm
            me._resetForm();
            var node = nodes[0]
            $("#grouid").val(node.id)
            $("#remark").textbox('setValue', node.remark)
            $("#sort").textbox('setValue', node.sort)
            $("#name").textbox('setValue', node.name)


            $('#win').window({
                title: "修改",
                collapsible: false,
                minimizable: false,
                maximizable: false,
                width: 400,
                height: 300,
                modal: true
            });
        })
        $('#delType').bind("click", function () {
            $.messager.confirm('提示', '将删除该节点以及所有子节点下的令牌商品数据，确认删除？', function (r) {
                if (r) {
                    me.delGroup()
                }
            });

        })
        $("#saveGroupBtn").bind("click", function () {
            me.saveOrUpdateGroup()
        });
        $("#reloadType").bind("click", function () {
            me.reflashTree()
        });


    },
    delGroup: function () {
        var me = this;
        var nodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();

        if (nodes.length > 1) {
            $.messager.alert('提示', "一次只能删除一个数据", "error");
            return;
        }
        if (nodes.length == 1) {
            var node = nodes[0];
            if (node.name == '分组信息') {
                $.messager.alert('提示', "根节点不能删除", "error");
                return;
            } else if (node.level == 0) {
                $.messager.alert('提示', "根节点不能删除", "error");
                return;
            } else {
                $.messager.progress({
                    title: '请稍后',
                    msg: '正在保存数据...',
                    text: '保存数据中...'
                });
                jQuery.ajax({
                    type: "POST",
                    url: "/erp/delTokenPriceGroup",
                    dataType: "json",
                    data: node,
                    complete: function () {
                        $.messager.progress('close');
                    },
                    success: function (resp) {
                        $.messager.progress('close');
                        $.messager.alert("提示", resp.msg);
                        me.reflashTree()
                        GridSet.queryGrid();

                    }
                });
            }
        } else {
            $.messager.alert('提示', "请选择需要删除的组");
            return;
        }
    },
    allTree: null,
    saveOrUpdateGroup: function () {
        var me = this;
        //得到所有选中的数据
        var data = {};
        data.id = $("#grouid").val()
        data.remark = $("#remark").textbox('getValue')
        data.sort = $("#sort").textbox('getValue')
        data.name = $("#name").textbox('getValue')
        data.pid = $("#pid").val()

        if (data.name == '') {
            $.messager.alert('提示', "名称不能为空");
            return;
        }
        if (data.sort == '') {
            $.messager.alert('提示', "排序不能为空");
            return;
        }
        $.messager.progress({
            title: '请稍后',
            msg: '正在提交数据...',
            text: '保存数据中...'
        });
        //提交到后台
        jQuery.ajax({
            type: "POST",
            url: "/erp/saveOrUpdateTokenPriceGroup",
            dataType: "json",
            data: data,
            complete: function () {
                $.messager.progress('close');
            },
            success: function (resp) {
                $('#win').panel('close');
                $.messager.alert("提示", resp.msg);
                me.reflashTree()

            }
        });
    },
    initTree: function () {

        var t = $("#tree");
        var setting = {
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false,
                drag: {}
            },
            async: {
                enable: true,
                url: "/erp/getTokenPriceTpyeTree",
                autoParam: ["id", "pId", "type"],
                otherParam: {"otherParam": "zTreeAsyncTest"}

            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: ""
                }
            },
            callback: {}
        };
        allTree = $.fn.zTree.init(t, setting);

    }

}

function delMenu(btn) {
    var node = $.parseJSON($(btn).attr("json"));
    //删除DOM
    $("#btn_" + node.id).remove();
    var treeObj = $.fn.zTree.getZTreeObj("tree");//获取ztree对象
    var parentZNode = treeObj.getNodeByParam("id", node.pId, null); //获取父节点
    if (parentZNode == null) {
        return;
    }


    //恢复树节点
    treeObj.addNodes(parentZNode, node, true);


}