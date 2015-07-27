##云知声口语评测服务Android SDK Demo

评测过程很简单，设置参数=>启动评测=>等待结果。

1.对于混合评测SDK，需要先初始化离线引擎，在Activity.OnCreate()中调用[OralEvalSDKFactory](api.md#oralevalsdkfactory).initOfflineSDK初始化。对应的在onDestroy()中调用[OralEvalSDKFactory](api.md#oralevalsdkfactory).cleanupOfflineSDK()完成离线引擎的销毁。
```java
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    IOralEvalSDK.OfflineSDKPreparationError err = OralEvalSDKFactory.initOfflineSDK(NewDemoActivity.this, null);
    if (err != IOralEvalSDK.OfflineSDKPreparationError.NOERROR) {
        //如果初始化无法完成，请根据返回的错误码debug。
        finish();
    }
}


public void onDestroy(){
    super.onDestroy();
    OralEvalSDKFactory.cleanupOfflineSDK(this);
}

```
2.开始评测。调用[OralEvalSDKFactory](api.md#oralevalsdkfactory).StartConfig([OralEvalSDKFactory.StartConfig](OralEvalSDKFactory](api.md#oralevalsdkfactorystartconfig))启动一个评测。评测是在后台执行的，需要穿递一个实现了回调接口[IOralEvalSDK.ICallback](api.md#ioralevalsdkicallback)的对象，用于接收评测的结果和错误等信息。
```java
IOralEvalSDK _oe;

//假设以一个click事件触发评测/停止。
public void onClick(){
    //假设以_oe是否为空判断之前的评测是否结束。同一时刻只能有一个评测进行
    if(_oe == null){
        OralEvalSDKFactory.StartConfig cfg = new OralEvalSDKFactory.StartConfig(text);
        //此处可以通过cfg对象设置其他评测参数，比如设置实时录音输出为mp3格式
        cfg.setMp3Audio(true);
        //this已经实现了IOralEvalSDK.ICallback
        _oe = OralEvalSDKFactory.start(this, cfg, this);
    } else {
        //停止评测和开始评测一样，都是异步的，需要等待onStop()或者onError()回调才真正结束
        _oe.stop();
    }
}

    //评测启动回调
    @Override
    public void onStart(IOralEvalSDK iOralEvalSDK, int audioId) {
        Log.i(TAG, "onStart(), audioId="+audioId);
    }
    
    //实时音量回调
    @Override
    public void onVolume(IOralEvalSDK who, final int value) {
        Log.i(TAG, "Volume:" + value);
        this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                //如果有界面显示实时音量，可以在此刷新
                ((ProgressBar)findViewById(R.id.progressBar)).setProgress(value);
            }
        });
    }

    //实时语音数据回调
    @Override
    public void onAudioData(IOralEvalSDK iOralEvalSDK, byte[] bytes, int offset, int len) {
        //可以将bytes中的mp3或者pcm数据(根据OralEvalSDKFactory.StartConfig的设置)保存到文件中，以便之后播放。
    }

```
3.拿到评测结果，或者错误
```java

    //评测出错回调
    @Override
    public void onError(IOralEvalSDK iOralEvalSDK, IOralEvalSDK.Error error, IOralEvalSDK.OfflineSDKPreparationError ofError) {
        //对于不支持混合评测的SDK，是不会产出离线错误的，即ofError无效
        final IOralEvalSDK.Error err = error;
        final IOralEvalSDK.OfflineSDKPreparationError ofe = ofError;

        //这些回调都是在工作线程中执行的，所以需要异步到UI线程/主线程中，才能安全执行应用程序自己的操作
        this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                _oe = null;
                //这里可以做显示错误之类的操作，如果是服务端的错误，可以联系云知声客户经理寻求帮助
        });
    }

    //测试正常结束回调
    @Override
    public void onStop(IOralEvalSDK iOralEvalSDK, String s, boolean offline,String str,int i) {
        //如果offline是true，说明此次结果是离线引擎评测得到的，分数准确性会有所下降。对于不支持混合评测的SDK，是不会产出离线结果的，在线评测出错(比如网络异常)即报错
        Log.i(TAG, "onStop(), offline=" + offline);
        Log.i(TAG, "result:" + s);

        this.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                _oe = null;
                //这里可以记录url到本地或者应用自己的服务器，以便之后播放使用
            }
        });
    }

```
