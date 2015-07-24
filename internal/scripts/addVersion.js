var github = require('octonode');
var https = require('https');
var commit= require('./commit.js');
var version = require('./version.js');

var findFirstVersion = version.findFirstVersion;
version = version.version;

var getNewVersion = commit.getNewVersion;
var commit = commit.commit;

var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

var getContent = function(url, cb){
    var texts = '';
    https.get(url, function(rsp) {
        rsp.setEncoding('utf8');
        rsp.on('data', function(txt){
            texts += txt;
        });
        rsp.on('end', function(){
            cb(texts);
        });
        rsp.on('error', function(err){
            throw new Error('getting ' + url + err);
        })
    });
}

var getGitContent = function(ghrepo, path, cb){
    ghrepo.contents(path, function(err, b, h){
        if(err) throw(new Error('get contents "' + path + '":' + err));
        if (!b || !b.download_url) throw new Error('can not download "' + path + '"');
        getContent(b.download_url, cb);
    });
}

var go = function(username, password, sdk){
    var client = github.client({
        username: username,
        password: password
    });

    var ghrepo = client.repo('unisound-edu-dev/OralEvalSDKDocPrj');
    getGitContent(ghrepo, 'internal/commits', function(commitTexts){
        getGitContent(ghrepo, sdk + '/version.md', function(versionTexts){
            //find last version
            var lastVer = findFirstVersion(versionTexts);
            if(!lastVer) throw new Error('can not find last version in ' + sdk);
            console.log('last version of ' + sdk + ' sdk is > ' + lastVer.str());
            var newVer = getNewVersion(commitTexts, lastVer, sdk);
            if(!newVer ) throw new Error('no new commits from version ' + lastVer.str());
            console.log('new version is > ' + newVer.str())
            console.log('new version markdown:');
            //newVer.changes.forEach(function(c){
            //    console.log(c.msg)
            //});
            console.log(newVer.md());
            process.exit(0);
        });
    })
};

if(process.env['uname']){
    go(process.env['uname'], process.env['pwd'],process.env['sdk']);
}else{
    rl.question('github username:', function(uname){
        rl.question('password:', function(pwd){
            rl.question('which sdk[android/iOS/flash]', function(sdk){
                go(uname || process.env['uname'], pwd || process.env['pwd'], sdk || process.env['sdk']);
                rl.close();
            });
        });
    });
}
