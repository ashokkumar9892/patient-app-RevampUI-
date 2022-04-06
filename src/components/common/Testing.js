import React, { useState, useContext, useEffect } from "react";
import { CoreContext } from "../../context/core-context";
import { DataGrid } from "@material-ui/data-grid";
import Loader from "react-loader-spinner";
import DataGridComponent from "../../components/common/DataGridComponent";

const Testing = (props) => {
  const coreContext = useContext(CoreContext);

  useEffect(coreContext.checkLocalAuth, []);
  const fetchDevice = () => {
    const patient = JSON.parse(localStorage.getItem("app_patient"));
    let patientId = localStorage.getItem("userId");
    let userType = localStorage.getItem("userType");
    let userName = localStorage.getItem("userName");
    if (patient != undefined) {
      if (patient.ehrId !== undefined) {
        patientId = patient.ehrId;
        userType = "patient";
        userName = patient.name;
      }
    }

    if (patientId !== undefined) {
      if (userType == "admin") {
        coreContext.fetchPatientListfromApi("admin", null);
        if (coreContext.patients.length > 0) {
          coreContext.fetchDeviceData(
            patientId,
            userName,
            userType,
            "",
            coreContext.patients
          );
        }
      }
      if (userType == "doctor") {
        coreContext.fetchPatientListfromApi("doctor", patientId);
        if (coreContext.patients.length > 0) {
          console.log("coreContext.patients",coreContext.patients)
          coreContext.fetchDeviceData(
            patientId,
            userName,
            userType,
            "",
            coreContext.patients
          );
        }
      }
    }
  };

  useEffect(fetchDevice, [coreContext.patients.length]);

  const columns = [
    {
      field: "username",
      headerName: "Patient Name",
      flex:1,
      type: "string",
    },
    {
      field: "deviceID",
      headerName: "Device ID",
      editable: false,
      flex:1,
    },
    {
      field: "DeviceType",
      headerName: "Device Type",
      flex:1,
      editable: false,
    },
    {
      field: "status",
      headerName: "Status",
      flex:1,
      type: "string",
    },
  ];

  //https://material-ui.com/components/data-grid/

  const renderdeviceinfo = () => {
    if (coreContext.deviceData.length == 0) {
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
      coreContext.deviceData.length > 0 &&
      coreContext.deviceData[0].username !== undefined
    ) {
      var date = new Date();
date.setDate(date.getDate() - 7);
date.setHours(0,0,0,0)
      let rows=[];
      let bpdevice=[];
      let bgdevice=[];
      let wsdevice=[];
      coreContext.bloodpressureData.filter((data)=>data.MeasurementDateTime>date).map((curr)=>{
        if(!bpdevice.includes(curr.DeviceId)){
          bpdevice.push(curr.DeviceId)
        }
      })
      coreContext.bloodglucoseData.filter((data)=>data.MeasurementDateTime>date).map((curr)=>{
        if(!bgdevice.includes(curr.DeviceId)){
          bgdevice.push(curr.DeviceId)
        }
      })
      coreContext.weightData.filter((data)=>data.MeasurementDateTime>date).map((curr)=>{
        if(!wsdevice.includes(curr.DeviceId)){
          wsdevice.push(curr.DeviceId)
        }
      })
      coreContext.deviceData.map((curr)=>{
        if(bpdevice.includes(curr.deviceID)==true || bgdevice.includes(curr.deviceID)==true || wsdevice.includes(curr.deviceID)==true){
          curr.status="ok"
        }else{
          curr.status="Fail"
        }
        
        rows.push(curr)
        
      })
      
     
      return (
        // <div style={{ height: 680, width: "100%" }}>
        //   <DataGrid
        //     rows={coreContext.deviceData}
        //     columns={columns}
        //     pageSize={10}
        //     sortModel={[{ field: "deviceID", sort: "asc" }]}
        //   />
        // </div>
        <DataGridComponent rows={rows} columns={columns} sortModal={[{ field: "status", sort: "asc" }]}/>
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
const checkdevice=()=>{
    
}
  return (
    // <div className="card">
    //   <h4 className="card-header">Device information</h4>

    //   <div className="card-body">{renderdeviceinfo()}</div>
    // </div>
    <div className="col">
    <div className="page-title-container mb-3">
    <div className="row">
    <div className="col mb-2">
    <h1 className="mb-2 pb-0 display-4" id="title">Device Information
    </h1>
    </div>
    </div>
    </div>
    
    <div className="row">
    <div className="col-xl-12">
   
    <div className="card mb-3">	
    
    <div className="card-body">
    <div className="row">
    <div className="col-xl-12">
    <div className="table-responsive-sm mb-0">
      {renderdeviceinfo()}
    
    </div>
      
    
      
    </div>
      
    
    
    
    </div>
    
    </div>
      </div>
    </div>
    </div>
      </div>
  );
};



export default Testing