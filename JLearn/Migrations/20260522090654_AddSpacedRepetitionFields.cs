using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JLearn.Migrations
{
    /// <inheritdoc />
    public partial class AddSpacedRepetitionFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Hira",
                table: "Vocabularies",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "EaseFactor",
                table: "UserVocabularies",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "IntervalDays",
                table: "UserVocabularies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Repetitions",
                table: "UserVocabularies",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Hira",
                table: "Vocabularies");

            migrationBuilder.DropColumn(
                name: "EaseFactor",
                table: "UserVocabularies");

            migrationBuilder.DropColumn(
                name: "IntervalDays",
                table: "UserVocabularies");

            migrationBuilder.DropColumn(
                name: "Repetitions",
                table: "UserVocabularies");
        }
    }
}
