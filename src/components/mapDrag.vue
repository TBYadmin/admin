<template>

    <div class="mapWrap">
        <a-form-item :label="' 地址'" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }"
                     style="display: inline-block;width: 70%;">
            <a-input v-model="addressSearch"/>
        </a-form-item>
        <a-form-item style="display: inline-block; width: 25%">
            <a-button type="primary" @click="searchLoaction">确定</a-button>
        </a-form-item>
        <div class="map">
            <div id="allmap"></div>
        </div>
        <div class="btn-wrap">
            <a-button type="primary" @click="sureLocation">保存</a-button>
        </div>
    </div>

</template>
<script>
    import BaiduMap from '../utils/map.js'
    import {message} from 'ant-design-vue'

    export default {
        name: "mapDrag",
        data() {
            return {
                map: {},
                location: [],
                addressSearch: '',
                address: ''

            }
        },
        watch: {
            location: {
                handler(newName, oldName) {
                    this.location = newName
                },
                immediate: true,
                deep: true
            },
            address:{
                handler(newName, oldName) {
                    this.address = newName
                },
                immediate: true,
                deep: true
            },
        },
        mounted() {
            let _vm = this;
            BaiduMap.init().then((BMap) => {
                let mk;
                console.log(BMap);
                let map = new BMap.Map('allmap');
                let initLat = 30.244347;
                let initLng = 120.195963;
                let point = new BMap.Point(initLng, initLat);  // 创建点坐标
                map.centerAndZoom(point, 13);
                map.enableScrollWheelZoom();                            // 启用滚轮放大缩小
                map.addControl(new BMap.NavigationControl());
                window.map = map;
                _vm.map = map;
                //获取当前位置
                var geolocation = new BMap.Geolocation();
                geolocation.getCurrentPosition(function (r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                        mk = new BMap.Marker(r.point);
                        mk.addEventListener("dragend", showInfo);
                        mk.enableDragging();    //可拖拽
                        getAddress(r.point);
                        map.clearOverlays();
                        map.addOverlay(mk);//把点添加到地图上
                        map.panTo(r.point);
                    } else {
                        alert('failed' + this.getStatus());
                    }
                });
                setTimeout(function () {
                    document.querySelector('.anchorBL').style.display = 'none';
                    document.querySelector('.BMap_cpyCtrl').style.display = 'none';
                }, 500);

                //绑定Marker的拖拽事件
                function showInfo(e) {
                    // let _vm = this;
                    var gc = new BMap.Geocoder();
                    gc.getLocation(e.point, function (rs) {
                        var addComp = rs.addressComponents;
                        var address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;//获取地址
                        // alert(address);
                        //画图 ---》显示地址信息
                        var label = new BMap.Label(address, {offset: new BMap.Size(20, -10)});
                        map.removeOverlay(mk.getLabel());//删除之前的label
                        _vm.location = [e.point.lng, e.point.lat];
                        _vm.address = address;
                        console.log(_vm.location);
                        console.log(_vm.address);
                        mk.setLabel(label);
                        //alert(e.point.lng + ", " + e.point.lat + ", "+address);

                    });
                }

                // //获取地址信息，设置地址label
                function getAddress(point) {
                    var gc = new BMap.Geocoder();
                    gc.getLocation(point, function (rs) {
                        var addComp = rs.addressComponents;
                        var address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;//获取地址
                        // alert(address);
                        //画图 ---》显示地址信息
                        var label = new BMap.Label(address, {offset: new BMap.Size(20, -10)});
                        map.removeOverlay(mk.getLabel());//删除之前的label
                        mk.setLabel(label);
                        _vm.location = [point.lng, point.lat]//获取经度和纬度，将结果显示在文本框中
                        _vm.address = address;
                        console.log(_vm.location);
                        console.log(_vm.address);
                    });
                }
            })
        },
        methods: {
            searchLoaction() {
                if (this.addressSearch !== '') {
                    map.clearOverlays();
                    //创建查询
                    var localSearch = new BMap.LocalSearch(this.map);
                    localSearch.enableAutoViewport(); //允许自动调节窗体大小
                    //    查询
                    var keyword = this.addressSearch;
                    let _vm = this;
                    localSearch.setSearchCompleteCallback(function (searchResult) {
                        var poi = searchResult.getPoi(0);
                        console.log(_vm.location)
                        map.centerAndZoom(poi.point, 13);
                        let mk = new BMap.Marker(poi.point);
                        mk.addEventListener("dragend", showInfo);
                        mk.enableDragging();    //可拖拽
                        getAddress(poi.point);
                        map.addOverlay(mk);//把点添加到地图上
                        //绑定Marker的拖拽事件
                        function showInfo(e) {
                            // let _vm = this;
                            var gc = new BMap.Geocoder();
                            gc.getLocation(e.point, function (rs) {
                                var addComp = rs.addressComponents;
                                var address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;//获取地址
                                // alert(address);
                                //画图 ---》显示地址信息
                                var label = new BMap.Label(address, {offset: new BMap.Size(20, -10)});
                                map.removeOverlay(mk.getLabel());//删除之前的label
                                _vm.location = [e.point.lng, e.point.lat];
                                _vm.address = address;
                                console.log(_vm.location);
                                console.log(_vm.address);
                                mk.setLabel(label);
                                //alert(e.point.lng + ", " + e.point.lat + ", "+address);

                            });
                        }
                        //获取地址信息，设置地址label
                        function getAddress(point) {
                            var gc = new BMap.Geocoder();
                            gc.getLocation(point, function (rs) {
                                var addComp = rs.addressComponents;
                                var address = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;//获取地址
                                // alert(address);
                                //画图 ---》显示地址信息
                                var label = new BMap.Label(address, {offset: new BMap.Size(20, -10)});
                                map.removeOverlay(mk.getLabel());//删除之前的label
                                _vm.location = [point.lng, point.lat]//获取经度和纬度，将结果显示在文本框中
                                _vm.address = address;
                                mk.setLabel(label);
                            });

                        }
                    });
                    localSearch.search(keyword);
                } else {
                    message.warn('请输入地址信息')
                }
            },
            sureLocation() {
                let _vm=this;
                // console.log(_vm.address)
                let emitparams = [ _vm.location, _vm.address];
                console.log(emitparams)
                this.$emit('getLocation', emitparams);
            },
        }

    }
</script>

<style scoped>
    #allmap {
        width: 6rem;
        height: 4.5rem;
        margin: 0 auto;
    }

    .mapWrap {
        padding: 0 10px;
    }

    .btn-wrap {
        height: 0.4rem;
        text-align: right;
        margin-top: 0.1rem;
    }

    .anchorBL {
        display: none !important;
    }
    input::-webkit-input-placeholder ,textarea::-webkit-input-placeholder{ /* WebKit, Blink, Edge */
        color: #A6A6A6;
        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input:-moz-placeholder,textarea::-webkit-input-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input::-moz-placeholder,textarea::-webkit-input-placeholder { /* Mozilla Firefox 19+ */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }

    input:-ms-input-placeholder,textarea::-webkit-input-placeholder { /* Internet Explorer 10-11 */
        color: #A6A6A6;

        font-size: 0.16rem;
        letter-spacing: 1px;
    }
</style>