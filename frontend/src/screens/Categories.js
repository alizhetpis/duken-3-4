import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, categories: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    default:
      return state;
  }
};

function Categories() {
  const [
    {
      loading,
      error,
      categories,
      loadingCreate,
      loadingDelete,
      errorCreate,
      errorDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    categories: [],
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const navigate = useNavigate();
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/categories', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({
          type: 'FETCH_SUCCESS',
          payload: data,
        });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      await axios.post(
        '/api/categories',
        { name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Category created successfully');
      navigate('/admin/categories');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  const editHandler = (category) => {
    // TODO: Implement edit category functionality
  };

  const createHandler = () => {
    // TODO: Implement create category functionality
  };

  const deleteHandler = async (category) => {
    if (window.confirm(`Are you sure to delete ${category.name}?`)) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/categories/${category._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({
          type: 'DELETE_SUCCESS',
        });
        toast.success('Category deleted successfully');
        navigate('/admin/categories');
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Categories</title>
      </Helmet>
      <h1>Categories</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>CATEGORY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>
                    <Button
                      variant="light"
                      className="btn-sm"
                      onClick={() => editHandler(category)}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>{' '}
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(category)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button className="my-3" onClick={createHandler}>
            Create Category
          </Button>
        </>
      )}
    </Container>
  );
}
export default Categories;
