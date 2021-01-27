using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hahn.ApplicatonProcess.December2020.Data.Services.Interfaces;
using Hahn.ApplicatonProcess.December2020.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Hahn.ApplicatonProcess.December2020.Domain.Validation;

namespace Hahn.ApplicatonProcess.December2020.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicantController : ControllerBase
    {
        private readonly IApplicantService _applicantService;
        public ApplicantController(IApplicantService applicantService)
        {
            this._applicantService = applicantService;
        }

        [AllowAnonymous]
        [HttpPost("Create")]
        public async Task<ActionResult> Create([FromBody] Applicant applicant)
        {
            if (applicant.IsValid(out IEnumerable<string> errors))
            {
                var result = await _applicantService.Create(applicant).ConfigureAwait(false);

                return Created(new Uri(Request.GetEncodedUrl()+ "/" + result.ID), result);
            }
            else{
                return BadRequest(errors);
            }
        }
    }
}