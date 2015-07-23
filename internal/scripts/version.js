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
}

exports.version = version;
