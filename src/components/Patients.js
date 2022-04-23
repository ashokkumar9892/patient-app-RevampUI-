/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useContext, useState } from "react";
import { CoreContext } from "../context/core-context";
import { Table, Pagination, Modal, Button, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { PencilSquare, Trash, Person } from "react-bootstrap-icons";
import { IconName } from "react-icons/bs";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import swal from 'sweetalert';
import DataGridComponent from "./common/DataGridComponent";
import {
  BrowserRouter as Router,
  Route,
  
  Redirect,
  Link
} from "react-router-dom";

import Input from "./common/Input";
import * as React from "react";
import Switch from "@material-ui/core/Switch";
import moment from 'moment';

import {
  DataGrid,
  GridColDef,
  GridApi,
  GridCellValue,
} from "@material-ui/data-grid";

import Loader from "react-loader-spinner";
const Moment = require("moment");
const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiDataGrid-columnHeaderCheckbox": {
      display: "block",
      pointerEvents: "none",
      disabled: "disabled",
    },
  },
}));

const Patients = (props) => {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  //const [select, setSelection] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [height, setHeight] = useState("");
  const [provider, setProvider] = useState("");
  const [coach, setCoach] = useState("");
  const [coordinator, setCoordinator] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [actionPatients, setActionPatients] = useState([]);
  const [checked, setChecked] = useState(false);
  const [dcount, setdcount] = useState([""]);
  const [diagnosisId, setDiagnosisId] = useState("");

  const handleModalClose = () => {setShowModal(false);setdcount([""])};
  const handleModalShow = () => setShowModal(true);

  const handleAssignDrModalClose = () => setAssignDrShowModal(false);
  const handleAssignDrModalShow = () => setAssignDrShowModal(true);
  const [showAssignDrModal, setAssignDrShowModal] = useState(false);
  const [usertype, setuserType] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [workPhone, setWorkPhone] = useState("");
  const [mobilePhone, setMobilePhone] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const editPatient = () => {};
  const coreContext = useContext(CoreContext);

  const fetchPatients = () => {
    const email = localStorage.getItem("app_userEmail");
    coreContext.userDetails(email);
    const userType = localStorage.getItem("userType");
    setuserType(userType);
    const userId = localStorage.getItem("userId");
    if (checked) {
      coreContext.fetchPatientListfromApi(userType, userId, checked);
    } else {
      coreContext.fetchPatientListfromApi(userType, userId);
    }
  };

  const fetchProviders = () => {
    coreContext.fetchProviders();
  };
  const handledcount = (index,val) => {
    const value=[...dcount]
    value[index]=val
    setdcount(value);
    
    
  };
  const handlefinalsubmit=()=>{
    var newId= ""
    dcount.map((curr)=>{
      newId=newId+","+curr
    })
    coreContext.UpdatePatient(
      fname,
      lname,
      phone,
      birthDate,
      height,
      provider,
      coordinator,
      coach,
      patientId,
      gender,
      language,
      workPhone,
      mobilePhone,
      street,
      zip,
      city,
      state,
      newId.substring(1)
    );
  }

  useEffect(fetchProviders, []);

  const fetchCareCoordinator = () => {
    coreContext.fetchCareCoordinator();
  };

  useEffect(fetchCareCoordinator, []);

  const fetchCoach = () => {
    coreContext.fetchCoach();
  };

  useEffect(fetchCoach, []);

  useEffect(coreContext.checkLocalAuth, []);
  useEffect(fetchPatients, []);

  function formatAMPM(date) {
    var d = new Date(date);
    //alert(d);

    var mm = d.getMonth() + 1;
    var dd = d.getDate();
    var yy = d.getFullYear();
    //alert(yy);
    var strTime = mm + "-" + dd + "-" + yy;
    //alert(strTime);
    //console.log(strTime);
    return strTime;
  }
  const showEditForm = (patient) => {
    {
      console.log("checking", patient);
    }
    if (patient.name !== undefined) {
      patient.lastName = patient.name.split(",")[0].trim();
      patient.firstName = patient.name.split(",")[1].trim();
    }
    if (patient.diagnosisId ) {
      setdcount(patient.diagnosisId.split(","))
    }
    setFName(patient.firstName);
    setLName(patient.lastName);
    setBirthDate(moment(patient.dob).format('YYYY-MM-DD'));
    console.log(moment(patient.dob).format('YYYY-MM-DD'),"format")
    setPhone(patient.mobile);
    setPatientId(patient.userId);
    setHeight(patient.height);
    console.log(patient.gender,"patient.gender")
    // patient.gender == "Female" ? setGender(1) : setGender(0);
    patient.gender == "Female" ? setGender(1) : setGender(0);
    // setGender(patient.gender);
    // setLanguage(patient.language);
    patient.language == "English"? setLanguage(0) : setLanguage(1);
    setWorkPhone(patient.workPhone);
    setMobilePhone(patient.mobilePhone);
    setStreet(patient.street);
    setZip(patient.zip);
    setCity(patient.city);
    setState(patient.state);

    if (patient.ProviderName === undefined) {
      patient.ProviderName = "Select Provider";
      setProvider("");
    } else {
      //console.log(coreContext.providerOptions,"coreContext.providerOptions")
      

      // coreContext.providerOptions.filter((name)=>{
      //   console.log(name.name , "namefilter")
      //   if(name.name.includes(patient.ProviderName)){
      //     setProvider(patient.ProviderName)
      //   }
      //   else{
      //     setProvider("");
      //   }
        
      // })
      setProvider(
        coreContext.providerOptions.filter((name) =>
          name.name.includes(patient.ProviderName)
        )[0].value !== undefined ?  coreContext.providerOptions.filter((name) =>
        name.name.includes(patient.ProviderName)
      )[0].value : ""
      );
    

      // setProvider(
      //   coreContext.providerOptions.filter((name) =>
      //     name.name.includes(patient.ProviderName)
      //   )[0].value
      // );
    }

    if (patient.CareName === undefined) {
      patient.CareName = "Select Coordinator";
      setCoordinator("");
    } else {
      setCoordinator(
        coreContext.careCoordinatorOptions.filter((name) =>
          name.name.includes(patient.CareName)
        )[0].value
      );
    }

    if (patient.CoachName === undefined) {
      patient.CoachName = "Select Coach";
      setCoach("");
    } else {
      setCoach(
        coreContext.coachOptions.filter((name) =>
          name.name.includes(patient.CoachName)
        )[0].value
      );
    }

    handleModalShow();
  };

  const showAssignDoctor = (patient) => {
    setFName(patient.firstName);
    setLName(patient.lastName);
    setBirthDate(patient.dob);
    setPhone(patient.mobile);
    setPatientId(patient.userId);
    if (patient.ProviderName === undefined) {
      patient.ProviderName = "Select Provider";
      setProvider("");
    } else {
      let _provider = coreContext.providerOptions.filter(
        (name) => name.name === patient.ProviderName
      );
      if (_provider.length > 0) setProvider(_provider[0].value);
    }

    if (patient.CareName === undefined) {
      patient.CareName = "Select Coordinator";
      setCoordinator("");
    } else {
      let _coordinator = coreContext.careCoordinatorOptions.filter(
        (name) => name.name === patient.CareName
      );
      if (_coordinator.length > 0) setCoordinator(_coordinator[0].value);
    }

    if (patient.CoachName === undefined) {
      patient.CoachName = "Select Coach";
      setCoach("");
    } else {
      let _coach = coreContext.coachOptions.filter(
        (name) => name.name === patient.CoachName
      );
      if (_coach.length > 0) setCoach(_coach[0].value);
    }
    handleAssignDrModalShow();
  };

  const onToggleChangeActiveUsers = (event) => {
    setChecked(event.target.checked);
    let isactiveusrs = event.target.checked;
    let userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");
    if (isactiveusrs)
      coreContext.fetchPatientListfromApi(userType, userId, isactiveusrs);
  };

  useEffect(fetchPatients, [coreContext.patients.length]);
  useEffect(fetchPatients, [checked]);
  useEffect(() => {
   
    return () => {
      coreContext.cleanup();
    };
  },[]);
  const deletePatient = (patient) => {

    swal({
      title: "Are you sure?",
      
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        coreContext.DeletePatient(patient.userId);
        fetchPatients();

      } else {
        swal("Delete Cancelled");
      }
    });
    
  };

  const admincolumns = [
    {
      field: "name",
      headerName: "Patient Name",
      width: 150,
      fleex:1,
      renderCell: (params) => (
        <Link to={`/patient-summary/${btoa(params.row.userId)}`}>
          {" "}
          {params.value}{" "}
        </Link>
      ),
    },
    {
      field: "ProviderName",
      headerName: "Provider",
      editable: false,
      width: 150,
    },
    {
      field: "CareName",
      headerName: "Care",
      width: 150,
      editable: false,
    },
    {
      field: "CoachName",
      headerName: "Coach",
      editable: false,
      width: 150,
    },
    {
      field: "height",
      headerName: "Height",
      editable: false,
      type: "number",
      width: 150,
    },
    {
      field: "bg_reading",
      headerName: "Glucose",
      editable: false,
      type: "number",
      width: 150,
    },
    {
      field: "ActiveStatus",
      headerName: "ActiveStatus",
      editable: false,
      type: "string",
      width: 150,
    },
    // {
    //   field: 'Weight',
    //   headerName: 'Weight',
    //   type: "number",
    //   width: 125,
    //   editable: false,
    // },
    // {
    //   field: 'diastolic',
    //   headerName: 'Diastolic',
    //   type: "number",
    //   width: 140,
    //   editable: false,
    // },
    // {
    //   field: 'systolic',
    //   headerName: 'Systolic',
    //   type: "number",
    //   width: 140,
    //   editable: false,
    // },
    // {
    //   field: 'BMI',
    //   headerName: 'BMI',
    //   width:175,
    //   editable: false,
    // },
    {
      field: "",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div style={{ width: "100px" }}>
          <Link
            style={{ marginRight: "5px" }}
            to="#"
            onClick={() => showEditForm(params.row)}>
            {" "}
            <PencilSquare />
          </Link>
          {/* {console.log("sahil",params.row)} */}
          <Link
            style={{ marginRight: "5px" }}
            to="#"
            onClick={() => {
              deletePatient(params.row);
              fetchPatients();
            }}>
            {" "}
            <Trash />
          </Link>
          <Link
            style={{ marginRight: "5px" }}
            to="#"
            onClick={() => showAssignDoctor(params.row)}>
            {" "}
            <Person />
          </Link>
        </div>
      ),
    },
  ];

  const columns = [
    {
      field: "name",
      headerName: "Patient Name",
      width: 220,
      renderCell: (params) => (
        <Link to={`/patient-summary/${btoa(params.row.userId)}`}>
          {" "}
          {params.value}{" "}
        </Link>
      ),
    },
    {
      field: "ProviderName",
      headerName: "Provider",
      editable: false,
      width: 200,
    },
    {
      field: "CareName",
      headerName: "Care",
      width: 150,
      editable: false,
    },
    {
      field: "CoachName",
      headerName: "Coach",
      editable: false,
      width: 150,
    },
    {
      field: "height",
      headerName: "Height",
      editable: false,
      type: "number",
      width: 100,
    },
    {
      field: "bg_reading",
      headerName: "Glucose",
      editable: false,
      type: "number",
      width: 100,
    },
    {
      field: "ActiveStatus",
      headerName: "ActiveStatus",
      editable: false,
      type: "string",
      width: 130,
    },
    // {
    //   field: 'Weight',
    //   headerName: 'Weight',
    //   type: "number",
    //   width: 125,
    //   editable: false,
    // },
    // {
    //   field: 'diastolic',
    //   headerName: 'Diastolic',
    //   type: "number",
    //   width: 140,
    //   editable: false,
    // },
    // {
    //   field: 'systolic',
    //   headerName: 'Systolic',
    //   type: "number",
    //   width: 140,
    //   editable: false,
    // },
    {
      field: "BMI",
      headerName: "BMI",
      width: 175,
      editable: false,
    },
    {
      field: "",
      headerName: "Action",
      width: 120,
      renderCell: (params) => (
        <div style={{ width: "100px" }}>
          <Link
            style={{ marginRight: "5px" }}
            to="#"
            onClick={() => showEditForm(params.row)}>
            {" "}
            <PencilSquare />
          </Link>
          <Link
            style={{ marginRight: "5px" }}
            to="#"
            onClick={() => {
              deletePatient(params.row);
              fetchPatients();
            }}>
            {" "}
            <Trash />
          </Link>
          {/* <Link  style={{  marginRight: '5px' }} to="#" onClick={() => showAssignDoctor(params.row)}>  <Person /></Link> */}
        </div>
      ),
    },
  ];

  // const useStyles = makeStyles((theme) => (
  //     {
  //         colCell: {
  //         color: "Red"
  //     }
  //   }));

  // const classes = useStyles();

  const renderPatients = () => {
    if (coreContext.patients.length === 0) {
      return (
        <div
          style={{
            height: 680,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            alignItems: "center",
          }}>
          <Loader type="Circles" color="#00BFFF" height={100} width={100} />
        </div>
      );
    }
    if (
      coreContext.patients.length > 0 &&
      usertype === "admin" &&
      coreContext.patients[0].name !== undefined
      && coreContext.providerOptions.length>0 && coreContext.coachOptions.length>0 && coreContext.careCoordinatorOptions.length>0
    ) 
    console.log("uttkarsh patients",coreContext.patients)
    {
      return (
        <>
          {/* <div style={{ height: 680, width: "100%" }}>
            <DataGrid
              className={classes.root}
              rows={coreContext.patients}
              columns={admincolumns}
              pageSize={10}
              sortModel={[{ field: "name", sort: "asc" }]}
              //             checkboxSelection

              // onSelectionModelChange={(selection) => {
              //   const newSelectionModel = selection.selectionModel;

              //   if (newSelectionModel.length > 1) {
              //     const selectionSet = new Set(selectionModel);
              //     const result = newSelectionModel.filter(
              //       (s) => !selectionSet.has(s)
              //     );

              //     setSelectionModel(result);
              //   } else {
              //     setSelectionModel(newSelectionModel);
              //   }
              // }}
              // selectionModel={selectionModel}
            />
            {console.log(coreContext.patients[selectionModel])} */}
          {/* </div> */}
          <DataGridComponent rows={coreContext.patients} columns={admincolumns} sortModal={[{ field: "name", sort: "asc" }]}/>
          {/* <center>{select}sa</center> */}
        </>
      );
    }
    if (
      coreContext.patients.length > 0 &&
      usertype !== "admin" &&
      coreContext.patients[0].name !== undefined
    ) {
      return (
        
<DataGridComponent rows={coreContext.patients} columns={columns} sortModal={[{ field: "name", sort: "asc" }]}/>
        );
    } else {
      return (
        <div
          style={{
            height: 60,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            alignItems: "center",
          }}>
          <h1>No data Found</h1>
        </div>
      );
    }
  };
  useEffect(renderPatients, [JSON.stringify(coreContext.patients),coreContext.patients.length]);


  return (
    <React.Fragment>
      
      <div className="col">
<div className="page-title-container mb-3">
<div className="row">
<div className="col mb-2">
<h1 className="mb-2 pb-0 display-4" id="title">Patient's Information
</h1>
</div>
<div className="col-sm-1 col-2" style={{width:"70px"}}>
                                                <div className="form-group"><label for="inputName" className="text-14 mts text-black"><strong>Active</strong></label>
                                                    
                                           </div>
                                            </div>
						<div className="col-sm-3 col-5"><label className="switch">
                                 <input type="checkbox" checked={checked} onChange={onToggleChangeActiveUsers}/>
                             <span className="slider round"></span>
                                 </label></div>


</div>
</div>

<div className="row">
<div className="col-xl-12">
{/* <div className="card mb-3">
<div className="card-body">
<div className="row mtm">
				    <div className="col-sm-2 col-2" style={{width:"70px"}}>
                                                <div className="form-group"><label for="inputName" className="text-14 mts text-black"><strong>Active</strong></label>
                                                    
                                           </div>
                                            </div>
						<div className="col-sm-5 col-5"><label className="switch">
                                 <input type="checkbox" checked={checked} onChange={onToggleChangeActiveUsers}/>
                             <span className="slider round"></span>
                                 </label></div>
						 </div>
</div>
</div> */}
<div className="card mb-3">	

<div className="card-body">
<div className="row">
<div className="col-xl-12">
<div className="table-responsive-sm mb-0">
  {renderPatients()}

</div>
	

	
</div>
	



</div>

</div>
	</div>
</div>
</div>
	</div>
	
      

      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Patient </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            autoComplete="off"
            onSubmit={handleSubmit(editPatient)}
            noValidate>
            <div className="row">
              <div className="col-md-6">
              <label for="html">First Name</label>

                <Input
                  label="First Name*"
                  elementType="text"
                  placeholder="Enter First Name"
                  onChange={(e) => setFName(e.target.value)}
                  name="name"
                  value={fname}
                  required={true}
                  register={register}
                  errors={errors}
                  maxLength={50}
                />
<label for="html">Phone</label>
                <Input
                  label="Phone*"
                  elementType="text"
                  placeholder="Enter phone"
                  onChange={(e) => setPhone(e.target.value)}
                  required={true}
                  minLength={5}
                  maxLength={50}
                  register={register}
                  errors={errors}
                  name="phone"
                  value={phone}
                />
<label for="html">Date of Birth</label>
                <Input
                  label="Date of Birth*"
                  elementType="date"
                  placeholder="Enter dob"
                  onChange={(e) => setBirthDate(e.target.value)}
                  required={true}
                  maxLength={50}
                  register={register}
                  errors={errors}
                  name="dob"
                  value={birthDate}
                  pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                />
               {/* <DatePicker
                          className="form-control mt-2"
                          selected={birthDate}
                          required={true}
                  register={register}
                  errors={errors}
                          
                          
                          
                          onChange={(birthDate) => {
                            setBirthDate()
                          }}
                          placeholderText="Enter a date"
                          dateFormat="MM/dd/yyyy"
                        /> */}
                {console.log(birthDate)}
                {/* <input type="date"/> */}
                <label for="html">Height</label>
                <Input
                  label="Height (Inch)*"
                  elementType="number"
                  minLength={1}
                  maxLength={55}
                  placeholder="Enter height"
                  onChange={(e) => setHeight(e.target.value)}
                  name="height"
                  value={height}
                  required={true}
                  register={register}
                  errors={errors}
                />
                <label for="html">Gender</label>

                <Input
                  label="Gender*"
                  name="gender"
                  required={true}
                  register={register}
                  errors={errors}
                  elementType="select"
                  value={gender}
                  options={coreContext.genderOptions}
                  onChange={(e) => setGender(e.target.value)}
                />
<label for="html">Mobile Phone</label>
                <Input
                  label="Mobile Phone*"
                  name="mobilePhone"
                  required={true}
                  register={register}
                  errors={errors}
                  elementType="text"
                  value={mobilePhone}
                  maxLength={50}
                  onChange={(e) => setMobilePhone(e.target.value)}
                />
<label for="html">Mailing Address</label>
                <Input
                  label="Mailing address"
                  name="street"
                  required={false}
                  register={register}
                  errors={errors}
                  elementType="text"
                  maxLength={50}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
<label for="html">City</label>
                <Input
                  label="City"
                  name="city"
                  required={false}
                  register={register}
                  errors={errors}
                  elementType="text"
                  value={city}
                  maxLength={50}
                  onChange={(e) => setCity(e.target.value)}
                />  
                <div className="row">
                <div className="col-md-10">

{
                  dcount.map((curr,index)=>{
                    return(
                      <>
                      {/* <Form.Control
                    onChange={(e) => }
                    value={dcount[index]}
                    size="sm"
                    type="text"
                    placeholder="Enter Diagnosis ID"
                  
                  /> */}
                  <label for="html">Diagnosis</label>
                
                  <Input
                  label="Diagnosis"
                  name="diagnosisId"
                  required={false}
                  register={register}
                  errors={errors}
                  elementType="text"
                  value={dcount[index]}
                  maxLength={50}
                  onChange={(e) => handledcount(index,e.target.value)}
                />
               
                  
                 
                 
                  </>
                    )
                  })}
                     </div>
                  <div className="col-md-2 mt-4">
                  <Button onClick={()=>setdcount([...dcount,""])}>+</Button>
                  </div>
                  </div>
              </div>
              <div className="col-md-6">
                {console.log("sssss", provider)}
                {/* <Input label='Height (Inch)' placeholder='Enter height' onChange={e => setHeight(e.target.value)} name='height' value={provider} required={true} register={register} errors={errors} /> */}
                <label for="html">Last Name</label>
                <Input
                  label="Last Name*"
                  elementType="text"
                  placeholder="Enter Last Name"
                  onChange={(e) => setLName(e.target.value)}
                  name="name"
                  value={lname}
                  required={true}
                  register={register}
                  maxLength={50}
                  errors={errors}
                />
<label for="html">Provider</label>
                <Input
                  label="Provider"
                  name="provider"
                  required={false}
                  register={register}
                  errors={errors}
                  elementType="select"
                  value={provider}
                  maxLength={50}
                  options={coreContext.providerOptions}
                  onChange={(e) => setProvider(e.target.value)}
                />
                {/* {console.log(coreContext.careCoordinatorOptions,coreContext.coachOptions)} */}
                <label for="html">Care Coordinator</label>
                <Input
                  label="Care Coordinator"
                  name="coordinator"
                  required={false}
                  register={register}
                  errors={errors}
                  elementType="select"
                  maxLength={50}
                  value={coordinator}
                  options={coreContext.careCoordinatorOptions}
                  onChange={(e) => setCoordinator(e.target.value)}
                />
<label for="html">Coach Name</label>
                <Input
                  label="Coach Name"
                  name="coach"
                  required={false}
                  register={register}
                  maxLength={50}
                  errors={errors}
                  elementType="select"
                  value={coach}
                  options={coreContext.coachOptions}
                  onChange={(e) => setCoach(e.target.value)}
                />
<label for="html">Language</label>
                <Input
                  label="Language*"
                  name="language"
                  required={true}
                  register={register}
                  errors={errors}
                  elementType="select"
                  value={language}
                  maxLength={50}
                  options={coreContext.languageOptions}
                  onChange={(e) => setLanguage(e.target.value)}
                />
<label for="html">Work Phone</label>
                <Input
                  label="Work Phone"
                  name="workPhone"
                  required={false}
                  register={register}
                  errors={errors}
                  elementType="text"
                  value={workPhone}
                  maxLength={50}
                  onChange={(e) => setWorkPhone(e.target.value)}
                />
<label for="html">Zip Code</label>
                <Input
                  label="Zip Code"
                  name="zip"
                  required={false}
                  register={register}
                  errors={errors}
                  maxLength={50}
                  elementType="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
<label for="html">State</label>
                <Input
                  label="State"
                  name="State"
                  required={false}
                  register={register}
                  errors={errors}
                  maxLength={50}
                  elementType="text"
                  value={state}
                 
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
            <Input
              blockButton={true}
              value="Submit"
              onClick={() => {
                handlefinalsubmit();
                fetchPatients();
                setShowModal(false);
                setdcount([""])
                fetchPatients();
                fetchPatients();
                

                //alert("updated");
              }}
              elementType="button"
              variant="primary"
            />
            <br />
            <center> {coreContext.renderLoader()}</center>
            <center>
              {" "}
              <Input variant="danger" label={message} elementType="label" />
            </center>
          </Form>
        </Modal.Body>
      </Modal>

      <div >
        <Modal show={showAssignDrModal} onHide={handleAssignDrModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Assign Care Team </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              autoComplete="off"
              onSubmit={handleSubmit(editPatient)}
              noValidate>
              <div>
                <div>
                  <Input
                    label="Provider"
                    name="coordinator"
                    required={false}
                    register={register}
                    errors={errors}
                    elementType="select"
                    value={provider}
                    options={coreContext.providerOptions}
                    onChange={(e) => setProvider(e.target.value)}
                  />

                  <Input
                    label="Care Coordinator"
                    name="care"
                    required={false}
                    register={register}
                    errors={errors}
                    elementType="select"
                    value={coordinator}
                    options={coreContext.careCoordinatorOptions}
                    onChange={(e) => setCoordinator(e.target.value)}
                  />

                  <Input
                    label="Coach Name"
                    name="coach"
                    required={false}
                    register={register}
                    errors={errors}
                    elementType="select"
                    value={coach}
                    options={coreContext.coachOptions}
                    onChange={(e) => setCoach(e.target.value)}
                  />
                </div>
              </div>
              <Input
                blockButton={true}
                value="Submit"
                onClick={() => {
                  coreContext.AssignCareTeam(
                    provider,
                    coordinator,
                    coach,
                    patientId
                  );
                  setAssignDrShowModal(false);
                  fetchPatients();
                }}
                elementType="button"
                variant="primary"
              />
              <br />
              <center> {coreContext.renderLoader()}</center>
              <center>
                {" "}
                <Input variant="danger" label={message} elementType="label" />
              </center>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export { Patients };
