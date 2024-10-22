namespace CuisineDash.Models
{
    public class MenuItem
    {
        public int Id { get; set; } // PK
        public int RestaurantId { get; set; } // FK
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; } // New field for storing the image URL

        // Soft delete flag
        public bool IsDeleted { get; set; } = false; // Default to false for new entries

        // Navigation property
        public Restaurant? Restaurant { get; set; }
    }
}
