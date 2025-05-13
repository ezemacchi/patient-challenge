using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using patient.Infrastructure.Configs;

namespace patient.Infrastructure.Context.Implementations
{
    public class SqlConnectionFactory : ISqlConnectionFactory
    {
        private readonly PatientOptions _patientOptions;

        public SqlConnectionFactory(IOptions<PatientOptions> patientOptions)
        {
            _patientOptions = patientOptions.Value;
        }

        public SqlConnection CreateSqlConnection()
        {
            return new SqlConnection(_patientOptions.ConnectionString);
        }

    }
}
