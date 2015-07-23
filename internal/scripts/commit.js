var version = require("./version.js").version;

var commitInfo = function(rslt){
    this.hash = rslt[1];
    this.sdk = rslt[2];
    this.ver = new version([rslt[3] * 1, rslt[4] * 1, rslt[5] * 1]);
    this.bug = rslt[6]=='y';
    this.feature = rslt[7]=='y';
    this.api = rslt[8]=='y';
    this.msg = rslt[9];
}

exports.commit = commitInfo;