using System.Threading.Tasks;
using Hahn.ApplicatonProcess.December2020.Domain;

namespace Hahn.ApplicatonProcess.December2020.Data.Services.Interfaces
{
    public interface IApplicantService
    {
        Task<Applicant> Create (Applicant applicant);
        Applicant Get(int applicantId);
        Task<Applicant> Update(Applicant applicant);
        Task<bool> Delete(int applicantId);
    }
}