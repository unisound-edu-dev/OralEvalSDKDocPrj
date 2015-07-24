var github = require('octonode');
var getGitContent = require('./common.js').getGitContent;
var unsCommit= require('./commit.js');


var githubToken = "f4ece78748f14faeb0b6390174b6769110fe3075";

process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        var args = chunk.toString().split(' ');
        var oldRev = args[0];
        var newRev = args[1];
        var ref = args[2];

        var client = github.client(githubToken);
        var ghrepo = client.repo('unisound-edu-dev/OralEvalSDKDocPrj');
        getGitContent(ghrepo, 'internal/commits', function(commitTexts){
            var commits = unsCommit.getCommitInfos(commitTexts);
            if(!commits) throw new Error('can not find and commit from ' + commitTexts)
            for(var i = 0; i < commits.length; i++) {
                if (commits[i].hash == newRev) {
                    console.log('find commit ' + commits[i].str())
                    return;
                }
            }
            throw new Error('can not find commit ' + newRev);
        });
    }
});
