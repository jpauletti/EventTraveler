jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
      options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
    }
  });
  
  function displayEvent() {
    $("#display").empty();
  
    var where = $("#location-input")
      .val()
      .trim();
    var what = $("#event-input")
      .val()
      .trim();
    var start = moment($("#start-date-input").val()).format("YYYYMMDD00");
    var end = moment($("#end-date-input").val()).format("YYYYMMDD00");
  
    // search for button name in omdb and show info underneath
    var queryURL =
      "https://api.eventful.com/json/events/search?" +
      "app_key=n69CWBNZRrGZqdMs" +
      "&l=" +
      where +
      "&q=" +
      what +
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
        //$("#display").append("<div>")
        //$("<div>").addID("event" + i)
        total = parseFloat(i) + 1;
  
        $("#display").append("<h1>" + schema.events.event[i].title + "</h1>");
        if (schema.events.event[i].image !== null) {
          var image = schema.events.event[i].image.medium.url;
          if (image.includes("http")) {
            $("#display").append("<img src='" + image + "'/>");
          } else {
            $("#display").append("<img src='https:" + image + "'/>");
          }
        } else {
          $("#display").append(
            "<img src= 'https://www.metrorollerdoors.com.au/wp-content/uploads/2018/02/unavailable-image.jpg' />"
          );
        }
  
        $("#display").append("<a href=" + schema.events.event[i].url + "></a>");
        $("#display").append("<p>" + schema.events.event[i].start_time + "</p>");
        $("#display").append("<p>" + schema.events.event[i].postal_code + "</p>");
      }
    });
  }
  
  $("#add-event").on("click", function(search) {
    search.preventDefault();
    displayEvent();
  });
  