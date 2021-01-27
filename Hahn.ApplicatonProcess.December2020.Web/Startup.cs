using System;
using System.IO;
using System.Reflection;
using FluentValidation.AspNetCore;
using Hahn.ApplicatonProcess.December2020.Data;
using Hahn.ApplicatonProcess.December2020.Data.Repositories;
using Hahn.ApplicatonProcess.December2020.Data.Repositories.Interfaces;
using Hahn.ApplicatonProcess.December2020.Data.Services;
using Hahn.ApplicatonProcess.December2020.Data.Services.Interfaces;
using Hahn.ApplicatonProcess.December2020.Domain.Validation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using Swashbuckle.AspNetCore.Swagger;

namespace Hahn.ApplicatonProcess.December2020.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public static IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
            .AddFluentValidation(fv => fv.RegisterValidatorsFromAssemblyContaining<ApplicantModelValidator>());
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Hahn.ApplicatonProcess.December2020.Web API",
                    Description = "An API to manage Applicants record",
                });

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
                c.ExampleFilters();
            });

            services.AddSwaggerExamplesFromAssemblies(Assembly.GetEntryAssembly());
            services.Configure<SwaggerOptions>(c => c.SerializeAsV2 = true);

            ConfigureTransientServices(services);
            ConfigureRepositories(services);
            ConfigureEntityFramework(services);
        }

        private static void ConfigureTransientServices(IServiceCollection services)
        {
            services.AddTransient<IApplicantService, ApplicantService>();
        }

        private static void ConfigureRepositories(IServiceCollection services)
        {
            services.AddSingleton<IApplicantRepository, ApplicantRepository>();
        }

        private static void ConfigureEntityFramework(IServiceCollection services)
        {
            var databaseName = Configuration["EntityFramework:DatabaseName"];

            services.AddDbContext<ApplicantDatabaseContext>(options =>
                options.UseInMemoryDatabase(databaseName));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hahn.ApplicatonProcess.December2020.Web v1"));
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }
    }
}
