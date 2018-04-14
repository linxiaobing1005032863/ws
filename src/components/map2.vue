<template>

    <div id="container" class="map-container" :width="width" :height="height"></div>

 <!--  <div id="container" style="width:650px; height:250px;border-radius: 8px;"></div> -->

</template>
<script>
  export default {
    props:{
      disabled:{
        type:Boolean,
        default:false
      },
      width:{
        default:350
      },
      height:{
        default:350
      }
    },
    data(){
      return {
        initParam:{},
        map: null,//地图实例
        geolocation: null,
        geocoder: null,
        marker: null,
      }
    },
    methods:{
      /**
       * @description 更新地图显示中心点和标记
       * @param address
       */
      updateMap(address){
        if(Array.isArray(address)) {
          this.map.setZoomAndCenter(14,address);
          this.marker.setPosition(address);
          this.getAddress(address).then(data => this.$emit('update',data));
        } else {
          console.log(address)
          //地址转换经纬度
          this.getLocation(address).then(data => {
            this.map.setZoomAndCenter(14,data);
            this.marker.setPosition(data);
          })
        }
      },
      /**
       * @description 地图更新完毕事件
       * @param data
       */
      handleComplete(data){
          this.$emit('complete',{
            province:data.addressComponent.province,
            city:data.addressComponent.city,
            district:data.addressComponent.district,
            formattedAddress:data.formattedAddress,
          });
      },
      /**
       * @description 地图点击事件
       * @param e
       */
      handleClick(e){
        if (!this.disabled) {
          this.map.setZoomAndCenter(14, [e.lnglat.getLng(), e.lnglat.getLat()]);
          this.marker.setPosition([e.lnglat.getLng(), e.lnglat.getLat()]);
          this.getAddress([e.lnglat.getLng(),e.lnglat.getLat()]).then(data => this.$emit('click',data))
        }
      },
      /**
       * @description 地址 -> 经纬度
       * @param address
       * @returns {*}
       */
      getLocation(address = '广东省广州市荔湾区'){
        if (!this.geocoder) {
          console.warn('please init map geocoder');
          return false;
        }
        return new Promise((resolve,reject) => {
          this.geocoder.getLocation(address, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              //TODO:获得了有效经纬度，可以做一些展示工作
             resolve([result.geocodes[0].location.lng,result.geocodes[0].location.lat])
            }else{
              //获取经纬度失败
              console.warn('map.vue -> getLocation -> 获取经纬度失败');
              reject();
            }
          });
        })
      },
      /**
       * @description 经纬度 -> 地址
       * @param lnglatXY
       * @returns {*}
       */
      getAddress(lnglatXY){
        if (!this.geocoder) {
          console.warn('please init map geocoder');
          return false;
        }
        return new Promise ((resolve,reject)=>{
          this.geocoder.getAddress(lnglatXY, (status, result) =>{
            if (status === 'complete' && result.info === 'OK') {
              resolve({
                province:result.regeocode.addressComponent.province,
                city:result.regeocode.addressComponent.city,
                district:result.regeocode.addressComponent.district,
                formattedAddress:result.regeocode.formattedAddress,
              })
            }else{
              //获取地址失败
              console.warn('map.vue -> getAddress -> 获取地址失败');
              reject();
            }
          });
        })
      }
    },
    mounted(){
      /**
       * @description 组件初始化
       */
      this.$on('mapInit',
        (op = {}) => {
          let _this = this;
          _this.initParam = Object.assign({initAddress: null,zoom: 6,resizeEnable:true},op);
          _this.map = new AMap.Map('container', {
            zoom: _this.initParam.zoom,
            resizeEnable: _this.initParam.resizeEnable
          });
          _this.marker = new AMap.Marker({map: _this.map});

          AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation'],
            () => {
              _this.map.addControl(new AMap.ToolBar());

              _this.map.addControl(new AMap.Scale());

              _this.geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition: 'RB'
              });

              _this.map.addControl(_this.geolocation);

              if (!_this.initParam.initAddress) {//没传入初始位置则直接定位当前
                _this.geolocation.getCurrentPosition();
              }

              AMap.event.addListener(_this.geolocation, 'complete', _this.handleComplete);
            });

          AMap.service('AMap.Geocoder',
            () => {//回调函数
              //实例化Geocoder
              _this.geocoder = new AMap.Geocoder();
              //TODO: 使用geocoder 对象完成相关功能
              if (op.initAddress) {//传入初始位置则直接定位
                _this.updateMap(op.initAddress);
              }
            });
          _this.map.on('click',_this.handleClick);
        });
      /**
       * @description 更新地图
       */
      this.$on('updateMap',this.updateMap);
    }
  }
</script>
<style lang="scss">
  .map-container {
    width: 350px;
    height: 350px;
    border-radius: 8px;
  }
</style>
