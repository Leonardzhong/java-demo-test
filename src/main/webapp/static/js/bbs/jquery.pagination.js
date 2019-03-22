/**
 * @author zhangzhiguo
 * @date 2016年4月12日
 */
(function ($) {
    //动态菜单
    $.fn.pagination = function (options) {
        var setting = {
            //当前是第几页
            currentPage: 1,
            //每页多少条
            pagesize: 10,
            //一共多少条
            count: 0,
            //当前页的前后差
            pagePos: 2,
            callback: {
                onclick: null
            }
        }
        var _setting = $.extend(setting, options);
        _setting.pagesize= parseInt( _setting.pagesize)
        _setting.currentPage= parseInt( _setting.currentPage)
        _setting.count= parseInt( _setting.count)
        _setting.id = $(this).attr("id");
        return new Pagination().init(_setting);
        function Pagination() {
            return {
                init: function (config) {
                    this.setting = _setting;
                    this.id = this.setting.id;
                    //计算一共有多少页
                    this.setting.page = Math.ceil(this.setting.count / this.setting.pagesize);

                    this.draw();
                    this.bind();
                    return this;

                },
                refresh: function () {


                },
                _getConfig: function () {
                    var config = {
                        "totalDiv": "_totalDiv_" + this.id,
                        currentPageNumber: this.setting.currentPage,
                        currentPage: "_currentPage_" + this.id,
                        jumpPage: "_jumpPage_" + this.id,
                        count: this.setting.count,
                        totalPageNumber: this.setting.page,
                        preBtn: "_preBtn_" + this.id,
                        lasBtn: "_lasBtn_" + this.id

                    }
                    //根据当前面，与前后前计算前后
                    var u = [];
                    var start = this.setting.currentPage - this.setting.pagePos;
                    if (start <= 0) {
                        start = 1;
                    }
                    for (var i = start; i < this.setting.currentPage; i++) {
                        u.push(i)
                    }
                    config.u=u;
                    ;
                    var end = this.setting.currentPage + this.setting.pagePos;
                    if (end >= this.setting.page) {
                        end = this.setting.page;
                    }
                    var d = [];
                    for (var i = this.setting.currentPage + 1  ; i <= end; i++) {
                        d.push(i)
                    }

                    config.d=d;
                    //  #end ##显示后面的省略号
                    if ((this.setting.page - this.setting.currentPage ) > this.setting.pagePos + 1) {
                        config.last=true;
                    }else{
                        config.last=false;
                    }
                    //#end ##显示前面的省略
                    if(this.setting.currentPage > this.setting.pagePos + 2 ){
                        config.front=true;
                    }else{
                        config.front=false;
                    }
                    //是否显视上一页
                    if(this.setting.currentPage >=  2 ){
                        config.showPreBtn=true;
                    }else{
                        config.showPreBtn=false;
                    }
                    //是否显视下一面
                    if(this.setting.currentPage <   this.setting.page ){
                        config.showLasBtn=true;
                    }else{
                        config.showLasBtn=false;
                    }
                    //计算是否显视第一页和最后一页。
                    //如果当前页大于3就要显视第一页
                    if(this.setting.currentPage > 3){
                        config.firstPage=true;
                    }else{
                        config.firstPage=false;
                    }

                   // 如果当前页与最后一页的差大于2就要显视最后一页
                    if(this.setting.currentPage + 2 < this.setting.page){
                        config.lastPage=true;
                    }else{
                        config.lastPage=false;
                    }

                    return config;
                },
                bind: function () {
                    var config = this._getConfig();
                    var me = this;
                    //加上数据校验
                    $("#" + config.currentPage).bind("blur", function () {
                        try {
                            if (isNaN($(this).val())) {
                                $(this).val("1")
                            }
                        } catch (e) {
                            $(this).val("1")
                        }

                        return false;
                    })

                    $("#" + config.preBtn).bind("click", function () {
                        me.setting.callback.onclick(me.setting.currentPage -1)
                    })

                    $("#" + config.lasBtn).bind("click", function () {
                        me.setting.callback.onclick(me.setting.currentPage +1)
                    })

                    $('a[flag="page"]').bind("click", function () {
                        var currentPage = $(this).html();
                        me.setting.callback.onclick(currentPage)
                    })
                    $("#" + config.jumpPage).bind("click", function () {
                        var currentPage = $("#" + config.currentPage).val();
                        if (currentPage > me.setting.page) {
                            alert("不能大于" + me.setting.page + "页数");
                            return;
                        }
                        me.setting.callback.onclick(currentPage)
                    })
                },
                draw: function () {
                    var config = this._getConfig();
                    ;
                    var render = template.compile(_pagination_);
                    var html = render(config);

                    $("#" + this.setting.id).html(html)


                }

            }
        }
    }

})(jQuery);