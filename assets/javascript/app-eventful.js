jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
      options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
    }
  });
  
  function displayEvent() {
    $("#events-result").empty();
  
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
        //$("#event-result").append("<div>")
        //$("<div>").addID("event" + i)
        total = parseFloat(i) + 1;
  
        $("#events-result").append("<h1>" + schema.events.event[i].title + "</h1>");
        if (schema.events.event[i].image !== null) {
          var image = schema.events.event[i].image.medium.url;
          if (image.includes("http")) {
            $("#events-result").append("<img src='" + image + "'/>");
          } else {
            $("#events-result").append("<img src='https:" + image + "'/>");
          }
        } else {
          $("#events-result").append(
            "<img style='height: 128' src= 'https://www.metrorollerdoors.com.au/wp-content/uploads/2018/02/unavailable-image.jpg' />"
          );
        }
  
        $("#events-result").append("<a href=" + schema.events.event[i].url + "></a>");
        $("#events-result").append("<p>" + schema.events.event[i].start_time + "</p>");
        $("#events-result").append("<p>" + schema.events.event[i].venue_address + ", " +schema.events.event[i].city_name + ", " + schema.events.event[i].postal_code + "</p>");
      }
    });
  }
  
  $("#add-event").on("click", function(search) {
    search.preventDefault();
    displayEvent();
  });
  