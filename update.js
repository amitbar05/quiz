var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'tempUser',
  password: '123456',
  database: 'creatordb'
});

connection.connect();



exports.addAnswerCounter = function(question_id, answer_id){
  var string = 'UPDATE answerStat SET counter_selected = counter_selected + 1 WHERE question_id = ' + question_id + ' AND answer_id = '+ answer_id +';';
  console.log("are you crazy this suppose to be fine: "+ string);
  connection.query(string, function(err, result){
    if(err){
      console.error("error number idiot 1"+err);
    }else {
      console.log("updated ++"+answer_id);
    }
  });
};


exports.updateGrade = function(person_id, quiz_id, percentage, callback2){
  var string = 'UPDATE grades SET percentage = ' + percentage + ' WHERE person_id = ' + person_id + ' AND quiz_id = '+ quiz_id +';';
  console.log("are you crazy this suppose to be fine: "+ string);
  connection.query(string, function(err, result){
    if(err){
      console.error("error number idiot 1"+err);
    }else {
      console.log("updated "+person_id +", "+ quiz_id +", "+ percentage);
      callback2();
    }
  });
};
