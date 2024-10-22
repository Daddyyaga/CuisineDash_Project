using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;  // For role-based authorization
using CuisineDash.Models;
using CuisineDash.Data;

namespace CuisineDash.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public RestaurantController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get all restaurants with menu items included
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var restaurants = await _context.Restaurants
                    .Include(r => r.MenuItems)  // Include MenuItems in the response
                    .ToListAsync();

                return Ok(restaurants);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Get restaurant by ID with menu items included
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var restaurant = await _context.Restaurants
                    .Include(r => r.MenuItems)  // Include MenuItems in the response
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (restaurant == null)
                    return NotFound();

                return Ok(restaurant);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Create a new restaurant (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(Restaurant restaurant)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var newRestaurant = new Restaurant
                {
                    Name = restaurant.Name,
                    Location = restaurant.Location,
                    Description = restaurant.Description,
                    Rating = restaurant.Rating,
                    Address = restaurant.Address,
                    ImageUrl = restaurant.ImageUrl,  // Set the image URL from the request body
                    IsDeleted = false
                };

                _context.Restaurants.Add(newRestaurant);  // Directly use DbContext
                await _context.SaveChangesAsync();  // Save changes to the database

                return CreatedAtAction(nameof(Get), new { id = newRestaurant.Id }, newRestaurant);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Restaurant restaurant)
        {
            if (id != restaurant.Id)
                return BadRequest("Restaurant ID mismatch");

            try
            {
                var existingRestaurant = await _context.Restaurants.FindAsync(id);
                if (existingRestaurant == null)
                    return NotFound();

                // Log the received ImageUrl
                
               Console.WriteLine($"Received ImageUrl: {restaurant.ImageUrl}");

                // Update the fields
                existingRestaurant.Name = restaurant.Name;
                existingRestaurant.Location = restaurant.Location;
                existingRestaurant.Description = restaurant.Description;
                existingRestaurant.Rating = restaurant.Rating;
                existingRestaurant.Address = restaurant.Address;
                existingRestaurant.ImageUrl = restaurant.ImageUrl;  // Ensure ImageUrl is updated

                _context.Entry(existingRestaurant).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Delete a restaurant (Admin only)
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var restaurant = await _context.Restaurants.FindAsync(id);  // Directly use DbContext
                if (restaurant == null)
                    return NotFound();

                _context.Restaurants.Remove(restaurant);  // Directly remove the entity
                await _context.SaveChangesAsync();  // Save changes to the database

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
