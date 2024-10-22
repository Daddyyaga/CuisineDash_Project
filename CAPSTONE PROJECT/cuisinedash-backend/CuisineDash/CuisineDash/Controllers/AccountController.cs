using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CuisineDash.Data;
using CuisineDash.Models;

namespace CuisineDash.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AccountController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Customer Registration
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userDto)
        {
            // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == userDto.Username))
                return BadRequest("Username already exists.");

            // Create the user with the "Customer" role
            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                Address = userDto.Address,
                Role = "Customer", // Default role as Customer
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate JWT token after successful registration
            var token = GenerateJwtToken(user);

            // Return user details and the JWT token
            return Ok(new
            {
                user = new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.Role
                },
                token = token, // Include JWT token for auto-login
                message = "Registration successful."
            });
        }

        // Login for both Customers and Admins
        // Login for both Customers and Admins
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == userDto.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(userDto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials.");

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // Return token and user details with a success message
            return Ok(new
            {
                token = token,
                user = new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.Role
                },
                message = $"{user.Username} login success" // Success message
            });
        }


        // JWT Token Generation
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role) // Add user role as a claim
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
