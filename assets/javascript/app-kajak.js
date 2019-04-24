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
    console.log(checkin, checkout);
    var citycode = "";

    // clear inputs
    $city.val("");
    $checkInDate.val("");
    $checkOutDate.val("");

    // show message that results are being generated - so user knows button did submit
    if ($(".please-wait").length === 0) {
        var pleaseWait = $("<p>").text("Searching for results...").addClass("please-wait");
        $(document.body).append(pleaseWait);
        pleaseWait.insertAfter($submit);
    }


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
            url: "https://apidojo-kayak-v1.p.rapidapi.com/hotels/create-session?rooms=1&citycode=" + citycode + "&checkin=" + checkin + "&checkout=" + checkout + "&adults=1",
            method: "GET",
            headers: {
                "X-RapidAPI-Host": "apidojo-kayak-v1.p.rapidapi.com",
                "X-RapidAPI-Key": "811b0b509bmshf44ab7ab1214e55p19e182jsnc61a98a0c578"
            }
        }).then(function (response) {
            console.log("kajak success");
            console.log(response);
            console.log(response.hotelset);

            // reference for hotel list
            var hotelListMain = response.hotelset;
            var hotelList = response.hotelset;
            // only keep 10 results
            if (hotelList.length > 10) {
                hotelList.length = 10;
            }

            console.log(hotelList);

            // if no results
            if (hotelList.length === 0) {
                console.log("no results");
                var newP = $("<p>").text("No results.");
                $hotelsContainer.append(newP);
            }

            // go through each hotel and show on page
            $.each(hotelList, function (i, value) {
                console.log("hotel " + i)

                // get relevent info
                var hotelName = response.hotelset[i].brand;
                var hotelAddress = response.hotelset[i].displayaddress;
                var hotelRating = response.hotelset[i].ratinglabel;
                var hotelStarCount = response.hotelset[i].stars;
                var hotelThumbnail = "https://kayak.com" + response.hotelset[i].thumburl;

                // if cheapest provider object is included
                if (response.hotelset[i].cheapestProvider !== undefined) {
                    var cheapestProviderName = response.hotelset[i].cheapestProvider.name;
                    var bestPrice = response.hotelset[i].cheapestProvider.displaybaseprice;
                    var linkToHotel = "https://kayak.com" + response.hotelset[i].cheapestProvider.url;
                } else {
                    var cheapestProviderName = response.hotelset[i].brand;
                    var bestPrice = response.hotelset[i].price;
                    var linkToHotel = "https://kayak.com" + response.hotelset[i].shareURL; 
                }

                //create elements for html
                var newTitle = $("<h5>").text(hotelName + " (via " + cheapestProviderName + ")");
                var newAddress = $("<p>").text(hotelAddress);
                var newPrice = $("<p>").text(bestPrice);
                var newRating = $("<p>").text(hotelRating + ", " + hotelStarCount + " stars");
                var newImage = $("<img>").attr("src", hotelThumbnail);
                var newLink = $("<a>").attr("href", linkToHotel).text("see hotel");

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

                // remove wait message
                pleaseWait.remove();

            });


        });


    });


});

