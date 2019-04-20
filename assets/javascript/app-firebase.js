
// <script src="https://www.gstatic.com/firebasejs/5.10.0/firebase.js"></script> ---------> will go in the htm
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCzaNmYb94HQPR70d6Omy5kP1d0kw5NLkc",
    authDomain: "eventtraveler-69f59.firebaseapp.com",
    databaseURL: "https://eventtraveler-69f59.firebaseio.com",
    projectId: "eventtraveler-69f59",
    storageBucket: "eventtraveler-69f59.appspot.com",
    messagingSenderId: "73086206077"
  };
  firebase.initializeApp(config);

var database = firebase.database();

$("#submit-btn").on("click", function(event) {
  event.preventDefault();


  // for event search
  var searchevent = $("searchevent-input").val().trim();
  var searcheventlocation = $("eventlocation-input").val().trim();
  var eventindate = moment($("eventindate-input").val().trim(), "MM/DD/YYYY").format("X");
  var eventoutdate = moment($("eventoutdate-input").val().trim(), "MM/DD/YYYY").format("X");

  // for hotel search
  var searchotel = $("searchotel-input").val().trim();
  var searchotelocation = $("hotellocation-input").val().trim();
  var hotelindate = moment($("hoteltindate-input").val().trim(), "MM/DD/YYYY").format("X");
  var hoteloutdate = moment($("hoteloutdate-input").val().trim(), "MM/DD/YYYY").format("X");


  

  var eventtitle;
  var eventimage;
  var eventdate;
  var eventstarttime;
  var eventaddress;
  var eventticket;

  // Creates local "temporary" object for holding employee data
  database.ref().set({
    name: empName,
    role: empRole,
    start: empStart,
    rate: empRate
  });



moment().format('LT');   // 12:41 PM





































