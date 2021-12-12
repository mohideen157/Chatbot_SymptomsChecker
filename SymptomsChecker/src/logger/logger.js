var fs = require('fs');
var config = require('../config.json');

exports.log=function(element){

    var utcDate=
    (new Date().getUTCFullYear()<10?('0'+new Date().getUTCFullYear()):new Date().getUTCFullYear())+'-'+
    (new Date().getUTCMonth()+1<10?('0'+(new Date().getUTCMonth()+1)):(new Date().getUTCMonth()+1))+'-'+
    (new Date().getUTCDate()<10?('0'+new Date().getUTCDate()):new Date().getUTCDate());

    utcTimeStamp=utcDate+' '+
    (new Date().getUTCHours()<10?('0'+new Date().getUTCHours()):new Date().getUTCHours())+'-'+
    (new Date().getUTCMinutes()<10?('0'+new Date().getUTCMinutes()):new Date().getUTCMinutes());

    if (!fs.existsSync(config.log_path+utcDate)) {
        fs.mkdirSync( config.log_path+utcDate );
    }


    var filename=config.log_path+utcDate+"/"+"log_"+utcTimeStamp+".log";

    if(element!=undefined&&element!=null&&element!=''&&
    (typeof element == 'object' || element instanceof Object)){
        element=JSON.stringify(element);
    }


    fs.appendFile(filename, element+'\n', function (err) {
        if (err){
            console.log('error: log not saved!');
            console.log(err);
            throw err;
        } 
        console.log(element);
        console.log('log Saved!');
    });

}