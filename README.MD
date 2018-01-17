##TBOSS运营支撑系统

### 导入项目

	$ git clone https://wdgit.mapbar.com/WebFrontends/qingqi-operate-plateform.git

### 安装依赖

	$ npm install & bower install

### 启动服务

	$ gulp serve

### 项目打包部署

	$ gulp

#### 因平台版本问题临时前端修改的地方

  1. 解析json时平台不支持string以外的类型，在WeService.comm.js 116行强制转换为string
  2. sim卡与基础数据导入时 uuid临时使用了url的截取 与设计文档不符 详见device.service.js //todo
