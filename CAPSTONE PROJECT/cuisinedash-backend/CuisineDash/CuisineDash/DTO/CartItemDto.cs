namespace CuisineDash.Models.DTOs
{
    public class CartItemDto
    {
        public int UserId { get; set; } // User ID to associate cart item with a user
        public int MenuItemId { get; set; } // The ID of the menu item being added
        public int Quantity { get; set; } // Quantity of the item
    }
}
