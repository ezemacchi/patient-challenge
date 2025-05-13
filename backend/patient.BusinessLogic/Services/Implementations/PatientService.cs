using patient.API.Controllers;
using patient.BusinessLogic.ExtensionMethods;
using patient.BusinessLogic.Models.Request;
using patient.BusinessLogic.Models.Response;
using patient.DataAccess.Repositories;

namespace patient.BusinessLogic.Services.Implementations
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;
        //private readonly ILogger<PatientService> _logger;

        public PatientService(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }

        public async Task<GetPatientByIdResponse?> GetPatientById(Guid id)
        {
            var patient = await _patientRepository.GetPatientById(id);

            return patient?.MapToGetPatientByIdResponse();
        }

        public async Task<PaginatedResponse<GetAllPatientsResponse>?> GetAllPatients(int skip = 0, int limit = 20)
        {
            var patients = await _patientRepository.GetAllPatients(skip, limit);

            if (!patients.Data.Any()) return null;

            return new PaginatedResponse<GetAllPatientsResponse>
            {
                Skip = skip,
                Limit = limit,
                Total = patients.Total,
                Data = patients.Data.Select(p => p.MapToGetAllPatientsResponse())
            };
        }

        public async Task<AddPatientResponse?> AddPatient(AddPatientRequest request)
        {
            var patientEntity = request.MapToPatient();
            var patient = await _patientRepository.AddPatient(patientEntity);
            return patient?.MapToAddPatientResponse();
        }

        public async Task<bool> DeletePatient(Guid id)
        {
            var wasDeleted = await _patientRepository.DeletePatient(id);
            return wasDeleted;
        }
    }
}
