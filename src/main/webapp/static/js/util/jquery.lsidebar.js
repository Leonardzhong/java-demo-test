
(function ($) {
    //动态菜单
    $.fn.lsidebar = function (options) {
        var setting = {
            async: {
                url: "/erp/basicManageController/getMenu"
            },
            callback:{
                onclick:null
            }
        }
        var _setting = $.extend(setting, options);
        return new Lsidebar().init(_setting);
        function Lsidebar() {
            return {
                init: function (config) {
                    this.setting = _setting;
                    this.id = this.setting.id;
                    this.menu={};
                    return this;

                },
                refresh: function (resourceCode) {
                    //alert(this.id + " " + resourceCode);
                    var me = this;
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: me.setting.async.url,
                        data: "resourceCode=" + resourceCode,
                        success: function (node) {
                            if (node == null) {
                                node = {};
                            }
                            me.draw(node);
                            this.node=node;
                        }
                    });
                },
                _getIdByNode:function(node){
                    var id=$(node).attr("id").split("@")[1];
                    return id;
                },
                _showChild:function(node){
                    var id=this._getIdByNode(node);
                    if(this.menu[id].fold == true){
                        if(this.menu[id].hasChild == true){
                            this.menu[id].fold=false;
                            $("li[parentCode='"+id+"']").show();
                        }
                    }else{
                        if(this.menu[id].hasChild == true){
                            this.menu[id].fold=true;
                            $("li[parentCode='"+id+"']").hide();
                        }
                    }

                },
                draw: function (node) {

                    var me=this;
                    var list = node.child;
                    //$("#" + this.id).empty();
                    if (list == null) {
                        return;
                    }
                    var html="";
                    for (var i = 0; i <list.length  ; i++) {
                       if(list[i].hasChild == true || ( list[i].parentCode ==  node.resourceCode && list[i].hasChild == false)){
                           list[i].fold=true
                           html +='<li isMenu="1" hasChild="1" id="m@'+list[i].resourceCode+'" parentCode="'+list[i].parentCode+'"><a  href="javascript:void(0)"   >'+list[i].resourceName+'</a></li>'
                       }else{
                           html +='<li isMenu="1"   hasChild="0" id="m@'+list[i].resourceCode+'" parentCode="'+list[i].parentCode+'" ><a  href="javascript:void(0)"   ><b></b>'+list[i].resourceName+'</a></li>'
                       }
                        this.menu[list[i].resourceCode]=list[i];
                    }
                    $("#" + this.id).html(html);
                    $('li[hasChild="0"]').hide();
                    $('li[isMenu="1"]').click(function(){
                          me._showChild(this);
                          var id=me._getIdByNode(this);
                          if(me.menu[id].hasChild == false ){
                              if($.type(me.setting.callback.onclick) == 'function'){
                                  me.setting.callback.onclick($.extend({},me.menu[id],true));
                              }
                          }

                    });
                }
            }
        }
    }

})(jQuery);