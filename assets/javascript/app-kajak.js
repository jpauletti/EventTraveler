var apikey = "811b0b509bmshf44ab7ab1214e55p19e182jsnc61a98a0c578";

var $hotelsContainer = $("#hotel-results");

// input fields
var $city = $("#location-input");
var $checkInDate = $("#start-date-input");
var $checkOutDate = $("#end-date-input");
var $submit = $("#add-event");



$submit.on("click", function (event) {
    event.preventDefault();

    // clear out current results
    $hotelsContainer.empty();

    // save their inputted data
    var city = $city.val().trim();
    var checkin = $checkInDate.val();
    var checkout = $checkOutDate.val();
    var citycode = "";

    // clear inputs
    $city.val("");
    $checkInDate.val("");
    $checkOutDate.val("");


    // find location code
    $.ajax({
        url: "https://apidojo-kayak-v1.p.rapidapi.com/locations/search?where=" + city,
        method: "GET",
        headers: {
            "X-RapidAPI-Host": "apidojo-kayak-v1.p.rapidapi.com",
            "X-RapidAPI-Key": "811b0b509bmshf44ab7ab1214e55p19e182jsnc61a98a0c578"
        }
    }).then(function (response) {
        console.log(response);
        console.log(response[0].ctid); // MAKE SURE IT'S A CITY
    
        // make sure it's a city (response returns city and airport codes)
        $.each(response, function (i, value) {
            if (response[i].loctype === "city") {
                console.log("this is a city")
                console.log(i + ", " + value)
                citycode = response[i].ctid;
                console.log(citycode);
                return false;
            }
        });


        // now that we have the location code, we can use it to find hotels
        $.ajax({
            url: "https://apidojo-kayak-v1.p.rapidapi.com/hotels/create-session?rooms=1&citycode=" + citycode + "&checkin=2019-4-22&checkout=2019-4-24&adults=1",
            method: "GET",
            headers: {
                "X-RapidAPI-Host": "apidojo-kayak-v1.p.rapidapi.com",
                "X-RapidAPI-Key": "811b0b509bmshf44ab7ab1214e55p19e182jsnc61a98a0c578"
            }
        }).then(function (response) {
            console.log("kajak success");

            // reference for hotel list
            var hotelList = response.hotelset;

            // go through each hotel and show on page
            $.each(hotelList, function (i, value) {
                console.log("hotel " + i)

                // get relevent info
                var hotelName = response.hotelset[i].brand;
                var cheapestProviderName = response.hotelset[i].cheapestProvider.name;
                var bestPrice = response.hotelset[i].cheapestProvider.displaybaseprice;


                var linkToHotel = "https://kayak.com" + response.hotelset[i].cheapestProvider.url;
                var hotelAddress = response.hotelset[i].displayaddress;
                var hotelPrice = response.hotelset[i].price;
                var hotelRating = response.hotelset[i].ratinglabel;
                var hotelThumbnail = "https://kayak.com" + response.hotelset[i].thumburl;

                //create elements for html
                var newTitle = $("<h5>").text(hotelName + " (via " + cheapestProviderName + ")");
                var newAddress = $("<p>").text(hotelAddress);
                var newPrice = $("<p>").text(bestPrice);
                var newRating = $("<p>").text(hotelRating);
                var newImage = $("<img>").attr("src", hotelThumbnail);
                var newLink = $("<a>").attr("href", linkToHotel).text("click here");

                // img container
                var imgContainer = $("<div>").addClass("card-image").append(newImage);

                var content = $("<div>").addClass("card-content").append(newTitle, newAddress, newPrice, newRating);
                var action = $("<div>").addClass("card-action").append(newLink);

                // content container
                var allContentContainer = $("<div>").addClass("card-stacked").append(content, action);

                // make parent div for this hotel
                // var newHotelDiv = $("<div>").append(newTitle, newAddress, newPrice, newRating, newImage, newLink).addClass("card-horizontal");
                var newHotelDiv = $("<div>").append(imgContainer, allContentContainer).addClass("card horizontal");

                // add this hotel's div to the hotel container
                $hotelsContainer.append(newHotelDiv);

            });

        
        });


    });


});

