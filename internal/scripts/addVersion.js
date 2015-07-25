var github = require('octonode');

var commit= require('./commit.js');
var version = require('./version.js');
var mycommon = require('./common.js');

var getGitContent = mycommon.getGitContent;
var getContent = mycommon.getContent;

var findFirstVersion = version.findFirstVersion;
version = version.version;

var getNewVersion = commit.getNewVersion;
var commit = commit.commit;

var rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

var go = function(username, password, sdk){
    var client = github.client();

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

//exports.getUrlContent = getContent;
exports.getGitContent = getGitContent;