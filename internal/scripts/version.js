var version = function(vers, commits){
    var self = this;
    this.v1 = vers[0];
    this.v2 = vers[1];
    this.v3 = vers[2];
    this.str = function(){
        return '' + vers[0] + '.' + vers[1] + '.' + vers[2];
    }
    this.changes = commits || [];
    this.add = function(ver, commits){
        /*var newChanges = changes;
        if(commits && typeof(commits)==='array'){
            newChanges.push.apply(newChanges, commits);
        }else if(commits){
            newChanges.push.(commits);
        }*/
        return new version([self.v1 + ver.v1, self.v2 + ver.v2, self.v3 + ver.v3], commits);
    }
    this.gte = function(ver){
        return (self.v1 == ver.v1 && self.v2==ver.v2 && self.v3==ver.v3) || self.v1 > ver.v1 || self.v2 > ver.v2 || self.v3 > ver.v3;
    }
    this.md = function(){
        var ret = '\n## v'+self.str() + '\n';
        ret += '* status: beta ![beta](/internal/imgs/beta.png)\n'
        ret += '* head: ' + self.changes[self.changes.length - 1].hash + '\n';
        ret += '* changes:\n'
        self.changes.forEach(function(c){
            ret += '\t* ' + c.msg + '\n';
        });
        return ret;
    }
}

var findFirstVersion = function(text) {
    var rst = /^## v([0-9]+)\.([0-9]+)\.([0-9]+)[ \t]*/g.exec(text);
    if (rst && rst[1] && rst[2] && rst[3]) {
        return new version([rst[1] * 1, rst[2] * 1, rst[3] * 1]);
    }
    return null;
}

exports.findFirstVersion = findFirstVersion;
exports.version = version;
