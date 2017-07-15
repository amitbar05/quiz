


  (function() {
    $(document).ready(function () {

      var flag1=false, flag2=($(".options").length) ? false : true;

//this can be deleted after no more default value, all input are empty
      var empty = false;
      $(".requiredField").each(function() {
          if ($.trim($(this).val()) == '') {
              empty = true;
          }
      });

      if (empty) {
  //      console.log("empty input");
        $('#register').attr('disabled', 'disabled');
      }else{
    //    console.log("filled input");
      flag1 = true;
      if(flag1 && flag2)
        $('#register').removeAttr('disabled');
      }
//delete until here


      $(".requiredField").keyup(function(){

        var empty = false;
        $(".requiredField").each(function() {
            if ($.trim($(this).val()) == '') {
                empty = true;
            }
        });

        if (empty) {
  //        console.log("empty input");
        flag1=false;
          $('#register').attr('disabled', 'disabled');
        }else{
          flag1 = true;
          if(flag1 && flag2)
          $('#register').removeAttr('disabled');
        }
    });











    $(".options").change(function(){
      var totalQuestions = $('.options').length;
    var totalAnswers = $('.options').find(':radio:checked').length;

      if (totalQuestions != totalAnswers) {
        $('#register').attr('disabled', 'disabled');
      }else{
        flag2 = true;
          if(flag1 && flag2)
        $('#register').removeAttr('disabled');
      }

  });

});

})()
