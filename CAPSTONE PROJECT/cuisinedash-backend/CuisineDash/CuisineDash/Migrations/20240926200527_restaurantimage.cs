using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuisineDash.Migrations
{
    /// <inheritdoc />
    public partial class restaurantimage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Restaurants",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 101,
                column: "PasswordHash",
                value: "$2a$11$txHyedKAClC2rWTsB9NF0OFxvBUTkfjL2DBcdQehcbEsz2ADm4esq");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Restaurants");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 101,
                column: "PasswordHash",
                value: "$2a$11$98Ku/j4Qmc2Z8aGa4Rq00edotTL2JaClZzzpZFCbfRSWdH0tHbd4a");
        }
    }
}
