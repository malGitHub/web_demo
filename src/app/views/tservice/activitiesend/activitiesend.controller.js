 /**
 * Created by mal on 2016/12/22.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceActivitiesendController', TserviceActivitiesendController);
  function TserviceActivitiesendController($rootScope, Message,$state,$timeout,$stateParams,ActivityService,ActivityListService){
    var vm = this;
    vm.title="新建活动";
    vm.id =$stateParams.id;
    vm.currentQuota = 0;
    vm.requesting=false;
    vm.requesting2=false;
    vm.addedStationList=[];
     vm.query1={
      keyWord:"",
      page_size:10,
      page_number:1,
      provinceId:"",
      cityId:"",
      stationId:"",
      stationType:"",
      flag:""
    };
    vm.query2={
      keyWord:"",
      page_size:10,
      page_number:1,
      provinceId:"",
      cityId:"",
      stationId:"",
      stationType:"",
      flag:""
    };

    //关闭新建消息页面
    vm.closeAdd = function (){
      Message.confirm('是否确认取消本活动，取消后上一步的信息将不会保存！', '提示')
        .then(function () {
          ActivityService.delActivity(vm.id)
            .then(function (data) {
              Message.success('活动取消成功！');
              $timeout(function () {
                $state.go('tservice.activities');
              },1000);
            })
            .catch(function (err) {
              $rootScope.messageError (err, '活动取消失败，请稍后重试');
            });
        });
    };
    ActivityListService.addActivityRefresh(vm.id)
      .then(function (data) {
        vm.list=data;
        /*for(var i=0;i<data.exchangeList.length;i++){
          var store = {};
          store.pName = data.exchangeList[i].province == null?'全国':data.exchangeList[i].province;
          store.provinceId = data.exchangeList[i].provinceId;
          store.cName = data.exchangeList[i].city;
          store.cityId = data.exchangeList[i].cityId;
          store.sName = data.exchangeList[i].name;
          store.stationId = data.exchangeList[i].stationId;
          store.typeName = data.exchangeList[i].type;
          store.storeType = data.exchangeList[i].stationType;
          store.limit = data.exchangeList[i].quota == 0?'不限':data.exchangeList[i].quota+'';
          listAssembler(store,vm.selectedStores);
        }*/
       })
      .catch(function (err) {
        $rootScope.catchError(err);
      });

    /*function listAssembler(obj,list){
      if(obj.provinceId == obj.cityId) {
        //直辖市过滤
        obj.cName = "";
      }
      if(obj.stationId == null) {
        if (obj.provinceId == null && (obj.storeType == null || obj.storeType == '')) {
          obj.pName = "全国所有网点";
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId == null && obj.storeType == '1') {
          obj.pName = "全国所有经销商";
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId == null && obj.storeType == '2') {
          obj.pName = "全国所有服务站";
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId == null && (obj.storeType == null || obj.storeType == '')) {
          obj.pName = obj.pName + '所有网点';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId == null && obj.storeType == '1') {
          obj.pName = obj.pName + '所有经销商';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId == null && obj.storeType == '2') {
          obj.pName = obj.pName + '所有服务站';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId != null && (obj.storeType == null || obj.storeType == '')) {
          obj.pName = obj.pName + obj.cName + '所有网点';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId != null && obj.storeType == '1') {
          obj.pName = obj.pName + obj.cName + '所有经销商';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
        else if (obj.provinceId != null && obj.cityId != null && obj.storeType == '2') {
          obj.pName = obj.pName + obj.cName + '所有服务站';
          obj.cName = "";
          obj.sName = "";
          obj.typeName = "";
        }
      }
      list.push(obj);
    }*/
    /***********************************选择网点start*****************************************/
     vm.AreaList=[];//省份列表
    vm.CityList=[];//城市列表
    vm.StoreList=[];//网点列表
    vm.allStationList=[];
    vm.selectedStores=[];
    vm.limit=0;
    vm.limitif='false';
    vm.changeLimit = function(){
      if(vm.limitif=='true'){
        vm.limit=1;
      }else{
        vm.limit=0;
      }
    };
    /***********************************省份城市下拉列表*****************************************/
    //获取第一个下拉框（省份）
    getProvinceOne();
    function getProvinceOne(){
      ActivityService.getAreaList()
        .then(function (data) {
          vm.AreaList=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
        });
    }
    //省份选择操作
    vm.changeProvinceOne=function(){
      if(vm.query1.provinceId != '' && vm.query1.provinceId != null) {
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.query1.provinceId)
          .then(function (data) {
            vm.CityList = data;
            vm.query1.stationType = '';
            vm.StoreList = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }else{
        vm.query1.stationType = '';
        vm.StoreList = [];
        vm.CityList = [];
      }
    };


    //城市下拉框选择操作
    vm.changeCityOne=function(){
      vm.query1.stationType='';
      vm.StoreList=[];
      if(vm.query1.provinceId != '' && vm.query1.provinceId != null) {
        getStoreList();
      }
    };

    vm.changeStoreTypeOne=function(){
      vm.StoreList=[];
      if(vm.query1.provinceId != '' && vm.query1.provinceId != null) {
        getStoreListOne();
      }
    };

    function getStoreListOne(){
      if(vm.query1.cityId!= '' && vm.query1.cityId != null) {
        //获取网点下拉框
        ActivityService.getStoreList(vm.query1.provinceId, vm.query1.cityId, vm.query1.stationType)
          .then(function (data) {
            vm.StoreList = data;
          })
          .catch(function (err) {
            $rootScope.messageError(err, '获取网点信息失败，请稍后重试');
          });
      }
    }

    vm.changeStoreOne = function(){
      if(vm.query1.stationId != null  && vm.query1.stationId != ''){
        for(var i=0;i<vm.StoreList.length;i++){
          if(vm.query1.stationId == vm.StoreList[i].stationId){
            vm.query1.stationType = vm.StoreList[i].storeType;
            break;
          }
        }
      }
    };

    /***************************************已添加网点的省市操作*********************************/
    //获取第一个下拉框（省份）
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
      if(vm.query2.provinceId != '' && vm.query2.provinceId != null) {
        //获取第二个下拉框（城市）
        ActivityService.getAreaList(vm.query2.provinceId)
          .then(function (data) {
            vm.CityList = data;
            vm.query2.stationType = '';
            vm.StoreList = [];
          })
          .catch(function (err) {
            $rootScope.messageError (err, '获取活动区域失败，请稍后重试');
          });
      }else{
        vm.query2.stationType = '';
        vm.StoreList = [];
        vm.CityList = [];
      }
    };


    //城市下拉框选择操作
    vm.changeCity=function(){
      vm.query2.stationType='';
      vm.StoreList=[];
      if(vm.query2.provinceId != '' && vm.query2.provinceId != null) {
        getStoreList();
      }
    };

    vm.changeStoreType=function(){
      vm.StoreList=[];
      if(vm.query2.provinceId != '' && vm.query2.provinceId != null) {
        getStoreList();
      }
    };

    function getStoreList(){
      if(vm.query2.cityId!= '' && vm.query2.cityId != null) {
        //获取网点下拉框
        ActivityService.getStoreList(vm.query2.provinceId, vm.query2.cityId, vm.query2.stationType)
          .then(function (data) {
            vm.StoreList = data;
          })
          .catch(function (err) {
            $rootScope.messageError(err, '获取网点信息失败，请稍后重试');
          });
      }
    }

    vm.changeStore = function(){
      if(vm.query2.stationId != null  && vm.query2.stationId != ''){
        for(var i=0;i<vm.StoreList.length;i++){
          if(vm.query2.stationId == vm.StoreList[i].stationId){
            vm.query2.stationType = vm.StoreList[i].storeType;
            break;
          }
        }
      }
    };

    //全部网点查询列表
    vm.noData=true;//无数据的显示
    vm.addBtn=true;//添加至活动按钮的禁止
    vm.getAllList=function () {
      ActivityService.queryTotalExchangeStation(vm.query1)
        .then(function (data) {
          if(data.list.length==0){
            vm.noData=true;
            vm.addBtn=true;
          }else {
            vm.noData=false;
            vm.addBtn=false;
          }
          vm.allStationList=data.list;
          vm.total1=data.total;
        }).catch(function (err) {
        $rootScope.catchError(err);
      });
    };
    //已添加网点查询列表
    //vm.clearStore=true;//清除网点不可编辑
     vm.getAddedList=function () {
      ActivityService.alreadyAddedExchangeStation(vm.id,vm.query2)
        .then(function (data) {
           vm.addedStationList=data.list;
          vm.total2=data.total;
        }).catch(function (err) {
        $rootScope.catchError(err);
      });
    };
    vm.getAddedList();
    //逐条删除已添加网点
    vm.storeDelete = function(index){
       ActivityService.delActivityExchange(vm.id,vm.addedStationList[index].stationId,vm.addedStationList[index].provinceId,vm.addedStationList[index].cityId,vm.addedStationList[index].stationType)
        .then(function () {
          vm.query2.page_number=1;
          vm.getAddedList();
        })
        .catch(function (err) {
          $rootScope.messageError (err, '兑换网点删除失败，请稍后重试');
        });
    };
    //清除网点
    vm.clearStation = function () {
      Message.confirm('是否要清除以下全部网点？', '删除')
        .then(function () {
           ActivityService.delActivityExchange(vm.id,vm.query2.stationId,vm.query2.provinceId,vm.query2.cityId,vm.query2.stationType)
            .then(function () {
              vm.query2.page_number=1;
              vm.getAddedList();
              vm.clearStore=true;//清除网点不可编辑
             })
            .catch(function (err) {
              $rootScope.messageError (err, '兑换网点删除失败，请稍后重试');
            });
        }).catch(function () {

      });

    };
    vm.clearTab1=function () {
      vm.query1={
        keyWord:"",
        page_size:10,
        page_number:1,
        provinceId:"",
        cityId:"",
        stationId:"",
        stationType:"",
        flag:""
      };
     };
    vm.clearTab2=function () {
      vm.query2={
        keyWord:"",
        page_size:10,
        page_number:1,
        provinceId:"",
        cityId:"",
        stationId:"",
        stationType:"",
        flag:""
      };
    };
    vm.flip1= function (page_number) {
      vm.query1.page_number = page_number;
      vm.getAllList();

    };
    vm.flip2= function (page_number) {
      vm.query2.page_number = page_number;
      vm.getAddedList();
    };

    //添加网点
      vm.addshop=function () {
        vm.requesting2=true;
        ActivityService.addActivityExchange(vm.id,vm.query1.stationId,vm.query1.provinceId,vm.limit,vm.query1.cityId,vm.query1.stationType)
        .then(function (data) {
           vm.getAddedList();
          vm.allStationList=[];
          vm.addBtn=true;
          vm.noData=true;
          vm.requesting2=false;
        })
        .catch(function (err) {
          vm.requesting2=false;
          $rootScope.catchError(err);
         });
    };

    /***********************************（公共方法）自定义发放限额，删除一个网店end*****************************************/
    //提交
    vm.submit = function (evt, form) {
      evt.preventDefault();
      Message.confirm('请确定是否提交审核，审核之后将不能对活动进行编辑')
        .then(function () {
           if (form.$valid && !vm.requesting) {
            if(vm.addedStationList.length == 0 ){
              Message.warning('请添加兑换网点！');
            }else{
              vm.requesting = true;
              ActivityService.addActivity({activityId:vm.id,reviewStatus:'2'})
                .then(function (data) {
                   $state.go('tservice.activities');
                })
                .catch(function (err) {
                  vm.requesting = false;
                  $rootScope.messageError (err, '提交失败，请稍后重试');
                });
            }
          }
        });
    };
    //保存
    vm.save = function () {
      if(vm.addedStationList.length == 0 ){
        Message.warning('请添加兑换网点！');
      }else{
        vm.requesting = true;
        $state.go('tservice.activities');
      }
    };
  }
})();

