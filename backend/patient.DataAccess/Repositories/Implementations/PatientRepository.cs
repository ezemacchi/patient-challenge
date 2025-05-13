using Dapper;
using Microsoft.Data.SqlClient;
using patient.Domain.Entities;
using patient.Domain.Helpers;
using patient.Domain.Models;
using patient.Infrastructure.Context;

namespace patient.DataAccess.Repositories.Implementations
{
    public class PatientRepository : IPatientRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;
        private const string PatientsTable = "Patients";

        public PatientRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<PagedResult<Patient>> GetAllPatients(int skip = 0, int limit = 20)
        {
            var itemsQuery = @$"SELECT p.Id, p.FirstName, p.LastName, p.EncryptedEmail FROM {PatientsTable} p ORDER BY p.LastName OFFSET @Skip ROWS FETCH NEXT @Limit ROWS ONLY;";
            var countQuery = @$"SELECT COUNT(*) FROM {PatientsTable};";

            var query = $"{itemsQuery} {countQuery}";

            using SqlConnection sqlConnection = _connectionFactory.CreateSqlConnection();
            var response = await sqlConnection.QueryMultipleAsync(query,
                new
                {
                    Skip = skip,
                    Limit = limit
                });
            var patients = response.Read<Patient>();
            var total = response.ReadFirst<int>();

            return new PagedResult<Patient>
            {
                Skip = skip,
                Limit = limit,
                Total = total,
                Data = patients
            };
        }

        public async Task<Patient?> GetPatientById(Guid patientId)
        {
            var patientIdEncrypted = patientId;

            var query = @$"SELECT p.Id, p.FirstName, p.LastName, p.EncryptedEmail, p.EncryptedSSN, p.EncryptedPhone, p.Gender, p.DateOfBirth FROM {PatientsTable} p WHERE p.Id = @PatientId ;";

            using SqlConnection sqlConnection = _connectionFactory.CreateSqlConnection();
            var response = await sqlConnection.QueryFirstOrDefaultAsync<Patient>(query,
                new
                {
                    PatientId = patientIdEncrypted
                });

            return response;
        }

        public async Task<Patient?> AddPatient(Patient patient)
        {
            using SqlConnection sqlConnection = _connectionFactory.CreateSqlConnection();
            var response = await sqlConnection.QuerySingleAsync<Patient>(@"
                INSERT INTO Patients 
                (FirstName, LastName, EncryptedEmail, EncryptedPhone, EncryptedSSN, DateOfBirth, Gender)
                OUTPUT INSERTED.Id, INSERTED.FirstName, INSERTED.LastName, INSERTED.EncryptedEmail, INSERTED.EncryptedSSN, INSERTED.EncryptedPhone, INSERTED.Gender, INSERTED.DateOfBirth
                VALUES 
                (@FirstName, @LastName, @EncryptedEmail, @EncryptedPhone, @EncryptedSSN, @DateOfBirth, @Gender)",
                new {
                    patient.FirstName,
                    patient.LastName,
                    EncryptedEmail = patient.GetEncryptedValue(p => p.Email),
                    EncryptedPhone = patient.GetEncryptedValue(p => p.Phone),
                    EncryptedSSN = patient.GetEncryptedValue(p => p.SSN),
                    patient.DateOfBirth,
                    patient.Gender
                });

            return response;
        }

        public async Task<bool> DeletePatient(Guid id)
        {
            using SqlConnection sqlConnection = _connectionFactory.CreateSqlConnection();
            var affectedRows = await sqlConnection.ExecuteAsync(@$"
                DELETE FROM {PatientsTable} WHERE Id = @Id;",
                new { Id = id });

            return affectedRows > 0;
        }
    }
}
