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
    [AllowAnonymous]
    public class ApplicantController : ControllerBase
    {
        private readonly IApplicantService _applicantService;
        public ApplicantController(IApplicantService applicantService)
        {
            this._applicantService = applicantService;
        }
        [HttpPost("create")]
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

        [HttpGet("{id}")]
        public  ActionResult Get(string id)
        {
            if (!String.IsNullOrEmpty(id))
            {
                int Id = Int32.Parse(id);
                var result =  _applicantService.Get(Id);
                return Ok(result);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet]
        public  ActionResult GetAll()
        {
            var result =  _applicantService.GetAll();
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<ActionResult> Update([FromBody] Applicant applicant)
        {
            if (applicant.IsValid(out IEnumerable<string> errors))
            {
                var result = await _applicantService.Update(applicant).ConfigureAwait(false);

                return Ok(result);
            }
            else{
                return BadRequest(errors);
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            if (!String.IsNullOrEmpty(id))
            {
                int Id = Int32.Parse(id);
                var result =  await _applicantService.Delete(Id).ConfigureAwait(false);
                if (result){
                    return Ok("Success");
                }
                return NotFound("Failed");
            }
            else
            {
                return BadRequest();
            }
        }
    }
}