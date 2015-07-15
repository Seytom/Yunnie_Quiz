# Yunnie_Quiz
JavaScript - JQuery program presenting quiz on Bubble Tea, with log in and authentication
The initial HTML and CSS are very basic.
The quiz uses JQuery for effects, and the idea is to use the quiz in training new employees.
User registration and authentication is in place, although in the initial setup, this is done through localStorage (and a very little extra bit through cookies), so is entirely client-side.
Features:
-Use JQuery to fade in and out questions
-Questions are mulitple choice
-User must register initially, then an alternate view allows simple login
-A user is not allowed to see or start the quiz unless registered/logged in
-A user is not allowed to move forward in the quiz unless an answer is chosen
-Buttons allow users to navigate forward and backward through the quiz, changing previous answers if they like
-When a question is loaded, the previous answer by the User is pre-selected, but may be changed
-Upon completion of the quiz, the final score is shown, with some small JQuery effects for emphasis
