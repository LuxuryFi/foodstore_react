import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import moment from "moment";
import { Col, Form, InputNumber, Row } from "antd";
import Navigation from "../../../components/Navigation";
import Button from "../../../components/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addFavorite,
  addWatch,
  checkFood,
  commentFood,
  fetchComment,
  selectFoodFavorite,
  selectFoodNeedUpdate,
} from "../../../store/slices/foodsSlice";
import { fetchOneFood } from "../../../store/slices/foodsSlice";
import { selectCurrentUser } from "../../../store/slices/usersSlice";
import TextArea from "antd/lib/input/TextArea";
import { isLogin } from "../../../helpers/isLogin";
import { addItemToCart } from "../../../store/slices/cartSlice";

export default function FoodDetail() {
  const dispatch = useDispatch();
  const { food_id } = useParams();
  const [formComment] = Form.useForm();
  const [formAddToCart] = Form.useForm();
  const currentUser = useSelector(selectCurrentUser);
  const favorites = useSelector(selectFoodFavorite);
  const productNeedUpdate = useSelector(selectFoodNeedUpdate);
  const [quantity, setQuantity] = useState(1);

  // Fill value to input quantity
  useEffect(() => {
    formAddToCart.setFieldsValue({
      quantity: quantity,
    });
  }, [formAddToCart, quantity]);

  // Get exact food
  useEffect(() => {
    if (food_id) {
      dispatch(fetchOneFood(food_id));
      dispatch(checkFood(food_id))
    }
  }, [food_id, dispatch]);

  // Check favorite and watch
  // useEffect(() => {
  //   if (isLogin()) dispatch(checkFood(food_id));
  // }, [food_id, dispatch]);
  const navigation = useNavigate()

  const handleClickFavorite = () => {
    dispatch(addFavorite(food_id));
  };

  const handleClickWatch = () => {
    dispatch(addWatch(food_id));
  };

  const handleFinishOrder = (values) => {};

  const handleClickMinus = () => {
    if (quantity === 0) return false;
    setQuantity((prev) => prev - 1);
  };

  const handleClickPlus = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    const data = {
      amount: quantity,
      product_id: productNeedUpdate.id,
      price: parseFloat(productNeedUpdate.price),
      user_id: currentUser?.data.id,
    };
    dispatch(addItemToCart(data));

    navigation('/profile/cart')
    window.location.reload(false);

  };

  const handleFinishComment = (values) => {
    const data = {
      user_id: currentUser.user_id,
      comment: values.comment,
      product_id: food_id,
    };
    dispatch(commentFood(data));
  };

  return (
    <div className="app-container ">
      <Header />
      <Navigation />

      {Object.keys(productNeedUpdate).length > 0 && (
        <div className="food-detail-container container-space">
          <div className="container-fluid">
            <Row className="food-detail-content">
              <Col xl={8}>
                <div className="image-container">
                  <img
                    className="image-current"
                    src={
                      productNeedUpdate.image
                        ? `http://localhost:4000/public/uploads/${productNeedUpdate.image}`
                        : "https://img.freepik.com/free-vector/blank-food-cover-white-vector-illustration_1284-41903.jpg?w=360"
                    }
                    alt="current product"
                    crossOrigin='anonymous'
                    />
                </div>
              </Col>
              <Col xl={16}>
                <div className="food-info-container">
                  <h2 className="food-title">{productNeedUpdate.product_name}</h2>
                  <div className="rate-container">
                    <div className="stars-list">
                      <span className="num">4.5</span>
                      <div className="stars">
                        <BsStarFill />
                        <BsStarFill />
                        <BsStarFill />
                        <BsStarFill />
                        <BsStarHalf />
                      </div>
                    </div>
                    {/* <div className="rates">
                      {Object.keys(productNeedUpdate.count).length > 0 && (
                        <span className="num">
                          {productNeedUpdate.count[0].count}
                        </span>
                      )}
                      <span className="text">Ratings</span>
                    </div> */}
                    <div className="solds">
                      <span className="num">{productNeedUpdate.sold}</span>
                      <span className="text">Sold</span>
                    </div>
                    <div className="favorite">
                      {favorites.includes(productNeedUpdate.id) ? (
                        <AiFillHeart
                          className="icon"
                          onClick={handleClickFavorite}
                        />
                      ) : (
                        <AiOutlineHeart
                          onClick={handleClickFavorite}
                          className="icon"
                        />
                      )}
                    </div>
                  </div>
                  <div className="price-container">
                    {productNeedUpdate.promotion && (
                      <span className="prev">₫500.000</span>
                    )}
                    <span className="current">₫{productNeedUpdate.price}</span>
                    {productNeedUpdate.promotion && (
                      <span className="sale">40% OFF</span>
                    )}
                  </div>
                  <div className="voucher-container">
                    <h3 className="title">Shop Vouchers</h3>
                    <span className="sale">₫30k OFF</span>
                    <span className="sale">₫40k OFF</span>
                  </div>
                  <div className="supplier-container">
                    <h3 className="title">Supplier</h3>
                    <span className="value">
                      {productNeedUpdate.supplier_name}
                    </span>
                  </div>
                  {productNeedUpdate.stock_quantity <= 0 ? (
                    <div className="watch-container">
                      <Button
                        onClick={handleClickWatch}
                        disabled={false}
                        className="button square button--light addToWatch-btn"
                        type="button"
                      >
                        <span>Notify me when the goods arrive</span>
                      </Button>
                      <h4 className="quantity-amount">
                        {productNeedUpdate.stock_quantity ?? 0} piece available
                      </h4>
                    </div>
                  ) : (
                    <>
                      <div className="quantity-container">
                        <h3 className="title">Quantity</h3>
                        <div className="quantity-content">
                          <Form
                            form={formAddToCart}
                            scrollToFirstError
                            onFinish={handleFinishOrder}
                          >
                            <div className="form-container">
                              <Button
                                onClick={handleClickMinus}
                                disabled={quantity === 0}
                                className="button square button--light prev"
                                type="button"
                              >
                                <AiOutlineMinus className="icon" />
                              </Button>
                              <Form.Item
    name="quantity"
    className="quantity-input-container"
    rules={[
      {
        required: true,
        message: 'Please enter a quantity',
      },
      {
        validator: (_, value) => {
          if (value < 1) {
            return Promise.reject(
              new Error('Quantity must be at least 1')
            );
          }
          return Promise.resolve();
        },
      },
    ]}
  >
    <InputNumber
      min={1}
      max={productNeedUpdate.stock_quantity}
      controls={false}
      className="input-quantity"
    />
  </Form.Item>
                              <Button
                                onClick={handleClickPlus}
                                disabled={false}
                                className="button square button--light next"
                                type="button"
                              >
                                <AiOutlinePlus className="icon" />
                              </Button>
                            </div>
                          </Form>
                        </div>
                        <h4 className="quantity-amount">
                          {productNeedUpdate.stock_quantity} piece available
                        </h4>
                      </div>
                      <div className="actions-container">
                        <Button
                          onClick={handleAddToCart}
                          disabled={false}
                          className="button square button--light addToCart-btn"
                          type="button"
                        >
                          <AiOutlineShoppingCart className="icon" />
                          <span>Add to cart</span>
                        </Button>

                        <Button
                          onClick={handleAddToCart}
                          disabled={false}
                          className="button square button--light buyNow-btn"
                          type="button"
                        >
                          <span>Buy now</span>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Col>
            </Row>

            <Row
              className="food-info-content"
              gutter={{
                xl: 10,
              }}
            >
              <Col xl={24}>
                <div className="food-info-item">
                  <h2 className="title">Food Description</h2>
                  <p className="description">{productNeedUpdate.description}</p>
                </div>

                <div className="food-info-item">
                  <h2 className="title">Food Ratings</h2>
                  <div className="comment-action">
                    <div className="left">
                      <img
                        className="avatar"
                        alt="avatar"
                        src={ Object.keys(currentUser).length > 0 ?
                          `http://localhost:4000/public/uploads/${currentUser.data.url}` : ''}
                      />
                    </div>
                    <div className="right">
                      <h3 className="username">{                      Object.keys(currentUser).length > 0
? currentUser?.data.name : ''}</h3>
                      <Form
                        className="form-comment"
                        scrollToFirstError
                        form={formComment}
                        onFinish={handleFinishComment}
                      >
                        <div className="comment-box">
                          <Form.Item
                            name="comment"
                            className="comment-textarea"
                          >
                            <TextArea
                              showCount
                              maxLength={100}
                              style={{
                                height: 120,
                                marginBottom: 24,
                              }}
                              placeholder="Write down your feedback"
                            />
                          </Form.Item>
                          <Button
                            className="button button--blue--light button-send-comment"
                            type="submit"
                          >
                            Send
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
