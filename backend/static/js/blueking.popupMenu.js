/*
**  右键菜单
*/
BLUEKING.popupMenu = (function(){
	return {
		init : function(){
			$('.popup-menu').on('contextmenu', function(){
				return false;
			});
			//动态控制多级菜单的显示位置
			$('body').on('mouseenter', '.popup-menu li', function(){
				if($(this).children('.popup-menu').length == 1){
					$(this).children('a').addClass('focus');
					$(this).children('.popup-menu').show();
					if($(this).parents('.popup-menu').offset().left + $(this).parents('.popup-menu').width() * 2 + 10 < $(window).width()){
						$(this).children('.popup-menu').css({
							left : $(this).parents('.popup-menu').width() - 5,
							top : 0
						});
					}else{
						$(this).children('.popup-menu').css({
							left : -1 * $(this).parents('.popup-menu').width(),
							top : 0
						});
					}
					if($(this).children('.popup-menu').offset().top + $(this).children('.popup-menu').height() + 10 > $(window).height()){
						$(this).children('.popup-menu').css({
							top : $(window).height() - $(this).children('.popup-menu').height() - $(this).children('.popup-menu').offset().top - 10
						});
					}
				}
			}).on('mouseleave', '.popup-menu li', function(){
				$(this).children('a').removeClass('focus');
				$(this).children('.popup-menu').hide();
			});
		},
		/*
		**  应用右键
		*/
		app : function(obj){
			BLUEKING.window.show2under();
			if(!TEMP.popupMenuApp){
				TEMP.popupMenuApp = $(
					'<div class="popup-menu app-menu"><ul>'+
						'<li style="border-bottom:1px solid #F0F0F0"><a menu="open" href="javascript:;">' + gettext('打开') + '</a></li>'+
						'<li>'+
							'<a menu="move" href="javascript:;">' + gettext('移动到') + '<b class="arrow">»</b></a>'+
							'<div class="popup-menu"><ul>'+
								'<li><a menu="moveto" desk="1" href="javascript:;">' + gettext('桌面1') + '</a></li>'+
								'<li><a menu="moveto" desk="2" href="javascript:;">' + gettext('桌面2')+ '</a></li>'+
								'<li><a menu="moveto" desk="3" href="javascript:;">' + gettext('桌面3')+ '</a></li>'+
								'<li><a menu="moveto" desk="4" href="javascript:;">' + gettext('桌面4')+ '</a></li>'+
								'<li><a menu="moveto" desk="5" href="javascript:;">' + gettext('桌面5')+ '</a></li>'+
							'</ul></div>'+
						'</li>'+
						'<li style="border-bottom:1px solid #F0F0F0"><a menu="copy_url" id="copy_url_body" href="javascript:;">' + gettext('复制宣传链接') + '</a></li>'+
						'<li><a menu="del" href="javascript:;"><b class="uninstall"></b>' + gettext('卸载') + '</a></li>'+
					'</ul></div>'
				);
				$('body').append(TEMP.popupMenuApp);
				//存放app宣传链接值
				$('body').append('<input name="copy_url" type="hidden">');
				$('.app-menu').on('contextmenu', function(){
					return false;
				});
			}
			//复制宣传链接绑定
			$('.app-menu').show();
			$('input[name=copy_url]').val(BLUEKING.corefunc.get_bk_url() + '?app=' + $(obj).attr('appcode'));
			var is_has_zclip = $('#copy_url_body').next().html();
			if(!is_has_zclip){
				var clip = new ClipboardJS("#copy_url_body", {
					text: function(trigger) {
						return $('input[name=copy_url]').val();
					}
				});
				clip.on('success',function(){
				  art.dialog({
						title:gettext( "温馨提示"),
						width: 340,
						icon: 'succeed',
						lock: false,
						fixed:true,
						content: gettext('复制成功！您可以使用ctrl+v进行粘贴！'),
						okVal: gettext("关闭"),
						time: 3
				  }).time(2)
					$('.popup-menu').hide();
				});
			}
			// 对同一个桌面的应用禁止点击移动到该桌面
			$('.app-menu a[menu="moveto"]').removeClass('disabled');
			if(obj.parent().hasClass('desktop-apps-container')){
				$('.app-menu a[menu="moveto"]').each(function(){
					if($(this).attr('desk') == BLUEKING.CONFIG.desk){
						$(this).addClass('disabled');
					}
				});
			}
			//绑定鼠标在右键菜单上移动（over，out）事件
			$('.app-menu li').off('mouseover').off('mouseout').on('mouseover', function(){
				if($(this).children('a').attr('menu') == 'move'){
					$(this).children('a').addClass('focus');
					if($(document).width() - $('.app-menu').offset().left > 250){
						$(this).children('div').css({
							left : 122,
							top : -2
						});
					}else{
						$(this).children('div').css({
							left : -126,
							top : -2
						});
					}
					$(this).children('div').show();
				}else if($(this).children('a').attr('menu') == 'copy_url'){
					$(this).children('a').addClass('focus');
				}
			}).on('mouseout', function(){
				$(this).children('a').removeClass('focus');
				if($(this).children('a').attr('menu') != "copy_url"){
					$(this).children('div').hide();
				}
			});
			//绑定移动应用鼠标点击事件
			$('.app-menu a[menu="moveto"]').off('click').on('click', function(){
				var id = obj.attr('appid'),
				from = obj.index(),
				to = 99999,
				todesk = $(this).attr('desk'),
				fromdesk = BLUEKING.CONFIG.desk,
				fromfolderid = obj.parents('.folder-window').attr('appid') || obj.parents('.quick_view_container').attr('appid');
				if(!BLUEKING.app.checkIsMoving()){
					var rtn = false;
					if(obj.parent().hasClass('desktop-apps-container')){
						if(BLUEKING.app.dataDeskToOtherdesk(id, from, to, 'a', todesk, fromdesk)){
							$.ajax({
								type : 'POST',
								url : urlPrefix + 'move_my_app/' + id + '/',
								data : 'fromdesk='+ fromdesk +'&todesk=' + todesk,
								success : function(){
									BLUEKING.VAR.isAppMoving = false;
								}
							});
						}
					}else if(!obj.parent().hasClass('dock-applist')){
						if(BLUEKING.app.dataFolderToOtherdesk(id, from, todesk, fromfolderid)){
							// 如果是从文件夹里移动，则使用参数fromfolder
							$.ajax({
								type : 'POST',
								url : urlPrefix + 'move_my_app/' + id + '/',
								data : 'fromfolder='+ fromfolderid +'&todesk=' + todesk,
								success : function(){
									BLUEKING.VAR.isAppMoving = false;
								}
							});
						}
					}
				}
				$('.popup-menu').hide();
			});
			// 打开应用
			$('.app-menu a[menu="open"]').off('click').on('click', function(){
				BLUEKING.window.create(obj.attr('appid'));
				$('.popup-menu').hide();
			});
			// 卸载应用
			$('.app-menu a[menu="del"]').off('click').on('click', function(){
				BLUEKING.app.dataDeleteByAppid(obj.attr('appid'));
				BLUEKING.app.remove(obj.attr('appid'), function(){
					obj.find('img, span').show().animate({
						opacity : 'toggle',
						width : 0,
						height : 0
					}, 500, function(){
						obj.remove();
						BLUEKING.deskTop.resize();
					});
				});
				$('.popup-menu').hide();
			});
			return TEMP.popupMenuApp;
		},
		/*
		**  文件夹右键
		*/
		folder : function(obj){
			BLUEKING.window.show2under();
			if(!TEMP.popupMenuFolder){
				TEMP.popupMenuFolder = $(
					'<div class="popup-menu folder-menu"><ul>'+
						'<li><a menu="view" href="javascript:;">' + gettext('预览') + '</a></li>'+
						'<li style="border-bottom:1px solid #F0F0F0"><a menu="open" href="javascript:;">' + gettext('打开') + '</a></li>'+
						'<li>'+
							'<a menu="move" href="javascript:;">' + gettext('移动到') + '<b class="arrow">»</b></a>'+
							'<div class="popup-menu"><ul>'+
								'<li><a menu="moveto" desk="1" href="javascript:;">' + gettext('桌面1') + '</a></li>'+
								'<li><a menu="moveto" desk="2" href="javascript:;">' + gettext('桌面2') + '</a></li>'+
								'<li><a menu="moveto" desk="3" href="javascript:;">' + gettext('桌面3') + '</a></li>'+
								'<li><a menu="moveto" desk="4" href="javascript:;">' + gettext('桌面4') + '</a></li>'+
								'<li><a menu="moveto" desk="5" href="javascript:;">' + gettext('桌面5') + '</a></li>'+
							'</ul></div>'+
						'</li>'+
						'<li><a menu="rename" href="javascript:;"><b class="edit"></b>' + gettext('重命名') + '</a></li>'+
						'<li><a menu="del" href="javascript:;"><b class="del"></b>' + gettext('删除') + '</a></li>'+
					'</ul></div>'
				);
				$('body').append(TEMP.popupMenuFolder);
			}
			// 对同一个桌面的应用禁止点击移动到该桌面
			$('.folder-menu a[menu="moveto"]').removeClass('disabled');
			if(obj.parent().hasClass('desktop-apps-container')){
				$('.folder-menu a[menu="moveto"]').each(function(){
					if($(this).attr('desk') == BLUEKING.CONFIG.desk){
						$(this).addClass('disabled');
					}
				});
			}
			//绑定预览点击事件
			$('.folder-menu a[menu="view"]').off('click').on('click', function(){
				BLUEKING.folderView.get(obj);
				$('.popup-menu').hide();
			});
			// 打开文件夹窗口
			$('.folder-menu a[menu="open"]').off('click').on('click', function(){
				BLUEKING.window.create(obj.attr('appid'), obj.attr('type'));
				$('.popup-menu').hide();
			});
			// 绑定文件夹移动点击事件
			$('.folder-menu a[menu="moveto"]').off('click').on('click', function(){
				var id = obj.attr('appid'),
				from = obj.index(),
				to = 99999,
				todesk = $(this).attr('desk'),
				fromdesk = BLUEKING.CONFIG.desk,
				fromfolderid = obj.parents('.folder-window').attr('appid') || obj.parents('.quick_view_container').attr('appid');
				var rtn = false;
				if(obj.parent().hasClass('desktop-apps-container')){
					if(BLUEKING.app.dataDeskToOtherdesk(id, from, to, 'a', todesk, fromdesk)){
						$.ajax({
							type : 'POST',
							url : urlPrefix + 'move_my_app/' + id + '/',
							data : 'fromdesk='+ fromdesk +'&todesk=' + todesk,
							success : function(){
								BLUEKING.VAR.isAppMoving = false;
							}
						});
					}
				}
				$('.popup-menu').hide();
			});
			// 重命名文件夹
			$('.folder-menu a[menu="rename"]').off('click').on('click', function(){
				$.dialog({
					id : 'addfolder',
					title : gettext('重命名“') + obj.find('span').text() + gettext('”文件夹'),
					padding : 0,
					content : editFolderDialogTemp({
						'name' : obj.find('span').text(),
						'src' : obj.find('img').attr('src')
					}),
					ok : function(){
						if($('#folderName').val() != ''){
							if($('#folderName').val().length > 10){
								$('#folderName').focus();
								$('.folderNameError').html(gettext("文件夹名称不能超过10个字符")).show();
								return false;
							}
							$.ajax({
								type : 'POST',
								url : urlPrefix + 'update_folder/' + obj.attr('appid') + '/',
								data : 'name=' + $('#folderName').val() + '&icon=' + $('.folderSelector img').attr('src'),
								success : function(msg){
									var msg = parseInt(msg);
									if(msg==1){
										BLUEKING.app.get();
									}else if(msg==2){
										ZENG.msgbox.show(gettext("文件夹名已存在！"), 1, 2000);
									}else{
										ZENG.msgbox.show(gettext('重命名失败！'), 5, 2000);
									}
								}
							});
						}else{
							$('.folderNameError').show();
							return false;
						}
					},
					cancel : true,
					okVal: gettext('确定'),
                	cancelVal: gettext('取消'),
				});
				$('.folderSelector').off('click').on('click', function(){
					$('.fcDropdown').show();
				});
				$('.fcDropdown_item').off('click').on('click', function(){
					$('.folderSelector img').attr('src', $(this).children('img').attr('src')).attr('idx', $(this).children('img').attr('idx'));
					$('.fcDropdown').hide();
				});
				$('.popup-menu').hide();
			});
			// 删除文件夹
			$('.folder-menu a[menu="del"]').off('click').on('click', function(){
				BLUEKING.app.remove(obj.attr('appid'), function(){
					BLUEKING.app.dataDeleteByAppid(obj.attr('appid'));
					obj.find('img, span').show().animate({
						opacity : 'toggle',
						width : 0,
						height : 0
					}, 500, function(){
						obj.remove();
						BLUEKING.deskTop.resize();
					});
				});
				$('.popup-menu').hide();
			});
			return TEMP.popupMenuFolder;
		},
		/*
		**  应用码头右键
		*/
		dock : function(){
			BLUEKING.window.show2under();
			if(!TEMP.popupMenuDock){
				TEMP.popupMenuDock = $(
					'<div class="popup-menu dock-menu"><ul>'+
						'<li><a menu="dockPos" pos="top" href="javascript:;"><b class="hook"></b>' + gettext('向上停靠') + '</a></li>'+
						'<li><a menu="dockPos" pos="left" href="javascript:;"><b class="hook"></b>' + gettext('向左停靠') + '</a></li>'+
						'<li><a menu="dockPos" pos="right" href="javascript:;"><b class="hook"></b>' + gettext('向右停靠') + '</a></li>'+
					'</ul></div>'
				);
				$('body').append(TEMP.popupMenuDock);
				//绑定事件
				$('.dock-menu a[menu="dockPos"]').on('click', function(){
					BLUEKING.dock.updatePos($(this).attr('pos'));
					$('.popup-menu').hide();
				});
			}
			$('.dock-menu a[menu="dockPos"]').each(function(){
				$(this).children('.hook').hide();
				if($(this).attr('pos') == BLUEKING.CONFIG.dockPos){
					$(this).children('.hook').show();
				}
				$('.popup-menu').hide();
			});
			return TEMP.popupMenuDock;
		},
		/*
		**  任务栏右键
		*/
		task : function(obj){
			BLUEKING.window.show2under();
			if(!TEMP.popupMenuTask){
				TEMP.popupMenuTask = $(
					'<div class="popup-menu task-menu"><ul>'+
						'<li><a menu="show" href="javascript:;">' + gettext('还原') + '</a></li>'+
						'<li style="border-bottom:1px solid #F0F0F0"><a menu="hide" href="javascript:;">' + gettext('最小化') + '</a></li>'+
						'<li><a menu="close" href="javascript:;">' + gettext('关闭') + '</a></li>'+
					'</ul></div>'
				);
				$('body').append(TEMP.popupMenuTask);
			}
			if($('#w_' + obj.attr('appid')).attr('state') == 'hide'){
				$('.task-menu a[menu="show"]').parent().show();
				$('.task-menu a[menu="hide"]').parent().hide();
			}else{
				$('.task-menu a[menu="show"]').parent().hide();
				$('.task-menu a[menu="hide"]').parent().show();
			}
			//绑定事件
			$('.task-menu a[menu="show"]').off('click').on('click', function(){
				BLUEKING.window.show2top(obj.attr('appid'));
				$('.popup-menu').hide();
			});
			$('.task-menu a[menu="hide"]').off('click').on('click', function(){
				BLUEKING.window.hide(obj.attr('appid'));
				$('.popup-menu').hide();
			});
			$('.task-menu a[menu="close"]').off('click').on('click', function(){
				BLUEKING.window.close(obj.attr('appid'));
				$('.popup-menu').hide();
			});
			return TEMP.popupMenuTask;
		},
		/*
		 * 新建文件夹
		*/
		open_create_folder: function(){
			$.dialog({
				id : 'addfolder',
				title : gettext('新建文件夹'),
				padding : 0,
				content : editFolderDialogTemp({
					'name' : gettext('新建文件夹'),
					'src' : staticUrl + 'img/base_ui/folder_default.png'
				}),
				ok : function(){
					if($('#folderName').val() != ''){
						if($('#folderName').val().length > 10){
							$('#folderName').focus();
							$('.folderNameError').html(gettext("文件夹名称不能超过10个字符")).show();
							return false;
						}
						var msg = 1;
						$.ajax({
							type : 'POST',
							url : urlPrefix + 'add_folder/',
							async : false,
							data : 'name=' + $('#folderName').val() + '&icon=' + $('.folderSelector img').attr('src') + '&desk=' + BLUEKING.CONFIG.desk,
							success : function(_msg){
								msg = parseInt(_msg);
							}
						});
						if(msg==1){
							BLUEKING.app.get();
						}else if(msg==2){
							$('#folderName').focus();
							$('.folderNameError').html(gettext("文件夹名已存在")).show();
							return false;
						}else{
							ZENG.msgbox.show(gettext('文件夹创建失败！'), 5, 2000);
						}
					}else{
						$('#folderName').focus();
						$('.folderNameError').html(gettext("文件夹名称不能只包含空字符")).show();
						$('.folderNameError').show();
						return false;
					}
				},
				cancel : true,
				okVal: gettext('确定'),
                cancelVal: gettext('取消'),
			});
		},
		/*
		**  桌面右键
		*/
		desk : function(){
			BLUEKING.window.show2under();
			if(!TEMP.popupMenuDesk){
				TEMP.popupMenuDesk = $(
					'<div class="popup-menu desk-menu"><ul>'+
						'<li><a menu="hideall" href="javascript:;">' + gettext('显示桌面') + '</a></li>'+
						'<li><a menu="refresh" href="javascript:;">' + gettext('刷新') + '</a></li>'+
						'<li style="border-bottom:1px solid #F0F0F0"><a menu="closeall" href="javascript:;">' + gettext('关闭所有应用') + '</a></li>'+
						'<li>'+
							'<a href="javascript:;">' + gettext('新建') + '<b class="arrow">»</b></a>'+
							'<div class="popup-menu"><ul>'+
								'<li><a menu="addfolder" href="javascript:;"><b class="folder"></b>' + gettext('新建文件夹') + '</a></li>'+
							'</ul></div>'+
						'</li>'+
						'<li><a menu="themes" href="javascript:;"><b class="themes"></b>' + gettext('主题设置') + '</a></li>'+
						'<li><a menu="setting" href="javascript:;"><b class="setting"></b>' + gettext('布局设置') + '</a></li>'+
						'<li><a href="javascript:;">' + gettext("语言") + '<b class="arrow">»</b></a>' +
							'<div class="popup-menu"><ul>'+
								'<li><a menu="language" language="en" href="javascript:;"><b class="hook"></b>' + gettext('English') + '</a></li>'+
								'<li><a menu="language" language="zh-hans" href="javascript:;"><b class="hook"></b>' + gettext('简体中文') + '</a></li>'+
							'</ul></div>'+
						'</li>'+
						'<li style="border-bottom:1px solid #F0F0F0">'+
							'<a href="javascript:;">' + gettext('图标设置') + '<b class="arrow">»</b></a>'+
							'<div class="popup-menu"><ul>'+
								'<li>'+
									'<a href="javascript:;">' + gettext('排列') + '<b class="arrow">»</b></a>'+
									'<div class="popup-menu"><ul>'+
										'<li><a menu="orderby" orderby="x" href="javascript:;"><b class="hook"></b>' + gettext('横向排列') + '</a></li>'+
										'<li><a menu="orderby" orderby="y" href="javascript:;"><b class="hook"></b>' + gettext('纵向排列') + '</a></li>'+
									'</ul></div>'+
								'</li>'+
							'</ul></div>'+
						'</li>'+
						'<li><a menu="logout" href="javascript:;">' + gettext('注销') + '</a></li>'+
					'</ul></div>'
				);
				$('body').append(TEMP.popupMenuDesk);
				//语言切换
				$('.desk-menu a[menu="language"]').on('click', function(){
					BLUEKING.base.setLanguage($(this).attr('language'), function() {
					    location.reload(true);
					    $('.popup-menu').hide();
                    });
				});
				// 图标排列（横或者竖）
				$('.desk-menu a[menu="orderby"]').on('click', function(){
					BLUEKING.app.updateXY($(this).attr('orderby'));
					$('.popup-menu').hide();
				});
				// 显示桌面即最小化所有应用
				$('.desk-menu a[menu="hideall"]').on('click', function(){
					BLUEKING.window.hideAll();
					$('.popup-menu').hide();
				});
				// 刷新整个页面
				$('.desk-menu a[menu="refresh"]').on('click', function(){
					location.reload(true);
					$('.popup-menu').hide();
				});
				// 关闭所有应用
				$('.desk-menu a[menu="closeall"]').on('click', function(){
					BLUEKING.window.closeAll();
					$('.popup-menu').hide();
				});
				// 新增文件夹
				$('.desk-menu a[menu="addfolder"]').on('click', function(){
					BLUEKING.popupMenu.open_create_folder();
					$('.popup-menu').hide();
				});
				// 设置主题
				$('.desk-menu a[menu="themes"]').on('click', function(){
					BLUEKING.window.create_theme_window();
					$('.popup-menu').hide();
				});
				// 设置布局
				$('.desk-menu a[menu="setting"]').on('click', function(){
					BLUEKING.window.create_setting_window();
					$('.popup-menu').hide();
				});
				// 注销登录
				$('.desk-menu a[menu="logout"]').on('click', function(){
					BLUEKING.base.logout();
					$('.popup-menu').hide();
				});
			}
			$('.desk-menu a[menu="orderby"]').each(function(){
				$(this).children('.hook').hide();
				if($(this).attr('orderby') == BLUEKING.CONFIG.appXY){
					$(this).children('.hook').show();
				}
				$('.popup-menu').hide();
			});
			return TEMP.popupMenuDesk;
		},
		hide : function(){
			$('.popup-menu').hide();
		}
	}
})();
