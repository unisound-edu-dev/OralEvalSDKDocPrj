 云知声口语评测 SDK 文档工程
清晰、统一、方便查找的SDK文档，是提升客户服务质量的关键点之一。

借助git专业的版本管理能力和github的高可用性，特建此文档工程，将一应SDK的文档归总此处。

* [规范](#规范)
 * [版本说明文档](#版本说明文档)
 * [接口文档](#接口文档)
 * [demo](#demo)
* [流程和保障](#流程和保障)
 * [源代码提交流程](#源代码提交流程)
 

## 规范

### 版本说明文档
* 版本号为三段整数，前两段为需求，最后一段为debug
* SDK需要提供接口获取当前版本号
* 每个版本对应有New Feature和Bugfix
* 每个版本有beta/release稳定状态标示
* 每一个代码提交必须对应一个版本号上升
* 每一个提交必须包含一个修改说明

### 接口文档
* 每个平台和编程语言的SDK API文档独立
* 不针对SDK版本单独维护文档，而是在每个接口中添加版本支持说明
* 修改API接口，应视为功能变化，对应的需上升版本号第一或第二段

### demo
* 每个平台和编程语言应提供demo源代码
* 商务原因，此文档工程中，不提供整个可编译运行demo的工程下载
* demo源码中应穿插有SDK的使用说明注释
* demo对应有SDK的版本号

## 流程和保障
### 源代码提交流程
1. push修改到SDK代码仓库
2. 触发pre-receive类型的Server-Side Hook
3. 检查SDK文档仓库中的/internal/commits中是否有对应说明
    /internal/commits中每一行代表一个commit，格式为
    
    ```
    commit                                   sdk        ver    bugfix feature api   comment
    fad7305bfbebae5da57c4aa809785b6ce7400abe android    0.0.1  y      n       n     解决小米1s机型不能评测的问题；解决一些网络环境下出现oom的问题
    d77ba24ea1d646d5f56a132fc631835023e98ec2 iOS        0.1.0  n      y       y     增加本地mp3录音输出功能
    ```
    
    * ver 三断版本号的上升值
    * bugfix 是否为bug修正
    * feature 是否是增加新功能
    * api 是否需要更新api接口文档
    * comment 修正了什么bug或者增加了什么功能
4. 若步骤3的检查中格式不正确，push失败。需要更新/internal/commits后重新push
5. 若步骤3中标示需要更新api，则会检查对应的api文档是否有针对此commit的更新。如没有检测到有api文档更新，push失败。需要更新api文档后重新push
6. 若第一段或第二段版本号有更新，则在版本说明文档中自动插入最新版本的版本说明，并将该版本标示为beta状态

