import React from 'react'
import "./Form.css";
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

export const Form = () => {
    const [form, setform] = useState({
        age:0,
        salary:0,
        address:"",
        department:"",
        marital:"",
        image:""
    });
    const [Data, setData] = useState([])
    const [sort, setsort] = useState("")
    const [page, setpage] = useState(1)
    const [totalcount, settotalcount] = useState(0)
    const [filter, setfilter] = useState("");



    const postData=(age,address,department,salary,marital,image)=>{
        axios({
          url: "http://localhost:8080/form",
          method:"POST",
          data:{
              age,
              address,
              department,
              salary,
              marital,
              image,
          }
        });
    }  
    const getData=()=>{
        if(sort==="")
        {
          axios({
            url: "http://localhost:8080/form",
            params:{
              q:filter,
              _page:page,
              _limit:5
            },
            method: "GET",
          }).then((res) => {
            setData(res.data);
            settotalcount(Number(res.headers["x-total-count"]));
          });
        }
        else{
          axios({
            url: `http://localhost:8080/form?q=${filter}&_sort=salary`,
            params: {
              _order: sort,
              _page: page,
              _limit: 5,
            },
            method: "GET",
          }).then((res) => setData(res.data));
        }
        
    }
    useEffect(() => {
      getData();
    }, [sort,page,filter])
    
  
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setform({...form,[name]:value});
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        postData(form.age,form.address,form.department,form.salary,form.marital,form.image)
        setData([...Data,form]);
    }
      const Ondelete = (id) => {
        fetch(`http://localhost:8080/form/${id}`, {
          method: "DELETE",
        });
        setData(Data.filter((todo) => todo.id !== id));
      };

  return (
    <div className="div">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="age">age:</label>
        <input type="number" name="age" id="age" onChange={handleChange} />
        <label htmlFor="address">address:</label>
        <input
          type="text"
          name="address"
          id="address"
          onChange={handleChange}
        />
        <label htmlFor="department">department:</label>
        <select
          name="department"
          id="department"
          onChange={handleChange}
          onClick={handleChange}
        >
          <option value="it">it</option>
          <option value="management">management</option>
          <option value="production">production</option>
          <option value="sales">sales</option>
        </select>
        <label htmlFor="salary">salary:</label>
        <input type="text" name="salary" id="salary" onChange={handleChange} />
        <div>
          <input
            type="radio"
            id="html"
            name="marital"
            value="married"
            onChange={handleChange}
          />
           <label htmlFor="html">Married</label> {" "}
          <input
            type="radio"
            id="css"
            name="marital"
            value="single"
            onChange={handleChange}
          />
           <label htmlFor="css">Single</label>
        </div>
        <label htmlFor="image">url:</label>
        <input type="text" name="image" id="image" onChange={handleChange} />
        <button type="submit">submit</button>
      </form>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th>age</th>
              <th>address</th>
              <th>department</th>
              <th>salary</th>
              <th>marital</th>
              <th>image</th>
              <th>delete</th>
            </tr>
          </thead>

          {Data.map((el) => (
            <tbody key={el.id}>
              <tr>
                <td>{el.age}</td>
                <td>{el.address}</td>
                <td>{el.department}</td>
                <td>{el.salary}</td>
                <td>{el.marital}</td>
                <td>
                  <img className="image" src={el.image} alt="" />
                </td>
                <td>
                  <button onClick={() => Ondelete(el.id)}>delete</button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </div>
      <div>
        <label htmlFor="order">sort by:</label>
        <select
          name="order"
          id="order"
          onChange={(e) => {
            setsort(e.target.value);
          }}
        >
          <option value="">none</option>
          <option value="ASC">asc</option>
          <option value="DESC">desc</option>
        </select>
      </div>
      <div>
        <button
          disabled={page <= 1}
          onClick={() => {
            setpage(page - 1);
          }}
        >
          prev
        </button>
        <button
          disabled={totalcount <= page * 5}
          onClick={() => {
            setpage(page + 1);
          }}
        >
          next
        </button>
      </div>
      <div>
        <label htmlFor="filter">filter by:</label>
        <select name="filter" id="filter" onChange={(e)=>{setfilter(e.target.value)}}>
          <option value="">none</option>
          <option value="it">it</option>
          <option value="management">management</option>
          <option value="sales">sales</option>
          <option value="production">production</option>
        </select>
      </div>
    </div>
  );
}
