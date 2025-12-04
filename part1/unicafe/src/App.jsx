import { useState } from "react";

const Feedback = () => <h2>Give Feedback</h2>;

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Stats = ({ good, neutral, bad }) => {
  const sum = good + neutral + bad;
  const average = sum === 0 ? 0 : (good - bad) / sum;
  const positive = sum === 0 ? 0 : (good / sum) * 100;
  if (sum === 0) {
    return (
      <div>
        <h2>Statistics</h2>
        <p>No feedback given</p>
      </div>
    );
  } else {
    return (
      <div>
        <h2>Statistics</h2>
        <table>
          <tbody>
            <StatLine text="Good" value={good} />
            <StatLine text="Neutral" value={neutral} />
            <StatLine text="Bad" value={bad} />
            <StatLine text="All" value={sum} />
            <StatLine text="Average" value={average} />
            <StatLine text="Positive" value={positive} />
          </tbody>
        </table>
      </div>
    );
  }
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  //const scores = { good, neutral, bad };

  return (
    <div>
      <Feedback />
      <Button onClick={() => setGood(good + 1)} text="Good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button onClick={() => setBad(bad + 1)} text="Bad" />
      <Stats good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
