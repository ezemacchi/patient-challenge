using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using patient.Infrastructure.Configs;
using patient.Infrastructure.Context;
using patient.Infrastructure.Context.Implementations;

namespace patient.Infrastructure
{
    public static class ServiceRegistration
    {
        public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<PatientOptions>(configuration.GetSection(PatientOptions.Patient));
            services.AddScoped<ISqlConnectionFactory, SqlConnectionFactory>();
            services.AddScoped<CreateSchema>();

            var serviceProvider = services.BuildServiceProvider();
            using var scope = serviceProvider.CreateScope();
            var schemaCreator = scope.ServiceProvider.GetRequiredService<CreateSchema>();
            schemaCreator.Create();
        }
    }
}
