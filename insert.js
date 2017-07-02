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
           callback(currentlyQuizCreatedId);
    });

  });
};


exports.insertGrade = function( person_id, gradeNum, quiz_id, callback2){
  //  console.log("q, a1, a2, a3, a4, correct":+ q + a1 + a2 + a3 + a4 + correct);
  var q = {
    person_id : person_id,
    percentage : gradeNum,
    quiz_id : quiz_id
  };
  var query = connection.query('insert into grades set ?', q, function(err, result){
    if(err){
      console.error(err);
    }
callback2();

});
};

exports.insertAnswersQuestionsStats = function(question,question_id, quiz_id){
  var q1 = {
    answer_id : 1,
    answer : question.a1,
    question_id : question_id,
    quiz_id : quiz_id,
    counter_selected : 0
  };
  var q2 = {
    answer_id : 2,
    answer : question.a2,
    question_id : question_id,
    quiz_id : quiz_id,
    counter_selected : 0
  };
  var q3 = {
    answer_id : 3,
    answer : question.a3,
    question_id : question_id,
    quiz_id : quiz_id,
    counter_selected : 0
  };
  var q4 = {
    answer_id : 4,
    answer : question.a4,
    question_id : question_id,
    quiz_id : quiz_id,
    counter_selected : 0
  };
  var query = connection.query('insert into answerStat set ?', q1, function(err, result){
    if(err){
      console.error(err);
    }
  });
  var query = connection.query('insert into answerStat set ?', q2, function(err, result){
    if(err){
      console.error(err);
    }
  });
  var query = connection.query('insert into answerStat set ?', q3, function(err, result){
    if(err){
      console.error(err);
    }
  });
  var query = connection.query('insert into answerStat set ?', q4, function(err, result){
    if(err){
      console.error(err);
    }
  });
};

module.exports.insertQuestionSql = insertQuestionSql;
