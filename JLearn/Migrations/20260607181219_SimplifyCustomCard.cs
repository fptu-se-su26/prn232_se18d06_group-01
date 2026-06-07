using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JLearn.Migrations
{
    /// <inheritdoc />
    public partial class SimplifyCustomCard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Hira",
                table: "CustomCards");

            migrationBuilder.DropColumn(
                name: "Kanji",
                table: "CustomCards");

            migrationBuilder.DropColumn(
                name: "Romaji",
                table: "CustomCards");

            migrationBuilder.RenameColumn(
                name: "Kana",
                table: "CustomCards",
                newName: "Word");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Word",
                table: "CustomCards",
                newName: "Kana");

            migrationBuilder.AddColumn<string>(
                name: "Hira",
                table: "CustomCards",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Kanji",
                table: "CustomCards",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Romaji",
                table: "CustomCards",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);
        }
    }
}
