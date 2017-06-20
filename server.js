var express        =        require("express");
var bodyParser     =        require("body-parser");
var fs = require("fs");
//var less = require('less');
var app            =        express();
var session = require("express-session")
var formSub = require("./formSubmition.js");
var showSql = require("./select.js");


//req.session.counterQ = 1;
//i created the quiz counter for being ablet to save quizes and being able to answer them
var quizCounter = 0;
//req.session.maxCounter;
//req.session.arrQuestionCreate = [];



app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(session({secret: 'ssshhhhh', resave:false, saveUninitialized:true}));
var sess;

var inTheMiddleOfTest;
var arrQuestionCreate;

app.get('/create',function(req,res){
sess = req.session;
  // app.use(express.static(__dirname));
  sess.counterQ = 1;
  sess.maxCounter = 1;
  sess.arrQuestionCreate = [];
  inTheMiddleOfTest = true;
  res.render('setNumberOfQuestions');
});


app.get('/controller_answer', function(req, res){
  res.sendFile(__dirname+'/controller_answer.js');
});

app.get('/test', function(req, res){

  //res.sendFile(__dirname+'/test.html');
  console.log("this is before doning");
  res.render('doneFormCreation')
  console.log("this is afrer doning");
});

app.get('/',function(req,res){
  // app.use(express.static(__dirname));
        res.render('hello');
});

app.get('/quiz:number',function(req,res){
  // app.use(express.static(__dirname));rs
  console.log("before sql stak");
  console.log("asking quiz number "+req.params.number);
showSql.getLastFormCreatedNumber(function callback(maxQuizes){
  console.log("maxQuizes"+ maxQuizes);

  if(maxQuizes < req.params.number){
    res.render("numberOfQuizTooHigh")
  }else{
  showSql.getFormByNumForms(req.params.number, function callback(wantedQuiz){
    console.log(wantedQuiz);
    var question_passed = wantedQuiz[0].question_passed;
    var size = wantedQuiz[0].size;
      showSql.showSpecificFormByDistanceAndSize(question_passed,size,function callback(dataSql){
          res.render('answer', {dataSql: dataSql, max: size});
      });
  });
}
});
});


function isCorrectAnswer(selectedAnswer, numQuestion){
  showSql.numOfCorrectAnswerByNumQuestion(numQuestion, function callback(correct){
    selectedAnswer = selectedAnswer % 4;
    if(selectedAnswer == 0){
      selectedAnswer = 4;
    }
    console.error("what what SELECTED:::"+ selectedAnswer);
    console.log("dont what whtt me the CORRECT::: "+correct[0].correct_answer);
    if(correct[0].correct_answer == selectedAnswer){
      console.log("selected Answer and correct Answer Does match");
      return true;
    }else {
      console.log("selected Answer and correct Answer does NOT match");
      return false;
    }
  });
}


///app.post('/', function())

//Here we are configuring express to use body-parser as middle-ware.
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());

app.post("/numberOfQuestion", urlencodedParser, function(req,res){
  sess = req.session;
  sess.maxCounter = req.body.numQuestions;
  console.log("maxCounter from session"+sess.maxCounter);
console.log("sessionID "+req.sessionID);
console.log("sessionID "+req.sessionID);
console.log("sessionID "+req.sessionID);
console.log("sessionID "+req.sessionID);


  res.render('indexCreate', {count: sess.counterQ});
  console.log("count initiaing.... "+sess.counterQ);

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
    console.log('maxCounter.txt file has been saved!');
      formSub.formSubmitQuestionPosInfoSql(parseInt(howManyQuestionPassedUntilTheBeginingOfQuiz), parseInt(req.session.maxCounter))
      var questionsNumAfterQuiz = (parseInt(howManyQuestionPassedUntilTheBeginingOfQuiz)+parseInt(req.session.maxCounter));
      console.log("howManyQuestionPassedUntilTheBeginingOfQuiz::::::::::::::::::::::::::::: "+ howManyQuestionPassedUntilTheBeginingOfQuiz);
      console.log("questionsNumAfterQuiz::::::::::::::::::::::::::::: "+ questionsNumAfterQuiz);
      fs.writeFile("questionsCounterSoFar.txt", questionsNumAfterQuiz, (err) => {
        if (err) throw err;
        console.log('questionsCounterSoFar.txt file has been saved!');
  });

    console.log("now pushing all data");
    for (var i = 0; i < req.session.arrQuestionCreate.length; i++) {
      console.log("now pushing data number "+JSON.stringify(req.session.arrQuestionCreate[i]));
      formSub.formSubmitQuestionSql(req.session.arrQuestionCreate[i]);
    }
      res.render('doneFormCreation');
  }else{
  console.error("number of questions is less than acceptable");
  }
});


app.post("/submitAnswer", urlencodedParser, function(req, res){
  var questions = req.body
  console.log("request body: " + JSON.stringify(questions) );

    for (var question in questions){
    console.log("questionID = " + question);

    console.log("User Answer = " + questions[question] % 4)

    console.log("The q and a is: "+isCorrectAnswer(questions[question] % 4,question));
}
//  console.log(req.params.number_question);
  //console.log(JSON.stringify(req.params.number_question));
  //console.log("not! "+req.body.options);
});



app.listen(3000);

console.log("localhost:3000");
