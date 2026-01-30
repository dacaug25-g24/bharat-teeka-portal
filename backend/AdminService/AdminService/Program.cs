using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace AdminService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // -----------------------------
            // Controllers + JSON settings
            // -----------------------------
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy =
                        System.Text.Json.JsonNamingPolicy.CamelCase;

                    options.JsonSerializerOptions.ReferenceHandler =
                        ReferenceHandler.IgnoreCycles;
                });

            // -----------------------------
            // CORS (React: CRA + Vite)
            // -----------------------------
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactCorsPolicy", policy =>
                {
                    policy
                        .WithOrigins(
                            "http://localhost:3000", // CRA
                            "http://localhost:5173"  // Vite
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    // If you use cookies later, add: .AllowCredentials()
                });
            });

            // -----------------------------
            // JWT Authentication
            // -----------------------------
            var jwtSecret = builder.Configuration["Jwt:Secret"];
            if (string.IsNullOrWhiteSpace(jwtSecret) || jwtSecret.Length < 32)
            {
                throw new Exception("Jwt:Secret is missing or too short (min 32 chars). Check appsettings.json");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));

            builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false; // local dev
                    options.SaveToken = true;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,

                        // Keep these false unless you also set issuer/audience when generating token
                        ValidateIssuer = false,
                        ValidateAudience = false,

                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromMinutes(1)
                    };
                });

            builder.Services.AddAuthorization(options =>
            {
                // Your JWT includes: role = "ADMIN"
                options.AddPolicy("AdminOnly", policy =>
                    policy.RequireClaim("role", "ADMIN"));
            });

            // -----------------------------
            // Swagger + Bearer Auth support
            // -----------------------------
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "AdminService API",
                    Version = "v1"
                });

                // Add JWT Bearer to Swagger
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT token like: Bearer {your_token}"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // If your app is running ONLY on https://localhost:7233,
            // then http://localhost:7233 will be ERR_CONNECTION_REFUSED.
            // Make sure your launchSettings.json has both URLs if you want both:
            // "applicationUrl": "https://localhost:7233;http://localhost:5233"

            if (!app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }


            // ✅ CORS BEFORE auth (good practice)
            app.UseCors("ReactCorsPolicy");

            // ✅ IMPORTANT: Authentication first, then Authorization
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
