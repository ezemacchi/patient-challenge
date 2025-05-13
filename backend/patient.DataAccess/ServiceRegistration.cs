using Microsoft.Extensions.DependencyInjection;
using patient.DataAccess.Repositories;
using patient.DataAccess.Repositories.Implementations;

namespace patient.DataAccess
{
    public static class ServiceRegistration
    {
        public static void AddDataAccess(this IServiceCollection services)
        {
            services.AddScoped<IPatientRepository, PatientRepository>();
        }
    }
}
