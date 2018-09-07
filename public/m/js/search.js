$(function () {
    var letao = new Letao();
    letao.queryHistory();
    letao.addHistory();
    letao.removeHistory();
    letao.clearHistory();
});
var Letao = function () {

};
Letao.prototype = {
    // 查询历史记录
    queryHistory: function () {
        // 查询本地储存，没有就为空
        var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
        // console.log(historyList);
        // 从最新搜索再最上面
        historyList.reverse();
        // 调用模板
        var html = template('historyTmp', {
            list: historyList
        });
        // console.log(html);
        // 把数据放到ul里面
        $('#main .search-chistory .content ul').html(html);
    },
    // 点击搜锁添加历史记录
    addHistory: function () {
        var that = this;
        // 给搜索按钮添加点击事件
        $('#main .product-search .btn-search').on('click', function (e) {
            // console.log(111);
            // 获取输入框得文本
            e = e || window.event;
            e.preventDefault();
            var text = $('#main .input-search').val();
            //   console.log(text);
            // 每次查完后就清空输入框
            $('#main .input-search').val('');
            // 判断用户输入得是否为空
            if (!text.trim()) {
                mui.toast('请输入商品名称');
                //    console.log(e);
                return;
            }
            // 定义一个对象来存储本地存储得数据
            var searchObj = {
                id: 1,
                search: text
            }
            // console.log(searchObj.search);
            // 定义一个历史记录数组，如果有历史记录就是以前的记录，如果没值就是一个空数组，要把他变成json
            var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
            // 判断历史记录是否有，如果有，当前新搜索的记录的id等于以前搜索的最后一条记录的id加1
            if (historyList.length > 0) {
                searchObj.id = historyList[historyList.length - 1].id + 1;
            }
            // 判断是否以前已经搜索过了，如果搜索过了就把原先的数据删除掉
            for (var i = 0; i < historyList.length; i++) {
                if (historyList[i].search.trim() == searchObj.search.trim()) {
                    //如果有就把原有的这条记录删除掉。
                    var id = historyList[i].id;
                    historyList.splice(i, 1);
                }
            }
            // 把当前的搜索记录添加到数组中
            historyList.push(searchObj);
            // console.log(JSON.stringify(historyList)); 
            // 最多记录10条最新的记录
            if (historyList.length > 10) {
                historyList.splice(0, historyList.length - 10);
            };
            // 把整个历史记录保存到本地存储中
            localStorage.setItem('historyList', JSON.stringify(historyList));
            // 每次搜素后就自动刷新ul列表
            that.queryHistory();
            // 跳转到商品页面
            window.location.href = 'product.html?search=' + text;
        })
    },
    // 点击x按钮删除历史记录
    removeHistory: function () {
        var that = this;
        // 给所有的x添加点击事件，用事件委托
        $('#main .search-chistory .content ul').on('tap', 'li .remove-history', function () {
            // 拿到当前被点击的id
            // console.log(this);
            var id = $(this).data('id');
            // console.log(id);
            // 获取本地存储的数组
            var historyList = JSON.parse(localStorage.getItem('historyList')) || [];
            // 去本地存储中删除相对应的数据
            // 循环这个数组，删除相对应的数据
            for (var i = 0; i < historyList.length; i++) {
                if (historyList[i].id == id) {
                    // splice是从数组哪个下标开始删，删多少个
                    historyList.splice(i, 1);
                }
            }
            // 把删除完后的数据保存到本地存储中
            localStorage.setItem('historyList', JSON.stringify(historyList));
            that.queryHistory();
        })
    },
    // 清除历史记录
    clearHistory: function () {
        var that = this;
        // 给清除历史记录添加点击事件
        $('#main .clearHistory').on('tap', function () {
            localStorage.removeItem('historyList');
            that.queryHistory();
        })
    },
}