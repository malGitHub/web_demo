(function () {
  'use strict';

  angular
    .module('WeServices')
    .provider('UserService', function () {
      var serviceUrl = '';

      function makeUrl(path) {
        //return "http://10.30.50.152:8950/qingqi/operate" + path;
        //return "http://127.0.0.1:8090/qingqi/operate" + path;
        return serviceUrl + path;
      };

      this.setServiceUrl = function (url) {
        if (url) {
          serviceUrl = url;
        }
      };

      this.$get = function ($q, RequestService) {
        return {
          /**
           * 查询功能权限数据字典
           * @param type
           * @return {*}
           */
          qyeryFuncList: function (type) {
            return RequestService.get(
              makeUrl('/func/list'),
              {
                type: type
              }
            );
          },
          /**
           * 添加用户
           *
           * @returns {*}
           * @param name
           * @param description
           * @param funcIds
           */
          addUser: function (name, telephone, password, departId, isLeader, description, roleIds, userId) {
            return RequestService.get(
              makeUrl('/user/add'),
              {
                name:name,
                telephone:telephone,
                originalPwd:password,
                departId:departId,
                isLeader:isLeader,
                description:description,
                roleId:roleIds,
                creatorId:userId
              }
            )
          },
          /**
           * 编辑角色
           *
           * @returns {*}
           * @param name
           * @param description
           * @param funcIds
           * @param id
           */
          editUser: function (id, name, telephone, password, departId, isLeader, description, roleIds,userId) {
            return RequestService.get(
              makeUrl('/user/update'),
              {
                id:id,
                name:name,
                telephone:telephone,
                originalPwd:password,
                departId:departId,
                isLeader:isLeader,
                description:description,
                roleId:roleIds,
                creatorId:userId
              }
            )
          },

          /**
           * 取创建者
           * @param name
           * @param description
           * @param funcIds
           * @returns {*}
           */
          getCreator: function () {
            return RequestService.get(
              makeUrl('/common/queryCreator4List'),
              {
                type: "A"
              }
            )
          },
          /**
           * 删除角色
           *
           * @returns {*}
           */
          deleteUser: function (id) {
            return RequestService.get(
              makeUrl('/user/delete'),
              {
                id: id
              }
            )
          },
          getRole:function  () {
          return RequestService.get(
            makeUrl('/role/list'),
            {
            }
          )
        },

          /**
           * 查询用户列表
           */
          getUserList: function (pageIndex, pageSize, creator, rolelyDateStart,rolelyDateEnd, keyword, sortType) {

            //yyyy.mm.dd转yyyy-mm-dd
            if (rolelyDateStart != null && rolelyDateStart != '' & rolelyDateStart != undefined) {
              rolelyDateStart = rolelyDateStart.replace(".", "-");
              rolelyDateStart = rolelyDateStart.replace(".", "-");
            }

            //yyyy.mm.dd转yyyy-mm-dd
            if (rolelyDateEnd != null && rolelyDateEnd != '' & rolelyDateEnd != undefined) {
              rolelyDateEnd = rolelyDateEnd.replace(".", "-");
              rolelyDateEnd = rolelyDateEnd.replace(".", "-");
            }

            return RequestService.get(
              makeUrl('/user/list'),
              {
                page_number: pageIndex,
                page_size: pageSize,
                creatorId:creator,
                createTimeStart:rolelyDateStart,
                createTimeEnd:rolelyDateEnd,
                keyword: keyword,
                sortType:sortType
              }
            );
          },
            //by wurui 获取下一级下拉
            QueryExpandDept4List: function (id) {
                return RequestService.post(
                    makeUrl('/common/queryExpandDept4List'),
                    {
                        id: id
                    }
                );
            },
            //by wurui 上级部门下拉取得
            GetDptList: function () {
                return RequestService.post(
                    makeUrl('/common/queryDept4List')
                );
            }
        };
      };
    });
})
();
