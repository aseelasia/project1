import React from "react";
import ReactPaginate from 'react-paginate';
import '../style.css';
import AddModal from './AddModal';
import EditModal from './EditModal';
import AddSkillModal from './AddSkillModal';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';

import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  ButtonToolbar,
  CardFooter,
} from "reactstrap";

class Category extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
        offset: 0,
        tableData: [],
        orgtableData: [],
        perPage: 5,
        currentPage: 0,
        isLoading:false,
        isDataAvailable:false,
        addModalShow:false,
        editModalShow:false,
        addSkillModalShow:false,
    }
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
        currentPage: selectedPage,
        offset: offset
    }, () => {
        this.loadMoreData()
    });
  };

  loadMoreData() {
  const data = this.state.orgtableData;
  const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
    this.setState({
      pageCount: Math.ceil(data.length / this.state.perPage),
      tableData:slice
    })
  }

  componentWillMount(){
    this.getData();
  }

  getData() {
    fetch('http://127.0.0.1:5000/table_search_job_category/')
    .then(response => response.json())
    .then(data => {
      var data1 = data;
      var slice = data1.slice(this.state.offset, this.state.offset + this.state.perPage)
      this.setState({
        pageCount: Math.ceil(data1.length / this.state.perPage),
        orgtableData :data,
        tableData:slice,
        isDataAvailable:true,
        isLoading:true,
      });
    });
  }

  deleteJobCategory(job_category_name){
    if(window.confirm('Are you sure you want to delete it?')){
      fetch('http://127.0.0.1:5000/delete_job_category/', {
        method:'POST',
        mode: 'cors',
        headers:new Headers({
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'*'
        }),
        body:JSON.stringify({
            job_category_name:job_category_name,
        })
      })
      .then(function(response) {
        return response.json()
    })
    .then((result) => {
        this.setState({
            Snackbaropen:true,
            Snackbarmsg:'deleted successfully'
        });
    },
    (error)=>{
        this.setState({
            Snackbaropen:true,
            Snackbarmsg:'Failed'
        });
    })
    }
  }

  render() {
    const {tableData, oldJobCategoryName, category } = this.state;
    let addModalClose=()=> this.setState({addModalShow:false});
    let editModalClose=()=> this.setState({editModalShow:false});
    let addSkillModalClose=()=> this.setState({addSkillModalShow:false});
    const isLoading = this.state.isLoading;
    const isDataAvailable = this.state.isDataAvailable;

    return (
      <>
        <div className="header bg-gradient-red pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              <ButtonToolbar>
                <IconButton aria-label="add">
                  <AddIcon  onClick={()=> this.setState({addModalShow:true})}/>
                </IconButton>
                <AddModal 
                  show = {this.state.addModalShow}
                  onHide={addModalClose}
                />
              </ButtonToolbar>
            </div>
          </Container>
        </div>
        <Container className="mt--7" fluid>
          <Row>
            <div className="col">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <h3 className="mb-0">Tables</h3>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                  <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name Job Category</th>
                      <th scope="col">Name Job Offer</th>
                      <th scope="col">Actions</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                    {isDataAvailable
                    ?
                    <tbody>
                      {tableData.map((tdata,index) => (
                        <tr>
                          <td>{index+1}</td>
                          <td>{tdata.job_category_name}</td>
                          <td>{tdata.name_job_offer}</td>
                          <td>
                            <ButtonToolbar>
                                <IconButton aria-label="add1">
                                    <AddBoxIcon
                                    onClick={() => this.setState({
                                    addSkillModalShow:true,
                                    category : tdata.job_category_name
                                    })}
                                    />
                                </IconButton>
                                <IconButton aria-label="edit">
                                    <EditIcon
                                    onClick={() => this.setState({
                                    editModalShow:true,
                                    oldJobCategoryName : tdata.job_category_name
                                    })}
                                    />
                                </IconButton>
                                <IconButton aria-label="delete">
                                    <DeleteIcon  onClick={() => this.deleteJobCategory(tdata.job_category_name)}/>
                                </IconButton>                            
                                <EditModal 
                                    show = {this.state.editModalShow}
                                    onHide={editModalClose}
                                    oldJobCategoryName = {oldJobCategoryName}
                                />
                                <AddSkillModal 
                                    show = {this.state.addSkillModalShow}
                                    onHide={addSkillModalClose}
                                    category = {category}
                                />
                            </ButtonToolbar>
                          </td>
                        </tr>
                      )
                      )}
                      </tbody>
                    :<tbody>
                      <tr>
                        <td>No matching record data</td>
                      </tr>
                    </tbody>
                    }
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                  {isLoading
                  ?                    
                    <ReactPaginate
                      previousLabel={"prev"}
                      nextLabel={"next"}
                      breakLabel={"..."}
                      breakClassName={"break-me"}
                      pageCount={this.state.pageCount}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={this.handlePageClick}
                      containerClassName={"pagination"}
                      subContainerClassName={"pages pagination"}
                      activeClassName={"active"}
                    />
                    :
                    <div style={{height:"200px"}}></div>
                  }
                  </nav>
                </CardFooter>
                
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Category;
