namespace CuisineDash.Repositories.Interfaces
{
    public interface IRepository<T> where T : class
    {
        // Interface definition
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetAsync(int id);
        Task AddAsync(T entity);
        void Update(T entity);
        void Delete(T entity);
        Task<bool> SaveChangesAsync();
    }
}
