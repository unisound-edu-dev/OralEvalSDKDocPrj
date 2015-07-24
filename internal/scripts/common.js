var https = require('https');

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

exports.getGitContent = getGitContent;
exports.getContent = getContent;