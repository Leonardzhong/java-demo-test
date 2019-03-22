//初始化方法
$(document).ready(function () {

    //选择区域获取运营中心联动
    $('#area').combobox({
        onChange: function (newValue, oldValue) {
            changeAera();
        }
    });

    initArea();

    initRoleLsit();

});

//初始化区域
function initArea() {
    $.ajax({
        url: '/erp/common/areaCascadeController/getUserUniqueArea',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                if(data.length>7){
                    data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
                }
                $('#area').combobox('loadData', data);
                $('#area').combobox('select', data[0].org_no); //默认选中全部
            }
        },
        error: function (data) {
            alert("获取区域信息失败!");
        }
    });
}

//初始化角色列表
function initRoleLsit() {
    $.ajax({
        url: '/erp/common/roleController/getRoleList',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {
                $('#roleList').combobox('loadData', data);
            }
        },
        error: function (data) {
            alert("获取角色信息失败!");
        }
    });
}

function changeAera() {
    areaNo = $('#area').combobox('getValue');
    if (areaNo == '-1') {
        //区域选择的是全部
        var data = [{"distribute_name": "全部", "distribute_no": "-1"}];
        $('#operateCenter').combobox('loadData', data);
        $('#operateCenter').combobox('select', "-1"); //默认选中全部
    } else {
        $.ajax({
            url: '/erp/common/areaCascadeController/getOperateCenter',
            data: 'areaNo=' + areaNo,
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                operateCenterNo = '';
                if (data.length > 0) {
                    if ($("#operateCenter").length > 0) {//控件是否存在
                        if (data.length > 0) {
                            if(data.length > 5){
                                data.splice(0, 0, {"distribute_name": "全部", "distribute_no": "-1"});//增加全部选项 -1
                            }
                            $('#operateCenter').combobox('loadData', data);
                            $('#operateCenter').combobox('select',  data[0].distribute_no); //默认选中全部
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

var questionCount = 2;

var createNextQuestion = function () {

    var questionTable = $('<table width="100%" id="question_table_' + questionCount + '" ></table>');//创建table
    var questionTr1 = $('<tr></tr>'); //创建第一行
    var questionTr2 = $('<tr></tr>'); //创建第二行
    //第一行 第一列 序号
    var questionTd1 = $('<td width="10%"><label id="num_' + questionCount + '">' + questionCount + '</label></td>');
    //第一行 第二列  试题类型
    var questionTd2 = $('<td width="20%"></td>');
    //第一行 第三列 答案
    var questionTd3 = $('<td width="35%"></td>');
    //第一行 第四列 得分
    var questionTd4 = $('<td width="35%"></td>');
    //第一行 单选题型
    var radioSingle = $('<input>');
    radioSingle.attr('id', 'question_type_radio_' + questionCount + '_single');
    radioSingle.attr('type', 'radio');
    radioSingle.attr('name', 'question_type_radio_' + questionCount);
    radioSingle.attr('value',0);
    radioSingle.attr('checked', 'true');
    radioSingle.attr('onclick', 'changeRadio(this)');
    var labelSingle = $('<label>单选</label>');
    //第一行 多选题型
    var radioMultiple = $('<input>');
    radioMultiple.attr('id', 'question_type_radio_' + questionCount + '_multiple');
    radioMultiple.attr('type', 'radio');
    radioMultiple.attr('name', 'question_type_radio_' + questionCount);
    radioMultiple.attr('value', 1);
    radioMultiple.attr('onclick', 'changeRadio(this)');
    var labelMultiple = $('<label>多选</label>');
    //添加到对应的td中
    radioSingle.appendTo(questionTd2);
    labelSingle.appendTo(questionTd2);
    radioMultiple.appendTo(questionTd2);
    labelMultiple.appendTo(questionTd2);
    //第一行 创建题目答案
    var labelTitle = $('<label>题目答案</label>');
    var selectAnswer = $('<input>');
    selectAnswer.attr('id', 'question_answer_option_' + questionCount);
    selectAnswer.attr('name', 'question_answer_option_' + questionCount);
    selectAnswer.attr('class', 'easyui-combobox');
    selectAnswer.combobox({
        required: true,
        valueField: 'value',
        textField: 'name',
        panelHeight: 'auto',
        editable:false,
        data: [
            {value: 'A', name: 'A'},
            {value: 'B', name: 'B'},
            {value: 'C', name: 'C'},
            {value: 'D', name: 'D'}
        ]
    });
    //添加到对应的td中
    labelTitle.appendTo(questionTd3);
    selectAnswer.appendTo(questionTd3);
    //第一行 创建本题分数
    var sroceText = $('<input>');
    sroceText.attr('id', 'question_scroe_' + questionCount);
    sroceText.attr('name', 'question_scroe_' + questionCount);
    sroceText.attr('class', 'easyui-numberbox');
    sroceText.attr('min', '1');
    sroceText.attr('max', '100');
    sroceText.attr('missingMessage', '本题分数必须填写(1-100)');
    sroceText.attr('invalidMessage', '请填写有效(1-100)之间的数字');
    sroceText.attr('data-options', "required:true");
    var labelSroce = $('<label>本题分数</label>');
    //添加到对应的td中
    questionTd4.append(labelSroce);
    questionTd4.append(sroceText);
    //将第一行所有td添加到对应的tr中
    questionTd1.appendTo(questionTr1);
    questionTd2.appendTo(questionTr1);
    questionTd3.appendTo(questionTr1);
    questionTd4.appendTo(questionTr1);

    //创建第二行
    //第二行 第一列试题题目标签
    var questionTd5 = $('<td colspan="1" align=right></td>');
    //第二行 第二列  题目输入框和删除按钮
    var questionTd6 = $('<td colspan="3" align=left></td>');
    //创建第二行
    var labelQuestionTitle = $('<label>题目：</label>');
    var titleText = $('<input>');
    titleText.attr('id', 'question_title_' + questionCount);
    titleText.attr('name', 'question_title_' + questionCount);
    titleText.attr('class', 'easyui-textbox');
    titleText.attr('style', 'width:70%');
    titleText.attr('missingMessage', '题目必须填写');
    titleText.attr('invalidMessage', '字数不可超过50个');
    titleText.attr('data-options', "required:true,validType:'length[0,50]'");
    //第二题起，可以删除，有删除按钮
    var deleteButton = $('<a href="javascript:deleteThisQuestion(' + questionCount + ')" class="easyui-linkbutton" iconCls="icon-remove">删除</a>');
    //添加到对应的td中
    questionTd5.append(labelQuestionTitle);
    questionTd6.append(titleText);
    questionTd6.append(deleteButton);
    //将第二行所有td添加到对应的tr中
    questionTd5.appendTo(questionTr2);
    questionTd6.appendTo(questionTr2);

    //将对应的行加入到表中
    questionTr1.appendTo(questionTable);
    questionTr2.appendTo(questionTable);

    //循环创建ABCD选项
    var abcd = ['A', 'B', 'C', 'D'];
    for (var i = 0; i < abcd.length; i++) {
        var questionTd7 = $('<td colspan=1 align=right></td>');
        questionTd7.append($('<label>' + abcd[i] + '.</label>'));
        var questionTd8 = $('<td colspan=3></td>');
        var textOption = $('<input>');
        textOption.attr('id', 'option_' + abcd[i] + '_' + questionCount);
        textOption.attr('name', 'option_' + abcd[i] + '_' + questionCount);
        textOption.attr('class', 'easyui-textbox');
        textOption.attr('style', 'width:70%');
        textOption.attr('data-options', "required:true,validType:'length[0,50]'");
        textOption.attr('missingMessage', '选项内容必须填写');
        textOption.attr('invalidMessage', '字数不可超过50个');
        questionTd8.append(textOption);
        var tmpTr = $('<tr></tr>');
        tmpTr.append(questionTd7);
        tmpTr.append(questionTd8);
        tmpTr.appendTo(questionTable);
    }
    $("#exam_body").append(questionTable);
    $("#exam_body").append($('<hr id="hr_' + questionCount + '"/>'));

    $.parser.parse($('#question_table_' + questionCount));

    var tmpIdsStr = $('#questionsId').val();
    $('#questionsId').val(tmpIdsStr + questionCount + ";");
    //创建试题index自增
    questionCount++;
}

/**
 * 当单选多选发生变化时，修改答案选择模式
 */
function changeRadio(obj) {
    var strNo = obj.name.replace("question_type_radio_", "");
    var radioValue = obj.value;
    //console.log(strNo+';'+radioValue);
    if (radioValue == 0) {
        //单选
        $('#question_answer_option_' + strNo).combobox({
            multiple: false
        });
    } else {
        //多选
        $('#question_answer_option_' + strNo).combobox({
            multiple: true
        });
    }
}
/**
 * 创建完成
 */
function createExam() {

    var res = vailduteForm();

    if(res!=null){
        //验证失败
        $.messager.alert("错误",res,'error');
        return;
    }
    ParamUtil.crateParams();
    var erp = $('#erp').val();
    var rolesArr = $('#roleList').combobox('getValues');
    var roles = [];
    for(var i=0;i<rolesArr.length;i++){
        roles.push({roleNo:rolesArr[i]});
    }
    var exam = {
        title:$('#examTitle').textbox('getValue'),
        description:$('#examDec').textbox('getValue'),
        org:{org_no:$('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue')},//区域no
        distribute:{distribute_no:$('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue')},//运营中心no
        author:{boundErp:erp},
        createUser:erp,
        roles:roles,
        questions:[]
    };
    console.log(exam);
    //创建试题模型
    var arr = $('#questionsId').val().split(";");
    for (var i = 0; i < arr.length-1; i++) {
        var answerStr = "";
        if($('input[name="question_type_radio_'+arr[i]+'"]:checked').val()==0){
            //单选
            answerStr = $('#question_answer_option_'+arr[i]).combobox('getValue');
        }else{
            var answerArr = $('#question_answer_option_'+arr[i]).combobox('getValues');
            for(var j=0;j<answerArr.length;j++){
                answerStr +=answerArr[j]+';';
            }
        }
        //创建选项模型
        var options = [];
        var abcd = ['A', 'B', 'C', 'D'];
        for (var j = 0; j < abcd.length; j++) {
            options.push(
                {
                    name:abcd[j],
                    value:Math.pow(2,j),
                    description:$('#option_' + abcd[j] + '_' + arr[i]).textbox('getValue'),
                    createUser:erp
                }
            );
        }


        var questiontmp = {
            title:$('#question_title_'+arr[i]).textbox('getValue'),
            type:$('input[name="question_type_radio_'+arr[i]+'"]:checked').val(),
            answerStr:answerStr,
            score:$('#question_scroe_'+arr[i]).numberbox('getValue'),
            createUser:erp,
            options:options
        };
        exam.questions.push(questiontmp);
    }
    //创建查询条件page对象
    console.log(exam);
    ParamUtil.addParam('Exam',exam);
    //发送请求创建试卷
    josnRequest('/execute/examService/saveExam.json',ParamUtil.getParams(),function(data){
        $.messager.alert('提示','试题创建成功！','success');
        window.location.href='/getView/trainManage/examManage';
    } );
}
/**
 * 取消按钮
 */
function cancelCreate() {

    $.messager.confirm('确认', '取消后，将不会对本次试卷进行保存，是否确认取消?', function (r) {
        if (r) {
            window.location.href = '/getView/trainManage/createExamManage';
        }
    });
}

/**
 * 删除本题
 * @param obj
 */
function deleteThisQuestion(obj) {
    console.log('question_table_' + obj);
    console.log('hr_' + obj);
    $('#question_table_' + obj).remove();
    $('#hr_' + obj).remove();

    var tmpIdsStr = $('#questionsId').val();
    $('#questionsId').val(tmpIdsStr.replace(";" + obj + ";", ";"));
    //删除后，给现有所有question重新编号
    var arr = $('#questionsId').val().split(";");
    for (var i = 0; i < arr.length-1; i++) {
        $('#num_' + arr[i]).text(i + 1);
    }
}

/**
 * 表单校验
 */
function vailduteForm(){
    if(!$("#examTitle").textbox('isValid')){
        return '试卷题目不合规，必填不得超过50个字';
    }
    if(!$("#examDec").textbox('isValid')){
        return '试卷描述不得超过50个字';
    }
    if(!$("#roleList").combobox('isValid')){
        return '角色不能为空';
    }
    var arr = $('#questionsId').val().split(";");
    for (var i = 0; i < arr.length-1; i++) {
        if(!$('#question_answer_option_'+arr[i]).combobox('isValid')){
            return '第'+(i+1)+'题，题目答案不能为空';
        }
        if(!$('#question_scroe_'+arr[i]).numberbox('isValid')){
            return '第'+(i+1)+'题，题目分数不能为空';
        }
        if(!$('#question_title_'+arr[i]).textbox('isValid')){
            return '第'+(i+1)+'题，问题题目不能为空，且不得超过50字';
        }
        if(!$('#option_A_'+arr[i]).textbox('isValid')){
            return '第'+(i+1)+'题，A选项内容不能为空，不得超过50字';
        }
        if(!$('#option_B_'+arr[i]).textbox('isValid')){
            return '第'+(i+1)+'题，B选项内容不能为空，不得超过50字';
        }
        if(!$('#option_C_'+arr[i]).textbox('isValid')){
            return '第'+(i+1)+'题，C选项内容不能为空，不得超过50字';
        }
        if(!$('#option_D_'+arr[i]).textbox('isValid')){
            return '第'+(i+1)+'题，D选项内容不能为空，不得超过50字';
        }
    }
    return null;

}