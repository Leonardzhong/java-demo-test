/**
 * Created with IntelliJ IDEA.
 * User: yanbingxin
 * Date: 2015/8/24
 * Time: 14:23
 */
$(document).ready(function(){
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
    //createTreeGrid();

});
function createTreeGrid(){
    ParamUtil.crateParams();
    var params = {
        orgNo:$('#area').combobox('getValue')=='-1'?"":$('#area').combobox('getValue'),
        distributeNo:$('#operateCenter').combobox('getValue')=='-1'?"":$('#operateCenter').combobox('getValue'),
        storeNo:$('#storeNo').val(),
        storeName:$('#storeName').val(),
        erp:$('#erp').val(),
        touTime:$('#beginTime').datebox('getValue')
    };
    ParamUtil.addParam('Performance',params);
//    $('#resulttreegrid').treegrid({
//        url:"/execute/performanceService/queryPerformance.json",
//        queryParams: {'params':ParamUtil.getParams()},
//        idField:'id',
//        treeField:'showName',
//        columns:[[
//            {field:'showName',title:'机构',width:250},
//            {field:'orgName',title:'分公司',width:100},
//            {field:'distributeName',title:'运营中心',width:100},
//            {field:'storeNo',title:'京东帮服务店编码',width:100},
//            {field:'storeName',title:'京东帮门店',width:100},
//            {field:'todayNum',title:'本日单量',width:100},
//            {field:'yestodayNum',title:'昨日单量',width:100},
//            {field:'weekNum',title:'本周累积单量',width:100},
//            {field:'lastWeekNum',title:'上周累积单量',width:100},
//            {field:'weekAvg',title:'本周日均单量',width:100},
//            {field:'lastWeekAvg',title:'上周日均单量',width:100},
//        ]],
//        loader :treegridLoader
//    });
    josnRequestResult('/execute/performanceService/queryPerformanceNew.json',ParamUtil.getParams(),function(data){
          var tree = mini.get("resultGrid");
          tree.setData(data);
      } );

}
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
           // createTreeGrid();
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

                              //  createTreeGrid();
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
function queryForm(){
    createTreeGrid();
}
