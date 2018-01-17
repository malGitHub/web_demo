(function () {

    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceCashditController', TserviceCashditController);
    /** @ngInject */
    function TserviceCashditController($state,$timeout, $stateParams,Message,$uibModal,$window,$rootScope,ActivityService,GetTemplateUrl ,GetControllerName, CashService) {
        //构造方法
        var vm = this;

        //分页相关
        vm.pageIndex = 1;
        vm.pageSize = 10;
        vm.id=$stateParams.id;

        //检索相关
        vm.inputText = '';//检索条件
        vm.ruleData = null;//检索结果

        //初始化查询获取列表
        getCashditData();

      //
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
         if(vm.provinceId != '' && vm.provinceId != null) {
          //获取第二个下拉框（城市）
          ActivityService.getAreaList(vm.provinceId)
            .then(function (data) {
              vm.CityList = data;
             })
            .catch(function (err) {
              $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
            });
        }else{
           vm.CityList = [];
           vm.cityId='';
        }
        getCashditData();
      };


      //城市下拉框选择操作
      vm.changeCity=function(){
         if(vm.provinceId != '' && vm.provinceId != null) {
          getCashditData();
        }
      };


      vm.flip = function () {
          getCashditData();
        };
      vm.cashNumberList=function () {
        getCashditData();
      };
        //返回按钮
        vm.cancel = function(){
            $state.go("tservice.cash");
        };
      //排序选择开关
      vm.controlOrderLeft=false;
      vm.controlOrderRight=false;
      vm.exchangeQuantitySort="";
      vm.restQuantitySort="";
      vm.orderCheck = function () {
        vm.controlOrderLeft=!vm.controlOrderLeft;
        if(vm.controlOrderLeft){
          vm.exchangeQuantitySort=1;
        }else {
          vm.exchangeQuantitySort=0;
        }
        getCashditData();
      };
      vm.orderCheckRight = function () {
        vm.controlOrderRight=!vm.controlOrderRight;
        if(vm.controlOrderRight){
          vm.restQuantitySort=1;
        }else {
          vm.restQuantitySort=0;
        }
        getCashditData();
      };
        //根据条件查询获取列表
        function getCashditData() {
          CashService.getExchangeStationList(vm.exchangeQuantitySort,vm.restQuantitySort,vm.id,vm.inputText,vm.exchangeQuotaSmall,vm.exchangeQuotaBig,vm.provinceId,vm.cityId, vm.pageIndex, vm.pageSize)
            .then(function (data) {
              vm.cashditData = data.list;
              vm.total = data.total;//设置分页总数
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        }

        /**
         * 条件检索
         */
        vm.changeDate = function () {
          getCashditData()
        };

       vm.unitTool = function(count){
        if(count.match(/^-?[0-9]+$/) == count){
          return true;
        }else{
          return false;
        }
      };

      vm.queryKeyUp = function(e){
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
          getCashditData();
        }
      };

      /*导出*/
      vm.getExecl=function () {
        var email='';
        CashService.getExeclLink(email,vm.exchangeQuantitySort,vm.restQuantitySort,vm.id,vm.inputText,vm.exchangeQuotaSmall,vm.exchangeQuotaBig,vm.provinceId,vm.cityId, vm.pageIndex, vm.pageSize)
          .then(function(data){
             //window.open(data);
            Message.success("正在导出，请稍后");
            $timeout(function() {
              $window.location.href=data;
            },1000*10);
          })
          .catch(function(err){
            if(err.resultCode==530){
              $uibModal.open({
                templateUrl: GetTemplateUrl('tservice.cashdit.email'),
                controller: GetControllerName('tservice.cashdit.email'),
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                  exchangeQuantitySort: function () {return vm.exchangeQuantitySort;},
                  restQuantitySort: function () {return vm.restQuantitySort;},
                  id: function () {return vm.id;},
                  inputText: function () {return vm.inputText;},
                  exchangeQuotaSmall: function () {return vm.exchangeQuotaSmall;},
                  exchangeQuotaBig: function () {return vm.exchangeQuotaBig;},
                  provinceId: function () {return vm.provinceId;},
                  cityId: function () {return vm.cityId;},
                  pageIndex: function () {return vm.pageIndex;},
                  pageSize: function () {return vm.pageSize;}
                }
              })
            }else{
              $rootScope.catchError(err);
            }
          })
      }
    }
})();

