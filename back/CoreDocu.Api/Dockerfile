# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore "./CoreDocu.Api/CoreDocu.Api.csproj"
RUN dotnet publish "./CoreDocu.Api/CoreDocu.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Puerto interno de Kestrel
EXPOSE 8080

ENTRYPOINT ["dotnet", "CoreDocu.Api.dll"]