
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hahn.ApplicatonProcess.December2020.Data.Repositories.Interfaces;
using Hahn.ApplicatonProcess.December2020.Domain;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Hahn.ApplicatonProcess.December2020.Data.Repositories
{
    public class ApplicantRepository : IApplicantRepository
    {
        private readonly IServiceScope _scope;
        private readonly ApplicantDatabaseContext _databaseContext;
        private readonly ILogger<ApplicantRepository> _logger;

        public ApplicantRepository(IServiceProvider services, ILogger<ApplicantRepository> logger)
        {
            _scope = services.CreateScope();
            _databaseContext = _scope.ServiceProvider.GetRequiredService<ApplicantDatabaseContext>();
            _logger = logger;
        }
        public async Task<bool> Create(Applicant applicant)
        {
            var success = false;
            try
            {
                _databaseContext.Applicants.Add(applicant);
                var numberOfApplicantsCreated = await _databaseContext.SaveChangesAsync().ConfigureAwait(false);

                if(numberOfApplicantsCreated == 1)
                    success = true;
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return success;
        }

        public async Task<bool> Delete(int applicantId)
        {
            var success = false;

            try
            {
                var existingApplicant = Get(applicantId);

                if (existingApplicant != null)
                {
                    _databaseContext.Applicants.Remove(existingApplicant);

                    var numberOfItemsDeleted = await _databaseContext.SaveChangesAsync().ConfigureAwait(false);

                    if (numberOfItemsDeleted == 1)
                        success = true;
                }
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return success;
        }

        public Applicant Get(int applicantId)
        {
            Applicant applicant = new();
            try{
                applicant = _databaseContext.Applicants.Where(x => x.ID == applicantId).FirstOrDefault();
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return applicant;
        }

        public List<Applicant> GetAll()
        {
            List<Applicant> applicant = new();
            try{
                applicant = _databaseContext.Applicants.ToList();
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message);
            }
            return applicant;
        }

        public async Task<bool> Update(Applicant applicant)
        {
            var success = false;
            try
            {
                var existingApplicant = Get(applicant.ID);
                if (existingApplicant != null)
                {
                    existingApplicant.Address = applicant.Address;
                    existingApplicant.Age = applicant.Age;
                    existingApplicant.CountryOfOrigin = applicant.CountryOfOrigin;
                    existingApplicant.EMailAdress = applicant.EMailAdress;
                    existingApplicant.FamilyName = applicant.FamilyName;
                    existingApplicant.Name = applicant.Name;
                    existingApplicant.Hired = applicant.Hired;

                    _databaseContext.Applicants.Attach(existingApplicant);

                    var numberOfApplicantsUpdated = await _databaseContext.SaveChangesAsync().ConfigureAwait(false);

                    if (numberOfApplicantsUpdated == 1)
                        success = true;
                }

                return success;
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message);
                return success;
            }
        }
    }
}