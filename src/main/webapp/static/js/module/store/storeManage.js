/**
 * Created with IntelliJ IDEA.
 * User: yanbingxin
 * Date: 2015/8/18
 * Time: 11:18
 */
$(document).ready(function(){
    //初始化wind
    $('#storeDetailsWind').window({
        title:'编辑',
        width:950,
        height:400,
        modal:true,
        closed:true
    });
    //选择区域获取运营中心联动
    $('#area').combobox({
        editable:false,
        onChange:function(newValue,oldValue){
            changeAera('#area','#operateCenter',1);
        }
    });
    $('#operateCenter').combobox({
        editable:false
    });
    initArea();
    initAddress();

   // createTable();
});
function initAddress(){
    //初始化四级地址
    $.ajax({
        url : '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo',
        type : 'POST',
        dataType : 'json',
        data:{parentNo:0},
        success : function(data) {
            $('#province').combobox({
                editable:false,
                onSelect:function(record){
                    $('#city').combobox('clear');
                    $('#county').combobox('clear');
                    changeAdress(record.areaId,true,"#city","#province");
                }
            });

            data.splice(0,0,{"areaName":"省","areaId":"-1"});//增加全部选项 #
            $('#province').combobox('loadData', data);
            $('#province').combobox('select', data[0].areaId); //默认选中全部
            $('#city').combobox({
                    editable:false,
                    onSelect:function(record){
                        $('#county').combobox('clear');
                        changeAdress(record.areaId,false,"#county","#city");
                    }
             });
            var data = [{"areaName":"市","areaId":"-1"}];
            $("#city").combobox('loadData', data);
            $("#city").combobox('select', "-1");
        },
        error:function(data){
            alert("获取信息失败!");
        }
    });

}

//地址改变切换方法
function changeAdress(areaId,isCity,asName,beyName){
    var beyNo =  $(beyName).combobox('getValue');
    if(beyNo=='-1'){
        if(isCity){
            var data = [{"areaName":"市","areaId":"-1"}];
            $(asName).combobox('loadData', data);
            $(asName).combobox('select', "-1"); //默认选中全部
        }else{
            var data = [{"areaName":"县","areaId":"-1"}];
            $(asName).combobox('loadData', data);
            $(asName).combobox('select', "-1"); //默认选中全部
        }

    }else{
        $.ajax({
            url : '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo='+areaId,
            data:'parentNo='+areaId,
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                if(isCity){
                    data.splice(0,0,{"areaName":"市","areaId":"-1"});
                    $(asName).combobox('loadData', data);
                    $(asName).combobox('select', data[0].areaId);
                }else{
                    data.splice(0,0,{"areaName":"县","areaId":"-1"});
                    $(asName).combobox('loadData', data);
                    $(asName).combobox('select', data[0].areaId);
                }
            },
            error:function(data){
                alert("获取信息失败!");
            }
        });
    }

}

//地址改变切换方法   ---详情专用----
function changeAdr(areaId,isCity,asName,beyName){
    var beyNo =  $(beyName).combobox('getValue');
    if(beyNo=='-1'){
        if(isCity==0){
            var data = [{"areaName":"市","areaId":"-1"}];
            $(asName).combobox('loadData', data);
            $(asName).combobox('select', "-1"); //默认选中全部
        }else if(isCity==1){
            var data = [{"areaName":"县","areaId":"-1"}];
            $(asName).combobox('loadData', data);
            $(asName).combobox('select', "-1"); //默认选中全部
        }else{
            var data = [{"areaName":"镇","areaId":"-1"}];
            $(asName).combobox('loadData', data);
            $(asName).combobox('select', "-1"); //默认选中全部
        }

    }else{
        $.ajax({
            url : '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo='+areaId,
            data:'parentNo='+areaId,
            type : 'POST',
            dataType : 'json',
            success : function(data) {
                if(isCity==0){
                    data.splice(0,0,{"areaName":"市","areaId":"-1"});
                    $(asName).combobox('loadData', data);
                    $(asName).combobox('select', data[0].areaId);
                }else if(isCity==1){
                    data.splice(0,0,{"areaName":"县","areaId":"-1"});
                    $(asName).combobox('loadData', data);
                    $(asName).combobox('select', data[0].areaId);
                }else{
                    data.splice(0,0,{"areaName":"镇","areaId":"-1"});
                    $(asName).combobox('loadData', data);
                    $(asName).combobox('select', data[0].areaId);
                }
            },
            error:function(data){
                alert("获取信息失败!");
            }
        });
    }
}
function initArea(){
    $.ajax({
        url : '/erp/common/areaCascadeController/getUserArea',
        type : 'POST',
        dataType : 'json',
        success : function(data) {
            if(data.length>0){
                if(data.length>1){
                    data.splice(0,0,{"org_name":"全部","org_no":"-1"});//增加全部选项 #
                }
                $('#area').combobox('loadData', data);
                $('#area').combobox('select', data[0].org_no); //默认选中全部
                //console.log(data);
            }
        },
        error:function(data){
            alert("获取区域信息失败!");
        }
    });
}
function changeAera(areName,distributeName,tmp){
    areaNo =  $(areName).combobox('getValue');
    if(areaNo=='-1'){
        //区域选择的是全部
        var data = [{"distribute_name":"全部","distribute_no":"-1"}];
        $(distributeName).combobox('loadData', data);
        $(distributeName).combobox('select', "-1"); //默认选中全部
        if(tmp==1){
              createTable();
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
//							console.log(data);
                            $(distributeName).combobox('loadData', data);
                            $(distributeName).combobox('select', data[0].distribute_no); //默认选中全部
                            if(tmp==1){

                                createTable();
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
function createTable(){
    ParamUtil.crateParams();
    //创建查询条件page对象
    var page = {
        param:{
            store:{
                storeNo:$('#storeNo').val(),
                storeName:$('#storeName').val(),
                orgNo:$('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue'),//区域no
                distributeNo:$('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue'),//运营中心no
                provinceNo:$('#province').combobox('getValue')=='-1'?"":$('#province').combobox('getValue'),
                cityNo:$('#city').combobox('getValue')=='-1'?"":$('#city').combobox('getValue'),
                countryNo:$('#county').combobox('getValue')=='-1'?"":$('#county').combobox('getValue'),
                websiteNo:$('#websiteNo').val(),
                websiteName:$('#websiteName').val()
            }
        }};
    //console.log(page);
    ParamUtil.addParam('Page',page);
    $('#storeGrid').datagrid({
        url : '/execute/storeService/queryForPageStore.json',
        queryParams: {'params':ParamUtil.getParams()},
        rownumbers:false,
        striped:true,
        columns : [ [
            {
                field : 'ck',
                checkbox: true
            },
            {
                field : 'storeNo',
                title : '编码',
                width : '150',
                align:'center'
            },
            {
                field : 'orgName',
                title : '区域',
                width : '150',
                align:'center'
            },
            {
                field : 'distributeName',
                title : '运营中心',
                width : '150',
                align:'center'
            }, {
                field : 'storeName',
                title : '门店名称',
                width : '150',
                align:'center'
            }, {
                field : 'address',
                title : '详细地址',
                width : '150',
                align:'center'
            }, {
                field : 'telphone',
                title : '电话',
                width : '150',
                align:'center'
            },
            {
                field : 'contact',
                title : '联系人',
                width : '150',
                align:'center'
            },
            {
                field : 'email',
                title : '邮箱',
                width : '150',
                align:'center'
            }
        ] ],
        rowStyler:function(index,row){
            if (row.contact!=null&&row.contact!=''){
                return 'background-color:grey;';
            }
        },
        pagination:true,
        rowStyler:function(index,row){
            if (row.modify==0){
                return "background-color:#666666;";
            }
        } ,
        loader: gridPageLoader
    });
}
/**
 * 点击查询按钮，重新构建列表
 */
function queryForm(){
    createTable();
}
function queryStoreDetail(){

    var checkedItems = $('#storeGrid').datagrid('getChecked');
    if(checkedItems.length>0){
        if(checkedItems.length>1){
            jQuery.messager.alert('提示:','无法多个编辑!','提示');
            return;
        }
        ParamUtil.crateParams();
        var params = {
            storeNo:checkedItems[0].storeNo
        };
        ParamUtil.addParam('Store',params);
        var _currentWebsiteNo;
        var _currentWebsiteName;
        josnRequestResult('/execute/storeService/queryStoreByNo.json',ParamUtil.getParams(),function(data){
            $('#storeNodetail').text(data[0].storeNo!=null?data[0].storeNo:"");
            $('#storeNameDetail').text(data[0].storeName!=null?data[0].storeName:"");
            $('#company').text(data[0].orgName!=null?data[0].orgName:"");
            $('#distribute').text(data[0].distributeName!=null?data[0].distributeName:"");

//            $('#provincedetail').combobox('setValues', data[0].provinceNo!=null?data[0].provinceNo:"");
//            $('#citydetail').combobox('setValues', data[0].cityNo!=null?data[0].cityNo:"");
//            $('#countydetail').combobox('setValues', data[0].countryNo!=null?data[0].countryNo:"");
//            $('#towndetail').combobox('setValues', data[0].townNo!=null?data[0].townNo:"");

            addressDetail(data[0].provinceNo!=null?data[0].provinceNo:"",data[0].cityNo!=null?data[0].cityNo:"",data[0].countryNo!=null?data[0].countryNo:"",data[0].townNo!=null?data[0].townNo:"");

            $('#addressDetail').textbox('setValue',data[0].address!=null?data[0].address:"");
            $('#telDetail').textbox('setValue',data[0].telphone!=null?data[0].telphone:"");
            $('#contator').textbox('setValue',data[0].contact!=null?data[0].contact:"");
            $('#emailDetail').textbox('setValue',data[0].email!=null?data[0].email:"");
            $("#remarkForBind").val(data[0].remark != null ? data[0].remark : "");
            _currentWebsiteNo = data[0].websiteNo != null ? data[0].websiteNo : "";
            _currentWebsiteName = data[0].websiteName != null ? data[0].websiteName : "";
            /*
            $("#websiteNameSearch").autocomplete({
                source: websiteMockData,

            });*/
        } );
        ParamUtil.crateParams();
        var params = {
            orgCode:null
        };
        ParamUtil.addParam('Store',params);

        $.ajax({
            type: "POST",
            contentType : "application/json",
            url: "/execute/storeService/queryWebsiteInfo.json",
            async: false,
            data : JSON.stringify(ParamUtil.getParams()),
            success: function (resp) {
                $("#websiteNameSearch").val("");
                $("#websiteNameSearch").text("");
               if(resp.success) {
                   $('#websiteNameForBind').combobox({
                       data: resp.data.result,
                       valueField:'websiteNo',
                       textField:'websiteName',
                       formatter: function(row){
                           var opts = $(this).combobox('options');
                           return row[opts.textField] + " 网点编码：" + row[opts.valueField];
                       },
                       onSelect: function(record) {
                           $("#websiteNameSearch").val(record.websiteName + " 编码：" + record.websiteNo);
                           $("#websiteNameSearch").text(record.websiteName + " 编码：" + record.websiteNo);
                       }
                   });
                   if(_currentWebsiteNo && _currentWebsiteName) {
                       $("#websiteNameForBind").combobox('select', _currentWebsiteNo);
                   }
                   $('#websiteNameSearch').typeahead({
                       minLength: 2,
                       highlight: true,
                       dynamic: true,
                       delay: 500,
                       display: ["websiteName", "websiteNo"],
                       correlativeTemplate: true,
                       dropdownFilter: [
                           {
                               value: '*',
                               display: 'All Teams'
                           }
                       ],
                       template: '<span>' +
                       '<span class="name">{{websiteName}}</span>' +
                       '<span class="team-logo"> 编码：{{websiteNo}}</span>' +
                       '</span>',
                       source: {
                           data: resp.data.result
                       },
                       callback: {
                           onClick: function (node, a, obj, e) {
                               $('#websiteNameForBind').combobox('clear');
                               if(obj) {
                                   $("#websiteNameForBind").combobox('select', obj.websiteNo);
                               }
                           }
                       }
                   });
               } else {
                   var errorWind=window.open();
                   errorWind.document.write('<div>异常信息：<br>'+result.exceptionMsg+'</div>');
                   errorWind.document.write('<div style="font-size: 14px;color: red">堆栈信息：<PRE>'+result.stackTrace+'</PRE></div>');
               }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var errorWind=window.open();
                errorWind.document.write('<div>异常信息：<br>'+result.exceptionMsg+'</div>');
                errorWind.document.write('<div style="font-size: 14px;color: red">堆栈信息：<PRE>'+result.stackTrace+'</PRE></div>');
            }
        })
    }else{
        jQuery.messager.alert('提示:','选中后方可编辑!','提示');
        return;
    }
    $('#storeDetailsWind').window('open');

}
var isExe=0;
var citys;
function addressDetail(province,city,country,town){
    $.ajax({
        url : '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo',
        type : 'POST',
        dataType : 'json',
        data:{parentNo:0},
        async: false,
        success : function(data) {
            $('#citydetail').combobox('clear');
            $('#countydetail').combobox('clear');
            $('#towndetail').combobox('clear');
            $('#provincedetail').combobox('clear');
            $('#provincedetail').combobox({
                editable:false,
                onSelect:function(record){
                    $('#citydetail').combobox('clear');
                    $('#countydetail').combobox('clear');
                    $('#towndetail').combobox('clear');
                    if(record!=null&&record!=undefined){
                        cityMethod(record.areaId,city,country,town);
                    }else{
                        cityMethod("-1","-1","-1","-1");
                    }
                }
            });
            data.splice(0,0,{"areaName":"省","areaId":"-1"});//增加全部选项 #
            $('#provincedetail').combobox('loadData', data);
            if(province!=null && province!=''){
                $('#provincedetail').combobox('select', province); //默认选中全部
            }else{
                $('#provincedetail').combobox('select', data[0].areaId); //默认选中全部
            }
            if(city!=null && city!=''){
                $('#citydetail').combobox('select', city); //默认选中全部
            }else{
                $('#citydetail').combobox('select', "-1"); //默认选中全部
            }
            if(country!=null && country!=''){
                $('#countydetail').combobox('select', country); //默认选中全部
            }else{
                $('#countydetail').combobox('select', "-1"); //默认选中全部
            }
            if(town!=null && town!=''){
                $('#towndetail').combobox('select', town); //默认选中全部
            }else{
                $('#towndetail').combobox('select', "-1"); //默认选中全部
            }
        },
        error:function(data){
            alert("获取信息失败!");
        }
    });
}
function cityMethod(provinceId,cityId,countryid,townid) {
    $('#citydetail').combobox({
        editable:false,
        onSelect:function(record){
            $('#countydetail').combobox('clear');
            $('#towndetail').combobox('clear');
            if(record!=null&&record!=undefined){
                countryMethod(record.areaId,countryid,townid);
            }else{
                countryMethod("-1","-1","-1");
            }
        }
    });
    if(provinceId!="-1"){
        $.ajax({
            url : '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo='+provinceId,
            type : 'POST',
            dataType : 'json',
            async: false,
            success : function(data) {
                $('#citydetail').combobox('clear');
                $('#countydetail').combobox('clear');
                $('#towndetail').combobox('clear');
                data.splice(0,0,{"areaName":"市","areaId":"-1"});
                $('#citydetail').combobox('loadData', data);
                $('#citydetail').combobox('select', "-1");
            },
            error:function(data){
                alert("获取信息失败!");
            }
        });
    }else{
        $('#citydetail').combobox('clear');
        $('#countydetail').combobox('clear');
        $('#towndetail').combobox('clear');
        var data=[];
        data.splice(0,0,{"areaName":"市","areaId":"-1"});
        $('#citydetail').combobox('loadData', data);
        $('#citydetail').combobox('select', "-1");
    }


}
function countryMethod(cityId,countryid,townid) {
    $('#countydetail').combobox({
        editable:false,
        onSelect:function(record){
            $('#towndetail').combobox('clear');
            if(record!=null&&record!=undefined) {
                townMethod(record.areaId, townid);
            }else{
                townMethod("-1", "-1");
            }
        }
    });
    if(cityId!="-1"){
        $.ajax({
            url : '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo='+cityId,
            type : 'POST',
            dataType : 'json',
            async: false,
            success : function(data) {
                $('#countydetail').combobox('clear');
                $('#towndetail').combobox('clear');
                data.splice(0,0,{"areaName":"县","areaId":"-1"});
                $('#countydetail').combobox('loadData', data);
                $('#countydetail').combobox('select', "-1");
//                if(countryid!=null && countryid!=''){
//                    $('#countydetail').combobox('select', countryid); //默认选中全部
//                }else{
//                    $('#countydetail').combobox('select', "-1"); //默认选中全部
//                }
            },
            error:function(data){
                alert("获取信息失败!");
            }
        });
    }else{
        $('#countydetail').combobox('clear');
        $('#towndetail').combobox('clear');
        var data=[];
        data.splice(0,0,{"areaName":"县","areaId":"-1"});
        $('#countydetail').combobox('loadData', data);
        $('#countydetail').combobox('select', "-1");
    }

}

function townMethod(countryid,townid) {
    $('#towndetail').combobox({
        editable:false,
        onSelect:function(record){
        }
    });
    if(countryid!="-1"){
        $.ajax({
            url : '/erp/common/fourGradeAddressController/getFourGradeAddressByParentNo?parentNo='+countryid,
            type : 'POST',
            dataType : 'json',
            async: false,
            success : function(data) {
                $('#towndetail').combobox('clear');
                data.splice(0,0,{"areaName":"镇","areaId":"-1"});
                $('#towndetail').combobox('loadData', data);
                $('#towndetail').combobox('select', "-1");
//                if(cityId!=null && cityId!=''){
//                    $('#citydetail').combobox('select', cityId); //默认选中全部
//                }else{
//                    $('#citydetail').combobox('select', "-1"); //默认选中全部
//                }
            },
            error:function(data){
                alert("获取信息失败!");
            }
        });
    }else{
        $('#towndetail').combobox('clear');
        var data=[];
        data.splice(0,0,{"areaName":"镇","areaId":"-1"});
        $('#towndetail').combobox('loadData', data);
        $('#towndetail').combobox('select', "-1");
    }


}
function deleteStores(){
    var ids = [];
    var checkedItems = $('#storeGrid').datagrid('getChecked');
    if(checkedItems.length>0){
        $.each(checkedItems, function(index, item){
            ids.push(item.id);
        });
    }else{
        jQuery.messager.alert('提示:','选中后才可删除!','提示');
        return;
    }
    ParamUtil.crateParams();
    ParamUtil.addParam('List<Long>',ids);
    josnRequest('/execute/storeService/getIsDeleteCount.json',ParamUtil.getParams(),function(data){

        if(data>0){
            jQuery.messager.alert('提示:','所选门店中包含巡店计划中门店，类似门店不可删除，请重新选择!','提示');
            return;
        }
        else{
            $.messager.confirm("确认", "你确认删除？", function (r)
                {
                    if(r){
                        josnRequest('/execute/storeService/deleteStore.json',ParamUtil.getParams(),function(data){
                            createTable();
                        } );
                    }else{
                        return;
                    }

                }
            ) ;

        }
    } );
}

function updateDetail(){
    ParamUtil.crateParams();
    var province=$('#provincedetail').combobox('getValue');
    var city=$('#citydetail').combobox('getValue');
    var country=$('#countydetail').combobox('getValue');
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    var tel=$('#telDetail').val();
    if(province=="-1"||city=="-1"||country=="-1"){
        $.messager.alert("错误","省市县级必须选择其中一项",'error');
        return;
    }
    if(!$("#addressDetail").textbox('isValid')){
        $.messager.alert("错误","详细地址必须填写",'error');
        return;
    }
    if(!$("#telDetail").textbox('isValid')){
        //
        $.messager.alert("错误","电话必须填写",'error');
        return;
    }
    if(reg.test(tel)){
        $.messager.alert("错误","电话请勿填写中文",'error');
        return;
    }
    if(!$("#emailDetail").textbox('isValid')){
        $.messager.alert("错误","请正确填写邮件格式",'error');
        return;
    }
    var params = {
        storeNo:$('#storeNodetail').text(),
        provinceNo:$('#provincedetail').combobox('getValue'),
        provinceName:$('#provincedetail').combobox('getText'),
        cityNo:$('#citydetail').combobox('getValue'),
        cityName:$('#citydetail').combobox('getText'),
        countryNo:$('#countydetail').combobox('getValue'),
        countryName:$('#countydetail').combobox('getText'),
        townNo:$('#towndetail').combobox('getValue'),
        townName:$('#towndetail').combobox('getText'),
        address:$('#addressDetail').val(),
        telphone:$('#telDetail').val(),
        contact:$('#contator').val(),
        email:$('#emailDetail').val(),
        remark:$("#remarkForBind").val(),
        websiteNo: $("#websiteNameForBind").combobox("getValue"),
        websiteName:$("#websiteNameForBind").combobox("getText")
    };
    ParamUtil.addParam('Store',params);
    josnRequest('/execute/storeService/updateStoreObject.json',ParamUtil.getParams(),function(data){
        if(data>0){
            jQuery.messager.alert('提示:','保存成功!','提示');
            window.location.reload();
        }else{
            jQuery.messager.alert('提示:','保存失败!','提示');
            return;
        }
    } );
}








