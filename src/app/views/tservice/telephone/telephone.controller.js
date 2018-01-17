/**
 * Created by Administrator on 2016/11/3.
 */

(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceTelephoneController', TserviceTelephoneController);

  function TserviceTelephoneController($uibModal, GetTemplateUrl, GetControllerName, Message,TelephoneService,$rootScope) {
    var vm = this;
    vm.moreobject = false;
    vm.totol ='';
    vm.totolI ='';
    vm.totolR ='';
    vm.pageIndex = 1;
    vm.pageSize = 10;
    vm.type = '';
    vm.id = '';
    vm.pageIndexone = 1;
    vm.pageIndextwo = 1;
    vm.pageSizeone =10;
    vm.pageSizetwo =10;
    // vm.name = '';

    vm.selectVal = "123";
    vm.selectList = [{
      key: "A", name: "a"
    }, {key: "B", name: "b"}];

    vm.moreobject = false;
    vm.formoreobj = function () {
      vm.moreobject = !vm.moreobject;
    };
    /**
     * 保险公司编辑窗口
     */

    vm.edit = function (id,tel,name,image) {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.telephone.telephoneedit'),
        controller: GetControllerName('tservice.telephone.telephoneedit'),
        controllerAs: 'vm',
        windowClass: 'tservice-telephone-small-telephoneedit',
        backdrop: false,
        resolve: {
          id: function () {return id;},
          tel: function () {return tel;},
          name: function () {return name;},
          image: function () {return image;}
        }
      }).result.then(function () {
           Message.success('编辑成功');
        getList();
        });
    };


    /**
     * 保险公司新建窗口
     */
    vm.new3 = function () {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.telephone.telephoneeditnew'),
        controller: GetControllerName('tservice.telephone.telephoneeditnew'),
        controllerAs: 'vm',
        windowClass: 'tservice-telephone-small-telephoneeditnew',
        backdrop: false
      }).result.then(function () {
           Message.success('添加成功');
         getList();
        });
    };


    /**
     *
     * 常用电话编辑窗口
     */
    vm.edit1 = function (id,tel,carType,name) {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.telephone.commonly'),
        controller: GetControllerName('tservice.telephone.commonly'),
        controllerAs: 'vm',
        windowClass: 'tservice-telephone-small-commonly',
        backdrop: false,
        resolve: {
          id: function () {return id;},
          tel: function () {return tel;},
          name: function () {return name;},
          carType: function () {return carType;}

        }

      }).result.then(function () {
          getListUsed();
           Message.success('编辑成功');
        });
    };
    /**
     * 常用电话新建窗口
     */
    vm.new1 = function () {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.telephone.commonlynew'),
        controller: GetControllerName('tservice.telephone.commonlynew'),
        controllerAs: 'vm',
        windowClass: 'tservice-telephone-small-commonlynew',
        backdrop: false
      }).result.then(function () {
          getListUsed();
           Message.success('添加成功');
        });
    };
    /**
     * 救援电话编辑窗口
     */
    vm.edit2 = function (id,tel,name) {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.telephone.rescue'),
        controller: GetControllerName('tservice.telephone.rescue'),
        controllerAs: 'vm',
        windowClass: 'tservice-telephone-small-rescue',
        backdrop: false,
        resolve: {
          id: function () {return id;},
          tel: function () {return tel;},
          name: function () {return name;}
        }
      }).result.then(function () {
          getListRescue();
           Message.success('编辑成功');
        });
    };


    /**
     * 救援电话新建窗口
     */
    vm.new2 = function () {
      $uibModal.open({
        templateUrl: GetTemplateUrl('tservice.telephone.rescuenew'),
        controller: GetControllerName('tservice.telephone.rescuenew'),
        controllerAs: 'vm',
        windowClass: 'tservice-telephone-small-rescuenew',
        backdrop: false
      }).result.then(function () {
          getListRescue();
           Message.success('添加成功');
        });
    };


    vm.changeTab = function (type) {
      vm.query.type = type;

    };
    /**
     * 紧急电话保险公司查询
     * @type {{name: zhaosp, type: string}}
     */
    vm.name1 = '';
    vm.query = {
      name: '',
      type: '3'

    };

    /**
     * 紧急电话保险公司查询
     */
    function getList() {

      TelephoneService.TelephoneList(vm.pageIndextwo, vm.pageSizetwo, vm.query)
        .then(function (data) {
          // console.log(data);
          vm.mydata2 = data.list;    //这个地方需要接口改下排序
          vm.totalI = data.total;

        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    vm.changeI = function () {

      getList();

    };
    getList();
    /**
     * 紧急电话救援查询
     * @type {{name: zhaosp, type: string}}
     */
    vm.query1 = {
      name: '',
      type: '2'
    };

    function getListRescue() {
      TelephoneService.TelephoneList(vm.pageIndexone, vm.pageSizeone, vm.query1)
        .then(function (data) {

          vm.mydata1 = data.list;    //这个地方需要接口改下排序
          vm.totalR = data.total;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    getListRescue();
    vm.changeR = function () {

      getListRescue();

    };

    /**
     * 紧急电话常用查询
     * @type {{name: zhaosp, type: string}}
     */


    vm.query2 = {
      name: '',
      type: '1'
    };

    vm.array = {
      type: 'A',
      code: 'A010'
    };


    function getListUsed() {
      TelephoneService.TelephoneList(vm.pageIndex, vm.pageSize, vm.query2)
        .then(function (data) {
          TelephoneService.getBrandList(vm.array)
            .then(function (data) {
              vm.CAR_TYPE = data.list;
              for (var i = 0; i < data.list.length; i++) {
                for (var j = 0; j < vm.CAR_TYPE.length; j++) {
                  if (data.list[i].carType == vm.CAR_TYPE[j].value) {
                    data.list[i].CARtype = vm.CAR_TYPE[j].name;
                  }
                }
              }
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });

          vm.mydata = data.list;//这个地方需要接口改下排序
          vm.total = data.total;
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }


    vm.changeU = function () {

      getListUsed();

    };
    getListUsed();

    /**
     * 紧急电话常用删除数据
     * @param id
     */

    vm.delItem = function (id) {
      Message.confirm('请 确定删除 该条联系人吗？', '删除')
        .then(function () {
          TelephoneService.DelTelephoneItem(id)
            .then(function () {
              Message.success('删除成功');
              getListUsed();
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        });
    };

    /**
     *
     * 紧急电话救援删除数据
     * @param id
     */
    vm.delRescue = function (id) {
      Message.confirm('请 确定删除 该条联系人吗？', '删除')
        .then(function () {
          TelephoneService.DelTelephoneItem(id)
            .then(function () {
              //     alert(id)

              Message.success('删除成功');
              getListRescue();
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        });
    };

    /**
     *
     * 紧急电话保险公司删除数据
     * @param id
     */
    vm.delSafest = function (id,name) {
      Message.confirm('确定删除 '+name+' 联系人吗？', '删除')
        .then(function () {
          TelephoneService.DelTelephoneItem(id)
            .then(function () {
              Message.success('删除成功');
              getList();
            })
            .catch(function (err) {
              $rootScope.catchError(err);
            });
        });
    };
    /**
     * 常用查询数据排序 向上
     */
    vm.up = function (Id,Sort,Type) {

          for(var i = 0; i< vm.mydata.length;i++){

                      if(vm.mydata[i].id ===Id){
                     var s = i;
                        break;
                      }
            }
               if(!s-1<0){
                var id_change= vm.mydata[s-1].id;
                 var sort_change = (vm.mydata[s-1].sort);

               }else{

                 return;
               }

      vm.Sort = {
        id:Id,
        sort:Sort,
        type:Type,
        id_change:id_change,
        sort_change:sort_change
      };


      getSort();

    };

    vm.down = function (Id,Sort,Type) {

      for(var i = 0; i< vm.mydata.length;i++){

        if(vm.mydata[i].id ===Id){
          var s = i;
          break;
        }
      }
        var id_change= vm.mydata[s+1].id;
        var sort_change = (vm.mydata[s+1].sort);

      vm.Sort = {
        id:Id,
        sort:Sort,
        type:Type,
        id_change:id_change,
        sort_change:sort_change
      };


      getSort();

    };




    /**
     * 保险公司电话查询数据排序 向上
     */
    vm.upInsurance = function (Id,Sort,Type) {

      for(var i = 0; i< vm.mydata2.length;i++){

        if(vm.mydata2[i].id ===Id){
          var s = i;
          break;
        }
      }
      if(!s-1<0){
        var id_change= vm.mydata2[s-1].id;
        var sort_change = (vm.mydata2[s-1].sort);

      }else{

        return;
      }

      vm.SortInsurance = {
        id:Id,
        sort:Sort,
        type:Type,
        id_change:id_change,
        sort_change:sort_change
      };


      getSortInsurance();

    };

    vm.downInsurance = function (Id,Sort,Type) {

      for(var i = 0; i< vm.mydata2.length;i++){

        if(vm.mydata2[i].id ===Id){
          var s = i;
          break;
        }
      }
      var id_change= vm.mydata2[s+1].id;
      var sort_change = (vm.mydata2[s+1].sort);

      vm.SortInsurance = {
        id:Id,
        sort:Sort,
        type:Type,
        id_change:id_change,
        sort_change:sort_change
      };


      getSortInsurance();

    };


    /**
     * 救援电话查询数据排序 向上
     */
    vm.uprescue = function (Id,Sort,Type) {

      for(var i = 0; i< vm.mydata1.length;i++){

        if(vm.mydata1[i].id ===Id){
          var s = i;
          break;
        }
      }
      if(!s-1<0){
        var id_change= vm.mydata1[s-1].id;
        var sort_change = (vm.mydata1[s-1].sort);

      }else{

        return;
      }

      vm.SortRescue = {
        id:Id,
        sort:Sort,
        type:Type,
        id_change:id_change,
        sort_change:sort_change
      };


      getSortRescue();

    };

    vm.downrescue = function (Id,Sort,Type) {

      for(var i = 0; i< vm.mydata1.length;i++){

        if(vm.mydata1[i].id ===Id){
          var s = i;
          break;
        }
      }
      var id_change= vm.mydata1[s+1].id;
      var sort_change = (vm.mydata1[s+1].sort);

      vm.SortRescue = {
        id:Id,
        sort:Sort,
        type:Type,
        id_change:id_change,
        sort_change:sort_change
      };


      getSortRescue();

    };

















    /**
     * 常用查询排序调service
     */
    function getSort() {
      TelephoneService.getTelephoneSort(vm.Sort)
        .then(function () {
          getListUsed();
          //  console.log(data)
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    /**
     * 保险公司查询电话排序
     */
    function getSortInsurance() {
      TelephoneService.getTelephoneSort(vm.SortInsurance)
        .then(function () {
          getList();
          //  console.log(data)
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }


    /**
     * 救援电话查询电话排序
     */
    function getSortRescue() {
      TelephoneService.getTelephoneSort(vm.SortRescue)
        .then(function () {
          getListRescue();
          //  console.log(data)
        })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    }

    /**
     *
     * 常用
     * @param pageIndex
     */
    vm.pageU = function(pageIndex){

      vm.pageIndex =pageIndex;
      getListUsed();
    }
    /**
     * 救援
     * @param pageIndexone
     */

     vm.pageR = function(pageIndexone){

     vm. pageIndexone =pageIndexone;
     getListRescue();
     }

    /**
     *
     * 保险
     * @param pageIndextwo
     */
     vm.pageI = function(pageIndextwo){

     vm. pageIndextwo =pageIndextwo;
     getList();
     }




  }
})();
