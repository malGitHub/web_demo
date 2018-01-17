(function () {

    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceGrantditController', TserviceGrantditController);
    /** @ngInject */
    function TserviceGrantditController($state,$stateParams,$timeout,$uibModal,ActivityService, Message, GrantService,$window,$rootScope,GetTemplateUrl,GetControllerName) {
        //构造方法
        var vm = this;
        vm.id =$stateParams.id;
        vm.cityId='';
        //分页相关
        vm.pageIndex = 1;
        vm.pageSize = 10;

        //检索相关
        vm.inputText = '';//检索条件

        //初始化查询获取列表
        getGrantditData();

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
        getGrantditData();
      };
       //城市下拉框选择操作
      vm.changeCity=function(){
         if(vm.provinceId != '' && vm.provinceId != null) {
          getGrantditData();
        }
      };

        vm.flip = function (pageIndex) {
          getGrantditData();
        };

        //返回按钮
        vm.cancel = function () {
          $state.go('tservice.grant');
        };
      //排序选择开关
       vm.controlOrderLeft=false;
       vm.controlOrderRight=false;
       vm.sendQuantitySort="";
       vm.restQuantitySort="";
      vm.orderCheck = function () {
        vm.controlOrderLeft=!vm.controlOrderLeft;
         if(vm.controlOrderLeft){
          vm.sendQuantitySort=1;
         }else {
          vm.sendQuantitySort=0;
         }
        getGrantditData();
      };
      vm.orderCheckRight = function () {
        vm.controlOrderRight=!vm.controlOrderRight;
        if(vm.controlOrderRight){
          vm.restQuantitySort=1;
         }else {
          vm.restQuantitySort=0;
        }
        getGrantditData();
      };
      vm.grantNumberList=function () {
        getGrantditData()
      };
        //根据条件查询获取列表
        function getGrantditData() {
            GrantService.getGrantStationList(vm.sendQuantitySort,vm.restQuantitySort,vm.id,vm.inputText,vm.sendQuantitySmall,vm.sendQuantityBig,vm.provinceId,vm.cityId,vm.pageIndex, vm.pageSize)
                .then(function (data) {
                    vm.grantditData = data.list;
                    vm.total = data.total;//设置分页总数
                })
                .catch(function (err) {
                    Message.error(err.message);
                });
        }

        /**
         * 条件检索
         */
        vm.changeData = function () {
          getGrantditData()
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
          getGrantditData();
        }
      };

      /*导出*/
      vm.getExecl=function () {
        var email='';
        GrantService.getExeclLink(email,vm.sendQuantitySort,vm.restQuantitySort,vm.id,vm.inputText,vm.sendQuantitySmall,vm.sendQuantityBig,vm.provinceId,vm.cityId,vm.pageIndex, vm.pageSize)
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
                templateUrl: GetTemplateUrl('tservice.grantdit.email'),
                controller: GetControllerName('tservice.grantdit.email'),
                controllerAs: 'vm',
                backdrop: false,
                resolve: {
                  sendQuantitySort: function () {return vm.sendQuantitySort;},
                  restQuantitySort: function () {return vm.restQuantitySort;},
                  id: function () {return vm.id;},
                  inputText: function () {return vm.inputText;},
                  sendQuantitySmall: function () {return vm.sendQuantitySmall;},
                  sendQuantityBig: function () {return vm.sendQuantityBig;},
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

