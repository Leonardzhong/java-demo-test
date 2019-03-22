/**
 * Created with IntelliJ IDEA.
 * User: luyanbin
 * Date: 2015/8/18
 * Time: 11:18
 */

var tmpInitFlag = 0;

//初始化方法
$(document).ready(function() {

	//选择区域获取运营中心联动
	$('#area').combobox({
		onChange:function(newValue,oldValue){
			changeAera('#area','#operateCenter',1);
		}
	});

	$('#creatorArea').combobox({
		onChange:function(newValue,oldValue){
			changeAera('#creatorArea','#creatorOperateCenter',0);
		}
	});

	$('#areaDetail').combobox({
		onChange:function(newValue,oldValue){
			changeAera('#areaDetail','#operateCenterDetail',0);
		}
	});

	//初始化wind
	$('#examDetailsWind').window({
		title:'试卷详情',
		width:1024,
		height:600,
		modal:true,
		closed:true
	});

	//初始化wind
	$('#examViewWind').window({
		title:'试卷',
		width:1024,
		height:600,
		modal:true,
		closed:true
	});

	initArea();

	initRange();

	initFinishStatus();

	initScore();

});

/**
 * 初始化区域
 */
function initArea(){
	$.ajax({
		url : '/erp/common/areaCascadeController/getUserUniqueArea',
		type : 'POST',
		dataType : 'json',
		success : function(data) {
			if(data.length>0){
				if(data.length>1){
					data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
				}
				$('#area').combobox('loadData', data);
				$('#areaDetail').combobox('loadData', data);
				$('#area').combobox('select', data[0].org_no); //默认选中全部
				$('#areaDetail').combobox('select', data[0].org_no); //默认选中全部
			}
		},
		error:function(data){
			alert("获取区域信息失败!");
		}
	});
	/*ParamUtil.crateParams();
	ParamUtil.addParam('String',"");
	josnRequest('/execute/areaCascadeDao/getArea',ParamUtil.getParams(),function(data){
		if(data.length>0){
			if(data.length>1){
				data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
			}
			$('#creatorArea').combobox('loadData', data);
			$('#creatorArea').combobox('select', data[0].org_no); //默认选中全部
		}
	} );*/

	$.ajax({
		url : '/erp/common/areaCascadeController/getAllArea',
		type : 'POST',
		dataType : 'json',
		success : function(data) {
			if(data.length>0){
				if(data.length>1){
					data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
				}
				$('#creatorArea').combobox('loadData',  data);
				$('#creatorArea').combobox('select', data[0].org_no); //默认选中全部
			}
		},
		error:function(data){
			alert("获取区域信息失败!");
		}
	});
}

/**
 * 菜单联动，区域变化，运营中心联动
 */
function changeAera(areName,distributeName,tmp){
	areaNo =  $(areName).combobox('getValue');
	if(areaNo=='-1'){
		//区域选择的是全部
		var data = [{"distribute_name":"全部","distribute_no":"-1"}];
		$(distributeName).combobox('loadData', data);
		$(distributeName).combobox('select', "-1"); //默认选中全部
		if(tmp==1&&tmpInitFlag==0){
			createTable();
			tmpInitFlag++;
		}
	}else{
		$.ajax({
			url : '/erp/common/areaCascadeController/getOperateCenter',
			data:'areaNo='+areaNo,
			type : 'POST',
			dataType : 'json',
			success : function(data) {
				operateCenterNo='';
				if(data.length>0){
					if($(distributeName).length>0){//控件是否存在
						if(data.length>0){
							if(data.length>1){
								data.splice(0,0,{"distribute_name":"全部","distribute_no":"-1"});//增加全部选项 -1
							}
							$(distributeName).combobox('loadData', data);
							$(distributeName).combobox('select', data[0].distribute_no); //默认选中全部
							if(tmp==1&&tmpInitFlag==0){
								createTable();
								tmpInitFlag++;
							}
						}

					}
				}
			},
			error:function(data){
				alert("获取运营中心信息失败!");
			}
		});
	}

}

function myformatter(date){
	var y = date.getFullYear();
	var m = date.getMonth()+1;
	var d = date.getDate();
	return y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
}

function myparser(s){
	if (!s) return new Date();
	var ss = (s.split('-'));
	var y = parseInt(ss[0],10);
	var m = parseInt(ss[1],10);
	var d = parseInt(ss[2],10);
	if (!isNaN(y) && !isNaN(m) && !isNaN(d)){
		return new Date(y,m-1,d);
	} else {
		return new Date();
	}
}

/**
 * 初始化范围
 */
function initRange(){
	var data = [{"id":"-1","text":"全部"},{"id":"0","text":"全国"},{"id":"1","text":"部分"}];
	$('#range').combobox('loadData', data);
	$('#range').combobox('select', "-1");
}

/**
 * 初始化考试情况下拉框
 */
function initFinishStatus(){
	var data = [
		{"id":"-1","text":"全部"},
		{"id":"0","text":"已完成"},
		{"id":"1","text":"未完成"}
	];
	$('#statusDetail').combobox('loadData', data);
	$('#statusDetail').combobox('select', "-1");
}

/**
 * 初始化考试得分下拉框
 */
function initScore(){
	var data = [
		{"id":"-1","text":"全部"},
		{"id":"0","text":"小于60分"},
		{"id":"1","text":"60分到80分"},
		{"id":"2","text":"80分以上"}
	];
	$('#score').combobox('loadData', data);
	$('#score').combobox('select', "-1");
}

/**
 * 创建列表
 */
function createTable(){

	//判断时间参数是否开始时间小于介素时间
	if(!compare('createTime','createTimeEnd')){
		$.messager.alert('提示','创建时间前大于后，请修改！','Warning');
		return;
	}

	ParamUtil.crateParams();
	
	//创建查询条件page对象
	var page = {
				param:{
					createTime:$('#createTime').datebox('getValue')!=''?$('#createTime').datebox('getValue')+' 00:00:00':'',//创建时间开始
					createTimeEnd:$('#createTimeEnd').datebox('getValue')!=''?$('#createTimeEnd').datebox('getValue')+' 23:59:59':'',//创建时间 至datebox
					ERP:$('#erp').val(),
					exam:{
						title:$('#examTitle').textbox('getValue'),
						org:{org_no:$('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue')},//区域no
						distribute:{distribute_no:$('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue')},//运营中心no
						range:$('#range').combobox('getValue')=='-1'?null:$('#range').combobox('getValue'),//发送范围 0：全国 ，1：部分
						author:{boundErp:$('#fileCreator').textbox('getValue'),
								orgNo:$('#creatorArea').combobox('getValue')=='-1'?"":$('#creatorArea').combobox('getValue'),
								distributeNo:$('#creatorOperateCenter').combobox('getValue')=='-1'?"":$('#creatorOperateCenter').combobox('getValue')}
					}
	}};
	console.log(page);
	ParamUtil.addParam('Page',page);
	
	$('#examGrid').datagrid({
		url : '/execute/examService/queryForPageExam.json',
		queryParams: {'params':ParamUtil.getParams()},
		rownumbers:false,
		singleSelect:true,
		striped:true,
		columns : [ [
				{
					field : 'createTime',
					title : '建立时间',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						var date = new Date();
						date.setTime(value);
						return date.format('yyyy-MM-dd');
					}
				},
				{
					field : 'title',
					title : '考试题目',
					width : '150',
					align:'center'
				},
				{
					field : 'finishStatus',
					title : '考试情况',
					width : '150',
					align:'center'
				},
				{
					field : 'range',
					title : '发送范围',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						return value==0?'全国':'部分';
					}
				},
				{
					field : 'status',
					title : '试题状态',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						return value==0?'已完成':'未完成';
					}
				},
				{
					field : 'author.userName',
					title : '创建人',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						return row.author.userName;
					}
				},
				{
					field : 'createDept',
					title : '创建人部门',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						var tmp = "";
						if(row.author.distributeName!=null&&row.author.distributeName!=''){
							return row.author.orgName+'-'+row.author.distributeName;
						}else{
							return row.author.orgName;
						}
					}
				},
				{
					field : '操作',
					title : '操作',
					width : '150',
					align:'center',
					formatter: function(value,row,index){
						return '<a href="javascript:queryExamDetail('+index+');">详情</a>';
					}
				}
				] ],
		pagination:true,
		loader: gridPageLoader,
		onDblClickRow: function (rowIndex, rowData) {
			queryExamDetail(rowIndex);
		}
	});
}


/**
 * 创建列表
 */
function createDetailTable(exam){

	ParamUtil.crateParams();
	//创建查询条件page对象
	var page = {
		param:{
			ERP:$('#erp').val(),
			examScore:{
				exam:examJson,
				watchUser:{
					orgNo:$('#areaDetail').combobox('getValue')=='-1'?"":$('#areaDetail').combobox('getValue'),
					distributeNo:$('#operateCenterDetail').combobox('getValue')=='-1'?"":$('#operateCenterDetail').combobox('getValue')
				}
			},
			finishStatus:$('#statusDetail').combobox('getValue')=='-1'?"":$('#statusDetail').combobox('getValue'),
			getScore:$('#score').combobox('getValue')=='-1'?"":$('#score').combobox('getValue')
		}};
	console.log(page);
	ParamUtil.addParam('Page',page);

	$('#examDetailGrid').datagrid({
		url : '/execute/examScoreService/queryForPageExamScore.json',
		queryParams: {'params':ParamUtil.getParams()},
		rownumbers:false,
		singleSelect:true,
		striped:true,
		columns : [ [
			{
				field : 'user.userName',
				title : '接收人姓名',
				width : '130',
				align:'center',
				formatter: function(value,row,index){
					return row.user.userName;
				}
			},
			{
				field : 'user.boundErp',
				title : '接收人ERP',
				width : '130',
				align:'center',
				formatter: function(value,row,index){
					return row.user.boundErp;
				}
			},
			{
				field : 'status',
				title : '考试情况',
				width : '130',
				align:'center',
				formatter: function(value,row,index){
					return row.score>=0?'已完成':'未完成';
				}
			},
			{
				field : 'updateTime',
				title : '考试时间',
				width : '130',
				align:'center',
				formatter: function(value,row,index){
					if(value==null||value==''){
						return '';
					}else{
						var date = new Date();
						date.setTime(value);
						return date.format('yyyy-MM-dd');
					}
				}
			},
			{
				field : 'score',
				title : '考试得分',
				width : '130',
				align:'center',
				formatter: function(value,row,index){
					return value==-1?'':value;
				}
			},
			{
				field : 'user.orgName',
				title : '区域',
				width : '130',
				align:'center',
				formatter: function(value,row,index){
					return row.user.orgName;
				}
			},
			{
				field : 'user.distributeName',
				title : '运营中心',
				width : '130',
				align:'center',
				formatter: function(value,row,index){
					return row.user.distributeName;
				}
			}
		] ],
		pagination:true,
		loader: gridPageLoader
	});
}
var examJson= {};
/**
 * 查询信息详细
 */
function queryExamDetail(index){

	var exam = $('#examGrid').datagrid("getRows")[index];
	examJson = exam;
	console.log(exam);
	$('#tmpExamId').val(exam.id);
	$("#examTitleDetail").text(exam.title);
	$("#examTitleDetail").attr("href","javascript:showExamRight()");
	$("#examStatusDetail").text(exam.status==0?'已完成':'未完成');
	$("#examFinishStatusDetail").text(exam.finishStatus==''||exam.finishStatus==null?'':exam.finishStatus);
	if(exam.author.distributeName!=null&&exam.author.distributeName!=''){
		$("#creatorDeptDetail").text(exam.author.orgName+'-'+exam.author.distributeName);
	}else{
		$("#creatorDeptDetail").text(exam.author.orgName);
	}
	$("#creatorDetail").text(exam.author.userName);
	var date = new Date();
	date.setTime(exam.createTime);
	$("#createTimeDetail").text(date.format('yyyy-MM-dd'));
	$('#examRange').text(exam.range==0?'全国':'部分');

	//创建table
	createDetailTable(exam);

	//清空查询条件
	var dataareaDetail = $('#areaDetail').combobox('getData');
	$('#areaDetail').combobox('select', dataareaDetail[0].org_no); //默认选中全部
	var dataoperateCenterDetail = $('#operateCenterDetail').combobox('getData');
	$('#operateCenterDetail').combobox('select', dataoperateCenterDetail[0].distribute_no);
	$('#score').combobox('select', '-1');
	$('#userNameOrErpDetail').textbox('setValue','');
	$('#statusDetail').combobox('select', '-1');

	$('#examDetailsWind').window('open');

}

/**
 * 展示试卷正确答案
 */
function showExamRight(){
	if($("#examTable")!=null){
		$("#examTable").remove();
	}
	ParamUtil.crateParams();
	var exam = {
		id:$('#tmpExamId').val()
	};
	ParamUtil.addParam('Exam',exam);
	//发送请求创建试卷
	josnRequest('/execute/examService/getExamForExaming.json',ParamUtil.getParams(),function(data){
		var exam = data;
		var examDesc = exam.description;
		var questionCount = 0;
		var examTable = $('<table id="examTable" width="90%" style="margin: 10px"></table>');//创建table
		var examDescTr = $('<tr></tr>');
		var examDescTd = $('<td><label>试题提示：'+examDesc+'<label></td>');
		examDescTr.append(examDescTd);
		examTable.append(examDescTr);
		var questions = exam.questions;
		for(var i=0;i<questions.length;i++){
			var questionTr1 = $('<tr></tr>');
			var quesType = questions[i].type == 0?"单选题":"多选题";
			var questionTd1 = $('<td >'+(i+1)+'.'+questions[i].title+'('+quesType+' '+questions[i].score+'分)</td>');
			questionTr1.append(questionTd1);
			examTable.append(questionTr1);
			//循环创建ABCD选项
			var abcd = ['A', 'B', 'C', 'D'];
			for (var j = 0; j < abcd.length; j++) {
				var questionTrTmp = $('<tr></tr>');
				var questionTdTmp = $('<td ></td>');
				var check = null;
				if(questions[i].type == 0){
					//单选题 radio
					if((questions[i].answer&questions[i].options[j].value)>0){
						check = $('<input type="radio" disabled value='+questions[i].options[j].value+' id="question_'+questions[i].options[j].name+'_'+questionCount+'" name="question_'+questionCount+'" checked="checked"  >');
					}else{
						check = $('<input type="radio" disabled value='+questions[i].options[j].value+' id="question_'+questions[i].options[j].name+'_'+questionCount+'" name="question_'+questionCount+'" >');
					}
				}else{
					//多选题 checkBox
					if((questions[i].answer&questions[i].options[j].value)>0){
						check = $('<input type="checkBox" disabled value='+questions[i].options[j].value+' id="question_'+questions[i].options[j].name+'_'+questionCount+'" name="question_'+questionCount+'[]" checked="checked" >');
					}else{
						check = $('<input type="checkBox" disabled value='+questions[i].options[j].value+' id="question_'+questions[i].options[j].name+'_'+questionCount+'" name="question_'+questionCount+'[]">');
					}
				}
				var labelCheck =  $('<label>'+questions[i].options[j].name+' '+questions[i].options[j].description+'</label>');
				questionTdTmp.append(check);
				questionTdTmp.append(labelCheck);
				questionTrTmp.append(questionTdTmp);
				examTable.append(questionTrTmp);
			}
			examTable.append($('<tr><td><hr></td></tr>'));
			questionCount++;
		}
		examTable.append('<tr><td align="center"><button id="return_button" onclick="exit();" class="bootstrapBtn">返回</button></td></tr>');
		$('#examViewWindTable').append(examTable)
		$.parser.parse($('#return_button'));
		$('#examViewWind').window('open');
	});
}

/**
 * 返回按钮
 */
function exit(){
	$('#examViewWind').window('close');
}

/**
 * 导出excel
 */
function exportExcel(){
	var exams = $('#examGrid').datagrid("getRows");
	$('#exams').val(jsonToString(exams));
	$('#examsForm').submit();
}

function jsonToString (obj){
	var THIS = this;
	switch(typeof(obj)){
		case 'string':
			return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
		case 'array':
			return '[' + obj.map(THIS.jsonToString).join(',') + ']';
		case 'object':
			if(obj instanceof Array){
				var strArr = [];
				var len = obj.length;
				for(var i=0; i<len; i++){
					strArr.push(THIS.jsonToString(obj[i]));
				}
				return '[' + strArr.join(',') + ']';
			}else if(obj==null){
				return 'null';

			}else{
				var string = [];
				for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));
				return '{' + string.join(',') + '}';
			}
		case 'number':
			return obj;
		case false:
			return obj;
	}
}