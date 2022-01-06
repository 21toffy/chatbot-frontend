import { useState, useEffect } from 'react'
import './App.css';
import axios from 'axios'
import { BASEURL } from './helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
const [messages, setmessages] = useState([])
const [currentStage, setCurrentStage] = useState('')
const [answerText, setAnswerText] = useState('')
const [stage, setstage] = useState(1)



  useEffect(() => {
    axios.get(`${BASEURL}/stage/${stage}/`).then((response) => {
      let msg = messages;
      msg.push(response.data)
      setmessages(msg)
      console.log(messages) 
    })
    .catch(err=>{
      console.log(err)
    })
  }, [])

  

  const endFunction = () =>{
    toast.success('Thank you, This chat session would be refreshed', {
      position: "top-center",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }



  const emptybox = () =>{
    toast.error('please type something in the message box', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }


  const createPost = () => {
    if(answerText==""){
      emptybox()
    }else{

      axios
      .post(`${BASEURL}/stage/${stage}/`, {
        stage: stage,
        answer_text: answerText,
        from:'user'
      })
      .then((response) => {
        let msg = messages
        msg.push(
          {
            stage: stage,
            answer_text: answerText,
            from:'user'
          }
          )
          msg.push(response.data)
          setmessages(msg)
          setstage(response.data.next_stage)
          console.log(messages)
          setAnswerText('')
        console.log(response.data.next_stage)
        if(response.data.next_stage=="00"){
          endFunction()
          setTimeout(() => {
            window.location.reload();
          }, 7000);    
        }
      })
      .catch(error =>{
        let msg = messages
        msg.push(error.response.data)
        setmessages(msg)
        console.log(messages)
      }
      
      )
    }
    }
    
    
const handleChange =(e)=>{
  setAnswerText(e.target.value)
}

  return (
    <div className="App">
      <ToastContainer
position="top-center"
autoClose={5000}
hideProgressBar
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
/>
<div className="container d-flex justify-content-center">
  <div className="card mt-5">
    <div className="d-flex flex-row justify-content-between p-3 adiv text-white"> <i className="fas fa-chevron-left" /> <span className="pb-3">Live chat</span> <i className="fas fa-times" /> </div>

   
    <div className="d-flex flex-row p-3"> <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width={30} height={30} />
      <div className="chat ml-2 p-3">{
        messages ?
        messages[0]?.question_text
        :
        null
      }</div>
    </div>

    {
 messages?.length >0 ?

 (

  messages.map(mess=>{
   return (

    
     mess?.from=='bot' ?
    // compmessagesuter 
    <div className="d-flex flex-row p-3" key={mess.question_text}> <img src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png" width={30} height={30} />
      <div className="chat ml-2 p-3">{mess?.question_text}</div>
    </div>

:

    <div className="d-flex flex-row p-3" key={mess.question_text}>
      <div className="bg-white mr-2 p-3"><span className="text-muted">{mess?.answer_text}</span></div> <img src="https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png" width={30} height={30} />
    </div>
   )
  })
 ):
 null

}

   
    <div className="form-group px-3"> 
      <textarea name='answertext' value={answerText} onChange={(e)=>handleChange(e)} className="form-control mt-3" rows={5} placeholder="Type your message" />
    <button className="btn btn-primary text-center btn-block mt-4" onClick={createPost} >
      send
    </button>
    </div>
  </div>
</div>

    </div>
  );
}

export default App;
