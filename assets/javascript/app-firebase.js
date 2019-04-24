
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
    var eventdate = moment($("eventdate-input").val().trim(), "MM/DD/YYYY").format("X");
    var eventtime = moment($("eventtime-input").val().trim(), "h:mm:ss a").format("LT");

  // for hotel search
    var searchotel = $("searchotel-input").val().trim();
    var searchotelocation = $("hotellocation-input").val().trim();
    var hotelindate = moment($("hoteltindate-input").val().trim(), "MM/DD/YYYY").format("X");
    var hoteloutdate = moment($("hoteloutdate-input").val().trim(), "MM/DD/YYYY").format("X");

   
  // Creates local "temporary" object for holding hotel and event data
    var hotelEventSearch = {
      eventsearch: searchevent,
      eventlocation: searcheventlocation,
      eventdate: eventdate,
      eventtime: eventtime,
      hotelsearch: searchotel,
      hotellocation: searchotelocation,
      hotelindate: hotelindate,
      hoteloutdate: hoteloutdate
    };

    database.ref().push(hotelEventSearch);

      $("#searchevent-input").val("");
      $("#eventlocation-input").val("");
      $("#eventdate-input").val("");
      $("#eventtime-inpu").val("");
      $("#searchotel-input").val("");
      $("#hotellocation-inpu").val("");
      $("#hoteltindate-input").val("");
      $("#hoteloutdate-input").val("");


 });

  //var recentPostsRef = firebase.database().ref('posts').limitToLast(100);
  //database snapshots of the hotel and event data
  //database.ref().on("value", function(snapshot){
  database.ref().limitToLast(5).on("child_added", function(childSnapshot) {

    var eventsearch = childSnapshot.val().searchevent;
    var eventlocation =childSnapshot.val().searcheventlocation;
    var eventdate = childSnapshot.val().eventdate;
    var eventtime = childSnapshot.val().eventtime;

    var hotelsearch = childSnapshot.val().searchotel;
    var hotellocation =childSnapshot.val().searchotelocation;
    var hotelindate = childSnapshot.val().hotelindate;
    var hoteloutdate = childSnapshot.val().hoteloutdate;

    var eventdatetPretty   = moment.unix(eventdate).format("MM/DD/YYYY");
    var eventtimePretty    = moment.unix(eventtime).format("h:mm:ss a");
    var hotelindatePretty  = moment.unix(hotelindate).format("MM/DD/YYYY");
    var hoteloutdatePretty = moment.unix(hoteloutdate).format("MM/DD/YYYY");

// Create the new event row
    var newEventRow = $("<tr>").append(
      $("<td>").text(searchevent),
      $("<td>").text(searcheventlocation),
      $("<td>").text(eventdatetPretty),
      $("<td>").text(eventtimePretty),
    );

// Create the new hotel row
    var newHotelRow = $("<tr>").append(
      $("<td>").text(hotelsearch),
      $("<td>").text(hotellocation),
      $("<td>").text(hotelindatePretty),
      $("<td>").text(hoteloutdatePretty),
    );

    // Append the new event and hotel rows to the table
    $("#newEventRow-table > tbody").append(newEventRow);
    $("#newHotelRow-table > tbody").append(newHotelRow);

})

// moment().format('LT');   // 12:41 PM
// var eventtitle;
// var eventimage;
// var eventdate;
// var eventstarttime;
// var eventaddress;
// var eventticket;





























