var express        =        require("express");
var bodyParser     =        require("body-parser");
var fs = require("fs");
var app            =        express();
var session = require("express-session")
var formSub = require("./formSubmition.js");
var showSql = require("./select.js");
var insert = require("./insert.js");
var update = require("./update.js");





app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(session({secret: 'ssshhhhh', resave:false, saveUninitialized:true}));
var sess;


app.get('/create',function(req,res){
  sess = req.session;
  sess.counterQ = 1;
  sess.maxCounter = 1;
  sess.arrQuestionCreate = [];
  inTheMiddleOfTest = true;
  res.render('setNumberOfQuestions');
});



app.get('/test', function(req, res){

  //res.sendFile(__dirname+'/test.html');
  console.log("this is before doning");
  var roundedPercent = 0
  var urlQuiz = "/quiz1"
  res.render('doneAnsweringQuiz', {percent: roundedPercent, url: urlQuiz});
  console.log("this is afrer doning");
});

app.get('/',function(req,res){
  // app.use(express.static(__dirname));
  res.render('hello');
});

app.get('/quiz:number',function(req,res){
  // app.use(express.static(__dirname));rs
  console.log("asking quiz number "+req.params.number);
  showSql.getLastFormCreatedNumber(function callback(maxQuizes){
    console.log("maxQuizes"+ maxQuizes);

    if(maxQuizes < req.params.number){
      res.render("numberOfQuizTooHigh")
    }else if(req.params.number < 0){
        res.render("numberOfQuizTooHigh")
      }else{
      showSql.getFormByNumForms(req.params.number, function callback(wantedQuiz){
        console.log(wantedQuiz);
        var question_passed = wantedQuiz[0].question_passed;
        var size = wantedQuiz[0].size;
        showSql.showSpecificFormByDistanceAndSize(question_passed,size,function callback(dataSql){
          console.log("dataSql = " + dataSql);
          res.render('answer', {dataSql: dataSql, max: size});
        });
      });
    }
  });
});





///app.post('/', function())

//Here we are configuring express to use body-parser as middle-ware.
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());

app.post("/numberOfQuestion", urlencodedParser, function(req,res){
  sess = req.session;
  sess.maxCounter = req.body.numQuestions;
  console.log("maxCounter from session"+sess.maxCounter);
  console.log("sessionID "+req.sessionID);



  res.render('indexCreate', {count: sess.counterQ});

});


app.post("/submitQuestion", urlencodedParser,function (req, res) {
  sess = req.session;
  console.log("count~~!: "+sess.counterQ);
  console.log("Maxcount~~!: "+sess.maxCounter);
  if(sess.counterQ < sess.maxCounter){
    sess.arrQuestionCreate.push(req.body);
    sess.counterQ++;
    res.render('indexCreate', {count: sess.counterQ});

  }else if(sess.counterQ == sess.maxCounter){
    console.log("equility is importent");

    sess.arrQuestionCreate.push(req.body);
    ////////////////!!!Dont save var on file, save it seession, all the vars!!!!!!!!!!!!!!!!!!!
    howManyQuestionPassedUntilTheBeginingOfQuiz  = fs.readFileSync("questionsCounterSoFar.txt");
    //need to do the sql sync with callback

    var questionsNumAfterQuiz = (parseInt(howManyQuestionPassedUntilTheBeginingOfQuiz)+parseInt(req.session.maxCounter));
    console.log("howManyQuestionPassedUntilTheBeginingOfQuiz::::::::::::::::::::::::::::: "+ howManyQuestionPassedUntilTheBeginingOfQuiz);
    console.log("questionsNumAfterQuiz::::::::::::::::::::::::::::: "+ questionsNumAfterQuiz);
    fs.writeFile("questionsCounterSoFar.txt", questionsNumAfterQuiz, (err) => {
      if (err) throw err;
      console.log('questionsCounterSoFar.txt file has been saved!');
    });


    insert.insertQuestionPosInfoSql(parseInt(howManyQuestionPassedUntilTheBeginingOfQuiz), parseInt(req.session.maxCounter), function callback(quizId){
      var urlStringQuiz = "/quiz"+quizId;
      console.log("now pushing all data");
      for (var i = 0; i < req.session.arrQuestionCreate.length; i++) {
        console.log("howManyQuestionPassedUntilTheBeginingOfQuiz = " + howManyQuestionPassedUntilTheBeginingOfQuiz);
        console.log("now pushing data number "+JSON.stringify(req.session.arrQuestionCreate[i]));
        insert.insertAnswersQuestionsStats(req.session.arrQuestionCreate[i],parseInt(howManyQuestionPassedUntilTheBeginingOfQuiz)+(i+1),quizId);
        formSub.formSubmitQuestionSql(req.session.arrQuestionCreate[i]);
      }

      res.render('doneFormCreation', {url: urlStringQuiz});
    });


  }else{
    console.error("number of questions is less than acceptable");
  }
});


app.post("/submitAnswer", urlencodedParser, function(req, res){
  var questions = req.body

  var personalNum = req.body.personalNum;
  console.log("req.body = " + JSON.stringify(req.body.personalNum));
  console.log("personal num = " + req.body.personalNum);
  delete questions["personalNum"];
  console.log("here is suppose to be the url getter -- " + Object.keys(questions)[0]);
  showSql.getQuizNumByNumQuestion(parseInt(Object.keys(questions)[0]), function callback(quizNum){

    getCorrectAnsweres(questions).then(function getAnsweresStat(signs){
      console.log("signs = " + signs);
      var correctCounter = 0;
      var wrongCounter = 0;
      for(sign in signs){
        if(signs[sign] == 'c'){
          correctCounter++;
        }else if(signs[sign] == 'w'){
          wrongCounter++;
        }else {
          console.log("ERROR: wrong sign of correctness not c or w, please check isAnswerCorrect(), BTW the sign is "+ signs[sign]);
        }
      }
      console.log("COUNTER correct = " + correctCounter);
      console.log("COUNTER wrong = " + wrongCounter);
      var sumQuestions = Object.keys(questions).length
      console.log("SUM  of questions = " + sumQuestions);
      //need to get the number of quiz

      var urlStringQuiz = "/quiz"+quizNum[0].quiz_id;

      percentCorrect = correctCounter / sumQuestions * 100;
      roundedPercent = percentCorrect.toFixed(2);
      showSql.isRowGradeExists(personalNum, quizNum[0].quiz_id, function callback(exists){
        console.log("exists = " + exists);
        if(parseInt(exists)){
        update.updateGrade(personalNum,quizNum[0].quiz_id,roundedPercent,function callback2(){
          res.render('doneAnsweringQuiz', {percent: roundedPercent, url: urlStringQuiz});
        });
        }
        else{
        insert.insertGrade(personalNum, percentCorrect, quizNum[0].quiz_id, function callback2(){
          res.render('doneAnsweringQuiz', {percent: roundedPercent, url: urlStringQuiz});

        });
      }
      });

    }).catch(function(error){
      console.log(error);
    });

  });


});




function getCorrectAnsweres(questions){
  var arrPromises = [];

  console.log("\n--------------------")
  console.log("\n" + JSON.stringify(questions))
  for(question in questions){
    arrPromises.push(isAnswerCorrect(question, questions[question]));
}
return Promise.all(arrPromises);
}



function isAnswerCorrect(question ,selected){
  return new Promise((resolve, reject) => {
    console.log("\n ----> Loop: Question ID: " + question)

    showSql.numOfCorrectAnswerByNumQuestion(question, function callback(correct){

      console.log("\n ----> Callback: Question ID: " + question)

      console.log('\n\n Correct answer --> ' + JSON.stringify(correct))

      var selectedAnswer = selected;

      selectedAnswer = selectedAnswer % 4;

      if (selectedAnswer == 0){
        selectedAnswer = 4;
      }

      update.addAnswerCounter(question, selectedAnswer);
      if( correct[0].correct_answer == selectedAnswer){
        console.log("selected Answer and correct Answer Does match");

        resolve('c');
      } else {
        console.log("selected Answer and correct Answer does NOT match");
        resolve('w');
      }
});
});
}







app.listen(3000);

console.log("localhost:3000");
