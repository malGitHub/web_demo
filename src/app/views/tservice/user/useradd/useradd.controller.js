

(function() {
  'use strict';

  angular
    .module('WeViews')
    .controller('TserviceUserUseraddController', TserviceUserUseraddController);
  function TserviceUserUseraddController($rootScope,$uibModalInstance,RequestService,Message,UserService) {
    var vm = this;
    vm.title = "账号基本信息";
    vm.useradd = {
      name: '',
      telephone: '',
      originalPwd: '',
      confirmPassword: '',
      departId: '1',
      isLeader: '2',
      description: '',
      roleIds: '',
      creatorId: ''

    };
    vm.requesting = false;
    vm.cancel = function () {
      $uibModalInstance.dismiss();
    };
    vm.userId=$rootScope.userInfo.userId;
    vm.submit = function (evt, form) {	
       evt.preventDefault();
      var message = validate();
      if (message != "") {
        Message.error(message);
      } else if (form.$valid && !vm.requesting) {
        vm.requesting = true;
        vm.useradd.roleIds=vm.itemsArry.join(",");
          UserService.addUser(
          vm.useradd.name,vm.useradd.telephone,vm.useradd.originalPwd,
          vm.useradd.departId,vm.useradd.isLeader,vm.useradd.description,vm.useradd.roleIds,vm.userId
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
    function validate() {
      vm.validate="";
      if (vm.useradd.originalPwd != vm.useradd.confirmPassword) {
        vm.validate = "两次密码输入的不一致，请确认！";
      }
      return vm.validate;
    }
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
          vm.useradd.departId=sel.id;
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
