var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'tempUser',
  password: '123456',
  database: 'creatordb'
});

connection.connect();

exports.getLastFormCreatedNumber = function( callback){
  connection.query('SELECT * FROM listPosDis ORDER BY quiz_id DESC LIMIT 1', function(err, result){
    if(err){
      console.error(err);
    }else {
      console.log("selected quis number " + result[0].quiz_id);
      callback(parseInt(result[0].quiz_id));
    }
  });
};



exports.numOfCorrectAnswerByNumQuestion = function(numAnswer, callback){
  var string = 'SELECT correct_answer FROM quiz WHERE question_id = '+numAnswer+';';
  console.log("are you crazy this suppose to be fine: "+ string);
  connection.query(string, function(err, result){
    if(err){
      console.error("error number idiot 23132135"+err);
    }else {
      console.log("i am not an error: "+JSON.stringify(result));
      callback(result);
    }
  });
};

exports.getQuizNumByNumQuestion = function(numAnswer, callback){
  var string = 'SELECT quiz_id FROM answerStat WHERE question_id = '+numAnswer+' LIMIT 1;';
  console.log("are you crazy this suppose to be fine: "+ string);
  connection.query(string, function(err, result){
    if(err){
      console.error("error number idiot 23132134"+err);
    }else {
      console.log("getQuizNumByNumQuestion function working: "+JSON.stringify(result));
      callback(result);
    }
  });
};

exports.isRowGradeExists = function(person_id, quiz_id, callback){
  var string = 'select count(1) from grades where person_id = ' + person_id + ' AND quiz_id = ' + quiz_id + ';';

  console.log("are you crazy this suppose to be fine: "+ string);
  connection.query(string, function(err, result){
    if(err){
      console.error("error number idiot 2313313"+err);
    }else {
      callback(parseInt(Object.values(result[0])));
    }
  });
};

exports.getFormByNumForms = function(numForm, callback){
  var string = 'SELECT * FROM listPosDis WHERE quiz_id = '+numForm+';';
  connection.query(string, function(err, result){
    if(err){
      console.error("error number idiot 1"+err);
    }else {
      console.log("i am not an error: "+JSON.stringify(result));
      callback(result);
    }
  });
};

exports.checkSecurityPinByQuizId = function(number, securityPin, callback){
  var string = 'select password from securityKeys where quiz_id = ' + number + ';';

  console.log("are you crazy this suppose to be fine: "+ string);
  connection.query(string, function(err, result){
    if(err){
      console.error("error number idiot 2"+err);
    }else{
  console.log("the password suppose to be = " + JSON.stringify(result[0].password));
  console.log("the password enter is = " + securityPin);
  if(result[0].password == securityPin){
console.log("true pin code");
  callback(true);
}else{
  console.log("false pin code");
  callback(false);
}
}
});
};

exports.showSpecificFormByDistanceAndSize = function(howManyQuestionPassedUntilTheBeginingOfQuiz, sizeOfQuiz, callback){

  var sumOfQuestionPassed = parseInt(howManyQuestionPassedUntilTheBeginingOfQuiz) + parseInt(sizeOfQuiz);
  var string ='SELECT * FROM (SELECT * FROM ( SELECT * FROM quiz ORDER BY question_id ASC LIMIT '
  +sumOfQuestionPassed+') temp ORDER BY temp.question_id DESC LIMIT '
  +sizeOfQuiz+') t ORDER BY rand() ASC';

  //var string =SELECT * FROM (SELECT * FROM ( SELECT * FROM quiz ORDER BY number_question ASC LIMIT 'QuestionPassed') temp ORDER BY temp.number_question DESC LIMIT 'sizeOfQuiz+') t ORDER BY rand() ASC;
  //var stringNotRandom is unnesccery
  var stringNotRandom ='SELECT * FROM ( SELECT * FROM quiz ORDER BY question_id ASC LIMIT '
  +sumOfQuestionPassed+') temp ORDER BY temp.question_id DESC LIMIT '
  +sizeOfQuiz;
  connection.query(string, function(err, result){
    if(err){
      console.error(err);
    }else {
      console.log(result);
      callback(result);
    }
  });
};
