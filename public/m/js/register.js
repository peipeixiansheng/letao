$(function () {
    var letao = new Letao();
    letao.addRigister();
    letao.touchblur();
    letao.intension();
    letao.getVode();
});
var Letao = function () {

};
Letao.prototype = {
    //给注册按钮添加事件
    addRigister: function () {
        var that = this;
        $('#main .btn-register').on('tap', function () {
            //  获取验证码
            var vCode = $('.vcode').val();
            //  获取当前输入的用户名
            var username = $('.username').val();
            var password1 = $('#main .password1').val();
            var password2 = $('#main .password2').val();
            // 验证手机号
            var mobile = $('.mobile').val();
            if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(mobile)) {
                mui.toast('请输入合法手机号');
                return false;
            };
            var check = true;
            mui(".mui-input-group input").each(function () {
                //若当前input为空，则alert提醒 
                if (!this.value || this.value.trim() == "") {
                    var label = this.previousElementSibling;
                    mui.toast("请输入" + label.innerText, {
                        duration: 2000,
                        type: 'div'
                    });
                    check = false;
                    return false;
                }
            }); 
            //校验通过，继续执行业务逻辑 
            if (check) {
                // 判断两次密码是否一致
                if (password1 != password2) {
                    mui.toast("前后两次密码不一致", {
                        duration: 2000,
                        type: 'div'
                    });
                    return;
                };
                // 判断密码强度是否够了
                if (!/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/.test(password1)) {
                    mui.toast('密码强度不够，请重新输入');
                    return false;
                };
                //  判断当前输入的验证码和之前获取的验证码是否一致
                if(that.vCode != vCode){
                    mui.toast('验证码输入错误' , { duration: 2000, type: 'div' });
                    return false;
                };
                $.ajax({
                	type:'post',
                	url:'/user/register',
                	data:{username:username,password:password1,mobile:mobile,vCode:vCode},
                	success:function (data) {
                        // 11. 判断如果后台返回错误也要提示用户
                        if(data.error){
                            mui.toast(data.message , { duration: 2000, type: 'div' });
                            return false;
                        }else{
                            // 12. 注册成功一般就去登录
                            window.location.href = 'login.html?returnUrl=index.html';
                        }
                	}
                })
            }
        })
    },
    // 确认密码的失去焦点事件
    touchblur: function () {
        $('#main .password2').on('blur', function () {
            var password1 = $('#main .password1').val();
            var password2 = $('#main .password2').val();
            if (password1 != password2) {
                mui.toast("前后两次密码不一致", {
                    duration: 2000,
                    type: 'div'
                });
                return;
            };
            if (password1) {
                if (!/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/.test(password1)) {
                    mui.toast('密码强度不够，请重新输入');
                    return false;
                };
            } else {
                mui.toast('请输入密码');
            }
        })
    },
    // 密码强度验证
    intension: function () {
        $('#main .password1').on('blur', function () {
            var password1 = $('#main .password1').val();
            if (password1) {
                if (!/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/.test(password1)) {
                    mui.toast('密码强度不够，请重新输入');
                    return false;
                };
            } else {
                mui.toast('请输入密码');
            }
        })
    },
      //获取验证码的函数
    getVode:function () {
        var that = this;
        // 1. 给获取验证码按钮添加点击事件去获取验证码
        $('.btn-vcode').on('tap',function () {
           // 2. 调用获取验证码的API
           $.ajax({
              url:'/user/vCode',
              success:function (data) {
                //  console.log(data.vCode);
                  //3. 获取到了验证码给对象上的vCode赋值 这个vCode是后台返回的vCode
                  that.vCode = data.vCode;
              }
           }) 
        });
    }
}