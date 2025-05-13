namespace patient.BusinessLogic.Models.Response
{
    public class PaginatedResponse<T> where T : class
    {
        public int Skip { get; set; }
        public int Limit { get; set; }
        public int Total { get; set; }
        public IEnumerable<T> Data { get; set; } = [];
    }
}
