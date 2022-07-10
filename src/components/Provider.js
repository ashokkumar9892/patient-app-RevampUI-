import React, { useState, useContext, useEffect } from "react";
import { CoreContext } from "../context/core-context";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { Modal, Button } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import Input from "./common/Input";
import Switch from "@material-ui/core/Switch";
import swal from "sweetalert";
import Loader from "react-loader-spinner";
import DataGridComponent from "./common/DataGridComponent";


import {
  DataGrid,
  GridColDef,
  GridApi,
  GridCellValue,
} from "@material-ui/data-grid";

import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";

import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(0.5, 0.5, 0),
      justifyContent: "space-between",
      display: "flex",
      alignItems: "flex-start",
      flexWrap: "wrap",
    },
    textField: {
      [theme.breakpoints.down("xs")]: {
        width: "100%",
      },
      margin: theme.spacing(1, 0.5, 1.5),
      "& .MuiSvgIcon-root": {
        marginRight: theme.spacing(0.5),
      },
      "& .MuiInput-underline:before": {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
  }),
  { defaultTheme }
);

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
function QuickSearchToolbar(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}>
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}
QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

const Provider = (props) => {
  const coreContext = useContext(CoreContext);

  useEffect(coreContext.checkLocalAuth, []);

  const [name, setName] = useState("");
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [patientId, setPatientId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [searchText, setSearchText] = React.useState("");
  const [editdoctor, seteditdoctor] = React.useState("");
  const [utype, setutype] = React.useState("");
  const [checked, setChecked] = useState(false);
  const handleModalClose = () => {setShowModal(false);fetchProviders()};
  const handleModalShow = () => setShowModal(true);

  const [showModal, setShowModal] = useState(false);
  const [rows, setRows] = React.useState(coreContext.providerData);
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = coreContext.providerData.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };
  React.useEffect(() => {
    setRows(coreContext.providerData);
  }, [coreContext.providerData]);

  const editProvider = () => {};

  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const fetchProviders = () => {
    const patientId = props.match.params.patient;
    setPatientId(patientId);
    coreContext.fetchProviders(checked);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setVerificationCode("");
  };
  useEffect(resetForm, [coreContext.resetForm]);

  useEffect(fetchProviders, [coreContext.providerData.length]);
{console.log("checking the date",coreContext.providerData)}
const onToggleChangeActiveUsers = (event) => {
  setChecked(event.target.checked);
  let isactiveusrs = event.target.checked;
  
  if (isactiveusrs)
    coreContext.fetchProviders(isactiveusrs);
};
useEffect(fetchProviders, [checked]);
  const columns = [
    {
      field: "provider",
      headerName: "Provider",
      width: 300,
      flex:1
    },
    {
      field: "email",
      headerName: "Email",
      editable: false,
      width: 300,
      flex:1
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 200,
      editable: false,
      flex:1
    },
    {
      field: "ActiveStatus",
      headerName: "ActiveStatus",
      editable: false,
      type: "string",
      width: 130,
      flex:1
    },
    {
      field: "",
      headerName: "Action",
      width: 150,
      flex:1,

      renderCell: (params) => (
        <div style={{marginLeft:"3em"}}>
          {" "}
          <a href="#" onClick={() => showEditForm(params.row)}>
            {" "}
            <PencilSquare />
          </a>
          <a href="#" onClick={() => deletePatient(params.row)}>
            {" "}
            <Trash />
          </a>
        </div>
      ),
    },
  ];

  const onEmailChangedHandler = (e) => {
    setEmail(e.target.value);
    setName(e.target.value);
  };

  const showEditForm = (patient) => {
    setName(patient.provider);
    setPhone(patient.phone);
    setEmail(patient.email);
    //setPatientId(patient.id);
    setPatientId(patient.doctor_id);
    seteditdoctor(patient);
    handleModalShow();
  };

  const deletePatient = (patient) => {
    
    swal({
      title: "Are you sure?",
      
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        coreContext.DeleteDoctor(patient);
        coreContext.setdoctorData([]);
      } else {
        swal("Delete Cancelled");
      }
    });
  };

  const renderProviders = () => {
    if (coreContext.providerData.length == 0) {
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
    if (coreContext.providerData.length > 0) {
      return (
        // <div style={{ height: 680, width: "100%" }}>
        //   <DataGrid
        //     components={{ Toolbar: QuickSearchToolbar }}
        //     rows={rows}
        //     columns={columns}
        //     pageSize={10}
        //     sortModel={[{ field: "provider", sort: "asc" }]}
        //     componentsProps={{
        //       toolbar: {
        //         value: searchText,
        //         onChange: (event) => requestSearch(event.target.value),
        //         clearSearch: () => requestSearch(""),
        //       },
        //     }}
        //   />
        // </div>
        <DataGridComponent rows={coreContext.providerData} columns={columns} sortModal={[{ field: "provider", sort: "asc" }]}/>
      );
    }
  };
  useEffect(renderProviders, [JSON.stringify(coreContext.providerData)]);

  return (
    <>
    <div className="col">
    <div className="page-title-container mb-3">
    <div className="row">
    <div className="col mb-2">
    <h1 className="mb-2 pb-0 display-4" id="title">PROVIDER Information
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
   
    <div className="card mb-3">	
    
    <div className="card-body">
    <div className="row">
  
          				    <div class="col-xl-4">
                                              
                                              <div class="form-floating mb-3">
                                              <input
            type="email"
            value={email}
            onChange={onEmailChangedHandler}
            class="form-control mb-2 mr-sm-2"
            placeholder="Enter email"
          />
                                           <label>Enter email</label>
                                             </div> 
                                    
                                       </div>		
<div class="col-xl-4">
                                          
                                              <div class="form-floating mb-3">
                                              <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            class="form-control mb-2 mr-sm-2"
            placeholder="Enter phone"
          />
                                           <label>Enter phone</label>
                                             </div> 
                                     
                                       </div>		
<div class="col-xl-4">
                                          
                                              <div class="form-floating mb-3">
                                              <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            class="form-control mb-2 mr-sm-2"
            placeholder="Enter password"
          />
                                           <label>Enter password</label>
                                             </div> 
                                     
                                       </div>		
             <div class="col-xl-4">
                               <div class="form-floating mb-3">
                               <input
            type="password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            class="form-control mb-2 mr-sm-2"
            placeholder="Confirm Enter password"
          />
                                           <label>Confirm Password</label>
                                             </div> 
                                    
                                       </div>		
<div class="col-xl-4">
                                           
                                              <div class="form-floating mb-3">
                                              <input
            type="text"
            readOnly={true}
            value={name}
            class="form-control mb-2 mr-sm-2"
            placeholder="Enter User Name"
          />
                                           <label>Enter User Name</label>
                                             </div> 
                                      
                                       </div>	
                                       <div class="col-xl-4">
                                       <div class="form-floating mb-3">
                                       <select name="cars" class="form-control mb-2 mr-sm-2" placeholder="Enter User Type" onChange={(e)=>setutype(e.target.value)} value={utype}>
  <option value="false">Regular</option>
  <option value="true">Test</option>
</select><label>Enter UserType</label>
                                </div>             
                                      
                                       </div>			
		
        </div>
        <div className="row">
				    <div className="col-xl-4">
	<button type="button" class="btn btn-md btn-info mb-2" onClick={() =>
              coreContext.addProvider(name, email, phone, password,utype)
            }>Add Provider</button>
	</div>
</div>
     
    
    </div>
      </div>
      <div className="card mb-3">	

<div className="card-body">
<div className="row">
<div className="col-xl-12">
<div className="table-responsive-sm mb-0">
{renderProviders()}
</div>
</div></div></div></div>
    
      
   
      
    
    
    
    </div>
    
    </div>
      </div>
    
     

      <Modal
        show={coreContext.showProviderModal}
        onHide={coreContext.handleProviderModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Verification Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enter the verification code sent on your Email ID</p>
          <input
            type="text"
            className="form-control"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() =>
              coreContext.verifyProviderVerificationCode(
                verificationCode,
                email,
                "Provider"
              )
            }>
            Submit
          </Button>
          <Button
            variant="secondary"
            onClick={coreContext.handleProviderModalClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Provider </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <label>Name</label>
              <Input
                label="Name"
                elementType="text"
                minLength={5}
                maxLength={55}
                placeholder="Enter name"
                onChange={(e) => setName(e.target.value)}
                name="name"
                value={name}
                required={true}
                register={register}
                errors={errors}
              />
            </div>
         
         
            <div className="col-md-6">
            <label>Phone</label>
              <Input
                label="Phone"
                elementType="text"
                placeholder="Enter phone"
                onChange={(e) => setPhone(e.target.value)}
                required={true}
                minLength={5}
                maxLength={55}
                register={register}
                errors={errors}
                name="phone"
                value={phone}
              />
            </div>
          </div>
<div className="row" style={{marginTop:"1%"}}>
  <div className="col-md-2"></div>
  
          <Input
            blockButton={true}
            value="Submit"
            onClick={() =>
              {coreContext.UpdateProvider(name, phone, email, patientId,editdoctor);coreContext.setdoctorData([]);handleModalClose()}
            }
            elementType="button"
            variant="primary"
            
            
          />
          <div className="col-md-2"></div>
          </div>
          <br />
          <center> {coreContext.renderLoader()}</center>
          <center>
            {" "}
            <Input variant="danger" label={message} elementType="label" />
          </center>
        </Modal.Body>
      </Modal>
      
    
    </>
  );
};

export { Provider };
