import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AddrequirementService } from 'src/app/service/addrequirement.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders,HttpErrorResponse, HttpClient  } from '@angular/common/http';


@Component({
  selector: 'app-candidatelist',
  templateUrl: './candidatelist.component.html',
  styleUrls: ['./candidatelist.component.css']
})
export class CandidatelistComponent implements OnInit, OnDestroy {

  selectedCandidateId;
  slectedDiv;
  candidateForm: FormGroup;
  candidateMailForm: FormGroup;
  scheduleInterviewForm: FormGroup;
  candidateDeployForm:FormGroup;
  candidateList = [];
  formMessage = '';
  messeage;
  showMessage: boolean = false;
  candidateInfo;
  candidateId;
  singleJobrequirement=[];
  username:string='Anil';
  reqId;
  searchByName:string;
  searchByNumber:string;
  mailDetails;
  headers;
  to=[];
  from=[];
  attachfile;
  candidateResume;


  constructor(private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private requirementservice: AddrequirementService,
    private toastr: ToastrService, private addrequrementservice:AddrequirementService,private http:HttpClient) { }

  ngOnInit(): void {
    this.getCandidatelist();
    this.candidateForm = this.fb.group({
      recruiterName: this.fb.control(null),
      status: this.fb.control(null),
      client: this.fb.control(this.username),
      candidateId: this.fb.control(null),
      candidateName: this.fb.control(null),
      mailId: this.fb.control(null),
      totalExp: this.fb.control(null),
      relExperience: this.fb.control(null),
      ctc: this.fb.control(null),
      ectc: this.fb.control(null),
      contactNumber: this.fb.control(null),
      currOraganization: this.fb.control(null),
      noticePeriod: this.fb.control(null),
      currentLoc: this.fb.control(null),
      skills: this.fb.array([
        this.returnSkill()
      ])
    })
    this.scheduleInterviewForm = this.fb.group({
      candidateId:this.fb.control(null),
      date:this.fb.control(null),
      time:this.fb.control(null),
      pointOfContact:this.fb.control(null),
      contactPersonNumber:this.fb.control(null),
      status:this.fb.control(null)
    })

    this.candidateDeployForm = this.fb.group({
      candidateId: this.fb.control(this.selectedCandidateId),
      panNumber: this.fb.control(null),
      adharNumber: this.fb.control(null),
      resume : this.fb.control(this.candidateResume)
    })

    this.getCandidateInfo();
    

    this.candidateMailForm = this.fb.group({
      from:this.fb.control(null),
      to:this.fb.control(null),
      subject:this.fb.control(null),
      content:this.fb.control(null),
    })

    this.singleJobrequirement.push(JSON.parse(localStorage.getItem('jobList')));
    console.log(this.singleJobrequirement);
    this.getCandidatelist();
  }

  getCandidatelist() {
    const result=JSON.parse(localStorage.getItem('jobList'));
    console.log(this.reqId=result.reqId)
    this.requirementservice.getCandidateUnderReq(this.reqId).subscribe((res:any)=> {
      console.log(res);
      this.candidateList = res.data;
    })

    //for local system
    // console.log(JSON.parse(localStorage.getItem('getcandidate')))
    // this.candidateList=[];
    // this.candidateList.push((JSON.parse(localStorage.getItem('getcandidate'))));
    // console.log(this.candidateList)
  //  this.candidateList= [
  //                      {"recruiterName":"Anil",
  //                      "client":null,
  //                      "status":"Active",
  //                      "candidateId":10,
  //                      "candidateName":"Anil",
  //                      "mailId":"anilshetty576233@gmail.com",
  //                      "totalExp":5,
  //                      "relExperience":5,
  //                      "ctc":null,
  //                      "ectc":null,
  //                      "contactNumber":9008593752,
  //                      "currOraganization":null,
  //                      "noticePeriod":null,
  //                      "currentLoc":"bangalore",
  //                      "skills":["Html"]
  //                     }
  //  ];
  }

  getCandidateInfo() {
    console.log(JSON.parse(localStorage.getItem('singlecandidate')));
    this.mailDetails = JSON.parse(localStorage.getItem('singlecandidate'));
    console.log(this.mailDetails)
  }
    
  get skills(): FormArray {
    return this.candidateForm.get('skills') as FormArray;
  }

  addSkills() {
    (this.candidateForm.get('skills') as FormArray).push(this.returnSkill())
  }

  removeskill(i) {
    (this.candidateForm.get('skills') as FormArray).removeAt(i)
  }
  returnSkill() {
    return this.fb.control(null)
  }

  myFunction(divId) {
    console.log(divId)
    this.slectedDiv = divId;
    var element = document.getElementById(this.slectedDiv);
    element.classList.toggle("minicard");
  }
  showSuccess() {
    this.toastr.success(this.formMessage, '');
  }
  showError() {
    this.toastr.error(this.formMessage, '!Not addedd');
  }
  saveCandidate(candidate) {
    console.log(candidate);
    this.candidateId =candidate.candidateId;
  }
  editskill(skill) {
    return this.fb.control(skill)
  }
  deleteCandidate() {
    console.log(this.candidateId);
    this.requirementservice.deleteCandidate(this.candidateId).subscribe((res:any)=> {
      console.log(res);
      this.getCandidatelist();
      if(res.error==false) {
        this.formMessage = 'candidate deleted successfully'
        this.showSuccess();
      }
      if(res.error==true) {
        this.formMessage = 'candidate not deleted'
        this.showError();
      }
    })
  }

// Edit candidate
  editCandidate(candidate) {
    console.log(candidate);
    this.candidateInfo = candidate;
    console.log(this.candidateInfo);
    this.candidateForm.reset();
    this.candidateForm = this.fb.group({
      recruiterName: this.fb.control(JSON.parse(localStorage.getItem('user'))),
      candidateId: this.fb.control(this.candidateInfo.candidateId),
      status: this.fb.control(null),
      candidateName: this.fb.control(this.candidateInfo.candidateName),
      mailId: this.fb.control(this.candidateInfo.mailId),
      totalExp: this.fb.control(this.candidateInfo.totalExperience),
      relExperience: this.fb.control(this.candidateInfo.relExperience),
      ctc: this.fb.control(this.candidateInfo.ctc),
      ectc: this.fb.control(this.candidateInfo.ectc),
      contactNumber: this.fb.control(this.candidateInfo.contactNumber),
      currOraganization: this.fb.control(this.candidateInfo.currOraganization),
      noticePeriod: this.fb.control(this.candidateInfo.noticePeriod),
      currentLoc: this.fb.control(this.candidateInfo.currentLoc),
      skills: this.fb.array(
        this.candidateInfo.skills.map(skill => this.editskill(skill))
      )
    })
  }

  updateCandidate(candidateForm) {
    console.log(candidateForm.value)
    localStorage.removeItem('singlecandidate');
    localStorage.setItem('singlecandidate',JSON.stringify(candidateForm.value));
    this.getCandidatelist();
    console.log(candidateForm.value);
    this.requirementservice.editCandidate(candidateForm.value).subscribe((res:any)=>{
      console.log(res);
      this.getCandidatelist();
      this.candidateForm.reset();
      if(res.error== false) {
        this.formMessage = 'Candidate Updated Successfully';
        this.showSuccess();
      }
    })
  }
  addCandidate() {
    console.log(this.candidateForm.value);
    localStorage.setItem('getcandidate',JSON.stringify(this.candidateForm.value));
    this.requirementservice.postCandidate(this.candidateForm.value).subscribe((data: any) => {
      console.log(data);
      this.candidateForm.reset();
      this.getCandidatelist();
      if (data.error === false) {
        this.formMessage = 'Candidate Added Successfully';
        this.showSuccess();
      }
      if (data.error === true) {
        this.formMessage = data.description;
        this.showError();
      }
    },
      (err) => {
        console.log(err);
        this.showError();
      })
  }

  clearForm() {
    this.candidateForm.reset();
    this.candidateForm = this.fb.group({
      recruiterName: this.fb.control(this.username),
      client: this.fb.control(this.reqId),
      status: this.fb.control('Active'),
      candidateId: this.fb.control(null),
      candidateName: this.fb.control(null),
      mailId: this.fb.control(null),
      totalExp: this.fb.control(null),
      relExperience: this.fb.control(null),
      ctc: this.fb.control(null),
      ectc: this.fb.control(null),
      contactNumber: this.fb.control(null),
      currOraganization: this.fb.control(null),
      noticePeriod: this.fb.control(null),
      currentLoc: this.fb.control(null),
      skills: this.fb.array([
        this.returnSkill()
      ])
    })
  }
  saveSingleCandidate(candidate) {
    console.log(candidate);
    this.scheduleInterviewForm = this.fb.group({
      reqId:this.fb.control(JSON.parse(localStorage.getItem('jobList')).reqId),
      candidateId:this.fb.control(candidate.candidateId),
      date:this.fb.control(null),
      time:this.fb.control(null),
      pointOfContact:this.fb.control(null),
      contactPersonNumber:this.fb.control(null),
      status:this.fb.control(null)
    })
    localStorage.setItem('singlecandidate',JSON.stringify(candidate));
  }
  interviewSchedule() {
    console.log("Interview scedule info : ",this.scheduleInterviewForm.value);
    this.addrequrementservice.scheduleInterview(this.scheduleInterviewForm.value).subscribe(response => {
      console.log(response)
    })
    this.candidateMailForm.reset();
    // for clearing send mail forms
    this.getCandidateInfo();
    this.candidateMailForm = this.fb.group({
      from:this.fb.control('anil@gmail.com'),
      to:this.fb.control(this.mailDetails.mailId),
      subject:this.fb.control('Call Letter'),
      content:this.fb.control(null)
      // attachFile:this.fb.control(null)
    })
  }
  attachFile(event) {
    this.attachfile=event.target.files;
    console.log(this.attachfile);
  }
  sendMail() {
     
    let headers = {
      'Content-Type': 'application/json',
      'from': this.candidateMailForm.value.from, 
      'tos':JSON.stringify(["hghjj"]),
      'ccs': JSON.stringify(["hghjj"]),
      'content': this.candidateMailForm.value.content,
      'subject': this.candidateMailForm.value.subject,
    }
    console.log(this.attachfile);
    console.log(headers);
    // this.requirementservice.postEmail(this.attachfile,{ headers: headers}).subscribe((res)=> {
    //      console.log(res);
    //    })
     this.http.post('http://10.10.12.187:8082/send-email',this.attachfile,{headers:headers}).subscribe((res)=> {
       console.log(res)
     })
  }

  resumeFile(event) {
    let fileList = event.target.files;
    console.log(fileList);
    if(fileList.length > 0) {
      this.candidateResume = fileList[0];
      // this.candidateResume= new FormData();
      // this.candidateResume.append('uploadFile', file, file);
      console.log("info: ",this.candidateResume)
    }
    console.log(this.candidateResume)
  }

  deployCandidateId(candidate) {
    this.candidateDeployForm = this.fb.group({
      reqId:this.fb.control(JSON.parse(localStorage.getItem('jobList')).reqId),
      candidateId: this.fb.control(candidate.candidateId),
      panNumber: this.fb.control(null),
      adharNumber: this.fb.control(null),
      resume : this.fb.control(this.candidateResume)
    })
    // console.log(candidate);
    // this.selectedCandidateId=candidate.candidateId;
    // console.log("ID : ",candidate.candidateId)
   
  }
  deployCandidate() {
    console.log("deploycandidateformdata:  ",this.candidateDeployForm.value)
    const deployCand = this.candidateDeployForm.value;
      let formData = new FormData();

      formData.append('candidate', JSON.stringify(deployCand));
      formData.append('file', this.candidateResume);
      console.log(formData);
      this.addrequrementservice.deployCandidate(formData).subscribe(response => {
        console.log(response)
      })


  } 

  ngOnDestroy() {
    console.log("destroy");
    localStorage.removeItem('singlecandidate');
    localStorage.removeItem('getcandidate');
  
  }

}
