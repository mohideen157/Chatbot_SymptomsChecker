'use strict'
var rp = require('request-promise');
var HashMap = require('hashmap');
var config = require('../config.json');
var logger = require('../logger/logger');

exports.getDetails = async function(req, res, next) {
  
  //logger.log(req.url);
  //logger.log(req.body);
  //req.body.lang_model
  let lang_model=req.body.lang_model;
  let name=req.body.name;
  let mobileno=req.body.mobileno;
  let sex=req.body.sex;
  let age=Number(req.body.age);
  let symptoms=req.body.symptoms;
  let result;

  var lang=lang_model.replace('infermedica-','');
  res.setLocale(lang);
  res.cookie('lang', lang);

  var uri=config.diagonosisUrl;

  //logger.log('calling: '+uri);

 // var triageIds=['p_12','p_13','p_14','p_11','p_15','s_14'];
  var isTriage=false;
  var evidence=[];

  if((undefined!=sex) && (NaN!=age)&&uri!=null&&uri!=''){

    
    if(symptoms!=undefined){
      symptoms.forEach(element => {

        if(element!=null&&element!=''){
          var id=element.split('-')[0];
       var choice_id=element.split('-')[1];

        var el={
          'id':id,
          'choice_id':choice_id
        };
        evidence.push(el);

        //if(triageIds.indexOf(id)>-1){
          //isTriage=true;
          //uri=config.triageUrl;
        //}
        }
      });
    }

    //logger.log(evidence);

    
    rp({
      method: 'POST',
      uri: config.diagonosisUrl,
      headers: {
        'Content-Type': 'application/json',
        'App-Id': config.AppId,
        'App-Key': config.AppKey
      },
      body: {
          'sex' : sex,
          'age' : age,
          'evidence':evidence
      },
      async: true,
      json: true // Automatically stringifies the body to JSON
  }).then(function(body){
    //logger.log('parsed');
    console.log(body);
    result=body;
    
  }).catch(function(err){
    logger.log(config.diagonosisUrl+ 'error');
    logger.log(err);
  }).done(()=>{

    let requestbody={
      'sex' : sex,
      'age' : age,
      'evidence':evidence
  };
  console.log(config.diagonosisUrl);
    console.log(requestbody);
    console.log('diagonise result:');
    console.log(result);

    if(result!=undefined&&result.question!=undefined&&result.question.items!=undefined){
       // console.log(result.question.items);
        //console.log(result.question.items[0].choices);
      res.render('diagonise',{
        data: result.question.items,
        name:name,
        mobileno:mobileno,
        sex: sex,
        age: age,
        symptoms: symptoms,
        evidence:evidence,
        lang_model:lang_model,
        questionType:result.question.type
      });  
//    }else if(isTriage){
    }else{

      console.log('triage');
     // console.log(result);

      let triage_result;
      rp({
        method: 'POST',
        uri: config.triageUrl,
        headers: {
          'Content-Type': 'application/json',
          'App-Id': config.AppId,
          'App-Key': config.AppKey,
          'Model': lang_model
        },
        body: {
            'sex' : sex,
            'age' : age,
            'evidence':evidence
        },
        async: true,
        json: true // Automatically stringifies the body to JSON
    }).then(function(body){
      //logger.log('parsed');
      triage_result=body;
      
    }).catch(function(err){
      logger.log(config.triageUrl+ 'error');
      logger.log(err);
    }).done(()=>{

      //console.log(triage_result);


    
     
      //console.log(req.body);
      var emergencyflag=false;

      if(triage_result.serious!=undefined&&triage_result.serious!=null){
        triage_result.serious.forEach(element => {
          emergencyflag=emergencyflag==true||element.is_emergency==true;
        });
      }
      
      let label=triage_result.label==null?res.__('preventivemeasures'):triage_result.label;

      let description=triage_result.description==null?
      res.__('follow_preventivemeasures'):
      triage_result.description+res.__('consulthealthcare');

      let is_emergency=emergencyflag?res.__('YES'):res.__('NO');

      let triageObj={
        label:label,
        description:description,
        triage_level:triage_result.triage_level!=undefined&&triage_result.triage_level!=null?triage_result.triage_level:'',
        is_emergency:is_emergency,
        lang_model:lang_model,
        name:name,
        mobileno:mobileno,
        sex: sex,
        age: age,
        evidence:evidence
      };

     // console.log('triage object:')
      //console.log(triageObj)

      res.render('triage',triageObj);  

      });

      // CREATE REQUEST OBJECT FOR INSERT PATIENT OPERATION

     // let serious=result.serious!=undefined&&result.serious!=null&&(result.serious).length>0?JSON.stringify(result.serious):'';
      
      

      //var utcTimeStamp=
      //(new Date().getUTCFullYear()<10?('0'+new Date().getUTCFullYear()):new Date().getUTCFullYear())+'-'+
      //(new Date().getUTCMonth()+1<10?('0'+(new Date().getUTCMonth()+1)):(new Date().getUTCMonth()+1))+'-'+
      //(new Date().getUTCDate()<10?('0'+new Date().getUTCDate()):new Date().getUTCDate())+' '+
      //(new Date().getUTCHours()<10?('0'+new Date().getUTCHours()):new Date().getUTCHours())+'-'+
      //(new Date().getUTCMinutes()<10?('0'+new Date().getUTCMinutes()):new Date().getUTCMinutes())+'-'+
      //(new Date().getUTCSeconds()<10?('0'+new Date().getUTCSeconds()):new Date().getUTCSeconds());
    

   /* let color='';
    var map = new HashMap();
    evidence.forEach(el =>{
      map.set(el.id,el.choice_id);
    });
    // IF ALL ARE ABSENT
    if(map.get('s_0')=='absent'&&map.get('s_1')=='absent'&&map.get('s_2')=='absent'){
      if(map.get('p_11')=='present'||map.get('p_15')=='present'){
        color='green';
      }else if(map.get('p_12')=='present'||map.get('p_13')=='present'||map.get('p_14')=='present'){
        color='yellow';
      }
    }

    // IF 1 (s_0) is present and 2 (s_1) is present
    else if(map.get('s_0')=='present'&&map.get('s_1')=='present'&&map.get('s_2')=='absent'){
      if(map.get('s_4')=='present'||map.get('s_12')=='present'||map.get('s_13')=='present'||map.get('s_14')=='present'){
        color='red';
      }else{
        color='green';
      }
    }
    // IF 1 (s_0) is present and 3 (s_2) is present or all are present i.e, 2 (s_1) is either present or absent
    else if(map.get('s_0')=='present'&&map.get('s_2')=='present'){
      color='red';
    }
    // IF only 1 (s_0) is present
    else if(map.get('s_0')=='present'&&map.get('s_1')=='absent'&&map.get('s_2')=='absent'){
      if(map.get('s_4')=='present'||map.get('s_12')=='present'||map.get('s_13')=='present'||map.get('s_14')=='present'){
        color='red';
      }else{
        color='green';
      }
    }
    // IF 2 (s_1) is present or 3 (s_2) is present
    else if(map.get('s_1')=='present'||map.get('s_2')=='present'){
      if(map.get('s_12')=='present'||map.get('s_13')=='present'||map.get('s_14')=='present'){
        color='red';
      }else{
        color='green';
      }
    }*/
    //console.log(color);

    //console.log(map);

    //  var request_object={
    //      mobile_no:req.body.mobileno,
    //      triage_level:result.triage_level!=undefined&&result.triage_level!=null?result.triage_level:'',
    //      label:result.label,
    //      description:result.description,
    //      serious:serious,
    //      root_cause:'',
    //      checked_datetime:utcTimeStamp
    //    };
      
    // exports.insertPatient(request_object);

    

    
    }
    //else{
      //res.render('diagonise');
    //}
  });
  }
  };

  exports.insertPatient = async function(request_object) {
  
    let result;
    logger.log('insert patient request');
    logger.log(request_object);

    return await new Promise(function(resolve, reject) {
    
          rp({
            method: 'POST',
            uri: config.insertUrl,
            headers: {
              'Authorization':config.Authorization,
              'Content-Type': 'application/json',
              'Accept': '*/*',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection':'keep-alive',
            },
            body: request_object,
            async: true,
            json: true // Automatically stringifies the body to JSON
        }).then(function(body){
          result=body;
          logger.log('insertion result');
          logger.log(result);
          resolve(result);
        }).catch(function(err){
          logger.log('insertion error');
          logger.log(err);
          reject(err);
        });

  });
      
};