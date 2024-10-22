namespace CuisineDash.Models
{
    public class Restaurant
    {
        public int Id { get; set; } // PK
        public string Name { get; set; }
        public string Location { get; set; }
        public string Description { get; set; }
        public double Rating { get; set; }
        public string Address { get; set; }

        // New property to store the image URL for the restaurant
        public string? ImageUrl { get; set; }  // Add this for image URL

        // Soft delete flag
        public bool IsDeleted { get; set; } = false; // Default to false for new entries

        // Relationships
        public ICollection<MenuItem>? MenuItems { get; set; }
        public ICollection<Review>? Reviews { get; set; }
    }
}
