var configValues = require('./config.json');

module.exports = {
    getDBConnectionString: function(){
        return "mongodb://" + configValues.dbusername + ":" + configValues.dbpassword + "@ds011278.mlab.com:11278/angeltrt";
    }
};

