namespace CuisineDash.Models
{
    public class Order
    {
        public int Id { get; set; } // PK
        public int CustomerId { get; set; } // FK
        public int RestaurantId { get; set; } // FK
        public decimal TotalAmount { get; set; }
        public string OrderStatus { get; set; }
        public DateTime CreatedAt { get; set; }

        // Soft delete flag
        public bool IsDeleted { get; set; } = false; // Default to false for new entries

        // Navigation properties
        public User? Customer { get; set; }
        public Restaurant? Restaurant { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}
