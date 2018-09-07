$(function () {
    var letao = new Letao();
    //  获取当前url传递的search 赋值给letao对象的search属性
    letao.search = letao.getQueryString('search');
    letao.scrollToUpData();
    letao.clickSearch();
    letao.sortProduct();
    //调用根据url的参数来刷新页面
    letao.getProductList();
});
var Letao = function () {

}
Letao.prototype = {
    page: 1,
    pageSize: 2,
    search: "",
    // 上下拉刷新页面
    scrollToUpData: function () {
        var that = this;
        mui.init({
            pullRefresh: {
                container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    contentdown: "下拉刷新",
                    contentover: "松开手就可以刷新",
                    contentrefresh: "客官别急",
                    callback: function () {
                        setTimeout(function () {
                            //1. 在下拉刷新之前把page重置为1 因为上拉的时候已经把page加到没有数据 把page重置为起点
                            that.page = 1;
                            // 刷新页面之后要发送请求
                            $.ajax({
                                url: "/product/queryProduct",
                                data: {
                                    page: that.page,
                                    pageSize: that.pageSize,
                                    proName: that.search
                                },
                                success: function (data) {
                                    // console.log(data);                                
                                    var html = template('productListTmp', data);
                                    // console.log(html);  
                                    $('#main .product-content .mui-row').html(html);
                                    mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                                    // 搜索完成后也要重置上拉加载更多
                                    //6. 还要重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
                                    mui('#refreshContainer').pullRefresh().refresh(true);
                                }
                            })
                        }, 1000);
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                },
                up: {
                    contentdown: "下拉刷新",
                    contentover: "松开手就可以刷新",
                    contentrefresh: "客官别急",
                    callback: function () {
                        that.page++;
                        setTimeout(function () {
                            $.ajax({
                                url: "/product/queryProduct",
                                data: {
                                    page: that.page,
                                    pageSize: that.pageSize,
                                    proName: that.search
                                },
                                success: function (data) {
                                    // 判断是否还有数据，如果没有就禁止上拉加载
                                    if (data.data.length > 0) {
                                        // console.log(data);                                
                                        var html = template('productListTmp', data);
                                        // console.log(html);  
                                        $('#main .product-content .mui-row').append(html);
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                                    } else {
                                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                                    }
                                }
                            })
                        }, 1000);
                    }
                }
            }
        })
    },
    // 点击搜索渲染页面
    clickSearch: function () {
        var that = this;
        //添加点击事件
        $('#main .btn-search').on('click', function (e) {
            e = e || window.event;
            e.preventDefault();
            that.search = $('.input-search').val();
            // 判断用户输入的是不是为空
            if (!that.search.trim()) {
                mui.toast('请输入商品名称');
                return;
            }
            $('.input-search').val('');
            // console.log(that.search);
            // 搜索前要重置page=1
            that.page = 1;
            $.ajax({
                url: "/product/queryProduct",
                data: {
                    page: that.page,
                    pageSize: that.pageSize,
                    proName: that.search,
                },
                success: function (data) {
                    // console.log(data);                                
                    var html = template('productListTmp', data);
                    // console.log(html);  
                    $('#main .product-content .mui-row').html(html);
                    // 搜索完成后也要重置上拉加载更多
                    //6. 还要重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
                    mui('#refreshContainer').pullRefresh().refresh(true);
                }
            })
        })
    },
    // 商品的排序
    sortProduct: function () {
        var that = this;
        // 给价格跟数量添加点击事件
        $('#main .product-title a').on('tap', function () {
            // console.log(111);
            // 2. 获取当前点击的a的排序类型
            that.page = 1;
            var sortType = $(this).data('sort-type');
            // console.log(sortType);
            var sort = $(this).data('sort');
            // console.log(sort);
            // 判断sort是否为1.如果为1时就改变值为2，如果为2时就改变为1
            sort = sort == 1 ? 2 : 1;
            // 更新sort
            $(this).data('sort', sort);
            // console.log(sort);
            // 判断点的是价格还是数量来发请求
            if (sortType) {
                //    console.log(111);              
                if (sortType == 'price') {
                    $.ajax({
                        url: "/product/queryProduct",
                        data: {
                            page: that.page,
                            pageSize: that.pageSize,
                            proName: that.search,
                            price: sort,
                        },
                        success: function (data) {
                            // console.log(data);                                
                            var html = template('productListTmp', data);
                            // console.log(html);  
                            $('#main .product-content .mui-row').html(html);
                            // 搜索完成后也要重置上拉加载更多
                            //6. 还要重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
                            mui('#refreshContainer').pullRefresh().refresh(true);
                        }
                    })
                } else {
                    $.ajax({
                        url: "/product/queryProduct",
                        data: {
                            page: that.page,
                            pageSize: that.pageSize,
                            proName: that.search,
                            num: sort,
                        },
                        success: function (data) {
                            // console.log(data);                                
                            var html = template('productListTmp', data);
                            // console.log(html);  
                            $('#main .product-content .mui-row').html(html);
                            // 搜索完成后也要重置上拉加载更多
                            //6. 还要重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
                            mui('#refreshContainer').pullRefresh().refresh(true);
                        }
                    })
                }
            }
        })
    },
    // 根据url来刷新页面
    getProductList: function () {
        // 搜索前要重置page
        this.page = 1;
        // console.log(this.search);        
        $.ajax({
            url: "/product/queryProduct",
            data: {
                page: this.page,
                pageSize: this.pageSize,
                proName: this.search
            },
            success: function (data) {
                // console.log(data);
                var html = template('productListTmp', data);
                // console.log(html);  
                $('#main .product-content .mui-row').html(html);
                // 搜索完成后也要重置上拉加载更多
                //6. 还要重置上拉加载更多 重置的时候会默认自动触发一次上拉加载
                mui('#refreshContainer').pullRefresh().refresh(true);
        }
        })
    },
    //专门获取地址栏参数的方法
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }
}