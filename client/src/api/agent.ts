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
      console.log('Error retrieving applicants.');
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
      console.log('Error retrieving applicant.');
      return [];
    });
  }

  addBook(book){
      return this.http.fetch('books', {
          method: 'post',
          body: json(book)
          })
          .then(response => response.json())
          .then(createdBook => {
              return createdBook;
          })
              .catch(error => {
                  console.log('Error adding book.');
          });

  }

  deleteBook(book){
      return this.http.fetch(`book/${book._id}`, {
              method: 'delete'
              })
              .then(response => response.json())
              .then(responseMessage => {
                  return responseMessage;
              })
                .catch(error => {
                      console.log('Error deleting book.');
                });


  }

  saveBook(book){
      return this.http.fetch(`book/${book._id}`, {
                  method: 'put',
                  body: json(book)
                })
                .then(response => response.json())
                .then(savedBook => {
                  return savedBook;
                  })
                  .catch(error => {
                      console.log('Error saving book.');
                });


  }
}

