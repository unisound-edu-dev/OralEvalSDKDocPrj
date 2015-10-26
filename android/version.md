## v3.3.9
* status: beta ![beta](/internal/imgs/beta.png)
* head: 7669dc64b72374ff90e2a1e1e913424132e0b85a
* bugfix:
	* http评测时使用随机ip
	* java层分配的空间不够导致jni中crash
	* 直接使用第二步(ip + 80)开始在线评测时，不能对http评测错误正常结束
	* 检测禁止录音时读取的的音频都为0问题；结束评测之前读走所有的音频数据
	* 更新到正确的版本号
	* 极限条件下stop时sdk内部已经停止导致crash的bug
	* 同样的音频，每次评测opus编码出来的数据不一样的问题
	* 解决内部测试问题，包括崩溃、一直不返回结果的；私有协议评测发现oov时放弃后续备份链接
	* 一个严重的多线程问题，没有意识到状态迁移用的后台线程异步执行
	* http评测无需结束信号，音频结束时自然会结束。所以应该在运行过程中随时处理http结果
* features:
	* 重构到3.0.0版本，增加HTTP评测方式作为备份
	* 检测禁止录音时读取的的音频都为0问题；结束评测之前读走所有的音频数据
	* 离在线混合评测时，永久等待离线结果，不做超时处理
	* 解决内部测试问题，包括崩溃、一直不返回结果的；私有协议评测发现oov时放弃后续备份链接

## v2.5.3
* status: beta ![beta](/internal/imgs/beta.png)
* head: 699bf9cfd380c96a34e500dc6ea2150cf4f8a20d
* bugfix:
	* 网络劫持捕获向上层报error
* features:
	* 上海机房IP调整
	* 增加调整得分系数的接口

## v2.3.2
* status: released ![released](/internal/imgs/ok.png)
* head: 6b99f155c1fadc5b9d8dabd097d40444f3e55b08
* bugfix:
	* 当一个域名无法解析时，不影响用其他域名评测
	* 当备份IP都不能访问时，下次连接从主域名开发重新尝试
* features:
	* 将eval.hivoice.cn主域名和全国各地机房固定IP内置到SDK中，以作服务备份
	* 去掉特定用户打分调整功能
	* 支持分数松紧参数设置

## v2.0.0
* status: beta ![beta](/internal/imgs/beta.png)
* head: 77a8a472e6cce568abb443f12a8cf548a76cb7a5

## v0.0.0

* init version
