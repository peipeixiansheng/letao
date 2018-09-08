$(function () {
    var letao = new Letao();
    letao.login();
})
var Letao = function () {

}
Letao.prototype = {
    // 点击登录
    login: function () {
        var that=this;
        $('.btn-login').on('tap', function () {
            var username = $('.username').val();
            var password = $('.password').val();
            // 判断输入框内是否有为空的
            var check = true;
            mui(".mui-input-group input").each(function () {
                // console.log(this.value);
                //2. 获取当前输入框的值 若当前input为空，则使用MUI消失提示框提醒 
                if (!this.value || this.value.trim() == "") {
                    // 3. 获取当前输入框左边的label标签
                    var label = this.previousElementSibling;
                    // 4.调用提示框提示
                    mui.toast("请输入" + label.innerText, {
                        duration: 2000,
                        type: 'div'
                    });
                    // 5. 把check变量变成了false
                    check = false;
                    return false;
                }
            }); //校验通过，继续执行业务逻辑 
            if (check) {
                $.ajax({
                    url: "/user/login",
                    type: 'post',
                    data: {
                        username: username,
                        password: password
                    },
                    success: function (obj) {
                        // console.log(obj);
                        if (obj.error) {
                            mui.toast(obj.message, {
                                duration: 2000,
                                type: 'div'
                            });
                            $('.password').val("");
                            $('.username').val("");
                        } else {
                            // 11. 否则就表示登录成功 返回上一页 但是如果上一页是注册返回首页
                            var returnUrl = that.getQueryString('returnUrl');
                            // console.log(returnUrl);
                           window.location.href=returnUrl;
                        }
                    }
                })
            }
        })
    },
    //专门获取地址栏参数的方法
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
}