
$(document).ready(function () {

    $('#start_time').datetimepicker().on('changeDate', function(ev){
        getLiveCourseListForSomeDay($('#start_time').val(),'add');
    });

    $("#modifySaveBtn").click(function(){
        if($('#editLiveCourseForm').trigger("validate").isValid()){
            updateLiveCourse();
        }
    });
});

function addLiveCourse(){

    var data={
        "courseName": $('#course_name').val(),
        "startTime": $('#start_time').val(),
        //"endTime": $('#end_time').val(),
        "studyUrl": $('#study_url').val(),
        "teachUrl": $('#teach_url').val(),
        "teacherName": $('#teacher_name').val(),
        "timeRange":$('#time_range').find(':selected').text(),
        "courseDesc": $('#course_desc').val(),
        "source": $('#source').val()

    };
    var msg=validateLiveCourse(data)
    if(msg != null && msg != ''){
        //$('#confirmModifyModal .confirmModifyContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> '+msg);
        window.alert(msg);
        return;
    }

    $.ajax({
        url: '/schoolLive/insertLiveCourse',
        type: 'POST',
        dataType: 'json',
        data: data,
        success: function (data) {
            if (data && data.success) {

                //$(".shadowContainer").modal('hide');
                //$('#confirmModal .confirmContent').empty().append('<span class="glyphicon glyphicon-ok-sign text-success"></span> 上传直播课程成功');
                //$('#confirmModal').modal('show');
                alert('上传直播课程成功');
                //window.location.href="/schoolLive/liveCourseList";
                window.location.reload();

            } else {
                var msg = data.localizedMessage == null ? " 上传直播课程出错，请联系管理员" : data.localizedMessage;
                alert(msg);
                //$(".shadowContainer").modal('hide');
                //$('#confirmModal .confirmContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> ' + msg);
                //$('#confirmModal').modal('show');
            }
        },
        error: function () {
            var msg = data.localizedMessage == null ? " 上传直播课程出错，请联系管理员" : data.localizedMessage;
            $(".shadowContainer").modal('hide');
            $('#confirmModal .confirmContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> ' + msg);
            $('#confirmModal').modal('show');
        }
    });
}


function validateLiveCourse(data){
    if(data.courseName == null || data.courseName== '' || typeof data.courseName==undefined){
        return '课程名称为空';
    }
    if(data.startTime == null || data.startTime== '' || typeof data.startTime==undefined){
        return '开始时间为空';
    }
    if(data.timeRange == null || data.timeRange== '' || typeof data.timeRange==undefined){
        return '时间段为空';
    }
    if(data.studyUrl == null || data.studyUrl== '' || typeof data.studyUrl==undefined){
        return '学员学习地址为空';
    }
    if(data.teachUrl == null || data.teachUrl== '' || typeof data.teachUrl==undefined){
        return '讲师讲课地址为空';
    }
    if(data.teacherName == null || data.teacherName== '' || typeof data.teacherName==undefined){
        return '讲师姓名为空';
    }
    if(data.courseDesc == null || data.courseDesc== '' || typeof data.courseDesc==undefined){
        return '课程简介为空';
    }
    if(data.source == null || data.source== '' || typeof data.source==undefined){
        return '直播课程来源为空';
    }
    return '';
}


function getLiveCourseListForSomeDay(queryTime,op_type){

    $.ajax({
        url: '/schoolLive/getLiveCourseListForSomeDay',
        data: 'queryTime=' + queryTime,
        type: 'POST',
        dataType: 'json',
        success: function (data) {

            var time_rang_id = op_type=='edit'?'time_range_edit':'time_range';
            if (data && data.length>0) {
                $('#'+time_rang_id).find('option').remove();
                $('#'+time_rang_id).append('<option value="">请选择</option>');
                $.each(data, function (index, obj) {
                    $('#'+time_rang_id).append('<option value="' + obj + '" >' + obj + '</option>');
                });
            }else{
                $('#'+time_rang_id).find('option').remove();
                $('#'+time_rang_id).append('<option value="">请选择</option>');
                window.alert("没有可用的直播时间段，请选择其它时间");
            }

        },
        error: function () {
            window.alert("获取直播时间段错误，请联系管理员");
        }
    });
}

function editLiveCourse(id){
    $("#liveCourseID").val(id);
    $.ajax({
        type: "POST",
        url: "/schoolLive/getLiveCourseById",
        dataType: "json",
        data: {
            id: id
        },
        success: function (response) {

            var now = new Date();
            var sdate = new Date(response.startTimeDateTime);
            var edate = new Date(response.endTimeDateTime);
            if(now>sdate && now < edate){
                alert("当前直播正在直播中，不允许修改");
                return;
            }
            if (response.data != null) {
                $("#course_name_edit").val(response.data.courseName);
                $("#study_url_edit").val(response.data.studyUrl);
                $("#teach_url_edit").val(response.data.teachUrl);
                $("#teacher_name_edit").val(response.data.teacherName);

                $("#start_time_edit").val(response.startTime);
                $("#course_desc_edit").val(response.data.courseDesc);
                $("#source_edit").val(response.data.source);
                $('#editBtnModal').modal('show');

                $('#time_range_edit').find('option').remove();
                $.each(response.timeRangeList, function (index, obj) {

                    if(response.data.timeRange==obj){
                        $('#time_range_edit').append('<option value="' + obj + '" selected >' + obj + '</option>');
                    }else{
                        $('#time_range_edit').append('<option value="' + obj + '" >' + obj + '</option>');
                    }
                });

            }else{
                alert("获取直播课程信息失败");
            }
        }
    });

}
function deleteLiveCourse(id){
    var result = confirm("确认删除该直播课程？");
    if(result){
        $("#liveCourseID").val(id);
        $.ajax({
            type: "POST",
            url: "/schoolLive/getLiveCourseById",
            dataType: "json",
            data: {
                id: id
            },
            success: function (response) {

                var now = new Date();
                var sdate = new Date(response.startTimeDateTime);
                var edate = new Date(response.endTimeDateTime);
                if(now>sdate && now < edate){
                    alert("当前直播正在直播中，不允许删除");
                    return;
                }
                sendDeleteLiveCourseRequest(id);
            }
        });
    }
}

function sendDeleteLiveCourseRequest(id){
    $.ajax({
        type: "POST",
        url: '/schoolLive/deleteLiveCourse',
        dataType: "json",
        data: {
            id: id
        },
        success: function (response) {
            if (response.data > 0) {
                alert("删除成功");
                //window.location.href="/schoolLive/liveCourseList";
                window.location.reload();
            }else{
                alert("删除直播课程失败")
            }
        }
    });
}



function updateLiveCourse(){
    //var formData = new FormData();
    //formData.append("id", $("#liveCourseID").val());
    //formData.append("courseName", $("#course_name_edit").val());
    //formData.append("startTime", $("#start_time_edit").val());
    //formData.append("studyUrl", $("#study_url_edit").val());
    //formData.append("teachUrl", $("#teach_url_edit").val());
    //formData.append("teacherName", $("#teacher_name_edit").val());
    //formData.append("timeRange", $("#time_range_edit").find(':selected').text());
    //formData.append("courseDesc", $("#course_desc_edit").val());

    var data={
        "id":$("#liveCourseID").val(),
        "courseName": $('#course_name_edit').val(),
        "startTime": $('#start_time_edit').val(),
        //"endTime": $('#end_time').val(),
        "studyUrl": $('#study_url_edit').val(),
        "teachUrl": $('#teach_url_edit').val(),
        "teacherName": $('#teacher_name_edit').val(),
        "timeRange":$('#time_range_edit').find(':selected').text(),
        "courseDesc": $('#course_desc_edit').val(),
        "source": $('#source_edit').val()

    };
    var msg=validateLiveCourse(data)
    if(msg != null && msg != ''){
        //$('#confirmModifyModal .confirmModifyContent').empty().append('<span class="glyphicon glyphicon-remove-sign text-danger"></span> '+msg);
        window.alert(msg);
        return;
    }
    $.ajax({
        type: "POST",
        url: "/schoolLive/updateLiveCourseById",
        dataType: "json",
        data: data,
        success: function (response) {
            if (response.data > 0) {
                alert("编辑成功");
                $('#editBtnModal').modal('hide');
                //window.location.href="/schoolLive/liveCourseList";
                window.location.reload();
            }else{

                if(response.message!=null &&response.message!='' ){
                    alert(response.message);
                }else{
                    alert("编辑直播信息失败");
                }

            }
        }
    });
}

function addLiveRoom(){
    window.open("http://ssa.jd.com/sso/login?ReturnUrl=http%3A%2F%2Fmgr.vd.jd.com%2Findex");
    //window.open("http://jd.gensee.com/webcast/site/company");
    //window.open("http://jdtest.gensee.com/webcast/site/current");
}



function viewLiveCourse(id){
    $.ajax({
        type: "POST",
        url: "/schoolLive/getLiveCourseById",
        dataType: "json",
        data: {
            id: id
        },
        success: function (response) {
            if (response.data != null) {
                $("#course_name_view").text(response.data.courseName);
                $("#study_url_view").text(response.data.studyUrl);
                $("#teach_url_view").text(response.data.teachUrl);
                $("#teacher_name_view").text(response.data.teacherName);
                $("#source_view").text(response.data.source);

                $("#start_time_view").text(response.startTime);
                $("#course_desc_view").text(response.data.courseDesc);
                $('#viewBtnModal').modal('show');
                $('#time_range_view').text(response.data.timeRange);

            }else{
                alert("获取直播课程信息失败")
            }
        }
    });

}

/**
 * 开始讲课
 * @param id
 */
function startTeach(id){
    $.ajax({
        type: "POST",
        url: "/schoolLive/getLiveCourseById",
        dataType: "json",
        data: {
            id: id
        },
        success: function (response) {
            if (response.data != null) {
                window.open(response.data.teachUrl);
            }else{
                alert("获取直播课程信息失败")
            }
        }
    });

}


function startLearn(id){
    $.ajax({
        type: "POST",
        url: "/schoolLive/getLiveCourseById",
        dataType: "json",
        data: {
            id: id
        },
        success: function (response) {

            if (response.data != null) {

                var studyUrl = response.data.studyUrl;
                if(response.userNo!=null && response.userNo!=''){
                    studyUrl = studyUrl+"?nickName="+response.userNo;
                }
                window.open(studyUrl);
            }else{
                alert("获取直播课程信息失败")
            }
        }
    });

}






















