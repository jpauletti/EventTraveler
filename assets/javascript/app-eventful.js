jQuery.ajaxPrefilter(function(options) {
  if (options.crossDomain && jQuery.support.cors) {
    options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
  }
});

function displayEvent() {
  $("#events-results").empty();

  var where = $("#location-input")
    .val()
    .trim();
  //var what = $("#event-input")
  //.val()
  //.trim();
  var start = moment($("#start-date-input").val()).format("YYYYMMDD00");
  var end = moment($("#end-date-input").val()).format("YYYYMMDD00");

  // search for button name in omdb and show info underneath
  var queryURL =
    "https://api.eventful.com/json/events/search?" +
    "app_key=n69CWBNZRrGZqdMs" +
    "&l=" +
    where +
    "&t=" +
    start +
    "-" +
    end;

  console.log(queryURL);

  // https://api.eventful.com/json/events/search?app_key=n69CWBNZRrGZqdMs&l=dallas,%20TX&q=music
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var schema = JSON.parse(response);
    console.log(schema.events);
    for (var i = 0; i < schema.events.event.length; i++) {
      //$("#event-results").append("<div>")
      //$("<div>").addID("event" + i)
      total = parseFloat(i) + 1;

      //create elements for html
      var eventTitle = $("<h5>").text(schema.events.event[i].title);
      var eventAddress = $("<p>").text(
        schema.events.event[i].venue_address +
          ", " +
          schema.events.event[i].city_name +
          ", " +
          schema.events.event[i].postal_code
      );
      var eventLink = $("<a>")
        .attr("href", schema.events.event[i].url)
        .text("see event");

      // img container
      if (schema.events.event[i].image !== null) {
        var eventimage = schema.events.event[i].image.medium.url;
        if (eventimage.includes("http")) {
          var neweventImage = $("<div>")
            .addClass("card-image")
            .append("<img src='" + eventimage + "'/>");
        } else {
          var neweventImage = $("<div>")
            .addClass("card-image")
            .append("<img src='https:" + eventimage + "'/>");
        }}else{};

      // start time
      var begins = schema.events.event[i].start_time;
      var days = schema.events.event[i].all_day;
      if (begins.includes("00:00:00")) {
        var startTime = $("<p>").text("days: " + days);
      } else {
        var startTime = $("<p>").text(begins);
      }

      //build container
      var eventContent = $("<div>")
        .addClass("card-content")
        .append(eventTitle, eventAddress, startTime);
      var eventAction = $("<div>")
        .addClass("card-action")
        .append(eventLink);

      // content container
      var eventContentContainer = $("<div>")
        .addClass("card-stacked")
        .append(eventContent, eventAction);

      // make parent div for this event

      var newEventDiv = $("<div>")
        .append(neweventImage, eventContentContainer)
        .addClass("card horizontal");

      // add this event's div to the event container
      $("#events-results").append(newEventDiv);
    }
  });
}

$("#add-event").on("click", function(search) {
  search.preventDefault();
  displayEvent();
});
