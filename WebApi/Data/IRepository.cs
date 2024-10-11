namespace WebApi.Data
{
    public interface IRepository
    {
        IEnumerable<Customer> Customers { get; }
        Customer this[int id] { get; }
        Customer AddCustomer(Customer customer);
        Customer UpdateCustomer(Customer customer);
        void DeleteCustomer(int id);
    }
}
