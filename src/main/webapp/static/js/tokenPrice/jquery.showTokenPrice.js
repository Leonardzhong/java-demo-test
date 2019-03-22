/**
 * @author zhangzhiguo
 * @date 2016年5月5日
 */
(function ($) {
    //显视产品
    $.fn.tokenPrice = function (options) {
        var setting = {
            /**
             * 令牌商品的ID
             */
            tokenPriceId:null,
            /**
             * 是否自动画
             */
            autoDraw: true,
            /**
             *令牌商品的数据。如果没有。就从后台得到
             */
            data: null,
            callback: {
                //点击时回调方法
                onclick: null
            }
        }
        var _setting = $.extend(setting, options);
        _setting.id=$(this).attr("id");
        return new TokenPrice().init(_setting);
        function TokenPrice() {
            return {
                init: function (config) {

                    this.setting = config;
                    this.id = this.setting.id;
                    //如果自动画，如果没有数据就从后台得到，如果有数据就用传来的数据
                    if (this.setting.autoDraw) {
                        if (this.setting.data == null) {
                            this.getData(this.draw);
                        } else {
                            this.draw(this.setting.data);
                        }
                    }
                    this.setting.tokenPriceId = this.setting.tokenPriceId || (this.setting.data ==null?'':this.setting.data.id);
                    return this;

                },
                getData: function (fn) {
                    var me = this;
                    jQuery.ajax({
                        type: "POST",
                        url: "/erp/getTokenPriceById",
                        dataType: "json",
                        data: {id: (this.setting.tokenPriceId || this.setting.data.id)},
                        success: function (resp) {
                            var data = resp.data;
                            me.setting.data = data;
                            me.setting.tokenPriceId = data.id;
                            if ($.type(fn) == 'function') {
                                fn.apply(me,[data]);
                            }
                        }
                    });

                },
                _getConfig:function(){
                    return {
                        ulid:'t_u_'+this.id,
                        imgid:'t_img_'+this.id,
                        imgUrl:'t_u_'+this.id,
                        ulid:'t_u_'+this.id,
                        ulid:'t_u_'+this.id,
                        ulid:'t_u_'+this.id
                    }

                },
                refresh: function () {

                },
                draw: function (data) {
                    var config=this._getConfig();
                    config= $.extend(config,data);
                    config.jdprice == null?'暂无定价': config.jdprice;
                    config.jdprice == null?'暂无定价': config.jdprice;
                    var render = template.compile(_jquery_showTokenPrice_);
                    var html = render(config);
                    $("#" + this.id).addClass("plr-goods-ad-1-4").html(html)


                }
            }
        }
    }

})(jQuery);

