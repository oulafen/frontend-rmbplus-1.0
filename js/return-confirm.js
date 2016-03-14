$(function(){
	$('.J-new-address').click(function(){
		$(this).css('display','none');
		$('.J-addr-info-input').css('display','block');
	})

	$('.J-addr-info-input .C-J-cancel-btn').click(function(){
		reset_address();
	})

	$('.C-J-save-btn').click(function(){
		var name = $('.J-addr-info-input .J-name').val(),
			address1 = $('.J-addr-info-input #address1').val() == "省份" ? false : $('.J-addr-info-input #address1').val(),
			address2 = $('.J-addr-info-input #address2').val(),
			address3 = $('.J-addr-info-input #address3').val(),
			address_detail = $('.J-addr-info-input .J-address-detail').val(),
			phone = $('.J-addr-info-input .J-phone').val();

		if(!name || !address1 || !address_detail || !phone){
			$('.J-addr-info-input .error-box').html('请将信息填写完整');
			$('.J-addr-info-input .error-box').css('display','block');
		}else{
			$('.J-addr-info-box .J-name').html(name);
			$('.J-addr-info-box .J-phone').html(phone);
			$('.J-addr-info-box .J-address').html(address1 + " " + address2 + " " + address3 + " " + address_detail);
			
			$('.J-addr-info-input .error-box').css('display','none');
			$('.J-addr-info-input').css('display','none');
			$('.J-addr-info-box').css('display','block');
		}
	})

	$('.J-addr-info-box .J-fix').click(function(){
		$('.J-addr-info-box').css('display','none');
		$('.J-addr-info-input').css('display','block');
	})

	$('.J-addr-info-box .J-delete').click(function(){
		reset_address();
	})

	$('.J-confirm').click(function(){
		if($('.check-box input').is(':checked')){
			$(this).prev().css('display','none');
			var delivery_name = $('.J-addr-info-box .J-name').html();
			var delivery_phone = $('.J-addr-info-box .J-phone').html();
			var delivery_address = $('.J-addr-info-box .J-address').html()

			location.href = 'pay.html';
		}else{
			$(this).parent().find('.error-box').html('请先阅读相关条款').css('display','block')
		}
	})

	address = ["address1", "address2", "address3"];
    opt0 = ["省份", "地级市", "市、县级市、县"];
	setup_address_input();
	
})

function setup_address_input() {
    for (i = 0; i < address.length - 1; i++) {
    	document.getElementById(address[i]).onchange = new Function("address_change(" + (i + 1) + ")");
    }
    address_change(0);
}

function address_change(v) {
    var str = "0";
    for (i = 0; i < v; i++) {
        str += ("_" + (document.getElementById(address[i]).selectedIndex - 1));
    };
    var ss = document.getElementById(address[v]);
    with(ss) {
        length = 0;
        options[0] = new Option(opt0[v], opt0[v]);
        if (v && document.getElementById(address[v - 1]).selectedIndex > 0 || !v) {
            if (dsy.Exists(str)) {
                ar = dsy.Items[str];
                for (i = 0; i < ar.length; i++) options[length] = new Option(ar[i], ar[i]);
                if (v) options[1].selected = true;
            }
        }
        if (++v < address.length) {
            address_change(v);
        }
    }
}

function reset_address(){
	$('.J-addr-info-box').css('display','none');
	$('.J-addr-info-input').css('display','none');
	$('.J-addr-info-input .error-box').css('display','none');
	$('.J-new-address').css('display','block');

	$('.J-addr-info-input .J-name').val('');
	$('.J-addr-info-input #address1').val('省份');
	$('.J-addr-info-input #address2').val('地级市');
	$('.J-addr-info-input #address3').val('市、县级市、县');
	$('.J-addr-info-input .J-address-detail').val('');
	$('.J-addr-info-input .J-phone').val('');
}