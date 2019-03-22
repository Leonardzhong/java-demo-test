$(function() {

	/*

	//getBaseControlInfo();
	bindValidate($('#addPane'));*/
	bindValidate($('#addPane'));

	$("#user_update_btn").click(function() {
		var validateEl = $('#addPane');
		if (validate(validateEl)) {
			updateUserRecord();
		}
	});

	$("#user_add_btn").click(function() {
		var validateEl = $('#addPane');
		if (validate(validateEl)) {
			addUserRecord1();
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

function setRoleName(){
	$("#roleName").val($("#roleid option:selected").text());
}
function setSiteName(){
	$("#siteName").val($("#siteid option:selected").text());
}

function  setSite(){

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


function addUserRecord1() {
	$("#user_add_btn").attr("disabled","disabled");
//	var areaName = $("#areaid option:selected").text();
//	alert($("#areaName").val());
//	if($("#areaid option:selected").val()==""){
//		alert("请选择区域");
//		return;
//	}
//	if($("#operatorid option:selected").val()==""){
//		alert("请选择运营中心");
//		return;
//	}
//	if($("#roleid option:selected").val()==""){
//		alert("请选择角色");
//		return;
//	}
	var urlpara = "/erp/user/user_save";
	//把表单的数据进行序列化
	var params = $("#insertUserForm").serialize();

	$.ajax({
		url : urlpara,
		type : "POST",
		data : params,
		dataType : "json",
		success : function(data) {
			if(data == "1"){
				alert("用户已经存在");
				$("#user_add_btn").attr("disabled",false);
			}else{
				alert("保存成功!");
				window.location="/erp/user/user_index";
			}

/*			$("#addPane").hide("fast");
			clearAddPane();
			table.fnDraw();
*/			//window.location=tag_ctx+"/jsp/demo/userList.jsp";
		},
		error : function(xhr, st, err) {
			alert("保存失败!");
		}
	});
}

function updateUserRecord() {
	$("#user_update_btn").attr("disabled","disabled");
//	debugger;
	var urlpara = "/erp/user/user_update";
	//把表单的数据进行序列化
	var params = $("#updateUserForm").serialize();

	$.ajax({
		url : urlpara,
		type : "POST",
		data : params,
		dataType : "json",
		success : function(data) {
			alert("保存成功!");
			window.location="/erp/user/user_index";
/*			$("#addPane").hide("fast");
			clearAddPane();
			table.fnDraw();
*/			//window.location=tag_ctx+"/jsp/demo/userList.jsp";
		},
		error : function(xhr, st, err) {
			alert("保存失败!");
		}
	});
}








