import React, { useState, useContext, useEffect } from "react";
import { CoreContext } from "../context/core-context";
// import { DataGrid } from "@material-ui/data-grid";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import Loader from "react-loader-spinner";
import DataGridComponent from "./common/DataGridComponent";
const Moment = require("moment");

const BloodGlucose = (props) => {
  const coreContext = useContext(CoreContext);

  useEffect(coreContext.checkLocalAuth, []);

  const [patientId, setPatientId] = useState("");
  const [userType, setUserType] = useState("");

  const fetchBloodGlucose = () => {
    // const patientId =  localStorage.getItem("userId");
    let userType = localStorage.getItem("userType");
    let patientId = localStorage.getItem("userId");
    // check page if left side menu.
    if (window.location.href.substring("bloodglucose") > 0) {
    }
    if (window.location.href.indexOf("patient-summary") > 0) {
      patientId = localStorage.getItem("ehrId");
      userType = "patient";
      // clear this otherwise will be problem
      localStorage.removeItem("ehrId");
    }
    setUserType(userType);
    coreContext.fetchBloodGlucose(patientId, userType);
  };

  useEffect(fetchBloodGlucose, [coreContext.bloodglucoseData.length]);

  const columns = [
    {
      field: "UserName",
      headerName: "Patient Name",
      width: 220,
      type: "string",
      renderCell: (params) => (
        <a href={`/patient-summary/${btoa(params.row.userId)}`}>
          {" "}
          {params.row.UserName}{" "}
        </a>
      ),
    },
    {
      field: "MeasurementDateTime",
      headerName: "Date Recorded",
      editable: false,
      width: 150,
      type: "dateTime",

      valueFormatter: (params) => {
        const valueFormatted = Moment(params.value).format(
          "MM-DD-YYYY hh:mm A"
        );
        return `${valueFormatted}`;
      },
    },
    {
      field: "bloodglucosemmol",
      headerName: "Blood Glucose (mmol)",
      type: "number",
      editable: false,
      width: 170,
    },
    {
      field: "bloodglucosemgdl",
      headerName: "Blood Glucose (mgdl)",
      type: "number",
      editable: false,
      width: 170,
    },
    {
      field: "meal",
      headerName: "Before/After Meal",
      width: 110,
      editable: false,
      width: 150,
    },

    {
      field: "CreatedDate",
      headerName: "Date Received",
      width: 150,
      editable: false,
      type: "dateTime",

      valueFormatter: (params) => {
        const valueFormatted = Moment(params.value).format(
          "MM-DD-YYYY hh:mm A"
        );
        return `${valueFormatted}`;
      },
    },
    {
      field: "DeviceId",
      headerName: "Device Id",
      width: 150,
      editable: false,
    },
    {
      field: "battery",
      headerName: "Battery",
      type: "number",
      width: 150,
      editable: false,
    },
    // {
    //   field: "sortDateColumn",
    //   headerName: "Action",
    //   width: 300,

    //   renderCell: (params) => (
    //     <div>
    //       {" "}
    //       <a href="#" onClick={() => showEditForm(params.row)}>
    //         {" "}
    //         <PencilSquare />
    //       </a>
    //       <a href="#" onClick={() => deletePatient(params.row)}>
    //         {" "}
    //         <Trash />
    //       </a>
    //     </div>
    //   ),
    // },
    
  ];
  const showEditForm = (patient) => {};
  const deletePatient = (patient) => {};

  const patientcolumns = [
    {
      field: "MeasurementDateTime",
      headerName: "Date Recorded",
      editable: false,
      width: 150,
      type: "dateTime",

      valueFormatter: (params) => {
        const valueFormatted = Moment(params.value).format(
          "MM-DD-YYYY hh:mm A"
        );
        return `${valueFormatted}`;
      },
    },
    // {
    //   field: 'bloodglucosemmol',
    //   headerName: 'Blood Glucose (mmol)',
    //   type: 'number',
    //   editable: false,
    //   width: 200
    // },
    {
      field: "bloodglucosemgdl",
      headerName: "Blood Glucose (mgdl)",
      type: "number",
      editable: false,
      width: 10,
    },
    {
      field: "meal",
      headerName: "Before/After Meal",
      width: 110,
      editable: false,
      width: 150,
    },

    // {
    //   field: 'CreatedDate',
    //   headerName: 'Date Received',
    //   width: 150,
    //   editable: false,type:'dateTime',

    //   valueFormatter: (params) => {
    //       const valueFormatted = Moment(params.value).format('MM-DD-YYYY hh:mm A')
    //        return `${valueFormatted}`;
    //      },

    // },
    {
      field: "DeviceId",
      headerName: "Device Id",
      width: 150,
      editable: false,
    },
    // {
    //   field: 'reading_id',
    //   headerName: 'Reading Id',
    //   type: 'number',
    //   width: 150,
    //   editable: false,
    // },
    {
      field: "battery",
      headerName: "Battery",
      type: "number",
      width: 150,
      editable: false,
    },
    {
      field: "sortDateColumn",
      headerName: "Action",
    },
  ];

  const renderBloodGlucose = () => {
    if (coreContext.bloodglucoseData.length == 0) {
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
    let dgcolumns = columns;
    if (userType === "patient") {
      dgcolumns = patientcolumns;
    }
    if (
      coreContext.bloodglucoseData.length > 0 &&
      coreContext.bloodglucoseData[0].UserName !== undefined
    ) {
      //coreContext.bloodpressureData  = coreContext.bloodpressureData.sort((a,b) => new Moment(b.sortDateColumn) - new Moment(a.sortDateColumn));
      return (
        // <div style={{ height: 680, width: "100%" }}>
        //   {/* {coreContext.bloodglucoseData} */}
        //   <DataGrid
          
        //     rows={coreContext.bloodglucoseData}
        //     columns={dgcolumns}
        //     pageSize={10}
        //     sortingOrder={["desc", "asc"]}
        //     sortModel={[{ field: "MeasurementDateTime", sort: "desc" }]}
        //   />
        // </div>
        <DataGridComponent rows={coreContext.bloodglucoseData} columns={dgcolumns} sortModal={[{ field: "MeasurementDateTime", sort: "desc" }]}/>
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

  return (
    <div className="col">
    <div className="page-title-container mb-3">
    <div className="row">
    <div className="col mb-2">
    <h1 className="mb-2 pb-0 display-4" id="title">Blood Glucose's Information
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
      {renderBloodGlucose()}
    
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

export { BloodGlucose };
