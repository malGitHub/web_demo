(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceBuildnewController', TserviceBuildnewController);

  /** @ngInject */
  function TserviceBuildnewController($rootScope,$stateParams, $state,$scope, $uibModal, GetTemplateUrl, GetControllerName,Message,OperateService,WorkOrderService) {
    var vm = this;
    var chassisNum = $stateParams.chassisNum;
    vm.temp_serviceCarrepairBtype = false;
    vm.temp_serviceCarmaintainBtype = false;
    vm.requesting=false;
    vm.workOrder = {
      /*woCode: '',*/
      csWoCode: '',
      orderWay: '1',
      serviceStationId: '',
      serviceStationAdd: '',
      serviceStationName: '',
      serviceStationLon: '',
      serviceStationLat: '',
      serviceStationTel: '',
      serviceCarrepairBtype: '',
      serviceCarrepairStype: '', //维修项目
      serviceCarmaintainBtype: '',
      serviceCarmaintainStype: '', // 保养项目
      woType: '',
      repairItemCode: '',
      woStatus: 2,
      operaterCode: $rootScope.userInfo.userId,
      operaterName: $rootScope.userInfo.userName,
      operaterRule: '',
      processorCode: $rootScope.userInfo.userId,
      processorName: '',
      processorRule: '',
      managerCode: '',
      managerName: '',
      managerRule: '',
      chassisNum: chassisNum,
      driverRegTel: '',
      repairName: '',
      repairTel: '',
      repairAdd: '',
      repairLon: '',
      repairLat: '',
      userFeedback: '',
      vinCode: '',
      orderTme: '',
      fileUrls: '',
      telCheckFlag:0,
      isExceptionFlag:0
    };

    /*queryWoCode();*/
    getCarInfo();
    repairList();
    maintainList();
    queryRuleList();

    /*获取工单号*/
    function queryWoCode () {
      WorkOrderService.queryWoCode().then(function (data) {
        vm.workOrder.woCode = data.woCode;
      })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    function getCarInfo () {
      WorkOrderService.carInfoList(1,1,{chassisCode:chassisNum}).then(function (data) {
        vm.carInfo = data.list[0];
        vm.workOrder.vinCode = vm.carInfo.vinCode;
        WorkOrderService.queryDriverInfoList(vm.workOrder.vinCode)
          .then(function (data) {
            vm.drivePhones=data;
          })
          .catch(function () {
         });
      })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    //维修项目
    function repairList () {
      OperateService.itemList(2).then(function (data) {
        vm.repair_item = data;
      })
    }

    //保养项目
    function maintainList () {
      OperateService.itemList(1).then(function (data) {
        vm.maintain_item = data;
      })
    }

    function queryRuleList () {
      OperateService.queryRuleList($rootScope.userInfo.userId)
        .then(function (data) {
        vm.workOrder.managerCode=data.masterId;
        vm.workOrder.operaterRule = data.userRule;
      })
    }

    //need data
    vm.MISSON_TYPE=[
      {key:'1', value:'进出站'},{key:'2', value:'外出救援'}
    ];
    vm.openMap=function(){
      $uibModal.open({
        templateUrl:GetTemplateUrl('tservice.buildnew.repairmap'),
        controller: GetControllerName('tservice.buildnew.repairmap'),
        controllerAs: 'vm',
        windowClass: 'tservice-dealorder-small-assign overhidx',
        backdrop: false,
        resolve: {
          vinCode: function () {return vm.workOrder.vinCode;}
        }
      }).result.then(function (result) {//回传到父级页面
        vm.workOrder.repairAdd = result.repairAdd;
        vm.workOrder.repairLon = result.repairLon;
        vm.workOrder.repairLat = result.repairLat;
      });
    };

    vm.openServeTest = "选择";
    vm.openServeMap=function(){
      $uibModal.open({
        templateUrl:GetTemplateUrl('tservice.buildnew.servemap'),
        controller: GetControllerName('tservice.buildnew.servemap'),
        controllerAs: 'vm',
        windowClass: 'tservice-dealorder-small-assign overhidx',
        backdrop: false,
        resolve: {
          vinCode: function () {return vm.workOrder.vinCode;}
        }
      }).result.then(function (result) {//回传到父级页面
        vm.workOrder.serviceStationId = result.stationId;
        vm.workOrder.serviceStationAdd = result.stationAddress;
        vm.workOrder.serviceStationName = result.stationFullName;
        vm.workOrder.serviceStationLon = result.stationLon;
        vm.workOrder.serviceStationLat = result.stationLat;
        vm.workOrder.serviceStationTel = result.phone;
        vm.openServeTest = "重新选择";
      });
    };

    //选择工单类型
    vm.repairGroups=false;
    vm.ordertime=false;
    vm.changeSelect=function(params){
      if(params=="2"){
        vm.repairGroups=true;
        vm.ordertime=false;
        vm.workOrder.orderTime="";
      }else if(params=="1"){
        vm.repairGroups=false;
        vm.ordertime=true;
      }else{
        vm.repairGroups=false;
        vm.ordertime=false;
        vm.workOrder.orderTime="";
      }
    };

    vm.ordertimeChange=function () {
      vm.workOrder.orderTime=vm.workOrder.orderTime.replace(/\./g, '');
    };
    function submit531(err) {
      var error=err;
      console.log(error);
      $uibModal.open({
        templateUrl:GetTemplateUrl('tservice.buildnew.wocode'),
        controller: GetControllerName('tservice.buildnew.wocode'),
        controllerAs: 'vm',
        backdrop: false,
        resolve: {
          Code: function () {return error.data.woCodeList;}
        }
      }).result.then(function () {//回传到父级页面
      });
    }

    function submit532(err) {
      Message.confirm(err.message)
        .then(function () {
          vm.workOrder.isExceptionFlag =1;
          WorkOrderService.workOrderAdd(vm.workOrder)
            .then(function () {
              $state.go('tservice.build');
            })
            .catch(function (err) {
              if(err.resultCode == 531){
                submit531(err);
              }
              else{
                $rootScope.catchError(err);
              }
            });
        });
    }


    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        vm.workOrder.serviceCarrepairStype="";
        for (var i=0;i<vm.repair_item.length;i++) {
          if (vm.repair_item[i].isChecked) {
            if (vm.workOrder.serviceCarrepairStype == '') {
              vm.workOrder.serviceCarrepairStype = vm.repair_item[i].itemName;
            } else {
              vm.workOrder.serviceCarrepairStype = vm.workOrder.serviceCarrepairStype + "," + vm.repair_item[i].itemName
            }
          }
        }
        vm.workOrder.serviceCarmaintainStype="";
        for (var j=0;j<vm.maintain_item.length;j++) {
          if (vm.maintain_item[j].isChecked) {
            if (vm.workOrder.serviceCarmaintainStype == '') {
              vm.workOrder.serviceCarmaintainStype = vm.maintain_item[j].itemName;
            } else {
              vm.workOrder.serviceCarmaintainStype = vm.workOrder.serviceCarmaintainStype + "," + vm.maintain_item[j].itemName;
            }
          }
        }
        WorkOrderService.workOrderAdd(vm.workOrder)
          .then(function () {
            $state.go('tservice.build');
          })
          .catch(function (err) {
            vm.requesting=false;
            if(err.resultCode == 529){
              Message.confirm(err.message)
                .then(function () {
                  vm.workOrder.telCheckFlag =1;
                  WorkOrderService.workOrderAdd(vm.workOrder)
                    .then(function () {
                      $state.go('tservice.build');
                    })
                    .catch(function (err) {
                      if(err.resultCode == 532){
                        submit532(err);
                      }
                      else if(err.resultCode == 531){
                       submit531(err);
                      }
                        else{
                        $rootScope.catchError(err);
                      }
                    });
                });
            }
            else if(err.resultCode == 532){
              submit532(err)
            }
            else if(err.resultCode == 531){//531
              submit531(err)
            }
            else{
              $rootScope.catchError(err);
            }
          })
          .then(function () {
            vm.requesting = false;
          });
      }
    };


    /*本地时间*/
    vm.nowTime=new Date();

    /*司机电话查询*/
    vm.phonesTable=false;
    vm.clickDriverTel=function () {
      vm.phonesTable=!vm.phonesTable;
    };
    vm.drivePhonesTd=function (phone,event) {
      vm.workOrder.driverRegTel=phone;
      vm.phonesTable=false;
    };
    vm.changeDriverTel=function () {
      vm.phonesTable=false;
    };
    //点击id为phonesList之外的地方触发
    angular.element("body").bind("click",function(e){
      if(vm.phonesTable==true){
        var target = angular.element(e.target);
        if(target.closest("#driverRegTel").length == 0&&target.closest("#phonesList").length == 0){
          $scope.$apply(function () {
            vm.phonesTable=false;
          });
        }
      }
    });
  }
})();
