import React, { useEffect } from "react";
import { getAllMenus } from "../../../action";
import { connect } from "react-redux";

import { deleteCategory } from "../../../service/Menus";

import notify from "../../toaster";

import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import { TrashFill, PenFill } from "react-bootstrap-icons";

import "./ListCategory.scss";

const ListCategory = (props) => {
  const { listItems,getMenus } = props;

  const handleDeleteAction=async(event,id)=>{
    event.stopPropagation()
    try{
     const res= await deleteCategory(id);
     notify(res,'success');
     getMenus();
    }catch(e){
      notify(e.message)
    }

  }

  return (
    <>
      <div className="br-list-categories">
        <div className="br-list-categories__title">Menu data</div>
        <Accordion defaultActiveKey="0">
          {listItems &&
            listItems.map((item, index) => (
              <Accordion.Item eventKey={`${index}`} key={item.id}>
                <Accordion.Header>
                  <div className="br-list-categories__title-container">
                    <div> {item.name}</div>
                    <div>
                      <div
                        className=" btn btn-success  br-list-categories__title-containers__actions"
                        variant="success"
                      >
                        <PenFill />
                      </div>
                      <span className="br-list-categories__title-containers__text">
                        or
                      </span>
                      <div
                        className="btn btn-danger"
                        variant="success"
                        onClick={(event)=>  handleDeleteAction(event,item.id)}
                      >
                        <TrashFill />
                      </div>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="br-list-categories__description-container">
                    <div>Description</div>
                    <div>{item.description || "No desccription found"}</div>
                  </div>
                  <hr />
                </Accordion.Body>
              </Accordion.Item>
            ))}
        </Accordion>
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getMenus: () => dispatch(getAllMenus()),
});


export default connect(null,mapDispatchToProps)(ListCategory);