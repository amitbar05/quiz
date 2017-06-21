var insert = require("./insert.js")

var formSubmitQuestionSql = function(data){

    insert.insertQuestionSql(data.q, data.a1, data.a2, data.a3, data.a4, data.correct);
}

module.exports.formSubmitQuestionSql = formSubmitQuestionSql;
