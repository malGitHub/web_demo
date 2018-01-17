(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceDptcontrolDptcontroleditController', TserviceDptcontrolDptcontroleditController);
  function TserviceDptcontrolDptcontroleditController($uibModalInstance,dtpService, Message,id ,name ,pid,pName) {
    var vm = this;
    vm.title="编辑";
    vm.query={
      id:id ,
      name:name,
      pid:pid
    };
    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };

    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        dtpService.EditDptInfo(vm.query)
          .then(function () {
            $uibModalInstance.close();
          })
          .catch(function (err) {
            if (err.resultCode === 507) {
              Message.error(err.message);
            } else {
              Message.error('网络或服务器错误，请稍后重试');
            }
          })
          .then(function () {
            vm.requesting = false;
          });
      }
    };
    //by shuai上级部门下拉
//    function getDptList(){
//      dtpService.GetDptList()
//        .then(function (data) {
//          var relist = new Array();
//          for(var i=0;i<data.list.length;i++){
//            var pdept = data.list[i];
//            if(pdept != null) {
//              pdept.name = "• " + pdept.name;
//              relist.push(pdept);
//            }
//            for(var j=0;j<pdept.secondDept.length;j++){
//              var sdept = pdept.secondDept[j];
//              if(sdept != null) {
//                sdept.name = "　• " + sdept.name;
//                relist.push(sdept);
//              }
//
//            }
//          }
//          vm.DPT_LIST=relist;
//        })
//        .catch(function (err) {
//          if (err.code === 507) {
//            Message.error(err.error);
//          } else {
//            Message.error('网络或服务器错误，请稍后重试');
//          }
//        });
//    }
//    getDptList();
      //树形结构
      function getDptList(){
          dtpService.GetDptList()
              .then(function (data) {
                  vm.dataForTheTree=[];
                  vm.expandedNodes=[];
                  for(var i=0;i<data.list.length;i++){
                      var id=data.list[i].id;
                      var name=data.list[i].name;
                      var children=[];
                      if(data.list[i].secondDept){
                          children=third(data.list[i].secondDept);
                      }
                      var object={id:id,name:name,children:children};
                      vm.dataForTheTree.push(object);
                      vm.expandedNodes.push(object);
                  }
              })
              .catch(function (err) {
                  if (err.code === 507) {
                      Message.error(err.error);
                  } else {
                      Message.error('网络或服务器错误，请稍后重试');
                  }
              });

      }
      function third(array){
          var arrayThr=[];
          for(var j=0;j<array.length;j++){
              var id=array[j].id;
              var name=array[j].name;
              var children=[{}];
              var subFlag = array[j].subFlag;
              var objectThr={id:id,name:name};
              if (subFlag!=null && subFlag == 1) {
                  objectThr.children = children;
              }
              arrayThr.push(objectThr)
          }
          return arrayThr;
      }
      getDptList();
      vm.selected={
          id:pid,
          name:pName
      };
      vm.treeShow=false;
      vm.treeOptions = {
          nodeChildren: "children",
          dirSelectable: true,
          injectClasses: {
              ul: "a1",
              li: "a2",
              liSelected: "a7",
              iExpanded: "a3",
              iCollapsed: "a4",
              iLeaf: "a5",
              label: "a6",
              labelSelected: "a8"
          }
      };
      vm.selection='';
      vm.showSelected = function(sel) {
          vm.treeShow=false;
          vm.selectedNode = sel.id;
          vm.query.pid=sel.id;
      };
      vm.showToggle = function(node, expanded) {
          if (expanded) {
              dtpService.QueryExpandDept4List(node.id)
                  .then(function (data) {
                      vm.getobjArray=third(data.list);
                      for(var k=0;k<vm.getobjArray.length;k++){
                          node.children[k]=vm.getobjArray[k];
//                  node.children.push(vm.getobjArray[k])
                      }
                  })
                  .catch(function (err) {
                      if (err.code === 507) {
                          Message.error(err.error);
                      } else {
                          Message.error('网络或服务器错误，请稍后重试');
                      }
                  });
          }
      };
  }

})();
