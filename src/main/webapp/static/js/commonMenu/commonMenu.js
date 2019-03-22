$(function () {
        menuset.initPage();
        menuset.initTree();

    }
)


var menuset = {
    allTree:null,
    initPage: function () {
        $("#saveBtn").bind("click",this.saveData);
        $("#reloadBtn").bind("click",this.reloadData);
    },
    saveData:function(){
        //得到所有选中的数据$((
        var menus=$("button[name='treeMenu']");
        var nodes=new Array();
        var nodeMap={};
        for(var i=0;i<menus.length;i++){
            var json=$(menus[i]).attr("json");
            var node=JSON.parse(json);

            if(nodeMap[node.id] == null ){
                nodes.push(node);
                nodeMap[node.id]=node.name;
            }else{
                $.messager.alert("提示","不能有重复数据！");
                return;
            }

        }
        var aoData={};
        aoData.menus=JSON.stringify(nodes);
        //提交到后台
        jQuery.ajax({
            type: "POST",
            url: "/erp/saveCommonMenu",
            dataType: "json",
            data: aoData,
            success: function (resp) {
                $.messager.alert("提示",resp.msg);
            }
        });
    },
    reloadData:function(){
        window.location.href="/erp/commonMenu"

    },
    initTree: function () {
        var zNodes =[{name:"所有菜单", id:"0",isParent:true}];
        var t = $("#tree");
        var setting = {
            edit: {
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false,
                drag: {
                    prev: MoveMenu.prevTree,
                    next: MoveMenu.nextTree,
                    inner: MoveMenu.innerTree
                }
            },
            async: {
                enable: true,
                url: "/erp/getChildMenu",
                autoParam: ["id", "pId", "type"],
                otherParam: {"otherParam": "zTreeAsyncTest"}

            },
            data: {
                keep: {
                    parent: true,
                    leaf: true
                },
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeDrag: MoveMenu.dragTree2Dom,
                onDrop: MoveMenu.dropTree2Dom,
                onDragMove: MoveMenu.dragMove,
                onMouseUp: MoveMenu.dom2Tree
            },
            view: {
                selectedMulti: false
            }
        };
        allTree = $.fn.zTree.init(t, setting,zNodes);
        MoveMenu.updateType();

        MoveMenu.bindDom();

    }

}

 function delMenu(btn){
      var node=$.parseJSON($(btn).attr("json"));
     //删除DOM
     $("#btn_"+node.id).remove();
     var treeObj = $.fn.zTree.getZTreeObj("tree");//获取ztree对象
     var parentZNode = treeObj.getNodeByParam("id", node.pId, null); //获取父节点
     if(parentZNode == null){
         return;
     }

     //恢复树节点
     treeObj.addNodes(parentZNode, node, true);


 }
var MoveMenu = {
    errorMsg: "数据错误！",
    curTarget: null,
    curTmpTarget: null,
    noSel: function() {
        try {
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        } catch(e){}
    },
    dragTree2Dom: function(treeId, treeNodes) {
        return !treeNodes[0].isParent;
    },
    prevTree: function(treeId, treeNodes, targetNode) {
        return !targetNode.isParent && targetNode.parentTId == treeNodes[0].parentTId;
    },
    nextTree: function(treeId, treeNodes, targetNode) {
        return !targetNode.isParent && targetNode.parentTId == treeNodes[0].parentTId;
    },
    innerTree: function(treeId, treeNodes, targetNode) {
        return targetNode!=null && targetNode.isParent && targetNode.tId == treeNodes[0].parentTId;
    },
    dragMove: function(e, treeId, treeNodes) {;
        var p = null, pId = 'dom_' + treeNodes[0].pId;
        if (e.target.id == pId) {
            p = $(e.target);
        } else {
            p = $(e.target).parent('#' + pId);
            if (!p.get(0)) {
                p = null;
            }
        }

        $('.domBtnDiv .active').removeClass('active');
        if (p) {
            p.addClass('active');
        }
    },
    dropTree2Dom: function(e, treeId, treeNodes, targetNode, moveType) {
        var domId = "dom_" + treeNodes[0].getParentNode().id;

            var zTree = $.fn.zTree.getZTreeObj("tree");
            zTree.removeNode(treeNodes[0]);

            var newDom = $("span[domId=" + treeNodes[0].id + "]");
            if (newDom.length > 0) {
                newDom.removeClass("domBtn_Disabled");
                newDom.addClass("domBtn");
            } else {
                var json=JSON.stringify(treeNodes[0]);
                var html="<span  id='btn_"+treeNodes[0].id+"' class='domBtn'  >" + treeNodes[0].name +"<button  name='treeMenu' json='"+json+"' style='float: right' onclick='delMenu(this)'   >删除</button>"+ "</span>"
                $("#commonDiv").append(html);
            }
            MoveMenu.updateType();

    },
    dom2Tree: function(e, treeId, treeNode) {

        var target = MoveMenu.curTarget, tmpTarget = MoveMenu.curTmpTarget;

        if (!target) return;
        var zTree = $.fn.zTree.getZTreeObj("tree"), parentNode;
        if (treeNode != null && treeNode.isParent && "dom_" + treeNode.id == target.parent().attr("id")) {
            parentNode = treeNode;
        } else if (treeNode != null && !treeNode.isParent && "dom_" + treeNode.getParentNode().id == target.parent().attr("id")) {
            parentNode = treeNode.getParentNode();
        }

        if (tmpTarget) tmpTarget.remove();
        if (!!parentNode) {
            var nodes = zTree.addNodes(parentNode, {id:target.attr("domId"), name: target.text()});
            zTree.selectNode(nodes[0]);
        } else {
            target.removeClass("domBtn_Disabled");
            target.addClass("domBtn");
            alert(MoveMenu.errorMsg);
        }
        MoveMenu.updateType();
        MoveMenu.curTarget = null;
        MoveMenu.curTmpTarget = null;
    },
    updateType: function() {

        var zTree = $.fn.zTree.getZTreeObj("tree"),
            nodes = zTree.getNodes();
        for (var i=0, l=nodes.length; i<l; i++) {
            var num = nodes[i].children ? nodes[i].children.length : 0;
            nodes[i].name = nodes[i].name.replace(/ \(.*\)/gi, "") + " (" + num + ")";
            zTree.updateNode(nodes[i]);
        }
    },
    bindDom: function() {

        $(".domBtnDiv").bind("mousedown", MoveMenu.bindMouseDown);
    },
    bindMouseDown: function(e) {
        var target = e.target;
        if (target!=null && target.className=="domBtn") {
            var doc = $(document), target = $(target),
                docScrollTop = doc.scrollTop(),
                docScrollLeft = doc.scrollLeft();
            target.addClass("domBtn_Disabled");
            target.removeClass("domBtn");
            curDom = $("<span class='dom_tmp domBtn'>" + target.text() + "</span>");
            curDom.appendTo("body");

            curDom.css({
                "top": (e.clientY + docScrollTop + 3) + "px",
                "left": (e.clientX + docScrollLeft + 3) + "px"
            });
            MoveMenu.curTarget = target;
            MoveMenu.curTmpTarget = curDom;

            doc.bind("mousemove", MoveMenu.bindMouseMove);
            doc.bind("mouseup", MoveMenu.bindMouseUp);
            doc.bind("selectstart", MoveMenu.docSelect);
        }
        if(e.preventDefault) {
            e.preventDefault();
        }
    },
    bindMouseMove: function(e) {
        MoveMenu.noSel();
        var doc = $(document),
            docScrollTop = doc.scrollTop(),
            docScrollLeft = doc.scrollLeft(),
            tmpTarget = MoveMenu.curTmpTarget;
        if (tmpTarget) {
            tmpTarget.css({
                "top": (e.clientY + docScrollTop + 3) + "px",
                "left": (e.clientX + docScrollLeft + 3) + "px"
            });
        }
        return false;
    },
    bindMouseUp: function(e) {
        var doc = $(document);
        doc.unbind("mousemove", MoveMenu.bindMouseMove);
        doc.unbind("mouseup", MoveMenu.bindMouseUp);
        doc.unbind("selectstart", MoveMenu.docSelect);

        var target = MoveMenu.curTarget, tmpTarget = MoveMenu.curTmpTarget;
        if (tmpTarget) tmpTarget.remove();

        if ($(e.target).parents("#tree").length == 0) {
            if (target) {
                target.removeClass("domBtn_Disabled");
                target.addClass("domBtn");
            }
            MoveMenu.curTarget = null;
            MoveMenu.curTmpTarget = null;
        }
    },
    bindSelect: function() {
        return false;
    }
};
