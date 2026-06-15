using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JLearn.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPublicToCustomDeck : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "CustomDecks",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "CustomDecks");
        }
    }
}
