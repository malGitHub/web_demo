(function() {
  'use strict';
  angular
    .module('WeViews')
    .controller('TserviceUserUsereditController', TserviceUserUsereditController);
  function TserviceUserUsereditController($rootScope,$uibModalInstance,RequestService,Message,UserService,id,name,originalPwd,departId,departName,telephone,description,roleIds,isLeader) {
    var vm = this;
    vm.title = "账号基本信息";
    vm.useredit = {
      name: name,
      telephone: telephone,
      originalPwd: originalPwd,
      confirmPassword: originalPwd,
      departId: departId,
      isLeader: isLeader,
      description: description,
      roleIds: roleIds,
      creatorId: ''

    };
     vm.requesting = false;
    vm.resetFlag=true;
    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };
    vm.userId=$rootScope.userInfo.userId;
    vm.submit = function (evt, form) {
      evt.preventDefault();
      if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        vm.useredit.roleIds=vm.itemsArry.join(",");
          UserService.editUser(
            id,vm.useredit.name,vm.useredit.telephone,vm.useredit.originalPwd,
            vm.useredit.departId,vm.useredit.isLeader,vm.useredit.description,vm.useredit.roleIds,vm.userId
          ).then(function () {
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

    vm.getRoleList = function () {
      UserService.getRole().then(function (data) {
        vm.ROLE=data.list;
      })
        .catch(function (err) {
          $rootScope.catchError(err);
        });
    };
    vm.getRoleList();
    vm.itemsArry = roleIds.split(",");
    vm.resetPassword= function () {
      vm.resetFlag=false;
    };
      //树形结构
      function getDptList(){
          UserService.GetDptList()
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
                $rootScope.catchError(err);
              });

      }
      function third(array){
          var arrayThr=[];
          for(var j=0;j<array.length;j++){
              var id=array[j].id;
              var name=array[j].name;
              var children=[{}];
              var objectThr={id:id,name:name,children:children};
              arrayThr.push(objectThr)
          }
          return arrayThr;
      }
      getDptList();
      vm.selected={
          id:departId,
          name:departName
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
          vm.useredit.departId=sel.id;
       };
      vm.showToggle = function(node, expanded) {
          if (expanded) {
              UserService.QueryExpandDept4List(node.id)
                  .then(function (data) {
                      vm.getobjArray=third(data.list);
                      for(var k=0;k<vm.getobjArray.length;k++){
                          node.children[k]=vm.getobjArray[k];
//                  node.children.push(vm.getobjArray[k])
                      }
                  })
                  .catch(function (err) {
                    $rootScope.catchError(err);
                  });
          }
      };
  }

})();
