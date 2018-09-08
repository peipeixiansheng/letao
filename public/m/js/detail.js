
$(function(){
    var letao=new Letao();
    letao.id=letao.getQueryString('id');
    letao.slideBeg();
    letao.addCarBuy();
})
var Letao=function(){

}
Letao.prototype={
    // 轮播图初始化
    initSlide: function () {
        //获得slider插件对象
        var gallery = mui('.mui-slider');
        gallery.slider({
            interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
        })
    },
    // 内容区域滚动
    regionSroll:function(){
        mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
},
    // 请求数据
    slideBeg:function(){
        var that=this;
        var id=this.id;
        // console.log(id);
        $.ajax({
            url:"/product/queryProductDetail",
            data:{'id':id},
            success:function(obj){
                // console.log(obj);
                var slideHtml=template('slideTmp',obj);
                // console.log(slideHtml);
                $('#main #slide').html(slideHtml);
                // 调用轮播图初始化代码
                that.initSlide();
                // 进行截取
                var min=obj.size.split('-')[0];
                var max=obj.size.split('-')[1];
                // console.log(min);
                min=parseInt(min)
                max=parseInt(max)
                // console.log(min);
                // 声明一个数组来存储尺码
                obj.size=[];
                for(var i=min;i<=max;i++){
                    obj.size.push(i);
                }
                // console.log(size);
                var html=template('productTmp',obj);
                // console.log(html);
                $('#main .product').html(html);
                // 调用区域滚动事件
                that.regionSroll();
                // 初始化数字输入框
                mui('.mui-numbox').numbox();
                // 给尺寸按钮添加点击事件
                $('#main .product').on('tap','.btn-size',function(){
                    // console.log(this);
                    var size=$(this).data('size');
                    for(var i=0;i<obj.size.length;i++){
                        if(size==obj.size[i]){
                            $(this).addClass('active').siblings().removeClass('active');
                        }
                    }
                })
            }
        })
    },
    // 加入购物车
    addCarBuy:function(){
        var that=this;
        $('#footer .addCar').on('tap',function(){
            // 拿到选中的尺码
            var size=$('.btn-size.active').data('size');
            // 判断是否选中了尺码
            if(!size){
                mui.toast('请选择尺码',{ duration:2000, type:'div' }) ;
                return;
            }
            // 判断是选了数量
            var num=mui('.mui-numbox').numbox().getValue();
            // console.log(num);
            if(!num>0){
                mui.toast('请选择购买数量',{ duration:2000, type:'div' });
                return;
            }
            // 发送请求
            $.ajax({
                url:"/cart/addCart",
                type:'post',
                data:{
                    productId:that.id,
                    num:num,
                    size:size,
                },
                success:function(obj){
                    // 判断是否登录了
                    // console.log(obj);                    
                    if(obj.error){
                        window.location.href='login.html?returnUrl=detail.html?id='+that.id;
                        return;
                    }else{
                        //添加购物车成功
                    }
                }
            }) 
        })
    },
     //专门获取地址栏参数的方法
     getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
}