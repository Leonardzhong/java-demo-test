var table;
var tableData;
$(function(){
   // saveUserPage()
     initGrid();
    initPage();
    parseDate= function(data){
        if(data!="")
            return new Date(data).format('yyyy-MM-dd');
        else return "";
    }

    parseStatus=function (data){
        if(data==1){
            return "正常";
        }else if(data==2){
            return "禁用";
        }
    }


    $('#user_search').click(function() {
            if(validate($("#userSearchForm"))){
                table.fnDraw(); }
        }
    );
    $("#createTimeStart").datetimepicker({
        format: 'yyyy-mm-dd',
        minView : 'month',
        startView: 'month',
        language:'zh-CN',
        autoclose : true,
        todayHighlight : true
    });


    $("#createTimeEnd").datetimepicker({
        format: 'yyyy-mm-dd',
        minView : 'month',
        startView: 'month',
        language:'zh-CN',
        autoclose : true,
        todayHighlight : true
    });
    $("#user_update_btn").click(function() {
        var validateEl = $('#addPane');
        if (validate(validateEl)) {
            updateUserRecord();
        }
    });
    $("#createTime").datetimepicker({
        format: 'yyyy-mm-dd',
        minView : 'month',
        startView: 'month',
        language:'zh-CN',
        autoclose : true,
        todayHighlight : true
    });


    $("#birthday").datetimepicker({
        format: 'yyyy-mm-dd',
        startView: 'month',
        minView : 'month',
        language:'zh-CN',
        autoclose : true,
        todayHighlight : true
    });


});

function initPage(){
    $('#myModal').hide();
    $("#query_areaid").on("change", function() {
        if("" == $(this).val()){
            $("#query_operatorid").empty();
            $("#query_areaName").val("");
        }else{
            query_getDistribute($(this).val());
            $("#query_areaName").val($("#areaid option:selected").text());
        }
    })
    //参数flag ：是否需要自动生成用户编号
    $("#areaid").on("change", function() {
        var dbid=$("#dbid").val();
        if("" == $(this).val()){
            $("#operatorid").empty();
            $("#areaName").val("");
            if(dbid==''){
                $("#accountNo").val("");
            }
        }else{
            getDistribute($(this).val());
            $("#areaName").val($("#areaid option:selected").text());
            //选择区域自动生成用户唯一编号
            if(dbid==''){
                var areaid=$("#areaid option:selected").val();
                $.ajax({
                    type : "POST",
                    url : "/erp/user/getAccountNo",
                    data : "areaid=" + areaid,
                    success : function(data) {
                        $("#accountNo").val(data);
                    }

                });
            }
        }
    })
}
function initGrid(){
//新的加载方式   begin//
    var columns = [
        {"sTitle":"序号","sDefaultContent": "","sWidth": "30px","bSortable": false},
        {"mData": "areaName","bSortable":false,"sTitle":"区域","sDefaultContent":""},
        {"mData": "operatorName","bSortable":false,"sTitle":"运营中心","sDefaultContent":""},
        {"mData": "siteName","bSortable":false,"sTitle":"站点","sDefaultContent":""},
        {"mData": "roleName","bSortable":false,"sTitle":"角色","sDefaultContent":""},
        {"mData": "accountNo","bSortable":false,"sTitle":"用户编号","sDefaultContent":""},
        {"mData": "usercode","bSortable":false,"sTitle":"用户账号","sDefaultContent":""},
        {"mData": "mobile","bSortable":false,"sTitle":"用户手机","sDefaultContent":""},
        {"mData": "userStatus","bSortable":false,"sTitle":"用户状态","sDefaultContent":"","mRender":function(data){
            return parseStatus(data);
        }},
        {"mData": "createTime","bSortable":false,"sDefaultContent":"","sTitle":"创建时间","mRender":function(data){
            return parseDate(data);
        }},
        {"mData": "dbid", "sTitle": "操作","sWidth": "100px", "bSortable": false,"mRender": function (data, type, full) {
            var id = data;
            return "&nbsp;&nbsp;<a href='#'  title='修改' onclick='editUser(\""+id+"\");'><img src='"+springUrl+"/static/admin/skin/img/edit.png' alt='修改'></a>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href='#'  title='删除' onclick='delUser(\""+id+"\");'><img src='"+springUrl+"/static/admin/skin/img/delete1.png' alt='删除'></a>";
        }}


    ];

    var  tableBtns  =[
    ];





    table = $('#hello').dataTable( {
        "sDefaultContent":"user",
        "bProcessing": false,
        "bServerSide":true,
        "sPaginationType": "full_numbers",
        "sAjaxSource":springUrl+"/erp/user/user_page",
        "sServerMethod": "POST",
        "bAutoWidth": false,
        "bStateSave": false,
//					 "sScrollX": "100%",    //开启水平排序
        "sScrollY":"100%",
        "bScrollCollapse": true,
        "bPaginate":true,
        "oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条记录",
            "sZeroRecords": "抱歉， 没有找到",
            "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
            "sInfoEmpty": "没有数据",
            "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "前页",
                "sNext": "后页",
                "sLast": "尾页"}
        },
        //"sDom": "<'row-fluid'<'span6'Tl><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
        "sDom": "<'row-fluid'<'span12'lT>>Rt<'row-fluid'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap",
        "bJQueryUI": true,
        "bFilter":false,
        "fnServerData":function (sSource, aoData, fnCallback) {

            var roleid=$("#query_roleid option:selected").val();
            if(roleid==null) roleid="";
            roleid=roleid.replace("_","\\_");

            var areaid=$("#query_areaid option:selected").val();
            if(areaid==null) areaid="";
            areaid=areaid.replace("_","\\_");

            var operatorid=$("#query_operatorid option:selected").val();
            if(operatorid==null) operatorid="";
            operatorid=operatorid.replace("_","\\_");

            var siteid=$("#query_siteid option:selected").val();
            if(siteid==null) siteid="";
            siteid=siteid.replace("_","\\_");

            var username=$("#query_username").val();
            if(username==null) username="";
            username=username.replace("_","\\_");

            var usercode=$("#query_usercode").val();
            if(usercode==null) usercode="";
            usercode=usercode.replace("_","\\_");

            var mobile=$("#query_mobile").val();
            if(mobile==null) mobile="";
            mobile=mobile.replace("_","\\_");


            var userStatus=$("#query_userStatus option:selected").val();
            if(userStatus==null) userStatus="";
            userStatus=userStatus.replace("_","\\_");

            var createTimeStart=$("#createTimeStart").val();
            if(createTimeStart==null) createTimeStart="";
            createTimeStart=createTimeStart.replace("_","\\_");

            var createTimeEnd=$("#createTimeEnd").val();
            if(createTimeEnd==null) createTimeEnd="";
            createTimeEnd=createTimeEnd.replace("_","\\_");


            var accountNo=$("#query_accountNo").val();
            if(accountNo==null) accountNo="";
            accountNo=accountNo.replace("_","\\_");


            var wareHouseString=$("#wareHouseString").val();
            if(wareHouseString==null) wareHouseString="";
            wareHouseString=wareHouseString.replace("_","\\_");


            var distributeString=$("#distributeString").val();
            if(distributeString==null) distributeString="";
            distributeString=distributeString.replace("_","\\_");




            aoData.push(
                { "name": "roleid", "value":roleid },
                { "name": "areaid", "value":areaid },
                { "name": "operatorid", "value":operatorid },
                { "name": "siteid", "value":siteid },
                { "name": "username", "value":username },
                { "name": "usercode", "value":usercode },
                { "name": "mobile", "value":mobile },
                { "name": "createTimeStart", "value":createTimeStart },
                { "name": "createTimeEnd", "value":createTimeEnd },
                { "name": "userStatus", "value":userStatus },
                { "name": "accountNo", "value":accountNo },
                { "name": "wareHouseString", "value":wareHouseString },
                { "name": "distributeString", "value":distributeString }
            );
            jQuery.ajax( {
                type: "POST",
                url:sSource,
                dataType: "json",
                data: aoData,
                success: function(resp) {
                    tableData=resp;
                    fnCallback(resp);
                }
            });


        },
        "fnDrawCallback": function( oSettings ){
            //alert(oSetting);

            //alert("ddd");
            /*添加回调方法*/
            var that = this;
            this.$('td:eq(1)').each(function(i){
                that.fnUpdate( i+1, this.parentNode, 0, false, false );
            });
        },
        "aaSorting":[],//默认排序
        "aoColumns":columns,
        "oTableTools":{
            "aButtons":tableBtns
        }

    } );


}

function saveUserPage(){
    addPaneReset();
    $('#myModal').modal({backdrop: 'static', keyboard: false});
}
function addPaneReset(){
    initUserData({});
}

function initUserData(data){
    data=data||{};
    var user=data.user ||{};
    var shopList=data.shopList;
 
    $("#siteid").empty();
    if(shopList !=null){
        var html='<option value="">--请选择--</option>';
        for (var i = 0; i < shopList.length; i++) {
            html +="<option value='"+shopList[i].site_no+"'>"+shopList[i].site_name+"</option>";
        }
        $("#siteid").append(html);
    }

    $("#operatorid").empty();
    var distribute=data.distribute;
    if(distribute !=null){
        var html='<option value="">--请选择--</option>';
        for (var i = 0; i < distribute.length; i++) {
            html +="<option value='"+distribute[i].deliverCenterCode+"'>"+distribute[i].deliverCenterName+"</option>";
        }
        $("#operatorid").append(html);
    }


    $("#dbid").val(user.dbid);
    $("#areaid").val(user.areaid);
    $("#operatorid").val(user.operatorid);
    $("#areaName").val(user.areaName);

    $("#siteid").val(user.siteid);
    $("#roleid").val(user.roleid);
    $("#accountNo").val(user.accountNo);
    $("#usercode").val(user.usercode);



    $("#username").val(user.username);
    $("#mobile").val(user.mobile);
    $("#email").val(user.email);
    $("#status").val(user.status);


    $("#cardno").val(user.cardno);
    $("#birthday").val(user.birthdayString);
    $("#createTime").val(user.createTimeString);
    $("#sex").val(user.sex);

    $("#memo").val(user.memo);
    $("#drivieNo").val(user.drivieNo);
    $("#operatorName").val(user.operatorName);
    $("#siteName").val(user.siteName);


    $("#drivieNo").val(user.drivieNo);
    $("#areaName").val(user.areaName);
    $("#operatorName").val(user.operatorName);
    $("#siteName").val(user.siteName);


    $("#roleName").val(user.roleName);
    $("#userStatus").val(user.userStatus);

}

//调用治国写的获取运营中心方法
function query_getDistribute(wareHouseNo,fn){
    $.ajax({
        type : "POST",
        url : "/erp/application/getDistributeByNo",
        data : "wareHouseNo=" + wareHouseNo+"&userNo="+$("#userNo").val(),
        success : function(msg) {
            $("#query_operatorid").empty();
            var data=$.parseJSON(msg);
            var html='<option value="">--请选择--</option>';
            for (var i = 0; i < data.length; i++) {
                html +="<option value='"+data[i].deliverCenterCode+"'>"+data[i].deliverCenterName+"</option>";
            }
            $("#query_operatorid").append(html);
            if($.type(fn) == 'function'){
                fn();
            }

        }
    });
}
//调用治国写的获取运营中心方法
function query_getDistribute(wareHouseNo,fn){
    $.ajax({
        type : "POST",
        url : "/erp/application/getDistributeByNo",
        data : "wareHouseNo=" + wareHouseNo+"&userNo="+$("#userNo").val(),
        success : function(msg) {
            $("#query_operatorid").empty();
            var data=$.parseJSON(msg);
            var html='<option value="">--请选择--</option>';
            for (var i = 0; i < data.length; i++) {
                html +="<option value='"+data[i].deliverCenterCode+"'>"+data[i].deliverCenterName+"</option>";
            }
            $("#query_operatorid").append(html);
            if($.type(fn) == 'function'){
                fn();
            }

        }
    });
}


//调用治国写的获取运营中心方法
function getDistribute(wareHouseNo,fn){
    $.ajax({
        type : "POST",
        url : "/erp/application/getDistributeByNo",
        data : "wareHouseNo=" + wareHouseNo+"&userNo="+$("#userNo").val(),
        success : function(msg) {
            $("#operatorid").empty();
            var data=$.parseJSON(msg);
            var html='<option value="">--请选择--</option>';
            for (var i = 0; i < data.length; i++) {
                html +="<option value='"+data[i].deliverCenterCode+"'>"+data[i].deliverCenterName+"</option>";
            }
            $("#operatorid").append(html);
            if($.type(fn) == 'function'){
                fn();
            }

        }
    });
}
//点击运营中心，获取站点，并赋值运营中心name
function query_setOperatorName(){
    $("#query_operatorName").val($("#query_operatorid option:selected").text());
    var operatorId=$("#query_operatorid option:selected").val();
    $.ajax({
        type : "POST",
        url : "/erp/user/getShop",
        data : "operatorId=" + operatorId,
        success : function(data) {
            $("#query_siteid").empty();
//			var data=$.parseJSON(msg);
            var html='<option value="">--请选择--</option>';
            for (var i = 0; i < data.length; i++) {
                html +="<option value='"+data[i].site_no+"'>"+data[i].site_name+"</option>";
            }
            $("#query_siteid").append(html);
        }

    });
}

//点击运营中心，获取站点，并赋值运营中心name
function setOperatorName(){
    $("#operatorName").val($("#operatorid option:selected").text());
    var operatorId=$("#operatorid option:selected").val();
    $.ajax({
        type : "POST",
        url : "/erp/user/getShop",
        data : "operatorId=" + operatorId,
        success : function(data) {
            $("#siteid").empty();
//			var data=$.parseJSON(msg);
            var html='<option value="">--请选择--</option>';
            for (var i = 0; i < data.length; i++) {
                html +="<option value='"+data[i].site_no+"'>"+data[i].site_name+"</option>";
            }
            $("#siteid").append(html);
        }

    });
}



function toggleChecks(obj){
    $('.checkbox').prop('checked', obj.checked);
}



//显示表达式对应的用户串
function showUsers(userId){
    var map = getUsers(userId);
//	$("#disp").html(map.usersName);
//	$("#disp").show();
    if(map==null){
        Dialog.alert("提示","没有用户信息");
    }else{
        Dialog.alert("用户信息如下：",map.usersName);
    }
}

//隐藏表达式对应的用户串
function hideUsers(userId){
    $("#disp").hide();
}

//获得表达式对应的用户串Ajax
function getUsers(userId){
    var usersMap ;
    var data={
        "userId":userId
    };
    Dialog.post(springUrl+"/user/users_by_users_search_str",data,function(result){
        usersMap=result;
    });
    return usersMap;
}

//清空添加面板的数据
function clearAddPane(){
    setUserId("");
    setUserName("");
    setOrganization("","不限","不限");
    setPostion("","不限","不限");
    setUserName("","任何人");
    setLevel("","","");
    setRole("");
    setGroup("");
}


//$('#searchProjectName').keyup(function() {
//	if(validate($("#userSearchForm"))){
//		table.fnDraw();
//	}
//} );



//获取要修改操作数据的值
function editUser(id) {
    	$.ajax({
            url: "/erp/user/user_editpage?userNo="+$("#userNo").val()+"&id=" + id+"&="+Math.random(),
            type: "POST",
            dataType: "json",
            success: function (data) {
                addPaneReset();
                $('#myModal').modal({backdrop: 'static', keyboard: false});;
                initUserData(data);
            },
            error: function (xhr, st, err) {
                alert("保存失败,请联系管理员!");
            }
        });
}

//
function viewUserStatus(id){
    var buttons = [{
        "label": "关闭",
        "class": "btn-cancel",
        "callback": function () {
//	                        cancel();
        }
    }]
    Dialog.openRemote('address_getOrgUser','需求跟踪', springUrl + '/user/user_process_view?id='+id,800, 300, buttons);
}



function delUser(id) {
    Dialog.confirm("提示", "确定要删除改条记录吗?", "是", "否", function (result) {
        if (result) {
            jQuery.ajax({
                type: "POST",
                cache: false,
                url: springUrl+"/erp/user/user_delete",
                data: {
                    id: id
                },
                success: function (msg) {
                    alert("删除成功!");
                    table.fnDraw();
                },
                error: function (msg) {
                    alert("取消失败");
                }
            });
        }
    });

}



//判断两个map是否相同
function isEqualMap(map1,map2){
    var bool=true;
    for(var key in map1){
        if(map1[key]!=map2[key]){
            bool=false;
            return false;
        }
    }
    return bool;
}

function exportUser(){
    var distributeString =$("#distributeString").val();
    var wareHouseString =$("#wareHouseString").val();
    var url="/erp/user/user_export?wareHouseString="+wareHouseString+"&distributeString="+distributeString;
    window.location=url;
}

function setRoleName(){
    $("#roleName").val($("#roleid option:selected").text());
}
function setSiteName(){
    $("#siteName").val($("#siteid option:selected").text());
}

function updateUserRecord() {





//	debugger;
    var urlpara = "/erp/user/saveOrUpdateUser";
    //把表单的数据进行序列化
    var params = $("#updateUserForm").serialize();
    if($("#areaid option:selected").val()==""){
        alert("请选择区域");
        return;
    }
    if($("#operatorid option:selected").val()==""){
        alert("请选择运营中心");
        return;
    }
    if($("#siteid option:selected").val()==""){
        alert("请选择站点");
        return;
    }


    if($("#roleid option:selected").val()==""){
        alert("请选择角色");
        return;
    }


    if($("#usercode").val()==""){
        alert("用户账户不能为空");
        return;
    }
    if($("#username").val()==""){
        alert("用户姓名不能为空");
        return;
    }
    if($("#mobile").val()==""){
        alert("手机不能为空");
        return;
    }
    if($("#email").val()==""){
        alert("邮箱不能为空");
        return;
    }


    if($("#createTime").val()==""){
        alert("创建时间不能为空");
        return;
    }

    if($("#cardno").val()==""){
        alert("身份证号不能为空");
        return;
    }
    if($("#userStatus").val() == null ||$("#userStatus").val()==""){
        alert("状态不能为空");
        return;
    }
    if($("#sex").val() == null ||$("#sex").val()==""){
        alert("性别不能为空");
        return;
    }

    $("#user_update_btn").attr("disabled","disabled");

    $.ajax({
        url : urlpara,
        type : "POST",
        data : params,
        dataType : "json",
        success : function(data) {
            alert("保存成功!");
            window.location="/erp/user/user_index";
        },
        error : function(xhr, st, err) {
            alert("保存失败!");
        }
    });
}
