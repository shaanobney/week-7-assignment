
$(document).on('ready', function() {

$('.materialboxed').materialbox();
//INIT FIREBASE
  var trainBase = {
    apiKey: "AIzaSyAst4PVpzpcaEFZcoRuBy-fEkjXZtoirDo",
    authDomain: "trainbase-69a0c.firebaseapp.com",
    databaseURL: "https://trainbase-69a0c.firebaseio.com",
    storageBucket: "trainbase-69a0c.appspot.com",
  };

  firebase.initializeApp(trainBase);


var trainBase = firebase.database();

//INITIAL VALUES 
var name = '';
var destination = '';
var startDate = '';
var frequency = '';
var whistle = new Audio('trainz.mp3');

$('#button').on('click', function() {

	//NO PUSH WITH EMPTY FIELDS
	if ($('input').val() === "") {
		return false;
	};
	
	//PULL VALUES FROM FIELDS
	name = $('#name').val().trim();
	destination = $('#destination').val().trim();
	arrival = $('#arrival').val().trim();
	frequency = $('#frequency').val().trim();

	//MODAL VALUES
	$('#modal1').openModal({
      dismissible: false, // Modal can be dismissed by clicking outside of the modal
      opacity: .7, // Opacity of modal background
      in_duration: 300, // Transition in duration
      out_duration: 200, // Transition out duration
      starting_top: '4%', // Starting top style attribute
      ending_top: '10%', // Ending top style attribute
    });

	whistle.play().loop=false;

	//GRABBED THIS FROM THE 08-11 TRAIN PREDICTION EXERCISE

	//INITIAL TIME
	var firstTimeConverted = moment(arrival ,"hh:mm").subtract(1, "years");

	//CURRENT
	var currentTime = moment();

	//DIFFERENCE
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

	//TIME APART
	var tRemainder = diffTime % frequency; 

	//MINUTES UNTIL ARRIVAL
	var tMinutesTillTrain = frequency - tRemainder;

	//NEXT TRAIN
	var nextTrain = moment().add(tMinutesTillTrain, "minutes");

	//NEXT ARRIVAL
	var nextArrival = moment(nextTrain).format("hh:mm");

	//PUSH TO FIREBASE
	trainBase.ref().push({
		name: name,
		destination: destination,
		arrival: arrival,
		frequency: frequency,
		minutesAway: tMinutesTillTrain,

	});

	//CLEARS INPUT FIELDS
	$('#name').val('')
	$('#destination').val('')
	$('#arrival').val('')
	$('#frequency').val('')

	return false;

}); 

trainBase.ref().on('child_added', function (childSnapshot, prevChildKey) {

	//APPEND TO TABLE
	$('.table > tbody').append('<tr><td>' + childSnapshot.val().name + '</td><td>' + childSnapshot.val().destination + '</td><td>' + childSnapshot.val().frequency + '</td><td>' + childSnapshot.val().arrival + '</td><td>' + childSnapshot.val().minutesAway + '</td></tr>');

});

});
	