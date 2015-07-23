var github = require('octonode');
var https = require('https');

var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

var go = function(username, password){
    var client = github.client({
        username: username,
        password: password
    });

    var ghrepo = client.repo('unisound-edu-dev/OralEvalSDKDocPrj');
    ghrepo.contents('internal/commits', function(err, b, h){
        err && console.log('err:'+err);
        if (!b || !b.download_url){console.log('can not download "internal/commits"');return;}
        var commitsText = '';
        https.get(b.download_url, function(rsp) {
            rsp.setEncoding('utf8');
            rsp.on('data', function(txt){
                commitsText += txt;
            });
            rsp.on('end', function(){
                console.log('commits:\n' + commitsText);
            });
            rsp.on('error', function(err){
                console.log('error:' + err);
            })
        });
    });
};

if(process.env['uname']){
    go(process.env['uname'], process.env['pwd']);
}else{
    rl.question('github username:', function(uname){
        rl.question('password:', function(pwd){
            go(uname || process.env['uname'], pwd || process.env['pwd']);
            rl.close();
        });
    });
}





