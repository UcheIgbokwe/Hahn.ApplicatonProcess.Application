
using System.Collections.Generic;
using System.Threading.Tasks;
using Hahn.ApplicatonProcess.December2020.Data.Repositories.Interfaces;
using Hahn.ApplicatonProcess.December2020.Data.Services.Interfaces;
using Hahn.ApplicatonProcess.December2020.Domain;

namespace Hahn.ApplicatonProcess.December2020.Data.Services
{
    public class ApplicantService : IApplicantService
    {
        private readonly IApplicantRepository _repository;

        public ApplicantService(IApplicantRepository repository)
        {
            _repository = repository;
        }
        public async Task<Applicant> Create(Applicant applicant)
        {
            var success = await _repository.Create(applicant).ConfigureAwait(false);

            if(success)
                return applicant;
            else
                return null;
        }
        public async Task<bool> Delete(int applicantId)
        {
            var success = await _repository.Delete(applicantId).ConfigureAwait(false);

            return success;
        }
        public Applicant Get(int applicantId)
        {
            var result = _repository.Get(applicantId);

            return result;
        }
        public List<Applicant> GetAll()
        {
            var result = _repository.GetAll();

            return result;
        }
        public async Task<Applicant> Update(Applicant applicant)
        {
            var success = await _repository.Update(applicant).ConfigureAwait(false);

            if(success)
                return applicant;
            else
                return null;
        }
    }
}