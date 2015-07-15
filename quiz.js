
var allJSONQuestions = {};

//This function loads the quiz questions and answers from an external JSON file
$.getJSON('quiz.json', function(data){
    allJSONQuestions = data;
});

if(!localStorage.allUsers){
    allUsers = [];
}
else{
    allUsers = JSON.parse(localStorage.allUsers);
}

var counter = 0;
var score= 0;

//This function takes a single argument, the id of the button that is pressed, fades out the old question, then loads and fades in a new question with 4 choices, and updates the heading to reflect the question number.
function   load_question(pressed_button){

    //This part of the function fades out the answered question, loads a new question, then fades it in. The loading and fade in are done as a callback function to make sure the fadeout animation finishes before other actions start
    $('#questions_div').fadeOut('slow', function(){
        //Load the question and answers, update the questionNumber heading
        $('#questionNumber').text(counter+1);

        $('input[name=a]:checked').prop('checked', false); //uncheck any previously selected radio button
        //If the question has been visited previously, mark the most recently made selection
        if(allJSONQuestions['questions'][counter]['selected_answer']){
            $("input[value="+allJSONQuestions['questions'][counter]['selected_answer']+"]").prop('checked', true);
            if($('input[name=a]:checked').val()==allJSONQuestions['questions'][counter]['correct_answer']& pressed_button == "previous") {
                score--;//correct score to reflect that question is being revisited
            };
        };

        //Should refactor--it works, but is very wet
        $('#question').text(allJSONQuestions['questions'][counter]['question']);
        $('#answer_a').text(allJSONQuestions['questions'][counter]['answers'][0]);
        $('#answer_b').text(allJSONQuestions['questions'][counter]['answers'][1]);
        $('#answer_c').text(allJSONQuestions['questions'][counter]['answers'][2]);
        $('#answer_d').text(allJSONQuestions['questions'][counter]['answers'][3]);

        $('#questions_div').fadeIn(1000);
    });
}

// This function stores a name/value pair as a cookie, using
// encodeURIComponent() to escape semicolons, commas, and spaces.
// If daysToLive is a number, sets the max-age attribute so that the cookie
// expires after the specified number of days.
function setCookie(name, value, daysToLive) {
    var cookie = name + "=" + encodeURIComponent(value);
    if (typeof daysToLive === "number")
        cookie += "; max-age=" + (daysToLive*60*60*24);
    document.cookie = cookie;
}

// This function returns the document's cookies as an object of name/value pairs.
// Uses decodeURIComponent(), since setCookie uses encodeURIComponent.
function getCookies() {
    var cookies = {}; // The object to be returned
    var all = document.cookie; // Get all cookies from document
    if (all === "") // If the property is the empty string
        return cookies; // return an empty object
    var list = all.split("; "); // Split into individual name=value pairs
    for(var i = 0; i < list.length; i++) { // For each cookie
        var cookie = list[i];
        var p = cookie.indexOf("="); // Find the first = sign
        var name = cookie.substring(0,p); // Get cookie name
        var value = cookie.substring(p+1); // Get cookie value
        value = decodeURIComponent(value); // Decode the value
        cookies[name] = value; // Store name and value in object
    }
    return cookies;
}

function welcomeCookie() {

    if(document.cookie){
        console.log("document.cookie: "+document.cookie);
        var allCookies = getCookies();
        $('#message').html('Welcome back, ' + allCookies.user_id+ '. <br> Please verify your User ID and password.').show();

    }
}

$(document).ready(function(){

    $('#questions_div').hide();
    $('#buttons_div').hide();
    $('#registration_div').hide();
    $('#message').hide();

    welcomeCookie();

    //This section is for registration and authentication of users
    //Registration allows for people to register with the site, saving their information to localStorage
    $('#registration').on('click', function (){

        var test_id = $('#reg_userID').val();
        console.log('password: ' + $('#password').val() + 'email: ' + $('#email'));
        if(!test_id || !$('#reg_password').val() || !$('#reg_address').val()){
            alert("You must enter a valid email, UserID, and Password to login. Kangaroo");
            return;
        };
        //Assure that userid is unique
        for(var i=0;i<allUsers.length;i++){
            if(test_id==allUsers[i].user_id){ //only user_id need be unique
                alert("Sorry, that User ID is already taken. Please try another");
                return;
            }
        }

        var newUser = {user_id:$('#reg_userID').val(), email:$('#reg_address').val(), password:$('#reg_password').val()};

        allUsers.push(newUser);
        localStorage.allUsers = JSON.stringify(allUsers);

        $('#buttons_div').show();
        $('#registration_div').hide();
        $('#previous').hide();
        $('#message').text("Registration successful!").show();
        setCookie("user_id", test_id, 30);
    });

    //Login authenticates user information
    $('#login').on('click', function (){
        var test_id = $('#login_userID').val();
        var test_pass = $('#login_password').val();
        if(!$('#login_userID').val() || !$('#login_password').val() ){
            alert("You must enter a valid UserID and Password to login");
        };

        for(var i=0;i<allUsers.length;i++){
            if(test_id==allUsers[i].user_id){
                if(test_pass==allUsers[i].password){
                    $('#buttons_div').show();
                    $('#login_div').hide();
                    $('#previous').hide();
                    $('#message').text("Log in successful!");
                    $('#message').show();
                    setCookie("user_id", test_id, 30);
                    return;
                }
                else{
                    alert('Password does not match user ID.');
                    return;
                }
            }
        }
        alert("User ID not recognized. Please retry or follow the link to register");
    });

    //This function links users between the login and registration views
    $('.a_links').on('click', function(){
        if(this.id=="registration_link") {
            $('#registration_div').show();
            $('#login_div').hide();
            $('#message').hide();  //Takes care of message from cookie, if any
        }
        else  {
            $('#registration_div').hide();
            $('#login_div').show();
            welcomeCookie();
        }
    });

    //This function handles clicks on the 'next' button
    $('#next').on('click', function (){
            //These conditionals evaluate the answer to the existing question and increases the score if the correct answer is given.
            //First determine if quiz has started
            if($('#next').text() =='Start Quiz'){
                $('#next').text("Next Question");
                console.log($('#questions_div'));
                $('#previous').fadeIn(200);
                $('#questions_div').fadeIn(100);
                $('#message').hide();
                return;
            }
            // if quiz has started, validate that an answer has been chosen
            if(!$('input[name=a]:checked').length & $('#next').text() =='Next Question'){
                alert('You must first select an answer');
                return;
            }
            //store the answer:
            allJSONQuestions['questions'][counter]['selected_answer']=$('input[name=a]:checked').val();
            //If the answer is correct, increase the score
            if($('input[name=a]:checked').val()==allJSONQuestions['questions'][counter]['correct_answer']){
                score++;
            }

            counter++; // Moving to next question, so counter needs to be increased
            //if all questions have been asked, reveal final score
            if(counter>=allJSONQuestions['questions'].length){
                $('#questions_div, #buttons_div').css('display', 'none');
                $('#score_div').fadeIn(200).fadeOut(200).fadeIn(100).fadeOut(100).fadeIn();
                $('#final_score').text(score +' / '+ counter);
                $('#score_div').animate({"font-size":"+=50"},{queue:false, duration:2500});
                $('#container').animate({"border-width":"+=50", width:"-=50", top:"-=100"},{duration:3000});
                return;
            }
            //And finally, load the next question
            load_question("next");
    });

    //This function handles clicks on the "previous" button
    $('#previous').on('click', function(){
        if(counter<=0){
            alert("You are at the first question for the quiz; there are no previous questions");
            return; //Make sure we don't try to load a non-existent question
        };
        counter--; // Moving to the previous question, so counter needs to be decreased

        load_question("previous");
    });
});

/**
 * Created by Tom Seymour on 6/28/15.
 */
