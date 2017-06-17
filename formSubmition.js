var insert = require("./insert.js")

var formSubmitQuestionSql = function(data){

    insert.insertQuestionSql(data.q, data.a1, data.a2, data.a3, data.a4, data.correct);
}

var formSubmitQuestionPosInfoSql = function(question_passed, size){

    insert.insertQuestionPosInfoSql(question_passed, size);
}

module.exports.formSubmitQuestionSql = formSubmitQuestionSql;
module.exports.formSubmitQuestionPosInfoSql = formSubmitQuestionPosInfoSql;
