$(document).ready(function () {
    $("#AddButton").click(function (e) {
        e.preventDefault();
        $.ajax({
            url: "http://localhost:5245/api/Customer",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify({
                Id: 0,
                Name: $("#Name").val(),
                Address: $("#Address").val(),
            }),
            success: function (result) {

                var str = `<tr>
                               <td>${result["id"]}</td>
                               <td>${result["name"]}</td>
                               <td>${result["address"]}</td>
                           </tr>`;
                $("table tbody").append(str);
                $("#resultDiv").show();
            },
            error: function (xhr) {
                console.log(xhr);
            },
        });
    });
});