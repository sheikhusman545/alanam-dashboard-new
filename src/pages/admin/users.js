import Admin from "@/layouts/Admin";
import SimpleHeader from "components/Headers/SimpleHeader.js";
import React, { useEffect, useState } from "react";
import AdminUserFunctions from "../../api/adminusers";
import useApi from "api/hooks/apihook";
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import { Delete, DeleteForever, Edit, Visibility } from "@mui/icons-material";
import useReport, { ReportHeader } from "api/hooks/useReport";
import Select from 'react-select'
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "api/hooks/apiutils";
import {
    Badge,
    Button,
    Card,
    CardHeader,
    CardFooter,
    Media,
    Modal,
    Table,
    Container,
    Row,
    Col,
    CardBody,
    Form,
    FormGroup,
    InputGroup,
    Input,
    Collapse,
} from "reactstrap";

const Users = () => {

    const uRS = useReport(); //useReportStates

    const [users, setUsers] = useState([]);
    const [modalShow_AddEditUser, setModalShow_AddEditUser] = useState(false);
    const [choosenUser, setChoosenUser] = useState(null);
    const [modalReadOnly_Admin, setModalReadOnly_Admin] = useState(false);
    const [userTypes, setUserTypes] = useState([]);

    const API_getUserTypes = useApi(AdminUserFunctions.getUsertypes);
    const API_getUsers = useApi(AdminUserFunctions.getUsers);

    useEffect(() => {
        loadUsers();
    }, [uRS.sortValues, uRS.pageSizeValue, uRS.pageNumber])
    useEffect(() => {
        loadUserTypes();
    }, [])
    const loadUsers = async () => {
        const sort = uRS.sortValues.sortCol ? `${uRS.sortValues.sortCol} ${uRS.sortValues.sortDir}` : null;
        const retVal = await API_getUsers.request(uRS.filterValues, sort, uRS.pageSizeValue, uRS.pageNumber);
        if (retVal.ok && retVal.data) {
            setUsers(retVal.data.requestedData?.Users || []);
        }
    }
    const loadUserTypes = async () => {
        const retVal = await API_getUserTypes.request();
        if (retVal.ok && retVal.data) {
            setUserTypes([{ typeID: "", userType: "--All--" }, ...(retVal.data.requestedData?.UserTypes || [])]);
        }
    }

    const modifyUserList = (mod, user) => {
        if (mod == 'new') {
            setUsers([...users, user]);
        }
        else if (mod == 'edit') {
            setUsers(users.map(user_ => { if (user_.userID != user.userID) { return user_ } else { return user } }));
        }
        else if (mod == 'delete') {
            console.log("del", user, users, users.filter((user_) => user_.userID != user.userID));
            setUsers(users.filter((user_) => user_.userID != user.userID));
        }

    }

    return (
        <>
            <SimpleHeader name="Users" parentName="Masters" parentUrl="/">
                <Button className="btn-neutral" color="default" size="sm" onClick={() => {
                    setModalReadOnly_Admin(false);
                    setChoosenUser(null);
                    setModalShow_AddEditUser(true);
                }}> New </Button>
                <Button className="btn-neutral" color="default" size="sm" onClick={() => { uRS.setFilterOpen(!uRS.filterOpen) }}> Filters </Button>
            </SimpleHeader>
            <Container className="mt--6" fluid>
                <Row>
                    <div className="col">
                        <Collapse isOpen={uRS.filterOpen}>
                            <Card>
                                <CardHeader className="border-0"> <h3 className="mb-0">Filter</h3> </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlInput1"> Keyword</label>
                                                <Input className="" placeholder="Enter Keyword here" type="text" value={uRS.filterValues.keyword} onChange={e => { uRS.setFilterValues({ ...uRS.filterValues, keyword: e.target.value }); }} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlSelect1">User Type</label>
                                                <Select options={userTypes.map((userType, index) => ({ value: userType.typeID, label: userType.userType }))} value={userTypes.map((userType, index) => { if (uRS.filterValues.typeid == userType.typeID) { return { value: userType.typeID, label: userType.userType } } })} onChange={val => { uRS.setFilterValues({ ...uRS.filterValues, typeid: val.value }); }} />
                                            </FormGroup>
                                        </Col>

                                        <Col md="3">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="exampleFormControlInput1">&nbsp;</label>
                                                <Button className="my-4 btn-md" color="dark" type="button" onClick={() => { (uRS.pageNumber == 1) && loadUsers() || uRS.setPageNumber("1") }}> Filter </Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                </CardBody>
                            </Card>
                        </Collapse>

                        <Card >
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th >SLNO</th>
                                        {/* <th >userID</th> */}
                                        <th >userFullName</th>
                                        <th >adminEmail</th>
                                        <th >status</th>
                                        <th >User Type</th>
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody className="list">
                                    {(users.length > 0 && users.map((user, index) => (
                                        <UserRow
                                            user={user}
                                            setModalShow_AddEditUser={setModalShow_AddEditUser}
                                            setChoosenUser={setChoosenUser}
                                            slno={index}
                                            setModalReadOnly_Admin={setModalReadOnly_Admin}
                                            modifyUserList={modifyUserList}
                                            key={index + user.userID}
                                        />
                                    )))}
                                </tbody>
                            </Table>
                            <CardFooter className="py-4">
                                <BusyBlock iAmBusy={API_getUsers.loading} />
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
            </Container>
            <ModalShow_AddEditUsers
                modalIsOpen={modalShow_AddEditUser}
                setModalIsOpen={setModalShow_AddEditUser}
                choosenUser={choosenUser}
                modalReadOnly_Admin={modalReadOnly_Admin}
                modifyUserList={modifyUserList}
            />
        </>
    );
}
export default Users;
Users.layout = Admin;

// Force dynamic rendering to prevent SSR errors during build
export async function getServerSideProps() {
  return {
    props: {},
  };
}
Users.permissionCheck = "permissionUsers";

const UserRow = ({ user, setModalShow_AddEditUser, setChoosenUser, slno, setModalReadOnly_Admin, modifyUserList }) => {
    const API_DeleteVal = useApi(AdminUserFunctions.removeUser);
    const API_UpdateStatus = useApi(AdminUserFunctions.updatestatus);
    const [status, setStatus] = useState(user.status);
    const handleRemove = async () => {
        var delTxt = confirm("Do you want to remove the value ?");
        if (delTxt == true) {
            const retVal = await API_DeleteVal.request(user.userID);
            if (retVal.ok) {
                modifyUserList('delete', user);
            }
            else {
                alert("Error 2");
            }
        }

    };
    const handleStatusChange = async () => {
        let newStatus = status == "1" ? "2" : "1";
        const updateval = await API_UpdateStatus.request(user.userID, newStatus);
        if (updateval.ok) {
            console.log("status");
            setStatus(newStatus);
        } else {
            alert("error");
        }
    };
    return (
        <>

            <tr>
                <td className="budget">
                    <span>{slno + 1}</span>
                </td>
                {/* <td className="budget">
                    <span>{user.userID}</span>
                </td> */}
                <td className="budget">
                    <span>{user.userFullName}</span>
                </td>
                <td className="budget">
                    <span>{user.adminEmail}</span>
                </td>
                <td className="budget">
                    <label className="custom-toggle mr-1">
                        <input type="checkbox" checked={status == 1} onChange={handleStatusChange} />
                        <span className="custom-toggle-slider rounded-circle" />
                    </label>
                </td>
                <td className="budget">
                    <span>{user.userType}</span>
                </td>

                <td>
                    <Button className="btn-icon-only" color="secondary" type="button"
                        onClick={() => {
                            setModalReadOnly_Admin(true);
                            setChoosenUser(user);
                            setModalShow_AddEditUser(true);
                        }}
                    >
                        <i className="fas fa-edit" />
                    </Button>
                    <Button className="btn-icon-only" color="secondary" type="button"
                        onClick={handleRemove}
                    >
                        <i className="fas fa-trash" />
                    </Button>
                </td>
            </tr>
        </>
    );
}

const ModalShow_AddEditUsers = ({ modalIsOpen, setModalIsOpen, choosenUser, modalReadOnly_Admin, modifyUserList }) => {
    const API_getUserTypes = useApi(AdminUserFunctions.getUsertypes);
    const API_updateUser = useApi(AdminUserFunctions.updateUser);

    const [userTypes, setUserTypes] = useState([]);
    const [userType, setUserType] = useState("");
    const [userFullName, setUserFullName] = useState("");
    const [adminEmail, setAdminEmail] = useState("");
    const [password, setPassword] = useState("");
    const [permissionCategories, setPermissionCategories] = useState(false);
    const [permissionProducts, setPermissionProducts] = useState(false);
    const [permissionOrders, setPermissionOrders] = useState(false);
    const [permissionUsers, setPermissionUsers] = useState(false);
    const [permissionReports, setPermissionReports] = useState(false);
    const API_createUser = useApi(AdminUserFunctions.createUser);
    useEffect(() => {
        loadUserTypesForModal();
    }, []);

    useEffect(() => {
        if (choosenUser) {
            setUserType(choosenUser.typeID);
            setUserFullName(choosenUser.userFullName);
            setAdminEmail(choosenUser.adminEmail);
            setPassword(choosenUser.adminPassword);
            setPermissionCategories(choosenUser.permissionCategories == 1 ? true : false)
            setPermissionProducts(choosenUser.permissionProducts == 1 ? true : false)
            setPermissionOrders(choosenUser.permissionOrders == 1 ? true : false)
            setPermissionUsers(choosenUser.permissionUsers == 1 ? true : false)
            setPermissionReports(choosenUser.permissionReports == 1 ? true : false)
        }
        else {
            setUserType("");
            setUserFullName("");
            setAdminEmail("");
            setPermissionCategories(false)
            setPermissionProducts(false)
            setPermissionOrders(false)
            setPermissionUsers(false)
            setPermissionReports(false)
        }
    }, [choosenUser]);


    const handleClick = async () => {
        if (choosenUser) {
            const retVal = await API_updateUser.request(choosenUser.userID, {
                userType,
                userFullName,
                permissionCategories,
                permissionProducts,
                permissionOrders,
                permissionUsers,
                permissionReports
            });
            if (retVal.ok && retVal.data) {
                setModalIsOpen(false);
                modifyUserList('edit', retVal.data.requestedData?.user?.[0]);
            }
        }
        else {
            const retVal = await API_createUser.request({
                userType,
                userFullName,
                adminEmail,
                adminPassword: password,
                permissionCategories,
                permissionProducts,
                permissionOrders,
                permissionUsers,
                permissionReports
            });
            if (retVal.ok && retVal.data) {
                setModalIsOpen(false);
                modifyUserList('new', retVal.data.requestedData?.User?.[0]);
            }
        }
    }

    const loadUserTypesForModal = async () => {
        const retVal = await API_getUserTypes.request();
        if (retVal.ok && retVal.data) {
            setUserTypes(retVal.data.requestedData?.UserTypes || []);
        }
    }
    return (
        <Modal className="modal-dialog-centered" size="lg" isOpen={modalIsOpen} toggle={() => { setModalIsOpen(!modalIsOpen); }}    >
            <div className="modal-body p-0">
                <Card className="bg-secondary border-0 mb-0">
                    <CardHeader className="bg-light">
                        <div className="h2 text-center mt-2 mb-3">{(choosenUser && "Edit") || "Add New"} User </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                        <Form>
                            <FormGroup>
                                <label className="form-control-label" htmlFor="exampleFormControlSelect1"> User</label>
                                <Input id="exampleFormControlSelect1" type="select" value={userType} onChange={(e) => {
                                    setUserType(e.target.value);
                                }} >
                                    <option value="0">-User Type-</option>
                                    {userTypes.length > 0 &&
                                        userTypes.map((userType) => (
                                            <option value={userType.typeID} key={userType.typeID}> {userType.userType} </option>
                                        ))}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <label className="form-control-label" htmlFor="exampleFormControlInput1" > User Full Name </label>
                                <Input id="exampleFormControlInput1" placeholder="Full Name " type="text"
                                    value={userFullName}
                                    onChange={(e) => {
                                        setUserFullName(e.target.value);
                                    }}
                                />
                                <label className="form-control-label" htmlFor="exampleFormControlInput1" > Admin Email </label>
                                <Input id="exampleFormControlInput12" placeholder="Admin Email" type="text"
                                    value={adminEmail}
                                    onChange={(e) => {
                                        setAdminEmail(e.target.value);
                                    }}
                                    disabled={modalReadOnly_Admin}
                                />
                                <label className="form-control-label" htmlFor="exampleFormControlInput1" > Password </label>
                                <Input id="exampleFormControlInput3" placeholder="Password" type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }} 
                                    />
                            </FormGroup>
                            <FormGroup>

                                <Card>
                                    <CardHeader>
                                        <h3 className="mb-0">User Permissions</h3>
                                    </CardHeader>
                                    <CardBody>

                                        <Row>
                                            <Col md="6">
                                                <div className="custom-control custom-checkbox mb-3">
                                                    <input
                                                        className="custom-control-input"
                                                        id="customCheck0"
                                                        type="checkbox"
                                                        defaultChecked={permissionCategories}
                                                        onChange={() => setPermissionCategories(!permissionCategories)}
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="customCheck0"
                                                    >
                                                        Category Management
                                                    </label>
                                                </div>
                                                <div className="custom-control custom-checkbox mb-3">
                                                    <input
                                                        className="custom-control-input"
                                                        id="customCheck1"
                                                        type="checkbox"
                                                        defaultChecked={permissionOrders}
                                                        onChange={() => setPermissionOrders(!permissionOrders)}
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="customCheck1"
                                                    >
                                                        Orders Management
                                                    </label>
                                                </div>
                                                <div className="custom-control custom-checkbox mb-3">
                                                    <input
                                                        className="custom-control-input"
                                                        id="customCheck2"
                                                        type="checkbox"
                                                        defaultChecked={permissionReports}
                                                        onChange={() => setPermissionReports(!permissionReports)}
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="customCheck2"
                                                    >
                                                        Reports Management
                                                    </label>
                                                </div>
                                            </Col>
                                            <Col md="6">
                                                <div className="custom-control custom-checkbox mb-3">
                                                    <input
                                                        className="custom-control-input"
                                                        id="customCheck3"
                                                        type="checkbox"
                                                        defaultChecked={permissionProducts}
                                                        onChange={() => setPermissionProducts(!permissionProducts)}
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="customCheck3"
                                                    >
                                                        Product Management
                                                    </label>
                                                </div>
                                                <div className="custom-control custom-checkbox mb-3">
                                                    <input
                                                        className="custom-control-input"
                                                        id="customCheck4"
                                                        type="checkbox"
                                                        defaultChecked={permissionUsers}
                                                        onChange={() => setPermissionUsers(!permissionUsers)}
                                                    />
                                                    <label
                                                        className="custom-control-label"
                                                        htmlFor="customCheck4"
                                                    >
                                                        Users Management
                                                    </label>
                                                </div>
                                            </Col>
                                        </Row>

                                    </CardBody>
                                </Card>

                            </FormGroup>
                            <Row>
                                <Col md="12" className="text-right">
                                    <Button className="my-4" color="secondary" type="button" onClick={() => setModalIsOpen(false)}> Cancel </Button>

                                    <Button className="my-4" color="danger" type="button" onClick={handleClick}> Submit </Button>

                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </Modal>
    );
}