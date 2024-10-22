using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CuisineDash.Repositories.Interfaces;
using CuisineDash.Models;
using CuisineDash.Data;

namespace CuisineDash.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Customer")]
    public class OrderController : ControllerBase
    {
        private readonly IRepository<Order> _orderRepository;
        private readonly ApplicationDbContext _context;

        public OrderController(IRepository<Order> orderRepository, ApplicationDbContext context)
        {
            _orderRepository = orderRepository;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder(OrderDto orderDto)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User not found.");
            }

            var userId = int.Parse(userIdClaim);

            // Use a transaction to ensure atomicity
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Create a new order
                var order = new Order
                {
                    CustomerId = userId,
                    RestaurantId = orderDto.RestaurantId,
                    OrderStatus = "Pending",
                    CreatedAt = DateTime.UtcNow,
                    OrderItems = new List<OrderItem>()
                };

                decimal totalAmount = 0;

                // Loop through each item in the order
                foreach (var item in orderDto.OrderItems)
                {
                    var menuItem = await _context.MenuItems.FindAsync(item.MenuItemId);
                    if (menuItem == null)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest($"Menu item with ID {item.MenuItemId} not found.");
                    }

                    var orderItem = new OrderItem
                    {
                        MenuItemId = item.MenuItemId,
                        Quantity = item.Quantity,
                        Price = menuItem.Price * item.Quantity
                    };

                    totalAmount += orderItem.Price;
                    order.OrderItems.Add(orderItem);
                }

                order.TotalAmount = totalAmount;

                // Add order to repository and save changes
                await _orderRepository.AddAsync(order);
                await _orderRepository.SaveChangesAsync();

                // Commit the transaction
                await transaction.CommitAsync();

                return Ok(order);
            }
            catch (Exception ex)
            {
                // Rollback the transaction on error
                await transaction.RollbackAsync();
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserOrders()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User not found.");
            }

            var userId = int.Parse(userIdClaim);

            // Fetch all non-soft-deleted orders for the logged-in user
            var orders = await _context.Orders
                .Where(o => o.CustomerId == userId && !o.IsDeleted)  // Exclude soft-deleted orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return Ok(new List<Order>()); // Return an empty list if no orders are found
            }

            return Ok(orders);
        }


        [HttpDelete("softdelete/{id}")]
        public async Task<IActionResult> SoftDeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.IsDeleted = true;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }


    }
}
