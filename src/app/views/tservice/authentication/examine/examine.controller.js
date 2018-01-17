(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceAuthenticationExamineController', TserviceAuthenticationExamineController);
  function TserviceAuthenticationExamineController($uibModalInstance, mainData, ExamineService, Message,$rootScope) {
    var vm = this;
    vm.title = "审核";
    vm.EX_RESULTS = [];
    vm.requesting = false;
    var carId = mainData.carId;
    var reviewStatus = mainData.reviewStatus;
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };
    
    init();

    //返回
    //初始化页面数据
    function init() {


      ExamineService.initExaminePage(carId).then(function (data) {
        vm.examine = data;
        vm.initExamineResult();
        vm.examine.carId = carId;
        vm.examine.userId = '1';//假数据
        vm.examine.reviewResult = vm.examine.reviewResult === '未通过' ? 1 : vm.examine.reviewResult === '通过' ? 2 : null;
        vm.examine.identityCard = vm.examine.identityCard ===null ? vm.examine.organization: vm.examine.identityCard;

        if (reviewStatus === '未审核') {// 1 未审核
          vm.toEdit = false;
          vm.save = true;
          vm.reviewViewDis = false;
          vm.resultDis = false;

        } else {//2 已审核
          vm.toEdit = true;
          vm.save = false;
          vm.reviewViewDis = true;
          vm.resultDis = true;
        }

      });
    }
    vm.edit = function () {
      vm.toEdit = false;
      vm.save = true;
      vm.reviewViewDis = false;
      vm.resultDis = false;
    };
    vm.initExamineResult = function () {

      ExamineService.getExamineResults()
        .then(function (values) {
          vm.EX_RESULTS = values;
          vm.EX_RESULTS.keys = {};
          vm.EX_RESULTS.forEach(function (status, index, statuses) {
            statuses.keys[status.key] = status.value;
          });

        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    };


    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        ExamineService.addExamine(vm.examine)
          .then(function () {
            $uibModalInstance.close();
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          })
          .then(function () {
            vm.requesting = false;
          });
      }
    };
  }

})();
