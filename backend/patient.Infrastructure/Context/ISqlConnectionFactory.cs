using Microsoft.Data.SqlClient;

namespace patient.Infrastructure.Context
{
    public interface ISqlConnectionFactory
    {
        public SqlConnection CreateSqlConnection();
    }
}
