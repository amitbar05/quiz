var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'tempUser',
  password: '123456',
  database: 'creatordb'
});

connection.connect();

exports.getLastFormCreatedNumber = function( callback){
  connection.query('SELECT * FROM listPosDis ORDER BY Number_form DESC LIMIT 1', function(err, result){
    if(err){
      console.error(err);
    }else {
      console.log(result[0].Number_form);
      callback(parseInt(result[0].Number_form));
    }
  });
};



exports.numOfCorrectAnswerByNumQuestion = function(numAnswer, callback){
  var string = 'SELECT correct_answer FROM quiz WHERE number_question = '+numAnswer+';';
  console.log("are you crazy this suppose to be fine: "+ string);
  connection.query(string, function(err, result){
    if(err){
      console.error("error number idiot 2313213"+err);
    }else {
      console.log("i am not an error: "+result);
      callback(result);
    }
  });
};

exports.getFormByNumForms = function(numForm, callback){
  var string = 'SELECT * FROM listPosDis WHERE Number_form = '+numForm+';';
  connection.query(string, function(err, result){
    if(err){
      console.error("error number idiot 2313213"+err);
    }else {
      console.log("i am not an error: "+result);
      callback(result);
    }
  });
};


exports.showSpecificFormByDistanceAndSize = function(howManyQuestionPassedUntilTheBeginingOfQuiz, sizeOfQuiz, callback){
  console.log("howManyQuestionPassedUntilTheBeginingOfQuiz:         "+howManyQuestionPassedUntilTheBeginingOfQuiz);
  console.log("sizeOfQuiz;                                        "+sizeOfQuiz);

  var sumOfQuestionPassed = parseInt(howManyQuestionPassedUntilTheBeginingOfQuiz) + parseInt(sizeOfQuiz);
  console.log("sumOfQuestionPassed:                                     "+ sumOfQuestionPassed);
  var string ='SELECT * FROM (SELECT * FROM ( SELECT * FROM quiz ORDER BY number_question ASC LIMIT '
  +sumOfQuestionPassed+') temp ORDER BY temp.number_question DESC LIMIT '
  +sizeOfQuiz+') t ORDER BY rand() ASC';

  //var string =SELECT * FROM (SELECT * FROM ( SELECT * FROM quiz ORDER BY number_question ASC LIMIT 'QuestionPassed') temp ORDER BY temp.number_question DESC LIMIT 'sizeOfQuiz+') t ORDER BY rand() ASC;
  //var stringNotRandom is unnesccery
  var stringNotRandom ='SELECT * FROM ( SELECT * FROM quiz ORDER BY number_question ASC LIMIT '
  +sumOfQuestionPassed+') temp ORDER BY temp.number_question DESC LIMIT '
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
