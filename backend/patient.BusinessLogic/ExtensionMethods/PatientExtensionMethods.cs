using patient.API.Controllers;
using patient.BusinessLogic.Models.Request;
using patient.BusinessLogic.Models.Response;
using patient.Domain.Entities;

namespace patient.BusinessLogic.ExtensionMethods
{
    public static class PatientExtensionMethods
    {
        public static GetAllPatientsResponse MapToGetAllPatientsResponse(this Patient patient)
        {
            return new GetAllPatientsResponse
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                Email = patient.Email
            };
        }
        
        public static GetPatientByIdResponse MapToGetPatientByIdResponse(this Patient patient)
        {
            return new GetPatientByIdResponse
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                Gender = patient.Gender,
                DateOfBirth = patient.DateOfBirth,
                Email = patient.Email,
                Phone = patient.Phone,
                SSN = patient.SSN
            };
        }

        public static AddPatientResponse MapToAddPatientResponse(this Patient patient)
        {
            return new AddPatientResponse
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                Gender = patient.Gender,
                DateOfBirth = patient.DateOfBirth,
                Email = patient.Email,
                Phone = patient.Phone,
                SSN = patient.SSN
            };
        }

        public static Patient MapToPatient(this AddPatientRequest addPatientRequest)
        {
            return new Patient
            {
                FirstName = addPatientRequest.FirstName,
                LastName = addPatientRequest.LastName,
                Gender = addPatientRequest.Gender,
                DateOfBirth = addPatientRequest.DateOfBirth,
                Email = addPatientRequest.Email,
                Phone = addPatientRequest.Phone,
                SSN = addPatientRequest.SSN
            };
        }
    }
}
