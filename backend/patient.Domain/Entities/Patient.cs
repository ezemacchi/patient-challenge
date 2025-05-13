using patient.Domain.Helpers;
using System.Linq.Expressions;
using System.Reflection;

namespace patient.Domain.Entities
{
    public class Patient
    {
        private string encryptedEmail = string.Empty;
        private string encryptedPhone = string.Empty;
        private string encryptedSSN = string.Empty;

        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = string.Empty;
        public string Email { get => SecureEncryptionHelper.Decrypt(encryptedEmail); set => encryptedEmail = SecureEncryptionHelper.Encrypt(value); }
        public string Phone { get => SecureEncryptionHelper.Decrypt(encryptedPhone); set => encryptedPhone = SecureEncryptionHelper.Encrypt(value); }
        public string SSN { get => SecureEncryptionHelper.Decrypt(encryptedSSN); set => encryptedSSN = SecureEncryptionHelper.Encrypt(value); }

        public string GetEncryptedValue(Expression<Func<Patient, string>> expression)
        {
            if (expression.Body is MemberExpression memberExpression)
            {
                var fieldName = "encrypted" + memberExpression.Member.Name;

                var field = typeof(Patient).GetField(fieldName, BindingFlags.NonPublic | BindingFlags.Instance);

                return field?.GetValue(this)?.ToString() ?? string.Empty;
            }

            throw new ArgumentException("Invalid property expression");
        }
    }
}
