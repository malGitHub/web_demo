(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceBreakdownAddruleController', TserviceBreakdownAddruleController);
    function TserviceBreakdownAddruleController($rootScope,$uibModalInstance,TbossService) {
        var vm = this;
        vm.title="新增";
        vm.query={
            levelCode:'',
            noticeType:'',
            levelType	:'',
            sendTimes:'',
            userId:$rootScope.userInfo.userId

        };
        vm.requesting = false;
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        function getnoticeTypeName(){
            TbossService.getNoticeTypeName()
                .then(function (data) {
                    vm.noticeTypeName=data.list;
                })
                .catch(function (err) {
                    $rootScope.catchError(err);
                })
        }
        getnoticeTypeName();
        function getbreakdownClassAll(){
            TbossService.getBreakdownClassAll()
                .then(function (data) {
                    vm.breakdownClassAll=data.list;
                })
                .catch(function (err) {
                    $rootScope.catchError(err);
                })
        }
        getbreakdownClassAll();
        vm.submit = function (evt, form) {
            evt.preventDefault();
            if(vm.NoticeType!=""&&vm.NoticeType!=undefined&&vm.NoticeType!=null){
                vm.query.noticeType=vm.NoticeType.join(",");//数组元素用逗号','分开
            }
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                TbossService.AddNoticeRule(vm.query)
                    .then(function () {
                        $uibModalInstance.close();
                    })
                    .catch(function (err) {
                      vm.requesting = false;
                      $rootScope.catchError(err);
                    })
            }
        };
        vm.seftInput=false;
        vm.selectSendTimeShow=true;
        vm.SENDTIMES=[
            {key:'3',name:'3'},
            {key:'5',name:'5'},
            {key:'10',name:'10'},
            {key:'n',name:'自定义'}
        ];
        vm.selectSendTime=function(times){
            if(times=="n"){
                vm.seftTimes='';
                vm.seftInput=true;
                vm.selectSendTimeShow=false;
                vm.query.sendTimes="";
            }else{
                vm.seftInput=false;
            }
        };
        vm.seftInputChange=function(value){
            vm.query.sendTimes=value;
        };
    }

})();
