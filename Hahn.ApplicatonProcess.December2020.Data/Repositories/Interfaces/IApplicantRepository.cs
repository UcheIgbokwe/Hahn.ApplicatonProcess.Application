using System.Collections.Generic;
using System.Threading.Tasks;
using Hahn.ApplicatonProcess.December2020.Domain;

namespace Hahn.ApplicatonProcess.December2020.Data.Repositories.Interfaces
{
    public interface IApplicantRepository
    {
        Task<bool> Create (Applicant applicant);
        Applicant Get(int applicantId);
        Task<bool> Update(Applicant applicant);
        Task<bool> Delete(int applicantId);
        List<Applicant> GetAll();
    }
}