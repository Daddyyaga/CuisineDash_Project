using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CuisineDash.Data;
using CuisineDash.Models;
using System.Threading.Tasks;
using CuisineDash.DTO;

namespace CuisineDash.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AdminController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // ---- ADMIN REGISTRATION ---- //
        [HttpPost("register-admin")]
        public async Task<IActionResult> RegisterAdmin(UserRegisterDto userDto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == userDto.Username))
                return BadRequest("Username already exists.");

            var admin = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                Address = userDto.Address,
                Role = "Admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                IsDeleted = false
            };

            _context.Users.Add(admin);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(admin);

            return Ok(new
            {
                user = new
                {
                    admin.Id,
                    admin.Username,
                    admin.Email,
                    admin.Role
                },
                token = token,
                message = "Admin registration successful."
            });
        }

        // ---- RESTAURANT MANAGEMENT ---- //
        [HttpPost("add-restaurant")]
        public async Task<IActionResult> AddRestaurant(Restaurant restaurant)
        {
            if (string.IsNullOrWhiteSpace(restaurant.Name) || restaurant.Rating <= 0)
                return BadRequest("Invalid data. Restaurant name and rating must be provided.");

            restaurant.IsDeleted = false;
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();
            return Ok(restaurant);
        }

        [HttpGet("restaurants")]
        public async Task<IActionResult> GetRestaurants()
        {
            var restaurants = await _context.Restaurants
                .Where(r => !r.IsDeleted)
                .ToListAsync();

            return Ok(restaurants);
        }

        [HttpPut("update-restaurant/{id}")]
        public async Task<IActionResult> UpdateRestaurant(int id, Restaurant updatedRestaurant)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null || restaurant.IsDeleted)
                return NotFound("Restaurant not found or has been deleted.");

            if (string.IsNullOrWhiteSpace(updatedRestaurant.Name) || updatedRestaurant.Rating <= 0)
                return BadRequest("Invalid data. Restaurant name and rating must be provided.");

            restaurant.Name = updatedRestaurant.Name;
            restaurant.Location = updatedRestaurant.Location;
            restaurant.Description = updatedRestaurant.Description;
            restaurant.Rating = updatedRestaurant.Rating;
            restaurant.Address = updatedRestaurant.Address;

            _context.Restaurants.Update(restaurant);
            await _context.SaveChangesAsync();

            return Ok(restaurant);
        }

        [HttpDelete("delete-restaurant/{id}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null)
                return NotFound("Restaurant not found.");

            restaurant.IsDeleted = true;
            await _context.SaveChangesAsync();

            return Ok("Restaurant soft deleted successfully.");
        }

        // ---- MENU ITEM MANAGEMENT ---- //

        // Add Menu Item (POST: api/admin/add-menuitem)
        [HttpPost("add-menuitem")]
        public async Task<IActionResult> AddMenuItem(MenuItem menuItem)
        {
            if (string.IsNullOrWhiteSpace(menuItem.Name) || menuItem.Price <= 0 || menuItem.RestaurantId <= 0)
                return BadRequest("Invalid data. Name, Price, and RestaurantId are required.");

            menuItem.IsDeleted = false;
            _context.MenuItems.Add(menuItem);
            await _context.SaveChangesAsync();
            return Ok(menuItem);
        }

        // Update Menu Item (PUT: api/admin/update-menuitem/{id})
        [HttpPut("update-menuitem/{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, MenuItem updatedMenuItem)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null || menuItem.IsDeleted)
                return NotFound("Menu item not found or has been deleted.");

            if (string.IsNullOrWhiteSpace(updatedMenuItem.Name) || updatedMenuItem.Price <= 0)
                return BadRequest("Invalid data. Name and Price must be provided.");

            menuItem.Name = updatedMenuItem.Name;
            menuItem.Description = updatedMenuItem.Description;
            menuItem.Price = updatedMenuItem.Price;

            _context.MenuItems.Update(menuItem);
            await _context.SaveChangesAsync();

            return Ok(menuItem);
        }

        // Soft Delete Menu Item (DELETE: api/admin/delete-menuitem/{id})
        [HttpDelete("delete-menuitem/{id}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            var menuItem = await _context.MenuItems.FindAsync(id);
            if (menuItem == null)
                return NotFound("Menu item not found.");

            menuItem.IsDeleted = true;
            await _context.SaveChangesAsync();

            return Ok("Menu item soft deleted successfully.");
        }

        // Get all Menu Items (GET: api/admin/menuitems)
        [HttpGet("menuitems")]
        public async Task<IActionResult> GetMenuItems()
        {
            var menuItems = await _context.MenuItems
                .Where(m => !m.IsDeleted)
                .ToListAsync();

            return Ok(menuItems);
        }

        // ---- ORDER MANAGEMENT ---- //

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Restaurant)
                .Include(o => o.OrderItems)
                .Where(o => !o.IsDeleted)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("update-order/{id}")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateDto statusDto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null || order.IsDeleted)
                return NotFound("Order not found or has been deleted.");

            if (string.IsNullOrWhiteSpace(statusDto.OrderStatus))
                return BadRequest("Invalid data. OrderStatus is required.");

            order.OrderStatus = statusDto.OrderStatus;
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-order/{id}")]
        public async Task<IActionResult> SoftDeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            // Soft delete logic
            order.IsDeleted = true;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // ---- JWT TOKEN GENERATION ---- //

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:ExpireMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
