javascript SDK由Flash SDK包装而来，供在支持Flash插件的浏览器中使用。
API请参考Flash SDK(向项目经理索取)

* [DOM集成](#dom)
* [初始化](#init)
* [函数列表](#functions)
* [回调列表](#callbacks)

###<a name="dom"></a>DOM集成
基于Adobe的安全策略，Flash必须有一个可见区域用于展示，客户在集成js sdk时需要定义如下结构的节点用于安防Flash swf

```css
#unisoundJsSDKFlashContainer{
  position: relative;
}
#unisoundJsSDKFlashItem{
  position: absolute;
  top:0;
  left:0;
  z-index: 5;
}
#unisoundJsSDKFlashItemCover{
  position: relative;
  top:0;
  left:0;
  width: 215px;
  height: 138px;
  margin: 0;
  z-index: 10;
}
```

```html
 <div id="unisoundJsSDKFlashContainer"> <!--flash的父节点-->
     <div id="unisoundJsSDKFlashItem"></div><!--flash节点-->
     <div id="unisoundJsSDKFlashItemCover">some content larger then 215x138 to cover the flash</div><!--覆盖flash的节点-->
 </div>
 ```
 
### <a name="init"></a>初始化
引入sdk
```html
<script  type="text/javascript" src="<path>/uns-oraleval-js-sdk.js"></script>
```
DOM加载完成后初始化sdk
```javascript
unsoe.create("unisoundJsSDKFlashItem", 'js/', {
        onReady:function(){console.log('app: ready')},
        onResult:function(url, result){
            document.getElementById("url").value =url;
            document.getElementById("result").value =result;
            console.log('app: result')
        },
        onError:function(code,msg){
            document.getElementById("url").value = 'error:' + code;
            document.getElementById("result").value = 'error:' + msg;
        }
    })
```
unsoe.create()函数第一个参数是Flash节点的id，第二个参数是随sdk提供的swf文件的相对路径，第三个参数是各种回调对象。

对sdk的其他操作，必须在onReady以后进行，在一些flash加载比较慢的机器或浏览器上，底层flash的初始化会比较慢，在初始化过程中无法对sdk进行操作。

###<a name="functions"></a> 函数列表
请参考flash sdk api文档。如flash sdk中有一个函数setXXXX(xx)，则对应可以调用unsoe.setXXX(xx)

###<a name="callbacks"></a> 回调列表
| flash 事件 |  js 回调|
| ----- | ----- |
| complete | onResult |
| error | onError |
| beginOfSpeech | onSpeechBegin |
| endOfSpeech | onSpeechEnd | 
| vadTimeOut | onVadTimeOut | 
| outOfMaxLimited | onVolReachMax | 
| outOfMinLimited | onVolReachMin | 
| playLocalComplete | onPlayEnd | 
