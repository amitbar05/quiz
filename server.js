var express        =        require("express");
var bodyParser     =        require("body-parser");
var fs = require("fs");
//var less = require('less');
var app            =        express();
var formSub = require("./formSubmition.js");
var showSql = require("./select.js");

var counterQ = 1;
//i created the quiz counter for being ablet to save quizes and being able to answer them
var quizCounter = 0;
var maxCounter;
var arrQuestionCreate = [];
maxCounter = fs.readFileSync('maxCounter.txt', 'utf8', function(err, date){
  if(err){
    console.log("is the error here in maxcounter.txt");
    maxCounter=2;
  }
});
console.log("after reading some boring books the counterQ is:"+ maxCounter);



app.set('view engine', 'ejs');
app.use(express.static(__dirname));

var inTheMiddleOfTest;
var arrQuestionCreate;
app.get('/create',function(req,res){
  // app.use(express.static(__dirname));
  counterQ = 1;
  maxCounter = 1;
  arrQuestionCreate = [];
  inTheMiddleOfTest = true;
  res.render('setNumberOfQuestions');
});

app.get('/max', function(req, res){
  res.send("max counterQ: "+ maxCounter);
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
  // app.use(express.static(__dirname));
  showSql.getFormByNumForms(req.params.number, function callback(wantedQuiz){
    console.log(wantedQuiz);
    console.log("the wininingignignigngingin number issssssisisissi -----"+req.params.number);
    console.log("the wininingignignigngingin questioPASSSED issssssisisissi -----"+wantedQuiz[0].question_passed);
    console.log("the wininingignignigngingin sizeszoiziszsizszisziSIZE issssssisisissi -----"+wantedQuiz[0].size);
    var question_passed = wantedQuiz[0].question_passed;
    var size = wantedQuiz[0].size;
      showSql.showSpecificFormByDistanceAndSize(question_passed,size,function callback(dataSql){
          res.render('answer', {dataSql: dataSql, max: size});
      });
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
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/numberOfQuestion", urlencodedParser, function(req,res){
  maxCounter = req.body.numQuestions;



  console.log("maxCounter: " + maxCounter);
  res.render('indexCreate', {count: counterQ});
  console.log("count initiaing.... "+counterQ);

});


app.post("/submitQuestion", urlencodedParser,function (req, res) {


  console.log("count~~!: "+counterQ);
  console.log("Maxcount~~!: "+maxCounter);
  if(counterQ < maxCounter){
      arrQuestionCreate.push(req.body);
      counterQ++;
      res.render('indexCreate', {count: counterQ});

  }else if(counterQ == maxCounter){
    console.log("equility is importent");

    arrQuestionCreate.push(req.body);
    howManyQuestionPassedUntilTheBeginingOfQuiz  = fs.readFileSync("questionsCounterSoFar.txt");
    console.log('maxCounter.txt file has been saved!');
      formSub.formSubmitQuestionPosInfoSql(parseInt(howManyQuestionPassedUntilTheBeginingOfQuiz), parseInt(maxCounter))
      var questionsNumAfterQuiz = (parseInt(howManyQuestionPassedUntilTheBeginingOfQuiz)+parseInt(maxCounter));
      console.log("howManyQuestionPassedUntilTheBeginingOfQuiz::::::::::::::::::::::::::::: "+ howManyQuestionPassedUntilTheBeginingOfQuiz);
      console.log("questionsNumAfterQuiz::::::::::::::::::::::::::::: "+ questionsNumAfterQuiz);
      fs.writeFile("questionsCounterSoFar.txt", questionsNumAfterQuiz, (err) => {
        if (err) throw err;
        console.log('questionsCounterSoFar.txt file has been saved!');
  });

    console.log("now pushing all data");
    for (var i = 0; i < arrQuestionCreate.length; i++) {
      console.log("now pushing data number "+JSON.stringify(arrQuestionCreate[i]));
      formSub.formSubmitQuestionSql(arrQuestionCreate[i]);
    }
      res.render('doneFormCreation');
  }else{
  console.error("number of questions is less than acceptable");
  }
});


app.post("/submitAnswer:number_question", urlencodedParser, function(req, res){
  console.log(req.params.number_question);
  console.log(JSON.stringify(req.params.number_question));
  console.log("not! "+req.body.options);
  console.log("this is question is: "+isCorrectAnswer(req.body.options,req.params.number_question));
});



app.listen(3000);

console.log("localhost:3000");
