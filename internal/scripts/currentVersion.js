#!/usr/bin/node
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

var client = github.client();

var sdk = process.argv[2];
var ghrepo = client.repo('unisound-edu-dev/OralEvalSDKDocPrj');
getGitContent(ghrepo, 'internal/commits', function(commitTexts){
    getGitContent(ghrepo, sdk + '/version.md', function(versionTexts) {
        //find last version
        var lastVer = findFirstVersion(versionTexts);
        if (!lastVer) throw new Error('can not find last version in ' + sdk);
        var newVer = getNewVersion(commitTexts, lastVer, sdk);
        if (!newVer) process.stdout.write(lastVer.str()+'\n')
        else process.stdout.write(newVer.str()+'\n')
    });
});
