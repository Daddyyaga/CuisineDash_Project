namespace CuisineDash.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; } // Hashed password
        public string Email { get; set; }
        public string Address { get; set; }
        public string Role { get; set; } // "Customer" or "Admin"

        // New property for soft delete
        public bool IsDeleted { get; set; } = false; // Default to false, meaning not deleted
    }
}
