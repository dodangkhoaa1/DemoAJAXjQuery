$(document).ready(function () {
    getCustomer();

    function getCustomer() {
        let params = new URL(document.location).searchParams;
        let customerId = params.get("id");

        $.ajax({
            url: "http://localhost:5245/api/Customer/" + customerId,
            type: "get",
            contentType: "application/json",
            success: function (result, status, xhr) {
                $("#Id").val(result["id"]);
                $("#Name").val(result["name"]);
                $("#Address").val(result["address"]);
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    }

    $("#UpdateButton").click(function (e) {
        e.preventDefault();
        $.ajax({
            url: "http://localhost:5245/api/Customer",
            type: "put",
            data: JSON.stringify({
                Id: $("#Id").val(),
                Name: $("#Name").val(),
                Address: $("#Address").val(),
            }),
            processData: false,
            contentType: "application/json",

            success: function (result, status, xhr) {
                var str = `<tr>
                               <td>${result["id"]}</td>
                               <td>${result["name"]}</td>
                               <td>${result["address"]}</td>
                           </tr>`;
                $("table tbody").append(str);
                $("#resultDiv").show();
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    });
});