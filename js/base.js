$(function(){
    initLocalStorage();//初始化数据

    countdown = 60; //再次获取手机验证等待时间
    countdownTime = 30; //跳转等待时间

    toggleB2T();
    
    $(window).scroll(function(){
        toggleB2T();
    });

    window.tpl = (function(){
        var cache = {};
        return function tmpl(str, data){
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                    tpl(document.getElementById(str).innerHTML) :
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" +
                    str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'")
                    + "');}return p.join('');");
            return data ? fn(data) : fn;
        };
    })();

    $("#back2top a").click(function(){
        if($("html").scrollTop())
            $("html").animate({scrollTop:0},500);
        else
            $("body").animate({scrollTop:0},500);
        return false;
    });

    $('.J-register').click(function(){
        show_register();
    })
   
    $('.J-login').click(function(){
        show_login();
    })

    $('.J-change-to-login').click(function(){
        hide_register();

        setTimeout(function(){
            $('#loginModal').modal('toggle');
        },500)
    })
    
    $('.J-change-to-register').click(function(){
        hide_login();
        setTimeout(function(){
            $('#registerModal').modal('toggle');
        },500)
    })

    $('#myRegisterTab a').click(function (e) { 
      e.preventDefault();
      $(this).tab('show');
    }) 

    $('body > .container').css('min-height', $(window).height()-197);

    $('input[type="checkbox"]').click(function(){
        var is_checked = $(this).attr('checked') == 'checked';
        if(is_checked){
            $(this).removeAttr('checked');
        }
        if(!is_checked){
            $(this).attr('checked','checked');
        }
    })

    initFetchCheckCode();

    $('.C-J-crop-modal .C-J-cancel').click(function(){
        $('.imgareaselect-outer').css('display','none');
        $('.imgareaselect-selection').parent().css('display','none');
    })

    initHeader();
    initLogout();
    initLinkStatus();
    initLoginPress();
    initForgotPassword();
    
})

function initHeader(){
    var is_login = User.is_login();
    var user = User.get_user_data();
    if(is_login){
        hide($('.J-unlogin'));
        show($('.J-logined'));
        $('.J-drop-taggle').hover(function(){
            $(this).find('.J-drop-menu').slideDown('fast');
        },function(){
            $(this).find('.J-drop-menu').slideUp('fast');
        })
    }
    if(!is_login){
        hide($('.J-logined'));
        show($('.J-unlogin'));
    }

    if(user.is_has_news){
        show($('.header .J-news-num'));
        show($('.header .J-news-tip-box'));
        hide($('.header .J-no-news-tip'));
    }else{
        hide($('.header .J-news-num'));
        hide($('.header .J-news-tip-box'));
        hide($('#accountNews .unread'));
        show($('.header .J-no-news-tip'));
    }

}

function initFetchCheckCode(){
    $('.J-phone-check').click(function(){
        settime($(this));
        showAlertInfo('验证码已发送至您的手机，请及时查收。');
    })

    $('.J-email-check').click(function(){
        settime($(this));

        //if发送成功
        showAlertInfo('验证码已发送至您的邮箱，请及时查收，并返回填写以完成注册。');
    })
}

function initLinkStatus(){
    var is_login = User.is_login();
    
    $('.J-project-release-link').click(function(){
        if(is_login){
            window.location = 'project-release.html';
        }
        if(!is_login){
            alertImg('请先登录！');
        }
    })

    $('.J-investor-certification-link').click(function(){
        var user = User.get_user_data();
        if(user.is_login && !user.is_certified){
            window.location = 'investor-certification.html';
        }
        if(!is_login){
            alertImg('请先登录！');
        }
        if(is_login && user.is_certified){
            alertImg('您已认证成功！');
        }
    })
}

function initLoginPress(){
    $('#login input').bind('keypress',function(event){
        if(event.keyCode == "13"){
            $('#login .btn').click();
        }
    })
}

function initLogout(){
    $('.J-logout').click(function(){
        User.logout();
    })
}

function initForgotPassword(){
    $('.J-forgot-password').click(function(){
        hide_login();
    
        setTimeout(function(){
            $('#forgotPasswordModal').modal('toggle');
        },500)
    })

    $('#myForgotPwdTab a').click(function (e) { 
      e.preventDefault();//阻止a链接的跳转行为 
      $(this).tab('show');//显示当前选中的链接及关联的content 
    }) 

    $('.C-J-fetch-check-btn').click(function(){
        //获取验证码
        settime($(this));
    })

    $('#forgotPasswordModal .J-phone-reset-pwd').click(function(){
        var phone = $('#phoneBack .J-phone-input').val();
        var check_code = $('#phoneBack .check-box input').val();

        if(!checkPhone(phone)){
            $(this).prev().css('display','block');
            $(this).prev().html('请填写正确的手机号');
            return;
        }
        if(!check_code){
            $(this).prev().css('display','block');
            $(this).prev().html('请填写验证码');
            return;
        }
        
        $('.forgot-password-box').find('.error-box').css('display','none');
        
        $('#forgotPasswordModal').modal('hide');
        //重置密码
        setTimeout(function(){
            $('#resetPasswordModal').modal('toggle');
        },500)
       
    })

    $('#forgotPasswordModal .J-email-reset-pwd').click(function(){
        var email = $('#emailBack .J-email-input').val();
        var check_code = $('#emailBack .check-box input').val();

        if(!checkEmail(email)){
            $(this).prev().css('display','block');
            $(this).prev().html('请填写正确的邮箱');
            return;
        }
        if(!check_code){
            $(this).prev().css('display','block');
            $(this).prev().html('请填写验证码');
            return;
        }

        $('.forgot-password-box').find('.error-box').css('display','none');
        $('#forgotPasswordModal').modal('hide');
        
        //重置密码
        setTimeout(function(){
            $('#resetPasswordModal').modal('toggle');
        },500)
    })

    $('#resetPasswordModal .J-reset-pwd-submit').click(function(){
        var password = $('#resetPasswordModal .J-pwd').val();
        var password_confirm = $('#resetPasswordModal .J-pwd-confirm').val();

        if(!checkPassword(password)){
            setError('#resetPasswordModal .J-pwd','*请输入6-16位的密码');
            $('#resetPasswordModal .J-pwd').focus();
            return;
        }
        if(password != password_confirm){
            setError('#resetPasswordModal .J-pwd-confirm','*两次密码输入不一致');
            $('#resetPasswordModal .J-pwd-confirm').focus();
            return;
        }

        if(checkPassword(password) && password == password_confirm){
            $('.reset-password-box').find('.error-box').css('display','none');
            $('#resetPasswordModal').modal('hide');
            
            //重置密码成功
            setTimeout(function(){
                $('#resetPasswordSuccessModal').modal('toggle');
            },500)
        }

    })

    
    $("#resetPasswordSuccessModal").on('shown.bs.modal', function(e){
        countdownTime = 5;
        setTimeout(function(){
            setResetPasswordTime();
        },100)
        
    });
}

function setResetPasswordTime(){  
    countdownTime -= 1;  
    $('#resetPasswordSuccessModal .J-time-box').html(countdownTime);  
    if(countdownTime==0){  
         $('#resetPasswordSuccessModal').modal('hide');
         setTimeout(function(){
            $('#loginModal').modal('toggle');
        },500)
        return;
    }  
    //每秒执行一次,setResetPasswordTime()  
    setTimeout(function(){
        setResetPasswordTime();
    },1000);  
}  

function show_login(){
    $('#loginModal').modal('show');
}
function show_register(){
    $('#registerModal').modal('show');
}
function hide_login(){
    $('#loginModal').modal('hide');
}
function hide_register(){
    $('#registerModal').modal('hide');
}
function showForgotPassword(){
    $('#forgotPasswordModal').modal('show');
}

function toggleB2T(){
    if($("html").scrollTop()|$("body").scrollTop())
        $("#back2top").show();
    else
        $("#back2top").hide();
}

function post_data(e){
    var ID = $(e).parent().parent().attr('id');
    if(ID == 'phone'){
        post_phone_regist_data();
    }
    if(ID == 'email'){
        post_email_regist_data();
    }
    if(ID == 'login'){
        post_login_data();
    }
}

function post_phone_regist_data(){
    var name = $('#phone').find('.J-name').val(),
        password = $('#phone').find('.J-pwd').val(),
        password_confirm = $('#phone').find('.J-pwd-confir').val(),
        phone = $('#phone').find('.J-phone').val(),
        check_code = $('#phone').find('.J-check-code').val(),
        is_checkbox = $('#phone').find('.checkbox').attr('checked') == 'checked';

    if(checkName(name) && checkPassword(password) && checkPhone(phone) && password == password_confirm && check_code && is_checkbox){
        $('#phone').find('.error-box').css('display','none');
        var user = new User(name, password, phone, '');
        user.is_login = true;
        user.save();
        window.location = 'index.html';
    }else{
        $('#phone').find('.error-box').html('*请将信息填写完整')
        $('#phone').find('.error-box').css('display','block');
    }
}

function post_email_regist_data(){
     var name = $('#email').find('.J-name').val(),
        password = $('#email').find('.J-pwd').val(),
        password_confirm = $('#email').find('.J-pwd-confir').val(),
        email = $('#email').find('.J-email').val(),
        check_code = $('#email').find('.J-check-code').val(),
        is_checkbox = $('#email').find('.checkbox').attr('checked') == 'checked';

    if(checkName(name) && checkPassword(password) && checkEmail(email) && password == password_confirm && check_code && is_checkbox){
        $('#email').find('.error-box').css('display','none');
        var user = new User(name, password, '', email);
        user.is_login = true;
        user.save();
        window.location = 'index.html';
    }else{
        $('#email').find('.error-box').html('*请将信息填写完整')
        $('#email').find('.error-box').css('display','block');
    }
}

function post_login_data(){
    var account = $('#login').find('.J-account').val(),
        password = $('#login').find('.J-pwd').val();
    var is_legel_account = checkPhone(account) || checkEmail(account);
    var is_legel_pwd = password.length > 0;
    var dynamic_login = $('#login').find('.checkbox').attr('checked') == 'checked';
    if(!is_legel_account){
        $('#login').find('.error-box').html('*请输入正确的手机号或者邮箱')
        $('#login').find('.error-box').css('display','block');
        return;
    }
    if(!is_legel_pwd){
        $('#login').find('.error-box').html('*请输入密码进行登录')
        $('#login').find('.error-box').css('display','block');
        return;
    }
    if(is_legel_account && is_legel_pwd){
        $('#login .error-box').css('display','none');
        var user = User.get_user_data();
        if((user.phone == account && user.password == password )|| (user.email == account && user.password == password) ){
            user.is_login = true;
            User.save(user);
            location.reload();
        }else{
            $('#login .error-box').css('display','block');
            if(!user.password){
                 $('#login .error-box').html('*该账号没有注册，请先注册');
            }else{
                 $('#login .error-box').html('*用户名或密码错误');
            }
        }
    }

}

function checkName(str){
    var reg = /^[a-zA-z\u4e00-\u9fa50-9_]+$/;
    if(str.length){
        return reg.test(str);
    }
    if(!str.length){
        return false;
    } 
}

function checkPhone(str){
    var reg = /^1\d{10}$/;
    return reg.test(str);
}

function checkPassword(str){
    var len = str.length;
    return len > 5;
}

function checkEmail(str){
    var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    return reg.test(str);
}

function checkLinkUrl(str){   
    var regUrl = /(http\:\/\/)?([\w.]+)(\/[\w- \.\/\?%&=]*)?/gi;   
    var result = str.match(regUrl);  
    return result!=null; 
} 

function checkProjectName(str){
    return str.length > 1 && str.length < 41;
}

function checkMoney(str){
    return !isNaN(str) && str>0;
}

function checkPositiveInt(str){
    var reg = /^\+?[1-9][0-9]*$/;
    return reg.test(str);
}

function checkOnlyChineseOrEnlish(str){
    var reg =/^\+?[a-zA-z\u4e00-\u9fa5]*$/;
    return reg.test(str) && str.length > 0;
}

function judgeOnlyChineseOrEnlish(input){
    if(!checkOnlyChineseOrEnlish(input.value)){
        setError(input,'*请输入英文/中文，不支持特殊字符');
        return;
    }else{
        removeError(input);
    }
}

function judgeLinkUrl(input){
    if(checkLinkUrl(input.value)){
        removeError(input);
    }else{
        setError(input,'*请输入正确的链接地址');
    }
}

function judgeMoney(input){
    if(checkMoney(input.value)){
        removeError(input);
    }else{
        setError(input,'*请输入大于0的金额');
    }
}

function judgePositiveInt(input){
    if(checkPositiveInt(input.value)){
        removeError(input);
    }else{
        setError(input,'*请输入大于0的整数');
    }
}

function judgeName(input){
    if(!input.value.length){
        setError(input,'*名称不能为空');
        return;
    }
    if(checkName(input.value)){
        removeError(input);
    }else{
        setError(input,'*请输入中文、英文、数字，不允许特殊字符');
    }
}

function judgePassword(input){
    if(!input.value.length){
        setError(input,'*密码不能为空');
        return;
    }
    if(checkPassword(input.value)){
        removeError(input);
    }else{
        setError(input,'*请输入6-16位的密码');
    }
}

function judgePasswordConfirm(input){
    var pwd = $(input).parent().parent().find('.J-pwd').val();
    var str = input.value;

    if(pwd != str){
        setError(input,'*两次密码输入不一致');
    }else{
        removeError(input);
    }
}

function judgePhoneNum(input){
    if(checkPhone(input.value)){
        removeError(input);
    }else{
        setError(input,'*请填写正确的手机号码');
    }
}

function judgeEmail(input){
    if(!input.value.length){
        setError(input,'*邮箱不能为空');
        return;
    }
    if(checkEmail(input.value)){
        removeError(input);
    }else{
        setError(input,'*请填写正确的电子邮箱');
    }
}

function judgeLoginName(input){
   if(checkPhone(input.value) || checkEmail(input.value)){
        removeError(input);
    }else{
        setError(input,'*请填写正确的手机号码或电子邮箱');
    }
}
function judgeLoginPassword(input){
    if(input.value.length>0){
        removeError(input);
    }else{
        setError(input,'*请输入密码');
    }
}

function setError(input,msg){
    $(input).addClass('error');
    $(input).parent().find('.error-tip').remove();
    $(input).after('<div class="error-tip">'+ msg +'</div>');
}

function setObjError(obj,msg){
    obj.addClass('error');
    obj.parent().find('.error-tip').remove();
    obj.after('<div class="error-tip">'+ msg +'</div>');
}

function removeError(input){
    $(input).removeClass('error');
    $(input).parent().find('.error-tip').remove();
}

function getNowFormatDate() {
    var day = new Date();
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";
    //初始化时间 
    Year = day.getFullYear(); 
    Month = day.getMonth() + 1;
    Day = day.getDate();
    //Hour = day.getHours(); 
    // Minute = day.getMinutes(); 
    // Second = day.getSeconds(); 
    CurrentDate += Year + "-";
    if (Month >= 10) {
        CurrentDate += Month + "-";
    } else {
        CurrentDate += "0" + Month + "-";
    }
    if (Day >= 10) {
        CurrentDate += Day;
    } else {
        CurrentDate += "0" + Day;
    }
    return CurrentDate;
}

function getNowFormat2Date() {
    var day = new Date();
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";
    //初始化时间 
    Year = day.getFullYear(); //ie火狐下都可以 
    Month = day.getMonth() + 1;
    Day = day.getDate();
    Hour = day.getHours(); 
    Minute = day.getMinutes(); 
    // Second = day.getSeconds(); 
    CurrentDate += Year + "/";
    if (Month >= 10) {
        CurrentDate += Month + "/";
    } else {
        CurrentDate += "0" + Month + "/";
    }
    if (Day >= 10) {
        CurrentDate += Day;
    } else {
        CurrentDate += "0" + Day;
    }
    if(Hour >= 10){
        CurrentDate += " " + Hour;
    }else{
        CurrentDate += " 0"+Hour;
    }
    if(Minute >= 10){
        CurrentDate += ":" + Minute;
    }else{
        CurrentDate += ":0"+Minute;
    }
    return CurrentDate;
}

function settime(val) {
    if (countdown == 0) {
        val.removeAttr("disabled");
        val.val("获取验证");
        countdown = 60;
        return;
    } else {
        val.attr("disabled", true);
        val.val(countdown + "秒后重试");
        countdown--;
    }
    setTimeout(function() {
        settime(val)
    }, 1000)
}

function alertImg(img){
    $('#alertImgModel .modal-body').html('<p>'+img+'</p>')
    $('#alertImgModel').modal('show');
    setTimeout(function(){
        $('#alertImgModel').modal('hide');
    },1000)
}

function reset_img_selector(img,select_w,select_h){
    var isMac = navigator.userAgent.indexOf('Mac OS X')>0;
    var time = isMac ? 500 : 1500;

    setTimeout(function(){
        var imgW = img.width();
        var imgH = img.height();
        var X1 = (imgW - select_w)/2,
            Y1 = (imgH - select_h)/2,
            X2 = X1 + select_w,
            Y2 = Y1 + select_h;

        img.imgAreaSelect({ x1: X1, y1: Y1, x2: X2, y2: Y2});
        localStorage.setItem('cropImgSize', JSON.stringify({'x1':X1,'y1':Y1,'w':select_w,'h':select_h})); 
    },time)
}

function initLocalStorage(){
    var user = localStorage.getItem('user');
    if(!user){
        user = new User('','','','');
        User.save(user);
    }

    localStorage.removeItem('currentGiftInputID');
    localStorage.removeItem('currentPartnerInputID');
}

function deleteBlank(str){
    return str.replace(/\s+/g,"");
}

function hide(obj){
    obj.css('display','none');
}

function show(obj){
    obj.css('display','block');
}

function showConfirm(str){
    $('#confirmModel .modal-body').html(str);
    $('#confirmModel').modal('show');
}

function hideConfirm(){
    $('#confirmModel').modal('hide');
}

function getNum(text) {
    var value = text.replace(/[^0-9]/ig, "");
    return value;
}

function showAlertInfo(info){
    var obj = $('.J-alert');
    obj.html(info);
    obj.css('display','block');
    setTimeout(function(){
        obj.css('display','none');
    },1500)
}