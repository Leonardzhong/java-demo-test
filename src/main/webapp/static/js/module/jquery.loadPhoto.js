/**
 * @author zhangzhiguo
 * @date 2016年7月5日
 */
$(function () {

});
(function ($) {
    //显视产品
    $.fn.loadPhoto = function (options) {
        var setting = {
            //每个图片的宽度
            itemWidth: 150,
            //每个图片的高度
            itemHeight: 150,
            /**
             * 对应的门店的ID
             */
            parentId: null,
            //加载图片的URL
            url: "/execute/albumPhotoService/queryForPagePhoto",
            //当前第几页
            pageNumber: 1,
            //每面几条
            pageSize: 10,
            params:{},
            callback: {
                //点击时回调方法
                onclick: null
            }
        }
        var _setting = $.extend(setting, options);
        _setting.id = $(this).attr("id");
        return new LoadPhoto().init(_setting);

        function LoadPhoto() {
            var userNo = $('#loginUser').val();
            $.ajax({
                url: '/getPhotoPermission',
                type: 'POST',
                data : {
                    "erp" : $('#loginUser').val()
                },
                dataType: 'json',
                success: function (data) {
                    //alert("当前用户："+userNo+"===导入图片权限："+data.result.hasUploadRight+"===删除图片权限："+data.result.hasDeleteRight);

                    if(!(data.result.hasUploadRight)){
                        $("#upPhoto").hide();
                    }else if(data.result.hasUploadRight){
                        $("#upPhoto").show();
                    }

                    if(!(data.result.hasDeleteRight)){
                        $("#delete").hide();
                    }else if(data.result.hasDeleteRight){
                        $("#delete").show();
                    }
                },
                error: function (data) {
                    alert("获取相片类型信息失败!");
                }
            });

            return {
                init: function (config) {
                    this.setting = config;
                    this.id = this.setting.id;
                    $("#" + this.id).html("");

                    this.setting.width=  $("#" + this.id).parent().width();
                    this.setting.height=  $("#" + this.id).parent().height();
                    //计算 pageSize
                    /**
                     * 计算方法
                     * 计算一排能放几个
                     * 计算一共有多少行。
                     *
                     */
                    var csize=  Math.floor(this.setting.width /( this.setting.itemWidth+40));
                    var rsize=  Math.ceil(this.setting.height / ( this.setting.itemHeight +30));
                    this.setting.pageSize=csize * rsize;

                    this.bindEvent();
                    this.getData();
                    return this;

                },
                bindEvent:function(){
                    var me=this;
                    $( $("#" + this.id).parent()).scroll(function(){
                        var $this =$(this),
                            viewH =$(this).height(),//可见高度
                            contentH =$(this).get(0).scrollHeight,//内容高度
                            scrollTop =$(this).scrollTop();//滚动高度
                        if(contentH - viewH - scrollTop <= (me.setting.itemHeight +30)) { //到达底部100px时,加载新内容
                       // if(scrollTop/(contentH -viewH)>=0.95){ //到达底部100px时,加载新内容
                            // 这里加载数据..
                            $( $("#" + me.id).parent()).unbind("scroll")

                            me.setting.pageNumber++;
                            me.getData(function(data){
                                //如果没有数据了。就不要再邦定了

                                if( data == null ||  data.data == null  ||  data.data.length < me.setting.pageSize){

                                }else{
                                me.bindEvent();
                                }
                            } );

                        }
                    });
                },
                reDraw:function(data){

                    $("#" + this.id).html("");
                    this.setting.pageNumber=1;
                    data=data ||{};
                    $.extend( this.setting.params,data);
                    this.getData();
                },
                getData: function (fn) {
                    var me = this;
                    var param= {
                        photo: {
                            album: {id: this.setting.parentId}
                        }
                    }
                    param= $.extend(param,this.setting.params);
                        ;
                    var page = {
                        param:param
                        , skip: (this.setting.pageNumber - 1) * this.setting.pageSize
                        , size: this.setting.pageSize
                    };
                    var o = {};
                    o['typeAliase'] = "Page";
                    o['value'] = page;
                    jQuery.ajax({
                            type: "POST",
                            url: this.setting.url,
                            contentType: "application/json",
                            dataType: "json",
                            data: JSON.stringify([o]),
                            success: function (resp) {
                                var data = resp.data;
                                if(data != null){
                                for (i = 0; i < data.data.length; i++) {
                                    var o = data.data[i];
                                    me.draw(o);
                                }}
                                if ($.type(fn) == 'function')
                                    fn.apply(me, [data]);
                            }
                        }
                    );

                },
                _getConfig: function (data) {
                    return {
                        itemWidth: this.setting.itemWidth,
                        itemHeight: this.setting.itemHeight,
                        imgid: 't_img_' + this.id,
                        albumid: 't_u_' + this.id,
                        src: data.url,
                        name:data.name,
                        id:data.id,
                        aid: 't_u_' + this.id
                    }

                },
                refresh: function () {

                },
                draw: function (data) {
                    var config = this._getConfig(data);
                    config = $.extend(config, data);
                    var render = template.compile(_jquery_loadPhoto_html);
                    var html = render(config);
                    $("#" + this.id).append($(html))
                }
            }
        }
    }

})(jQuery);

