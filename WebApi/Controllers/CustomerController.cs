using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.Data;

namespace WebApi.Controllers
{
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
}
