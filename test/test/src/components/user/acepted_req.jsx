import { useEffect,useState } from "react"
import axios from "axios"

export const Acceptedreq=()=>{
    const id=localStorage.getItem("Id")
    const [request,setrequests]=useState([])
    useEffect(()=>{
  function abc(){
       axios.get(`http://localhost:3000/Profile/Accepted-list/${id}`).then((res)=>{
        let arr = Object.values(res.data.data);
       setrequests(arr)
       alert("requests fetched succefully")
       }).catch(err=> alert("cat get the requests"))
   }
   abc()
    },[])

  return (
  <>
    {request.map((r) => (
      <div key={r._id}>
        <p>Mess Name: {r.messName}</p>
        <button onClick={() => console.log("Pay clicked for", r._id)}>
          Pay to get started
        </button>
      </div>
    ))}
  </>
);

}