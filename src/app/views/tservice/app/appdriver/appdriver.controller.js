
(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceAppAppdriverController', TserviceAppAppdriverController);
  function TserviceAppAppdriverController($rootScope,$uibModalInstance, AppdriverService, userId) {
    var vm = this;
    vm.title = "注册信息";
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };
    init();
    function init() {
      AppdriverService.initDriverPage(userId).then(function (data) {
        vm.appdriver = data;
      }).catch(function (err) {
        $rootScope.catchError(err);
      });

    }
  }

})();
