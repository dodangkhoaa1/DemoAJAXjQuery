# Demo AJAX using jQuery

This project demonstrates how to use AJAX with jQuery in an ASP.NET MVC project to perform CRUD operations for managing customers. Below is a detailed guide to set up the project and an explanation of the key components, including API and web client integration.

## 1. Project Setup

### 1.1 Create Project API

First, create the `Customer` model:

```csharp
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
}
```

Then, create the repository interfaces and implementations:

```csharp
public interface IRepository
{
    IEnumerable<Customer> Customers { get; }
    Customer this[int id] { get; }
    Customer AddCustomer(Customer customer);
    Customer UpdateCustomer(Customer customer);
    void DeleteCustomer(int id);
}
```

```csharp
public class Repository : IRepository
{
    private Dictionary<int, Customer> customers = new();

    public Repository()
    {
        new List<Customer>() {
            new Customer() {
                Id = 1,
                Name = "Khoa",
                Address = "Dong Thap"
            },
            new Customer() {
                Id = 2,
                Name = "Nhat",
                Address = "Soc Trang"
            },
            new Customer() {
                Id = 3,
                Name = "Thanh",
                Address = "Can Tho"
            },
            new Customer() {
                Id = 4,
                Name = "Nhu",
                Address = "Vinh Long"
            },
            new Customer() {
                Id = 5,
                Name = "Nhut",
                Address = "Vinh Long"
            },

        }.ForEach(c => AddCustomer(c));
    }
    public Customer this[int id] => customers.ContainsKey(id) ? customers[id] : null;

    public IEnumerable<Customer> Customers => customers.Values;

    public Customer AddCustomer(Customer customer)
    {
        if(customer.Id == 0)
        {
            int key = customers.Count;
            while (customers.ContainsKey(++key));
            customer.Id = key;
        }
        customers[customer.Id] = customer;
        return customer;
    }

    public void DeleteCustomer(int id) => customers.Remove(id);

    public Customer UpdateCustomer(Customer customer) => AddCustomer(customer);
}
```

Configure services in `Program.cs`:

```csharp
builder.Services.AddSingleton<IRepository, Repository>();
builder.Services.AddCors();
```

Use the service:

```csharp
app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});
```

### 1.2 Add Customer Controller

```csharp
[Route("api/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly IRepository _repository;

    public CustomerController(IRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public IEnumerable<Customer> Get()
    {
        return _repository.Customers;
    }

    [HttpGet("{id}")]
    public ActionResult<Customer> Get(int id) => Ok(_repository[id]);

    [HttpPost]
    public Customer Post([FromBody]Customer customer)
    {
        return _repository.AddCustomer(customer);
    }

    [HttpPut]
    public Customer Put([FromBody] Customer customer)
    {
        return _repository.UpdateCustomer(customer);
    }

    [HttpDelete("{id}")]
    public void Delete(int id)
    {
        _repository.DeleteCustomer(id);
    }
}
```

## 2. Web Client Project

### 2.1 CustomersController

```csharp
public class CustomersController : Controller
{
    public IActionResult Index() => View();
    public IActionResult Details() => View();
    public IActionResult Edit() => View();
    public IActionResult Add() => View();
}
```

### 2.2 Index View

```html
<div class="container-fluid">
  <h2>All Customers</h2>
  <a class="btn btn-sm btn-primary" asp-action="Add">Add Customer</a>
  <a class="btn btn-sm btn-primary" asp-action="Details">Get Customer</a>
  <table class="table table-sm table-striped table-bordered m-2 text-center">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>
<script defer src="~/js/index.js"></script>
```

### 2.3 index.js

```javascript
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
          appendElement.append(
            $("<td>").html(
              `<a class="btn btn-warning" href="/Customers/Edit?id=${value["id"]}">Edit</a>`
            )
          );
          appendElement.append(
            $("<td>").html(
              `<button class="delete btn btn-danger">Delete</button>`
            )
          );
          $(".table tbody").append(appendElement);
        });
      },
      error: function (xhr) {
        console.log(xhr);
      },
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
      },
    });
  });
});
```

### 2.4 Add View

```html
<div class="container-fluid">
    <h2>
        Add Customers by Id
        <a class="btn btn-sm btn-primary" asp-action="Index">Back</a>
    </h2>
    <div class="form-control">
        <label for="Name">Name</label>
        <input type="text" class="form-control" id="Name" />
    </div>
    <div class="form-control">
        <label for="Address">Address</label>
        <input type="text" class="form-control" id="Address" />
    </div>
    <div class="text-center panel-body">
        <button type="submit" class="btn btn-sm btn-primary" id="AddButton">
            Add
        </button>
    </div>
    @* Result *@
    <div style="display:none" id="resultDiv">
        <h2>Customer</h2>
        <table class="table table-sm table-striped table-bordered m-2 text-center">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>
<script defer src="~/js/add.js"></script>
```

### 2.5 add.js

```javascript
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
```

### 2.7 Edit View

```html
<div class="container-fluid">
    <h2>
        Update Customers by Id
        <a class="btn btn-sm btn-primary" asp-action="Index">Back</a>
    </h2>
    <div class="form-control">
        <label for="Id">Id</label>
        <input type="text" class="form-control" id="Id" readonly />
    </div>
    <div class="form-control">
        <label for="Name">Name</label>
        <input type="text" class="form-control" id="Name" />
    </div>
    <div class="form-control">
        <label for="Address">Address</label>
        <input type="text" class="form-control" id="Address" />
    </div>
    <div class="text-center panel-body">
        <button type="submit" class="btn btn-sm btn-primary" id="UpdateButton">
            Update
        </button>
    </div>

    <div style="display:none" id="resultDiv">
        <h2>Customer</h2>
        <table class="table table-sm table-striped table-bordered m-2 text-center">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>
<script defer src="~/js/edit.js"></script>
```

### 2.8 edit.js

```javascript
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
```

### 2.9 Detail View

```html
<div class="container-fluid">
  <h2>
    Get Customers by Id
    <a class="btn btn-sm btn-primary" asp-action="Index">Back</a>
  </h2>
  <div class="form-group">
    <label for="id">Id:</label>
    <input type="text" class="form-control" id="Id" />
  </div>
  <div class="text-center panel-body">
    <button id="GetButton" class="btn btn-sm btn-primary">Get Customer</button>
  </div>

  <div id="resultDiv" style="display:none">
    <h2>Customer</h2>
    <table class="table table-sm table-striped table-bordered m-2 text-center">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</div>
<script defer src="~/js/details.js"></script>
```

### 2.10 detail.js

```javascript
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
```
