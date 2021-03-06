//
// Designed and Developed By Ayshwarya Balasubramanian
//



var currentObj;
var score = 0;
var qComplete = false;
var qNum = 1;
var total = 0;
$(function() {

    function populateQuestion(q) {
        $.getJSON("questions.json", function(data) {
            var items = [];
            total = data.length;
            $('.progress-bar').attr('aria-valuemax', total);
            $.each(data, function(key, val) {
                if (key == (q - 1)) {
                    $('#question').text(val.question);
                    currentObj = val;
                    $.each(val.answerOptions, function(k, v) {
                        $(".answerOpt").append("<div class='answer' onclick='checkAnswer(this)'>" + v.option + '</div>');
                    });
                } else if (q > data.length) {
                    $('#quizScreen').addClass('displayNone');
                    $('#finalScreen').removeClass('displayNone');
                    $('#finalScore').text("Your Final Score is " + score + "/" + data.length * 100);
                }
            });
        });
    }
    populateQuestion(qNum);
    $('#btnNext').click(function() {
        qNum++;
        qComplete = false;
        $(".answerOpt div").remove();
        $('#ansExp').addClass('displayNone');
        populateQuestion(qNum);
    });
    ! function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0],
            p = /^http:/.test(d.location) ? 'http' : 'https';
        if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id = id;
            js.src = p + "://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js, fjs);
        }
    }(document, "script", "twitter-wjs");

    var $container = $('#container'),
        $checkboxes = $('#filters input');

    $container.isotope({
        itemSelector: '.item'
    });
    // get Isotope instance
    var isotope = $container.data('isotope');
    // add even classes to every other visible item, in current order
    function addEvenClasses() {
        isotope.$filteredAtoms.each(function(i, elem) {
            $(elem)[(i % 2 ? 'addClass' : 'removeClass')]('even')
        });
    }

    $checkboxes.change(function() {
        var filters = [];
        // get checked checkboxes values
        $checkboxes.filter(':checked').each(function() {
            filters.push(this.value);
        });
        // ['.red', '.blue'] -> '.red, .blue'
        filters = filters.join(', ');
        $container.isotope({
            filter: filters
        });
        addEvenClasses();
    });

    $('#shuffle').click(function() {
        $container.isotope('shuffle');
        addEvenClasses();
    });

    $('.red').click(function() {
        $('#landingScreen').addClass('displayNone');
        $('#quizScreen').removeClass('displayNone');
        $('#finalScreen').addClass('displayNone');
    });


});


function checkAnswer(chosenVal) {
    if (!qComplete) {
        if ($(chosenVal).text() == currentObj.answer) {
            $(chosenVal).addClass('divGreen');
            $('.rightWrong').text("The answer is " + currentObj.answer);
            $('#answerExp').text(currentObj.msgCorrect);
            $('#ansExp').removeClass('displayNone');
            score += 100;
            $("#score").text(score);
        } else {
            $(chosenVal).addClass('divRed');
            $('.rightWrong').text("The answer is " + currentObj.answer);
            $('#answerExp').text(currentObj.msgWrong);
            $('#ansExp').removeClass('displayNone');
            if (score != 0) {
                score -= 100;
            }
            $("#score").text(score);
        }
        $('.progress-bar').css('width', qNum * 100 / total + '%').attr('aria-valuenow', qNum);
        qComplete = true;
    }
}
