$(document).ready(function () {
    $("#GetButton").click(function (e) {
        $(".table tbody").html(""); // Clear the table body

        $.ajax({
            url: "http://localhost:5245/api/Customer/" + $("#Id").val(),
            type: "get",
            contentType: "application/json",
            success: function (result, status, xhr) {
                $("#resultDiv").show();
                if (typeof result !== "undefined") {
                   var str = `<tr>
                               <td>${result["id"]}</td>
                               <td>${result["name"]}</td>
                               <td>${result["address"]}</td>
                           </tr>`;
                $("table tbody").append(str);
                } else {
                    $("table tbody").append('<td colspan="4">No Customer</td>');
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            },
        });
    });
});