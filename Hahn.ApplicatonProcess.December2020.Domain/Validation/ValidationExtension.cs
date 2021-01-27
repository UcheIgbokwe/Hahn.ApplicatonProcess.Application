using System;
using System.Collections.Generic;
using FluentValidation.Results;

namespace Hahn.ApplicatonProcess.December2020.Domain.Validation
{
    public static class ValidationExtension
    {
        public static bool IsValid(this Applicant applicant, out IEnumerable<string> errors)
        {
            Console.WriteLine(applicant);
            var validator = new ApplicantModelValidator();

            var validationResult = validator.Validate(applicant);
            errors = AggregateErrors(validationResult);

            return validationResult.IsValid;
        }

        private static List<string> AggregateErrors(ValidationResult validationResult)
        {
            var errors = new List<string>();

            if (!validationResult.IsValid)
            {
                foreach (var error in validationResult.Errors)
                    errors.Add(error.ErrorMessage);
            }

            return errors;
        }
    }
}