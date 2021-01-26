using System;
using System.Net.Http;
using FluentValidation;
using Hahn.ApplicatonProcess.December2020.Domain;
using Rest;

namespace Hahn.ApplicatonProcess.December2020.Domain
{
    public class ApplicantModelValidator : AbstractValidator<Applicant>
    {
        public ApplicantModelValidator(HttpClient client)
        {
            RuleFor(p => p.Name).MinimumLength(5).WithMessage("Name must be at least 5 characters");
            RuleFor(p => p.FamilyName).MinimumLength(5).WithMessage("Family Name must be at least 6 characters");
            RuleFor(p => p.Address).MinimumLength(10).WithMessage("Address must be at least 6 characters");
            RuleFor(p => p.CountryOfOrigin).NotNull().SetValidator(new CountryValidator(client)).WithMessage("Country name is not valid.");
            RuleFor(p => p.EMailAdress).NotEmpty().WithMessage("Email address is required").EmailAddress().WithMessage("A valid email is required");
            RuleFor(p => p.Age.ToString()).NotEmpty().Matches(@"^[\d]+$").WithMessage("Must be a number.").Must(ValidateAge).WithMessage("Age Must be between 20 and 60");
            RuleFor(p => p.Hired).NotNull().WithMessage("Boolean Validation Failed");
        }
        private bool ValidateAge(string newAge)
        {
            int age = Int32.Parse(newAge);
            if(age < 20 || age > 60){
                return false;
            }else{
                return true;
            }
        }
    }
}