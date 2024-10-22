using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuisineDash.Migrations
{
    /// <inheritdoc />
    public partial class Cartitemupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 101,
                column: "PasswordHash",
                value: "$2a$11$ucFj5rW4I6vhRfxRGe3.pup4wV7zAIvIISszpAnoXNirMWSCYcpNu");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 101,
                column: "PasswordHash",
                value: "$2a$11$7B801tgIOLW67KSJ29KLeOUCItpvaL/lVTHk0IqIxShwQHFmhQNeG");
        }
    }
}
