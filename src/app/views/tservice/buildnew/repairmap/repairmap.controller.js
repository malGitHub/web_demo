/**
 * Created by wurui on 2016/10/31.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceBuildnewRepairmapController', TserviceBuildnewRepairmapController);
  function TserviceBuildnewRepairmapController($scope,$uibModalInstance,$rootScope,InverseService,MapbarMapService,ActivityService,vinCode,DealorderService) {
    var vm = this;
    vm.result = {};
    vm.address = '';
    var stationList = [];
    vm.searchAreashow=false;
    MapbarMapService.ready(['bmap'], function () {
      $scope.bmap.setMinZoomLevel(4);//设置最小缩放等级
      $scope.bmap.centerAndZoom(new MPoint(102.38672, 36.90805), 4);
      DealorderService.getPositionOfVIN(vinCode).then(function (data) {
        vm.car={lon:data.lon,lat:data.lat};
        InverseService.inverse(vm.car).then(function (data) {
            vm.address = data.data.province.value + data.data.city.value + data.data.dist.value + data.data.road.roadname;
          }
        );
        outAddress(vm.car);
        stationList = data.stationList;

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
          if(vm.province==null){
            vm.storeType = '';
            vm.StoreList = [];
            vm.CityList = [];
            $scope.bmap.centerAndZoom(new MPoint(102.38672, 36.90805), 4);
            return false;
          }
          if(vm.province.id != '' && vm.province.id != null) {
            vm.provinceChange()
          }else{
            vm.storeType = '';
            vm.StoreList = [];
            vm.CityList = [];
          }
        };

        vm.provinceChange=function () {
          var opts = {
            keywords: vm.province.name,
            province: vm.province.id,
            search_type: 'for_simple'
          };
          InverseService.getProvinceDistrict(opts).then(function (data) {
            var lonlat = data.data.currentDistrict.centerPoint;
            var lon = lonlat.split(",")[0];
            var lat = lonlat.split(",")[1];
            $scope.bmap.centerAndZoom(new MPoint(lon,lat), 6);
          });
          //获取第二个下拉框（城市）
          ActivityService.getAreaList(vm.province.id)
            .then(function (data) {
              vm.CityList = data;
              vm.storeType = '';
              vm.StoreList = [];
            })
            .catch(function (err) {
              $rootScope.messageError (err, '区域失败，请稍后重试');
            });
        };
        //城市下拉框选择操作
        vm.changeCity=function(){
          vm.storeType='';
          vm.StoreList=[];
          if(vm.city==null){
            vm.provinceChange();
            return false;
          }
          if(vm.city.id != '' && vm.city.id != null) {
            vm.cityChange();
          }
        };

        vm.cityChange = function () {
          var opts = {
            keywords: vm.city.name,
            city: vm.city.id,
            search_type: 'for_simple'
          };

          InverseService.getDistrict(opts).then(function (data) {
            var lonlat = data.data.currentDistrict.centerPoint;
            var lon = lonlat.split(",")[0];
            var lat = lonlat.split(",")[1];
            $scope.bmap.centerAndZoom(new MPoint(lon,lat), 9);
          })

        };

        $scope.bmap.centerAndZoom(new MPoint(vm.car.lon, vm.car.lat), 10);


        vm.carMarker = new MMarker(
          new MPoint(vm.car.lon, vm.car.lat),
          new MIcon("/assets/images/static.png", 32, 32),
          null
        );
        $scope.bmap.addOverlay(vm.carMarker);//添加marker


        // for (var i = 0; i < stationList.length; i++) {
        //   var station = new MMarker(
        //     new MPoint(stationList[i].stationLon, stationList[i].stationLat),
        //     new MIcon("/assets/images/follow.png", 20, 28),
        //     // new MInfoWindow(stationList[i].stationName, "距离" + stationList[i].distance + "Km")
        //     new MInfoWindow("服务站编码:"+stationList[i].serviceCode,"服务站名称:"+stationList[i].stationName)
        //   );
        //   stationList[i].id = station.id;
        //   station.closureData = i;
        //   MEvent.addListener(station, "click", function (marker) {
        //     console.log(marker);
        //     $scope.$apply(function () {
        //       vm.stationName=stationList[marker.closureData].stationName;
        //       vm.serviceCode=stationList[marker.closureData].serviceCode;
        //     });
        //   });
        //   $scope.bmap.setIwStdSize(180, 80);
        //   $scope.bmap.addOverlay(station);
        //
        // }

        /*   WorkOrderService.query().then(function (data) {
         var markers = data.list;
         for (var i=0;i<markers.length;i++) {
         var servicestation = markers[i];
         var station = new MMarker(
         new MPoint(servicestation.lon,servicestation.lat),
         new MIcon("/assets/images/follow.png", 20, 28)
         );
         station.closureData = i;
         MEvent.addListener(station, "click", function (marker){
         console.log("click");
         $scope.$apply(function () {
         vm.stationName=markers[marker.closureData].stationName;
         vm.serviceCode=markers[marker.closureData].serviceCode;
         vm.serviceAddress=markers[marker.closureData].address;
         vm.servicestation = markers[marker.closureData];
         });
         });
         $scope.bmap.addOverlay(station);//添加station
         }
         });*/

        MEvent.addListener($scope.bmap, "click", function (e,p) {
          vm.car = {lon:p.lon,lat:p.lat};
          outAddress(vm.car);
        });
        function outAddress(opts) {
          InverseService.inverse(opts).then(function (data) {
            var address = data.data.province.value + data.data.city.value + data.data.dist.value + data.data.road.roadname;
            vm.result.repairAdd = address;
            vm.result.repairLon = opts.lon;
            vm.result.repairLat = opts.lat;
            vm.address=address;
            addMaker(opts);
          })
        }

        //删除所有的标记MMaker
        function clearMaker() {
          $scope.bmap.clearOverlays();
        }
        vm.addressChange = function () {
          if(vm.address==''){
            return false;
          }
          $scope.bmap.removeOverlay(vm.carMarker, false);
          var opts = {
            keywords: encodeURIComponent(vm.address),
            search_type: 'for_poi'
          };
          InverseService.getPoi(opts).then(function (data) {
            var lonlat = data.data.pois[0].location;
            var lon = lonlat.split(",")[0];
            var lat = lonlat.split(",")[1];
            vm.result.repairAdd = vm.address;
            vm.result.repairLon = lon;
            vm.result.repairLat = lat;
            vm.car = {lon: lon,lat:lat};
            $scope.bmap.centerAndZoom(new MPoint(vm.car.lon, vm.car.lat), 10);
            addMaker(vm.car)
          })
        };
        /*搜索地址*/
        vm.searchReasult='';
        vm.addressFind = function () {
          if(vm.searchReasult==''){
            return false;
          }
          clearMaker();
          outAddress(vm.car);
          vm.searchAreashow=true;
          var opts = {
            keywords: encodeURIComponent(vm.searchReasult),
            search_type: 'for_poi'
          };
          InverseService.getPoiMore(opts).then(function (data) {
            vm.searchAreas=data.data.pois;
            var markers =data.data.pois;
            var lonlat = data.data.pois[0].location;
            var lon = lonlat.split(",")[0];
            var lat = lonlat.split(",")[1];
            var opts = {lon: lon,lat:lat};
            $scope.bmap.centerAndZoom(new MPoint(lon,lat), 11);
            for(var i=0;i<markers.length;i++){
              var servicestation = markers[i];
              var station = new MMarker(
                new MPoint(servicestation.location.split(",")[0],servicestation.location.split(",")[1]),
                new MIcon("/assets/images/gj_err.png", 24,28),
                new MInfoWindow("搜索结果:",servicestation.name)

              );
              $scope.bmap.setIwStdSize(180, 80);
              $scope.bmap.addOverlay(station);//添加station
              station.closureData = i;
              MEvent.addListener(station, "mouseover", function (marker){
                marker.openInfoWindow();
              });
              MEvent.addListener(station, "click", function (marker){
                vm.car={lon:marker.pt.lon,lat:marker.pt.lat};
                outAddress(vm.car);
              });
            }
            /*   WorkOrderService.query().then(function (data) {
             var markers = data.list;
             for (var i=0;i<markers.length;i++) {
             var servicestation = markers[i];
             var station = new MMarker(
             new MPoint(servicestation.lon,servicestation.lat),
             new MIcon("/assets/images/follow.png", 20, 28)
             );
             station.closureData = i;
             MEvent.addListener(station, "click", function (marker){
             console.log("click");
             $scope.$apply(function () {
             vm.stationName=markers[marker.closureData].stationName;
             vm.serviceCode=markers[marker.closureData].serviceCode;
             vm.serviceAddress=markers[marker.closureData].address;
             vm.servicestation = markers[marker.closureData];
             });
             });
             $scope.bmap.addOverlay(station);//添加station
             }
             });*/
            /*点击搜索结果*/
            /*    MEvent.addListener(vm.searchAds, "click", function (marker) {
             $scope.bmap.removeOverlay(vm.searchAds, false);
             outAddress(opts)
             });*/
          })
        };
        vm.searchAreaClick=function (obj) {
          vm.searchAreashow=false;
          var params=obj.split(",");
          $scope.bmap.centerAndZoom(new MPoint(params[0],params[1]), 11);
          /*  addsearchAds(params)*/
          vm.car={lon:params[0],lat:params[1]};
          outAddress(vm.car);
        };
        /*function addsearchAds(opts) {
         $scope.bmap.removeOverlay(vm.searchAds, false);
         vm.searchAds = new MMarker(
         new MPoint(opts[0],opts[1]),
         new MIcon("/assets/images/gj_err.png",24,28)
         );
         $scope.bmap.addOverlay(vm.searchAds);//添加marker
         MEvent.addListener(vm.searchAds, "click", function () {
         vm.searchAreashow=false;
         $scope.bmap.removeOverlay(vm.searchAds, false);
         outAddress({lon:opts[0],lat:opts[1]})
         });
         }*/
        vm.clearSearch=function () {
          vm.searchReasult='';
          vm.searchAreashow=false;
          clearMaker();
          outAddress(vm.car);
        };
        function addMaker(opts) {
          $scope.bmap.removeOverlay(vm.carMarker, false);
          vm.carMarker = new MMarker(
            new MPoint(opts.lon,opts.lat),
            new MIcon("/assets/images/static.png",32,32)
          );
          $scope.bmap.addOverlay(vm.carMarker);//添加marker
        }
        //点击id为search之外的地方触发
        angular.element("body").bind("click",function(e){
          if(vm.searchAreashow==true){
            var target = $(e.target);
            if(target.closest("#searchList").length == 0&&target.closest("#search").length == 0){
              $scope.$apply(function () {
                vm.searchAreashow=false;
              });
            }
          }
        });

        /*   //改变地图缩放level时重新获取标记并重绘
         MEvent.addListener($scope.bmap, "zoom", function () {
         var le = $scope.bmap.getZoomLevel();
         if (le >= 6) {
         addMakerStation();
         } else {
         clearMaker();
         }
         });*/
        /*            addMakerStation()
         function addMakerStation(){
         WorkOrderService.query().then(function (data) {
         /!*              clearMaker();*!/
         var markers = data.list;
         for (var i=0;i<markers.length;i++) {
         var servicestation = markers[i];
         var marker = new MMarker(
         new MPoint(servicestation.lon,servicestation.lat),
         new MIcon('<div class="amp-icon"></div>')
         );
         $scope.bmap.addOverlay(marker);//添加marker
         marker.closureData = i;
         MEvent.addListener(marker, "click", function (marker){
         $("#stationName").html(markers[marker.closureData].stationName);
         $("#address").val(markers[marker.closureData].address);
         vm.servicestation = markers[marker.closureData];
         });
         }
         })
         }*/
      })
        .catch(function (err) {
          $rootScope.messageError (err, '获取失败，请稍后重试');
        });


    });
    vm.title="报修地址";
    vm.addStation = function () {
      //释放Maplet
      MapbarMapService.decrement(['bmap']);
      $uibModalInstance.close(vm.result);
    };
    vm.closeEdit = function () {
      //释放Maplet
      MapbarMapService.decrement(['bmap']);
      $uibModalInstance.dismiss();
    };
  }
})();
