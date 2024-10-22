namespace CuisineDash.Models
{
    public class OrderItem
    {
        public int Id { get; set; } // PK
        public int OrderId { get; set; } // FK
        public int MenuItemId { get; set; } // FK
        public int Quantity { get; set; }
        public decimal Price { get; set; }

        // Soft delete flag
        public bool IsDeleted { get; set; } = false;

        // Navigation properties
        public Order? Order { get; set; }
        public MenuItem? MenuItem { get; set; }
    }
}
