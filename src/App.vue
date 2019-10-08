<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
  #app{
    width: 100%;
    height: 100%;
    font-family: 微软雅黑;
  }
</style>

<script>
    init();
    //当浏览器窗口大小改变时，设置显示内容的高度
    window.onresize=function(){
        init();
    }
    /**
     * 根元素字体自适应
     */
    function init() {
        var whdef = 100 / 1920;// 表示1920的设计图,使用100PX的默认值
        var wH = window.screen.height;// 当前窗口的高度
        var wW = window.screen.width;// 当前窗口的宽度
        var rem = wW * whdef;// 以默认比例值乘以当前窗口宽度,得到该宽度下的相应FONT-SIZE值
        document.getElementsByTagName('html')[0].style.fontSize = rem + "px";
    };

</script>