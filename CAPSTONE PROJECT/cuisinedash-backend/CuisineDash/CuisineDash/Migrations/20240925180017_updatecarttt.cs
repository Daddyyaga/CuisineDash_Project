using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuisineDash.Migrations
{
    /// <inheritdoc />
    public partial class updatecarttt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 101,
                column: "PasswordHash",
                value: "$2a$11$l6IUeQT4jsdwWHK/7GZyKeHjoAphmRf5itWSWcAaLJ991YkOThOoS");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 101,
                column: "PasswordHash",
                value: "$2a$11$ucFj5rW4I6vhRfxRGe3.pup4wV7zAIvIISszpAnoXNirMWSCYcpNu");
        }
    }
}
