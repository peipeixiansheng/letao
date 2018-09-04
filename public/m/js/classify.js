$(function () {
    var letao = new Letao(); 
    letao.initScroll();
    letao.leftClassify();
    letao.leftClick();
    letao.getBrandData(1);
})
var Letao = function () {

}
Letao.prototype = {
    // 右侧区域滚动初始化
    initScroll: function () {
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 ,//flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            indicators: false,
        });
    },
    //左侧请求分类数据
    leftClassify:function(){
        $.ajax({
            url:'/category/queryTopCategory',
            success:function(obj){
                // console.log(obj);
                // 调用模板
                var html=template('classifyTmp',obj);
                // console.log(html);
                $(".left ul").html(html);
            }
        })
    },
        // 左侧点击请求右侧的数据
    leftClick: function () {
        // this.getBrandData(1);
        //因为onclick事件里面的this是当前触发事件的dom  
        //a不是letao对象 但是事件外面的是letao对象 把对象保存在that变量里面 事件里面使用that
        var that=this;
        // 添加点击事件，用事件委托
        $(".left ul").on('tap',"li a",function(){
            // console.log(this);
            var id=$(this).data('id');
              that.getBrandData(id);
              $(this).parent().addClass('active').siblings().removeClass('active');     
        })
    },
    // 获取右侧品牌数据的函数
    getBrandData:function(id){
        $.ajax({
            url:"/category/querySecondCategory",
            data:{'id':id},
            // type:'get',
            success:function(obj){
                // console.log(obj);
                // 调用模板
                var html=template('rightTmp',obj);
                $('.right .mui-row').html(html);
            }
        })
    }
}