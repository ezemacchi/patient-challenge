using System.Security.Cryptography;
using System.Text;

namespace patient.Domain.Helpers
{

    public static class SecureEncryptionHelper
    {
        private static readonly string? Key = Environment.GetEnvironmentVariable("EncryptionPassword");
        private static readonly byte[] Salt = { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 };

        public static string Encrypt(string plainText)
        {
            using var aes = Aes.Create();
            var pdb = new Rfc2898DeriveBytes(Key, Salt);
            aes.Key = pdb.GetBytes(32);
            aes.IV = pdb.GetBytes(16);

            using var ms = new MemoryStream();
            using (var cs = new CryptoStream(ms, aes.CreateEncryptor(), CryptoStreamMode.Write))
            {
                var data = Encoding.UTF8.GetBytes(plainText);
                cs.Write(data, 0, data.Length);
            }
            return Convert.ToBase64String(ms.ToArray());
        }

        public static string Decrypt(string cipherText)
        {
            using var aes = Aes.Create();
            var pdb = new Rfc2898DeriveBytes(Key, Salt);
            aes.Key = pdb.GetBytes(32);
            aes.IV = pdb.GetBytes(16);

            using var ms = new MemoryStream();
            using (var cs = new CryptoStream(ms, aes.CreateDecryptor(), CryptoStreamMode.Write))
            {
                var data = Convert.FromBase64String(cipherText);
                cs.Write(data, 0, data.Length);
            }
            return Encoding.UTF8.GetString(ms.ToArray());
        }
    }
}
