namespace CuisineDash.Models
{
    public class Cart
    {
        public int Id { get; set; } // PK
        public int UserId { get; set; } // FK to the User
        public User? User { get; set; } // Navigation property

        public ICollection<CartItem>? CartItems { get; set; } // List of Cart Items
    }
}
