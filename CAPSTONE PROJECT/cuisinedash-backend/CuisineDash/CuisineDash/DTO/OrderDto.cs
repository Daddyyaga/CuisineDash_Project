public class OrderDto
{
    public int RestaurantId { get; set; }
    public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>(); // Initialize the list to avoid null reference errors
}

public class OrderItemDto
{
    public int MenuItemId { get; set; }
    public int Quantity { get; set; }
}
