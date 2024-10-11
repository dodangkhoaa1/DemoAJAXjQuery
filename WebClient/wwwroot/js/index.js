$(document).ready(function () {
    showAllCustomer();

    function showAllCustomer() {
        $(".table tbody").html("");

        $.ajax({
            url: "http://localhost:5245/api/Customer",
            type: "get",
            contentType: "application/json",
            success: function (result) {
                $.each(result, function (index, value) {
                    var appendElement = $("<tr>");
                    appendElement.append($("<td>").html(value["id"]));
                    appendElement.append($("<td>").html(value["name"]));
                    appendElement.append($("<td>").html(value["address"]));
                    appendElement.append($("<td>").html(`<a class="btn btn-warning" href="/Customers/Edit?id=${value["id"]}">Edit</a>`));
                    appendElement.append($("<td>").html(`<button class="delete btn btn-danger">Delete</button>`));
                    $(".table tbody").append(appendElement);
                });
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    }
    $("table").on("click", "button.delete", function () {
        var customerId = $(this).closest("tr").find("td:nth-child(1)").text(); 

        $.ajax({
            url: "http://localhost:5245/api/Customer/" + customerId,
            type: "delete",
            contentType: "application/json",
            success: function () {
                showAllCustomer();
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    });
});