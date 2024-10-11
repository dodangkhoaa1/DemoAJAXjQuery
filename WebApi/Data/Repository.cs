

namespace WebApi.Data
{
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
}
