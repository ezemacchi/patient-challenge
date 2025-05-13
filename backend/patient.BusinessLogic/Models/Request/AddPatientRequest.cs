namespace patient.BusinessLogic.Models.Request
{
    public class AddPatientRequest
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required DateTime DateOfBirth { get; set; }
        public required string Gender { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public required string SSN { get; set; }
    }
}
