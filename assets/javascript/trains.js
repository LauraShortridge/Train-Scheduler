// Initialize Firebase

var config = {
  apiKey: "AIzaSyAUjBzJFolXiHazvvVVP3Uigm86lQtyxcU",
  authDomain: "train-schedule-b1c98.firebaseapp.com",
  databaseURL: "https://train-schedule-b1c98.firebaseio.com",
  projectId: "train-schedule-b1c98",
  storageBucket: "train-schedule-b1c98.appspot.com",
  messagingSenderId: "670580002459"
};

firebase.initializeApp(config);

var database = firebase.database();

let trainName = "";
let destination = "";
let firstTime = "";
let frequency = "";
let minutesToTrain = "";
let nextTrain = "";

$("#submitButton").on("click", function (event) {

  // Don't refresh the page!
  event.preventDefault();

  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTime = $("#firstTime").val().trim();
  frequency = $("#frequency").val().trim();

  let currentTime = moment();
  console.log("current time: " + moment(currentTime).format("HH:mm"));

  // First Time (pushed back 1 year to make sure it comes before current time)
  let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  let remainder = diffTime % frequency;
  console.log("REMAINDER: " + remainder);

  let minutesToTrain = frequency - remainder;
  console.log("MINUTES TO TRAIN: " + minutesToTrain);

  let nextTrain = moment().add(minutesToTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

  console.log(nextTrain, "next train"); 

  let nextTrainTime = nextTrain - 0; 
  console.log(nextTrainTime, "next train time"); 

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency,
    minutesToTrain: minutesToTrain, 
    nextTrainTime: nextTrainTime, 
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  $("#clear")[0].reset();

});


// Firebase watcher

database.ref().orderByChild("dateAdded").limitToLast(5).on("child_added", function (childSnapshot) {

  // Log everything that's coming out of snapshot
  console.log(childSnapshot.val().trainName);
  console.log(childSnapshot.val().destination);
  console.log(childSnapshot.val().firstTime);
  console.log(childSnapshot.val().frequency);
  console.log(childSnapshot.val().minutesToTrain);
  console.log(childSnapshot.val().nextTrainTime);

  let addTrainRow = $("#addRow");

  let finalnextTrainTime = moment(childSnapshot.val().nextTrainTime).format("HH:mm"); 

  let trainData = "<tr>";
  trainData += "<td>" + childSnapshot.val().trainName + "</td>";
  trainData += "<td>" + childSnapshot.val().destination + "</td>";
  trainData += "<td>" + childSnapshot.val().frequency + "</td>";
  trainData += "<td>" + finalnextTrainTime + "</td>";
  trainData += "<td>" + childSnapshot.val().minutesToTrain + "</td>";
  trainData += "<td></td>";
  trainData += "</tr>";

  addTrainRow.append(trainData);

}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});


