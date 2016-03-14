$(function() {
	//步骤表单初始化
    $('#CreateProjectForm').formToWizard({
        submitButton: 'submitform'
    });

    //日期初始化
    $.ms_DatePicker({
        YearSelector: ".sel_year",
        MonthSelector: ".sel_month",
        DaySelector: ".sel_day"
    });

    init_project_release_page();
    initSampleImgShow();
    initSubmit(); //初始化表单提交按钮

    var ue = UE.getEditor('descDetailEditor');

    setNextStepClick(); //初始化下一步按钮事件
    setReturnBtn(); 
});

function initSubmit(){
    $('#submitform .J-submit-draft').click(function(){
        var financer_name = $('#step4 .J-name').val(),
            financer_phone = $('#step4 .J-phone').val(),
            financer_email = $('#step4 .J-email').val();

        if(!checkOnlyChineseOrEnlish(financer_name)){
            setError('#step4 .J-name','*请输入中文或英文字符，不允许特殊字符');
            $('#step4 .J-name').focus();
            return;
        }
        if(!checkPhone(financer_phone)){
            setError('#step4 .J-phone','*请输入正确的手机号码');
            $('#step4 .J-phone').focus();
            return;
        }
        if(!checkEmail(financer_email)){
            setError('#step4 .J-email','*请输入正确的邮箱地址');
            $('#step4 .J-email').focus();
            return;
        }

        $('#myProjectDraftModel').modal('show');
    })

    $('#submitform .J-submit').click(function(){
        var financer_name = $('#step4 .J-name').val(),
            financer_phone = $('#step4 .J-phone').val(),
            financer_email = $('#step4 .J-email').val();
        var is_checked = $('.J-checkbox').attr('checked') == 'checked';

        if(!checkOnlyChineseOrEnlish(financer_name)){
            setError('#step4 .J-name','*请输入中文或英文字符，不允许特殊字符');
            $('#step4 .J-name').focus();
            return;
        }
        if(!checkPhone(financer_phone)){
            setError('#step4 .J-phone','*请输入正确的手机号码');
            $('#step4 .J-phone').focus();
            return;
        }
        if(!checkEmail(financer_email)){
            setError('#step4 .J-email','*请输入正确的邮箱地址');
            $('#step4 .J-email').focus();
            return;
        }
        if(!is_checked){
            $('#step4 .error-box').html('*请阅读相关条款');
            $('#step4 .error-box').css('display','block');
            return;
        }

        $('#step4 .error-box').css('display','none');
        $('#myProjectReleaseModel').modal('show');
    })

    $('#myProjectReleaseModel .C-J-confirm').click(function(){
        alert('提交数据');

        $('#myProjectReleaseModel').modal('hide');
        window.location = "account.html#financing";
    })
}

function initSampleImgShow(){
    $('.J-short-desc').focus(function(){
        $('.J-short-desc-sample').show();
    })
    $('.J-short-desc').blur(function(){
        $('.J-short-desc-sample').hide();
    })

    $('.J-return-content').focus(function(){
        $(this).parent().parent().find('.J-short-return-sample').show();
    })
    $('.J-return-content').blur(function(){
        $(this).parent().parent().find('.J-short-return-sample').hide();
    })
}

function init_project_release_page() {
	//投资档、创始人显示初始化
    set_investment_box();
    set_partner_box();

    //所属领域初始化
    select_field();
    select_investment_partner();

    //初始化 增加、删除投资档或者合伙人模块
    add_new_investment();
    delete_investment();
    add_new_partner();
    delete_partner();
    

    //插入图片初始化
    basic_img_input();
    gift_img_input();
    partner_img_input();
}

function basic_img_input() {
    $('#CreateProjectForm .J-img-select').click(function() {
        removeError('.J-img-select');
        $('#projectBasicImgInput').click();
    });

    $('#projectBasicImgCropModal .C-J-confirm').click(function(){
        var size = JSON.parse(localStorage.getItem('cropImgSize'));//尺寸在localstorage的cropImgSize里存着
        var primary_width = $("#projectBasicImgCropModal .image-box img").width();
        var sourseImg = new Image();
        sourseImg.src = $("#projectBasicImgCropModal .image-box img").attr('src');

        var R = sourseImg.width/primary_width;
        var canvas = $("#projectBasicImgCropModal .J-canvas")[0];
        var context = canvas.getContext("2d");
        context.drawImage(sourseImg, size.x1*R , size.y1*R, size.w*R, size.h*R, 0, 0, canvas.width, canvas.height);
        $('#projectBasicImgCropModal .C-J-cancel').click();

        $('#projectBasicImgPrev').html('');
        $('#projectBasicImgPrev').append("<a class='img-a'><img src='" + canvas.toDataURL("image/png") + "'/></a>");
    })
}

function gift_img_input() {
    $('#CreateProjectForm .gift-img-input').unbind('click').click(function() {
        $(this).prev().unbind('click').click();
    });

    $('#giftImgCropModal .C-J-confirm').unbind('click').click(function(){
        var size = JSON.parse(localStorage.getItem('cropImgSize'));//尺寸在localstorage的cropImgSize里存着
        var primary_width = $("#giftImgCropModal .image-box img").width();
        var sourseImg = new Image();
        sourseImg.src = $("#giftImgCropModal .image-box img").attr('src');

        var R = sourseImg.width/primary_width;
        var canvas = $("#giftImgCropModal .J-canvas")[0];
        var context = canvas.getContext("2d");
        context.drawImage(sourseImg, size.x1*R , size.y1*R, size.w*R, size.h*R, 0, 0, canvas.width, canvas.height);
        $('#giftImgCropModal .C-J-cancel').click();
        var current_input_id = localStorage.getItem('currentGiftInputID');

        $('#'+current_input_id).before("<a class='img-a'><img src='" + canvas.toDataURL("image/png") + "'/><div class='close'>×</div></a>");
        $('#CreateProjectForm .close').unbind('click').click(function(){
            $(this).parent().remove();
        });
        
    })

}

function partner_img_input() {
    $('#CreateProjectForm .J-partner-img-input').unbind('click').click(function() {
        removeError(this);
        $(this).next().unbind('click').click();
    });

    $('#partnerImgCropModal .C-J-confirm').unbind('click').click(function(){
        var size = JSON.parse(localStorage.getItem('cropImgSize'));//尺寸在localstorage的cropImgSize里存着
        var primary_width = $("#partnerImgCropModal .image-box img").width();
        var sourseImg = new Image();
        sourseImg.src = $("#partnerImgCropModal .image-box img").attr('src');

        var R = sourseImg.width/primary_width;
        var canvas = $("#partnerImgCropModal .J-canvas")[0];
        var context = canvas.getContext("2d");
        context.drawImage(sourseImg, size.x1*R , size.y1*R, size.w*R, size.h*R, 0, 0, canvas.width, canvas.height);
        $('#partnerImgCropModal .C-J-cancel').click();

        var current_input_id = localStorage.getItem('currentPartnerInputID');
        var input_num = getNum(current_input_id);
        $('.prev-box-' + input_num).html('');
        $('.prev-box-' + input_num).append("<a class='img-a'><img src='" + canvas.toDataURL("image/png") + "'/></a>");
    })
}

function select_field() {
    $('#CreateProjectForm .field input').bind('click', function() {
        var selected_input =  $('#CreateProjectForm .field input.select');
        var is_selected = $(this).hasClass('select');
        
        if (is_selected) {
            if(selected_input.length==1){
                alertImg('最后一个不能删哦！');
            }else{
                $(this).removeClass('select');
            }
        }
        if (!is_selected) {
            if(selected_input.length>2){
                alertImg('最多只能选三个哦！');
            }else{
                $(this).addClass('select');
            }
        }
    });
}

function select_investment_partner(){
	$('#CreateProjectForm .title .status-flag').unbind('click').bind('click', function() {
        var is_selected = $(this).hasClass('select');
        
        if (is_selected) {
            $(this).removeClass('select');
        }
        if (!is_selected) {
            $(this).addClass('select');
        }
    });
}

function click_add_investment(){
     $('.investment .add-btn').click();
} 

function click_delete_investment(){
    $('.investment .delete-btn').click();
}

function click_add_partner(){
    $('.partner .add-btn').click();
}

function click_delete_partner(){
    $('.partner .delete-btn').click();
}

function add_new_investment() {
    $('.investment .add-btn').click(function() {
        $('.investment').before($('#modelInvestment').text());
        set_investment_box();
        setReturnBtn();
        gift_img_input();
        select_investment_partner();
        $.ms_DatePicker({
	        YearSelector: ".sel_year",
	        MonthSelector: ".sel_month",
	        DaySelector: ".sel_day"
	    });
        cancel_delete_investment();
        initSampleImgShow();
    });
}

function cancel_delete_investment(){
    $('.investment-box .action-btns').css('display','none');
    $('.investment-box .title .status-flag').css('display','none');
    $('.investment-box .title .status-flag').removeClass('select').css('display','none');
}

function delete_investment() {
    $('.investment .delete-btn').click(function() {
         var investment_box = $('.investment-box');
        if(investment_box.length == 1){
            alertImg('最后一个档位不可以删哦！');
        }
        if(investment_box.length > 1){
            $('.investment-box .title .status-flag').css('display','block');
            $('.investment-box .title .status-flag').click(function(){
                $('.investment-box .action-delete').unbind('click').click(function(){
                    if(confirm('确定要删除这挡投资吗？')){
                        $(this).parent().parent().parent().remove();
                        $('.investment-box').find('.title .status-flag').css('display','none');
                        set_investment_box();
                        setReturnBtn();
                    }
                })

                $('.investment-box .action-cancel').click(function(){
                    cancel_delete_investment();
                })

                if($(this).hasClass('select')){
                    $(this).parent().parent().find('.action-btns').css('display','block');
                }
                if(!$(this).hasClass('select')){
                    $(this).parent().parent().find('.action-btns').css('display','none');
                }
            })  
        }
    });
}

function set_investment_box() {
    var investments = $('.investment-box');
    for (var i = 0; i < investments.length; i++) {
        var capital_num = num_to_capital(i + 1);
        var gift_imgs_input_id = 'gift_img_input_' + i;
        var status_flag_class = 'investment_flag_' + i;

        $('.investment-box').eq(i).addClass('box-' + i).find('.investment-num').html(capital_num);
        $('.investment-box').eq(i).find('.img-input-file').attr('id', gift_imgs_input_id);
        $('.investment-box').eq(i).find('.title .status-flag').attr('id',status_flag_class);
    }
    $('#step2 .error-box').css('display','none');
}

function set_partner_box() {
    var partners = $('.partner-box');
    $('.partner-box .partner-sample').css('display','none');
    $('.partner-box .partner-sample').eq(0).css('display','block');
    for (var i = 0; i < partners.length; i++) {
        var capital_num = num_to_capital(i + 1);
        var partner_img_id = 'partner_img_' + i;
        var img_prev_box_class = 'prev-box-' + i;
        var status_flag_class = 'partner_flag_' + i;
        $('.partner-box').eq(i).addClass('box-' + i).find('.partner-num').html(capital_num);
        $('.partner-box').eq(i).find('.img-input-file').attr('id', partner_img_id);
        $('.partner-box').eq(i).find('.img-prev-box').attr('class','img-prev-box');
        $('.partner-box').eq(i).find('.img-prev-box').addClass(img_prev_box_class);
        $('.partner-box').eq(i).find('.status-flag').attr('id',status_flag_class);
    }
    $('#step3 .error-box').css('display','none');
}

function add_new_partner() {
    $('.partner .add-btn').click(function() {
        $('.partner').before($('#modelPartner').text());
        set_partner_box();
        partner_img_input();
        select_investment_partner();
        cancel_delete_partner();
    });
}

function cancel_delete_partner(){
    $('.partner-box .action-btns').css('display','none');
    $('.partner-box .status-flag').css('display','none');
    $('.partner-box .status-flag').removeClass('select').css('display','none');
}

function delete_partner() {
	$('.partner .delete-btn').click(function() {
        var partner_box = $('.partner-box');
        if(partner_box.length == 1){
            alertImg('最后一个小伙伴不可以删哦！');
        }
        if(partner_box.length > 1){
            $('.partner-box .status-flag').css('display','block');
            $('.partner-box .status-flag').click(function(){
                $('.partner-box .action-delete').unbind('click').click(function(){
                    if(confirm('确定要删除这位小伙伴吗？')){
                        $(this).parent().parent().parent().remove();
                        $('.partner-box').find('.status-flag').css('display','none');

                        set_partner_box();
                    }
                })

                $('.partner-box .action-cancel').click(function(){
                    cancel_delete_partner();
                })

                if($(this).hasClass('select')){
                    $(this).parent().parent().find('.action-btns').css('display','block');
                }
                if(!$(this).hasClass('select')){
                    $(this).parent().parent().find('.action-btns').css('display','none');
                }
            })       
        }
    });
}

function num_to_capital(n) {
    var cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    var s = '';
    n = '' + n; // 数字转为字符串
    for (var i = 0; i < n.length; i++) {
        s += cnum[parseInt(n.charAt(i))];
    }
    return s;
}

function cropBasicImg(o){
    var isIE = navigator.userAgent.indexOf('MSIE') >= 0;
    if (!o.value.match(/.jpg|.gif|.png|.bmp/i)) {
        alert('图片格式无效！');
        return false;
    }
    if(isIE) { //IE浏览器
        $('#projectBasicImgCropModal .image-box img').attr('src',o.value);
        $('#projectBasicImgCropModal .preview-box img').attr('src',o.value); 
    }
    if(!isIE){
        var file = o.files[0];
        var reader = new FileReader();
        reader.onload = function() {
            var img = new Image();
            img.src = reader.result;
            $('#projectBasicImgCropModal .image-box img').attr('src',reader.result);
            $('#projectBasicImgCropModal .preview-box img').attr('src',reader.result);
            
        };
        reader.readAsDataURL(file);
    }

    $('#projectBasicImgCropModal').modal('show');
    $('#projectBasicImgCropModal .image-box img').imgAreaSelect({ 
        aspectRatio: '54:30', 
        handles: true,
        fadeSpeed: 200, 
        onSelectChange: basicImgPreview 
    });

    reset_img_selector($('#projectBasicImgCropModal .image-box img'),150,83);

    $(o).replaceWith('<input style="display:none" type="file" id="projectBasicImgInput" onchange="cropBasicImg(this)" alt="projectBasicImgCropModal">');
}

function basicImgPreview(img, selection) {
    if (!selection.width || !selection.height)
        return;
    
    var scaleX = 150 / selection.width;
    var scaleY = 83 / selection.height;

    $('#projectBasicImgCropModal .preview-box img').css({
        width: Math.round(scaleX * img.width),
        height: Math.round(scaleY * img.height),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });
    localStorage.setItem('cropImgSize', JSON.stringify({'x1':selection.x1,'y1':selection.y1,'w':selection.width,'h':selection.height})); 
}

function cropGiftImg(o){
    var isIE = navigator.userAgent.indexOf('MSIE') >= 0;
    localStorage.setItem('currentGiftInputID',$(o).attr('id'));
    if (!o.value.match(/.jpg|.gif|.png|.bmp/i)) {
        alert('图片格式无效！');
        return false;
    }
    if(isIE) { //IE浏览器
        $('#giftImgCropModal .image-box img').attr('src',o.value);
        $('#giftImgCropModal .preview-box img').attr('src',o.value); 
    }
    if(!isIE){
        var file = o.files[0];
        var reader = new FileReader();
        reader.onload = function() {
            var img = new Image();
            img.src = reader.result;
            $('#giftImgCropModal .image-box img').attr('src',reader.result);
            $('#giftImgCropModal .preview-box img').attr('src',reader.result);
            
        };
        reader.readAsDataURL(file);
    }

    $('#giftImgCropModal').modal('show');
    $('#giftImgCropModal .image-box img').imgAreaSelect({ 
        aspectRatio: '1:1', 
        handles: true,
        fadeSpeed: 20, 
        onSelectChange: giftImgPreview 
    });

    reset_img_selector($('#giftImgCropModal .image-box img'),100,100);
    var id = $(o).attr('id');
    $(o).replaceWith('<input type="file" class="img-input-file" onchange="cropGiftImg(this)" id="'+id+'">');
}

function giftImgPreview(img, selection) {
    if (!selection.width || !selection.height)
        return;
    
    var scaleX = 150 / selection.width;
    var scaleY = 150 / selection.height;

    $('#giftImgCropModal .preview-box img').css({
        width: Math.round(scaleX * img.width),
        height: Math.round(scaleY * img.height),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });
    localStorage.setItem('cropImgSize', JSON.stringify({'x1':selection.x1,'y1':selection.y1,'w':selection.width,'h':selection.height})); 
}

function cropPartnerImg(o){
    var isIE = navigator.userAgent.indexOf('MSIE') >= 0;
    localStorage.setItem('currentPartnerInputID',$(o).attr('id'));
    if (!o.value.match(/.jpg|.gif|.png|.bmp/i)) {
        alert('图片格式无效！');
        return false;
    }
    if(isIE) { //IE浏览器
        $('#partnerImgCropModal .image-box img').attr('src',o.value);
        $('#partnerImgCropModal .preview-box img').attr('src',o.value); 
    }
    if(!isIE){
        var file = o.files[0];
        var reader = new FileReader();
        reader.onload = function() {
            var img = new Image();
            img.src = reader.result;
            $('#partnerImgCropModal .image-box img').attr('src',reader.result);
            $('#partnerImgCropModal .preview-box img').attr('src',reader.result);
            
        };
        reader.readAsDataURL(file);
    }

    $('#partnerImgCropModal').modal('show');
    $('#partnerImgCropModal .image-box img').imgAreaSelect({ 
        aspectRatio: '1:1', 
        handles: true,
        fadeSpeed: 20, 
        onSelectChange: partnerImgPreview 
    });

    reset_img_selector($('#partnerImgCropModal .image-box img'),100,100);
    var id = $(o).attr('id');
    $(o).replaceWith('<input type="file" class="img-input-file" onchange="cropPartnerImg(this)" id="'+id+'">');
}

function partnerImgPreview(img, selection) {
    if (!selection.width || !selection.height)
        return;
    
    var scaleX = 150 / selection.width;
    var scaleY = 150 / selection.height;

    $('#partnerImgCropModal .preview-box img').css({
        width: Math.round(scaleX * img.width),
        height: Math.round(scaleY * img.height),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });
    localStorage.setItem('cropImgSize', JSON.stringify({'x1':selection.x1,'y1':selection.y1,'w':selection.width,'h':selection.height})); 
}

function judgeProjectName(input){
    if(checkProjectName(input.value)){
        removeError(input);
    }else{
        setError(input,'*请输入2-40位字符的名称');
    }
}

function checkWordNum(obj) {
    var maxLength = $(obj).attr("alt");
    
    $(obj).parent().find('.J-had-input').html(obj.value.length);
    $(obj).parent().find('.J-max-input').html(maxLength);

    if (obj.value.length > maxLength) {
        $(obj).parent().find('.J-had-input').addClass('warning');
    } else {
        $(obj).parent().find('.J-had-input').removeClass('warning')
    }
}

function judgePersonalDesc(input){
    var text = input.value;
    if(!text.length){
        setError(input,'*请输入120个字符以内的简介')
    }
    if(text.length){
        removeError(input);
    }
}

function judgeCityInput(input){
    var city = input.value;
    if(city.length){
        removeError(input);
    }else{
        setError(input, '请输入城市');
    }
}

function setNextStepClick(){
    // 发布项目信息第一步-基本信息
    $('#step0Next').click(function(){
        var project_name = $('#step0 .J-name').val(),
            project_short_desc = $('#step0 .J-short-desc').val().substring(0,200),
            project_img = $('#projectBasicImgPrev img').attr('src'),
            project_stage = $('#project-stage').val(),
            project_income_situation = $('#income-situation').val(),
            project_financing_stage = $('#financing-stage').val(),
            project_city = $('#step0 .J-city').val(),
            project_field = $('#step0 .J-field').find('.select'),
            project_website_link = $('#step0 .J-website-link').val(),
            project_iOS_link = $('#step0 .J-iOS-link').val(),
            project_Android_link = $('#step0 .J-Android-link').val(),
            project_detail_desc = UE.getEditor('descDetailEditor').getContent();

        if(!checkProjectName(project_name)){
            setError('#step0 .J-name','*请输入2-40个字符的名称');
            $('#step0 .J-name').focus();
            return;
        }else{
            removeError('#step0 .J-name');
        }
        
        if(!project_short_desc.length){
            setError('#step0 .J-short-desc','*请输入不超过200个字符的简介');
            $('#step0 .J-short-desc').focus();
            return;
        }else{
            removeError('#step0 .J-short-desc');
        }

        if(!project_img.length){
            setError('#step0 .J-img-select','*请选择图片进行上传');
            $('#step0 .J-img-select').focus();
            return;
        }else{
            removeError('#step0 .J-img-select');
        }

        if(!project_city){
            setError('#step0 .J-city','*请输入城市');
            $('#step0 .J-city').focus();
            return;
        }else{
            removeError('#step0 .J-city');
        }

        if(!project_detail_desc.length){
            $('#step0 .error-box').html("*请填写项目的详细介绍");
            $('#step0 .error-box').css('display','block');
            var editor = UE.getEditor('descDetailEditor');
            editor.focus();
            setTimeout(function(){
                $('#step0 .error-box').css('display','none');
            },1500)
            return;
        }else{
            $('#step0 .error-box').css('display','none');
        }

        toNextStep(0,'step0');
    })

    // 发布项目信息第二步-融资信息
    $('#step1Next').click(function(){
        var current_valuation = $('#step1 .J-current-valuation').val(),
            val_min = $('#valuationMin').val(),
            val_max = $('#valuationMax').val(),
            deadline = $('#deadline').val();

        if(!current_valuation){
            setError('#step1 .J-current-valuation','*请输入大于0的数字');
            $('#step1 .J-current-valuation').focus();
            return;
        }else{
            removeError('#step1 .J-current-valuation');
        }

        if(!checkMoney(val_min)){
            setError('#valuationMin','*请输入大于0的数字');
            $('#valuationMin').focus();
            return;
        }

        if(!checkMoney(val_max)){
            setError('#valuationMax','*请输入大于0的数字');
            $('#valuationMax').focus();
            return;
        }

        if(!(val_min < val_max)){
            setError('#valuationMax','*请输入大于最小融资的数字');
            $('#valuationMax').focus();
            return;
        }
        
        if(!checkPositiveInt(parseInt(deadline)) || parseInt(deadline)>90){
            setError('#deadline','*请输入不大于90的天数');
            $('#deadline').focus();
            return;
        }

        toNextStep(1,'step1');   
    })

    // 发布项目信息第三步-回报信息
    $('#step2Next').click(function(){
        // var check_data = 'isOK';
        var investments = $('.investment-box');
        for(var i = 0; i<investments.length;i++){
            var return_money = investments.eq(i).find('.J-return-money').val(),
                return_num = investments.eq(i).find('.J-return-num').val(),
                return_has_content = investments.eq(i).find('.J-yes').hasClass('select');

            if(!checkMoney(return_money)){
                setObjError(investments.eq(i).find('.J-return-money'),'*请输入大于0的金额');
                investments.eq(i).find('.J-return-money').focus();  
                return;
            }

            if(!checkPositiveInt(return_num)){
                setObjError(investments.eq(i).find('.J-return-num'),'*请输入大于0的整数');
                investments.eq(i).find('.J-return-num').focus();  
                return;
            }
        }

        toNextStep(2,'step2');
    })
    
    // 发布项目信息第四步-团队信息
    $('#step3Next').click(function(){
        var check_data = "isOK";
        var partners = $('.partner-box');
        var partners_data = [];
        for(var i=0; i<partners.length; i++){
            var name = partners.eq(i).find('.J-name').val(),
                position = partners.eq(i).find('.J-position').val(),
                partner_short_desc = partners.eq(i).find('.J-short-desc').val(),
                partner_img = partners.eq(i).find('.img-prev-box img').attr('src');
            
            if(!checkOnlyChineseOrEnlish(name)){
                setObjError(partners.eq(i).find('.J-name'),'*请输入英文/中文，不支持特殊字符');
                partners.eq(i).find('.J-name').focus();  
                return;
            }
            if(!checkOnlyChineseOrEnlish(position)){
                setObjError(partners.eq(i).find('.J-position'),'*请输入英文/中文，不支持特殊字符');
                partners.eq(i).find('.J-position').focus();  
                return;
            }
            if(!partner_short_desc.length){
                setObjError(partners.eq(i).find('.J-short-desc'),'*请输入英文/中文，不支持特殊字符');
                partners.eq(i).find('.J-short-desc').focus();  
                return;
            }
            if(!partner_img){
                setObjError(partners.eq(i).find('.J-partner-img-input'),'*请选择图片进行上传');
                partners.eq(i).find('.J-partner-img-input').focus();  
                return;
            }
        }
        toNextStep(3,'step3');
    })
}

function toNextStep(i,stepName){
    var next_num = i+1;
    $("#" + stepName).hide();
    $("#step" + (i + 1)).show();
    if (i + 2 == 5){
        $("#submitform").show();
    }
    $("#stepDesc" + next_num).addClass("current");
}

function judgeMinValuation(input){
    var min = input.value,
        max = $('#valuationMax').val();
    if(!checkMoney(min)){
        setError(input,'*请输入大于0的数字');
        return;
    }
    if(checkMoney(min) && max != '' && min > max){
        setError(input,'*请输入小于最大融资的的值');
        return;
    }
    removeError(input);
}

function judgeMaxValuation(input){
    var max = input.value,
        min = $('#valuationMin').val();
    if(!checkMoney(max)){
        setError(input,'*请输入大于0的数字');
        return;
    }
    if(checkMoney(max) && checkMoney(min) && min != '' && min > max){
        setError(input,'*请输入大于最小融资的的值');
        return;
    }
    removeError(input);
}

function judgeTime(input){
    var time = input.value;
    input.value = parseInt(time);
    if(!checkPositiveInt(parseInt(time)) || parseInt(time) > 90){
        setError(input,'*请输入不大于90的天数');
    }else{
        removeError(input);
    }
}

function setReturnBtn(){
    $('.J-yes').unbind('click').click(function(){
        $(this).addClass('select');
        $(this).parent().next().find('.J-no').removeClass('select');
        $(this).parent().parent().next().slideDown('fast');
    })

    $('.J-no').unbind('click').click(function(){
        $(this).addClass('select');
        $(this).parent().prev().find('.J-yes').removeClass('select');
        $(this).parent().parent().next().slideUp('fast');
    })
}
