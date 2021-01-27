using System;
using System.Net.Http;
using FluentValidation;
using FluentValidation.Results;

namespace Hahn.ApplicatonProcess.December2020.Domain.Validation
{
    public class ApplicantModelValidator : AbstractValidator<Applicant>
    {
        public ApplicantModelValidator()
        {
            RuleFor(p => p.Name).MinimumLength(5).WithMessage("Name must be at least 5 characters");
            RuleFor(p => p.FamilyName).MinimumLength(5).WithMessage("Family Name must be at least 6 characters");
            RuleFor(p => p.Address).MinimumLength(10).WithMessage("Address must be at least 6 characters");
            RuleFor(p => p.CountryOfOrigin).NotNull().Must(ValidateCountry).WithMessage("Country name is not valid.");
            RuleFor(p => p.EMailAdress).NotEmpty().WithMessage("Email address is required").EmailAddress().WithMessage("A valid email is required");
            RuleFor(p => p.Age.ToString()).NotEmpty().Matches(@"^[\d]+$").WithMessage("Must be a number.").Must(ValidateAge).WithMessage("Age Must be between 20 and 60");
            RuleFor(p => p.Hired).NotNull().WithMessage("Boolean Validation Failed");
        }

        protected override bool PreValidate(ValidationContext<Applicant> context, ValidationResult result)
        {
            if (context.InstanceToValidate == null)
            {
                result.Errors.Add(new ValidationFailure("", "Please submit a non-null model."));

                return false;
            }
            return true;
        }
        private bool ValidateAge(string newAge)
        {
            int age = Int32.Parse(newAge);
            return age >= 20 && age <= 60;
        }
        private bool ValidateCountry(string country){
            const string BaseUrl = "https://restcountries.eu/rest/v2/";
            bool success = false;
            try
            {
                HttpClient client = new();
                client.BaseAddress = new Uri(BaseUrl);
                //client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseMessage = client.GetAsync($"{BaseUrl}name/{country}?fullText=true").Result;

                success = responseMessage.IsSuccessStatusCode ;
            }
            catch (System.Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return success;
        }
    }
}