/**
 * Created by Administrator on 2016/11/3.
 */

(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceBannerController', TserviceBannerController);

  function TserviceBannerController($uibModal, GetTemplateUrl, GetControllerName, Message,$rootScope,BannerService) {
    var vm = this;
    vm.moreSearch=false;
    vm.pageIndex1 = 1;
    vm.pageSize1 = 10;
    vm.pageIndex2 = 1;
    vm.pageSize2 =10;
    vm.page1=function(index){
      vm. pageIndex1 =index;
      getList('1')
    };
    vm.page2=function (index) {
      vm. pageIndex2 =index;
      getList('2')
    };
    vm.type = '';
    vm.id = '';

    vm.selectVal = "123";
    /*状态*/
    vm.bannerStatus=[{key:'1',value:'上线'},{key:'0',value:'下线'}];
    /*类型*/
    vm.bannerType=[{key:'1',value:'链接'}];

    /*
    * 上下线
    * */
    vm.onlineNot = function (obj,from) {
      if(from=='1'&&vm.listFour1=='1'&&obj.bannerStatus=='0'){
        Message.warning("上线状态广告最高限制为4个");
        return false;
      }else if(from=='2'&&vm.listFour2=='1'&&obj.bannerStatus=='0'){
        Message.warning("上线状态广告最高限制为4个");
        return false;
      }else{
        if(obj.bannerStatus=='0'){
          var status='1';
          var word='上线';
        }else{
          var status='0';
          var word='下线'
        }
        Message.confirm('确定'+word+' '+ obj.bannerName +' 吗？', word)
          .then(function () {
            BannerService.UpdateBannerOnline(obj.id,status)
              .then(function () {
                Message.success(word+'成功');
                getList(from);
              })
              .catch(function (err) {
                $rootScope.catchError(err);
              });
          });
      }


    };

    /**
     * 司机版编辑
     */

    vm.edit2 = function (obj,from) {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.banner.add'),
        controller: GetControllerName('tservice.banner.edit'),
        controllerAs: 'vm',
        windowClass: '',
        backdrop: false,
        resolve:{
          params:function(){return obj},
          from:function(){return from}
        }
      }).result.then(function (result) {
           Message.success('编辑成功');
          getList(result);
        });
    };


    /**
     * 司继版新建
     */
    vm.new2= function (from) {
      if(from=='1'&&vm.listFour1=='1'){
        Message.warning("上线状态广告最高限制为4个");
        return false;
      }else if(from=='2'&&vm.listFour2=='1'){
        Message.warning("上线状态广告最高限制为4个");
        return false;
      }else{
        $uibModal.open({
          templateUrl: GetTemplateUrl('tservice.banner.add'),
          controller: GetControllerName('tservice.banner.add'),
          controllerAs: 'vm',
          windowClass: '',
          backdrop: false,
          resolve:{
            from:function(){return from}
          }
        }).result.then(function (result) {
          Message.success('添加成功');
          getList(result);
        });
      }

    };



    /**
     * 司机版查询
     */
    vm.query1={
      type:'',
      bannerType:'',
      bannerStatus:'',
      name:''
    };
    vm.query2={
      type:'',
      bannerType:'',
      bannerStatus:'',
      name:''
    };
    function getList(num) {
      if(num==1){
        vm.query1.type=num;
        BannerService.QueryBannerInfo(vm.pageIndex1, vm.pageSize1, vm.query1)
          .then(function (data) {
              vm.mydata1 = data.list;
              if(data.list.length>3){
                vm.listFour1=data.list[3].bannerStatus;
              }else{
                vm.listFour1='0'
              }
              vm.preTolal1=(vm.pageIndex1-1)*vm.pageSize1;
              vm.total1 = data.total;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }else if(num=='2'){
        vm.query2.type=num;
        BannerService.QueryBannerInfo(vm.pageIndex2, vm.pageSize2, vm.query2)
          .then(function (data) {
              vm.mydata2 = data.list;
              if(data.list.length>3){
                vm.listFour2=data.list[3].bannerStatus;
              }else{
                vm.listFour2='0'
              }
              vm.preTolal2=(vm.pageIndex2-1)*vm.pageSize2;
              vm.total2 = data.total;
          })
          .catch(function (err) {
            $rootScope.catchError(err);
          });
      }else{
        Message.error("获取列表数据失败")
      }

    }
    getList('1');
    getList('2');

      /*
      * 状态筛选
      * */
      vm.selectChange=function (from) {
        vm.pageIndex=1;
        getList(from)
      };

    /**
     *
     * 删除数据
     * @param id
     */
    vm.delSafest = function (id,name,from) {
      Message.confirm('确定删除 '+name+' banner吗？', '删除')
        .then(function () {
          BannerService.DelBannerInfo(id)
            .then(function () {
              Message.success('删除成功');
              getList(from);
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        });
    };


    /**
     * 司机版排序 向上
     */
    vm.upInsurance = function (Id,from) {

      if(from=='1'){
        var mydata=vm.mydata1;
      }else if(from=='2'){
        var mydata=vm.mydata2;
      }else{
        Message.error("上移失败")
      }

      for(var i = 0; i< mydata.length;i++){

        if(mydata[i].id ===Id){
          var s = i;
          break;
        }
      }
      if(!s-1<0){
        var id_change= mydata[s-1].id;
      }else{
        return;
      }

      var SortInsurance = {
        moveId:Id,
        moveToId:id_change
      };
      getSortInsurance(SortInsurance,from);

    };

    vm.downInsurance = function (Id,from) {
      if(from=='1'){
        var mydata=vm.mydata1;
      }else if(from=='2'){
        var mydata=vm.mydata2;
      }else{
        Message.error("下移失败")
      }
      for(var i = 0; i< mydata.length;i++){

        if(mydata[i].id ===Id){
          var s = i;
          break;
        }
      }
      var id_change= mydata[s+1].id;

      var SortInsurance = {
        moveId:Id,
        moveToId:id_change
      };
      getSortInsurance(SortInsurance,from);
    };


    /**
     * 排序接口
     */
    function getSortInsurance(Sort,from) {
      BannerService.MoveBannerInfo(Sort)
        .then(function () {
          getList(from);
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

  }
})();
