$(window).ready(function(){
    $('#investorCertification .verification-code-btn').click(function(){
        settime($(this));
    })

    init_city_input();
    initCropImage();
	set_select_element();
	select_investor_indentiter();
	set_identiter_content_btn_status();
    initSubmitBtn();
    initInvestorInput();
})

function initInvestorInput(){
    var user = User.get_user_data();
    if(user.phone.length){
        $('.J-phone').val(user.phone);
        $('.J-phone').attr('disabled','disabled');
        $('.J-verification-code').css('display','none');
    }
    if(user.email.length){
        $('.J-email').val(user.email);
        $('.J-email').attr('disabled','disabled');
    }
}

function init_city_input(){
    //$('#investorCertification #city-input').unbind('keypress').bind('keypress',function(event){
    //    if(event.keyCode == "13"){
    //        var input_value = $('#investorCertification #city-input').val();
    //        var has_cities = $('#investorCertification .city-btn');
    //
    //        if(!checkOnlyChineseOrEnlish(input_value)){
    //            setError('#city-input','*请输入英文/中文，不支持特殊字符');
    //            return;
    //        }
    //        for(var i = 0; i < has_cities.length; i++){
    //            if(has_cities.eq(i).val() == input_value){
    //                setError('#city-input','*该城市已输入，请输入其他');
    //                return;
    //            }
    //        }
    //
    //        removeError('#city-input');
    //        $(this).before("<input class='form-control city-btn select' type='button' value='" + input_value + "'>");
    //        $('#investorCertification #city-input').val('');
    //        init_city_input();
    //    }
    //});

    $('#city-input').click(function(){
        $('#citySelectModal').modal('show');
    });

    $('.J-select-city-box .J-city input').unbind('click').click(function(){
        var is_selected = $(this).hasClass('select');

        if(is_selected){
            $(this).removeClass('select');
        }
        if(!is_selected){
            $(this).addClass('select');
        }
        //setHasSelectBox();
    })
}

function setHasSelectBox(){
    var has_select_inputs = $('.J-select-city-box .J-city').find('.select');
    var select_show_box = $('.J-has-select-city');
    var has_city_array = [];

    for(var j=0;j<select_show_box.find('span').length;j++){
        if(select_show_box.eq(j).text() == val && i != j){
            is_repeat = true;
        }
    }
    select_show_box.html('');
    for(var i= 0;i<has_select_inputs.length;i++){
        var val = has_select_inputs.eq(i).val();
        select_show_box.append('<span>'+ val +'</span>')
    }

}

function initCropImage(){
    $('#investorImgInput').click(function(){
        $(this).next().click();
    });

    $('#cropInvestorIconModal .C-J-confirm').click(function(){
        var size = JSON.parse(localStorage.getItem('cropImgSize'));//尺寸及图片的base64在localstorage的cropImgSize里存着
        var primary_width = $("#cropInvestorIconModal .image-box img").width();
        var sourseImg = new Image();
        sourseImg.src = $("#cropInvestorIconModal .image-box img").attr('src');

        var R = sourseImg.width/primary_width;
        var canvas = $("#cropInvestorIconModal .J-canvas")[0];
        var context = canvas.getContext("2d");
        context.drawImage(sourseImg, size.x1*R , size.y1*R, size.w*R, size.h*R, 0, 0, canvas.width, canvas.height);

        $('#investorImg').attr('src',canvas.toDataURL("image/png"));
        $('#cropInvestorIconModal .C-J-cancel').click();
    })
}


function cropImg(o){
    var isIE = navigator.userAgent.indexOf('MSIE') >= 0;
    if (!o.value.match(/.jpg|.gif|.png|.bmp/i)) {
        alert('图片格式无效！');
        return false;
    }
    if(isIE) { //IE浏览器
        $('#cropInvestorIconModal .image-box img').attr('src',o.value);
        $('#cropInvestorIconModal .preview-box img').attr('src',o.value); 
    }
    if(!isIE){
        var file = o.files[0];
        var reader = new FileReader();
        reader.onload = function() {
            var img = new Image();
            img.src = reader.result;
            $('#cropInvestorIconModal .image-box img').attr('src',reader.result);
            $('#cropInvestorIconModal .preview-box img').attr('src',reader.result);
            
        };
        reader.readAsDataURL(file);
    }

    $('#cropInvestorIconModal').modal('show');
    $('#cropInvestorIconModal .image-box img').imgAreaSelect({ 
        aspectRatio: '1:1', 
        handles: true,
        fadeSpeed: 200, 
        onSelectChange: preview 
    });

    reset_img_selector($('#cropInvestorIconModal .image-box img'),100,100);
    $(o).replaceWith('<input type="file" style="display:none" onchange="cropImg(this)">');
}

function preview(img, selection) {
    if (!selection.width || !selection.height)
        return;
    
    var scaleX = 150 / selection.width;
    var scaleY = 150 / selection.height;

    $('#cropInvestorIconModal .preview-box img').css({
        width: Math.round(scaleX * img.width),
        height: Math.round(scaleY * img.height),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });
    localStorage.setItem('cropImgSize', JSON.stringify({'img':$('#cropInvestorIconModal .image-box img').attr('src'),'x1':selection.x1,'y1':selection.y1,'w':selection.width,'h':selection.height})); 
}

function set_select_element(){
	$('#investorCertification .fields .status-flag').click(function(){
		var is_select = $(this).hasClass('select');
		if(is_select){
			$(this).removeClass('select');
		}
		if(!is_select){
			$(this).addClass('select');
		}
	})
	$('#investorCertification .agree-list .status-flag').click(function(){
		var is_select = $(this).hasClass('select');
		if(is_select){
			$(this).removeClass('select');
		}
		if(!is_select){
			$(this).addClass('select');
		}
	})
}

function select_investor_indentiter(){
	$('#investorCertification .identity-box .status-flag').unbind('click').bind('click', function() {
		var is_personal = $(this).parent().hasClass('J-personal-identity');
        var is_selected = $(this).hasClass('select');
        
        if (is_personal && is_selected) {
            $(this).removeClass('select');
            $('#investorCertification .J-organization-identity .status-flag').addClass('select');
        }
        if (is_personal && !is_selected) {
            $(this).addClass('select');
            $('#investorCertification .J-organization-identity .status-flag').removeClass('select');
        }
         if (!is_personal && is_selected) {
            $(this).removeClass('select');
            $('#investorCertification .J-personal-identity .status-flag').addClass('select');
        }
        if (!is_personal && !is_selected) {
            $(this).addClass('select');
            $('#investorCertification .J-personal-identity .status-flag').removeClass('select');
        }
        set_investor_indentiter_content();
    });
}

function set_investor_indentiter_content(){
	var is_personal_show = $('#investorCertification .J-personal-identity .status-flag').hasClass('select');

	$('#investorCertification .content').css('display','none');
	if(is_personal_show){
		$('#investorCertification .personal-content').css('display','block');
	}
	if(!is_personal_show){
		$('#investorCertification .organization-content').css('display','block');
	}
}

function set_identiter_content_btn_status(){
	$('#investorCertification .personal-content .status-flag').click(function(){
		$('#investorCertification .personal-content .status-flag').removeClass('select');
		$(this).addClass('select');
	})
}

function initSubmitBtn(){
    $('#investorCertification .J-submit').click(function(){
        var name = $('#investorCertification .J-name').val(),
            img_src = $('#investorImg').attr('src'),
            phone = $('#investorCertification .J-phone').val(),
            phone_check_code = $('#investorCertification .J-phone-check-code').val(),
            email = $('#investorCertification .J-email').val(),
            at_city = $('#investorCertification .J-at-city').val(),
            company = $('#investorCertification .J-company').val(),
            position = $('#investorCertification .J-position').val(),
            is_organization = $('#investorCertification .J-organization-identity .status-flag').hasClass('select'),
            organization = $('#investorCertification .organization-content input').val(),
            focus_cities = $('#investorCertification .J-focus-city').find('.select'),
            focus_fields = $('#investorCertification .J-focus-fields').find('.select'),
            is_check_agree_list = $('.J-agree-list input').attr('checked');

        var organization_is_OK = true;
        if(is_organization){
            organization_is_OK = organization.length ? true : false;
        }

        if(!checkOnlyChineseOrEnlish(name) || img_src == 'images/pic-default-100.png' || !checkPhone(phone) || ( $('.J-verification-code').css('display')!='none' && !phone_check_code.length) || !checkEmail(email) || !checkOnlyChineseOrEnlish(at_city) || !company.length || !position.length || !organization_is_OK || !focus_cities.length || !focus_fields.length || !is_check_agree_list){
            $('#investorCertification .error-box').html("请完善以上信息");
            $('#investorCertification .error-box').css('display','block');
            return;
        }else{
            $('#investorCertification .error-box').css('display','none');

            var user = User.get_user_data();
            user.logo = img_src;
            user.realname = name;
            user.phone = phone;
            user.email = email;
            user.at_city = at_city;
            user.company = company;
            user.position = position;
            user.focus_cities = [];
            user.focus_fields = [];
            user.is_certified = true;

            for(var i=0; i<focus_cities.length; i++){
                user.focus_cities.push(focus_cities.eq(i).val());
            }

            for(var j=0; j<focus_fields.length; j++){
                user.focus_fields.push(focus_fields.eq(j).attr('alt'));
            }
            User.save(user);

            $('#certifySuccessModel').modal('show');
            initCertifySucessConfirmBtn();
        }
    })
}

function initCertifySucessConfirmBtn(){
    $('#certifySuccessModel .C-J-confirm').click(function(){
        window.location = 'index.html';
    })
}
