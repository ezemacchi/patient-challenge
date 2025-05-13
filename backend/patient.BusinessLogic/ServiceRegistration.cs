using Microsoft.Extensions.DependencyInjection;
using patient.BusinessLogic.Services;
using patient.BusinessLogic.Services.Implementations;

namespace patient.BusinessLogic
{
    public static class ServiceRegistration
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<IPatientService, PatientService>();
        }
    }
}
