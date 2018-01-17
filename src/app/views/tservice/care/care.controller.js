
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceCareController', TserviceCareController);

  /** @ngInject */
  function TserviceCareController($rootScope,TbossService, Message) {
    var vm = this;
    vm.updown = "up";
    vm.moreobject = false;
    vm.careData = '';
    vm.UPLOADTIMEStart = '';
    vm.UPLOADTIMEEnd = '';
    vm.filter = {
      userTel: '',
      uploadTimeStart: '',
      uploadTimeEnd: '',
      carSerise: '',
      carModel: '1',
      sortType: '2'
    };
    vm.pageIndexTwo = 1;
    vm.pageSizeTwo = 10;
    vm.flipTwo = function (pageIndexTwo) {
      vm.pageIndexTwo = pageIndexTwo;
      getList2();
    };
    vm.moreobject = false;
    vm.moreobject2 = false;
    vm.formoreobj = function () {
      vm.moreobject = !vm.moreobject;
    };
    vm.formoreobj2 = function () {
      vm.moreobject2 = !vm.moreobject2;
    };
    vm.changeInput = function () {
      getList2();
    };
    vm.toUpDown = function () {
      if (vm.filter.carModel != '') {
        vm.updown = (vm.updown == 'up' ? 'down' : 'up');
        vm.filter.sortType = (vm.filter.sortType == '1' ? '2' : '1');
        getList2();
      } else {
        Message.error('请选择系列车型');
      }
    };
    vm.changeTime = function () {
      getList2();
    };
    function getList2() {
      TbossService.CallCenter(vm.pageIndexTwo, vm.pageSizeTwo, vm.filter)
        .then(function (data) {
          vm.careData = data.list;
          vm.totalTwo = data.total;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    getList2();
    //获取品牌
    TbossService.getBrandList()
      .then(function (data) {
        getCAR_SERVICE(data[0].brandId);
      })
      .catch(function (err) {
        $rootScope.messageError (err, '获取车辆品牌信息失败，请稍后重试');
      });

    function getCAR_SERVICE(bid) {
      TbossService.getSeriseList(bid)
        .then(function (data) {
          vm.CAR_SERIES = data;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
  }


    vm.changeSelectType=function(obj){
      vm.filter.carModel='';
      vm.CAR_Model='';
      if(obj){
        getCAR_MODEL(obj);
      }
    };
    function getCAR_MODEL(va){
      TbossService.getCallModelList(va)
        .then(function (data) {
          vm.CAR_Model=data;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
    vm.changeSelectModel=function(params){
      if(params){
        getList2();
      }else{
        care.filter.carModel="1";
        getList2();
      }
    };
  }
})();

