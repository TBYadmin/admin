<template>

    <a-layout>
        <div class="analyse-wrap">
            <div class="state-statistical">
                <div class="state-item" v-for="(item,index) in stateCompare" :key="index">
                    <div class="top"> {{item.name}}
                        <mark>{{item.rate}}</mark>
                    </div>
                    {{item.number}}
                </div>
            </div>
            <!--中部-->
            <div class="analyse-middle">
                <div class="product-overview"></div>
                <div class="calendar-wrap"></div>
                <div class="clock-wrap" >
                    <div class="clock">
                        <div class="h" id="hour"></div>
                        <div class="m" id="minute"></div>
                        <div class="s" id="second"></div>
                    </div>
                </div>
            </div>
            <!--折线图-->
            <div class="user-statistics">
                <span class="box-title">用户日增折线图</span>
                <div class="chart-wrap">
                    <div id="userStatisticsChart" ref="userStatisticsChart"></div>
                </div>
            </div>


        </div>

    </a-layout>

</template>
<script>
import '../../assets/fontStyle/fontStyle.css'
    export default {
        name: 'analyse',
        data() {
            return {
                stateCompare: [
                    {name: '今日订单数', number: '1080', rate: '+4.9%'},
                    {name: '今日销售额', number: '80000', rate: '+4.9%'},
                    {name: '本月订单数', number: '80000', rate: '+4.9%'},
                    {name: '今日销售额', number: '965200', rate: '+4.9%'},
                ]
            }
        },
        mounted() {
            this.clock()
            this.drawUserStatisticsChart()
        },
        methods: {
            drawUserStatisticsChart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('userStatisticsChart'))
                // 绘制图表
                var xData = ["2019-03-01", "2019-03-02", "2019-03-03", "2019-03-04", "2019-03-05", "2019-03-06", "2019-03-07", "2019-03-08", "2019-03-09", "2019-03-10", "2019-03-11", "2019-03-12", "2019-03-13", "2019-03-14", "2019-03-15", "2019-03-16", "2019-03-17", "2019-03-18", "2019-03-19", "2019-03-20"];
                var yData1 = [12, 5, 12, 46, 22, 24, 15, 5, 54, 18, 24, 18, 31, 25, 27, 14, 15, 21, 20, 17];
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        // axisPointer: {
                        //     type: 'cross'
                        // }
                    },
                    dataZoom: [{
                        type: 'slider',
                        show: true,
                        height: 15,
                        left: '10%',
                        right: '10%',
                        bottom: '0%',
                        start: 50,
                        end: 100,
                        // backgroundColor:'rgba(45,168,255,0.4)',
                        textStyle: {
                            color: '#d4ffff',
                            fontSize: 11,
                        },
                    },

                    ],
                    grid: {
                        right: '0%',
                        bottom: '15%',
                        left: '0%',
                        top: '5%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: xData,
                        name: '时间',
                        nameTextStyle: {
                            color: '#d4ffff'
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#E7E7E7'
                            }
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: "#999999",
                                fontSize: 12,
                            },
                        },
                    }],
                    yAxis: [{
                        type: 'value',
                        name: '人数',
                        nameTextStyle: {
                            color: '#d4ffff'
                        },
                        position: 'left',
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            lineStyle: {
                                color: "#E7E7E7",
                            }

                        },
                        axisLabel: {
                            color: '#999',
                            fontSize: 14,
                        }
                    },],
                    series: [{
                        name: '用户日增人数',
                        type: 'line',
                        yAxisIndex: 0,
                        symbolSize: 12,
                        symbol: 'image://https://image.supconit.net/lineChartSymbol.png',
                        itemStyle: {
                            normal: {
                                color: '#2DA8FF',
                            }
                        },
                        data: yData1
                    },


                    ]

                });

            },
            clock(){
                let hour = document.getElementById("hour");
                let minute = document.getElementById("minute");
                let second = document.getElementById("second");
                // 开始定时器
                var s = 0,m = 0, h = 0, ms = 0;
                setInterval(function() {
                    // 内容就可以了
                    var date = new Date();  // 得到最新的时间
                    ms = date.getMilliseconds(); // 现在的毫秒数
                    s = date.getSeconds() + ms / 1000;  //  得到秒 1.3 s
                    m = date.getMinutes() + s / 60;  //  得到的是分数  45.6分钟
                    h = date.getHours() % 12 + m / 60 ;
                    //console.log(h);
                    //旋转角度
                    // 一圈  360 °     一共有 60 秒       每秒  6 °   现在是 s秒
                    second.style.WebkitTransform = "rotate("+ s*6 +"deg)";
                    //  变化            旋转    deg  度
                    minute.style.WebkitTransform = "rotate("+ m*6 +"deg)";
                    hour.style.WebkitTransform = "rotate("+ h*30 +"deg)";
                    second.style.MozTransform = "rotate("+ s*6 +"deg)";
                    //  变化            旋转    deg  度
                    minute.style.MozTransform = "rotate("+ m*6 +"deg)";
                    hour.style.MozTransform = "rotate("+ h*30 +"deg)";
                },100);
            }
        }
    }
</script>
<style scoped>
    .analyse-wrap {
        width: 100%;
        height: auto;

    }

    .state-statistical, .analyse-middle {
        width: 100%;
        height: 1.4rem;
        margin-top: 0.3rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 0 0.4rem ;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .state-item {
        width: 3.26rem;
        height: 1.08rem;
        border-radius: 8px;
        background: rgba(254, 120, 122, 1);
        -webkit-box-shadow: 2px 5px 5px rgba(254, 120, 122, 0.4);
        -moz-box-shadow: 2px 5px 5px rgba(254, 120, 122, 0.4);
        box-shadow: 2px 5px 5px rgba(254, 120, 122, 0.4);
        padding: 0.22rem 0.1rem 0 0.35rem;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        font-size: 0.35rem;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        font-family: FZCQJW;
        letter-spacing: 1px;
    }

    .state-item:nth-child(1) {
        background: rgba(96, 184, 246, 1);
        -webkit-box-shadow: 2px 5px 5px rgba(96, 184, 246, 0.4);
        -moz-box-shadow: 2px 5px 5px rgba(96, 184, 246, 0.4);
        box-shadow: 2px 5px 5px rgba(96, 184, 246, 0.4);
    }

    .state-item:nth-child(3) {
        background: rgba(236, 146, 224, 1);
        -webkit-box-shadow: 2px 5px 5px rgba(236, 146, 224, 0.4);
        -moz-box-shadow: 2px 5px 5px rgba(236, 146, 224, 0.4);
        box-shadow: 2px 5px 5px rgba(236, 146, 224, 0.4);
    }

    .state-item:nth-child(4) {
        background: rgba(251, 187, 110, 1);
        -webkit-box-shadow: 2px 5px 5px rgba(251, 187, 110, 0.4);
        -moz-box-shadow: 2px 5px 5px rgba(251, 187, 110, 0.4);
        box-shadow: 2px 5px 5px rgba(251, 187, 110, 0.4);
    }

    .state-item .top {
        height: 16px;
        font-size: 15px;
        line-height: 16px;
        font-family: 微软雅黑;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        margin-bottom: 0.1rem;
    }

    .state-item .top mark {
        background: transparent;
        height: 16px;
        display: block;
        line-height: 16px;
        float: right;
        color: #fff;
        padding: 0;
    }

    .analyse-middle {
        height: 3rem;
    }

    .product-overview, .calendar-wrap, .clock-wrap {
        width: 8.1rem;
        height: 3rem;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 15px 0px rgba(45, 60, 79, 0.15);
        border-radius: 8px;
    }

    .calendar-wrap {
        width: 3.53rem;
    }

    .clock-wrap {
        width: 2.83rem;
    }

    .user-statistics {
        padding: 0.2rem;
        width: 15rem;
        height: 5rem;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 15px 0px rgba(45, 60, 79, 0.15);
        border-radius: 8px;
        margin: 0.3rem auto;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .box-title {
        display: block;
        height: 18px;
        font-size: 18px;
        font-family: 微软雅黑;
        font-weight: 400;
        color: rgba(66, 159, 255, 1);
        margin-bottom: 10px;
    }

    .chart-wrap {
        height: calc(100% - 28px);
        width: 100%;

    }

    .chart-wrap > div {
        width: 100%;
        height: 100%;
    }

    /**
    时钟
     */

    .clock {
        width:1.94rem;
        height: 1.94rem;
        margin: 0.53rem auto;
        background: url('../../assets/images/clockBG.png') no-repeat center;
        background-size: 100% 100%;
        position: relative;
    }

    .clock div {
        width:100%;
        height:100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;

    }

    .h {
        background: url('../../assets/images/hour.png') no-repeat center center;
        background-size: 0.05rem 90%;
    }

    .m {
        background: url('../../assets/images/minutes.png') no-repeat center center;
        /*background-size: 10px 100%;*/
        background-size: 0.04rem 90%;
    }

    .s {
        background: url('../../assets/images/second.png') no-repeat center center;
        background-size: 0.02rem 95%;
    }
</style>
