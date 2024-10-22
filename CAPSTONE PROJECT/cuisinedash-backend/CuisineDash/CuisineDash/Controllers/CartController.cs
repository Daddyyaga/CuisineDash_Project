using CuisineDash.Data;
using CuisineDash.Models;
using CuisineDash.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CuisineDash.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get the cart for a specific user
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.MenuItem) // Include the MenuItem details
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound(new { message = "Cart not found." });

            return Ok(cart);
        }


        // Add an item to the cart
        [HttpPost("add")]
        public async Task<IActionResult> AddToCart([FromBody] CartItemDto cartItemDto)
        {
            // Check if the user has an existing cart
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == cartItemDto.UserId);

            if (cart == null)
            {
                // Create a new cart if the user doesn't have one
                cart = new Cart
                {
                    UserId = cartItemDto.UserId,
                    CartItems = new List<CartItem>()
                };
                _context.Carts.Add(cart);
            }

            // Check if the item already exists in the cart
            var existingCartItem = cart.CartItems.FirstOrDefault(ci => ci.MenuItemId == cartItemDto.MenuItemId);

            if (existingCartItem != null)
            {
                // If the item exists, update the quantity
                existingCartItem.Quantity += cartItemDto.Quantity;
            }
            else
            {
                // Otherwise, add the new item to the cart
                var cartItem = new CartItem
                {
                    MenuItemId = cartItemDto.MenuItemId,
                    Quantity = cartItemDto.Quantity,
                    Cart = cart
                };
                cart.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();
            return Ok(cart);
        }

        // Remove an item from the cart
        [HttpDelete("remove/{cartItemId}")]
        public async Task<IActionResult> RemoveFromCart(int cartItemId)
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
                return NotFound(new { message = "Cart item not found." });

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Clear the cart
        [HttpDelete("clear/{userId}")]
        public async Task<IActionResult> ClearCart(int userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
                return NotFound(new { message = "Cart not found." });

            _context.CartItems.RemoveRange(cart.CartItems); // Clear all items from the cart
            await _context.SaveChangesAsync();

            return NoContent();
        }


        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateCartItems([FromBody] List<CartItemUpdateDto> updatedCart)
        {
            foreach (var updatedItem in updatedCart)
            {
                var cartItem = await _context.CartItems.FirstOrDefaultAsync(ci => ci.Id == updatedItem.CartItemId);
                if (cartItem == null)
                {
                    return NotFound($"Cart item with ID {updatedItem.CartItemId} not found.");
                }
                cartItem.Quantity = updatedItem.NewQuantity;
                _context.CartItems.Update(cartItem);
            }

            await _context.SaveChangesAsync();

            var updatedCartItems = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.MenuItem)
                .Where(c => c.UserId == updatedCart.First().UserId)
                .FirstOrDefaultAsync();

            return Ok(updatedCartItems);
        }





    }
}
