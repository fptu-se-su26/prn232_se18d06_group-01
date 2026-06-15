# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["JLearn.csproj", "./"]
RUN dotnet restore "JLearn.csproj"

# Copy all source files and publish
COPY . .
RUN dotnet publish "JLearn.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Configure ASP.NET Core to run on port 5000 inside the container
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "JLearn.dll"]
