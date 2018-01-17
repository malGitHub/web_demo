/**
 * Created by mal on 2016/12/22.
 */
(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceActivitiesstepController', TserviceActivitiesstepController);
  function TserviceActivitiesstepController($rootScope,ActivityListService,$uibModal,GetTemplateUrl,GetControllerName, TbossService,Message,$timeout,$stateParams,$state,ActivityService){
    var vm = this;
    vm.title="新建活动";
    vm.requesting=false;
    vm.requesting2=false;
    vm.id =$stateParams.id;
     /*本地时间*/
    vm.nowTime=new Date();

    //关闭新建消息页面
    vm.closeAdd = function (){
      Message.confirm('是否确认取消本活动，取消后上一步的信息将不会保存！', '提示')
      .then(function () {
        ActivityService.delActivity(vm.id)
          .then(function () {
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

    /***********************************选择网点start*****************************************/
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
    vm.pageShow=true;
    vm.AreaList=[];//省份列表
    vm.CityList=[];//城市列表
    vm.StoreList=[];//网点列表
    /*vm.selectedStores=[];*/
    vm.allStationList=[];
    vm.addedStationList=[];
    vm.selectedStores_ex=[];
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
    vm.addBtn=true;//添加至活动按钮的禁用
    vm.getAllList=function () {
       ActivityService.queryTotalStation(vm.query1)
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
    vm.noAddedData=true;
     vm.getAddedList=function () {
         ActivityService.alreadyAddedGrantStation(vm.id,vm.query2)
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
      ActivityService.delActivityGrant(vm.id,vm.addedStationList[index].stationId,vm.addedStationList[index].provinceId,vm.addedStationList[index].cityId,vm.addedStationList[index].stationType)
        .then(function () {
          vm.query2.page_number=1;
           vm.getAddedList();
        })
        .catch(function (err) {
          $rootScope.messageError (err, '发放网点删除失败，请稍后重试');
        });
    };
    //清除网点
    vm.clearStation = function () {
         Message.confirm('是否要清除以下全部网点？', '删除')
          .then(function () {
            ActivityService.delActivityGrant(vm.id,vm.query2.stationId,vm.query2.provinceId,vm.query2.cityId,vm.query2.stationType)
              .then(function () {
                vm.query2.page_number=1;
                 vm.getAddedList();
                 //vm.clearStore=true;//清除网点不可编辑
              })
              .catch(function (err) {
                $rootScope.messageError (err, '发放网点删除失败，请稍后重试');
              });
          }).catch(function () {

        });

    };
     //tab页切换删除下拉框数据
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
      vm.allStationList=[];
      vm.addBtn=true;
      vm.noData=true;
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
    //分页
    vm.flip1= function (page_number) {
      vm.query1.page_number = page_number;
       vm.getAllList();

    };
    vm.flip2= function (page_number) {
      vm.query2.page_number = page_number;
       vm.getAddedList();
    };
    vm.setSeries=true;
       //网点添加
    vm.addshop=function () {
         vm.requesting=true;
         ActivityService.addActivityGrant(vm.id,vm.query1.stationId,vm.query1.provinceId,vm.limit,vm.query1.cityId,vm.query1.stationType)
        .then(function () {
           vm.getAddedList();
          vm.allStationList=[];
          vm.addBtn=true;
          vm.noData=true;
          vm.requesting=false;
         })
        .catch(function (err) {
          vm.requesting=false;
          $rootScope.catchError(err);
        });

      };


    /***********************************选择网点END*****************************************/
    /***********************************选择车START*****************************************/
    //select下拉框默认选择为‘不限’
    vm.selectedSeries = [];
    vm.offStartDate='false';
    vm.offEndDate='false';
    vm.sellStartDate='false';
    vm.sellEndDate='false';
    vm.stdStartTime='false';
    vm.stdEndTime='false';
    //车辆下限日期
    vm.changeOffStartDate = function(){
      if(vm.offStartDate=='false'){
         vm.carOfflineStartDate="";
       }
    };
    vm.changeOffEndDate = function(){
      if(vm.offEndDate=='false'){
        vm.carOfflineEndDate="";
      }
     };
    //车辆销售日期
    vm.changeSellStartDate = function(){
      if(vm.sellStartDate=='false'){
        vm.carSellingStartDate="";
      }
     };
    //车辆销售日期
    vm.changeSellEndDate = function(){
      if(vm.sellEndDate=='false'){
        vm.carSellingEndDate="";
      }
     };
    //STD日期
    vm.CHANGE_STDStartDate = function(){
      if(vm.stdStartTime=='false'){
        vm.stdStartDate="";
      }
    };
    //STD日期
    vm.CHANGE_STDEndDate = function(){
      if(vm.stdEndTime=='false'){
        vm.stdEndDate="";
      }
    };

    vm.seriesDelete = function(index,seriesId,modelId){
      ActivityService.delSeries(vm.id,seriesId,modelId)
        .then(function () {
          vm.selectedSeries.splice(index,1);
          Message.success('删除成功');
        })
        .catch(function (err) {
          $rootScope.messageError (err, '活动车型删除失败，请稍后重试');
        });
    };

    //获取品牌
    TbossService.getBrandList()
      .then(function (data) {
        getCAR_SERVICE(data[0].brandId);
      })
      .catch(function (err) {
        $rootScope.messageError (err, '获取车辆品牌信息失败，请稍后重试');
      });

    //获取车系
    function getCAR_SERVICE(brandId){
      TbossService.getSeriseList(brandId)
        .then(function (data) {
          vm.CAR_SERIES=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '车型信息获取失败，请稍后重试');
        });
    }

    //车系下拉框选择操作
    vm.changeSeries=function(){
      vm.model='';
      vm.CAR_Model=[];
      if(vm.series=='' || vm.series==null){
        return;
      }

      TbossService.getModelList_activity(vm.series)
        .then(function (data) {
          vm.CAR_Model=data;
        })
        .catch(function (err) {
          $rootScope.messageError (err, '车型信息获取失败，请稍后重试');
        });
    };



    //添加车型车系
     vm.addshop2=function () {
      var sName = $("#series").find("option:selected").text();
      var mName = $("#model").find("option:selected").text();
      if(sName == '全选' && mName == '全选'){
        sName = '所有车型';
        mName = '';
      }else if(sName != '全选' && mName == '全选'){
        sName = sName+'所有车型';
        mName = '';
      }
      vm.requesting=true;
      ActivityService.addSeries(vm.id,vm.series,sName,vm.model,mName,vm.carOfflineStartDate,vm.carOfflineEndDate,vm.carSellingStartDate,vm.carSellingEndDate,vm.stdStartDate, vm.stdEndDate)
        .then(function () {
          vm.selectedSeries.push({seriesId:vm.series,seriesName:sName,modelId:vm.model,modelName:mName,carOfflineStartDateName:vm.carOfflineStartDate,carOfflineEndDateName:vm.carOfflineEndDate,carSellingStartDateName:vm.carSellingStartDate,carSellingEndDateName:vm.carSellingEndDate,
            stdStartDateName:vm.stdStartDate,stdEndDateName:vm.stdEndDate});
          vm.requesting=false;
        })
        .catch(function (err) {
          vm.requesting=false;
          $rootScope.catchError(err);
        });
    };

    /***********************************选择车END***********************************************/
    /***********************************页面刷新保存数据***********************************************/
    activityRefresh();
    function activityRefresh() {
      ActivityListService.addActivityRefresh(vm.id)
        .then(function (data) {
          vm.list=data;
           //vm.selectedSeries = data.carList;
          for(var k=0;k<data.carList.length;k++){
            var store = {};
            store.seriesName = data.carList[k].seriesName;
            store.seriesId = data.carList[k].series;
            store.modelName = data.carList[k].modelName;
            store.modelId = data.carList[k].model;
            store.carOfflineEndDateName = data.carList[k].carOfflineEndDate;// == null?'全国':data.sendList[i].province;
            store.carOfflineStartDateName = data.carList[k].carOfflineStartDate;
            store.carSellingEndDateName = data.carList[k].carSellingEndDate;
            store.carSellingStartDateName = data.carList[k].carSellingStartDate;
            store.carOfflineEndDateName = data.carList[k].carOfflineEndDate;
            store.stdStartDateName = data.carList[k].stdStartDate;//车辆销售日期
            store.stdEndDateName = data.carList[k].stdEndDate;//车辆销售日期;;
            vm.selectedSeries.push(store);
          }
           vm.carChassisNumList=data.carChassisNumList;
          if(data.carList.length==0&&vm.carChassisNumList.length!=0){
            vm.setSeries=false;
           }else if(vm.carChassisNumList.length==0){
            vm.setSeries=true;
           }

        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }
     /***********************************（公共方法）自定义发放限额，删除一个网店start*****************************************/
     /*自定义发放限额*/
    vm.sendcout=function (index,unlimited,array) {
      if(unlimited!="false"){  //如果不是自定义，去掉list.address里的发放限额数量
        delete  array[index].size;
      }
    };
    vm.definedsize=function (index,much,array) {
      array[index].size=much;
    };



    /*删除一个网店*/
    vm.delete=function (index,array) {
      array.splice(index,1);
    };
    /*打印添加的列表（以后删除）*/
    vm.test=function (array) {
      console.log(array);
    };
     /***********************************************导入底盘号********************************************************/
    vm.chassisNum='';
    vm.carChassisNumList=[];
    //添加电话号码
    vm.numberAdd=function () {
          ActivityListService.addCarChassisNum(vm.id,vm.chassisNum)
          .then(function () {
            vm.chassisNum=vm.chassisNum.toLocaleUpperCase();
            vm.carChassisNumList.push({chassisNum:vm.chassisNum});
            vm.chassisNum='';
           }).catch(function (err) {
          $rootScope.catchError(err);
           vm.chassisNum='';
        });
      };
     vm.delSet = function () {
      if(vm.selectedSeries.length!=0){
        Message.confirm('确定要删除所选车型 ？', '删除')
          .then(function () {
            vm.carDelete();
          }).catch(function () {
          vm.setSeries=true;
         });
      }
     };
    vm.delSpecified = function () {
      if(vm.carChassisNumList.length!=0){
        Message.confirm('确定要删除所选底盘号 ？', '删除')
          .then(function () {
            ActivityListService.delCarChassisNum(vm.id,vm.chassisNum)
              .then(function () {
                Message.success('删除成功');
                vm.carChassisNumList=[];
              })
              .catch(function (err) {
                $rootScope.catchError(err);
              });
          }).catch(function () {
          vm.setSeries=false;
         });
      }

    };
     //删除
    vm.carDelete = function(){
      ActivityListService.delExchangeSeries(vm.id)
        .then(function () {
          Message.success('删除成功');
          vm.selectedSeries=[];
          vm.series='';//系列
          vm.model='';
          vm.offStartDate='false';
          vm.offEndDate='false';
          vm.sellStartDate='false';
          vm.sellEndDate='false';
          vm.stdStartTime='false';
          vm.stdEndTime='false';
           })
        .catch(function (err) {
          $rootScope.catchError(err);
        });

    };
    vm.numberDelete = function(index,chassisNum){
      ActivityListService.delCarChassisNum(vm.id,chassisNum)
        .then(function () {
          vm.carChassisNumList.splice(index,1);
             })
        .catch(function (err) {
          $rootScope.catchError(err);
        });

    };
    //导入
    vm.openImport = function () {
      var createStateName = 'tservice.activitiesstep.import';
      $uibModal.open({
        templateUrl: GetTemplateUrl(createStateName),
        controller: GetControllerName(createStateName),
        controllerAs: 'vm',
        windowClass: 'tservice-activitiesstep-small-import',
        backdrop:false,
        resolve: {
          id: function () {return vm.id;},
          carChassisNumList: function () {return vm.carChassisNumList;}
        }
      }).result.then(function (result) {
        if(result.carChassisNumErrList.length!=0){
          vm.item(result);
        }else {
            Message.success('导入成功');
           vm.carChassisNumList=result.carChassisNumList;

        }
       });
    };
    //非法底盘号
    vm.item=function(msg){
      $uibModal.open({
        templateUrl:GetTemplateUrl('tservice.activitiesstep.phone'),
        controller: GetControllerName('tservice.activitiesstep.phone'),
        controllerAs: 'vm',
        windowClass: 'tservice-activitiesstep-small-phone',
        backdrop:false,
        resolve: {
          carChassisNumErrList: function () {return msg.carChassisNumErrList;},
          carChassisNumList: function () {return msg.carChassisNumList;}

        }
      }).result.then(function (result) {
        Message.success('导入成功');
         $timeout(function() {
          vm.carChassisNumList=result;
        },2000);
      });

    };

    //保存并下一步
    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        if(vm.addedStationList.length == 0 ){
          Message.warning('请添加发放网点！');
        }else if(vm.carChassisNumList.length == 0&&vm.selectedSeries.length == 0){
          Message.warning('请添加发放车型！');
        }else{
          vm.requesting = true;
          $state.go('tservice.activitiesend',{id:vm.id});
        }

      }
    };
  }

})();
