using patient.Domain.Entities;
using patient.Domain.Models;

namespace patient.DataAccess.Repositories
{
    public interface IPatientRepository
    {
        Task<Patient?> AddPatient(Patient patientEntity);
        Task<bool> DeletePatient(Guid id);
        Task<PagedResult<Patient>> GetAllPatients(int skip = 0, int limit = 20);
        Task<Patient?> GetPatientById(Guid patientId);
    }
}
