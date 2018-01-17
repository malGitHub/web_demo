(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceCarecallController', TserviceCarecallController);

    /** @ngInject */
    function TserviceCarecallController($rootScope,$stateParams, $uibModal, GetTemplateUrl, GetControllerName,Message,TbossService) {
        var vm = this;
        vm.filter={
            rtcId:$stateParams.id,
            userTel:$stateParams.tel,
            role:'',
            userId:''
        };
        vm.information=function(){
            evt.preventDefault();
        };
        vm.query={
            instantOil:'',
            mileage:'',
            revolution:'',
            uploadTime:'',
            uploadLocation:'',
            faultInfoList:[]
        };
        function getList() {
            TbossService.QueryRealTimeCondition( vm.filter.rtcId,vm.filter.userTel)
                .then(function (data) {
                    vm.query=data;
                    vm.filter.role=data.role;
                    vm.filter.userId=data.userId;
                })
                .catch(function (err) {
                    $rootScope.catchError(err);
                });
        }
        getList();
        // 打开查看车主页
        vm.seeOwner = function (data) {
             if (data) {
                $uibModal.open({
                    templateUrl: GetTemplateUrl('tservice.app.appowner'),
                    controller: GetControllerName('tservice.app.appowner'),
                    controllerAs: 'vm',
                    windowClass: '',
                    backdrop: false,
                    resolve: {
                        userId: function () {
                            return data.userId;
                        }
                    }
                }).result.then(function () {
                        appList();
                    });
            } else {
                Message.warning('未选中查看信息');
            }
        };


        // 打开查看司机页
        vm.seeDriver = function (data) {
            console.log(data);
            if (data) {
                $uibModal.open({
                    templateUrl: GetTemplateUrl('tservice.app.appdriver'),
                    controller: GetControllerName('tservice.app.appdriver'),
                    controllerAs: 'vm',
                    windowClass: 'tservice-app-small-appdriver',
                    backdrop: false,
                    resolve: {
                        userId: function () {
                            return data.userId;
                        }
                    }
                }).result.then(function () {
                        appList();
                    });
            } else {
                Message.warning('未选中查看信息');
            }
        };

      // wurui测试file
/*      vm.FILE='http://img.lanou3g.com/Content/images/page/safe.png,' +
        'https://wdjira.mapbar.com/secure/thumbnail/84711/_thumb_84711.png;' +
        'http://wailian.ik6.com/up/20150413/18/20150413184553_27366.mp3,' +
        'http://m2.music.126.net/-6WuXkM9zn3uQwmgH_yG4Q==/7968160767570793.mp3'
      ;
      vm.ContentImg=vm.FILE.split(';')[0].split(',');
      vm.ContentMusic=vm.FILE.split(';')[1].split(',');
      vm.sce = $sce.trustAsResourceUrl; //解除angular对未知来源地址的禁止
      var image='';
      for(var i=0;i<vm.ContentImg.length;i++){
        image = image+'<img width="50" height="50" src='+vm.ContentImg[i]+'>';
      }
      vm.MUSIC=image;*/

    }
})();

