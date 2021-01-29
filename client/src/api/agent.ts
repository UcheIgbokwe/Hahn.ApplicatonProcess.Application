import {HttpClient, json} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';

@inject(HttpClient)
export class ApplicantAPI{
  isRequesting = false;
  
  constructor(private http: HttpClient) { 
    const baseUrl = 'http://localhost:5000/api/';

    http.configure(config => {
        config.withBaseUrl(baseUrl);
    })
  }
  getApplicants(){
    this.isRequesting = true;
    return this.http.fetch('Applicant')
      .then(response => response.json())
      .then(applicants => {
        this.isRequesting = false;
        return applicants;
      })
    .catch(error => {
      this.isRequesting = false;
      console.log(error);
      return [];
    });

  }

  getApplicant(id){
    this.isRequesting = true;
    return this.http.fetch(`Applicant/${id}`)
      .then(response => response.json())
      .then(applicant => {
        this.isRequesting = false;
        return applicant;
      })
    .catch(error => {
      this.isRequesting = false;
      console.log(error);
      return [];
    });
  }

  create(applicant){
    this.isRequesting = true;
    return this.http.fetch('Applicant/create', {
      method: 'post',
      body: json(applicant)
      })
      .then(response => response.json())
      .then(createdApplicant => {
        this.isRequesting = false;
        return createdApplicant;
      })
      .catch(error => {
        this.isRequesting = false;
        console.log(error);
    });

  }

  update(applicant){
    this.isRequesting = true;
    return this.http.fetch(`Applicant/update`, {
      method: 'put',
      body: json(applicant)
    })
    .then(response => response.json())
    .then(savedApplicant => {
      this.isRequesting = false;
      return savedApplicant;
      })
      .catch(error => {
        this.isRequesting = false;
        console.log(error);
    });
  }

  delete(id){
    this.isRequesting = true;
    return this.http.fetch(`Applicant/delete/${id}`, {
      method: 'delete'
    })
    .then(response => response.text())
    .then(responseMessage => {
      this.isRequesting = false;
      console.log(responseMessage)
      return responseMessage;
    })
    .catch(error => {
      this.isRequesting = false;
      console.log(error);
    });
  }

  
}

