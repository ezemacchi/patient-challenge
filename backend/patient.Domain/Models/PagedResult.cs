using patient.Domain.Entities;

namespace patient.Domain.Models
{
    public class PagedResult<T> where T : class
    {
        public int Skip { get; set; }
        public int Limit { get; set; }
        public int Total { get; set; }
        public IEnumerable<Patient> Data { get; set; } = [];
    }
}