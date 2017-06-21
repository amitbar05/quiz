var mysql = require("mysql");
var select = require('./select.js');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'tempUser',
  password: '123456',
  database: 'creatordb'
});


connection.connect();
var insertQuestionSql = function( q, a1, a2, a3, a4, correct){
  //  console.log("q, a1, a2, a3, a4, correct":+ q + a1 + a2 + a3 + a4 + correct);
  var q1 = {
    question : q,
    answer1: a1,
    answer2: a2,
    answer3: a3,
    answer4: a4,
    correct_answer: correct
  };

  var query = connection.query('insert into quiz set ?', q1, function(err, result){
    if(err){
      console.error(err);
    }
    console.error("inerted "+q+" in succes");
  });
}



exports.insertQuestionPosInfoSql = function( question_passed, size, callback){
  //  console.log("q, a1, a2, a3, a4, correct":+ q + a1 + a2 + a3 + a4 + correct);
  var q = {
    question_passed : question_passed,
    size: size
  };
  var query = connection.query('insert into listPosDis set ?', q, function(err, result){
    if(err){
      console.error(err);
    }

    console.error("insert {"+question_passed+","+size+"} in succes");
    select.getLastFormCreatedNumber(function callback2(currentlyQuizCreatedId){
      console.log("returning the number of the quiz which was just created, the quiz number is = " + currentlyQuizCreatedId);
  //    callback(300000000);
           callback(currentlyQuizCreatedId);
    });

  });
};

module.exports.insertQuestionSql = insertQuestionSql;
