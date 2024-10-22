namespace CuisineDash.Models
{
    public class Review
    {
        public int Id { get; set; } // PK
        public int CustomerId { get; set; } // FK
        public int RestaurantId { get; set; } // FK
        public string Comment { get; set; }
        public DateTime CommentedDate { get; set; }

        // Navigation properties
        public User? Customer { get; set; }
        public Restaurant? Restaurant { get; set; }
    }
}