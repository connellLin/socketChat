

<h1 align="center">HasChatService</h1>

<h5 align="center">基于vue3+socket.io的聊天应用</h5>

------------------------------------------------------------------------

# 介绍
前端：Vue3 + Vite + TypeScript + Naive UI + Socket.io [前端地址](https://gitee.com/howcode/has-chat)
后端：Express.js 

# 预览图
![预览图](https://img-blog.csdnimg.cn/ef64ea7a09484131b1570e3c3c086fbd.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAaG93Y29kZXI=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
# 功能一览
- 登陆、随机获取用户登陆
- 发送邮箱验证码注册
- 发送表情+文字组合的富文本内容
- 发送图片内容，查看大图
- enter发送信息，enter+ctrl换行输入内容
- 消息提醒
- 未读消息标记
- 记录历史会话
- 记录历史聊天内容
# 版本说明
- 前端：暂无版本区别
- 后端：分为mysql版本（分支main）和json版本（分支master）；json版本主要是为了不懂mysql的新手学习；
# 环境部署
```javascript
Node.Js >= 12.0.0
Mysql >= 5.7.0 (仅mysql版本需要)
```
## 下载项目
前端

```javascript
https://gitee.com/howcode/has-chat.git
```
后端 mysql版本
```javascript
git clone -b main https://gitee.com/howcode/has-chat-service.git
```
后端 json版本
```javascript
git clone -b master https://gitee.com/howcode/has-chat-service.git
```
## 启动项目
### 安装依赖
前、后端
```javascript
npm install
```
### mysql配置（json版本跳过）
- 在mysql的版本中，找到目录store下的sql文件，运行sql文件
![在这里插入图片描述](https://img-blog.csdnimg.cn/4cbe505a6cd344c5933359c36192c223.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAaG93Y29kZXI=,size_14,color_FFFFFF,t_70,g_se,x_16)![在这里插入图片描述](https://img-blog.csdnimg.cn/253ce4de33f84648a6d769041d8227d1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAaG93Y29kZXI=,size_17,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/c794583d2e7f41fc90447c57b0234057.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAaG93Y29kZXI=,size_20,color_FFFFFF,t_70,g_se,x_16)
![在这里插入图片描述](https://img-blog.csdnimg.cn/b02d0124c0624466982203208ddbaa03.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAaG93Y29kZXI=,size_17,color_FFFFFF,t_70,g_se,x_16)
- 依次运行两个sql文件，并且刷新数据库表就可看到了
![在这里插入图片描述](https://img-blog.csdnimg.cn/5d325c9a9b1b424ba8d57a04a3f8edc1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBAaG93Y29kZXI=,size_17,color_FFFFFF,t_70,g_se,x_16)
- 找到config.js文件

```javascript
const db = mysql.createConnection({
  host: "", // 主机地址 （默认：localhost）
  user: "", // 用户名
  password: "", // 密码
  database: "" // 数据库
})
```
更多配置查看：[nodejs-mysql](https://www.runoob.com/nodejs/nodejs-mysql.html)
### 邮箱配置（json版本跳过）
- 找到config.js文件
```javascript
emailConfig: { //邮箱配置
    host: "smtp.qq.com",//邮箱服务器  这里我用的QQ邮箱
    port: 465,//邮箱使用端口
    secure: true,//是否使用默认的465端口
    auth: {
      user: "", // 发送方邮箱地址
      pass: "" // smtp 验证码
    }
  }
```
详情使用可以查看该文章：[nodejs发送邮箱信息](https://www.cnblogs.com/kusaki/p/11801769.html)
### 启动项目/服务
- 后端
 ```javascript
node app.js
 ```
- 前端
```javascript
npm run dev
```
*到此，项目可以正常运行*
# 项目目录

```javascript
hasChatService     
├── src            
│       └── query                    	  // 接口文件
│			└── content.js				  // content数据表操作
│			└── user.js					  // user数据表操作
│       └── store						  // 资源文件
│			└── content.sql				  // content表SQL
│			└── user.sql				  // user表SQL
│       └── app.js                        // 服务入口
```
# 表结构
## User
| 字段               | 类型      | 描述             |
| ------------------ | --------- | ---------------- |
| Id                 | number    | 用户Id           |
| Name               | string    | 用户姓名         |
| NickName           | string    | 用户昵称         |
| OnlineState        | boolean   | 在线状态         |
| Mobile             | string    | 用户手机号       |
| Avatar             | string    | 用户头像         |
## Content
| 字段               | 类型      | 描述              |
| ------------------ | --------- | ----------------  |
| Id                 | number    | 内容Id            |
| SendId             | number    | 发送人Id          |
| ReciverId          | number    | 接受人Id          |
| Content            | string    | 内容              |
| Type               | number    | 类型              |
| State              | number    | 发送状态          |
| NoCode             | string    | 信息编号          |
| CreateDateUtc      | string    | 创建时间          |
| Title              | string    | 拓展功能字段      |
| Description        | string    | 拓展功能字段      |
| Label              | string    | 拓展功能字段      |
| Thumbnail          | string    | 拓展功能字段      |
| ReadFlag           | boolean   | 是否阅读          |