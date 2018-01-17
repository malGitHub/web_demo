(function () {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceAppAppownerController', TserviceAppAppownerController);
  function TserviceAppAppownerController($rootScope,$uibModalInstance, AppownerService, userId) {
    var vm = this;
    vm.title = "注册信息";
    vm.closeEdit = function () {
      $uibModalInstance.dismiss();
    };
    init();
    function init() {
      AppownerService.initOwnerPage(userId).then(function (data) {
        vm.appowner = data;
        var image='';
        for(var i=0;i<vm.appowner.carList.length;i++){
          if(vm.appowner.carList[i].invoicePhoto){
            image = image+'<img src='+vm.appowner.carList[i].invoicePhoto+'>';
          }
        }
        if(image==""){
          image='<img src="../../assets/images/car.jpg">';
        }
        vm.MUSIC=image;
      }).catch(function (err) {
        $rootScope.catchError(err);
      });

    }
  }

})();
