/**
 * Created with IntelliJ IDEA.
 * User: luyanbin
 * Date: 2015/8/18
 * Time: 11:18
 */

//初始化方法
$(document).ready(function() {

	//初始化wind
	$('#examViewWind').window({
		title:'试卷',
		width:1024,
		height:600,
		modal:true,
		closed:true
	});

	initFinishStatus();

	createDetailTable();
});

var examJson = {};

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
 * 创建列表
 */
function createDetailTable(){

	//判断时间参数是否开始时间小于介素时间
	if(!compare('createTime','createTimeEnd')){
		$.messager.alert('提示','创建时间前大于后，请修改！','warning');
		return;
	}

	//判断时间参数是否开始时间小于介素时间
	if(!compare('finishTime','finishTimeEnd')){
		$.messager.alert('提示','完成时间前大于后，请修改！','warning');
		return;
	}

	ParamUtil.crateParams();
	//创建查询条件page对象
	var page = {
		param:{
			ERP:$('#erp').val(),
			examScore:{
				exam:{
					title:$('#examTitle').textbox('getValue')
				},
				user:{
					boundErp:$('#erp').val()
				}
			},
			finishStatus:$('#statusDetail').combobox('getValue')=='-1'?"":$('#statusDetail').combobox('getValue'),
			createTime:$('#createTime').datebox('getValue')!=''?$('#createTime').datebox('getValue')+' 00:00:00':'',
			createTimeEnd:$('#createTimeEnd').datebox('getValue')!=''?$('#createTimeEnd').datebox('getValue')+' 23:59:59':'',
			finishTime:$('#finishTime').datebox('getValue')!=''?$('#finishTime').datebox('getValue')+' 00:00:00':'',
			finishTimeEnd:$('#finishTimeEnd').datebox('getValue')!=''?$('#finishTimeEnd').datebox('getValue')+' 23:59:59':''
		}};
	ParamUtil.addParam('Page',page);

	$('#examScoreGrid').datagrid({
		url : '/execute/examScoreService/getExamScoresForPage.json',
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
				field : 'updateTime',
				title : '考试时间',
				width : '150',
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
				field : 'user.boundErp',
				title : '创建人',
				width : '150',
				align:'center',
				formatter: function(value,row,index){
					return row.user.userName;
				}
			},
			{
				field : 'creatorDept',
				title : '创建人部门',
				width : '150',
				align:'center',
				formatter: function(value,row,index){
					var tmp = "";
					if(row.user.distributeName!=null&&row.user.distributeName!=''){
						return row.user.orgName+'-'+row.user.distributeName;
					}else{
						return row.user.orgName;
					}
				}
			},
			{
				field : 'exam.title',
				title : '考试题目',
				width : '150',
				align:'center',
				formatter: function(value,row,index){
					return row.exam.title;
				}
			},
			{
				field : 'status',
				title : '试题状态',
				width : '150',
				align:'center',
				formatter: function(value,row,index){
					return row.score>=0?'已完成':'未完成';
				}
			},
			{
				field : 'score',
				title : '考试成绩',
				width : '150',
				align:'center',
				formatter: function(value,row,index){
					return value>=0?value:'';
				}
			},
			{
				field : '操作',
				title : '操作',
				width : '150',
				align:'center',
				formatter: function(value,row,index){
					if(row.score >= 0){
						return '<a href="javascript:examScoreQuery('+index+');">详情</a>';
					}else{
						return '<a href="javascript:goToExam('+index+');">去考试</a>';
					}

				}
			}
		] ],
		pagination:true,
		loader: gridPageLoader
	});
}

/**
 * 点击查询考试完成情况
 */
function examScoreQuery(index){
	examJson = {};
	if($("#examTable")!=null){
		$("#examTable").remove();
	}
	var examScore = $('#examScoreGrid').datagrid("getRows")[index];
	ParamUtil.crateParams();
	var exam = {
		id:examScore.exam.id,
		author:{
			boundErp:$('#erp').val()
		}
	};
	ParamUtil.addParam('Exam',exam);
	//发送请求创建试卷
	josnRequest('/execute/examService/getExamForDetail.json',ParamUtil.getParams(),function(data) {
		console.log(data);
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
		examTable.append('<tr><td align="center"><a href="javascript:exit()" id="return_button" class="easyui-linkbutton" iconCls="icon-ok" >返回</a></td></tr>');
		$('#examViewWindTable').append(examTable)
		$.parser.parse($('#return_button'));
		$('#examViewWind').window('open');
	});
}

/**
 * 点击去考试
 */
function goToExam(index){
	examJson = {};
	if($("#examTable")!=null){
		$("#examTable").remove();
	}
	var examScore = $('#examScoreGrid').datagrid("getRows")[index];
	ParamUtil.crateParams();
	var exam = {
		id:examScore.exam.id
	};
	ParamUtil.addParam('Exam',exam);
	//发送请求创建试卷
	josnRequest('/execute/examService/getExamForExaming.json',ParamUtil.getParams(),function(data){
		examJson = data;
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
					check = $('<input type="radio" value='+questions[i].options[j].value+' id="question_'+questions[i].options[j].name+'_'+questionCount+'" name="question_'+questionCount+'" >');
				}else{
					//多选题 checkBox
					check = $('<input type="checkBox" value='+questions[i].options[j].value+' id="question_'+questions[i].options[j].name+'_'+questionCount+'" name="question_'+questionCount+'[]" >');
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
		examTable.append('<tr><td align="center"><a href="javascript:submitExam()" id="submint_button" class="easyui-linkbutton" iconCls="icon-ok" >提交考试</a></td></tr>');
		$('#examViewWindTable').append(examTable);
		$.parser.parse($('#submint_button'));
		$('#examViewWind').window('open');
	} );
}

/**
 * 提交考试
 */
function submitExam(){
	//首先判断考试是否全答了
	if(checkExamAnswer()){
		$.messager.confirm('确认', '是否确认交卷，交卷后您的试卷不能更改？', function (r) {
			if (r) {
				//试卷判分
				var score = markingExam();
				ParamUtil.crateParams();
				var exam = examJson;
				var examScore = {
					exam:examJson,
					score:score,
					user:{
						boundErp:$('#erp').val()
					}
				};
				ParamUtil.addParam('ExamScore',examScore);
				josnRequest('/execute/examScoreService/updateExamScoreSaveRecord.json',ParamUtil.getParams(),function(data){
					//保存完成，提示分数，并跳转刷新页面
					$.messager.alert("提示","交卷成功，您的成绩是"+score+"分,再接再厉","message");
					$('#examViewWind').window('close');
					createDetailTable();
				});
			}
		})
	}else{
		//有题没有填写
		$.messager.alert("错误",'您还有未完成的试题，提交失败！','error');
	}
	//
}
/**
 * 判断试卷是否答完
 * @returns {boolean}
 */
function checkExamAnswer(){

	var questions = examJson.questions;
	if(questions!=null&&questions.length>0){
		for(var i=0;i<questions.length;i++){
			//判断多选单选checkbox or radio
			if(questions[i].type == 0){
				var val=$('input:radio[name="question_'+i+'"]:checked').val();
				if(val==null){
					return false;
				}
			}else{
				var val=$('input:checkbox[name="question_'+i+'[]"]:checked').val();
				if(val==null){
					return false;
				}
			}
		}
	}
	return true;
}

/**
 * 给试卷判分，只能使用一次，判完需要刷新页面
 * @returns {number}
 */
function markingExam(){
	var score = 0;
	var questions = examJson.questions;
	if(questions!=null&&questions.length>0){
		for(var i=0;i<questions.length;i++){
			//判断多选单选checkbox or radio
			if(questions[i].type == 0){
				var val=$('input:radio[name="question_'+i+'"]:checked').val();
				//求填写值
				if(questions[i].answer == parseInt(val)){
					//正确 加分
					score += questions[i].score;
				}else{
					//错误 不加分 修改answer变成答题结果
					questions[i].answer = parseInt(val);
				}
			}else {
				var val = $('input:checkbox[name="question_' + i + '[]"]:checked').val();
				//求填写值
				var res = 0;
				$('input[name="question_' + i + '[]"]:checked').each(function () {
					res += parseInt($(this).val());
				});
				//求填写值
				if (questions[i].answer == res) {
					//正确 加分
					score += questions[i].score;
				} else {
					//错误 不加分 修改answer变成答题结果
					questions[i].answer = res;
				}
			}
		}
	}
	return score;
}

function exit(){
	$('#examViewWind').window('close');
}


/**
 * 导出excel
 */
function exportExcel(){
	var exams = $('#examScoreGrid').datagrid("getRows");
	$('#exams').val(jsonToString(exams));
	//console.log($('#exams').val())
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