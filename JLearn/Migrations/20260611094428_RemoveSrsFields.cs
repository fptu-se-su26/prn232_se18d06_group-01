using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JLearn.Migrations
{
    /// <inheritdoc />
    public partial class RemoveSrsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EaseFactor",
                table: "CustomCards");

            migrationBuilder.DropColumn(
                name: "IntervalDays",
                table: "CustomCards");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "CustomCards");

            migrationBuilder.DropColumn(
                name: "NextReviewDate",
                table: "CustomCards");

            migrationBuilder.DropColumn(
                name: "Repetitions",
                table: "CustomCards");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "EaseFactor",
                table: "CustomCards",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "IntervalDays",
                table: "CustomCards",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Level",
                table: "CustomCards",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "NextReviewDate",
                table: "CustomCards",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Repetitions",
                table: "CustomCards",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
