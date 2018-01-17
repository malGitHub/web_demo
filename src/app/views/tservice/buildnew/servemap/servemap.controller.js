/**
 * Created by wurui on 2016/10/31.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceBuildnewServemapController', TserviceBuildnewServemapController);
  function TserviceBuildnewServemapController($rootScope,$scope,$timeout,$uibModalInstance,WorkOrderService,MapbarMapService, ActivityService, InverseService,DealorderService,vinCode ) {
    var vm = this;
    vm.falg = false;
    vm.servicestation = {};
    vm.province;
    vm.city;
    vm.title="新建工单";
    vm.mapbg=false;//地图遮罩层
    MapbarMapService.ready(['bmap'], function () {
      $scope.bmap.setMinZoomLevel(4);//设置最小缩放等级
      $scope.bmap.resize(800,400);
      //获取第一个下拉框（省份）
      getProvince();
      function getProvince(){
        ActivityService.getAreaList()
          .then(function (data) {
            vm.AreaList=data;
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }
      //省份选择操作
      vm.changeProvince=function(){
        vm.mapbg=true;
        if(vm.province==null){
          vm.CityList = [];
          $scope.bmap.centerAndZoom(new MPoint(102.38672, 36.90805), 4);
          vm.mapbg=false;
          return false;
        }else{
          vm.provinceChange();
        }
        /*if(vm.province.id != '' && vm.province.id != null) {
          vm.provinceChange();
        }else{
          vm.CityList = [];
        }*/
      };
      vm.provinceChange=function () {
        var opts = {
          keywords: vm.province.name,
          province: vm.province.id,
          search_type: 'for_simple'
        };
        InverseService.getProvinceDistrict(opts)
          .then(function (data) {
          var lonlat = data.data.currentDistrict.centerPoint;
          var lon = lonlat.split(",")[0];
          var lat = lonlat.split(",")[1];
          hideBubble();
          $scope.bmap.centerAndZoom(new MPoint(lon,lat), 6);
          vm.mapbg=false;
          })
          .catch(function () {
            vm.mapbg=false;
          });
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.province.id)
          .then(function (data) {
            vm.CityList = data;
          })
          .catch(function (err) {
            $rootScope.messageError (err, '区域失败，请稍后重试');
          });
      };

      //城市下拉框选择操作
      vm.changeCity=function(){
        vm.mapbg=true;
        if(vm.city==null){
          vm.provinceChange();
          return false;
        }else{
          vm.cityChange();
        }
       /* if(vm.city.id != '' && vm.city.id != null) {
          vm.cityChange();
        }*/
      };

      vm.cityChange = function () {
        var opts = {
          keywords: vm.city.name,
          city: vm.city.id,
          search_type: 'for_simple'
        };

        InverseService.getDistrict(opts)
          .then(function (data) {
          var lonlat = data.data.currentDistrict.centerPoint;
          var lon = lonlat.split(",")[0];
          var lat = lonlat.split(",")[1];
          hideBubble();
          $scope.bmap.centerAndZoom(new MPoint(lon,lat), 9);
          vm.mapbg=false;
        })
          .catch(function () {
            vm.mapbg=false;
          })

      };
      //删除所有的标记MMaker
      function clearMaker() {
        $scope.bmap.clearOverlays();
      }
      /* //改变地图缩放level时重新获取标记并重绘
       MEvent.addListener($scope.bmap, "zoom", function () {
       var le = $scope.bmap.getZoomLevel();
       if (le >= 6) {
       addMaker();
       } else {
       clearMaker();
       }
       });*/
      addMaker();
      function addMaker(){
        //WorkOrderService.query().then(function (data) {
        DealorderService.getPositionOfVIN(vinCode).then(function (data) {
          // var markers = data.list;
          var markers = data.stationList;
          vm.car={lon:data.lon,lat:data.lat};
          addMaker(vm.car);
          function addMaker(opts) {
            vm.carMarker = new MMarker(
              new MPoint(opts.lon,opts.lat),
              new MIcon("/assets/images/static.png",32,32)
            );
            $scope.bmap.addOverlay(vm.carMarker);//添加marker
            $scope.bmap.centerAndZoom(new MPoint(opts.lon, opts.lat),10);
          }
          for (var i=0;i<markers.length;i++) {
            var servicestation = markers[i];

            var marker = new MMarker(
              new MPoint(servicestation.stationLon,servicestation.stationLat),
              new MIcon("/assets/images/follow.png", 20, 28),
              new MInfoWindow(servicestation.stationName+"("+servicestation.serviceCode+")", "距离" + servicestation.distance + "Km")
            );
            // if(servicestation.stationId=="654"){
            //   var marker = new MMarker(
            //     new MPoint(servicestation.stationLon,servicestation.stationLat),
            //     new MIcon("/assets/images/star.png", 20, 28),
            //     new MInfoWindow(servicestation.stationName+"("+servicestation.serviceCode+")", "距离" + servicestation.distance + "Km")
            //   );
            // }else{
            //   var marker = new MMarker(
            //     new MPoint(servicestation.stationLon,servicestation.stationLat),
            //     new MIcon("/assets/images/follow.png", 20, 28),
            //     new MInfoWindow(servicestation.stationName+"("+servicestation.serviceCode+")", "距离" + servicestation.distance + "Km")
            //   );
            // }
            $scope.bmap.setIwStdSize(180, 80);
            marker.closureData = i;
            MEvent.addListener(marker, "click", function (marker){
              $scope.$apply(function () {
                vm.stationName=markers[marker.closureData].stationFullName;
                vm.serviceCode=markers[marker.closureData].serviceCode;
                vm.serviceAddress=markers[marker.closureData].stationAddress;
                vm.servicestation = markers[marker.closureData];
              });
            });
            MEvent.addListener(marker, "mouseover", function (marker){
              marker.openInfoWindow();
            });

            $scope.bmap.addOverlay(marker);//添加marker
          }


        })
      }
    });

    function hideBubble() {   /*关闭小windows窗口*/
      $scope.bmap.hideBubble();
    }
    vm.addStation = function () {
      //释放Maplet
      MapbarMapService.decrement(['bmap']);
      $uibModalInstance.close(vm.servicestation);
    };

    vm.closeEdit = function () {
      //释放Maplet
      MapbarMapService.decrement(['bmap']);
      $uibModalInstance.dismiss();
    };

    vm.itembaoyang="";
    vm.requesting = false;

  }
})();
