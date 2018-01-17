(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceDptcontrolDptcontroladdController', TserviceDptcontrolDptcontroladdController);
  function TserviceDptcontrolDptcontroladdController($uibModalInstance,$rootScope,dtpService, Message) {
    var vm = this;
    vm.title="新建";
    vm.query={
      pid:'',
      name:'',
      creatorId:$rootScope.userInfo.userId
    };

    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };
    vm.submit = function (evt, form) {
      evt.preventDefault();

      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        dtpService.AddDptInfo(vm.query.pid,vm.query.name,vm.query.creatorId)
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
                      if (i==0) {
                          vm.selected = data.list[0];
                          vm.query.pid=data.list[0].id;
                      }
                      var id=data.list[i].id;
                      var name=data.list[i].name;
                      // var count = data.list[i].count;
                      var children=[];
                      if(data.list[i].secondDept){
                          children=third(data.list[i].secondDept);
                      }
                      var object={id:id,name:name, children: children};
                      // if (count!=null && count!= 0) {
                      //     object.children = children
                      // }
                      vm.dataForTheTree.push(object);
                      vm.expandedNodes.push(object);
                  }
              })
              .catch(function (err) {
                  if (err.code === 507) {
                      Message.error(err.message);
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
              // var objectThr={id:id,name:name,children:children};
              var subFlag = array[j].subFlag;
              var objectThr={id:id,name:name};
              if (subFlag!=null && subFlag == 1) {
                  objectThr.children = children
              }
              arrayThr.push(objectThr)
          }
          return arrayThr;
      }
      getDptList();
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
