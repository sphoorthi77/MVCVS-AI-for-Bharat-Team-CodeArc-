import {useState} from "react"

import api from "../api"

export default function Assistant(){

const [input,setInput] = useState("")
const [response,setResponse] = useState("")
const [quiz,setQuiz] = useState("")

const speak = (text)=>{

const speech = new SpeechSynthesisUtterance(text)

speech.lang="en-US"

window.speechSynthesis.speak(speech)

}

const startListening = ()=>{

const recognition = new window.webkitSpeechRecognition()

recognition.lang="en-US"

recognition.continuous=false

recognition.interimResults=false

recognition.onresult = async(event)=>{

const text = event.results[0][0].transcript

setInput(text)

const explain = await api.post("/ai/explain",{

text:text,
domain:"general"

})

setResponse(explain.data.explanation)

speak(explain.data.explanation)

const quizRes = await api.post("/ai/quiz",{

explanation:explain.data.explanation

})

setQuiz(quizRes.data.quiz)

}

recognition.start()

}

return(

<div style={{padding:"40px"}}>

<h2>Voice Assistant</h2>

<button onClick={startListening}>

🎤 Speak

</button>

<br/><br/>

<input

value={input}

onChange={(e)=>setInput(e.target.value)}

placeholder="Type here"

style={{width:"300px"}}

/>

<br/><br/>

<button onClick={async()=>{

const explain = await api.post("/ai/explain",{

text:input,
domain:"general"

})

setResponse(explain.data.explanation)

speak(explain.data.explanation)

}}>

Submit

</button>

<h3>Explanation</h3>

<p>{response}</p>

<h3>Quiz</h3>

<pre>{quiz}</pre>

</div>

)

}