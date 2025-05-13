using patient.API.Controllers;
using patient.BusinessLogic.Models.Request;
using patient.BusinessLogic.Models.Response;

namespace patient.BusinessLogic.Services
{
    public interface IPatientService
    {
        Task<PaginatedResponse<GetAllPatientsResponse>?> GetAllPatients(int skip = 0, int limit = 20);
        Task<GetPatientByIdResponse?> GetPatientById(Guid id);
        Task<AddPatientResponse?> AddPatient(AddPatientRequest request);
        Task<bool> DeletePatient(Guid id);
    }
}
