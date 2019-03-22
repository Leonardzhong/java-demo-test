/*
 * Flexigrid for jQuery -  v1.1
 *
 * Copyright (c) 2008 Paulo P. Marinas (code.google.com/p/flexigrid/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */
(function ($) {
	/*
	 * jQuery 1.9 support. browser object has been removed in 1.9 
	 */
	var browser = $.browser
	
	if (!browser) {
		function uaMatch( ua ) {
			ua = ua.toLowerCase();

			var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
				/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
				/(msie) ([\w.]+)/.exec( ua ) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
				[];

			return {
				browser: match[ 1 ] || "",
				version: match[ 2 ] || "0"
			};
		};

		var matched = uaMatch( navigator.userAgent );
		browser = {};

		if ( matched.browser ) {
			browser[ matched.browser ] = true;
			browser.version = matched.version;
		}

		// Chrome is Webkit, but Webkit is also Safari.
		if ( browser.chrome ) {
			browser.webkit = true;
		} else if ( browser.webkit ) {
			browser.safari = true;
		}
	}
	
    /*!
     * START code from jQuery UI
     *
     * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
     * Dual licensed under the MIT or GPL Version 2 licenses.
     * http://jquery.org/license
     *
     * http://docs.jquery.com/UI
     */
     
    if(typeof $.support.selectstart != 'function') {
        $.support.selectstart = "onselectstart" in document.createElement("div");
    }
    
    if(typeof $.fn.disableSelection != 'function') {
        $.fn.disableSelection = function() {
            return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
                ".ui-disableSelection", function( event ) {
                event.preventDefault();
            });
        };
    }
    
    /* END code from jQuery UI */
    
	$.addFlex = function (t, p) {
		if (t.grid) return false; //return if already exist
		p = $.extend({ //apply default properties
			height: 200, //default height
			width: 'auto', //auto width
			striped: true, //apply odd even stripes
			novstripe: false,
			minwidth: 30, //min width of columns
			minheight: 80, //min height of columns
			resizable: true, //allow table resizing
			url: false, //URL if using data from AJAX
			method: 'POST', //data sending method
			dataType: 'xml', //type of data for AJAX, either xml or json
			errormsg: 'Connection Error',
			usepager: false,
			nowrap: true,
			page: 1, //current page
			total: 1, //total pages
			useRp: true, //use the results per page select box
			rp: 15, //results per page
			rpOptions: [10, 15, 20, 30, 50,100], //allowed per-page values
			title: false,
			idProperty: 'id',
			textProperty: 'text',
			pagestat: '当前显示从{from}到{to}条记录，共 {total}条记录',
			pagetext: 'Page',
			outof: 'of',
			findtext: 'Find',
			params: [], //allow optional parameters to be passed around
			procmsg: '处理中，请稍候 ...',
			query: '',
			qtype: '',
			nomsg: '没有符合要求的记录',
			minColToggle: 1, //minimum allowed column to be hidden
			showToggleBtn: true, //show or hide column toggle popup
			hideOnSubmit: true,
			autoload: true,
			blockOpacity: 0.5,
			preProcess: false,
			addTitleToCell: false, // add a title attr to cells with truncated contents
			dblClickResize: false, //auto resize column by double clicking
			onDragCol: false,
			onToggleCol: false,
			onChangeSort: false,
			onDoubleClick: false,
			onSuccess: false,
			onError: false,
			onSubmit: false, //using a custom populate function
			checkbox:false,
            __mw: { //extendable middleware function holding object
                datacol: function(p, col, val) { //middleware for formatting data columns
                    var _col = (typeof p.datacol[col] == 'function') ? p.datacol[col](val) : val; //format column using function
                    if(typeof p.datacol['*'] == 'function') { //if wildcard function exists
                        return p.datacol['*'](_col); //run wildcard function
                    } else {
                        return _col; //return column without wildcard
                    }
                }
            },
            selectCallBack:function(arrs,isSelectFlag,idSingle){
            },
            loadCompleteCallBack:function(){
            	
            },
            getGridClass: function(g) { //get the grid class, always returns g
                return g;
            },
            datacol: {}, //datacol middleware object 'colkey': function(colval) {}
            colResize: true, //from: http://stackoverflow.com/a/10615589
            colMove: true,
            statistics: false //是否统计
		}, p);
		$(t).show() //show if hidden
			.attr({
				cellPadding: 0,
				cellSpacing: 0,
				border: 0
			}) //remove padding and spacing
			.removeAttr('width'); //remove width properties
		//create grid class
		var g = {
			hset: {},
			rePosDrag: function () {
				var cdleft = 0 - this.hDiv.scrollLeft;
				if (this.hDiv.scrollLeft > 0) cdleft -= Math.floor(p.cgwidth / 2);
				$(g.cDrag).css({
					top: g.hDiv.offsetTop + 1
				});
				var cdpad = this.cdpad;
				var cdcounter=0;
				$('div', g.cDrag).hide();
				$('thead tr:first th:visible', this.hDiv).each(function () {
					var n = $('thead tr:first th:visible', g.hDiv).index(this);
					var cdpos = parseInt($('div', this).width());
					if (cdleft == 0) cdleft -= Math.floor(p.cgwidth / 2);
					cdpos = cdpos + cdleft + cdpad;
					if (isNaN(cdpos)) {
						cdpos = 0;
					}
					$('div:eq(' + n + ')', g.cDrag).css({
						'left': (!(browser.mozilla) ? cdpos - cdcounter : cdpos) + 'px'
					}).show();
					//��Ӷ�ѡ�� [�޸ĺ���� ʱ�䣺2011-04-08]------------��ʼ----------��1��----- flexigrid.js 83��
                    if (p.checkbox) {
                    	$('div:eq('+n+')',g.cDrag).css({'left':(!(browser.mozilla) ? cdpos - cdcounter+26 : cdpos+26)+'px'}).show();
                    }
/*			        else{
			            $('div:eq('+n+')',g.cDrag).css({'left':cdpos+'px'}).show();
			        }*/
                    //��Ӷ�ѡ�� [�޸ĺ���� ʱ�䣺2011-04-08]------------����----------��1��-----
					cdleft = cdpos;
					cdcounter++;
				});
			},
			fixHeight: function (newH) {
				newH = false;
				if (!newH) newH = $(g.bDiv).height();
				var hdHeight = $(this.hDiv).height();
				$('div', this.cDrag).each(
					function () {
						$(this).height(newH + hdHeight);
					}
				);
				var nd = parseInt($(g.nDiv).height(), 10);
				if (nd > newH) $(g.nDiv).height(newH).width(200);
				else $(g.nDiv).height('auto').width('auto');
				$(g.block).css({
					height: newH,
					marginBottom: (newH * -1)
				});
				var hrH = g.bDiv.offsetTop + newH;
				if (p.height != 'auto' && p.resizable) hrH = g.vDiv.offsetTop;
				$(g.rDiv).css({
					height: hrH
				});
			},
			dragStart: function (dragtype, e, obj) { //default drag function start
                if (dragtype == 'colresize' && p.colResize === true) {//column resize
					$(g.nDiv).hide();
					$(g.nBtn).hide();
					var n = $('div', this.cDrag).index(obj);
					var ow = $('th:visible div:eq(' + n + ')', this.hDiv).width();
					$(obj).addClass('dragging').siblings().hide();
					$(obj).prev().addClass('dragging').show();
					this.colresize = {
						startX: e.pageX,
						ol: parseInt(obj.style.left, 10),
						ow: ow,
						n: n
					};
					$('body').css('cursor', 'col-resize');
				} else if (dragtype == 'vresize') {//table resize
					var hgo = false;
					$('body').css('cursor', 'row-resize');
					if (obj) {
						hgo = true;
						$('body').css('cursor', 'col-resize');
					}
					this.vresize = {
						h: p.height,
						sy: e.pageY,
						w: p.width,
						sx: e.pageX,
						hgo: hgo
					};
				} else if (dragtype == 'colMove') {//column header drag
                    $(e.target).disableSelection(); //disable selecting the column header
                    if((p.colMove === true)) {
                        $(g.nDiv).hide();
                        $(g.nBtn).hide();
                        this.hset = $(this.hDiv).offset();
                        this.hset.right = this.hset.left + $('table', this.hDiv).width();
                        this.hset.bottom = this.hset.top + $('table', this.hDiv).height();
                        this.dcol = obj;
                        this.dcoln = $('th', this.hDiv).index(obj);
                        this.colCopy = document.createElement("div");
                        this.colCopy.className = "colCopy";
                        this.colCopy.innerHTML = obj.innerHTML;
                        if (browser.msie) {
                            this.colCopy.className = "colCopy ie";
                        }
                        $(this.colCopy).css({
                            position: 'absolute',
                            'float': 'left',
                            display: 'none',
                            textAlign: obj.align
                        });
                        $('body').append(this.colCopy);
                        $(this.cDrag).hide();
                    }
				}
				$('body').noSelect();
			},
			dragMove: function (e) {
				if (this.colresize) {//column resize
					var n = this.colresize.n;
					var diff = e.pageX - this.colresize.startX;
					var nleft = this.colresize.ol + diff;
					var nw = this.colresize.ow + diff;
					if (nw > p.minwidth) {
						$('div:eq(' + n + ')', this.cDrag).css('left', nleft);
						this.colresize.nw = nw;
					}
				} else if (this.vresize) {//table resize
					var v = this.vresize;
					var y = e.pageY;
					var diff = y - v.sy;
					if (!p.defwidth) p.defwidth = p.width;
					if (p.width != 'auto' && !p.nohresize && v.hgo) {
						var x = e.pageX;
						var xdiff = x - v.sx;
						var newW = v.w + xdiff;
						if (newW > p.defwidth) {
							this.gDiv.style.width = newW + 'px';
							p.width = newW;
						}
					}
					var newH = v.h + diff;
					if ((newH > p.minheight || p.height < p.minheight) && !v.hgo) {
						this.bDiv.style.height = newH + 'px';
						p.height = newH;
						this.fixHeight(newH);
					}
					v = null;
				} else if (this.colCopy) {
					$(this.dcol).addClass('thMove').removeClass('thOver');
					if (e.pageX > this.hset.right || e.pageX < this.hset.left || e.pageY > this.hset.bottom || e.pageY < this.hset.top) {
						//this.dragEnd();
						$('body').css('cursor', 'move');
					} else {
						$('body').css('cursor', 'pointer');
					}
					$(this.colCopy).css({
						top: e.pageY + 10,
						left: e.pageX + 20,
						display: 'block'
					});
				}
			},
			dragEnd: function () {
				if (this.colresize) {
					var n = this.colresize.n;
					var nw = this.colresize.nw;
					$('th:visible div:eq(' + n + ')', this.hDiv).css('width', nw);
					$('tr', this.bDiv).each(
						function () {
							var $tdDiv = $('td:visible div:eq(' + n + ')', this);
							$tdDiv.css('width', nw);
							g.addTitleToCell($tdDiv);
						}
					);
					this.hDiv.scrollLeft = this.bDiv.scrollLeft;
					$('div:eq(' + n + ')', this.cDrag).siblings().show();
					$('.dragging', this.cDrag).removeClass('dragging');
					this.rePosDrag();
					this.fixHeight();
					this.colresize = false;
					if ($.cookies) {
						var name = p.colModel[n].name;		// Store the widths in the cookies
						$.cookie('flexiwidths/'+name, nw);
					}
				} else if (this.vresize) {
					this.vresize = false;
				} else if (this.colCopy) {
					$(this.colCopy).remove();
					if (this.dcolt !== null) {
						if (this.dcoln > this.dcolt) $('th:eq(' + this.dcolt + ')', this.hDiv).before(this.dcol);
						else $('th:eq(' + this.dcolt + ')', this.hDiv).after(this.dcol);
						this.switchCol(this.dcoln, this.dcolt);
						$(this.cdropleft).remove();
						$(this.cdropright).remove();
						this.rePosDrag();
						if (p.onDragCol) {
							p.onDragCol(this.dcoln, this.dcolt);
						}
					}
					this.dcol = null;
					this.hset = null;
					this.dcoln = null;
					this.dcolt = null;
					this.colCopy = null;
					$('.thMove', this.hDiv).removeClass('thMove');
					$(this.cDrag).show();
				}
				$('body').css('cursor', 'default');
				$('body').noSelect(false);
			},
			toggleCol: function (cid, visible) {
				var ncol = $("th[axis='" + cid + "']", this.hDiv)[0];
				var n = $('thead th', g.hDiv).index(ncol);
				var cb = $('input[value=' + cid + ']', g.nDiv)[0];
				if (visible == null) {
					visible = ncol.hidden;
				}
				if ($('input:checked', g.nDiv).length < p.minColToggle && !visible) {
					return false;
				}
				if (visible) {
					ncol.hidden = false;
					$(ncol).show();
					cb.checked = true;
				} else {
					ncol.hidden = true;
					$(ncol).hide();
					cb.checked = false;
				}
				$('tbody tr', t).each(
					function () {
						if (visible) {
							$('td:eq(' + n + ')', this).show();
						} else {
							$('td:eq(' + n + ')', this).hide();
						}
					}
				);
				this.rePosDrag();
				if (p.onToggleCol) {
					p.onToggleCol(cid, visible);
				}
				return visible;
			},
			switchCol: function (cdrag, cdrop) { //switch columns
				$('tbody tr', t).each(
					function () {
						if (cdrag > cdrop) $('td:eq(' + cdrop + ')', this).before($('td:eq(' + cdrag + ')', this));
						else $('td:eq(' + cdrop + ')', this).after($('td:eq(' + cdrag + ')', this));
					}
				);
				//switch order in nDiv
				if (cdrag > cdrop) {
					$('tr:eq(' + cdrop + ')', this.nDiv).before($('tr:eq(' + cdrag + ')', this.nDiv));
				} else {
					$('tr:eq(' + cdrop + ')', this.nDiv).after($('tr:eq(' + cdrag + ')', this.nDiv));
				}
				if (browser.msie && browser.version < 7.0) {
					$('tr:eq(' + cdrop + ') input', this.nDiv)[0].checked = true;
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
			},
			scroll: function () {
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				this.rePosDrag();
			},
			addData: function (data) { //parse data
				if (p.dataType == 'json') {
					data = $.extend({rows: [], page: 0, total: 0}, data);
				}
				if (p.preProcess) {
					data = p.preProcess(data);
				}
				$('.pReload', this.pDiv).removeClass('loading');
				this.loading = false;
				if (!data) {
					$('.pPageStat', this.pDiv).html(p.errormsg);
                    if (p.onSuccess) p.onSuccess(this);
					return false;
				}
				if (p.dataType == 'xml') {
					p.total = +$('rows total', data).text();
				} else {
					p.total = data.total;
				}
				if (p.total === 0) {
					$('tr, a, td, div', t).unbind();
					$(t).empty();
					p.pages = 1;
					p.page = 1;
					this.buildpager();
					$('.pPageStat', this.pDiv).html(p.nomsg);
                    if (p.onSuccess) p.onSuccess(this);
					return false;
				}
				p.pages = Math.ceil(p.total / p.rp);
				if (p.dataType == 'xml') {
					p.page = +$('rows page', data).text();
				} else {
					p.page = data.page;
				}
				this.buildpager();
				//build new body
				var tbody = document.createElement('tbody');
				if (p.dataType == 'json') {
					$.each(data.rows, function (i, row) {
						var tr = document.createElement('tr');
						var jtr = $(tr);
						if (row.name) tr.name = row.name;
						if (row.color) {
							jtr.css('background',row.color);
						} else {
							if (i % 2 && p.striped) tr.className = 'erow';
						}
						if (row[p.idProperty]) {
							//updated by Justin @去掉checkbox值前缀
//							tr.id = 'row' + row[p.idProperty];
							tr.id = row[p.idProperty];
							jtr.attr('data-id', row[p.idProperty]);
						}
						if (row[p.textProperty]) {
							tr.textbook= row[p.textProperty];
							jtr.attr('textbook', row[p.textProperty]);
						}

						 //��Ӷ�ѡ�� [�޸ĺ���� ʱ�䣺2011-04-08]------------��ʼ----��2��-----------
                        if (p.checkbox) {
                         var cth = $('<th/>');
                         var cthch = $('<input type="checkbox" value="' + $(tr).attr('id')+'" textbook="'+$(tr).attr('textbook')+'"  style="margin-left:8px;margin-right:7px;"/>');
                         var objTr = $(tr);
                         cthch.addClass("noborder").click(function(){
                         if(this.checked){
                        	objTr.addClass('trSelected');
                        	 
                        	var arr=new Array();
                            var value=$(this)[0].value;
                            var textbook=$(this)[0].attributes['textbook'].nodeValue;
                            arr.push({'value':value,'textbook':textbook});                 
                            p.selectCallBack(arr,true,true);
                         }
                         else{
                        	 objTr.removeClass('trSelected'); 
                        	 var arr=new Array();
                             var value=$(this)[0].value;
                             var textbook=$(this)[0].attributes['textbook'].nodeValue;
                             arr.push({'value':value,'textbook':textbook});                 
                             p.selectCallBack(arr,false,true);
                         }
                         })
                         cth.addClass("cth").attr({ width: "19"}).append(cthch);
                         $(tr).prepend(cth);

                         }
                         //��Ӷ�ѡ�� [�޸ĺ���� ʱ�䣺2011-04-08]------------����----��2��-----------
			 
						$('thead tr:first th', g.hDiv).each( //add cell
							function () {
								var td = document.createElement('td');
//								var idx = $(this).attr('axis').substr(3);
								var idx = $(this).attr('axis');
								td.align = this.align;
								// If each row is the object itself (no 'cell' key)
								if (typeof row.cell == 'undefined') {
									td.innerHTML = row[p.colModel[idx].name];
								} else {
									// If the json elements aren't named (which is typical), use numeric order
                                    var iHTML = '';
                                    if (typeof row.cell[idx] != "undefined") {
                                        iHTML = (row.cell[idx] !== null) ? row.cell[idx] : ''; //null-check for Opera-browser
                                    } else {
                                        iHTML = row.cell[p.colModel[idx].name];
                                    }
                                    td.innerHTML = p.__mw.datacol(p, $(this).attr('abbr'), iHTML); //use middleware datacol to format cols
								}
								// If the content has a <BGCOLOR=nnnnnn> option, decode it.
								var offs = td.innerHTML.indexOf( '<BGCOLOR=' );
								if( offs >0 ) {
                                    $(td).css('background', text.substr(offs+7,7) );
								}

								$(td).attr('abbr', $(this).attr('abbr'));
								$(tr).append(td);
								td = null;
							}
						);
						if ($('thead', this.gDiv).length < 1) {//handle if grid has no headers
							for (idx = 0; idx < row.cell.length; idx++) {
								var td = document.createElement('td');
								// If the json elements aren't named (which is typical), use numeric order
								if (typeof row.cell[idx] != "undefined") {
									td.innerHTML = (row.cell[idx] != null) ? row.cell[idx] : '';//null-check for Opera-browser
								} else {
									td.innerHTML = row.cell[p.colModel[idx].name];
								}
								$(tr).append(td);
								td = null;
							}
						}
						$(tbody).append(tr);
						tr = null;
					});
				} else if (p.dataType == 'xml') {
					var i = 1;
					$("rows row", data).each(function () {
						i++;
						var tr = document.createElement('tr');
						if ($(this).attr('name')) tr.name = $(this).attr('name');
						if ($(this).attr('color')) {
							$(tr).css('background',$(this).attr('id'));
						} else {
							if (i % 2 && p.striped) tr.className = 'erow';
						}
						var nid = $(this).attr('id');
						if (nid) {
							tr.id = 'row' + nid;
						}
						nid = null;
						var robj = this;
						$('thead tr:first th', g.hDiv).each(function () {
							var td = document.createElement('td');
//							var idx = $(this).attr('axis').substr(3);
							var idx = $(this).attr('axis');
							td.align = this.align;

							var text = $("cell:eq(" + idx + ")", robj).text();
							var offs = text.indexOf( '<BGCOLOR=' );
							if( offs >0 ) {
								$(td).css('background',	 text.substr(offs+7,7) );
							}
                            td.innerHTML = p.__mw.datacol(p, $(this).attr('abbr'), text); //use middleware datacol to format cols
							$(td).attr('abbr', $(this).attr('abbr'));
							$(tr).append(td);
							td = null;
						});
						if ($('thead', this.gDiv).length < 1) {//handle if grid has no headers
							$('cell', this).each(function () {
								var td = document.createElement('td');
								td.innerHTML = $(this).text();
								$(tr).append(td);
								td = null;
							});
						}
						$(tbody).append(tr);
						tr = null;
						robj = null;
					});
				}
				$('tr', t).unbind();
				$(t).empty();
				$(t).append(tbody);
				this.addCellProp();
				this.addRowProp();
				this.rePosDrag();
				tbody = null;
				i = null;
				if (p.onSuccess) {
					p.onSuccess(this,data);
				}
				
				//当前页汇总功能1
				//zhangzhentao 2014/12/11 
				if (p.statistics) { 
					this.addStatistics();
				}
				
				data = null;
				if (p.hideOnSubmit) {
					$(g.block).remove();
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				if (browser.opera) {
					$(t).css('visibility', 'visible');
				}
				p.loadCompleteCallBack();
			},
			
			fastAddData: function (data) { //parse data
				var d1 = new Date();
				if (p.dataType == 'json') {
					data = $.extend({rows: [], page: 0, total: 0}, data);
				}
				if (p.preProcess) {
					data = p.preProcess(data);
				}
				$('.pReload', this.pDiv).removeClass('loading');
				this.loading = false;
				if (!data) {
					$('.pPageStat', this.pDiv).html(p.errormsg);
                    if (p.onSuccess) p.onSuccess(this);
					return false;
				}
				if (p.dataType == 'xml') {
					p.total = +$('rows total', data).text();
				} else {
					p.total = data.total;
				}
				if (p.total === 0) {
					$('tr, a, td, div', t).unbind();
					$(t).empty();
					p.pages = 1;
					p.page = 1;
					this.buildpager();
					$('.pPageStat', this.pDiv).html(p.nomsg);
                    if (p.onSuccess) p.onSuccess(this);
					return false;
				}
				p.pages = Math.ceil(p.total / p.rp);
				if (p.dataType == 'xml') {
					p.page = +$('rows page', data).text();
				} else {
					p.page = data.page;
				}
				this.buildpager();
				//build new body
				var tbody = document.createElement('tbody');
				if (p.dataType == 'json') {
					var idxArray = new Array();
					var alignArray = new Array();
					var abbrArray = new Array();
					var widthArray = new Array();
					$('thead tr:first th', g.hDiv).each( //add cell
							function () {
								idxArray.push($(this).attr('axis'));
								alignArray.push(this.align);
								abbrArray.push($(this).attr('abbr'));
								widthArray.push($('div:first', this)[0].style.width);
							}
						);
					$.each(data.rows, function (i, row) {
						var tr = document.createElement('tr');
						var jtr = $(tr);
						if (row.name) tr.name = row.name;
						if (row.color) {
							jtr.css('background',row.color);
						} else {
							if (i % 2 && p.striped) tr.className = 'erow';
						}
						jtr.addClass("madssp");
						if (row[p.idProperty]) {
							tr.id = row[p.idProperty];
						}
						if (row[p.textProperty]) {
							tr.textbook = row[p.textProperty];
						}
                        if (p.checkbox) {
	                         var cthch = $('<th class="cth" width="19"><input class="noborder" type="checkbox" value="' + $(tr).attr('id') +'" textbook="' + $(tr).attr('textbook') +'"/></th>');
	                         jtr.prepend(cthch);
                         }
						$('thead tr:first th', g.hDiv).each( //add cell
							function (a) {
								var td = document.createElement('td');
								var idx = idxArray[a];
								var tdDiv = document.createElement('div');
								if (typeof row.cell == 'undefined') {
									tdDiv.innerHTML = row[p.colModel[idx].name]==""?'&nbsp;':row[p.colModel[idx].name];
								} else {
                                    var iHTML = '';
                                    if (typeof row.cell[idx] != "undefined") {
                                        iHTML = (row.cell[idx] !== null) ? row.cell[idx] : ''; //null-check for Opera-browser
                                    } else {
                                        iHTML = row.cell[p.colModel[idx].name];
                                    }
                                    td.innerHTML = p.__mw.datacol(p, abbrArray[a], iHTML); //use middleware datacol to format cols
								}
								$(td).attr('abbr', abbrArray[a]);
									$(tdDiv).css({
										textAlign: alignArray[a],
										width: widthArray[a]
									});
								if (this.process) this.process(tdDiv,  jtr.attr('id'));
								$(td).empty().append(tdDiv).removeAttr('width'); //wrap content
								jtr.append(td);
								td = null;
							}
						);
//                   var htm = '';
//					$('thead tr:first th', g.hDiv).each( //add cell
//						function (a) {
//							var td = ("<td><div style=\"text-align:"+alignArray[a]+";width:"+widthArray[a]+";\">"+((typeof row[p.colModel[idxArray[a]].name]=='undefined') ?'&nbsp;':row[p.colModel[idxArray[a]].name])+"</td></div>");
//							htm += td;
//							if (this.process) 
//								this.process( $("div:first",td)[0], jtr.attr("id"));
//						}
//					);
//					jtr.append(htm);
//					htm = '';
						if ($('thead', this.gDiv).length < 1) {//handle if grid has no headers
							for (idx = 0; idx < row.cell.length; idx++) {
								var td = document.createElement('td');
								// If the json elements aren't named (which is typical), use numeric order
								if (typeof row.cell[idx] != "undefined") {
									td.innerHTML = (row.cell[idx] != null) ? row.cell[idx] : '';//null-check for Opera-browser
								} else {
									td.innerHTML = row.cell[p.colModel[idx].name];
								}
								$(tr).append(td);
								td = null;
							}
						}
						$(tbody).append(tr);
						tr = null;
					});
					abbrArray = [];
					idxArray = [];
					alignArray = [];
					widthArray = [];
				
				} else if (p.dataType == 'xml') {
					var i = 1;
					$("rows row", data).each(function () {
						i++;
						var tr = document.createElement('tr');
						if ($(this).attr('name')) tr.name = $(this).attr('name');
						if ($(this).attr('color')) {
							$(tr).css('background',$(this).attr('id'));
						} else {
							if (i % 2 && p.striped) tr.className = 'erow';
						}
						var nid = $(this).attr('id');
						if (nid) {
							tr.id = 'row' + nid;
						}
						nid = null;
						var robj = this;
						$('thead tr:first th', g.hDiv).each(function () {
							var td = document.createElement('td');
//							var idx = $(this).attr('axis').substr(3);
							var idx = $(this).attr('axis');
							td.align = this.align;

							var text = $("cell:eq(" + idx + ")", robj).text();
							var offs = text.indexOf( '<BGCOLOR=' );
							if( offs >0 ) {
								$(td).css('background',	 text.substr(offs+7,7) );
							}
                            td.innerHTML = p.__mw.datacol(p, $(this).attr('abbr'), text); //use middleware datacol to format cols
							$(td).attr('abbr', $(this).attr('abbr'));
							$(tr).append(td);
							td = null;
						});
						if ($('thead', this.gDiv).length < 1) {//handle if grid has no headers
							$('cell', this).each(function () {
								var td = document.createElement('td');
								td.innerHTML = $(this).text();
								$(tr).append(td);
								td = null;
							});
						}
						$(tbody).append(tr);
						tr = null;
						robj = null;
					});
				}
				$('tr', t).unbind();
				$(t).empty();
				$(t).append(tbody);
				var d2 = new Date();
//				$('tbody tr td', g.bDiv).each(function () {
//					var n = $('td', $(this).parent()).index(this);
//					var pth = $('th:eq(' + n + ')', g.hDiv).get(0);
//					var prnt = $(this).parent()[0];
//					var pid = false;
//					if (prnt.id) {
//						pid = prnt.id;
//					}
//					var tdDiv = $("div:first",this)[0];
//					if (pth != null) {
//						if (pth.process) pth.process(tdDiv, pid);
//					}
//				});
//				this.addCellProp();
//				this.addRowProp();
				this.rePosDrag();
				tbody = null;
				i = null;
				if (p.onSuccess) {
					p.onSuccess(this,data);
				}
				
				//当前页汇总功能1
				//zhangzhentao 2014/12/11 
				if (p.statistics) { 
					this.addStatistics();
				}
				
				data = null;
				if (p.hideOnSubmit) {
					$(g.block).remove();
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				if (browser.opera) {
					$(t).css('visibility', 'visible');
				}
				var d3 = new Date();
			},
			
			//当前页汇总功能2
			//zhangzhentao 2014/12/11 
			addStatistics: function () {
				if (p.colModel) {
				                    var tfoot = document.createElement('tfoot');
				                    var tr = document.createElement('tr');
				                    for (i = 0; i < p.colModel.length; i++) { //遍历定义的报表列
				                        var cm = p.colModel[i];
				                        var temp = document.createElement('td');
				                        temp.style.background = '#E3E5ED';
				                        if (i == 0 && p.checkbox) {  //如果报表存在多选列，汇总行新增一个空列
				                            $(tr).append(temp);
				                            temp = document.createElement('td');
				                            temp.style.background = '#E3E5ED';
				                        }
				                        if (i == 0) { //汇总行第一列显示“汇总：”
				                            if (cm.width)
				                                temp.innerHTML = '<div style="width:' + cm.width + 'px">当前页汇总:</div>';
				                            else
				                                temp.innerHTML = "<div>当前页汇总:</div>";
				                        } else {
				                            var statsValue = 0;
				                            if (cm.stats) {  //判断stats的值
				                                switch (cm.stats) {
				                                    case "sum": //求和
				                                        $(t).find('tbody > tr').find('td:eq(' + i + ')').each(function () {
				                                            var value = $(this).text();
				                                            if (isNaN(value)) return;
				                                            statsValue += parseFloat(value);
				                                        });
				                                        statsValue = '总和:' + statsValue;
				                                        break;
				                                    case "avg": //平均值
				                                        $(t).find('tbody > tr').find('td:eq(' + i + ')').each(function () {
				                                            var value = $(this).text();
				                                            if (isNaN(value)) return;
				                                            statsValue += parseFloat(value);
				                                        });
				                                        statsValue = '平均:' + Math.floor((statsValue / $(t).find('tbody > tr').length) * 100) / 100;
				                                        break;
				                                    case "max": //最大值
				                                        $(t).find('tbody > tr').find('td:eq(' + i + ')').each(function () {
				                                            var value = $(this).text();
				                                            if (isNaN(value)) return;
				                                            if (parseFloat(value) > statsValue)
				                                                statsValue = parseFloat(value);
				                                        });
				                                        statsValue = '最大:' + statsValue;
				                                        break;
				                                    case "min": //最小值
				                                        $(t).find('tbody > tr').find('td:eq(' + i + ')').each(function () {
				                                            var value = $(this).text();
				                                            if (isNaN(value)) return;
				                                            if (parseFloat(value) < statsValue)
				                                                statsValue = parseFloat(value);
				                                        });
				                                        statsValue = '最小:' + statsValue;
				                                        break;
				                                    default:
				                                        statsValue = '';
				                                        break;
				                                }
				                            } else {
				                                statsValue = '';
				                            }
				                            if (cm.width)
				                                temp.innerHTML = '<div style="width:' + cm.width + 'px">' + statsValue + '</div>';
				                            else
				                                temp.innerHTML = '<div>' + statsValue + '</div>';
				                        }
				                        $(tr).append(temp);
				                    }

				                    $(tfoot).append(tr);
				                    $(t).prepend(tfoot);
				        }
				},

				
			addExtraData: function (data) { //parse data
				if (p.dataType == 'json') {
					data = $.extend({rows: [], page: 0, total: 0}, data);
				}
				if (p.preProcess) {
					data = p.preProcess(data);
				}
				$('.pReload', this.pDiv).removeClass('loading');
				this.loading = false;
				if (!data) {
					$('.pPageStat', this.pDiv).html(p.errormsg);
                    if (p.onSuccess) p.onSuccess(this);
					return false;
				}
				if (p.dataType == 'xml') {
					p.total = +$('rows total', data).text();
				} else {
					p.total = data.total;
				}
				if (p.total === 0) {
//					$('tr, a, td, div', t).unbind();
//					$(t).empty();
//					p.pages = 1;
//					p.page = 1;
//					this.buildpager();
//					$('.pPageStat', this.pDiv).html(p.nomsg);
//                    if (p.onSuccess) p.onSuccess(this);
					return false;
				}
				p.pages = Math.ceil(p.total / p.rp);
				if (p.dataType == 'xml') {
					p.page = +$('rows page', data).text();
				} else {
					p.page = data.page;
				}
				this.buildpager();
				//build new body
				var tbody = $(t).find('tbody');
				if (p.dataType == 'json') {
					$.each(data.rows, function (i, row) {
						var tr = document.createElement('tr');
						var jtr = $(tr);
						if (row.name) tr.name = row.name;
						if (row.color) {
							jtr.css('background',row.color);
						} else {
//							if (i % 2 && p.striped) tr.className = 'erow';
						}
						tr.className = 'extra';
						tr.id = "extra"+i;
//						if (row[p.idProperty]) {
//							//updated by Justin @去掉checkbox值前缀
////							tr.id = 'row' + row[p.idProperty];
//							tr.id = row[p.idProperty];
//							jtr.attr('data-id', row[p.idProperty]);
//						}


						 //��Ӷ�ѡ�� [�޸ĺ���� ʱ�䣺2011-04-08]------------��ʼ----��2��-----------
                        if (p.checkbox) {
                         var cth = $('<th/>');
                         var cthch = '';
//                         var cthch = $('<input type="checkbox" value="' + $(tr).attr('id') +'"/>');
//                         var objTr = $(tr);
//                         cthch.addClass("noborder").click(function(){
//                         if(this.checked){
//                         objTr.addClass('trSelected');
//                         }
//                         else{
//                         objTr.removeClass('trSelected'); 
//                        }
//                         })
                         cth.addClass("cth").attr({ width: "19"}).append(cthch);
                         $(tr).prepend(cth);

                         }
                         //��Ӷ�ѡ�� [�޸ĺ���� ʱ�䣺2011-04-08]------------����----��2��-----------
			 
						$('thead tr:first th', g.hDiv).each( //add cell
							function () {
								var td = document.createElement('td');
//								var idx = $(this).attr('axis').substr(3);
								var idx = $(this).attr('axis');
								td.align = this.align;
								// If each row is the object itself (no 'cell' key)
								if (typeof row.cell == 'undefined') {
									td.innerHTML = row[p.colModel[idx].name];
								} else {
									// If the json elements aren't named (which is typical), use numeric order
                                    var iHTML = '';
                                    if (typeof row.cell[idx] != "undefined") {
                                        iHTML = (row.cell[idx] !== null) ? row.cell[idx] : ''; //null-check for Opera-browser
                                    } else {
                                        iHTML = row.cell[p.colModel[idx].name];
                                    }
                                    td.innerHTML = p.__mw.datacol(p, $(this).attr('abbr'), iHTML); //use middleware datacol to format cols
								}
								// If the content has a <BGCOLOR=nnnnnn> option, decode it.
								var offs = td.innerHTML.indexOf( '<BGCOLOR=' );
								if( offs >0 ) {
                                    $(td).css('background', text.substr(offs+7,7) );
								}

								$(td).attr('abbr', $(this).attr('abbr'));
								$(tr).append(td);
								td = null;
							}
						);
						if ($('thead', this.gDiv).length < 1) {//handle if grid has no headers
							for (idx = 0; idx < row.cell.length; idx++) {
								var td = document.createElement('td');
								// If the json elements aren't named (which is typical), use numeric order
								if (typeof row.cell[idx] != "undefined") {
									td.innerHTML = (row.cell[idx] != null) ? row.cell[idx] : '';//null-check for Opera-browser
								} else {
									td.innerHTML = row.cell[p.colModel[idx].name];
								}
								$(tr).append(td);
								td = null;
							}
						}
						$(tbody).append(tr);
						tr = null;
					});
				} else if (p.dataType == 'xml') {
					var i = 1;
					$("rows row", data).each(function () {
						i++;
						var tr = document.createElement('tr');
						if ($(this).attr('name')) tr.name = $(this).attr('name');
						if ($(this).attr('color')) {
							$(tr).css('background',$(this).attr('id'));
						} else {
							if (i % 2 && p.striped) tr.className = 'erow';
						}
						var nid = $(this).attr('id');
						if (nid) {
							tr.id = 'row' + nid;
						}
						nid = null;
						var robj = this;
						$('thead tr:first th', g.hDiv).each(function () {
							var td = document.createElement('td');
//							var idx = $(this).attr('axis').substr(3);
							var idx = $(this).attr('axis');
							td.align = this.align;

							var text = $("cell:eq(" + idx + ")", robj).text();
							var offs = text.indexOf( '<BGCOLOR=' );
							if( offs >0 ) {
								$(td).css('background',	 text.substr(offs+7,7) );
							}
                            td.innerHTML = p.__mw.datacol(p, $(this).attr('abbr'), text); //use middleware datacol to format cols
							$(td).attr('abbr', $(this).attr('abbr'));
							$(tr).append(td);
							if (pth != null) {
								if (pth.process) pth.process(tdDiv, pid);
							}
							td = null;
						});
						if ($('thead', this.gDiv).length < 1) {//handle if grid has no headers
							$('cell', this).each(function () {
								var td = document.createElement('td');
								td.innerHTML = $(this).text();
								$(tr).append(td);
								td = null;
							});
						}
						$(tbody).append(tr);
						tr = null;
						robj = null;
					});
				}
				$('tr', t).unbind();
				$(t).empty();
				$(t).append(tbody);
				$('.extra td', g.bDiv).each(function () {
					var tdDiv = document.createElement('div');
					var n = $('td', $(this).parent()).index(this);
					var pth = $('th:eq(' + n + ')', g.hDiv).get(0);
					if (pth != null) {
						if (p.sortname == $(pth).attr('abbr') && p.sortname) {
							this.className = 'sorted';
						}
						$(tdDiv).css({
							textAlign: pth.align,
							width: $('div:first', pth)[0].style.width
						});
						if (pth.hidden) {
							$(this).css('display', 'none');
						}
					}
					if (p.nowrap == false) {
						$(tdDiv).css('white-space', 'normal');
					}
					if (this.innerHTML == '') {
						this.innerHTML = '&nbsp;';
					}
					tdDiv.innerHTML = this.innerHTML;
					var prnt = $(this).parent()[0];
					var pid = false;
					if (prnt.id) {
						//updated by Justin 
//						pid = prnt.id.substr(3);
						pid = prnt.id;
					}
					$(this).empty().append(tdDiv).removeAttr('width'); //wrap content
					g.addTitleToCell(tdDiv);
				});
//				this.addCellProp();
				this.addRowProp();
				this.rePosDrag();
				tbody = null;
				data = null;
				i = null;
//				if (p.onSuccess) {
//					p.onSuccess(this);
//				}
				if (p.hideOnSubmit) {
					$(g.block).remove();
				}
				this.hDiv.scrollLeft = this.bDiv.scrollLeft;
				if (browser.opera) {
					$(t).css('visibility', 'visible');
				}
			},
			changeSort: function (th) { //change sortorder
				if (this.loading) {
					return true;
				}
				$(g.nDiv).hide();
				$(g.nBtn).hide();
				if (p.sortname == $(th).attr('abbr')) {
					if (p.sortorder == 'asc') {
						p.sortorder = 'desc';
					} else {
						p.sortorder = 'asc';
					}
				}
				$(th).addClass('sorted').siblings().removeClass('sorted');
				$('.sdesc', this.hDiv).removeClass('sdesc');
				$('.sasc', this.hDiv).removeClass('sasc');
				$('div', th).addClass('s' + p.sortorder);
				p.sortname = $(th).attr('abbr');
				if (p.onChangeSort) {
					p.onChangeSort(p.sortname, p.sortorder);
				} else {
					this.populate();
				}
			},
			buildpager: function () { //rebuild pager based on new properties
				$('.pcontrol input', this.pDiv).val(p.page);
				$('.pcontrol span', this.pDiv).html(p.pages);
				var r1 = p.total == 0 ? 0 : (p.page - 1) * p.rp + 1;
				var r2 = r1 + p.rp - 1;
				if (p.total < r2) {
					r2 = p.total;
				}
				var stat = p.pagestat;
				stat = stat.replace(/{from}/, r1);
				stat = stat.replace(/{to}/, r2);
				stat = stat.replace(/{total}/, p.total);
				$('.pPageStat', this.pDiv).html(stat);
			},
			populate: function () { //get latest data
				if (this.loading) {
					return true;
				}
				if (p.onSubmit) {
					var gh = p.onSubmit();
					if (!gh) {
						return false;
					}
				}
				this.loading = true;
				if (!p.url) {
					return false;
				}
				$('.pPageStat', this.pDiv).html(p.procmsg);
				$('.pReload', this.pDiv).addClass('loading');
				$(g.block).css({
					top: g.bDiv.offsetTop
				});
				if (p.hideOnSubmit) {
					$(this.gDiv).prepend(g.block);
				}
				if (browser.opera) {
					$(t).css('visibility', 'hidden');
				}
				if (!p.newp) {
					p.newp = 1;
				}
				if (p.page > p.pages) {
					p.page = p.pages;
				}
				var param = [{
					name: 'page',
					value: p.newp
				}, {
					name: 'rp',
					value: p.rp
				}, {
					name: 'sortname',
					value: p.sortname
				}, {
					name: 'sortorder',
					value: p.sortorder
				}, {
					name: 'query',
					value: p.query
				}, {
					name: 'qtype',
					value: p.qtype
				}];
				if (p.params.length) {
					for (var pi = 0; pi < p.params.length; pi++) {
						param[param.length] = p.params[pi];
					}
				}
				$.ajax({
					type: p.method,
					url: p.url,
					data: param,
					dataType: p.dataType,
					success: function (data) {
						g.addData(data);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						try {
							if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
						} catch (e) {}
					}
				});
			},
			fastPopulate: function () { //get latest data
				if (this.loading) {
					return true;
				}
				if (p.onSubmit) {
					var gh = p.onSubmit();
					if (!gh) {
						return false;
					}
				}
				this.loading = true;
				if (!p.url) {
					return false;
				}
				$('.pPageStat', this.pDiv).html(p.procmsg);
				$('.pReload', this.pDiv).addClass('loading');
				$(g.block).css({
					top: g.bDiv.offsetTop
				});
				if (p.hideOnSubmit) {
					$(this.gDiv).prepend(g.block);
				}
				if (browser.opera) {
					$(t).css('visibility', 'hidden');
				}
				if (!p.newp) {
					p.newp = 1;
				}
				if (p.page > p.pages) {
					p.page = p.pages;
				}
				var param = [];
				if (p.params.length) {
					for (var pi = 0; pi < p.params.length; pi++) {
						param[param.length] = p.params[pi];
					}
				}
				$.ajax({
					type: p.method,
					url: p.url,
					data: param,
					dataType: p.dataType,
					success: function (data) {
						g.fastAddData(data);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						try {
							if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
						} catch (e) {}
					}
				});
			},
			doSearch: function () {
				p.query = $('input[name=q]', g.sDiv).val();
				p.qtype = $('select[name=qtype]', g.sDiv).val();
				p.newp = 1;
				this.populate();
			},
			changePage: function (ctype) { //change page
				if (this.loading) {
					return true;
				}
				switch (ctype) {
					case 'first':
						p.newp = 1;
						break;
					case 'prev':
						if (p.page > 1) {
							p.newp = parseInt(p.page, 10) - 1;
						}
						break;
					case 'next':
						if (p.page < p.pages) {
							p.newp = parseInt(p.page, 10) + 1;
						}
						break;
					case 'last':
						p.newp = p.pages;
						break;
					case 'input':
						var nv = parseInt($('.pcontrol input', this.pDiv).val(), 10);
						if (isNaN(nv)) {
							nv = 1;
						}
						if (nv < 1) {
							nv = 1;
						} else if (nv > p.pages) {
							nv = p.pages;
						}
						$('.pcontrol input', this.pDiv).val(nv);
						p.newp = nv;
						break;
				}
				if (p.newp == p.page) {
					return false;
				}
				if (p.onChangePage) {
					p.onChangePage(p.newp);
				} else {
					this.populate();
				}
			},
			addCellProp: function () {
				$('tbody tr td', g.bDiv).each(function () {
					var tdDiv = document.createElement('div');
					var n = $('td', $(this).parent()).index(this);
					var pth = $('th:eq(' + n + ')', g.hDiv).get(0);
					if (pth != null) {
						if (p.sortname == $(pth).attr('abbr') && p.sortname) {
							this.className = 'sorted';
						}
						$(tdDiv).css({
							textAlign: pth.align,
							width: $('div:first', pth)[0].style.width
						});
						if (pth.hidden) {
							$(this).css('display', 'none');
						}
					}
					if (p.nowrap == false) {
						$(tdDiv).css('white-space', 'normal');
					}
					if (this.innerHTML == '') {
						this.innerHTML = '&nbsp;';
					}
					tdDiv.innerHTML = this.innerHTML;
					var prnt = $(this).parent()[0];
					var pid = false;
					if (prnt.id) {
						//updated by Justin 
//						pid = prnt.id.substr(3);
						pid = prnt.id;
					}
					if (pth != null) {
						if (pth.process) pth.process(tdDiv, pid);
					}
					$(this).empty().append(tdDiv).removeAttr('width'); //wrap content
					g.addTitleToCell(tdDiv);
				});
			},
			getCellDim: function (obj) {// get cell prop for editable event
				var ht = parseInt($(obj).height(), 10);
				var pht = parseInt($(obj).parent().height(), 10);
				var wt = parseInt(obj.style.width, 10);
				var pwt = parseInt($(obj).parent().width(), 10);
				var top = obj.offsetParent.offsetTop;
				var left = obj.offsetParent.offsetLeft;
				var pdl = parseInt($(obj).css('paddingLeft'), 10);
				var pdt = parseInt($(obj).css('paddingTop'), 10);
				return {
					ht: ht,
					wt: wt,
					top: top,
					left: left,
					pdl: pdl,
					pdt: pdt,
					pht: pht,
					pwt: pwt
				};
			},
			addRowProp: function () {
				$('tbody tr', g.bDiv).on('click', function (e) {
					var obj = (e.target || e.srcElement);
					if (obj.href || obj.type) return true;
					if (e.ctrlKey || e.metaKey) {
						// mousedown already took care of this case
						return;
					}
					$(this).toggleClass('trSelected');
					
					
			 //��Ӷ�ѡ�� [�޸ĺ���� ʱ�䣺2011-04-08]------------��ʼ-------��3��--------
                        if(p.checkbox){
                            if($(this).hasClass('trSelected')){
                            $(this).find('input')[0].checked=true;
                            
                            var arr=new Array();
                            var value=$(this).find('input')[0].value;
                            var textbook=$(this).find('input')[0].attributes['textbook'].nodeValue;
                            arr.push({'value':value,'textbook':textbook});                 
                            p.selectCallBack(arr,true,true);
                           }
                        else{
                           $(this).find('input')[0].checked=false
                           
                           var arr=new Array();
                           var value=$(this).find('input')[0].value;
                           var textbook=$(this).find('input')[0].attributes['textbook'].nodeValue;
                           arr.push({'value':value,'textbook':textbook});                 
                           p.selectCallBack(arr,false,true);
                           }
                        }
                        //��Ӷ�ѡ�� [�޸ĺ���� ʱ�䣺2011-04-08]------------����-------��3��--------
			
			
					if (p.singleSelect && ! g.multisel) {
						$(this).siblings().removeClass('trSelected');
					}
				}).on('mousedown', function (e) {
					if (e.shiftKey) {
						$(this).toggleClass('trSelected');
						g.multisel = true;
						this.focus();
						$(g.gDiv).noSelect();
					}
					if (e.ctrlKey || e.metaKey) {
						$(this).toggleClass('trSelected');
						g.multisel = true;
						this.focus();
					}
				}).on('mouseup', function (e) {
					if (g.multisel && ! (e.ctrlKey || e.metaKey)) {
						g.multisel = false;
						$(g.gDiv).noSelect(false);
					}
				}).on('dblclick', function () {
					if (p.onDoubleClick) {
						p.onDoubleClick(this, g, p);
					}
				}).hover(function (e) {
					if (g.multisel && e.shiftKey) {
						$(this).toggleClass('trSelected');
					}
				}, function () {});
				if (browser.msie && browser.version < 7.0) {
					$(this).hover(function () {
						$(this).addClass('trOver');
					}, function () {
						$(this).removeClass('trOver');
					});
				}
			},

			combo_flag: true,
			combo_resetIndex: function(selObj)
			{
				if(this.combo_flag) {
					selObj.selectedIndex = 0;
				}
				this.combo_flag = true;
			},
			combo_doSelectAction: function(selObj)
			{
				eval( selObj.options[selObj.selectedIndex].value );
				selObj.selectedIndex = 0;
				this.combo_flag = false;
			},
			//Add title attribute to div if cell contents is truncated
			addTitleToCell: function(tdDiv) {
				if(p.addTitleToCell) {
					var $span = $('<span />').css('display', 'none'),
						$div = (tdDiv instanceof jQuery) ? tdDiv : $(tdDiv),
						div_w = $div.outerWidth(),
						span_w = 0;

					$('body').children(':first').before($span);
					$span.html($div.html());
					$span.css('font-size', '' + $div.css('font-size'));
					$span.css('padding-left', '' + $div.css('padding-left'));
					span_w = $span.innerWidth();
					$span.remove();

					if(span_w > div_w) {
						$div.attr('title', $div.text());
					} else {
						$div.removeAttr('title');
					}
				}
			},
			autoResizeColumn: function (obj) {
				if(!p.dblClickResize) {
					return;
				}
				var n = $('div', this.cDrag).index(obj),
					$th = $('th:visible div:eq(' + n + ')', this.hDiv),
					ol = parseInt(obj.style.left, 10),
					ow = $th.width(),
					nw = 0,
					nl = 0,
					$span = $('<span />');
				$('body').children(':first').before($span);
				$span.html($th.html());
				$span.css('font-size', '' + $th.css('font-size'));
				$span.css('padding-left', '' + $th.css('padding-left'));
				$span.css('padding-right', '' + $th.css('padding-right'));
				nw = $span.width();
				$('tr', this.bDiv).each(function () {
					var $tdDiv = $('td:visible div:eq(' + n + ')', this),
						spanW = 0;
					$span.html($tdDiv.html());
					$span.css('font-size', '' + $tdDiv.css('font-size'));
					$span.css('padding-left', '' + $tdDiv.css('padding-left'));
					$span.css('padding-right', '' + $tdDiv.css('padding-right'));
					spanW = $span.width();
					nw = (spanW > nw) ? spanW : nw;
				});
				$span.remove();
				nw = (p.minWidth > nw) ? p.minWidth : nw;
				nl = ol + (nw - ow);
				$('div:eq(' + n + ')', this.cDrag).css('left', nl);
				this.colresize = {
					nw: nw,
					n: n
				};
				g.dragEnd();
			},
			pager: 0
		};
        
        g = p.getGridClass(g); //get the grid class
        
		if (p.colModel) { //create model if any
			thead = document.createElement('thead');
			$(thead).css('background',"#D9EDF7");
			var tr = document.createElement('tr');
			for (var i = 0; i < p.colModel.length; i++) {
				var cm = p.colModel[i];
				var th = document.createElement('th');
//				$(th).attr('axis', 'col' + i);
				$(th).attr('axis',i);
				if( cm ) {	// only use cm if its defined
					if ($.cookies) {
						var cookie_width = 'flexiwidths/'+cm.name;		// Re-Store the widths in the cookies
						if( $.cookie(cookie_width) != undefined ) {
							cm.width = $.cookie(cookie_width);
						}
					}
					if( cm.display != undefined ) {
						th.innerHTML = cm.display;
					}
					if (cm.name && cm.sortable) {
						$(th).attr('abbr', cm.name);
					}
					if (cm.align) {
						th.align = cm.align;
					}
					if (cm.width) {
						$(th).attr('width', cm.width);
					}
					if ($(cm).attr('hide')) {
						th.hidden = true;
					}
					if (cm.process) {
						th.process = cm.process;
					}
				} else {
					th.innerHTML = "";
					$(th).attr('width',30);
				}
				$(tr).append(th);
			}
			$(thead).append(tr);
			$(t).prepend(thead);
		} // end if p.colmodel
		//init divs
		g.gDiv = document.createElement('div'); //create global container
		g.mDiv = document.createElement('div'); //create title container
		g.hDiv = document.createElement('div'); //create header container
		g.bDiv = document.createElement('div'); //create body container
		g.vDiv = document.createElement('div'); //create grip
		g.rDiv = document.createElement('div'); //create horizontal resizer
		g.cDrag = document.createElement('div'); //create column drag
		g.block = document.createElement('div'); //creat blocker
		g.nDiv = document.createElement('div'); //create column show/hide popup
		g.nBtn = document.createElement('div'); //create column show/hide button
		g.iDiv = document.createElement('div'); //create editable layer
		g.tDiv = document.createElement('div'); //create toolbar
		g.sDiv = document.createElement('div');
		g.pDiv = document.createElement('div'); //create pager container
        
        if(p.colResize === false) { //don't display column drag if we are not using it
            $(g.cDrag).css('display', 'none');
        }
        
		if (!p.usepager) {
			g.pDiv.style.display = 'none';
		}
		g.hTable = document.createElement('table');
		g.gDiv.className = 'flexigrid';
		if (p.width != 'auto') {
			g.gDiv.style.width = p.width + (isNaN(p.width) ? '' : 'px');
		} 
		//add conditional classes
		if (browser.msie) {
			$(g.gDiv).addClass('ie');
		}
		if (p.novstripe) {
			$(g.gDiv).addClass('novstripe');
		}
		$(t).before(g.gDiv);
		$(g.gDiv).append(t);
		//set toolbar
		if (p.buttons) {
			g.tDiv.className = 'tDiv';
			var tDiv2 = document.createElement('div');
			tDiv2.className = 'tDiv2';
			for (var i = 0; i < p.buttons.length; i++) {
				var btn = p.buttons[i];
				if (!btn.separator) {
					var btnDiv = document.createElement('div');
					btnDiv.className = 'fbutton';
					btnDiv.innerHTML = ("<div><span>") + (btn.hidename ? "&nbsp;" : btn.name) + ("</span></div>");
					if (btn.bclass) $('span', btnDiv).addClass(btn.bclass).css({
						paddingLeft: 20
					});
					if (btn.bimage) // if bimage defined, use its string as an image url for this buttons style (RS)
						$('span',btnDiv).css( 'background', 'url('+btn.bimage+') no-repeat center left' );
						$('span',btnDiv).css( 'paddingLeft', 20 );

					if (btn.tooltip) // add title if exists (RS)
						$('span',btnDiv)[0].title = btn.tooltip;

					btnDiv.onpress = btn.onpress;
					btnDiv.name = btn.name;
					if (btn.id) {
						btnDiv.id = btn.id;
					}
					if (btn.onpress) {
						$(btnDiv).click(function () {
							this.onpress(this.id || this.name, g.gDiv);
						});
					}
					$(tDiv2).append(btnDiv);
					if (browser.msie && browser.version < 7.0) {
						$(btnDiv).hover(function () {
							$(this).addClass('fbOver');
						}, function () {
							$(this).removeClass('fbOver');
						});
					}
				} else {
					$(tDiv2).append("<div class='btnseparator'></div>");
				}
			}
			$(g.tDiv).append(tDiv2);
			$(g.tDiv).append("<div style='clear:both'></div>");
			$(g.gDiv).prepend(g.tDiv);
		}
		g.hDiv.className = 'hDiv';

		// Define a combo button set with custom action'ed calls when clicked.
		if( p.combobuttons && $(g.tDiv2) )
		{
			var btnDiv = document.createElement('div');
			btnDiv.className = 'fbutton';

			var tSelect = document.createElement('select');
			$(tSelect).change( function () { g.combo_doSelectAction( tSelect ) } );
			$(tSelect).click( function () { g.combo_resetIndex( tSelect) } );
			tSelect.className = 'cselect';
			$(btnDiv).append(tSelect);

			for (i=0;i<p.combobuttons.length;i++)
			{
				var btn = p.combobuttons[i];
				if (!btn.separator)
				{
					var btnOpt = document.createElement('option');
					btnOpt.innerHTML = btn.name;

					if (btn.bclass)
						$(btnOpt)
						.addClass(btn.bclass)
						.css({paddingLeft:20})
						;
					if (btn.bimage)  // if bimage defined, use its string as an image url for this buttons style (RS)
						$(btnOpt).css( 'background', 'url('+btn.bimage+') no-repeat center left' );
						$(btnOpt).css( 'paddingLeft', 20 );

					if (btn.tooltip) // add title if exists (RS)
						$(btnOpt)[0].title = btn.tooltip;

					if (btn.onpress)
					{
						btnOpt.value = btn.onpress;
					}
					$(tSelect).append(btnOpt);
				}
			}
			$('.tDiv2').append(btnDiv);
		}


		$(t).before(g.hDiv);
		g.hTable.cellPadding = 0;
		g.hTable.cellSpacing = 0;
		$(g.hDiv).append('<div class="hDivBox"></div>');
		$('div', g.hDiv).append(g.hTable);
		var thead = $("thead:first", t).get(0);
		if (thead) $(g.hTable).append(thead);
		thead = null;
		if (!p.colmodel) var ci = 0;
		$('thead tr:first th', g.hDiv).each(function () {
			var thdiv = document.createElement('div');
			if ($(this).attr('abbr')) {
				$(this).click(function (e) {
					if (!$(this).hasClass('thOver')) return false;
					var obj = (e.target || e.srcElement);
					if (obj.href || obj.type) return true;
					g.changeSort(this);
				});
				if ($(this).attr('abbr') == p.sortname) {
					this.className = 'sorted';
					thdiv.className = 's' + p.sortorder;
				}
			}
			if (this.hidden) {
				$(this).hide();
			}
			if (!p.colmodel) {
//				$(this).attr('axis', 'col' + ci++);
				$(this).attr('axis',  ci++);
			}
			
			// if there isn't a default width, then the column headers don't match
			// i'm sure there is a better way, but this at least stops it failing
			if (this.width == '') {
				this.width = 100;
			}
			
			$(thdiv).css({
				textAlign: this.align,
				width: this.width + 'px'
			});
			thdiv.innerHTML = this.innerHTML;
			$(this).empty().append(thdiv).removeAttr('width').mousedown(function (e) {
				g.dragStart('colMove', e, this);
			}).hover(function () {
				if (!g.colresize && !$(this).hasClass('thMove') && !g.colCopy) {
					$(this).addClass('thOver');
				}
				if ($(this).attr('abbr') != p.sortname && !g.colCopy && !g.colresize && $(this).attr('abbr')) {
					$('div', this).addClass('s' + p.sortorder);
				} else if ($(this).attr('abbr') == p.sortname && !g.colCopy && !g.colresize && $(this).attr('abbr')) {
					var no = (p.sortorder == 'asc') ? 'desc' : 'asc';
					$('div', this).removeClass('s' + p.sortorder).addClass('s' + no);
				}
				if (g.colCopy) {
					var n = $('th', g.hDiv).index(this);
					if (n == g.dcoln) {
						return false;
					}
					if (n < g.dcoln) {
						$(this).append(g.cdropleft);
					} else {
						$(this).append(g.cdropright);
					}
					g.dcolt = n;
				} else if (!g.colresize) {
					var nv = $('th:visible', g.hDiv).index(this);
					var onl = parseInt($('div:eq(' + nv + ')', g.cDrag).css('left'), 10);
					var nw = jQuery(g.nBtn).outerWidth();
					var nl = onl - nw + Math.floor(p.cgwidth / 2);
					$(g.nDiv).hide();
					$(g.nBtn).hide();
					$(g.nBtn).css({
						'left': nl,
						//修复Hide/Show按钮下拉菜单提前隐藏问题
						//zhangzhentao 2014/12/05 
						top: g.hDiv.offsetTop + 5
					}).show();
					var ndw = parseInt($(g.nDiv).width(), 10);
					$(g.nDiv).css({
						top: g.bDiv.offsetTop
					});
					if ((nl + ndw) > $(g.gDiv).width()) {
						$(g.nDiv).css('left', onl - ndw + 1);
					} else {
						$(g.nDiv).css('left', nl);
					}
					if ($(this).hasClass('sorted')) {
						$(g.nBtn).addClass('srtd');
					} else {
						$(g.nBtn).removeClass('srtd');
					}
				}
			}, function () {
				$(this).removeClass('thOver');
				if ($(this).attr('abbr') != p.sortname) {
					$('div', this).removeClass('s' + p.sortorder);
				} else if ($(this).attr('abbr') == p.sortname) {
					var no = (p.sortorder == 'asc') ? 'desc' : 'asc';
					$('div', this).addClass('s' + p.sortorder).removeClass('s' + no);
				}
				if (g.colCopy) {
					$(g.cdropleft).remove();
					$(g.cdropright).remove();
					g.dcolt = null;
				}
			}); //wrap content
		});
		//set bDiv
		g.bDiv.className = 'bDiv';
		$(t).before(g.bDiv);
		$(g.bDiv).css({
			height: (p.height == 'auto') ? 'auto' : p.height + "px"
		}).scroll(function (e) {
			g.scroll()
		}).append(t);
		if (p.height == 'auto') {
			$('table', g.bDiv).addClass('autoht');
		}
		//add td & row properties
		g.addCellProp();
		g.addRowProp();
        //set cDrag only if we are using it
        if (p.colResize === true) {
            var cdcol = $('thead tr:first th:first', g.hDiv).get(0);
            if(cdcol !== null) {
                g.cDrag.className = 'cDrag';
                g.cdpad = 0;
                g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderLeftWidth'), 10)) ? 0 : parseInt($('div', cdcol).css('borderLeftWidth'), 10));
                g.cdpad += (isNaN(parseInt($('div', cdcol).css('borderRightWidth'), 10)) ? 0 : parseInt($('div', cdcol).css('borderRightWidth'), 10));
                g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingLeft'), 10)) ? 0 : parseInt($('div', cdcol).css('paddingLeft'), 10));
                g.cdpad += (isNaN(parseInt($('div', cdcol).css('paddingRight'), 10)) ? 0 : parseInt($('div', cdcol).css('paddingRight'), 10));
                g.cdpad += (isNaN(parseInt($(cdcol).css('borderLeftWidth'), 10)) ? 0 : parseInt($(cdcol).css('borderLeftWidth'), 10));
                g.cdpad += (isNaN(parseInt($(cdcol).css('borderRightWidth'), 10)) ? 0 : parseInt($(cdcol).css('borderRightWidth'), 10));
                g.cdpad += (isNaN(parseInt($(cdcol).css('paddingLeft'), 10)) ? 0 : parseInt($(cdcol).css('paddingLeft'), 10));
                g.cdpad += (isNaN(parseInt($(cdcol).css('paddingRight'), 10)) ? 0 : parseInt($(cdcol).css('paddingRight'), 10));
                $(g.bDiv).before(g.cDrag);
                var cdheight = $(g.bDiv).height();
                var hdheight = $(g.hDiv).height();
                $(g.cDrag).css({
                    top: -hdheight + 'px'
                });
                $('thead tr:first th', g.hDiv).each(function() {
                    var cgDiv = document.createElement('div');
                    $(g.cDrag).append(cgDiv);
                    if (!p.cgwidth) {
                        p.cgwidth = $(cgDiv).width();
                    }
                    $(cgDiv).css({
                        height: cdheight + hdheight
                    }).mousedown(function(e) {
                        g.dragStart('colresize', e, this);
                    }).dblclick(function(e) {
                        g.autoResizeColumn(this);
                    });
                    if (browser.msie && browser.version < 7.0) {
                        g.fixHeight($(g.gDiv).height());
                        $(cgDiv).hover(function() {
                            g.fixHeight();
                            $(this).addClass('dragging');
                        }, function() {
                            if(!g.colresize) {
                                $(this).removeClass('dragging');
                            }
                        });
                    }
                });
            }
        }
		//add strip
		if (p.striped) {
			$('tbody tr:odd', g.bDiv).addClass('erow');
		}
		if (p.resizable && p.height != 'auto') {
			g.vDiv.className = 'vGrip';
			$(g.vDiv).mousedown(function (e) {
				g.dragStart('vresize', e);
			}).html('<span></span>');
			$(g.bDiv).after(g.vDiv);
		}
		if (p.resizable && p.width != 'auto' && !p.nohresize) {
			g.rDiv.className = 'hGrip';
			$(g.rDiv).mousedown(function (e) {
				g.dragStart('vresize', e, true);
			}).html('<span></span>').css('height', $(g.gDiv).height());
			if (browser.msie && browser.version < 7.0) {
				$(g.rDiv).hover(function () {
					$(this).addClass('hgOver');
				}, function () {
					$(this).removeClass('hgOver');
				});
			}
			$(g.gDiv).append(g.rDiv);
		}
		// add pager
		if (p.usepager) {
			g.pDiv.className = 'pDiv';
			g.pDiv.innerHTML = '<div class="pDiv2"></div>';
			$(g.bDiv).after(g.pDiv);
			var html = ' <div class="pGroup"> <div class="pFirst pButton"><span></span></div><div class="pPrev pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"><span class="pcontrol">' + p.pagetext + ' <input type="text" size="4" value="1" /> ' + p.outof + ' <span> 1 </span></span></div> <div class="btnseparator"></div> <div class="pGroup"> <div class="pNext pButton"><span></span></div><div class="pLast pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"> <div class="pReload pButton"><span></span></div> </div> <div class="btnseparator"></div> <div class="pGroup"><span class="pPageStat"></span></div>';
			$('div', g.pDiv).html(html);
			$('.pReload', g.pDiv).click(function () {
				g.populate();
			});
			$('.pFirst', g.pDiv).click(function () {
				g.changePage('first');
			});
			$('.pPrev', g.pDiv).click(function () {
				g.changePage('prev');
			});
			$('.pNext', g.pDiv).click(function () {
				g.changePage('next');
			});
			$('.pLast', g.pDiv).click(function () {
				g.changePage('last');
			});
			$('.pcontrol input', g.pDiv).keydown(function (e) {
				if (e.keyCode == 13) { 
                    g.changePage('input');
				}
			});
			if (browser.msie && browser.version < 7) $('.pButton', g.pDiv).hover(function () {
				$(this).addClass('pBtnOver');
			}, function () {
				$(this).removeClass('pBtnOver');
			});
			if (p.useRp) {
				var opt = '',
					sel = '';
				for (var nx = 0; nx < p.rpOptions.length; nx++) {
					if (p.rp == p.rpOptions[nx]) sel = 'selected="selected"';
					else sel = '';
					opt += "<option value='" + p.rpOptions[nx] + "' " + sel + " >" + p.rpOptions[nx] + "&nbsp;&nbsp;</option>";
				}
				$('.pDiv2', g.pDiv).prepend("<div class='pGroup'><select name='rp'>" + opt + "</select></div> <div class='btnseparator'></div>");
				$('select', g.pDiv).change(function () {
					if (p.onRpChange) {
						p.onRpChange(+this.value);
					} else {
						p.newp = 1;
						p.rp = +this.value;
						g.populate();
					}
				});
			}
			//add search button
			if (p.searchitems) {
				$('.pDiv2', g.pDiv).prepend("<div class='pGroup'> <div class='pSearch pButton'><span></span></div> </div>  <div class='btnseparator'></div>");
				$('.pSearch', g.pDiv).click(function () {
					$(g.sDiv).slideToggle('fast', function () {
						$('.sDiv:visible input:first', g.gDiv).trigger('focus');
					});
				});
				//add search box
				g.sDiv.className = 'sDiv';
				var sitems = p.searchitems;
				var sopt = '', sel = '';
				for (var s = 0; s < sitems.length; s++) {
					if (p.qtype === '' && sitems[s].isdefault === true) {
						p.qtype = sitems[s].name;
						sel = 'selected="selected"';
					} else {
						sel = '';
					}
					sopt += "<option value='" + sitems[s].name + "' " + sel + " >" + sitems[s].display + "&nbsp;&nbsp;</option>";
				}
				if (p.qtype === '') {
					p.qtype = sitems[0].name;
				}
				$(g.sDiv).append("<div class='sDiv2'>" + p.findtext +
						" <input type='text' value='" + p.query +"' size='30' name='q' class='qsbox' /> "+
						" <select name='qtype'>" + sopt + "</select></div>");
				//Split into separate selectors because of bug in jQuery 1.3.2
				$('input[name=q]', g.sDiv).keydown(function (e) {
					if (e.keyCode == 13) {
						g.doSearch();
					}
				});
				$('select[name=qtype]', g.sDiv).keydown(function (e) {
					if (e.keyCode == 13) {
						g.doSearch();
					}
				});
				$('input[value=Clear]', g.sDiv).click(function () {
					$('input[name=q]', g.sDiv).val('');
					p.query = '';
					g.doSearch();
				});
				$(g.bDiv).after(g.sDiv);
			}
		}
		$(g.pDiv, g.sDiv).append("<div style='clear:both'></div>");
		// add title
		if (p.title) {
			g.mDiv.className = 'mDiv';
			g.mDiv.innerHTML = '<div class="ftitle">' + p.title + '</div>';
			$(g.gDiv).prepend(g.mDiv);
			if (p.showTableToggleBtn) {
				$(g.mDiv).append('<div class="ptogtitle" title="Minimize/Maximize Table"><span></span></div>');
				$('div.ptogtitle', g.mDiv).click(function () {
					$(g.gDiv).toggleClass('hideBody');
					$(this).toggleClass('vsble');
				});
			}
		}
		//setup cdrops
		g.cdropleft = document.createElement('span');
		g.cdropleft.className = 'cdropleft';
		g.cdropright = document.createElement('span');
		g.cdropright.className = 'cdropright';
		//add block
		g.block.className = 'gBlock';
		var gh = $(g.bDiv).height();
		var gtop = g.bDiv.offsetTop;
		$(g.block).css({
			width: g.bDiv.style.width,
			height: gh,
			background: 'white',
			position: 'relative',
			marginBottom: (gh * -1),
			zIndex: 1,
			top: gtop,
			left: '0px'
		});
		$(g.block).fadeTo(0, p.blockOpacity);
		// add column control
		if ($('th', g.hDiv).length) {
			g.nDiv.className = 'nDiv';
			g.nDiv.innerHTML = "<table cellpadding='0' cellspacing='0'><tbody></tbody></table>";
			$(g.nDiv).css({
				marginBottom: (gh * -1),
				display: 'none',
				top: gtop
			}).noSelect();
			var cn = 0;
			$('th div', g.hDiv).each(function () {
//				var kcol = $("th[axis='col" + cn + "']", g.hDiv)[0];
				var kcol = $("th[axis='" + cn + "']", g.hDiv)[0];
				var chk = 'checked="checked"';
				if (kcol.style.display == 'none') {
					chk = '';
				}
				$('tbody', g.nDiv).append('<tr><td class="ndcol1"><input type="checkbox" ' + chk + ' class="togCol" value="' + cn + '" /></td><td class="ndcol2">' + this.innerHTML + '</td></tr>');
				cn++;
			});
		//��Ӷ�ѡ�� [�޸ĺ���� ʱ�䣺2011-04-08]------------��ʼ--------��4��-------
		     if (p.checkbox) {
		         $('tr', g.hDiv).each(
		                 function () {

		                     var cth = $('<td/>');
		                     var cthch = $('<input type="checkbox" class="noborder" style="margin-left:8px;margin-right:7px;"/>');
		                     cthch.click(function () {
		                         if (this.checked) {
		                             $('tbody tr', g.bDiv).each(function () {
		                            	 if($(this).addClass('trSelected').find('input')[0])
		                                 $(this).addClass('trSelected').find('input')[0].checked = true;
		                             });
		                             //zhangyan begin
		                             var arr=new Array();
		                             $('tbody tr', g.bDiv).each(function(){
		                            	 var value=$(this).find('input')[0].value;
		                            	 var textbook=$(this).find('input')[0].attributes['textbook'].nodeValue;
		                            	 arr.push({'value':value,'textbook':textbook});
		                             });
		                             p.selectCallBack(arr,true,false);
		                           //zhangyan end
		                         }
		                         else {
		                             $('tbody tr', g.bDiv).each(function () {
		                            	 if($(this).addClass('trSelected').find('input')[0])
		                                 $(this).removeClass('trSelected').find('input')[0].checked = false;
		                             });
		                             //zhangyan begin
		                             var arr=new Array();
		                             $('tbody tr', g.bDiv).each(function(){
		                            	 var value=$(this).find('input')[0].value;
		                            	 var textbook=$(this).find('input')[0].attributes['textbook'].nodeValue;
		                            	 arr.push({'value':value,'textbook':textbook});
		                             });
		                             p.selectCallBack(arr,false,false);
		                           //zhangyan end
		                         }
		                         
		                     })
		                     cth.addClass("cth").attr({ width: "44" }).append(cthch);
		                     $(this).prepend(cth);
		                 })
		     };
		     //��Ӷ�ѡ�� [�޸ĺ���� ʱ�䣺2011-04-08]------------����--------��4��-------
			if (browser.msie && browser.version < 7.0) $('tr', g.nDiv).hover(function () {
				$(this).addClass('ndcolover');
			}, function () {
				$(this).removeClass('ndcolover');
			});
			$('td.ndcol2', g.nDiv).click(function () {
				if ($('input:checked', g.nDiv).length <= p.minColToggle && $(this).prev().find('input')[0].checked) return false;
				return g.toggleCol($(this).prev().find('input').val());
			});
			$('input.togCol', g.nDiv).click(function () {
				if ($('input:checked', g.nDiv).length < p.minColToggle && this.checked === false) return false;
				$(this).parent().next().trigger('click');
			});
			$(g.gDiv).prepend(g.nDiv);
			$(g.nBtn).addClass('nBtn')
				.html('<div></div>')
				.attr('title', 'Hide/Show Columns')
				.click(function () {
					$(g.nDiv).toggle();
					return true;
				}
			);
			if (p.showToggleBtn) {
				$(g.gDiv).prepend(g.nBtn);
			}
		}
		// add date edit layer
		$(g.iDiv).addClass('iDiv').css({
			display: 'none'
		});
		$(g.bDiv).append(g.iDiv);
		// add flexigrid events
		$(g.bDiv).hover(function () {
			$(g.nDiv).hide();
			$(g.nBtn).hide();
		}, function () {
			if (g.multisel) {
				g.multisel = false;
			}
		});
		$(g.gDiv).hover(function () {}, function () {
			$(g.nDiv).hide();
			$(g.nBtn).hide();
		});
		//add document events
		$(document).mousemove(function (e) {
			g.dragMove(e);
		}).mouseup(function (e) {
			g.dragEnd();
		}).hover(function () {}, function () {
			g.dragEnd();
		});
		//browser adjustments
		if (browser.msie && browser.version < 7.0) {
			$('.hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv', g.gDiv).css({
				width: '100%'
			});
			$(g.gDiv).addClass('ie6');
			if (p.width != 'auto') {
				$(g.gDiv).addClass('ie6fullwidthbug');
			}
		}
		g.rePosDrag();
		g.fixHeight();
		//make grid functions accessible
		t.p = p;
		t.grid = g;
		// load data
		if (p.url && p.autoload) {
			g.populate();
		}
		return t;
	};
	var docloaded = false;
	$(document).ready(function () {
		docloaded = true;
	});
	$.fn.flexigrid = function (p) {
		return this.each(function () {
			if (!docloaded) {
				$(this).hide();
				var t = this;
				$(document).ready(function () {
					$.addFlex(t, p);
				});
			} else {
				$.addFlex(this, p);
			}
		});
	}; //end flexigrid
	$.fn.flexReload = function (p) { // function to reload grid
		return this.each(function () {
			if (this.grid && this.p.url) this.grid.populate();
		});
	}; //end flexReload
	$.fn.flexReloadWithOptions = function (p) { // function to reload grid
		return this.each(function () {
			if (this.grid){
				$.extend(this.p, p);
				if(this.p.url)
					this.grid.fastPopulate();
			}
		});
	}; //end flexReload
	$.fn.flexOptions = function (p) { //function to update general options
		return this.each(function () {
			if (this.grid) $.extend(this.p, p);
		});
	}; //end flexOptions
	$.fn.flexToggleCol = function (cid, visible) { // function to reload grid
		return this.each(function () {
			if (this.grid) this.grid.toggleCol(cid, visible);
		});
	}; //end flexToggleCol
	$.fn.flexAddData = function (data) { // function to add data to grid
		return this.each(function () {
			if (this.grid) this.grid.addData(data);
		});
	};
	$.fn.flexAddExtraData = function (data) { // function to add data to grid
		return this.each(function () {
			if (this.grid) {
				this.grid.addExtraData(data);
			}
		});
	};	
	$.fn.noSelect = function (p) { //no select plugin by me :-)
		var prevent = (p === null) ? true : p;
		if (prevent) {
			return this.each(function () {
				if (browser.msie || browser.safari) $(this).bind('selectstart', function () {
					return false;
				});
				else if (browser.mozilla) {
					$(this).css('MozUserSelect', 'none');
					$('body').trigger('focus');
				} else if (browser.opera) $(this).bind('mousedown', function () {
					return false;
				});
				else $(this).attr('unselectable', 'on');
			});
		} else {
			return this.each(function () {
				if (browser.msie || browser.safari) $(this).unbind('selectstart');
				else if (browser.mozilla) $(this).css('MozUserSelect', 'inherit');
				else if (browser.opera) $(this).unbind('mousedown');
				else $(this).removeAttr('unselectable', 'on');
			});
		}
	}; //end noSelect
	$.fn.flexSearch = function(p) { // function to search grid
		return this.each( function() { if (this.grid&&this.p.searchitems) this.grid.doSearch(); });
	}; //end flexSearch
	$.fn.closeCheckBox = function(id) { // 清除选择
		if($(this.selector + ' input[value='+id+']').length>0){
			$(this.selector + ' input[value='+id+']')[0].checked = false;
		}
	}; 
	$.fn.selectCheckBox = function(id) { // 添加选择
		if($(this.selector + ' input[value='+id+']').length>0){
			$(this.selector + ' input[value='+id+']')[0].checked = true;
		}
	};
	$.fn.removeAllRow= function (p) {
		//$(this.selector +' tbody').empty();
		$(this.selector).find("tbody").children().remove();
	};
	$.fn.selectedRows = function (p) { // Returns the selected rows as an array, taken and adapted from http://stackoverflow.com/questions/11868404/flexigrid-get-selected-row-columns-values
		var arReturn = [];
		var arRow = [];
		var selector = $(this.selector + ' .trSelected');


		$(selector).each(function (i, row) {
			arRow = [];
			var idr = $(row).data('id');
			$.each(row.cells, function (c, cell) {
				var col = cell.abbr;
				var val = cell.firstChild.innerHTML;
				if (val == '&nbsp;') val = '';      // Trim the content
        		        var idx = cell.cellIndex;                

				arRow.push({
					Column: col,        // Column identifier
					Value: val,         // Column value
					CellIndex: idx,     // Cell index
					RowIdentifier: idr  // Identifier of this row element
				});
			});
			arReturn.push(arRow);
		});
		return arReturn;
	};
})(jQuery);
