namespace CuisineDash.Models
{
    public class CartItem
    {
        public int Id { get; set; } // PK
        public int CartId { get; set; } // FK to the Cart
        public Cart? Cart { get; set; } // Navigation property

        public int MenuItemId { get; set; } // FK to the Menu Item
        public MenuItem? MenuItem { get; set; } // Navigation property
        public int Quantity { get; set; } // Quantity of the item

        // Soft delete flag
        public bool IsDeleted { get; set; } = false;
    }
}
