function User(nickname, password, phone, email){
	this.is_login = false,
	this.is_certified = false,
	this.is_has_news = true,
	this.is_dialoged = false,
	this.nickname = nickname,
	this.password = password,
	this.phone = phone,
	this.email = email,
	this.realname = '',
	this.logo = '',
	this.at_city = '',
	this.company = '',
	this.position = '',
	this.focus_cities = '',
	this.focus_fields = ''
}

User.prototype.save = function () {
    var user_data = {
    	'nickname' : this.nickname,
    	'password' : this.password,
    	'phone' : this.phone,
    	'email' : this.email,
    	'realname' : this.realname,
    	'logo' : this.logo,
    	'at_city' : this.at_city,
    	'company' : this.company,
    	'position' : this.position,
    	'focus_cities' : this.focus_cities,
    	'focus_fields' : this.focus_fields,
    	'is_login' : this.is_login,
    	'is_certified' : this.is_certified,
    	'is_has_news' : this.is_has_news,
    	'is_dialoged' : this.is_dialoged
    }
    //保存用户数据
    User.save(user_data);
};


User.is_login = function(){
	var is_login = JSON.parse(localStorage.getItem('user')).is_login; 
	return is_login;
}

User.is_certified = function(){
	var is_certified = JSON.parse(localStorage.getItem('user')).is_certified; 
	return is_certified;
}

User.save = function(user_data){
	localStorage.setItem('user',JSON.stringify(user_data));
}

User.get_user_data = function(){
	var user = JSON.parse(localStorage.getItem('user'));
	return user;
}

User.logout = function(){
	var user = User.get_user_data();
	user.is_login = false;
	User.save(user);
}