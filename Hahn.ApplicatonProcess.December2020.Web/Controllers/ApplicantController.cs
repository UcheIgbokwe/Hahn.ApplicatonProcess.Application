using System;
using Hahn.ApplicatonProcess.December2020.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hahn.ApplicatonProcess.December2020.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicantController : ControllerBase
    {
        [AllowAnonymous]
        [HttpPost("Create")]
        public ActionResult Create(Guid Id, [FromBody] Applicant applicant)
        {

            return CreatedAtAction("GetApplicants" , new { id = Id }, applicant);
        }
        
    }
}