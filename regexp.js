var regName= /(^[\u4e00-\u9fa5 ]{2,20}$)|(^[a-z]{2,20}$)/ig; //正则匹配中文姓名
var isEmail=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
var isMobile=/^1[3３4４5５7７8８]\d{9}$/;
var isIDCard= /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;//身份证