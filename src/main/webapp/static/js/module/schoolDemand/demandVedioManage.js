var pageFlag = true;
var imageChange = 0;
$(document).ready(function () {
    resizeContent();

    $("#addcourse").hide();

    var ondemandType = getUrlParam("type");

    if(ondemandType == '1' || ondemandType == '2' || ondemandType == '3' || ondemandType == '4'){
        $("#ondemandType").val(ondemandType);
        $("#ondemand_typeField").val(ondemandType);
    }

    $('form').validator({
        theme: 'default',
        stopOnError: false,
        focusInvalid: false,
        ignore: 'hidden'
    });

    $('#addBtn').on('click', function (e) {
        $('#imgUpload_add').fileinput('reset');

        $("#ondemand_name").val("");
        $("#ondemand_url").val("");
        $("#ondemand_type").val("1");
        $("#video_editor").val("");
        $("#ondemand_source").val("");
        $("#video_editor").val("");

        e.preventDefault();
    });

    $('#addBtnModal').on("show.bs.modal", function (e) {
    });

    pageselectCallback(0, null);

    $('#order a').on('click',function(){
        var $this = $(this);

        if($this.hasClass('desc')){
            $this.removeClass("desc");
            $this.addClass("asc");
        }else{
            $this.removeClass("asc");
            $this.addClass("desc");
        }

        pageFlag = true;
        pageselectCallback(0, null);
    });

    $("#ondemand_typeField").change(function(){
        var courseType = $("#ondemand_typeField").val();
        $("#ondemandType").val(courseType);

        pageFlag = true;
        pageselectCallback(0, null);
    });

    $("#imgUpload_add")
        .fileinput({
            language: 'zh',
            uploadUrl: "#",
            autoReplace: true,
            browseClass: "form-control", //按钮样式
            allowedFileTypes: ['image'],
            maxFileCount: 1,
            maxFileSize:0,
            allowedFileExtensions: ["jpg", "png", "gif"],
            showUpload: false, //是否显示上传按钮
            showRemove: false,
            previewSettings:{
                image: {width: "450px", height: "250px"},
                html: {width: "450px", height: "250px"},
                text: {width: "450px", height: "250px"},
                video: {width: "450px", height: "250px"},
                audio: {width: "450px", height: "250px"},
                flash: {width: "450px", height: "250px"},
                object: {width: "450px", height: "250px"},
                other: {width: "450px", height: "250px"}
            }
        });

    $("#imgUpload_edit")
        .fileinput({
            language: 'zh',
            uploadUrl: "#",
            autoReplace: true,
            browseClass: "form-control", //按钮样式
            allowedFileTypes: ['image'],
            maxFileCount: 1,
            maxFileSize:0,
            allowedFileExtensions: ["jpg", "png", "gif"],
            showUpload: false, //是否显示上传按钮
            showRemove: false,
            previewSettings:{
                image: {width: "450px", height: "250px"},
                html: {width: "450px", height: "250px"},
                text: {width: "450px", height: "250px"},
                video: {width: "450px", height: "250px"},
                audio: {width: "450px", height: "250px"},
                flash: {width: "450px", height: "250px"},
                object: {width: "450px", height: "250px"},
                other: {width: "450px", height: "250px"}
            }
        });


    $('#imgUpload_edit').on('fileselect', function(event, numFiles, label) {
        imageChange = 1;
    });

    $("#addSaveBtn").click(function(){
        if($('#addOnDemandInfoForm').trigger("validate").isValid()){
            $("#addSaveBtn").attr("disabled","disabled");
            saveCourse();
        }
    });

    $("#modifySaveBtn").click(function(){
        if($('#editOnDemandInfoForm').trigger("validate").isValid()){
            $("#modifySaveBtn").attr("disabled","disabled");
            updateCourse();
        }
    });
});

function resizeContent(){
    var courseMain = $('.container_main');
    var container_side =  $('.container_side');
    courseMain.css('min-height',container_side.outerHeight(true));
}

function editCourse(id){
    $("#ondemandOldID").val(id);
    $.ajax({
        type: "POST",
        url: "/school/queryOneOnDemandCource",
        dataType: "json",
        data: {
            id: id
        },
        success: function (response) {
            if (response.data != null) {
                $("#ondemand_name_edit").val(response.data.courseName);
                $("#ondemand_url_edit").val(response.data.courseUrl);
                $("#ondemand_type_edit").val(response.data.courseType);
                $("#video_editor_edit").val(response.data.videoEditor);
                $("#ondemand_source_edit").val(response.data.source);
                //设置预览图片
                $('.file-drop-zone-title').html('<img id="tempImg" src="'+response.data.coursePicUrl+'" style="width: 450px;height: 250px;">');
                $('.file-drop-zone-title').css({"padding": "0px"});
                $('#editBtnModal').modal('show');
            }else{
                alert("获取点播视频信息失败")
            }
        }
    });

}
function delCourse(id){
    var result = confirm("确认删除该点播视频？");
    if(result){
        $.ajax({
            type: "POST",
            url: "/school/delOnDemandCource",
            dataType: "json",
            data: {
                id: id
            },
            success: function (response) {
                if (response.data > 0) {
                    pageFlag = true;
                    alert("删除成功");
                    pageselectCallback(0, null);
                }else{
                    alert("删除点播视频信息失败")
                }
            }
        });
    }
}

function pageselectCallback(page_index, jq){
    var courseType = $("#ondemandType").val();
    var sort = "desc";

    if($('#order a').hasClass("asc")){
        sort = "asc";
    }

    $("#currentPage").val(page_index);

    $.ajax({
        type: "POST",
        url: "/school/queryOnDemandCourceOnPage",
        dataType: "json",
        data: {
            currentPage: page_index,
            ondemandType: courseType,
            sort:sort
        },
        success: function (response) {
            if (response != null) {
                var pages = response.pages;
                var total = response.total;

                $("#count").html(total);

                if(response.isAdd == true){
                    $("#addcourse").show();
                }

                if(pageFlag){
                    pageFlag = false;

                    $(".pagination").pagination(total, {
                        prev_text: '<img id="preBtn" src="/static/images/arrow_left.png"/>',
                        next_text: '<img id="nextBtn" src="/static/images/arrow_right.png"/>',
                        items_per_page: 8, //每页显示10项
                        current_page: page_index,
                        num_edge_entries: 2, //边缘页数
                        num_display_entries: pages,//主体页数
                        load_first_page:false,
                        callback: pageselectCallback
                    });
                }
                $("#ondemandCourseList").html("");
                loadCourseData(response.data);
            } else {
                alert("获取课程失败");
            }
        }
    });
}

function loadCourseData(data){
    for (var i = 0; i < data.length; i++){
        var html = " <div class='aondemand_bg' title='"+data[i].courseName+"'>"+
            "<ul class='one_lvc fl'>"+
            "<li class='aondemand_img'><input type='image' class='one_lvc_img' name='class_img' src='"+data[i].coursePicUrl+"' onclick=window.open('"+data[i].courseUrl+"') /></li>"+
            "<li class='off_lvc_name'>"+data[i].courseName+"</li>"+
            "<li class='aondemand_fee clearfix'>"+
            "<div class='off_lvc_th fr' title='"+data[i].source+"'><img src='/static/images/th_temp.png'><span class='fr teacherName'>"+data[i].source+"</span></div></li>"+
            "<div class='edit_class'><input type='image' name='edit_class' src='/static/images/del_class.png' onclick='delCourse("+data[i].id+")'/></div>"+
            "<div class='del_class'><input type='image' name='del_class' src='/static/images/edit_class.png'  onclick='editCourse("+data[i].id+")'/></div></ul></a></div>";

        $("#ondemandCourseList").append(html);
    }
    var html = "<div style='clear:both'></div>"
    $("#ondemandCourseList").append(html);
}

function saveCourse(){
    if(document.getElementById("imgUpload_add").files[0]==null||document.getElementById("imgUpload_add").files[0]==undefined){
        alert("请上传一张广告位图片，再试");
        return;
    }else{
        //验证图片大小
        var fileSize = document.getElementById("imgUpload_add").files[0].size;
        if(fileSize>2048*1024){
            alert("对不起，文件最大可支持2M");
            return;
        }
        //验证文件类型
        var fileName = document.getElementById("imgUpload_add").files[0].name;
        var fileType = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        if(fileType!='png' && fileType!='jpg' && fileType!='gif'){
            alert("对不起，文件上传只支持图片类型");
            return;
        }

        var formData = new FormData();
        formData.append("courseName", $("#ondemand_name").val());
        formData.append("courseUrl",$("#ondemand_url").val() );
        formData.append("courseType", $("#ondemand_type").val());
        formData.append("videoEditor",$("#video_editor").val());
        formData.append("source", $("#ondemand_source").val());
        formData.append("file", document.getElementById("imgUpload_add").files[0]);

        $.ajax({
            type: "POST",
            url: "/school/addOnDemandCource",
            dataType: "json",
            processData: false,
            contentType: false,
            data: formData,
            success: function (response) {
                if (response.data > 0) {
                    pageFlag = true;
                    alert("添加成功");
                    $("#addSaveBtn").removeAttr("disabled");
                    $('#addBtnModal').modal('hide');
                    pageselectCallback(0, null);
                }else{
                    $("#addSaveBtn").removeAttr("disabled");
                    alert(response.msg);
                }
            }
        });
    }
}

function updateCourse(){
    var formData = new FormData();
    formData.append("id", $("#ondemandOldID").val());
    formData.append("courseName", $("#ondemand_name_edit").val());
    formData.append("courseUrl",$("#ondemand_url_edit").val() );
    formData.append("courseType", $("#ondemand_type_edit").val());
    formData.append("videoEditor",$("#video_editor_edit").val());
    formData.append("source", $("#ondemand_source_edit").val());

    if(imageChange==1){
        if(document.getElementById("imgUpload_edit").files[0]==null||document.getElementById("imgUpload_edit").files[0]==undefined){
            alert("请上传一张广告位图片，再试");
            return;
        }
        //验证图片大小
        var fileSize = document.getElementById("imgUpload_edit").files[0].size;
        if(fileSize>2048*1024){
            alert("对不起，文件最大可支持2M");
            return;
        }
        //验证文件类型
        var fileName = document.getElementById("imgUpload_edit").files[0].name;
        var fileType = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
        if(fileType!='png' && fileType!='jpg' && fileType!='gif'){
            alert("对不起，文件上传只支持图片类型");
            return;
        }

        formData.append("file", document.getElementById("imgUpload_edit").files[0]);
    }

    $.ajax({
        type: "POST",
        url: "/school/editOnDemandCource",
        dataType: "json",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            if (response.data > 0) {
                pageFlag = true;
                alert("编辑成功");
                $("#modifySaveBtn").removeAttr("disabled");
                $('#editBtnModal').modal('hide');
                pageselectCallback(0, null);
            }else{
                $("#modifySaveBtn").removeAttr("disabled");
                alert(response.msg);
            }
        }
    });
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}