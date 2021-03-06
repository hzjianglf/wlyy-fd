/*mui.init({
 keyEventBind: {
 backbutton: false  //Boolean(默认true)关闭back按键监听
 }
 });*/
$(function() {
	plus.nativeUI.showWaiting();
	//param setting
	var	Request = GetRequest();
	var doctorId = "";   //东软提供医生ID
	//var userId = Request["userId"];
	var	uId = Request["userId"];//健康之路用户ID
	var	ticket = Request["ticket"];
	var	orgId = Request["orgId"];
	var	vaildTime = Request["vaildTime"];
	var	appUID = Request["appUID"];
	var	appType = Request["appType"];
	var orgCode = "";
	var iMei = "ceshi";
	var oUserAgent = {
		"uid": uId,
		"imei": iMei,
		"token": ticket,
		"openid": "",
		"clientType": "app"
	};
	var userAgent = JSON.stringify(oUserAgent);
	plus.storage.setItem("userAgent", userAgent);

	/**
	 * 通过健康之路APP的用户ID，获取东软的医生ID信息
	 */
	sendPost("/user",
		{
			"userId": uId,
			"appUID": appUID,
			"orgId": orgId,
			"appType": appType,
			"vaildTime": vaildTime,
			"ticket": ticket
		},
		null, function(res) {
			if(res.status == 200) {
				doctorId = res.data.doctorId;
				orgCode = res.data.orgCode;
				plus.storage.setItem("doctorId", doctorId);
				plus.storage.setItem("orgCode", orgCode);
				getBaseInfo( doctorId,uId);
			}
			plus.nativeUI.closeWaiting();
		});

	$('.main iframe').height($(window).height() - 51);
	$('#subPage').height($(window).height());//子页面
	window.localStorage.removeItem("isLoginOut");

	/**
	 * 导航点击事件
	 */
	$('.mui-tab-item').on("tap", function () {
		$(this).addClass('mui-active').siblings().removeClass('mui-active');
		$('.main iframe').eq($(this).index()).show().siblings().hide();
	})
});

function openSubPage(url){
	url += (url.indexOf('?')==-1 ? '?' : '&') +'tim='+ new Date().getTime() ;
	$('#subPage').show().attr('src', url);
}

function closeSubPage(){
	$('#subPage').hide().attr('src','');
}

/**
 * 请求医生基本信息
 */
function getBaseInfo(doctorId,uId){
	sendPost("doctor/baseinfo",
		{
			"doctorId": doctorId,
			"uid": uId
		},
		null, function(res) {
			if(res.status == 200) {
				plus.storage.setItem("docInfo", JSON.stringify(res.data));
				$.each($('.main iframe'), function (i, v) {
					$(v).attr('src', $(v).attr('data-html'));
				})
			} else {
				mui.toast("获取医生信息失败");
			}
			//plus.nativeUI.closeWaiting();
		});
}