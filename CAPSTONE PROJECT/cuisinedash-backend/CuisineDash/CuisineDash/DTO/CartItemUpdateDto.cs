namespace CuisineDash.Models
{
    public class CartItemUpdateDto
    {
        public int UserId { get; set; } // The ID of the user updating their cart
        public int CartItemId { get; set; } // The ID of the cart item to update
        public int NewQuantity { get; set; } // The new quantity to update
    }
}
