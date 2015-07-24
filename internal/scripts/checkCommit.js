var github = require('octonode');
var getGitContent = require('./common.js').getGitContent;
var unsCommit= require('./commit.js');


var githubToken = "209222b44e2fd62d94248e0893abdd6544dcdffd";

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
            process.stdout.write('can not find commit ' + newRev);
            process.stdout.write('\nplease update document before push--https://github.com/unisound-edu-dev/OralEvalSDKDocPrj/blob/master/internal/commits');
        });
    }
});
