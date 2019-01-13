$(function () {
    const currentDateContainer = $(".current-date")
    const movieStarDescContainer = $(".description")

    // Pobranie aktualnej daty
    function getCurrentDate() {
        $.ajax({
            url: "http://date.jsontest.com/"
        }).done(function (resp) {
            currentDateContainer.text(resp.date);
        }).fail(function (error) {
            console.log(error);
        });
    }

    getCurrentDate();


    // Pobranie opisu postaci filmowej
    function getMovieStarDescription() {
        $.ajax({
            url: "https://swapi.co/api/people/4/"
        }).done(function (resp) {
            [...Object.entries(resp)].forEach(function (entry) {
                movieStarDescContainer.append("&emsp;&emsp;");
                movieStarDescContainer.append(entry[0] + " - " + entry[1]);
                movieStarDescContainer.append($("<br>"));
            })
        }).fail(function (error) {
            console.log(error);
        });
    }

    getMovieStarDescription();


});
