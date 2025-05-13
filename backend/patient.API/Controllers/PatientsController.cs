using Microsoft.AspNetCore.Mvc;
using patient.BusinessLogic.Models.Request;
using patient.BusinessLogic.Models.Response;
using patient.BusinessLogic.Services;

namespace patient.API.Controllers;

[ApiController]
[Route($"api/{controllerName}")]
public class PatientsController : ControllerBase
{
    private readonly IPatientService _patientService;
    private readonly ILogger<PatientsController> _logger;
    private const string controllerName = "patients";

    public PatientsController(ILogger<PatientsController> logger, IPatientService patientService)
    {
        _logger = logger;
        _patientService = patientService;
    }

    /*[HttpGet("{id}", Name = nameof(GetPatientById))]
    [ProducesResponseType<GetPatientByIdResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPatientById(Guid id)
    {
        var patient = await _patientService.GetPatientById(id);

        return patient is not null ? Ok(patient) : NotFound($"Patient with id: {id} not found");
    }

    [HttpGet("", Name = nameof(GetAllPatients))]
    [ProducesResponseType<PaginatedResponse<GetAllPatientsResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> GetAllPatients(int skip = 0, int limit = 20)
    {
        var patients = await _patientService.GetAllPatients(skip, limit);

        return patients?.Data.Count() > 0 ? Ok(patients) : NoContent();
    }

    [HttpPost("", Name = nameof(AddPatient))]
    [ProducesResponseType<PaginatedResponse<AddPatientResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> AddPatient(AddPatientRequest request)
    {
        var patient = await _patientService.AddPatient(request);

        return new CreatedAtActionResult(nameof(GetPatientById), controllerName, new { id = patient.Id }, patient);
    }*/

    [HttpGet("{id}", Name = nameof(GetPatientById))]
    [ProducesResponseType<GetPatientByIdResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPatientById(Guid id)
    {
        try
        {
            _logger.LogInformation("Fetching patient with ID: {PatientId}", id);
            
            var patient = await _patientService.GetPatientById(id);
            
            if (patient is null)
            {
                _logger.LogWarning("Patient with ID {PatientId} not found", id);
                return NotFound();
            }
            
            _logger.LogInformation("Successfully retrieved patient with ID: {PatientId}", id);
            return Ok(patient);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching patient with ID: {PatientId}", id);
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    [HttpGet(Name = nameof(GetAllPatients))]
    [ProducesResponseType<PaginatedResponse<GetAllPatientsResponse>>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetAllPatients([FromQuery] int skip = 0, [FromQuery] int limit = 20)
    {
        try
        {
            _logger.LogInformation("Fetching patients with skip: {Skip}, limit: {Limit}", skip, limit);
            
            var patients = await _patientService.GetAllPatients(skip, limit);
            
            if (patients?.Data?.Any() != true)
            {
                _logger.LogInformation("No patients found");
                return NoContent();
            }
            
            _logger.LogInformation("Returning {Count} patients", patients.Data.Count());
            return Ok(patients);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching patients");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    [HttpPost(Name = nameof(AddPatient))]
    [ProducesResponseType<AddPatientResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> AddPatient([FromBody] AddPatientRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid request received");
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Creating new patient");
            
            var patient = await _patientService.AddPatient(request);
            
            _logger.LogInformation("Patient created with ID: {PatientId}", patient.Id);
            
            return CreatedAtAction(
                actionName: nameof(GetPatientById),
                controllerName: controllerName,
                routeValues: new { id = patient.Id },
                value: patient);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating patient");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing your request");
        }
    }

    [HttpDelete("{id}", Name = nameof(DeletePatient))]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeletePatient(Guid id)
    {
        try
        {
            _logger.LogInformation("Attempting to delete patient with ID: {PatientId}", id);

            var result = await _patientService.DeletePatient(id);

            if (!result)
            {
                _logger.LogWarning("Delete failed: Patient with ID {PatientId} not found", id);
                return NotFound();
            }

            _logger.LogInformation("Successfully deleted patient with ID: {PatientId}", id);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting patient with ID: {PatientId}", id);
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                "An error occurred while deleting the patient");
        }
    }
}
