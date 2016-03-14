$(function () { 
    // 初始化编辑器
    var ue = UE.getEditor('projectDetailEditor');

	initContentTab(); 
    initInvestListStyle(); //初始化投资列表样式
    initDynamic(); //初始化项目动态
    initLike();    //初始化关注按钮
    initDialog();  //初始化 “约约约” 
    setPartnerBanner();  //初始化团队成员轮播效果
    initDiscussBtn(); //初始化讨论模块的提问按钮

    window.onscroll = function(){
    	setTopTabStatus();
    }

    $('.J_zoom_img_box').hc_zoom();
}) 

function setPartnerBanner(){
	$('.J-partner-bxslider').bxSlider({
        minSlides: 3,
        maxSlides: 3,
           // auto:true,
        adaptiveHeight: true,
        slideWidth: 207,
        slideMargin: 20
    });
}

function initDiscussBtn(){
	$('.J-q-btn-box .q-btn').click(function(){
		$('#myQuestionModel').modal('show');
	})

	$('#myQuestionModel .C-J-confirm').click(function(){
		var q_content = $('#myQuestionModel textarea').val();
		if(!q_content.length){
			setError('#myQuestionModel textarea','*请输入您要提问的问题');
			setTimeout(function(){
				removeError('#myQuestionModel textarea');
			},1500)
			return;
		}
		if(q_content.length){

			//提交成功
			$('#myQuestionModel').modal('hide');
			setTimeout(function(){
				alertImg('问题提交成功');
			},500);	
		}
	})
}

function initContentTab(){
	$('#myDetailTab a').click(function (e) { 
       e.preventDefault();
       $(this).tab('show');
       scrollToContentTab();
    }) 
}

function scrollToContentTab(){
    var top_height = $('.C-project-detail .title-box').height() + 85;
    var scrollTop = document.body.scrollTop;
    if(scrollTop > top_height){
		$(window).scrollTop(top_height);
    }
}

function initDialog(){
	$('.C-J-dialog').click(function(){
		var user = User.get_user_data();
		//if 如果已经约过
		if(user.is_dialoged){
			alertImg('亲，您已经约过了');
		}

		//if没有约过
		if(!user.is_dialoged){
			$('#myDialogModel').modal('show');
		}
	})

	$('#myDialogModel .C-J-confirm').click(function(){
		var content = $('#myDialogModel textarea').val();

		var user = User.get_user_data();
		user.is_dialoged = true;
		User.save(user); //保存“约约约”状态

        $('#myDialogModel').modal('hide');
        setTimeout(function(){
			alertImg('恭喜约成功！');
		},500);	
    })
}

function initDynamicEdit(){
	$('.J-edit-btn').unbind('click').click(function(){
     	var is_editing = $(this).hasClass('editing'); //当前是否正在编辑
     	var edit_status = judgeHasEdting(); //有无正在编辑的动态
     	var num = getNum($(this).attr('id'));
     	var title = $('#dinamicTitle'+num).html();
     	var content = $('#dinamicContent'+num).html();

     	//if 没有正在编辑的动态
     	if(!edit_status.status){
     		$('.C-J-edit-box').slideDown();
     	}

     	//if 有其他动态在编辑
     	if(edit_status.status && !is_editing){
     		if(confirm('有其他动态正在编辑，是否保存？')){
     			$('.J-save-new-dynamic-btn').click(); //保存正在编辑的内容

     		}else{
     			$('#dinamicEdit'+edit_status.index).removeClass('editing');
     		}
     	}

     	$(this).addClass('editing');
 		$('.C-J-edit-box input').focus().val(title);
		UE.getEditor('projectDetailEditor').setContent(content);
    })
}

function initDynamicDelete(){
	$('.J-delete-btn').unbind('click').click(function(){
		var num = getNum($(this).prev().attr('id'));
		var edit_status = judgeHasEdting();
		var is_editing = edit_status.index == num;

		//没有动态正在编辑 或者 本条动态不在编辑状态
		if(!edit_status.status || !is_editing){
			if(confirm('确定要删除本条动态吗？')){
				$('#dynamic' + num).remove();
			}
		}

		//该条动态正在编辑
		if(edit_status.status && is_editing){
			if(confirm('当前动态正在编辑，确定删除？')){
				clearDynamicEditor();
				$('.C-J-edit-box').slideUp('fast');
				$('#dynamic' + num).remove();
			}
		}
	})
}

function initDynamic(){
	initDynamicListID(); //初始化动态列表的id
	initNewDynamicBtn(); //初始化增加动态按钮
	initDynamicDelete(); //初始化删除动态


	initDynamicEdit(); //初始化动态编辑
	initDynamicDetailStatus(); //初始化查看动态详情
}

function initDynamicListID(){
	var DynamicLists = $('#dynamicList .cd-timeline-block');
	for(var i=0; i<DynamicLists.length; i++){
		DynamicLists.eq(i).attr('id','dynamic'+i);
		DynamicLists.eq(i).find('.J-edit-btn').attr('id', 'dinamicEdit'+i);
		DynamicLists.eq(i).find('.J-delete-btn').attr('id', 'dinamicDelete'+i);
		DynamicLists.eq(i).find('.J-title').attr('id', 'dinamicTitle'+i);
		DynamicLists.eq(i).find('.J-content').attr('id', 'dinamicContent'+i);
		DynamicLists.eq(i).find('.J-detail-control').attr('id', 'dinamicDetailControl'+i);
	}
}

function initNewDynamicBtn(){
	$('.C-J-new-dynamic').unbind('click').click(function(){
     	var is_not_show = $('.C-J-edit-box').css('display') == 'none';
     	if(is_not_show){
     		$('.C-J-edit-box').slideDown();
     	} 
    })

    $('.J-cancel-new-dynamic-btn').unbind('click').click(function(){
    	var edit_status = judgeHasEdting();
    	if(edit_status.status){
    		$('#dinamicEdit' + edit_status.index).removeClass('editing');
    	}
    	clearDynamicEditor();
    	$('.C-J-edit-box').slideUp('fast');
    })

    $('.J-save-new-dynamic-btn').unbind('click').click(function(){
    	var title = $('.C-J-edit-box input').val();
    	var content = UE.getEditor('projectDetailEditor').getContent();
    	var edit_status = judgeHasEdting();
    	if(edit_status.status){
    		$('#dinamicTitle' + edit_status.index).html(title);
    		$('#dinamicContent' + edit_status.index).html(content);
    		$('#dinamicEdit' + edit_status.index).removeClass('editing');
    		alertImg('修改成功');
    		scrollToContentTab();
    	}
    	if(!edit_status.status){
    		var current_date = getNowFormatDate();
    		$('#cd-timeline').append('<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"></div><div class="cd-timeline-content"><div class="title-box"><a href="javascript:void(0);" class="comment-slide J-detail-control" ></a><p class="title J-title">'+title+'</p></div><div class="content-box J-content-box" style="display:none;"><a href="javascript:void(0)" class="edit-btn J-edit-btn" ></a><div class="desc J-content">'+content+'</div><a href="javascript:void(0);" class="delete J-delete-btn">刪除</a></div><span class="cd-date">'+current_date+'</span></div></div>');
    		initDynamic();
    		alertImg('添加成功');
    		scrollToContentTab();
    	}
    	
    	clearDynamicEditor();
    	$('.C-J-edit-box').slideUp('fast');
    })
}

function clearDynamicEditor(){
	UE.getEditor('projectDetailEditor').setContent('');
	$('.C-J-edit-box input').val('');
}

function judgeHasEdting(){
	var edit_btns = $('.J-edit-btn');
	var is_editing = false;
	var index = '';
	for(var i = 0; i < edit_btns.length; i++){
		if(edit_btns.eq(i).hasClass('editing')){
			is_editing = true;
			index = i;
		}
	}
	return {'status':is_editing,'index':index};
}

function initDynamicDetailStatus(){
	$('.J-detail-control').unbind('click').click(function(){
		var num = getNum($(this).attr('id'));
		var is_up = $(this).hasClass('up');
		var dynamicID = 'dynamic' + num;
		var is_editing = $('#dinamicEdit' + num).hasClass('editing');

		//if 详情展开 并且 该动态正在编辑中
		if(is_up && is_editing){
			if(confirm('该动态正在编辑中，是否保存？')){
				$('.J-save-new-dynamic-btn').click(); //保存正在编辑的内容
			}
			$('#dinamicEdit'+num).removeClass('editing');
			clearDynamicEditor();
			$('.C-J-edit-box').slideUp('fast');
			
			$(this).removeClass('up');
			$('#'+dynamicID).find('.J-content-box').slideUp('fast');
		}

		//if 详情展开 并且 该动态没在编辑
		if(is_up && !is_editing){
			$(this).removeClass('up');
			$('#'+dynamicID).find('.J-content-box').slideUp('fast');
		}

		//if 详情收起
		if(!is_up){
			$(this).addClass('up');
			$('#'+dynamicID).find('.J-content-box').slideDown('fast');
		}
	})

	$('.J-dynamicList .J-title').click(function(){
		var num = getNum($(this).attr('id'));
		$('#dynamic'+num).find('.J-detail-control').click();
	})
}

function initInvestListStyle(){
	var lists = $('#investList li');
	for(var i=0; i<lists.length; i++){
		if(i%2){
			lists.eq(i).addClass('even');
		}else{
			lists.eq(i).addClass('odd');
		}
	}
}	

function initLike(){
	$('.C-J-focus').click(function(){
		var isLiked = $(this).hasClass('liked');
		var num = $(this).find('.J-like-num').html();

		if(isLiked){
			var new_num = parseInt(num) - 1;
			$(this).addClass('unlike');
			$(this).removeClass('liked');
			$(this).find('.desc').html('关注(<span class="J-like-num">'+new_num+'</span>)');
		}
		if(!isLiked){
			var new_num = parseInt(num) + 1;
			$(this).addClass('liked');
			$(this).removeClass('unlike');
			$(this).find('.desc').html('已关注(<span class="J-like-num">'+new_num+'</span>)');
		}
	})
}

function setTopTabStatus(){
	var scrollTop = document.body.scrollTop;
	var top_height = $('.C-project-detail .title-box').height() + 85;
	
	if(scrollTop < top_height){
		$('.J-tab-box').removeClass('C-fixed');
	}
	if(! (scrollTop < top_height)){
		$('.J-tab-box').addClass('C-fixed');
	}
}
      

   
