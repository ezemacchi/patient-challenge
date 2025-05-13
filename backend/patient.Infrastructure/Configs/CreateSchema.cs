using Microsoft.Data.SqlClient;
using Dapper;
using patient.Infrastructure.Context;
using patient.Domain.Entities;
using patient.Domain.Helpers;

namespace patient.Infrastructure.Configs
{
    public class CreateSchema
    {
        private readonly ISqlConnectionFactory _connectionFactory;

        public CreateSchema(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public void Create()
        {
            using SqlConnection sqlConnection = _connectionFactory.CreateSqlConnection();

            var tableExists = sqlConnection.QueryFirstOrDefault<bool>(
                        @"SELECT CASE WHEN EXISTS (
                SELECT 1 FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_NAME = 'Patients'
            ) THEN 1 ELSE 0 END");

            if (!tableExists)
            {
                var patient = new Patient
                {
                    FirstName = "John",
                    LastName = "Doe",
                    DateOfBirth = new DateTime(2020, 12, 23),
                    Gender = "Male",
                    Email = "john.doe@example.com",
                    Phone = "+1-555-123-4567",
                    SSN = "123-45-6789"
                };

                var encryptedEmail = SecureEncryptionHelper.Encrypt("john.doe@example.com");
                var encryptedPhone = SecureEncryptionHelper.Encrypt("+1-555-123-4567");
                var encryptedSSN = SecureEncryptionHelper.Encrypt("123-45-6789");

                sqlConnection.Execute(@"
                CREATE TABLE Patients (
                    Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                    FirstName NVARCHAR(100) NOT NULL,
                    LastName NVARCHAR(100) NOT NULL,
                    DateOfBirth DATE NOT NULL,
                    Gender NVARCHAR(50) NOT NULL,
                    EncryptedEmail NVARCHAR(MAX) NOT NULL,
                    EncryptedPhone NVARCHAR(MAX) NOT NULL,
                    EncryptedSSN NVARCHAR(MAX),
                    CreatedAt DATETIME2 DEFAULT GETDATE()
                );");

                sqlConnection.Execute(@"
                INSERT INTO Patients 
                (FirstName, LastName, EncryptedEmail, EncryptedPhone, EncryptedSSN, DateOfBirth, Gender)
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
            }
        }
    }
}
