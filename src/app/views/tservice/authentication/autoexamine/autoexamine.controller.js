(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceAuthenticationAutoexamineController', TserviceAuthenticationAutoexamineController);
  function TserviceAuthenticationAutoexamineController($uibModalInstance, AutoExamineService, id, Message,$rootScope) {
    var vm = this;
    vm.title = "审核";
    vm.EX_RESULTS = [];
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };

    var noting = init();

    //初始化页面数据
    function init() {
      AutoExamineService.initPage(id)
        .then(function (data) {
        vm.autoexamine = data;
        vm.autoexamine.reviewResult = data.result;
        vm.autoexamine.identityCard = vm.autoexamine.identityCard ===null ? vm.autoexamine.organization: vm.autoexamine.identityCard;
        vm.resultInputIf = true;
        vm.reviewViewIf = false;
        vm.reviewResultSelectIf = false;
        vm.save = false;
        vm.edit = true;
        vm.autoexamine.reviewId = id;//审核id

      }) .catch(function (err) {
        $rootScope.catchError(err);
      });
    }

    function getResultList() {

      AutoExamineService.getExamineResults()
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
    }
    vm.edt = function () {
      Message.confirm('更改审核意见，将导致APP用户所加的车辆失效和数据丢失，请确认是否进行该操作？')
        .then(function () {
          vm.resultInputIf = false;
          vm.reviewViewIf = true;
          vm.reviewResultSelectIf = true;
          vm.save = true;
          vm.edit = false;
          getResultList();
        });
    };

    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        var params = {};
        params.reviewId = vm.autoexamine.reviewId;
        params.reviewResult = vm.autoexamine.reviewResult;
        params.advice = vm.autoexamine.advice;
        AutoExamineService.save(params)
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
