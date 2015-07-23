var github = require('octonode');
var https = require('https');
var commitInfo = require('./commit.js').commit;
var version = require('./version.js').version;

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

var findFirstVersion = function(text){
    var rst = /## v([0-9]+)\.([0-9]+)\.([0-9]+)/g.exec(text);
    if(rst && rst[1] && rst[2] && rst[3]){
        return new version([rst[1] * 1, rst[2] * 1, rst[3] * 1]);
    }
    return null;
}

var getNewVersion = function(commits, lastVer, s){
    var commitLines = commits.split('\n');
    var newCommits = [];
    var ver = new version([0,0,0]);
    var reg = /^([a-f0-9]{40})[ \t]+([^ \t]+)[ \t]+([0-9]+)\.([0-9]+)\.([0-9]+)[ \t]+([yn])[ \t]+([yn])[ \t]+([yn])[ \t]+(.*)/;
    commitLines.forEach(function(l){
        var rslt = reg.exec(l);
        if(rslt && rslt[2] == s){
            var info = new commitInfo(rslt);
            ver = ver.add(info.ver);
            if(ver.gte(lastVer)){
                newCommits.push(info);
            }
        }
    });
    if(newCommits.length > 0){
        ver.changes = newCommits;
        return ver;
    }
    return null;
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
            console.log('changes for new version is >');
            newVer.changes.forEach(function(c){
                console.log(c.msg)
            })
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
            })
        });
    });
}





