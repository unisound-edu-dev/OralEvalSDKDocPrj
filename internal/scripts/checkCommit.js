#!/usr/bin/node
var github = require('octonode');
var getGitContent = require('./common.js').getGitContent;
var unsCommit= require('./commit.js');


//var githubToken = "209222b44e2fd62d94248e0893abdd6544dcdffd";

process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        var args = chunk.toString().split(' ');
        var oldRev = args[0];
        var newRev = args[1];
        var ref = args[2];

        var client = github.client();
        var ghrepo = client.repo('unisound-edu-dev/OralEvalSDKDocPrj');
        getGitContent(ghrepo, 'internal/commits', function(commitTexts){
            var commits = unsCommit.getCommitInfos(commitTexts);
            if(!commits) throw new Error('can not find and commit from ' + commitTexts)
            var found = false;
            for(var i = 0; i < commits.length; i++) {
                if (commits[i].hash == newRev) {
                    found = true;
                    process.stdout.write('find commit ' + commits[i].str() + '\n');
                    if (commits[i].api) {
                        ghrepo.commits({path: commits[i].sdk + '/api.md'}, function (err, b, h) {
                            if (!b) {
                                process.stdout.write('can not get commits of ' + commits[i].sdk + '/api.md\n');
                                process.exit(3);
                            }
                            b.forEach(function (gc) {
                                if (('update for commit ' + newRev) == gc.commit.message) {
                                    process.stdout.write('find api update ' + gc.sha + ' for ' + newRev + '\n');
                                    process.exit(0);
                                }
                            });
                            process.stdout.write(newRev + ' need a api update\n');
                            process.stdout.write('please update document before push--https://github.com/unisound-edu-dev/OralEvalSDKDocPrj/blob/master/' + commits[i].sdk + 'api.md\n');
                            process.exit(2);
                        });
                    } else {
                        process.exit(0);
                    }
                }
            }
            if(!found) {
                process.stdout.write('can not find commit ' + newRev);
                process.stdout.write('\nplease update document before push--https://github.com/unisound-edu-dev/OralEvalSDKDocPrj/blob/master/internal/commits');
                process.exit(1);
            }
        });
    }
});
