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

// slider functionality
$(document).ready(function () {
    $('.slider').slider({ full_width: true });
});


var $hotelsContainer = $("#hotel-results");
var $eventsContainer = $("#events-results");

// input fields
var $city = $("#location-input");
var $checkInDate = $("#start-date-input");
var $checkOutDate = $("#end-date-input");
var $submit = $("#add-event");

// make global variable so functions can access
var city = "";
var checkin = "";
var checkout = "";
var pleaseWait = "";


// CORS un-blocker for eventful API
jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
    }
});

function getHotels() {
    // find location code
    $.ajax({
        url:
            "https://apidojo-kayak-v1.p.rapidapi.com/locations/search?where=" + city,
        method: "GET",
        headers: {
            "X-RapidAPI-Host": "apidojo-kayak-v1.p.rapidapi.com",
            "X-RapidAPI-Key": "e5eec4b95fmshe2d8dd40775feafp178082jsnb4a20cea3e50"
        }
    }).then(function (response) {

        // make sure it's a city (response returns city and airport codes)
        $.each(response, function (i, value) {
            if (response[i].loctype === "city") {
                citycode = response[i].ctid;
                return false;
            }
        });

        // now that we have the location code, we can use it to find hotels
        $.ajax({
            url:
                "https://apidojo-kayak-v1.p.rapidapi.com/hotels/create-session?rooms=1&citycode=" +
                citycode +
                "&checkin=" +
                checkin +
                "&checkout=" +
                checkout +
                "&adults=1",
            method: "GET",
            headers: {
                "X-RapidAPI-Host": "apidojo-kayak-v1.p.rapidapi.com",
                "X-RapidAPI-Key": "e5eec4b95fmshe2d8dd40775feafp178082jsnb4a20cea3e50"
            }
        }).then(function (response) {
            console.log("kajak returned");

            // reference for hotel list
            var hotelListMain = response.hotelset;
            var hotelList = response.hotelset;
            // only keep 10 results
            if (hotelList.length > 10) {
                hotelList.length = 10;
            }


            // if no results
            if (hotelList.length === 0) {
                var newP = $("<p>").text("No results.");
                $hotelsContainer.append(newP);

                // remove wait message
                pleaseWait.remove();
            }

            // go through each hotel and show on page
            $.each(hotelList, function (i, value) {

                // get relevent info
                if (response.hotelset[i].brand !== undefined) {
                    var hotelName = response.hotelset[i].brand;
                } else {
                    var hotelName = response.hotelset[i].name;
                }
                var hotelAddress = response.hotelset[i].displayaddress;
                var hotelRating = response.hotelset[i].ratinglabel;
                var hotelStarCount = response.hotelset[i].stars;
                var hotelThumbnail =
                    "https://kayak.com" + response.hotelset[i].thumburl;

                // if cheapest provider object is included
                if (response.hotelset[i].cheapestProvider !== undefined) {
                    var cheapestProviderName = response.hotelset[i].cheapestProvider.name;
                    var bestPrice =
                        response.hotelset[i].cheapestProvider.displaybaseprice;
                    var linkToHotel =
                        "https://kayak.com" + response.hotelset[i].cheapestProvider.url;
                } else {
                    var cheapestProviderName = response.hotelset[i].brand;
                    var bestPrice = response.hotelset[i].price;
                    var linkToHotel = "https://kayak.com" + response.hotelset[i].shareURL;
                }

                //create elements for html
                if (hotelName === cheapestProviderName) {
                    var newTitle = $("<h5>").text(
                        hotelName
                    );
                } else {
                    var newTitle = $("<h5>").text(
                        hotelName + " (via " + cheapestProviderName + ")"
                    );
                }
                
                var newAddress = $("<p>").text(hotelAddress);
                var newPrice = $("<p>").text(bestPrice);
                var newRating = $("<p>").text(
                    hotelRating + ", " + hotelStarCount + " stars"
                );
                var newImage = $("<img>").attr("src", hotelThumbnail);
                var newLink = $("<a>")
                    .attr("href", linkToHotel)
                    .text("see hotel");

                // img container
                var imgContainer = $("<div>")
                    .addClass("card-image")
                    .append(newImage);

                var content = $("<div>")
                    .addClass("card-content")
                    .append(newTitle, newAddress, newPrice, newRating);
                var action = $("<div>")
                    .addClass("card-action")
                    .append(newLink);

                // content container
                var allContentContainer = $("<div>")
                    .addClass("card-stacked")
                    .append(content, action);

                // make parent div for this hotel
                var newHotelDiv = $("<div>")
                    .append(imgContainer, allContentContainer)
                    .addClass("card horizontal");

                // add this hotel's div to the hotel container
                $hotelsContainer.append(newHotelDiv);

                // remove wait message
                pleaseWait.remove();

            });
        });
    });
}


function displayEvent() {
    $("#events-results").empty();

    var where = $("#location-input")
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
        "&t=" +
        start +
        "-" +
        end;


    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var schema = JSON.parse(response);

        for (var i = 0; i < schema.events.event.length; i++) {
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
                }
            }

            // start time
            var begins = schema.events.event[i].start_time;
            var days = schema.events.event[i].all_day;
            if (begins.includes("00:00:00")) {
                var date = begins.slice(0, 10);
                var startTime = $("<p>").text("Starts on " + date + ". Happening for " + days + " days");
            } else {
                var date = begins.slice(0, 16);
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

    })
}




// pull in recent searches
database.ref().limitToLast(5).on("value", snapshot => {
    let keys = Object.keys(snapshot.val())

    let recentSearchesDiv = $('#recentSearches');
    recentSearchesDiv.empty();

    for (let i = 0; i < keys.length; i++) {
        let val = snapshot.val()[keys[i]]
        let city = val.city
        let checkin = val.checkin
        let checkout = val.checkout

        let search = $(`<div><a href="#" class="recent"><span style="font-weight:bold">City:</span> <span style="font-weight:bold">${city}</span> Check-in: <span>${checkin}</span> Check-out: <span>${checkout}</span></a></div>`);
        search.addClass('recentSearch')
        search.on('click', function () {

        })

        recentSearchesDiv.prepend(search)
    }
});



// when clicked, search it again
$(document).on("click", ".recentSearch", function (event) {

    event.preventDefault();

    // clear out current results
    $hotelsContainer.empty();
    $eventsContainer.empty();

    // pull data to run it
    city = $(this).children().children()[1].innerHTML;
    checkin = $(this).children().children()[2].innerHTML;
    checkout = $(this).children().children()[3].innerHTML;
    var citycode = "";

    // show message that results are being generated - so user knows button did submit
    if ($(".please-wait").length === 0) {
        pleaseWait = $("<p>").text("Searching for results...").addClass("please-wait");
        $(document.body).append(pleaseWait);
        pleaseWait.insertAfter($submit);
    }

    // get hotel results and display them
    getHotels();

    // get event results and display them
    displayEvent();

})






$submit.on("click", function (event) {
    event.preventDefault();

    // save their inputted data
    city = $city.val().trim();
    checkin = $checkInDate.val();
    checkout = $checkOutDate.val();
    var citycode = "";

    // if user filled out all fields
    if (city !== "" && checkin !== "" && checkout !== "") {

        // clear out current results
        $hotelsContainer.empty();
        $eventsContainer.empty();

        // show message that results are being generated - so user knows button did submit
        if ($(".please-wait").length === 0) {
            pleaseWait = $("<p>").text("Searching for results...").addClass("please-wait");
            $(document.body).append(pleaseWait);
            pleaseWait.insertAfter($submit);
        }

        // get hotel results and display them
        getHotels();

        // get event results and display them
        displayEvent();

        // construct object literal for firebase
        let travelEvent = {
            city,
            checkin,
            checkout
        };

        // add event to firebase
        database.ref().push(travelEvent)

        // clear inputs
        $city.val("");
        $checkInDate.val("");
        $checkOutDate.val("");
    } else {
        // show error message
        if ($(".required-error").length === 0) {
            var required = $("<p>").text("* All fields are required").addClass("required-error");
            $("#event-form").prepend(required);
        }
    }

});