
/**
 * Created by wangshuai on 2016/11/14.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceDealorderAssignController', TserviceDealorderAssignController);
  function TserviceDealorderAssignController($uibModalInstance,InverseService,$rootScope,assignObj,Message,DealorderService,$scope,$state,ActivityService,MapbarMapService) {
    var vm = this;
    vm.title="分派工单";
    vm.requesting=false;
    vm.address="";//车辆实时位置
    vm.userId=$rootScope.userInfo.userId;
    vm.stationId="";
    vm.stationName="";
    vm.stationAddress="";
    vm.stationLon="";
    vm.stationLat="";
    vm.mapbg=false;//地图遮罩层
    vm.info = assignObj;
    vm.close = function (){
      //释放Maplet
      MapbarMapService.decrement(['bmap']);
      $uibModalInstance.dismiss();
    };

    var carLon = 123.4567;
    var carLat = 42.2;
    var stationList = [];
    MapbarMapService.ready(['bmap'], function () {
      $scope.bmap.setMinZoomLevel(4);//设置最小缩放等级
      //获取工单详情
      DealorderService.WorkOrderDetail(vm.info.woCode).then(function (data) {
        vm.info = data;
        vm.stationName = vm.info.stationName;
        getLoc();
      }).catch(function (err) {
        $rootScope.messageError (err, '获取工单详情失败，请稍后重试');
      });
    });

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
        provinceChange();
      }
      /* if(vm.province.id != '' && vm.province.id != null) {
       provinceChange()
       }else{
       vm.CityList = [];
       }*/
    };
    function provinceChange() {
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
      }).catch(function () {
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
    }

    //城市下拉框选择操作
    vm.changeCity=function(){
      vm.mapbg=true;
      if(vm.city==null){
        provinceChange();
        return false;
      }else{
        vm.cityChange();
      }
      // if(vm.city.id != '' && vm.city.id != null) {
      //   vm.cityChange();
      // }
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

    function getLoc() {
      //获取车辆当前位置和各服务站位置等信息
      DealorderService.GetLoc(vm.info.woCode).then(function (data) {
        carLon = data.lon;
        carLat = data.lat;
        var loc = {};
        loc.lat = carLat;
        loc.lon = carLon;
        stationList = data.stationList;
        InverseService.inverse(loc).then(function (data) {
            vm.address = data.data.province.value + data.data.city.value + data.data.dist.value + data.data.road.roadname;
          }
        );

        $scope.bmap.centerAndZoom(new MPoint(carLon, carLat), 10);




        var options = {
          xoffset: -10,
          yoffset: -20,
          enableStyle: true,
          visible: true
        };

        var label = new MLabel("<div style='font-size: 12px;line-height: 12px;'>" + vm.info.carNumber + "</div>", options);

        var marker = new MMarker(
          new MPoint(carLon, carLat),
          new MIcon("/assets/images/static.png", 32, 32),
          null,
          label
        );
        $scope.bmap.addOverlay(marker);//添加marker

        for (var i = 0; i < stationList.length; i++) {
      /*    if(stationList[i].stationId=="654"){
            console.log(stationList[i]);
            var station = new MMarker(
              new MPoint(stationList[i].stationLon, stationList[i].stationLat),
              new MIcon("/assets/images/star.png", 20, 28),
              new MInfoWindow(stationList[i].stationName+"("+stationList[i].serviceCode+")", "距离" + stationList[i].distance + "Km")
            );
            $scope.bmap.centerAndZoom(new MPoint(stationList[i].stationLon,stationList[i].stationLat), 9);
          }else{
            var station = new MMarker(
              new MPoint(stationList[i].stationLon, stationList[i].stationLat),
              new MIcon("/assets/images/follow.png", 20, 28),
              new MInfoWindow(stationList[i].stationName+"("+stationList[i].serviceCode+")", "距离" + stationList[i].distance + "Km")
            );
          }*/

          var station = new MMarker(
            new MPoint(stationList[i].stationLon, stationList[i].stationLat),
            new MIcon("/assets/images/follow.png", 20, 28),
            new MInfoWindow(stationList[i].stationName+"("+stationList[i].serviceCode+")", "距离" + stationList[i].distance + "Km")
          );


          stationList[i].id = station.id;
          MEvent.addListener(station, "click", function (marker) {
            changeStation(marker)
          });
          MEvent.addListener(station, "mouseover", function (marker){
            marker.openInfoWindow();
          });
          $scope.bmap.setIwStdSize(180, 80);
          $scope.bmap.addOverlay(station);

        }
      }).catch(function (err) {
          $rootScope.messageError (err, '获取车辆位置失败，请稍后重试');
          $state.go('tservice.dealorder');
        }
      );
    }


    //切换服务站时赋值与提示
    function changeStation(marker){
      for(var i=0;i<stationList.length;i++) {
        if(stationList[i].id == marker.id) {
          vm.stationName = stationList[i].stationFullName;
          vm.stationAddress = stationList[i].stationAddress;
          vm.stationId = stationList[i].stationId;
          vm.stationLon = stationList[i].stationLon;
          vm.stationLat = stationList[i].stationLat;
          vm.serviceCode = stationList[i].serviceCode;
          vm.info.serviceCode=stationList[i].serviceCode;
          $("#station").attr("value", stationList[i].stationFullName);
          Message.warning("您预约的服务站已由‘"+vm.info.stationName+"’变更为‘" + stationList[i].stationFullName + "’！");
        }
      }
    }


    //提交
    vm.submit = function () {
      if(vm.stationId!='' && vm.stationId != vm.info.stationId) {
        Message.confirm("服务站已变更，确认提交？")
          .then(function () {
           vm.requesting=true;
             DealorderService.ChangeStation(vm.info.woCode, vm.stationId, vm.stationName, vm.stationAddress, vm.stationLon, vm.stationLat)
              .then(function () {
                  DealorderService.AddOperate(vm.info.woCode,'2',vm.info.carVin,vm.userId,2,'7',"由"+vm.info.stationName+"变更为"+vm.stationName)
                    .then(function () {
                      changeStatus(vm.info);
                    })
                    .catch(function (err) {
                      vm.requesting=false;
                      $rootScope.messageError (err, '日志记录失败，请稍后重试');
                    });
              });
          })
      }else{
        vm.requesting=true;
        changeStatus(vm.info);
      }
    };


    function hideBubble() {   /*关闭小windows窗口*/
      $scope.bmap.hideBubble();
    }

    //变更工单状态为待接车
    function changeStatus(filter){
      DealorderService.UpdateStatus(filter.woCode,"2")
        .then(function () {
          Message.success('服务站分派成功！');
          MapbarMapService.decrement(['bmap']);
          $uibModalInstance.close();
        })
        .catch(function (err) {
          vm.requesting=false;
          $rootScope.messageError (err, '修改工单状态失败，请稍后重试');
        });
    }
  }

})();

