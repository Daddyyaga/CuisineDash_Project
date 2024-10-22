using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuisineDash.Migrations
{
    /// <inheritdoc />
    public partial class Nullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 101,
                column: "PasswordHash",
                value: "$2a$11$98Ku/j4Qmc2Z8aGa4Rq00edotTL2JaClZzzpZFCbfRSWdH0tHbd4a");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 101,
                column: "PasswordHash",
                value: "$2a$11$SI2Wr7WVDpLkb4zm9n2LfuV/ZRsUpjX5TE7RAW1w6w9IYEyWb34NG");
        }
    }
}
