(function() {
    'use strict';

    angular
        .module('WeViews')
        .controller('TserviceBreakdownEditruleController', TserviceBreakdownEditruleController);
    function TserviceBreakdownEditruleController($uibModalInstance,TbossService, Message,routeid,$rootScope) {
        var vm = this;
        vm.title="编辑";
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
        function getForm(){
            TbossService.QueryNoticeRuleInfo(routeid)
                .then(function (data) {
                    vm.query=data;
                    vm.seftTimes=vm.query.sendTimes;
                    if(vm.query.noticeType!=""&&vm.query.noticeType!=undefined&&vm.query.noticeType!=null){
                        var arrayType =vm.query.noticeType.split(',');
                        for(var i=0;i<arrayType.length;i++){
                            arrayType[i] = parseInt(arrayType[i]);
                        }
                        vm.NoticeType=arrayType;
                    }
                })
                .catch(function (err) {
                    $rootScope.catchError(err);
                })
        }
        getForm();
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
            vm.query.noticeType=vm.NoticeType.join(",");//数组元素用逗号','分开
            if (form.$valid && !vm.requesting) {
                vm.requesting = true;
                TbossService.ModifyNoticeRule(routeid,vm.query)
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
        vm.seftInput=true;
        vm.selectSendTimeShow=false;
        vm.seftInputChange=function(value){
            vm.query.sendTimes=value;
        };

    }


})();
