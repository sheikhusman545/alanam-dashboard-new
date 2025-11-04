import React, { useEffect, useState } from "react";
import classnames from "classnames";

import useApi from "../../api/hooks/apihook";
import categoryFunctions from "../../api/categories";
import Admin from "@/layouts/Admin";
import MenuIcon from "@mui/icons-material/Menu";
import productFunctions from "../../api/products";
import {
  Alert,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardSubtitle,
  Collapse,
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
  InputGroupText,
  Input,
  CardImg,
} from "reactstrap";
// core components
import SimpleHeader from "components/Headers/SimpleHeader.js";
// Using Font Awesome icons instead of Material-UI to avoid SSR issues
// import { Delete, DeleteForever, Edit, Visibility } from "@mui/icons-material";
import { imagePath } from "../../api/config/config";
import { CHECKBOX_STATUS_UNCHECKED } from "react-bootstrap-table-next";
import MultiFileUpload from "../../components/custom_components/multiplefileupload";
import AttributSelection from "../../components/custom_components/attributeselection";

import { MyPagination } from "utils/pagination"
import { SafeBox, validateData, BusyBlock, BusyBlockAUtoHeight } from "api/hooks/apiutils";
import useReport, { ReportHeader } from "api/hooks/useReport";
import Select from 'react-select'
import { getMultiLevelcategoriesForDropdown } from "utils/categoryUtils";
import { amountFormat } from "utils/utils";

const Products = () => {
  const API_GetallCategories = useApi(categoryFunctions.getAlCategories);
  const API_GetallProducts = useApi(productFunctions.getAlProducts);

  const uRS = useReport(); //useReportStates

  const [categories, setCategories] = useState([]);
  const [choosenCategory, setChoosenCategory] = useState(null);
  let checked = true;
  const [modalShow_AddEditProduct, setModalShow_AddEditProduct] = useState(false);
  const [modalReadOnly_Product, setModalReadOnly_Product] = useState(false);

  const [products, setProducts] = useState([]);
  const [choosenProduct, setChoosenProduct] = useState(null);
  const [productID, setProductID] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadproducts();
  }, [uRS.sortValues, uRS.pageSizeValue, uRS.pageNumber]);


  const loadCategories = async () => {
    const retVal = await API_GetallCategories.request();
    if (retVal.ok && retVal.data) {
      setCategories(retVal.data.requestedData?.Categories || []);
    }
  };

  const loadproducts = async () => {
    const sort = uRS.sortValues.sortCol ? `${uRS.sortValues.sortCol} ${uRS.sortValues.sortDir}` : null;
    const retVal = await API_GetallProducts.request(uRS.filterValues, sort, uRS.pageSizeValue, uRS.pageNumber);
    
    if (retVal.ok && retVal.data) {
      setProducts(retVal.data.requestedData?.Products || []);
      if (retVal.data.requestedData?.ProductsCount?.[0]?.numrows) {
        uRS.setRecordCount(retVal.data.requestedData.ProductsCount[0].numrows);
      }
    }
  };

  const sortClick = (column) => {
    uRS.setSortValues({ sortCol: column, sortDir: (uRS.sortValues.sortCol == column) ? "desc" : "asc" })
  }

  const modifyProductList = (mod, product_) => {
    if (mod == 'new') {
      setProducts([...products, product_]);
    }
    else if (mod == 'edit') {
      setProducts(products.map(product => { if (product.productID != product_.productID) { return product } else { return product_ } }))
    }
    else if (mod == 'delete') {
      setProducts(products.filter((product) => product.productID != product_.productID));
    }
  }


  return (
    <>
      <SimpleHeader name="Products" parentName="Masters" parentUrl="/">
        <Button className="btn-neutral" color="default" size="sm" onClick={() => {
          setModalReadOnly_Product(false);
          setChoosenProduct(null);
          setModalShow_AddEditProduct(true);
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
                        <label className="form-control-label" htmlFor="exampleFormControlSelect1"> Parent Category </label>
                        <Select options={getMultiLevelcategoriesForDropdown(categories)} value={categories.map(category => { if (category.categoryID == uRS.filterValues.parentcategoryid) { return { value: category.categoryID, label: category.en_CategoryName } } })} onChange={val => { uRS.setFilterValues({ ...uRS.filterValues, parentcategoryid: val.value }); }} />
                      </FormGroup>
                    </Col>

                    <Col md="3">
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1">&nbsp;</label>
                        <Button className="my-4 btn-md" color="dark" type="button" onClick={() => { (uRS.pageNumber == 1) && loadproducts() || uRS.setPageNumber("1") }}> Filter </Button>
                      </FormGroup>
                    </Col>
                  </Row>

                </CardBody>
              </Card>
            </Collapse>
            <SafeBox objectApi={API_GetallProducts} lengthCheckObject={"Products"} firstTimeOnly={true} noDataMessage="No Products found!"  >
              {validateData(API_GetallProducts, "Products", true) &&
                <Card style={{ position: "relative" }}>
                  <ReportHeader uRS={uRS}>Product List</ReportHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th className={`sort ${(uRS.sortValues.sortCol == "") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('')}> Image </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "PRD.en_ProductName") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('PRD.en_ProductName')}> en_product Name </th>
                        <th> ar_product Name </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "PRD.productPrice") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('PRD.productPrice')}> Product Price </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "PRD.productCode") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('PRD.productCode')}> Product Code </th>
                        <th className={`sort ${(uRS.sortValues.sortCol == "PRD.createdOn") ? 'active' : ''}`} data-sort="budget" scope="col" onClick={() => sortClick('PRD.createdOn')}> Created On </th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody className="list">
                      {(products.length > 0 &&
                        products.map((product, index) => (
                          <ProductRow
                            product={product}
                            setModalShow_AddEditProduct={setModalShow_AddEditProduct
                            }
                            setChoosenProduct={setChoosenProduct}
                            modifyProductList={modifyProductList}
                            key={product.productID + index}
                            setModalReadOnly_Product={setModalReadOnly_Product}
                          // removeCategoryRow={removeCategoryRow}
                          />
                        ))) || (
                          <tr>
                            <td>
                              <span>no data found</span>
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </Table>
                  <CardFooter className="py-4">
                    <MyPagination pageNumber={parseInt(uRS.pageNumber)} pageCount={Math.ceil(uRS.recordCount / uRS.pageSizeValue)} handleChangePage={uRS.setPageNumber} />
                  </CardFooter>
                  <BusyBlock iAmBusy={API_GetallProducts.loading} />
                </Card>
              }
            </SafeBox>
          </div>
        </Row>
      </Container>
      {modalShow_AddEditProduct && (
        <Modal_AddEditProduct
          modalIsOpen={modalShow_AddEditProduct}
          setModalIsOpen={setModalShow_AddEditProduct}
          categories={categories}
          choosenProduct={choosenProduct}
          modalReadOnly_Product={modalReadOnly_Product}
          modifyProductList={modifyProductList}
        />
      )}
    </>
  );
};
export default Products;

Products.layout = Admin;
Products.permissionCheck = "permissionProducts";

// Force dynamic rendering to prevent SSR errors during build
export async function getServerSideProps() {
  return {
    props: {},
  };
}


const ProductRow = ({
  product,
  setModalShow_AddEditProduct,
  setChoosenProduct,
  modifyProductList,
  setModalReadOnly_Product,
  // removeCategoryRow,
}) => {
  const API_DeleteVal = useApi(productFunctions.deleteVal);
  const [modalShow_ViewProduct, setModalShow_ViewProduct] = useState(false);

  const handleRemove = async () => {
    var delTxt = confirm("Do you want to remove the value ?");
    if (delTxt == true) {
      const retVal = await API_DeleteVal.request(product.productID);
      if (retVal.ok) {
        modifyProductList('delete', product);
      } else {
        alert("Error 2");
      }
    }

  };

  return (
    <>
      <tr>
        {/* key={product.categoryID} */}
        <th scope="row">
          <Media className="align-items-center">
            <a
              className="avatar rounded-circle mr-3"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <img alt="..." src={imagePath + product.mainImageUrl} />
            </a>
          </Media>
        </th>

        <td className="budget">
          <span>{product.en_ProductName}</span>
        </td>
        <td className="budget">
          <span>{product.ar_ProductName}</span>
        </td>
        <td className="budget">
          <span>{amountFormat(product.productPrice)}</span>
        </td>
        <td className="budget">
          <span>{product.productCode}</span>
        </td>
        <td className="budget">
          <span>{product.createdOn}</span>
        </td>
        <td className="text-right">
          <Button className="btn-icon-only" color="secondary" type="button">
            <span className="btn-inner--icon"
              onClick={() => {
                setModalReadOnly_Product(true);
                setChoosenProduct(product);
                setModalShow_AddEditProduct(true);
              }}>
              <i className="fas fa-eye" />
            </span>
          </Button>

          <Button
            className="btn-icon-only"
            color="secondary"
            type="button"
            onClick={() => {
              setModalReadOnly_Product(false);
              setChoosenProduct(product);
              setModalShow_AddEditProduct(true);
            }}
          >
            <span className="btn-inner--icon">
              <i className="fas fa-edit" />
            </span>
          </Button>
          <Button
            className="btn-icon-only"
            color="secondary"
            type="button"
            onClick={handleRemove}
          >
            <span className="btn-inner--icon">
              <i className="fas fa-trash" />
            </span>
          </Button>
        </td>
      </tr>
    </>
  );
};

const Modal_AddEditProduct = ({ modalIsOpen, setModalIsOpen, categories, choosenProduct, modifyProductList, modalReadOnly_Product, }) => {

  const [imageGallery, setImageGallery] = useState([]);
  const [product, setProduct] = useState({});
  const [attributes, setAttributes] = useState([]);
  const [removedGalleryImages, setRemovedGalleryImages] = useState([]);

  const [errorMessage, setErrorMessage] = useState(false);

  const API_createProduct = useApi(productFunctions.createproduct);
  const API_updateProduct = useApi(productFunctions.updateProduct);
  const API_getProductByID = useApi(productFunctions.getProductByID);

  const loadproductsbyid = async () => {
    const retVal = await API_getProductByID.request(choosenProduct.productID);
    if (retVal.ok && retVal.data) {
      setProduct(retVal.data.requestedData?.Product?.[0] || {});
      setImageGallery(retVal.data.requestedData?.galleryImages || []);
      setAttributes(retVal.data.requestedData?.attrbutes || []);
    }
  };
  useEffect(() => {
    if (choosenProduct) {
      loadproductsbyid();
    }
    else {
    }
    setRemovedGalleryImages([]);
  }, [choosenProduct]);

  const handleClick = async () => {
    if (choosenProduct) {
      const retVal = await API_updateProduct.request(
        choosenProduct.productID,
        product,
        imageGallery,
        attributes,
        removedGalleryImages
      );
      if (retVal.ok && retVal.data) {
        setModalIsOpen(false);
        modifyProductList('edit', retVal.data.requestedData?.product?.Product?.[0]);
      } else {
        setErrorMessage(retVal.error || 'Failed to update product')
      }
    } else {
      const retVal = await API_createProduct.request(
        product,
        imageGallery,
        attributes
      );
      if (retVal.ok && retVal.data) {
        setModalIsOpen(false);
        modifyProductList('new', retVal.data.requestedData?.product?.Product?.[0]);
      } else {
        setErrorMessage(retVal.error || 'Failed to create product')
      }

    }
  };
  return (
    <Modal className="modal-dialog-centered" size="lg" isOpen={modalIsOpen} toggle={() => { setModalIsOpen(!modalIsOpen); }}    >
      <div className="modal-body p-0">
        <Card className="bg-secondary border-0 mb-0">
          <CardHeader className="bg-light">
            <div className="h2 text-center mt-2 mb-3"> {(modalReadOnly_Product && "View") || (choosenProduct && "Edit") || "Add New"} Product </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-5">
            <Form>
              <FormGroup>
                <label className="form-control-label" htmlFor="exampleFormControlSelect1"> Category </label>
                {(modalReadOnly_Product && (
                  <Input id="exampleFormControlSelect1" type="text" disabled={modalReadOnly_Product} value={product.en_CategoryName}
                    onChange={(e) => {
                      setProduct({ ...product, en_CategoryName: e.target.value });
                    }} />
                )) || (
                    <Input id="exampleFormControlSelect1" type="select" value={product.categoryID}
                      onChange={(e) => {
                        setProduct({ ...product, categoryID: e.target.value });
                      }}>
                      <option value="0">-Main Category-</option>
                      {categories.length > 0 &&
                        categories.map((category) => (
                          <option value={category.categoryID} key={category.categoryID}> {category.en_CategoryName} </option>
                        ))}
                    </Input>
                  )}
              </FormGroup>
              <Row>
                <Col md="6">
                  <Card>
                    <CardHeader className="bg-light small-padding">English</CardHeader>
                    <CardBody>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1" > Product Name </label>
                        <Input id="exampleFormControlInput1" placeholder="Product name in english" type="text" value={product.en_ProductName}
                          onChange={(e) => {
                            setProduct({ ...product, en_ProductName: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlTextarea1" > Product Description </label>
                        <Input id="exampleFormControlTextarea1" placeholder="Product description in english" rows="3" type="textarea" value={product.en_ProductDescription}
                          onChange={(e) => {
                            setProduct({ ...product, en_ProductDescription: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>

                    </CardBody>
                  </Card>
                </Col>
                <Col md="6">
                  <Card>
                    <CardHeader className="bg-light small-padding">Arabic</CardHeader>
                    <CardBody>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1"> Product Name </label>
                        <Input id="exampleFormControlInput1" placeholder="Product name in Arabic" type="text" value={product.ar_ProductName}
                          onChange={(e) => {
                            setProduct({ ...product, ar_ProductName: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlTextarea1"> Product Description  </label>
                        <Input id="exampleFormControlTextarea1" placeholder="Product description in Arabic" rows="3" type="textarea" value={product.ar_ProductDescription}
                          onChange={(e) => {
                            setProduct({ ...product, ar_ProductDescription: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>

                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <Card>
                    <CardHeader className="bg-light small-padding">Main details</CardHeader>
                    <CardBody>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1" > Minimum Quantity </label>
                        <Input id="exampleFormControlInput1" placeholder="Enter min quantity here" type="number" value={product.minQuantity}
                          onChange={(e) => {
                            setProduct({ ...product, minQuantity: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1" > Product Price </label>
                        <Input id="exampleFormControlInput1" placeholder="Enter product price here" type="number" value={product.productPrice}
                          onChange={(e) => {
                            setProduct({ ...product, productPrice: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1" > Slaughter Charge <small>(If any)</small> </label>
                        <Input id="exampleFormControlInput1" placeholder="Enter Slaughter Charge" type="number" value={product.SlaughterCharge}
                          onChange={(e) => {
                            setProduct({ ...product, SlaughterCharge: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1" > Product Code </label>
                        <Input id="exampleFormControlInput1" placeholder="Enter product code here" type="text" value={product.productCode}
                          onChange={(e) => {
                            setProduct({ ...product, productCode: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>
                      <FormGroup>
                        {(!modalReadOnly_Product) && (
                          <div className="custom-file">
                            <label className="custom-file-label" htmlFor="customFileLang"> Select file </label>
                            <input className="custom-file-input" id="customFileLang" lang="en" type="file" style={{ zIndex: 0, }}
                              onChange={(event) =>
                                setProduct({ ...product, mainImage: event.target.files[0] })
                              } />
                          </div>
                        )}
                      </FormGroup>
                    </CardBody>
                    {(product.mainImage)
                      &&
                      <CardFooter className="bg-light" style={{ display: "flex", justifyContent: "center", padding: "0" }}>
                        <CardImg top width="100%" src={URL.createObjectURL(product.mainImage)} alt="Card image cap" helio={product.mainImage} style={{ width: "40%", margin: "0 auto" }} />
                      </CardFooter>
                      || (modalReadOnly_Product || choosenProduct)
                      &&
                      <CardFooter className="bg-light" style={{ display: "flex", justifyContent: "center", padding: "0" }}>
                        <CardImg top width="100%" src={imagePath + product.mainImageUrl} alt="Card image cap" style={{ width: "40%", margin: "0 auto" }} />
                      </CardFooter>
                    }
                  </Card>
                </Col>
                <Col md="6">
                  <Card>
                    <CardHeader className="bg-light small-padding">Listing </CardHeader>
                    <CardBody>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlSelect1"> Status </label>
                        {(modalReadOnly_Product && (
                          <Input id="exampleFormControlSelect1" type="text" disabled={modalReadOnly_Product} value={product.status}
                            onChange={(e) => {
                              setProduct({ ...product, status: e.target.value });
                            }} />
                        )) || (
                            <Input id="exampleFormControlSelect1" type="select" value={product.status}
                              onChange={(e) => {
                                setProduct({ ...product, status: e.target.value });
                              }}>
                              {
                                [{ value: '1', title: "Active" }, { value: '2', title: "Disable" }].map((category) => (
                                  <option value={category.value} key={category.value}> {category.title} </option>
                                ))}
                            </Input>
                          )}
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1" > New List Proirity </label>
                        <Input id="exampleFormControlInput1" placeholder="Enter new product priority here" type="text" value={product.newProductPriority}
                          onChange={(e) => {
                            setProduct({ ...product, newProductPriority: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1" > Featured List Priority </label>
                        <Input id="exampleFormControlInput1" placeholder="Enter featured product priority here" type="text" value={product.featuredProductPriority}
                          onChange={(e) => {
                            setProduct({ ...product, featuredProductPriority: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>
                      <FormGroup>
                        <label className="form-control-label" htmlFor="exampleFormControlInput1" > Show order </label>
                        <Input id="exampleFormControlInput1" placeholder="Enter priority here" type="text" value={product.showOrder}
                          onChange={(e) => {
                            setProduct({ ...product, showOrder: e.target.value });
                          }}
                          disabled={modalReadOnly_Product} />
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

            </Form>
            <div>
              <Row>
                <Col lg="12">
                  <div className="card-wrapper">
                    <Card>
                      <CardHeader>
                        <h3 className="mb-0">{modalReadOnly_Product ? "Gallery Images" : "File Upload"}</h3>
                      </CardHeader>
                      <CardBody>
                        <MultiFileUpload imageGallery={imageGallery} setImageGallery={setImageGallery} readOnly={modalReadOnly_Product} removedGalleryImages={removedGalleryImages} setRemovedGalleryImages={setRemovedGalleryImages} />
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
            <div>
              <Row>
                <Col lg="12">
                  <div className="card-wrapper">
                    <Card>
                      <CardHeader>
                        <h3 className="mb-0">Attributes</h3>
                      </CardHeader>
                      <CardBody>
                        <AttributSelection attributes={attributes} setAttributes={setAttributes} readOnly={modalReadOnly_Product} />
                      </CardBody>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>

            <Row>
              <Col md="12" className="text-right">
                <Button className="my-4" color="secondary" type="button" onClick={() => setModalIsOpen(false)}> Cancel </Button>
                {!modalReadOnly_Product && (
                  <Button className="my-4" color="danger" type="button" onClick={handleClick} > Submit </Button>
                )}
              </Col>
            </Row>
            {(errorMessage) &&
              <Row>
                <Col md="12" className="text-right">
                  <Alert color="danger text text-center"> {errorMessage} </Alert>
                </Col>
              </Row>}
          </CardBody>
        </Card>
      </div>
      {API_getProductByID.loading && <div>loading</div>}
    </Modal>
  );
};
