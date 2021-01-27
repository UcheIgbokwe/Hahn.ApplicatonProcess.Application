using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using FluentValidation.Validators;

namespace Hahn.ApplicatonProcess.December2020.Domain.Validation
{
    public class CountryValidator : AsyncValidatorBase
    {
        private const string BaseUrl = "https://restcountries.eu/rest/v2/";
        private readonly HttpClient _client;
        public CountryValidator(HttpClient client)
        {
            _client = client;
        }

        protected override async Task<bool> IsValidAsync(PropertyValidatorContext context, CancellationToken cancellation)
        {
            Console.WriteLine("we are live!");
            return (await _client.GetAsync($"{BaseUrl}name/{context.PropertyValue}?fullText=true", cancellation).ConfigureAwait(false)).IsSuccessStatusCode;
        }
    }
}