import React, {useState} from "react"
import wordList from "./../word-list.js";
import Prompt from "./Prompt.jsx";
import correct from "./../correct.wav"
import Incorrect from "./../Incorrect.wav"

let dictionary = wordList;

function App() {

  const [randomWord, setRandomWord] = useState(randomWordGenerator());
  const [userResponse, setUserResponse] = useState("");
  const [result, setResult] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState(true);

  var audioCorrect = new Audio(correct);
  var audioIncorrect = new Audio(Incorrect);

  function randomWordGenerator() {
    var index = Math.floor(Math.random() * dictionary.length);
    return (dictionary[index]);
  }

  function handleChange(event) {
    const {value} = event.target;
    setUserResponse(value);
  }

  function handleSubmit(event) {

    setIsSubmitted(true);
    event.preventDefault();
    var parsedResponse = userResponse.replace(/[^a-zA-Z ]/g, "").toLowerCase();
    dictionary = dictionary.filter(obj => {
      return obj.word !== randomWord.word;
    })

    if (randomWord.translations.includes(parsedResponse)) {
      setResult("Correct");
      setScore(score => score += 1)
      audioCorrect.play();

    } else {
      setResult("Incorrect");
      audioIncorrect.play();
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && event.target.name === "response" && !isSubmitted) {
      handleSubmit(event);
    } else if (event.key === "Enter" && isSubmitted) {
      nextWord(event);
    }
  }

  function nextWord(event) {
    event.preventDefault();
    if (dictionary.length > 0) {
      setIsSubmitted(false);
      setResult("");
      setUserResponse("");
      setRandomWord(randomWordGenerator());
    } else {
      setGameState(false);
    }
  }

  function reset(event) {
    dictionary = wordList;
    setGameState(true);
    setIsSubmitted(false);
    setResult("");
    setScore(0);
    setUserResponse("");
    setRandomWord(randomWordGenerator());
  }

  return (<div className="container">
    <div className="App">

      <div class="progress">
        <div class="progress-bar" role="progressbar" style={{
            width: 100 - dictionary.length + "%"
          }} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
      </div>

      <h1>Translate this word</h1>

      <Prompt randomWord={randomWord}/>
      <form>
        <textarea className={"form-control"} style={{
            backgroundColor: "#f7f7f7"
          }} name="response" rows="5" onChange={handleChange} onKeyDown={handleKeyDown} value={userResponse}/>
        <div className="button-box">
          <div className="score">
            <p>Score: {score}
              / {100 - dictionary.length}</p>
          </div>
          {
            isSubmitted
              ? <button name="continue" className={"btn btn-primary"} onClick={nextWord}>Continue</button>
              : <button className={"btn btn-primary"} onClick={handleSubmit}>Submit</button>
          }
        </div>
      </form>
      {
        isSubmitted && <div>
            <div className={result === "Correct"
                ? "alert alert-success"
                : "alert alert-danger"} role="alert">
              <p className={result}>{result}</p>
              <p>Solution: {randomWord.translations.join(", ")}</p>
            </div>
          </div>
      }
      {
        !gameState && <div style={{
              textAlign: "center"
            }} className="final-score">
            <p>Final Score: {score}
              / {100 - dictionary.length}</p>
            <button className="btn btn-info" onClick={reset}>Try Again?</button>
          </div>
      }

    </div>
  </div>);
}

export default App;
